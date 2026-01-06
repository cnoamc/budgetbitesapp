import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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

interface CreateRecipeData {
  name: string;
  emoji: string;
  ingredients: string[];
  steps: string[];
  prepTime: number;
  homeCost?: number;
  deliveryCost?: number;
  category?: string;
  servings?: number;
  difficulty?: string;
  tips?: string[];
  donenessChecks?: string[];
  chefNotes?: string;
  recipeMemoryJson?: any;
  explanationText?: string;
}

export const useCustomRecipes = () => {
  const { user } = useAuth();
  const [customRecipes, setCustomRecipes] = useState<CustomRecipe[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCustomRecipes = useCallback(async () => {
    if (!user) {
      setCustomRecipes([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('custom_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const recipes: CustomRecipe[] = (data || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        emoji: r.emoji || '🍽️',
        ingredients: r.ingredients || [],
        steps: r.steps || [],
        prepTime: r.prep_time || 30,
        homeCost: r.home_cost || 30,
        deliveryCost: r.delivery_cost || 60,
        category: r.category || 'easy',
        createdAt: r.created_at,
        servings: r.servings,
        difficulty: r.difficulty,
        tips: r.tips || [],
        donenessChecks: r.doneness_checks || [],
        chefNotes: r.chef_notes,
        recipeMemoryJson: r.recipe_memory_json,
        recipeSummary: r.recipe_summary,
        explanationText: r.explanation_text,
      }));

      setCustomRecipes(recipes);
    } catch (error) {
      console.error('Error loading custom recipes:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCustomRecipes();
  }, [loadCustomRecipes]);

  const addCustomRecipe = async (data: CreateRecipeData): Promise<CustomRecipe | null> => {
    if (!user) {
      toast.error('יש להתחבר כדי להוסיף מתכונים');
      return null;
    }

    try {
      const { data: inserted, error } = await supabase
        .from('custom_recipes')
        .insert({
          user_id: user.id,
          name: data.name,
          emoji: data.emoji,
          ingredients: data.ingredients,
          steps: data.steps,
          prep_time: data.prepTime,
          home_cost: data.homeCost || 30,
          delivery_cost: data.deliveryCost || 60,
          category: data.category || 'easy',
          servings: data.servings || 2,
          difficulty: data.difficulty || 'beginner',
          tips: data.tips || [],
          doneness_checks: data.donenessChecks || [],
          chef_notes: data.chefNotes || null,
          recipe_memory_json: data.recipeMemoryJson || null,
          explanation_text: data.explanationText || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newRecipe: CustomRecipe = {
        id: inserted.id,
        name: inserted.name,
        emoji: inserted.emoji || '🍽️',
        ingredients: inserted.ingredients || [],
        steps: inserted.steps || [],
        prepTime: inserted.prep_time || 30,
        homeCost: inserted.home_cost || 30,
        deliveryCost: inserted.delivery_cost || 60,
        category: inserted.category || 'easy',
        createdAt: inserted.created_at,
        servings: inserted.servings,
        difficulty: inserted.difficulty,
        tips: inserted.tips || [],
        donenessChecks: inserted.doneness_checks || [],
        chefNotes: inserted.chef_notes,
        recipeMemoryJson: inserted.recipe_memory_json,
        explanationText: inserted.explanation_text,
      };

      setCustomRecipes(prev => [newRecipe, ...prev]);
      toast.success('המתכון נוסף בהצלחה! 🎉');
      return newRecipe;
    } catch (error) {
      console.error('Error adding custom recipe:', error);
      toast.error('שגיאה בהוספת המתכון');
      return null;
    }
  };

  const deleteCustomRecipe = async (recipeId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('custom_recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', user.id);

      if (error) throw error;

      setCustomRecipes(prev => prev.filter(r => r.id !== recipeId));
      toast.success('המתכון נמחק');
      return true;
    } catch (error) {
      console.error('Error deleting custom recipe:', error);
      toast.error('שגיאה במחיקת המתכון');
      return false;
    }
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