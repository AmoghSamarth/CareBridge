import React from 'react';

const testimonials = [
  {
    avatarBg: '#F03E7A',
    avatarLetter: 'A',
    name: 'Ananya Deshmukh',
    role: 'Software Engineer, Nagpur',
    stars: 5,
    text: 'Wingman booked my wedding trial completely on its own. I just woke up to a confirmation. This is the future of grooming!',
  },
  {
    avatarBg: '#2EC4B6',
    avatarLetter: 'R',
    name: 'Rohit Sharma',
    role: 'Business Owner, Dharampeth',
    stars: 5,
    text: 'I had a big pitch meeting and totally forgot about grooming. Wingman reminded me 3 days before and booked Ravi for me. Lifesaver.',
  },
  {
    avatarBg: '#9B8FE8',
    avatarLetter: 'P',
    name: 'Priya Nair',
    role: 'Content Creator, Sitabuldi',
    stars: 5,
    text: 'The style preview feature is wild. I saw exactly how I\'d look before my photoshoot. Zero surprises, all confidence!',
  },
];

export default function SocialProof() {
  return (
    <section style={{ background: '#FFFFFF', borderTop: '2px solid #1A1A1A', padding: '80px 40px' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.02em',
            color: '#1A1A1A', margin: '0 0 8px',
          }}>
            What they're <span style={{ color: '#F03E7A' }}>saying</span>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '16px', color: '#6B6B6B' }}>
            Real users. Real results. Real grooming wins.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: '#FFFFFF',
                border: '2.5px solid #1A1A1A',
                borderRadius: '16px',
                boxShadow: '5px 5px 0 #1A1A1A',
                padding: '28px 24px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative quote mark */}
              <span style={{
                position: 'absolute',
                top: '-8px',
                left: '16px',
                fontFamily: 'Plus Jakarta Sans',
                fontWeight: 800,
                fontSize: '80px',
                color: '#F5C842',
                lineHeight: 1,
                userSelect: 'none',
              }}>
                "
              </span>

              {/* Stars */}
              <div style={{ display: 'flex', gap: '3px', marginBottom: '16px', marginTop: '24px' }}>
                {Array.from({ length: t.stars }).map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 24 24" fill="#F5C842" stroke="#1A1A1A" strokeWidth="1">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p style={{
                fontFamily: 'Inter', fontSize: '15px', color: '#1A1A1A',
                lineHeight: 1.65, marginBottom: '20px',
              }}>
                {t.text}
              </p>

              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: t.avatarBg, border: '2px solid #1A1A1A',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '16px', color: '#fff' }}>
                    {t.avatarLetter}
                  </span>
                </div>
                <div>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '14px', color: '#1A1A1A', margin: 0 }}>{t.name}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', margin: 0 }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
