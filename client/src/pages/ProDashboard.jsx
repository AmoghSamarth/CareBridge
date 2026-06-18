import React, { useState, useEffect } from 'react';
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
  'Haircut', 'Beard Trim', 'Beard Styling', 'Facial', 'Waxing', 'Threading',
  'Hair Color', 'Hair Spa', 'Hair Treatment', 'Bridal Makeup', 'Mehendi',
  'Nail Art', 'Eyebrow Shaping', 'Cleanup', 'Bleach', 'Detan', 'Full Body Wax'
];

const S = {
  page: { minHeight: '100vh', background: '#FAE8D8', fontFamily: 'Inter', color: '#1A1A1A' },
  wrap: { maxWidth: '900px', margin: '0 auto', padding: '32px 20px 60px' },
  card: { background: '#fff', border: '2.5px solid #1A1A1A', boxShadow: '5px 5px 0 #1A1A1A', padding: '24px', marginBottom: '24px' },
  label: { fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '10px', color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '6px' },
  input: { width: '100%', background: '#fff', border: '2px solid #1A1A1A', color: '#1A1A1A', padding: '10px 12px', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: '13px', outline: 'none', boxSizing: 'border-box' },
  btn: (bg = '#F5C842') => ({ background: bg, border: '2.5px solid #1A1A1A', color: '#1A1A1A', padding: '12px 24px', fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', letterSpacing: '0.04em', cursor: 'pointer', boxShadow: '3px 3px 0 #1A1A1A', transition: 'transform 0.1s, box-shadow 0.1s', display: 'inline-flex', alignItems: 'center', gap: '8px' }),
  h1: { fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 'clamp(24px, 5vw, 36px)', letterSpacing: '-0.02em', color: '#1A1A1A', marginBottom: '6px' },
  h2: { fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '18px', color: '#1A1A1A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
  pill: (bg, color = '#1A1A1A') => ({ display: 'inline-block', background: bg, border: '2px solid #1A1A1A', color, padding: '4px 12px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', boxShadow: '2px 2px 0 #1A1A1A' }),
  sectionHead: { fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6B6B6B', marginBottom: '16px' },
};

function generateProId(name, area) {
  const slug = (str) => str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  const firstName = name.trim().split(' ')[0];
  return `pro_${slug(area)}_${slug(firstName)}`;
}

function CheckboxGrid({ options, selected, onChange }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(opt => {
        const active = selected.includes(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(active ? selected.filter(s => s !== opt) : [...selected, opt])}
            style={{
              background: active ? '#F5C842' : '#fff',
              border: `2px solid #1A1A1A`,
              color: '#1A1A1A',
              padding: '5px 12px',
              fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px',
              cursor: 'pointer',
              boxShadow: active ? '2px 2px 0 #1A1A1A' : '1px 1px 0 #1A1A1A',
              textTransform: 'uppercase', letterSpacing: '0.03em',
              transition: 'background 0.1s',
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

function BookingRow({ booking }) {
  const statusColor = booking.status === 'confirmed' ? '#2EC4B6' : booking.status === 'cancelled' ? '#F03E7A' : '#F5C842';
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1.5px solid rgba(26,26,26,0.1)' }}>
      <div>
        <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px', margin: '0 0 2px' }}>{(booking.userId || 'CUSTOMER').toUpperCase().slice(0, 20)}</p>
        <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', margin: '0 0 4px', fontWeight: 600 }}>{booking.service}</p>
        <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B6B6B', margin: 0 }}>
          {booking.slot} · {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD'} · {booking.area}
        </p>
      </div>
      <span style={{ ...S.pill(statusColor), fontSize: '10px' }}>{booking.status}</span>
    </div>
  );
}

export default function ProDashboard() {
  const { user, logout } = useAuth();

  // State: 'form' | 'success' | 'dashboard'
  const [view, setView] = useState('loading');
  const [proProfile, setProProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [hoverLogout, setHoverLogout] = useState(false);
  const [hoverAvail, setHoverAvail] = useState(false);

  const [form, setForm] = useState({
    name: '',
    area: 'Dharampeth',
    services: [],
    priceRange: '',
    experienceYears: '',
    bio: '',
    photoUrl: '',
  });

  // On mount: check if pro profile exists
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
            setProProfile(data);
            setIsAvailable(data.is_available !== false);
            setView('dashboard');
          } else {
            setView('form');
          }
        } catch {
          setView('form');
        }
      })();
    } else {
      setView('form');
    }
  }, [user]);

  // Subscribe to incoming bookings for this pro
  useEffect(() => {
    if (view !== 'dashboard' || !proProfile) return;

    const local = localStorage.getItem(`carebridge_bookings_pro_${proProfile.id}`);
    if (local) {
      try { setBookings(JSON.parse(local)); } catch {}
    }

    if (!isFirebaseInitialized || !db) return;
    const q = query(
      collection(db, 'bookings'),
      where('professionalId', '==', proProfile.id)
    );
    const unsub = onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setBookings(list);
      localStorage.setItem(`carebridge_bookings_pro_${proProfile.id}`, JSON.stringify(list));
    }, () => {});

    return () => unsub();
  }, [view, proProfile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Name is required.'); return; }
    if (form.services.length === 0) { setFormError('Select at least one service.'); return; }
    if (!form.priceRange.trim()) { setFormError('Price range is required.'); return; }
    setFormError('');
    setSubmitting(true);

    const proId = generateProId(form.name, form.area);
    const avgRating = 4.5 + Math.random() * 0.4; // seed rating for demo

    const payload = {
      id: proId,
      name: form.name.trim(),
      area: form.area,
      services: form.services.map(s => s.toLowerCase()),
      price_range: form.priceRange.trim(),
      experience_years: parseInt(form.experienceYears, 10) || 1,
      bio: form.bio.trim(),
      image_url: form.photoUrl.trim() || `https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400`,
      rating: parseFloat(avgRating.toFixed(1)),
      review_count: 0,
      is_available: true,
      is_featured: false,
      created_by: user?.uid || 'demo-user-pro',
      created_at: new Date().toISOString(),
    };

    if (isFirebaseInitialized && db) {
      try {
        await setDoc(doc(db, 'professionals', proId), payload);
      } catch {}
    }

    localStorage.setItem('carebridge_pro_profile', JSON.stringify(payload));
    setProProfile(payload);
    setIsAvailable(true);
    setSubmitting(false);
    setView('success');
  };

  const toggleAvailability = async () => {
    const newVal = !isAvailable;
    setIsAvailable(newVal);
    const updated = { ...proProfile, is_available: newVal };
    setProProfile(updated);
    localStorage.setItem('carebridge_pro_profile', JSON.stringify(updated));
    if (isFirebaseInitialized && db && proProfile) {
      try {
        await setDoc(doc(db, 'professionals', proProfile.id), { is_available: newVal }, { merge: true });
      } catch {}
    }
  };

  if (view === 'loading') return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '16px', color: '#6B6B6B' }}>Loading your profile…</div>
    </div>
  );

  // ── DASHBOARD VIEW ──
  if (view === 'dashboard' && proProfile) {
    const rating = proProfile.rating?.toFixed(1) || '4.8';
    const confirmed = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
    return (
      <div style={S.page}>
        <div style={S.wrap}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '22px', letterSpacing: '-0.01em' }}>Care<span style={{ color: '#F03E7A' }}>Bridge</span></span>
                <span style={S.pill('#2EC4B6', '#fff')}>PRO</span>
              </div>
              <h1 style={S.h1}>Welcome, {proProfile.name.split(' ')[0]} 👋</h1>
              <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B6B6B', fontWeight: 600 }}>Your Pro ID: <code style={{ background: '#F5C842', padding: '2px 8px', border: '1.5px solid #1A1A1A', fontWeight: 800 }}>{proProfile.id}</code></p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={toggleAvailability}
                onMouseEnter={() => setHoverAvail(true)}
                onMouseLeave={() => setHoverAvail(false)}
                style={{ ...S.btn(isAvailable ? '#2EC4B6' : '#eee'), transform: hoverAvail ? 'translate(-2px,-2px)' : '', boxShadow: hoverAvail ? '5px 5px 0 #1A1A1A' : '3px 3px 0 #1A1A1A' }}
              >
                {isAvailable ? '🟢 AVAILABLE' : '🔴 OFFLINE'}
              </button>
              <button
                onClick={() => { localStorage.removeItem('carebridge_pro_profile'); logout(); window.location.href = getLandingUrl(); }}
                onMouseEnter={() => setHoverLogout(true)}
                onMouseLeave={() => setHoverLogout(false)}
                style={{ ...S.btn('#fff'), transform: hoverLogout ? 'translate(-2px,-2px)' : '', boxShadow: hoverLogout ? '5px 5px 0 #1A1A1A' : '3px 3px 0 #1A1A1A' }}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <StatCard label="Rating" value={`${rating} ★`} icon="⭐" />
            <StatCard label="Total Bookings" value={bookings.length || 0} icon="📅" />
            <StatCard label="Active Requests" value={confirmed.length} icon="🔥" />
            <StatCard label="Area" value={proProfile.area} icon="📍" />
          </div>

          {/* Pro Profile Card */}
          <div style={S.card}>
            <h2 style={S.h2}>🪪 Your Professional Profile</h2>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <img
                src={proProfile.image_url}
                alt={proProfile.name}
                style={{ width: '100px', height: '100px', objectFit: 'cover', border: '3px solid #1A1A1A', boxShadow: '4px 4px 0 #1A1A1A', flexShrink: 0 }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '20px', margin: '0 0 4px' }}>{proProfile.name}</h3>
                <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#6B6B6B', margin: '0 0 10px', fontWeight: 600 }}>{proProfile.area} · {proProfile.experience_years} yr{proProfile.experience_years !== 1 ? 's' : ''} exp · ₹{proProfile.price_range}/service</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                  {proProfile.services?.map(s => <span key={s} style={S.pill('#F5C842')}>{s}</span>)}
                </div>
                {proProfile.bio && <p style={{ fontFamily: 'Inter', fontSize: '13px', color: '#1A1A1A', margin: 0, lineHeight: 1.6 }}>{proProfile.bio}</p>}
              </div>
            </div>
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1.5px dashed #1A1A1A' }}>
              <p style={S.sectionHead}>Shareable Profile ID</p>
              <div style={{ background: '#FFF8F0', border: '2px solid #1A1A1A', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '2px 2px 0 #1A1A1A', flexWrap: 'wrap', gap: '10px' }}>
                <code style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '16px', color: '#F03E7A', letterSpacing: '0.04em' }}>{proProfile.id}</code>
                <button
                  onClick={() => { navigator.clipboard?.writeText(proProfile.id); }}
                  style={{ ...S.btn('#2EC4B6'), padding: '6px 16px', fontSize: '11px' }}
                >
                  COPY ID
                </button>
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B6B6B', margin: '8px 0 0', fontWeight: 600 }}>
                Customers can search for you in the marketplace using this ID. You appear live in the Browse tab now.
              </p>
            </div>
          </div>

          {/* Incoming Bookings */}
          <div style={S.card}>
            <h2 style={S.h2}>📋 Incoming Booking Requests</h2>
            {bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', border: '2px dashed rgba(26,26,26,0.2)' }}>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '13px', color: '#6B6B6B', margin: '0 0 6px' }}>NO BOOKINGS YET</p>
                <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', fontWeight: 500 }}>When customers book you, requests appear here in real time.</p>
              </div>
            ) : (
              <div>
                {bookings.map(b => <BookingRow key={b.id} booking={b} />)}
              </div>
            )}
          </div>

          {/* Roadmap */}
          <div style={S.card}>
            <h2 style={S.h2}>🗺️ Pro Portal Roadmap</h2>
            {[
              { title: 'Wingman Pro Recommendations', desc: 'AI will analyze seasonal Nagpur demand — weddings, festivals, placements — and suggest packages or price changes.', when: 'Coming Soon' },
              { title: 'Live Smart Route Navigation', desc: 'Dynamic route plotting for Dharampeth, Sadar, Wardhaman Nagar — ensuring 100% on-time arrivals.', when: 'Coming Soon' },
              { title: 'Instant UPI Payouts', desc: 'Earn directly to your UPI handle immediately after service confirmation with detailed tip breakdowns.', when: 'Coming Soon' },
            ].map(r => (
              <div key={r.title} style={{ paddingBottom: '16px', marginBottom: '16px', borderBottom: '1.5px dashed rgba(26,26,26,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '13px' }}>{r.title}</span>
                  <span style={S.pill('#F5C842', '#1A1A1A')}>{r.when}</span>
                </div>
                <p style={{ fontFamily: 'Inter', fontSize: '12px', color: '#6B6B6B', fontWeight: 500, margin: 0 }}>{r.desc}</p>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B6B6B', textAlign: 'center', fontWeight: 600 }}>CareBridge Professional Portal · Nagpur 2026</p>
        </div>
      </div>
    );
  }

  // ── SUCCESS VIEW ──
  if (view === 'success' && proProfile) return (
    <div style={S.page}>
      <div style={{ ...S.wrap, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ ...S.card, maxWidth: '560px', width: '100%', textAlign: 'center', padding: '48px 36px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ ...S.h1, fontSize: '28px', marginBottom: '8px' }}>Profile Created!</h1>
          <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#6B6B6B', fontWeight: 600, marginBottom: '28px' }}>
            You're live on the CareBridge marketplace. Customers in Nagpur can book you right now.
          </p>
          <div style={{ background: '#FFF8F0', border: '2.5px solid #1A1A1A', padding: '20px', boxShadow: '4px 4px 0 #1A1A1A', marginBottom: '28px' }}>
            <p style={S.label}>Your Professional ID</p>
            <code style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '22px', color: '#F03E7A', display: 'block', marginBottom: '8px' }}>{proProfile.id}</code>
            <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B6B6B', fontWeight: 600, margin: 0 }}>Share this with customers. You appear in the Browse marketplace.</p>
          </div>
          <button
            onClick={() => setView('dashboard')}
            style={{ ...S.btn('#F5C842'), width: '100%', justifyContent: 'center', fontSize: '14px', padding: '16px' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '5px 5px 0 #1A1A1A'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #1A1A1A'; }}
          >
            GO TO DASHBOARD →
          </button>
        </div>
      </div>
    </div>
  );

  // ── ONBOARDING FORM VIEW ──
  return (
    <div style={S.page}>
      <div style={S.wrap}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '22px' }}>Care<span style={{ color: '#F03E7A' }}>Bridge</span></span>
            <span style={{ marginLeft: '10px', ...S.pill('#2EC4B6', '#fff'), boxShadow: 'none', border: '2px solid #1A1A1A' }}>PRO ONBOARDING</span>
          </div>
          <button onClick={() => { window.location.href = getLandingUrl(); }} style={{ ...S.btn('#fff'), padding: '8px 16px', fontSize: '12px' }}>← Back</button>
        </div>

        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h1 style={{ ...S.h1, marginBottom: '6px' }}>Create Your Pro Profile</h1>
          <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#6B6B6B', fontWeight: 600, marginBottom: '32px' }}>
            Fill in your details below. After submitting, you'll get a unique Professional ID and appear live in the Nagpur marketplace.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={S.card}>
              <h2 style={S.h2}>👤 Basic Information</h2>

              {/* Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={S.label}>Full Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ravi Sharma" style={S.input} required />
              </div>

              {/* Area */}
              <div style={{ marginBottom: '20px' }}>
                <label style={S.label}>Service Area (Nagpur) *</label>
                <select value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} style={S.input}>
                  {NAGPUR_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>

              {/* Experience */}
              <div style={{ marginBottom: '20px' }}>
                <label style={S.label}>Years of Experience *</label>
                <input type="number" min="0" max="50" value={form.experienceYears} onChange={e => setForm({ ...form, experienceYears: e.target.value })} placeholder="e.g. 4" style={S.input} />
              </div>

              {/* Price Range */}
              <div style={{ marginBottom: '20px' }}>
                <label style={S.label}>Price Range (₹ per service) *</label>
                <input value={form.priceRange} onChange={e => setForm({ ...form, priceRange: e.target.value })} placeholder="e.g. 200-450" style={S.input} required />
              </div>

              {/* Photo URL */}
              <div style={{ marginBottom: '0' }}>
                <label style={S.label}>Profile Photo URL (optional)</label>
                <input value={form.photoUrl} onChange={e => setForm({ ...form, photoUrl: e.target.value })} placeholder="https://..." style={S.input} />
              </div>
            </div>

            <div style={S.card}>
              <h2 style={S.h2}>✂️ Services Offered *</h2>
              <p style={{ ...S.label, marginBottom: '12px' }}>Select all services you provide</p>
              <CheckboxGrid
                options={ALL_SERVICES}
                selected={form.services}
                onChange={(v) => setForm({ ...form, services: v })}
              />
            </div>

            <div style={S.card}>
              <h2 style={S.h2}>📝 Bio / Description</h2>
              <label style={S.label}>Tell customers why they should choose you</label>
              <textarea
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="e.g. 6 years of professional grooming experience. Specialised in modern fades and beard styling. Always on time, always hygienic."
                rows={4}
                style={{ ...S.input, resize: 'vertical', lineHeight: 1.6, padding: '12px' }}
              />
            </div>

            {formError && (
              <div style={{ background: '#F03E7A', border: '2.5px solid #1A1A1A', color: '#fff', padding: '12px 16px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '12px', marginBottom: '16px', boxShadow: '3px 3px 0 #1A1A1A' }}>
                ⚠ {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{ ...S.btn('#F5C842'), width: '100%', justifyContent: 'center', fontSize: '15px', padding: '18px', opacity: submitting ? 0.6 : 1 }}
              onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #1A1A1A'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #1A1A1A'; }}
            >
              {submitting ? 'CREATING YOUR PROFILE…' : 'CREATE PROFILE & GO LIVE →'}
            </button>
          </form>

          <p style={{ fontFamily: 'Inter', fontSize: '11px', color: '#6B6B6B', textAlign: 'center', marginTop: '20px', fontWeight: 600 }}>
            CareBridge Professional Portal · Nagpur 2026
          </p>
        </div>
      </div>
    </div>
  );
}
