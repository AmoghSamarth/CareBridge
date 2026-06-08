import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ConfidenceRating from '../components/ConfidenceRating';
import { Calendar, Clock, MapPin, Sparkles, CheckCircle2, AlertCircle, Trash2, ArrowRight } from 'lucide-react';
import { db, isFirebaseInitialized } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

export default function Bookings({ setActiveTab }) {
  const { user } = useAuth();
  const [activeTab, setActiveTabState] = useState('upcoming'); // upcoming | past
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);

  useEffect(() => {
    if (!user) return;

    let unsubscribe = () => {};

    if (isFirebaseInitialized && db) {
      const q = query(collection(db, 'bookings'), where('user_id', '==', user.uid));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          booking_date: doc.data().booking_date || doc.data().bookingDate,
          professional_name: doc.data().professional_name || doc.data().professionalName,
          is_emergency: doc.data().is_emergency ?? doc.data().isEmergency,
          wingman_recommended: doc.data().wingman_recommended ?? doc.data().wingmanRecommended
        }));
        setBookings(list);
        setLoading(false);
      }, (error) => {
        console.error("Firestore onSnapshot failed, using local storage fallback:", error);
        loadLocalBookings();
      });
    } else {
      loadLocalBookings();
    }

    return () => unsubscribe();
  }, [user]);

  const loadLocalBookings = () => {
    const key = `carebridge_bookings_${user.uid}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch {
        setBookings([]);
      }
    } else {
      const defaultBookings = [
        {
          id: 'demo-book-1',
          professional_name: 'Mohit Thakur',
          service: 'haircut',
          booking_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          slot: '5:00 PM',
          status: 'completed',
          area: 'Sadar',
          is_emergency: false,
          confidence_score: 0,
          wingman_recommended: true
        }
      ];
      localStorage.setItem(key, JSON.stringify(defaultBookings));
      setBookings(defaultBookings);
    }
    setLoading(false);
  };

  const handleCancelBooking = async (bookingId) => {
    // 1. Local storage fallback
    const key = `carebridge_bookings_${user.uid}`;
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      list = [];
    }
    const updated = list.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b);
    localStorage.setItem(key, JSON.stringify(updated));
    setBookings(updated);

    // 2. Firestore Sync
    if (isFirebaseInitialized && db) {
      try {
        await updateDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' });
      } catch (err) {
        console.error("Failed to cancel in Firestore:", err);
      }
    }

    // 3. API Sync
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
    } catch (err) {
      console.warn("API cancel patch failed:", err);
    }
    setCancelConfirmId(null);
  };

  const handleCompleteBooking = async (bookingId) => {
    const key = `carebridge_bookings_${user.uid}`;
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      list = [];
    }
    const updated = list.map(b => b.id === bookingId ? { ...b, status: 'completed' } : b);
    localStorage.setItem(key, JSON.stringify(updated));
    setBookings(updated);

    if (isFirebaseInitialized && db) {
      try {
        await updateDoc(doc(db, 'bookings', bookingId), { status: 'completed' });
      } catch (err) {
        console.error("Failed to complete in Firestore:", err);
      }
    }

    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });
    } catch (err) {
      console.warn("API complete patch failed:", err);
    }
  };

  const handleConfidenceSubmitted = async (bookingId, score) => {
    const key = `carebridge_bookings_${user.uid}`;
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      list = [];
    }
    const updated = list.map(b => b.id === bookingId ? { ...b, confidence_score: score } : b);
    localStorage.setItem(key, JSON.stringify(updated));
    setBookings(updated);

    if (isFirebaseInitialized && db) {
      try {
        await updateDoc(doc(db, 'bookings', bookingId), { confidence_score: score });
      } catch (err) {
        console.error("Failed to save confidence score in Firestore:", err);
      }
    }

    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confidence_score: score })
      });
    } catch (err) {
      console.warn("API rating patch failed:", err);
    }
  };

  const upcomingBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="pb-28 pt-20 px-4 max-w-2xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="select-none">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-dark">YOUR APPOINTMENTS</h1>
        <p className="text-xs font-sans font-bold text-muted mt-1 uppercase tracking-tight">Track scheduled styling visits or review confidence feedback on past bookings.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-3 border-dark bg-white shadow-brutal rounded-none overflow-hidden select-none">
        <button
          onClick={() => setActiveTabState('upcoming')}
          className={`flex-1 py-3 text-center font-display font-bold text-xs tracking-wider cursor-pointer border-r-3 border-dark transition-colors uppercase ${
            activeTab === 'upcoming' ? 'bg-yellow text-dark font-extrabold' : 'bg-white text-dark hover:bg-cream'
          }`}
        >
          Upcoming ({upcomingBookings.length})
        </button>
        <button
          onClick={() => setActiveTabState('past')}
          className={`flex-1 py-3 text-center font-display font-bold text-xs tracking-wider cursor-pointer transition-colors uppercase ${
            activeTab === 'past' ? 'bg-yellow text-dark font-extrabold' : 'bg-white text-dark hover:bg-cream'
          }`}
        >
          Past History ({pastBookings.length})
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <span className="w-3 h-3 bg-dark rounded-full animate-ping inline-block" />
          <p className="text-xs font-display font-bold text-dark mt-2 uppercase">Syncing bookings...</p>
        </div>
      ) : (
        <div>
          {/* Upcoming Tab Content */}
          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingBookings.length > 0 ? (
                upcomingBookings.map((b) => (
                  <div 
                    key={b.id} 
                    className="bg-white border-3 border-dark p-5 shadow-brutal flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-hover transition-all rounded-none"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-display font-bold text-dark bg-yellow border border-dark px-1.5 py-0.5 rounded-none uppercase">
                          {b.service}
                        </span>
                        {b.is_emergency && (
                          <span className="bg-coral border-2 border-dark text-dark text-[9px] font-display font-bold px-2 py-0.5 rounded-none shadow-[1.5px_1.5px_0px_#1A1A1A] uppercase">
                            Emergency
                          </span>
                        )}
                        {b.wingman_recommended && (
                          <span className="bg-teal border-2 border-dark text-dark text-[9px] font-display font-bold px-2 py-0.5 rounded-none shadow-[1.5px_1.5px_0px_#1A1A1A] flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5 text-dark" strokeWidth={2.5} /> Match
                          </span>
                        )}
                      </div>
                      <h4 className="font-display font-extrabold text-base text-dark">{b.professional_name.toUpperCase()}</h4>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-dark/70 font-sans font-bold uppercase">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-dark" strokeWidth={2.5} /> {new Date(b.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} AT {b.slot}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-dark" strokeWidth={2.5} /> {b.area || 'Nagpur'}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto self-stretch sm:self-auto shrink-0 justify-end">
                      {cancelConfirmId === b.id ? (
                        <div className="flex items-center gap-2 w-full justify-end">
                          <span className="text-[10px] font-display font-bold text-coral uppercase">Sure?</span>
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="bg-coral border-2 border-dark text-dark font-display font-bold text-[10px] py-1 px-3 shadow-[1.5px_1.5px_0px_#1A1A1A] rounded-none cursor-pointer uppercase"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setCancelConfirmId(null)}
                            className="bg-white border-2 border-dark text-dark font-display font-bold text-[10px] py-1 px-3 shadow-[1.5px_1.5px_0px_#1A1A1A] rounded-none cursor-pointer uppercase"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 w-full justify-end">
                          <button
                            onClick={() => setCancelConfirmId(b.id)}
                            className="bg-white border-2 border-dark text-dark font-display font-bold text-[10px] py-2 px-3.5 shadow-[2px_2px_0px_#1A1A1A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-0 active:translate-y-0 transition-all rounded-none cursor-pointer uppercase"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleCompleteBooking(b.id)}
                            className="bg-teal border-2 border-dark text-dark font-display font-bold text-[10px] py-2 px-4 shadow-[2px_2px_0px_#1A1A1A] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-0 active:translate-y-0 transition-all rounded-none cursor-pointer uppercase"
                          >
                            Complete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border-3 border-dark p-8 text-center text-dark font-sans font-bold text-xs space-y-4 shadow-brutal rounded-none select-none">
                  <AlertCircle className="w-8 h-8 text-dark/60 mx-auto" strokeWidth={2.5} />
                  <div className="space-y-1">
                    <p className="uppercase text-sm font-display font-extrabold">No upcoming visits scheduled</p>
                    <p className="text-[10px] text-muted uppercase">Book Nagpur styling professionals via the marketplace or consult Wingman.</p>
                  </div>
                  {setActiveTab && (
                    <button
                      onClick={() => setActiveTab('browse')}
                      className="inline-flex items-center gap-1.5 bg-yellow border-2 border-dark text-dark font-display font-bold text-xs py-2 px-4 shadow-[2px_2px_0px_#1A1A1A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all rounded-none cursor-pointer uppercase"
                    >
                      <span>Browse Stylists</span> <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Past Tab Content */}
          {activeTab === 'past' && (
            <div className="space-y-4">
              {pastBookings.length > 0 ? (
                pastBookings.map((b) => (
                  <div 
                    key={b.id} 
                    className="bg-white border-3 border-dark p-5 shadow-brutal space-y-4 rounded-none hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-hover transition-all duration-150"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-dark font-display font-bold bg-pink border border-dark px-1.5 py-0.5 rounded-none uppercase">
                            {b.service}
                          </span>
                          
                          {/* Green (Teal) for Completed, Red (Coral) for Cancelled */}
                          {b.status === 'completed' ? (
                            <span className="inline-block text-[9px] text-dark font-display font-bold bg-teal border border-dark px-1.5 py-0.5 rounded-none uppercase">
                              Completed
                            </span>
                          ) : (
                            <span className="inline-block text-[9px] text-dark font-display font-bold bg-coral border border-dark px-1.5 py-0.5 rounded-none uppercase">
                              Cancelled
                            </span>
                          )}
                        </div>

                        <h4 className="font-display font-extrabold text-sm text-dark mt-1">{b.professional_name.toUpperCase()}</h4>
                        <p className="text-[10px] font-sans font-bold text-dark/70 uppercase mt-1">
                          {new Date(b.booking_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} AT {b.slot}
                        </p>
                      </div>

                      {b.confidence_score > 0 && (
                        <div className="flex items-center gap-1 bg-yellow border-2 border-dark px-2 py-0.5 text-dark text-[10px] font-display font-bold shadow-[2px_2px_0px_#1A1A1A] rounded-none">
                           <Sparkles className="w-3.5 h-3.5 text-dark animate-pulse" strokeWidth={2.5} />
                           <span>SCORE: {b.confidence_score}/5</span>
                        </div>
                      )}
                    </div>

                    {/* Show confidence score picker if completed and not yet rated */}
                    {b.status === 'completed' && b.confidence_score === 0 && (
                      <div className="pt-4 border-t-2 border-dark border-dashed">
                        <ConfidenceRating 
                          bookingId={b.id} 
                          proName={b.professional_name} 
                          service={b.service}
                          onRateSubmitted={(score) => handleConfidenceSubmitted(b.id, score)} 
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white border-3 border-dark p-6 text-center text-dark font-sans font-bold text-xs shadow-brutal rounded-none uppercase">
                  No completed styling history found.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
