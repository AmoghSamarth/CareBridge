import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Calendar, 
  Users, 
  Star, 
  TrendingUp, 
  LogOut, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

export default function ProDashboard() {
  const { user, logout } = useAuth();

  const mockStats = [
    { label: 'Active Bookings', value: '8', icon: Calendar, color: 'text-gold' },
    { label: 'Total Clients', value: '24', icon: Users, color: 'text-gold' },
    { label: 'Average Rating', value: '4.9 ★', icon: Star, color: 'text-gold' },
    { label: 'Weekly Revenue', value: '₹14,250', icon: TrendingUp, color: 'text-gold' },
  ];

  const mockBookings = [
    {
      id: 'b1',
      clientName: 'Rohan Deshmukh',
      service: 'Premium Grooming + Beard Styling',
      time: 'Today • 2:30 PM',
      location: 'Flat 402, Alpine Heights, Dharampeth, Nagpur',
      status: 'Confirmed',
    },
    {
      id: 'b2',
      clientName: 'Priya Joshi',
      service: 'Complete Hair Makeover & Spa',
      time: 'Tomorrow • 10:00 AM',
      location: '12, Shankarnagar Road, near Coffee House, Nagpur',
      status: 'Confirmed',
    },
    {
      id: 'b3',
      clientName: 'Amit Walke',
      service: 'Corporate Placement Grooming Session',
      time: 'June 10 • 4:00 PM',
      location: 'Block C-3, Tech Park Residency, VNIT Gate, Nagpur',
      status: 'Confirmed',
    },
  ];

  const handleReturnToLanding = () => {
    // Redirect to landing page
    window.location.href = 'http://localhost:5174';
  };

  return (
    <div className="min-h-screen bg-bgPrimary text-cream relative p-6 md:p-12 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between border-b border-gold/10 pb-6 mb-8 z-10 relative">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-gold" />
          <div>
            <span className="font-serif font-bold text-xl tracking-wider">
              Care<span className="text-gold">Bridge</span>
            </span>
            <span className="ml-2 text-[10px] text-gold border border-gold/25 px-2 py-0.5 rounded bg-gold/5 font-sans font-semibold tracking-wider uppercase">
              PRO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReturnToLanding}
            className="hidden sm:inline-flex text-xs text-muted hover:text-cream border border-gold/10 hover:border-gold/30 px-4 py-2 rounded-xl transition-all"
          >
            Landing Page
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold px-4 py-2 rounded-xl border border-gold/20 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto z-10 relative">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[10px] bg-gold/10 border border-gold/20 text-gold px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider font-sans">
                Professional Sandbox Mode
              </span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide">
              Welcome back, <span className="gold-gradient-text">{user?.displayName || 'Grooming Professional'}</span>
            </h1>
            <p className="text-xs text-muted mt-1 max-w-xl">
              Manage your Nagpur doorstep grooming appointments, check reviews, and update your schedule.
            </p>
          </div>

          <div className="bg-bgCard border border-gold/20 p-4 rounded-2xl max-w-sm flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-cream flex items-center gap-1.5">
                <span>CareBridge Pro Console</span>
                <span className="bg-gold/20 text-gold text-[9px] px-1.5 py-0.5 rounded font-mono font-normal">v1.0-stub</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed mt-1">
                The full Professional Portal dashboard suite, scheduler, and live map navigation are currently in development.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {mockStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className="bg-bgCard border border-gold/10 p-5 rounded-2xl relative overflow-hidden group hover:border-gold/30 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 rounded-bl-3xl -translate-y-2 translate-x-2 group-hover:scale-110 transition-transform duration-300 pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] text-muted uppercase tracking-wider font-sans font-medium">
                    {stat.label}
                  </span>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="font-serif text-2xl font-bold text-cream">
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Two Column Layout: Bookings & Upcoming features */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookings Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-serif text-xl font-bold tracking-wide flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gold" /> Upcoming Visits
              </h2>
              <span className="text-[10px] text-muted uppercase tracking-wider font-mono">Nagpur Region</span>
            </div>

            <div className="space-y-4">
              {mockBookings.map((booking) => (
                <div 
                  key={booking.id}
                  className="bg-bgCard border border-gold/10 hover:border-gold/25 p-5 rounded-2xl transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-cream">{booking.clientName}</span>
                      <span className="inline-flex items-center gap-1 text-[9px] bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-sans">
                        <CheckCircle2 className="w-2.5 h-2.5" /> {booking.status}
                      </span>
                    </div>
                    <div className="text-xs text-gold font-sans font-medium">{booking.service}</div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-xs text-muted pt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold/60 shrink-0" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gold/60 shrink-0" />
                        <span>{booking.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 md:self-center">
                    <button className="flex-1 md:flex-none bg-gold/10 hover:bg-gold/20 text-gold text-xs font-semibold py-2.5 px-4 rounded-xl border border-gold/20 transition-all font-sans">
                      Start Navigation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Premium feature stub details */}
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold tracking-wide flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-gold" /> Pro Portal Roadmap
            </h2>

            <div className="bg-bgCard border border-gold/15 p-5 rounded-2xl space-y-4">
              <div className="pb-4 border-b border-gold/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-cream">Wingman Pro Recommendations</span>
                  <span className="text-[8px] bg-gold/20 text-gold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">Soon</span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  Wingman AI will analyze seasonal demands (weddings, festivals, corporate placements in Nagpur) and suggest packages or price changes.
                </p>
              </div>

              <div className="pb-4 border-b border-gold/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-cream">Live Smart Route Navigation</span>
                  <span className="text-[8px] bg-gold/20 text-gold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">Soon</span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  Dynamic route plotting optimized for traffic in key Nagpur lanes (Dharampeth, Sadar, Wardhaman Nagar) to ensure 100% on-time arrivals.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-cream">Instant Payouts & Tips</span>
                  <span className="text-[8px] bg-gold/20 text-gold px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">Soon</span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  Receive earnings directly to UPI immediately after service confirmation, with detailed tips breakdowns and customer reviews.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto text-center text-[10px] text-muted/60 font-sans tracking-wide mt-16 pt-6 border-t border-gold/5">
        CareBridge Professional Portal • Nagpur 2026. All rights reserved.
      </footer>
    </div>
  );
}
