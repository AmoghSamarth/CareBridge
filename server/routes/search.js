import express from 'express';
import { db } from '../lib/firebase-admin.js';
import { geminiSearch } from '../lib/gemini.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const salonsPath = path.join(__dirname, '../data/salons.json');
const salonsData = JSON.parse(fs.readFileSync(salonsPath, 'utf8'));

// POST /api/search
// NLP-based professional search powered by Gemini
router.post('/', async (req, res, next) => {
  try {
    const { query } = req.body;
    
    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing query parameter in request body.' }
      });
    }

    let parsed = null;

    // 1. Parse using Gemini if API key is present
    if (process.env.GOOGLE_API_KEY) {
      try {
        const prompt = `Parse this salon search query from an Indian user and return ONLY a JSON object with these fields:
{
  "service_type": string or null,
  "area": string or null, 
  "max_budget": number or null,
  "mood": string or null
}

Query: ${query}`;

        const response = await geminiSearch.generateContent(prompt);
        let rawText = response.response.text().trim();
        
        // Clean up markdown block format: ```json { ... } ```
        if (rawText.startsWith("```")) {
          rawText = rawText.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
        }
        
        parsed = JSON.parse(rawText);
        console.warn('🔮 Gemini Search parsed query:', parsed);
      } catch (geminiErr) {
        console.error('❌ Gemini search parser failed, using fallback parsing:', geminiErr);
        parsed = fallbackParse(query);
      }
    } else {
      // Offline fallback parsing
      parsed = fallbackParse(query);
      console.warn('🔌 Offline parser matched query:', parsed);
    }

    // 2. Fetch professionals list (from Firestore if connected, otherwise local salons.json fallback)
    let pros = [];
    if (db) {
      try {
        const snapshot = await db.collection('professionals').get();
        if (!snapshot.empty) {
          pros = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else {
          pros = salonsData;
        }
      } catch (dbErr) {
        console.warn('⚠️ Firestore professionals collection empty or failed, using salons.json:', dbErr.message);
        pros = salonsData;
      }
    } else {
      pros = salonsData;
    }

    // 3. Filter professionals list using extracted fields
    let results = [...pros];

    if (parsed.service_type) {
      results = results.filter(pro => 
        pro.services && pro.services.some(s => s.toLowerCase().includes(parsed.service_type.toLowerCase()))
      );
    }

    if (parsed.area) {
      results = results.filter(pro => 
        pro.area && pro.area.toLowerCase().includes(parsed.area.toLowerCase())
      );
    }

    if (parsed.max_budget) {
      results = results.filter(pro => {
        if (!pro.price_range) return true;
        // pro.price_range is string like "200-350" or "800-1500"
        const bounds = pro.price_range.split('-').map(Number);
        const minPrice = bounds[0] || 0;
        return minPrice <= parsed.max_budget;
      });
    }

    // Sort by rating desc
    results.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    res.json({
      success: true,
      results,
      extracted: parsed
    });
  } catch (error) {
    next(error);
  }
});

// Helper for offline query parsing using simple keyword match & regex
function fallbackParse(query) {
  const q = query.toLowerCase();
  let service_type = null;
  let area = null;
  let max_budget = null;
  let mood = null;

  // Simple service keywords
  const services = ['haircut', 'beard', 'facial', 'waxing', 'threading', 'bridal', 'makeup', 'mehendi', 'hair treatment', 'hair spa', 'color'];
  for (const s of services) {
    if (q.includes(s)) {
      service_type = s;
      break;
    }
  }

  // Nagpur Areas
  const areas = ['dharampeth', 'sitabuldi', 'sadar', 'ramdaspeth', 'civil lines', 'manish nagar', 'wardha road', 'pratap nagar', 'laxmi nagar', 'ajni', 'hingna road', 'trimurti nagar', 'ambazari', 'bajaj nagar', 'shankar nagar'];
  for (const a of areas) {
    if (q.includes(a)) {
      area = a.charAt(0).toUpperCase() + a.slice(1);
      break;
    }
  }

  // Budget matching (e.g. "under 300", "below 500")
  const budgetMatch = q.match(/(?:under|below|less than|max|budget|rs\.?|inr)?\s*(\d+)/i);
  if (budgetMatch) {
    max_budget = parseInt(budgetMatch[1], 10);
  }

  // Basic mood matching
  if (q.includes('fresh') || q.includes('groom') || q.includes('look')) {
    mood = 'fresh';
  } else if (q.includes('urgent') || q.includes('emergency')) {
    mood = 'urgent';
  }

  return { service_type, area, max_budget, mood };
}

export default router;
