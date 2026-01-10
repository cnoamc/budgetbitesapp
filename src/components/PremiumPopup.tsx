import React from 'react';
import { Sparkles, X, Check, Crown, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { useGuest } from '@/contexts/GuestContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import appIcon from '@/assets/app-icon.png';

const features = [
  { emoji: '☁️', text: 'גיבוי בענן', description: 'כל המתכונים שלך שמורים' },
  { emoji: '📖', text: 'מתכונים ללא הגבלה', description: 'צור ושמור כמה שתרצה' },
  { emoji: '📊', text: 'אנליטיקס ותובנות', description: 'עקוב אחרי החיסכון שלך' },
  { emoji: '🤖', text: 'עוזר בישול AI', description: 'שף שפי האישי שלך' },
];

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
        className="max-w-sm mx-4 rounded-3xl p-0 border-0 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        dir="rtl"
      >
        {/* Close button */}
        <button 
          onClick={handleNotNow}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Header with gradient */}
        <div 
          className="pt-8 pb-6 px-6 text-center relative overflow-hidden shrink-0"
          style={{
            background: 'linear-gradient(165deg, #E8F4FD 0%, #FFF8F0 45%, #F0FFF6 100%)'
          }}
        >
          {/* Decorative blurred circles */}
          <div 
            className="absolute w-32 h-32 rounded-full blur-3xl opacity-40"
            style={{ 
              background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
              top: '-20%',
              right: '-10%'
            }}
          />
          <div 
            className="absolute w-24 h-24 rounded-full blur-3xl opacity-30"
            style={{ 
              background: 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
              bottom: '10%',
              left: '-5%'
            }}
          />
          
          {/* Premium badge */}
          <div className="flex justify-center mb-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1.5 rounded-full shadow-sm">
              <Crown className="w-4 h-4" />
              <span className="text-xs font-bold">PREMIUM</span>
            </div>
          </div>

          {/* App icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative mx-auto mb-4 w-fit"
          >
            <div 
              className="w-16 h-16 rounded-[20px] overflow-hidden shadow-xl"
              style={{ boxShadow: '0 12px 32px -8px rgba(59, 130, 246, 0.4)' }}
            >
              <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
          </motion.div>

          <h2 className="text-xl font-bold text-gray-900 mb-1">
            ברוכים הבאים! 🎉
          </h2>
          <p className="text-gray-600 text-sm">
            הצטרפת בזמן הנכון
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto bg-white">
          {/* Free Banner */}
          <div className="px-5 pt-5 pb-3">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white shadow-lg"
              style={{ boxShadow: '0 8px 24px -8px rgba(16, 185, 129, 0.4)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base">חינם עד סוף פברואר! 🎁</p>
                  <p className="text-white/90 text-xs">כל הפיצ׳רים פתוחים בשבילך</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="px-5 pb-3">
            <h3 className="text-xs font-semibold text-gray-500 mb-2">מה מחכה לך</h3>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center text-lg shrink-0">
                    {feature.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{feature.text}</p>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                  <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="px-5 pb-5 pt-2">
            <Button 
              onClick={handleActivatePremium}
              className="w-full h-12 rounded-2xl text-base font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
              style={{ boxShadow: '0 8px 24px -8px rgba(59, 130, 246, 0.5)' }}
            >
              <Sparkles className="w-5 h-5 ml-2" />
              בואו נתחיל לבשל! 🍳
            </Button>
            
            <button 
              onClick={handleNotNow}
              className="w-full py-2 mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              אולי אחר כך
            </button>

            <p className="text-center text-xs text-gray-400 mt-2">
              לאחר פברואר, המחיר יהיה ₪19.90/חודש
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
