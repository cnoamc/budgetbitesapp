import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c034698cdde14f42bd36c9d8740a134f',
  appName: 'budgetbitesapp',
  webDir: 'dist',
  server: {
    url: 'https://c034698c-dde1-4f42-bd36-c9d8740a134f.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
    backgroundColor: '#0F172A'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0F172A',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0F172A'
    }
  }
};

export default config;
