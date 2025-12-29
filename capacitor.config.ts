import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c034698cdde14f42bd36c9d8740a134f',
  appName: 'BudgetBites',
  webDir: 'dist',
  ios: {
    contentInset: 'never',
    preferredContentMode: 'mobile',
    backgroundColor: '#0F172A',
    scrollEnabled: false
  },
  android: {
    backgroundColor: '#0F172A'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      backgroundColor: '#0F172A',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
      layoutName: 'launch_screen',
      useDialog: false
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#0F172A',
      overlaysWebView: true
    },
    Keyboard: {
      resize: 'native',
      resizeOnFullScreen: false,
      style: 'dark'
    }
  }
};

export default config;
