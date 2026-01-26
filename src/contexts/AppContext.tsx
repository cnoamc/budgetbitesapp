import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserProgress, defaultUserProfile, defaultUserProgress, CookedMeal } from '@/lib/types';
import { useLocalProfile } from './LocalProfileContext';
import { saveBBProfile, getBBProfile } from '@/lib/storage';

interface AppContextType {
  profile: UserProfile;
  progress: UserProgress;
  loading: boolean;
  syncing: boolean;
  monthlySavings: number;
  potentialMonthlySavings: number;
  yearlySavings: number;
  displayName: string;
  photoUrl: string | null;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  addCookedMeal: (meal: CookedMeal) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  updatePhotoUrl: (url: string | null) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Storage keys for local progress
const PROGRESS_KEY = 'chefi_progress';
const MEALS_KEY = 'chefi_cooked_meals';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profile: localProfile } = useLocalProfile();
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
  const [progress, setProgress] = useState<UserProgress>(defaultUserProgress);
  const [loading, setLoading] = useState(true);
  const [syncing] = useState(false);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [potentialMonthlySavings, setPotentialMonthlySavings] = useState(0);
  const [yearlySavings, setYearlySavings] = useState(0);
  const [displayName, setDisplayName] = useState('שף');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Load data from localStorage
  useEffect(() => {
    try {
      // Load profile from localStorage
      const bbProfile = getBBProfile();
      setPhotoUrl(bbProfile.photoDataUrl);
      
      // Load cooked meals from localStorage
      const storedMeals = localStorage.getItem(MEALS_KEY);
      if (storedMeals) {
        const meals: CookedMeal[] = JSON.parse(storedMeals);
        const totalSavings = meals.reduce((sum, m) => sum + m.savings, 0);
        const avgRating = meals.length > 0 
          ? meals.reduce((sum, m) => sum + m.tasteRating, 0) / meals.length 
          : 0;
        
        setProgress({
          cookedMeals: meals,
          totalMealsCooked: meals.length,
          totalSavings,
          averageRating: avgRating,
          skillLevel: Math.min(5, 1 + Math.floor(meals.length / 5)),
        });
      }

      // Load profile settings
      const storedProfile = localStorage.getItem(PROGRESS_KEY);
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error('Failed to load local data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync display name from local profile
  useEffect(() => {
    if (localProfile?.name) {
      setDisplayName(localProfile.name);
    }
  }, [localProfile?.name]);

  // Sync cooking level from local profile
  useEffect(() => {
    if (localProfile?.cookingLevel) {
      setProfile(prev => ({ ...prev, cookingSkill: localProfile.cookingLevel }));
    }
  }, [localProfile?.cookingLevel]);

  // Precompute savings when profile or progress changes
  useEffect(() => {
    const AVG_DELIVERY_COST = 55;
    const AVG_HOME_COST = 10;
    const SAVINGS_PER_MEAL = AVG_DELIVERY_COST - AVG_HOME_COST;
    
    const monthlyOrders = profile.weeklyOrders * 4;
    const potential = monthlyOrders * SAVINGS_PER_MEAL;
    setPotentialMonthlySavings(potential);
    
    const yearly = potential * 12;
    setYearlySavings(yearly);
    
    const now = new Date();
    const thisMonthMeals = progress.cookedMeals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate.getMonth() === now.getMonth() && mealDate.getFullYear() === now.getFullYear();
    });
    const actualMonthly = thisMonthMeals.reduce((sum, m) => sum + m.savings, 0);
    setMonthlySavings(actualMonthly);
  }, [profile.weeklyOrders, progress.cookedMeals]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProfile));
  };

  const completeOnboarding = async () => {
    await updateProfile({ onboardingComplete: true });
  };

  const addCookedMeal = async (meal: CookedMeal) => {
    const newMeals = [...progress.cookedMeals, meal];
    const totalSavings = newMeals.reduce((sum, m) => sum + m.savings, 0);
    const avgRating = newMeals.reduce((sum, m) => sum + m.tasteRating, 0) / newMeals.length;
    
    const newProgress: UserProgress = {
      ...progress,
      cookedMeals: newMeals,
      totalMealsCooked: newMeals.length,
      totalSavings,
      averageRating: avgRating,
      skillLevel: Math.min(5, 1 + Math.floor(newMeals.length / 5)),
    };
    
    setProgress(newProgress);
    localStorage.setItem(MEALS_KEY, JSON.stringify(newMeals));
    
    // Record cooking activity for inactivity tracking
    localStorage.setItem('bb_last_cook_date', new Date().toISOString());
    localStorage.removeItem('bb_inactivity_dismissed');
  };

  const updateDisplayName = async (name: string) => {
    setDisplayName(name);
    saveBBProfile({ displayName: name, photoDataUrl: photoUrl });
  };

  const updatePhotoUrl = async (url: string | null) => {
    setPhotoUrl(url);
    saveBBProfile({ displayName, photoDataUrl: url });
  };

  return (
    <AppContext.Provider value={{
      profile,
      progress,
      loading,
      syncing,
      monthlySavings,
      potentialMonthlySavings,
      yearlySavings,
      displayName,
      photoUrl,
      updateProfile,
      completeOnboarding,
      addCookedMeal,
      updateDisplayName,
      updatePhotoUrl,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
