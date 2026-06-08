import express from 'express';
import admin from '../lib/firebase-admin.js';

const router = express.Router();

/** Exchange a Firebase ID token (from landing) for a custom token (for client sign-in). */
router.post('/handoff', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      success: false,
      error: { message: 'idToken is required' },
    });
  }

  if (!admin) {
    return res.status(503).json({
      success: false,
      error: { message: 'Auth service unavailable' },
    });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const customToken = await admin.auth().createCustomToken(decoded.uid);
    res.json({ success: true, customToken });
  } catch (error) {
    console.error('Auth handoff error:', error);
    res.status(401).json({
      success: false,
      error: { message: 'Invalid or expired token' },
    });
  }
});

export default router;
