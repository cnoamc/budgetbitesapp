import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserProgress, defaultUserProfile, defaultUserProgress, CookedMeal } from '@/lib/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { saveBBProfile, getBBProfile } from '@/lib/storage';

interface AppContextType {
  profile: UserProfile;
  progress: UserProgress;
  loading: boolean;
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

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(defaultUserProfile);
  const [progress, setProgress] = useState<UserProgress>(defaultUserProgress);
  const [loading, setLoading] = useState(true);
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [potentialMonthlySavings, setPotentialMonthlySavings] = useState(0);
  const [yearlySavings, setYearlySavings] = useState(0);
  const [displayName, setDisplayName] = useState('השף הביתי');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Precompute savings when profile or progress changes
  useEffect(() => {
    // Average costs from recipes: delivery ~₪55, home ~₪10
    const AVG_DELIVERY_COST = 55;
    const AVG_HOME_COST = 10;
    const SAVINGS_PER_MEAL = AVG_DELIVERY_COST - AVG_HOME_COST; // ₪45 per meal
    
    // Calculate monthly orders from weekly orders
    const monthlyOrders = profile.weeklyOrders * 4;
    
    // Calculate potential monthly savings
    const potential = monthlyOrders * SAVINGS_PER_MEAL;
    setPotentialMonthlySavings(potential);
    
    // Calculate yearly savings
    const yearly = potential * 12;
    setYearlySavings(yearly);
    
    // Calculate actual monthly savings from cooked meals
    const now = new Date();
    const thisMonthMeals = progress.cookedMeals.filter(meal => {
      const mealDate = new Date(meal.date);
      return mealDate.getMonth() === now.getMonth() && mealDate.getFullYear() === now.getFullYear();
    });
    const actualMonthly = thisMonthMeals.reduce((sum, m) => sum + m.savings, 0);
    setMonthlySavings(actualMonthly);
  }, [profile.weeklyOrders, progress.cookedMeals]);

  // Load profile and progress from database when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      setProfile(defaultUserProfile);
      setProgress(defaultUserProgress);
      // Load from localStorage for non-authenticated users
      const bbProfile = getBBProfile();
      setDisplayName(bbProfile.displayName);
      setPhotoUrl(bbProfile.photoDataUrl);
      setLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        setProfile({
          monthlySpending: profileData.monthly_spending || 0,
          weeklyOrders: profileData.weekly_orders || 0,
          preferredFood: profileData.preferred_food || [],
          country: profileData.country || 'IL',
          cookingSkill: profileData.cooking_skill || 1,
          onboardingComplete: profileData.onboarding_complete || false,
        });
        
        // Load display name and photo from database
        const dbDisplayName = (profileData as any).display_name || 'השף הביתי';
        const dbPhotoUrl = (profileData as any).photo_url || null;
        setDisplayName(dbDisplayName);
        setPhotoUrl(dbPhotoUrl);
        
        // Sync to localStorage for offline access
        saveBBProfile({ displayName: dbDisplayName, photoDataUrl: dbPhotoUrl });
      }

      // Load cooked meals
      const { data: mealsData, error: mealsError } = await supabase
        .from('cooked_meals')
        .select('*')
        .eq('user_id', user.id)
        .order('cooked_at', { ascending: false });

      if (mealsError) throw mealsError;

      if (mealsData) {
        const cookedMeals: CookedMeal[] = mealsData.map(m => ({
          recipeId: m.recipe_id,
          date: m.cooked_at,
          tasteRating: m.taste_rating,
          difficultyRating: m.difficulty_rating,
          wouldMakeAgain: m.would_make_again || false,
          savings: m.savings || 0,
        }));

        const totalSavings = cookedMeals.reduce((sum, m) => sum + m.savings, 0);
        const avgRating = cookedMeals.length > 0 
          ? cookedMeals.reduce((sum, m) => sum + m.tasteRating, 0) / cookedMeals.length 
          : 0;

        setProgress({
          cookedMeals,
          totalMealsCooked: cookedMeals.length,
          totalSavings,
          averageRating: avgRating,
          skillLevel: Math.min(5, 1 + Math.floor(cookedMeals.length / 5)),
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('שגיאה בטעינת הנתונים');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);

    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          monthly_spending: newProfile.monthlySpending,
          weekly_orders: newProfile.weeklyOrders,
          preferred_food: newProfile.preferredFood,
          country: newProfile.country,
          cooking_skill: newProfile.cookingSkill,
          onboarding_complete: newProfile.onboardingComplete,
        })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('שגיאה בשמירת הפרופיל');
    }
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
    
    // Record cooking activity for inactivity tracking
    localStorage.setItem('bb_last_cook_date', new Date().toISOString());
    localStorage.removeItem('bb_inactivity_dismissed');

    if (!user) return;

    try {
      const { error } = await supabase
        .from('cooked_meals')
        .insert({
          user_id: user.id,
          recipe_id: meal.recipeId,
          taste_rating: meal.tasteRating,
          difficulty_rating: meal.difficultyRating,
          would_make_again: meal.wouldMakeAgain,
          savings: meal.savings,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding cooked meal:', error);
      toast.error('שגיאה בשמירת הארוחה');
    }
  };

  const updateDisplayName = async (name: string) => {
    setDisplayName(name);
    saveBBProfile({ displayName: name, photoDataUrl: photoUrl });

    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: name } as any)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating display name:', error);
      toast.error('שגיאה בשמירת השם');
    }
  };

  const updatePhotoUrl = async (url: string | null) => {
    setPhotoUrl(url);
    saveBBProfile({ displayName, photoDataUrl: url });

    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ photo_url: url } as any)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating photo:', error);
      toast.error('שגיאה בשמירת התמונה');
    }
  };

  return (
    <AppContext.Provider value={{
      profile,
      progress,
      loading,
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
