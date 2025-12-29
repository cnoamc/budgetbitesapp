import React, { useEffect } from 'react';
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
 * Optimized for iOS native apps - prevents all rubber-band scrolling.
 * Use for: Welcome, Onboarding, SignIn, LoadingSavings, RateMeal, Premium
 */
export const FixedScreenLayout: React.FC<FixedScreenLayoutProps> = ({
  children,
  className,
  style,
  dir = 'rtl',
}) => {
  // Prevent any touch-based scrolling on this layout
  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      // Only prevent if the target is not inside a scrollable element
      const target = e.target as HTMLElement;
      const scrollableParent = target.closest('[data-scrollable="true"]');
      if (!scrollableParent) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      document.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  return (
    <div 
      className={cn(
        "screen-container no-scroll",
        "pt-safe pb-safe",
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