import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useReviewMode } from '@/contexts/ReviewModeContext';

interface Subscription {
  id: string;
  status: 'trial' | 'active' | 'cancelled' | 'expired';
  trial_start: string;
  trial_end: string;
  subscription_start: string | null;
  cancel_reminder_enabled: boolean;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  isTrialActive: boolean;
  hasStartedTrial: boolean;
  daysLeftInTrial: number;
  startTrial: () => Promise<void>;
  toggleCancelReminder: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { isReviewMode } = useReviewMode();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const fetchSubscription = async () => {
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching subscription:', error);
        }
        
        setSubscription(data as Subscription | null);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user]);

  // Review mode overrides trial status to always be active
  const isTrialActive = isReviewMode || (subscription 
    ? subscription.status === 'trial' && new Date(subscription.trial_end) > new Date()
    : false);

  // User has started trial if subscription_start is set (or in review mode)
  const hasStartedTrial = isReviewMode || subscription?.subscription_start !== null;

  const daysLeftInTrial = isReviewMode 
    ? 999 
    : (subscription
      ? Math.max(0, Math.ceil((new Date(subscription.trial_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
      : 0);

  const startTrial = async () => {
    if (!subscription || !user) return;

    const { error } = await supabase
      .from('subscriptions')
      .update({ subscription_start: new Date().toISOString() })
      .eq('user_id', user.id);

    if (!error) {
      setSubscription(prev => prev ? { ...prev, subscription_start: new Date().toISOString() } : null);
    }
  };

  const toggleCancelReminder = async () => {
    if (!subscription || !user) return;

    const newValue = !subscription.cancel_reminder_enabled;
    
    const { error } = await supabase
      .from('subscriptions')
      .update({ cancel_reminder_enabled: newValue })
      .eq('user_id', user.id);

    if (!error) {
      setSubscription(prev => prev ? { ...prev, cancel_reminder_enabled: newValue } : null);
    }
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      loading,
      isTrialActive,
      hasStartedTrial,
      daysLeftInTrial,
      startTrial,
      toggleCancelReminder,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
