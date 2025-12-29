import React from 'react';
import { cn } from '@/lib/utils';

interface ScrollablePageLayoutProps {
  children: React.ReactNode;
  className?: string;
  hasBottomNav?: boolean;
}

/**
 * A layout wrapper for pages with BottomNav that need scrollable content.
 * Uses iOS-safe scroll patterns: fixed outer container, scrollable inner content.
 * Use for: Home, Recipes, Progress, Profile, Savings
 */
export const ScrollablePageLayout: React.FC<ScrollablePageLayoutProps> = ({
  children,
  className,
  hasBottomNav = true,
}) => {
  // Bottom nav is ~100px including safe area
  const bottomPadding = hasBottomNav ? 'pb-safe-24' : 'pb-safe';
  
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
          "pt-safe",
          bottomPadding
        )}
        data-scrollable="true"
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollablePageLayout;