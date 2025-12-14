import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, ChefHat, ShoppingCart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SavingsComparisonCard } from '@/components/notifications';
import { getRecipeById, categoryLabels } from '@/lib/recipes';

export const RecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'savings'>('ingredients');
  
  const recipe = getRecipeById(id || '');

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>המתכון לא נמצא</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="relative">
        <div className="h-48 bg-secondary flex items-center justify-center text-8xl">
          {recipe.emoji}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 w-10 h-10 bg-card/90 backdrop-blur rounded-full flex items-center justify-center shadow-card"
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
                  {categoryLabels[recipe.category]}
                </span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-2xl font-bold">₪{recipe.homeCost}</p>
              <p className="text-sm text-muted-foreground line-through">₪{recipe.deliveryCost}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ingredients'
                  ? 'gradient-primary text-primary-foreground'
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
                  ? 'gradient-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              חיסכון
            </button>
          </div>

          {activeTab === 'ingredients' ? (
            <div className="space-y-2">
              {recipe.ingredients.map((ingredient, index) => (
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
              onCook={() => navigate(`/cook/${recipe.id}`)}
            />
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={() => navigate(`/cook/${recipe.id}`)}
            size="xl"
            className="w-full"
          >
            <MessageCircle className="w-5 h-5" />
            בוא נבשל יחד!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
