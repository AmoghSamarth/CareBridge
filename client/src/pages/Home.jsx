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
import { ArrowRight } from 'lucide-react';

const homeProfessionals = [
  {
    id: 'ravi-sharma',
    name: 'Ravi Sharma',
    area: 'Dharampeth',
    services: ['haircut', 'beard'],
    price_range: '150-300',
    rating: 4.9,
    review_count: 32,
    experience_years: 6,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=400',
    ai_summary: 'Customers love his attention to detail for classic cuts and beard trims.'
  },
  {
    id: 'priya-desai',
    name: 'Priya Desai',
    area: 'Sitabuldi',
    services: ['facial', 'waxing', 'threading'],
    price_range: '300-500',
    rating: 4.8,
    review_count: 24,
    experience_years: 4,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=400',
    ai_summary: 'Clients rave about her soothing facials and painless threading care.'
  },
  {
    id: 'mohit-thakur',
    name: 'Mohit Thakur',
    area: 'Sadar',
    services: ['haircut', 'beard', 'hair color'],
    price_range: '250-450',
    rating: 4.7,
    review_count: 18,
    experience_years: 5,
    is_available: true,
    image_url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=400',
    ai_summary: 'Praised for modern trend styling and vibrant hair coloring techniques.'
  }
];

export default function Home({ setActiveTab }) {
  const { onboardingComplete } = useWingman();
  const [selectedPro, setSelectedPro] = useState(null);
  const [panelPro, setPanelPro] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  const handleBookInitiate = (pro) => { setSelectedPro(pro); setIsBookingOpen(true); };

  if (!onboardingComplete) {
    return (
      <div style={{ minHeight: 'calc(100vh - 136px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 'clamp(28px, 5vw, 40px)', color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '12px' }}>
              MEET YOUR WINGMAN
            </h1>
            <p style={{ fontFamily: 'Inter', fontSize: '12px', fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.7 }}>
              Your AI companion that proactively coordinates<br />your grooming before key life milestones.
            </p>
          </div>
          <WingmanChat />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px 40px' }}>

      {/* Emergency Banner */}
      <EmergencyBanner onTriggerEmergency={() => setIsEmergencyOpen(true)} />

      {/* Wingman Section */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{
            fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: '11px',
            background: '#F5C842', border: '2px solid #1A1A1A', color: '#1A1A1A',
            padding: '4px 12px', letterSpacing: '0.08em', boxShadow: '2px 2px 0 #1A1A1A'
          }}>
            ✦ WINGMAN'S ADVICE
          </span>
        </div>
        <WingmanCard onBookNow={handleBookInitiate} onOpenChat={() => { setActiveTab('wingman'); setTimeout(() => { document.getElementById('wingman-chat-anchor')?.scrollIntoView({ behavior: 'smooth' }); }, 100); }} />
      </div>

      {/* Professionals Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 'clamp(20px, 3vw, 28px)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            NAGPUR PROFESSIONALS
          </h2>
          <button onClick={() => setActiveTab('browse')} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: '11px',
            background: 'var(--bg-card)', border: '2px solid var(--border)', color: 'var(--text-primary)',
            padding: '8px 14px', boxShadow: '3px 3px 0 var(--shadow)', cursor: 'pointer',
            letterSpacing: '0.06em', transition: 'transform 0.12s, box-shadow 0.12s'
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '5px 5px 0 var(--shadow)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 var(--shadow)'; }}
          >
            SEE ALL <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {homeProfessionals.map(pro => (
            <ProfessionalCard key={pro.id} professional={pro} onBook={handleBookInitiate} onViewProfile={setPanelPro} />
          ))}
        </div>
      </div>

      <BookingModal professional={selectedPro} isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} onBookingSuccess={() => {}} />
      <ProfessionalPanel professional={panelPro} isOpen={!!panelPro} onClose={() => setPanelPro(null)} onBook={handleBookInitiate} />
      <EmergencyModal isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} onBookingSuccess={() => {}} />
    </div>
  );
}