import React, { useState } from 'react';
import { Mail, Chrome, Apple, User, Sparkles } from 'lucide-react';
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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl rounded-t-[28px] shadow-2xl border-t border-white/50 p-6 pb-8 animate-slide-up">
      {/* Handle */}
      <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mb-6" />
      
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
          className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-base font-medium transition-all active:scale-[0.98]"
        >
          <Mail className="w-5 h-5 ml-2" />
          המשך עם אימייל
        </Button>

        {/* Google - Secondary */}
        <Button
          onClick={onGoogleClick}
          disabled={!termsAccepted}
          variant="outline"
          className="w-full h-14 rounded-2xl border-2 border-border bg-white/50 hover:bg-white/80 text-base font-medium transition-all active:scale-[0.98]"
        >
          <Chrome className="w-5 h-5 ml-2" />
          המשך עם גוגל
        </Button>

        {/* Apple & Guest - Half buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onAppleClick}
            disabled={!termsAccepted}
            variant="outline"
            className="flex-1 h-14 rounded-2xl border-2 border-border bg-white/50 hover:bg-white/80 text-base font-medium transition-all active:scale-[0.98]"
          >
            <Apple className="w-5 h-5 ml-2" />
            Apple
          </Button>
          <Button
            onClick={onGuestClick}
            variant="outline"
            className="flex-1 h-14 rounded-2xl border-2 border-border bg-white/50 hover:bg-white/80 text-base font-medium transition-all active:scale-[0.98]"
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
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
          כבר יש לך חשבון? <span className="font-medium text-primary">התחבר</span>
        </button>
      </div>

      {/* Micro badge */}
      <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-muted-foreground">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        <span>נחשב לך פוטנציאל חיסכון תוך 20 שניות</span>
      </div>
    </div>
  );
};
