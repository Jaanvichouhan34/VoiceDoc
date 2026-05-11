import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import { Mic, BrainCircuit, FileDown } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Mic className="h-8 w-8 text-primary" />,
      title: "1. Record Consultation",
      desc: "Tap the microphone and speak naturally with your patient. You can speak in Hindi, English, or a mix of both."
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-purple-500" />,
      title: "2. AI Structuring",
      desc: "Our AI processes the transcript and extracts symptoms, diagnosis, and medicines into structured clinical data."
    },
    {
      icon: <FileDown className="h-8 w-8 text-success" />,
      title: "3. Generate Prescription",
      desc: "Verify the structured data, add advice, and click generate to get a professional PDF prescription."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      <LandingNavbar />
      <div className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">How It Works</h1>
          <p className="text-[#9ca3af] text-lg">See how VoiceDoc streamlines your clinic workflow in 3 simple steps.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="glass-card p-8 text-center flex flex-col items-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6 border border-primary/20">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-[#9ca3af] leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;
