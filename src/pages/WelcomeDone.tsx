import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FixedScreenLayout } from '@/components/layouts';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import { triggerHaptic } from '@/hooks/useHaptics';
import appIcon from '@/assets/app-icon.png';

const WelcomeDone: React.FC = () => {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const { profile } = useLocalProfile();

  useEffect(() => {
    triggerHaptic('success');
    
    // Fire confetti
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#2196F3', '#00BCD4', '#FF9800', '#4CAF50'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#2196F3', '#00BCD4', '#FF9800', '#4CAF50'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    const timer = setTimeout(() => {
      navigate('/home', { replace: true });
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const name = profile?.name || '';

  return (
    <FixedScreenLayout className="items-center justify-center" style={{ background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)' }}>
      <div className="flex flex-col items-center text-center px-6" dir={dir} onClick={() => navigate('/home', { replace: true })}>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div 
            className="w-28 h-28 rounded-[28px] overflow-hidden"
            style={{ boxShadow: '0 25px 60px -15px rgba(0,0,0,0.4)' }}
          >
            <img src={appIcon} alt="Chefi" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-white mt-8"
        >
          {t('done.welcome')}{name ? `, ${name}` : ''}! 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-white/80 text-base mt-3"
        >
          {t('done.ready')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 1] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
          className="text-white/50 text-sm mt-10"
        >
          {t('done.tapToStart')}
        </motion.p>
      </div>
    </FixedScreenLayout>
  );
};

export default WelcomeDone;
