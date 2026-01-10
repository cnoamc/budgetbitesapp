import React from 'react';
import { Sparkles, X, ChefHat, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
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
        className="max-w-sm mx-4 rounded-3xl p-0 border-0 shadow-2xl overflow-hidden"
        dir="rtl"
      >
        {/* Close button - only one */}
        <button 
          onClick={handleNotNow}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header with gradient */}
        <div 
          className="pt-10 pb-6 px-6 text-center"
          style={{
            background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)'
          }}
        >
          {/* Animated emoji */}
          <div className="text-5xl mb-3 animate-bounce">🎁</div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Premium בהשקה
          </h2>
          <p className="text-white/70 text-sm">
            חינם לחלוטין עד סוף פברואר!
          </p>
        </div>

        {/* Content */}
        <div className="p-6 bg-white">
          {/* Features list */}
          <div className="space-y-3 mb-6">
            {/* Main feature - highlighted */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <ChefHat className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">✨ שפי – עוזר בישול חכם</p>
                <p className="text-xs text-muted-foreground">הפיצ'ר המרכזי שלנו</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2">
              <span className="text-lg">⏱</span>
              <span className="text-sm">מתכונים מהירים וחסכוניים</span>
            </div>
            
            <div className="flex items-center gap-3 p-2">
              <span className="text-lg">📊</span>
              <span className="text-sm">מעקב התקדמות וחיסכון</span>
            </div>
          </div>

          {/* Info badge */}
          <div className="bg-muted/50 rounded-xl p-3 text-center mb-6">
            <p className="text-xs text-muted-foreground">
              🚀 האפליקציה חינמית בתקופת ההשקה
              <br />
              <span className="text-foreground font-medium">חלק מהפיצ'רים יהיו מוגבלים בעתיד</span>
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleActivatePremium}
              className="w-full h-14 rounded-2xl text-base font-bold"
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              }}
            >
              <Sparkles className="w-5 h-5 ml-2" />
              הפעל פרימיום בחינם
            </Button>
            
            <button 
              onClick={handleNotNow}
              className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              אולי אחר כך
            </button>
          </div>

          {/* Footnote */}
          <p className="text-xs text-center text-muted-foreground mt-4">
            אפשר לשדרג בכל רגע
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};