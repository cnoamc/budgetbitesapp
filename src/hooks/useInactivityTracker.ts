import { useState, useEffect, useMemo } from 'react';

const LAST_COOK_KEY = 'bb_last_cook_date';
const INACTIVITY_DISMISSED_KEY = 'bb_inactivity_dismissed';
const AVERAGE_DAILY_SAVINGS = 35; // Average savings per day if cooking

interface InactivityData {
  daysInactive: number;
  potentialSavingsLost: number;
  shouldShowAlert: boolean;
  dismissAlert: () => void;
  recordCook: () => void;
}

export const useInactivityTracker = (hasCooked: boolean): InactivityData => {
  const [dismissedUntil, setDismissedUntil] = useState<Date | null>(null);
  
  // Load dismissed state
  useEffect(() => {
    const dismissed = localStorage.getItem(INACTIVITY_DISMISSED_KEY);
    if (dismissed) {
      const date = new Date(dismissed);
      if (date > new Date()) {
        setDismissedUntil(date);
      }
    }
  }, []);
  
  // Calculate days since last cook
  const inactivityData = useMemo(() => {
    const lastCookStr = localStorage.getItem(LAST_COOK_KEY);
    
    if (!lastCookStr && !hasCooked) {
      // Never cooked, don't show inactivity for new users
      return { daysInactive: 0, potentialSavingsLost: 0 };
    }
    
    const lastCookDate = lastCookStr ? new Date(lastCookStr) : new Date();
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastCookDate.getTime());
    const daysInactive = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      daysInactive,
      potentialSavingsLost: daysInactive * AVERAGE_DAILY_SAVINGS,
    };
  }, [hasCooked]);
  
  const shouldShowAlert = useMemo(() => {
    if (inactivityData.daysInactive < 3) return false;
    if (dismissedUntil && dismissedUntil > new Date()) return false;
    return true;
  }, [inactivityData.daysInactive, dismissedUntil]);
  
  const dismissAlert = () => {
    // Dismiss for 24 hours
    const dismissUntil = new Date();
    dismissUntil.setHours(dismissUntil.getHours() + 24);
    localStorage.setItem(INACTIVITY_DISMISSED_KEY, dismissUntil.toISOString());
    setDismissedUntil(dismissUntil);
  };
  
  const recordCook = () => {
    localStorage.setItem(LAST_COOK_KEY, new Date().toISOString());
    // Clear dismissed state
    localStorage.removeItem(INACTIVITY_DISMISSED_KEY);
    setDismissedUntil(null);
  };
  
  return {
    ...inactivityData,
    shouldShowAlert,
    dismissAlert,
    recordCook,
  };
};
