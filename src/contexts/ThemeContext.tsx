import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: 'default';
  mode: ThemeMode;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_MODE_KEY = 'bb_theme_mode';

// Fixed Apple-style theme - no customization
const applyFixedTheme = () => {
  const root = document.documentElement;
  
  // Apple Blue primary
  root.style.setProperty('--primary', '214 84% 56%');
  root.style.setProperty('--ring', '214 84% 56%');
  root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, hsl(214 84% 56%) 0%, hsl(220 90% 50%) 100%)');
  root.style.setProperty('--shadow-glow', '0 0 40px hsl(214 84% 56% / 0.2)');
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem(THEME_MODE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    applyFixedTheme();
    // Clean up old theme storage
    localStorage.removeItem('bb_theme');
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_MODE_KEY, mode);
  }, [mode]);

  const toggleMode = () => {
    setModeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme: 'default', mode, toggleMode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};