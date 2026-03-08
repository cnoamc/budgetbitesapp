import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { t as translate, Locale } from '@/lib/translations';

const LANG_KEY = 'chefi_lang';

interface LanguageContextType {
  locale: Locale;
  dir: 'rtl' | 'ltr';
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  hasChosenLanguage: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (stored === 'en' || stored === 'he') return stored;
    } catch {}
    return 'he';
  });

  const [hasChosenLanguage, setHasChosenLanguage] = useState(() => {
    try {
      return !!localStorage.getItem(LANG_KEY);
    } catch {
      return false;
    }
  });

  const dir = locale === 'he' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [locale, dir]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setHasChosenLanguage(true);
    localStorage.setItem(LANG_KEY, newLocale);
  };

  const t = (key: string) => translate(key, locale);

  return (
    <LanguageContext.Provider value={{ locale, dir, setLocale, t, hasChosenLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
