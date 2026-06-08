import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, Sparkles, Clock, Award, ShieldCheck } from 'lucide-react';

export default function ProfessionalPanel({ professional, isOpen, onClose, onBook }) {
  if (!isOpen || !professional) return null;

  const {
    name,
    area,
    services = [],
    price_range = '150-300',
    rating = 5.0,
    review_count = 0,
    experience_years = 5,
    is_available = true,
    image_url,
    ai_summary,
    available_slots = ["9:00 AM", "11:00 AM", "2:00 PM", "5:00 PM", "7:00 PM"]
  } = professional;

  // Mock services details if specific price mapping is needed
  const servicePriceMap = {
    haircut: 200,
    beard: 100,
    facial: 400,
    waxing: 350,
    threading: 50,
    bridal: 3000,
    makeup: 800,
    mehendi: 500,
    'hair treatment': 1200,
    'hair spa': 600,
    color: 400
  };

  // Mock reviews for styling details
  const mockReviews = [
    { id: 1, author: "Amit P.", rating: 5, comment: "Super professional and clean work! Highly recommended.", date: "2 days ago" },
    { id: 2, author: "Neha G.", rating: 4, comment: "Very satisfied with the styling. Arrived on time.", date: "1 week ago" }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="absolute inset-0 bg-dark/60 backdrop-blur-xs"
        />

        {/* Panel body */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md h-full bg-cream border-l-3 border-dark shadow-[-8px_0px_0px_#1A1A1A] flex flex-col justify-between z-10"
        >
          {/* Header */}
          <div className="bg-dark text-cream p-4 flex items-center justify-between border-b-3 border-dark">
            <span className="font-display font-extrabold text-sm tracking-[0.1em] uppercase">PROFESSIONAL PROFILE</span>
            <button
              onClick={onClose}
              className="p-1 bg-yellow text-dark border-2 border-dark rounded-none hover:bg-white shadow-[2px_2px_0px_#FFF8F0] cursor-pointer transition-all"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </div>

          {/* Scrollable details */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Pro Hero Details */}
            <div className="relative border-3 border-dark bg-white p-4 shadow-brutal rounded-none flex items-start gap-4">
              <img
                src={image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400'}
                alt={name}
                className="w-20 h-20 border-2 border-dark rounded-none object-cover shrink-0"
              />
              <div className="space-y-1">
                <span className="inline-block text-[9px] bg-pink border border-dark text-dark px-1.5 py-0.5 rounded-none font-display font-bold uppercase tracking-wider">
                  VERIFIED STYLIST
                </span>
                <h3 className="font-display font-extrabold text-dark text-lg leading-tight">{name.toUpperCase()}</h3>
                
                <div className="flex items-center gap-1.5 text-muted text-xs font-sans font-bold">
                  <MapPin className="w-3.5 h-3.5 text-dark" strokeWidth={2.5} />
                  <span>{area.toUpperCase()}, NAGPUR</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 bg-yellow border border-dark px-1.5 py-0.5 rounded-none shadow-[1px_1px_0px_#1A1A1A]">
                    <Star className="w-3 h-3 fill-yellow text-dark" strokeWidth={2.5} />
                    <span className="text-[10px] font-display font-bold text-dark">{rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] text-muted font-sans font-semibold">({review_count} reviews)</span>
                </div>
              </div>
            </div>

            {/* Experience & Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border-2 border-dark p-3 shadow-brutal-sm flex items-center gap-2">
                <Award className="w-5 h-5 text-pink shrink-0" strokeWidth={2.5} />
                <div>
                  <p className="text-[9px] font-display font-bold text-muted uppercase">EXPERIENCE</p>
                  <p className="text-xs font-display font-extrabold text-dark">{experience_years} Years</p>
                </div>
              </div>
              <div className="bg-white border-2 border-dark p-3 shadow-brutal-sm flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal shrink-0" strokeWidth={2.5} />
                <div>
                  <p className="text-[9px] font-display font-bold text-muted uppercase">SAFETY</p>
                  <p className="text-xs font-display font-extrabold text-dark">Covid Safe</p>
                </div>
              </div>
            </div>

            {/* AI Review Summary (Yellow Card) */}
            {ai_summary && (
              <div className="bg-yellow border-3 border-dark rounded-none p-4 flex gap-3 items-start shadow-brutal">
                <Sparkles className="w-5 h-5 text-dark shrink-0 mt-0.5 animate-pulse" strokeWidth={2.5} />
                <div className="space-y-1">
                  <p className="text-[10px] font-display font-extrabold text-dark uppercase tracking-wider">WINGMAN'S SUMMARY</p>
                  <p className="text-xs text-dark font-sans font-bold leading-relaxed italic">
                    "{ai_summary}"
                  </p>
                </div>
              </div>
            )}

            {/* Services with price */}
            <div className="space-y-3">
              <h4 className="font-display font-extrabold text-sm text-dark uppercase tracking-wider">SERVICES & PRICING</h4>
              <div className="space-y-2">
                {services.map((svc) => {
                  const estPrice = servicePriceMap[svc.toLowerCase()] || 250;
                  return (
                    <div
                      key={svc}
                      className="bg-white border-2 border-dark p-3 rounded-none flex items-center justify-between shadow-brutal-sm"
                    >
                      <span className="font-display font-bold text-xs text-dark uppercase">{svc}</span>
                      <span className="font-display font-extrabold text-xs text-dark bg-yellow border-2 border-dark px-2 py-0.5 shadow-[1.5px_1.5px_0px_#1A1A1A]">
                        ₹{estPrice}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Available Today Slots */}
            <div className="space-y-3">
              <h4 className="font-display font-extrabold text-sm text-dark uppercase tracking-wider">AVAILABLE TIME SLOTS</h4>
              <div className="flex flex-wrap gap-2">
                {available_slots.map((slot) => (
                  <span
                    key={slot}
                    className="bg-teal border-2 border-dark text-dark font-display font-bold text-xs rounded-full px-3 py-1 shadow-[1.5px_1.5px_0px_#1A1A1A]"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>

            {/* Client Reviews */}
            <div className="space-y-3">
              <h4 className="font-display font-extrabold text-sm text-dark uppercase tracking-wider">CLIENT REVIEWS</h4>
              <div className="space-y-3">
                {mockReviews.map((rev) => (
                  <div key={rev.id} className="bg-white border-2 border-dark p-3.5 rounded-none shadow-brutal-sm space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-xs text-dark uppercase">{rev.author}</span>
                      <span className="text-[10px] font-sans font-bold text-muted">{rev.date}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-yellow text-dark' : 'text-dark/20'}`}
                          strokeWidth={2.5}
                        />
                      ))}
                    </div>
                    <p className="text-xs font-sans font-semibold text-dark/85 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky CTA Button Footer */}
          <div className="bg-white border-t-3 border-dark p-4">
            <button
              onClick={() => {
                onClose();
                onBook(professional);
              }}
              className="w-full bg-yellow hover:bg-yellow border-3 border-dark text-dark font-display font-extrabold text-sm py-3.5 rounded-none shadow-[4px_4px_0px_#1A1A1A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150 cursor-pointer text-center uppercase"
            >
              BOOK THIS PROFESSIONAL NOW
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
