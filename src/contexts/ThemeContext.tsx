import React, { createContext, useContext, useEffect } from 'react';

interface ThemeContextType {
  theme: 'default';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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
  useEffect(() => {
    applyFixedTheme();
    // Clean up old theme storage
    localStorage.removeItem('bb_theme');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: 'default' }}>
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
