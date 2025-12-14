import React from 'react';
import { Clock, ChefHat, TrendingUp } from 'lucide-react';
import { categoryLabels } from '@/lib/recipes';
import type { Recipe } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PremiumCard } from '@/components/ui/PremiumCard';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  className?: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, className }) => {
  const savings = recipe.deliveryCost - recipe.homeCost;
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <PremiumCard
      onClick={onClick}
      hoverable
      className={cn("p-4 text-right", className)}
    >
      <div className="flex gap-4">
        {/* Emoji with gradient background */}
        <div className="w-20 h-20 bg-gradient-to-br from-secondary to-muted rounded-2xl flex items-center justify-center text-4xl shrink-0 shadow-soft">
          {recipe.emoji}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1.5 truncate">{recipe.name}</h3>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-0.5 rounded-full">
              <Clock className="w-3.5 h-3.5" />
              {totalTime} דק׳
            </span>
            <span className="flex items-center gap-1.5">
              <ChefHat className="w-3.5 h-3.5" />
              {categoryLabels[recipe.category]}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold">₪{recipe.homeCost}</span>
            <span className="flex items-center gap-1.5 text-savings text-sm font-medium bg-savings-light px-3 py-1.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              חיסכון ₪{savings}
            </span>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
};