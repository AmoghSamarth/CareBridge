import React from 'react';
import { Star, MapPin, Sparkles } from 'lucide-react';

export default function ProfessionalCard({ professional, onBook, onViewProfile }) {
  const {
    name,
    area,
    services = [],
    price_range,
    rating,
    review_count = 0,
    experience_years,
    is_available = true,
    image_url,
    ai_summary
  } = professional;

  return (
    <div className="border-2.5 border-dark rounded-card shadow-brutal bg-white overflow-hidden hover:-translate-x-1 hover:-translate-y-1 hover:shadow-brutal-hover transition-all duration-150 flex flex-col justify-between group">
      
      {/* Top Image & Badge */}
      <div className="relative w-full overflow-hidden border-b-3 border-dark">
        <img 
          src={image_url || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400'} 
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white border-2 border-dark px-2.5 py-1 rounded-none flex items-center gap-1 shadow-[2px_2px_0px_#1A1A1A]">
          <Star className="w-3.5 h-3.5 fill-yellow text-dark" strokeWidth={2.5} />
          <span className="text-xs font-display font-bold text-dark">{rating.toFixed(1)}</span>
          <span className="text-[10px] text-muted font-sans font-semibold">({review_count})</span>
        </div>

        {is_available && (
          <div className="absolute bottom-3 left-3 bg-teal border-2 border-dark px-2.5 py-0.5 rounded-none text-[10px] text-dark font-display font-extrabold tracking-wide uppercase shadow-[2px_2px_0px_#1A1A1A]">
            Available Today
          </div>
        )}
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-display font-extrabold text-base text-dark leading-tight">{name.toUpperCase()}</h4>
            <span className="text-sm font-display font-extrabold text-dark bg-yellow border-2 border-dark px-1.5 py-0.5 rounded-none shadow-[2px_2px_0px_#1A1A1A]">
              ₹{price_range.replace('-', '–')}
            </span>
          </div>

          <div className="flex items-center gap-1 text-muted text-xs mb-4 font-sans font-bold">
            <MapPin className="w-3.5 h-3.5 text-dark" strokeWidth={2.5} />
            <span>{area.toUpperCase()}, NAGPUR</span>
            <span>•</span>
            <span>{experience_years}Y EXP</span>
          </div>

          {/* Services list as rounded pills */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {services.map((svc) => (
              <span 
                key={svc} 
                className="bg-teal border-2 border-dark text-dark font-display font-bold text-[10px] rounded-full px-2.5 py-0.5 shadow-[1.5px_1.5px_0px_#1A1A1A]"
              >
                {svc.toUpperCase()}
              </span>
            ))}
          </div>

          {/* AI review summary card if exists */}
          {ai_summary && (
            <div className="bg-yellow border-2 border-dark rounded-none p-2.5 mb-4 flex gap-1.5 items-start shadow-[2px_2px_0px_#1A1A1A]">
              <Sparkles className="w-3.5 h-3.5 text-dark shrink-0 mt-0.5 animate-pulse" strokeWidth={2.5} />
              <p className="text-[10px] text-dark font-sans font-semibold leading-relaxed italic">
                "{ai_summary}"
              </p>
            </div>
          )}
        </div>

        {/* Action Button & View Profile link */}
        <div className="mt-2 flex items-center justify-between gap-4">
          <button
            onClick={() => onViewProfile && onViewProfile(professional)}
            className="font-display font-extrabold text-xs text-dark underline hover:text-pink transition-colors cursor-pointer uppercase shrink-0"
          >
            VIEW PROFILE
          </button>
          
          <button
            onClick={() => onBook(professional)}
            className="flex-1 bg-yellow hover:bg-yellow border-3 border-dark text-dark font-display font-extrabold text-xs py-2.5 rounded-none shadow-[3px_3px_0px_#1A1A1A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150 cursor-pointer text-center uppercase"
          >
            BOOK NOW
          </button>
        </div>
      </div>
    </div>
  );
}
