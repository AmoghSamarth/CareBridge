import React, { useState, useEffect, useRef } from 'react';
import { useWingman } from '../context/WingmanContext';
import { motion } from 'framer-motion';

export default function WingmanCard({ onBookNow }) {
  const { onboardingData, messages } = useWingman();

  const lastWingmanMsg = [...messages].reverse().find(m => m.sender === 'wingman') || messages[messages.length - 1];
  const fullText = lastWingmanMsg?.text || "Gearing up for your routine? Let me scan the top-rated professionals in Nagpur for you.";

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
    }, 18);
    return () => clearInterval(iv);
  }, [fullText]);

  const hasEvent = onboardingData?.upcomingEvent?.eventType;
  const eventDate = onboardingData?.upcomingEvent?.eventDate;

  const mockPro = {
    id: 'ravi-sharma', name: 'Ravi Sharma', area: 'Dharampeth',
    services: ['haircut', 'beard'], price_range: '150-300', rating: 4.9,
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        width: '100%',
        background: '#F5C842',
        border: '2.5px solid #1A1A1A',
        borderRadius: '20px',
        boxShadow: '8px 8px 0 #1A1A1A',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        minHeight: '320px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: '#1A1A1A', border: '2px solid #1A1A1A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '16px', color: '#F5C842' }}>W</span>
          </div>
          <div>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', color: '#1A1A1A', margin: 0, letterSpacing: '0.05em' }}>
              WINGMAN ASSISTANT
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: '10px', color: '#1A1A1A', opacity: 0.6, margin: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              AI Companion Dashboard
            </p>
          </div>
        </div>

        {hasEvent && (
          <span style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px',
            background: '#1A1A1A', color: '#F5C842',
            border: '2px solid #1A1A1A', borderRadius: '999px',
            padding: '4px 12px', letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            📅 {onboardingData.upcomingEvent.eventType.toUpperCase()}{eventDate ? `: ${new Date(eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }).toUpperCase()}` : ': SOON'}
          </span>
        )}
      </div>

      {/* Message */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <p style={{
          fontFamily: 'Plus Jakarta Sans', fontWeight: 700,
          fontSize: '18px', color: '#1A1A1A', lineHeight: 1.45,
          fontStyle: 'italic',
        }}>
          "{displayedText}"
        </p>
      </div>

      {/* Recommendation card */}
      <div style={{
        background: '#FFFFFF',
        border: '2.5px solid #1A1A1A',
        borderRadius: '14px',
        boxShadow: '3px 3px 0 #1A1A1A',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={mockPro.image_url} alt={mockPro.name}
            style={{ width: '44px', height: '44px', borderRadius: '10px', border: '2px solid #1A1A1A', objectFit: 'cover', flexShrink: 0 }}
          />
          <div>
            <span style={{
              display: 'inline-block', fontFamily: 'Plus Jakarta Sans', fontWeight: 700,
              fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em',
              background: '#F03E7A', color: '#FFFFFF',
              border: '1.5px solid #1A1A1A', borderRadius: '999px',
              padding: '2px 8px', marginBottom: '4px',
            }}>
              RECOMMENDED
            </span>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', color: '#1A1A1A', margin: 0 }}>
              {mockPro.name}
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', margin: 0 }}>
              {mockPro.area} · ⭐ {mockPro.rating}
            </p>
          </div>
        </div>

        <button onClick={() => onBookNow(mockPro)}
          style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px',
            color: '#FFFFFF', background: '#F03E7A',
            border: '2px solid #1A1A1A', borderRadius: '10px',
            boxShadow: '3px 3px 0 #1A1A1A',
            padding: '10px 18px', cursor: 'pointer',
            transition: 'transform 0.12s, box-shadow 0.12s',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform='translate(-2px,-2px)'; e.currentTarget.style.boxShadow='5px 5px 0 #1A1A1A'; }}
          onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='3px 3px 0 #1A1A1A'; }}
        >
          BOOK NOW
        </button>
      </div>
    </motion.div>
  );
}
