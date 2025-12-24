import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useStatusBar } from '@/hooks/useStatusBar';
import appIcon from '@/assets/app-icon.png';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [zooming, setZooming] = useState(false);

  // Dark status bar for blue gradient background (light icons)
  useStatusBar({ style: 'dark', backgroundColor: '#3B82F6', overlay: true });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user && !loading) {
      navigate('/home', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleStart = () => {
    setZooming(true);
    setTimeout(() => {
      navigate('/onboarding');
    }, 400);
  };

  if (loading) {
    return (
      <div className="h-full min-h-0 flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500 pt-safe pb-safe">
        <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl animate-pulse ring-4 ring-white/20">
          <img src={appIcon} alt="BudgetBites" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 flex flex-col overflow-hidden" dir="rtl">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-500" />
      <div aria-hidden="true" className="absolute inset-0 bg-white/5 backdrop-blur-[2px] pointer-events-none" />
      
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />
      <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-blue-300/15 rounded-full blur-2xl" />
      <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl" />

      {/* Content */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col px-6 pt-safe-offset-6">
        {/* App icon section - grows to take available space */}
        <div className="flex-1 flex items-center justify-center">
          <div 
            className={`relative transition-all duration-500 ease-out ${mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'} ${zooming ? 'scale-150 opacity-0' : ''}`}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 w-32 h-32 bg-white/30 rounded-[40px] blur-xl" />
            
            {/* Icon */}
            <div 
              className="relative w-32 h-32 rounded-[40px] overflow-hidden shadow-2xl ring-4 ring-white/30"
            >
              <img alt="BudgetBites" className="w-full h-full object-cover" src={appIcon} />
            </div>
          </div>
        </div>

        {/* Bottom section with text and CTA - fixed height, pinned to bottom */}
        <div 
          className={`shrink-0 pb-safe-offset-8 transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
          style={{ transitionDelay: '300ms' }}
        >
          {/* App name */}
          <p className="text-center text-sm font-semibold text-white/70 tracking-widest mb-4 uppercase">
            BudgetBites
          </p>

          {/* Main headline */}
          <h1 className="text-center text-[2.75rem] font-bold text-white mb-2 leading-[1.1]">
            בישול קל.
          </h1>
          <h2 className="text-center text-[2.75rem] font-bold mb-10 leading-[1.1] text-cyan-200">
            חיסכון גדול.
          </h2>

          {/* CTA Button */}
          <Button 
            onClick={handleStart} 
            className="w-full h-[60px] rounded-2xl text-[17px] font-bold bg-white text-blue-600 hover:bg-white/90 transition-all active:scale-[0.98] shadow-xl"
          >
            בואו נתחיל
          </Button>

          {/* Login link */}
          <div className="text-center mt-5 mb-2">
            <button 
              onClick={() => navigate('/signin')} 
              className="text-[15px] text-white/70 hover:text-white transition-colors"
            >
              כבר יש לך חשבון? <span className="font-semibold text-white">התחבר</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
