import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLandingUrl } from '../lib/urls';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem('carebridge_role');
    const role = storedRole || (window.location.pathname === '/pro-dashboard' ? 'professional' : 'customer');
    const demoUser = {
      uid: 'demo-user-' + (role === 'professional' ? 'pro' : 'customer'),
      displayName: role === 'professional' ? 'Priya (Professional)' : 'Arjun',
      email: 'demo@carebridge.app',
      photoURL: null,
    };

    const onboardingComplete = localStorage.getItem(`carebridge_onboarding_${demoUser.uid}`) === 'true';

    setUser(demoUser);
    setUserDoc({
      onboarding_complete: onboardingComplete,
      role,
    });
    setLoading(false);
  }, []);

  const logout = () => {
    setLoading(true);
    localStorage.removeItem('carebridge_role');
    setUser(null);
    setUserDoc(null);
    setLoading(false);
    window.location.href = getLandingUrl();
  };

  const markOnboardingComplete = () => {
    if (!user) return;
    localStorage.setItem(`carebridge_onboarding_${user.uid}`, 'true');
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
    isMock: true
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
