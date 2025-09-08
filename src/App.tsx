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
import SubcategoriesLevel2 from "./pages/SubcategoriesLevel2";
import Titles from "./pages/Titles";
import Hooks from "./pages/Hooks";
import PublicChallenges from "./pages/PublicChallenges";
import Accounts from "./pages/Accounts";
import Sources from "./pages/Sources";
import TrendingIdeas from "./pages/TrendingIdeas";
import WhatToPostToday from "./pages/WhatToPostToday";
import ChallengeDetail from "./pages/ChallengeDetail";
import CategoryInfo from "./pages/Info";
import Events from "./pages/Events";
import Creators from "./pages/Creators";
import CreatorDetail from "./pages/CreatorDetail";
import AuthCallback from "./pages/AuthCallback";
import Notes from "./pages/Notes";
import Compte from "./pages/Compte";
import Contenu from "./pages/Contenu";
import Notifications from "./pages/profile/Notifications";
import Resources from "./pages/profile/Resources";
import ProfileDetails from "./pages/profile/ProfileDetails";
import UserProfile from "./pages/UserProfile";

// Configuration optimisée du QueryClient pour de meilleures performances
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (anciennement cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
      retryDelay: 1000,
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
            {/* Auth Callback Route */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            {/* Categories Routes */}
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:categoryId/subcategories" element={<Subcategories />} />
            <Route path="/category/:categoryId/subcategory/:subcategoryId/subcategories-level2" element={<SubcategoriesLevel2 />} />
            <Route path="/category/:categoryId/subcategory/:subcategoryId/subcategory-level2/:subcategoryLevel2Id" element={<Titles />} />
            <Route path="/category/:categoryId/subcategory/:subcategoryId" element={<Titles />} />
            <Route path="/category/:categoryId/info" element={<CategoryInfo />} />
            <Route path="/category/:categoryId/subcategory/:subcategoryId/hooks" element={<Hooks />} />
            {/* Challenges Routes */}
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/public-challenges" element={<PublicChallenges />} />
            {/* Trending Ideas Route */}
            <Route path="/trending" element={<TrendingIdeas />} />
            {/* What to Post Today Route */}
            <Route path="/what-to-post" element={<WhatToPostToday />} />
            <Route path="/challenge/:id" element={<ChallengeDetail />} />

            {/* Events Route */}
            <Route path="/events" element={<Events />} />
            {/* Creators Route */}
            <Route path="/creators" element={<Creators />} />
            <Route path="/creator/:creatorId" element={<CreatorDetail />} />
            {/* Accounts and Sources Routes */}
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/sources" element={<Sources />} />
            {/* Profile Routes */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/details" element={<ProfileDetails />} />
            <Route path="/profile/favorites" element={<Favorites />} />
            <Route path="/profile/history" element={<History />} />
            <Route path="/profile/preferences" element={<Preferences />} />
            <Route path="/profile/legal" element={<Legal />} />
            <Route path="/profile/contact" element={<Contact />} />
                        <Route path="/profile/publications" element={<Publications />} />
            <Route path="/profile/challenges" element={<Challenges />} />
            <Route path="/profile/notifications" element={<Notifications />} />
            <Route path="/profile/settings" element={<Settings />} />
            <Route path="/profile/resources" element={<Resources />} />
            {/* Publish Route */}
            <Route path="/publish" element={<Publish />} />
            <Route path="/search" element={<SearchResults />} />
            {/* Notes Route */}
            <Route path="/notes" element={<Notes />} />
            {/* User Profile Route */}
            <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/compte" element={<Compte />} />
        <Route path="/contenu" element={<Contenu />} />
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
