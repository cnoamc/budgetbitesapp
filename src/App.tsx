import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppProvider } from "@/contexts/AppContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/savings" element={<Savings />} />
              <Route path="/home" element={<Home />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipe/:id" element={<RecipeDetail />} />
              <Route path="/cook/:id" element={<CookingAssistant />} />
              <Route path="/rate/:id" element={<RateMeal />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
