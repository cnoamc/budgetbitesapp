import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone, Fingerprint, ScanFace } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { useStatusBar } from '@/hooks/useStatusBar';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { toast } from 'sonner';
import { z } from 'zod';
import confetti from 'canvas-confetti';
import appIcon from '@/assets/app-icon.png';

const emailSchema = z.string().email('כתובת אימייל לא תקינה');
const passwordSchema = z.string()
  .min(8, 'הסיסמה חייבת להכיל לפחות 8 תווים')
  .regex(/[A-Z]/, 'הסיסמה חייבת להכיל לפחות אות גדולה אחת')
  .regex(/[a-z]/, 'הסיסמה חייבת להכיל לפחות אות קטנה אחת')
  .regex(/[0-9]/, 'הסיסמה חייבת להכיל לפחות ספרה אחת');
const phoneSchema = z.string().regex(/^\+?[0-9]{10,15}$/, 'מספר טלפון לא תקין');

type AuthView = 'options' | 'email' | 'phone' | 'otp' | 'forgot' | 'reset';

// Password strength calculation
const getPasswordStrength = (password: string): { level: 0 | 1 | 2 | 3; label: string; color: string } => {
  if (!password) return { level: 0, label: '', color: '' };
  
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 2) return { level: 1, label: 'חלשה', color: 'bg-red-500' };
  if (score <= 3) return { level: 2, label: 'בינונית', color: 'bg-yellow-500' };
  return { level: 3, label: 'חזקה', color: 'bg-green-500' };
};

const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#22C55E', '#4ADE80']
  });
};

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { user, signIn, signUp, signInWithGoogle, signInWithPhone, verifyOtp, resetPassword, updatePassword, loading } = useAuth();
  const { updateProfile } = useApp();
  const biometric = useBiometricAuth();
  
  // Dark status bar for blue gradient background (light icons)
  useStatusBar({ style: 'dark', backgroundColor: '#3B82F6', overlay: true });
  
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
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);

  // Check for password reset mode from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('reset') === 'true') {
      setView('reset');
    }
  }, []);

  // Auto-trigger biometric auth for returning users
  useEffect(() => {
    const attemptBiometricLogin = async () => {
      if (!biometric.isChecking && biometric.isAvailable && biometric.isEnabled && !user) {
        const savedEmail = biometric.getSavedEmail();
        if (savedEmail) {
          const success = await biometric.authenticate();
          if (success) {
            // Show that we're logging them in
            setEmail(savedEmail);
            setView('email');
            setIsLogin(true);
            // They need to enter password - biometric just confirms identity
            toast.info(`שלום! הזן את הסיסמה עבור ${savedEmail}`);
          }
        }
      }
    };
    
    attemptBiometricLogin();
  }, [biometric.isChecking, biometric.isAvailable, biometric.isEnabled, user]);

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

  const handleBiometricAuth = async () => {
    const savedEmail = biometric.getSavedEmail();
    if (!savedEmail) {
      toast.error('לא נמצא חשבון מקושר');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await biometric.authenticate();
      if (success) {
        setEmail(savedEmail);
        setView('email');
        setIsLogin(true);
        toast.info(`הזן את הסיסמה עבור ${savedEmail}`);
      }
    } finally {
      setIsLoading(false);
    }
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
          // Offer to enable biometric for new signups
          if (biometric.isAvailable && !biometric.isEnabled) {
            setShowBiometricPrompt(true);
            biometric.enableBiometric(email);
          }
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('אימייל או סיסמה שגויים');
          } else {
            toast.error('שגיאה בהתחברות, נסה שוב');
          }
        } else {
          // Offer to enable biometric for returning users who don't have it enabled
          if (biometric.isAvailable && !biometric.isEnabled) {
            setShowBiometricPrompt(true);
            biometric.enableBiometric(email);
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setErrors({ email: emailResult.error.errors[0].message });
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) {
        toast.error('שגיאה בשליחת המייל. נסה שוב.');
      } else {
        setResetEmailSent(true);
        toast.success('נשלח אליך מייל לאיפוס הסיסמה');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordResult = passwordSchema.safeParse(newPassword);
    if (!passwordResult.success) {
      setErrors({ password: passwordResult.error.errors[0].message });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrors({ password: 'הסיסמאות לא תואמות' });
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        toast.error('שגיאה בעדכון הסיסמה. נסה שוב.');
      } else {
        toast.success('הסיסמה עודכנה בהצלחה! 🎉');
        // Clear URL params and redirect
        window.history.replaceState({}, '', '/signin');
        navigate('/home');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500">
        <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-2xl animate-pulse">
          <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  const getBackAction = () => {
    if (view === 'otp') return () => setView('phone');
    if (view === 'email' || view === 'phone') return () => setView('options');
    if (view === 'forgot') return () => { setView('email'); setIsLogin(true); setResetEmailSent(false); };
    if (view === 'reset') return () => navigate('/');
    return () => navigate('/');
  };

  return (
    <div className="h-full relative overflow-hidden flex flex-col" dir="rtl">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500" />
      <div aria-hidden="true" className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none" />
      
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col px-6 pt-safe">
        {/* Back button */}
        <div className="pt-4">
          <button 
            onClick={getBackAction()} 
            className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Header with logo */}
        <div className="text-center mt-8 mb-8 animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/20">
            <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {view === 'options' ? 'ברוכים הבאים!' : 
             view === 'otp' ? 'הזן קוד אימות' : 
             view === 'phone' ? 'התחברות עם טלפון' : 
             view === 'forgot' ? 'שכחת סיסמה?' :
             view === 'reset' ? 'סיסמה חדשה' :
             isLogin ? 'התחברות' : 'יצירת חשבון'}
          </h1>
          <p className="text-white/80 text-base">
            {view === 'options' ? 'בחר איך להתחבר' : 
             view === 'otp' ? `שלחנו קוד ל-${phone}` : 
             view === 'phone' ? 'נשלח לך קוד אימות ב-SMS' : 
             view === 'forgot' ? 'נשלח לך קישור לאיפוס במייל' :
             view === 'reset' ? 'הזן את הסיסמה החדשה שלך' :
             'הכנס את הפרטים שלך'}
          </p>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col max-w-sm mx-auto w-full">
          {view === 'options' && (
            <div className="space-y-3 animate-fade-in">
              {/* Biometric option - only show if available and enabled */}
              {biometric.isAvailable && biometric.isEnabled && (
                <button
                  onClick={handleBiometricAuth}
                  disabled={isLoading}
                  className="w-full h-14 rounded-2xl text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {biometric.biometryType === 'faceId' || biometric.biometryType === 'face' ? (
                    <ScanFace className="w-5 h-5" />
                  ) : (
                    <Fingerprint className="w-5 h-5" />
                  )}
                  התחבר עם {biometric.getBiometryLabel()}
                </button>
              )}

              {/* Phone option */}
              <button
                onClick={() => setView('phone')}
                className="w-full h-14 rounded-2xl text-base font-semibold bg-white text-gray-900 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
              >
                <Phone className="w-5 h-5 text-blue-600" />
                המשך עם מספר טלפון
              </button>

              {/* Google option */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full h-14 rounded-2xl text-base font-semibold bg-white text-gray-900 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                המשך עם Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 py-3">
                <div className="flex-1 h-px bg-white/30" />
                <span className="text-sm text-white/70 font-medium">או</span>
                <div className="flex-1 h-px bg-white/30" />
              </div>

              {/* Email option */}
              <button
                onClick={() => setView('email')}
                className="w-full h-14 rounded-2xl text-base font-semibold bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 flex items-center justify-center gap-3 hover:bg-white/30 transition-all active:scale-[0.98]"
              >
                <Mail className="w-5 h-5" />
                המשך עם אימייל
              </button>
            </div>
          )}

          {view === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">מספר טלפון</label>
                    <div className="relative">
                      <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="+972 50 123 4567"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          setErrors(prev => ({ ...prev, phone: undefined }));
                        }}
                        className="h-14 pr-12 rounded-xl border-gray-200 bg-gray-50 text-base text-gray-900 placeholder:text-gray-400"
                        dir="ltr"
                      />
                    </div>
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'שלח קוד אימות'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {view === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 text-center block">הזן את הקוד שקיבלת</label>
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
                      className="h-16 rounded-xl border-gray-200 bg-gray-50 text-2xl text-center tracking-[0.5em] font-mono text-gray-900"
                      dir="ltr"
                    />
                    {errors.otp && <p className="text-sm text-red-500 text-center">{errors.otp}</p>}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full h-14 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'אימות'
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendTimer > 0}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                    >
                      {resendTimer > 0 ? `שלח שוב בעוד ${resendTimer} שניות` : 'שלח קוד חדש'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {view === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4 animate-fade-in">
              <div className="bg-white rounded-3xl p-6 shadow-2xl">
                {/* Toggle login/signup */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      !isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    הרשמה
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                      isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                    }`}
                  >
                    התחברות
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">אימייל</label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrors(prev => ({ ...prev, email: undefined }));
                        }}
                        className="h-14 pr-12 rounded-xl border-gray-200 bg-gray-50 text-base text-gray-900 placeholder:text-gray-400"
                        dir="ltr"
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">סיסמה</label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrors(prev => ({ ...prev, password: undefined }));
                        }}
                        className="h-14 pr-12 pl-12 rounded-xl border-gray-200 bg-gray-50 text-base text-gray-900 placeholder:text-gray-400"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    {!isLogin && password && (
                      <div className="mt-2 space-y-1.5">
                        {/* Strength bar */}
                        <div className="flex gap-1">
                          {[1, 2, 3].map((level) => (
                            <div
                              key={level}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                getPasswordStrength(password).level >= level
                                  ? getPasswordStrength(password).color
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        {/* Strength label */}
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500">
                            לפחות 8 תווים, אות גדולה, אות קטנה וספרה
                          </p>
                          <span className={`text-xs font-medium ${
                            getPasswordStrength(password).level === 1 ? 'text-red-500' :
                            getPasswordStrength(password).level === 2 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {getPasswordStrength(password).label}
                          </span>
                        </div>
                      </div>
                    )}
                    {!isLogin && !password && (
                      <p className="text-xs text-gray-500 mt-1">
                        לפחות 8 תווים, אות גדולה, אות קטנה וספרה
                      </p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      isLogin ? 'התחברות' : 'הרשמה'
                    )}
                  </Button>

                  {/* Forgot password link - only show in login mode */}
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setView('forgot')}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-700 transition-colors mt-2"
                    >
                      שכחת סיסמה?
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}

          {/* Forgot Password View */}
          {view === 'forgot' && (
            <div className="animate-fade-in">
              <div className="bg-white rounded-3xl p-6 shadow-2xl">
                {resetEmailSent ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">בדוק את המייל שלך</h3>
                    <p className="text-sm text-gray-600">
                      שלחנו לך קישור לאיפוס הסיסמה אל<br />
                      <span className="font-medium text-gray-900">{email}</span>
                    </p>
                    <Button
                      onClick={() => { setView('email'); setIsLogin(true); setResetEmailSent(false); }}
                      className="w-full h-14 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      חזור להתחברות
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">כתובת האימייל שלך</label>
                      <div className="relative">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setErrors(prev => ({ ...prev, email: undefined }));
                          }}
                          className="h-14 pr-12 rounded-xl border-gray-200 bg-gray-50 text-base text-gray-900 placeholder:text-gray-400"
                          dir="ltr"
                        />
                      </div>
                      {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        'שלח קישור לאיפוס'
                      )}
                    </Button>

                    <button
                      type="button"
                      onClick={() => { setView('email'); setIsLogin(true); }}
                      className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      חזור להתחברות
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Reset Password View */}
          {view === 'reset' && (
            <form onSubmit={handleUpdatePassword} className="animate-fade-in">
              <div className="bg-white rounded-3xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">סיסמה חדשה</label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setErrors(prev => ({ ...prev, password: undefined }));
                        }}
                        className="h-14 pr-12 pl-12 rounded-xl border-gray-200 bg-gray-50 text-base text-gray-900 placeholder:text-gray-400"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                    {newPassword && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex gap-1">
                          {[1, 2, 3].map((level) => (
                            <div
                              key={level}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                getPasswordStrength(newPassword).level >= level
                                  ? getPasswordStrength(newPassword).color
                                  : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500">
                            לפחות 8 תווים, אות גדולה, אות קטנה וספרה
                          </p>
                          <span className={`text-xs font-medium ${
                            getPasswordStrength(newPassword).level === 1 ? 'text-red-500' :
                            getPasswordStrength(newPassword).level === 2 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {getPasswordStrength(newPassword).label}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">אישור סיסמה</label>
                    <div className="relative">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-14 pr-12 rounded-xl border-gray-200 bg-gray-50 text-base text-gray-900 placeholder:text-gray-400"
                        dir="ltr"
                      />
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-sm text-red-500">הסיסמאות לא תואמות</p>
                    )}
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={isLoading || !newPassword || newPassword !== confirmPassword}
                    className="w-full h-14 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      'עדכן סיסמה'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="pb-safe-offset-4 pt-4 text-center">
          <p className="text-white/60 text-xs">
            בהמשך ההרשמה אתה מסכים ל
            <button onClick={() => navigate('/terms')} className="text-white/80 underline mx-1">תנאי השימוש</button>
            ול
            <button onClick={() => navigate('/privacy')} className="text-white/80 underline mx-1">מדיניות הפרטיות</button>
          </p>
        </div>
      </div>

      {/* Biometric Enable Prompt */}
      {showBiometricPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 shadow-2xl max-w-sm w-full text-center" dir="rtl">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {biometric.biometryType === 'faceId' || biometric.biometryType === 'face' ? (
                <ScanFace className="w-8 h-8 text-blue-600" />
              ) : (
                <Fingerprint className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              התחברות מהירה עם {biometric.getBiometryLabel()}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              בפעם הבאה תוכל להתחבר במהירות באמצעות {biometric.getBiometryLabel()} במקום להקליד סיסמה
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  toast.success(`${biometric.getBiometryLabel()} הופעל בהצלחה`);
                  setShowBiometricPrompt(false);
                }}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                מעולה!
              </Button>
              <button
                onClick={() => {
                  biometric.disableBiometric();
                  setShowBiometricPrompt(false);
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700"
              >
                לא תודה
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
