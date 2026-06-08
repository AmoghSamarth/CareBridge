import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import Features from '../components/Features.jsx';
import WingmanDemo from '../components/WingmanDemo.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import SocialProof from '../components/SocialProof.jsx';
import ForProfessionals from '../components/ForProfessionals.jsx';
import Pricing from '../components/Pricing.jsx';
import FAQ from '../components/FAQ.jsx';
import CityLaunch from '../components/CityLaunch.jsx';
import Footer from '../components/Footer.jsx';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-dark font-sans">
      <Navbar />
      <Hero />
      <Features />
      <WingmanDemo />
      <HowItWorks />
      <SocialProof />
      <ForProfessionals />
      <Pricing />
      <FAQ />
      <CityLaunch />
      <Footer />
    </div>
  );
}
