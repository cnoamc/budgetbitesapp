import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, X } from 'lucide-react';
import { RecipeCard } from '@/components/RecipeCard';
import { BottomNav } from '@/components/BottomNav';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { recipes, categoryLabels, categoryEmojis } from '@/lib/recipes';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { useApp } from '@/contexts/AppContext';
import type { RecipeCategory } from '@/lib/types';
import chefIcon from '@/assets/chef-icon.png';

const categories: Array<RecipeCategory | 'favorites'> = ['favorites', 'beginner', 'fast', 'cheap', 'protein', 'vegetarian', 'easy', 'kosher'];

export const Recipes: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<Set<RecipeCategory | 'favorites'>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { photoUrl } = useApp();

  const toggleCategory = (category: RecipeCategory | 'favorites') => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setSelectedCategories(new Set());
  };

  const filteredRecipes = recipes.filter(recipe => {
    // If no categories selected, show all
    if (selectedCategories.size === 0) {
      return recipe.name.includes(searchQuery);
    }

    // Check if recipe matches ALL selected categories (AND logic)
    let matchesAllCategories = true;
    
    selectedCategories.forEach(category => {
      if (category === 'favorites') {
        if (!favorites.includes(recipe.id)) {
          matchesAllCategories = false;
        }
      } else {
        if (recipe.category !== category) {
          matchesAllCategories = false;
        }
      }
    });
    
    const matchesSearch = recipe.name.includes(searchQuery);
    return matchesAllCategories && matchesSearch;
  });

  const hasActiveFilters = selectedCategories.size > 0;

  return (
    <GradientBackground variant="minimal">
      <div className="min-h-screen pb-28">
        {/* Header */}
        <div className="p-6 pt-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">מתכונים</h1>
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img 
                src={photoUrl || chefIcon} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="חיפוש מתכון..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pr-12 pl-4 bg-card rounded-2xl border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-soft text-base"
            />
          </div>

          {/* Categories - Multi-select */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 text-sm font-medium btn-press flex items-center gap-1.5 bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20"
              >
                <X className="w-4 h-4" />
                נקה
              </button>
            )}
            {categories.map((category) => {
              const isSelected = selectedCategories.has(category);
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    "px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 text-sm font-medium btn-press flex items-center gap-1.5",
                    isSelected
                      ? "bg-black text-white shadow-soft"
                      : "bg-card text-muted-foreground hover:bg-secondary border border-border/50"
                  )}
                >
                  {category === 'favorites' ? (
                    <>
                      <Heart className={cn("w-4 h-4", favorites.length > 0 && isSelected && "fill-current")} />
                      מועדפים
                      {favorites.length > 0 && (
                        <span className={cn(
                          "text-xs px-1.5 py-0.5 rounded-full",
                          isSelected ? "bg-white/20 text-white" : "bg-red-500/20 text-red-600"
                        )}>
                          {favorites.length}
                        </span>
                      )}
                    </>
                  ) : (
                    `${categoryEmojis[category]} ${categoryLabels[category]}`
                  )}
                </button>
              );
            })}
          </div>

          {/* Active filters summary */}
          {hasActiveFilters && (
            <div className="mt-3 text-sm text-muted-foreground">
              מסנן: {Array.from(selectedCategories).map(cat => 
                cat === 'favorites' ? 'מועדפים' : categoryLabels[cat]
              ).join(' + ')}
              <span className="mx-2">•</span>
              <span className="font-medium text-foreground">{filteredRecipes.length} מתכונים</span>
            </div>
          )}
        </div>

        {/* Recipe List */}
        <div className="px-6 space-y-3">
          {filteredRecipes.map((recipe, index) => (
            <div 
              key={recipe.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <RecipeCard
                recipe={recipe}
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                isFavorite={isFavorite(recipe.id)}
                onToggleFavorite={() => toggleFavorite(recipe.id)}
              />
            </div>
          ))}

          {filteredRecipes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4">
                {selectedCategories.has('favorites') ? '❤️' : '🔍'}
              </div>
              <p className="text-lg font-medium mb-1">
                {selectedCategories.has('favorites') && selectedCategories.size === 1 
                  ? 'אין מועדפים עדיין' 
                  : 'לא נמצאו מתכונים'}
              </p>
              <p className="text-muted-foreground text-sm">
                {selectedCategories.has('favorites') && selectedCategories.size === 1
                  ? 'לחץ על ❤️ כדי לשמור מתכונים' 
                  : hasActiveFilters 
                    ? 'נסה לשנות את הסינון'
                    : 'נסה לחפש משהו אחר'}
              </p>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </GradientBackground>
  );
};

export default Recipes;
