import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import chefIcon from '@/assets/chef-icon.png';

// Floating emoji items
const floatingEmojis = [
  { emoji: '🍔', x: '12%', y: '52%', delay: 0, size: 44 },
  { emoji: '🍝', x: '8%', y: '62%', delay: 0.5, size: 40 },
  { emoji: '🛒', x: '15%', y: '72%', delay: 1, size: 38 },
  { emoji: '🍕', x: '5%', y: '58%', delay: 1.5, size: 36 },
  { emoji: '💰', x: '85%', y: '50%', delay: 0.3, size: 42 },
  { emoji: '📊', x: '88%', y: '60%', delay: 0.8, size: 38 },
  { emoji: '🎯', x: '82%', y: '70%', delay: 1.3, size: 40 },
  { emoji: '✨', x: '90%', y: '55%', delay: 1.8, size: 34 },
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
        
        {/* Chef icon section with orbit rings */}
        <div className="flex-1 flex items-center justify-center pt-8">
          <div className="relative">
            {/* Decorative orbit rings */}
            <div 
              className={`absolute rounded-full border border-foreground/[0.06] transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
              style={{ 
                width: 200, height: 200, 
                top: '50%', left: '50%', 
                transform: 'translate(-50%, -50%)',
                transitionDelay: '200ms'
              }}
            />
            <div 
              className={`absolute rounded-full border border-foreground/[0.05] transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
              style={{ 
                width: 280, height: 280, 
                top: '50%', left: '50%', 
                transform: 'translate(-50%, -50%)',
                transitionDelay: '400ms'
              }}
            />
            <div 
              className={`absolute rounded-full border border-foreground/[0.04] transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
              style={{ 
                width: 360, height: 360, 
                top: '50%', left: '50%', 
                transform: 'translate(-50%, -50%)',
                transitionDelay: '600ms'
              }}
            />

            {/* Chef icon */}
            <div 
              className={`relative w-28 h-28 rounded-[32px] overflow-hidden shadow-2xl transition-all duration-700 ${mounted ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
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
        </div>

        {/* Floating emojis */}
        {floatingEmojis.map((item, index) => (
          <div
            key={index}
            className={`fixed transition-all duration-700 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
            style={{
              left: item.x,
              top: item.y,
              transitionDelay: `${item.delay * 1000 + 400}ms`,
              animation: mounted ? `float 4s ease-in-out infinite` : 'none',
              animationDelay: `${item.delay}s`
            }}
          >
            <div 
              className="rounded-full flex items-center justify-center backdrop-blur-md"
              style={{ 
                width: item.size + 8,
                height: item.size + 8,
                background: 'rgba(255,255,255,0.6)',
                boxShadow: '0 4px 20px -4px rgba(0,0,0,0.08)'
              }}
            >
              <span style={{ fontSize: item.size * 0.55 }}>{item.emoji}</span>
            </div>
          </div>
        ))}

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

          {/* CTA Button - goes to onboarding */}
          <Button
            onClick={() => navigate('/onboarding')}
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