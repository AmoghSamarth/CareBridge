import React from 'react';
import { Star, MapPin, Sparkles } from 'lucide-react';

export default function ProfessionalCard({ professional, onBook, onViewProfile }) {
  const { name, area, services = [], price_range, rating, review_count = 0, experience_years, is_available = true, image_url, ai_summary } = professional;

  return (
    <div style={{
      background: '#fff', border: '2.5px solid #1A1A1A',
      boxShadow: '5px 5px 0 #1A1A1A', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      transition: 'transform 0.12s, box-shadow 0.12s',
      cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '7px 7px 0 #1A1A1A'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '5px 5px 0 #1A1A1A'; }}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', borderBottom: '2.5px solid #1A1A1A', overflow: 'hidden' }}>
        <img
          src={image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400'}
          alt={name}
          style={{ width: '100%', height: '192px', objectFit: 'cover', display: 'block' }}
        />
        {/* Rating badge */}
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          background: '#fff', border: '2px solid #1A1A1A',
          padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px',
          boxShadow: '2px 2px 0 #1A1A1A',
        }}>
          <Star size={13} strokeWidth={2.5} fill="#F5C842" color="#1A1A1A" />
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px', color: '#1A1A1A' }}>{rating.toFixed(1)}</span>
          <span style={{ fontFamily: 'Inter', fontSize: '10px', color: '#6B6B6B', fontWeight: 600 }}>({review_count})</span>
        </div>
        {/* Available badge */}
        {is_available && (
          <div style={{
            position: 'absolute', bottom: '10px', left: '10px',
            background: '#2EC4B6', border: '2px solid #1A1A1A',
            padding: '3px 10px', boxShadow: '2px 2px 0 #1A1A1A',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '10px',
            color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            Available Today
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px 16px 0', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Name + Price */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px', gap: '8px' }}>
          <h4 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '15px', color: '#1A1A1A', margin: 0, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            {name.toUpperCase()}
          </h4>
          <span style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', color: '#1A1A1A',
            background: '#F5C842', border: '2px solid #1A1A1A',
            padding: '2px 8px', boxShadow: '2px 2px 0 #1A1A1A', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            ₹{price_range.replace('-', '–')}
          </span>
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
          <MapPin size={13} strokeWidth={2.5} color="#1A1A1A" />
          <span style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#6B6B6B' }}>
            {area.toUpperCase()}, NAGPUR · {experience_years}Y EXP
          </span>
        </div>

        {/* Services */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {services.map(svc => (
            <span key={svc} style={{
              background: '#2EC4B6', border: '2px solid #1A1A1A',
              fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px',
              color: '#1A1A1A', padding: '2px 10px',
              textTransform: 'uppercase', letterSpacing: '0.04em',
              boxShadow: '1.5px 1.5px 0 #1A1A1A', borderRadius: '999px',
            }}>
              {svc.toUpperCase()}
            </span>
          ))}
        </div>

        {/* AI Summary */}
        {ai_summary && (
          <div style={{
            background: '#F5C842', border: '2px solid #1A1A1A',
            padding: '10px 12px', marginBottom: '12px',
            display: 'flex', gap: '8px', alignItems: 'flex-start',
            boxShadow: '2px 2px 0 #1A1A1A',
          }}>
            <Sparkles size={13} strokeWidth={2.5} color="#1A1A1A" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#1A1A1A', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>
              "{ai_summary}"
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', borderTop: '2.5px solid #1A1A1A', marginTop: 'auto' }}>
        <button onClick={() => onViewProfile && onViewProfile(professional)}
          style={{
            flex: 1, padding: '12px 8px', background: '#fff',
            border: 'none', borderRight: '2px solid #1A1A1A',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '11px',
            color: '#1A1A1A', cursor: 'pointer', textTransform: 'uppercase',
            letterSpacing: '0.06em', transition: 'background 0.1s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#FFF8F0'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >
          VIEW PROFILE
        </button>
        <button onClick={() => onBook(professional)}
          style={{
            flex: 1, padding: '12px 8px', background: '#F5C842',
            border: 'none',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '11px',
            color: '#1A1A1A', cursor: 'pointer', textTransform: 'uppercase',
            letterSpacing: '0.06em', transition: 'background 0.1s',
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