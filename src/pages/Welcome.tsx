import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FixedScreenLayout } from '@/components/layouts';
import { useInAppBrowser } from '@/hooks/useInAppBrowser';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import appIcon from '@/assets/app-icon.png';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { hasProfile, loading } = useLocalProfile();
  const { isInAppBrowser } = useInAppBrowser();
  const { t, dir } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && hasProfile) {
      navigate('/home', { replace: true });
    }
  }, [hasProfile, loading, navigate]);

  const handleStart = () => {
    navigate('/auth');
  };

  if (loading) {
    return (
      <FixedScreenLayout className="items-center justify-center" style={{ background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)' }}>
        <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-2xl animate-pulse">
          <img src={appIcon} alt="Chefi" className="w-full h-full object-cover" />
        </div>
      </FixedScreenLayout>
    );
  }

  return (
    <FixedScreenLayout>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)' }} />

      {!isInAppBrowser && (
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />
      )}

      <div className="relative z-10 flex-1 flex flex-col welcome-hero" dir={dir}>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* Animated chef icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: [0.5, 1.1, 1],
              opacity: 1,
              rotate: [0, 8, -8, 4, 0],
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div 
              className="w-28 h-28 rounded-[28px] overflow-hidden"
              style={{ boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 15px 30px -10px rgba(0, 0, 0, 0.25)' }}
            >
              <img src={appIcon} alt="Chefi" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <h1 className="text-4xl font-extrabold text-white mb-3">{t('welcome.headline')}</h1>
            <p className="text-base text-white/80 font-medium leading-relaxed">{t('welcome.subtitle')}</p>
            <p className="text-xs text-white/50 mt-2">{t('welcome.byline')}</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="px-6 pb-10 pt-6 welcome-cta"
        >
          <Button 
            onClick={handleStart} 
            className="w-full h-[56px] rounded-full text-[17px] font-bold transition-all active:scale-[0.98] bg-white text-[#2196F3] hover:bg-white/95"
            style={{ boxShadow: '0 8px 30px -6px rgba(0, 0, 0, 0.25)' }}
          >
            {t('welcome.cta')}
          </Button>
          <p className="text-center text-sm text-white/60 mt-4">{t('welcome.noSignup')}</p>
        </motion.div>
      </div>
    </FixedScreenLayout>
  );
};

export default Welcome;
