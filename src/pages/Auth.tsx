import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { IconOrbit } from '@/components/auth/IconOrbit';
import { AuthBottomSheet } from '@/components/auth/AuthBottomSheet';
import appIcon from '@/assets/app-icon.png';

const emailSchema = z.string().email('כתובת אימייל לא תקינה');
const passwordSchema = z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים');

type AuthView = 'welcome' | 'email-form';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, signIn, user, loading } = useAuth();
  const [view, setView] = useState<AuthView>('welcome');
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('אימייל או סיסמה שגויים');
          } else {
            toast.error('שגיאה בהתחברות, נסה שוב');
          }
          return;
        }
        toast.success('התחברת בהצלחה! 🎉');
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('האימייל הזה כבר רשום במערכת');
          } else {
            toast.error('שגיאה בהרשמה, נסה שוב');
          }
          return;
        }
        toast.success('נרשמת בהצלחה! 🎉');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestContinue = () => {
    navigate('/onboarding');
  };

  const handleGoogleClick = () => {
    toast.info('התחברות עם גוגל תהיה זמינה בקרוב');
  };

  const handleAppleClick = () => {
    toast.info('התחברות עם Apple תהיה זמינה בקרוב');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-[#4A90D9] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Welcome screen with bottom sheet
  if (view === 'welcome') {
    return (
      <AuthBackground>
        {/* Top content area */}
        <div className="flex-1 flex flex-col pt-12 pb-8 px-6">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            {/* App icon with sparkle */}
            <div className="relative inline-block mb-5">
              <div 
                className="w-20 h-20 rounded-[22px] overflow-hidden"
                style={{ boxShadow: '0 8px 24px -8px rgba(0, 0, 0, 0.15)' }}
              >
                <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
              </div>
              <div 
                className="absolute -top-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center"
                style={{ boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.15)' }}
              >
                <Sparkles className="w-4 h-4 text-[#4A90D9]" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-[#1D1D1F] mb-2">BudgetBites</h1>
            <p className="text-lg text-[#86868B]">
              מתחילים לבשל. מתחילים לחסוך.
            </p>
          </div>

          {/* Icon orbit */}
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <IconOrbit />
          </div>
        </div>

        {/* Bottom sheet */}
        <AuthBottomSheet
          onEmailClick={() => {
            setIsLogin(false);
            setView('email-form');
          }}
          onGoogleClick={handleGoogleClick}
          onAppleClick={handleAppleClick}
          onGuestClick={handleGuestContinue}
          onLoginClick={() => {
            setIsLogin(true);
            setView('email-form');
          }}
        />
      </AuthBackground>
    );
  }

  // Email form screen
  return (
    <AuthBackground>
      <div className="flex-1 flex flex-col p-6 pt-12">
        {/* Back button */}
        <button
          onClick={() => setView('welcome')}
          className="w-11 h-11 rounded-full flex items-center justify-center mb-8 transition-all active:scale-95"
          style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 12px -4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <ArrowRight className="w-5 h-5 text-[#1D1D1F]" />
        </button>

        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div 
              className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4"
              style={{ boxShadow: '0 6px 20px -6px rgba(0, 0, 0, 0.15)' }}
            >
              <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-[#1D1D1F] mb-2">
              {isLogin ? 'שמחים לראות אותך! 👋' : 'יצירת חשבון'}
            </h1>
            <p className="text-[#86868B]">
              {isLogin ? 'התחבר לחשבון שלך' : 'הירשם כדי לשמור את ההתקדמות'}
            </p>
          </div>

          {/* Form Card */}
          <div 
            className="rounded-3xl p-6 animate-slide-up"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
                  <Input
                    type="email"
                    placeholder="אימייל"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className="h-14 pr-12 rounded-2xl border-2 border-[#E5E5EA] bg-white/60 focus:border-[#4A90D9] focus:ring-0 transition-colors text-base"
                    dir="ltr"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 pr-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868B]" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="סיסמה"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    className="h-14 pr-12 pl-12 rounded-2xl border-2 border-[#E5E5EA] bg-white/60 focus:border-[#4A90D9] focus:ring-0 transition-colors text-base"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#1D1D1F] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 pr-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl text-base font-medium transition-all active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #4A90D9 0%, #357ABD 100%)',
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'התחבר' : 'הירשם'}
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Toggle */}
            <div className="text-center mt-6 pt-6 border-t border-[#E5E5EA]/50">
              <p className="text-[#86868B] text-sm">
                {isLogin ? 'עדיין אין לך חשבון?' : 'כבר יש לך חשבון?'}
              </p>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-[#4A90D9] font-medium hover:underline mt-1"
              >
                {isLogin ? 'הירשם עכשיו' : 'התחבר'}
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div 
            className="mt-6 rounded-2xl p-5 animate-fade-in"
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <h3 className="font-medium mb-3 text-center text-sm text-[#1D1D1F]">למה להירשם? 🤔</h3>
            <ul className="space-y-2 text-sm text-[#86868B]">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                שמירת ההתקדמות שלך בין מכשירים
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                מעקב אחרי החיסכון האמיתי שלך
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                המלצות מותאמות אישית
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AuthBackground>
  );
};

export default Auth;