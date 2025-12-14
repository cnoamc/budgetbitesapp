import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmojiOrbit } from '@/components/auth/EmojiOrbit';
import { PhoneSignupSheet } from '@/components/auth/PhoneSignupSheet';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';
import chefIcon from '@/assets/chef-icon.png';
const emailSchema = z.string().email('כתובת אימייל לא תקינה');
const passwordSchema = z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים');
type AuthView = 'welcome' | 'email-login' | 'email-signup';
const Auth: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    signIn,
    signUp,
    loading
  } = useAuth();
  const [view, setView] = useState<AuthView>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);
  const validateForm = (): boolean => {
    const newErrors: {
      email?: string;
      password?: string;
    } = {};
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
        const {
          error
        } = await signUp(email, password);
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
        const {
          error
        } = await signIn(email, password);
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
    setIsSheetOpen(false);
    navigate('/onboarding');
  };
  const handleEmailFromSheet = () => {
    setIsSheetOpen(false);
    setView('email-signup');
  };
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(165deg, #F7F8FF 0%, #FFF2E9 45%, #ECFFF4 100%)'
    }}>
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-glow animate-icon-delight animate-glow-pulse">
          <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
        </div>
      </div>;
  }

  // Email form view
  if (view === 'email-login' || view === 'email-signup') {
    return <div className="min-h-screen relative overflow-hidden flex flex-col" dir="rtl">
        {/* Background */}
        <div className="absolute inset-0" style={{
        background: 'linear-gradient(165deg, #F7F8FF 0%, #FFF2E9 45%, #ECFFF4 100%)'
      }} />
        
        {/* Blurred blobs */}
        <div className="absolute w-72 h-72 rounded-full blur-3xl opacity-25" style={{
        background: '#FFB088',
        top: '-10%',
        right: '-15%'
      }} />
        <div className="absolute w-56 h-56 rounded-full blur-3xl opacity-20" style={{
        background: '#88DDAA',
        bottom: '20%',
        left: '-10%'
      }} />

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col px-6 pt-12 pb-8">
          {/* Back button */}
          <button onClick={() => setView('welcome')} className="self-start mb-8 p-2 -mr-2 rounded-full hover:bg-card/50 transition-colors">
            <ArrowRight className="w-6 h-6 text-foreground/70" />
          </button>

          {/* Header */}
          <div className="text-center mb-10 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-glow animate-icon-delight-delayed">
              <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {view === 'email-signup' ? 'יצירת חשבון' : 'התחברות'}
            </h1>
            <p className="text-muted-foreground">
              {view === 'email-signup' ? 'מתחילים לבשל ולחסוך' : 'ברוכים השבים!'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 max-w-sm mx-auto w-full animate-slide-up">
            <div className="p-6 rounded-3xl space-y-4" style={{
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 40px -12px rgba(0, 0, 0, 0.1)'
          }}>
              <div className="space-y-1">
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input type="email" placeholder="אימייל" value={email} onChange={e => {
                  setEmail(e.target.value);
                  setErrors(prev => ({
                    ...prev,
                    email: undefined
                  }));
                }} className="h-14 pr-12 rounded-2xl border-0 bg-card/60 text-base px-5" dir="ltr" />
                </div>
                {errors.email && <p className="text-sm text-destructive pr-1">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input type={showPassword ? 'text' : 'password'} placeholder="סיסמה" value={password} onChange={e => {
                  setPassword(e.target.value);
                  setErrors(prev => ({
                    ...prev,
                    password: undefined
                  }));
                }} className="h-14 pr-12 pl-12 rounded-2xl border-0 bg-card/60 text-base px-5" dir="ltr" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive pr-1">{errors.password}</p>}
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full h-14 rounded-2xl text-base font-medium bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-[0.98]">
                {isLoading ? <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" /> : view === 'email-signup' ? 'הרשמה' : 'התחברות'}
              </Button>
            </div>

            <div className="text-center pt-4">
              <button type="button" onClick={() => {
              setView(view === 'email-signup' ? 'email-login' : 'email-signup');
              setErrors({});
            }} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {view === 'email-signup' ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם'}
              </button>
            </div>
          </form>
        </div>
      </div>;
  }

  // Welcome view - Redesigned
  return <div className="min-h-screen min-h-[100dvh] relative overflow-hidden flex flex-col" dir="rtl">
      {/* Full-screen gradient background */}
      <div className="fixed inset-0" style={{
      background: 'linear-gradient(165deg, #F7F8FF 0%, #FFF2E9 45%, #ECFFF4 100%)'
    }} />
      
      {/* Blurred blobs for depth - positioned carefully */}
      <div className="fixed w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none" style={{
      background: '#FFB088',
      top: '-12%',
      right: '-20%'
    }} />
      <div className="fixed w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none" style={{
      background: '#88CCFF',
      top: '35%',
      left: '-25%'
    }} />
      <div className="fixed w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none" style={{
      background: '#88DDAA',
      bottom: '15%',
      right: '-15%'
    }} />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col safe-area-inset">
        {/* Hero section */}
        <div className="pt-16 px-6 text-center animate-fade-in">
          {/* App icon - emoji style, no white bg */}
          
          
          {/* App name */}
          <h1 className="text-lg font-semibold text-foreground/70 tracking-wide mb-4">
            BudgetBites
          </h1>
          
          {/* Main slogan - big and bold */}
          <h2 className="text-4xl font-bold text-foreground leading-tight mb-2">
            מתחילים לבשל.
          </h2>
          <h2 className="text-4xl font-bold text-foreground leading-tight">
            מתחילים לחסוך.
          </h2>
        </div>

        {/* Emoji orbit section */}
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <EmojiOrbit />
          <p className="text-muted-foreground text-base mt-4 font-medium">
            כל ארוחה בבית = כסף שנשאר אצלך
          </p>
        </div>

        {/* CTA section - bottom */}
        <div className="px-6 pb-10 animate-slide-up">
          {/* Main CTA button */}
          <Button onClick={() => setIsSheetOpen(true)} className="w-full h-16 rounded-3xl text-lg font-semibold transition-all active:scale-[0.98] shadow-xl" style={{
          background: 'linear-gradient(135deg, #1D1D1F 0%, #3D3D3F 100%)',
          color: 'white',
          boxShadow: '0 12px 40px -8px rgba(0, 0, 0, 0.3)'
        }}>
            <Sparkles className="w-5 h-5 ml-2" />
            גלה כמה תחסוך
          </Button>

          {/* Login link */}
          <div className="text-center mt-5">
            <button onClick={() => setView('email-login')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              כבר יש לך חשבון? <span className="font-semibold text-foreground">התחבר</span>
            </button>
          </div>
        </div>
      </div>

      {/* Phone signup bottom sheet */}
      <PhoneSignupSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} onEmailClick={handleEmailFromSheet} onGuestClick={handleGuestContinue} />
    </div>;
};
export default Auth;