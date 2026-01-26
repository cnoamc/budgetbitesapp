import { useState, useEffect, useCallback } from 'react';

export interface CustomRecipe {
  id: string;
  name: string;
  emoji: string;
  ingredients: string[];
  steps: string[];
  prepTime: number;
  homeCost: number;
  deliveryCost: number;
  category: string;
  createdAt: string;
  servings?: number;
  difficulty?: string;
  tips?: string[];
  donenessChecks?: string[];
  chefNotes?: string;
  recipeMemoryJson?: any;
  recipeSummary?: string;
  explanationText?: string;
}

const CUSTOM_RECIPES_KEY = 'chefi_custom_recipes';

export const useCustomRecipes = () => {
  const [customRecipes, setCustomRecipes] = useState<CustomRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCustomRecipes = useCallback(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_RECIPES_KEY);
      if (stored) {
        setCustomRecipes(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading custom recipes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomRecipes();
  }, [loadCustomRecipes]);

  const addCustomRecipe = async (data: Partial<CustomRecipe>): Promise<CustomRecipe | null> => {
    const newRecipe: CustomRecipe = {
      id: `custom-${Date.now()}`,
      name: data.name || 'מתכון חדש',
      emoji: data.emoji || '🍽️',
      ingredients: data.ingredients || [],
      steps: data.steps || [],
      prepTime: data.prepTime || 30,
      homeCost: data.homeCost || 30,
      deliveryCost: data.deliveryCost || 60,
      category: data.category || 'easy',
      createdAt: new Date().toISOString(),
      servings: data.servings || 2,
      difficulty: data.difficulty || 'beginner',
      tips: data.tips || [],
      donenessChecks: data.donenessChecks || [],
      chefNotes: data.chefNotes,
      recipeMemoryJson: data.recipeMemoryJson,
      explanationText: data.explanationText,
    };

    const updated = [newRecipe, ...customRecipes];
    setCustomRecipes(updated);
    localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(updated));
    return newRecipe;
  };

  const deleteCustomRecipe = async (recipeId: string) => {
    const updated = customRecipes.filter(r => r.id !== recipeId);
    setCustomRecipes(updated);
    localStorage.setItem(CUSTOM_RECIPES_KEY, JSON.stringify(updated));
    return true;
  };

  const getRecipeById = (recipeId: string): CustomRecipe | undefined => {
    return customRecipes.find(r => r.id === recipeId);
  };

  return {
    customRecipes,
    loading,
    addCustomRecipe,
    deleteCustomRecipe,
    getRecipeById,
    refreshRecipes: loadCustomRecipes,
  };
};
