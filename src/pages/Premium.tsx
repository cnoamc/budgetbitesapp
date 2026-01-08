import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FixedScreenLayout } from '@/components/layouts';
import confetti from 'canvas-confetti';

const Premium: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    { emoji: '☁️', text: 'גיבוי בענן' },
    { emoji: '📖', text: 'מתכונים ללא הגבלה' },
    { emoji: '📊', text: 'אנליטיקס ותובנות' },
  ];

  const handleStartTrial = () => {
    setIsLoading(true);
    
    // Fire confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1'],
    });

    setTimeout(() => {
      navigate('/home');
    }, 1500);
  };

  return (
    <FixedScreenLayout>
      {/* Dark gradient header background */}
      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute top-10 left-1/4 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col" dir="rtl">
        {/* Header */}
        <div className="p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Chef emoji with pulse */}
        <div className="flex justify-center pt-4 pb-8">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-6xl"
          >
            👨‍🍳
          </motion.div>
        </div>

        {/* Main Content Card */}
        <div className="flex-1 bg-background rounded-t-[32px] px-6 pt-8 pb-6 flex flex-col">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">הפוך לשף מקצועי</h1>
            <p className="text-muted-foreground text-sm">
              גלה את כל הכלים המתקדמים שלנו
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 bg-secondary/50 rounded-xl p-4"
              >
                <span className="text-2xl">{feature.emoji}</span>
                <span className="font-medium">{feature.text}</span>
                <Check className="w-5 h-5 text-green-500 mr-auto" />
              </motion.div>
            ))}
          </div>

          {/* Trial Timeline */}
          <div className="bg-muted/50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div className="text-center">
                <div className="text-lg mb-1">🎉</div>
                <p className="font-medium">היום</p>
                <p className="text-xs text-muted-foreground">גישה מלאה</p>
              </div>
              <div className="flex-1 h-px bg-border mx-3" />
              <div className="text-center">
                <div className="text-lg mb-1">✉️</div>
                <p className="font-medium">יום 29</p>
                <p className="text-xs text-muted-foreground">תזכורת</p>
              </div>
              <div className="flex-1 h-px bg-border mx-3" />
              <div className="text-center">
                <div className="text-lg mb-1">💳</div>
                <p className="font-medium">יום 30</p>
                <p className="text-xs text-muted-foreground">חיוב</p>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              <Lock className="w-4 h-4 inline-block ml-1" />
              ללא תשלום עכשיו • בטל בכל עת 💚
            </p>
          </div>

          {/* CTA Button with shimmer */}
          <div className="mt-auto">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleStartTrial}
                disabled={isLoading}
                className="w-full h-14 rounded-2xl text-lg font-semibold relative overflow-hidden bg-gradient-to-r from-primary to-blue-600"
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <span className="relative z-10">
                  {isLoading ? 'מתחיל...' : 'התחל 30 יום חינם'}
                </span>
              </Button>
            </motion.div>

            <button
              onClick={() => navigate('/home')}
              className="w-full text-center text-sm text-muted-foreground py-4"
            >
              אולי אחר כך
            </button>
          </div>
        </div>
      </div>
    </FixedScreenLayout>
  );
};

export default Premium;
