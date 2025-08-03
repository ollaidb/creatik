import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useUserRole = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Vérifier d'abord si la table user_roles existe
        const { data: tableExists, error: tableError } = await supabase
          .from('user_roles')
          .select('count')
          .limit(1);

        if (tableError && tableError.code === '42P01') {
          // Table n'existe pas encore, on considère l'utilisateur comme non-admin
          console.log('Table user_roles does not exist yet, treating user as non-admin');
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Table existe, vérifier le rôle
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error checking role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [user]);

  return { isAdmin, loading };
};
