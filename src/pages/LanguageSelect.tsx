import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FixedScreenLayout } from '@/components/layouts';
import { useLanguage } from '@/contexts/LanguageContext';
import { triggerHaptic } from '@/hooks/useHaptics';
import appIcon from '@/assets/app-icon.png';

const LanguageSelect: React.FC = () => {
  const navigate = useNavigate();
  const { setLocale } = useLanguage();

  const handleSelect = (locale: 'he' | 'en') => {
    triggerHaptic('light');
    setLocale(locale);
    navigate('/welcome', { replace: true });
  };

  return (
    <FixedScreenLayout className="items-center justify-center" style={{ background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)' }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-[24px] overflow-hidden mb-8" style={{ boxShadow: '0 20px 50px -15px rgba(0,0,0,0.3)' }}>
          <img src={appIcon} alt="Chefi" className="w-full h-full object-cover" />
        </div>

        <h1 className="text-white text-2xl font-bold mb-2">Choose Language / בחר שפה</h1>
        <p className="text-white/70 text-sm mb-10">You can change this later in settings</p>

        <div className="flex gap-4 w-full max-w-xs px-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect('he')}
            className="flex-1 flex flex-col items-center gap-3 py-6 px-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 transition-colors"
          >
            <span className="text-4xl">🇮🇱</span>
            <span className="text-lg font-bold">עברית</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect('en')}
            className="flex-1 flex flex-col items-center gap-3 py-6 px-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white hover:bg-white/25 transition-colors"
          >
            <span className="text-4xl">🇺🇸</span>
            <span className="text-lg font-bold">English</span>
          </motion.button>
        </div>
      </motion.div>
    </FixedScreenLayout>
  );
};

export default LanguageSelect;
