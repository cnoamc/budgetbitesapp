import React from 'react';
import { TrendingUp, Star, Target, Trophy, Flame } from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { StarRating } from '@/components/StarRating';
import { useApp } from '@/contexts/AppContext';
import { getRecipeById } from '@/lib/recipes';
import chefIcon from '@/assets/chef-icon.png';

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

export const Progress: React.FC = () => {
  const { progress, monthlySavings } = useApp();

  const skillLabels = ['מתחיל', 'בסיסי', 'מתקדם', 'מומחה', 'שף!'];
  const skillEmojis = ['🌱', '🌿', '🌳', '⭐', '👨‍🍳'];
  const streak = calculateStreak(progress.cookedMeals);

  return (
    <GradientBackground variant="warm">
      <div className="min-h-screen pb-28">
        <div className="p-6 pt-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">ההתקדמות שלי</h1>
            <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-black" />
            </div>
          </div>

          {/* Skill Level - TOP */}
          <PremiumCard variant="elevated" className="p-5 mb-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">רמת המיומנות שלי</h3>
                <p className="text-muted-foreground">{skillLabels[progress.skillLevel - 1]}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-secondary to-muted rounded-2xl flex items-center justify-center text-3xl shadow-soft">
                {skillEmojis[progress.skillLevel - 1]}
              </div>
            </div>
            
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`flex-1 h-2.5 rounded-full transition-all ${
                    level <= progress.skillLevel ? 'bg-black shadow-sm' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            {progress.skillLevel < 5 && (
              <p className="text-xs text-muted-foreground">
                עוד {(progress.skillLevel * 5) - progress.totalMealsCooked + 5} ארוחות לרמה הבאה 🚀
              </p>
            )}
          </PremiumCard>

          {/* Stats Cards - meals & savings */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <PremiumCard className="p-4 bg-black/5 border-black/10 animate-scale-in">
              <div className="w-10 h-10 rounded-xl overflow-hidden mb-2">
                <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">ארוחות שבישלתי</p>
              <p className="text-2xl font-bold">{progress.totalMealsCooked}</p>
            </PremiumCard>
            
            <PremiumCard className="p-4 bg-savings-light border-savings/20 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="w-10 h-10 bg-savings/10 rounded-xl flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-savings" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">נחסך בסה״כ</p>
              <p className="text-2xl font-bold text-savings">₪{progress.totalSavings}</p>
            </PremiumCard>
          </div>

          {/* Cooking Streak */}
          <PremiumCard className="p-4 mb-4 animate-scale-in bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/30" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">רצף בישול</p>
                <p className="text-2xl font-bold">{streak} {streak === 1 ? 'יום' : 'ימים'} 🔥</p>
              </div>
            </div>
            
            {/* Streak Milestones */}
            <div className="flex gap-2">
              <div className={`flex-1 p-3 rounded-xl text-center transition-all ${
                streak >= 3 
                  ? 'bg-orange-200 dark:bg-orange-800/50 border-2 border-orange-400' 
                  : 'bg-muted/50 opacity-50'
              }`}>
                <p className="text-lg mb-1">{streak >= 3 ? '🏆' : '🔒'}</p>
                <p className="text-xs font-medium">3 ימים</p>
                <p className="text-[10px] text-muted-foreground">מתחיל</p>
              </div>
              <div className={`flex-1 p-3 rounded-xl text-center transition-all ${
                streak >= 7 
                  ? 'bg-orange-200 dark:bg-orange-800/50 border-2 border-orange-400' 
                  : 'bg-muted/50 opacity-50'
              }`}>
                <p className="text-lg mb-1">{streak >= 7 ? '⭐' : '🔒'}</p>
                <p className="text-xs font-medium">7 ימים</p>
                <p className="text-[10px] text-muted-foreground">שבוע!</p>
              </div>
              <div className={`flex-1 p-3 rounded-xl text-center transition-all ${
                streak >= 14 
                  ? 'bg-orange-200 dark:bg-orange-800/50 border-2 border-orange-400' 
                  : 'bg-muted/50 opacity-50'
              }`}>
                <p className="text-lg mb-1">{streak >= 14 ? '👨‍🍳' : '🔒'}</p>
                <p className="text-xs font-medium">14 ימים</p>
                <p className="text-[10px] text-muted-foreground">שף!</p>
              </div>
            </div>
          </PremiumCard>

          {/* Monthly Summary */}
          <PremiumCard className="p-5 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-black" />
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
              <div className="w-20 h-20 rounded-3xl mx-auto mb-4 overflow-hidden shadow-soft">
                <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
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