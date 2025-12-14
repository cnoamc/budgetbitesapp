export interface UserProfile {
  monthlySpending: number;
  weeklyOrders: number;
  preferredFood: string[];
  country: string;
  cookingSkill: number;
  onboardingComplete: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  category: 'easy' | 'beginner' | 'cheap' | 'fast';
  difficulty: number;
  prepTime: number;
  cookTime: number;
  homeCost: number;
  deliveryCost: number;
  ingredients: Ingredient[];
  steps: string[];
  image: string;
  emoji: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  cost: number;
}

export interface CookedMeal {
  recipeId: string;
  date: string;
  tasteRating: number;
  difficultyRating: number;
  wouldMakeAgain: boolean;
  savings: number;
}

export interface UserProgress {
  totalMealsCooked: number;
  totalSavings: number;
  averageRating: number;
  cookedMeals: CookedMeal[];
  skillLevel: number;
}

export const defaultUserProfile: UserProfile = {
  monthlySpending: 0,
  weeklyOrders: 0,
  preferredFood: [],
  country: 'IL',
  cookingSkill: 1,
  onboardingComplete: false,
};

export const defaultUserProgress: UserProgress = {
  totalMealsCooked: 0,
  totalSavings: 0,
  averageRating: 0,
  cookedMeals: [],
  skillLevel: 1,
};
