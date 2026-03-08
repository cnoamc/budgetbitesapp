import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FixedScreenLayout } from '@/components/layouts';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { triggerHaptic } from '@/hooks/useHaptics';
import appIcon from '@/assets/app-icon.png';

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const { hasProfile, loading } = useLocalProfile();
  const { hasChosenLanguage } = useLanguage();

  useEffect(() => {
    triggerHaptic('medium');
  }, []);

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (hasProfile) {
        navigate('/home', { replace: true });
      } else if (!hasChosenLanguage) {
        navigate('/lang', { replace: true });
      } else {
        navigate('/welcome', { replace: true });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [loading, hasProfile, hasChosenLanguage, navigate]);

  return (
    <FixedScreenLayout className="items-center justify-center" style={{ background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)' }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ 
          scale: [0.5, 1.15, 1],
          opacity: 1,
          rotate: [0, 10, -10, 5, 0],
        }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <div 
          className="w-32 h-32 rounded-[32px] overflow-hidden"
          style={{ boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4)' }}
        >
          <img src={appIcon} alt="Chefi" className="w-full h-full object-cover" />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-white text-2xl font-bold mt-6"
      >
        שפי – Chefi
      </motion.p>
    </FixedScreenLayout>
  );
};

export default Splash;
