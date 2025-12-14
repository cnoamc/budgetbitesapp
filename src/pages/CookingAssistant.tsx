import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/components/ChatMessage';
import { getRecipeById } from '@/lib/recipes';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const encouragements = [
  'מעולה! ממשיכים 💪',
  'נהדר! אתה מתקדם יפה! 🌟',
  'וואו, נראה טעים! 😋',
  'כל הכבוד! עוד צעד אחד 🎯',
  'אתה שף אמיתי! 👨‍🍳',
];

export const CookingAssistant: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addCookedMeal } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const recipe = getRecipeById(id || '');

  useEffect(() => {
    if (recipe) {
      setMessages([
        { text: `היי! בוא נכין ${recipe.name} יחד! 🍳\n\nאני אלווה אותך צעד אחרי צעד.\nמוכן?`, isBot: true },
      ]);
    }
  }, [recipe]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>המתכון לא נמצא</p>
      </div>
    );
  }

  const handleNext = () => {
    const encouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    
    if (currentStep < recipe.steps.length) {
      setMessages(prev => [
        ...prev,
        { text: currentStep === 0 ? 'מוכן!' : 'סיימתי! ✅', isBot: false },
        { text: recipe.steps[currentStep], isBot: true },
      ]);
      setCurrentStep(currentStep + 1);
    }

    if (currentStep > 0 && currentStep < recipe.steps.length - 1) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { text: encouragement, isBot: true },
        ]);
      }, 1500);
    }

    if (currentStep === recipe.steps.length - 1) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { text: '🎉 סיימת לבשל! איך יצא?', isBot: true },
        ]);
      }, 1000);
    }
  };

  const handleComplete = () => {
    navigate(`/rate/${recipe.id}`);
  };

  const isComplete = currentStep >= recipe.steps.length;
  const progress = (currentStep / recipe.steps.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border/50 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold">{recipe.name}</h1>
            <p className="text-sm text-muted-foreground">
              שלב {Math.min(currentStep, recipe.steps.length)} מתוך {recipe.steps.length}
            </p>
          </div>
          <span className="text-3xl">{recipe.emoji}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full gradient-primary transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.text}
            isBot={msg.isBot}
          />
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Action Button */}
      <div className="p-4 border-t border-border/50 bg-card">
        {!isComplete ? (
          <Button onClick={handleNext} size="xl" className="w-full">
            {currentStep === 0 ? 'בואו נתחיל!' : 'הבא'}
            <ArrowLeft className="w-5 h-5" />
          </Button>
        ) : (
          <Button onClick={handleComplete} size="xl" variant="savings" className="w-full">
            <Check className="w-5 h-5" />
            סיימתי לבשל!
          </Button>
        )}
      </div>
    </div>
  );
};

export default CookingAssistant;
