import React from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import { motion } from 'framer-motion';

const FAQPage = () => {
  const faqs = [
    {
      q: "Does it support Hindi audio?",
      a: "Yes, you can speak in Hindi or English (or a mix of both). The AI will understand and generate the clinical notes in English as required for documentation."
    },
    {
      q: "Is it secure and private?",
      a: "Yes, all data is encrypted and securely stored. Only you can access your patient records."
    },
    {
      q: "Can I edit the generated prescription?",
      a: "Yes, the AI generates the structured data, but you can edit any field (Symptoms, Diagnosis, Medicines, Advice) before finalizing and generating the PDF."
    },
    {
      q: "How many doctors can use it at once?",
      a: "The system is built on a highly scalable architecture and can handle thousands of concurrent users easily."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white flex flex-col">
      <LandingNavbar />
      <div className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-white">Frequently Asked Questions</h1>
          <p className="text-[#9ca3af] text-lg">Find answers to common questions about VoiceDoc.</p>
        </div>
        
        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="glass-card p-6 hover:bg-[#1f2937]/30 transition-colors cursor-pointer"
            >
              <h3 className="text-xl font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-[#9ca3af]">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;
