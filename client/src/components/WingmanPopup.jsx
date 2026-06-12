import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Logo from './Logo';

export default function WingmanPopup({ onAskWingman }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileTap={{ scale: 0.92 }}
        style={{
          position: 'fixed', bottom: '84px', right: '20px', zIndex: 60,
          width: '56px', height: '56px', borderRadius: '50%',
          background: '#F5C842', border: '2.5px solid var(--border)',
          boxShadow: '4px 4px 0 var(--shadow)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {open ? <X size={22} color="#1A1A1A" strokeWidth={2.5} /> : <Logo size={28} />}
      </motion.button>

      {/* Popup card */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed', bottom: '150px', right: '20px', zIndex: 60,
              width: 'min(320px, calc(100vw - 40px))',
              background: 'var(--bg-card)', border: '2.5px solid var(--border)',
              boxShadow: '6px 6px 0 var(--shadow)',
            }}
          >
            {/* Header */}
            <div style={{
              background: '#1A1A1A', padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <Logo size={28} />
              <div>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px', color: '#F5C842', letterSpacing: '0.06em', margin: 0 }}>
                  WINGMAN
                </p>
                <p style={{ fontFamily: 'Inter', fontSize: '10px', color: '#888', margin: 0 }}>
                  AI grooming companion
                </p>
              </div>
            </div>

            {/* Greeting bubble */}
            <div style={{ padding: '16px' }}>
              <div style={{
                background: '#F5C842', border: '2px solid var(--border)',
                boxShadow: '3px 3px 0 var(--shadow)', padding: '12px 14px',
                fontFamily: 'Inter', fontWeight: 500, fontSize: '13px',
                color: '#1A1A1A', lineHeight: 1.5,
              }}>
                Hello! 👋 I'm Wingman — your AI grooming companion. Want me to suggest a stylist or check your upcoming events?
              </div>

              <button
                onClick={() => { setOpen(false); onAskWingman && onAskWingman(); }}
                style={{
                  marginTop: '12px', width: '100%', padding: '12px',
                  background: '#2EC4B6', border: '2.5px solid var(--border)',
                  boxShadow: '3px 3px 0 var(--shadow)',
                  fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '11px',
                  color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.06em',
                  cursor: 'pointer',
                }}
              >
                Open Wingman →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}