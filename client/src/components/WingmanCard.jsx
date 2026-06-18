import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWingman } from '../context/WingmanContext';
import { Sparkles, Zap, X, Clock } from 'lucide-react';

import salonsData from '../data/salons.json';

function getUpcomingBooking() {
  try {
    const raw = localStorage.getItem('carebridge_bookings_demo-user-customer') || '[]';
    const bookings = JSON.parse(raw);
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    return bookings.find(b => {
      if (b.status !== 'confirmed') return false;
      const d = new Date(b.bookingDate || b.date);
      const diff = d.getTime() - now;
      return diff > 0 && diff <= sevenDays;
    }) || null;
  } catch {
    return null;
  }
}

export default function WingmanCard({ onBookNow, onOpenChat }) {
  const { onboardingData, messages } = useWingman();

  const recommendedPro = (() => {
    const budgetMax = parseInt((onboardingData?.budgetRange || '500').split('-')[1] || '500', 10);
    const candidates = salonsData
      .filter(p => p.is_available !== false)
      .filter(p => {
        const min = parseInt((p.price_range || '0').split('-')[0], 10) || 0;
        return min <= budgetMax;
      })
      .sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return candidates[0] || salonsData[0];
  })();

  const lastMsg = [...messages].reverse().find(m => m.sender === 'wingman');
  const fullText = lastMsg?.text || "Gearing up for your routine? Let me scan the top-rated professionals in Nagpur for you.";

  const [displayedText, setDisplayedText] = useState('');
  const [reminderDismissed, setReminderDismissed] = useState(false);
  const [upcomingBooking, setUpcomingBooking] = useState(null);
  const prevRef = useRef('');

  useEffect(() => {
    setUpcomingBooking(getUpcomingBooking());
  }, []);

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
  const showReminder = upcomingBooking && !reminderDismissed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        width: '100%',
        background: '#F5C842',
        border: '3px solid var(--border)',
        boxShadow: '8px 8px 0 var(--shadow)',
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
              <p style={{ fontFamily: 'Inter', fontSize: '9px', color: '#aaa', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Companion · Gemini Powered</p>
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

      {/* Booking Reminder Banner */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              background: '#F5C842', borderBottom: '2.5px solid #1A1A1A',
              padding: '12px 20px',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Clock size={18} strokeWidth={2.5} color="#1A1A1A" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px', color: '#1A1A1A', margin: '0 0 2px', letterSpacing: '0.04em' }}>
                  📅 REMINDER: Your {upcomingBooking.service} with {upcomingBooking.professional_name || upcomingBooking.professionalName || 'your groomer'}
                </p>
                <p style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#1A1A1A', opacity: 0.8, margin: 0 }}>
                  is on {new Date(upcomingBooking.bookingDate || upcomingBooking.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} at {upcomingBooking.slot}. Need anything before then?
                </p>
              </div>
            </div>
            <button
              onClick={() => setReminderDismissed(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', flexShrink: 0 }}
            >
              <X size={16} strokeWidth={2.5} color="#1A1A1A" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message — clickable to open full chat */}
      <div
        onClick={onOpenChat}
        style={{ padding: '28px 24px 20px', cursor: onOpenChat ? 'pointer' : 'default' }}
        title={onOpenChat ? 'Click to open Wingman chat' : ''}
      >
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
        {onOpenChat && displayedText === fullText && (
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', color: '#1A1A1A', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '8px 0 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={10} />
            CLICK TO CHAT WITH WINGMAN
          </p>
        )}
      </div>

      {/* Recommendation card */}
      <div style={{ margin: '0 20px 20px', background: 'var(--bg-card)', border: '2.5px solid var(--border)', boxShadow: '4px 4px 0 var(--shadow)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src={recommendedPro.image_url} alt={recommendedPro.name}
            style={{ width: '52px', height: '52px', border: '2.5px solid var(--border)', objectFit: 'cover', flexShrink: 0, borderRadius: '12px', boxShadow: '3px 3px 0 var(--shadow)' }}
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
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)', margin: 0 }}>
              {recommendedPro.name}
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0', fontWeight: 600 }}>
              {recommendedPro.area} · ⭐ {recommendedPro.rating}
            </p>
          </div>
        </div>

        <button onClick={() => onBookNow(recommendedPro)}
          style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px',
            color: '#fff', background: '#F03E7A',
            border: '2.5px solid var(--border)',
            boxShadow: '4px 4px 0 var(--shadow)',
            padding: '12px 22px', cursor: 'pointer',
            letterSpacing: '0.06em',
            transition: 'transform 0.12s, box-shadow 0.12s',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--shadow)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 var(--shadow)'; }}
        >
          BOOK NOW
        </button>
      </div>
    </motion.div>
  );
}