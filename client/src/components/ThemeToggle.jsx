import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(localStorage.getItem('theme') === 'light');

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLight]);

  return (
    <button 
      onClick={() => setIsLight(!isLight)}
      className="p-2 rounded-lg bg-[#1f2937] hover:bg-[#374151] transition-colors"
      aria-label="Toggle Theme"
    >
      {isLight ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-yellow-500" />}
    </button>
  );
};

export default ThemeToggle;
