/*
  FIREBASE AUTH DOMAIN FIX:
  If you see "Firebase auth not configured for this domain", follow these steps:
  1. Go to console.firebase.google.com
  2. Select your carebridge project
  3. Left sidebar → Build → Authentication
  4. Click "Settings" tab
  5. Scroll to "Authorized domains"
  6. Click "Add domain"
  7. Add: localhost
  8. If using Vercel: also add your .vercel.app URL
  9. Click Save
  10. Refresh your app and try signing in again
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  auth, db, isFirebaseInitialized,
  signInWithPopup, GoogleAuthProvider,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from '../lib/firebase.js';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getClientUrl } from '../lib/urls.js';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const featureRows = [
  { iconBg: '#F5C842', label: 'Wingman AI predicts your grooming needs' },
  { iconBg: '#2EC4B6', label: 'Book verified professionals in minutes' },
  { iconBg: '#F03E7A', label: 'Home visits across Nagpur — starting today' },
];

export default function AuthPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: role select, 2: sign-in
  const [role, setRole] = useState(null); // 'customer' | 'professional'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    if (!isFirebaseInitialized || !auth || !db) {
      setError('Firebase is not configured. Please check your environment variables.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      let result;
      try {
        // Try to sign in existing user
        result = await signInWithEmailAndPassword(auth, email, password);
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          // Create new user
          result = await createUserWithEmailAndPassword(auth, email, password);
        } else {
          throw err;
        }
      }

      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          role: role || 'customer',
          onboarding_complete: false,
          created_at: serverTimestamp(),
        });
      }

      // Redirect to client app
      window.location.href = getClientUrl();
    } catch (err) {
      console.error('Email sign-in error:', err);
      
      if (err.code === 'auth/wrong-password') {
        setError('Wrong password. Try again.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account with this email. Check spelling or sign up.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Auth domain not configured. Add localhost to Firebase authorized domains.');
      } else {
        setError(err.message || 'Sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseInitialized || !auth || !db) {
      setError('Firebase is not configured. Please check your environment variables.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // New user — create doc
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: role || 'customer',
          onboarding_complete: false,
          created_at: serverTimestamp(),
        });
      }

      // Redirect to client app
      window.location.href = getClientUrl();
    } catch (err) {
      console.error('Sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/configuration-not-found') {
        setError('Firebase auth not configured for this domain.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Auth domain not configured. Add localhost to Firebase authorized domains.');
      } else {
        setError(err.message || 'Sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Enter your email to reset password.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Reset link sent to your email.');
      setError('');
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        setError('No account with this email.');
      } else {
        setError('Failed to send reset link. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const progressDots = [1, 2];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter' }}>

      {/* Left panel — dark */}
      <div style={{
        flex: '0 0 42%',
        background: '#1A1A1A',
        padding: '48px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
        className="hidden md:flex"
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', background: '#9B8FE8',
            border: '2px solid #F5C842', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '16px', color: '#fff' }}>C</span>
          </div>
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '22px', color: '#F5C842' }}>
            CareBridge
          </span>
        </div>

        {/* Mid content */}
        <div>
          <h2 style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
            fontSize: '36px', letterSpacing: '-0.02em',
            color: '#FFFFFF', marginBottom: '12px',
          }}>
            Look great,{' '}
            <span style={{ color: '#F5C842' }}>effortlessly.</span>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '16px', color: '#6B6B6B', marginBottom: '36px', lineHeight: 1.6 }}>
            CareBridge brings top-rated grooming professionals straight to your door in Nagpur.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {featureRows.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '36px', height: '36px', background: f.iconBg,
                  border: '2px solid rgba(255,255,255,0.3)', borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <CheckIcon />
                </div>
                <span style={{ fontFamily: 'Inter', fontSize: '14px', color: '#FFFFFF' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B' }}>
          © 2026 CareBridge · Nagpur, India
        </p>
      </div>

      {/* Right panel — peach */}
      <div style={{
        flex: 1,
        background: '#FAE8D8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '32px' }}>
            {progressDots.map(d => (
              <div key={d} style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: step >= d ? '#F5C842' : '#FFFFFF',
                border: '2px solid #1A1A1A',
                transition: 'background 0.2s',
              }} />
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* Step 1: Role selection */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h1 style={{
                  fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
                  fontSize: '28px', letterSpacing: '-0.02em',
                  color: '#1A1A1A', marginBottom: '6px', textAlign: 'center',
                }}>
                  Who are you?
                </h1>
                <p style={{
                  fontFamily: 'Inter', fontSize: '15px', color: '#6B6B6B',
                  textAlign: 'center', marginBottom: '28px',
                }}>
                  Choose your role to get started with CareBridge
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  {[
                    { value: 'customer', emoji: '✂️', title: 'I need grooming', desc: 'Book professionals, use Wingman AI, get groomed at home' },
                    { value: 'professional', emoji: '💼', title: 'I am a professional', desc: 'List your services, manage bookings, grow your clientele' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setRole(opt.value)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '16px',
                        padding: '18px 20px', textAlign: 'left',
                        background: role === opt.value
                          ? (opt.value === 'customer' ? '#F5C842' : '#2EC4B6')
                          : '#FFFFFF',
                        border: '2.5px solid #1A1A1A',
                        borderRadius: '16px',
                        boxShadow: role === opt.value ? '4px 4px 0 #1A1A1A' : '4px 4px 0 rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        width: '100%',
                      }}
                    >
                      <span style={{ fontSize: '28px', lineHeight: 1 }}>{opt.emoji}</span>
                      <div>
                        <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '15px', color: '#1A1A1A', margin: 0 }}>
                          {opt.title}
                        </p>
                        <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#1A1A1A', opacity: 0.7, margin: 0, marginTop: '2px' }}>
                          {opt.desc}
                        </p>
                      </div>
                      {role === opt.value && (
                        <div style={{ marginLeft: 'auto', width: '22px', height: '22px', borderRadius: '50%', background: '#1A1A1A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: role === 'customer' ? '#F5C842' : '#2EC4B6', fontSize: '13px', fontWeight: 900 }}>✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => { if (role) setStep(2); }}
                  disabled={!role}
                  style={{
                    width: '100%',
                    fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '15px',
                    color: '#FFFFFF',
                    background: role ? '#F03E7A' : '#D0D0D0',
                    border: '2.5px solid #1A1A1A',
                    borderRadius: '12px',
                    boxShadow: role ? '4px 4px 0 #1A1A1A' : 'none',
                    padding: '14px',
                    cursor: role ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (role) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #1A1A1A'; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = role ? '4px 4px 0 #1A1A1A' : 'none'; }}
                >
                  CONTINUE →
                </button>
              </motion.div>
            )}

            {/* Step 2: Sign in */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h1 style={{
                  fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
                  fontSize: '28px', letterSpacing: '-0.02em',
                  color: '#1A1A1A', marginBottom: '6px', textAlign: 'center',
                }}>
                  Sign in to CareBridge
                </h1>
                <p style={{
                  fontFamily: 'Inter', fontSize: '15px', color: '#6B6B6B',
                  textAlign: 'center', marginBottom: '32px',
                }}>
                  Joining as a <strong>{role}</strong>. Takes 10 seconds.
                </p>

                {/* Role badge */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: role === 'customer' ? '#FFF8EC' : '#F0FFFE',
                  border: '2px solid #1A1A1A', borderRadius: '12px',
                  padding: '12px 16px', marginBottom: '24px',
                }}>
                  <span style={{ fontSize: '20px' }}>{role === 'customer' ? '✂️' : '💼'}</span>
                  <div>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '13px', color: '#1A1A1A', margin: 0 }}>
                      {role === 'customer' ? 'Customer Account' : 'Professional Account'}
                    </p>
                    <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', margin: 0 }}>
                      {role === 'customer' ? 'Book professionals & use Wingman AI' : 'Manage bookings & grow your clientele'}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    style={{
                      marginLeft: 'auto', fontFamily: 'Plus Jakarta Sans', fontWeight: 700,
                      fontSize: '11px', color: '#F03E7A', background: 'none',
                      border: 'none', cursor: 'pointer', textDecoration: 'underline',
                    }}
                  >
                    Change
                  </button>
                </div>

                {error && (
                  <div style={{
                    background: '#FFF0F5', border: '2.5px solid #F03E7A',
                    borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
                  }}>
                    <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#F03E7A', margin: 0, fontWeight: 500 }}>{error}</p>
                  </div>
                )}

                {successMessage && (
                  <div style={{
                    background: '#F0FFFE', border: '2.5px solid #2EC4B6',
                    borderRadius: '10px', padding: '12px 16px', marginBottom: '16px',
                  }}>
                    <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#2EC4B6', margin: 0, fontWeight: 500 }}>{successMessage}</p>
                  </div>
                )}

                {/* Email input */}
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    marginBottom: '12px',
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    border: error && email ? '2.5px solid #F03E7A' : '2.5px solid #1A1A1A',
                    borderRadius: '12px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && password && handleEmailSignIn()}
                />

                {/* Password input */}
                <div style={{ position: 'relative', marginBottom: '6px' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      paddingRight: '44px',
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      border: error && password ? '2.5px solid #F03E7A' : '2.5px solid #1A1A1A',
                      borderRadius: '12px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && email && handleEmailSignIn()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#6B6B6B',
                    }}
                  >
                    {showPassword ? '👁' : '👁‍🗨'}
                  </button>
                </div>

                <button
                  onClick={handlePasswordReset}
                  style={{
                    display: 'block',
                    marginBottom: '16px',
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    color: '#6B6B6B',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Forgot password?
                </button>

                {/* Email sign-in button */}
                <button
                  onClick={handleEmailSignIn}
                  disabled={loading || !email || !password}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                    fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '15px', color: '#1A1A1A',
                    background: '#F5C842',
                    border: '2.5px solid #1A1A1A',
                    borderRadius: '12px',
                    boxShadow: '4px 4px 0 #1A1A1A',
                    padding: '14px',
                    cursor: loading ? 'wait' : 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    marginBottom: '6px',
                    opacity: (loading || !email || !password) ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { if (!loading && email && password) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #1A1A1A'; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 #1A1A1A'; }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', gap: '4px' }}>
                      {[0, 1, 2].map(i => (
                        <motion.span key={i}
                          style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1A1A1A', display: 'block' }}
                          animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                        />
                      ))}
                    </span>
                  ) : (
                    'SIGN IN WITH EMAIL'
                  )}
                </button>

                <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', textAlign: 'center', margin: '12px 0' }}>
                  New user? Password will be created automatically on first sign in.
                </p>

                {/* Divider */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  margin: '20px 0',
                }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(26,26,26,0.2)' }} />
                  <span style={{ fontFamily: 'Inter', fontSize: '14px', color: '#6B6B6B' }}>OR</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(26,26,26,0.2)' }} />
                </div>

                {/* Google button */}
                <button
                  id="google-signin-btn"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  style={{
                    width: '100%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                    fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '15px', color: '#1A1A1A',
                    background: '#FFFFFF',
                    border: '2.5px solid #1A1A1A',
                    borderRadius: '12px',
                    boxShadow: '4px 4px 0 #1A1A1A',
                    padding: '14px',
                    cursor: loading ? 'wait' : 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    marginBottom: '16px',
                  }}
                  onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #1A1A1A'; } }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 #1A1A1A'; }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', gap: '4px' }}>
                      {[0, 1, 2].map(i => (
                        <motion.span key={i}
                          style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#1A1A1A', display: 'block' }}
                          animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                        />
                      ))}
                    </span>
                  ) : (
                    <>
                      <GoogleIcon />
                      CONTINUE WITH GOOGLE
                    </>
                  )}
                </button>

                <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', textAlign: 'center', lineHeight: 1.5 }}>
                  By continuing, you agree to CareBridge's Terms of Service and Privacy Policy.
                </p>

                <button
                  onClick={() => setStep(1)}
                  style={{
                    display: 'block', margin: '20px auto 0',
                    fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '13px',
                    color: '#6B6B6B', background: 'none', border: 'none',
                    cursor: 'pointer', textDecoration: 'underline',
                  }}
                >
                  ← Back to role selection
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
