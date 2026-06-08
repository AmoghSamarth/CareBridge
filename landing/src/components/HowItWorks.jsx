import React from 'react';

const steps = [
  {
    num: '01',
    bg: '#F5C842',
    title: 'Tell Wingman your style',
    desc: 'Complete your Beauty Twin profile. Your preferences, history, and vibe — all in one place.',
  },
  {
    num: '02',
    bg: '#2EC4B6',
    title: 'Let AI find your match',
    desc: 'Wingman scans 100+ verified professionals near you and picks the best fit for your needs.',
  },
  {
    num: '03',
    bg: '#9B8FE8',
    title: 'Relax. They come to you.',
    desc: 'Your professional arrives at home. Sit back, look great, stay confident.',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: '#FAE8D8',
        borderTop: '2px solid #1A1A1A',
        borderBottom: '2px solid #1A1A1A',
        padding: '80px 40px',
      }}
    >
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{
            display: 'inline-block',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: '#2EC4B6', color: '#1A1A1A',
            border: '2px solid #1A1A1A', borderRadius: '999px',
            padding: '5px 14px', marginBottom: '16px',
          }}>
            THE PROCESS
          </span>
          <h2 style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.02em',
            color: '#1A1A1A', margin: 0,
          }}>
            THREE STEPS TO ALWAYS BEING GROOMED.
          </h2>
        </div>

        {/* Step cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                background: s.bg,
                border: '2.5px solid #1A1A1A',
                borderRadius: '16px',
                boxShadow: '5px 5px 0 #1A1A1A',
                padding: '32px 28px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Faded bg number */}
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '12px',
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 800,
                fontSize: '80px',
                color: '#1A1A1A',
                opacity: 0.12,
                lineHeight: 1,
                userSelect: 'none',
              }}>
                {s.num}
              </span>

              {/* Step badge */}
              <span style={{
                display: 'inline-block',
                fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                background: '#1A1A1A', color: '#FFFFFF',
                borderRadius: '999px', padding: '4px 12px',
                marginBottom: '16px',
              }}>
                STEP {s.num}
              </span>

              <h3 style={{
                fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '16px',
                textTransform: 'uppercase', letterSpacing: '0.02em',
                color: '#1A1A1A', marginBottom: '12px',
              }}>
                {s.title}
              </h3>
              <p style={{
                fontFamily: 'Inter', fontSize: '14px',
                color: '#1A1A1A', lineHeight: 1.6, margin: 0,
              }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
