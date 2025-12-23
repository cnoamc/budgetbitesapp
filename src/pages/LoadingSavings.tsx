import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Unlock, TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import appIcon from '@/assets/app-icon.png';

const getSavingsContext = (yearlySavings: number): string => {
  if (yearlySavings < 1500) return 'מספיק לארוחה חגיגית או בילוי קטן 🎉';
  if (yearlySavings < 4000) return 'יכול לממן חופשה קצרה בארץ 🏖️';
  if (yearlySavings < 8000) return 'חופשה משפחתית רצינית ✈️';
  return 'זה כבר חיסכון משמעותי לשנה 💸🔥';
};

const LoadingSavings: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'loading' | 'reveal'>('loading');
  const [progressAnimated, setProgressAnimated] = useState(false);
  const [countedMonthly, setCountedMonthly] = useState(0);
  const [countedYearly, setCountedYearly] = useState(0);
  const [showButton, setShowButton] = useState(false);

  // Get onboarding data
  const getOnboardingData = () => {
    const stored = localStorage.getItem('bb_onboarding_data');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  };

  const onboardingData = getOnboardingData();
  
  const AVG_DELIVERY_COST = 55;
  const AVG_HOME_COST = 10;
  const SAVINGS_PER_MEAL = AVG_DELIVERY_COST - AVG_HOME_COST;
  
  const weeklyOrders = onboardingData?.weeklyOrders || 4;
  const monthlySpending = onboardingData?.monthlySpending || 1000;
  const monthlyOrders = weeklyOrders * 4;
  
  const monthlySavings = monthlyOrders * SAVINGS_PER_MEAL;
  const yearlySavings = monthlySavings * 12;
  const savingsPercentage = monthlySpending > 0 ? Math.round((monthlySavings / monthlySpending) * 100) : 0;
  const savingsProgress = Math.min((yearlySavings / 20000) * 100, 100);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setPhase('reveal');
    }, 1500);

    return () => clearTimeout(loadingTimer);
  }, []);

  useEffect(() => {
    if (phase === 'reveal') {
      setTimeout(() => setProgressAnimated(true), 200);
      
      const duration = 1200;
      const steps = 30;
      const monthlyIncrement = monthlySavings / steps;
      const yearlyIncrement = yearlySavings / steps;
      
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setCountedMonthly(Math.min(Math.round(monthlyIncrement * step), monthlySavings));
        setCountedYearly(Math.min(Math.round(yearlyIncrement * step), yearlySavings));
        
        if (step >= steps) {
          clearInterval(interval);
          setTimeout(() => setShowButton(true), 500);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [phase, monthlySavings, yearlySavings]);

  return (
    <div className="h-[100dvh] relative overflow-hidden flex flex-col" dir="rtl">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500" />
      
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 w-full">
        <div className="w-full max-w-sm">
          {/* App icon with pulse animation */}
          <div className="flex justify-center mb-8">
            <div 
              className={`w-24 h-24 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20 transition-all duration-700 ${
                phase === 'loading' ? 'animate-pulse scale-100' : 'scale-110'
              }`}
            >
              <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
            </div>
          </div>

          {phase === 'loading' && (
            <div className="text-center animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-2">מחשבים את החיסכון שלך...</h2>
              <div className="flex justify-center gap-1.5 mt-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full bg-white animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {phase === 'reveal' && (
            <div className="w-full p-6 rounded-3xl bg-white shadow-2xl animate-scale-in">
              {/* Header */}
              <div className="flex items-center justify-center gap-2 mb-5">
                <Unlock className="w-5 h-5 text-blue-600" />
                <p className="text-base font-semibold text-gray-900">החיסכון שמחכה לך</p>
              </div>

              {/* Progress bar */}
              <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-5">
                <div 
                  className="absolute inset-y-0 right-0 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: progressAnimated ? `${savingsProgress}%` : '0%',
                    background: 'linear-gradient(90deg, #3B82F6 0%, #22C55E 100%)'
                  }}
                />
              </div>

              {/* Savings amounts */}
              <div className="flex justify-between items-start mb-4">
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    <p className="text-xs text-gray-500">חודשי</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">₪{countedMonthly.toLocaleString()}</p>
                </div>
                
                <div className="w-px h-14 bg-gray-200 mx-3" />
                
                <div className="text-center flex-1">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                    <p className="text-xs text-gray-500">שנתי</p>
                  </div>
                  <p className="text-3xl font-bold text-green-600">₪{countedYearly.toLocaleString()}</p>
                </div>
              </div>

              {/* Percentage badge */}
              {savingsPercentage > 0 && (
                <div className="flex justify-center mb-3">
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                    <span className="text-white text-sm font-bold">{savingsPercentage}%</span>
                    <span className="text-white/90 text-xs">חיסכון מההוצאה הנוכחית</span>
                  </div>
                </div>
              )}

              {/* Context message */}
              <div className="text-center py-2.5 px-4 rounded-xl bg-green-50">
                <p className="text-sm text-gray-700">{getSavingsContext(yearlySavings)}</p>
              </div>
            </div>
          )}

          {/* CTA Button */}
          {showButton && (
            <div className="mt-6 animate-fade-in">
              <Button
                onClick={() => navigate('/signin')}
                className="w-full h-14 rounded-2xl text-base font-semibold bg-white text-blue-600 hover:bg-white/90 transition-all active:scale-[0.98] shadow-xl"
              >
                לחסוך עוד היום
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingSavings;
