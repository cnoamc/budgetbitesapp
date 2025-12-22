import { createRoot } from "react-dom/client";
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import App from "./App.tsx";
import "./index.css";

// Initialize Capacitor plugins for native platforms
const initializeCapacitor = async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Configure status bar for iOS
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#0F172A' });
    } catch (error) {
      console.debug('StatusBar not available:', error);
    }

    try {
      // Hide splash screen after app is ready
      await SplashScreen.hide();
    } catch (error) {
      console.debug('SplashScreen not available:', error);
    }
  }
};

// Initialize and render
initializeCapacitor();
createRoot(document.getElementById("root")!).render(<App />);
