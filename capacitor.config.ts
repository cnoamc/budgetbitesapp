import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.c034698cdde14f42bd36c9d8740a134f",
  appName: "BudgetBites",
  webDir: "dist",
  
  // iOS configuration for App Store
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    backgroundColor: "#3B82F6",
    allowsLinkPreview: false,
    scrollEnabled: true,
  },
  
  // Android configuration
  android: {
    backgroundColor: "#3B82F6",
    allowMixedContent: false,
  },
  
  // Plugins configuration
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      launchFadeOutDuration: 300,
      backgroundColor: "#3B82F6",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      overlaysWebView: true,
      style: "LIGHT",
      backgroundColor: "#3B82F6",
    },
  },
  
  // IMPORTANT: Remove server.url for production builds!
  // Only uncomment for development with hot reload:
  // server: {
  //   url: "https://your-preview-url.lovableproject.com?forceHideBadge=true",
  //   cleartext: true
  // },
};

export default config;
