import React from 'react';
import { TrendingUp, ChefHat, Star, Target } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { StarRating } from '@/components/StarRating';
import { useApp } from '@/contexts/AppContext';
import { getRecipeById } from '@/lib/recipes';

export const Progress: React.FC = () => {
  const { progress, calculateMonthlySavings } = useApp();
  const monthlySavings = calculateMonthlySavings();

  const skillLabels = ['מתחיל', 'בסיסי', 'מתקדם', 'מומחה', 'שף!'];
  const skillEmojis = ['🌱', '🌿', '🌳', '⭐', '👨‍🍳'];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">ההתקדמות שלי</h1>

        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-savings-light rounded-2xl p-5">
            <TrendingUp className="w-6 h-6 text-savings mb-2" />
            <p className="text-sm text-muted-foreground mb-1">נחסך בסה״כ</p>
            <p className="text-2xl font-bold text-savings">₪{progress.totalSavings}</p>
          </div>
          
          <div className="bg-primary/10 rounded-2xl p-5">
            <ChefHat className="w-6 h-6 text-primary mb-2" />
            <p className="text-sm text-muted-foreground mb-1">ארוחות שבישלתי</p>
            <p className="text-2xl font-bold">{progress.totalMealsCooked}</p>
          </div>
        </div>

        {/* Skill Level */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold mb-1">רמת המיומנות שלי</h3>
              <p className="text-muted-foreground text-sm">{skillLabels[progress.skillLevel - 1]}</p>
            </div>
            <div className="text-4xl">{skillEmojis[progress.skillLevel - 1]}</div>
          </div>
          
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`flex-1 h-3 rounded-full ${
                  level <= progress.skillLevel ? 'gradient-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          {progress.skillLevel < 5 && (
            <p className="text-sm text-muted-foreground mt-3">
              עוד {(progress.skillLevel * 5) - progress.totalMealsCooked + 5} ארוחות לרמה הבאה
            </p>
          )}
        </div>

        {/* Monthly Summary */}
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">החודש</h3>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">חיסכון החודש</span>
            <span className="text-xl font-bold text-savings">₪{monthlySavings}</span>
          </div>
        </div>

        {/* Average Rating */}
        {progress.totalMealsCooked > 0 && (
          <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-warning" />
              <h3 className="font-semibold">דירוג ממוצע</h3>
            </div>
            <StarRating rating={Math.round(progress.averageRating)} readonly />
          </div>
        )}

        {/* Recent Meals */}
        {progress.cookedMeals.length > 0 && (
          <div>
            <h3 className="font-semibold mb-4">מה בישלתי לאחרונה</h3>
            <div className="space-y-3">
              {progress.cookedMeals.slice(-5).reverse().map((meal, index) => {
                const recipe = getRecipeById(meal.recipeId);
                if (!recipe) return null;
                
                return (
                  <div
                    key={index}
                    className="bg-card rounded-xl p-4 shadow-card border border-border/50 flex items-center gap-4"
                  >
                    <span className="text-3xl">{recipe.emoji}</span>
                    <div className="flex-1">
                      <p className="font-medium">{recipe.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(meal.date).toLocaleDateString('he-IL')}
                      </p>
                    </div>
                    <div className="text-savings font-medium">+₪{meal.savings}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {progress.totalMealsCooked === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="font-semibold mb-2">עדיין אין נתונים</h3>
            <p className="text-muted-foreground text-sm">
              תתחיל לבשל ותראה את ההתקדמות שלך כאן!
            </p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Progress;
