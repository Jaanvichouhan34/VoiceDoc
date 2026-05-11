import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#0a0f1e]">
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
          <div className="glass-card p-2 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <img 
              src="/dashboard_mockup.png" 
              alt="VoiceDoc Dashboard Mockup" 
              className="rounded-xl w-full h-auto object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
