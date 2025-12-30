import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, Plus, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import appLogo from '@/assets/app-logo.png';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const STORAGE_KEY = 'bb_a2hs_shown';

// Detect iOS Safari
const isIOS = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua) && !('MSStream' in window);
};

// Detect if running in standalone mode (already installed)
const isStandalone = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    ('standalone' in window.navigator && (window.navigator as any).standalone === true) ||
    window.matchMedia('(display-mode: standalone)').matches
  );
};

// Detect mobile
const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const AddToHomeScreenPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    // Don't show on desktop or if already installed
    if (!isMobile() || isStandalone()) return;

    // Check if already shown
    const alreadyShown = localStorage.getItem(STORAGE_KEY);
    if (alreadyShown) return;

    setIsIOSDevice(isIOS());

    // For Android/Chrome - listen for beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show after delay
      setTimeout(() => setShowPrompt(true), 4000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // For iOS Safari - show manual instructions after delay
    if (isIOS()) {
      setTimeout(() => setShowPrompt(true), 4000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        localStorage.setItem(STORAGE_KEY, 'true');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-end justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={handleDismiss}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-card rounded-t-3xl p-6 pb-safe"
          dir="rtl"
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 left-4 w-8 h-8 bg-secondary rounded-full flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-elevated mb-4">
              <img src={appLogo} alt="BudgetBites" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-bold mb-2">BudgetBites כאפליקציה</h2>
            <p className="text-muted-foreground text-sm">
              הוסף למסך הבית לגישה מהירה וחוויה מלאה
            </p>
          </div>

          {/* iOS Instructions */}
          {isIOSDevice && (
            <div className="bg-secondary/50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Share className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">איך להוסיף למסך הבית?</p>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-center">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Share className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">לחץ על שיתוף</span>
                </div>
                <div className="text-2xl text-muted-foreground">→</div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">הוסף למסך הבית</span>
                </div>
              </div>
            </div>
          )}

          {/* Android Install Button */}
          {!isIOSDevice && deferredPrompt && (
            <div className="space-y-3">
              <Button 
                onClick={handleInstall} 
                className="w-full h-12 rounded-xl text-base font-medium"
              >
                <Smartphone className="w-5 h-5 ml-2" />
                הוסף למסך הבית
              </Button>
            </div>
          )}

          {/* Dismiss Button */}
          <Button
            variant="ghost"
            onClick={handleDismiss}
            className="w-full h-10 mt-3 text-muted-foreground"
          >
            לא עכשיו
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddToHomeScreenPrompt;
