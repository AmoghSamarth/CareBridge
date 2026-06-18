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
// Trigger a new Wingman message generation (streaming SSE)
router.post('/message', async (req, res, next) => {
  try {
    const { userId, triggerType, userProfile } = req.body;

    if (!userId || !triggerType) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing userId or triggerType in request body.' }
      });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Defaults from fallback
    let name = 'Arjun';
    let hairType = 'Wavy';
    let budgetRange = '200-350';
    let groomFrequency = 'Monthly';
    let priority = 'Looking Fresh';
    let eventType = 'Placement Interview';
    let eventDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
    let lastService = 'Haircut & Beard Trim';
    let lastBookingDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    let bestPro = salonsData[0];

    // If userProfile is passed in from client, use it directly
    if (userProfile) {
      name = userProfile.name || name;
      hairType = userProfile.hairType || hairType;
      budgetRange = userProfile.budgetRange || budgetRange;
      groomFrequency = userProfile.groomFrequency || groomFrequency;
      priority = userProfile.priority || priority;
      if (userProfile.upcomingEvent?.eventType) eventType = userProfile.upcomingEvent.eventType;
      if (userProfile.upcomingEvent?.eventDate) {
        const d = new Date(userProfile.upcomingEvent.eventDate);
        const daysUntil = Math.ceil((d - Date.now()) / 86400000);
        eventDate = daysUntil > 0
          ? `${d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })} (${daysUntil} day${daysUntil !== 1 ? 's' : ''} away)`
          : d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' });
      }
    }

    // Supplement with Firestore if available and userProfile not complete
    if (db) {
      try {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const uData = userDoc.data();
          if (!userProfile?.name) name = uData.displayName?.split(' ')[0] || uData.name?.split(' ')[0] || name;
          if (!userProfile?.hairType) hairType = uData.hairType || hairType;
          if (!userProfile?.budgetRange) budgetRange = uData.budgetRange || budgetRange;
          if (!userProfile?.groomFrequency) groomFrequency = uData.groomFrequency || groomFrequency;
          if (!userProfile?.priority) priority = uData.priority || priority;
        }

        const eventsSnapshot = await db.collection('events')
          .where('userId', '==', userId).orderBy('event_date', 'asc').limit(1).get();
        if (!eventsSnapshot.empty && !userProfile?.upcomingEvent?.eventType) {
          const eData = eventsSnapshot.docs[0].data();
          eventType = eData.event_type || eData.eventType || eventType;
          eventDate = eData.event_date || eData.eventDate || eventDate;
        }

        const bookingsSnapshot = await db.collection('bookings')
          .where('userId', '==', userId).orderBy('bookingDate', 'desc').limit(1).get();
        if (!bookingsSnapshot.empty) {
          const bData = bookingsSnapshot.docs[0].data();
          lastService = bData.service || lastService;
          if (bData.bookingDate) lastBookingDate = new Date(bData.bookingDate)
            .toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        }

        const prosSnapshot = await db.collection('professionals').orderBy('rating', 'desc').limit(3).get();
        if (!prosSnapshot.empty) bestPro = prosSnapshot.docs[0].data();
      } catch {}
    }

    const prompt = `Generate a Wingman message for this user:
Name: ${name}
Hair type: ${hairType}
Budget: ₹${budgetRange}
Groom frequency: ${groomFrequency}
Priority: ${priority}
Upcoming event: ${eventType} on ${eventDate}
Last booking: ${lastService} on ${lastBookingDate}
Best available professional: ${bestPro.name}, ${bestPro.services ? bestPro.services.join(', ') : 'grooming'}, ${bestPro.rating} stars, ${bestPro.area}
Trigger: ${triggerType}

triggerType meanings:
- onboarding_complete: welcome them warmly, acknowledge their event, give one specific recommendation
- event_nudge: remind them their event is coming, urgently suggest booking
- post_booking: congratulate, ask how it went
- recommendation_request: suggest the best professional for their current need
- check_in: casual check-in, ask if they need anything
- chat: user sent a message, respond conversationally as Wingman`;

    if (process.env.GOOGLE_API_KEY) {
      try {
        const stream = await geminiModel.generateContentStream(prompt);
        for await (const chunk of stream.stream) {
          const text = chunk.text();
          if (text) {
            res.write(`data: ${JSON.stringify({ text, chunk: text })}\n\n`);
          }
        }
      } catch (geminiErr) {
        await streamFallbackMock(res, name, eventType, bestPro, hairType);
      }
    } else {
      await streamFallbackMock(res, name, eventType, bestPro, hairType);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    next(error);
  }
});

// POST /api/wingman/confidence-learn
// Store confidence rating and generate AI learning insight
router.post('/confidence-learn', async (req, res, next) => {
  try {
    const { userId, bookingId, confidenceScore, professionalId, service } = req.body;

    if (!userId || confidenceScore === undefined) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing userId or confidenceScore.' }
      });
    }

    // Find professional name for better context
    let proName = professionalId || 'your groomer';
    let proArea = 'Nagpur';

    if (db && professionalId) {
      try {
        const proDoc = await db.collection('professionals').doc(professionalId).get();
        if (proDoc.exists) {
          const pd = proDoc.data();
          proName = pd.name || proName;
          proArea = pd.area || proArea;
        }
      } catch {}
    }

    if (!proName || proName === professionalId) {
      const localPro = salonsData.find(p => p.id === professionalId);
      if (localPro) { proName = localPro.name; proArea = localPro.area; }
    }

    // Save confidence score to Firestore
    if (db) {
      try {
        const payload = {
          userId,
          bookingId: bookingId || null,
          professionalId: professionalId || null,
          professional_name: proName,
          service: service || null,
          confidence_score: confidenceScore,
          created_at: new Date().toISOString()
        };
        await db.collection('confidence_logs').add(payload);

        // Also update the booking document if bookingId provided
        if (bookingId && bookingId !== 'local') {
          try {
            await db.collection('bookings').doc(bookingId).update({
              confidence_score: confidenceScore,
              updated_at: new Date().toISOString()
            });
          } catch {}
        }
      } catch {}
    }

    // Generate insight with Gemini
    const stars = confidenceScore;
    const sentiment = stars >= 4 ? 'excellent' : stars >= 3 ? 'good' : 'average';
    let insight = `Based on your ${stars}-star rating after your ${service || 'grooming'} session with ${proName}, I'll prioritise ${proArea} professionals for your next grooming reminder.`;

    if (process.env.GOOGLE_API_KEY) {
      try {
        const prompt = `A CareBridge user just rated their grooming session:
Professional: ${proName} (${proArea})
Service: ${service || 'grooming session'}
Star rating: ${stars}/5 (${sentiment} experience)

Generate a short, warm 1-sentence Wingman insight about what this rating tells us and how it will improve their future recommendations. Be specific about the professional and service. Sound like a friend, not a bot. Never start with "Based on" or "I".`;

        const response = await geminiModel.generateContent(prompt);
        const raw = response.response.text().trim();
        if (raw) insight = raw;
      } catch {}
    }

    res.json({ success: true, insight });
  } catch (error) {
    next(error);
  }
});

// Helper for live mock text streaming
async function streamFallbackMock(res, name, eventType, pro, hairType) {
  const mockText = `Hey ${name}! Looking fresh is the goal, especially with your ${eventType} coming up. For your ${hairType} hair, I highly recommend ${pro.name} in ${pro.area} — clients love their attention to detail. Want me to check their slots for this week?`;
  const words = mockText.split(' ');
  for (const word of words) {
    const chunkVal = word + ' ';
    res.write(`data: ${JSON.stringify({ text: chunkVal, chunk: chunkVal })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 60));
  }
}

export default router;
