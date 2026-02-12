import React from 'react';
import { Clock, ChefHat, TrendingUp, Heart } from 'lucide-react';
import { categoryLabels } from '@/lib/recipes';
import { getRecipeImage } from '@/lib/recipeImages';
import type { Recipe } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PremiumCard } from '@/components/ui/PremiumCard';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  className?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  compact?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  onClick, 
  className,
  isFavorite = false,
  onToggleFavorite,
  compact = false,
}) => {
  const savings = recipe.deliveryCost - recipe.homeCost;
  const totalTime = recipe.prepTime + recipe.cookTime;
  const recipeImage = getRecipeImage(recipe.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(e);
  };

  if (compact) {
    return (
      <PremiumCard
        onClick={onClick}
        hoverable
        className={cn("p-2.5 text-right relative", className)}
      >
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-xl shrink-0 shadow-soft overflow-hidden">
            {recipeImage ? (
              <img 
                src={recipeImage} 
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-2xl">
                {recipe.emoji}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm truncate">{recipe.name}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {totalTime} דק׳
                </span>
                <span>₪{recipe.homeCost}</span>
              </div>
            </div>
            <span className="text-savings text-xs font-medium bg-savings-light px-2 py-1 rounded-full shrink-0">
              +₪{savings}
            </span>
          </div>
        </div>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard
      onClick={onClick}
      hoverable
      className={cn("p-4 text-right relative", className)}
    >
      {/* Favorite button */}
      {onToggleFavorite && (
        <button
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 btn-press z-10",
            isFavorite 
              ? "bg-red-500/10 text-red-500" 
              : "bg-secondary/80 text-muted-foreground hover:text-red-400"
          )}
          aria-label={isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
        >
          <Heart 
            className={cn(
              "w-5 h-5 transition-all",
              isFavorite && "fill-current scale-110"
            )} 
          />
        </button>
      )}

      <div className="flex gap-4">
        {/* Recipe image or emoji fallback */}
        <div className="w-20 h-20 rounded-2xl shrink-0 shadow-soft overflow-hidden">
          {recipeImage ? (
            <img 
              src={recipeImage} 
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-4xl">
              {recipe.emoji}
            </div>
          )}
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
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground">עלות מצרכים</span>
              <span className="text-base font-light tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>₪{recipe.homeCost}</span>
            </div>
            <span className="flex items-center gap-1 text-savings text-xs font-medium bg-savings-light/60 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              ₪{savings}
            </span>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
};