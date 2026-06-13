import React from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function EmergencyBanner({ onTriggerEmergency }) {
  return (
    <div style={{
      width: '100%', background: '#FF6B35',
      border: '2.5px solid var(--border)', boxShadow: '5px 5px 0 var(--shadow)',
      padding: '14px 20px', marginBottom: '24px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: '16px', flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px', height: '36px', background: 'var(--bg-card)',
          border: '2px solid var(--border)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          boxShadow: '2px 2px 0 var(--shadow)',
        }}>
          <ShieldAlert size={18} strokeWidth={2.5} color="#1A1A1A" />
        </div>
        <div>
          <h4 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', color: '#1A1A1A', margin: '0 0 2px', letterSpacing: '0.04em' }}>
            NEED AN EMERGENCY TRIM?
          </h4>
          <p style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#1A1A1A', opacity: 0.85, margin: 0, lineHeight: 1.4 }}>
            Unexpected interview or event? Get prioritized slots near you in Nagpur.
          </p>
        </div>
      </div>

      <button onClick={onTriggerEmergency}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: '#F5C842', border: '2.5px solid var(--border)',
          color: '#1A1A1A', padding: '10px 18px',
          fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '11px',
          letterSpacing: '0.06em', textTransform: 'uppercase',
          cursor: 'pointer', boxShadow: '3px 3px 0 var(--shadow)',
          transition: 'transform 0.12s, box-shadow 0.12s', flexShrink: 0,
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '5px 5px 0 var(--shadow)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 var(--shadow)'; }}
      >
        REQUEST NOW <ArrowRight size={13} strokeWidth={2.5} />
      </button>
    </div>
  );
}