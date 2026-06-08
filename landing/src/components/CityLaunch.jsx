import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, isFirebaseInitialized } from '../lib/firebase.js';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

export default function CityLaunch() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | success | duplicate | error
  const [shake, setShake] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    if (!isFirebaseInitialized || !db) {
      setState('error');
      return;
    }
    setState('loading');
    try {
      const q = query(collection(db, 'waitlist'), where('email', '==', email.toLowerCase()));
      const snap = await getDocs(q);
      if (!snap.empty) { setState('duplicate'); return; }
      await addDoc(collection(db, 'waitlist'), {
        email: email.toLowerCase(),
        city: 'Nagpur',
        created_at: serverTimestamp(),
      });
      setState('success');
    } catch (err) {
      setState('error');
    }
  };

  return (
    <section style={{ background: '#9B8FE8', borderTop: '2px solid #1A1A1A', padding: '80px 40px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>

        {/* City pill */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '13px',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            background: '#FFFFFF', color: '#1A1A1A',
            border: '2px solid #1A1A1A', borderRadius: '999px',
            padding: '6px 16px',
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%', background: '#1A1A1A',
              display: 'inline-block',
            }} />
            LAUNCHING IN NAGPUR
          </span>
        </div>

        <h2 style={{
          fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
          fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.02em',
          color: '#FFFFFF', margin: '0 0 12px',
        }}>
          Be first in your city.
        </h2>
        <p style={{
          fontFamily: 'Inter', fontSize: '18px', color: '#1A1A1A',
          lineHeight: 1.6, marginBottom: '36px',
        }}>
          Join the waitlist and get early access + 3 months of Wingman Pro free when we launch.
        </p>

        <AnimatePresence mode="wait">
          {state === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: '#FFFFFF', border: '2.5px solid #1A1A1A',
                borderRadius: '16px', boxShadow: '5px 5px 0 #1A1A1A',
                padding: '24px 32px',
              }}
            >
              <span style={{ fontSize: '32px' }}>🎉</span>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '18px', color: '#1A1A1A', marginTop: '8px' }}>
                You're on the list!
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#6B6B6B', opacity: 0.8 }}>
                We'll email you as soon as CareBridge launches in Nagpur.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', maxWidth: '500px', margin: '0 auto' }}
            >
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  flex: 1,
                  fontFamily: 'Inter', fontSize: '15px', color: '#1A1A1A',
                  background: '#FFFFFF',
                  border: '2.5px solid #1A1A1A',
                  borderRight: 'none',
                  borderRadius: '12px 0 0 12px',
                  padding: '14px 18px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={state === 'loading'}
                style={{
                  fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '14px',
                  color: '#1A1A1A', background: '#F5C842',
                  border: '2.5px solid #1A1A1A',
                  borderRadius: '0 12px 12px 0',
                  boxShadow: '4px 4px 0 #1A1A1A',
                  padding: '14px 24px',
                  cursor: state === 'loading' ? 'wait' : 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => {
                  if (state !== 'loading') {
                    e.currentTarget.style.transform = 'translate(-2px,-2px)';
                    e.currentTarget.style.boxShadow = '6px 6px 0 #1A1A1A';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '4px 4px 0 #1A1A1A';
                }}
              >
                {state === 'loading' ? '...' : 'JOIN WAITLIST'}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {state === 'duplicate' && (
          <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#F5C842', marginTop: '12px' }}>
            You're already on the waitlist! 🎉
          </p>
        )}
        {state === 'error' && (
          <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#F5C842', marginTop: '12px' }}>
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  );
}
