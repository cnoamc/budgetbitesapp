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
      <div className="h-[100dvh] flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  const features = [
    '🔍 גישה לכל המתכונים',
    '🤖 עוזר בישול AI אישי',
    '💰 מעקב חיסכון מלא',
    'התקדמות ורמות',
    '🔔 התראות חכמות',
  ];

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden relative" dir="rtl">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-muted/50 rounded-full blur-3xl" />
      </div>
      
      {/* Clean Header */}
      <div className="pt-14 pb-8 px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="relative inline-block"
        >
          {/* Subtle glow behind emoji */}
          <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-150" />
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
          <h1 className="text-[28px] font-bold mt-5 tracking-tight">נסה חודש חינם</h1>
          <p className="text-muted-foreground text-[15px] mt-1.5">אחר כך ₪4.99 לחודש</p>
        </motion.div>
      </div>

      {/* Features List - Clean iOS style */}
      <div className="flex-1 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-secondary/50 rounded-2xl p-5"
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
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
                </div>
                <span className="text-[15px]">{feature}</span>
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
            <div className="text-[13px] font-semibold">היום 🎉</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">גישה מלאה</p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-16 h-[1px] bg-border self-center" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold">יום 29 📩</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">נזכיר לך</p>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-16 h-[1px] bg-border self-center" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold">יום 30 💳</div>
            <p className="text-[11px] text-muted-foreground mt-0.5">₪4.99/חודש</p>
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
          className="w-full h-[54px] rounded-[14px] text-[17px] font-semibold bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98] transition-transform relative overflow-hidden"
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-background/20 to-transparent" />
          {isStarting ? (
            <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="relative z-10">התחל תקופת ניסיון</span>
          )}
        </Button>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <span className="text-[13px] text-muted-foreground">🔒 ללא תשלום עכשיו • בטל בכל עת 💚</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Premium;
