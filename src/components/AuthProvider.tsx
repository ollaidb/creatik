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
        if (isOAuthCallback) {
          // Si on vient d'un callback OAuth, récupérer la session
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setSession(session);
            setUser(session.user);
          } else {
            setSession(null);
            setUser(null);
          }
        } else {
          // Ne pas récupérer la session au démarrage - l'utilisateur doit se connecter explicitement
          // Initialiser l'état à null sans récupérer la session existante
          // La session dans le localStorage sera ignorée par le listener
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

    // Set up auth state listener pour les connexions explicites uniquement
    // Utiliser un délai plus long pour ignorer les événements initiaux qui peuvent restaurer une session
    let ignoreInitialEvents = !isOAuthCallback;
    let ignoreTimeout: NodeJS.Timeout | null = null;
    if (ignoreInitialEvents) {
      // Ignorer les événements pendant 3 secondes pour être sûr que la session n'est pas restaurée automatiquement
      ignoreTimeout = setTimeout(() => {
        ignoreInitialEvents = false;
      }, 3000);
    }

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

        // Ignorer tous les événements initiaux qui peuvent restaurer automatiquement une session
        // Ne traiter que les événements SIGNED_IN qui se produisent après une action explicite
        if (ignoreInitialEvents || !explicitSignInRef.current) {
          // Ignorer tous les événements qui peuvent restaurer automatiquement une session
          if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
            // Ne pas restaurer la session pour ces événements initiaux
            // Sauf si c'est une connexion explicite (flag mis à true par signIn/signUp)
            if (!explicitSignInRef.current) {
              return;
            }
          }
        }

        // Vérifier si on est l'onglet principal pour éviter les requêtes multiples
        const isPrimaryTab = typeof window !== 'undefined' 
          ? ((window as any).__CREATIK_IS_PRIMARY_TAB__ ?? sessionStorage.getItem('tab-primary') === 'true')
          : true;

        // Traiter uniquement les événements de connexion/déconnexion explicites
        if (event === 'SIGNED_IN') {
          // Accepter uniquement les connexions explicites (le flag est vérifié plus haut)
          setSession(session);
          setUser(session?.user ?? null);
          
          // Réinitialiser le flag après avoir traité la connexion
          explicitSignInRef.current = false;
          
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
        } else if (event === 'TOKEN_REFRESHED' && session && !ignoreInitialEvents) {
          // Accepter le refresh de token seulement si on est déjà connecté et après le délai initial
          setSession(session);
          setUser(session.user);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
      if (ignoreTimeout) {
        clearTimeout(ignoreTimeout);
      }
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