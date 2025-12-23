import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { NotificationBanner } from "@/components/NotificationBanner";
import { PageTransition } from "@/components/PageTransition";
import { BottomNav } from "@/components/BottomNav";
import { SplashScreen } from "@/components/SplashScreen";
import Welcome from "./pages/Welcome";
import SignIn from "./pages/SignIn";
import LoadingSavings from "./pages/LoadingSavings";
import Onboarding from "./pages/Onboarding";
import Savings from "./pages/Savings";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import CookingAssistant from "./pages/CookingAssistant";
import RateMeal from "./pages/RateMeal";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import Premium from "./pages/Premium";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Pages that show the bottom navigation
const NAV_PAGES = ['/home', '/recipes', '/progress', '/profile'];

const PersistentBottomNav = () => {
  const location = useLocation();
  const showNav = NAV_PAGES.includes(location.pathname);
  
  if (!showNav) return null;
  return <BottomNav />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Welcome /></PageTransition>} />
          <Route path="/loading" element={<PageTransition><LoadingSavings /></PageTransition>} />
          <Route path="/signin" element={<PageTransition><SignIn /></PageTransition>} />
          <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
          <Route path="/savings" element={<PageTransition><Savings /></PageTransition>} />
          <Route path="/premium" element={<PageTransition><Premium /></PageTransition>} />
          <Route path="/home" element={<PageTransition><Home /></PageTransition>} />
          <Route path="/recipes" element={<PageTransition><Recipes /></PageTransition>} />
          <Route path="/recipe/:id" element={<PageTransition><RecipeDetail /></PageTransition>} />
          <Route path="/cook/:id" element={<PageTransition><CookingAssistant /></PageTransition>} />
          <Route path="/rate/:id" element={<PageTransition><RateMeal /></PageTransition>} />
          <Route path="/progress" element={<PageTransition><Progress /></PageTransition>} />
          <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
          <Route path="/support" element={<PageTransition><Support /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      <PersistentBottomNav />
    </>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [hasShownSplash, setHasShownSplash] = useState(false);

  useEffect(() => {
    // Check if splash was already shown this session
    const splashShown = sessionStorage.getItem('bb_splash_shown');
    if (splashShown) {
      setShowSplash(false);
      setHasShownSplash(true);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('bb_splash_shown', 'true');
    setShowSplash(false);
    setHasShownSplash(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SubscriptionProvider>
            <AppProvider>
              <NotificationProvider>
                <TooltipProvider>
                  <div 
                    className="w-full h-full flex flex-col overflow-hidden bg-background"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      paddingTop: 'env(safe-area-inset-top)',
                      paddingBottom: 'env(safe-area-inset-bottom)',
                      paddingLeft: 'env(safe-area-inset-left)',
                      paddingRight: 'env(safe-area-inset-right)',
                    }}
                  >
                    <Toaster />
                    <Sonner />
                    <NotificationBanner />
                    {showSplash && !hasShownSplash && (
                      <SplashScreen onComplete={handleSplashComplete} minDuration={2000} />
                    )}
                    <BrowserRouter>
                      <div className="flex-1 overflow-hidden relative">
                        <AnimatedRoutes />
                      </div>
                    </BrowserRouter>
                  </div>
                </TooltipProvider>
              </NotificationProvider>
            </AppProvider>
          </SubscriptionProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
