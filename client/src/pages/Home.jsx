import React, { useState } from 'react';
import { useWingman } from '../context/WingmanContext';
import { useAuth } from '../context/AuthContext';
import WingmanCard from '../components/WingmanCard';
import WingmanChat from '../components/WingmanChat';
import ProfessionalCard from '../components/ProfessionalCard';
import BookingModal from '../components/BookingModal';
import EmergencyBanner from '../components/EmergencyBanner';
import ProfessionalPanel from '../components/ProfessionalPanel';
import EmergencyModal from '../components/EmergencyModal';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Home({ setActiveTab }) {
  const { user } = useAuth();
  const { onboardingComplete } = useWingman();
  const [selectedPro, setSelectedPro] = useState(null);
  const [panelPro, setPanelPro] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // Mock list of professionals for home screen carousel
  const homeProfessionals = [
    {
      id: 'ravi-sharma',
      name: "Ravi Sharma",
      area: "Dharampeth",
      services: ["haircut", "beard"],
      price_range: "150-300",
      rating: 4.9,
      review_count: 32,
      experience_years: 6,
      is_available: true,
      image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400",
      ai_summary: "Customers love his attention to detail for classic cuts and beard trims."
    },
    {
      id: 'priya-desai',
      name: "Priya Desai",
      area: "Sitabuldi",
      services: ["facial", "waxing", "threading"],
      price_range: "300-500",
      rating: 4.8,
      review_count: 24,
      experience_years: 4,
      is_available: true,
      image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400",
      ai_summary: "Clients rave about her soothing facials and painless threading care."
    },
    {
      id: 'mohit-thakur',
      name: "Mohit Thakur",
      area: "Sadar",
      services: ["haircut", "beard", "hair color"],
      price_range: "250-450",
      rating: 4.7,
      review_count: 18,
      experience_years: 5,
      is_available: true,
      image_url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=400",
      ai_summary: "Praised for modern trend styling and vibrant hair coloring techniques."
    }
  ];

  const handleBookInitiate = (pro) => {
    setSelectedPro(pro);
    setIsBookingOpen(true);
  };

  const handleEmergencyTrigger = () => {
    setIsEmergencyOpen(true);
  };

  const handleBookingConfirmed = (bookingDetails) => {
    // Save to list or let system handle it
  };

  return (
    <div className="pb-28 pt-20 px-4 max-w-6xl mx-auto space-y-8">
      {/* If onboarding is not complete, focus completely on the onboarding flow */}
      {!onboardingComplete ? (
        <div className="py-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight text-dark">
              MEET YOUR WINGMAN
            </h1>
            <p className="text-xs font-sans font-bold text-muted max-w-xs sm:max-w-sm mx-auto leading-relaxed uppercase tracking-wider">
              Your AI companion that proactively coordinates your grooming schedule before key life milestones.
            </p>
          </div>
          <WingmanChat />
        </div>
      ) : (
        /* If onboarding complete, show Dashboard */
        <>
          {/* Emergency Alert Banner */}
          <EmergencyBanner onTriggerEmergency={handleEmergencyTrigger} />

          {/* Wingman Card Component (Dashboard Main advice) */}
          <section className="space-y-4">
            <div className="flex items-center gap-1.5 px-1 select-none">
              <span className="inline-block font-display font-bold text-xs tracking-[0.1em] uppercase bg-yellow border-2 border-dark text-dark px-3 py-1 shadow-[2px_2px_0px_#1A1A1A]">
                WINGMAN'S ADVICE
              </span>
            </div>
            <WingmanCard onBookNow={handleBookInitiate} />
          </section>

          {/* Marketplace Browse Section */}
          <section className="space-y-6 pt-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-display text-2xl font-extrabold text-dark tracking-tight">NAGPUR PROFESSIONALS</h3>
              <button 
                onClick={() => setActiveTab('browse')}
                className="flex items-center gap-1.5 font-display font-bold text-xs border-2 border-dark bg-white hover:bg-cream text-dark px-3 py-1 shadow-[2px_2px_0px_#1A1A1A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all rounded-none cursor-pointer uppercase"
              >
                <span>SEE ALL</span>
                <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Responsive listing */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {homeProfessionals.map((pro) => (
                <div key={pro.id} className="w-full">
                  <ProfessionalCard 
                    professional={pro} 
                    onBook={handleBookInitiate} 
                    onViewProfile={setPanelPro}
                  />
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Booking Flow Modal */}
      <BookingModal 
        professional={selectedPro}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onBookingSuccess={handleBookingConfirmed}
      />

      {/* Slide-over Profile Panel */}
      <ProfessionalPanel
        professional={panelPro}
        isOpen={!!panelPro}
        onClose={() => setPanelPro(null)}
        onBook={handleBookInitiate}
      />

      {/* Emergency Booking Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onBookingSuccess={handleBookingConfirmed}
      />
    </div>
  );
}
