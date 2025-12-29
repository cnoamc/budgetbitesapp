import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Capacitor imports
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { SplashScreen } from '@capacitor/splash-screen';

// Initialize Capacitor plugins
const initCapacitor = async () => {
  if (Capacitor.isNativePlatform()) {
    // Configure Status Bar - don't overlay content
    try {
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#0d0d0d' });
      // Critical: Don't overlay web content with status bar
      if (Capacitor.getPlatform() === 'ios') {
        await StatusBar.setOverlaysWebView({ overlay: false });
      }
    } catch (e) {
      console.debug('StatusBar not available:', e);
    }

    // Configure Keyboard behavior
    try {
      Keyboard.addListener('keyboardWillShow', (info) => {
        document.documentElement.style.setProperty('--keyboard-height', `${info.keyboardHeight}px`);
        document.body.classList.add('keyboard-open');
      });

      Keyboard.addListener('keyboardWillHide', () => {
        document.documentElement.style.setProperty('--keyboard-height', '0px');
        document.body.classList.remove('keyboard-open');
      });
    } catch (e) {
      console.debug('Keyboard not available:', e);
    }

    // Hide splash screen after app is ready
    try {
      await SplashScreen.hide({ fadeOutDuration: 300 });
    } catch (e) {
      console.debug('SplashScreen not available:', e);
    }
  }
};

// Initialize Capacitor then render
initCapacitor().then(() => {
  const container = document.getElementById("root");
  if (container) {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
});
