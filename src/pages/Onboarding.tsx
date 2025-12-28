import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import appIcon from '@/assets/app-icon.png';

type Goal = 'learn' | 'save' | 'recipes' | 'improve' | null;

const goalOptions = [
  { id: 'learn' as Goal, label: 'ללמוד לבשל', emoji: '👨‍🍳', description: 'אני מתחיל ורוצה ללמוד מאפס' },
  { id: 'save' as Goal, label: 'לחסוך כסף', emoji: '💰', description: 'לצמצם הזמנות ולבשל בבית' },
  { id: 'recipes' as Goal, label: 'מתכונים חדשים', emoji: '📖', description: 'אני מחפש רעיונות והשראה' },
  { id: 'improve' as Goal, label: 'לשפר מיומנות', emoji: '⭐', description: 'אני יודע לבשל ורוצה להתקדם' },
];

const foodOptions = [
  { id: 'burgers', label: 'המבורגרים', emoji: '🍔' },
  { id: 'pasta', label: 'פסטות', emoji: '🍝' },
  { id: 'pizza', label: 'פיצה', emoji: '🍕' },
  { id: 'asian', label: 'אסייתי', emoji: '🍜' },
  { id: 'home', label: 'אוכל ביתי', emoji: '🍲' },
  { id: 'sushi', label: 'סושי', emoji: '🍣' },
  { id: 'salads', label: 'סלטים', emoji: '🥗' },
  { id: 'desserts', label: 'קינוחים', emoji: '🍰' },
  { id: 'meat', label: 'בשרים', emoji: '🥩' },
  { id: 'seafood', label: 'פירות ים', emoji: '🦐' },
];

const skillLabels = ['אפס', 'מתחיל', 'בסיסי', 'לא רע', 'שף'];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile, completeOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    goal: null as Goal,
    cookingSkill: 1,
    monthlySpending: 0,
    weeklyOrders: 0,
    preferredFood: [] as string[],
  });

  const getFlowSteps = (goal: Goal): string[] => {
    switch (goal) {
      case 'learn':
        return ['goal', 'skill', 'food', 'spending', 'orders', 'done'];
      case 'save':
        return ['goal', 'spending', 'orders', 'skill', 'food', 'done'];
      case 'recipes':
        return ['goal', 'skill', 'food', 'benefits', 'done'];
      case 'improve':
        return ['goal', 'skill', 'food', 'benefits', 'done'];
      default:
        return ['goal'];
    }
  };

  const flowSteps = useMemo(() => getFlowSteps(formData.goal), [formData.goal]);
  const currentStepType = flowSteps[step - 1];
  const totalSteps = flowSteps.filter(s => s !== 'done').length;

  const spendingOptions = [500, 1000, 1500, 2000, 2500, 3000];
  const orderOptions = [1, 2, 4, 6, 8, 10];

  const toggleFood = (food: string) => {
    setFormData(prev => ({
      ...prev,
      preferredFood: prev.preferredFood.includes(food)
        ? prev.preferredFood.filter(f => f !== food)
        : [...prev.preferredFood, food],
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      const finalData = {
        ...formData,
        monthlySpending: formData.monthlySpending || 1000,
        weeklyOrders: formData.weeklyOrders || 2,
        preferredFood: formData.preferredFood.length ? formData.preferredFood : ['home'],
      };
      localStorage.setItem('bb_onboarding_data', JSON.stringify(finalData));
      updateProfile(finalData);
      completeOnboarding();
      
      if (formData.goal === 'recipes' || formData.goal === 'improve') {
        navigate('/signin');
      } else {
        navigate('/loading');
      }
    }
  };

  const canProceed = () => {
    switch (currentStepType) {
      case 'goal': return formData.goal !== null;
      case 'skill': return true;
      case 'spending': return formData.monthlySpending > 0;
      case 'orders': return formData.weeklyOrders > 0;
      case 'food': return formData.preferredFood.length > 0;
      case 'benefits': return true;
      default: return false;
    }
  };

  const getButtonText = () => {
    if (currentStepType === 'done') return 'בואו נתחיל!';
    return 'המשך';
  };

  const getDoneMessage = () => {
    switch (formData.goal) {
      case 'learn':
        return { emoji: '👨‍🍳', title: 'מעולה! נלמד יחד!', subtitle: 'נראה לך מתכונים פשוטים ונלווה אותך צעד אחר צעד' };
      case 'save':
        return { emoji: '💰', title: 'מעולה! סיימנו!', subtitle: 'עכשיו נראה לך כמה כסף אתה יכול לחסוך' };
      case 'recipes':
        return { emoji: '📖', title: 'מושלם!', subtitle: 'יש לנו המון מתכונים מדהימים בשבילך' };
      case 'improve':
        return { emoji: '⭐', title: 'נהדר!', subtitle: 'נעזור לך להתקדם עם מתכונים מאתגרים יותר' };
      default:
        return { emoji: '🎉', title: 'מעולה!', subtitle: 'בואו נתחיל' };
    }
  };

  return (
    <div className="h-[100dvh] relative overflow-hidden flex flex-col" dir="rtl">
      {/* Blue gradient background */}
      <div 
        className="fixed inset-0" 
        style={{ background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)' }} 
      />

      <div className="relative z-10 flex-1 flex flex-col max-w-lg mx-auto w-full px-5 pt-6">
        {/* Header */}
        <div className="text-center mb-4">
          <div 
            className="w-14 h-14 rounded-[16px] mx-auto overflow-hidden mb-2"
            style={{ boxShadow: '0 8px 24px -8px rgba(0, 0, 0, 0.3)' }}
          >
            <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
          </div>
          <p className="text-sm font-medium text-white/70 tracking-[0.15em] uppercase">BUDGETBITES</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                i < step ? "bg-white" : "bg-white/30"
              )}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="flex-1 flex flex-col justify-center animate-fade-in" key={currentStepType}>
          
          {/* Step 1: Goal Selection */}
          {currentStepType === 'goal' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center text-white">מה המטרה שלך? 🎯</h2>
              <p className="text-center text-white/70 text-sm">בחר את הסיבה העיקרית שלך להשתמש באפליקציה</p>
              <div className="space-y-3 mt-6">
                {goalOptions.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setFormData({ ...formData, goal: goal.id })}
                    className={cn(
                      "w-full py-4 px-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 active:scale-[0.98]",
                      formData.goal === goal.id
                        ? "border-white bg-white text-[#2196F3] scale-[1.01] shadow-lg"
                        : "border-white/30 hover:border-white/50 hover:scale-[1.01] text-white bg-white/10 backdrop-blur-sm"
                    )}
                  >
                    <span className="text-3xl">{goal.emoji}</span>
                    <div className="text-right flex-1">
                      <span className="text-base font-semibold block">{goal.label}</span>
                      <span className={cn("text-xs", formData.goal === goal.id ? "text-[#2196F3]/70" : "text-white/60")}>{goal.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cooking Skill */}
          {currentStepType === 'skill' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center text-white">מה רמת הבישול שלך? 👨‍🍳</h2>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFormData({ ...formData, cookingSkill: level })}
                    className={cn(
                      "w-full py-3 px-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 active:scale-[0.98]",
                      formData.cookingSkill === level
                        ? "border-white bg-white text-[#2196F3] scale-[1.01] shadow-md"
                        : "border-white/30 hover:border-white/50 hover:scale-[1.01] text-white bg-white/10 backdrop-blur-sm"
                    )}
                  >
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-2.5 h-2.5 rounded-full transition-all duration-200",
                            i < level 
                              ? formData.cookingSkill === level ? "bg-[#2196F3]" : "bg-white" 
                              : formData.cookingSkill === level ? "bg-[#2196F3]/30" : "bg-white/30"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{skillLabels[level - 1]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Monthly Spending */}
          {currentStepType === 'spending' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center text-white">כמה אתה מוציא על אוכל בחוץ בחודש? 💸</h2>
              <div className="grid grid-cols-3 gap-2">
                {spendingOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setFormData({ ...formData, monthlySpending: amount })}
                    className={cn(
                      "py-3 px-2 rounded-xl border-2 transition-all duration-200 active:scale-95",
                      formData.monthlySpending === amount
                        ? "border-white bg-white text-[#2196F3] scale-[1.02] shadow-md"
                        : "border-white/30 hover:border-white/50 hover:scale-[1.02] text-white bg-white/10 backdrop-blur-sm"
                    )}
                  >
                    <span className="text-base font-bold">₪{amount.toLocaleString()}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setFormData({ ...formData, monthlySpending: 4000 })}
                className={cn(
                  "w-full py-3 rounded-xl border-2 transition-all duration-200 active:scale-95",
                  formData.monthlySpending === 4000
                    ? "border-white bg-white text-[#2196F3] scale-[1.02] shadow-md"
                    : "border-white/30 hover:border-white/50 hover:scale-[1.02] text-white bg-white/10 backdrop-blur-sm"
                )}
              >
                <span className="text-base font-bold">יותר מ-₪3,000</span>
              </button>
            </div>
          )}

          {/* Weekly Orders */}
          {currentStepType === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center text-white">כמה פעמים בשבוע אתה מזמין משלוח? 🛵</h2>
              <div className="grid grid-cols-3 gap-2">
                {orderOptions.map((count) => (
                  <button
                    key={count}
                    onClick={() => setFormData({ ...formData, weeklyOrders: count })}
                    className={cn(
                      "py-3 rounded-xl border-2 transition-all duration-200 active:scale-95",
                      formData.weeklyOrders === count
                        ? "border-white bg-white text-[#2196F3] scale-[1.02] shadow-md"
                        : "border-white/30 hover:border-white/50 hover:scale-[1.02] text-white bg-white/10 backdrop-blur-sm"
                    )}
                  >
                    <span className="text-xl font-bold">{count === 1 ? '1 או פחות' : count}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setFormData({ ...formData, weeklyOrders: 12 })}
                className={cn(
                  "w-full py-3 rounded-xl border-2 transition-all duration-200 active:scale-95",
                  formData.weeklyOrders === 12
                    ? "border-white bg-white text-[#2196F3] scale-[1.02] shadow-md"
                    : "border-white/30 hover:border-white/50 hover:scale-[1.02] text-white bg-white/10 backdrop-blur-sm"
                )}
              >
                <span className="text-base font-bold">יותר מ-10</span>
              </button>
            </div>
          )}

          {/* Food Preferences */}
          {currentStepType === 'food' && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center text-white">איזה סוג אוכל אתה אוהב? 🍽️</h2>
              <p className="text-center text-white/70 text-xs">אפשר לבחור כמה</p>
              <div className="grid grid-cols-3 gap-2">
                {foodOptions.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => toggleFood(food.id)}
                    className={cn(
                      "py-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 active:scale-95",
                      formData.preferredFood.includes(food.id)
                        ? "border-white bg-white text-[#2196F3] scale-[1.02] shadow-md"
                        : "border-white/30 hover:border-white/50 hover:scale-[1.02] text-white bg-white/10 backdrop-blur-sm"
                    )}
                  >
                    <span className="text-2xl">{food.emoji}</span>
                    <span className="text-xs font-medium">{food.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {currentStepType === 'benefits' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-center text-white">מה תקבל מאיתנו? ✨</h2>
              <p className="text-center text-white/70 text-sm">הנה למה שווה להצטרף</p>
              <div className="space-y-3 mt-4">
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="font-semibold text-white">חסוך זמן בתכנון</h3>
                      <p className="text-xs text-white/70">מתכונים מהירים עם רשימת קניות אוטומטית</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="font-semibold text-white">אתגרים שבועיים</h3>
                      <p className="text-xs text-white/70">צבור נקודות והישגים ותתחרה עם חברים</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-right">
                      <h3 className="font-semibold text-white">מתכונים בלעדיים</h3>
                      <p className="text-xs text-white/70">גישה למתכונים מקצועיים וטכניקות מתקדמות</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Done */}
          {currentStepType === 'done' && (
            <div className="space-y-4 text-center">
              <div className="text-5xl">{getDoneMessage().emoji}</div>
              <h2 className="text-xl font-semibold text-white">{getDoneMessage().title}</h2>
              <p className="text-white/70 text-sm">{getDoneMessage().subtitle}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="py-5">
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full h-[54px] rounded-full text-[17px] font-semibold bg-white text-[#2196F3] hover:bg-white/95 disabled:bg-white/50 disabled:text-[#2196F3]/50"
            style={{ boxShadow: '0 8px 24px -8px rgba(0, 0, 0, 0.2)' }}
          >
            {getButtonText()}
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
