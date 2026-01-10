import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useGuest } from '@/contexts/GuestContext';
import { FixedScreenLayout } from '@/components/layouts';
import appIcon from '@/assets/app-icon.png';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { isGuest, enterAsGuest, premiumPopupSeen, openPremiumPopup, markPopupSeen } = useGuest();
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

  return (
    <FixedScreenLayout>
      {/* Blue gradient background */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)'
        }} 
      />

      {/* Subtle radial glow */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col" dir="rtl">
        
        {/* App icon section */}
        <div className="flex-1 flex flex-col items-center justify-center pt-12">
          <div 
            className={`relative transition-all duration-700 ease-out ${
              mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
          >
            {/* Icon with shadow and rounded corners */}
            <div 
              className="w-32 h-32 rounded-[32px] overflow-hidden"
              style={{
                boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.3), 0 10px 20px -10px rgba(0, 0, 0, 0.2)'
              }}
            >
              <img 
                src={appIcon} 
                alt="BudgetBites" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Welcome title */}
          <div 
            className={`mt-8 transition-all duration-700 ${
              mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <h1 className="text-4xl font-bold text-white text-center">
              ברוך הבא 👋
            </h1>
          </div>
        </div>

        {/* Bottom section with buttons */}
        <div 
          className={`px-6 pb-10 pt-4 transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          {/* App name */}
          <p className="text-center text-sm font-medium text-white/70 tracking-[0.2em] mb-6 uppercase">
            BUDGETBITES
          </p>

          {/* Primary CTA - Continue as Guest */}
          <Button 
            onClick={handleContinueAsGuest} 
            className="w-full h-[56px] rounded-full text-[17px] font-semibold transition-all active:scale-[0.98] bg-white text-[#2196F3] hover:bg-white/95"
            style={{
              boxShadow: '0 8px 30px -6px rgba(0, 0, 0, 0.2)'
            }}
          >
            המשך כאורח
          </Button>

          {/* Secondary CTA - Sign in */}
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
