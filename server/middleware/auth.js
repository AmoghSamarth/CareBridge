import admin from '../lib/firebase-admin.js';

export default async function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized: No token provided' }
    });
  }

  const token = authHeader.split('Bearer ')[1];

  // Hackathon friendly fallback for mock testing
  if (process.env.NODE_ENV !== 'production' && token === 'mock-user-uid') {
    req.user = {
      uid: 'mock-user-uid',
      email: 'arjun.nagpur@carebridge.com',
      name: 'Arjun'
    };
    return next();
  }

  try {
    if (!admin) {
      throw new Error('Firebase Admin SDK is not initialized');
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      error: { message: 'Unauthorized: Invalid token' }
    });
  }
}
