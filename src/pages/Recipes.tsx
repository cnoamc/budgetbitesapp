import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart } from 'lucide-react';
import { RecipeCard } from '@/components/RecipeCard';

import { GradientBackground } from '@/components/ui/GradientBackground';
import { recipes, categoryLabels, categoryEmojis } from '@/lib/recipes';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { useApp } from '@/contexts/AppContext';
import type { RecipeCategory } from '@/lib/types';
import appLogo from '@/assets/app-logo.png';

const categories: Array<RecipeCategory | 'all' | 'favorites'> = ['all', 'favorites', 'desserts', 'beginner', 'fast', 'cheap', 'protein', 'vegetarian', 'easy', 'kosher'];

export const Recipes: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<RecipeCategory | 'all' | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { photoUrl } = useApp();

  const filteredRecipes = recipes.filter(recipe => {
    let matchesCategory = false;
    
    if (activeCategory === 'all') {
      matchesCategory = true;
    } else if (activeCategory === 'favorites') {
      matchesCategory = favorites.includes(recipe.id);
    } else {
      matchesCategory = recipe.category === activeCategory;
    }
    
    const matchesSearch = recipe.name.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <GradientBackground variant="minimal">
      <div className="scroll-container scrollbar-hide pt-safe pb-safe-24" dir="rtl">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">מתכונים</h1>
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img 
                src={photoUrl || appLogo} 
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

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 text-sm font-medium btn-press flex items-center gap-1.5",
                  activeCategory === category
                    ? "bg-black text-white shadow-soft"
                    : "bg-card text-muted-foreground hover:bg-secondary border border-border/50"
                )}
              >
                {category === 'all' && '🍽️ הכל'}
                {category === 'favorites' && (
                  <>
                    <Heart className={cn("w-4 h-4", favorites.length > 0 && "fill-current text-red-500")} />
                    מועדפים
                    {favorites.length > 0 && (
                      <span className="bg-red-500/20 text-red-600 text-xs px-1.5 py-0.5 rounded-full">
                        {favorites.length}
                      </span>
                    )}
                  </>
                )}
                {category !== 'all' && category !== 'favorites' && `${categoryEmojis[category]} ${categoryLabels[category]}`}
              </button>
            ))}
          </div>
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
                {activeCategory === 'favorites' ? '❤️' : '🔍'}
              </div>
              <p className="text-lg font-medium mb-1">
                {activeCategory === 'favorites' ? 'אין מועדפים עדיין' : 'לא נמצאו מתכונים'}
              </p>
              <p className="text-muted-foreground text-sm">
                {activeCategory === 'favorites' 
                  ? 'לחץ על ❤️ כדי לשמור מתכונים' 
                  : 'נסה לחפש משהו אחר'}
              </p>
            </div>
          )}
        </div>
      </div>
    </GradientBackground>
  );
};

export default Recipes;
