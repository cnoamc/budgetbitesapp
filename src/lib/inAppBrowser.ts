/**
 * In-App Browser Detection & Utilities
 * Detects Instagram, Facebook, TikTok in-app browsers and provides utilities
 */

export interface InAppBrowserInfo {
  isInAppBrowser: boolean;
  browser: 'instagram' | 'facebook' | 'tiktok' | 'snapchat' | 'twitter' | 'unknown' | null;
  platform: 'ios' | 'android' | 'unknown';
}

/**
 * Detect if running inside an in-app browser
 */
export function detectInAppBrowser(): InAppBrowserInfo {
  const ua = navigator.userAgent || navigator.vendor || '';
  const uaLower = ua.toLowerCase();

  // Detect platform
  let platform: 'ios' | 'android' | 'unknown' = 'unknown';
  if (/iphone|ipad|ipod/i.test(ua)) {
    platform = 'ios';
  } else if (/android/i.test(ua)) {
    platform = 'android';
  }

  // Instagram detection
  if (uaLower.includes('instagram')) {
    return { isInAppBrowser: true, browser: 'instagram', platform };
  }

  // Facebook detection (FBAN = Facebook App Native, FBAV = Facebook App Version)
  if (uaLower.includes('fban') || uaLower.includes('fbav') || uaLower.includes('fb_iab')) {
    return { isInAppBrowser: true, browser: 'facebook', platform };
  }

  // TikTok detection
  if (uaLower.includes('tiktok') || uaLower.includes('bytedance') || uaLower.includes('musical_ly')) {
    return { isInAppBrowser: true, browser: 'tiktok', platform };
  }

  // Snapchat detection
  if (uaLower.includes('snapchat')) {
    return { isInAppBrowser: true, browser: 'snapchat', platform };
  }

  // Twitter/X detection
  if (uaLower.includes('twitter')) {
    return { isInAppBrowser: true, browser: 'twitter', platform };
  }

  // Generic WebView detection (fallback)
  const isWebView = 
    // iOS UIWebView or WKWebView
    (platform === 'ios' && !ua.includes('Safari')) ||
    // Android WebView
    (platform === 'android' && ua.includes('wv'));

  if (isWebView) {
    return { isInAppBrowser: true, browser: 'unknown', platform };
  }

  return { isInAppBrowser: false, browser: null, platform };
}

/**
 * Open URL in external browser (Safari/Chrome)
 */
export function openInExternalBrowser(url?: string): void {
  const targetUrl = url || window.location.href;
  const { platform } = detectInAppBrowser();

  if (platform === 'ios') {
    // iOS: Use x-safari:// scheme or window.open
    // Try to open in Safari using the blank target trick
    window.open(targetUrl, '_blank');
  } else if (platform === 'android') {
    // Android: Intent-based URL
    const intentUrl = `intent://${targetUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
    window.location.href = intentUrl;
    
    // Fallback after short delay
    setTimeout(() => {
      window.open(targetUrl, '_blank');
    }, 500);
  } else {
    // Fallback for unknown platforms
    window.open(targetUrl, '_blank');
  }
}

/**
 * Get the browser display name in Hebrew
 */
export function getBrowserDisplayName(browser: InAppBrowserInfo['browser']): string {
  switch (browser) {
    case 'instagram': return 'Instagram';
    case 'facebook': return 'Facebook';
    case 'tiktok': return 'TikTok';
    case 'snapchat': return 'Snapchat';
    case 'twitter': return 'Twitter';
    default: return 'האפליקציה';
  }
}

/**
 * Check if should reduce animations for in-app browsers
 */
export function shouldReduceAnimations(): boolean {
  const { isInAppBrowser } = detectInAppBrowser();
  return isInAppBrowser;
}

/**
 * Get extra top padding needed for in-app browser header
 */
export function getInAppBrowserTopPadding(): number {
  const { isInAppBrowser, browser, platform } = detectInAppBrowser();
  
  if (!isInAppBrowser) return 0;
  
  // Instagram has a header that takes extra space
  if (browser === 'instagram') {
    return platform === 'ios' ? 44 : 56;
  }
  
  if (browser === 'facebook') {
    return platform === 'ios' ? 44 : 48;
  }
  
  if (browser === 'tiktok') {
    return platform === 'ios' ? 44 : 48;
  }
  
  return 20; // Default extra padding for unknown in-app browsers
}
