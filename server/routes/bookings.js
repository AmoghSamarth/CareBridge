import express from 'express';
import { db } from '../lib/firebase-admin.js';

const router = express.Router();

// GET /api/bookings?userId=xxx
// Get booking history for a user
router.get('/', async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing userId query parameter.' }
      });
    }

    let bookings = [];

    if (db) {
      try {
        const snapshot = await db.collection('bookings')
          .where('userId', '==', userId)
          .orderBy('bookingDate', 'desc')
          .get();
        bookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (dbErr) {
        console.warn('⚠️ Firestore bookings read failed:', dbErr.message);
        // Return empty - client will use localStorage fallback
      }
    }

    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
});

// POST /api/bookings
// Create a new booking
router.post('/', async (req, res, next) => {
  try {
    const {
      userId,
      professionalId,
      professionalName,
      service,
      bookingDate,
      slot,
      area,
      isEmergency = false,
      wingmanRecommended = false,
      notes = ''
    } = req.body;

    if (!userId || !professionalId || !service || !bookingDate || !slot) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required booking fields: userId, professionalId, service, bookingDate, slot.' }
      });
    }

    const bookingPayload = {
      userId,
      professionalId,
      professional_name: professionalName || professionalId,
      service,
      bookingDate: new Date(bookingDate).toISOString(),
      slot,
      area: area || 'Nagpur',
      status: 'confirmed',
      is_emergency: isEmergency,
      wingman_recommended: wingmanRecommended,
      notes,
      confidence_score: 0,
      created_at: new Date().toISOString()
    };

    let bookingId = `local_${Date.now()}`;

    if (db) {
      try {
        const docRef = await db.collection('bookings').add(bookingPayload);
        bookingId = docRef.id;
        console.warn(`✅ Booking saved to Firestore: ${bookingId}`);
      } catch (dbErr) {
        console.warn('⚠️ Firestore booking write failed:', dbErr.message);
        // Still return success - client will persist in localStorage
      }
    }

    res.status(201).json({
      success: true,
      message: 'Booking confirmed!',
      booking: { id: bookingId, ...bookingPayload }
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/bookings/:id
// Update a booking (e.g. mark completed, add confidence score)
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (db) {
      try {
        await db.collection('bookings').doc(id).update({
          ...updates,
          updated_at: new Date().toISOString()
        });
      } catch (dbErr) {
        console.warn('⚠️ Firestore booking update failed:', dbErr.message);
      }
    }

    res.json({ success: true, message: 'Booking updated.', id });
  } catch (error) {
    next(error);
  }
});

export default router;
