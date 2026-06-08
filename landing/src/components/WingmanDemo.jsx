import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SparklesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
  </svg>
);

const WAvatar = () => (
  <div style={{
    width: '32px', height: '32px', borderRadius: '50%',
    background: '#F03E7A', border: '2px solid #1A1A1A',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }}>
    <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', color: '#fff' }}>W</span>
  </div>
);

const prompts = [
  { text: 'Date night on Friday', response: "Ooh, exciting! Wavy textured style + beard styling. Mohit in Sadar has a slot tomorrow at 5pm. Book it?" },
  { text: 'Budget under ₹300', response: "Got it — budget-friendly! Ravi in Dharampeth offers sharp cuts for ₹250. Pick a slot?" },
  { text: 'Emergency slot today', response: "On it! Priya in Sitabuldi can do an emergency visit within 2 hours. Go ahead?" },
];

export default function WingmanDemo() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { from: 'wing', text: "Hey! I'm Wingman, your autonomous grooming companion. What's on your calendar?" }
  ]);
  const [typing, setTyping] = useState(false);

  const handlePrompt = (p) => {
    if (typing) return;
    setMessages(prev => [...prev, { from: 'user', text: p.text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'wing', text: p.response }]);
    }, 1500);
  };

  return (
    <section style={{ background: '#1A1A1A', borderTop: '2px solid #1A1A1A', padding: '80px 40px' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', gap: '64px', flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Left — chat simulator */}
        <div style={{ flex: '1 1 400px' }}>
          <div style={{ marginBottom: '28px' }}>
            <span style={{
              display: 'inline-block',
              fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              background: '#F5C842', color: '#1A1A1A',
              border: '2px solid #F5C842', borderRadius: '999px',
              padding: '5px 14px', marginBottom: '12px',
            }}>
              LIVE INTERACTIVE SIMULATOR
            </span>
            <h2 style={{
              fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
              fontSize: 'clamp(28px, 3.5vw, 42px)',
              letterSpacing: '-0.02em', color: '#FFFFFF', margin: '0 0 8px',
            }}>
              Watch Wingman work
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: '16px', color: '#9B8FE8', margin: 0 }}>
              This is a real conversation. Click a scenario below.
            </p>
          </div>

          {/* Chat card */}
          <div style={{
            background: '#FFFFFF', border: '2.5px solid #F5C842',
            borderRadius: '20px', boxShadow: '6px 6px 0 #F5C842',
            overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              background: '#1A1A1A', borderBottom: '2px solid #F5C842',
              padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2EC4B6' }} />
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', letterSpacing: '0.1em', color: '#F5C842' }}>
                WINGMAN DEMO
              </span>
            </div>

            {/* Messages */}
            <div style={{
              padding: '16px', minHeight: '180px', maxHeight: '280px',
              overflowY: 'auto', display: 'flex', flexDirection: 'column',
              gap: '10px', background: '#FAE8D8',
            }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-start' }}>
                  {m.from === 'wing' && <WAvatar />}
                  <div style={{
                    background: m.from === 'user' ? '#1A1A1A' : '#F5C842',
                    color: m.from === 'user' ? '#FFFFFF' : '#1A1A1A',
                    border: '2px solid #1A1A1A',
                    borderRadius: m.from === 'user' ? '16px 0 16px 16px' : '0 16px 16px 16px',
                    boxShadow: '2.5px 2.5px 0 #1A1A1A',
                    padding: '10px 14px',
                    fontFamily: 'Inter', fontSize: '13px',
                    maxWidth: '80%',
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <WAvatar />
                  <div style={{ background: '#F5C842', border: '2px solid #1A1A1A', borderRadius: '0 16px 16px 16px', boxShadow: '2.5px 2.5px 0 #1A1A1A', padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center', height: '14px' }}>
                      {[0,1,2].map(i => (
                        <motion.span key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1A1A1A', display: 'block' }}
                          animate={{ y: [0,-4,0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i*0.15 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Prompts */}
            <div style={{ padding: '12px 16px', background: '#FFFFFF', borderTop: '2px solid #1A1A1A' }}>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1A1A1A', display: 'block', marginBottom: '8px' }}>
                CHOOSE A SCENARIO
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {prompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handlePrompt(p)}
                    style={{
                      fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px',
                      color: '#1A1A1A', background: '#FFFFFF',
                      border: '2px solid #1A1A1A', borderRadius: '8px',
                      boxShadow: '2px 2px 0 #1A1A1A',
                      padding: '6px 12px', cursor: 'pointer',
                      transition: 'transform 0.1s, box-shadow 0.1s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background='#F5C842'; e.currentTarget.style.transform='translate(-1px,-1px)'; e.currentTarget.style.boxShadow='3px 3px 0 #1A1A1A'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='#FFFFFF'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='2px 2px 0 #1A1A1A'; }}
                  >
                    {p.text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right — stat cards + CTA */}
        <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { bg: '#F5C842', num: '4.9', label: 'AVG RATING', textColor: '#1A1A1A' },
              { bg: '#F03E7A', num: '120+', label: 'DAILY VISITS', textColor: '#FFFFFF' },
              { bg: '#FFFFFF', num: '2H', label: 'SOS RESPONSE', textColor: '#1A1A1A' },
              { bg: '#FFFFFF', num: '500+', label: 'USERS', textColor: '#1A1A1A' },
            ].map((s, i) => (
              <div key={i} style={{
                background: s.bg, border: '2.5px solid #1A1A1A',
                borderRadius: '16px', boxShadow: '4px 4px 0 #1A1A1A',
                padding: '20px 16px', textAlign: 'center',
              }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '40px', color: s.textColor, lineHeight: 1, display: 'block' }}>{s.num}</span>
                <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: s.textColor, marginTop: '6px', display: 'block', opacity: 0.85 }}>{s.label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/auth')}
            style={{
              fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '15px',
              color: '#1A1A1A', background: '#F5C842',
              border: '2.5px solid #F5C842', borderRadius: '12px',
              boxShadow: '4px 4px 0 #F5C842',
              padding: '14px 28px', cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translate(-2px,-2px)'; e.currentTarget.style.boxShadow='6px 6px 0 #F5C842'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='4px 4px 0 #F5C842'; }}
          >
            TRY WINGMAN YOURSELF →
          </button>
        </div>
      </div>
    </section>
  );
}
