import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import appLogo from '@/assets/app-logo.png';

interface SplashScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  minDuration = 2000 
}) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: 'linear-gradient(165deg, #F7F8FF 0%, #FFF2E9 45%, #ECFFF4 100%)'
          }}
        >
          {/* Background blobs */}
          <div 
            className="absolute w-80 h-80 rounded-full blur-3xl opacity-30"
            style={{ background: '#FFB088', top: '-5%', right: '-10%' }}
          />
          <div 
            className="absolute w-64 h-64 rounded-full blur-3xl opacity-25"
            style={{ background: '#88DDAA', bottom: '10%', left: '-10%' }}
          />
          <div 
            className="absolute w-48 h-48 rounded-full blur-3xl opacity-20"
            style={{ background: '#88CCFF', top: '40%', left: '60%' }}
          />

          <div className="relative flex flex-col items-center">
            {/* Pulsing glow behind logo */}
            <motion.div
              className="absolute w-40 h-40 rounded-full blur-2xl"
              style={{ 
                background: 'radial-gradient(circle, rgba(255,107,149,0.4) 0%, transparent 70%)' 
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Logo with entrance animation */}
            <motion.div
              className="relative w-28 h-28 rounded-[32px] overflow-hidden shadow-2xl"
              style={{
                boxShadow: '0 25px 80px -15px rgba(255, 107, 149, 0.35), 0 10px 30px -10px rgba(0,0,0,0.15)'
              }}
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotate: 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                duration: 0.8,
              }}
            >
              <motion.img 
                src={appLogo} 
                alt="BudgetBites" 
                className="w-full h-full object-cover"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>

            {/* App name */}
            <motion.p
              className="mt-6 text-lg font-semibold tracking-widest text-gray-600 uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              BudgetBites
            </motion.p>

            {/* Loading dots */}
            <motion.div 
              className="flex gap-1.5 mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-gray-900"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
