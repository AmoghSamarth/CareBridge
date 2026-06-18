import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, Sparkles, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import fallbackProfessionals from '../data/salons.json';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function EmergencyModal({ isOpen, onClose, onBookingSuccess }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [bestMatch, setBestMatch] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const services = ['haircut', 'beard', 'facial', 'waxing', 'threading', 'makeup', 'bridal'];
  const areas = ['Dharampeth', 'Sitabuldi', 'Sadar', 'Ramdaspeth', 'Civil Lines', 'Manish Nagar', 'Wardha Road', 'Pratap Nagar'];

  // Calculate best match when service & area are selected
  useEffect(() => {
    if (step === 3 && selectedService && selectedArea) {
      findBestMatch();
    }
  }, [step, selectedService, selectedArea]);

  const findBestMatch = async () => {
    let list = fallbackProfessionals;
    try {
      const res = await fetch(`${API_BASE}/api/professionals`);
      const data = await res.json();
      if (data.success && data.data) {
        list = data.data;
      }
    } catch (err) {
      console.warn('Emergency Modal: using offline salons data:', err);
    }

    // Filter by service AND area
    let match = list.find(pro => 
      pro.services?.some(s => s.toLowerCase() === selectedService.toLowerCase()) &&
      pro.area?.toLowerCase() === selectedArea.toLowerCase() &&
      pro.is_available
    );

    // Fallback 1: service in Nagpur
    if (!match) {
      match = list.find(pro => 
        pro.services?.some(s => s.toLowerCase() === selectedService.toLowerCase()) &&
        pro.is_available
      );
    }

    // Fallback 2: first available
    if (!match) {
      match = list.find(pro => pro.is_available) || list[0];
    }

    setBestMatch(match);
  };

  const handleConfirm = async () => {
    if (!bestMatch || isSubmitting) return;
    setIsSubmitting(true);

    const bookingPayload = {
      userId: user?.uid || 'mock-user-uid',
      professionalId: bestMatch.id,
      professionalName: bestMatch.name,
      service: selectedService,
      bookingDate: new Date().toISOString(), // Emergency is scheduled immediately
      slot: "ASAP (Within 2 hrs)",
      isEmergency: true,
      wingmanRecommended: true
    };

    const saveBookingOffline = (bookingId) => {
      const uid = user?.uid || 'mock-user-uid';
      const key = `carebridge_bookings_${uid}`;
      let existing = [];
      try {
        existing = JSON.parse(localStorage.getItem(key)) || [];
      } catch {
        existing = [];
      }
      const newBooking = {
        id: bookingId,
        professional_name: bestMatch.name,
        service: selectedService,
        booking_date: bookingPayload.bookingDate,
        slot: bookingPayload.slot,
        status: 'confirmed',
        area: bestMatch.area || 'Nagpur',
        is_emergency: true,
        confidence_score: 0,
        wingman_recommended: true
      };
      existing.unshift(newBooking);
      localStorage.setItem(key, JSON.stringify(existing));
    };

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || 'mock-token-for-now'}`
        },
        body: JSON.stringify(bookingPayload)
      });
      const data = await res.json();
      const bookingId = data.success && data.booking?.id ? data.booking.id : `book-${Date.now()}`;
      
      saveBookingOffline(bookingId);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.75 },
        colors: ['#FF6B6B', '#FFE566', '#4ECDC4']
      });

      setSuccess(true);
      if (onBookingSuccess) {
        onBookingSuccess({
          ...bookingPayload,
          id: bookingId
        });
      }
    } catch (err) {
      console.warn('Emergency booking offline fallback:', err);
      const bookingId = `book-${Date.now()}`;
      saveBookingOffline(bookingId);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.75 },
        colors: ['#FF6B6B', '#FFE566', '#4ECDC4']
      });

      setSuccess(true);
      if (onBookingSuccess) {
        onBookingSuccess({
          ...bookingPayload,
          id: bookingId
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setStep(1);
    setSelectedService('');
    setSelectedArea('');
    setBestMatch(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="absolute inset-0 bg-dark/75 backdrop-blur-xs"
        />

        {/* Modal body */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`w-full sm:max-w-md border-3 border-dark rounded-none overflow-hidden shadow-[10px_10px_0px_#1A1A1A] relative z-10 ${
            success ? 'bg-dark' : 'bg-cream'
          }`}
        >
          {/* Close button */}
          <button
            onClick={resetAndClose}
            className={`absolute top-4 right-4 p-1 border-2 border-dark rounded-none cursor-pointer transition-all ${
              success
                ? 'bg-yellow text-dark hover:bg-white shadow-[2px_2px_0px_#FFF8F0]'
                : 'bg-white text-dark hover:bg-cream shadow-[2px_2px_0px_#1A1A1A]'
            }`}
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {!success ? (
            <div>
              {/* Header */}
              <div className="bg-coral text-dark px-6 py-4 border-b-3 border-dark flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-dark animate-pulse" strokeWidth={2.5} />
                <span className="font-display font-extrabold text-sm tracking-[0.1em] uppercase">EMERGENCY BOOKING</span>
              </div>

              <div className="p-6 space-y-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Select Service */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="font-display font-extrabold text-sm text-dark uppercase mb-1">STEP 1: CHOOSE SERVICE</h4>
                        <p className="text-[10px] font-sans font-bold text-muted uppercase">What service do you need immediately?</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {services.map((svc) => {
                          const isSelected = selectedService === svc;
                          return (
                            <motion.button
                              key={svc}
                              type="button"
                              whileTap={{ scale: 0.96 }}
                              animate={isSelected ? { scale: 1.05 } : { scale: 1 }}
                              transition={{ duration: 0.15 }}
                              onClick={() => {
                                setSelectedService(svc);
                                setTimeout(() => setStep(2), 180);
                              }}
                              className={`py-4 px-4 border-[2.5px] border-dark font-display font-extrabold text-sm text-center transition-colors cursor-pointer uppercase ${
                                isSelected
                                  ? 'bg-yellow text-dark shadow-[4px_4px_0px_#1A1A1A]'
                                  : 'bg-white text-dark hover:bg-cream shadow-[2px_2px_0px_#1A1A1A] hover:shadow-[3px_3px_0px_#1A1A1A]'
                              }`}
                            >
                              {isSelected && '✓ '}{svc}
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Select Area */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="font-display font-extrabold text-sm text-dark uppercase mb-1">STEP 2: SELECT AREA</h4>
                        <p className="text-[10px] font-sans font-bold text-muted uppercase">Where should the stylist arrive in Nagpur?</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {areas.map((area) => {
                          const isSelected = selectedArea === area;
                          return (
                            <button
                              key={area}
                              type="button"
                              onClick={() => {
                                setSelectedArea(area);
                                setStep(3);
                              }}
                              className={`py-2.5 px-3 border-2 border-dark font-display font-bold text-xs text-left transition-all rounded-none cursor-pointer uppercase ${
                                isSelected
                                  ? 'bg-yellow text-dark shadow-[2px_2px_0px_#1A1A1A]'
                                  : 'bg-white text-dark hover:bg-cream shadow-[1px_1px_0px_#1A1A1A]'
                              }`}
                            >
                              {area}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs font-display font-bold text-muted hover:text-dark uppercase underline cursor-pointer"
                      >
                        Back to service
                      </button>
                    </motion.div>
                  )}

                  {/* Step 3: Match & Confirm */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="font-display font-extrabold text-sm text-dark uppercase mb-1">STEP 3: BEST MATCH FOUND!</h4>
                        <p className="text-[10px] font-sans font-bold text-muted uppercase">Our closest verified stylist to your location.</p>
                      </div>

                      {bestMatch ? (
                        <div className="bg-white border-3 border-dark p-4 shadow-brutal rounded-none space-y-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={bestMatch.image_url}
                              alt={bestMatch.name}
                              className="w-14 h-14 border-2 border-dark rounded-none object-cover shrink-0"
                            />
                            <div>
                              <span className="inline-block text-[8px] bg-coral border border-dark text-dark px-1.5 py-0.5 rounded-none font-display font-bold uppercase tracking-wider">
                                ⚡ URGENT RESPONDER
                              </span>
                              <h3 className="font-display font-extrabold text-dark text-base leading-tight mt-0.5">{bestMatch.name.toUpperCase()}</h3>
                              <span className="text-xs font-sans font-bold text-muted">{bestMatch.area.toUpperCase()}, NAGPUR</span>
                            </div>
                          </div>

                          <div className="bg-yellow border-2 border-dark p-2.5 rounded-none flex gap-2 items-center">
                            <Sparkles className="w-4 h-4 text-dark shrink-0 animate-pulse" />
                            <p className="text-[10px] text-dark font-sans font-bold leading-normal">
                              Guaranteed arrival within 2 hours of booking confirmation.
                            </p>
                          </div>

                          <div className="border-t-2 border-dark border-dashed pt-3 flex items-center justify-between text-xs font-display font-bold text-dark">
                            <span>ESTIMATED PRICE:</span>
                            <span className="bg-white border-2 border-dark px-2 py-0.5">₹{bestMatch.price_range?.split('-')[0] || 200}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="py-8 text-center">
                          <span className="w-2.5 h-2.5 bg-dark rounded-full animate-ping inline-block" />
                          <p className="text-xs font-sans font-bold text-dark mt-2 uppercase">Searching Nagpur network...</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="flex-1 bg-white hover:bg-cream border-3 border-dark text-dark font-display font-bold text-xs py-3 rounded-none shadow-[3px_3px_0px_#1A1A1A] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer text-center uppercase"
                        >
                          Change Area
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirm}
                          disabled={!bestMatch || isSubmitting}
                          className="flex-1 bg-coral border-3 border-dark text-dark font-display font-bold text-xs py-3 rounded-none shadow-[3px_3px_0px_#1A1A1A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150 cursor-pointer text-center uppercase disabled:opacity-30 disabled:pointer-events-none"
                        >
                          {isSubmitting ? 'DISPATCHING...' : 'DISPATCH NOW'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center bg-dark text-cream min-h-[360px] justify-center">
              <CheckCircle2 className="w-16 h-16 text-coral mb-4" strokeWidth={2.5} />
              <h3 className="font-display text-2xl font-extrabold text-cream mb-2 tracking-tight">STYLIST DISPATCHED!</h3>
              <p className="text-xs font-sans font-semibold text-cream/80 mb-6 max-w-xs leading-relaxed uppercase">
                SUCCESS! {bestMatch.name.toUpperCase()} IS EN ROUTE AND WILL ARRIVE AT YOUR LOCATION IN {selectedArea.toUpperCase()} WITHIN 2 HOURS.
              </p>

              <div className="bg-white border-3 border-dark p-4 rounded-none w-full text-left mb-6 font-display font-bold text-xs space-y-2 text-dark shadow-[4px_4px_0px_#FF6B6B]">
                <div className="flex justify-between"><span className="text-dark/70">STYLIST:</span><span>{bestMatch.name.toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-dark/70">SERVICE:</span><span className="bg-pink text-dark px-1.5 py-0.5 border border-dark rounded-none">{selectedService.toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-dark/70">ARRIVAL SLOT:</span><span className="text-coral font-extrabold">ASAP (WITHIN 2 HRS)</span></div>
                <div className="flex justify-between"><span className="text-dark/70">PAYMENT:</span><span className="text-teal font-extrabold">CASH / UPI ON ARRIVAL</span></div>
              </div>

              <button
                onClick={resetAndClose}
                className="w-full bg-yellow border-3 border-dark text-dark font-display font-bold text-sm py-3 rounded-none shadow-[4px_4px_0px_#FFF8F0] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer uppercase"
              >
                GREAT, THANK YOU!
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
