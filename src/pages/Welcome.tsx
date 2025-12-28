import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { FixedScreenLayout } from '@/components/layouts';
import appIcon from '@/assets/app-icon.png';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If already logged in, redirect to home
  useEffect(() => {
    if (user && !loading) {
      navigate('/home', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleStart = () => {
    navigate('/onboarding');
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
        className="fixed inset-0" 
        style={{
          background: 'linear-gradient(180deg, #2196F3 0%, #00BCD4 100%)'
        }} 
      />

      {/* Subtle radial glow */}
      <div 
        className="fixed w-[600px] h-[600px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        
        {/* App icon section */}
        <div className="flex-1 flex items-center justify-center pt-12">
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
        </div>

        {/* Bottom section with text and CTA */}
        <div 
          className={`px-6 pb-10 pt-4 transition-all duration-700 ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          {/* App name */}
          <p className="text-center text-sm font-medium text-white/70 tracking-[0.2em] mb-4 uppercase">
            BUDGETBITES
          </p>

          {/* Main headline */}
          <h1 className="text-center text-[2.75rem] font-bold text-white mb-1 leading-[1.1]">
            בישול קל.
          </h1>
          <h1 className="text-center text-[2.75rem] font-bold text-white/90 mb-10 leading-[1.1]">
            חיסכון גדול.
          </h1>

          {/* CTA Button - White */}
          <Button 
            onClick={handleStart} 
            className="w-full h-[60px] rounded-full text-[17px] font-semibold transition-all active:scale-[0.98] bg-white text-[#2196F3] hover:bg-white/95"
            style={{
              boxShadow: '0 8px 30px -6px rgba(0, 0, 0, 0.2)'
            }}
          >
            בואו נתחיל
          </Button>

          {/* Login link */}
          <div className="text-center mt-5">
            <button 
              onClick={() => navigate('/signin')} 
              className="text-[15px] text-white/70 hover:text-white transition-colors"
            >
              כבר יש לך חשבון? <span className="font-semibold text-white">התחבר</span>
            </button>
          </div>
        </div>
      </div>
    </FixedScreenLayout>
  );
};

export default Welcome;
