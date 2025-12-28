import React from 'react';
import { cn } from '@/lib/utils';

interface ScrollablePageLayoutProps {
  children: React.ReactNode;
  className?: string;
  hasBottomNav?: boolean;
}

/**
 * A layout wrapper for pages with BottomNav that need scrollable content.
 * The container is fixed to screen height, but ONLY the content area scrolls.
 * Optimized for iOS native apps - outer container is fixed, inner content scrolls.
 * Use for: Home, Recipes, Progress, Profile, Savings
 */
export const ScrollablePageLayout: React.FC<ScrollablePageLayoutProps> = ({
  children,
  className,
  hasBottomNav = true,
}) => {
  // Account for bottom nav height (~100px including safe area)
  const bottomPadding = hasBottomNav ? 'pb-28' : '';
  
  return (
    <div 
      className={cn(
        "fixed inset-0 w-full h-full overflow-hidden flex flex-col",
        className
      )}
      style={{
        height: '100dvh',
        minHeight: '-webkit-fill-available',
      }}
      dir="rtl"
    >
      <div 
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden overscroll-contain",
          "-webkit-overflow-scrolling-touch",
          bottomPadding
        )}
        data-scrollable="true"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollablePageLayout;
