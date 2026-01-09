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
 * 
 * Ensures content is never hidden behind the bottom navbar.
 */
export const ScrollablePageLayout: React.FC<ScrollablePageLayoutProps> = ({
  children,
  className,
  hasBottomNav = true,
}) => {
  return (
    <div 
      className={cn(
        "h-full w-full flex flex-col overflow-hidden",
        className
      )}
      dir="rtl"
    >
      <div 
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden"
        )}
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorY: 'contain',
          overscrollBehaviorX: 'none',
          // Proper bottom padding: navbar height (~96px) + safe area + breathing room
          paddingBottom: hasBottomNav 
            ? 'calc(110px + env(safe-area-inset-bottom, 0px) + 12px)' 
            : 'calc(env(safe-area-inset-bottom, 0px) + 12px)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollablePageLayout;
