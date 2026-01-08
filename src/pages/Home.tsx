import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Clock, Flame, TrendingUp, ChefHat, Send, Gift, Play, Globe, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RecipeCard } from '@/components/RecipeCard';

import { GradientBackground } from '@/components/ui/GradientBackground';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { useApp } from '@/contexts/AppContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { recipes } from '@/lib/recipes';
import { getRecipeImage } from '@/lib/recipeImages';
import appLogo from '@/assets/app-logo.png';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Streak milestones - reward framing
const MILESTONES = [
  { days: 3, emoji: '🎁', label: 'מתכון פרימיום' },
  { days: 7, emoji: '🎁', label: 'שף מתקדם' },
  { days: 14, emoji: '🎁', label: 'מתכונים בלעדיים' },
  { days: 30, emoji: '🏆', label: 'שף אלוף!' },
];

// Quick filter categories
const QUICK_FILTERS = [
  { id: 'healthy', label: 'בריא', emoji: '🥗' },
  { id: 'sweet', label: 'מתוק', emoji: '🍰' },
  { id: 'filling', label: 'משביע', emoji: '🥩' },
  { id: 'students', label: 'לסטודנטים', emoji: '🧑‍🎓' },
];

// Dynamic titles that rotate
const HERO_TITLES = [
  'מה בא לך להכין היום?',
  'יש לך 20 דקות? בוא נבשל משהו טעים',
  'יש לי מנה מושלמת בשבילך 👨‍🍳',
  'רעב? בוא נמצא לך משהו טוב',
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

// Get a consistent daily recipe based on the date (changes at midnight)
const getDailyRecipeIndex = () => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return seed % recipes.length;
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { progress, displayName, photoUrl } = useApp();
  const { subscription, loading: subLoading, hasStartedTrial } = useSubscription();
  
  const [searchInput, setSearchInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [heroTitleIndex, setHeroTitleIndex] = useState(0);

  // Rotate hero title daily
  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setHeroTitleIndex(dayOfYear % HERO_TITLES.length);
  }, []);
  
  // REMOVED: Auto-redirect to premium - Premium is now only accessible via Profile
  
  // Memoize recipe selection
  const todayRecipe = useMemo(() => recipes[getDailyRecipeIndex()], []);
  
  // Filter quick recipes based on active filter
  const quickRecipes = useMemo(() => {
    let filtered = recipes.filter(r => r.prepTime + r.cookTime <= 20);
    
    if (activeFilter === 'healthy') {
      filtered = recipes.filter(r => r.category === 'vegetarian' || r.category === 'protein');
    } else if (activeFilter === 'sweet') {
      filtered = recipes.filter(r => r.category === 'desserts');
    } else if (activeFilter === 'filling') {
      filtered = recipes.filter(r => r.category === 'protein');
    } else if (activeFilter === 'students') {
      filtered = recipes.filter(r => r.category === 'cheap' || r.category === 'fast');
    }
    
    return filtered.slice(0, 3);
  }, [activeFilter]);
  
  // Streak calculation
  const streak = calculateStreak(progress.cookedMeals);
  const today = new Date().toDateString();
  const cookedToday = progress.cookedMeals.some(m => new Date(m.date).toDateString() === today);

  // Check for in-progress recipe
  const inProgressRecipe = useMemo(() => {
    const stored = localStorage.getItem('bb_cooking_progress');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.recipeId) {
          return recipes.find(r => r.id === data.recipeId);
        }
      } catch {}
    }
    return null;
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    const trimmedInput = searchInput.trim();
    if (!trimmedInput) {
      toast.info('כתוב מרכיב/מנה כדי להתחיל');
      return;
    }
    
    setIsSubmitting(true);
    const formattedMessage = `יש לי שאריות: ${trimmedInput}. תציע לי 3 רעיונות לארוחה + זמן הכנה + רשימת מצרכים חסרים.`;
    setSearchInput('');
    
    // Small delay for UX feedback then navigate
    setTimeout(() => {
      navigate('/chat', { state: { initialMessage: formattedMessage } });
      setIsSubmitting(false);
    }, 150);
  };

  const handleAskShefi = () => {
    navigate('/chat');
  };

  return (
    <GradientBackground variant="warm">
      <div className="screen-container" dir="rtl">
        <div className="scroll-container scrollbar-hide pt-safe pb-safe-24">
          {/* Header - Compact */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-glow shrink-0">
                <img 
                  src={photoUrl || appLogo} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1">
                <h1 className="text-lg font-bold">היי {displayName} 👋</h1>
              </div>
            </div>
          </div>

          <div className="px-4 flex-1 w-full flex flex-col gap-3 pb-4">
            {/* AI Hero Section */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/20">
              <h2 className="text-base font-semibold mb-2 text-center">
                {HERO_TITLES[heroTitleIndex]}
              </h2>
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <Input
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="כתוב: יש לי חזה עוף / משהו מתוק / אני רעב..."
                  className="flex-1 h-11 text-sm bg-background/80"
                />
                <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>

            {/* Import Recipe Banner */}
            <PremiumCard 
              variant="elevated" 
              hoverable
              onClick={() => navigate('/import')}
              className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-blue-900">מצאת מתכון באינטרנט?</p>
                  <p className="text-xs text-blue-700">הדבק לינק ונשמור אותו בשבילך</p>
                </div>
                <Button size="sm" className="rounded-lg text-xs h-8 bg-blue-600 hover:bg-blue-700">
                  <Link className="w-3 h-3 ml-1" />
                  יבא מתכון
                </Button>
              </div>
            </PremiumCard>

            {/* Continue Cooking - Only if in progress */}
            {inProgressRecipe && (
              <PremiumCard 
                variant="elevated" 
                hoverable
                onClick={() => navigate(`/recipe/${inProgressRecipe.id}`)}
                className="p-3 bg-amber-50 border-amber-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Play className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-amber-700">המשך מאיפה שעצרת</p>
                    <p className="font-semibold text-sm">👨‍🍳 היית באמצע {inProgressRecipe.name}</p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-lg text-xs h-8">
                    המשך לבשל
                  </Button>
                </div>
              </PremiumCard>
            )}

            {/* Primary Daily Recommendation */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <h2 className="font-semibold text-xs">היום שפי ממליץ לך על:</h2>
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
                    <h3 className="font-bold text-base mb-1">{todayRecipe.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {todayRecipe.prepTime + todayRecipe.cookTime} דק׳
                      </span>
                      <span>₪{todayRecipe.homeCost}</span>
                    </div>
                  </div>
                </div>
                <Button variant="default" className="w-full mt-3 h-10 rounded-xl text-sm btn-press">
                  👨‍🍳 בוא נתחיל לבשל
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </PremiumCard>
            </div>

            {/* Quick Meals with Filters */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h2 className="font-semibold text-xs">אין כוח לבשל? אלה מוכנים תוך 20 דקות</h2>
              </div>
              
              {/* Filter Chips */}
              <div className="flex gap-1.5 mb-2 overflow-x-auto scrollbar-hide">
                {QUICK_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1",
                      activeFilter === filter.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/60 text-muted-foreground hover:bg-secondary"
                    )}
                  >
                    <span>{filter.emoji}</span>
                    <span>{filter.label}</span>
                  </button>
                ))}
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

            {/* Savings Indicator - De-emphasized */}
            {progress.totalSavings > 0 && (
              <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  דרך אגב, השבוע חסכת כבר <span className="font-semibold text-foreground">₪{progress.totalSavings}</span> 👀
                </p>
              </div>
            )}

            {/* Streak & Unlock System */}
            <PremiumCard className="p-3 bg-orange-50/50 border-orange-200/50">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-orange-500" />
                <p className="text-xs text-muted-foreground">ככל שאתה מבשל – שפי פותח לך יותר</p>
                <span className="mr-auto font-bold text-sm">{streak} ימים</span>
              </div>
              
              <div className="flex justify-between">
                {MILESTONES.map((milestone) => {
                  const isUnlocked = streak >= milestone.days;
                  const daysLeft = milestone.days - streak;
                  return (
                    <div key={milestone.days} className="flex flex-col items-center">
                      <div 
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all",
                          isUnlocked 
                            ? "bg-gradient-to-br from-orange-400 to-orange-500 shadow-md" 
                            : "bg-muted border border-muted-foreground/20"
                        )}
                      >
                        {milestone.emoji}
                      </div>
                      <p className={cn(
                        "text-[9px] font-medium mt-1",
                        isUnlocked ? "text-orange-600" : "text-muted-foreground"
                      )}>
                        {isUnlocked ? milestone.label : `עוד ${daysLeft} ימים`}
                      </p>
                    </div>
                  );
                })}
              </div>
            </PremiumCard>
          </div>

          <TutorialOverlay />
        </div>
      </div>

      {/* Floating Ask Shefi Button */}
      <button
        onClick={handleAskShefi}
        className="fixed bottom-24 left-4 z-40 bg-primary text-primary-foreground px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 text-sm font-medium hover:scale-105 transition-transform"
      >
        <ChefHat className="w-4 h-4" />
        שאל את שפי
      </button>
    </GradientBackground>
  );
};

export default Home;