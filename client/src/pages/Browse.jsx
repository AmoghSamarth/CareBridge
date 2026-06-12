import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import professionalsData from '../data/salons.json';
import ProfessionalCard from '../components/ProfessionalCard';
import BookingModal from '../components/BookingModal';
import ProfessionalPanel from '../components/ProfessionalPanel';
import { Search, MapPin, Sparkles } from 'lucide-react';

export default function Browse() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [allProfessionals, setAllProfessionals] = useState(professionalsData);
  const [professionals, setProfessionals] = useState(professionalsData);
  const [selectedPro, setSelectedPro] = useState(null);
  const [panelPro, setPanelPro] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isNlpSearching, setIsNlpSearching] = useState(false);

  // Fetch professionals from backend on mount
  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await fetch('/api/professionals');
        const data = await res.json();
        if (data.success && data.data) {
          setAllProfessionals(data.data);
          setProfessionals(data.data);
        }
      } catch (err) {
        console.warn('⚠️ Failed to fetch professionals from backend, using salons.json fallback:', err);
      }
    };
    fetchProfessionals();
  }, []);

  const areas = ['Dharampeth', 'Sitabuldi', 'Sadar', 'Ramdaspeth', 'Civil Lines', 'Manish Nagar', 'Wardha Road', 'Pratap Nagar', 'Laxmi Nagar', 'Ajni', 'Hingna Road', 'Trimurti Nagar', 'Ambazari', 'Bajaj Nagar', 'Shankar Nagar'];
  const services = ['haircut', 'beard', 'facial', 'waxing', 'threading', 'bridal', 'makeup', 'mehendi', 'hair treatment', 'hair spa', 'color'];

  // Local filter logic
  useEffect(() => {
    let filtered = allProfessionals;

    if (searchTerm.trim() && !isNlpSearching) {
      filtered = filtered.filter(pro => 
        pro.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pro.services && pro.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (pro.area && pro.area.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedArea) {
      filtered = filtered.filter(pro => pro.area === selectedArea);
    }

    if (selectedService) {
      filtered = filtered.filter(pro => pro.services && pro.services.includes(selectedService));
    }

    setProfessionals(filtered);
  }, [searchTerm, selectedArea, selectedService, isNlpSearching, allProfessionals]);

  // Trigger Gemini NLP search
  const handleNlpSearch = async (e) => {
    if (e.key !== 'Enter' || !searchTerm.trim()) return;

    setIsNlpSearching(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchTerm })
      });
      const data = await response.json();
      
      if (data.success && data.results && data.results.length > 0) {
        setProfessionals(data.results);
      } else {
        console.warn('NLP search returned empty, using local filter fallback');
      }
    } catch (error) {
      console.error('NLP search failed, using local filter:', error);
    } finally {
      setIsNlpSearching(false);
    }
  };

  const handleBook = (pro) => {
    setSelectedPro(pro);
    setIsBookingOpen(true);
  };

  return (
    <div className="pb-28 pt-20 px-4 max-w-6xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="select-none">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-dark">NAGPUR MARKETPLACE</h1>
        <p className="text-xs font-sans font-bold text-muted mt-1 uppercase tracking-tight">Browse, filter, or use Wingman's Smart Search to find the best home styling professionals.</p>
      </div>

      {/* Smart Search Bar */}
      <div className="relative">
        <div className="absolute left-4 top-4 flex items-center gap-1.5 pointer-events-none">
          <Search className="w-4.5 h-4.5 text-dark" strokeWidth={2.5} />
          <Sparkles className="w-3.5 h-3.5 text-dark animate-pulse" strokeWidth={2.5} />
        </div>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleNlpSearch}
          placeholder="Try NLP: 'haircut under 300 near Dharampeth' (Press Enter)"
          className="w-full bg-white border-3 border-dark text-dark rounded-none py-3.5 pl-14 pr-4 text-sm focus:outline-none focus:shadow-[4px_4px_0px_#1A1A1A] focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all font-sans placeholder-muted/85 font-medium"
        />

        {isNlpSearching && (
          <div className="absolute right-4 top-3.5 flex items-center gap-1.5 text-xs text-dark bg-yellow border border-dark px-2 py-1 shadow-[2px_2px_0px_#1A1A1A] rounded-none">
            <span className="w-2 h-2 bg-dark rounded-full animate-ping" />
            <span className="font-display font-bold uppercase tracking-wider text-[10px]">WINGMAN THINKING...</span>
          </div>
        )}
      </div>

      {/* Dropdown Filters & Service pills */}
      <div className="space-y-4 bg-white border-3 border-dark p-6 rounded-none shadow-brutal">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Area filter */}
          <div className="flex-1 relative">
            <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-dark pointer-events-none" strokeWidth={2.5} />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full bg-white border-3 border-dark text-dark text-xs rounded-none py-3 pl-9 pr-4 appearance-none focus:outline-none focus:shadow-[3px_3px_0px_#1A1A1A] transition-all font-sans font-bold uppercase"
            >
              <option value="">ALL NAGPUR AREAS</option>
              {areas.map(a => <option key={a} value={a}>{a.toUpperCase()}</option>)}
            </select>
          </div>

          {/* Clean filters reset */}
          {(selectedArea || selectedService || searchTerm) && (
            <button
              onClick={() => { setSelectedArea(''); setSelectedService(''); setSearchTerm(''); }}
              className="px-4 py-2.5 border-3 border-dark bg-white text-dark font-display font-bold text-xs shadow-[3px_3px_0px_#1A1A1A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#1A1A1A] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded-none cursor-pointer uppercase shrink-0"
            >
              CLEAR FILTERS
            </button>
          )}
        </div>

        {/* Service pills */}
        <div>
          <span className="block text-[10px] font-display font-bold text-dark uppercase tracking-wider mb-2">SERVICE TYPE</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedService('')}
              className={`px-3 py-1.5 border-2 border-dark font-display font-bold text-xs rounded-none transition-all cursor-pointer ${
                selectedService === ''
                  ? 'bg-yellow text-dark shadow-[2px_2px_0px_#1A1A1A] translate-y-[-2px]'
                  : 'bg-white text-dark shadow-[1px_1px_0px_#1A1A1A] hover:bg-cream hover:shadow-[2px_2px_0px_#1A1A1A]'
              }`}
            >
              ALL SERVICES
            </button>
            {services.map(s => {
              const isSelected = selectedService === s;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedService(s)}
                  className={`px-3 py-1.5 border-2 border-dark font-display font-bold text-xs rounded-none transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-yellow text-dark shadow-[2px_2px_0px_#1A1A1A] translate-y-[-2px]'
                      : 'bg-white text-dark shadow-[1px_1px_0px_#1A1A1A] hover:bg-cream hover:shadow-[2px_2px_0px_#1A1A1A]'
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {professionals.length > 0 ? (
          professionals.map((pro, i) => (
            <motion.div
              key={pro.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="w-full"
            >
              <ProfessionalCard 
                professional={pro} 
                onBook={handleBook} 
                onViewProfile={setPanelPro}
              />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center space-y-4 bg-white border-3 border-dark w-full shadow-brutal rounded-none">
            <p className="text-sm font-sans font-bold text-dark/70 uppercase tracking-tight">NO PROFESSIONALS FOUND MATCHING YOUR FILTERS IN NAGPUR.</p>
            <button 
              onClick={() => { setSelectedArea(''); setSelectedService(''); setSearchTerm(''); }}
              className="font-display font-bold text-xs text-dark underline hover:text-pink transition-colors cursor-pointer"
            >
              RESET FILTERS
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal 
        professional={selectedPro}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onBookingSuccess={() => {}}
      />

      {/* Professional Detail Slide-Over Panel */}
      <ProfessionalPanel
        professional={panelPro}
        isOpen={!!panelPro}
        onClose={() => setPanelPro(null)}
        onBook={handleBook}
      />
    </div>
  );
}
