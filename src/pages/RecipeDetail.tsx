import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, ChefHat, ShoppingCart, MessageCircle, Minus, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SavingsComparisonCard } from '@/components/notifications';
import { getRecipeById, categoryLabels } from '@/lib/recipes';
import { getRecipeImage } from '@/lib/recipeImages';
import { ScrollablePageLayout } from '@/components/layouts';
import type { Ingredient } from '@/lib/types';

// Units that indicate weight/volume where decimals make sense
const decimalUnits = [
  'גרם', 'גרמים', 'ג\'',
  'מ"ל', 'מ״ל', 'מל', 'ml',
  'ליטר', 'ל', 'l',
  'כוס', 'כוסות',
  'כף', 'כפות',
  'כפית', 'כפיות',
  'קילו', 'kg', 'g'
];

const round1 = (n: number) => Math.round(n * 10) / 10;
const formatNumber = (n: number) => {
  const v = round1(n);
  return Number.isInteger(v) ? String(v) : String(v);
};

// Helper to scale ingredient amounts
const scaleIngredientAmount = (amount: string, multiplier: number): string => {
  const input = amount.trim();

  // If there are no numeric hints at all, leave as-is (e.g. "עלים", "פרוסה")
  const hasNumberish =
    /\d/.test(input) ||
    /[½¼¾⅓⅔⅛⅜⅝⅞]/.test(input) ||
    /(חצי|רבע|שליש)/.test(input) ||
    /\d+\s*\/\s*\d+/.test(input);
  if (!hasNumberish) return input;

  const hasFractionHint =
    /[½¼¾⅓⅔⅛⅜⅝⅞]/.test(input) ||
    /(חצי|רבע|שליש)/.test(input) ||
    /\d+\s*\/\s*\d+/.test(input);
  const hasDecimalUnit = decimalUnits.some((unit) => input.includes(unit));
  const allowFractional = hasDecimalUnit || hasFractionHint;

  const scaleValue = (v: number) => {
    const scaled = v * multiplier;
    if (allowFractional) return round1(scaled);
    // Countable items: keep whole numbers (no 0.5 buns)
    return Math.max(1, Math.ceil(scaled));
  };

  let normalized = input;

  // Hebrew words → numeric (unscaled)
  normalized = normalized
    .replace(/שני\s*שליש/g, '0.67')
    .replace(/שליש/g, '0.33')
    .replace(/רבע/g, '0.25')
    .replace(/חצי/g, '0.5');

  // Unicode fractions → decimals (unscaled)
  const unicodeFractionMap: Record<string, number> = {
    '½': 0.5,
    '¼': 0.25,
    '¾': 0.75,
    '⅓': 0.333,
    '⅔': 0.667,
    '⅛': 0.125,
    '⅜': 0.375,
    '⅝': 0.625,
    '⅞': 0.875,
  };

  Object.entries(unicodeFractionMap).forEach(([frac, val]) => {
    if (normalized.includes(frac)) {
      normalized = normalized.split(frac).join(String(val));
    }
  });

  // Slash fractions like 1/2 → decimals (unscaled)
  normalized = normalized.replace(/(\d+)\s*\/\s*(\d+)/g, (_, a, b) => {
    const val = Number(a) / Number(b);
    return String(round1(val));
  });

  // Scale numbers + ranges in a single pass (prevents double-scaling)
  normalized = normalized.replace(
    /(\d+\.?\d*)\s*[-–]\s*(\d+\.?\d*)|(\d+\.?\d*)/g,
    (_, a, b, single) => {
      if (a && b) {
        const left = formatNumber(scaleValue(Number(a)));
        const right = formatNumber(scaleValue(Number(b)));
        return `${left}-${right}`;
      }
      return formatNumber(scaleValue(Number(single)));
    },
  );

  return normalized;
};

export const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'savings'>('ingredients');
  const [servings, setServings] = useState(1); // Base recipe amounts are for 1 serving
  
  const recipe = getRecipeById(id || '');
  const recipeImage = recipe ? getRecipeImage(recipe.id) : undefined;
  
  // Scale ingredients based on servings (base is 1 serving)
  const baseServings = 1;
  const multiplier = servings / baseServings;
  
  const scaledIngredients = useMemo(() => {
    if (!recipe) return [];
    return recipe.ingredients.map((ing: Ingredient) => ({
      ...ing,
      amount: scaleIngredientAmount(ing.amount, multiplier),
      cost: Math.round(ing.cost * multiplier * 10) / 10
    }));
  }, [recipe, multiplier]);

  if (!recipe) {
    return (
      <ScrollablePageLayout hasBottomNav={false}>
        <div className="flex-1 flex items-center justify-center">
          <p>המתכון לא נמצא</p>
        </div>
      </ScrollablePageLayout>
    );
  }

  return (
    <ScrollablePageLayout hasBottomNav={false}>
      <div className="bg-background pb-8">
      {/* Header */}
      <div className="relative">
        <div className="h-56 bg-secondary flex items-center justify-center overflow-hidden">
          {recipeImage ? (
            <img 
              src={recipeImage} 
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-8xl">{recipe.emoji}</span>
          )}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute right-4 w-10 h-10 bg-card/90 backdrop-blur rounded-full flex items-center justify-center shadow-card"
          style={{ top: 'max(16px, calc(env(safe-area-inset-top, 0px) + 8px))' }}
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-6 -mt-6 relative">
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{recipe.name}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {recipe.prepTime + recipe.cookTime} דק׳
                </span>
                <span className="flex items-center gap-1">
                  <ChefHat className="w-4 h-4" />
                  {recipe.category.map(c => categoryLabels[c]).join(', ')}
                </span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold">₪{recipe.homeCost}</p>
              <p className="text-sm text-muted-foreground line-through">₪{recipe.deliveryCost}</p>
            </div>
          </div>

          {/* Servings Selector */}
          <div className="flex items-center justify-between bg-secondary/50 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>מנות</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                disabled={servings <= 1}
                className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-lg">{servings}</span>
              <button
                onClick={() => setServings(Math.min(20, servings + 1))}
                disabled={servings >= 20}
                className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ingredients'
                  ? 'bg-black text-white'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <ShoppingCart className="w-4 h-4 inline-block ml-2" />
              מצרכים
            </button>
            <button
              onClick={() => setActiveTab('savings')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'savings'
                  ? 'bg-black text-white'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              חיסכון
            </button>
          </div>

          {activeTab === 'ingredients' ? (
            <div className="space-y-2">
              {scaledIngredients.map((ingredient, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center text-lg">
                      •
                    </div>
                    <span>{ingredient.name}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-muted-foreground">{ingredient.amount}</span>
                    <span className="text-sm text-muted-foreground mr-2">~₪{ingredient.cost}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SavingsComparisonCard
              recipeName={recipe.name}
              emoji={recipe.emoji}
              homeCost={recipe.homeCost}
              deliveryCost={recipe.deliveryCost}
            />
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={() => navigate(`/cook/${recipe.id}`)}
            variant="default"
            size="xl"
            className="w-full"
          >
            <MessageCircle className="w-5 h-5" />
            בוא נבשל יחד!
          </Button>
        </div>
      </div>
      </div>
    </ScrollablePageLayout>
  );
};

export default RecipeDetail;
