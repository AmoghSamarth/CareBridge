import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

let db = null;
let isInitialized = false;

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT;

if (serviceAccountKey) {
  try {
    const serviceAccount = JSON.parse(serviceAccountKey);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    isInitialized = true;
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Failed to parse FIREBASE_SERVICE_ACCOUNT JSON or private key:', error);
  }
} else {
  console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT environment variable is not defined. Firebase features will run in Mock Mode.');
}

export { db, isInitialized };
export default isInitialized ? admin : null;
