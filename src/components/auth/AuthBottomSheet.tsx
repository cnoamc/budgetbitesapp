import React, { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { Mail, Apple, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface AuthBottomSheetProps {
  onEmailClick: () => void;
  onGoogleClick: () => void;
  onAppleClick: () => void;
  onGuestClick: () => void;
  onLoginClick: () => void;
}

export const AuthBottomSheet: React.FC<AuthBottomSheetProps> = ({
  onEmailClick,
  onGoogleClick,
  onAppleClick,
  onGuestClick,
  onLoginClick,
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  return (
    <div 
      className={`mt-auto ${isNative ? '' : 'animate-slide-up'}`}
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: isNative ? undefined : 'blur(20px)',
        WebkitBackdropFilter: isNative ? undefined : 'blur(20px)',
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

          {/* Google - Secondary */}
          <Button
            onClick={onGoogleClick}
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
            המשך עם גוגל
          </Button>

          {/* Apple & Guest - Half buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onAppleClick}
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
              onClick={onGuestClick}
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