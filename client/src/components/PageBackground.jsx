import React from 'react';
import { Star, MapPin } from 'lucide-react';

export default function ProfessionalCard({ professional, onBook, onViewProfile }) {
  const { name, area, services = [], price_range, rating, review_count = 0, experience_years, is_available = true, image_url } = professional;

  return (
    <div style={{
      background: 'var(--bg-card)', border: '2.5px solid var(--border)',
      boxShadow: '5px 5px 0 var(--shadow)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'transform 0.12s, box-shadow 0.12s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '7px 7px 0 var(--shadow)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '5px 5px 0 var(--shadow)'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', borderBottom: '2.5px solid var(--border)', overflow: 'hidden' }}>
        <img
          src={image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400'}
          alt={name}
          style={{ width: '100%', height: '192px', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          background: 'var(--bg-card)', border: '2px solid var(--border)',
          padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px',
          boxShadow: '2px 2px 0 var(--shadow)',
        }}>
          <Star size={13} strokeWidth={2.5} fill="#F5C842" color="var(--border)" />
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px', color: 'var(--text-primary)' }}>{rating.toFixed(1)}</span>
          <span style={{ fontFamily: 'Inter', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>({review_count})</span>
        </div>
        {is_available && (
          <div style={{
            position: 'absolute', bottom: '10px', left: '10px',
            background: '#2EC4B6', border: '2px solid var(--border)',
            padding: '3px 10px', boxShadow: '2px 2px 0 var(--shadow)',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '10px',
            color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Available Today
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <h4 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            {name.toUpperCase()}
          </h4>
          <span style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', color: '#1A1A1A',
            background: '#F5C842', border: '2px solid var(--border)',
            padding: '2px 8px', boxShadow: '2px 2px 0 var(--shadow)', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            ₹{price_range.replace('-', '–')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={13} strokeWidth={2.5} color="var(--text-primary)" />
          <span style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
            {area.toUpperCase()}, NAGPUR · {experience_years}Y EXP
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {services.map(svc => (
            <span key={svc} style={{
              background: '#2EC4B6', border: '2px solid var(--border)',
              fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px',
              color: '#1A1A1A', padding: '2px 10px',
              textTransform: 'uppercase', letterSpacing: '0.04em',
              boxShadow: '1.5px 1.5px 0 var(--shadow)', borderRadius: '999px',
            }}>
              {svc.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', borderTop: '2.5px solid var(--border)', marginTop: 'auto' }}>
        <button onClick={() => onViewProfile && onViewProfile(professional)}
          style={{
            flex: 1, padding: '13px 8px', background: 'var(--bg-card)',
            border: 'none', borderRight: '2px solid var(--border)',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '11px',
            color: 'var(--text-primary)', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em',
            transition: 'background 0.1s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          VIEW PROFILE
        </button>
        <button onClick={() => onBook(professional)}
          style={{
            flex: 1, padding: '13px 8px', background: '#F5C842',
            border: 'none',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '11px',
            color: '#1A1A1A', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.06em',
            transition: 'background 0.1s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f0bc30'}
          onMouseLeave={e => e.currentTarget.style.background = '#F5C842'}
        >
          BOOK NOW
        </button>
      </div>
    </div>
  );
}