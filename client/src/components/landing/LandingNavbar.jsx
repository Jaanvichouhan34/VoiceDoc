import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Menu, X } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const links = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/#about' },
    { name: 'Features', href: '/#features' },
    { name: 'Help', href: '/#help' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <nav className="landing-navbar fixed w-full z-50 bg-[#0d1424]/90 backdrop-blur-md border-b border-[#1f2937] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <a href="#home" className="flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-primary animate-pulse-icon" />
              <span className="font-bold text-2xl tracking-tight text-white">VoiceDoc</span>
            </a>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex space-x-6">
              {links.map((link) => (
                <a key={link.name} href={link.href} className="text-[#9ca3af] hover:text-white font-medium transition-colors">
                  {link.name}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {user ? (
                <>
                  <Link to="/dashboard" className="text-white border border-[#374151] px-5 py-2 rounded-lg hover:bg-[#1f2937] transition-colors font-medium">
                    Dashboard
                  </Link>
                  <button onClick={logout} className="vd-btn-gradient px-6 py-2 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-white border border-[#374151] px-5 py-2 rounded-lg hover:bg-[#1f2937] transition-colors font-medium">
                    Login
                  </Link>
                  <Link to="/login" className="vd-btn-gradient px-6 py-2 font-medium">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#9ca3af] hover:text-white p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-[#0d1424] border-b border-[#1f2937]">
          <div className="px-4 pt-2 pb-6 space-y-2 text-center">
            {links.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 text-base font-medium text-[#9ca3af] hover:text-white hover:bg-[#1f2937] rounded-md"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="w-full text-white border border-[#374151] px-5 py-3 rounded-lg hover:bg-[#1f2937] transition-colors font-medium">
                    Dashboard
                  </Link>
                  <button onClick={() => { logout(); setIsOpen(false); }} className="w-full vd-btn-gradient px-6 py-3 font-medium">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full text-white border border-[#374151] px-5 py-3 rounded-lg hover:bg-[#1f2937] transition-colors font-medium">
                    Login
                  </Link>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full vd-btn-gradient px-6 py-3 font-medium">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
