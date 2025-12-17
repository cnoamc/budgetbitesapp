import React from 'react';
import { TrendingUp, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SavingsCardProps {
  homeCost: number;
  deliveryCost: number;
  title?: string;
  showMonthly?: boolean;
  monthlyMultiplier?: number;
  className?: string;
}

export const SavingsCard: React.FC<SavingsCardProps> = ({
  homeCost,
  deliveryCost,
  title,
  showMonthly = false,
  monthlyMultiplier = 1,
  className,
}) => {
  const savings = deliveryCost - homeCost;
  const monthlySavings = savings * monthlyMultiplier;

  return (
    <div className={cn(
      "bg-card rounded-2xl p-5 shadow-card border border-border/50",
      className
    )}>
      {title && (
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          {title}
        </h3>
      )}
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">בישול ביתי</span>
          <span className="font-bold text-foreground text-lg">₪{homeCost}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">משלוח</span>
          <span className="font-medium text-muted-foreground line-through">₪{deliveryCost}</span>
        </div>
        
        <div className="h-px bg-border my-3" />
        
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 text-savings font-medium">
            <TrendingUp className="w-4 h-4" />
            חיסכון
          </span>
          <span className="font-bold text-savings text-xl animate-fade-in">₪{savings}</span>
        </div>

        {showMonthly && monthlyMultiplier > 1 && (
          <div className="bg-savings-light rounded-xl p-4 mt-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <span className="text-savings font-medium">חיסכון חודשי</span>
              <span className="font-bold text-savings text-2xl animate-scale-in" style={{ animationDelay: '0.1s' }}>₪{monthlySavings}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              על בסיס {monthlyMultiplier} הזמנות בחודש
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
