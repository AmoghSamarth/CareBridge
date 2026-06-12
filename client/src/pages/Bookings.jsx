import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ConfidenceRating from '../components/ConfidenceRating';
import { Clock, MapPin, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { db, isFirebaseInitialized } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
  {[
    { label: 'TOTAL BOOKINGS', value: bookings.length, color: '#F5C842' },
    { label: 'UPCOMING', value: bookings.filter(b => b.status === 'confirmed').length, color: '#2EC4B6' },
    { label: 'COMPLETED', value: bookings.filter(b => b.status === 'completed').length, color: '#F03E7A' },
  ].map(stat => (
    <div key={stat.label} style={{
      background: stat.color, border: '2.5px solid var(--border)',
      boxShadow: '4px 4px 0 var(--shadow)', padding: '16px', textAlign: 'center'
    }}>
      <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '28px', color: '#1A1A1A' }}>{stat.value}</div>
      <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '9px', color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>{stat.label}</div>
    </div>
  ))}
</div>

const pill = (bg, text, children) => ({
  display: 'inline-block', background: bg, color: text,
  border: '1.5px solid #1A1A1A', padding: '2px 10px',
  fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px',
  textTransform: 'uppercase', letterSpacing: '0.05em',
  boxShadow: '1.5px 1.5px 0 #1A1A1A'
});

export default function Bookings({ setActiveTab }) {
  const { user } = useAuth();
  const [activeTab, setActiveTabState] = useState('upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);

  useEffect(() => {
    if (!user) return;
    let unsubscribe = () => {};
    if (isFirebaseInitialized && db) {
      const q = query(collection(db, 'bookings'), where('user_id', '==', user.uid));
      unsubscribe = onSnapshot(q, snapshot => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data(), booking_date: d.data().booking_date || d.data().bookingDate, professional_name: d.data().professional_name || d.data().professionalName, is_emergency: d.data().is_emergency ?? d.data().isEmergency, wingman_recommended: d.data().wingman_recommended ?? d.data().wingmanRecommended }));
        setBookings(list); setLoading(false);
      }, () => loadLocalBookings());
    } else { loadLocalBookings(); }
    return () => unsubscribe();
  }, [user]);

  const loadLocalBookings = () => {
    const key = `carebridge_bookings_${user.uid}`;
    const saved = localStorage.getItem(key);
    if (saved) { try { setBookings(JSON.parse(saved)); } catch { setBookings([]); } }
    else {
      const defaults = [{ id: 'demo-book-1', professional_name: 'Mohit Thakur', service: 'haircut', booking_date: new Date(Date.now() - 4*24*60*60*1000).toISOString(), slot: '5:00 PM', status: 'completed', area: 'Sadar', is_emergency: false, confidence_score: 0, wingman_recommended: true }];
      localStorage.setItem(key, JSON.stringify(defaults)); setBookings(defaults);
    }
    setLoading(false);
  };

  const updateBooking = async (id, data) => {
    const key = `carebridge_bookings_${user.uid}`;
    let list = []; try { list = JSON.parse(localStorage.getItem(key)) || []; } catch {}
    const updated = list.map(b => b.id === id ? { ...b, ...data } : b);
    localStorage.setItem(key, JSON.stringify(updated)); setBookings(updated);
    if (isFirebaseInitialized && db) { try { await updateDoc(doc(db, 'bookings', id), data); } catch {} }
    try { await fetch(`/api/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); } catch {}
  };

  const upcoming = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const past = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const tabBtn = (id, label, count) => (
    <button onClick={() => setActiveTabState(id)} style={{
      flex: 1, padding: '14px', background: activeTab === id ? '#F5C842' : '#fff',
      border: 'none', borderRight: id === 'upcoming' ? '2.5px solid #1A1A1A' : 'none',
      fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px',
      textTransform: 'uppercase', letterSpacing: '0.06em', color: '#1A1A1A',
      cursor: 'pointer', transition: 'background 0.15s'
    }}>
      {label} ({count})
    </button>
  );

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 20px 40px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 'clamp(24px, 4vw, 32px)', color: '#1A1A1A', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          YOUR APPOINTMENTS
        </h1>
        <p style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Track visits · Rate confidence · Let Wingman learn
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', border: '2.5px solid #1A1A1A', boxShadow: '5px 5px 0 #1A1A1A', marginBottom: '24px', background: '#fff' }}>
        {tabBtn('upcoming', 'Upcoming', upcoming.length)}
        {tabBtn('past', 'Past History', past.length)}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Syncing bookings...</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeTab === 'upcoming' && (
            upcoming.length > 0 ? upcoming.map(b => (
              <div key={b.id} style={{ background: '#fff', border: '2.5px solid #1A1A1A', padding: '20px 24px', boxShadow: '5px 5px 0 #1A1A1A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={pill('#F5C842', '#1A1A1A')}>{b.service}</span>
                    {b.is_emergency && <span style={pill('#FF6B35', '#1A1A1A')}>Emergency</span>}
                    {b.wingman_recommended && <span style={pill('#2EC4B6', '#1A1A1A')}>✦ Wingman Pick</span>}
                  </div>
                  <h4 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '16px', color: '#1A1A1A', margin: 0 }}>
                    {(b.professional_name || 'Professional').toUpperCase()}
                  </h4>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, color: '#6B6B6B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} strokeWidth={2.5} /> {b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Date TBD'} · {b.slot || '—'}
                    </span>
                    <span style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, color: '#6B6B6B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} strokeWidth={2.5} /> {b.area || 'Nagpur'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {cancelConfirmId === b.id ? (
                    <>
                      <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', color: '#FF6B35', alignSelf: 'center' }}>Sure?</span>
                      <button onClick={() => { updateBooking(b.id, { status: 'cancelled' }); setCancelConfirmId(null); }} style={{ background: '#FF6B35', border: '2px solid #1A1A1A', color: '#1A1A1A', padding: '8px 14px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', cursor: 'pointer', boxShadow: '2px 2px 0 #1A1A1A' }}>YES</button>
                      <button onClick={() => setCancelConfirmId(null)} style={{ background: '#fff', border: '2px solid #1A1A1A', color: '#1A1A1A', padding: '8px 14px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', cursor: 'pointer', boxShadow: '2px 2px 0 #1A1A1A' }}>NO</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setCancelConfirmId(b.id)} style={{ background: '#fff', border: '2px solid #1A1A1A', color: '#1A1A1A', padding: '8px 14px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', cursor: 'pointer', boxShadow: '2px 2px 0 #1A1A1A' }}>CANCEL</button>
                      <button onClick={() => updateBooking(b.id, { status: 'completed' })} style={{ background: '#2EC4B6', border: '2px solid #1A1A1A', color: '#1A1A1A', padding: '8px 14px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', cursor: 'pointer', boxShadow: '2px 2px 0 #1A1A1A' }}>COMPLETE</button>
                    </>
                  )}
                </div>
              </div>
            )) : (
              <div style={{ background: '#fff', border: '2.5px solid #1A1A1A', padding: '48px 24px', textAlign: 'center', boxShadow: '5px 5px 0 #1A1A1A' }}>
                <AlertCircle size={32} strokeWidth={2} style={{ color: '#6B6B6B', marginBottom: '16px' }} />
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '14px', color: '#1A1A1A', textTransform: 'uppercase', marginBottom: '8px' }}>No upcoming visits</p>
                <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', marginBottom: '20px' }}>Book a professional or ask Wingman for a recommendation.</p>
                {setActiveTab && (
                  <button onClick={() => setActiveTab('browse')} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F5C842', border: '2px solid #1A1A1A', color: '#1A1A1A', padding: '10px 20px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', cursor: 'pointer', boxShadow: '3px 3px 0 #1A1A1A' }}>
                    BROWSE STYLISTS <ArrowRight size={13} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            )
          )}

          {activeTab === 'past' && (
            past.length > 0 ? past.map(b => (
              <div key={b.id} style={{ background: '#fff', border: '2.5px solid #1A1A1A', padding: '20px 24px', boxShadow: '5px 5px 0 #1A1A1A' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={pill('#F03E7A', '#fff')}>{b.service}</span>
                      <span style={pill(b.status === 'completed' ? '#2EC4B6' : '#FF6B35', '#1A1A1A')}>{b.status}</span>
                    </div>
                    <h4 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '15px', color: '#1A1A1A', margin: 0 }}>{(b.professional_name || 'Professional').toUpperCase()}</h4>
                    <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', margin: 0 }}>{b.booking_date ? new Date(b.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Date TBD'} · {b.slot || '—'}</p>
                  </div>
                  {b.confidence_score > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F5C842', border: '2px solid #1A1A1A', padding: '4px 12px', boxShadow: '2px 2px 0 #1A1A1A' }}>
                      <Sparkles size={13} strokeWidth={2.5} />
                      <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px' }}>{b.confidence_score}/5</span>
                    </div>
                  )}
                </div>
                {b.status === 'completed' && b.confidence_score === 0 && (
                  <div style={{ borderTop: '2px dashed #1A1A1A', paddingTop: '16px', marginTop: '8px' }}>
                    <ConfidenceRating bookingId={b.id} proName={b.professional_name} service={b.service} onRateSubmitted={score => updateBooking(b.id, { confidence_score: score })} />
                  </div>
                )}
              </div>
            )) : (
              <div style={{ background: '#fff', border: '2.5px solid #1A1A1A', padding: '48px 24px', textAlign: 'center', boxShadow: '5px 5px 0 #1A1A1A' }}>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '13px', color: '#6B6B6B', textTransform: 'uppercase' }}>No completed bookings yet.</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}