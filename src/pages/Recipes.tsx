import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChefHat } from 'lucide-react';
import { RecipeCard } from '@/components/RecipeCard';
import { BottomNav } from '@/components/BottomNav';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { recipes, categoryLabels } from '@/lib/recipes';
import { cn } from '@/lib/utils';
import type { Recipe } from '@/lib/types';

const categories: Array<Recipe['category'] | 'all'> = ['all', 'easy', 'beginner', 'cheap', 'fast'];

export const Recipes: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<Recipe['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = activeCategory === 'all' || recipe.category === activeCategory;
    const matchesSearch = recipe.name.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <GradientBackground variant="minimal">
      <div className="min-h-screen pb-28">
        {/* Header */}
        <div className="p-6 pt-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">מתכונים</h1>
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-primary" />
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
                  "px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 text-sm font-medium btn-press",
                  activeCategory === category
                    ? "gradient-primary text-primary-foreground shadow-soft"
                    : "bg-card text-muted-foreground hover:bg-secondary border border-border/50"
                )}
              >
                {category === 'all' ? 'הכל' : categoryLabels[category]}
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
              />
            </div>
          ))}

          {filteredRecipes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4">
                🔍
              </div>
              <p className="text-lg font-medium mb-1">לא נמצאו מתכונים</p>
              <p className="text-muted-foreground text-sm">נסה לחפש משהו אחר</p>
            </div>
          )}
        </div>

        <BottomNav />
      </div>
    </GradientBackground>
  );
};

export default Recipes;