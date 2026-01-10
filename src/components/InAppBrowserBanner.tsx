import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInAppBrowser } from '@/hooks/useInAppBrowser';
import { cn } from '@/lib/utils';

interface InAppBrowserBannerProps {
  className?: string;
}

export const InAppBrowserBanner: React.FC<InAppBrowserBannerProps> = ({ className }) => {
  const { showBanner, dismissBanner, openExternal, isInAppBrowser } = useInAppBrowser();

  if (!isInAppBrowser) return null;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            "fixed top-0 left-0 right-0 z-[100] bg-primary text-primary-foreground",
            "pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 px-4",
            className
          )}
          dir="rtl"
        >
          <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">
                חוויית שימוש טובה יותר נפתחת בדפדפן רגיל
              </p>
            </div>

            {/* Open in browser button */}
            <button
              onClick={openExternal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-sm font-semibold transition-colors shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
              <span>פתח בדפדפן</span>
            </button>

            {/* Dismiss button */}
            <button
              onClick={dismissBanner}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors shrink-0"
              aria-label="סגור"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InAppBrowserBanner;
