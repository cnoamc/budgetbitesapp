import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { useGuest } from '@/contexts/GuestContext';

const SESSION_KEY = 'bb_guest_login_modal_shown';

export const GuestLoginModal: React.FC = () => {
  const navigate = useNavigate();
  const { isGuest } = useGuest();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show for guests, once per session
    if (!isGuest) return;
    
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    if (alreadyShown) return;

    // Show after 12 seconds of being in the app
    const timer = setTimeout(() => {
      setIsOpen(true);
      sessionStorage.setItem(SESSION_KEY, 'true');
    }, 12000);

    return () => clearTimeout(timer);
  }, [isGuest]);

  const handleLogin = () => {
    setIsOpen(false);
    navigate('/signin');
  };

  const handleContinueAsGuest = () => {
    setIsOpen(false);
  };

  if (!isGuest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[320px] rounded-2xl p-6 text-center" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          {/* Icon */}
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          
          {/* Copy */}
          <div className="space-y-2">
            <h3 className="text-lg font-bold">
              ✨ כדי לשמור מתכונים ולהתקדם
            </h3>
            <p className="text-muted-foreground text-sm">
              התחבר או המשך כאורח
            </p>
          </div>
          
          {/* Launch offer badge */}
          <div className="bg-savings/10 text-savings px-3 py-1.5 rounded-full text-sm font-medium">
            האפליקציה חינמית עד סוף פברואר 🎉
          </div>
          
          {/* Buttons */}
          <div className="w-full space-y-2 mt-2">
            <Button 
              onClick={handleLogin}
              className="w-full"
              size="lg"
            >
              התחברות / הרשמה
            </Button>
            
            <Button 
              variant="ghost"
              onClick={handleContinueAsGuest}
              className="w-full text-muted-foreground"
            >
              המשך כאורח
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestLoginModal;
