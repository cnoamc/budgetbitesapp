import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';

export type StatusBarStyle = 'light' | 'dark' | 'default';

interface StatusBarOptions {
  style?: StatusBarStyle;
  backgroundColor?: string;
  overlay?: boolean;
}

const isNative = Capacitor.isNativePlatform();

export const useStatusBar = (options: StatusBarOptions = {}) => {
  const { 
    style = 'default', 
    backgroundColor = '#FFFFFF',
    overlay = false 
  } = options;

  useEffect(() => {
    if (!isNative) return;

    const configureStatusBar = async () => {
      try {
        // Set status bar style (light = dark icons, dark = light icons)
        const statusBarStyle = style === 'light' 
          ? Style.Light  // Dark text/icons for light backgrounds
          : style === 'dark' 
            ? Style.Dark  // Light text/icons for dark backgrounds
            : Style.Default;
        
        await StatusBar.setStyle({ style: statusBarStyle });
        
        // Set background color (iOS ignores this but Android uses it)
        await StatusBar.setBackgroundColor({ color: backgroundColor });
        
        // Set overlay mode
        if (overlay) {
          await StatusBar.setOverlaysWebView({ overlay: true });
        } else {
          await StatusBar.setOverlaysWebView({ overlay: false });
        }
      } catch (error) {
        console.warn('StatusBar configuration failed:', error);
      }
    };

    configureStatusBar();
  }, [style, backgroundColor, overlay]);
};

// Utility function to set status bar imperatively
export const setStatusBarStyle = async (style: StatusBarStyle) => {
  if (!isNative) return;
  
  try {
    const statusBarStyle = style === 'light' 
      ? Style.Light 
      : style === 'dark' 
        ? Style.Dark 
        : Style.Default;
    
    await StatusBar.setStyle({ style: statusBarStyle });
  } catch (error) {
    console.warn('StatusBar style change failed:', error);
  }
};

export const showStatusBar = async () => {
  if (!isNative) return;
  try {
    await StatusBar.show();
  } catch (error) {
    console.warn('StatusBar show failed:', error);
  }
};

export const hideStatusBar = async () => {
  if (!isNative) return;
  try {
    await StatusBar.hide();
  } catch (error) {
    console.warn('StatusBar hide failed:', error);
  }
};
