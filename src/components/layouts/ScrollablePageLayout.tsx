import React from 'react';
import { cn } from '@/lib/utils';

interface ScrollablePageLayoutProps {
  children: React.ReactNode;
  className?: string;
  hasBottomNav?: boolean;
}

/**
 * A layout wrapper for pages with BottomNav that need scrollable content.
 * Use for: Home, Recipes, Progress, Profile, Savings
 */
export const ScrollablePageLayout: React.FC<ScrollablePageLayoutProps> = ({
  children,
  className,
  hasBottomNav = true,
}) => {
  return (
    <div 
      className={cn(
        "min-h-screen min-h-dvh flex flex-col",
        className
      )}
      dir="rtl"
    >
      <div 
        className={cn(
          "flex-1 overflow-y-auto",
          hasBottomNav ? "pb-24" : ""
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollablePageLayout;
