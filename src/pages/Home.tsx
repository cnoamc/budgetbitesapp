import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, TrendingUp, Sparkles, ArrowLeft, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecipeCard } from '@/components/RecipeCard';
import { BottomNav } from '@/components/BottomNav';
import { useApp } from '@/contexts/AppContext';
import { recipes } from '@/lib/recipes';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { progress, calculateMonthlySavings, calculatePotentialSavings } = useApp();
  
  const actualMonthlySavings = calculateMonthlySavings();
  const potentialMonthlySavings = calculatePotentialSavings();
  const hasCooked = progress.totalMealsCooked > 0;
  
  const todayRecipe = recipes[Math.floor(Math.random() * recipes.length)];
  const quickRecipes = recipes.filter(r => r.prepTime + r.cookTime <= 20).slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="gradient-primary p-6 pb-16 rounded-b-3xl">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-primary-foreground/80 text-sm">שלום! 👋</p>
              <h1 className="text-xl font-bold text-primary-foreground">מה נבשל היום?</h1>
            </div>
            <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>

          {/* Savings Summary - Show Potential OR Actual based on cooking history */}
          <div className="bg-card rounded-2xl p-4 shadow-elevated">
            {hasCooked ? (
              // Show actual savings after cooking
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">חסכת החודש 🎉</p>
                    <p className="text-2xl font-bold text-savings">₪{actualMonthlySavings}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{progress.totalMealsCooked}</p>
                      <p className="text-xs text-muted-foreground">ארוחות</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 text-sm text-savings">
                  <TrendingUp className="w-4 h-4" />
                  <span>ממשיכים להתקדם! 💪</span>
                </div>
                {/* Small potential reminder */}
                <div className="mt-3 pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    פוטנציאל חיסכון חודשי: ₪{potentialMonthlySavings}
                  </p>
                </div>
              </>
            ) : (
              // Show potential savings before cooking
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-muted-foreground text-sm">פוטנציאל חיסכון ✨</p>
                      <span className="bg-savings-light text-savings text-xs px-2 py-0.5 rounded-full">הערכה</span>
                    </div>
                    <p className="text-2xl font-bold text-savings">₪{potentialMonthlySavings}</p>
                    <p className="text-xs text-muted-foreground">בחודש</p>
                  </div>
                  <div className="w-14 h-14 bg-savings-light rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-savings" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
                  <Info className="w-3.5 h-3.5" />
                  <span>התחל לבשל כדי לראות חיסכון בפועל</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6 max-w-lg mx-auto">
        {/* Today's Recommendation */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">המלצה להיום</h2>
          </div>
          
          <div 
            onClick={() => navigate(`/recipe/${todayRecipe.id}`)}
            className="bg-card rounded-2xl p-5 shadow-card border border-border/50 cursor-pointer hover:shadow-elevated transition-all duration-300"
          >
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-secondary rounded-xl flex items-center justify-center text-5xl shrink-0">
                {todayRecipe.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{todayRecipe.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{todayRecipe.prepTime + todayRecipe.cookTime} דקות</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">₪{todayRecipe.homeCost}</span>
                  <span className="bg-savings-light text-savings px-3 py-1 rounded-full text-sm font-medium">
                    חיסכון ₪{todayRecipe.deliveryCost - todayRecipe.homeCost}
                  </span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4" size="lg">
              בוא נבשל!
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Recipes */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-lg">מהיר ב-20 דקות</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/recipes')}>
              הכל
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {quickRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Motivation Card - Only show when no meals cooked */}
        {!hasCooked && (
          <div className="bg-secondary rounded-2xl p-5 text-center">
            <p className="text-3xl mb-3">🌟</p>
            <p className="font-medium mb-1">עדיין לא בישלת?</p>
            <p className="text-sm text-muted-foreground">
              תתחיל מהמתכון הראשון ותגלה כמה זה קל!
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Home;
