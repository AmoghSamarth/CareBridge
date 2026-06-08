import React from 'react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    price: '₹0',
    period: 'forever free',
    bg: '#FFFFFF',
    shadow: '5px 5px 0 #1A1A1A',
    tag: null,
    checkColor: '#2EC4B6',
    features: [
      'Wingman AI (5 suggestions/month)',
      'Browse & book professionals',
      'Basic style history',
      'Nagpur city coverage',
    ],
    cta: 'GET STARTED FREE',
    ctaBg: '#FFFFFF',
    ctaTextColor: '#1A1A1A',
  },
  {
    name: 'Wingman Pro',
    price: '₹99',
    period: 'per month',
    bg: '#F5C842',
    shadow: '8px 8px 0 #1A1A1A',
    tag: 'MOST POPULAR',
    checkColor: '#1A1A1A',
    checkTickColor: '#F5C842',
    features: [
      'Unlimited Wingman AI suggestions',
      'Priority professional matching',
      'AI style preview (unlimited)',
      'Beauty Twin full profile',
      'Emergency booking access',
    ],
    cta: 'START PRO',
    ctaBg: '#1A1A1A',
    ctaTextColor: '#F5C842',
  },
  {
    name: 'Pro Artist',
    price: '₹499',
    period: 'per month',
    bg: '#2EC4B6',
    shadow: '5px 5px 0 #1A1A1A',
    tag: null,
    checkColor: '#F5C842',
    features: [
      'Everything in Wingman Pro',
      'Professional dashboard access',
      'Client management tools',
      'Earnings analytics',
      'Featured placement in browse',
      'Zero commission for 6 months',
    ],
    cta: 'JOIN AS ARTIST',
    ctaBg: '#1A1A1A',
    ctaTextColor: '#FFFFFF',
  },
];

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#FFFFFF', borderTop: '2px solid #1A1A1A', padding: '80px 40px' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{
            display: 'inline-block',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            background: '#9B8FE8', color: '#FFFFFF',
            border: '2px solid #1A1A1A', borderRadius: '999px',
            padding: '5px 14px', marginBottom: '16px',
          }}>
            PRICING
          </span>
          <h2 style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800,
            fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.02em',
            color: '#1A1A1A', margin: 0,
          }}>
            Simple, honest <span style={{ color: '#F03E7A' }}>pricing.</span>
          </h2>
        </div>

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}>
          {plans.map((p, i) => (
            <div
              key={i}
              style={{
                background: p.bg,
                border: '2.5px solid #1A1A1A',
                borderRadius: '16px',
                boxShadow: p.shadow,
                padding: '32px 28px',
                position: 'relative',
              }}
            >
              {/* Popular tag */}
              {p.tag && (
                <div style={{
                  position: 'absolute',
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#F03E7A',
                  border: '2px solid #1A1A1A',
                  borderRadius: '999px',
                  padding: '4px 16px',
                  fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px',
                  color: '#FFFFFF', letterSpacing: '0.06em', textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  {p.tag}
                </div>
              )}

              {/* Plan name */}
              <p style={{
                fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#1A1A1A', marginBottom: '8px',
              }}>
                {p.name}
              </p>

              {/* Price */}
              <div style={{ marginBottom: '4px' }}>
                <span style={{
                  fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '56px',
                  color: '#1A1A1A', lineHeight: 1,
                }}>
                  {p.price}
                </span>
              </div>
              <p style={{
                fontFamily: 'Inter', fontSize: '13px', color: '#1A1A1A',
                opacity: 0.6, marginBottom: '24px',
              }}>
                {p.period}
              </p>

              {/* Features */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {p.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: p.checkColor,
                      border: '2px solid #1A1A1A',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: '1px',
                    }}>
                      <span style={{
                        fontSize: '10px', fontWeight: 900,
                        color: p.checkTickColor || '#FFFFFF',
                      }}>✓</span>
                    </div>
                    <span style={{ fontFamily: 'Inter', fontSize: '14px', color: '#1A1A1A', lineHeight: 1.5 }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => navigate('/auth')}
                style={{
                  width: '100%',
                  fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '14px',
                  color: p.ctaTextColor, background: p.ctaBg,
                  border: '2.5px solid #1A1A1A', borderRadius: '10px',
                  boxShadow: '3px 3px 0 #1A1A1A',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform='translate(-2px,-2px)'; e.currentTarget.style.boxShadow='5px 5px 0 #1A1A1A'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='3px 3px 0 #1A1A1A'; }}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
