import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar.jsx';

const CLIENT_URL = import.meta.env.VITE_CLIENT_URL || 'https://care-bridge-hp9u.vercel.app';

const roles = [
  {
    id: 'customer',
    emoji: '✂️',
    title: 'I need grooming',
    desc: 'Book professionals, use Wingman AI, get groomed at home',
    activeBg: '#F5C842',
  },
  {
    id: 'professional',
    emoji: '💼',
    title: 'I am a professional',
    desc: 'List your services, manage bookings, grow your clientele',
    activeBg: '#2EC4B6',
  },
];

export default function StartPage() {
  const [role, setRole] = useState('');

  const handleContinue = () => {
    if (!role) return;

    localStorage.setItem('carebridge_role', role);
    window.location.href = role === 'professional'
      ? `${CLIENT_URL.replace(/\/$/, '')}/pro-dashboard`
      : CLIENT_URL;
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
      <Navbar />
      <main style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '56px 24px',
      }}>
        <section style={{ width: '100%', maxWidth: '840px', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: 'Plus Jakarta Sans',
            fontWeight: 800,
            fontSize: 'clamp(36px, 6vw, 60px)',
            color: 'var(--text-primary)',
            margin: '0 0 10px',
          }}>
            Who are you?
          </h1>
          <p style={{
            fontFamily: 'Inter',
            fontSize: '17px',
            color: 'var(--text-muted)',
            margin: '0 0 36px',
          }}>
            Choose your role to get started with CareBridge
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '22px',
            marginBottom: '32px',
          }}>
            {roles.map((option) => {
              const isSelected = role === option.id;
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  onClick={() => setRole(option.id)}
                  whileHover={{ x: -2, y: -2 }}
                  whileTap={{ x: 0, y: 0 }}
                  style={{
                    minHeight: '230px',
                    background: isSelected ? option.activeBg : 'var(--bg-card)',
                    border: '2.5px solid var(--border)',
                    borderRadius: '16px',
                    boxShadow: isSelected ? '7px 7px 0 var(--shadow)' : '5px 5px 0 var(--shadow)',
                    padding: '28px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s, box-shadow 0.15s',
                  }}
                >
                  <span style={{ fontSize: '42px', display: 'block', marginBottom: '20px' }}>
                    {option.emoji}
                  </span>
                  <h2 style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontWeight: 800,
                    fontSize: '24px',
                    color: '#1A1A1A',
                    margin: '0 0 10px',
                  }}>
                    {option.title}
                  </h2>
                  <p style={{
                    fontFamily: 'Inter',
                    fontSize: '15px',
                    color: '#1A1A1A',
                    lineHeight: 1.55,
                    margin: 0,
                  }}>
                    {option.desc}
                  </p>
                </motion.button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!role}
            onClick={handleContinue}
            style={{
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 800,
              fontSize: '16px',
              color: '#FFFFFF',
              background: '#F03E7A',
              border: '2.5px solid #1A1A1A',
              borderRadius: '12px',
              boxShadow: role ? '4px 4px 0 #1A1A1A' : 'none',
              padding: '16px 36px',
              cursor: role ? 'pointer' : 'not-allowed',
              opacity: role ? 1 : 0.45,
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => {
              if (!role) return;
              e.currentTarget.style.transform = 'translate(-2px,-2px)';
              e.currentTarget.style.boxShadow = '6px 6px 0 #1A1A1A';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = role ? '4px 4px 0 #1A1A1A' : 'none';
            }}
          >
            CONTINUE →
          </button>
        </section>
      </main>
    </div>
  );
}
