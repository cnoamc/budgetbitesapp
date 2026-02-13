import React from 'react';
import { Clock, TrendingUp, Heart } from 'lucide-react';
import { getRecipeImage } from '@/lib/recipeImages';
import type { Recipe } from '@/lib/types';
import { cn } from '@/lib/utils';

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
      <div
        onClick={onClick}
        className={cn(
          "bg-card rounded-2xl border border-border/50 p-2.5 text-right relative cursor-pointer active:scale-[0.98] transition-all shadow-sm hover:shadow-md",
          className
        )}
      >
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-xl shrink-0 shadow-sm overflow-hidden">
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
      </div>
    );
  }

  // Grid card - image on top, text below
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card rounded-2xl border border-border/50 overflow-hidden cursor-pointer active:scale-[0.97] transition-all shadow-sm hover:shadow-md text-right",
        className
      )}
    >
      {/* Image with overlays */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {recipeImage ? (
          <img 
            src={recipeImage} 
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex items-center justify-center text-5xl">
            {recipe.emoji}
          </div>
        )}

        {/* Savings badge overlay - top right */}
        <span className="absolute top-2 right-2 flex items-center gap-0.5 text-white text-[11px] font-semibold bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" />
          ₪{savings}
        </span>

        {/* Favorite button overlay - top left */}
        {onToggleFavorite && (
          <button
            onClick={handleFavoriteClick}
            className={cn(
              "absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm",
              isFavorite 
                ? "bg-red-500/80 text-white" 
                : "bg-black/30 text-white/80 hover:bg-black/50"
            )}
            aria-label={isFavorite ? "הסר ממועדפים" : "הוסף למועדפים"}
          >
            <Heart 
              className={cn(
                "w-4 h-4 transition-all",
                isFavorite && "fill-current"
              )} 
            />
          </button>
        )}
      </div>
      
      {/* Text content below image */}
      <div className="p-2.5">
        <h3 className="font-semibold text-sm truncate mb-1">{recipe.name}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {totalTime} דק׳
          </span>
          <span className="font-medium text-foreground">עלות ₪{recipe.homeCost}</span>
        </div>
      </div>
    </div>
  );
};