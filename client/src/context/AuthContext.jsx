import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, isFirebaseInitialized } from '../lib/firebase';
import {
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapFirebaseUser = (firebaseUser) => ({
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName || 'Groomer',
    email: firebaseUser.email,
    photoURL: firebaseUser.photoURL,
    token: 'mock-token-for-now'
  });

  useEffect(() => {
    if (isFirebaseInitialized && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const mapped = mapFirebaseUser(firebaseUser);
          setUser(mapped);
          // Read user document from Firestore
          try {
            const userRef = doc(db, 'users', firebaseUser.uid);
            const snap = await getDoc(userRef);
            if (snap.exists()) {
              setUserDoc(snap.data());
            } else {
              // New user — doc will be created by landing AuthPage
              setUserDoc({ onboarding_complete: false, role: 'customer' });
            }
          } catch {
            setUserDoc({ onboarding_complete: false, role: 'customer' });
          }
        } else {
          setUser(null);
          setUserDoc(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Mock mode: check localStorage
      const savedUser = localStorage.getItem('carebridge_mock_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setUser(parsed);
          // Check mock onboarding state
          const onb = localStorage.getItem(`carebridge_onboarding_${parsed.uid}`);
          setUserDoc({
            onboarding_complete: onb === 'true',
            role: parsed.role || 'customer'
          });
        } catch {
          setUser(null);
          setUserDoc(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const logout = async () => {
    setLoading(true);
    if (isFirebaseInitialized && auth) {
      try {
        await signOut(auth);
        setUser(null);
        setUserDoc(null);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    } else {
      setUser(null);
      setUserDoc(null);
      localStorage.removeItem('carebridge_mock_user');
      setLoading(false);
    }
    // Always redirect to landing on logout
    const landingUrl = import.meta.env.VITE_LANDING_URL || 'http://localhost:5174';
    window.location.href = landingUrl;
  };

  // Called by WingmanContext after onboarding completes
  const markOnboardingComplete = () => {
    setUserDoc(prev => ({ ...prev, onboarding_complete: true }));
  };

  const value = {
    user,
    userDoc,
    loading,
    logout,
    markOnboardingComplete,
    onboardingComplete: userDoc?.onboarding_complete ?? false,
    userRole: userDoc?.role ?? 'customer',
    isMock: !isFirebaseInitialized
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
