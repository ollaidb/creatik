import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import VisitTracker from "@/components/VisitTracker";
import CacheManager from "@/components/CacheManager";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthGuard from "@/components/AuthGuard";
import WelcomeMessage from "@/components/WelcomeMessage";
import LogoutMessage from "@/components/LogoutMessage";
import { TabCoordinator } from "@/components/TabCoordinator";
import { AuthErrorHandler } from "@/components/AuthErrorHandler";

// Composants critiques chargés immédiatement
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";

// Lazy loading pour toutes les autres pages - réduction du bundle initial
const Profile = lazy(() => import("./pages/Profile"));
const ContributorProfile = lazy(() => import("./pages/ContributorProfile"));
const MyContributions = lazy(() => import("./pages/MyContributions"));
const Favorites = lazy(() => import("./pages/profile/Favorites"));
const Preferences = lazy(() => import("./pages/profile/Preferences"));
const Settings = lazy(() => import("./pages/profile/Settings"));
const History = lazy(() => import("./pages/profile/History"));
const Legal = lazy(() => import("./pages/profile/Legal"));
const Contact = lazy(() => import("./pages/profile/Contact"));
const Publications = lazy(() => import("./pages/profile/Publications"));
const Publish = lazy(() => import("./pages/Publish"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Categories = lazy(() => import("./pages/Categories"));
const Subcategories = lazy(() => import("./pages/Subcategories"));
const SubcategoriesLevel2 = lazy(() => import("./pages/SubcategoriesLevel2"));
const Titles = lazy(() => import("./pages/Titles"));
const Hooks = lazy(() => import("./pages/Hooks"));
const PublicChallenges = lazy(() => import("./pages/PublicChallenges"));
const UsernameIdeas = lazy(() => import("./pages/UsernameIdeas"));
const CommunityContent = lazy(() => import("./pages/CommunityContent"));
const CommunityAccounts = lazy(() => import("./pages/CommunityAccounts"));
const CommunityContentDetail = lazy(() => import("./pages/CommunityContentDetail"));
const CommunityAccountDetail = lazy(() => import("./pages/CommunityAccountDetail"));
const Accounts = lazy(() => import("./pages/Accounts"));
const Sources = lazy(() => import("./pages/Sources"));
const TrendingIdeas = lazy(() => import("./pages/TrendingIdeas"));
const WhatToPostToday = lazy(() => import("./pages/WhatToPostToday"));
const ChallengeDetail = lazy(() => import("./pages/ChallengeDetail"));
const CategoryInfo = lazy(() => import("./pages/Info"));
const Events = lazy(() => import("./pages/Events"));
const Creators = lazy(() => import("./pages/Creators"));
const CreatorDetail = lazy(() => import("./pages/CreatorDetail"));
const Notes = lazy(() => import("./pages/Notes"));
const Compte = lazy(() => import("./pages/Compte"));
const Contenu = lazy(() => import("./pages/Contenu"));
const IdeesCompte = lazy(() => import("./pages/IdeesCompte"));
const ContentManagement = lazy(() => import("./pages/ContentManagement"));
const AccountManagement = lazy(() => import("./pages/AccountManagement"));
const ContentDetail = lazy(() => import("./pages/ContentDetail"));
const AccountDetail = lazy(() => import("./pages/AccountDetail"));
const Notifications = lazy(() => import("./pages/profile/Notifications"));
const Resources = lazy(() => import("./pages/profile/Resources"));
const Personalization = lazy(() => import("./pages/profile/Personalization"));
const Language = lazy(() => import("./pages/profile/Language"));
const DisplayMode = lazy(() => import("./pages/profile/DisplayMode"));
const ProfileDetails = lazy(() => import("./pages/profile/ProfileDetails"));
const Account = lazy(() => import("./pages/profile/Account"));
const PrivacySettings = lazy(() => import("./pages/profile/PrivacySettings"));
const ConditionsPolicies = lazy(() => import("./pages/profile/ConditionsPolicies"));
const Support = lazy(() => import("./pages/profile/Support"));
const DatabaseDiagnosticPage = lazy(() => import("./pages/DatabaseDiagnosticPage"));

// Composant de chargement optimisé
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-sm text-muted-foreground">Chargement...</p>
    </div>
  </div>
);

// Restaurer le cache depuis localStorage au démarrage
const restoreCache = () => {
  try {
    const { queryCachePersister } = require('@/utils/queryCachePersister');
    const restoredCache = queryCachePersister.load();
    if (restoredCache) {
      console.log('✅ Cache restauré depuis localStorage');
    }
  } catch (error) {
    console.warn('Erreur lors de la restauration du cache:', error);
  }
};

// Configuration optimisée du QueryClient pour de meilleures performances
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 15, // 15 minutes - données considérées fraîches plus longtemps
      gcTime: 1000 * 60 * 60, // 1 heure - garder en cache plus longtemps
      refetchOnWindowFocus: false, // Ne pas refetch au focus
      refetchOnReconnect: false, // Ne pas refetch automatiquement à la reconnexion
      refetchOnMount: false, // Ne pas refetch au montage - utiliser le cache immédiatement
      retry: async (failureCount, error) => {
        // Si c'est une erreur d'autorisation, essayer de rafraîchir la session une fois
        if (error && typeof error === 'object') {
          const errorMessage = String(error);
          const isAuthErr = errorMessage.includes('permission denied') || 
                           errorMessage.includes('JWT') ||
                           errorMessage.includes('401') ||
                           errorMessage.includes('403') ||
                           ('code' in error && (error as { code?: string }).code === 'PGRST301');
          
          if (isAuthErr && failureCount === 0) {
            // Première tentative : essayer de rafraîchir la session
            try {
              const { refreshSession } = await import('@/utils/authInterceptor');
              const refreshed = await refreshSession();
              if (refreshed) {
                // Si le refresh réussit, réessayer
                return true;
              }
            } catch (refreshError) {
              console.warn('Erreur lors du refresh:', refreshError);
            }
          }
          
          // Ne pas retry si erreur de permission persistante ou autre erreur
          if (isAuthErr || errorMessage.includes('does not exist')) {
            return false;
          }
        }
        // Maximum 1 retry pour les erreurs réseau
        return failureCount < 1;
      },
      retryDelay: 2000,
      // Optimisation réseau
      networkMode: 'online', // Ne faire des requêtes que si en ligne
    },
  },
});

const AppContent = () => {
  return (
    <TabCoordinator>
      <AuthErrorHandler>
        <CacheManager>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <WelcomeMessage />
            <LogoutMessage />
            <BrowserRouter>
              <AuthGuard>
                <VisitTracker>
                  <Suspense fallback={<LoadingFallback />}>
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
                  {/* Communauté Routes */}
                  <Route path="/public-challenges" element={<PublicChallenges />} />
                  <Route path="/community/usernames" element={<UsernameIdeas />} />
                  <Route path="/community/content" element={<CommunityContent />} />
                  <Route path="/community/content/:id" element={<CommunityContentDetail />} />
                  <Route path="/community/accounts" element={<CommunityAccounts />} />
                  <Route path="/community/account/:id" element={<CommunityAccountDetail />} />
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
                  {/* Profile Routes - Accessible to all users */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/contributor-profile" element={<ContributorProfile />} />
                  <Route path="/my-contributions" element={<MyContributions />} />
                  <Route path="/profile/details" element={<ProfileDetails />} />
                  <Route path="/profile/favorites" element={<Favorites />} />
                  <Route path="/profile/history" element={<History />} />
                  <Route path="/profile/preferences" element={<Preferences />} />
                  <Route path="/profile/legal" element={<Legal />} />
                  <Route path="/profile/contact" element={<Contact />} />
                  <Route path="/profile/publications" element={<Publications />} />
                  <Route path="/profile/notifications" element={<Notifications />} />
                  <Route path="/profile/settings" element={<Settings />} />
                  <Route path="/profile/resources" element={<Resources />} />
                  <Route path="/profile/personalization" element={<Personalization />} />
                  <Route path="/profile/language" element={<Language />} />
                  <Route path="/profile/display-mode" element={<DisplayMode />} />
                  {/* New Settings Routes - Accessible to all users */}
                  <Route path="/profile/account" element={<Account />} />
                  <Route path="/profile/privacy-settings" element={<PrivacySettings />} />
                  <Route path="/profile/conditions-policies" element={<ConditionsPolicies />} />
                  <Route path="/profile/support" element={<Support />} />
                  <Route path="/database-diagnostic" element={<DatabaseDiagnosticPage />} />
                  {/* Publish Route - Accessible to all users */}
                  <Route path="/publish" element={<Publish />} />
                  <Route path="/search" element={<SearchResults />} />
                  {/* Notes Route - Accessible to all users */}
                  <Route path="/notes" element={<Notes />} />
                  <Route path="/compte" element={<Compte />} />
                  <Route path="/contenu" element={<Contenu />} />
                  <Route path="/idees-compte" element={<IdeesCompte />} />
                  <Route path="/content-management" element={<ContentManagement />} />
                  <Route path="/account-management" element={<AccountManagement />} />
                  <Route path="/content/:id" element={<ContentDetail />} />
                  <Route path="/account/:id" element={<AccountDetail />} />
                  {/* Inspiration Card Routes */}
                  <Route path="/ideas/trending" element={<NotFound />} />
                  <Route path="/categories/explore" element={<Categories />} />
                  <Route path="/ideas/create" element={<NotFound />} />
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </VisitTracker>
          </AuthGuard>
        </BrowserRouter>
      </TooltipProvider>
    </CacheManager>
    </AuthErrorHandler>
    </TabCoordinator>
  );
};

const App = () => {
  // Sauvegarder le cache périodiquement et lors des changements
  React.useEffect(() => {
    const saveCache = () => {
      try {
        const { queryCachePersister } = require('@/utils/queryCachePersister');
        const queryCache = queryClient.getQueryCache();
        const queries = queryCache.getAll();
        const cacheMap = new Map();
        
        queries.forEach((query) => {
          if (query.state.data !== undefined) {
            const queryKey = JSON.stringify(query.queryKey);
            cacheMap.set(queryKey, {
              state: {
                data: query.state.data,
                dataUpdatedAt: query.state.dataUpdatedAt,
                error: query.state.error,
                errorUpdatedAt: query.state.errorUpdatedAt,
                status: query.state.status,
              },
            });
          }
        });
        
        queryCachePersister.save(cacheMap);
      } catch (error) {
        console.warn('Erreur lors de la sauvegarde du cache:', error);
      }
    };
    
    // Écouter les changements du cache
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      // Debounce pour éviter trop de sauvegardes
      clearTimeout((window as any).__cacheSaveTimeout);
      (window as any).__cacheSaveTimeout = setTimeout(saveCache, 1000);
    });
    
    // Sauvegarder toutes les 30 secondes
    const interval = setInterval(saveCache, 30000);
    
    // Sauvegarder avant de quitter la page
    window.addEventListener('beforeunload', saveCache);
    
    return () => {
      unsubscribe();
      clearInterval(interval);
      window.removeEventListener('beforeunload', saveCache);
      saveCache(); // Sauvegarder une dernière fois
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
