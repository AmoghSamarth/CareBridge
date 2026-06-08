import React from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function EmergencyBanner({ onTriggerEmergency }) {
  return (
    <div className="w-full bg-coral border-3 border-dark p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-brutal relative overflow-hidden rounded-none">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 border-2 border-dark bg-white flex items-center justify-center shrink-0 rounded-none">
          <ShieldAlert className="w-5 h-5 text-dark animate-pulse" strokeWidth={2.5} />
        </div>
        <div className="text-center sm:text-left text-dark">
          <h4 className="font-display font-extrabold text-sm">NEED AN EMERGENCY TRIM?</h4>
          <p className="text-[11px] font-sans font-bold leading-relaxed mt-0.5 text-dark/90">
            Unexpected interview or event? Get prioritized booking slots with providers near you in Nagpur.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onTriggerEmergency}
        className="flex items-center gap-1.5 bg-yellow border-3 border-dark text-dark font-display font-bold text-xs py-2.5 px-4 shadow-[3px_3px_0px_#1A1A1A] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150 shrink-0 cursor-pointer rounded-none uppercase"
      >
        <span>REQUEST NOW</span>
        <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
      </button>
    </div>
  );
}
