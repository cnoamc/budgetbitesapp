import React, { useState } from 'react';
import { Phone, Mail, Apple, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { toast } from 'sonner';

interface PhoneSignupSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailClick: () => void;
  onGuestClick: () => void;
}

type SheetView = 'options' | 'phone' | 'otp';

export const PhoneSignupSheet: React.FC<PhoneSignupSheetProps> = ({
  isOpen,
  onClose,
  onEmailClick,
  onGuestClick,
}) => {
  const [view, setView] = useState<SheetView>('options');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handlePhoneContinue = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error('נא להזין מספר טלפון תקין');
      return;
    }
    
    setIsLoading(true);
    // Simulate OTP sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setView('otp');
    setResendTimer(60);
    
    // Start countdown
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    toast.success('קוד אימות נשלח! (דמו: 123456)');
  };

  const handleOtpVerify = async () => {
    if (otpCode.length !== 6) {
      toast.error('נא להזין קוד בן 6 ספרות');
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo: accept 123456
    if (otpCode === '123456') {
      toast.success('נרשמת בהצלחה! 🎉');
      onClose();
      // In real implementation, would navigate to onboarding
    } else {
      toast.error('קוד שגוי, נסה שוב');
    }
    setIsLoading(false);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
    toast.success('קוד חדש נשלח!');
    
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleClose = () => {
    setView('options');
    setPhoneNumber('');
    setOtpCode('');
    onClose();
  };

  const renderOptions = () => (
    <>
      <DrawerHeader className="text-center pb-2">
        <DrawerTitle className="text-xl font-bold text-foreground">
          נכנסים ומתחילים
        </DrawerTitle>
        <p className="text-muted-foreground text-sm mt-1">
          תוך 20 שניות נחשב לך פוטנציאל חיסכון
        </p>
      </DrawerHeader>

      <div className="px-6 pb-8 space-y-3">
        {/* Phone - Primary */}
        <Button
          onClick={() => termsAccepted && setView('phone')}
          disabled={!termsAccepted}
          className="w-full h-14 rounded-2xl text-base font-medium transition-all active:scale-[0.98]"
          style={{
            background: termsAccepted 
              ? 'linear-gradient(135deg, #1D1D1F 0%, #3D3D3F 100%)' 
              : '#E5E5EA',
            color: termsAccepted ? 'white' : '#8E8E93',
          }}
        >
          <Phone className="w-5 h-5 ml-2" />
          המשך עם טלפון
        </Button>

        {/* Email - Secondary */}
        <Button
          onClick={() => termsAccepted && onEmailClick()}
          disabled={!termsAccepted}
          variant="outline"
          className="w-full h-14 rounded-2xl border-2 text-base font-medium transition-all active:scale-[0.98]"
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            borderColor: termsAccepted ? '#E5E5EA' : '#F2F2F7',
            color: termsAccepted ? '#1D1D1F' : '#8E8E93',
          }}
        >
          <Mail className="w-5 h-5 ml-2" />
          המשך עם אימייל
        </Button>

        {/* Google & Apple */}
        <div className="flex gap-3">
          <Button
            onClick={() => toast.info('התחברות עם Google תהיה זמינה בקרוב')}
            disabled={!termsAccepted}
            variant="outline"
            className="flex-1 h-14 rounded-2xl border-2 text-base font-medium transition-all active:scale-[0.98]"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              borderColor: termsAccepted ? '#E5E5EA' : '#F2F2F7',
              color: termsAccepted ? '#1D1D1F' : '#8E8E93',
            }}
          >
            <svg className="w-5 h-5 ml-1" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>
          <Button
            onClick={() => toast.info('התחברות עם Apple תהיה זמינה בקרוב')}
            disabled={!termsAccepted}
            variant="outline"
            className="flex-1 h-14 rounded-2xl border-2 text-base font-medium transition-all active:scale-[0.98]"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              borderColor: termsAccepted ? '#E5E5EA' : '#F2F2F7',
              color: termsAccepted ? '#1D1D1F' : '#8E8E93',
            }}
          >
            <Apple className="w-5 h-5 ml-1" />
            Apple
          </Button>
        </div>

        {/* Guest */}
        <Button
          onClick={onGuestClick}
          variant="ghost"
          className="w-full h-12 rounded-2xl text-base font-medium text-muted-foreground hover:text-foreground transition-all"
        >
          המשך כאורח
        </Button>

        {/* Terms checkbox */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <Checkbox
            id="terms-sheet"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
            className="data-[state=checked]:bg-foreground data-[state=checked]:border-foreground rounded-md"
          />
          <label htmlFor="terms-sheet" className="text-sm text-muted-foreground cursor-pointer">
            אני מסכים/ה לתנאי השימוש
          </label>
        </div>
      </div>
    </>
  );

  const renderPhoneInput = () => (
    <>
      <DrawerHeader className="text-center pb-4">
        <button
          onClick={() => setView('options')}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-card/50 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </button>
        <DrawerTitle className="text-xl font-bold text-foreground">
          מספר טלפון
        </DrawerTitle>
        <p className="text-muted-foreground text-sm mt-1">
          נשלח לך קוד אימות ב-SMS
        </p>
      </DrawerHeader>

      <div className="px-6 pb-8 space-y-4">
        <div className="flex gap-2">
          <div 
            className="h-14 px-4 rounded-2xl flex items-center justify-center text-base font-medium"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              border: '2px solid #E5E5EA',
              color: '#1D1D1F',
            }}
          >
            +972
          </div>
          <Input
            type="tel"
            placeholder="050-000-0000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            className="flex-1 h-14 rounded-2xl border-2 border-border/30 bg-card/60 text-base text-center"
            dir="ltr"
            maxLength={10}
          />
        </div>

        <Button
          onClick={handlePhoneContinue}
          disabled={isLoading || phoneNumber.length < 9}
          className="w-full h-14 rounded-2xl text-base font-medium transition-all active:scale-[0.98]"
          style={{
            background: phoneNumber.length >= 9 
              ? 'linear-gradient(135deg, #1D1D1F 0%, #3D3D3F 100%)' 
              : '#E5E5EA',
            color: phoneNumber.length >= 9 ? 'white' : '#8E8E93',
          }}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'שליחת קוד'
          )}
        </Button>
      </div>
    </>
  );

  const renderOtpInput = () => (
    <>
      <DrawerHeader className="text-center pb-4">
        <button
          onClick={() => setView('phone')}
          className="absolute right-4 top-4 p-2 rounded-full hover:bg-card/50 transition-colors"
        >
          <ArrowRight className="w-5 h-5 text-muted-foreground" />
        </button>
        <DrawerTitle className="text-xl font-bold text-foreground">
          קוד אימות
        </DrawerTitle>
        <p className="text-muted-foreground text-sm mt-1">
          הזן את הקוד שנשלח ל-+972{phoneNumber}
        </p>
      </DrawerHeader>

      <div className="px-6 pb-8 space-y-4">
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={otpCode[index] || ''}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                const newOtp = otpCode.split('');
                newOtp[index] = value;
                setOtpCode(newOtp.join('').slice(0, 6));
                
                // Auto-focus next input
                if (value && index < 5) {
                  const nextInput = e.target.nextElementSibling as HTMLInputElement;
                  nextInput?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
                  const prevInput = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                  prevInput?.focus();
                }
              }}
              className="w-12 h-14 rounded-2xl border-2 border-border/30 bg-card/60 text-center text-xl font-bold focus:border-foreground focus:outline-none transition-colors"
              dir="ltr"
            />
          ))}
        </div>

        <Button
          onClick={handleOtpVerify}
          disabled={isLoading || otpCode.length !== 6}
          className="w-full h-14 rounded-2xl text-base font-medium transition-all active:scale-[0.98]"
          style={{
            background: otpCode.length === 6 
              ? 'linear-gradient(135deg, #1D1D1F 0%, #3D3D3F 100%)' 
              : '#E5E5EA',
            color: otpCode.length === 6 ? 'white' : '#8E8E93',
          }}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'אימות'
          )}
        </Button>

        <button
          onClick={handleResendOtp}
          disabled={resendTimer > 0}
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        >
          {resendTimer > 0 
            ? `שליחה מחדש בעוד ${resendTimer} שניות`
            : 'שלח קוד מחדש'
          }
        </button>
      </div>
    </>
  );

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DrawerContent 
        className="max-h-[70vh] rounded-t-[32px]"
        style={{
          background: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute left-4 top-4 p-2 rounded-full hover:bg-card/50 transition-colors z-10"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {view === 'options' && renderOptions()}
        {view === 'phone' && renderPhoneInput()}
        {view === 'otp' && renderOtpInput()}
      </DrawerContent>
    </Drawer>
  );
};
