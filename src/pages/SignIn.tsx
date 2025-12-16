import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { z } from 'zod';
import chefIcon from '@/assets/chef-icon.png';

const emailSchema = z.string().email('כתובת אימייל לא תקינה');
const passwordSchema = z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים');

type AuthView = 'signup' | 'login';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading } = useAuth();
  const { profile } = useApp();
  
  const [view, setView] = useState<AuthView>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Calculate savings from profile data
  const monthlySavings = profile?.monthlySpending 
    ? Math.round(profile.monthlySpending * 0.55) 
    : 0;
  const yearlySavings = monthlySavings * 12;

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
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-12 pb-8">
        {/* Back button */}
        <button 
          onClick={() => navigate('/auth')} 
          className="self-start mb-8 p-2 -mr-2 rounded-full hover:bg-card/50 transition-colors"
        >
          <ArrowRight className="w-6 h-6 text-foreground/70" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-glow animate-icon-delight-delayed">
            <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {view === 'signup' ? 'יצירת חשבון' : 'התחברות'}
          </h1>
          <p className="text-muted-foreground">
            {view === 'signup' ? 'מתחילים לבשל ולחסוך' : 'ברוכים השבים!'}
          </p>
        </div>

        {/* Savings preview - show only on signup */}
        {view === 'signup' && monthlySavings > 0 && (
          <div 
            className="max-w-sm mx-auto w-full mb-6 p-4 rounded-2xl animate-fade-in"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 20px -8px rgba(0, 0, 0, 0.08)'
            }}
          >
            <p className="text-sm text-muted-foreground text-center mb-2">לפי התשובות שלך:</p>
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">חיסכון חודשי משוער</p>
                <p className="text-xl font-bold text-primary">₪{monthlySavings.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">חיסכון שנתי משוער</p>
                <p className="text-xl font-bold text-green-600">₪{yearlySavings.toLocaleString()}</p>
              </div>
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
