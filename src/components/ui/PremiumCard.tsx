import React from 'react';
import { cn } from '@/lib/utils';

interface PremiumCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'glow';
  onClick?: () => void;
  hoverable?: boolean;
  style?: React.CSSProperties;
}

export const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  className,
  variant = 'default',
  onClick,
  hoverable = false,
  style,
}) => {
  const baseStyles = 'rounded-3xl transition-all duration-300';
  
  const variantStyles = {
    default: 'bg-card border border-border/30 shadow-card',
    glass: 'glass-card',
    elevated: 'bg-card border border-border/20 shadow-elevated',
    glow: 'bg-card border border-primary/20 shadow-glow',
  };

  const hoverStyles = hoverable ? 'hover:shadow-elevated hover:-translate-y-1 cursor-pointer active:scale-[0.98]' : '';

  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(baseStyles, variantStyles[variant], hoverStyles, className)}
    >
      {children}
    </div>
  );
};