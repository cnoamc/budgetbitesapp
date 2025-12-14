import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserProgress, defaultUserProfile, defaultUserProgress, CookedMeal } from '@/lib/types';
import { getProfile, saveProfile, getProgress, saveProgress } from '@/lib/storage';

interface AppContextType {
  profile: UserProfile;
  progress: UserProgress;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  addCookedMeal: (meal: CookedMeal) => void;
  calculateMonthlySavings: () => number;
  calculatePotentialSavings: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
  const [progress, setProgress] = useState<UserProgress>(defaultUserProgress);

  useEffect(() => {
    setProfile(getProfile());
    setProgress(getProgress());
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const completeOnboarding = () => {
    updateProfile({ onboardingComplete: true });
  };

  const addCookedMeal = (meal: CookedMeal) => {
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
    saveProgress(newProgress);
  };

  const calculateMonthlySavings = (): number => {
    const now = new Date();
    const thisMonth = progress.cookedMeals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate.getMonth() === now.getMonth() && mealDate.getFullYear() === now.getFullYear();
    });
    return thisMonth.reduce((sum, m) => sum + m.savings, 0);
  };

  const calculatePotentialSavings = (): number => {
    // Average savings per meal * weekly orders * 4 weeks
    const avgSavingsPerMeal = 45; // Average savings
    return profile.weeklyOrders * avgSavingsPerMeal * 4;
  };

  return (
    <AppContext.Provider value={{
      profile,
      progress,
      updateProfile,
      completeOnboarding,
      addCookedMeal,
      calculateMonthlySavings,
      calculatePotentialSavings,
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
