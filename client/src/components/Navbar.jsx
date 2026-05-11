import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, LogOut, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isActive, setIsActive] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const location = useLocation();
  const staticPages = ['/', '/privacy', '/terms', '/cookies', '/how-it-works', '/faq'];
  if (!user || staticPages.includes(location.pathname)) return null;

  return (
    <nav className="bg-[#0d1424] border-b border-[#1f2937] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Stethoscope className="h-8 w-8 text-primary animate-pulse-icon" />
              <span className="font-bold text-xl tracking-tight text-white">VoiceDoc</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-[#9ca3af] hover:text-white font-medium text-sm">Home</Link>
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">Status:</span>
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-success/20 border border-success/30' : 'bg-red-500/20 border border-red-500/30'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${isActive ? 'bg-success translate-x-6' : 'bg-red-500 translate-x-1'}`} />
              </button>
            </div>
            <ThemeToggle />
            
            <div className="flex items-center gap-2 mr-4">
              <div className="relative bg-[#1f2937] p-2 rounded-full border border-[#374151]">
                <User className="h-4 w-4 text-gray-300" />
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d1424] transition-colors ${isActive ? 'bg-success' : 'bg-red-500'}`}></span>
              </div>
              <span className="font-medium text-sm hidden sm:block text-gray-200">Dr. {user.name}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-1 bg-[#1f2937] hover:bg-[#374151] px-3 py-2 rounded-md text-sm transition-colors border border-[#374151]"
            >
              <LogOut className="h-4 w-4 text-gray-300" />
              <span className="hidden sm:inline text-gray-300">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
