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
import appIcon from '@/assets/app-icon.png';

const emailSchema = z.string().email('כתובת אימייל לא תקינה');
const passwordSchema = z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים');
const phoneSchema = z.string().regex(/^\+?[0-9]{10,15}$/, 'מספר טלפון לא תקין');

type AuthView = 'options' | 'email' | 'phone' | 'otp';

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#2196F3', '#00BCD4', '#4CAF50', '#FF9800', '#E91E63']
  });
  
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#2196F3', '#00BCD4', '#4CAF50']
    });
  }, 200);
  
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#FF9800', '#E91E63', '#4CAF50']
    });
  }, 400);
};

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, signInWithGoogle, signInWithPhone, verifyOtp, loading } = useAuth();
  const { updateProfile } = useApp();
  
  const [view, setView] = useState<AuthView>('options');
  const [isLogin, setIsLogin] = useState(false);
  const [isNewSignup, setIsNewSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+972');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; phone?: string; otp?: string }>({});
  const [resendTimer, setResendTimer] = useState(0);

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
      navigate(isNewSignup ? '/premium' : '/home');
    }
  }, [user, loading, navigate, isNewSignup]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const syncOnboardingData = async () => {
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
  };

  const validateEmailForm = (): boolean => {
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

  const validatePhone = (): boolean => {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      setErrors({ phone: result.error.errors[0].message });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailForm()) return;
    
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
          setIsNewSignup(true);
          await syncOnboardingData();
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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error('שגיאה בהתחברות עם Google');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhone()) return;
    
    setIsLoading(true);
    try {
      const { error } = await signInWithPhone(phone);
      if (error) {
        toast.error('שגיאה בשליחת SMS. נסה שוב.');
      } else {
        toast.success('קוד אימות נשלח לטלפון שלך');
        setView('otp');
        setResendTimer(60);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setErrors({ otp: 'הקוד חייב להכיל 6 ספרות' });
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await verifyOtp(phone, otp);
      if (error) {
        toast.error('קוד שגוי. נסה שוב.');
      } else {
        setIsNewSignup(true);
        await syncOnboardingData();
        triggerConfetti();
        toast.success('התחברת בהצלחה! 🎉');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setIsLoading(true);
    try {
      const { error } = await signInWithPhone(phone);
      if (error) {
        toast.error('שגיאה בשליחת SMS. נסה שוב.');
      } else {
        toast.success('קוד חדש נשלח');
        setResendTimer(60);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = () => {
    toast.info('התחברות עם Apple תהיה זמינה בקרוב');
  };

  if (loading) {
    return (
      <div 
        className="h-[100dvh] flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)' }}
      >
        <div className="w-16 h-16 rounded-2xl overflow-hidden animate-pulse">
          <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  const getBackAction = () => {
    if (view === 'otp') return () => setView('phone');
    if (view === 'email' || view === 'phone') return () => setView('options');
    return () => navigate('/');
  };

  const getTitle = () => {
    if (view === 'options') return 'בואו נתחיל!';
    if (view === 'phone') return 'התחברות עם טלפון';
    if (view === 'otp') return 'הזן קוד אימות';
    return isLogin ? 'התחברות' : 'יצירת חשבון';
  };

  const getSubtitle = () => {
    if (view === 'options') return 'בחר איך להתחבר';
    if (view === 'phone') return 'נשלח לך קוד אימות ב-SMS';
    if (view === 'otp') return `שלחנו קוד ל-${phone}`;
    return 'הכנס את הפרטים שלך';
  };

  return (
    <div className="h-[100dvh] relative overflow-hidden flex flex-col" dir="rtl">
      {/* Blue gradient background */}
      <div 
        className="fixed inset-0" 
        style={{ background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)' }} 
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-8 pb-6">
        {/* Back button */}
        <button 
          onClick={getBackAction()} 
          className="self-start mb-4 p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <ArrowRight className="w-6 h-6 text-white/80" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 animate-fade-in">
          <div 
            className="w-16 h-16 mx-auto mb-3 rounded-[20px] overflow-hidden"
            style={{ boxShadow: '0 8px 24px -8px rgba(0, 0, 0, 0.3)' }}
          >
            <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">{getTitle()}</h1>
          <p className="text-white/70 text-sm">{getSubtitle()}</p>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          {view === 'options' && (
            <div className="space-y-3 animate-fade-in">
              {/* Phone option */}
              <Button
                onClick={() => setView('phone')}
                variant="outline"
                className="w-full h-14 rounded-2xl text-base font-medium bg-white/15 backdrop-blur-sm border-white/30 text-white hover:bg-white/25 transition-all"
              >
                <Phone className="w-5 h-5 ml-3" />
                המשך עם מספר טלפון
              </Button>

              {/* Google option */}
              <Button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full h-14 rounded-2xl text-base font-medium bg-white/15 backdrop-blur-sm border-white/30 text-white hover:bg-white/25 transition-all"
              >
                <svg className="w-5 h-5 ml-3" viewBox="0 0 24 24">
                  <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                המשך עם Google
              </Button>

              {/* Apple option */}
              <Button
                onClick={handleAppleLogin}
                variant="outline"
                className="w-full h-14 rounded-2xl text-base font-medium bg-white/15 backdrop-blur-sm border-white/30 text-white hover:bg-white/25 transition-all"
              >
                <Apple className="w-5 h-5 ml-3" />
                המשך עם Apple
              </Button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-2">
                <div className="flex-1 h-px bg-white/30" />
                <span className="text-xs text-white/60">או</span>
                <div className="flex-1 h-px bg-white/30" />
              </div>

              {/* Email option */}
              <Button
                onClick={() => setView('email')}
                className="w-full h-14 rounded-2xl text-base font-medium bg-white text-[#2196F3] hover:bg-white/95 transition-all"
                style={{ boxShadow: '0 8px 24px -8px rgba(0, 0, 0, 0.2)' }}
              >
                <Mail className="w-5 h-5 ml-3" />
                המשך עם אימייל
              </Button>
            </div>
          )}

          {view === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4 animate-fade-in">
              <div className="p-5 rounded-3xl space-y-4 bg-white/15 backdrop-blur-sm border border-white/20">
                <div className="space-y-1">
                  <div className="relative">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                    <Input
                      type="tel"
                      placeholder="+972 50 123 4567"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setErrors(prev => ({ ...prev, phone: undefined }));
                      }}
                      className="h-14 pr-12 rounded-2xl border-0 bg-white/20 text-base px-5 text-white placeholder:text-white/50"
                      dir="ltr"
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-200 pr-1">{errors.phone}</p>}
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl text-base font-medium bg-white text-[#2196F3] hover:bg-white/95 transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#2196F3] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'שלח קוד אימות'
                  )}
                </Button>
              </div>
            </form>
          )}

          {view === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 animate-fade-in">
              <div className="p-5 rounded-3xl space-y-4 bg-white/15 backdrop-blur-sm border border-white/20">
                <div className="space-y-1">
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    value={otp}
                    maxLength={6}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setOtp(value);
                      setErrors(prev => ({ ...prev, otp: undefined }));
                    }}
                    className="h-16 rounded-2xl border-0 bg-white/20 text-2xl text-center tracking-[0.5em] font-mono text-white placeholder:text-white/50"
                    dir="ltr"
                  />
                  {errors.otp && <p className="text-sm text-red-200 text-center">{errors.otp}</p>}
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full h-14 rounded-2xl text-base font-medium bg-white text-[#2196F3] hover:bg-white/95 transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#2196F3] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'אימות'
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0}
                    className="text-sm text-white/70 hover:text-white transition-colors disabled:opacity-50"
                  >
                    {resendTimer > 0 ? `שלח שוב בעוד ${resendTimer} שניות` : 'שלח קוד חדש'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {view === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fade-in">
              <div className="p-5 rounded-3xl space-y-4 bg-white/15 backdrop-blur-sm border border-white/20">
                <div className="space-y-1">
                  <div className="relative">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                    <Input
                      type="email"
                      placeholder="האימייל שלך"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors(prev => ({ ...prev, email: undefined }));
                      }}
                      className="h-14 pr-12 rounded-2xl border-0 bg-white/20 text-base px-5 text-white placeholder:text-white/50"
                      dir="ltr"
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-200 pr-1">{errors.email}</p>}
                </div>

                <div className="space-y-1">
                  <div className="relative">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="סיסמה"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors(prev => ({ ...prev, password: undefined }));
                      }}
                      className="h-14 pr-12 pl-12 rounded-2xl border-0 bg-white/20 text-base px-5 text-white placeholder:text-white/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-200 pr-1">{errors.password}</p>}
                </div>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl text-base font-medium bg-white text-[#2196F3] hover:bg-white/95 transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-[#2196F3] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    isLogin ? 'התחברות' : 'הרשמה'
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {isLogin ? 'אין לך חשבון? ' : 'כבר יש לך חשבון? '}
                    <span className="font-semibold text-white">{isLogin ? 'הרשמה' : 'התחברות'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
