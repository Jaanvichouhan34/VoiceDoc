import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, LogOut, User, Menu, X, Home, LayoutDashboard, History } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isActive, setIsActive] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const staticPages = ['/', '/privacy', '/terms', '/cookies', '/how-it-works', '/faq'];
  if (!user || staticPages.includes(location.pathname)) return null;

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'History', path: '/consultations', icon: History },
  ];


  const isLinkActive = (path) => {
    if (path === '/') return location.pathname === '/' && !location.hash;
    if (path.startsWith('/#')) return location.pathname === '/' && location.hash === path.substring(1);
    return location.pathname === path;
  };

  return (
    <nav className="app-navbar sticky top-0 z-50 bg-[#0d1424]/95 backdrop-blur-md border-b border-[#1f2937] text-white shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <Stethoscope className="h-8 w-8 text-primary animate-pulse-icon" />
              <span className="font-bold text-xl tracking-tight text-white brand-text">VoiceDoc</span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const active = isLinkActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-1.5 nav-link ${
                      active
                        ? 'text-primary font-semibold bg-primary/10'
                        : 'text-[#9ca3af] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Controls (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider status-label">Status:</span>
              <button
                onClick={() => setIsActive(!isActive)}
                title={isActive ? 'Doctor Active' : 'Doctor Inactive'}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  isActive ? 'bg-success/20 border border-success/30' : 'bg-red-500/20 border border-red-500/30'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full transition-transform ${isActive ? 'bg-success translate-x-6' : 'bg-red-500 translate-x-1'}`} />
              </button>
            </div>

            <ThemeToggle />

            <div className="flex items-center gap-2 nav-user-pill bg-[#1f2937] px-3 py-1.5 rounded-full border border-[#374151]">
              <div className="relative">
                <User className="h-4 w-4 text-gray-300 user-icon" />
                <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full transition-colors ${isActive ? 'bg-success' : 'bg-red-500'}`}></span>
              </div>
              <span className="font-medium text-sm text-gray-200 user-name">
                {user.name?.toLowerCase().startsWith('dr.') ? user.name : `Dr. ${user.name}`}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 nav-btn-secondary bg-[#1f2937] hover:bg-[#374151] px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border border-[#374151] text-gray-300"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#9ca3af] hover:text-white nav-link focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0d1424] border-b border-[#1f2937] px-4 pt-2 pb-6 space-y-3 app-navbar-mobile">
          <div className="flex items-center justify-between py-2 border-b border-[#1f2937]/60">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-300 user-icon" />
              <span className="font-medium text-sm text-gray-200 user-name">
                {user.name?.toLowerCase().startsWith('dr.') ? user.name : `Dr. ${user.name}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#9ca3af] uppercase status-label">Status:</span>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  isActive ? 'bg-success/20 border border-success/30' : 'bg-red-500/20 border border-red-500/30'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full transition-transform ${isActive ? 'bg-success translate-x-4' : 'bg-red-500 translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-medium transition-colors nav-link ${
                  isLinkActive(link.path)
                    ? 'text-primary bg-primary/10 font-semibold'
                    : 'text-[#9ca3af] hover:text-white hover:bg-white/5'
                }`}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center gap-2 nav-btn-secondary bg-[#1f2937] hover:bg-[#374151] py-2.5 rounded-lg text-sm font-medium transition-colors border border-[#374151] text-gray-300"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

