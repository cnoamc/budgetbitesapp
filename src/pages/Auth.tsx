import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().email('כתובת אימייל לא תקינה');
const passwordSchema = z.string().min(6, 'הסיסמה חייבת להכיל לפחות 6 תווים');

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, signIn, user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col justify-center">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 gradient-primary rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-glow animate-float">
            <ChefHat className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">BudgetBites</h1>
          <p className="text-muted-foreground">
            {isLogin ? 'שמחים לראות אותך שוב! 👋' : 'בוא נתחיל לחסוך כסף! 💰'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="אימייל"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                className="pr-10"
                dir="ltr"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="סיסמה"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                className="pr-10 pl-10"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            size="xl"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'התחבר' : 'הירשם'}
                <ArrowLeft className="w-5 h-5" />
              </>
            )}
          </Button>
        </form>

        {/* Toggle */}
        <div className="text-center mt-6">
          <p className="text-muted-foreground">
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

        {/* Features */}
        <div className="mt-8 bg-card rounded-2xl p-5 border border-border/50">
          <h3 className="font-medium mb-3 text-center">למה להירשם? 🤔</h3>
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
  );
};

export default Auth;
