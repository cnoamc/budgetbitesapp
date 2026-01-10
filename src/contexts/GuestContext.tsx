import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Local storage keys
const GUEST_MODE_KEY = 'bb_guest_mode';
const GUEST_PREMIUM_KEY = 'bb_guest_premium';
const PREMIUM_POPUP_SEEN_KEY = 'bb_premium_popup_seen';

export interface GuestUser {
  role: 'guest';
  id: 'guest';
  isPremium: boolean;
}

interface GuestContextType {
  isGuest: boolean;
  guestUser: GuestUser | null;
  isPremium: boolean;
  premiumPopupSeen: boolean;
  showPremiumPopup: boolean;
  enterAsGuest: () => void;
  exitGuestMode: () => void;
  activatePremium: () => void;
  openPremiumPopup: () => void;
  closePremiumPopup: () => void;
  markPopupSeen: () => void;
  requirePremium: (action: () => void) => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const GuestProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem(GUEST_MODE_KEY) === 'true';
  });
  
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem(GUEST_PREMIUM_KEY) === 'true';
  });
  
  const [premiumPopupSeen, setPremiumPopupSeen] = useState<boolean>(() => {
    return localStorage.getItem(PREMIUM_POPUP_SEEN_KEY) === 'true';
  });
  
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const guestUser: GuestUser | null = isGuest ? {
    role: 'guest',
    id: 'guest',
    isPremium,
  } : null;

  const enterAsGuest = useCallback(() => {
    localStorage.setItem(GUEST_MODE_KEY, 'true');
    setIsGuest(true);
  }, []);

  const exitGuestMode = useCallback(() => {
    localStorage.removeItem(GUEST_MODE_KEY);
    localStorage.removeItem(GUEST_PREMIUM_KEY);
    localStorage.removeItem(PREMIUM_POPUP_SEEN_KEY);
    setIsGuest(false);
    setIsPremium(false);
    setPremiumPopupSeen(false);
  }, []);

  const activatePremium = useCallback(() => {
    localStorage.setItem(GUEST_PREMIUM_KEY, 'true');
    setIsPremium(true);
    setShowPremiumPopup(false);
    
    // Execute pending action if exists
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingAction]);

  const openPremiumPopup = useCallback(() => {
    setShowPremiumPopup(true);
  }, []);

  const closePremiumPopup = useCallback(() => {
    setShowPremiumPopup(false);
    setPendingAction(null);
  }, []);

  const markPopupSeen = useCallback(() => {
    localStorage.setItem(PREMIUM_POPUP_SEEN_KEY, 'true');
    setPremiumPopupSeen(true);
  }, []);

  // Premium gate function
  const requirePremium = useCallback((action: () => void) => {
    if (isPremium) {
      action();
    } else {
      setPendingAction(() => action);
      setShowPremiumPopup(true);
    }
  }, [isPremium]);

  return (
    <GuestContext.Provider value={{
      isGuest,
      guestUser,
      isPremium,
      premiumPopupSeen,
      showPremiumPopup,
      enterAsGuest,
      exitGuestMode,
      activatePremium,
      openPremiumPopup,
      closePremiumPopup,
      markPopupSeen,
      requirePremium,
    }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = (): GuestContextType => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within GuestProvider');
  }
  return context;
};
