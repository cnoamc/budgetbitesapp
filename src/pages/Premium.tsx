import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FixedScreenLayout } from '@/components/layouts';
import appIcon from '@/assets/app-icon.png';

const Premium: React.FC = () => {
  const navigate = useNavigate();

  const upcomingFeatures = [
    '☁️ גיבוי בענן',
    '📖 מתכונים ללא הגבלה',
    '📊 אנליטיקס ותובנות',
    '🤖 עוזר בישול AI מתקדם',
    '💰 מעקב חיסכון מלא',
    '🔔 התראות חכמות',
  ];

  return (
    <FixedScreenLayout>
      {/* Soft gradient background */}
      <div 
        className="fixed inset-0" 
        style={{ background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--muted)) 100%)' }} 
      />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col" dir="rtl">
        {/* Header */}
        <div className="p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-card rounded-full flex items-center justify-center shadow-card"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="relative inline-block mb-6"
          >
            <div 
              className="w-20 h-20 rounded-[24px] overflow-hidden mx-auto"
              style={{ boxShadow: '0 12px 40px -10px rgba(0, 0, 0, 0.15)' }}
            >
              <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold mb-2">Premium בקרוב</h1>
            <p className="text-muted-foreground mb-8">
              אנחנו בונים את זה נכון 💛
            </p>
          </motion.div>

          {/* Upcoming Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-5 border border-border/50 shadow-card w-full max-w-sm"
          >
            <p className="text-sm font-medium text-muted-foreground mb-4">מה יהיה כלול:</p>
            <div className="space-y-3">
              {upcomingFeatures.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <span>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Love note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-8 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Heart className="w-4 h-4 text-red-400" />
            <span>תודה שאתם איתנו</span>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 pb-8"
        >
          <Button
            onClick={() => navigate('/home')}
            variant="outline"
            className="w-full h-12 rounded-xl"
          >
            חזרה לאפליקציה
          </Button>
        </motion.div>
      </div>
    </FixedScreenLayout>
  );
};

export default Premium;