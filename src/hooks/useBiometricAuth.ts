import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';

// Define types for the biometric auth plugin
interface BiometricAuthPlugin {
  checkBiometry(): Promise<{ isAvailable: boolean; biometryType: number; reason?: string }>;
  authenticate(options: { reason: string; cancelTitle?: string; allowDeviceCredential?: boolean }): Promise<void>;
}

// Biometry types
const BiometryType = {
  none: 0,
  touchId: 1,
  faceId: 2,
  fingerprintAuthentication: 3,
  faceAuthentication: 4,
  irisAuthentication: 5,
} as const;

interface BiometricState {
  isAvailable: boolean;
  biometryType: 'faceId' | 'touchId' | 'fingerprint' | 'face' | 'none';
  isEnabled: boolean;
}

const BIOMETRIC_ENABLED_KEY = 'bb_biometric_enabled';
const BIOMETRIC_EMAIL_KEY = 'bb_biometric_email';

export const useBiometricAuth = () => {
  const [state, setState] = useState<BiometricState>({
    isAvailable: false,
    biometryType: 'none',
    isEnabled: false,
  });
  const [isChecking, setIsChecking] = useState(true);

  const getBiometryTypeName = (type: number): BiometricState['biometryType'] => {
    switch (type) {
      case BiometryType.faceId:
        return 'faceId';
      case BiometryType.touchId:
        return 'touchId';
      case BiometryType.fingerprintAuthentication:
        return 'fingerprint';
      case BiometryType.faceAuthentication:
        return 'face';
      default:
        return 'none';
    }
  };

  const getBiometryLabel = (): string => {
    switch (state.biometryType) {
      case 'faceId':
        return 'Face ID';
      case 'touchId':
        return 'Touch ID';
      case 'fingerprint':
        return 'טביעת אצבע';
      case 'face':
        return 'זיהוי פנים';
      default:
        return 'ביומטרי';
    }
  };

  const checkBiometricAvailability = useCallback(async () => {
    if (!Capacitor.isNativePlatform()) {
      setIsChecking(false);
      return;
    }

    try {
      // Dynamically import the plugin
      const { BiometricAuth } = await import('@aparajita/capacitor-biometric-auth') as { BiometricAuth: BiometricAuthPlugin };
      
      const result = await BiometricAuth.checkBiometry();
      const isEnabled = localStorage.getItem(BIOMETRIC_ENABLED_KEY) === 'true';
      
      setState({
        isAvailable: result.isAvailable,
        biometryType: getBiometryTypeName(result.biometryType),
        isEnabled,
      });
    } catch (error) {
      console.log('Biometric check failed:', error);
      setState({
        isAvailable: false,
        biometryType: 'none',
        isEnabled: false,
      });
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkBiometricAvailability();
  }, [checkBiometricAvailability]);

  const authenticate = useCallback(async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform() || !state.isAvailable) {
      return false;
    }

    try {
      const { BiometricAuth } = await import('@aparajita/capacitor-biometric-auth') as { BiometricAuth: BiometricAuthPlugin };
      
      await BiometricAuth.authenticate({
        reason: 'התחבר לחשבון שלך',
        cancelTitle: 'ביטול',
        allowDeviceCredential: true,
      });
      
      return true;
    } catch (error) {
      console.log('Biometric authentication failed:', error);
      return false;
    }
  }, [state.isAvailable]);

  const enableBiometric = useCallback((email: string) => {
    localStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
    localStorage.setItem(BIOMETRIC_EMAIL_KEY, email);
    setState(prev => ({ ...prev, isEnabled: true }));
  }, []);

  const disableBiometric = useCallback(() => {
    localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
    localStorage.removeItem(BIOMETRIC_EMAIL_KEY);
    setState(prev => ({ ...prev, isEnabled: false }));
  }, []);

  const getSavedEmail = useCallback((): string | null => {
    return localStorage.getItem(BIOMETRIC_EMAIL_KEY);
  }, []);

  return {
    ...state,
    isChecking,
    authenticate,
    enableBiometric,
    disableBiometric,
    getSavedEmail,
    getBiometryLabel,
  };
};
