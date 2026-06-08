import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
  </svg>
);

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round">
    <line x1="4" x2="20" y1="6" y2="6"/>
    <line x1="4" x2="20" y1="12" y2="12"/>
    <line x1="4" x2="20" y1="18" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToHowItWorks = () => {
    setIsOpen(false);
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      ref={menuRef}
      className="relative z-50 flex items-center justify-between px-6 md:px-10"
      style={{
        height: '68px',
        background: 'transparent',
        borderBottom: '2px solid #1A1A1A',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
        <div
          className="flex items-center justify-center"
          style={{
            width: '28px',
            height: '28px',
            background: '#9B8FE8',
            border: '2px solid #1A1A1A',
            borderRadius: '8px',
          }}
        >
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '14px', color: '#fff' }}>C</span>
        </div>
        <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '22px', color: '#1A1A1A', letterSpacing: '-0.02em' }}>
          CareBridge
        </span>
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6">
        <button
          onClick={scrollToHowItWorks}
          style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '15px', color: '#1A1A1A' }}
          className="transition-colors cursor-pointer hover:text-pink"
        >
          How it works
        </button>

        {/* Theme toggle — decorative */}
        <button
          style={{
            width: '36px',
            height: '36px',
            border: '2px solid #1A1A1A',
            borderRadius: '8px',
            background: '#F5C842',
            boxShadow: '2px 2px 0 #1A1A1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translate(-2px,-2px)';
            e.currentTarget.style.boxShadow = '4px 4px 0 #1A1A1A';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '2px 2px 0 #1A1A1A';
          }}
        >
          <SunIcon />
        </button>

        {/* Login button */}
        <button
          onClick={() => navigate('/auth')}
          style={{
            fontFamily: 'Plus Jakarta Sans',
            fontWeight: 700,
            fontSize: '15px',
            color: '#1A1A1A',
            background: '#F5C842',
            border: '2.5px solid #1A1A1A',
            borderRadius: '12px',
            boxShadow: '3px 3px 0 #1A1A1A',
            padding: '10px 24px',
            cursor: 'pointer',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translate(-2px,-2px)';
            e.currentTarget.style.boxShadow = '5px 5px 0 #1A1A1A';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '3px 3px 0 #1A1A1A';
          }}
        >
          LOGIN
        </button>
      </div>

      {/* Mobile controls */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={() => navigate('/auth')}
          style={{
            fontFamily: 'Plus Jakarta Sans',
            fontWeight: 700,
            fontSize: '13px',
            color: '#1A1A1A',
            background: '#F5C842',
            border: '2px solid #1A1A1A',
            borderRadius: '10px',
            boxShadow: '2px 2px 0 #1A1A1A',
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          LOGIN
        </button>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '36px',
            height: '36px',
            border: '2px solid #1A1A1A',
            borderRadius: '8px',
            background: '#2EC4B6',
            boxShadow: '2px 2px 0 #1A1A1A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {isOpen ? <CloseIcon /> : <HamburgerIcon />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '68px',
              left: 0,
              right: 0,
              background: '#FFFFFF',
              borderBottom: '2px solid #1A1A1A',
              padding: '20px 24px',
              zIndex: 40,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <button
              onClick={scrollToHowItWorks}
              style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, color: '#1A1A1A', textAlign: 'left', fontSize: '16px' }}
              className="cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => { setIsOpen(false); navigate('/auth'); }}
              style={{
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 800,
                fontSize: '15px',
                color: '#1A1A1A',
                background: '#F5C842',
                border: '2.5px solid #1A1A1A',
                borderRadius: '12px',
                boxShadow: '3px 3px 0 #1A1A1A',
                padding: '12px',
                cursor: 'pointer',
              }}
            >
              LOGIN TO CAREBRIDGE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
