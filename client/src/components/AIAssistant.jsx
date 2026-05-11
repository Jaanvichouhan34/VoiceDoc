import React, { useState, useEffect } from 'react';
import { Smile, X, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Update suggestion based on current route
    const path = location.pathname;
    if (path === '/') {
      setSuggestion("Welcome back! Ready for a new patient? Click 'New Consultation' to start.");
    } else if (path === '/new-consultation') {
      setSuggestion("Start by filling patient details, then use the microphone to record the consultation.");
    } else if (path.includes('/patient/')) {
      setSuggestion("Reviewing patient history. You can see past diagnoses and medicines prescribed.");
    } else if (path === '/login') {
      setSuggestion("Please sign in to access your clinic dashboard.");
    }
  }, [location]);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
      {/* Suggestion Bubble */}
      {isOpen && (
        <div className="bg-[#1f2937] border border-[#374151] rounded-2xl shadow-2xl p-4 w-72 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 p-1.5 rounded-lg">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-bold text-white">VoiceDoc AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[#9ca3af] hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm text-[#9ca3af] leading-relaxed mb-3">
            {suggestion}
          </p>
          <Link to="/how-it-works" className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer hover:gap-3 transition-all">
            LEARN MORE <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${isOpen ? 'bg-[#374151] rotate-90' : 'vd-btn-gradient hover:scale-110'}`}
      >
        {isOpen ? <X className="h-6 w-6 text-white" /> : <Smile className="h-8 w-8 text-white" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default AIAssistant;
