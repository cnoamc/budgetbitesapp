import React, { useState } from 'react';
import { Mail, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { lovable } from '@/integrations/lovable/index';
import { toast } from 'sonner';

interface AuthBottomSheetProps {
  onEmailClick: () => void;
  onGuestClick: () => void;
  onLoginClick: () => void;
}

export const AuthBottomSheet: React.FC<AuthBottomSheetProps> = ({
  onEmailClick,
  onGuestClick,
  onLoginClick,
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const handleAppleSignIn = async () => {
    if (!termsAccepted) return;
    setIsAppleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("apple", {
        redirect_uri: window.location.origin,
      });
      if (error) {
        toast.error('שגיאה בהתחברות עם Apple');
        console.error('Apple sign-in error:', error);
      }
    } catch (err) {
      toast.error('שגיאה בהתחברות עם Apple');
      console.error('Apple sign-in error:', err);
    } finally {
      setIsAppleLoading(false);
    }
  };

  return (
    <div 
      className="mt-auto animate-slide-up"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '28px 28px 0 0',
        boxShadow: '0 -8px 40px -12px rgba(0, 0, 0, 0.08), 0 -4px 20px -8px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Drag indicator */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-10 h-1 bg-muted-foreground/20 rounded-full" />
      </div>
      
      <div className="px-6 pb-8 pt-2 overflow-y-auto max-h-[70vh]">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">יצירת חשבון</h2>
          <p className="text-muted-foreground text-sm">
            שומרים את ההתקדמות והחיסכון שלך. בלי ספאם.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          {/* Email - Primary */}
          <Button
            onClick={onEmailClick}
            disabled={!termsAccepted}
            className="w-full h-14 rounded-2xl text-base font-medium transition-all active:scale-[0.98]"
            style={{
              background: termsAccepted 
                ? 'linear-gradient(135deg, #4A90D9 0%, #357ABD 100%)' 
                : '#E5E5EA',
              color: termsAccepted ? 'white' : '#8E8E93',
            }}
          >
            <Mail className="w-5 h-5 ml-2" />
            המשך עם אימייל
          </Button>

          {/* Apple Sign-In */}
          <Button
            onClick={handleAppleSignIn}
            disabled={!termsAccepted || isAppleLoading}
            className="w-full h-14 rounded-2xl text-base font-medium transition-all active:scale-[0.98]"
            style={{
              background: termsAccepted ? '#000000' : '#E5E5EA',
              color: termsAccepted ? 'white' : '#8E8E93',
            }}
          >
            <svg className="w-5 h-5 ml-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            {isAppleLoading ? 'מתחבר...' : 'המשך עם Apple'}
          </Button>

          {/* Guest button */}
          <Button
            onClick={onGuestClick}
            variant="outline"
            className="w-full h-14 rounded-2xl border-2 text-base font-medium transition-all active:scale-[0.98]"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              borderColor: '#E5E5EA',
              color: '#1D1D1F',
            }}
          >
            <User className="w-5 h-5 ml-2" />
            המשך כאורח
          </Button>
        </div>

        {/* Terms checkbox */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            className="data-[state=checked]:bg-[#4A90D9] data-[state=checked]:border-[#4A90D9] rounded-md"
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
            אני מסכים/ה לתנאי השימוש
          </label>
        </div>

        {/* Login link */}
        <div className="text-center mt-4">
          <button
            onClick={onLoginClick}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            כבר יש לך חשבון? <span className="font-medium text-[#4A90D9]">התחבר</span>
          </button>
        </div>

        {/* Micro badge */}
        <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-[#4A90D9]" />
          <span>נחשב לך פוטנציאל חיסכון תוך 20 שניות</span>
        </div>
      </div>
    </div>
  );
};