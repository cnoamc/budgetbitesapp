import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const REVIEW_MODE_KEY = 'bb_review_mode';
const REVIEW_EMAIL = 'review@budgetbites.app';

interface ReviewModeContextType {
  isReviewMode: boolean;
  resetReviewMode: () => void;
}

const ReviewModeContext = createContext<ReviewModeContextType | undefined>(undefined);

export const ReviewModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [isReviewMode, setIsReviewMode] = useState<boolean>(() => {
    return localStorage.getItem(REVIEW_MODE_KEY) === 'true';
  });

  useEffect(() => {
    if (user?.email) {
      const normalizedEmail = user.email.toLowerCase().trim();
      if (normalizedEmail === REVIEW_EMAIL) {
        localStorage.setItem(REVIEW_MODE_KEY, 'true');
        setIsReviewMode(true);
      }
    }
  }, [user?.email]);

  const resetReviewMode = useCallback(() => {
    localStorage.removeItem(REVIEW_MODE_KEY);
    setIsReviewMode(false);
    window.location.reload();
  }, []);

  return (
    <ReviewModeContext.Provider value={{ isReviewMode, resetReviewMode }}>
      {children}
    </ReviewModeContext.Provider>
  );
};

export const useReviewMode = (): ReviewModeContextType => {
  const context = useContext(ReviewModeContext);
  if (!context) {
    throw new Error('useReviewMode must be used within ReviewModeProvider');
  }
  return context;
};
