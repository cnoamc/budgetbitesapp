import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, PanInfo, useAnimation } from 'framer-motion';
import { triggerHaptic } from '@/hooks/useHaptics';

// Main navigation pages in order (RTL - swipe left goes forward)
const mainPages = ['/home', '/recipes', '/progress', '/profile'];

interface SwipeNavigationProps {
  children: React.ReactNode;
}

export const SwipeNavigation: React.FC<SwipeNavigationProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const controls = useAnimation();

  const currentIndex = mainPages.indexOf(location.pathname);
  const isMainPage = currentIndex !== -1;

  const handleDragEnd = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (!isMainPage) return;

      const threshold = 50; // minimum swipe distance
      const velocity = 0.3; // minimum velocity

      // RTL layout: swipe left = next page, swipe right = previous page
      if (info.offset.x < -threshold || info.velocity.x < -velocity) {
        // Swipe left - go to next page (in RTL this feels natural)
        if (currentIndex < mainPages.length - 1) {
          triggerHaptic('light');
          navigate(mainPages[currentIndex + 1]);
        }
      } else if (info.offset.x > threshold || info.velocity.x > velocity) {
        // Swipe right - go to previous page
        if (currentIndex > 0) {
          triggerHaptic('light');
          navigate(mainPages[currentIndex - 1]);
        }
      }

      // Reset position
      controls.start({ x: 0 });
    },
    [currentIndex, isMainPage, navigate, controls]
  );

  if (!isMainPage) {
    return <>{children}</>;
  }

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.1}
      onDragEnd={handleDragEnd}
      animate={controls}
      className="min-h-screen touch-pan-y"
      style={{ touchAction: 'pan-y' }}
    >
      {children}
    </motion.div>
  );
};