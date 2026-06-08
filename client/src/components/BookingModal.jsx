import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, CreditCard, ShieldAlert, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { db, isFirebaseInitialized } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function BookingModal({ professional, isOpen, onClose, onBookingSuccess }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('');
  const [bookingDate, setBookingDate] = useState(null); // Date object
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calendar Year/Month state
  const today = new Date();
  today.setHours(0,0,0,0);
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedService('');
      setBookingDate(null);
      setSelectedSlot('');
      setIsEmergency(false);
      setSuccess(false);
      setCalendarMonth(today.getMonth());
      setCalendarYear(today.getFullYear());
    }
  }, [isOpen]);

  if (!isOpen || !professional) return null;

  const slots = professional.available_slots || ["9:00 AM", "11:00 AM", "2:00 PM", "5:00 PM", "7:00 PM"];

  // Calendar Helpers
  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];
  
  const daysOfWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayIndex = (month, year) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(calendarMonth, calendarYear);
  const firstDayIdx = getFirstDayIndex(calendarMonth, calendarYear);

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const selectDate = (day) => {
    const selected = new Date(calendarYear, calendarMonth, day);
    if (selected < today) return; // disabled
    setBookingDate(selected);
  };

  const handleConfirm = async () => {
    if (!selectedService || !bookingDate || !selectedSlot) return;

    setIsSubmitting(true);

    const bookingPayload = {
      userId: user?.uid || 'mock-user-uid',
      professionalId: professional.id || 'ravi-sharma',
      professionalName: professional.name,
      service: selectedService,
      bookingDate: bookingDate.toISOString(),
      slot: selectedSlot,
      isEmergency,
      wingmanRecommended: true
    };

    const saveBookingToLocalStorage = (payload, bookingId) => {
      const uid = user?.uid || 'mock-user-uid';
      const key = `carebridge_bookings_${uid}`;
      let existing = [];
      try {
        existing = JSON.parse(localStorage.getItem(key)) || [];
      } catch (e) {
        existing = [];
      }
      const newBooking = {
        id: bookingId,
        professional_name: payload.professionalName || professional.name,
        service: payload.service,
        booking_date: payload.bookingDate,
        slot: payload.slot,
        status: 'confirmed',
        area: professional.area || 'Nagpur',
        is_emergency: payload.isEmergency,
        confidence_score: 0,
        wingman_recommended: payload.wingmanRecommended
      };
      existing.unshift(newBooking);
      localStorage.setItem(key, JSON.stringify(existing));
    };

    try {
      // Write to Firestore if initialized
      if (isFirebaseInitialized && db) {
        await addDoc(collection(db, 'bookings'), {
          user_id: user?.uid || 'mock-user-uid',
          professional_id: professional.id || 'ravi-sharma',
          professional_name: professional.name,
          service: selectedService,
          booking_date: bookingDate.toISOString(),
          slot: selectedSlot,
          is_emergency: isEmergency,
          status: 'confirmed',
          created_at: serverTimestamp()
        });
      }

      // Offline API hit
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token || 'mock-user-uid'}`
        },
        body: JSON.stringify(bookingPayload)
      });

      const data = await res.json();
      const finalBookingId = data.success && data.booking?.id ? data.booking.id : `book-${Date.now()}`;

      saveBookingToLocalStorage(bookingPayload, finalBookingId);

      confetti({
        particleCount: 85,
        spread: 65,
        origin: { y: 0.75 },
        colors: ['#FFE566', '#FF6B9D', '#4ECDC4']
      });

      setSuccess(true);
      if (onBookingSuccess) {
        onBookingSuccess({
          ...bookingPayload,
          id: finalBookingId
        });
      }
    } catch (err) {
      console.warn('⚠️ Firebase/API booking fail, fallback offline:', err);
      const finalBookingId = `book-${Date.now()}`;
      
      saveBookingToLocalStorage(bookingPayload, finalBookingId);

      confetti({
        particleCount: 85,
        spread: 65,
        origin: { y: 0.75 },
        colors: ['#FFE566', '#FF6B9D', '#4ECDC4']
      });
      setSuccess(true);
      if (onBookingSuccess) {
        onBookingSuccess({
          ...bookingPayload,
          id: finalBookingId
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSelectedService('');
    setBookingDate(null);
    setSelectedSlot('');
    setIsEmergency(false);
    setSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={resetAndClose}
          className="absolute inset-0 bg-dark/75 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.2 }}
          className={`w-full sm:max-w-md border-3 border-dark rounded-none overflow-hidden shadow-[10px_10px_0px_#1A1A1A] relative z-10 ${
            success ? 'bg-dark' : 'bg-cream'
          }`}
        >
          {/* Close button */}
          <button 
            onClick={resetAndClose}
            className={`absolute top-4 right-4 p-1 border-2 border-dark rounded-none cursor-pointer transition-all z-25 ${
              success 
                ? 'bg-yellow text-dark hover:bg-white shadow-[2px_2px_0px_#FFF8F0]'
                : 'bg-white text-dark hover:bg-cream shadow-[2px_2px_0px_#1A1A1A]'
            }`}
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {!success ? (
            <div>
              {/* Modal Header */}
              <div className="bg-dark text-cream px-6 py-4 border-b-3 border-dark flex items-center justify-between">
                <span className="font-display font-extrabold text-sm tracking-[0.1em] uppercase">
                  BOOK STYLIST ({step}/4)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-white border-b-3 border-dark flex">
                <div 
                  className="h-full bg-yellow transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>

              <div className="p-6">
                {/* Pro mini header */}
                <div className="flex items-center gap-4 mb-4 bg-white border-2 border-dark p-2 shadow-brutal-sm rounded-none">
                  <img 
                    src={professional.image_url} 
                    alt={professional.name} 
                    className="w-10 h-10 border border-dark rounded-none object-cover shrink-0"
                  />
                  <div>
                    <h3 className="font-display font-extrabold text-dark text-xs sm:text-sm leading-tight">{professional.name.toUpperCase()}</h3>
                    <span className="text-[10px] font-sans font-bold text-muted">{professional.area.toUpperCase()}, NAGPUR</span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {/* Step 1: Service Selection */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-3"
                    >
                      <label className="block text-[10px] font-display font-extrabold text-dark uppercase tracking-wider">SELECT SERVICE</label>
                      <div className="grid grid-cols-2 gap-2">
                        {professional.services?.map((svc) => {
                          const isSelected = selectedService === svc;
                          return (
                            <button
                              key={svc}
                              type="button"
                              onClick={() => {
                                setSelectedService(svc);
                                setStep(2);
                              }}
                              className={`py-3 px-4 border-2 border-dark font-display font-bold text-xs text-left transition-all rounded-none cursor-pointer uppercase ${
                                isSelected
                                  ? 'bg-yellow text-dark shadow-[2px_2px_0px_#1A1A1A]'
                                  : 'bg-white text-dark hover:bg-cream shadow-[1px_1px_0px_#1A1A1A]'
                              }`}
                            >
                              {svc}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Custom Month Grid Calendar */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-3"
                    >
                      <label className="block text-[10px] font-display font-extrabold text-dark uppercase tracking-wider">SELECT DATE</label>
                      
                      <div className="border-2 border-dark bg-white rounded-none p-3 shadow-brutal-sm">
                        {/* Month Header selector */}
                        <div className="flex items-center justify-between mb-2">
                          <button
                            type="button"
                            onClick={prevMonth}
                            className="p-1 border border-dark rounded-none bg-white hover:bg-cream cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                          <span className="font-display font-extrabold text-xs text-dark tracking-wider">
                            {monthNames[calendarMonth]} {calendarYear}
                          </span>
                          <button
                            type="button"
                            onClick={nextMonth}
                            className="p-1 border border-dark rounded-none bg-white hover:bg-cream cursor-pointer"
                          >
                            <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                        </div>

                        {/* Weekday labels */}
                        <div className="grid grid-cols-7 text-center text-[9px] font-display font-extrabold text-dark/60 mb-1 border-b border-dark pb-1">
                          {daysOfWeek.map(d => <span key={d}>{d}</span>)}
                        </div>

                        {/* Calendar Day grid */}
                        <div className="grid grid-cols-7 gap-1 text-center font-sans font-bold text-xs">
                          {/* Empty spacer blocks */}
                          {Array.from({ length: firstDayIdx }).map((_, i) => (
                            <div key={`empty-${i}`} className="py-2" />
                          ))}
                          
                          {/* Calendar Days */}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const current = new Date(calendarYear, calendarMonth, day);
                            const isPast = current < today;
                            const isSelected = bookingDate && 
                              bookingDate.getDate() === day &&
                              bookingDate.getMonth() === calendarMonth &&
                              bookingDate.getFullYear() === calendarYear;

                            return (
                              <button
                                key={`day-${day}`}
                                type="button"
                                disabled={isPast}
                                onClick={() => selectDate(day)}
                                className={`py-1.5 rounded-none font-sans font-bold text-xs cursor-pointer border transition-all ${
                                  isPast 
                                    ? 'text-dark/20 border-transparent pointer-events-none'
                                    : isSelected
                                      ? 'bg-yellow text-dark border-dark shadow-[1.5px_1.5px_0px_#1A1A1A] font-extrabold scale-105'
                                      : 'bg-white text-dark border-transparent hover:bg-cream hover:border-dark'
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="text-xs font-display font-bold text-muted hover:text-dark uppercase underline cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          disabled={!bookingDate}
                          onClick={() => setStep(3)}
                          className="bg-yellow border-2 border-dark text-dark font-display font-bold text-xs py-2 px-4 shadow-[2px_2px_0px_#1A1A1A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded-none cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                        >
                          NEXT
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Time Slot Selection */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-3"
                    >
                      <label className="block text-[10px] font-display font-extrabold text-dark uppercase tracking-wider">SELECT TIME SLOT</label>
                      <div className="grid grid-cols-3 gap-2">
                        {slots.map((s) => {
                          const isSelected = selectedSlot === s;
                          return (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                setSelectedSlot(s);
                                setStep(4);
                              }}
                              className={`py-3 px-1 border-2 border-dark font-display font-bold text-xs text-center transition-all rounded-none cursor-pointer uppercase ${
                                isSelected
                                  ? 'bg-yellow text-dark shadow-[2px_2px_0px_#1A1A1A]'
                                  : 'bg-white text-dark hover:bg-cream shadow-[1px_1px_0px_#1A1A1A]'
                              }`}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="text-xs font-display font-bold text-muted hover:text-dark uppercase underline cursor-pointer"
                        >
                          Back
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 4: Summary & Confirm */}
                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-4"
                    >
                      <label className="block text-[10px] font-display font-extrabold text-dark uppercase tracking-wider">CONFIRM DETAILS</label>
                      
                      <div className="bg-white border-2 border-dark p-4 rounded-none space-y-2.5 font-display font-bold text-xs text-dark shadow-brutal-sm">
                        <div className="flex justify-between border-b border-dark/15 pb-2">
                          <span className="text-dark/60">SERVICE:</span>
                          <span className="bg-pink text-dark px-1.5 py-0.5 border border-dark rounded-none uppercase">{selectedService}</span>
                        </div>
                        <div className="flex justify-between border-b border-dark/15 pb-2">
                          <span className="text-dark/60">DATE:</span>
                          <span>{bookingDate?.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between border-b border-dark/15 pb-2">
                          <span className="text-dark/60">TIME:</span>
                          <span>{selectedSlot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-dark/60">PAYMENT:</span>
                          <span className="text-teal font-extrabold">UPI / CASH ON ARRIVAL</span>
                        </div>
                      </div>

                      {/* Emergency Switch Option */}
                      <div className="flex items-center justify-between p-3 bg-coral border-2 border-dark rounded-none shadow-brutal-sm">
                        <div className="flex gap-2 items-start text-dark">
                          <ShieldAlert className="w-4 h-4 text-dark shrink-0 mt-0.5" strokeWidth={2.5} />
                          <div>
                            <h4 className="text-xs font-display font-extrabold leading-tight">NEED URGENT SERVICE?</h4>
                            <p className="text-[10px] font-sans font-bold text-dark/85">Request slot within 2 hours</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={isEmergency}
                            onChange={(e) => setIsEmergency(e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-10 h-6 bg-white border-2 border-dark peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:bg-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-dark after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-dark"></div>
                        </label>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="flex-1 bg-white hover:bg-cream border-3 border-dark text-dark font-display font-bold text-xs py-3 rounded-none shadow-[3px_3px_0px_#1A1A1A] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer text-center uppercase"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirm}
                          disabled={isSubmitting}
                          className="flex-1 bg-yellow border-3 border-dark text-dark font-display font-bold text-xs py-3 rounded-none shadow-[3px_3px_0px_#1A1A1A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150 cursor-pointer text-center uppercase"
                        >
                          {isSubmitting ? 'CONFIRMING...' : 'CONFIRM'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center bg-dark text-cream min-h-[360px] justify-center">
              <div className="w-16 h-16 bg-yellow border-3 border-dark flex items-center justify-center rounded-full mb-4 shadow-[3px_3px_0px_#FFF8F0] animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-dark" strokeWidth={2.5} />
              </div>
              
              <h3 className="font-display text-2xl font-extrabold text-cream mb-2 tracking-tight">BOOKING CONFIRMED!</h3>
              <p className="text-xs font-sans font-semibold text-cream/80 mb-6 max-w-xs leading-relaxed uppercase">
                AWESOME! YOUR APPOINTMENT WITH {professional.name.toUpperCase()} IS SCHEDULED ON {bookingDate?.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }).toUpperCase()} AT {selectedSlot}.
              </p>
              
              <div className="bg-white border-3 border-dark p-4 rounded-none w-full text-left mb-6 font-display font-bold text-xs space-y-2 text-dark shadow-[4px_4px_0px_#FFE566]">
                <div className="flex justify-between"><span className="text-dark/70">PROFESSIONAL:</span><span>{professional.name.toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-dark/70">SERVICE:</span><span className="bg-pink text-dark px-1.5 py-0.5 border border-dark rounded-none">{selectedService.toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-dark/70">AREA:</span><span>{professional.area.toUpperCase()}</span></div>
                <div className="flex justify-between"><span className="text-dark/70">PAYMENT:</span><span className="text-teal font-extrabold font-display">UPI / CASH ON ARRIVAL</span></div>
              </div>

              <button
                onClick={resetAndClose}
                className="w-full bg-yellow border-3 border-dark text-dark font-display font-bold text-sm py-3 rounded-none shadow-[4px_4px_0px_#FFF8F0] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-0 active:translate-y-0 transition-all cursor-pointer uppercase"
              >
                AWESOME, THANKS!
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
