import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Clock, ChefHat, Users, MessageCircle, Flame, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollablePageLayout } from '@/components/layouts';
import { useCustomRecipes, CustomRecipe } from '@/hooks/useCustomRecipes';

const difficultyLabels: Record<string, string> = {
  beginner: 'קל',
  intermediate: 'בינוני',
  advanced: 'מתקדם',
};

export const CustomRecipeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customRecipes } = useCustomRecipes();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'steps' | 'tips'>('ingredients');
  
  const recipe = customRecipes.find(r => r.id === id);

  if (!recipe) {
    return (
      <ScrollablePageLayout hasBottomNav={false}>
        <div className="flex-1 flex items-center justify-center">
          <p>המתכון לא נמצא</p>
        </div>
      </ScrollablePageLayout>
    );
  }

  const handleChefExplains = () => {
    const prompt = `הסבר לי צעד אחרי צעד איך להכין ${recipe.name}. המתכון כולל: ${recipe.ingredients.join(', ')}. השלבים: ${recipe.steps.join(' | ')}`;
    navigate('/chat', { state: { initialMessage: prompt } });
  };

  return (
    <ScrollablePageLayout hasBottomNav={false}>
      <div className="bg-background pb-28">
        {/* Header */}
        <div className="relative">
          <div className="h-48 bg-gradient-to-br from-secondary to-muted flex items-center justify-center overflow-hidden">
            <span className="text-8xl">{recipe.emoji}</span>
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
            <h1 className="text-2xl font-bold mb-2">{recipe.name}</h1>
            
            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {recipe.prepTime} דק׳
              </span>
              {recipe.servings && (
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {recipe.servings} מנות
                </span>
              )}
              {recipe.difficulty && (
                <span className="flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  {difficultyLabels[recipe.difficulty] || recipe.difficulty}
                </span>
              )}
            </div>

            {/* Chef Notes */}
            {recipe.chefNotes && (
              <div className="bg-primary/5 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <ChefHat className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">הערות השף</span>
                </div>
                <p className="text-sm text-muted-foreground">{recipe.chefNotes}</p>
              </div>
            )}

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
                מצרכים ({recipe.ingredients.length})
              </button>
              <button
                onClick={() => setActiveTab('steps')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'steps'
                    ? 'bg-black text-white'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                שלבים ({recipe.steps.length})
              </button>
              {recipe.tips && recipe.tips.length > 0 && (
                <button
                  onClick={() => setActiveTab('tips')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'tips'
                      ? 'bg-black text-white'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  טיפים
                </button>
              )}
            </div>

            {/* Tab Content */}
            {activeTab === 'ingredients' && (
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
                  >
                    <div className="w-8 h-8 bg-background rounded-full flex items-center justify-center text-lg">
                      •
                    </div>
                    <span>{ingredient}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'steps' && (
              <div className="space-y-3">
                {recipe.steps.map((step, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 bg-secondary rounded-lg"
                  >
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      {index + 1}
                    </div>
                    <p className="pt-1.5">{step}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'tips' && recipe.tips && (
              <div className="space-y-2">
                {recipe.tips.map((tip, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg"
                  >
                    <span className="text-lg">💡</span>
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Doneness Checks */}
            {recipe.donenessChecks && recipe.donenessChecks.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">איך יודעים שזה מוכן?</span>
                </div>
                <ul className="space-y-1">
                  {recipe.donenessChecks.map((check, index) => (
                    <li key={index} className="text-sm text-green-700">• {check}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-lg mx-auto">
            <Button
              onClick={handleChefExplains}
              variant="default"
              size="xl"
              className="w-full"
            >
              <MessageCircle className="w-5 h-5" />
              שפי מסביר לי את המתכון
            </Button>
          </div>
        </div>
      </div>
    </ScrollablePageLayout>
  );
};

export default CustomRecipeDetail;
