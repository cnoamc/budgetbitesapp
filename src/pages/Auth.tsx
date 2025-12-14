import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Apple, User, ArrowRight, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { EmojiOrbit } from '@/components/auth/EmojiOrbit';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().email('כתובת אימייל לא תקינה');
const passwordSchema = z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים');

type AuthView = 'welcome' | 'email-login' | 'email-signup';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading } = useAuth();
  const [view, setView] = useState<AuthView>('welcome');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      if (view === 'email-signup') {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('המייל הזה כבר רשום במערכת');
          } else {
            toast.error(error.message);
          }
        } else {
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

  const handleGuestContinue = () => {
    localStorage.setItem('bb_guest', 'true');
    navigate('/onboarding');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(165deg, #F7F8FF 0%, #FFF2E9 45%, #ECFFF4 100%)' }}>
        <div className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Email form view
  if (view === 'email-login' || view === 'email-signup') {
    return (
      <div className="min-h-screen relative overflow-hidden flex flex-col" dir="rtl">
        {/* Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(165deg, #F7F8FF 0%, #FFF2E9 45%, #ECFFF4 100%)'
          }}
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
        <div className="relative z-10 flex-1 flex flex-col px-6 pt-12 pb-8">
          {/* Back button */}
          <button
            onClick={() => setView('welcome')}
            className="self-start mb-8 p-2 -mr-2 rounded-full hover:bg-card/50 transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-foreground/70" />
          </button>

          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px -8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <span className="text-3xl">🍳</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {view === 'email-signup' ? 'יצירת חשבון' : 'התחברות'}
            </h1>
            <p className="text-muted-foreground">
              {view === 'email-signup' 
                ? 'מתחילים לבשל ולחסוך' 
                : 'ברוכים השבים!'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 max-w-sm mx-auto w-full animate-slide-up">
            <div
              className="p-6 rounded-3xl space-y-4"
              style={{
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 40px -12px rgba(0, 0, 0, 0.1)',
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
                      setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className="h-14 pr-12 rounded-2xl border-0 bg-card/60 text-base px-5"
                    dir="ltr"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive pr-1">{errors.email}</p>
                )}
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
                      setErrors((prev) => ({ ...prev, password: undefined }));
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
                {errors.password && (
                  <p className="text-sm text-destructive pr-1">{errors.password}</p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl text-base font-medium bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                ) : (
                  view === 'email-signup' ? 'הרשמה' : 'התחברות'
                )}
              </Button>
            </div>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setView(view === 'email-signup' ? 'email-login' : 'email-signup');
                  setErrors({});
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {view === 'email-signup' 
                  ? 'כבר יש לך חשבון? התחבר' 
                  : 'אין לך חשבון? הירשם'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Welcome view
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col" dir="rtl">
      {/* Background gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(165deg, #F7F8FF 0%, #FFF2E9 45%, #ECFFF4 100%)'
        }}
      />
      
      {/* Blurred blobs for depth */}
      <div 
        className="absolute w-80 h-80 rounded-full blur-3xl opacity-25"
        style={{ background: '#FFB088', top: '-8%', right: '-12%' }}
      />
      <div 
        className="absolute w-64 h-64 rounded-full blur-3xl opacity-20"
        style={{ background: '#88CCFF', top: '30%', left: '-18%' }}
      />
      <div 
        className="absolute w-72 h-72 rounded-full blur-3xl opacity-20"
        style={{ background: '#88DDAA', bottom: '25%', right: '-8%' }}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Top section */}
        <div className="pt-12 px-6 text-center animate-fade-in">
          {/* Glass pill with emoji */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 4px 24px -8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <span className="text-xl">🍳</span>
            <span className="font-semibold text-foreground">BudgetBites</span>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            מתחילים לבשל.
          </h1>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            מתחילים לחסוך.
          </h2>
        </div>

        {/* Emoji orbit */}
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          <EmojiOrbit />
          <p className="text-muted-foreground text-sm mt-6">
            כל ארוחה בבית = כסף שנשאר אצלך
          </p>
        </div>

        {/* Bottom sheet */}
        <div 
          className="animate-slide-up"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '32px 32px 0 0',
            boxShadow: '0 -12px 48px -16px rgba(0, 0, 0, 0.1)',
            maxHeight: '55vh',
          }}
        >
          {/* Drag indicator */}
          <div className="flex justify-center pt-3">
            <div className="w-10 h-1 bg-foreground/10 rounded-full" />
          </div>
          
          <div className="px-6 pb-8 pt-4 overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-5">
              <h3 className="text-xl font-bold text-foreground mb-1">נכנסים ומתחילים</h3>
              <p className="text-muted-foreground text-sm">
                תוך 20 שניות נחשב לך פוטנציאל חיסכון
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              {/* Email - Primary black */}
              <Button
                onClick={() => termsAccepted && setView('email-signup')}
                disabled={!termsAccepted}
                className="w-full h-14 rounded-2xl text-base font-medium transition-all active:scale-[0.98]"
                style={{
                  background: termsAccepted ? '#1D1D1F' : '#E5E5EA',
                  color: termsAccepted ? 'white' : '#8E8E93',
                }}
              >
                <Mail className="w-5 h-5 ml-2" />
                המשך עם אימייל
              </Button>

              {/* Google - Secondary outline */}
              <Button
                onClick={() => toast.info('התחברות עם Google תהיה זמינה בקרוב')}
                disabled={!termsAccepted}
                variant="outline"
                className="w-full h-14 rounded-2xl border-2 text-base font-medium transition-all active:scale-[0.98]"
                style={{
                  background: 'rgba(255, 255, 255, 0.6)',
                  borderColor: termsAccepted ? '#E5E5EA' : '#F2F2F7',
                  color: termsAccepted ? '#1D1D1F' : '#8E8E93',
                }}
              >
                <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                המשך עם Google
              </Button>

              {/* Apple & Guest - Half buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => toast.info('התחברות עם Apple תהיה זמינה בקרוב')}
                  disabled={!termsAccepted}
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl border-2 text-base font-medium transition-all active:scale-[0.98]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    borderColor: termsAccepted ? '#E5E5EA' : '#F2F2F7',
                    color: termsAccepted ? '#1D1D1F' : '#8E8E93',
                  }}
                >
                  <Apple className="w-5 h-5 ml-2" />
                  Apple
                </Button>
                <Button
                  onClick={handleGuestContinue}
                  variant="outline"
                  className="flex-1 h-14 rounded-2xl border-2 text-base font-medium transition-all active:scale-[0.98]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    borderColor: '#E5E5EA',
                    color: '#1D1D1F',
                  }}
                >
                  <User className="w-5 h-5 ml-2" />
                  אורח
                </Button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center justify-center gap-2 mt-5">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                className="data-[state=checked]:bg-foreground data-[state=checked]:border-foreground rounded-md"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                אני מסכים/ה לתנאי השימוש
              </label>
            </div>

            {/* Login link */}
            <div className="text-center mt-4">
              <button
                onClick={() => setView('email-login')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                כבר יש לך חשבון? <span className="font-medium text-foreground">התחבר</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
