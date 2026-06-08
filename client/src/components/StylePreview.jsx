import React from 'react';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

export default function StylePreview({ hairType = 'Straight' }) {
  // Pre-selected modern grooming styles based on hair types
  const stylesMap = {
    Straight: [
      { name: "Classic Side Part", desc: "Timeless sharp look suitable for corporate interviews.", url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400" },
      { name: "Textured Crop", desc: "Modern low-maintenance look with short textured layers.", url: "https://images.unsplash.com/photo-1605497746444-ac9da58d7d98?auto=format&fit=crop&q=80&w=400" }
    ],
    Wavy: [
      { name: "Modern Pompadour", desc: "Wavy volume on top with clean skin fade on the sides.", url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=400" },
      { name: "Flow Cut", desc: "Medium length natural flow showing wavy textures.", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400" }
    ],
    Curly: [
      { name: "Curly Undercut", desc: "Brings out natural curls on top while keeping edges clean.", url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400" },
      { name: "Tapered Curly Afro", desc: "Balanced curly volume tapering off near the ears.", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400" }
    ],
    Coily: [
      { name: "High Top Fade", desc: "Retro-inspired neat coily box style with sharp lineups.", url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400" },
      { name: "Short Coily Buzz", desc: "Ultra-sharp clean shave accentuating natural face structures.", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400" }
    ]
  };

  const selectedStyles = stylesMap[hairType] || stylesMap['Straight'];

  return (
    <div className="w-full bg-white border-3 border-dark p-6 shadow-brutal rounded-none relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-dark" strokeWidth={2.5} />
        <h3 className="font-display font-extrabold text-lg text-dark">AI STYLE MOODBOARD</h3>
      </div>
      
      <p className="text-xs font-sans font-bold text-dark/75 mb-6 uppercase tracking-tight">
        Curated trends for <span className="bg-yellow px-2 py-0.5 border border-dark rounded-none text-dark font-display font-bold">{hairType.toUpperCase()}</span> hair to spark inspiration:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {selectedStyles.map((style, i) => (
          <div key={i} className="bg-white border-3 border-dark rounded-none overflow-hidden group hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#1A1A1A] transition-all duration-150">
            <div className="h-40 w-full relative overflow-hidden border-b-3 border-dark">
              <img 
                src={style.url} 
                alt={style.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 bg-yellow border-2 border-dark p-1.5 rounded-none shadow-[2px_2px_0px_#1A1A1A]">
                <ImageIcon className="w-3.5 h-3.5 text-dark" strokeWidth={2.5} />
              </div>
            </div>
            <div className="p-3.5">
              <h4 className="font-display font-extrabold text-sm text-dark mb-1">{style.name.toUpperCase()}</h4>
              <p className="text-[11px] text-dark/80 leading-relaxed font-sans font-medium">{style.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
