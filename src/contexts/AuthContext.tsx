import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError, createClient } from '@supabase/supabase-js';

// Vérifier les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Créer une seule instance du client Supabase seulement si les variables sont définies
let supabaseClient = null;
if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
}

// Utiliser cette instance unique
export const supabase = supabaseClient;

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
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
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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
        },
      });
      return { error };
    } catch (error) {
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
      });
      return { error };
    } catch (error) {
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
      });
      return { error };
    } catch (error) {
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 