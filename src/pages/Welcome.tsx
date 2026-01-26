import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FixedScreenLayout } from '@/components/layouts';
import { useInAppBrowser } from '@/hooks/useInAppBrowser';
import { useLocalProfile } from '@/contexts/LocalProfileContext';
import appIcon from '@/assets/app-icon.png';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { hasProfile, loading } = useLocalProfile();
  const { isInAppBrowser, reduceAnimations } = useInAppBrowser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If already has profile, redirect to home
  useEffect(() => {
    if (!loading && hasProfile) {
      navigate('/home', { replace: true });
    }
  }, [hasProfile, loading, navigate]);

  const handleStart = () => {
    navigate('/create-profile');
  };

  if (loading) {
    return (
      <FixedScreenLayout className="items-center justify-center" style={{ background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)' }}>
        <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-2xl animate-pulse">
          <img src={appIcon} alt="שפי – Chefi" className="w-full h-full object-cover" />
        </div>
      </FixedScreenLayout>
    );
  }

  // Animation classes - reduced for in-app browsers
  const animationSpeed = reduceAnimations ? 'duration-100' : 'duration-700';
  const animationDelay = (ms: number) => reduceAnimations ? '0ms' : `${ms}ms`;

  return (
    <FixedScreenLayout>
      {/* Blue gradient background */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)'
        }} 
      />

      {/* Subtle radial glow - hidden in in-app browsers for performance */}
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

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col welcome-hero" dir="rtl">
        
        {/* Hero section */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          {/* App icon with animation */}
          <div 
            className={`relative transition-all ${animationSpeed} ease-out ${
              mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            <div 
              className="w-28 h-28 rounded-[28px] overflow-hidden"
              style={{
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35), 0 15px 30px -10px rgba(0, 0, 0, 0.25)'
              }}
            >
              <img 
                src={appIcon} 
                alt="שפי – Chefi" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Main headline */}
          <div 
            className={`mt-8 text-center transition-all ${animationSpeed} ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: animationDelay(150) }}
          >
            <h1 className="text-4xl font-extrabold text-white mb-3">
              שפי עושה סדר במטבח
            </h1>
            <p className="text-base text-white/80 font-medium leading-relaxed">
              העוזר האישי שלך לבישול חכם, חסכון בכסף ופחות בלגן
            </p>
            <p className="text-xs text-white/50 mt-2">
              מבית BudgetBites
            </p>
          </div>

        </div>

        {/* Bottom CTA section */}
        <div 
          className={`px-6 pb-10 pt-6 welcome-cta transition-all ${animationSpeed} ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: animationDelay(450) }}
        >
          {/* Primary CTA */}
          <Button 
            onClick={handleStart} 
            className="w-full h-[56px] rounded-full text-[17px] font-bold transition-all active:scale-[0.98] bg-white text-[#2196F3] hover:bg-white/95"
            style={{
              boxShadow: '0 8px 30px -6px rgba(0, 0, 0, 0.25)'
            }}
          >
            התחל עכשיו 🚀
          </Button>

          {/* Helper text */}
          <p className="text-center text-sm text-white/60 mt-4">
            ללא הרשמה, ללא כרטיס אשראי
          </p>
        </div>
      </div>
    </FixedScreenLayout>
  );
};

export default Welcome;
