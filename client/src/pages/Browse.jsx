import React, { useState, useMemo } from 'react';
import ProfessionalCard from '../components/ProfessionalCard';
import BookingModal from '../components/BookingModal';
import ProfessionalPanel from '../components/ProfessionalPanel';
import { Search } from 'lucide-react';

const allProfessionals = [
  {
    id: 'ravi-sharma', name: 'Ravi Sharma', area: 'Dharampeth',
    services: ['haircut', 'beard'], price_range: '150-300',
    rating: 4.9, review_count: 32, experience_years: 6, is_available: true,
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400',
    ai_summary: 'Customers love his attention to detail for classic cuts and beard trims.'
  },
  {
    id: 'priya-desai', name: 'Priya Desai', area: 'Sitabuldi',
    services: ['facial', 'waxing', 'threading'], price_range: '300-500',
    rating: 4.8, review_count: 24, experience_years: 4, is_available: true,
    image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400',
    ai_summary: 'Clients rave about her soothing facials and painless threading care.'
  },
  {
    id: 'mohit-thakur', name: 'Mohit Thakur', area: 'Sadar',
    services: ['haircut', 'beard', 'hair color'], price_range: '250-450',
    rating: 4.7, review_count: 18, experience_years: 5, is_available: true,
    image_url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=400',
    ai_summary: 'Praised for modern trend styling and vibrant hair coloring techniques.'
  },
  {
    id: 'sneha-patil', name: 'Sneha Patil', area: 'Ramdaspeth',
    services: ['bridal', 'makeup', 'facial'], price_range: '800-1500',
    rating: 4.9, review_count: 41, experience_years: 7, is_available: true,
    image_url: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=400',
    ai_summary: 'Bridal clients praise her flawless makeup and calm, professional manner.'
  },
  {
    id: 'kavita-meshram', name: 'Kavita Meshram', area: 'Manish Nagar',
    services: ['waxing', 'threading', 'facial'], price_range: '200-400',
    rating: 4.8, review_count: 19, experience_years: 5, is_available: true,
    image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400',
    ai_summary: 'Known for gentle, precise threading and quick turnaround facials.'
  },
  {
    id: 'vikram-joshi', name: 'Vikram Joshi', area: 'Ambazari',
    services: ['haircut', 'beard', 'hair color'], price_range: '200-400',
    rating: 4.7, review_count: 22, experience_years: 6, is_available: true,
    image_url: 'https://images.unsplash.com/photo-1622286346003-c5c7e63b1b87?auto=format&fit=crop&q=80&w=400',
    ai_summary: 'Customers highlight his sharp fades and modern color blending skills.'
  },
];

const ALL_SERVICES = ['haircut', 'beard', 'facial', 'waxing', 'threading', 'bridal', 'makeup', 'hair color'];
const ALL_AREAS = ['Dharampeth', 'Sitabuldi', 'Sadar', 'Ramdaspeth', 'Manish Nagar', 'Ambazari'];

const pillStyle = (active) => ({
  fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px',
  padding: '6px 14px', border: '2px solid var(--border)',
  background: active ? '#F5C842' : 'var(--bg-card)',
  color: 'var(--text-primary)',
  boxShadow: active ? '2px 2px 0 var(--shadow)' : 'none',
  cursor: 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase',
  transition: 'all 0.12s',
});

export default function Browse() {
  const [query, setQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [selectedPro, setSelectedPro] = useState(null);
  const [panelPro, setPanelPro] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const handleBookInitiate = (pro) => { setSelectedPro(pro); setIsBookingOpen(true); };

  const filtered = useMemo(() => {
    return allProfessionals.filter(p => {
      const matchesQuery = query === '' ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.area.toLowerCase().includes(query.toLowerCase()) ||
        p.services.some(s => s.includes(query.toLowerCase()));
      const matchesService = serviceFilter === 'all' || p.services.includes(serviceFilter);
      const matchesArea = areaFilter === 'all' || p.area === areaFilter;
      return matchesQuery && matchesService && matchesArea;
    });
  }, [query, serviceFilter, areaFilter]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px 40px' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          NAGPUR MARKETPLACE
        </h1>
        <p style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Browse, filter, or search to find the best home styling professionals
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '16px' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, service, or area..."
          style={{
            width: '100%', padding: '12px 14px 12px 38px',
            border: '2.5px solid var(--border)', background: 'var(--bg-card)',
            color: 'var(--text-primary)', fontFamily: 'Inter', fontSize: '13px',
            fontWeight: 500, boxShadow: '4px 4px 0 var(--shadow)', outline: 'none',
          }}
        />
      </div>

      {/* Service filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
        <button onClick={() => setServiceFilter('all')} style={pillStyle(serviceFilter === 'all')}>All Services</button>
        {ALL_SERVICES.map(s => (
          <button key={s} onClick={() => setServiceFilter(s)} style={pillStyle(serviceFilter === s)}>{s}</button>
        ))}
      </div>

      {/* Area filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <button onClick={() => setAreaFilter('all')} style={pillStyle(areaFilter === 'all')}>All Areas</button>
        {ALL_AREAS.map(a => (
          <button key={a} onClick={() => setAreaFilter(a)} style={pillStyle(areaFilter === a)}>{a}</button>
        ))}
      </div>

      <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
        Showing {filtered.length} professional{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '2.5px dashed var(--border)', color: 'var(--text-muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>
          No professionals match your filters
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {filtered.map(pro => (
            <ProfessionalCard key={pro.id} professional={pro} onBook={handleBookInitiate} onViewProfile={setPanelPro} />
          ))}
        </div>
      )}

      <BookingModal professional={selectedPro} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} onBookingSuccess={() => {}} />
      <ProfessionalPanel professional={panelPro} isOpen={!!panelPro} onClose={() => setPanelPro(null)} onBook={handleBookInitiate} />
    </div>
  );
}