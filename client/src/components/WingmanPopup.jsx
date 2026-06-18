import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Logo from './Logo';
import WingmanChat from './WingmanChat';

export default function WingmanPopup() {
  const [open, setOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('carebridge_wingman_popup_seen');
    if (!seen) setHasNotification(true);
  }, []);

  const handleToggle = () => {
    setOpen(o => {
      const next = !o;
      if (next) {
        setHasNotification(false);
        localStorage.setItem('carebridge_wingman_popup_seen', 'true');
      }
      return next;
    });
  };

  return (
    <>
      {/* Floating button wrapped in container */}
      <div style={{ position: 'fixed', bottom: '84px', right: '20px', zIndex: 60 }}>
        {!open && (
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '50%',
            animation: 'wingman-pulse 2.2s infinite',
            pointerEvents: 'none',
          }} />
        )}
        <motion.button
          onClick={handleToggle}
          whileTap={{ scale: 0.92 }}
          animate={!open ? { y: [0, -4, 0] } : { y: 0 }}
          transition={!open ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
          style={{
            position: 'relative',
            width: '56px', height: '56px', borderRadius: '50%',
            background: '#F5C842', border: '2.5px solid var(--border)',
            boxShadow: '4px 4px 0 var(--shadow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {open ? <X size={22} color="#1A1A1A" strokeWidth={2.5} /> : <Logo size={28} />}
          {hasNotification && (
            <div style={{
              position: 'absolute', top: '-4px', right: '-4px',
              width: '14px', height: '14px', borderRadius: '50%',
              background: '#FF6B35', border: '2px solid var(--bg-page)',
            }} />
          )}
        </motion.button>
      </div>

      {/* Popup card showing real compact chat */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed', bottom: '150px', right: '20px', zIndex: 60,
              width: 'min(360px, calc(100vw - 32px))',
              maxHeight: '70vh',
              background: 'var(--bg-card)', border: '2.5px solid var(--border)',
              boxShadow: '6px 6px 0 var(--shadow)',
              display: 'flex', flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <WingmanChat onCollapse={() => setOpen(false)} compact />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}