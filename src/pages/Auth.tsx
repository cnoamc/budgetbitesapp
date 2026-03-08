import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FixedScreenLayout } from '@/components/layouts';
import { useLanguage } from '@/contexts/LanguageContext';
import { lovable } from '@/integrations/lovable/index';
import { triggerHaptic } from '@/hooks/useHaptics';
import appIcon from '@/assets/app-icon.png';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { t, dir } = useLanguage();
  const [loading, setLoading] = useState<string | null>(null);

  const handleOAuth = async (provider: 'google' | 'apple') => {
    setLoading(provider);
    triggerHaptic('light');
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: window.location.origin,
      });
      if (result?.error) {
        console.error('OAuth error:', result.error);
        setLoading(null);
      }
      // If redirected, page will navigate away
    } catch (err) {
      console.error('OAuth error:', err);
      setLoading(null);
    }
  };

  const handleGuest = () => {
    triggerHaptic('light');
    navigate('/create-profile');
  };

  return (
    <FixedScreenLayout>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)' }} />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6" dir={dir}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div 
            className="w-24 h-24 rounded-[28px] overflow-hidden mb-6"
            style={{ boxShadow: '0 25px 60px -15px rgba(0,0,0,0.35)' }}
          >
            <img src={appIcon} alt="Chefi" className="w-full h-full object-cover" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">{t('auth.title')}</h1>
          <p className="text-white/80 text-base mb-10">{t('auth.subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-sm space-y-3"
        >
          {/* Google */}
          <Button
            onClick={() => handleOAuth('google')}
            disabled={!!loading}
            className="w-full h-14 rounded-2xl text-base font-semibold bg-white text-foreground hover:bg-white/95 shadow-lg flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {loading === 'google' ? '...' : t('auth.google')}
          </Button>

          {/* Apple */}
          <Button
            onClick={() => handleOAuth('apple')}
            disabled={!!loading}
            className="w-full h-14 rounded-2xl text-base font-semibold bg-black text-white hover:bg-black/90 shadow-lg flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            {loading === 'apple' ? '...' : t('auth.apple')}
          </Button>

          {/* Guest */}
          <Button
            variant="ghost"
            onClick={handleGuest}
            disabled={!!loading}
            className="w-full h-12 text-white/80 hover:text-white hover:bg-white/10 text-base"
          >
            {t('auth.guest')}
          </Button>
        </motion.div>

        {/* Terms */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-white/50 text-xs text-center mt-8 max-w-xs leading-relaxed"
        >
          {t('auth.terms')}{' '}
          <a href="/terms" className="underline text-white/70">{t('auth.termsLink')}</a>{' '}
          {t('auth.and')}{' '}
          <a href="/privacy" className="underline text-white/70">{t('auth.privacyLink')}</a>
        </motion.p>
      </div>
    </FixedScreenLayout>
  );
};

export default Auth;
