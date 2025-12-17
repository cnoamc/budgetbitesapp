import React, { useState } from 'react';
import { Check, Shield, Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface PremiumPaywallProps {
  onStartTrial: () => void;
  isLoading?: boolean;
}

export const PremiumPaywall: React.FC<PremiumPaywallProps> = ({ onStartTrial, isLoading }) => {
  const features = [
    'גישה לכל המתכונים',
    'עוזר בישול AI אישי',
    'מעקב חיסכון מלא',
    'התקדמות ורמות',
    'התראות חכמות',
  ];

  return (
    <div className="flex flex-col h-full" dir="rtl">
      {/* Header */}
      <div className="text-center pt-8 pb-6 px-6">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <span className="text-4xl">👨‍🍳</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">BudgetBites Premium</h1>
        <p className="text-muted-foreground">התחל לחסוך עם חודש ראשון חינם</p>
      </div>

      {/* Features */}
      <div className="flex-1 px-6">
        <div className="bg-card/50 rounded-2xl p-4 space-y-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm">{feature}</span>
            </motion.div>
          ))}
        </div>

        {/* Pricing */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-baseline gap-1">
            <span className="text-4xl font-bold">₪4.99</span>
            <span className="text-muted-foreground">/חודש</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">אחרי החודש הראשון החינמי</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="p-6 space-y-4">
        <Button
          onClick={onStartTrial}
          disabled={isLoading}
          className="w-full h-14 rounded-2xl text-base font-semibold bg-foreground text-background hover:bg-foreground/90"
        >
          {isLoading ? (
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
            <span>תזכורת לפני החיוב</span>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          לא יחויב תשלום כרגע. נזכיר לך לפני סיום התקופה.
        </p>
      </div>
    </div>
  );
};

// Trial reminder banner for Profile page
export const TrialReminderBanner: React.FC<{
  daysLeft: number;
  reminderEnabled: boolean;
  onToggleReminder: () => void;
}> = ({ daysLeft, reminderEnabled, onToggleReminder }) => {
  if (daysLeft <= 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="font-medium text-sm">
            {daysLeft === 1 ? 'יום אחרון' : `${daysLeft} ימים`} לסיום תקופת הניסיון
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {reminderEnabled ? 'נזכיר לך יום לפני ✓' : 'הפעל תזכורת לפני סיום'}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleReminder}
          className={`text-xs h-8 ${reminderEnabled ? 'text-primary' : ''}`}
        >
          <Bell className={`w-4 h-4 ${reminderEnabled ? 'fill-current' : ''}`} />
        </Button>
      </div>
    </div>
  );
};
