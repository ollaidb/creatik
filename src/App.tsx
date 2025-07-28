import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import VisitTracker from "@/components/VisitTracker";
import CacheManager from "@/components/CacheManager";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/Profile";
import Favorites from "./pages/profile/Favorites";
import Preferences from "./pages/profile/Preferences";
import Settings from "./pages/profile/Settings";
import History from "./pages/profile/History";
import Legal from "./pages/profile/Legal";
import Contact from "./pages/profile/Contact";
import Publications from "./pages/profile/Publications";
import Challenges from "./pages/profile/Challenges";
import Publish from "./pages/Publish";
import SearchResults from "./pages/SearchResults";
import Categories from "./pages/Categories";
import Subcategories from "./pages/Subcategories";
import Titles from "./pages/Titles";
import PublicChallenges from "./pages/PublicChallenges";
import AdminPublications from "./pages/admin/Publications";
import ApprovePublications from "./pages/admin/ApprovePublications";
import Accounts from "./pages/Accounts";
import Sources from "./pages/Sources";
import Events from "./pages/Events";
import TrendingIdeas from "./pages/TrendingIdeas";
import WhatToPostToday from "./pages/WhatToPostToday";

// Configuration optimisée du QueryClient pour éviter les problèmes de cache
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (anciennement cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});

const AppContent = () => {
  return (
    <CacheManager>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <VisitTracker>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* Categories Routes */}
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:categoryId/subcategories" element={<Subcategories />} />
              <Route path="/category/:categoryId/subcategory/:subcategoryId" element={<Titles />} />
              {/* Challenges Routes */}
              <Route path="/challenges" element={<PublicChallenges />} />
              {/* Events Route */}
              <Route path="/events" element={<Events />} />
              {/* Trending Ideas Route */}
              <Route path="/trending" element={<TrendingIdeas />} />
              {/* What to Post Today Route */}
              <Route path="/what-to-post" element={<WhatToPostToday />} />
              {/* Accounts and Sources Routes */}
              <Route path="/accounts" element={<Accounts />} />
              <Route path="/sources" element={<Sources />} />
              {/* Profile Routes */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/favorites" element={<Favorites />} />
              <Route path="/profile/history" element={<History />} />
              <Route path="/profile/preferences" element={<Preferences />} />
              <Route path="/profile/legal" element={<Legal />} />
              <Route path="/profile/contact" element={<Contact />} />
              <Route path="/profile/publications" element={<Publications />} />
              <Route path="/profile/challenges" element={<Challenges />} />
              <Route path="/profile/settings" element={<Settings />} />
              {/* Admin Routes */}
              <Route path="/admin/publications" element={<AdminPublications />} />
              <Route path="/admin/approve-publications" element={<ApprovePublications />} />
              {/* Publish Route */}
              <Route path="/publish" element={<Publish />} />
              <Route path="/search" element={<SearchResults />} />
              {/* Inspiration Card Routes */}
              <Route path="/ideas/trending" element={<NotFound />} />
              <Route path="/categories/explore" element={<Categories />} />
              <Route path="/ideas/create" element={<NotFound />} />
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </VisitTracker>
        </BrowserRouter>
      </TooltipProvider>
    </CacheManager>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
