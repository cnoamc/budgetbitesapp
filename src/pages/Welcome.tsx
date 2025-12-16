import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import chefIcon from '@/assets/chef-icon.png';

// Orbiting items for the visual
const orbitItems = [
  { emoji: '🍔', size: 48, orbit: 120, delay: 0, bg: 'rgba(255, 182, 193, 0.4)' },
  { emoji: '🍝', size: 44, orbit: 120, delay: 2, bg: 'rgba(255, 218, 185, 0.4)' },
  { emoji: '💰', size: 40, orbit: 120, delay: 4, bg: 'rgba(144, 238, 144, 0.4)' },
  { emoji: '🛒', size: 46, orbit: 160, delay: 1, bg: 'rgba(173, 216, 230, 0.4)' },
  { emoji: '📊', size: 42, orbit: 160, delay: 3, bg: 'rgba(221, 160, 221, 0.4)' },
  { emoji: '🍕', size: 44, orbit: 160, delay: 5, bg: 'rgba(255, 228, 181, 0.4)' },
  { emoji: '🎯', size: 38, orbit: 200, delay: 0.5, bg: 'rgba(255, 182, 193, 0.4)' },
  { emoji: '✨', size: 36, orbit: 200, delay: 2.5, bg: 'rgba(230, 230, 250, 0.4)' },
];

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

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(165deg, #F7F8FF 0%, #FFE8F0 35%, #E8F4FF 65%, #F0FFF4 100%)' }}
      >
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-glow animate-icon-delight animate-glow-pulse">
          <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] relative overflow-hidden flex flex-col" dir="rtl">
      {/* Gradient background */}
      <div 
        className="fixed inset-0"
        style={{ background: 'linear-gradient(165deg, #F7F8FF 0%, #FFE8F0 35%, #E8F4FF 65%, #F0FFF4 100%)' }}
      />

      {/* Animated gradient blobs */}
      <div 
        className="fixed w-80 h-80 rounded-full blur-3xl opacity-40 pointer-events-none animate-pulse"
        style={{ background: '#FFB6C1', top: '5%', right: '-15%', animationDuration: '4s' }}
      />
      <div 
        className="fixed w-72 h-72 rounded-full blur-3xl opacity-35 pointer-events-none animate-pulse"
        style={{ background: '#87CEEB', top: '30%', left: '-20%', animationDuration: '5s', animationDelay: '1s' }}
      />
      <div 
        className="fixed w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse"
        style={{ background: '#98FB98', bottom: '20%', right: '-10%', animationDuration: '6s', animationDelay: '2s' }}
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Orbit section - takes most of the screen */}
        <div className="flex-1 flex items-center justify-center pt-12">
          <div className="relative w-[320px] h-[320px]">
            {/* Orbit circles (decorative) */}
            <div 
              className="absolute inset-0 rounded-full border border-foreground/5"
              style={{ transform: 'scale(0.75)' }}
            />
            <div 
              className="absolute inset-0 rounded-full border border-foreground/5"
              style={{ transform: 'scale(1)' }}
            />
            <div 
              className="absolute inset-0 rounded-full border border-foreground/5"
              style={{ transform: 'scale(1.25)' }}
            />

            {/* Center icon with star effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Glow effect */}
                <div 
                  className="absolute inset-0 rounded-3xl blur-xl opacity-50"
                  style={{ background: 'linear-gradient(135deg, #FF9A56 0%, #FF6B95 100%)', transform: 'scale(1.5)' }}
                />
                {/* Chef icon */}
                <div 
                  className={`relative w-24 h-24 rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 ${mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
                  style={{ boxShadow: '0 20px 60px -15px rgba(255, 107, 149, 0.4)' }}
                >
                  <img 
                    src={chefIcon} 
                    alt="BudgetBites" 
                    className="w-full h-full object-cover animate-icon-delight-delayed"
                  />
                </div>
              </div>
            </div>

            {/* Orbiting items */}
            {orbitItems.map((item, index) => (
              <div
                key={index}
                className="absolute"
                style={{
                  width: item.size,
                  height: item.size,
                  left: '50%',
                  top: '50%',
                  marginLeft: -item.size / 2,
                  marginTop: -item.size / 2,
                  animation: `orbit ${20 + index * 2}s linear infinite`,
                  animationDelay: `-${item.delay}s`,
                  transformOrigin: `0 ${item.orbit}px`,
                }}
              >
                <div 
                  className={`w-full h-full rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-700 ${mounted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                  style={{ 
                    background: item.bg,
                    boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)',
                    transitionDelay: `${index * 100 + 300}ms`
                  }}
                >
                  <span style={{ fontSize: item.size * 0.5 }}>{item.emoji}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom section with text and CTA */}
        <div className={`px-6 pb-10 pt-4 transition-all duration-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
          {/* App name */}
          <p className="text-center text-sm font-medium text-foreground/60 tracking-wider mb-3">
            BudgetBites
          </p>

          {/* Main headline */}
          <h1 className="text-center text-4xl font-bold text-foreground mb-1 leading-tight">
            בישול קל.
          </h1>
          <h1 
            className="text-center text-4xl font-bold mb-8 leading-tight"
            style={{ 
              background: 'linear-gradient(135deg, #FF6B95 0%, #FF9A56 50%, #FFB347 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            חיסכון גדול.
          </h1>

          {/* CTA Button */}
          <Button
            onClick={() => navigate('/auth')}
            className="w-full h-16 rounded-3xl text-lg font-semibold transition-all active:scale-[0.98] shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #1D1D1F 0%, #3D3D3F 100%)',
              color: 'white',
              boxShadow: '0 12px 40px -8px rgba(0, 0, 0, 0.35)'
            }}
          >
            בואו נתחיל
          </Button>

          {/* Login link */}
          <div className="text-center mt-4">
            <button 
              onClick={() => navigate('/signin')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
