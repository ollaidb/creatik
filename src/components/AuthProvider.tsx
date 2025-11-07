import { useState, useEffect, useRef } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext, type AuthContextType } from '@/contexts/AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const explicitSignInRef = useRef(false);

  useEffect(() => {
    // Ne plus récupérer automatiquement la session au démarrage
    // L'utilisateur doit se connecter explicitement via signIn/signUp
    
    // Vérifier si on vient d'un callback OAuth (paramètres dans l'URL)
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const isOAuthCallback = urlParams.has('code') || hashParams.has('access_token') || 
                           window.location.pathname === '/auth/callback';

    // Initialiser l'état d'authentification
    const initializeAuth = async () => {
      try {
        // Toujours récupérer la session au démarrage pour restaurer la connexion
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session && !error) {
          setSession(session);
          setUser(session.user);
          explicitSignInRef.current = true; // Marquer comme session valide
          
          // Charger le type d'utilisateur depuis la base de données
          if (session.user?.id) {
            try {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('id', session.user.id)
                .single();
              
              if (!profileError && profile?.user_type) {
                localStorage.setItem('userProfileType', profile.user_type);
              }
            } catch (error) {
              console.warn('Erreur lors du chargement du type d\'utilisateur:', error);
            }
          }
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.warn('Erreur lors de l\'initialisation de l\'authentification:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state listener
    // Ne plus ignorer les événements initiaux - on veut restaurer la session automatiquement
    let ignoreInitialEvents = false;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Pour les callbacks OAuth, accepter immédiatement la session
        // Vérifier si on vient d'un callback OAuth ou si une connexion OAuth est en cours
        const isOAuthInProgress = sessionStorage.getItem('oauth_signin_in_progress') === 'true';
        if ((isOAuthCallback || isOAuthInProgress) && event === 'SIGNED_IN') {
          ignoreInitialEvents = false; // Plus besoin d'ignorer après une connexion OAuth
          explicitSignInRef.current = true; // Marquer comme connexion explicite
          sessionStorage.removeItem('oauth_signin_in_progress'); // Nettoyer le flag
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Charger le type d'utilisateur depuis la base de données
          if (session?.user?.id) {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('id', session.user.id)
                .single();
              
              if (!error && profile?.user_type) {
                localStorage.setItem('userProfileType', profile.user_type);
              }
            } catch (error) {
              console.warn('Erreur lors du chargement du type d\'utilisateur:', error);
            }
          }
          return;
        }

        // Accepter tous les événements de session valides
        // INITIAL_SESSION : restaurer la session au chargement
        // TOKEN_REFRESHED : maintenir la session active
        // SIGNED_IN : nouvelle connexion
        if (event === 'INITIAL_SESSION' && session) {
          // Restaurer la session au chargement de la page
          setSession(session);
          setUser(session.user);
          explicitSignInRef.current = true;
          setLoading(false);
          
          // Charger le type d'utilisateur si nécessaire
          if (session.user?.id) {
            try {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('id', session.user.id)
                .single();
              
              if (!profileError && profile?.user_type) {
                localStorage.setItem('userProfileType', profile.user_type);
              }
            } catch (error) {
              console.warn('Erreur lors du chargement du type d\'utilisateur:', error);
            }
          }
          return;
        }

        // Vérifier si on est l'onglet principal pour éviter les requêtes multiples
        const isPrimaryTab = typeof window !== 'undefined' 
          ? ((window as any).__CREATIK_IS_PRIMARY_TAB__ ?? sessionStorage.getItem('tab-primary') === 'true')
          : true;

        // Traiter les événements de connexion/déconnexion
        if (event === 'SIGNED_IN') {
          // Accepter toutes les connexions (explicites ou restaurées)
          setSession(session);
          setUser(session?.user ?? null);
          explicitSignInRef.current = true;
          
          // Charger le type d'utilisateur depuis la base de données UNIQUEMENT dans l'onglet principal
          // pour éviter les requêtes multiples
          if (session?.user?.id && isPrimaryTab) {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('id', session.user.id)
                .single();
              
              if (!error && profile?.user_type) {
                // Sauvegarder le type d'utilisateur dans localStorage pour adapter le profil
                // Les autres onglets utiliseront cette valeur depuis localStorage
                localStorage.setItem('userProfileType', profile.user_type);
              }
            } catch (error) {
              console.warn('Erreur lors du chargement du type d\'utilisateur:', error);
            }
          } else if (session?.user?.id && !isPrimaryTab) {
            // Dans les autres onglets, récupérer depuis localStorage
            const savedProfileType = localStorage.getItem('userProfileType');
            if (savedProfileType) {
              // Le type de profil est déjà sauvegardé par l'onglet principal
              // On n'a pas besoin de faire de requête
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          // Supprimer le type d'utilisateur du localStorage à la déconnexion
          localStorage.removeItem('userProfileType');
          // Réinitialiser le flag de connexion explicite
          explicitSignInRef.current = false;
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Accepter le refresh de token pour maintenir la session active
          setSession(session);
          setUser(session.user);
          explicitSignInRef.current = true;
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    // Marquer que c'est une connexion explicite
    explicitSignInRef.current = true;
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    // Marquer que c'est une connexion explicite
    explicitSignInRef.current = true;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const signInWithGoogle = async () => {
    // Marquer que c'est une connexion explicite (pour OAuth, utiliser sessionStorage car on sera redirigé)
    explicitSignInRef.current = true;
    sessionStorage.setItem('oauth_signin_in_progress', 'true');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { error };
  };

  const signInWithApple = async () => {
    // Marquer que c'est une connexion explicite (pour OAuth, utiliser sessionStorage car on sera redirigé)
    explicitSignInRef.current = true;
    sessionStorage.setItem('oauth_signin_in_progress', 'true');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      signInWithGoogle,
      signInWithApple
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 