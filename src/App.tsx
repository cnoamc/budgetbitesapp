import React, { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { GuestProvider } from "@/contexts/GuestContext";
import { AppProvider } from "@/contexts/AppContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { NotificationBanner } from "@/components/NotificationBanner";
import { PremiumPopup } from "@/components/PremiumPopup";
import { GuestLoginModal } from "@/components/GuestLoginModal";
import { PageTransition } from "@/components/PageTransition";
import { BottomNav } from "@/components/BottomNav";
import { PageSkeleton } from "@/components/ui/skeleton";
import { InAppBrowserBanner } from "@/components/InAppBrowserBanner";
import { detectInAppBrowser } from "@/lib/inAppBrowser";

// Eager load critical pages
import Welcome from "./pages/Welcome";
import SignIn from "./pages/SignIn";

// Lazy load non-critical pages for faster initial load
const LoadingSavings = lazy(() => import("./pages/LoadingSavings"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Home = lazy(() => import("./pages/Home"));
const Recipes = lazy(() => import("./pages/Recipes"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const CustomRecipeDetail = lazy(() => import("./pages/CustomRecipeDetail"));
const CookingAssistant = lazy(() => import("./pages/CookingAssistant"));
const Chat = lazy(() => import("./pages/Chat"));
const RateMeal = lazy(() => import("./pages/RateMeal"));
const Progress = lazy(() => import("./pages/Progress"));
const Profile = lazy(() => import("./pages/Profile"));

const ImportRecipe = lazy(() => import("./pages/ImportRecipe"));
const Install = lazy(() => import("./pages/Install"));
const About = lazy(() => import("./pages/About"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Support = lazy(() => import("./pages/Support"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Create QueryClient outside component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
  },
});

// Pages that show the bottom navigation
const NAV_PAGES = ['/home', '/recipes', '/chat', '/progress', '/profile'];

function PersistentBottomNav(): React.ReactElement | null {
  const location = useLocation();
  const showNav = NAV_PAGES.includes(location.pathname);
  
  if (!showNav) return null;
  return <BottomNav />;
}

// Loading fallback component
function PageLoader(): React.ReactElement {
  return <PageSkeleton hasHeader cards={3} />;
}

function AnimatedRoutes(): React.ReactElement {
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
            
            <Route path="/home" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/recipes" element={<PageTransition><Recipes /></PageTransition>} />
            <Route path="/recipe/:id" element={<PageTransition><RecipeDetail /></PageTransition>} />
            <Route path="/my-recipe/:id" element={<PageTransition><CustomRecipeDetail /></PageTransition>} />
            <Route path="/cook/:id" element={<PageTransition><CookingAssistant /></PageTransition>} />
            <Route path="/chat" element={<PageTransition><Chat /></PageTransition>} />
            <Route path="/rate/:id" element={<PageTransition><RateMeal /></PageTransition>} />
            <Route path="/progress" element={<PageTransition><Progress /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/import" element={<PageTransition><ImportRecipe /></PageTransition>} />
            <Route path="/install" element={<PageTransition><Install /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
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
}

function App(): React.ReactElement {
  // Apply in-app browser detection classes on mount
  useEffect(() => {
    const browserInfo = detectInAppBrowser();
    if (browserInfo.isInAppBrowser) {
      document.documentElement.classList.add('in-app-browser');
      if (browserInfo.browser) {
        document.documentElement.classList.add(`iab-${browserInfo.browser}`);
      }
      document.documentElement.classList.add(`iab-${browserInfo.platform}`);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <GuestProvider>
            <SubscriptionProvider>
              <AppProvider>
                <NotificationProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    <NotificationBanner />
                    <PremiumPopup />
                    <InAppBrowserBanner />
                    <BrowserRouter>
                      <GuestLoginModal />
                      <div className="screen-container bg-background">
                        <AnimatedRoutes />
                      </div>
                    </BrowserRouter>
                  </TooltipProvider>
                </NotificationProvider>
              </AppProvider>
            </SubscriptionProvider>
          </GuestProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;