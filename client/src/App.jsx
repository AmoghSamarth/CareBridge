import React, { useState, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WingmanProvider } from './context/WingmanContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProDashboard from './pages/ProDashboard';
import WingmanChat from './components/WingmanChat';

const Browse = lazy(() => import('./pages/Browse'));
const Bookings = lazy(() => import('./pages/Bookings'));

const SpinnerDots = () => (
  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    {[0,1,2].map(i => (
      <motion.div key={i}
        style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F5C842', border: '2px solid #1A1A1A' }}
        animate={{ y: [0,-8,0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i*0.12 }}
      />
    ))}
  </div>
);

function AppContent() {
  const { loading, onboardingComplete } = useAuth();
  const [activeTab, setActiveTab] = useState('wingman');

  if (loading) return <SpinnerDots />;

  if (window.location.pathname === '/pro-dashboard') return <ProDashboard />;

  return (
    <WingmanProvider>
      <div className="page-wrapper" style={{ minHeight: '100vh', background: 'var(--bg-page)', fontFamily: 'Inter', color: 'var(--text-primary)' }}>
        {!onboardingComplete ? (
          <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div className="w-full max-w-lg">
              <div className="text-center mb-8 select-none">
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight text-dark uppercase">
                  MEET YOUR WINGMAN
                </h1>
                <p className="text-xs font-sans font-bold text-muted max-w-xs sm:max-w-sm mx-auto leading-relaxed uppercase tracking-wider">
                  Your AI companion that proactively coordinates your grooming schedule before key life milestones.
                </p>
              </div>
              <WingmanChat />
            </div>
          </main>
        ) : (
          <>
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main style={{ paddingTop: '72px', paddingBottom: '80px', minHeight: '100vh' }}>
              <AnimatePresence mode="wait">
                <Suspense fallback={<SpinnerDots />}>
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {activeTab === 'wingman'  && <Home setActiveTab={setActiveTab} />}
                    {activeTab === 'browse'   && <Browse />}
                    {activeTab === 'bookings' && <Bookings setActiveTab={setActiveTab} />}
                    {activeTab === 'profile'  && <Profile />}
                  </motion.div>
                </Suspense>
              </AnimatePresence>
            </main>
          </>
        )}
      </div>
    </WingmanProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
