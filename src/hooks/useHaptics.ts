/**
 * Custom hook for haptic feedback on mobile devices
 * Uses Capacitor Haptics for native iOS/Android, falls back to Web Vibration API
 */
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const vibrationPatterns: Record<HapticStyle, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  warning: [20, 50, 20],
  error: [30, 50, 30, 50, 30],
};

const impactStyleMap: Record<'light' | 'medium' | 'heavy', ImpactStyle> = {
  light: ImpactStyle.Light,
  medium: ImpactStyle.Medium,
  heavy: ImpactStyle.Heavy,
};

const notificationTypeMap: Record<'success' | 'warning' | 'error', NotificationType> = {
  success: NotificationType.Success,
  warning: NotificationType.Warning,
  error: NotificationType.Error,
};

export const useHaptics = () => {
  const isNative = Capacitor.isNativePlatform();
  const isWebSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  const isSupported = isNative || isWebSupported;

  const trigger = async (style: HapticStyle = 'light') => {
    if (isNative) {
      try {
        if (style === 'success' || style === 'warning' || style === 'error') {
          await Haptics.notification({ type: notificationTypeMap[style] });
        } else {
          await Haptics.impact({ style: impactStyleMap[style] });
        }
      } catch (error) {
        console.debug('Haptic feedback not available:', error);
      }
    } else if (isWebSupported) {
      try {
        const pattern = vibrationPatterns[style];
        navigator.vibrate(pattern);
      } catch (error) {
        console.debug('Vibration not available:', error);
      }
    }
  };

  const impact = async (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (isNative) {
      try {
        await Haptics.impact({ style: impactStyleMap[style] });
      } catch {
        // Silently fail
      }
    } else {
      trigger(style);
    }
  };

  const notification = async (type: 'success' | 'warning' | 'error' = 'success') => {
    if (isNative) {
      try {
        await Haptics.notification({ type: notificationTypeMap[type] });
      } catch {
        // Silently fail
      }
    } else {
      trigger(type);
    }
  };

  const selection = async () => {
    if (isNative) {
      try {
        await Haptics.selectionStart();
        await Haptics.selectionEnd();
      } catch {
        // Silently fail
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
  const isNative = Capacitor.isNativePlatform();
  const isWebSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  if (isNative) {
    try {
      if (style === 'success' || style === 'warning' || style === 'error') {
        await Haptics.notification({ type: notificationTypeMap[style] });
      } else {
        await Haptics.impact({ style: impactStyleMap[style] });
      }
    } catch {
      // Silently fail
    }
  } else if (isWebSupported) {
    try {
      const pattern = vibrationPatterns[style];
      navigator.vibrate(pattern);
    } catch {
      // Silently fail
    }
  }
};
