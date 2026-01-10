import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChefHat, TrendingDown, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { FixedScreenLayout } from '@/components/layouts';
import { useInAppBrowser } from '@/hooks/useInAppBrowser';
import appIcon from '@/assets/app-icon.png';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { isGuest, enterAsGuest, premiumPopupSeen, openPremiumPopup, markPopupSeen } = useGuest();
  const { isInAppBrowser, reduceAnimations } = useInAppBrowser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If already logged in or guest, redirect to home
  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/home', { replace: true });
      } else if (isGuest) {
        navigate('/home', { replace: true });
      }
    }
  }, [user, loading, isGuest, navigate]);

  const handleContinueAsGuest = () => {
    enterAsGuest();
    
    // Show premium popup after entering as guest (if not seen before)
    setTimeout(() => {
      if (!premiumPopupSeen) {
        openPremiumPopup();
        markPopupSeen();
      }
    }, 500);
    
    navigate('/home');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  if (loading) {
    return (
      <FixedScreenLayout className="items-center justify-center" style={{ background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)' }}>
        <div className="w-24 h-24 rounded-[28px] overflow-hidden shadow-2xl animate-pulse">
          <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
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
                alt="BudgetBites" 
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
              פחות בלגן, פחות התלבטויות, יותר זמן לעצמך.
            </p>
          </div>

          {/* Feature cards */}
          <div 
            className={`mt-8 w-full max-w-xs space-y-3 transition-all ${animationSpeed} ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{ transitionDelay: animationDelay(300) }}
          >
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">שפי – עוזר בישול חכם צעד־אחר־צעד</p>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">מאות מתכונים זמינים בכל רגע</p>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">עלות מצרכים ברורה לפני שמבשלים</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA section */}
        <div 
          className={`px-6 pb-10 pt-6 welcome-cta transition-all ${animationSpeed} ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: animationDelay(450) }}
        >
          {/* Launch badge */}
          <div className="flex justify-center mb-5">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <p className="text-white text-sm font-medium">
                🎉 חינם בתקופת ההשקה
              </p>
            </div>
          </div>

          {/* Primary CTA */}
          <Button 
            onClick={handleContinueAsGuest} 
            className="w-full h-[56px] rounded-full text-[17px] font-bold transition-all active:scale-[0.98] bg-white text-[#2196F3] hover:bg-white/95"
            style={{
              boxShadow: '0 8px 30px -6px rgba(0, 0, 0, 0.25)'
            }}
          >
            התחל עכשיו
          </Button>

          {/* Secondary CTA */}
          <Button 
            onClick={handleSignIn}
            variant="outline"
            className="w-full h-[52px] rounded-full text-[16px] font-medium mt-3 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
          >
            התחברות / הרשמה
          </Button>

          {/* Helper text */}
          <p className="text-center text-sm text-white/60 mt-4">
            אפשר להתחיל עכשיו בלי חשבון
          </p>
        </div>
      </div>
    </FixedScreenLayout>
  );
};

export default Welcome;