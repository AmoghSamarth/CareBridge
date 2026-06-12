import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWingman } from '../context/WingmanContext';
import { Sparkles, Zap } from 'lucide-react';

const mockPro = {
  id: 'ravi-sharma', name: 'Ravi Sharma', area: 'Dharampeth',
  services: ['haircut', 'beard'], price_range: '150-300', rating: 4.9,
  image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400',
};

export default function WingmanCard({ onBookNow }) {
  const { onboardingData, messages } = useWingman();

  const lastMsg = [...messages].reverse().find(m => m.sender === 'wingman');
  const fullText = lastMsg?.text || "Gearing up for your routine? Let me scan the top-rated professionals in Nagpur for you.";

  const [displayedText, setDisplayedText] = useState('');
  const prevRef = useRef('');

  useEffect(() => {
    if (fullText === prevRef.current) return;
    prevRef.current = fullText;
    setDisplayedText('');
    let idx = 0;
    const iv = setInterval(() => {
      if (idx < fullText.length) { setDisplayedText(fullText.slice(0, ++idx)); }
      else clearInterval(iv);
    }, 16);
    return () => clearInterval(iv);
  }, [fullText]);

  const hasEvent = onboardingData?.upcomingEvent?.eventType;
  const eventDate = onboardingData?.upcomingEvent?.eventDate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        width: '100%',
        background: '#F5C842',
        border: '3px solid #1A1A1A',
        boxShadow: '8px 8px 0 #1A1A1A',
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <div style={{
        background: '#1A1A1A', padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#F5C842', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '15px', color: '#1A1A1A' }}>W</span>
          </div>
          <div>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '11px', color: '#F5C842', margin: 0, letterSpacing: '0.1em' }}>WINGMAN ASSISTANT</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
              <div style={{ width: '5px', height: '5px', background: '#2EC4B6', borderRadius: '50%' }} />
              <p style={{ fontFamily: 'Inter', fontSize: '9px', color: '#aaa', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Companion Dashboard</p>
            </div>
          </div>
        </div>

        {hasEvent && (
          <span style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px',
            background: '#F5C842', color: '#1A1A1A',
            border: '1.5px solid #F5C842', borderRadius: '999px',
            padding: '4px 12px', letterSpacing: '0.06em',
            display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            📅 {onboardingData.upcomingEvent.eventType.toUpperCase()}
            {eventDate ? `: ${new Date(eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }).toUpperCase()}` : ': SOON'}
          </span>
        )}
      </div>

      {/* Message */}
      <div style={{ padding: '28px 24px 20px' }}>
        <p style={{
          fontFamily: 'Plus Jakarta Sans', fontWeight: 700,
          fontSize: 'clamp(15px, 2.2vw, 19px)', color: '#1A1A1A',
          lineHeight: 1.5, fontStyle: 'italic',
          minHeight: '60px',
        }}>
          "{displayedText}
          {displayedText.length < fullText.length && (
            <span style={{ display: 'inline-block', width: '2px', height: '18px', background: '#1A1A1A', marginLeft: '2px', verticalAlign: 'middle', opacity: 0.7, animation: 'blink 1.2s step-end infinite' }} />
          )}
          "
        </p>
      </div>

      {/* Recommendation card */}
      <div style={{ margin: '0 20px 20px', background: '#fff', border: '2.5px solid #1A1A1A', boxShadow: '4px 4px 0 #1A1A1A', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src={mockPro.image_url} alt={mockPro.name}
            style={{ width: '52px', height: '52px', border: '2.5px solid #1A1A1A', objectFit: 'cover', flexShrink: 0, borderRadius: '12px', boxShadow: '3px 3px 0 #1A1A1A' }}
          />
          <div>
            <span style={{
              display: 'inline-block', fontFamily: 'Plus Jakarta Sans', fontWeight: 700,
              fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em',
              background: '#F03E7A', color: '#fff', border: '1.5px solid #1A1A1A',
              borderRadius: '999px', padding: '2px 10px', marginBottom: '5px',
            }}>
              ✦ RECOMMENDED
            </span>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '15px', color: '#1A1A1A', margin: 0 }}>
              {mockPro.name}
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', margin: '2px 0 0', fontWeight: 600 }}>
              {mockPro.area} · ⭐ {mockPro.rating}
            </p>
          </div>
        </div>

        <button onClick={() => onBookNow(mockPro)}
          style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px',
            color: '#fff', background: '#F03E7A',
            border: '2.5px solid #1A1A1A',
            boxShadow: '4px 4px 0 #1A1A1A',
            padding: '12px 22px', cursor: 'pointer',
            letterSpacing: '0.06em',
            transition: 'transform 0.12s, box-shadow 0.12s',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #1A1A1A'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 #1A1A1A'; }}
        >
          BOOK NOW
        </button>
      </div>
    </motion.div>
  );
}