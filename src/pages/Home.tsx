import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecipeCard } from '@/components/RecipeCard';
import { BottomNav } from '@/components/BottomNav';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { InactivityAlert } from '@/components/notifications';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { useApp } from '@/contexts/AppContext';
import { useInactivityTracker } from '@/hooks/useInactivityTracker';
import { recipes } from '@/lib/recipes';
import { getRecipeImage } from '@/lib/recipeImages';
import { getBBProfile } from '@/lib/storage';
import chefIcon from '@/assets/chef-icon.png';

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

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useApp();
  const bbProfile = getBBProfile();
  const greeting = getTimeBasedGreeting();
  const dailyTip = getDailyTip();
  
  const hasCooked = progress.totalMealsCooked > 0;
  
  // Inactivity tracking
  const { daysInactive, potentialSavingsLost, shouldShowAlert, dismissAlert } = useInactivityTracker(hasCooked);
  
  // Memoize recipe selection to prevent re-renders
  const todayRecipe = useMemo(() => recipes[Math.floor(Math.random() * recipes.length)], []);
  const quickRecipes = useMemo(() => recipes.filter(r => r.prepTime + r.cookTime <= 20).slice(0, 3), []);

  return (
    <GradientBackground variant="warm">
      <div className="min-h-screen pb-28">
        {/* Header */}
        <div className="p-6 pt-8">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-4 mb-6" dir="rtl">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-glow shrink-0">
                <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{greeting} {bbProfile.displayName} 👋</h1>
                <p className="text-base text-muted-foreground">מה נבשל היום?</p>
              </div>
            </div>

            {/* Daily Cooking Tip */}
            <div className="bg-secondary/50 rounded-2xl p-4 mb-6">
              <p className="text-sm text-center">
                <span className="font-medium">💡 טיפ היום:</span> {dailyTip}
              </p>
            </div>

            
            {/* Inactivity Alert */}
            {shouldShowAlert && (
              <InactivityAlert
                daysInactive={daysInactive}
                potentialSavingsLost={potentialSavingsLost}
                onDismiss={dismissAlert}
                onAction={() => navigate('/recipes')}
                className="animate-slide-up"
              />
            )}
          </div>
        </div>

        <div className="px-6 max-w-lg mx-auto">
          {/* Today's Recommendation */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-black/5 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <h2 className="font-semibold text-lg">המלצה להיום</h2>
            </div>
            
            <PremiumCard 
              variant="elevated"
              hoverable
              onClick={() => navigate(`/recipe/${todayRecipe.id}`)}
              className="p-5"
            >
              <div className="flex gap-4">
                <div className="w-24 h-24 rounded-2xl shrink-0 shadow-soft overflow-hidden">
                  {getRecipeImage(todayRecipe.id) ? (
                    <img 
                      src={getRecipeImage(todayRecipe.id)} 
                      alt={todayRecipe.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-5xl">
                      {todayRecipe.emoji}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="inline-flex items-center gap-1.5 bg-secondary/50 px-2 py-0.5 rounded-full text-xs text-muted-foreground mb-2">
                    <Clock className="w-3 h-3" />
                    מוכן ב־{todayRecipe.prepTime + todayRecipe.cookTime} דקות
                  </div>
                  <h3 className="font-bold text-lg mb-2">{todayRecipe.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-lg">₪{todayRecipe.homeCost}</span>
                    <span className="bg-savings-light text-savings px-3 py-1.5 rounded-full text-sm font-medium">
                      חיסכון ₪{todayRecipe.deliveryCost - todayRecipe.homeCost}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="default" className="w-full mt-4 h-12 rounded-xl text-base btn-press">
                בוא נבשל! 🍳
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </PremiumCard>
          </div>

          {/* Quick Recipes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black/5 rounded-xl flex items-center justify-center">
                  <Clock className="w-4 h-4 text-black" />
                </div>
                <h2 className="font-semibold text-lg">מהיר ב-20 דקות</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/recipes')} className="text-black">
                הכל
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {quickRecipes.map((recipe, index) => (
                <div 
                  key={recipe.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <RecipeCard
                    recipe={recipe}
                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Motivation Card - Rewritten */}
          {!hasCooked && (
            <PremiumCard variant="glass" className="p-6 text-center">
              <p className="text-4xl mb-3">✨</p>
              <p className="font-semibold text-lg mb-1">הבישול הראשון משנה הכל</p>
              <p className="text-sm text-muted-foreground mb-4">
                אחרי 3 ארוחות, החיסכון כבר מורגש.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/recipes')}
                className="rounded-xl"
              >
                בחר מתכון ראשון
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </PremiumCard>
          )}
        </div>

        <BottomNav />
        <TutorialOverlay />
      </div>
    </GradientBackground>
  );
};

export default Home;