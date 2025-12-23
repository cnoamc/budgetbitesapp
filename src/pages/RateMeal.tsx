import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { getRecipeById } from '@/lib/recipes';
import { useApp } from '@/contexts/AppContext';
import type { CookedMeal } from '@/lib/types';

export const RateMeal: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addCookedMeal } = useApp();
  
  const [tasteRating, setTasteRating] = useState(0);
  const [difficultyRating, setDifficultyRating] = useState(0);
  const [wouldMakeAgain, setWouldMakeAgain] = useState<boolean | null>(null);
  
  const recipe = getRecipeById(id || '');

  if (!recipe) {
    return null;
  }

  const savings = recipe.deliveryCost - recipe.homeCost;
  const canSubmit = tasteRating > 0 && difficultyRating > 0 && wouldMakeAgain !== null;

  const handleSubmit = () => {
    const meal: CookedMeal = {
      recipeId: recipe.id,
      date: new Date().toISOString(),
      tasteRating,
      difficultyRating,
      wouldMakeAgain: wouldMakeAgain!,
      savings,
    };
    
    addCookedMeal(meal);
    navigate('/home');
  };

  return (
    <div className="h-full bg-background p-6 overflow-y-auto overscroll-none">
      <div className="max-w-lg mx-auto">
        {/* Celebration */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-2xl font-bold mb-2">כל הכבוד!</h1>
          <p className="text-muted-foreground">
            הכנת {recipe.name} וחסכת ₪{savings}!
          </p>
        </div>

        {/* Savings Highlight */}
        <div className="bg-savings-light rounded-2xl p-5 mb-8 flex items-center justify-between animate-slide-up">
          <div>
            <p className="text-sm text-muted-foreground mb-1">חסכת בארוחה הזו</p>
            <p className="text-3xl font-bold text-savings">₪{savings}</p>
          </div>
          <div className="w-14 h-14 bg-savings rounded-xl flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-accent-foreground" />
          </div>
        </div>

        {/* Rating Form */}
        <div className="space-y-6">
          {/* Taste */}
          <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-medium mb-3">איך היה הטעם?</h3>
            <StarRating
              rating={tasteRating}
              onRate={setTasteRating}
              size="lg"
            />
          </div>

          {/* Difficulty */}
          <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-medium mb-3">כמה קל היה להכין?</h3>
            <StarRating
              rating={difficultyRating}
              onRate={setDifficultyRating}
              size="lg"
            />
            <p className="text-sm text-muted-foreground mt-2">
              (5 = מאוד קל, 1 = קשה)
            </p>
          </div>

          {/* Would Make Again */}
          <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-medium mb-3">תכין שוב?</h3>
            <div className="flex gap-3">
              <Button
                variant={wouldMakeAgain === true ? 'default' : 'outline'}
                size="lg"
                className="flex-1"
                onClick={() => setWouldMakeAgain(true)}
              >
                <Check className="w-5 h-5" />
                בטח!
              </Button>
              <Button
                variant={wouldMakeAgain === false ? 'destructive' : 'outline'}
                size="lg"
                className="flex-1"
                onClick={() => setWouldMakeAgain(false)}
              >
                <X className="w-5 h-5" />
                לא בטוח
              </Button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="mt-8">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            size="xl"
            className="w-full"
          >
            שמור וחזור הביתה
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RateMeal;
