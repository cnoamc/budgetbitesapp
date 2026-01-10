import { useState, useEffect, useCallback } from 'react';
import { 
  detectInAppBrowser, 
  openInExternalBrowser, 
  getInAppBrowserTopPadding,
  type InAppBrowserInfo 
} from '@/lib/inAppBrowser';

const BANNER_DISMISSED_KEY = 'inAppBrowserBannerDismissed';

interface UseInAppBrowserReturn extends InAppBrowserInfo {
  showBanner: boolean;
  dismissBanner: () => void;
  openExternal: () => void;
  extraTopPadding: number;
  reduceAnimations: boolean;
}

export function useInAppBrowser(): UseInAppBrowserReturn {
  const [browserInfo] = useState<InAppBrowserInfo>(() => detectInAppBrowser());
  const [showBanner, setShowBanner] = useState(false);
  const [extraTopPadding, setExtraTopPadding] = useState(0);

  useEffect(() => {
    if (browserInfo.isInAppBrowser) {
      // Check if banner was previously dismissed in this session
      const dismissed = sessionStorage.getItem(BANNER_DISMISSED_KEY);
      if (!dismissed) {
        // Delay showing banner slightly for better UX
        const timer = setTimeout(() => setShowBanner(true), 1000);
        return () => clearTimeout(timer);
      }

      // Calculate extra padding
      setExtraTopPadding(getInAppBrowserTopPadding());

      // Apply CSS class to body for global styling
      document.documentElement.classList.add('in-app-browser');
      if (browserInfo.browser) {
        document.documentElement.classList.add(`iab-${browserInfo.browser}`);
      }
      document.documentElement.classList.add(`iab-${browserInfo.platform}`);

      return () => {
        document.documentElement.classList.remove('in-app-browser');
        if (browserInfo.browser) {
          document.documentElement.classList.remove(`iab-${browserInfo.browser}`);
        }
        document.documentElement.classList.remove(`iab-${browserInfo.platform}`);
      };
    }
  }, [browserInfo]);

  const dismissBanner = useCallback(() => {
    setShowBanner(false);
    sessionStorage.setItem(BANNER_DISMISSED_KEY, 'true');
  }, []);

  const openExternal = useCallback(() => {
    openInExternalBrowser();
  }, []);

  return {
    ...browserInfo,
    showBanner,
    dismissBanner,
    openExternal,
    extraTopPadding,
    reduceAnimations: browserInfo.isInAppBrowser,
  };
}
