import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Smartphone, Share, MoreVertical, Plus, Check, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import appIcon from '@/assets/app-icon.png';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type Platform = 'ios' | 'android' | 'desktop' | 'unknown';

const Install: React.FC = () => {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState<Platform>('unknown');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Detect platform
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios');
    } else if (/android/.test(ua)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt (Chrome/Android)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch (error) {
      console.error('Install prompt error:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 }
    })
  };

  return (
    <div className="screen-container bg-background" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pt-safe border-b border-border">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -mr-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">התקנת האפליקציה</h1>
      </div>

      <div className="scroll-container p-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-24 h-24 mx-auto mb-4 rounded-[24px] overflow-hidden shadow-elevated"
          >
            <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold mb-2"
          >
            {isInstalled ? 'האפליקציה מותקנת! ✨' : 'הוסף למסך הבית'}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground"
          >
            {isInstalled 
              ? 'האפליקציה זמינה במסך הבית שלך'
              : 'גישה מהירה ללא צורך להוריד מהחנות'
            }
          </motion.p>
        </div>

        {/* Already Installed */}
        <AnimatePresence mode="wait">
          {isInstalled ? (
            <motion.div
              key="installed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">האפליקציה מותקנת!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                תוכל למצוא אותה במסך הבית שלך
              </p>
              <Button onClick={() => navigate('/home')} className="w-full">
                חזרה לאפליקציה
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="instructions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Android with Install Prompt */}
              {platform === 'android' && deferredPrompt && (
                <div className="mb-6">
                  <Button
                    onClick={handleInstallClick}
                    disabled={isInstalling}
                    className="w-full h-14 text-lg font-semibold"
                  >
                    {isInstalling ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        מתקין...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 ml-2" />
                        התקן עכשיו
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Benefits */}
              <div className="bg-muted/30 rounded-2xl p-4 mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  למה להתקין?
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>גישה מהירה מהמסך הראשי</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>עובד גם אופליין</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>חווית אפליקציה מלאה</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">✓</span>
                    <span>לא תופס מקום בזיכרון</span>
                  </li>
                </ul>
              </div>

              {/* Platform-specific Instructions */}
              {platform === 'ios' && (
                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <div className="bg-gray-900 text-white p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-lg font-bold">S</span>
                    </div>
                    <div>
                      <p className="font-semibold">Safari</p>
                      <p className="text-sm text-gray-400">iPhone / iPad</p>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {[
                      { icon: Share, text: 'לחץ על כפתור השיתוף', subtext: 'בתחתית המסך' },
                      { icon: Plus, text: 'בחר "הוסף למסך הבית"', subtext: 'גלול למטה ברשימה' },
                      { icon: Check, text: 'לחץ "הוסף"', subtext: 'בפינה העליונה' }
                    ].map((step, i) => (
                      <motion.div
                        key={i}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={stepVariants}
                        className="flex items-start gap-4"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                          <span className="font-bold text-primary">{i + 1}</span>
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center gap-2">
                            <step.icon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{step.text}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{step.subtext}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Visual Guide */}
                  <div className="border-t border-border p-4 bg-muted/30">
                    <div className="flex items-center justify-center gap-8">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Share className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground">שיתוף</p>
                      </div>
                      <div className="text-2xl text-muted-foreground">→</div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-background border border-border rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Plus className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground">הוסף למסך</p>
                      </div>
                      <div className="text-2xl text-muted-foreground">→</div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-2">
                          <img src={appIcon} alt="" className="w-8 h-8 rounded-lg" />
                        </div>
                        <p className="text-xs text-muted-foreground">סיום</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {platform === 'android' && !deferredPrompt && (
                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <div className="bg-green-600 text-white p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-lg font-bold">C</span>
                    </div>
                    <div>
                      <p className="font-semibold">Chrome</p>
                      <p className="text-sm text-green-100">Android</p>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    {[
                      { icon: MoreVertical, text: 'לחץ על תפריט', subtext: 'שלוש נקודות בפינה' },
                      { icon: Download, text: 'בחר "התקן אפליקציה"', subtext: 'או "הוסף למסך הבית"' },
                      { icon: Check, text: 'אשר את ההתקנה', subtext: 'האייקון יופיע במסך הבית' }
                    ].map((step, i) => (
                      <motion.div
                        key={i}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={stepVariants}
                        className="flex items-start gap-4"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                          <span className="font-bold text-primary">{i + 1}</span>
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex items-center gap-2">
                            <step.icon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{step.text}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">{step.subtext}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {platform === 'desktop' && (
                <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
                  <div className="bg-gradient-to-l from-blue-600 to-purple-600 text-white p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold">דפדפן מחשב</p>
                      <p className="text-sm text-white/80">Chrome / Edge / Safari</p>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      לחווית השימוש הטובה ביותר, מומלץ לפתוח את האפליקציה בטלפון הנייד.
                    </p>
                    
                    {deferredPrompt ? (
                      <Button onClick={handleInstallClick} className="w-full">
                        <Download className="w-4 h-4 ml-2" />
                        התקן כאפליקציה
                      </Button>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        <p className="mb-2">בדפדפני Chrome/Edge:</p>
                        <ul className="space-y-1 mr-4">
                          <li>• חפש אייקון התקנה בשורת הכתובת</li>
                          <li>• או: תפריט → "התקן..."</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Help Link */}
        {!isInstalled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() => navigate('/support')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              צריך עזרה? צור קשר
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Install;
