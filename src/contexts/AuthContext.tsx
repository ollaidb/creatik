import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signInWithApple: () => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si Supabase n'est pas configuré, on simule un utilisateur connecté pour le développement
    if (!supabase) {
      console.warn('Supabase non configuré - mode développement activé');
      setLoading(false);
      return;
    }

    // Récupérer la session initiale
    const getSession = async () => {
      try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
      } finally {
      setLoading(false);
      }
    };

    getSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    if (!supabase) {
      console.warn('Supabase non configuré');
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/auth/callback`
        },
      });
      return { error };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      console.warn('Supabase non configuré');
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      console.warn('Supabase non configuré');
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      return { error: error as AuthError };
    }
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      console.warn('Supabase non configuré');
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      return { error };
    } catch (error) {
      console.error('Erreur lors de la connexion Google:', error);
      return { error: error as AuthError };
    }
  };

  const signInWithApple = async () => {
    if (!supabase) {
      console.warn('Supabase non configuré');
      return { error: null };
    }
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      return { error };
    } catch (error) {
      console.error('Erreur lors de la connexion Apple:', error);
      return { error: error as AuthError };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithApple,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 