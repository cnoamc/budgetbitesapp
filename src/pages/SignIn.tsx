import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, TrendingUp, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { z } from 'zod';
import confetti from 'canvas-confetti';
import chefIcon from '@/assets/chef-icon.png';

const emailSchema = z.string().email('כתובת אימייל לא תקינה');
const passwordSchema = z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים');

type AuthView = 'signup' | 'login';

// Get contextual message based on yearly savings
const getSavingsContext = (yearlySavings: number): string => {
  if (yearlySavings < 1500) return 'מספיק לארוחה חגיגית או בילוי קטן 🎉';
  if (yearlySavings < 4000) return 'יכול לממן חופשה קצרה בארץ 🏖️';
  if (yearlySavings < 8000) return 'חופשה משפחתית רצינית ✈️';
  return 'זה כבר חיסכון משמעותי לשנה 💸🔥';
};

// Trigger confetti celebration
const triggerConfetti = () => {
  // First burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF6B95', '#FF9A56', '#FFB347', '#27AE60', '#2F80ED']
  });
  
  // Second burst with delay
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FF6B95', '#FF9A56', '#FFB347']
    });
  }, 200);
  
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#27AE60', '#2F80ED', '#FFB347']
    });
  }, 400);
};

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading } = useAuth();
  const { profile, updateProfile } = useApp();
  
  const [view, setView] = useState<AuthView>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [progressAnimated, setProgressAnimated] = useState(false);

  // Get onboarding data from localStorage (before signup) or from profile (after)
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
  
  // Calculate savings based on actual data
  // Average costs from our recipes: delivery ~₪55, home ~₪10
  const AVG_DELIVERY_COST = 55;
  const AVG_HOME_COST = 10;
  const SAVINGS_PER_MEAL = AVG_DELIVERY_COST - AVG_HOME_COST; // ₪45 per meal
  
  // Use onboarding data if available, otherwise fall back to profile
  const weeklyOrders = onboardingData?.weeklyOrders || profile?.weeklyOrders || 0;
  const monthlyOrders = weeklyOrders * 4;
  
  // Calculate monthly savings: (orders per month) × (savings per meal)
  const monthlySavings = monthlyOrders * SAVINGS_PER_MEAL;
  const yearlySavings = monthlySavings * 12;
  
  // Progress percentage (capped at 100%)
  const savingsProgress = Math.min((yearlySavings / 20000) * 100, 100);

  useEffect(() => {
    if (user && !loading) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  // Trigger progress animation after mount
  useEffect(() => {
    if (monthlySavings > 0) {
      const timer = setTimeout(() => setProgressAnimated(true), 300);
      return () => clearTimeout(timer);
    }
  }, [monthlySavings]);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      newErrors.email = emailResult.error.errors[0].message;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      newErrors.password = passwordResult.error.errors[0].message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      if (view === 'signup') {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('המייל הזה כבר רשום במערכת');
          } else {
            toast.error(error.message);
          }
        } else {
          // Success! Sync onboarding data to profile
          if (onboardingData) {
            await updateProfile({
              monthlySpending: onboardingData.monthlySpending,
              weeklyOrders: onboardingData.weeklyOrders,
              preferredFood: onboardingData.preferredFood,
              cookingSkill: onboardingData.cookingSkill,
              onboardingComplete: true,
            });
            // Clear localStorage after sync
            localStorage.removeItem('bb_onboarding_data');
          }
          // Trigger confetti celebration
          triggerConfetti();
          toast.success('נרשמת בהצלחה! 🎉');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('אימייל או סיסמה שגויים');
          } else {
            toast.error('שגיאה בהתחברות, נסה שוב');
          }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ background: 'linear-gradient(165deg, #F7F8FF 0%, #FFF2E9 45%, #ECFFF4 100%)' }}
      >
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-glow animate-icon-delight animate-glow-pulse">
          <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" dir="rtl">
      {/* Background */}
      <div 
        className="absolute inset-0" 
        style={{ background: 'linear-gradient(165deg, #F7F8FF 0%, #FFF2E9 45%, #ECFFF4 100%)' }} 
      />
      
      {/* Blurred blobs */}
      <div 
        className="absolute w-72 h-72 rounded-full blur-3xl opacity-25" 
        style={{ background: '#FFB088', top: '-10%', right: '-15%' }} 
      />
      <div 
        className="absolute w-56 h-56 rounded-full blur-3xl opacity-20" 
        style={{ background: '#88DDAA', bottom: '20%', left: '-10%' }} 
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-10 pb-8 overflow-y-auto">
        {/* Back button */}
        <button 
          onClick={() => navigate('/')} 
          className="self-start mb-4 p-2 -mr-2 rounded-full hover:bg-card/50 transition-colors"
        >
          <ArrowRight className="w-6 h-6 text-foreground/70" />
        </button>

        {/* Header */}
        <div className="text-center mb-4 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden shadow-glow animate-icon-delight-delayed">
            <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {view === 'signup' ? 'יצירת חשבון' : 'התחברות'}
          </h1>
          <p className="text-muted-foreground text-sm">
            {view === 'signup' ? 'מתחילים לבשל ולחסוך' : 'ברוכים השבים!'}
          </p>
        </div>

        {/* Savings Progress Indicator - show only on signup */}
        {view === 'signup' && monthlySavings > 0 && (
          <div 
            className="max-w-sm mx-auto w-full mb-5 p-5 rounded-3xl animate-fade-in"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.1)'
            }}
          >
            {/* Header with unlock icon */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Unlock className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium text-foreground">החיסכון שמחכה לך</p>
            </div>

            {/* Progress bar */}
            <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden mb-4">
              <div 
                className="absolute inset-y-0 right-0 rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: progressAnimated ? `${savingsProgress}%` : '0%',
                  background: 'linear-gradient(90deg, hsl(var(--primary)) 0%, #27AE60 100%)'
                }}
              />
              {/* Shimmer effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-l from-transparent via-white/30 to-transparent animate-pulse"
                style={{ animationDuration: '2s' }}
              />
            </div>

            {/* Savings amounts */}
            <div className="flex justify-between items-start mb-3">
              <div className="text-center flex-1">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                  <p className="text-xs text-muted-foreground">חודשי</p>
                </div>
                <p className="text-2xl font-bold text-primary">₪{monthlySavings.toLocaleString()}</p>
              </div>
              
              <div className="w-px h-12 bg-border/50 mx-3" />
              
              <div className="text-center flex-1">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  <p className="text-xs text-muted-foreground">שנתי</p>
                </div>
                <p className="text-2xl font-bold text-green-600">₪{yearlySavings.toLocaleString()}</p>
              </div>
            </div>

            {/* Contextual message */}
            <div 
              className="text-center py-2 px-3 rounded-xl"
              style={{ background: 'rgba(39, 174, 96, 0.08)' }}
            >
              <p className="text-xs text-foreground/80">{getSavingsContext(yearlySavings)}</p>
            </div>
          </div>
        )}
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto w-full animate-slide-up">
          <div 
            className="p-6 rounded-3xl space-y-4" 
            style={{
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 40px -12px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="space-y-1">
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="אימייל"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  className="h-14 pr-12 rounded-2xl border-0 bg-card/60 text-base px-5"
                  dir="ltr"
                />
              </div>
              {errors.email && <p className="text-sm text-destructive pr-1">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="סיסמה"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  className="h-14 pr-12 pl-12 rounded-2xl border-0 bg-card/60 text-base px-5"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive pr-1">{errors.password}</p>}
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl text-base font-medium bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : (
                view === 'signup' ? 'הרשמה' : 'התחברות'
              )}
            </Button>
          </div>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => {
                setView(view === 'signup' ? 'login' : 'signup');
                setErrors({});
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {view === 'signup' ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
