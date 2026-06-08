import React from 'react';

const features = [
  {
    cardBg: '#FFFFFF',
    iconBg: '#F5C842',
    title: 'Wingman AI',
    body: 'Your autonomous grooming companion that predicts needs, books slots, and never lets you down.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    cardBg: '#FFF0F5',
    iconBg: '#F03E7A',
    title: 'Emergency Booking',
    body: 'SOS! Need a stylist in 2 hours? We alert nearby professionals and get you covered fast.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
      </svg>
    ),
  },
  {
    cardBg: '#F0FFFE',
    iconBg: '#2EC4B6',
    title: 'Smart Matching',
    body: 'AI-powered matching based on style, budget, proximity, and past preferences.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>
      </svg>
    ),
  },
  {
    cardBg: '#F5F3FF',
    iconBg: '#9B8FE8',
    title: 'Predictive Planner',
    body: 'Wingman reads your calendar and suggests grooming slots before important events.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    cardBg: '#FFF8EC',
    iconBg: '#F5C842',
    title: 'Style Preview',
    body: 'See AI-generated previews of recommended styles before you commit to a booking.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
  },
  {
    cardBg: '#FFF0F5',
    iconBg: '#F03E7A',
    title: 'Beauty Twin',
    body: 'Build your AI beauty profile. Wingman learns your preferences and improves every booking.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section style={{ background: '#FFFFFF', borderTop: '2px solid #1A1A1A', padding: '80px 40px' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{
            display: 'inline-block',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: '#F03E7A', color: '#FFFFFF',
            border: '2px solid #1A1A1A', borderRadius: '999px',
            padding: '5px 14px', marginBottom: '16px',
          }}>
            FEATURES
          </span>
          <h2 style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
            fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-0.02em',
            color: '#1A1A1A', margin: 0,
          }}>
            Everything you need,{' '}
            <span style={{ color: '#F03E7A' }}>nothing you don't.</span>
          </h2>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                background: f.cardBg,
                border: '2.5px solid #1A1A1A',
                borderRadius: '16px',
                boxShadow: '5px 5px 0 #1A1A1A',
                padding: '24px',
                cursor: 'default',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translate(-2px,-2px)'; e.currentTarget.style.boxShadow='7px 7px 0 #1A1A1A'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='5px 5px 0 #1A1A1A'; }}
            >
              {/* Icon */}
              <div style={{
                width: '48px', height: '48px',
                background: f.iconBg,
                border: '2px solid #1A1A1A',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                {f.icon}
              </div>

              <h3 style={{
                fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '18px',
                color: '#1A1A1A', marginBottom: '8px',
              }}>
                {f.title}
              </h3>
              <p style={{
                fontFamily: 'Inter', fontSize: '14px', color: '#6B6B6B',
                lineHeight: 1.6, margin: 0,
              }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
