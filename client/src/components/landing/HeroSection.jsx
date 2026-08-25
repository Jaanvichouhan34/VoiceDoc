import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Mic, Activity, Sparkles, CheckCircle2, FileText, HeartPulse, Stethoscope } from 'lucide-react';

const HeroSection = () => {
  const { user } = useAuth();
  return (
    <section id="home" className="relative pt-32 lg:pt-40 pb-20 overflow-hidden bg-[#0a0f1e]">
      <div className="animated-bg"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold text-sm mb-6"
          >
            v2.0 Now Available
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6"
          >
            The AI Medical Scribe Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">India's Doctors</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl text-[#9ca3af] mb-10 max-w-2xl leading-relaxed"
          >
            Speak in Hindi or English. VoiceDoc transcribes, structures, and generates prescriptions instantly. Spend time with patients, not paperwork.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link to={user ? "/dashboard" : "/login"} className="vd-btn-gradient px-8 py-4 text-lg font-bold flex justify-center items-center gap-2 transform hover:scale-105 transition-transform">
              {user ? "Go to Dashboard" : "Start Free"}
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative hidden lg:block"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-3xl -z-10 rounded-full"></div>
          
          {/* Theme-Responsive Dynamic Dashboard Preview Card */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1f2937] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">VoiceDoc AI Consultation</h3>
                  <p className="text-xs text-[#9ca3af]">Patient Encounter #4829</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
                LIVE REC (02:14)
              </div>
            </div>

            {/* Patient Info Card */}
            <div className="vd-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                  AR
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Alex Rivera</div>
                  <div className="text-xs text-[#9ca3af]">28 yrs • Male • Follow-up</div>
                </div>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-[#1f2937] text-[#9ca3af]">BP: 120/80</span>
                <span className="px-2.5 py-1 rounded-md bg-[#1f2937] text-[#9ca3af]">HR: 72 bpm</span>
              </div>
            </div>

            {/* Audio Waveform & Transcript */}
            <div className="vd-card p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#9ca3af]">
                <span className="flex items-center gap-1.5 font-medium">
                  <Mic className="h-3.5 w-3.5 text-primary animate-pulse" /> Audio Transcript (Hindi/English)
                </span>
                <span className="text-primary font-semibold">Auto-Detect ON</span>
              </div>
              
              <div className="flex items-center gap-1 h-8 px-2 bg-[#0a0f1e] rounded-lg border border-[#1f2937]">
                {[40, 70, 35, 90, 60, 100, 45, 80, 50, 95, 75, 40, 85, 60, 30, 90, 55, 70, 40, 80].map((h, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-primary to-secondary rounded-full transition-all duration-300"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="text-xs text-[#9ca3af] italic line-clamp-2">
                "Doctor: Namaste, kya takleef hai? Patient: Mujhe 2 din se bukhar aur khasi hai..."
              </p>
            </div>

            {/* AI Medical Extraction */}
            <div className="grid grid-cols-2 gap-3">
              <div className="vd-card p-3 space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <HeartPulse className="h-3.5 w-3.5 text-red-500" /> Symptoms
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[11px] font-medium border border-red-500/20">Fever 101°F</span>
                  <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[11px] font-medium border border-red-500/20">Cough</span>
                </div>
              </div>

              <div className="vd-card p-3 space-y-2">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-yellow-500" /> Diagnosis
                </div>
                <p className="text-xs text-[#9ca3af] font-medium">Upper Respiratory Infection</p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="h-4 w-4" /> Rx Ready to Print
              </span>
              <button className="vd-btn-gradient px-4 py-2 text-xs font-bold flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Generate Rx PDF
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
