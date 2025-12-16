import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ProgressBar';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import chefIcon from '@/assets/chef-icon.png';

const TOTAL_STEPS = 5;

const foodOptions = [
  { id: 'burgers', label: 'המבורגרים', emoji: '🍔' },
  { id: 'pasta', label: 'פסטות', emoji: '🍝' },
  { id: 'pizza', label: 'פיצה', emoji: '🍕' },
  { id: 'asian', label: 'אסייתי', emoji: '🍜' },
  { id: 'home', label: 'אוכל ביתי', emoji: '🍲' },
];

const skillLabels = ['אפס', 'מתחיל', 'בסיסי', 'לא רע', 'שף'];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile, completeOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    monthlySpending: 0,
    weeklyOrders: 0,
    preferredFood: [] as string[],
    cookingSkill: 1,
  });

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      localStorage.setItem('bb_onboarding_data', JSON.stringify(formData));
      updateProfile(formData);
      completeOnboarding();
      navigate('/loading');
    }
  };

  const toggleFood = (food: string) => {
    setFormData(prev => ({
      ...prev,
      preferredFood: prev.preferredFood.includes(food)
        ? prev.preferredFood.filter(f => f !== food)
        : [...prev.preferredFood, food],
    }));
  };

  const spendingOptions = [500, 1000, 1500, 2000, 2500, 3000];
  const orderOptions = [2, 4, 6, 8, 10];

  const canProceed = () => {
    switch (step) {
      case 1: return formData.monthlySpending > 0;
      case 2: return formData.weeklyOrders > 0;
      case 3: return formData.preferredFood.length > 0;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full px-5 pt-6">
        {/* Header - compact */}
        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-xl mx-auto overflow-hidden mb-2 shadow-glow">
            <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-lg font-bold">BudgetBites</h1>
        </div>

        <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} className="mb-4" />

        {/* Step Content - flex grow to fill space */}
        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center">
                כמה אתה מוציא על אוכל בחוץ בחודש?
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {spendingOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setFormData({ ...formData, monthlySpending: amount })}
                    className={cn(
                      "py-3 px-2 rounded-xl border-2 transition-all duration-200",
                      formData.monthlySpending === amount
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-base font-bold">₪{amount.toLocaleString()}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setFormData({ ...formData, monthlySpending: 4000 })}
                className={cn(
                  "w-full py-3 rounded-xl border-2 transition-all duration-200",
                  formData.monthlySpending === 4000
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <span className="text-base font-bold">יותר מ-₪3,000</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center">
                כמה פעמים בשבוע אתה מזמין משלוח?
              </h2>
              <div className="grid grid-cols-5 gap-2">
                {orderOptions.map((count) => (
                  <button
                    key={count}
                    onClick={() => setFormData({ ...formData, weeklyOrders: count })}
                    className={cn(
                      "py-3 rounded-xl border-2 transition-all duration-200",
                      formData.weeklyOrders === count
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-xl font-bold">{count}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center">
                מה אתה בדרך כלל מזמין?
              </h2>
              <p className="text-center text-muted-foreground text-xs">אפשר לבחור כמה</p>
              <div className="grid grid-cols-3 gap-2">
                {foodOptions.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => toggleFood(food.id)}
                    className={cn(
                      "py-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1",
                      formData.preferredFood.includes(food.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-2xl">{food.emoji}</span>
                    <span className="text-xs font-medium">{food.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-center">
                האם אתה יודע לבשל?
              </h2>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFormData({ ...formData, cookingSkill: level })}
                    className={cn(
                      "w-full py-3 px-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3",
                      formData.cookingSkill === level
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-2.5 h-2.5 rounded-full",
                            i < level ? "gradient-primary" : "bg-muted"
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

          {step === 5 && (
            <div className="space-y-4 text-center">
              <div className="text-5xl">🎉</div>
              <h2 className="text-xl font-semibold">מעולה! סיימנו!</h2>
              <p className="text-muted-foreground text-sm">
                עכשיו נראה לך כמה כסף אתה יכול לחסוך
                <br />
                אם תתחיל לבשל במקום להזמין
              </p>
            </div>
          )}
        </div>

        {/* Navigation - at bottom */}
        <div className="py-5">
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            size="xl"
            className="w-full"
          >
            {step === TOTAL_STEPS ? 'בואו נראה!' : 'המשך'}
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
