import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const FAVORITES_KEY = 'budgetbites_favorites';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites on mount or user change
  useEffect(() => {
    if (user) {
      loadFavoritesFromDB();
    } else {
      loadFavoritesFromStorage();
    }
  }, [user]);

  const loadFavoritesFromStorage = () => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
    setLoading(false);
  };

  const loadFavoritesFromDB = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorite_recipes')
        .select('recipe_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const recipeIds = data?.map(f => f.recipe_id) || [];
      setFavorites(recipeIds);
      
      // Also update localStorage for offline access
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(recipeIds));
    } catch (error) {
      console.error('Error loading favorites:', error);
      loadFavoritesFromStorage(); // Fallback to local
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = useCallback(async (recipeId: string) => {
    const isFavorite = favorites.includes(recipeId);
    
    // Optimistic update
    const newFavorites = isFavorite
      ? favorites.filter(id => id !== recipeId)
      : [...favorites, recipeId];
    
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));

    if (user) {
      try {
        if (isFavorite) {
          const { error } = await supabase
            .from('favorite_recipes')
            .delete()
            .eq('user_id', user.id)
            .eq('recipe_id', recipeId);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('favorite_recipes')
            .insert({ user_id: user.id, recipe_id: recipeId });

          if (error) throw error;
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        // Revert on error
        setFavorites(favorites);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        toast.error('שגיאה בשמירת המועדף');
      }
    }

    if (!isFavorite) {
      toast.success('נוסף למועדפים ❤️');
    }
  }, [favorites, user]);

  const isFavorite = useCallback((recipeId: string) => {
    return favorites.includes(recipeId);
  }, [favorites]);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
  };
};
