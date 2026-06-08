import React from 'react';

const links = {
  Product: ['How it works', 'Features', 'Pricing', 'For Professionals'],
  Company: ['About', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
};

export default function Footer() {
  return (
    <footer style={{ background: '#1A1A1A' }}>
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '64px 40px 32px' }}>
        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', marginBottom: '48px' }}>

          {/* Brand */}
          <div style={{ flex: '1 1 280px', minWidth: '240px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{
                width: '28px', height: '28px', background: '#9B8FE8',
                border: '2px solid #F5C842', borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '14px', color: '#fff' }}>C</span>
              </div>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '22px', color: '#F5C842', letterSpacing: '-0.02em' }}>
                CareBridge
              </span>
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#6B6B6B', lineHeight: 1.7, maxWidth: '240px' }}>
              AI-powered home grooming marketplace. Care that comes to you, when life gets busy.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading} style={{ flex: '1 1 140px', minWidth: '120px' }}>
              <p style={{
                fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#FFFFFF', marginBottom: '16px',
              }}>
                {heading}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {items.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        fontFamily: 'Inter', fontWeight: 500, fontSize: '14px',
                        color: '#FFFFFF', textDecoration: 'none',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#F5C842'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = '#FFFFFF'; }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{
        background: '#F5C842',
        borderTop: '2px solid #1A1A1A',
        padding: '12px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '13px', color: '#1A1A1A' }}>
          © 2026 CareBridge. All rights reserved.
        </span>
        <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '13px', color: '#1A1A1A' }}>
          Made with ♥ in Nagpur
        </span>
      </div>
    </footer>
  );
}
