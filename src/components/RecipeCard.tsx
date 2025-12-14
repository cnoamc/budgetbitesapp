import React from 'react';
import { Clock, ChefHat, TrendingUp } from 'lucide-react';
import { categoryLabels } from '@/lib/recipes';
import type { Recipe } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  className?: string;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onClick, className }) => {
  const savings = recipe.deliveryCost - recipe.homeCost;
  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full bg-card rounded-2xl p-4 shadow-card border border-border/50 text-right",
        "hover:shadow-elevated transition-all duration-300 hover:-translate-y-1",
        "active:scale-[0.98]",
        className
      )}
    >
      <div className="flex gap-4">
        <div className="w-20 h-20 bg-secondary rounded-xl flex items-center justify-center text-4xl shrink-0">
          {recipe.emoji}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg mb-1 truncate">{recipe.name}</h3>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {totalTime} דק׳
            </span>
            <span className="flex items-center gap-1">
              <ChefHat className="w-3.5 h-3.5" />
              {categoryLabels[recipe.category]}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">₪{recipe.homeCost}</span>
            <span className="flex items-center gap-1 text-savings text-sm font-medium bg-savings-light px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              חיסכון ₪{savings}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};
