import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HelpSection = () => {
  const faqs = [
    {
      q: "How does voice recording work?",
      a: "VoiceDoc uses the Web Speech API integrated into modern browsers (like Chrome) to transcribe your speech in real-time. Simply click the microphone icon and start talking in Hindi or English."
    },
    {
      q: "Is my patient data secure?",
      a: "Yes. All data is encrypted in transit and at rest. We store minimal patient identifiers and focus entirely on the clinical data to ensure privacy."
    },
    {
      q: "Does it work offline?",
      a: "Currently, VoiceDoc requires an active internet connection for the speech-to-text API and the AI structuring to function."
    },
    {
      q: "Which languages are supported?",
      a: "VoiceDoc natively supports English (en-US) and Hindi (hi-IN). You can easily toggle between them from the consultation dashboard."
    },
    {
      q: "How to generate a prescription?",
      a: "After the AI analyzes your transcript and generates the structured record, simply click 'Generate Prescription' to instantly download a formatted PDF."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="help" className="py-24 bg-[#0a0f1e] border-t border-[#1f2937]/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-[#9ca3af] text-lg">Everything you need to know about VoiceDoc.</p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="vd-card overflow-hidden"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
              >
                <span className="font-bold text-white pr-4">{faq.q}</span>
                <ChevronDown className={`h-5 w-5 text-[#9ca3af] transition-transform ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-0">
                      <p className="text-[#9ca3af]">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HelpSection;
