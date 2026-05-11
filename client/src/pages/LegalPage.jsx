import React from 'react';
import { useLocation } from 'react-router-dom';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';

const LegalPage = () => {
  const location = useLocation();
  const path = location.pathname;
  
  let title = "Legal Information";
  let content = <p>Content not found.</p>;
  
  if (path === '/privacy') {
    title = "Privacy Policy";
    content = (
      <div className="space-y-4">
        <p>This Privacy Policy describes how VoiceDoc collects, uses, and shares your personal information when you use our service. We take your data privacy seriously, especially regarding clinical information.</p>
        
        <h2 className="text-xl font-bold text-white mt-6 mb-2">1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create an account, use the voice recording feature, or contact support. This may include your name, email, medical registration number, and the audio recordings and transcripts of consultations.</p>
        
        <h2 className="text-xl font-bold text-white mt-6 mb-2">2. How We Use Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, including to process audio recordings and generate structured medical notes. We do not sell your personal data or patient data to third parties.</p>
        
        <h2 className="text-xl font-bold text-white mt-6 mb-2">3. Data Security & Encryption</h2>
        <p>All patient data and audio recordings are encrypted in transit and at rest. We use industry-standard security measures to protect your information. Access to patient data is restricted strictly to the authorized doctor who created the record.</p>
        
        <h2 className="text-xl font-bold text-white mt-6 mb-2">4. Clinical Disclaimer</h2>
        <p>VoiceDoc is an AI-powered documentation assistant. It does not provide medical advice, diagnosis, or treatment. Doctors are solely responsible for reviewing and verifying the accuracy of all generated clinical notes and prescriptions before finalizing them.</p>
      </div>
    );
  } else if (path === '/terms') {
    title = "Terms of Service";
    content = (
      <div className="space-y-4">
        <p>By using VoiceDoc, you agree to these terms. Please read them carefully.</p>
        <h2 className="text-xl font-bold text-white mt-6 mb-2">1. Use of Service</h2>
        <p>You must be a registered medical practitioner to use this service. You agree to use the service only for lawful purposes and in compliance with all applicable medical regulations.</p>
        <h2 className="text-xl font-bold text-white mt-6 mb-2">2. Account Responsibility</h2>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
      </div>
    );
  } else if (path === '/cookies') {
    title = "Cookie Policy";
    content = (
      <div className="space-y-4">
        <p>We use cookies to improve your experience on VoiceDoc.</p>
        <p>These cookies help us understand how you use the site and keep you logged in. You can manage your cookie preferences in your browser settings. Disabling cookies may affect the functionality of the service.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      <LandingNavbar />
      <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <h1 className="text-4xl font-bold mb-6 text-white">{title}</h1>
        <div className="glass-card p-8 text-[#9ca3af] leading-relaxed">
          {content}
          <p className="mt-8 text-sm text-[#4b5563]">Last updated: May 2026. This is a production-ready template for legal terms.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LegalPage;
