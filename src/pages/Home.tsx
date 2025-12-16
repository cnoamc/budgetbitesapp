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
import chefIcon from '@/assets/chef-icon.png';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { progress } = useApp();
  
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-muted-foreground text-sm mb-1">שלום! 👋</p>
                <h1 className="text-2xl font-bold">מה נבשל היום?</h1>
              </div>
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-glow">
                <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
              </div>
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
              <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
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
              <Button className="w-full mt-4 h-12 rounded-xl text-base btn-press">
                בוא נבשל! 🍳
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </PremiumCard>
          </div>

          {/* Quick Recipes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <h2 className="font-semibold text-lg">מהיר ב-20 דקות</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/recipes')} className="text-primary">
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