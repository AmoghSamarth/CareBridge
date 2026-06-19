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
    const { userId, triggerType, userProfile, userMessage } = req.body;

    if (!userId || !triggerType) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing userId or triggerType in request body.' }
      });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Defaults
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

    // Use userProfile from client if provided
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

    // Supplement with Firestore
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
      } catch {}
    }

    // Build salon context — filter by budget and sort by rating
    const budgetMax = parseInt((budgetRange || '300').split('-')[1] || budgetRange, 10) || 500;
    const relevantPros = salonsData
      .filter(p => {
        if (!p.price_range) return true;
        const min = parseInt(p.price_range.split('-')[0], 10) || 0;
        return min <= budgetMax;
      })
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 4);

    const availablePros = salonsData.filter(p => p.is_available !== false);

    const salonContext = relevantPros.map(p =>
      `• ${p.name} (${p.area}) — ${p.services?.join(', ') || 'grooming'} — ₹${p.price_range} — ${p.rating}★ — ${p.is_available !== false ? 'Available today' : 'Offline'}`
    ).join('\n');

    const availableContext = availablePros.map(p =>
      `• ${p.name} (${p.area}) — ${p.services?.join(', ') || 'grooming'} — ₹${p.price_range}`
    ).join('\n');

    // Hairstyle suggestions by hair type + event
    const hairstyleMap = {
      'Straight': {
        'Interview': ['sleek side part', 'clean executive cut', 'textured quiff'],
        'Wedding': ['slicked back', 'classic side part', 'low fade with texture'],
        'default': ['textured crop', 'sleek side sweep', 'clean undercut'],
      },
      'Wavy': {
        'Interview': ['tamed waves with matte pomade', 'structured side part', 'defined crop'],
        'Wedding': ['beachy waves with light hold', 'French crop', 'messy quiff'],
        'default': ['natural waves enhanced', 'curtain hair', 'tousled crop'],
      },
      'Curly': {
        'Interview': ['defined curls with light hold cream', 'tapered sides with curl top', 'neat afro'],
        'Wedding': ['shaped afro', 'twist out', 'curl defined with shea'],
        'default': ['wash and go curls', 'defined spiral', 'pineapple updo'],
      },
      'Coily': {
        'Interview': ['groomed afro', 'coil defined', 'low fade with coils on top'],
        'Wedding': ['crowned afro', 'shaped coils', 'TWA with edge-up'],
        'default': ['moisturized coils', 'strand twist', 'puff'],
      },
    };
    const hairstyles = (hairstyleMap[hairType] || hairstyleMap['Wavy']);
    const suggestedStyles = hairstyles[eventType] || hairstyles['default'];

    const prompt = `You are Wingman — CareBridge's AI grooming companion for Indian users in Tier-2 cities. Talk like a sharp, warm, direct friend. Always specific — reference name, event, budget, hair type. Never say "based on your profile" or "as your AI assistant". Keep every message under 4 sentences. Sound confident, warm, slightly informal.

${userMessage ? `${name} just said: "${userMessage}"` : ''}

USER PROFILE:
Name: ${name}
Hair type: ${hairType}
Budget: ₹${budgetRange}
Groom frequency: ${groomFrequency}
Priority: ${priority}
Upcoming event: ${eventType} on ${eventDate}
Last service: ${lastService} on ${lastBookingDate}

TOP NAGPUR PROFESSIONALS WITHIN BUDGET:
${salonContext}

ALL PROFESSIONALS AVAILABLE TODAY:
${availableContext}

HAIRSTYLE SUGGESTIONS FOR ${hairType.toUpperCase()} HAIR + ${eventType.toUpperCase()}:
${suggestedStyles.join(', ')}

TRIGGER: ${triggerType}

You're having an ongoing conversation with ${name}. Respond naturally to whatever they just said or asked — like a real friend who happens to know grooming and the local Nagpur scene well. Use the professional and hairstyle data above only when it's genuinely relevant to what they asked. Don't force a recommendation or booking pitch into every reply — sometimes just answer the question, share an opinion, or ask something back. Let the conversation breathe.`;
    if (process.env.GOOGLE_API_KEY) {
      try {
        const stream = await geminiModel.generateContentStream(prompt);
        for await (const chunk of stream.stream) {
          const text = chunk.text();
          if (text) {
            res.write(`data: ${JSON.stringify({ text, chunk: text })}\n\n`);
          }
        }
      } catch (geminiError) {
    console.error('❌ GEMINI STREAM ERROR:', geminiError.message, geminiError.stack);
    await streamFallbackMock(res, name, eventType, relevantPros[0] || salonsData[0], hairType);
  }
} else {
      await streamFallbackMock(res, name, eventType, relevantPros[0] || salonsData[0], hairType);
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

        if (bookingId && !bookingId.startsWith('local')) {
          try {
            await db.collection('bookings').doc(bookingId).update({
              confidence_score: confidenceScore,
              updated_at: new Date().toISOString()
            });
          } catch {}
        }
      } catch {}
    }

    const stars = confidenceScore;
    const sentiment = stars >= 4 ? 'excellent' : stars >= 3 ? 'good' : 'average';
    let insight = `Your ${stars}-star rating for ${proName} in ${proArea} tells me a lot — I'll prioritise similar pros for your next booking.`;

    if (process.env.GOOGLE_API_KEY) {
      try {
        const prompt = `A CareBridge user just rated their grooming session:
Professional: ${proName} (${proArea})
Service: ${service || 'grooming session'}
Star rating: ${stars}/5 (${sentiment} experience)

Generate a short, warm 1-sentence Wingman insight about what this rating tells us and how it will improve their future recommendations. Be specific about the professional and service. Sound like a friend, not a bot. Never start with "Based on" or "I". Max 30 words.`;

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
  const mockText = `Hey ${name}! With your ${eventType} coming up, this is the perfect time to freshen up. For your ${hairType} hair, I'd recommend ${pro?.name || 'Ravi Sharma'} in ${pro?.area || 'Dharampeth'} — ${pro?.rating || 4.9}★ rated and within your budget. Want me to lock in a slot for you?`;
  const words = mockText.split(' ');
  for (const word of words) {
    const chunkVal = word + ' ';
    res.write(`data: ${JSON.stringify({ text: chunkVal, chunk: chunkVal })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 55));
  }
}

export default router;
