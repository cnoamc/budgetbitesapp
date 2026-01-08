import React from 'react';
import { cn } from '@/lib/utils';

interface FixedScreenLayoutProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  dir?: 'rtl' | 'ltr';
}

/**
 * A layout wrapper that fixes the screen to viewport height
 * preventing any scrolling on the page level.
 * Use for: Welcome, Onboarding, SignIn, LoadingSavings, RateMeal, Premium
 */
export const FixedScreenLayout: React.FC<FixedScreenLayoutProps> = ({
  children,
  className,
  style,
  dir = 'rtl',
}) => {
  return (
    <div 
      className={cn(
        "fixed inset-0 flex flex-col overflow-hidden",
        "pt-[var(--safe-top)] pb-[var(--safe-bottom)]",
        className
      )}
      style={style}
      dir={dir}
    >
      {children}
    </div>
  );
};

export default FixedScreenLayout;
