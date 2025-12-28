import React from 'react';
import { cn } from '@/lib/utils';

interface ScrollablePageLayoutProps {
  children: React.ReactNode;
  className?: string;
  hasBottomNav?: boolean;
}

/**
 * A layout wrapper for pages with BottomNav that need scrollable content.
 * The container is fixed to screen height, but the content area scrolls.
 * Use for: Home, Recipes, Progress, Profile, Savings
 */
export const ScrollablePageLayout: React.FC<ScrollablePageLayoutProps> = ({
  children,
  className,
  hasBottomNav = true,
}) => {
  // Account for bottom nav height (80px) + safe area
  const bottomPadding = hasBottomNav ? 'pb-24' : '';
  
  return (
    <div 
      className={cn(
        "h-[100dvh] w-full overflow-hidden flex flex-col",
        className
      )}
      dir="rtl"
    >
      <div className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden",
        bottomPadding
      )}>
        {children}
      </div>
    </div>
  );
};

export default ScrollablePageLayout;
