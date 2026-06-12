import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const items = [
  { q: 'What is Wingman AI?', a: 'Wingman is your proactive AI grooming companion. It learns your schedule, preferences, and upcoming events to suggest and book grooming sessions — without you having to think about it.' },
  { q: 'How does home service work?', a: 'You choose a professional, pick a slot, and they come to your door with all equipment. Nail care, haircuts, facial — all done at home in Nagpur.' },
  { q: 'Is CareBridge available outside Nagpur?', a: 'We\'re launching with Nagpur first, but other cities are on the roadmap. Join our waitlist to be first when we expand.' },
  { q: 'How are professionals verified?', a: 'Every professional goes through ID verification, skill testing, and background checks before being listed on CareBridge.' },
  { q: 'Can I cancel or reschedule a booking?', a: 'Yes — cancel or reschedule up to 2 hours before your appointment for free. Late cancellations may incur a small fee.' },
  { q: 'What if I\'m not happy with the service?', a: 'We have a 100% satisfaction guarantee. Report an issue within 24 hours and we\'ll arrange a free redo or full refund.' },
  { q: 'How does Wingman Pro differ from free?', a: 'Pro gives you unlimited AI suggestions, emergency booking access, AI style previews, and priority professional matching — all for ₹99/month.' },
  { q: 'How can professionals join?', a: 'Choose the "Professional" role on the start page. After verification (1-2 days), your profile goes live and Wingman starts sending you clients.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section style={{ background: '#FAE8D8', borderTop: '2px solid #1A1A1A', padding: '80px 40px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{
            display: 'inline-block',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: '#F5C842', color: '#1A1A1A',
            border: '2px solid #1A1A1A', borderRadius: '999px',
            padding: '5px 14px', marginBottom: '16px',
          }}>
            FAQ
          </span>
          <h2 style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.02em',
            color: '#1A1A1A', margin: 0,
          }}>
            Got questions?
          </h2>
        </div>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#FFFFFF', border: '2px solid #1A1A1A', borderRadius: '16px', overflow: 'hidden' }}>
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                style={{
                  borderBottom: i < items.length - 1 ? '2px solid #1A1A1A' : 'none',
                  borderLeft: isOpen ? '5px solid #F5C842' : '5px solid transparent',
                  background: 'transparent',
                  transition: 'all 0.2s',
                }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 20px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '16px',
                  }}
                >
                  <span style={{
                    fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '16px',
                    color: '#1A1A1A', flex: 1,
                  }}>
                    {item.q}
                  </span>
                  <span style={{
                    fontSize: '20px',
                    color: isOpen ? '#F5C842' : '#1A1A1A',
                    transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                    transition: 'transform 0.2s, color 0.2s',
                    lineHeight: 1,
                    flexShrink: 0,
                  }}>
                    +
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p style={{
                        fontFamily: 'Inter', fontSize: '15px', color: '#6B6B6B',
                        lineHeight: 1.7, padding: '0 20px 20px',
                      }}>
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
