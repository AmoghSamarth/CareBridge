import express from 'express';
import { db } from '../lib/firebase-admin.js';
import { geminiModel } from '../lib/gemini.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const salonsPath = path.join(__dirname, '../data/salons.json');
const salonsData = JSON.parse(fs.readFileSync(salonsPath, 'utf8'));

// POST /api/wingman/message
// Trigger a new Wingman message generation (streaming using Gemini)
router.post('/message', async (req, res, next) => {
  try {
    const { userId, triggerType } = req.body;
    
    if (!userId || !triggerType) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing userId or triggerType in request body.' }
      });
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // 1. Fetch user profile + upcoming events + last booking from Firestore (with fallbacks)
    let name = 'Arjun';
    let hairType = 'Wavy';
    let budgetRange = '200-350';
    let groomFrequency = 'Monthly';
    let priority = 'Looking Fresh';
    
    let eventType = 'Placement Interview';
    let eventDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
    
    let lastService = 'Haircut & Beard Trim';
    let lastBookingDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    // Pick a default pro near Dharampeth
    let bestPro = salonsData[0]; // Ravi Sharma

    if (db) {
      try {
        // Fetch user profile from 'users'
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const uData = userDoc.data();
          name = uData.displayName?.split(' ')[0] || uData.name?.split(' ')[0] || name;
          hairType = uData.hairType || hairType;
          budgetRange = uData.budgetRange || budgetRange;
          groomFrequency = uData.groomFrequency || groomFrequency;
          priority = uData.priority || priority;
        }

        // Fetch upcoming event from 'events'
        const eventsSnapshot = await db.collection('events')
          .where('userId', '==', userId)
          .orderBy('event_date', 'asc')
          .limit(1)
          .get();
        if (!eventsSnapshot.empty) {
          const eData = eventsSnapshot.docs[0].data();
          eventType = eData.event_type || eData.eventType || eventType;
          eventDate = eData.event_date || eData.eventDate || eventDate;
        }

        // Fetch last booking from 'bookings'
        const bookingsSnapshot = await db.collection('bookings')
          .where('userId', '==', userId)
          .orderBy('bookingDate', 'desc')
          .limit(1)
          .get();
        if (!bookingsSnapshot.empty) {
          const bData = bookingsSnapshot.docs[0].data();
          lastService = bData.service || lastService;
          if (bData.bookingDate) {
            lastBookingDate = new Date(bData.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
          }
        }

        // Fetch professionals from database to find best match
        const prosSnapshot = await db.collection('professionals')
          .orderBy('rating', 'desc')
          .limit(3)
          .get();
        if (!prosSnapshot.empty) {
          const dbPros = prosSnapshot.docs.map(doc => doc.data());
          // Match by service/budget/area if possible, otherwise pick top rated
          bestPro = dbPros[0];
        }
      } catch (firestoreErr) {
        console.warn('⚠️ Firestore fetch failed, using fallback data:', firestoreErr.message);
      }
    }

    // 2. Build the prompt dynamically
    const prompt = `Generate a Wingman message for this user:
Name: ${name}
Hair type: ${hairType}
Budget: ${budgetRange}
Groom frequency: ${groomFrequency}
Priority: ${priority}
Upcoming event: ${eventType} on ${eventDate}
Last booking: ${lastService} on ${lastBookingDate}
Best available professional near them: ${bestPro.name}, ${bestPro.services ? bestPro.services.join(', ') : 'grooming'}, ${bestPro.rating} stars, ${bestPro.area}
Trigger: ${triggerType}

triggerType meanings:
- onboarding_complete: welcome them, acknowledge their event, give one specific recommendation
- event_nudge: remind them their event is coming, suggest booking
- post_booking: congratulate, ask how it went
- recommendation_request: suggest the best professional for their current need
- check_in: casual check, ask if they need anything`;

    // 3. Stream Gemini's response (or fallback mock text if no API key is set)
    if (process.env.GOOGLE_API_KEY) {
      try {
        const stream = await geminiModel.generateContentStream(prompt);
        for await (const chunk of stream.stream) {
          const text = chunk.text();
          if (text) {
            // Send both text and chunk properties to support all client implementations
            res.write(`data: ${JSON.stringify({ text, chunk: text })}\n\n`);
          }
        }
      } catch (geminiErr) {
        console.error('❌ Gemini streaming error:', geminiErr);
        // Fallback live mock streaming if API call fails
        await streamFallbackMock(res, name, eventType, bestPro, hairType);
      }
    } else {
      // API Key missing, stream mock response word by word
      await streamFallbackMock(res, name, eventType, bestPro, hairType);
    }
    
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    next(error);
  }
});

// Helper for live mock text streaming
async function streamFallbackMock(res, name, eventType, pro, hairType) {
  const mockText = `Hey ${name}! Looking fresh is the goal, especially with your ${eventType} coming up. For your ${hairType} hair, I highly recommend checking out ${pro.name} in ${pro.area}—clients love their style. Shall we check their available slots for this week?`;
  const words = mockText.split(' ');
  for (const word of words) {
    const chunkVal = word + ' ';
    res.write(`data: ${JSON.stringify({ text: chunkVal, chunk: chunkVal })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 60));
  }
}

export default router;
