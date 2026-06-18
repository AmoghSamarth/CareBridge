import React, { useState, useMemo, useCallback } from 'react';
import ProfessionalCard from '../components/ProfessionalCard';
import BookingModal from '../components/BookingModal';
import ProfessionalPanel from '../components/ProfessionalPanel';
import { Search } from 'lucide-react';

const STATIC_PROFESSIONALS = [
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

// Offline NLP search fallback
function localNlpFilter(query, professionals) {
  const q = query.toLowerCase();
  const serviceKeywords = ['haircut', 'beard', 'facial', 'waxing', 'threading', 'bridal', 'makeup', 'mehendi', 'hair', 'color', 'nail'];
  const nagpurAreas = ['dharampeth', 'sitabuldi', 'sadar', 'ramdaspeth', 'civil lines', 'manish nagar', 'ambazari', 'bajaj nagar', 'shankar nagar', 'laxmi nagar'];

  let serviceMatch = null, areaMatch = null, maxBudget = null;

  for (const s of serviceKeywords) { if (q.includes(s)) { serviceMatch = s; break; } }
  for (const a of nagpurAreas) { if (q.includes(a)) { areaMatch = a; break; } }

  const budgetMatch = q.match(/(?:under|below|less than|max|budget|rs\.?|inr)?\s*(\d+)/i);
  if (budgetMatch) maxBudget = parseInt(budgetMatch[1], 10);

  let results = [...professionals];
  if (serviceMatch) results = results.filter(p => p.services?.some(s => s.toLowerCase().includes(serviceMatch)));
  if (areaMatch) results = results.filter(p => p.area?.toLowerCase().includes(areaMatch));
  if (maxBudget) results = results.filter(p => {
    if (!p.price_range) return true;
    const min = parseInt(p.price_range.split('-')[0], 10) || 0;
    return min <= maxBudget;
  });
  results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return results;
}

export default function Browse() {
  const [nlpQuery, setNlpQuery] = useState('');
  const [nlpInput, setNlpInput] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [areaFilter, setAreaFilter] = useState('all');
  const [selectedPro, setSelectedPro] = useState(null);
  const [panelPro, setPanelPro] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [aiResults, setAiResults] = useState(null); // null = not searched, [] = no results
  const [aiExtracted, setAiExtracted] = useState(null);
  const [aiSearching, setAiSearching] = useState(false);
  const [searchMode, setSearchMode] = useState('filter'); // 'filter' | 'ai'

  const handleBookInitiate = (pro) => { setSelectedPro(pro); setIsBookingOpen(true); };

  // AI NLP search
  const handleNlpSearch = useCallback(async (e) => {
    if (e.key !== 'Enter' || !nlpInput.trim()) return;
    setAiSearching(true);
    setSearchMode('ai');
    const q = nlpInput.trim();
    setNlpQuery(q);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      if (!res.ok) throw new Error('Server error');
      const data = await res.json();
      if (data.success) {
        setAiResults(data.results);
        setAiExtracted(data.extracted);
      } else {
        throw new Error('API returned failure');
      }
    } catch {
      // Offline fallback: local keyword parse
      const fallback = localNlpFilter(q, STATIC_PROFESSIONALS);
      setAiResults(fallback);
      setAiExtracted(null);
    } finally {
      setAiSearching(false);
    }
  }, [nlpInput]);

  const clearAiSearch = () => {
    setAiResults(null);
    setAiExtracted(null);
    setNlpQuery('');
    setNlpInput('');
    setSearchMode('filter');
  };

  // Regular filter results
  const filtered = useMemo(() => {
    return STATIC_PROFESSIONALS.filter(p => {
      const matchesService = serviceFilter === 'all' || p.services.includes(serviceFilter);
      const matchesArea = areaFilter === 'all' || p.area === areaFilter;
      return matchesService && matchesArea;
    });
  }, [serviceFilter, areaFilter]);

  // Decide what to show
  const displayPros = searchMode === 'ai' && aiResults !== null ? aiResults : filtered;
  const isAiMode = searchMode === 'ai' && aiResults !== null;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px 40px' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 'clamp(24px, 4vw, 36px)', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          NAGPUR MARKETPLACE
        </h1>
        <p style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Browse, filter, or use AI search to find the best home styling professionals
        </p>
      </div>

      {/* AI NLP Search */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: aiSearching ? '#F03E7A' : 'var(--text-muted)' }} />
          <input
            value={nlpInput}
            onChange={e => setNlpInput(e.target.value)}
            onKeyDown={handleNlpSearch}
            placeholder='AI Search: try "haircut under 300 near Dharampeth" and press Enter'
            style={{
              width: '100%', padding: '13px 44px 13px 40px',
              border: '2.5px solid var(--border)', background: 'var(--bg-card)',
              color: 'var(--text-primary)', fontFamily: 'Inter', fontSize: '13px',
              fontWeight: 500, boxShadow: '4px 4px 0 var(--shadow)', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {aiSearching && (
            <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', color: '#F03E7A', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Searching…
            </div>
          )}
        </div>

        {/* AI matched badge + clear button */}
        {isAiMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F03E7A', border: '2px solid #1A1A1A', color: '#fff', padding: '4px 12px', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', boxShadow: '2px 2px 0 #1A1A1A' }}>
              <span>✦</span> AI MATCHED
            </div>
            {aiExtracted && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {aiExtracted.service_type && <span style={{ background: '#F5C842', border: '1.5px solid #1A1A1A', padding: '3px 10px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase' }}>{aiExtracted.service_type}</span>}
                {aiExtracted.area && <span style={{ background: '#2EC4B6', border: '1.5px solid #1A1A1A', padding: '3px 10px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase' }}>{aiExtracted.area}</span>}
                {aiExtracted.max_budget && <span style={{ background: '#fff', border: '1.5px solid #1A1A1A', padding: '3px 10px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', textTransform: 'uppercase' }}>Max ₹{aiExtracted.max_budget}</span>}
              </div>
            )}
            <button onClick={clearAiSearch} style={{ background: 'none', border: '1.5px solid var(--border)', color: 'var(--text-muted)', padding: '3px 12px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ✕ CLEAR
            </button>
          </div>
        )}
      </div>

      {/* Filter pills — only show in filter mode */}
      {!isAiMode && (
        <>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
            <button onClick={() => setServiceFilter('all')} style={pillStyle(serviceFilter === 'all')}>All Services</button>
            {ALL_SERVICES.map(s => (
              <button key={s} onClick={() => setServiceFilter(s)} style={pillStyle(serviceFilter === s)}>{s}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <button onClick={() => setAreaFilter('all')} style={pillStyle(areaFilter === 'all')}>All Areas</button>
            {ALL_AREAS.map(a => (
              <button key={a} onClick={() => setAreaFilter(a)} style={pillStyle(areaFilter === a)}>{a}</button>
            ))}
          </div>
        </>
      )}

      {isAiMode && <div style={{ marginBottom: '24px' }} />}

      <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
        {isAiMode ? `AI found ${displayPros.length} match${displayPros.length !== 1 ? 'es' : ''} for "${nlpQuery}"` : `Showing ${displayPros.length} professional${displayPros.length !== 1 ? 's' : ''}`}
      </p>

      {displayPros.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '2.5px dashed var(--border)', color: 'var(--text-muted)', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase' }}>
          {isAiMode ? `No professionals match "${nlpQuery}". Try a different query.` : 'No professionals match your filters'}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {displayPros.map(pro => (
            <div key={pro.id} style={{ position: 'relative' }}>
              {isAiMode && (
                <div style={{ position: 'absolute', top: '-8px', right: '-4px', zIndex: 10, background: '#F03E7A', border: '2px solid #1A1A1A', color: '#fff', padding: '2px 8px', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.06em', boxShadow: '1px 1px 0 #1A1A1A' }}>
                  ✦ AI MATCH
                </div>
              )}
              <ProfessionalCard professional={pro} onBook={handleBookInitiate} onViewProfile={setPanelPro} />
            </div>
          ))}
        </div>
      )}

      <BookingModal professional={selectedPro} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} onBookingSuccess={() => { }} />
      <ProfessionalPanel professional={panelPro} isOpen={!!panelPro} onClose={() => setPanelPro(null)} onBook={handleBookInitiate} />
    </div>
  );
}