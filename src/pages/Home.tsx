import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecipeCard } from '@/components/RecipeCard';

import { GradientBackground } from '@/components/ui/GradientBackground';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { InactivityAlert } from '@/components/notifications';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { useApp } from '@/contexts/AppContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useInactivityTracker } from '@/hooks/useInactivityTracker';
import { recipes } from '@/lib/recipes';
import { getRecipeImage } from '@/lib/recipeImages';
import appLogo from '@/assets/app-logo.png';

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

  return (
    <GradientBackground variant="warm">
      <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col">
        {/* Header - Compact */}
        <div className="px-4 pt-4 pb-2">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-3" dir="rtl">
              <div className="w-11 h-11 rounded-xl overflow-hidden shadow-glow shrink-0">
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

            {/* Daily Cooking Tip - Compact */}
            <div className="bg-secondary/50 rounded-xl p-2.5 mt-3">
              <p className="text-xs text-center">
                <span className="font-medium">💡 טיפ:</span> {dailyTip}
              </p>
            </div>
            
            {/* Inactivity Alert */}
            {shouldShowAlert && (
              <InactivityAlert
                daysInactive={daysInactive}
                potentialSavingsLost={potentialSavingsLost}
                onDismiss={dismissAlert}
                onAction={() => navigate('/recipes')}
                className="animate-slide-up mt-2"
              />
            )}
          </div>
        </div>

        <div className="px-4 flex-1 overflow-hidden max-w-lg mx-auto w-full flex flex-col">
          {/* Today's Recommendation - Compact */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-black" />
                <h2 className="font-semibold text-sm">המלצה להיום</h2>
              </div>
              <div className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-full">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground" dir="ltr">
                  {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
            
            <PremiumCard 
              variant="elevated"
              hoverable
              onClick={() => navigate(`/recipe/${todayRecipe.id}`)}
              className="p-3"
            >
              <div className="flex gap-3">
                <div className="w-16 h-16 rounded-xl shrink-0 shadow-soft overflow-hidden">
                  {getRecipeImage(todayRecipe.id) ? (
                    <img 
                      src={getRecipeImage(todayRecipe.id)} 
                      alt={todayRecipe.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-3xl">
                      {todayRecipe.emoji}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded-full text-[10px] text-muted-foreground mb-1">
                    <Clock className="w-2.5 h-2.5" />
                    {todayRecipe.prepTime + todayRecipe.cookTime} דקות
                  </div>
                  <h3 className="font-bold text-sm mb-1 truncate">{todayRecipe.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">₪{todayRecipe.homeCost}</span>
                    <span className="bg-savings-light text-savings px-2 py-0.5 rounded-full text-xs font-medium">
                      חיסכון ₪{todayRecipe.deliveryCost - todayRecipe.homeCost}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="default" className="w-full mt-2 h-9 rounded-lg text-sm btn-press">
                בוא נבשל! 🍳
                <ArrowLeft className="w-3.5 h-3.5" />
              </Button>
            </PremiumCard>
          </div>

          {/* Quick Recipes - Compact */}
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-black" />
                <h2 className="font-semibold text-sm">מהיר ב-20 דקות</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/recipes')} className="text-black h-7 text-xs px-2">
                הכל
                <ArrowLeft className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="space-y-2 flex-1 overflow-hidden">
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

          {/* Motivation Card - Compact */}
          {!hasCooked && (
            <PremiumCard variant="glass" className="p-3 text-center mt-2 mb-2">
              <p className="text-2xl mb-1">✨</p>
              <p className="font-semibold text-sm mb-0.5">הבישול הראשון משנה הכל</p>
              <p className="text-xs text-muted-foreground mb-2">
                אחרי 3 ארוחות, החיסכון כבר מורגש.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/recipes')}
                className="rounded-lg h-8 text-xs"
              >
                בחר מתכון ראשון
                <ArrowLeft className="w-3 h-3" />
              </Button>
            </PremiumCard>
          )}
        </div>

        <TutorialOverlay />
      </div>
    </GradientBackground>
  );
};

export default Home;