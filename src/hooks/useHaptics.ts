/**
 * Custom hook for haptic feedback on mobile devices
 * Uses the Web Vibration API (supported on Android and some browsers)
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const vibrationPatterns: Record<HapticStyle, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  warning: [20, 50, 20],
  error: [30, 50, 30, 50, 30],
};

export const useHaptics = () => {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const trigger = (style: HapticStyle = 'light') => {
    if (!isSupported) return;
    
    try {
      const pattern = vibrationPatterns[style];
      navigator.vibrate(pattern);
    } catch (error) {
      // Silently fail if vibration is not available
      console.debug('Haptic feedback not available:', error);
    }
  };

  const impact = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    trigger(style);
  };

  const notification = (type: 'success' | 'warning' | 'error' = 'success') => {
    trigger(type);
  };

  const selection = () => {
    trigger('light');
  };

  return {
    isSupported,
    trigger,
    impact,
    notification,
    selection,
  };
};

// Standalone function for use outside React components
export const triggerHaptic = (style: HapticStyle = 'light') => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      const pattern = vibrationPatterns[style];
      navigator.vibrate(pattern);
    } catch {
      // Silently fail
    }
  }
};