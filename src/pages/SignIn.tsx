import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { FixedScreenLayout } from '@/components/layouts';
import { toast } from 'sonner';
import appIcon from '@/assets/app-icon.png';
import confetti from 'canvas-confetti';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading, signUp, signIn } = useAuth();
  const { exitGuestMode, openPremiumPopup, premiumPopupSeen, markPopupSeen } = useGuest();
  const hasShownPopup = useRef(false);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewSignup, setIsNewSignup] = useState(false);

  // Redirect logged in users to home and show premium popup for new signups
  useEffect(() => {
    if (user && !loading) {
      // Exit guest mode when logging in
      exitGuestMode();
      navigate('/home', { replace: true });
      
      // Show premium popup after navigating (for new signups or first login)
      if (!premiumPopupSeen && !hasShownPopup.current) {
        hasShownPopup.current = true;
        setTimeout(() => {
          openPremiumPopup();
          markPopupSeen();
        }, 600);
      }
    }
  }, [user, loading, navigate, exitGuestMode, openPremiumPopup, premiumPopupSeen, markPopupSeen]);

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