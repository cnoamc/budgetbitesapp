import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Capacitor } from '@capacitor/core';

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
  // Prevent iOS overscroll/bounce on fixed screens
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const preventTouchMove = (e: TouchEvent) => {
        // Allow scrolling within scrollable children
        const target = e.target as HTMLElement;
        const isScrollable = target.closest('[data-scrollable="true"]');
        if (!isScrollable) {
          e.preventDefault();
        }
      };

      document.addEventListener('touchmove', preventTouchMove, { passive: false });
      return () => {
        document.removeEventListener('touchmove', preventTouchMove);
      };
    }
  }, []);

  return (
    <div 
      className={cn(
        "min-h-screen min-h-dvh flex flex-col overflow-hidden",
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
