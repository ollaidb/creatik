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
import Publish from "./pages/Publish";
import Categories from "./pages/Categories";
import CategoryDetails from "./pages/CategoryDetails";
import SubcategoryDetails from "./pages/SubcategoryDetails";
import AdminPublications from "./pages/admin/Publications";

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
              <Route path="/categories/:categoryId" element={<CategoryDetails />} />
              <Route path="/categories/:categoryId/subcategories/:subcategoryId" element={<SubcategoryDetails />} />
              
              {/* Profile Routes */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/favorites" element={<Favorites />} />
              <Route path="/profile/privacy" element={<Privacy />} />
              <Route path="/profile/history" element={<History />} />
              <Route path="/profile/preferences" element={<Preferences />} />
              <Route path="/profile/legal" element={<Legal />} />
              <Route path="/profile/contact" element={<Contact />} />
              <Route path="/profile/publications" element={<Publications />} />
              
              {/* Admin Routes */}
              <Route path="/admin/publications" element={<AdminPublications />} />
              
              {/* Publish Route */}
              <Route path="/publish" element={<Publish />} />
              
              {/* Inspiration Card Routes */}
              <Route path="/ideas/trending" element={<NotFound />} />
              <Route path="/categories/explore" element={<Categories />} />
              <Route path="/ideas/create" element={<NotFound />} />
              <Route path="/profile/creations" element={<NotFound />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
