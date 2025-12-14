import React from 'react';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { getSmartSavingsText } from '@/lib/notifications';

interface YearlySavingsInsightProps {
  monthlySavings: number;
  yearlySavings: number;
  isPotential?: boolean;
  className?: string;
}

export const YearlySavingsInsight: React.FC<YearlySavingsInsightProps> = ({
  monthlySavings,
  yearlySavings,
  isPotential = false,
  className = '',
}) => {
  const smartText = getSmartSavingsText(yearlySavings);
  
  return (
    <PremiumCard variant="elevated" className={`p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">💸</span>
        <p className="text-sm text-muted-foreground">
          {isPotential ? 'פוטנציאל החיסכון שלך' : 'החיסכון שלך'}
        </p>
      </div>
      
      {/* Main monthly number */}
      <div className="flex items-baseline gap-2 mb-2 animate-fade-in">
        <p className="text-5xl font-bold text-savings">₪{monthlySavings.toLocaleString()}</p>
        <p className="text-lg text-muted-foreground">/ חודש</p>
      </div>
      
      {/* Yearly savings */}
      <p className="text-lg text-muted-foreground mb-4 animate-fade-in" style={{ animationDelay: '50ms' }}>
        ≈ ₪{yearlySavings.toLocaleString()} / שנה
      </p>
      
      {/* Smart context text */}
      <div className="bg-savings-light/50 rounded-xl px-4 py-3 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <p className="text-sm text-savings font-medium">{smartText}</p>
      </div>
    </PremiumCard>
  );
};
