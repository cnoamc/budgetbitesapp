import React, { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Clock, ChefHat, Send, Play, TrendingUp, Globe, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RecipeCard } from '@/components/RecipeCard';

import { GradientBackground } from '@/components/ui/GradientBackground';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { useApp } from '@/contexts/AppContext';
import { recipes } from '@/lib/recipes';
import { getRecipeImage } from '@/lib/recipeImages';
import appLogo from '@/assets/app-logo.png';
import { cn } from '@/lib/utils';
import TutorialOverlay from '@/components/TutorialOverlay';
import { toast } from 'sonner';

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
  'רעב? בוא נמצא לך משהו טוב',
];

// Get a consistent daily recipe based on the date (changes at midnight)
const getDailyRecipeIndex = () => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return seed % recipes.length;
};

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { progress, displayName, photoUrl } = useApp();
  
  const [searchInput, setSearchInput] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('healthy'); // Auto-select first category
  const [heroTitleIndex, setHeroTitleIndex] = useState(0);
  const [shuffleKey, setShuffleKey] = useState(0); // Used to trigger recipe shuffle

  // Rotate hero title daily
  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setHeroTitleIndex(dayOfYear % HERO_TITLES.length);
  }, []);
  
  // Memoize recipe selection
  const todayRecipe = useMemo(() => recipes[getDailyRecipeIndex()], []);
  
  // Filter quick recipes based on active filter - always show 4 recipes
  const quickRecipes = useMemo(() => {
    let filtered: typeof recipes = [];
    
    if (activeFilter === 'healthy') {
      filtered = recipes.filter(r => r.category === 'vegetarian' || r.category === 'protein');
    } else if (activeFilter === 'sweet') {
      filtered = recipes.filter(r => r.category === 'desserts');
    } else if (activeFilter === 'filling') {
      filtered = recipes.filter(r => r.category === 'protein');
    } else if (activeFilter === 'students') {
      filtered = recipes.filter(r => r.category === 'cheap' || r.category === 'fast');
    }
    
    // Shuffle the filtered recipes
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [activeFilter, shuffleKey]);

  const handleShuffle = () => {
    setShuffleKey(prev => prev + 1);
  };

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
  const submitGuardRef = React.useRef(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting || submitGuardRef.current) return;
    
    const trimmedInput = searchInput.trim();
    if (!trimmedInput) {
      toast.info('כתוב מרכיב/מנה כדי להתחיל');
      return;
    }
    
    submitGuardRef.current = true;
    setIsSubmitting(true);
    
    const message = trimmedInput;
    setSearchInput('');
    
    const formattedMessage = `יש לי שאריות: ${message}. תציע לי 3 רעיונות לארוחה + זמן הכנה + רשימת מצרכים חסרים.`;
    const encodedSeed = encodeURIComponent(formattedMessage);
    
    setTimeout(() => {
      navigate(`/chat?mode=leftovers&seed=${encodedSeed}`);
      setIsSubmitting(false);
      submitGuardRef.current = false;
    }, 150);
  };

  const handleAskShefi = () => {
    navigate('/chat');
  };

  return (
    <GradientBackground variant="warm">
      <TutorialOverlay />
      <div className="screen-container" dir="rtl">
        <div 
          className="scroll-container scrollbar-hide pt-safe"
          style={{ paddingBottom: 'calc(110px + 16px)' }}
        >
          {/* Header */}
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
            {/* AI Search */}
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

            {/* Import Recipe Banner - Hidden for launch */}
            {/* 
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
                  <LinkIcon className="w-3 h-3 ml-1" />
                  יבא
                </Button>
              </div>
            </PremiumCard>
            */}

            {/* Continue Cooking */}
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
                    <p className="font-semibold text-sm">👨‍🍳 {inProgressRecipe.name}</p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-lg text-xs h-8">
                    המשך
                  </Button>
                </div>
              </PremiumCard>
            )}

            {/* Daily Recommendation */}
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

            {/* Quick Meals */}
            <div>
              {/* Filter Chips - always one selected */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide flex-1">
                  {QUICK_FILTERS.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
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
                <button
                  onClick={handleShuffle}
                  className="p-1.5 rounded-full bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all shrink-0 active:scale-95"
                  aria-label="ערבב מתכונים"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="space-y-1.5">
                {quickRecipes.map((recipe, index) => (
                  <div 
                    key={recipe.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
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

            {/* Savings Indicator */}
            {progress.totalSavings > 0 && (
              <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  חסכת כבר <span className="font-semibold text-foreground">₪{progress.totalSavings}</span> 👀
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default Home;
