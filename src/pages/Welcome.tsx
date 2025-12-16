import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import chefIcon from '@/assets/chef-icon.png';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [zooming, setZooming] = useState(false);

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
    setZooming(true);
    setTimeout(() => {
      navigate('/onboarding');
    }, 400);
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(180deg, #F8F9FF 0%, #FFE8F0 50%, #F0FFF6 100%)' }}
      >
        <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-2xl animate-pulse">
          <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] relative overflow-hidden flex flex-col" dir="rtl">
      {/* Soft gradient background */}
      <div 
        className="fixed inset-0"
        style={{ background: 'linear-gradient(180deg, #F8F9FF 0%, #FFE8F0 50%, #F0FFF6 100%)' }}
      />

      {/* Pink radial glow behind icon */}
      <div 
        className="fixed w-[500px] h-[500px] rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, rgba(255,182,193,0.6) 0%, transparent 70%)',
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        
        {/* Chef icon section - static, no orbits */}
        <div className="flex-1 flex items-center justify-center pt-8">
          <div 
            className={`relative w-28 h-28 rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 ease-out ${
              mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            } ${zooming ? 'scale-150 opacity-0' : ''}`}
            style={{ 
              boxShadow: '0 25px 80px -15px rgba(255, 107, 149, 0.35), 0 10px 30px -10px rgba(0,0,0,0.1)'
            }}
          >
            <img 
              src={chefIcon} 
              alt="BudgetBites" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom section with text and CTA */}
        <div className={`px-6 pb-10 pt-4 transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
          {/* App name */}
          <p className="text-center text-sm font-medium text-foreground/50 tracking-widest mb-4 uppercase">
            BudgetBites
          </p>

          {/* Main headline */}
          <h1 className="text-center text-[2.5rem] font-bold text-foreground mb-1 leading-[1.1]">
            בישול קל.
          </h1>
          <h1 
            className="text-center text-[2.5rem] font-bold mb-10 leading-[1.1]"
            style={{ 
              background: 'linear-gradient(135deg, #FF6B95 0%, #FF9A56 60%, #FFBA6B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            חיסכון גדול.
          </h1>

          {/* CTA Button - triggers zoom then navigates */}
          <Button
            onClick={handleStart}
            className="w-full h-[60px] rounded-2xl text-[17px] font-semibold transition-all active:scale-[0.98]"
            style={{
              background: '#1D1D1F',
              color: 'white',
              boxShadow: '0 8px 30px -6px rgba(0, 0, 0, 0.3)'
            }}
          >
            בואו נתחיל
          </Button>

          {/* Login link */}
          <div className="text-center mt-5">
            <button 
              onClick={() => navigate('/signin')}
              className="text-[15px] text-muted-foreground/80 hover:text-foreground transition-colors"
            >
              כבר יש לך חשבון? <span className="font-semibold text-foreground">התחבר</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
