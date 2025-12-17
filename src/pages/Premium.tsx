import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';

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
    await startTrial();
    toast.success('תקופת הניסיון החלה! 🎉');
    toast('תזכורת לביטול מופעלת', {
      description: 'נזכיר לך יום לפני סיום',
      icon: <Bell className="w-4 h-4" />,
    });
    navigate('/home');
  };

  if (authLoading || subLoading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-background">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden" dir="rtl">
      {/* Dark Gradient Header */}
      <div 
        className="pt-12 pb-8 px-6 text-center text-white relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
        }}
      >
        {/* Subtle glow effect */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.4) 0%, transparent 60%)'
          }}
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {/* Sparkle decorations */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top left sparkle */}
            <motion.svg
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute -top-2 -left-4 w-6 h-6 text-white/60"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </motion.svg>
            
            {/* Top right sparkle */}
            <motion.svg
              initial={{ scale: 0, rotate: 20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring" }}
              className="absolute -top-1 -right-6 w-4 h-4 text-white/40"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </motion.svg>
            
            {/* Bottom left sparkle */}
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute bottom-8 -left-8 w-3 h-3 text-white/30"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </motion.svg>
            
            {/* Bottom right sparkle */}
            <motion.svg
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="absolute bottom-6 -right-4 w-5 h-5 text-white/50"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </motion.svg>
          </div>
          
          <span className="text-5xl mb-3 block relative z-10">👨‍🍳</span>
          <h1 className="text-2xl font-bold mt-3">חודש ראשון חינם</h1>
          <p className="text-white/70 text-sm mt-2">בטל בכל עת • נזכיר לך לפני</p>
        </motion.div>
      </div>

      {/* Features - Simple with emojis */}
      <div className="flex-1 px-6 flex flex-col justify-center">
        <div className="space-y-4">
          {[
            { emoji: '📖', text: 'כל המתכונים' },
            { emoji: '🤖', text: 'עוזר בישול AI' },
            { emoji: '💰', text: 'מעקב חיסכון' },
            { emoji: '📈', text: 'התקדמות ורמות' },
            { emoji: '🔔', text: 'התראות חכמות' },
          ].map((feature, index) => (
            <motion.div
              key={feature.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center gap-3"
            >
              <span className="text-2xl">{feature.emoji}</span>
              <span className="text-base">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Timeline - How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-card rounded-2xl p-4 border border-border/50"
        >
          <div className="flex justify-between text-center">
            <div className="flex-1">
              <div className="text-lg font-bold">היום</div>
              <p className="text-xs text-muted-foreground">גישה מלאה</p>
            </div>
            <div className="w-px bg-border/50" />
            <div className="flex-1">
              <div className="text-lg font-bold">יום 29</div>
              <p className="text-xs text-muted-foreground">תזכורת</p>
            </div>
            <div className="w-px bg-border/50" />
            <div className="flex-1">
              <div className="text-lg font-bold">יום 30</div>
              <p className="text-xs text-muted-foreground">₪4.99/חודש</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section - Fixed at bottom */}
      <div className="p-6 pb-10 space-y-4">
        <Button
          onClick={handleStartTrial}
          disabled={isStarting}
          className="w-full h-14 rounded-2xl text-base font-semibold bg-foreground text-background hover:bg-foreground/90"
        >
          {isStarting ? (
            <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
          ) : (
            'התחל חודש חינם'
          )}
        </Button>

        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5" />
          <span>לא יחויב תשלום עכשיו</span>
        </div>
      </div>
    </div>
  );
};

export default Premium;
