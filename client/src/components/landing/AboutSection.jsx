import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-[#0a0f1e] relative border-t border-[#1f2937]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Bridging the Healthcare Gap in Rural India</h2>
            <p className="text-[#9ca3af] text-lg leading-relaxed mb-6">
              Over 600 million patients in rural areas depend on a severely understaffed medical workforce. Doctors often see over 100 patients a day, leaving less than 2 minutes per consultation.
            </p>
            <p className="text-[#9ca3af] text-lg leading-relaxed mb-8">
              VoiceDoc was built specifically to solve this. Unlike western tools, we support Hindi out-of-the-box, allowing doctors to converse naturally while AI handles the heavy lifting of charting and prescription generation.
            </p>
            <ul className="space-y-4">
              {['Save 3+ hours of paperwork daily', 'Reduce documentation errors by 90%', 'Works with diverse Indian accents'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-white">
                  <CheckCircle2 className="h-6 w-6 text-success shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { val: "100+", label: "Patients/Day per Doctor", color: "text-primary" },
              { val: "80%", label: "Doctors in Urban Cities", color: "text-secondary", translate: "sm:translate-y-8" },
              { val: "600M", label: "Underserved Patients", color: "text-purple-500" },
              { val: "0", label: "Hindi-First Competitors", color: "text-success", translate: "sm:translate-y-8" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`vd-card p-8 flex flex-col items-center text-center ${stat.translate || ''}`}
              >
                <span className={`text-5xl font-extrabold ${stat.color} mb-2`}>{stat.val}</span>
                <span className="text-[#9ca3af] font-medium">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
