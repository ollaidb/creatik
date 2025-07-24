import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/Profile";
import Favorites from "./pages/profile/Favorites";
import Privacy from "./pages/profile/Privacy";
import Preferences from "./pages/profile/Preferences";
import History from "./pages/profile/History";
import Legal from "./pages/profile/Legal";
import Contact from "./pages/profile/Contact";
import Publications from "./pages/profile/Publications";
import Challenges from "./pages/profile/Challenges";
import Trash from "./pages/profile/Trash";
import Publish from "./pages/Publish";
import SearchResults from "./pages/SearchResults";
import Categories from "./pages/Categories";
import Subcategories from "./pages/Subcategories";
import Titles from "./pages/Titles";
import PublicChallenges from "./pages/PublicChallenges";
import AdminPublications from "./pages/admin/Publications";
import ApprovePublications from "./pages/admin/ApprovePublications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Categories Routes */}
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:categoryId/subcategories" element={<Subcategories />} />
              <Route path="/category/:categoryId/subcategory/:subcategoryId" element={<Titles />} />
              
              {/* Challenges Routes */}
              <Route path="/challenges" element={<PublicChallenges />} />
              
              {/* Profile Routes */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/favorites" element={<Favorites />} />
              <Route path="/profile/privacy" element={<Privacy />} />
              <Route path="/profile/history" element={<History />} />
              <Route path="/profile/preferences" element={<Preferences />} />
              <Route path="/profile/legal" element={<Legal />} />
              <Route path="/profile/contact" element={<Contact />} />
              <Route path="/profile/publications" element={<Publications />} />
              <Route path="/profile/challenges" element={<Challenges />} />
              <Route path="/profile/trash" element={<Trash />} />
              
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
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
