import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const PROFILE_KEY = 'chefi_profile';

export interface LocalProfile {
  name: string;
  cookingLevel: number; // 1-5
  dietaryPreference: string; // 'all' | 'vegetarian' | 'vegan' | 'kosher'
  createdAt: string;
}

const defaultProfile: LocalProfile = {
  name: '',
  cookingLevel: 1,
  dietaryPreference: 'all',
  createdAt: '',
};

interface LocalProfileContextType {
  profile: LocalProfile | null;
  hasProfile: boolean;
  loading: boolean;
  createProfile: (name: string, cookingLevel?: number, dietaryPreference?: string) => void;
  updateProfile: (updates: Partial<LocalProfile>) => void;
  clearProfile: () => void;
}

const LocalProfileContext = createContext<LocalProfileContextType | undefined>(undefined);

export const LocalProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<LocalProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as LocalProfile;
        setProfile(parsed);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createProfile = (name: string, cookingLevel = 1, dietaryPreference = 'all') => {
    const newProfile: LocalProfile = {
      name: name.trim() || 'שף',
      cookingLevel,
      dietaryPreference,
      createdAt: new Date().toISOString(),
    };
    
    setProfile(newProfile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
  };

  const updateProfile = (updates: Partial<LocalProfile>) => {
    if (!profile) return;
    
    const updated = { ...profile, ...updates };
    setProfile(updated);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem(PROFILE_KEY);
  };

  const hasProfile = !!profile && !!profile.name;

  return (
    <LocalProfileContext.Provider value={{
      profile,
      hasProfile,
      loading,
      createProfile,
      updateProfile,
      clearProfile,
    }}>
      {children}
    </LocalProfileContext.Provider>
  );
};

export const useLocalProfile = (): LocalProfileContextType => {
  const context = useContext(LocalProfileContext);
  if (!context) {
    throw new Error('useLocalProfile must be used within LocalProfileProvider');
  }
  return context;
};
