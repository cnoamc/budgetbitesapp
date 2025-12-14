import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useApp();

  useEffect(() => {
    // Check if onboarding is complete
    if (profile.onboardingComplete) {
      navigate('/home', { replace: true });
    } else {
      navigate('/onboarding', { replace: true });
    }
  }, [profile.onboardingComplete, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center animate-pulse-soft">
        <div className="text-5xl mb-4">🍳</div>
        <p className="text-muted-foreground">טוען...</p>
      </div>
    </div>
  );
};

export default Index;
