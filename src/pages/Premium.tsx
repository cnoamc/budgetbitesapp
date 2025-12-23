import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

const Premium: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subLoading, hasStartedTrial, startTrial } = useSubscription();
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!subLoading && subscription && hasStartedTrial) {
      navigate('/home');
    }
  }, [subscription, subLoading, hasStartedTrial, navigate]);

  const handleStartTrial = async () => {
    setIsStarting(true);
    
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    await startTrial();
    toast.success('תקופת הניסיון החלה! 🎉');
    navigate('/home');
  };

  if (authLoading || subLoading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500">
        <div className="w-10 h-10 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  const features = [
    '☁️ גיבוי בענן',
    '📖 מתכונים ללא הגבלה',
    '📊 אנליטיקס ותובנות',
    '🤖 עוזר בישול AI אישי',
    '💰 מעקב חיסכון מלא',
    '📈 התקדמות ורמות',
    '🔔 התראות חכמות',
  ];

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden relative" dir="rtl">
      {/* Blue gradient background - matching Welcome page */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500" />
      
      {/* Decorative circles - matching Welcome page */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-300/15 rounded-full blur-2xl" />
      <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="pt-14 pb-6 px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative inline-block"
          >
            {/* Subtle glow behind emoji */}
            <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full scale-150" />
            <motion.span 
              className="text-6xl relative z-10 block"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              👨‍🍳
            </motion.span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-[28px] font-bold mt-5 tracking-tight text-white">נסה חודש חינם</h1>
            <p className="text-white/70 text-[15px] mt-1.5">אחר כך ₪4.99 לחודש</p>
          </motion.div>
        </div>

        {/* Features List */}
        <div className="flex-1 px-6 overflow-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-lg"
          >
            <div className="space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-blue-600" strokeWidth={3} />
                  </div>
                  <span className="text-[15px] text-white">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-5 flex items-center justify-between text-center px-2"
          >
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-white">היום 🎉</div>
              <p className="text-[11px] text-white/60 mt-0.5">גישה מלאה</p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-16 h-[1px] bg-white/30 self-center" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-white">יום 29 📩</div>
              <p className="text-[11px] text-white/60 mt-0.5">נזכיר לך</p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-16 h-[1px] bg-white/30 self-center" />
            </div>
            <div className="flex-1">
              <div className="text-[13px] font-semibold text-white">יום 30 💳</div>
              <p className="text-[11px] text-white/60 mt-0.5">₪4.99/חודש</p>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="p-6 pb-10"
        >
          <Button
            onClick={handleStartTrial}
            disabled={isStarting}
            className="w-full h-[54px] rounded-2xl text-[17px] font-bold bg-white text-blue-600 hover:bg-white/90 active:scale-[0.98] transition-all shadow-xl relative overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-blue-100/50 to-transparent" />
            {isStarting ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="relative z-10">התחל תקופת ניסיון</span>
            )}
          </Button>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <span className="text-[13px] text-white/70">🔒 ללא תשלום עכשיו • בטל בכל עת 💚</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Premium;
