import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Clock, Flame, TrendingUp, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecipeCard } from '@/components/RecipeCard';

import { GradientBackground } from '@/components/ui/GradientBackground';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { InactivityAlert } from '@/components/notifications';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { useApp } from '@/contexts/AppContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useInactivityTracker } from '@/hooks/useInactivityTracker';
import { useStatusBar } from '@/hooks/useStatusBar';
import { recipes } from '@/lib/recipes';
import { getRecipeImage } from '@/lib/recipeImages';
import appLogo from '@/assets/app-logo.png';

// Streak milestones
const MILESTONES = [
  { days: 3, emoji: '🏆', label: 'מתחיל' },
  { days: 7, emoji: '⭐', label: 'שבוע!' },
  { days: 14, emoji: '👨‍🍳', label: 'שף!' },
  { days: 30, emoji: '🔥', label: 'אלוף!' },
];

// Calculate cooking streak from cooked meals
const calculateStreak = (cookedMeals: { date: string }[]) => {
  if (cookedMeals.length === 0) return 0;
  
  const sortedDates = [...cookedMeals]
    .map(m => new Date(m.date).toDateString())
    .filter((date, i, arr) => arr.indexOf(date) === i)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;
  
  let streak = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = Math.round((prevDate.getTime() - currDate.getTime()) / 86400000);
    if (diffDays === 1) streak++;
    else break;
  }
  return streak;
};

// Calculate time until midnight
const getTimeUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
};

const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'בוקר טוב';
  if (hour >= 12 && hour < 17) return 'צהריים טובים';
  if (hour >= 17 && hour < 21) return 'ערב טוב';
  return 'לילה טוב';
};

const cookingTips = [
  "תמיד חממו מחבת לפני שמוסיפים שמן 🔥",
  "מלח בסוף - כך השפים עושים 🧂",
  "סכין חדה = בישול בטוח יותר 🔪",
  "תנו לבשר לנוח אחרי צלייה 🥩",
  "קראו את המתכון עד הסוף לפני שמתחילים 📖",
  "הכינו את כל המרכיבים מראש 🥗",
  "אל תעמיסו על המחבת - תנו מקום 🍳",
  "טעמו תוך כדי בישול! 👅",
  "שמן זית לא לטיגון בחום גבוה 🫒",
  "עשבי תיבול טריים - בסוף הבישול 🌿",
  "מים רותחים = פסטה מושלמת 🍝",
  "תבלינים טחונים טריים = טעם עוצמתי ✨",
  "אל תלחצו על הבשר במחבת 🚫",
  "ביצים בטמפרטורת החדר = תוצאה טובה יותר 🥚",
];

const getDailyTip = () => {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return cookingTips[dayOfYear % cookingTips.length];
};

// Get a consistent daily recipe based on the date (changes at midnight)
const getDailyRecipeIndex = () => {
  const today = new Date();
  // Create a seed from year + month + day
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  // Use the seed to get a consistent index
  return seed % recipes.length;
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { progress, displayName, photoUrl } = useApp();
  const { subscription, loading: subLoading, hasStartedTrial } = useSubscription();
  const greeting = getTimeBasedGreeting();

  // Light status bar for light background (dark icons)
  useStatusBar({ style: 'light', backgroundColor: '#FFFFFF', overlay: false });

  // Countdown timer state
  const [countdown, setCountdown] = useState(getTimeUntilMidnight());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Redirect to premium if user hasn't started trial
  useEffect(() => {
    if (!subLoading && subscription && !hasStartedTrial) {
      navigate('/premium');
    }
  }, [subscription, subLoading, hasStartedTrial, navigate]);
  const dailyTip = getDailyTip();
  
  const hasCooked = progress.totalMealsCooked > 0;
  
  // Inactivity tracking
  const { daysInactive, potentialSavingsLost, shouldShowAlert, dismissAlert } = useInactivityTracker(hasCooked);
  
  // Memoize recipe selection to prevent re-renders
  const todayRecipe = useMemo(() => recipes[getDailyRecipeIndex()], []);
  const quickRecipes = useMemo(() => recipes.filter(r => r.prepTime + r.cookTime <= 20).slice(0, 3), []);
  
  // Streak calculation
  const streak = calculateStreak(progress.cookedMeals);
  const today = new Date().toDateString();
  const cookedToday = progress.cookedMeals.some(m => new Date(m.date).toDateString() === today);
  
  // Animated savings counter
  const [displayedSavings, setDisplayedSavings] = useState(0);
  
  useEffect(() => {
    const target = progress.totalSavings;
    if (displayedSavings === target) return;
    
    const duration = 1000;
    const startTime = Date.now();
    const startValue = displayedSavings;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progressVal = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progressVal, 3);
      const current = Math.round(startValue + (target - startValue) * easeOut);
      setDisplayedSavings(current);
      
      if (progressVal < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [progress.totalSavings]);

  return (
    <GradientBackground variant="warm">
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 bg-gradient-to-b from-background/80 to-transparent">
          <div className="flex items-center gap-3" dir="rtl">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-elevated shrink-0 border-2 border-background">
              <img 
                src={photoUrl || appLogo} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold">{greeting} {displayName} 👋</h1>
              <p className="text-sm text-muted-foreground">מה נבשל היום?</p>
            </div>
          </div>
        </div>

        <div className="px-4 flex-1 w-full flex flex-col gap-3 pb-4">
          {/* Daily Cooking Tip */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-3 border border-amber-200/50 dark:border-amber-800/30">
            <p className="text-xs text-center">
              <span className="font-semibold text-amber-700 dark:text-amber-400">💡 טיפ היום:</span>{" "}
              <span className="text-foreground/80">{dailyTip}</span>
            </p>
          </div>

          {/* Today's Recommendation - Compact */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-black" />
                <h2 className="font-semibold text-xs">המלצה להיום</h2>
              </div>
              <div className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded-full">
                <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                <span className="text-[9px] font-medium text-muted-foreground" dir="ltr">
                  {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
            
            <PremiumCard 
              variant="elevated"
              hoverable
              onClick={() => navigate(`/recipe/${todayRecipe.id}`)}
              className="p-2.5"
            >
              <div className="flex gap-2.5">
                <div className="w-14 h-14 rounded-lg shrink-0 shadow-soft overflow-hidden">
                  {getRecipeImage(todayRecipe.id) ? (
                    <img 
                      src={getRecipeImage(todayRecipe.id)} 
                      alt={todayRecipe.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-2xl">
                      {todayRecipe.emoji}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm mb-0.5 truncate">{todayRecipe.name}</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">{todayRecipe.prepTime + todayRecipe.cookTime} דק׳</span>
                    <span className="font-medium">₪{todayRecipe.homeCost}</span>
                    <span className="bg-savings-light text-savings px-1.5 py-0.5 rounded-full text-[10px] font-medium">
                      +₪{todayRecipe.deliveryCost - todayRecipe.homeCost}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="default" className="w-full mt-2 h-8 rounded-lg text-xs btn-press">
                בוא נבשל! 🍳
                <ArrowLeft className="w-3 h-3" />
              </Button>
            </PremiumCard>
          </div>

          {/* Quick Recipes - Compact */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-black" />
                <h2 className="font-semibold text-xs">מהיר ב-20 דקות</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/recipes')} className="text-black h-6 text-[10px] px-1.5">
                הכל
                <ArrowLeft className="w-2.5 h-2.5" />
              </Button>
            </div>
            
            <div className="space-y-1.5">
              {quickRecipes.slice(0, 2).map((recipe, index) => (
                <div 
                  key={recipe.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <RecipeCard
                    recipe={recipe}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                    compact
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Cooking Streak & Savings Row */}
          <div className="grid grid-cols-2 gap-2">
            {/* Animated Savings Card */}
            <PremiumCard className="p-3 bg-savings-light border-savings/20">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-savings/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-savings" />
                </div>
                <p className="text-[10px] text-muted-foreground">נחסך בסה״כ</p>
              </div>
              <p className="text-2xl font-bold text-savings animate-pulse">
                ₪{displayedSavings}
              </p>
            </PremiumCard>

            {/* Streak Card */}
            <PremiumCard className="p-3 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">רצף בישול</p>
                  <p className="text-lg font-bold leading-tight">{streak} {streak === 1 ? 'יום' : 'ימים'}</p>
                </div>
              </div>
              {cookedToday && (
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1 w-fit">
                  <ChefHat className="w-3 h-3" />
                  בישלת היום!
                </div>
              )}
            </PremiumCard>
          </div>

          {/* Streak Milestones */}
          <PremiumCard className="p-3 bg-orange-50/50 dark:bg-orange-950/10 border-orange-200/50 dark:border-orange-800/20">
            <div className="flex justify-between">
              {MILESTONES.map((milestone) => {
                const isUnlocked = streak >= milestone.days;
                return (
                  <div key={milestone.days} className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-base transition-all ${
                        isUnlocked 
                          ? 'bg-gradient-to-br from-orange-400 to-orange-500 shadow-md scale-105' 
                          : 'bg-muted border border-muted-foreground/20'
                      }`}
                    >
                      {isUnlocked ? milestone.emoji : '🔒'}
                    </div>
                    <p className={`text-[10px] font-medium mt-1 ${isUnlocked ? 'text-orange-600 dark:text-orange-400' : 'text-muted-foreground'}`}>
                      {milestone.days} ימים
                    </p>
                    <p className={`text-[9px] ${isUnlocked ? 'text-orange-500' : 'text-muted-foreground/60'}`}>
                      {milestone.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </PremiumCard>
        </div>

        <TutorialOverlay />
      </div>
    </GradientBackground>
  );
};

export default Home;