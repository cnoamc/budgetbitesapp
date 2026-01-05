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

  const addCustomRecipe = async (recipe: Omit<CustomRecipe, 'id' | 'createdAt'>) => {
    if (!user) {
      toast.error('יש להתחבר כדי להוסיף מתכונים');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('custom_recipes')
        .insert({
          user_id: user.id,
          name: recipe.name,
          emoji: recipe.emoji,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          prep_time: recipe.prepTime,
          home_cost: recipe.homeCost,
          delivery_cost: recipe.deliveryCost,
          category: recipe.category,
        })
        .select()
        .single();

      if (error) throw error;

      const newRecipe: CustomRecipe = {
        id: data.id,
        name: data.name,
        emoji: data.emoji || '🍽️',
        ingredients: data.ingredients || [],
        steps: data.steps || [],
        prepTime: data.prep_time || 30,
        homeCost: data.home_cost || 30,
        deliveryCost: data.delivery_cost || 60,
        category: data.category || 'easy',
        createdAt: data.created_at,
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

  return {
    customRecipes,
    loading,
    addCustomRecipe,
    deleteCustomRecipe,
    refreshRecipes: loadCustomRecipes,
  };
};
