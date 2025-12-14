import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/PremiumCard';

interface InactivityAlertProps {
  daysInactive: number;
  potentialSavingsLost: number;
  onDismiss?: () => void;
  onAction?: () => void;
  className?: string;
}

export const InactivityAlert: React.FC<InactivityAlertProps> = ({
  daysInactive,
  potentialSavingsLost,
  onDismiss,
  onAction,
  className = '',
}) => {
  return (
    <PremiumCard 
      variant="elevated" 
      className={`p-5 border-l-4 border-l-warning ${className}`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">💸</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <p className="font-semibold text-base">
              {daysInactive} ימים בלי בישול
            </p>
            {onDismiss && (
              <button 
                onClick={onDismiss}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            זה אומר שכבר ₪{potentialSavingsLost} יצאו החוצה על משלוחים
          </p>
          
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              onClick={onAction}
              className="rounded-xl btn-press"
            >
              בוא נחזור לבשל
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onDismiss}
              className="rounded-xl text-muted-foreground"
            >
              אחר כך
            </Button>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
};
