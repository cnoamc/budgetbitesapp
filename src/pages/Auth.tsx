import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, Chrome, Apple, ArrowLeft, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthBackground } from '@/components/auth/AuthBackground';
import { EmojiOrbit } from '@/components/auth/EmojiOrbit';
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import appIcon from '@/assets/app-icon.png';
import { cn } from '@/lib/utils';

const emailSchema = z.string().trim().email();
const passwordSchema = z.string().min(6);

type AuthView = 'welcome' | 'email-signup' | 'email-signin';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, signUp, signIn, signInWithGoogle } = useAuth();
  const { t, isRTL } = useLanguage();
  
  const [view, setView] = useState<AuthView>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast.error(isRTL ? 'כתובת אימייל לא תקינה' : 'Please enter a valid email');
      return;
    }
    
    const passwordResult = passwordSchema.safeParse(password);
    if (!passwordResult.success) {
      toast.error(isRTL ? 'הסיסמה חייבת להכיל לפחות 6 תווים' : 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      if (view === 'email-signup') {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error(isRTL ? 'האימייל כבר רשום. נסה להתחבר' : 'Email already registered. Try signing in');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success(isRTL ? 'החשבון נוצר בהצלחה!' : 'Account created successfully!');
          navigate('/onboarding');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(isRTL ? 'אימייל או סיסמה שגויים' : 'Invalid email or password');
        } else {
          navigate('/home');
        }
      }
    } catch {
      toast.error(isRTL ? 'משהו השתבש' : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error(isRTL ? 'התחברות עם Google נכשלה' : 'Google sign in failed');
      }
    } catch {
      toast.error(isRTL ? 'התחברות עם Google נכשלה' : 'Google sign in failed');
    }
  };

  const handleGuestContinue = () => {
    localStorage.setItem('bb_guest', 'true');
    navigate('/onboarding');
  };

  if (loading) {
    return (
      <AuthBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      </AuthBackground>
    );
  }

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <AuthBackground>
      <div className="min-h-screen flex flex-col px-6 py-8">
        {/* Top language toggle */}
        <div className={cn("flex justify-end mb-4", isRTL && "justify-start")}>
          <LanguageToggle />
        </div>
        
        {/* Top section - Logo & Title */}
        <div className="text-center mb-4 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-[22px] shadow-elevated overflow-hidden bg-white/50 backdrop-blur-sm border border-white/60">
            <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('appName')}</h1>
          <p className="text-lg text-muted-foreground font-medium">{t('tagline')}</p>
          <p className="text-sm text-muted-foreground/80 mt-1">{t('aiSubtitle')}</p>
        </div>
        
        {/* Middle section - Emoji orbit */}
        <div className="flex-1 flex items-center justify-center min-h-[180px]">
          <EmojiOrbit className="animate-scale-in" />
        </div>
        
        {/* Bottom sheet */}
        <div 
          className="bg-white/90 backdrop-blur-xl rounded-t-[32px] -mx-6 px-6 pt-5 pb-8 shadow-elevated border-t border-white/50 animate-slide-up"
          style={{ maxHeight: '58vh', overflowY: 'auto' }}
        >
          {/* Sheet drag indicator */}
          <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mb-5" />
          
          {view === 'welcome' ? (
            <>
              {/* Sheet title */}
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-foreground">{t('createAccount')}</h2>
                <p className="text-sm text-muted-foreground mt-1">{t('saveProgress')}</p>
              </div>
              
              {/* Auth buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => agreedToTerms && setView('email-signup')}
                  disabled={!agreedToTerms}
                  size="lg"
                  className="w-full h-14 rounded-2xl text-base font-semibold bg-foreground text-background hover:bg-foreground/90 disabled:bg-muted disabled:text-muted-foreground btn-press"
                >
                  <Mail className="w-5 h-5" />
                  {t('continueEmail')}
                </Button>
                
                <Button
                  onClick={handleGoogleAuth}
                  disabled={!agreedToTerms}
                  variant="outline"
                  size="lg"
                  className="w-full h-14 rounded-2xl text-base font-semibold bg-white border-2 border-border hover:bg-secondary disabled:opacity-50 btn-press"
                >
                  <Chrome className="w-5 h-5" />
                  {t('continueGoogle')}
                </Button>
                
                <div className="flex gap-3">
                  <Button
                    disabled={!agreedToTerms}
                    variant="outline"
                    size="lg"
                    className="flex-1 h-12 rounded-xl text-sm font-medium bg-white border border-border hover:bg-secondary disabled:opacity-50 btn-press"
                    onClick={() => toast.info(isRTL ? 'Apple Sign-In יהיה זמין בקרוב' : 'Apple Sign-In coming soon')}
                  >
                    <Apple className="w-4 h-4" />
                    Apple
                  </Button>
                  <Button
                    onClick={handleGuestContinue}
                    variant="outline"
                    size="lg"
                    className="flex-1 h-12 rounded-xl text-sm font-medium bg-white border border-border hover:bg-secondary btn-press"
                  >
                    {t('continueGuest')}
                  </Button>
                </div>
              </div>
              
              {/* Terms checkbox */}
              <div className={cn("flex items-center gap-3 mt-5", isRTL ? "flex-row" : "flex-row-reverse justify-end")}>
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  {t('agreeTerms')}
                </label>
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                />
              </div>
              
              {/* Sign in link */}
              <div className="text-center mt-4">
                <button 
                  onClick={() => setView('email-signin')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('alreadyHaveAccount')} <span className="font-semibold text-primary">{t('signIn')}</span>
                </button>
              </div>
              
              {/* Saving potential badge */}
              <div className="text-center mt-5">
                <span className="inline-block px-4 py-2 bg-secondary/60 rounded-full text-xs text-muted-foreground">
                  {t('savingPotentialBadge')}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-5">
                <h2 className="text-xl font-bold text-foreground">
                  {view === 'email-signin' ? t('welcomeBack') : t('createAccount')}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {view === 'email-signin' ? t('signInContinue') : t('saveProgress')}
                </p>
              </div>
              
              {/* Form */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="relative">
                  <Mail className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground",
                    isRTL ? "right-4" : "left-4"
                  )} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('email')}
                    className={cn(
                      "w-full h-14 rounded-2xl bg-secondary/50 border border-border/50 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                      isRTL ? "pr-12 pl-4" : "pl-12 pr-4"
                    )}
                    dir="ltr"
                  />
                </div>
                
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={cn(
                      "absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
                      isRTL ? "left-4" : "right-4"
                    )}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password')}
                    className={cn(
                      "w-full h-14 rounded-2xl bg-secondary/50 border border-border/50 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                      isRTL ? "pr-4 pl-12" : "pl-4 pr-12"
                    )}
                    dir="ltr"
                  />
                </div>
                
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl text-base font-semibold bg-foreground text-background hover:bg-foreground/90 btn-press"
                >
                  {isLoading 
                    ? (isRTL ? 'מעבד...' : 'Loading...') 
                    : (view === 'email-signin' ? t('signIn') : t('signUp'))
                  }
                </Button>
              </form>
              
              {/* Toggle view */}
              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={() => setView(view === 'email-signup' ? 'email-signin' : 'email-signup')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {view === 'email-signin' ? t('noAccount') : t('alreadyHaveAccount')}{' '}
                  <span className="font-semibold text-primary">
                    {view === 'email-signin' ? t('createOne') : t('signIn')}
                  </span>
                </button>
              </div>
              
              {/* Back button */}
              <div className="text-center mt-3">
                <button 
                  type="button"
                  onClick={() => setView('welcome')}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <BackArrow className="w-4 h-4" />
                  {t('back')}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthBackground>
  );
};

export default Auth;
