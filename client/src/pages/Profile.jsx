import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWingman } from '../context/WingmanContext';
import { db, isFirebaseInitialized } from '../lib/firebase';
import { getLandingUrl } from '../lib/urls';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { Settings, Calendar, Plus, Trash2, Sparkles, LogOut, RefreshCw, Trash } from 'lucide-react';

const S = {
  card: { background: '#fff', border: '2.5px solid #1A1A1A', boxShadow: '5px 5px 0 #1A1A1A', padding: '24px' },
  label: { fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em' },
  sectionTitle: { fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '16px', color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' },
  pill: (bg) => ({ display: 'inline-block', background: bg, border: '1.5px solid #1A1A1A', padding: '3px 10px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', boxShadow: '2px 2px 0 #1A1A1A' }),
};

function Field({ label, value, options, isDropdown, onSave }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value);
  useEffect(() => setVal(value), [value]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1.5px solid rgba(26,26,26,0.1)' }}>
      <span style={S.label}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {editing ? (
          <>
            {isDropdown ? (
              <select value={val} onChange={e => setVal(e.target.value)} style={{ background: '#fff', border: '2px solid #1A1A1A', color: '#1A1A1A', padding: '4px 8px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', outline: 'none' }}>
                {options.map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
              </select>
            ) : (
              <input value={val} onChange={e => setVal(e.target.value)} style={{ background: '#fff', border: '2px solid #1A1A1A', color: '#1A1A1A', padding: '4px 8px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', outline: 'none', width: '120px' }} />
            )}
            <button onClick={() => { onSave(val); setEditing(false); }} style={{ background: '#2EC4B6', border: '2px solid #1A1A1A', color: '#1A1A1A', padding: '4px 12px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', cursor: 'pointer', boxShadow: '2px 2px 0 #1A1A1A' }}>SAVE</button>
            <button onClick={() => { setVal(value); setEditing(false); }} style={{ background: 'none', border: 'none', color: '#6B6B6B', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', cursor: 'pointer' }}>CANCEL</button>
          </>
        ) : (
          <>
            <span style={S.pill('#F5C842')}>{value || 'NOT SET'}</span>
            <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1A1A1A', display: 'flex', alignItems: 'center', padding: '4px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const { onboardingData, updateOnboardingData, resetOnboarding } = useWingman();
  const [twinData, setTwinData] = useState({ hairType: onboardingData.hairType || 'Straight', skinType: onboardingData.skinType || 'Normal', groomFrequency: onboardingData.groomFrequency || 'Monthly', budgetRange: onboardingData.budgetRange || '₹300–600', priority: onboardingData.priority || 'Confidence', location: onboardingData.location || 'Nagpur' });
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ eventType: 'Interview', eventDate: '' });
  const [confidenceBookings, setConfidenceBookings] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pendingRatings, setPendingRatings] = useState({});
  const [confidenceInsights, setConfidenceInsights] = useState({});
  const [ratingLoading, setRatingLoading] = useState({});
  const todayStr = new Date().toISOString().split('T')[0];
  const eventEmojis = { Interview: '💼', Wedding: '💒', Party: '🎉', Festival: '🎆', 'Date Night': '💖', Other: '📅' };

  useEffect(() => {
    if (!user) return;
    setTwinData({ hairType: onboardingData.hairType || 'Straight', skinType: onboardingData.skinType || 'Normal', groomFrequency: onboardingData.groomFrequency || 'Monthly', budgetRange: onboardingData.budgetRange || '₹300–600', priority: onboardingData.priority || 'Confidence', location: onboardingData.location || 'Nagpur' });
    const load = async () => {
      if (isFirebaseInitialized && db) {
        try { const snap = await getDoc(doc(db, 'users', user.uid)); if (snap.exists()) { const d = snap.data(); setTwinData(p => ({ ...p, ...d })); } } catch {}
      }
      let evts = [];
      const local = localStorage.getItem(`carebridge_events_${user.uid}`);
      if (local) evts = JSON.parse(local);
      if (isFirebaseInitialized && db) {
        try { const qs = await getDocs(collection(db, 'users', user.uid, 'events')); const fb = qs.docs.map(d => ({ id: d.id, ...d.data() })); if (fb.length > 0) evts = fb; } catch {}
      }
      evts.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
      setEvents(evts);
    };
    load();
  }, [user, onboardingData]);

  useEffect(() => {
    if (!user) return;
    const local = localStorage.getItem(`carebridge_bookings_${user.uid}`) || '[]';
    const list = JSON.parse(local);
    // Show bookings that have a score AND bookings that don't (for interactive rating)
    const sorted = [...list].sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
    setConfidenceBookings(sorted.slice(0, 6));
  }, [user]);

  const saveField = async (field, value) => {
    setTwinData(p => ({ ...p, [field]: value }));
    updateOnboardingData(field, value);
    if (isFirebaseInitialized && db && user) { try { await setDoc(doc(db, 'users', user.uid), { [field]: value }, { merge: true }); } catch {} }
  };

  const addEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.eventDate) return;
    const payload = { eventType: newEvent.eventType, eventDate: newEvent.eventDate, created_at: new Date().toISOString() };
    let id = `evt_${Date.now()}`;
    if (isFirebaseInitialized && db && user) { try { const ref = await addDoc(collection(db, 'users', user.uid, 'events'), payload); id = ref.id; } catch {} }
    const added = [...events, { id, ...payload }].sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    setEvents(added);
    localStorage.setItem(`carebridge_events_${user.uid}`, JSON.stringify(added));
    updateOnboardingData('upcomingEvent', { eventType: newEvent.eventType, eventDate: newEvent.eventDate });
    setNewEvent({ eventType: 'Interview', eventDate: '' });
    setShowEventForm(false);
  };

  const removeEvent = async (id) => {
    if (isFirebaseInitialized && db && user) { try { await deleteDoc(doc(db, 'users', user.uid, 'events', id)); } catch {} }
    const filtered = events.filter(e => e.id !== id);
    setEvents(filtered);
    localStorage.setItem(`carebridge_events_${user.uid}`, JSON.stringify(filtered));
    updateOnboardingData('upcomingEvent', filtered.length > 0 ? { eventType: filtered[0].eventType, eventDate: filtered[0].eventDate } : { eventType: '', eventDate: '' });
  };

  const retakeOnboarding = async () => {
    resetOnboarding();
    if (isFirebaseInitialized && db && user) { try { await setDoc(doc(db, 'users', user.uid), { onboarding_complete: false }, { merge: true }); } catch {} }
    window.location.reload();
  };

  const rateBooking = async (booking, stars) => {
    if (!user) return;
    setRatingLoading(prev => ({ ...prev, [booking.id]: true }));

    // Persist score locally
    const local = localStorage.getItem(`carebridge_bookings_${user.uid}`) || '[]';
    const list = JSON.parse(local);
    const updated = list.map(b => b.id === booking.id ? { ...b, confidence_score: stars } : b);
    localStorage.setItem(`carebridge_bookings_${user.uid}`, JSON.stringify(updated));
    setConfidenceBookings(updated.slice(0, 6));

    // Call confidence-learn API
    try {
      const res = await fetch('/api/wingman/confidence-learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          bookingId: booking.id,
          confidenceScore: stars,
          professionalId: booking.professionalId || booking.professional_id,
          service: booking.service || booking.serviceName
        })
      });
      const data = await res.json();
      if (data.success && data.insight) {
        setConfidenceInsights(prev => ({ ...prev, [booking.id]: data.insight }));
      }
    } catch {
      // Offline fallback insight
      const proName = booking.professionalName || booking.professional_name || 'your groomer';
      setConfidenceInsights(prev => ({
        ...prev,
        [booking.id]: `${stars >= 4 ? 'Great choice!' : 'Got it.'} Your ${stars}-star rating for ${proName} helps me refine your future recommendations.`
      }));
    } finally {
      setRatingLoading(prev => ({ ...prev, [booking.id]: false }));
    }
  };

  const signOut = async () => { await logout(); window.location.href = getLandingUrl(); };
  const deleteAccount = async () => {
    if (isFirebaseInitialized && db && user) { try { await deleteDoc(doc(db, 'users', user.uid)); } catch {} }
    await logout(); window.location.href = getLandingUrl();
  };

  const renderStars = (score) => (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= score ? '#F5C842' : 'none'} stroke="#1A1A1A" strokeWidth="2.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );

  const gap = { display: 'flex', flexDirection: 'column', gap: '32px' };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 20px 40px', ...gap }}>

      {/* Profile Header Card */}
      <div style={{ ...S.card, display: 'flex', alignItems: 'center', gap: '20px' }}>
        <img src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} alt="avatar"
          style={{ width: '72px', height: '72px', borderRadius: '50%', border: '3px solid #1A1A1A', objectFit: 'cover', flexShrink: 0, boxShadow: '3px 3px 0 #1A1A1A' }} />
        <div>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '22px', color: '#1A1A1A', letterSpacing: '-0.01em', marginBottom: '4px' }}>
            {(user?.displayName || 'CAREBRIDGE MEMBER').toUpperCase()}
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B6B6B', marginBottom: '8px' }}>{user?.email}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B6B6B', fontWeight: 600 }}>Member since June 2026</span>
            <span style={S.pill('#F5C842')}>GOLD PASS</span>
          </div>
        </div>
      </div>

      {/* Beauty Twin */}
      <section>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={S.sectionTitle}><Settings size={18} strokeWidth={2.5} /> YOUR BEAUTY TWIN</h3>
          <p style={S.label}>How Wingman knows your style</p>
        </div>
        <div style={S.card}>
          <Field label="Hair Type" value={twinData.hairType} options={['Straight','Wavy','Curly','Coily']} isDropdown onSave={v => saveField('hairType', v)} />
          <Field label="Skin Type" value={twinData.skinType} options={['Oily','Dry','Combination','Normal']} isDropdown onSave={v => saveField('skinType', v)} />
          <Field label="Groom Frequency" value={twinData.groomFrequency} options={['Weekly','Bi-weekly','Monthly','Rarely']} isDropdown onSave={v => saveField('groomFrequency', v)} />
          <Field label="Budget Range" value={twinData.budgetRange} options={['100-300','300-600','600-1200','1200+']} isDropdown onSave={v => saveField('budgetRange', v)} />
          <Field label="Priority" value={twinData.priority} options={['Confidence','Routine','First Impressions','Looking Fresh']} isDropdown onSave={v => saveField('priority', v)} />
          <Field label="Location / Area" value={twinData.location} onSave={v => saveField('location', v)} />
        </div>
      </section>

      {/* Events */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h3 style={S.sectionTitle}><Calendar size={18} strokeWidth={2.5} /> YOUR EVENTS</h3>
            <p style={S.label}>Wingman monitors these dates</p>
          </div>
          <button onClick={() => setShowEventForm(!showEventForm)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '2.5px solid #1A1A1A', color: '#1A1A1A', padding: '8px 16px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', cursor: 'pointer', boxShadow: '3px 3px 0 #1A1A1A', letterSpacing: '0.06em' }}>
            <Plus size={13} strokeWidth={2.5} /> ADD EVENT
          </button>
        </div>
        <div style={S.card}>
          {showEventForm && (
            <form onSubmit={addEvent} style={{ background: '#FFF8F0', border: '2px solid #1A1A1A', padding: '16px', marginBottom: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end', boxShadow: '3px 3px 0 #1A1A1A' }}>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <p style={{ ...S.label, marginBottom: '6px' }}>Event Type</p>
                <select value={newEvent.eventType} onChange={e => setNewEvent({ ...newEvent, eventType: e.target.value })} style={{ width: '100%', background: '#fff', border: '2px solid #1A1A1A', padding: '8px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', outline: 'none' }}>
                  {['Interview','Wedding','Date Night','Festival','Party','Other'].map(o => <option key={o} value={o}>{o.toUpperCase()}</option>)}
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '140px' }}>
                <p style={{ ...S.label, marginBottom: '6px' }}>Date</p>
                <input type="date" min={todayStr} value={newEvent.eventDate} onChange={e => setNewEvent({ ...newEvent, eventDate: e.target.value })} required style={{ width: '100%', background: '#fff', border: '2px solid #1A1A1A', padding: '8px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" onClick={() => setShowEventForm(false)} style={{ background: 'none', border: 'none', color: '#6B6B6B', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}>CANCEL</button>
                <button type="submit" style={{ background: '#F5C842', border: '2.5px solid #1A1A1A', color: '#1A1A1A', padding: '8px 20px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', cursor: 'pointer', boxShadow: '2px 2px 0 #1A1A1A' }}>ADD</button>
              </div>
            </form>
          )}
          {events.length === 0 ? (
            <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', textAlign: 'center', padding: '20px 0', fontWeight: 600 }}>No events scheduled. Add one to let Wingman sync your plan.</p>
          ) : events.map(evt => (
            <div key={evt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1.5px solid rgba(26,26,26,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '22px' }}>{eventEmojis[evt.eventType] || '📅'}</span>
                <div>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', color: '#1A1A1A', margin: 0 }}>{evt.eventType.toUpperCase()}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B6B6B', margin: 0, fontWeight: 600 }}>{new Date(evt.eventDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              <button onClick={() => removeEvent(evt.id)} style={{ background: '#fff', border: '1.5px solid #1A1A1A', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '1.5px 1.5px 0 #1A1A1A' }}>
                <Trash2 size={14} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Confidence Log */}
      <section>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={S.sectionTitle}><Sparkles size={18} strokeWidth={2.5} /> CONFIDENCE LOG</h3>
          <p style={S.label}>Wingman learns from how you felt after each session</p>
        </div>
        <div style={S.card}>
          {confidenceBookings.length === 0 ? (
            <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', textAlign: 'center', padding: '20px 0', fontWeight: 600 }}>Complete a booking and rate how you felt. Wingman learns from this.</p>
          ) : confidenceBookings.map(b => {
            const score = b.confidence_score !== undefined ? b.confidence_score : b.confidenceScore;
            const rated = score !== undefined && score !== null;
            const pending = pendingRatings[b.id];
            const loading = ratingLoading[b.id];
            const insight = confidenceInsights[b.id];
            return (
              <div key={b.id} style={{ padding: '14px 0', borderBottom: '1.5px solid rgba(26,26,26,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', color: '#1A1A1A', margin: '0 0 2px' }}>{(b.professionalName || b.professional_name || 'GROOMING EXPERT').toUpperCase()}</p>
                    <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#F03E7A', fontWeight: 700, margin: '0 0 2px', textTransform: 'uppercase' }}>{b.serviceName || b.service}</p>
                    <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B6B6B', margin: 0, fontWeight: 600 }}>{new Date(b.date || b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    {rated ? (
                      renderStars(score)
                    ) : (
                      <div>
                        <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px' }}>Rate it</p>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[1,2,3,4,5].map(i => (
                            <button
                              key={i}
                              disabled={loading}
                              onClick={() => { setPendingRatings(p => ({ ...p, [b.id]: i })); rateBooking(b, i); }}
                              style={{ background: 'none', border: 'none', cursor: loading ? 'wait' : 'pointer', padding: '1px', opacity: loading ? 0.5 : 1 }}
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24"
                                fill={(pending !== undefined ? i <= pending : false) ? '#F5C842' : 'none'}
                                stroke="#1A1A1A" strokeWidth="2.5">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                              </svg>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* AI insight shown after rating */}
                {insight && (
                  <div style={{ marginTop: '10px', background: '#FFF8F0', border: '1.5px solid #1A1A1A', padding: '10px 14px', boxShadow: '2px 2px 0 #1A1A1A', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>✦</span>
                    <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#1A1A1A', margin: 0, fontWeight: 600, lineHeight: 1.5 }}>{insight}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Account Settings */}
      <section>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '16px', color: '#1A1A1A', margin: 0 }}>ACCOUNT SETTINGS</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={retakeOnboarding} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#2EC4B6', border: '2.5px solid #1A1A1A', color: '#1A1A1A', padding: '14px', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px', letterSpacing: '0.06em', cursor: 'pointer', boxShadow: '4px 4px 0 #1A1A1A', transition: 'transform 0.12s, box-shadow 0.12s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #1A1A1A'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 #1A1A1A'; }}>
            <RefreshCw size={15} strokeWidth={2.5} /> RETAKE ONBOARDING
          </button>
          <button onClick={signOut} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#fff', border: '2.5px solid #1A1A1A', color: '#1A1A1A', padding: '14px', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px', letterSpacing: '0.06em', cursor: 'pointer', boxShadow: '4px 4px 0 #1A1A1A', transition: 'transform 0.12s, box-shadow 0.12s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #1A1A1A'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 #1A1A1A'; }}>
            <LogOut size={15} strokeWidth={2.5} /> SIGN OUT
          </button>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#fff', border: '2.5px solid #1A1A1A', color: '#FF6B35', padding: '14px', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px', letterSpacing: '0.06em', cursor: 'pointer', boxShadow: '4px 4px 0 #1A1A1A' }}>
              <Trash size={15} strokeWidth={2.5} /> DELETE ACCOUNT
            </button>
          ) : (
            <div style={{ background: '#FF6B35', border: '2.5px solid #1A1A1A', padding: '20px', textAlign: 'center', boxShadow: '4px 4px 0 #1A1A1A' }}>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '13px', color: '#1A1A1A', marginBottom: '16px' }}>This cannot be undone. Are you sure?</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button onClick={() => setConfirmDelete(false)} style={{ background: '#fff', border: '2px solid #1A1A1A', color: '#1A1A1A', padding: '8px 20px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px', cursor: 'pointer', boxShadow: '2px 2px 0 #1A1A1A' }}>CANCEL</button>
                <button onClick={deleteAccount} style={{ background: '#1A1A1A', border: '2px solid #fff', color: '#fff', padding: '8px 20px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px', cursor: 'pointer', boxShadow: '2px 2px 0 #fff' }}>CONFIRM DELETE</button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}