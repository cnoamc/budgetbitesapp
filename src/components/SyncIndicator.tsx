import React from 'react';
import { Cloud, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SyncIndicatorProps {
  syncing: boolean;
  className?: string;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({ syncing, className }) => {
  return (
    <AnimatePresence mode="wait">
      {syncing ? (
        <motion.div
          key="syncing"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full bg-warning/10 text-warning text-xs",
            className
          )}
        >
          <Cloud className="w-3 h-3 animate-pulse" />
          <span>מסנכרן...</span>
        </motion.div>
      ) : (
        <motion.div
          key="synced"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded-full bg-savings/10 text-savings text-xs",
            className
          )}
        >
          <Check className="w-3 h-3" />
          <span>מסונכרן</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};