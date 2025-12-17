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
      {/* Header */}
      <div className="pt-12 pb-6 px-6 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl mb-3"
        >
          👨‍🍳
        </motion.div>
        <h1 className="text-2xl font-bold">חודש ראשון חינם</h1>
        <p className="text-muted-foreground text-sm mt-1">בטל בכל עת • נזכיר לך לפני</p>
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
