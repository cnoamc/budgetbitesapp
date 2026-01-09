import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { FixedScreenLayout } from '@/components/layouts';

const Premium: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    { emoji: '☁️', text: 'גיבוי בענן' },
    { emoji: '📖', text: 'מתכונים ללא הגבלה' },
    { emoji: '📊', text: 'אנליטיקס ותובנות' },
  ];

  return (
    <FixedScreenLayout>
      {/* Soft gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      
      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col" dir="rtl">
        {/* Header */}
        <div className="p-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Chef emoji */}
        <div className="flex justify-center pt-8 pb-6">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl"
          >
            👨‍🍳
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-6 flex flex-col">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold text-sm">בקרוב</span>
            </div>
            <h1 className="text-2xl font-bold mb-2">Premium</h1>
            <p className="text-muted-foreground">
              אנחנו עובדים על משהו מיוחד בשבילך
            </p>
          </div>

          {/* Features Preview */}
          <div className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 bg-card rounded-xl p-4 border border-border/50"
              >
                <span className="text-2xl">{feature.emoji}</span>
                <span className="font-medium text-muted-foreground">{feature.text}</span>
              </motion.div>
            ))}
          </div>

          {/* Info Card */}
          <div className="bg-muted/50 rounded-2xl p-5 text-center mb-6">
            <p className="text-sm text-muted-foreground">
              הגרסה המתקדמת נמצאת בפיתוח.<br/>
              נעדכן אותך כשהיא תהיה מוכנה! 🚀
            </p>
          </div>

          {/* Back Button */}
          <div className="mt-auto pb-6">
            <Button
              onClick={() => navigate('/home')}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              חזרה לאפליקציה
            </Button>
          </div>
        </div>
      </div>
    </FixedScreenLayout>
  );
};

export default Premium;
