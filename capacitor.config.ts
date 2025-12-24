import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.noam.budgetbites",
  appName: "BudgetBites",
  webDir: "dist",
  ios: {
    contentInset: "never",
    preferredContentMode: "mobile",
    backgroundColor: "#0F172A",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0F172A",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      overlaysWebView: true,
      style: "dark",
      backgroundColor: "#0F172A",
    },
  },
};

export default config;
