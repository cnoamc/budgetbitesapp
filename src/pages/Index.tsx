import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import chefIcon from '@/assets/chef-icon.png';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: appLoading } = useApp();

  useEffect(() => {
    if (authLoading || appLoading) return;

    // If not authenticated, redirect to auth page
    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }

    // If authenticated, check onboarding status
    if (profile.onboardingComplete) {
      navigate('/home', { replace: true });
    } else {
      navigate('/onboarding', { replace: true });
    }
  }, [user, authLoading, appLoading, profile.onboardingComplete, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden shadow-glow animate-icon-delight-delayed animate-glow-pulse">
          <img src={chefIcon} alt="BudgetBites" className="w-full h-full object-cover" />
        </div>
        <p className="text-muted-foreground">טוען...</p>
      </div>
    </div>
  );
};

export default Index;
