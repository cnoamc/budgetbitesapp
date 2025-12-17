import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Shield, Bell, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';
import chefIcon from '@/assets/chef-icon.png';

const Premium: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { subscription, loading: subLoading, hasStartedTrial, startTrial } = useSubscription();
  const [isStarting, setIsStarting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/signin');
    }
  }, [user, authLoading, navigate]);

  // Redirect if already started trial
  useEffect(() => {
    if (!subLoading && subscription && hasStartedTrial) {
      navigate('/home');
    }
  }, [subscription, subLoading, hasStartedTrial, navigate]);

  const features = [
    'גישה מלאה לכל המתכונים',
    'עוזר בישול AI אישי - שפי 👨‍🍳',
    'מעקב חיסכון מפורט',
    'התקדמות ורמות מיומנות',
    'התראות חכמות ומותאמות אישית',
  ];

  const handleStartTrial = async () => {
    setIsStarting(true);
    
    // Start the trial in database
    await startTrial();
    
    toast.success('תקופת הניסיון החלה! 🎉');
    toast('תזכורת לביטול מופעלת אוטומטית', {
      description: 'נזכיר לך יום לפני סיום התקופה',
      icon: <Bell className="w-4 h-4" />,
    });
    
    navigate('/home');
  };

  if (authLoading || subLoading) {
    return (
      <div className="h-[100dvh] flex items-center justify-center bg-background">
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-glow animate-pulse">
          <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden" dir="rtl">
      {/* Header with gradient */}
      <div className="relative pt-12 pb-8 px-6 text-center">
        <div 
          className="absolute inset-0 opacity-50"
          style={{ background: 'linear-gradient(180deg, hsl(var(--primary) / 0.1) 0%, transparent 100%)' }}
        />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg">
            <img src={chefIcon} alt="BudgetBites Premium" className="w-16 h-16" />
          </div>
          <h1 className="text-2xl font-bold mb-1">BudgetBites Premium</h1>
          <p className="text-muted-foreground">חודש ראשון חינם לחלוטין</p>
        </motion.div>
      </div>

      {/* Features */}
      <div className="flex-1 px-6 overflow-y-auto">
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50 space-y-4">
          <h2 className="font-semibold text-sm text-muted-foreground">מה כלול:</h2>
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 bg-card rounded-2xl p-5 shadow-card border border-border/50 text-center"
        >
          <div className="inline-flex items-baseline gap-1 mb-2">
            <span className="text-5xl font-bold">₪4.99</span>
            <span className="text-muted-foreground text-lg">/חודש</span>
          </div>
          <p className="text-sm text-muted-foreground">אחרי 30 יום של ניסיון חינם</p>
          
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <CreditCard className="w-4 h-4" />
              <span>נדרש כרטיס אשראי • לא יחויב עכשיו</span>
            </div>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 space-y-3"
        >
          <h3 className="text-sm font-semibold text-center">איך זה עובד?</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-card/50 rounded-xl p-3">
              <div className="text-lg font-bold text-primary">היום</div>
              <p className="text-xs text-muted-foreground mt-1">גישה מלאה חינם</p>
            </div>
            <div className="bg-card/50 rounded-xl p-3">
              <div className="text-lg font-bold text-primary">יום 29</div>
              <p className="text-xs text-muted-foreground mt-1">נזכיר לך</p>
            </div>
            <div className="bg-card/50 rounded-xl p-3">
              <div className="text-lg font-bold text-primary">יום 30</div>
              <p className="text-xs text-muted-foreground mt-1">₪4.99 לחודש</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="p-6 pb-8 space-y-4 bg-gradient-to-t from-background via-background to-transparent">
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

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            <span>בטל בכל עת</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bell className="w-4 h-4" />
            <span>תזכורת אוטומטית</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
