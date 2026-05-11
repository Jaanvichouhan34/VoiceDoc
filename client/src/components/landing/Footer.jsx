import React from 'react';
import { Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0a0f1e] border-t border-[#1f2937] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight text-white">VoiceDoc</span>
          </div>
          <p className="text-[#9ca3af] mb-4 max-w-md">
            Revolutionizing clinical documentation for Indian doctors. Supporting English and Hindi code-switching.
          </p>
          <p className="text-sm text-[#374151]">&copy; 2026 VoiceDoc. All rights reserved.</p>
        </div>
        
        <div>
          <h3 className="text-white font-bold mb-4">Product</h3>
          <ul className="space-y-2">
            <li><a href="/#features" className="text-[#9ca3af] hover:text-white transition-colors text-sm">Features</a></li>
            <li><Link to="/how-it-works" className="text-[#9ca3af] hover:text-white transition-colors text-sm">How it Works</Link></li>
            <li><Link to="/faq" className="text-[#9ca3af] hover:text-white transition-colors text-sm">FAQ</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-white font-bold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><Link to="/privacy" className="text-[#9ca3af] hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-[#9ca3af] hover:text-white transition-colors text-sm">Terms of Service</Link></li>
            <li><Link to="/cookies" className="text-[#9ca3af] hover:text-white transition-colors text-sm">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
