import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/PremiumCard';

interface SavingsComparisonCardProps {
  recipeName: string;
  emoji: string;
  deliveryCost: number;
  homeCost: number;
  onCook?: () => void;
  className?: string;
}

export const SavingsComparisonCard: React.FC<SavingsComparisonCardProps> = ({
  recipeName,
  emoji,
  deliveryCost,
  homeCost,
  onCook,
  className = '',
}) => {
  const savings = deliveryCost - homeCost;
  
  return (
    <PremiumCard variant="elevated" className={`p-5 ${className}`}>
      <div className="flex items-start gap-4">
        <span className="text-4xl">{emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base mb-3">{recipeName}</p>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-0.5">משלוח</p>
              <p className="text-lg font-medium text-muted-foreground line-through">₪{deliveryCost}</p>
            </div>
            <div className="text-xl text-muted-foreground">→</div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-0.5">בבית</p>
              <p className="text-lg font-bold text-foreground">₪{homeCost}</p>
            </div>
          </div>
          
          <div className="bg-savings-light rounded-xl px-4 py-2.5 flex items-center justify-between">
            <span className="text-sm font-medium text-savings">חיסכון</span>
            <span className="text-xl font-bold text-savings">₪{savings}</span>
          </div>
        </div>
      </div>
      
      {onCook && (
        <Button onClick={onCook} className="w-full mt-4 h-11 rounded-xl btn-press">
          בוא נבשל!
          <ArrowLeft className="w-4 h-4" />
        </Button>
      )}
    </PremiumCard>
  );
};
