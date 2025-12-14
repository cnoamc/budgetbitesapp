import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Lock, ArrowLeft, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';
import { GradientBackground } from '@/components/auth/GradientBackground';
import { IconOrbit } from '@/components/auth/IconOrbit';
import { AuthBottomSheet } from '@/components/auth/AuthBottomSheet';

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
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Welcome screen with bottom sheet
  if (view === 'welcome') {
    return (
      <GradientBackground>
        <div className="min-h-screen flex flex-col pt-16 pb-96">
          {/* Header */}
          <div className="text-center px-6">
            {/* App icon with sparkle */}
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 rounded-[22px] bg-gradient-to-br from-primary to-primary/80 shadow-xl flex items-center justify-center">
                <ChefHat className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">BudgetBites</h1>
            <p className="text-lg text-muted-foreground">
              מתחילים לבשל. מתחילים לחסוך.
            </p>
          </div>

          {/* Icon orbit */}
          <div className="flex-1 flex items-center justify-center py-8">
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
      </GradientBackground>
    );
  }

  // Email form screen
  return (
    <GradientBackground>
      <div className="min-h-screen p-6 flex flex-col">
        {/* Back button */}
        <button
          onClick={() => setView('welcome')}
          className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center mb-6 transition-transform active:scale-95"
        >
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>

        <div className="max-w-lg mx-auto w-full flex-1 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg mx-auto flex items-center justify-center mb-4">
              <ChefHat className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {isLogin ? 'שמחים לראות אותך! 👋' : 'יצירת חשבון'}
            </h1>
            <p className="text-muted-foreground">
              {isLogin ? 'התחבר לחשבון שלך' : 'הירשם כדי לשמור את ההתקדמות'}
            </p>
          </div>

          {/* Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="אימייל"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className="h-14 pr-12 rounded-2xl border-2 bg-white/50 focus:bg-white transition-colors"
                    dir="ltr"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive pr-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="סיסמה"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    className="h-14 pr-12 pl-12 rounded-2xl border-2 bg-white/50 focus:bg-white transition-colors"
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
                {errors.password && (
                  <p className="text-sm text-destructive pr-1">{errors.password}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-2xl text-base font-medium transition-all active:scale-[0.98]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'התחבר' : 'הירשם'}
                    <ArrowLeft className="w-5 h-5 mr-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Toggle */}
            <div className="text-center mt-6 pt-6 border-t border-border/50">
              <p className="text-muted-foreground text-sm">
                {isLogin ? 'עדיין אין לך חשבון?' : 'כבר יש לך חשבון?'}
              </p>
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-primary font-medium hover:underline mt-1"
              >
                {isLogin ? 'הירשם עכשיו' : 'התחבר'}
              </button>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/50">
            <h3 className="font-medium mb-3 text-center text-sm">למה להירשם? 🤔</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="text-savings">✓</span>
                שמירת ההתקדמות שלך בין מכשירים
              </li>
              <li className="flex items-center gap-2">
                <span className="text-savings">✓</span>
                מעקב אחרי החיסכון האמיתי שלך
              </li>
              <li className="flex items-center gap-2">
                <span className="text-savings">✓</span>
                המלצות מותאמות אישית
              </li>
            </ul>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
};

export default Auth;
