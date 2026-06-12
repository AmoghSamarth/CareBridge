import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWingman } from '../context/WingmanContext';
import { db, isFirebaseInitialized } from '../lib/firebase';
import { getLandingUrl } from '../lib/urls';
import { 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  addDoc 
} from 'firebase/firestore';
import { 
  Settings, 
  Calendar, 
  Plus, 
  Trash2, 
  Sparkles, 
  LogOut, 
  RefreshCw, 
  Trash 
} from 'lucide-react';

// ─── Sub-Component: Editable Beauty Twin Field ───────────────────────────────
function BeautyTwinField({ label, value, options, isDropdown, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentVal, setCurrentVal] = useState(value);

  useEffect(() => {
    setCurrentVal(value);
  }, [value]);

  const handleSave = () => {
    onSave(currentVal);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b-2 border-dark/15 text-sm font-sans font-bold">
      <span className="text-dark/70 font-display font-bold text-xs uppercase">{label}</span>
      
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-2">
            {isDropdown ? (
              <select
                value={currentVal}
                onChange={(e) => setCurrentVal(e.target.value)}
                className="bg-white border-2 border-dark text-dark px-2 py-1 focus:outline-none focus:shadow-[2px_2px_0px_#1A1A1A] font-sans font-bold text-xs rounded-none"
              >
                {options.map((opt) => (
                  <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={currentVal}
                onChange={(e) => setCurrentVal(e.target.value)}
                className="bg-white border-2 border-dark text-dark px-2 py-1 focus:outline-none focus:shadow-[2px_2px_0px_#1A1A1A] font-sans font-bold text-xs w-28 sm:w-36 rounded-none"
              />
            )}
            <button
              type="button"
              onClick={handleSave}
              className="bg-teal hover:bg-teal border-2 border-dark text-dark font-display font-bold text-[10px] px-2.5 py-1 rounded-none shadow-[2px_2px_0px_#1A1A1A] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              SAVE
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentVal(value);
                setIsEditing(false);
              }}
              className="text-[10px] font-display font-bold text-muted hover:text-dark px-1.5 py-1 cursor-pointer"
            >
              CANCEL
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="bg-yellow border border-dark text-dark px-2 py-0.5 font-display font-extrabold text-xs shadow-[2px_2px_0px_#1A1A1A] rounded-none uppercase">
              {value || 'NOT SET'}
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-dark hover:text-pink transition-colors p-1 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component: Profile ──────────────────────────────────────────────────
export default function Profile() {
  const { user, logout } = useAuth();
  const { onboardingData, updateOnboardingData, resetOnboarding } = useWingman();

  // Local state for Beauty Twin fields
  const [twinData, setTwinData] = useState({
    hairType: onboardingData.hairType || 'Straight',
    skinType: onboardingData.skinType || 'Normal',
    groomFrequency: onboardingData.groomFrequency || 'Monthly',
    budgetRange: onboardingData.budgetRange || '₹300–600',
    priority: onboardingData.priority || 'Confidence',
    location: onboardingData.location || 'Nagpur'
  });

  // Local state for events
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ eventType: 'Interview', eventDate: '' });

  // Local state for confidence history
  const [confidenceBookings, setConfidenceBookings] = useState([]);

  // Account actions states
  const [confirmDelete, setConfirmDelete] = useState(false);

  const eventEmojis = {
    Interview: '💼',
    Wedding: '💒',
    Party: '🎉',
    Festival: '🎆',
    'Date Night': '💖',
    Other: '📅'
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Fetch user data (Beauty Twin) and Events on mount
  useEffect(() => {
    if (!user) return;

    setTwinData({
      hairType: onboardingData.hairType || 'Straight',
      skinType: onboardingData.skinType || 'Normal',
      groomFrequency: onboardingData.groomFrequency || 'Monthly',
      budgetRange: onboardingData.budgetRange || '₹300–600',
      priority: onboardingData.priority || 'Confidence',
      location: onboardingData.location || 'Nagpur'
    });

    const loadUserData = async () => {
      if (isFirebaseInitialized && db) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            setTwinData(prev => ({
              ...prev,
              hairType: data.hairType || prev.hairType,
              skinType: data.skinType || prev.skinType,
              groomFrequency: data.groomFrequency || prev.groomFrequency,
              budgetRange: data.budgetRange || prev.budgetRange,
              priority: data.priority || prev.priority,
              location: data.location || prev.location
            }));
          }
        } catch (err) {
          console.warn('Firestore load profile failed:', err.message);
        }
      }

      // Load Events
      let loadedEvents = [];
      const localEventsStr = localStorage.getItem(`carebridge_events_${user.uid}`);
      if (localEventsStr) {
        loadedEvents = JSON.parse(localEventsStr);
      }

      if (isFirebaseInitialized && db) {
        try {
          const eventsRef = collection(db, 'users', user.uid, 'events');
          const querySnap = await getDocs(eventsRef);
          const fbEvents = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          if (fbEvents.length > 0) {
            loadedEvents = fbEvents;
          }
        } catch (err) {
          console.warn('Firestore load events failed:', err.message);
        }
      }
      
      loadedEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
      setEvents(loadedEvents);
    };

    loadUserData();
  }, [user, onboardingData]);

  // 2. Fetch Confidence Bookings on mount
  useEffect(() => {
    if (!user) return;

    const loadBookings = async () => {
      const localBookingsStr = localStorage.getItem(`carebridge_bookings_${user.uid}`) || '[]';
      let localBookings = JSON.parse(localBookingsStr);

      try {
        const res = await fetch(`/api/bookings?userId=${user.uid}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.bookings)) {
          const merged = [...data.bookings, ...localBookings];
          const unique = merged.reduce((acc, current) => {
            const exists = acc.find(item => item.id === current.id);
            if (!exists) {
              return acc.concat([current]);
            }
            return acc;
          }, []);

          const scored = unique.filter(b => b.confidence_score !== undefined || b.confidenceScore !== undefined);
          scored.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
          setConfidenceBookings(scored.slice(0, 5));
        } else {
          const scored = localBookings.filter(b => b.confidence_score !== undefined || b.confidenceScore !== undefined);
          scored.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
          setConfidenceBookings(scored.slice(0, 5));
        }
      } catch (err) {
        const scored = localBookings.filter(b => b.confidence_score !== undefined || b.confidenceScore !== undefined);
        scored.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
        setConfidenceBookings(scored.slice(0, 5));
      }
    };

    loadBookings();
  }, [user]);

  // Field updates
  const handleSaveField = async (field, value) => {
    setTwinData(prev => ({ ...prev, [field]: value }));
    updateOnboardingData(field, value);

    if (isFirebaseInitialized && db && user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { [field]: value }, { merge: true });
      } catch (err) {
        console.error('Firestore save field failed:', err);
      }
    }
  };

  // Add event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.eventDate) return;

    const eventPayload = {
      eventType: newEvent.eventType,
      eventDate: newEvent.eventDate,
      created_at: new Date().toISOString()
    };

    let newId = `evt_${Date.now()}`;

    if (isFirebaseInitialized && db && user) {
      try {
        const docRef = await addDoc(collection(db, 'users', user.uid, 'events'), eventPayload);
        newId = docRef.id;
      } catch (err) {
        console.error('Firestore add event failed:', err);
      }
    }

    const added = [...events, { id: newId, ...eventPayload }];
    added.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
    setEvents(added);
    localStorage.setItem(`carebridge_events_${user.uid}`, JSON.stringify(added));

    updateOnboardingData('upcomingEvent', {
      eventType: newEvent.eventType,
      eventDate: newEvent.eventDate
    });

    setNewEvent({ eventType: 'Interview', eventDate: '' });
    setShowEventForm(false);
  };

  // Remove event
  const handleRemoveEvent = async (eventId) => {
    if (isFirebaseInitialized && db && user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'events', eventId));
      } catch (err) {
        console.error('Firestore delete event failed:', err);
      }
    }

    const filtered = events.filter(evt => evt.id !== eventId);
    setEvents(filtered);
    localStorage.setItem(`carebridge_events_${user.uid}`, JSON.stringify(filtered));

    if (filtered.length > 0) {
      updateOnboardingData('upcomingEvent', {
        eventType: filtered[0].eventType,
        eventDate: filtered[0].eventDate
      });
    } else {
      updateOnboardingData('upcomingEvent', { eventType: '', eventDate: '' });
    }
  };

  const handleRetakeOnboarding = async () => {
    resetOnboarding();
    if (isFirebaseInitialized && db && user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { onboarding_complete: false }, { merge: true });
      } catch (err) {
        console.error('Firestore reset onboarding failed:', err);
      }
    }
    window.location.reload();
  };

  const handleSignOut = async () => {
    await logout();
    window.location.href = getLandingUrl();
  };

  const handleDeleteAccount = async () => {
    if (isFirebaseInitialized && db && user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid));
      } catch (err) {
        console.error('Firestore delete profile failed:', err);
      }
    }

    await logout();
    window.location.href = getLandingUrl();
  };

  const renderStars = (score) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i} 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill={i <= score ? '#FFE566' : 'none'} 
          stroke="#1A1A1A"
          strokeWidth="2.5"
          className="shrink-0"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      );
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  return (
    <div className="pb-28 pt-20 px-4 max-w-2xl mx-auto space-y-8 text-left">
      
      {/* ─── User Profile Card ─────────────────────────────────────────── */}
      <div className="flex items-center gap-5 bg-white border-3 border-dark p-6 shadow-brutal rounded-none relative overflow-hidden">
        <img 
          src={user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
          alt={user?.displayName} 
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 border-dark object-cover shadow-[2px_2px_0px_#1A1A1A] shrink-0"
        />
        <div>
          <h2 className="font-display font-extrabold text-xl sm:text-2xl text-dark uppercase">{user?.displayName || 'CAREBRIDGE MEMBER'}</h2>
          <p className="text-xs sm:text-sm font-sans font-bold text-dark/70 mt-0.5">{user?.email}</p>
          <div className="flex items-center flex-wrap gap-2 mt-2 select-none">
            <span className="text-[10px] font-sans font-bold text-dark/65">MEMBER SINCE JUNE 2026</span>
            <span className="inline-block bg-yellow border-2 border-dark text-dark text-[9px] font-display font-bold px-2.5 py-0.5 rounded-none shadow-[2px_2px_0px_#1A1A1A] uppercase">
              GOLD PASS
            </span>
          </div>
        </div>
      </div>

      {/* ─── Beauty Twin Profile ─────────────────────────────────── */}
      <section className="space-y-4">
        <div className="select-none">
          <h3 className="font-display font-extrabold text-lg text-dark flex items-center gap-2">
            <Settings className="w-5 h-5 text-dark" strokeWidth={2.5} />
            <span>YOUR BEAUTY TWIN</span>
          </h3>
          <p className="text-xs font-sans font-bold text-dark/60 mt-0.5 uppercase">How Wingman knows your style</p>
        </div>

        <div className="bg-white border-3 border-dark p-5 space-y-1 shadow-brutal rounded-none">
          <BeautyTwinField
            label="Hair Type"
            value={twinData.hairType}
            options={['Straight', 'Wavy', 'Curly', 'Coily']}
            isDropdown={true}
            onSave={(val) => handleSaveField('hairType', val)}
          />
          <BeautyTwinField
            label="Skin Type"
            value={twinData.skinType}
            options={['Oily', 'Dry', 'Combination', 'Normal']}
            isDropdown={true}
            onSave={(val) => handleSaveField('skinType', val)}
          />
          <BeautyTwinField
            label="Groom Frequency"
            value={twinData.groomFrequency}
            options={['Weekly', 'Bi-weekly', 'Monthly', 'Rarely']}
            isDropdown={true}
            onSave={(val) => handleSaveField('groomFrequency', val)}
          />
          <BeautyTwinField
            label="Budget Range"
            value={twinData.budgetRange}
            options={['100-300', '300-600', '600-1200', '1200+']}
            isDropdown={true}
            onSave={(val) => handleSaveField('budgetRange', val)}
          />
          <BeautyTwinField
            label="Priority"
            value={twinData.priority}
            options={['Confidence', 'Routine', 'First Impressions', 'Looking Fresh']}
            isDropdown={true}
            onSave={(val) => handleSaveField('priority', val)}
          />
          <BeautyTwinField
            label="Location/Area"
            value={twinData.location}
            isDropdown={false}
            onSave={(val) => handleSaveField('location', val)}
          />
        </div>
      </section>

      {/* ─── Upcoming Events ─────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="select-none">
            <h3 className="font-display font-extrabold text-lg text-dark flex items-center gap-2">
              <Calendar className="w-5 h-5 text-dark" strokeWidth={2.5} />
              <span>YOUR EVENTS</span>
            </h3>
            <p className="text-xs font-sans font-bold text-dark/60 mt-0.5 uppercase">Wingman monitors these dates</p>
          </div>
          <button
            onClick={() => setShowEventForm(!showEventForm)}
            className="flex items-center gap-1.5 border-3 border-dark bg-white hover:bg-cream text-dark px-3.5 py-2 rounded-none shadow-[3px_3px_0px_#1A1A1A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer font-display font-bold text-xs uppercase"
          >
            <Plus className="w-3.5 h-3.5 text-dark" strokeWidth={2.5} />
            <span>ADD EVENT</span>
          </button>
        </div>

        <div className="bg-white border-3 border-dark p-5 space-y-4 shadow-brutal rounded-none">
          {showEventForm && (
            <form onSubmit={handleAddEvent} className="bg-cream border-2 border-dark p-4 rounded-none flex flex-col sm:flex-row gap-3 items-end shadow-brutal-sm">
              <div className="flex-1 w-full text-left">
                <label className="block text-[10px] font-display font-bold text-dark uppercase tracking-wider mb-1">EVENT TYPE</label>
                <select
                  value={newEvent.eventType}
                  onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                  className="w-full bg-white border-2 border-dark text-dark rounded-none p-2 text-xs focus:outline-none focus:shadow-[2px_2px_0px_#1A1A1A] font-sans font-bold uppercase"
                >
                  <option value="Interview">INTERVIEW</option>
                  <option value="Wedding">WEDDING</option>
                  <option value="Date Night">DATE NIGHT</option>
                  <option value="Festival">FESTIVAL</option>
                  <option value="Party">PARTY</option>
                  <option value="Other">OTHER</option>
                </select>
              </div>

              <div className="flex-1 w-full text-left">
                <label className="block text-[10px] font-display font-bold text-dark uppercase tracking-wider mb-1.5">DATE</label>
                <input
                  type="date"
                  min={todayStr}
                  value={newEvent.eventDate}
                  onChange={(e) => setNewEvent({ ...newEvent, eventDate: e.target.value })}
                  className="w-full bg-white border-2 border-dark text-dark rounded-none p-1.5 text-xs focus:outline-none focus:shadow-[2px_2px_0px_#1A1A1A] font-sans font-bold uppercase [color-scheme:light]"
                  required
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => setShowEventForm(false)}
                  className="text-xs font-display font-bold text-dark/70 hover:text-dark px-3 py-2 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="bg-yellow border-3 border-dark text-dark font-display font-bold text-xs py-2 px-4.5 shadow-[2px_2px_0px_#1A1A1A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all rounded-none cursor-pointer uppercase"
                >
                  ADD
                </button>
              </div>
            </form>
          )}

          {events.length === 0 ? (
            <p className="text-xs font-sans font-bold text-dark/60 text-center py-4 uppercase">No events scheduled. Add an event to let Wingman sync your preparation plan.</p>
          ) : (
            <div className="space-y-2.5">
              {events.map((evt) => (
                <div key={evt.id} className="flex justify-between items-center bg-white border-2 border-dark p-3.5 rounded-none shadow-brutal-sm font-sans text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-xl select-none leading-none">{eventEmojis[evt.eventType] || '📅'}</span>
                    <div className="space-y-0.5">
                      <span className="font-display font-extrabold text-dark text-xs sm:text-sm uppercase">{evt.eventType}</span>
                      <p className="text-[10px] font-sans font-bold text-dark/70 uppercase">
                        {new Date(evt.eventDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveEvent(evt.id)}
                    className="text-dark hover:text-coral border border-dark p-1.5 bg-white hover:bg-cream shadow-[1px_1px_0px_#1A1A1A] rounded-none cursor-pointer transition-all shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-dark" strokeWidth={2.5} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Confidence History ─────────────────────────────────── */}
      <section className="space-y-4">
        <div className="select-none">
          <h3 className="font-display font-extrabold text-lg text-dark flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-dark" strokeWidth={2.5} />
            <span>CONFIDENCE LOG</span>
          </h3>
          <p className="text-xs font-sans font-bold text-dark/60 mt-0.5 uppercase">Wingman learns from how you felt</p>
        </div>

        <div className="bg-white border-3 border-dark p-5 shadow-brutal rounded-none">
          {confidenceBookings.length === 0 ? (
            <p className="text-xs font-sans font-bold text-dark/65 text-center py-4 leading-relaxed uppercase">
              Complete your first booking and rate how you felt. Wingman learns from this.
            </p>
          ) : (
            <div className="space-y-3">
              {confidenceBookings.map((b) => (
                <div key={b.id} className="flex justify-between items-center bg-white border-2 border-dark p-3.5 rounded-none shadow-brutal-sm font-sans text-xs">
                  <div>
                    <span className="font-display font-extrabold text-dark text-xs sm:text-sm uppercase">{b.professionalName || b.professional_name || 'GROOMING EXPERT'}</span>
                    <p className="text-[10px] text-pink font-display font-bold mt-0.5 uppercase">{b.serviceName || b.service || 'HAIRCUT'}</p>
                    <p className="text-[9px] font-sans font-bold text-dark/70 uppercase mt-1">
                      {new Date(b.date || b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right space-y-1 shrink-0">
                    <span className="text-[9px] font-display font-bold text-dark/70 uppercase tracking-wider block">SCORE</span>
                    {renderStars(b.confidence_score !== undefined ? b.confidence_score : b.confidenceScore)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Account Actions ───────────────────────────────────── */}
      <section className="pt-6 border-t-3 border-dark space-y-4">
        <h3 className="font-display font-extrabold text-lg text-dark uppercase select-none">ACCOUNT SETTINGS</h3>
        
        <div className="flex flex-col gap-4">
          {/* Retake Onboarding */}
          <button
            onClick={handleRetakeOnboarding}
            className="w-full flex items-center justify-center gap-2 bg-teal hover:bg-teal border-3 border-dark text-dark font-display font-extrabold text-xs py-3.5 rounded-none shadow-[3px_3px_0px_#1A1A1A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer uppercase"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={2.5} />
            <span>RETAKE ONBOARDING</span>
          </button>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-cream border-3 border-dark text-dark font-display font-extrabold text-xs py-3.5 rounded-none shadow-[3px_3px_0px_#1A1A1A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all cursor-pointer uppercase"
          >
            <LogOut className="w-4 h-4" strokeWidth={2.5} />
            <span>SIGN OUT</span>
          </button>

          {/* Delete Account */}
          <div className="border-3 border-dark rounded-none bg-coral p-1 shadow-brutal-sm">
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full flex items-center justify-center gap-2 bg-white border-3 border-dark text-dark font-display font-extrabold text-xs py-3.5 cursor-pointer transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_#1A1A1A] rounded-none uppercase"
              >
                <Trash className="w-4 h-4 text-dark" strokeWidth={2.5} />
                <span>DELETE ACCOUNT</span>
              </button>
            ) : (
              <div className="p-4 text-center space-y-3">
                <p className="text-xs font-display font-bold text-dark uppercase">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4 items-center">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-xs font-display font-bold text-dark underline hover:text-white px-3 py-1.5 cursor-pointer uppercase"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-dark hover:bg-black text-cream text-xs font-display font-bold px-4 py-1.5 rounded-none border-2 border-cream cursor-pointer uppercase"
                  >
                    CONFIRM DELETE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
