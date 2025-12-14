import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeColor, getTheme, saveTheme } from '@/lib/storage';

interface ThemeContextType {
  theme: ThemeColor;
  setTheme: (theme: ThemeColor) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors: Record<ThemeColor, { primary: string; ring: string; gradient: string; glow: string }> = {
  orange: {
    primary: '16 85% 60%',
    ring: '16 85% 60%',
    gradient: 'linear-gradient(135deg, hsl(16 85% 60%) 0%, hsl(25 90% 55%) 100%)',
    glow: '0 0 40px hsl(16 85% 60% / 0.2)',
  },
  blue: {
    primary: '210 85% 55%',
    ring: '210 85% 55%',
    gradient: 'linear-gradient(135deg, hsl(210 85% 55%) 0%, hsl(220 90% 50%) 100%)',
    glow: '0 0 40px hsl(210 85% 55% / 0.2)',
  },
  purple: {
    primary: '270 70% 60%',
    ring: '270 70% 60%',
    gradient: 'linear-gradient(135deg, hsl(270 70% 60%) 0%, hsl(280 75% 55%) 100%)',
    glow: '0 0 40px hsl(270 70% 60% / 0.2)',
  },
  green: {
    primary: '160 60% 45%',
    ring: '160 60% 45%',
    gradient: 'linear-gradient(135deg, hsl(160 60% 45%) 0%, hsl(170 65% 40%) 100%)',
    glow: '0 0 40px hsl(160 60% 45% / 0.2)',
  },
  pink: {
    primary: '340 75% 60%',
    ring: '340 75% 60%',
    gradient: 'linear-gradient(135deg, hsl(340 75% 60%) 0%, hsl(350 80% 55%) 100%)',
    glow: '0 0 40px hsl(340 75% 60% / 0.2)',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeColor>(() => getTheme());

  const applyTheme = (color: ThemeColor) => {
    const colors = themeColors[color];
    const root = document.documentElement;
    
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--ring', colors.ring);
    root.style.setProperty('--gradient-primary', colors.gradient);
    root.style.setProperty('--shadow-glow', colors.glow);
  };

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: ThemeColor) => {
    setThemeState(newTheme);
    saveTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
