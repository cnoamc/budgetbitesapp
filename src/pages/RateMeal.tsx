import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, TrendingUp, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { SocialShareButton } from '@/components/SocialShareButton';
import { FixedScreenLayout } from '@/components/layouts';
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
    <FixedScreenLayout className="bg-background">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-lg mx-auto">
          {/* Celebration */}
          <div className="text-center mb-6 animate-scale-in">
            <div className="text-5xl mb-3">🎉</div>
            <h1 className="text-xl font-bold mb-1">כל הכבוד!</h1>
            <p className="text-muted-foreground text-sm">
              הכנת {recipe.name} וחסכת ₪{savings}!
            </p>
          </div>

          {/* Savings Highlight */}
          <div className="bg-savings-light rounded-2xl p-4 mb-4 flex items-center justify-between animate-slide-up">
            <div>
              <p className="text-xs text-muted-foreground mb-1">חסכת בארוחה הזו</p>
              <p className="text-2xl font-bold text-savings">₪{savings}</p>
            </div>
            <div className="w-12 h-12 bg-savings rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>

          {/* Share Achievement */}
          <div className="mb-6 animate-slide-up" style={{ animationDelay: '0.05s' }}>
            <SocialShareButton
              title="הכנתי ארוחה וחסכתי!"
              text={`🍳 הכנתי ${recipe.name} בבית וחסכתי ₪${savings}!\n\n💰 בישול ביתי משתלם!\n\nהצטרפו גם אתם ל-BudgetBites!`}
              variant="outline"
              className="w-full rounded-xl"
            >
              <Share2 className="w-4 h-4 ml-2" />
              שתף את ההישג שלי
            </SocialShareButton>
          </div>

          {/* Rating Form */}
          <div className="space-y-4">
            {/* Taste */}
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="font-medium mb-2 text-sm">איך היה הטעם?</h3>
              <StarRating
                rating={tasteRating}
                onRate={setTasteRating}
                size="lg"
              />
            </div>

            {/* Difficulty */}
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="font-medium mb-2 text-sm">כמה קל היה להכין?</h3>
              <StarRating
                rating={difficultyRating}
                onRate={setDifficultyRating}
                size="lg"
              />
              <p className="text-xs text-muted-foreground mt-1">
                (5 = מאוד קל, 1 = קשה)
              </p>
            </div>

            {/* Would Make Again */}
            <div className="bg-card rounded-2xl p-4 shadow-card border border-border/50 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="font-medium mb-2 text-sm">תכין שוב?</h3>
              <div className="flex gap-3">
                <Button
                  variant={wouldMakeAgain === true ? 'default' : 'outline'}
                  size="default"
                  className="flex-1"
                  onClick={() => setWouldMakeAgain(true)}
                >
                  <Check className="w-4 h-4" />
                  בטח!
                </Button>
                <Button
                  variant={wouldMakeAgain === false ? 'destructive' : 'outline'}
                  size="default"
                  className="flex-1"
                  onClick={() => setWouldMakeAgain(false)}
                >
                  <X className="w-4 h-4" />
                  לא בטוח
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit - Fixed at bottom */}
      <div className="p-6 pt-2 bg-background">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            size="lg"
            className="w-full"
          >
            שמור וחזור הביתה
          </Button>
        </div>
      </div>
    </FixedScreenLayout>
  );
};

export default RateMeal;
