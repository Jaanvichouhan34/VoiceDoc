import React from 'react';
import { Mic, BrainCircuit, FileDown, Clock, HeartPulse, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Mic className="h-8 w-8 text-primary" />,
      title: "Bilingual Transcription",
      desc: "Speak naturally in Hindi or English. Our tuned Web Speech API captures medical terminology accurately.",
      bg: "bg-primary/10",
      border: "border-primary/20"
    },
    {
      icon: <BrainCircuit className="h-8 w-8 text-purple-500" />,
      title: "AI Structuring",
      desc: "Powered by Groq & Llama-3, your raw voice is instantly converted into structured Symptoms, Diagnosis, and Advice.",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20"
    },
    {
      icon: <FileDown className="h-8 w-8 text-success" />,
      title: "1-Click Prescriptions",
      desc: "Generate professional PDF prescriptions with your registration number, ready to print or share.",
      bg: "bg-success/10",
      border: "border-success/20"
    },
    {
      icon: <Clock className="h-8 w-8 text-secondary" />,
      title: "Patient History",
      desc: "Maintain a chronological timeline of every patient visit. Never lose track of a follow-up.",
      bg: "bg-secondary/10",
      border: "border-secondary/20"
    },
    {
      icon: <HeartPulse className="h-8 w-8 text-red-500" />,
      title: "Diagnostic Suggestions",
      desc: "Get an AI second opinion. VoiceDoc suggests 3 possible diagnoses based on recorded symptoms.",
      bg: "bg-red-500/10",
      border: "border-red-500/20"
    },
    {
      icon: <Smartphone className="h-8 w-8 text-yellow-500" />,
      title: "Mobile Friendly",
      desc: "Access your dashboard from your phone, tablet, or PC. Your clinic goes wherever you go.",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20"
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#0d1424] border-t border-[#1f2937]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Everything You Need</h2>
          <p className="text-[#9ca3af] text-lg max-w-2xl mx-auto">VoiceDoc replaces pen and paper with a seamless, AI-powered workflow designed for speed.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-8 hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
            >
              <div className={`${f.bg} w-16 h-16 rounded-xl flex items-center justify-center mb-6 border ${f.border} group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
              <p className="text-[#9ca3af] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
