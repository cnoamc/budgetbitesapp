import React from "react";
import { createRoot } from "react-dom/client";
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import App from "./App.tsx";
import "./index.css";

// Add platform class to body for iOS-specific CSS
if (Capacitor.isNativePlatform()) {
  document.body.classList.add('cap-is-native');
  if (Capacitor.getPlatform() === 'ios') {
    document.body.classList.add('cap-is-ios');
  } else if (Capacitor.getPlatform() === 'android') {
    document.body.classList.add('cap-is-android');
  }
}

// Calculate and set CSS variable for actual viewport height (iOS fix)
const setAppHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
};

// Initialize on load and resize
setAppHeight();
window.addEventListener('resize', setAppHeight);
window.addEventListener('orientationchange', () => {
  // Delay to let iOS finish rotation
  setTimeout(setAppHeight, 100);
});

// Initialize Capacitor plugins for native platforms
const initializeCapacitor = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Configure status bar for iOS - overlays web view
      await StatusBar.setOverlaysWebView({ overlay: true });
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#00000000' }); // Transparent
    } catch (error) {
      console.debug('StatusBar not available:', error);
    }

    try {
      // Hide native splash screen after React app is ready
      await SplashScreen.hide({ fadeOutDuration: 300 });
    } catch (error) {
      console.debug('SplashScreen not available:', error);
    }

    // Handle keyboard events for iOS
    try {
      const { Keyboard } = await import('@capacitor/keyboard');
      
      Keyboard.addListener('keyboardWillShow', (info) => {
        document.body.classList.add('keyboard-visible');
        document.documentElement.style.setProperty('--keyboard-height', `${info.keyboardHeight}px`);
      });
      
      Keyboard.addListener('keyboardWillHide', () => {
        document.body.classList.remove('keyboard-visible');
        document.documentElement.style.setProperty('--keyboard-height', '0px');
      });
    } catch (error) {
      console.debug('Keyboard plugin not available:', error);
    }
  }
};

// Initialize and render
initializeCapacitor();

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}