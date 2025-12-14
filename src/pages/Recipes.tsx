import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { RecipeCard } from '@/components/RecipeCard';
import { BottomNav } from '@/components/BottomNav';
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
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold mb-6">מתכונים</h1>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="חיפוש מתכון..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pr-12 pl-4 bg-secondary rounded-xl border-0 focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 text-sm font-medium",
                activeCategory === category
                  ? "gradient-primary text-primary-foreground shadow-card"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
          <div className="text-center py-12">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-muted-foreground">לא נמצאו מתכונים</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Recipes;
