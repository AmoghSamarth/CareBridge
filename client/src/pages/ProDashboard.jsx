import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getLandingUrl } from '../lib/urls';
import { db, isFirebaseInitialized } from '../lib/firebase';
import { doc, setDoc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';

const NAGPUR_AREAS = [
  'Dharampeth', 'Sitabuldi', 'Sadar', 'Ramdaspeth', 'Civil Lines',
  'Manish Nagar', 'Wardha Road', 'Pratap Nagar', 'Laxmi Nagar',
  'Ajni', 'Trimurti Nagar', 'Ambazari', 'Bajaj Nagar', 'Shankar Nagar', 'VNIT'
];

const ALL_SERVICES = [
  'haircut', 'beard', 'facial', 'waxing', 'threading', 'bridal',
  'makeup', 'mehendi', 'hair spa', 'hair color', 'nail art',
  'eyebrow shaping', 'cleanup', 'bleach', 'detan', 'full body wax'
];

const DEMO_PROFILE = {
  name: 'Vikram Demo',
  area: 'Civil Lines',
  services: ['haircut', 'beard', 'hair color'],
  priceRange: '200-400',
  experienceYears: '5',
  bio: 'Award-winning stylist with 5 years experience in modern cuts and beard grooming. Certified in advanced coloring techniques.',
  photoUrl: 'https://images.unsplash.com/photo-1622286346003-c5c7e63b1b87?auto=format&fit=crop&q=80&w=400',
};

const S = {
  page: { minHeight: '100vh', background: '#FAE8D8', fontFamily: 'Inter', color: '#1A1A1A' },
  wrap: { maxWidth: '900px', margin: '0 auto', padding: '32px 20px 60px' },
  card: { background: '#fff', border: '2.5px solid #1A1A1A', boxShadow: '5px 5px 0 #1A1A1A', padding: '24px', marginBottom: '24px' },
  label: { fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' },
  input: { width: '100%', background: '#fff', border: '2px solid #1A1A1A', color: '#1A1A1A', padding: '10px 12px', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  btn: (bg = '#F5C842') => ({ background: bg, border: '2.5px solid #1A1A1A', color: '#1A1A1A', padding: '12px 24px', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', letterSpacing: '0.04em', cursor: 'pointer', boxShadow: '3px 3px 0 #1A1A1A', transition: 'all 0.12s', display: 'inline-flex', alignItems: 'center', gap: '8px' }),
  h1: { fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 'clamp(24px, 5vw, 36px)', letterSpacing: '-0.02em', color: '#1A1A1A', marginBottom: '6px' },
  h2: { fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '18px', color: '#1A1A1A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
  pill: (bg, color = '#1A1A1A') => ({ display: 'inline-block', background: bg, border: '2px solid #1A1A1A', color, padding: '4px 12px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', boxShadow: '2px 2px 0 #1A1A1A' }),
};

function hoverBtn(e, enter) {
  if (enter) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '5px 5px 0 #1A1A1A'; }
  else { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #1A1A1A'; }
}

function generateProId(name, area) {
  const slug = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const firstName = name.trim().split(' ')[0];
  return `pro_${slug(area)}_${slug(firstName)}_${Date.now()}`;
}

function CheckboxGrid({ options, selected, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button key={opt} type="button"
            onClick={() => onChange(active ? selected.filter(s => s !== opt) : [...selected, opt])}
            style={{
              background: active ? '#F5C842' : '#fff', border: '2px solid #1A1A1A', color: '#1A1A1A',
              padding: '5px 12px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px',
              cursor: 'pointer', boxShadow: active ? '2px 2px 0 #1A1A1A' : '1px 1px 0 #1A1A1A',
              textTransform: 'uppercase', letterSpacing: '0.03em', transition: 'all 0.1s',
            }}
          >
            {active ? '✓ ' : ''}{opt}
          </button>
        );
      })}
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div style={{ background: '#fff', border: '2.5px solid #1A1A1A', boxShadow: '4px 4px 0 #1A1A1A', padding: '20px' }}>
      <div style={{ fontSize: '24px', marginBottom: '6px' }}>{icon}</div>
      <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '26px', color: '#1A1A1A' }}>{value}</div>
      <div style={{ fontFamily: 'Inter', fontSize: '11px', fontWeight: 600, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>{label}</div>
    </div>
  );
}

function BookingRow({ booking, onAction }) {
  const statusColor = booking.status === 'confirmed' ? '#2EC4B6' : booking.status === 'cancelled' ? '#F03E7A' : '#F5C842';
  return (
    <div style={{ padding: '14px 0', borderBottom: '1.5px solid rgba(26,26,26,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', margin: '0 0 2px' }}>{(booking.userId || 'CUSTOMER').toUpperCase().slice(0, 25)}</p>
          <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', margin: '0 0 4px', fontWeight: 600 }}>{booking.service}</p>
          <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B6B6B', margin: 0 }}>
            {booking.slot} · {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD'} · {booking.area}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ ...S.pill(statusColor), fontSize: '10px' }}>{booking.status}</span>
          {booking.status === 'pending' && onAction && (
            <>
              <button onClick={() => onAction(booking.id, 'confirmed')}
                style={{ ...S.btn('#2EC4B6'), padding: '6px 14px', fontSize: '11px' }}
                onMouseEnter={e => hoverBtn(e, true)} onMouseLeave={e => hoverBtn(e, false)}
              >✓ ACCEPT</button>
              <button onClick={() => onAction(booking.id, 'cancelled')}
                style={{ ...S.btn('#F03E7A'), padding: '6px 14px', fontSize: '11px', color: '#fff' }}
                onMouseEnter={e => hoverBtn(e, true)} onMouseLeave={e => hoverBtn(e, false)}
              >✕ DECLINE</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── TABS ──
const TABS = ['Dashboard', 'Bookings', 'Earnings', 'Settings'];

export default function ProDashboard() {
  const { user, logout } = useAuth();
  const [view, setView] = useState('loading');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [proProfile, setProProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [boostLoading, setBoostLoading] = useState(false);
  const [boostBio, setBoostBio] = useState('');
  const [copied, setCopied] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editSaving, setEditSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', area: 'Dharampeth', services: [], priceRange: '',
    priceMin: '', priceMax: '', experienceYears: '', bio: '', photoUrl: '',
  });

  // Load existing profile on mount
  useEffect(() => {
    const local = localStorage.getItem('carebridge_pro_profile');
    if (local) {
      const parsed = JSON.parse(local);
      setProProfile(parsed);
      setIsAvailable(parsed.is_available !== false);
      setView('dashboard');
    } else if (isFirebaseInitialized && db && user) {
      (async () => {
        try {
          const snap = await getDoc(doc(db, 'professionals', user.uid));
          if (snap.exists()) {
            const data = { id: snap.id, ...snap.data() };
            localStorage.setItem('carebridge_pro_profile', JSON.stringify(data));
            setProProfile(data); setIsAvailable(data.is_available !== false); setView('dashboard');
          } else { setView('form'); }
        } catch { setView('form'); }
      })();
    } else { setView('form'); }
  }, [user]);

  // Subscribe to incoming bookings
  useEffect(() => {
    if (view !== 'dashboard' || !proProfile) return;
    const local = localStorage.getItem(`carebridge_bookings_pro_${proProfile.id}`);
    if (local) { try { setBookings(JSON.parse(local)); } catch {} }
    if (!isFirebaseInitialized || !db) return;
    const q = query(collection(db, 'bookings'), where('professionalId', '==', proProfile.id));
    const unsub = onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setBookings(list);
      localStorage.setItem(`carebridge_bookings_pro_${proProfile.id}`, JSON.stringify(list));
    }, () => {});
    return () => unsub();
  }, [view, proProfile]);

  const saveProfile = async (payload) => {
    if (isFirebaseInitialized && db) {
      try { await setDoc(doc(db, 'professionals', payload.id), payload); } catch {}
    }
    localStorage.setItem('carebridge_pro_profile', JSON.stringify(payload));
    setProProfile(payload);
    setIsAvailable(payload.is_available !== false);
  };

  const buildPayload = (f) => {
    const proId = generateProId(f.name, f.area);
    const priceRange = f.priceMin && f.priceMax ? `${f.priceMin}-${f.priceMax}` : f.priceRange || '200-400';
    return {
      id: proId, name: f.name.trim(), area: f.area,
      services: f.services,
      price_range: priceRange,
      experience_years: parseInt(f.experienceYears, 10) || 1,
      bio: f.bio.trim(),
      image_url: f.photoUrl.trim() || 'https://images.unsplash.com/photo-1622286346003-c5c7e63b1b87?auto=format&fit=crop&q=80&w=400',
      rating: 5.0, review_count: 0, is_available: true, is_featured: false,
      available_slots: ['9:00 AM', '11:00 AM', '2:00 PM', '5:00 PM', '7:00 PM'],
      created_by: user?.uid || 'demo-user-pro',
      created_at: new Date().toISOString(),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Name is required.'); return; }
    if (form.services.length === 0) { setFormError('Select at least one service.'); return; }
    setFormError(''); setSubmitting(true);
    const payload = buildPayload(form);
    await saveProfile(payload);
    setSubmitting(false);
    setView('success');
  };

  const loadDemoProfile = async () => {
    setDemoLoading(true);
    const f = { ...DEMO_PROFILE };
    const payload = buildPayload({ ...f, priceRange: f.priceRange, priceMin: '', priceMax: '' });
    await saveProfile(payload);
    setDemoLoading(false);
    setView('success');
  };

  const toggleAvailability = async () => {
    const newVal = !isAvailable;
    setIsAvailable(newVal);
    const updated = { ...proProfile, is_available: newVal };
    setProProfile(updated);
    localStorage.setItem('carebridge_pro_profile', JSON.stringify(updated));
    if (isFirebaseInitialized && db && proProfile) {
      try { await setDoc(doc(db, 'professionals', proProfile.id), { is_available: newVal }, { merge: true }); } catch {}
    }
  };

  const handleBookingAction = (bookingId, status) => {
    setBookings(prev => {
      const updated = prev.map(b => b.id === bookingId ? { ...b, status } : b);
      if (proProfile) localStorage.setItem(`carebridge_bookings_pro_${proProfile.id}`, JSON.stringify(updated));
      return updated;
    });
    if (isFirebaseInitialized && db) {
      try { setDoc(doc(db, 'bookings', bookingId), { status }, { merge: true }); } catch {}
    }
  };

  const handleWingmanBoost = async () => {
    if (!proProfile) return;
    setBoostLoading(true);
    setBoostBio('');
    try {
      const res = await fetch('/api/wingman/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.uid || 'demo-user-pro',
          triggerType: 'recommendation_request',
          userProfile: {
            name: proProfile.name,
            hairType: 'Professional',
            budgetRange: proProfile.price_range,
            groomFrequency: 'Regular',
            priority: 'Professional Excellence',
            upcomingEvent: { eventType: 'Professional Showcase', eventDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10) }
          }
        })
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let bio = '';
      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          for (const line of chunk.split('\n')) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6).trim();
              if (dataStr === '[DONE]') { done = true; break; }
              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.chunk) { bio += parsed.chunk; setBoostBio(bio); }
              } catch {}
            }
          }
        }
      }
    } catch {
      setBoostBio(`${proProfile.name} in ${proProfile.area} brings ${proProfile.experience_years}+ years of expertise in ${proProfile.services?.join(', ')}. Known for precision, punctuality, and making clients look their absolute best. ₹${proProfile.price_range} — premium quality at Nagpur's best value.`);
    } finally {
      setBoostLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!editForm || !proProfile) return;
    setEditSaving(true);
    const updated = {
      ...proProfile,
      name: editForm.name || proProfile.name,
      area: editForm.area || proProfile.area,
      bio: editForm.bio || proProfile.bio,
      price_range: editForm.price_range || proProfile.price_range,
      experience_years: parseInt(editForm.experience_years, 10) || proProfile.experience_years,
      image_url: editForm.image_url || proProfile.image_url,
      services: editForm.services || proProfile.services,
    };
    await saveProfile(updated);
    setEditSaving(false);
    setEditForm(null);
  };

  // ── LOADING ──
  if (view === 'loading') return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '16px', color: '#6B6B6B' }}>Loading…</div>
    </div>
  );

  // ── DASHBOARD VIEW ──
  if ((view === 'dashboard' || view === 'success') && proProfile) {
    if (view === 'success') {
      // auto-switch to dashboard after 2s if not clicked
      setTimeout(() => setView('dashboard'), 3000);
    }

    const rating = proProfile.rating?.toFixed(1) || '5.0';
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const completedBookings = bookings.filter(b => b.status === 'completed');

    // Mock earnings (₹ per booking × completed count)
    const avgEarning = parseInt((proProfile.price_range || '200-400').split('-')[0], 10) + 100;
    const totalEarnings = completedBookings.length * avgEarning || (bookings.length * avgEarning) || 0;
    const thisMonth = Math.round(totalEarnings * 0.6);
    const lastMonth = Math.round(totalEarnings * 0.4);

    return (
      <div style={S.page}>
        <div style={S.wrap}>
          {/* Success banner */}
          {view === 'success' && (
            <div style={{ background: '#2EC4B6', border: '2.5px solid #1A1A1A', boxShadow: '5px 5px 0 #1A1A1A', padding: '16px 24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '14px', color: '#1A1A1A', margin: '0 0 2px' }}>🎉 Profile Created!</p>
                <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#1A1A1A', fontWeight: 600, margin: 0 }}>Your Pro ID: <strong>{proProfile.id}</strong> — you're now live in the marketplace.</p>
              </div>
              <button onClick={() => { navigator.clipboard?.writeText(proProfile.id); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                style={{ ...S.btn('#F5C842'), fontSize: '11px', padding: '8px 16px' }}
                onMouseEnter={e => hoverBtn(e, true)} onMouseLeave={e => hoverBtn(e, false)}
              >{copied ? '✓ COPIED!' : 'COPY ID'}</button>
            </div>
          )}

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '22px' }}>Care<span style={{ color: '#F03E7A' }}>Bridge</span></span>
                <span style={S.pill('#2EC4B6', '#fff')}>PRO</span>
              </div>
              <h1 style={S.h1}>Welcome, {proProfile.name.split(' ')[0]} 👋</h1>
              <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', fontWeight: 600 }}>
                Pro ID: <code style={{ background: '#F5C842', padding: '2px 8px', border: '1.5px solid #1A1A1A', fontWeight: 800 }}>{proProfile.id}</code>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={toggleAvailability}
                style={{ ...S.btn(isAvailable ? '#2EC4B6' : '#eee') }}
                onMouseEnter={e => hoverBtn(e, true)} onMouseLeave={e => hoverBtn(e, false)}
              >{isAvailable ? '🟢 AVAILABLE' : '🔴 OFFLINE'}</button>
              <button onClick={() => { localStorage.removeItem('carebridge_pro_profile'); logout(); window.location.href = getLandingUrl(); }}
                style={{ ...S.btn('#fff') }}
                onMouseEnter={e => hoverBtn(e, true)} onMouseLeave={e => hoverBtn(e, false)}
              >Sign Out</button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <StatCard label="Rating" value={`${rating} ★`} icon="⭐" />
            <StatCard label="Total Bookings" value={bookings.length} icon="📅" />
            <StatCard label="Pending" value={pendingBookings.length} icon="🔥" />
            <StatCard label="Completed" value={completedBookings.length} icon="✅" />
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0', marginBottom: '24px', borderBottom: '2.5px solid #1A1A1A' }}>
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? '#F5C842' : '#fff',
                  border: '2px solid #1A1A1A', borderBottom: activeTab === tab ? '2px solid #F5C842' : '2px solid #1A1A1A',
                  color: '#1A1A1A', padding: '10px 20px',
                  fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px',
                  letterSpacing: '0.06em', cursor: 'pointer',
                  marginBottom: '-2.5px', marginRight: '-1px',
                  boxShadow: activeTab === tab ? '0 0 0 0' : 'none',
                  transition: 'all 0.1s',
                }}
              >{tab.toUpperCase()}</button>
            ))}
          </div>

          {/* ── DASHBOARD TAB ── */}
          {activeTab === 'Dashboard' && (
            <>
              {/* Profile Card */}
              <div style={S.card}>
                <h2 style={S.h2}>🪪 Your Professional Profile</h2>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                  <img src={proProfile.image_url} alt={proProfile.name}
                    style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid #1A1A1A', boxShadow: '4px 4px 0 #1A1A1A', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '20px', margin: '0 0 4px' }}>{proProfile.name}</h3>
                    <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B6B6B', margin: '0 0 10px', fontWeight: 600 }}>
                      {proProfile.area} · {proProfile.experience_years} yr{proProfile.experience_years !== 1 ? 's' : ''} exp · ₹{proProfile.price_range}/service
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                      {proProfile.services?.map(s => <span key={s} style={S.pill('#F5C842')}>{s}</span>)}
                    </div>
                    {proProfile.bio && <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#1A1A1A', margin: 0, lineHeight: 1.6 }}>{proProfile.bio}</p>}
                  </div>
                </div>

                {/* Today's Slots */}
                <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1.5px dashed #1A1A1A' }}>
                  <p style={S.label}>Today's Available Slots</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(proProfile.available_slots || ['9:00 AM', '11:00 AM', '2:00 PM', '5:00 PM', '7:00 PM']).map(slot => (
                      <span key={slot} style={{ ...S.pill(isAvailable ? '#2EC4B6' : '#eee'), fontSize: '11px' }}>{slot}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Wingman Boost */}
              <div style={S.card}>
                <h2 style={S.h2}>⚡ WINGMAN BOOST</h2>
                <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B6B6B', fontWeight: 600, marginBottom: '16px' }}>
                  Generate an AI-powered promotional bio for your profile using Gemini.
                </p>
                <button onClick={handleWingmanBoost} disabled={boostLoading}
                  style={{ ...S.btn('#F5C842'), opacity: boostLoading ? 0.6 : 1 }}
                  onMouseEnter={e => { if (!boostLoading) hoverBtn(e, true); }} onMouseLeave={e => hoverBtn(e, false)}
                >
                  {boostLoading ? '✦ Generating…' : '✦ GENERATE AI BIO'}
                </button>
                {boostBio && (
                  <div style={{ marginTop: '16px', background: '#FFF8F0', border: '2px solid #1A1A1A', padding: '16px', boxShadow: '3px 3px 0 #1A1A1A' }}>
                    <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#1A1A1A', fontWeight: 600, margin: '0 0 12px', lineHeight: 1.6 }}>{boostBio}</p>
                    <button onClick={() => { const updated = { ...proProfile, bio: boostBio }; saveProfile(updated); }}
                      style={{ ...S.btn('#2EC4B6'), fontSize: '11px', padding: '8px 16px' }}
                      onMouseEnter={e => hoverBtn(e, true)} onMouseLeave={e => hoverBtn(e, false)}
                    >USE THIS BIO</button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── BOOKINGS TAB ── */}
          {activeTab === 'Bookings' && (
            <div style={S.card}>
              <h2 style={S.h2}>📋 Booking Requests</h2>
              {pendingBookings.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ ...S.label, marginBottom: '12px' }}>⏳ Pending ({pendingBookings.length})</p>
                  {pendingBookings.map(b => <BookingRow key={b.id} booking={b} onAction={handleBookingAction} />)}
                </div>
              )}
              {confirmedBookings.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ ...S.label, marginBottom: '12px' }}>✅ Confirmed ({confirmedBookings.length})</p>
                  {confirmedBookings.map(b => <BookingRow key={b.id} booking={b} />)}
                </div>
              )}
              {completedBookings.length > 0 && (
                <div>
                  <p style={{ ...S.label, marginBottom: '12px' }}>🏁 Completed ({completedBookings.length})</p>
                  {completedBookings.map(b => <BookingRow key={b.id} booking={b} />)}
                </div>
              )}
              {bookings.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', border: '2px dashed rgba(26,26,26,0.2)' }}>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '13px', color: '#6B6B6B', margin: '0 0 6px' }}>NO BOOKINGS YET</p>
                  <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', fontWeight: 500 }}>Customer bookings will appear here in real time once you go live.</p>
                </div>
              )}
            </div>
          )}

          {/* ── EARNINGS TAB ── */}
          {activeTab === 'Earnings' && (
            <div style={S.card}>
              <h2 style={S.h2}>💰 Earnings Overview</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <StatCard label="Total Earnings" value={`₹${totalEarnings.toLocaleString()}`} icon="💎" />
                <StatCard label="Avg per Booking" value={`₹${avgEarning}`} icon="📊" />
                <StatCard label="This Month" value={`₹${thisMonth.toLocaleString()}`} icon="📈" />
                <StatCard label="Last Month" value={`₹${lastMonth.toLocaleString()}`} icon="📉" />
              </div>
              <div style={{ marginTop: '8px' }}>
                <p style={S.label}>Weekly Breakdown (Mock Chart)</p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '100px', padding: '12px 0' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                    const heights = [40, 65, 30, 80, 55, 100, 70];
                    return (
                      <div key={day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '100%', height: `${heights[i]}%`, background: i === 5 ? '#F03E7A' : '#F5C842', border: '1.5px solid #1A1A1A', boxShadow: '2px 2px 0 #1A1A1A' }} />
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '9px', color: '#6B6B6B', textTransform: 'uppercase' }}>{day}</span>
                      </div>
                    );
                  })}
                </div>
                <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B6B6B', fontWeight: 600, textAlign: 'center', marginTop: '8px' }}>
                  Based on {bookings.length} bookings · Avg ₹{avgEarning}/session · Saturdays peak day
                </p>
              </div>
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === 'Settings' && (
            <div style={S.card}>
              <h2 style={S.h2}>⚙️ Profile Settings</h2>
              {!editForm ? (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    {[
                      { label: 'Full Name', value: proProfile.name },
                      { label: 'Area', value: proProfile.area },
                      { label: 'Price Range', value: `₹${proProfile.price_range}` },
                      { label: 'Experience', value: `${proProfile.experience_years} years` },
                    ].map(f => (
                      <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1.5px solid rgba(26,26,26,0.1)' }}>
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{f.label}</span>
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px' }}>{f.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button onClick={() => setEditForm({ name: proProfile.name, area: proProfile.area, bio: proProfile.bio, price_range: proProfile.price_range, experience_years: proProfile.experience_years, image_url: proProfile.image_url, services: [...(proProfile.services || [])] })}
                      style={{ ...S.btn('#F5C842') }}
                      onMouseEnter={e => hoverBtn(e, true)} onMouseLeave={e => hoverBtn(e, false)}
                    >✏️ EDIT PROFILE</button>
                    <button onClick={toggleAvailability}
                      style={{ ...S.btn(isAvailable ? '#2EC4B6' : '#eee') }}
                      onMouseEnter={e => hoverBtn(e, true)} onMouseLeave={e => hoverBtn(e, false)}
                    >{isAvailable ? '🟢 SET OFFLINE' : '🔴 GO ONLINE'}</button>
                  </div>
                </>
              ) : (
                <div>
                  {[
                    { label: 'Name', key: 'name', type: 'text' },
                    { label: 'Price Range (e.g. 200-450)', key: 'price_range', type: 'text' },
                    { label: 'Experience (years)', key: 'experience_years', type: 'number' },
                    { label: 'Photo URL', key: 'image_url', type: 'text' },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: '16px' }}>
                      <label style={S.label}>{f.label}</label>
                      <input type={f.type} value={editForm[f.key] || ''} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))} style={S.input} />
                    </div>
                  ))}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={S.label}>Area</label>
                    <select value={editForm.area} onChange={e => setEditForm(p => ({ ...p, area: e.target.value }))} style={S.input}>
                      {NAGPUR_AREAS.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={S.label}>Bio</label>
                    <textarea value={editForm.bio || ''} onChange={e => setEditForm(p => ({ ...p, bio: e.target.value }))} rows={3} style={{ ...S.input, resize: 'vertical' }} />
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <label style={S.label}>Services</label>
                    <CheckboxGrid options={ALL_SERVICES} selected={editForm.services || []} onChange={v => setEditForm(p => ({ ...p, services: v }))} />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={saveSettings} disabled={editSaving}
                      style={{ ...S.btn('#2EC4B6'), opacity: editSaving ? 0.6 : 1 }}
                      onMouseEnter={e => hoverBtn(e, true)} onMouseLeave={e => hoverBtn(e, false)}
                    >{editSaving ? 'Saving…' : '✓ SAVE CHANGES'}</button>
                    <button onClick={() => setEditForm(null)}
                      style={{ ...S.btn('#fff') }}
                      onMouseEnter={e => hoverBtn(e, true)} onMouseLeave={e => hoverBtn(e, false)}
                    >CANCEL</button>
                  </div>
                </div>
              )}
            </div>
          )}

          <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B6B6B', textAlign: 'center', fontWeight: 600 }}>CareBridge Professional Portal · Nagpur 2026</p>
        </div>
      </div>
    );
  }

  // ── FORM VIEW ──
  return (
    <div style={S.page}>
      <div style={S.wrap}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '22px' }}>Care<span style={{ color: '#F03E7A' }}>Bridge</span></span>
            <span style={{ marginLeft: '10px', ...S.pill('#2EC4B6', '#fff'), boxShadow: 'none' }}>PRO ONBOARDING</span>
          </div>
          <button onClick={() => { window.location.href = getLandingUrl(); }} style={{ ...S.btn('#fff'), padding: '8px 16px', fontSize: '12px' }} onMouseEnter={e => hoverBtn(e, true)} onMouseLeave={e => hoverBtn(e, false)}>← Back</button>
        </div>

        {/* 🎯 JUDGE DEMO BANNER */}
        <div style={{ background: '#F5C842', border: '3px solid #1A1A1A', boxShadow: '6px 6px 0 #1A1A1A', padding: '20px 24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '16px', color: '#1A1A1A', margin: '0 0 4px' }}>🎯 HACKATHON JUDGE?</p>
            <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#1A1A1A', fontWeight: 600, margin: 0 }}>Click to instantly load a demo professional profile — no form filling needed.</p>
          </div>
          <button onClick={loadDemoProfile} disabled={demoLoading}
            style={{ ...S.btn('#1A1A1A'), color: '#F5C842', fontSize: '13px', opacity: demoLoading ? 0.6 : 1 }}
            onMouseEnter={e => { if (!demoLoading) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '5px 5px 0 #F5C842'; } }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #1A1A1A'; }}
          >
            {demoLoading ? '⚡ Loading…' : '⚡ LOAD DEMO PROFILE'}
          </button>
        </div>

        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h1 style={{ ...S.h1, marginBottom: '6px' }}>Create Your Pro Profile</h1>
          <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#6B6B6B', fontWeight: 600, marginBottom: '32px' }}>
            Fill in your details. You'll get a unique Professional ID and appear live in the marketplace instantly.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={S.card}>
              <h2 style={S.h2}>👤 Basic Information</h2>
              <div style={{ marginBottom: '20px' }}>
                <label style={S.label}>Full Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ravi Sharma" style={S.input} required />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={S.label}>Service Area (Nagpur) *</label>
                <select value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} style={S.input}>
                  {NAGPUR_AREAS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={S.label}>Min Price (₹)</label>
                  <input type="number" value={form.priceMin} onChange={e => setForm({ ...form, priceMin: e.target.value })} placeholder="200" style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Max Price (₹)</label>
                  <input type="number" value={form.priceMax} onChange={e => setForm({ ...form, priceMax: e.target.value })} placeholder="450" style={S.input} />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={S.label}>Years of Experience</label>
                <input type="number" min="0" max="50" value={form.experienceYears} onChange={e => setForm({ ...form, experienceYears: e.target.value })} placeholder="e.g. 4" style={S.input} />
              </div>
              <div>
                <label style={S.label}>Profile Photo URL (optional)</label>
                <input value={form.photoUrl} onChange={e => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://..." style={S.input} />
              </div>
            </div>

            <div style={S.card}>
              <h2 style={S.h2}>✂️ Services Offered *</h2>
              <p style={{ ...S.label, marginBottom: '12px' }}>Select all services you provide</p>
              <CheckboxGrid options={ALL_SERVICES} selected={form.services} onChange={v => setForm({ ...form, services: v })} />
            </div>

            <div style={S.card}>
              <h2 style={S.h2}>📝 Bio / Description</h2>
              <label style={S.label}>Tell customers why they should choose you</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="e.g. 6 years of professional grooming. Specialised in modern fades and beard styling. Always on time, always hygienic."
                rows={4} style={{ ...S.input, resize: 'vertical', lineHeight: 1.6, padding: '12px' }} />
            </div>

            {formError && (
              <div style={{ background: '#F03E7A', border: '2.5px solid #1A1A1A', color: '#fff', padding: '12px 16px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px', marginBottom: '16px', boxShadow: '3px 3px 0 #1A1A1A' }}>
                ⚠ {formError}
              </div>
            )}

            <button type="submit" disabled={submitting}
              style={{ ...S.btn('#F5C842'), width: '100%', justifyContent: 'center', fontSize: '15px', padding: '18px', opacity: submitting ? 0.6 : 1 }}
              onMouseEnter={e => { if (!submitting) hoverBtn(e, true); }} onMouseLeave={e => hoverBtn(e, false)}
            >
              {submitting ? 'CREATING YOUR PROFILE…' : 'CREATE PROFILE & GO LIVE →'}
            </button>
          </form>

          <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B6B6B', textAlign: 'center', marginTop: '20px', fontWeight: 600 }}>CareBridge Professional Portal · Nagpur 2026</p>
        </div>
      </div>
    </div>
  );
}
