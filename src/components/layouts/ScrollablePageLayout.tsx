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
        "screen-container",
        className
      )}
      dir="rtl"
    >
      <div 
        className={cn(
          "scroll-container scrollbar-hide",
          hasBottomNav ? "pb-safe-24" : "pb-safe"
        )}
        data-scrollable="true"
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollablePageLayout;
