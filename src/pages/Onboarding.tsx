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
      // Save onboarding data to localStorage for use before signup
      localStorage.setItem('bb_onboarding_data', JSON.stringify(formData));
      
      // Also update profile context (will only persist to DB after auth)
      updateProfile(formData);
      completeOnboarding();
      navigate('/signin');
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

  const spendingOptions = [500, 1000, 1500, 2000, 3000];
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
    <div className="min-h-screen bg-background p-6 pb-24">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto overflow-hidden mb-4 shadow-glow animate-float">
            <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold mb-2">BudgetBites</h1>
          <p className="text-muted-foreground">בואו נלמד אותך לחסוך כסף ולבשל!</p>
        </div>

        <ProgressBar currentStep={step} totalSteps={TOTAL_STEPS} className="mb-8" />

        {/* Step Content */}
        <div className="animate-slide-up">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">
                כמה אתה מוציא בממוצע על אוכל בחוץ בחודש?
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {spendingOptions.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setFormData({ ...formData, monthlySpending: amount })}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-200",
                      formData.monthlySpending === amount
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-xl font-bold">₪{amount.toLocaleString()}</span>
                  </button>
                ))}
                <button
                  onClick={() => setFormData({ ...formData, monthlySpending: 4000 })}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all duration-200 col-span-2",
                    formData.monthlySpending === 4000
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-xl font-bold">יותר מ-₪3,000</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">
                כמה פעמים בשבוע אתה מזמין משלוח?
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {orderOptions.map((count) => (
                  <button
                    key={count}
                    onClick={() => setFormData({ ...formData, weeklyOrders: count })}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-200",
                      formData.weeklyOrders === count
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-2xl font-bold">{count}</span>
                    <p className="text-sm text-muted-foreground">פעמים</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">
                מה אתה בדרך כלל מזמין?
              </h2>
              <p className="text-center text-muted-foreground text-sm">אפשר לבחור כמה אפשרויות</p>
              <div className="grid grid-cols-2 gap-3">
                {foodOptions.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => toggleFood(food.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2",
                      formData.preferredFood.includes(food.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <span className="text-3xl">{food.emoji}</span>
                    <span className="font-medium">{food.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-center">
                האם אתה יודע לבשל?
              </h2>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFormData({ ...formData, cookingSkill: level })}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4",
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
                            "w-3 h-3 rounded-full",
                            i < level ? "gradient-primary" : "bg-muted"
                          )}
                        />
                      ))}
                    </div>
                    <span className="font-medium">{skillLabels[level - 1]}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 text-center">
              <div className="text-6xl animate-float">🎉</div>
              <h2 className="text-xl font-semibold">מעולה! סיימנו!</h2>
              <p className="text-muted-foreground">
                עכשיו נראה לך כמה כסף אתה יכול לחסוך
                <br />
                אם תתחיל לבשל במקום להזמין
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-lg mx-auto">
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
    </div>
  );
};

export default Onboarding;
