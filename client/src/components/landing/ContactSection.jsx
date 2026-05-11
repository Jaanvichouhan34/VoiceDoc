import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactSection = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://formspree.io/f/xpqbdnba", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('Message sent! We\'ll get back to you soon.');
        e.target.reset();
      } else {
        setStatus('Oops! There was a problem submitting your form.');
      }
    } catch (error) {
      setStatus('Oops! There was a problem submitting your form.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0d1424] border-t border-[#1f2937]/50 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Get in Touch</h2>
          <p className="text-[#9ca3af] text-lg mb-12">Have questions or want a custom deployment for your clinic? Reach out to us.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="vd-card p-8 text-left max-w-2xl mx-auto"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-2">Name</label>
              <input name="name" type="text" required className="vd-input w-full py-3 px-4" placeholder="Dr. Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-2">Email Address</label>
              <input name="email" type="email" required className="vd-input w-full py-3 px-4" placeholder="doctor@clinic.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-2">Message</label>
              <textarea name="message" required rows="5" className="vd-input w-full py-3 px-4 resize-none" placeholder="How can we help you?"></textarea>
            </div>
            
            {status && (
              <div className={`p-4 rounded-lg text-sm font-medium border ${status.includes('sent') ? 'bg-success/10 text-success border-success/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                {status}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full vd-btn-gradient py-4 text-lg font-bold disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></span> : 'Send Message'}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
