import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart, Plus, Trash2, ChefHat } from 'lucide-react';
import { RecipeCard } from '@/components/RecipeCard';
import { AddRecipeDialog } from '@/components/AddRecipeDialog';
import { Button } from '@/components/ui/button';

import { GradientBackground } from '@/components/ui/GradientBackground';
import { recipes, categoryLabels, categoryEmojis } from '@/lib/recipes';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/hooks/useFavorites';
import { useCustomRecipes, CustomRecipe } from '@/hooks/useCustomRecipes';
import { useApp } from '@/contexts/AppContext';
import type { RecipeCategory } from '@/lib/types';
import appLogo from '@/assets/app-logo.png';

const categories: Array<RecipeCategory | 'all' | 'favorites' | 'my-recipes'> = ['all', 'my-recipes', 'favorites', 'desserts', 'beginner', 'fast', 'cheap', 'protein', 'vegetarian', 'easy', 'kosher'];

export const Recipes: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<RecipeCategory | 'all' | 'favorites' | 'my-recipes'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { customRecipes, deleteCustomRecipe } = useCustomRecipes();
  const { photoUrl } = useApp();

  const filteredRecipes = recipes.filter(recipe => {
    let matchesCategory = false;
    
    if (activeCategory === 'all') {
      matchesCategory = true;
    } else if (activeCategory === 'favorites') {
      matchesCategory = favorites.includes(recipe.id);
    } else if (activeCategory === 'my-recipes') {
      matchesCategory = false; // Standard recipes don't show in my-recipes
    } else {
      matchesCategory = recipe.category === activeCategory;
    }
    
    const matchesSearch = recipe.name.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  // Filter custom recipes
  const filteredCustomRecipes = customRecipes.filter(recipe => {
    if (activeCategory !== 'all' && activeCategory !== 'my-recipes') return false;
    return recipe.name.includes(searchQuery);
  });

  const handleCustomRecipeClick = (recipe: CustomRecipe) => {
    // For now, just show a toast - we could expand this to a detail page
    navigate(`/chat`);
  };

  return (
    <GradientBackground variant="minimal">
      <div className="screen-container" dir="rtl">
        <div className="scroll-container scrollbar-hide pt-safe pb-safe-24">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold">מתכונים</h1>
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img 
                src={photoUrl || appLogo} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4 sm:mb-5">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="חיפוש מתכון..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 sm:h-14 pr-12 pl-4 bg-card rounded-2xl border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-soft text-base"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 sm:-mx-6 px-4 sm:px-6 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-3 sm:px-5 py-2 sm:py-2.5 rounded-full whitespace-nowrap transition-all duration-300 text-xs sm:text-sm font-medium btn-press flex items-center gap-1 sm:gap-1.5",
                  activeCategory === category
                    ? "bg-black text-white shadow-soft"
                    : "bg-card text-muted-foreground hover:bg-secondary border border-border/50"
                )}
              >
                {category === 'all' && '🍽️ הכל'}
                {category === 'my-recipes' && (
                  <>
                    <ChefHat className="w-4 h-4" />
                    המתכונים שלי
                    {customRecipes.length > 0 && (
                      <span className="bg-primary/20 text-primary text-xs px-1.5 py-0.5 rounded-full">
                        {customRecipes.length}
                      </span>
                    )}
                  </>
                )}
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
                {category !== 'all' && category !== 'favorites' && category !== 'my-recipes' && `${categoryEmojis[category]} ${categoryLabels[category]}`}
              </button>
            ))}
          </div>
        </div>

        {/* My Recipes Section */}
        {(activeCategory === 'all' || activeCategory === 'my-recipes') && (
          <div className="px-4 sm:px-6 mb-4">
            {/* Custom Recipes List */}
            {filteredCustomRecipes.length > 0 && (
              <div className="space-y-3 mb-4">
                {activeCategory === 'all' && (
                  <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <ChefHat className="w-4 h-4" />
                    המתכונים שלי
                  </h2>
                )}
                {filteredCustomRecipes.map((recipe, index) => (
                  <div 
                    key={recipe.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div 
                      className="bg-card rounded-2xl border border-border/50 p-4 flex items-center gap-4 shadow-card hover:shadow-elevated transition-all cursor-pointer active:scale-[0.98]"
                      onClick={() => handleCustomRecipeClick(recipe)}
                    >
                      <div className="w-14 h-14 bg-gradient-to-br from-secondary to-muted rounded-2xl flex items-center justify-center text-3xl shadow-soft">
                        {recipe.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-base truncate">{recipe.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {recipe.prepTime} דקות • {recipe.ingredients.length} מצרכים
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteCustomRecipe(recipe.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeCategory === 'my-recipes' && filteredCustomRecipes.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4">
                  👨‍🍳
                </div>
                <p className="text-lg font-medium mb-1">אין עדיין מתכונים</p>
                <p className="text-muted-foreground text-sm mb-4">
                  הוסף את המתכונים שלך או בקש משפי לעזור לך ליצור
                </p>
                <Button onClick={() => setIsAddRecipeOpen(true)} className="rounded-xl">
                  <Plus className="w-4 h-4 ml-1" />
                  הוסף מתכון ראשון
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Standard Recipe List */}
        {activeCategory !== 'my-recipes' && (
          <div className="px-4 sm:px-6 space-y-3">
            {activeCategory === 'all' && filteredCustomRecipes.length > 0 && (
              <h2 className="text-sm font-medium text-muted-foreground">כל המתכונים</h2>
            )}
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
        )}
        </div>
      </div>

      {/* Add Recipe Dialog */}
      <AddRecipeDialog
        open={isAddRecipeOpen}
        onOpenChange={setIsAddRecipeOpen}
      />
    </GradientBackground>
  );
};

export default Recipes;
