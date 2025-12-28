import { createRoot } from "react-dom/client";
import { Capacitor } from '@capacitor/core';
import App from "./App.tsx";
import "./index.css";

// Initialize Capacitor plugins safely
const initializeCapacitor = async () => {
  if (!Capacitor.isNativePlatform()) return;

  // Dynamically import plugins only on native to avoid web errors
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setStyle({ style: Style.Light }); // Light icons on dark/blue background
  } catch (e) {
    console.debug('[Capacitor] StatusBar unavailable');
  }

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    // Small delay ensures the WebView is fully ready
    setTimeout(() => SplashScreen.hide(), 100);
  } catch (e) {
    console.debug('[Capacitor] SplashScreen unavailable');
  }
};

// Render app immediately, don't block on Capacitor init
createRoot(document.getElementById("root")!).render(<App />);

// Initialize Capacitor after render
initializeCapacitor();
