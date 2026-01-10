import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGuest } from '@/contexts/GuestContext';
import { toast } from 'sonner';

export const PremiumPopup: React.FC = () => {
  const { showPremiumPopup, closePremiumPopup, activatePremium, markPopupSeen } = useGuest();

  const handleActivatePremium = () => {
    activatePremium();
    markPopupSeen();
    toast.success('✅ פרימיום הופעל עד סוף פברואר');
  };

  const handleNotNow = () => {
    closePremiumPopup();
    markPopupSeen();
  };

  return (
    <Dialog open={showPremiumPopup} onOpenChange={(open) => !open && handleNotNow()}>
      <DialogContent 
        className="max-w-sm mx-4 rounded-3xl p-6 text-center border-0 shadow-2xl"
        dir="rtl"
      >
        <button 
          onClick={handleNotNow}
          className="absolute top-4 left-4 p-1 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Header with animated emoji */}
        <div className="mb-4">
          <div className="text-5xl mb-3 animate-bounce">🎁</div>
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Premium בהשקה
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="space-y-4 mb-6">
          <p className="text-muted-foreground text-sm leading-relaxed">
            פרימיום חינם עד סוף פברואר כדי לחגוג את ההשקה.
            <br />
            רוצה להפעיל עכשיו?
          </p>

          {/* Features preview */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">☁️</span>
              <span>Cloud backup</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">📖</span>
              <span>מתכונים ללא הגבלה</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">📊</span>
              <span>אנליטיקס ותובנות</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleActivatePremium}
            className="w-full h-12 rounded-xl text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Sparkles className="w-4 h-4 ml-2" />
            הפעל פרימיום בחינם
          </Button>
          
          <Button 
            onClick={handleNotNow}
            variant="ghost"
            className="w-full h-10 text-muted-foreground"
          >
            אולי אחר כך
          </Button>
        </div>

        {/* Footnote */}
        <p className="text-xs text-muted-foreground mt-4">
          אפשר לשדרג בכל רגע
        </p>
      </DialogContent>
    </Dialog>
  );
};
