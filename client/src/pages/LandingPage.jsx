import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HelpSection from '../components/landing/HelpSection';
import ContactSection from '../components/landing/ContactSection';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white selection:bg-primary/30">
      <LandingNavbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <HelpSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
