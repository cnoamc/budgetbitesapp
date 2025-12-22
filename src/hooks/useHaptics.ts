/**
 * Custom hook for haptic feedback on mobile devices
 * Uses Capacitor Haptics for native iOS/Android support
 * Falls back to Web Vibration API for browsers
 */

import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const vibrationPatterns: Record<HapticStyle, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  warning: [20, 50, 20],
  error: [30, 50, 30, 50, 30],
};

const isNative = Capacitor.isNativePlatform();

export const useHaptics = () => {
  const isSupported = isNative || (typeof navigator !== 'undefined' && 'vibrate' in navigator);

  const trigger = async (style: HapticStyle = 'light') => {
    if (!isSupported) return;

    try {
      if (isNative) {
        // Use Capacitor Haptics for native platforms
        switch (style) {
          case 'light':
            await Haptics.impact({ style: ImpactStyle.Light });
            break;
          case 'medium':
            await Haptics.impact({ style: ImpactStyle.Medium });
            break;
          case 'heavy':
            await Haptics.impact({ style: ImpactStyle.Heavy });
            break;
          case 'success':
            await Haptics.notification({ type: NotificationType.Success });
            break;
          case 'warning':
            await Haptics.notification({ type: NotificationType.Warning });
            break;
          case 'error':
            await Haptics.notification({ type: NotificationType.Error });
            break;
        }
      } else {
        // Fallback to Web Vibration API
        const pattern = vibrationPatterns[style];
        navigator.vibrate(pattern);
      }
    } catch (error) {
      console.debug('Haptic feedback not available:', error);
    }
  };

  const impact = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    trigger(style);
  };

  const notification = (type: 'success' | 'warning' | 'error' = 'success') => {
    trigger(type);
  };

  const selection = async () => {
    if (isNative) {
      try {
        await Haptics.selectionStart();
        await Haptics.selectionEnd();
      } catch {
        trigger('light');
      }
    } else {
      trigger('light');
    }
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
export const triggerHaptic = async (style: HapticStyle = 'light') => {
  const isSupported = isNative || (typeof navigator !== 'undefined' && 'vibrate' in navigator);
  if (!isSupported) return;

  try {
    if (isNative) {
      switch (style) {
        case 'light':
          await Haptics.impact({ style: ImpactStyle.Light });
          break;
        case 'medium':
          await Haptics.impact({ style: ImpactStyle.Medium });
          break;
        case 'heavy':
          await Haptics.impact({ style: ImpactStyle.Heavy });
          break;
        case 'success':
          await Haptics.notification({ type: NotificationType.Success });
          break;
        case 'warning':
          await Haptics.notification({ type: NotificationType.Warning });
          break;
        case 'error':
          await Haptics.notification({ type: NotificationType.Error });
          break;
      }
    } else {
      const pattern = vibrationPatterns[style];
      navigator.vibrate(pattern);
    }
  } catch {
    // Silently fail
  }
};