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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Welcome /></PageTransition>} />
        <Route path="/loading" element={<PageTransition><LoadingSavings /></PageTransition>} />
        <Route path="/signin" element={<PageTransition><SignIn /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
        <Route path="/savings" element={<PageTransition><Savings /></PageTransition>} />
        <Route path="/home" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/recipes" element={<PageTransition><Recipes /></PageTransition>} />
        <Route path="/recipe/:id" element={<PageTransition><RecipeDetail /></PageTransition>} />
        <Route path="/cook/:id" element={<PageTransition><CookingAssistant /></PageTransition>} />
        <Route path="/rate/:id" element={<PageTransition><RateMeal /></PageTransition>} />
        <Route path="/progress" element={<PageTransition><Progress /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
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
                <BrowserRouter>
                  <AnimatedRoutes />
                </BrowserRouter>
              </TooltipProvider>
            </NotificationProvider>
          </AppProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
