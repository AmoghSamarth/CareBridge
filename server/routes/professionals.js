import express from 'express';
import { db } from '../lib/firebase-admin.js';
import { geminiSummarizer } from '../lib/gemini.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const salonsPath = path.join(__dirname, '../data/salons.json');
const salonsData = JSON.parse(fs.readFileSync(salonsPath, 'utf8'));

// GET /api/professionals
// Get all professionals with optional area & service filters
router.get('/', async (req, res, next) => {
  try {
    const { area, service, available } = req.query;
    let pros = [];

    // Fetch from Firestore if connected, fall back to local salons.json
    if (db) {
      try {
        const snapshot = await db.collection('professionals').get();
        if (!snapshot.empty) {
          pros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else {
          pros = salonsData;
        }
      } catch (dbErr) {
        console.warn('⚠️ Firestore read failed, using salons.json fallback:', dbErr.message);
        pros = salonsData;
      }
    } else {
      pros = salonsData;
    }

    // Apply optional filters
    if (area) {
      pros = pros.filter(p => p.area && p.area.toLowerCase().includes(area.toLowerCase()));
    }
    if (service) {
      pros = pros.filter(p => p.services && p.services.some(s => s.toLowerCase().includes(service.toLowerCase())));
    }
    if (available === 'true') {
      pros = pros.filter(p => p.is_available !== false);
    }

    // Sort by featured first, then rating
    pros.sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });

    res.json({ success: true, data: pros, count: pros.length });
  } catch (error) {
    next(error);
  }
});

// GET /api/professionals/:id
// Get a single professional by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let pro = null;

    if (db) {
      try {
        const doc = await db.collection('professionals').doc(id).get();
        if (doc.exists) {
          pro = { id: doc.id, ...doc.data() };
        }
      } catch (dbErr) {
        console.warn('⚠️ Firestore read failed:', dbErr.message);
      }
    }

    // Fallback to local data if not found in Firestore
    if (!pro) {
      pro = salonsData.find(p => p.id === id) || null;
    }

    if (!pro) {
      return res.status(404).json({ success: false, error: { message: 'Professional not found.' } });
    }

    res.json({ success: true, data: pro });
  } catch (error) {
    next(error);
  }
});

// POST /api/professionals/:id/summarize
// AI summary of reviews for a professional (Gemini powered)
router.post('/:id/summarize', async (req, res, next) => {
  try {
    const { id } = req.params;
    let pro = null;
    let reviews = [];

    // Fetch professional details
    if (db) {
      try {
        const doc = await db.collection('professionals').doc(id).get();
        if (doc.exists) {
          pro = { id: doc.id, ...doc.data() };
          // Attempt to fetch reviews from subcollection
          const reviewsSnapshot = await db.collection('professionals').doc(id).collection('reviews').get();
          if (!reviewsSnapshot.empty) {
            reviews = reviewsSnapshot.docs.map(d => d.data().text || d.data().comment);
          }
        }
      } catch (dbErr) {
        console.warn('⚠️ Firestore read failed in summarize:', dbErr.message);
      }
    }

    if (!pro) {
      pro = salonsData.find(p => p.id === id);
    }

    if (!pro) {
      return res.status(404).json({ success: false, error: { message: 'Professional not found.' } });
    }

    // If we have no reviews from DB, generate realistic mock reviews based on their service profile
    if (reviews.length === 0) {
      const servicesStr = pro.services ? pro.services.join(' and ') : 'grooming';
      reviews = [
        `${pro.name} did an amazing job. The ${servicesStr} service was top-notch and professional.`,
        `Extremely clean setup brought to my home in ${pro.area || 'Nagpur'}. Arrived exactly on time!`,
        `Highly skilled and polite. The experience was smooth, and the rating of ${pro.rating || '4.8'} is well-deserved.`
      ];
    }

    let summaryText = pro.ai_summary || 'Highly rated professional with consistently positive client reviews.';

    // Generate dynamic summary with Gemini if API key is present
    if (process.env.GOOGLE_API_KEY) {
      try {
        const prompt = `Summarize these client reviews for professional ${pro.name} who provides ${pro.services?.join(', ')} in ${pro.area}, Nagpur:
Reviews:
${reviews.map((r, i) => `${i+1}. "${r}"`).join('\n')}

Provide a single-sentence or max 2-sentences summary focusing on their strengths, quality of work, and professional vibe.`;
        
        const response = await geminiSummarizer.generateContent(prompt);
        summaryText = response.response.text().trim();
      } catch (geminiErr) {
        console.error('❌ Gemini summarizer failed, falling back to static summary:', geminiErr);
      }
    }

    res.json({
      success: true,
      professional_id: id,
      ai_summary: summaryText
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/professionals
// Create or update a professional profile
router.post('/', async (req, res, next) => {
  try {
    const {
      id,
      name,
      area,
      services,
      price_range,
      experience_years,
      bio,
      image_url,
      created_by,
    } = req.body;

    if (!id || !name || !area || !services || !price_range) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields: id, name, area, services, price_range.' }
      });
    }

    const payload = {
      id,
      name,
      area,
      services: Array.isArray(services) ? services : [services],
      price_range,
      experience_years: parseInt(experience_years, 10) || 1,
      bio: bio || '',
      image_url: image_url || '',
      rating: 4.5,
      review_count: 0,
      is_available: true,
      is_featured: false,
      created_by: created_by || 'demo',
      created_at: new Date().toISOString(),
    };

    if (db) {
      try {
        await db.collection('professionals').doc(id).set(payload, { merge: true });
      } catch (dbErr) {
        console.warn('⚠️ Firestore professional write failed:', dbErr.message);
      }
    }

    res.status(201).json({ success: true, data: payload });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/professionals/:id
// Update professional availability or profile fields
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (db) {
      try {
        await db.collection('professionals').doc(id).update({
          ...updates,
          updated_at: new Date().toISOString()
        });
      } catch (dbErr) {
        console.warn('⚠️ Firestore professional update failed:', dbErr.message);
      }
    }

    res.json({ success: true, message: 'Professional updated.', id });
  } catch (error) {
    next(error);
  }
});

export default router;

