import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Star, Target, Trophy, Flame, Plus, ChefHat, Share2, Gift, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import ScreenLayout from '@/components/layout/ScreenLayout';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { StarRating } from '@/components/StarRating';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { getRecipeById, recipes } from '@/lib/recipes';
import { toast } from 'sonner';
import appLogo from '@/assets/app-logo.png';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

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

const MILESTONES = [
  { days: 3, emoji: '🏆', label: 'מתחיל' },
  { days: 7, emoji: '⭐', label: 'שבוע!' },
  { days: 14, emoji: '👨‍🍳', label: 'שף!' },
  { days: 30, emoji: '🔥', label: 'אלוף!' },
];

const WEEKLY_GOALS = [
  { meals: 2, reward: '🥉', label: 'שתי ארוחות', points: 10 },
  { meals: 4, reward: '🥈', label: 'ארבע ארוחות', points: 25 },
  { meals: 6, reward: '🥇', label: 'שש ארוחות', points: 50 },
  { meals: 7, reward: '💎', label: 'שבעה ימים!', points: 100 },
];

const getWeekStart = () => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

const countWeeklyMeals = (cookedMeals: { date: string }[]) => {
  const weekStart = getWeekStart();
  return cookedMeals.filter(m => new Date(m.date) >= weekStart).length;
};

export const Progress: React.FC = () => {
  const navigate = useNavigate();
  const { progress, monthlySavings, addCookedMeal } = useApp();
  const celebratedRef = useRef<Set<number>>(new Set());
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const skillLabels = ['מתחיל', 'בסיסי', 'מתקדם', 'מומחה', 'שף!'];
  const skillEmojis = ['🌱', '🌿', '🌳', '⭐', '👨‍🍳'];
  const streak = calculateStreak(progress.cookedMeals);
  
  const filteredRecipes = recipes.filter(r => 
    r.name.includes(searchQuery) || r.emoji.includes(searchQuery)
  ).slice(0, 10);
  
  const today = new Date().toDateString();
  const cookedToday = progress.cookedMeals.some(m => new Date(m.date).toDateString() === today);
  
  const weeklyMealsCount = countWeeklyMeals(progress.cookedMeals);
  const currentGoal = WEEKLY_GOALS.find(g => weeklyMealsCount < g.meals) || WEEKLY_GOALS[WEEKLY_GOALS.length - 1];
  const completedGoals = WEEKLY_GOALS.filter(g => weeklyMealsCount >= g.meals);
  const totalPoints = completedGoals.reduce((sum, g) => sum + g.points, 0);
  
  const handleShareStreak = async () => {
    const shareText = `🔥 יש לי רצף בישול של ${streak} ימים ב-BudgetBites!\n\n✨ כבר חסכתי ₪${progress.totalSavings} בבישול ביתי.\n\nהצטרפו גם אתם לחיסכון! 🍳`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'רצף הבישול שלי', text: shareText });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success('הועתק ללוח! 📋');
    }
  };
  
  const handleLogCooking = () => {
    if (!selectedRecipeId) return;
    const recipe = getRecipeById(selectedRecipeId);
    if (!recipe) return;
    
    addCookedMeal({
      recipeId: selectedRecipeId,
      date: new Date().toISOString(),
      tasteRating: 4,
      difficultyRating: 3,
      wouldMakeAgain: true,
      savings: recipe.deliveryCost - recipe.homeCost,
    });
    
    setIsLogDialogOpen(false);
    setSelectedRecipeId(null);
    setSearchQuery('');
    
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ff6b35', '#f7c631', '#22c55e']
    });
  };

  useEffect(() => {
    const celebratedMilestones = JSON.parse(localStorage.getItem('bb_celebrated_milestones') || '[]');
    celebratedRef.current = new Set(celebratedMilestones);

    MILESTONES.forEach(milestone => {
      if (streak >= milestone.days && !celebratedRef.current.has(milestone.days)) {
        celebratedRef.current.add(milestone.days);
        localStorage.setItem('bb_celebrated_milestones', JSON.stringify([...celebratedRef.current]));
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff6b35', '#f7c631', '#ff9500']
        });
      }
    });
  }, [streak]);

  return (
    <ScreenLayout gradient hasBottomNav contentClassName="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">ההתקדמות שלי</h1>
        <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center">
          <Trophy className="w-5 h-5 text-black" />
        </div>
      </div>

      {/* Skill Level - TOP */}
      <PremiumCard variant="elevated" className="p-5 animate-slide-up">
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

      {/* Quick Summary Card */}
      <PremiumCard className="p-4 animate-scale-in bg-gradient-to-r from-primary/5 to-savings/5 border-primary/20">
        <div className="flex items-center justify-around text-center">
          <div className="flex-1">
            <div className="text-2xl mb-1">🍳</div>
            <p className="text-xl font-bold">{progress.totalMealsCooked}</p>
            <p className="text-xs text-muted-foreground">ארוחות</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="flex-1">
            <div className="text-2xl mb-1">💰</div>
            <p className="text-xl font-bold text-savings">₪{progress.totalSavings}</p>
            <p className="text-xs text-muted-foreground">נחסך</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="flex-1">
            <div className="text-2xl mb-1">🔥</div>
            <p className="text-xl font-bold">{streak}</p>
            <p className="text-xs text-muted-foreground">ימי רצף</p>
          </div>
        </div>
      </PremiumCard>

      {/* Weekly Cooking Goals */}
      <PremiumCard className="p-4 animate-scale-in bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/30" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
            <Gift className="w-6 h-6 text-purple-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">יעדים שבועיים</p>
            <p className="text-lg font-bold">{weeklyMealsCount} ארוחות השבוע</p>
          </div>
          <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1">
            <Trophy className="w-4 h-4" />
            {totalPoints} נק׳
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {WEEKLY_GOALS.map((goal) => {
            const isCompleted = weeklyMealsCount >= goal.meals;
            const progressPercent = Math.min((weeklyMealsCount / goal.meals) * 100, 100);
            
            return (
              <div 
                key={goal.meals}
                className={cn(
                  "p-3 rounded-xl border-2 transition-all relative overflow-hidden",
                  isCompleted 
                    ? "border-purple-400 bg-purple-100 dark:bg-purple-900/40" 
                    : "border-border bg-muted/30"
                )}
              >
                {!isCompleted && (
                  <div 
                    className="absolute inset-0 bg-purple-100 dark:bg-purple-900/20 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                )}
                
                <div className="relative flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-lg",
                    isCompleted ? "bg-purple-200 dark:bg-purple-800" : "bg-muted"
                  )}>
                    {isCompleted ? goal.reward : '🔒'}
                  </div>
                  <div className="flex-1">
                    <p className={cn(
                      "text-sm font-medium",
                      isCompleted ? "text-purple-700 dark:text-purple-300" : "text-muted-foreground"
                    )}>
                      {goal.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      +{goal.points} נק׳
                    </p>
                  </div>
                  {isCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-purple-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {weeklyMealsCount < 7 && (
          <p className="text-xs text-muted-foreground text-center mt-3">
            עוד {currentGoal.meals - weeklyMealsCount} ארוחות ליעד הבא {currentGoal.reward}
          </p>
        )}
        {weeklyMealsCount >= 7 && (
          <p className="text-sm text-purple-600 dark:text-purple-400 text-center mt-3 font-medium">
            🎉 כל היעדים הושגו השבוע!
          </p>
        )}
      </PremiumCard>

      {/* Monthly Summary */}
      <PremiumCard className="p-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
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
        <PremiumCard className="p-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
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
                <PremiumCard key={index} className="p-4 flex items-center gap-4">
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
            <img src={appLogo} alt="BudgetBites" className="w-full h-full object-cover" />
          </div>
          <h3 className="font-semibold text-lg mb-2">עדיין אין נתונים</h3>
          <p className="text-muted-foreground text-sm mb-4">
            תתחיל לבשל ותראה את ההתקדמות שלך כאן!
          </p>
          <Button onClick={() => setIsLogDialogOpen(true)} className="rounded-xl">
            <Plus className="w-4 h-4" />
            רשום ארוחה ראשונה
          </Button>
        </PremiumCard>
      )}
      
      {/* Log Cooking Dialog */}
      <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-center">מה בישלת היום? 👨‍🍳</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="חפש מתכון..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 px-4 bg-secondary rounded-xl border border-border/50 focus:border-primary outline-none"
            />
            
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className={cn(
                    "w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all",
                    selectedRecipeId === recipe.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-2xl">{recipe.emoji}</span>
                  <span className="font-medium">{recipe.name}</span>
                </button>
              ))}
            </div>
            
            <Button 
              onClick={handleLogCooking} 
              disabled={!selectedRecipeId}
              className="w-full"
            >
              <ChefHat className="w-4 h-4" />
              רשום ארוחה
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </ScreenLayout>
  );
};

export default Progress;
