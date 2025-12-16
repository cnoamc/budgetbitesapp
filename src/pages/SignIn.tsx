import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone, Apple } from 'lucide-react';
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

type AuthView = 'options' | 'email';

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF6B95', '#FF9A56', '#FFB347', '#27AE60', '#2F80ED']
  });
  
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
  const { updateProfile } = useApp();
  
  const [view, setView] = useState<AuthView>('options');
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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

  useEffect(() => {
    if (user && !loading) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      if (!isLogin) {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('המייל הזה כבר רשום במערכת');
          } else {
            toast.error(error.message);
          }
        } else {
          if (onboardingData) {
            await updateProfile({
              monthlySpending: onboardingData.monthlySpending,
              weeklyOrders: onboardingData.weeklyOrders,
              preferredFood: onboardingData.preferredFood,
              cookingSkill: onboardingData.cookingSkill,
              onboardingComplete: true,
            });
            localStorage.removeItem('bb_onboarding_data');
          }
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

  const handleSocialLogin = (provider: string) => {
    toast.info(`התחברות עם ${provider} תהיה זמינה בקרוב`);
  };

  if (loading) {
    return (
      <div 
        className="h-[100dvh] flex items-center justify-center" 
        style={{ background: 'linear-gradient(165deg, #F7F8FF 0%, #FFF2E9 45%, #ECFFF4 100%)' }}
      >
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-glow animate-pulse">
          <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] relative overflow-hidden flex flex-col" dir="rtl">
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
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-8 pb-6">
        {/* Back button */}
        <button 
          onClick={() => view === 'email' ? setView('options') : navigate('/')} 
          className="self-start mb-4 p-2 -mr-2 rounded-full hover:bg-card/50 transition-colors"
        >
          <ArrowRight className="w-6 h-6 text-foreground/70" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl overflow-hidden shadow-glow">
            <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {view === 'options' ? 'בואו נתחיל!' : (isLogin ? 'התחברות' : 'יצירת חשבון')}
          </h1>
          <p className="text-muted-foreground text-sm">
            {view === 'options' ? 'בחר איך להתחבר' : 'הכנס את הפרטים שלך'}
          </p>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          {view === 'options' ? (
            <div className="space-y-3 animate-fade-in">
              {/* Phone option */}
              <Button
                onClick={() => handleSocialLogin('טלפון')}
                variant="outline"
                className="w-full h-14 rounded-2xl text-base font-medium bg-white/70 backdrop-blur-sm border-border/50 hover:bg-white/90 transition-all"
              >
                <Phone className="w-5 h-5 ml-3" />
                המשך עם מספר טלפון
              </Button>

              {/* Google option */}
              <Button
                onClick={() => handleSocialLogin('Google')}
                variant="outline"
                className="w-full h-14 rounded-2xl text-base font-medium bg-white/70 backdrop-blur-sm border-border/50 hover:bg-white/90 transition-all"
              >
                <svg className="w-5 h-5 ml-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                המשך עם Google
              </Button>

              {/* Apple option */}
              <Button
                onClick={() => handleSocialLogin('Apple')}
                variant="outline"
                className="w-full h-14 rounded-2xl text-base font-medium bg-white/70 backdrop-blur-sm border-border/50 hover:bg-white/90 transition-all"
              >
                <Apple className="w-5 h-5 ml-3" />
                המשך עם Apple
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-border/50" />
                <span className="text-xs text-muted-foreground">או</span>
                <div className="flex-1 h-px bg-border/50" />
              </div>

              {/* Email option */}
              <Button
                onClick={() => setView('email')}
                className="w-full h-14 rounded-2xl text-base font-medium bg-foreground text-background hover:bg-foreground/90 transition-all"
              >
                <Mail className="w-5 h-5 ml-3" />
                המשך עם אימייל
              </Button>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fade-in">
              <div 
                className="p-5 rounded-3xl space-y-4" 
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
                    isLogin ? 'התחברות' : 'הרשמה'
                  )}
                </Button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isLogin ? 'אין לך חשבון? הירשם' : 'כבר יש לך חשבון? התחבר'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Bottom login link for options view */}
        {view === 'options' && (
          <div className="text-center pt-4">
            <button
              onClick={() => {
                setIsLogin(true);
                setView('email');
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              כבר יש לך חשבון? <span className="font-semibold text-foreground">התחבר</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignIn;
