import { useState, useEffect, Suspense, lazy } from "react";
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
import { PageSkeleton } from "@/components/ui/skeleton";

// Eager load critical pages
import Welcome from "./pages/Welcome";
import SignIn from "./pages/SignIn";

// Lazy load non-critical pages for faster initial load
const LoadingSavings = lazy(() => import("./pages/LoadingSavings"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Savings = lazy(() => import("./pages/Savings"));
const Home = lazy(() => import("./pages/Home"));
const Recipes = lazy(() => import("./pages/Recipes"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const CookingAssistant = lazy(() => import("./pages/CookingAssistant"));
const RateMeal = lazy(() => import("./pages/RateMeal"));
const Progress = lazy(() => import("./pages/Progress"));
const Profile = lazy(() => import("./pages/Profile"));
const Premium = lazy(() => import("./pages/Premium"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Support = lazy(() => import("./pages/Support"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    },
  },
});

// Pages that show the bottom navigation
const NAV_PAGES = ['/home', '/recipes', '/progress', '/profile'];

const PersistentBottomNav = () => {
  const location = useLocation();
  const showNav = NAV_PAGES.includes(location.pathname);
  
  if (!showNav) return null;
  return <BottomNav />;
};

// Loading fallback component
const PageLoader = () => (
  <PageSkeleton hasHeader cards={3} />
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <>
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
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
        </Suspense>
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
                  <Toaster />
                  <Sonner />
                  <NotificationBanner />
                  {showSplash && !hasShownSplash && (
                    <SplashScreen onComplete={handleSplashComplete} minDuration={2000} />
                  )}
                  <BrowserRouter>
                    <div className="screen-container bg-background">
                      <AnimatedRoutes />
                    </div>
                  </BrowserRouter>
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