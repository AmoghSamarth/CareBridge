import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
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
  const { theme, toggle } = useTheme();

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
        background: 'var(--bg-nav)',
        borderBottom: '2px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
        <Logo size="sm" />
        <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '22px', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          CareBridge
        </span>
      </div>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6">
        <button
          onClick={scrollToHowItWorks}
          style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}
          className="transition-colors cursor-pointer hover:text-pink"
        >
          How it works
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          style={{
            width: '36px',
            height: '36px',
            border: '2px solid var(--border)',
            borderRadius: '8px',
            background: '#F5C842',
            boxShadow: '2px 2px 0 var(--shadow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'transform 0.15s, box-shadow 0.15s',
            color: 'var(--text-primary)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translate(-2px,-2px)';
            e.currentTarget.style.boxShadow = '4px 4px 0 var(--shadow)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '2px 2px 0 var(--shadow)';
          }}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>

        <button
          onClick={() => navigate('/start')}
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
          GET STARTED
        </button>
      </div>

      {/* Mobile controls */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          onClick={toggle}
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
            color: '#1A1A1A',
          }}
          title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
        <button
          onClick={() => navigate('/start')}
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
          GET STARTED
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
              onClick={() => { setIsOpen(false); navigate('/start'); }}
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
              GET STARTED
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
