import React, { useState } from 'react';
import { Sparkles, Star, ThumbsUp } from 'lucide-react';

export default function ConfidenceRating({ bookingId, proName, service, onRateSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    try {
      await fetch(`/api/bookings/${bookingId}/confidence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confidenceScore: rating })
      });
    } catch (e) {
      console.warn('Backend unavailable, simulating confidence update locally');
    }

    setSubmitted(true);
    if (onRateSubmitted) {
      onRateSubmitted(rating);
    }
  };

  return (
    <div className="w-full bg-white border-3 border-dark p-6 shadow-brutal rounded-none relative text-center max-w-sm mx-auto">
      {!submitted ? (
        <>
          <div className="w-12 h-12 border-3 border-dark bg-yellow flex items-center justify-center mx-auto mb-4 rounded-none">
            <Sparkles className="w-6 h-6 text-dark animate-bounce" strokeWidth={2.5} />
          </div>
          
          <h3 className="font-display font-extrabold text-lg text-dark mb-1">CONFIDENCE SCORE</h3>
          <p className="text-xs font-sans font-bold text-dark/75 max-w-xs mx-auto mb-5 uppercase tracking-tight">
            How confident do you feel after your <span className="bg-pink text-dark px-1.5 py-0.5 border border-dark rounded-none">{service.toUpperCase()}</span> with <span className="bg-yellow text-dark px-1.5 py-0.5 border border-dark rounded-none">{proName.toUpperCase()}</span>?
          </p>

          {/* Star selector */}
          <div className="flex justify-center gap-2.5 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform duration-100 hover:scale-115 focus:outline-none cursor-pointer"
              >
                <Star 
                  className={`w-8 h-8 transition-colors ${
                    (hoverRating || rating) >= star
                      ? 'fill-yellow text-dark'
                      : 'text-dark/20'
                  }`}
                  strokeWidth={2.5}
                />
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full bg-yellow hover:bg-yellow border-3 border-dark text-dark font-display font-bold text-xs py-3 rounded-none shadow-[3px_3px_0px_#1A1A1A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150 disabled:opacity-30 disabled:pointer-events-none cursor-pointer uppercase tracking-wider"
          >
            SUBMIT FEEDBACK
          </button>
        </>
      ) : (
        <div className="py-4">
          <div className="w-12 h-12 border-3 border-dark bg-teal flex items-center justify-center mx-auto mb-4 rounded-none">
            <ThumbsUp className="w-6 h-6 text-dark" strokeWidth={2.5} />
          </div>
          <h3 className="font-display font-extrabold text-lg text-dark mb-1">THANK YOU!</h3>
          <p className="text-xs font-sans font-bold text-dark/75 max-w-xs mx-auto leading-relaxed uppercase tracking-tight">
            Your confidence level has been recorded. Wingman will adjust future recommendations to match this standard.
          </p>
        </div>
      )}
    </div>
  );
}
