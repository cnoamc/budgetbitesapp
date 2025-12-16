import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmojiOrbit } from '@/components/auth/EmojiOrbit';
import { useAuth } from '@/contexts/AuthContext';
import chefIcon from '@/assets/chef-icon.png';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate('/home');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center" 
        style={{ background: 'linear-gradient(165deg, #F7F8FF 0%, #FFF2E9 45%, #ECFFF4 100%)' }}
      >
        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-glow animate-icon-delight animate-glow-pulse">
          <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-[100dvh] relative overflow-hidden flex flex-col" dir="rtl">
      {/* Full-screen gradient background */}
      <div 
        className="fixed inset-0" 
        style={{ background: 'linear-gradient(165deg, #F7F8FF 0%, #FFF2E9 45%, #ECFFF4 100%)' }} 
      />
      
      {/* Blurred blobs for depth */}
      <div 
        className="fixed w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none" 
        style={{ background: '#FFB088', top: '-12%', right: '-20%' }} 
      />
      <div 
        className="fixed w-72 h-72 rounded-full blur-3xl opacity-25 pointer-events-none" 
        style={{ background: '#88CCFF', top: '35%', left: '-25%' }} 
      />
      <div 
        className="fixed w-80 h-80 rounded-full blur-3xl opacity-25 pointer-events-none" 
        style={{ background: '#88DDAA', bottom: '15%', right: '-15%' }} 
      />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col safe-area-inset">
        {/* Hero section */}
        <div className="pt-16 px-6 text-center animate-fade-in">
          {/* App name */}
          <h1 className="text-lg font-semibold text-foreground/70 tracking-wide mb-4">
            BudgetBites
          </h1>
          
          {/* Main slogan */}
          <h2 className="text-4xl font-bold text-foreground leading-tight mb-2">
            מתחילים לבשל.
          </h2>
          <h2 className="text-4xl font-bold text-foreground leading-tight">
            מתחילים לחסוך.
          </h2>
        </div>

        {/* Emoji orbit section */}
        <div className="flex-1 flex flex-col items-center justify-center py-6">
          <EmojiOrbit />
          <p className="text-muted-foreground text-base mt-4 font-medium">
            כל ארוחה בבית = כסף שנשאר אצלך
          </p>
        </div>

        {/* CTA section - bottom */}
        <div className="px-6 pb-10 animate-slide-up">
          {/* Main CTA button - goes to onboarding */}
          <Button 
            onClick={() => navigate('/onboarding')} 
            className="w-full h-16 rounded-3xl text-lg font-semibold transition-all active:scale-[0.98] shadow-xl" 
            style={{
              background: 'linear-gradient(135deg, #1D1D1F 0%, #3D3D3F 100%)',
              color: 'white',
              boxShadow: '0 12px 40px -8px rgba(0, 0, 0, 0.3)'
            }}
          >
            <Sparkles className="w-5 h-5 ml-2" />
            גלה כמה תחסוך
          </Button>

          {/* Login link */}
          <div className="text-center mt-5">
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

export default Auth;