import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app;
let auth;
let db;
let isFirebaseInitialized = false;

// Check if variables exist before initializing
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your_firebase_web_api_key_here') {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    isFirebaseInitialized = true;
  } catch (error) {
    console.error('❌ Client Firebase initialization failed:', error);
  }
} else {
  console.warn('⚠️ Firebase environment variables are missing or default. Auth and database will run in Mock Mode on the client.');
}

export { auth, db, isFirebaseInitialized };
