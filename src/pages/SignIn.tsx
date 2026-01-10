import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { FixedScreenLayout } from '@/components/layouts';
import { toast } from 'sonner';
import appIcon from '@/assets/app-icon.png';
import confetti from 'canvas-confetti';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, signUp, signIn, signInWithGoogle } = useAuth();
  const { exitGuestMode } = useGuest();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewSignup, setIsNewSignup] = useState(false);

  // Redirect logged in users to home
  useEffect(() => {
    if (user && !loading) {
      // Exit guest mode when logging in
      exitGuestMode();
      navigate('/home', { replace: true });
    }
  }, [user, loading, navigate, exitGuestMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('נא למלא את כל השדות');
      return;
    }

    if (password.length < 6) {
      toast.error('הסיסמה חייבת להכיל לפחות 6 תווים');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('כתובת המייל כבר רשומה במערכת');
          } else {
            toast.error('שגיאה בהרשמה. נסה שוב.');
          }
        } else {
          setIsNewSignup(true);
          // Fire confetti for new signup
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#2196F3', '#00BCD4', '#22c55e']
          });
          toast.success('🎉 נרשמת בהצלחה!');
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login')) {
            toast.error('פרטי ההתחברות שגויים');
          } else {
            toast.error('שגיאה בהתחברות. נסה שוב.');
          }
        } else {
          toast.success('התחברת בהצלחה!');
        }
      }
    } catch (error) {
      toast.error('שגיאה. נסה שוב.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast.error('שגיאה בהתחברות עם Google');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <FixedScreenLayout className="items-center justify-center bg-background">
        <div className="w-16 h-16 rounded-2xl overflow-hidden animate-pulse">
          <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
        </div>
      </FixedScreenLayout>
    );
  }

  return (
    <FixedScreenLayout className="bg-background">
      <div className="flex-1 flex flex-col p-6" dir="rtl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
          <h1 className="text-2xl font-bold">
            {isSignUp ? 'הרשמה' : 'התחברות'}
          </h1>
        </div>

        {/* App icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg">
            <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              אימייל
            </Label>
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="pr-10 h-12 bg-white"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              סיסמה
            </Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10 pl-10 h-12 bg-white"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 rounded-xl text-base font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              isSignUp ? 'הרשמה' : 'התחברות'
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">או</span>
          <Separator className="flex-1" />
        </div>

        {/* Google Sign In */}
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl text-base font-medium bg-white"
          onClick={handleGoogleSignIn}
        >
          <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          המשך עם Google
        </Button>

        {/* Apple Sign In - Disabled with Coming Soon overlay */}
        <div className="relative mt-3">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl text-base font-medium bg-black text-white border-black hover:bg-black/90 hover:text-white"
            disabled
          >
            <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            המשך עם Apple
          </Button>
          {/* Blur overlay with Coming Soon */}
          <div className="absolute inset-0 backdrop-blur-[2px] bg-white/60 rounded-xl flex items-center justify-center">
            <span className="bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Toggle Sign Up / Sign In */}
        <div className="text-center mt-6">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {isSignUp ? (
              <>כבר יש לך חשבון? <span className="font-semibold text-primary">התחבר</span></>
            ) : (
              <>אין לך חשבון? <span className="font-semibold text-primary">הרשם</span></>
            )}
          </button>
        </div>

        {/* Continue as Guest */}
        <div className="text-center mt-4">
          <button 
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            או <span className="font-medium">המשך כאורח</span>
          </button>
        </div>
      </div>
    </FixedScreenLayout>
  );
};

export default SignIn;