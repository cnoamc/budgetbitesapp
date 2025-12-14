import React from 'react';
import { TrendingUp, ChefHat, Star, Target, Trophy } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { StarRating } from '@/components/StarRating';
import { useApp } from '@/contexts/AppContext';
import { getRecipeById } from '@/lib/recipes';

export const Progress: React.FC = () => {
  const { progress, monthlySavings } = useApp();

  const skillLabels = ['מתחיל', 'בסיסי', 'מתקדם', 'מומחה', 'שף!'];
  const skillEmojis = ['🌱', '🌿', '🌳', '⭐', '👨‍🍳'];

  return (
    <GradientBackground variant="warm">
      <div className="min-h-screen pb-28">
        <div className="p-6 pt-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">ההתקדמות שלי</h1>
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <PremiumCard className="p-5 bg-savings-light border-savings/20 animate-scale-in">
              <div className="w-10 h-10 bg-savings/10 rounded-xl flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-savings" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">נחסך בסה״כ</p>
              <p className="text-3xl font-bold text-savings">₪{progress.totalSavings}</p>
            </PremiumCard>
            
            <PremiumCard className="p-5 bg-primary/5 border-primary/20 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <ChefHat className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">ארוחות שבישלתי</p>
              <p className="text-3xl font-bold">{progress.totalMealsCooked}</p>
            </PremiumCard>
          </div>

          {/* Skill Level */}
          <PremiumCard variant="elevated" className="p-6 mb-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-lg mb-1">רמת המיומנות שלי</h3>
                <p className="text-muted-foreground">{skillLabels[progress.skillLevel - 1]}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-muted rounded-2xl flex items-center justify-center text-4xl shadow-soft">
                {skillEmojis[progress.skillLevel - 1]}
              </div>
            </div>
            
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`flex-1 h-3 rounded-full transition-all ${
                    level <= progress.skillLevel ? 'gradient-primary shadow-sm' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            {progress.skillLevel < 5 && (
              <p className="text-sm text-muted-foreground">
                עוד {(progress.skillLevel * 5) - progress.totalMealsCooked + 5} ארוחות לרמה הבאה 🚀
              </p>
            )}
          </PremiumCard>

          {/* Monthly Summary */}
          <PremiumCard className="p-5 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">החודש</h3>
            </div>
            <div className="flex items-center justify-between bg-secondary/30 rounded-2xl p-4">
              <span className="text-muted-foreground">חיסכון החודש</span>
              <span className="text-2xl font-bold text-savings">₪{monthlySavings}</span>
            </div>
          </PremiumCard>

          {/* Average Rating */}
          {progress.totalMealsCooked > 0 && (
            <PremiumCard className="p-5 mb-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-warning-light rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-warning" />
                </div>
                <h3 className="font-semibold text-lg">דירוג ממוצע</h3>
              </div>
              <StarRating rating={Math.round(progress.averageRating)} readonly />
            </PremiumCard>
          )}

          {/* Recent Meals */}
          {progress.cookedMeals.length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="text-xl">🍽️</span>
                מה בישלתי לאחרונה
              </h3>
              <div className="space-y-3">
                {progress.cookedMeals.slice(-5).reverse().map((meal, index) => {
                  const recipe = getRecipeById(meal.recipeId);
                  if (!recipe) return null;
                  
                  return (
                    <PremiumCard
                      key={index}
                      className="p-4 flex items-center gap-4"
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-secondary to-muted rounded-2xl flex items-center justify-center text-3xl shadow-soft">
                        {recipe.emoji}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-lg">{recipe.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(meal.date).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                      <div className="bg-savings-light text-savings px-3 py-1.5 rounded-xl font-bold">
                        +₪{meal.savings}
                      </div>
                    </PremiumCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {progress.totalMealsCooked === 0 && (
            <PremiumCard variant="glass" className="p-8 text-center animate-fade-in">
              <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center text-5xl mx-auto mb-4">
                📊
              </div>
              <h3 className="font-semibold text-lg mb-2">עדיין אין נתונים</h3>
              <p className="text-muted-foreground text-sm">
                תתחיל לבשל ותראה את ההתקדמות שלך כאן!
              </p>
            </PremiumCard>
          )}
        </div>

        <BottomNav />
      </div>
    </GradientBackground>
  );
};

export default Progress;