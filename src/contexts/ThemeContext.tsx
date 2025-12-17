import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'default';
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_MODE_KEY = 'bb_theme_mode';

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

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
    if (stored === 'dark' || stored === 'light' || stored === 'system') return stored;
    return 'system'; // Default to system
  });

  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>(() => {
    if (mode === 'system') return getSystemTheme();
    return mode === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    applyFixedTheme();
    // Clean up old theme storage
    localStorage.removeItem('bb_theme');
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (mode === 'system') {
        setResolvedMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  // Update resolved mode when mode changes
  useEffect(() => {
    if (mode === 'system') {
      setResolvedMode(getSystemTheme());
    } else {
      setResolvedMode(mode);
    }
  }, [mode]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Add transition class for smooth theme switching
    root.classList.add('theme-transition');
    
    if (resolvedMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem(THEME_MODE_KEY, mode);

    // Remove transition class after animation completes
    const timeout = setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);

    return () => clearTimeout(timeout);
  }, [resolvedMode, mode]);

  const toggleMode = () => {
    setModeState(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
  };

  return (
    <ThemeContext.Provider value={{ theme: 'default', mode, resolvedMode, toggleMode, setMode }}>
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