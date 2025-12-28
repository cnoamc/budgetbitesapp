import React from 'react';
import { motion } from 'framer-motion';
import { Capacitor } from '@capacitor/core';

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const pageTransition = {
  type: 'tween' as const,
  ease: 'easeInOut' as const,
  duration: 0.15,
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const isNative = Capacitor.isNativePlatform();

  // On native iOS WebViews, opacity transitions can get stuck and block taps.
  // Disable fade animation on native for reliability.
  if (isNative) {
    return (
      <div className="w-full h-full min-h-0 flex flex-col" style={{ pointerEvents: 'auto' }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full h-full min-h-0 flex flex-col"
      style={{ pointerEvents: 'auto' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
