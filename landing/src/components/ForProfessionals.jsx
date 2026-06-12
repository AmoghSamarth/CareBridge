import React from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  { icon: '✓', text: 'Get discovered by AI-matched clients in your area' },
  { icon: '✓', text: 'Manage bookings, slots, and earnings in one dashboard' },
  { icon: '✓', text: 'Build your profile with verified reviews and style portfolio' },
  { icon: '✓', text: 'Zero commission for the first 3 months' },
];

export default function ForProfessionals() {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#F03E7A', borderTop: '2px solid #1A1A1A', padding: '80px 40px' }}>
      <div style={{
        maxWidth: '1300px', margin: '0 auto',
        display: 'flex', gap: '64px', alignItems: 'center', flexWrap: 'wrap',
      }}>

        {/* Left — text + CTA */}
        <div style={{ flex: '1 1 380px' }}>
          <span style={{
            display: 'inline-block',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: '#F5C842', color: '#1A1A1A',
            border: '2px solid #1A1A1A', borderRadius: '999px',
            padding: '5px 14px', marginBottom: '20px',
          }}>
            FOR PROFESSIONALS
          </span>
          <h2 style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.02em',
            color: '#FFFFFF', margin: '0 0 20px',
          }}>
            Grow your clientele with AI
          </h2>
          <p style={{
            fontFamily: 'Inter', fontSize: '18px', color: '#1A1A1A',
            lineHeight: 1.6, marginBottom: '32px',
          }}>
            Join Nagpur's fastest-growing home grooming platform and let Wingman send verified clients directly to you.
          </p>

          <button
            onClick={() => navigate('/start')}
            style={{
              fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '16px',
              color: '#1A1A1A', background: '#F5C842',
              border: '2.5px solid #1A1A1A', borderRadius: '12px',
              boxShadow: '4px 4px 0 #1A1A1A',
              padding: '16px 32px', cursor: 'pointer',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform='translate(-2px,-2px)'; e.currentTarget.style.boxShadow='6px 6px 0 #1A1A1A'; }}
            onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='4px 4px 0 #1A1A1A'; }}
          >
            JOIN AS A PROFESSIONAL →
          </button>
        </div>

        {/* Right — feature rows */}
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                background: '#FFFFFF',
                border: '2px solid #1A1A1A',
                borderRadius: '12px',
                padding: '16px 20px',
              }}
            >
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: '#F5C842', border: '2px solid #1A1A1A',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '14px', color: '#1A1A1A' }}>✓</span>
              </div>
              <span style={{ fontFamily: 'Inter', fontSize: '15px', color: '#1A1A1A', lineHeight: 1.5 }}>
                {f.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
