import React from 'react';
import { Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/PremiumCard';

interface ActionPromptCardProps {
  recipeName: string;
  emoji: string;
  minutes: number;
  savings: number;
  onAction?: () => void;
  className?: string;
}

export const ActionPromptCard: React.FC<ActionPromptCardProps> = ({
  recipeName,
  emoji,
  minutes,
  savings,
  onAction,
  className = '',
}) => {
  return (
    <PremiumCard 
      variant="glass" 
      hoverable={!!onAction}
      onClick={onAction}
      className={`p-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl">{emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm mb-1">{recipeName}</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{minutes} דקות</span>
            </div>
            <span className="bg-savings-light text-savings px-2 py-0.5 rounded-full text-xs font-medium">
              חיסכון ₪{savings}
            </span>
          </div>
        </div>
        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
      </div>
    </PremiumCard>
  );
};
