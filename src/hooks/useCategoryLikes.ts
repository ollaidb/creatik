
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Fonction pour obtenir l'IP de l'utilisateur (simulation)
const getUserIP = () => {
  return localStorage.getItem('user_ip') || 'anonymous_' + Math.random().toString(36).substr(2, 9);
};

export const useCategoryLikes = (categoryId: string) => {
  const queryClient = useQueryClient();
  const userIP = getUserIP();

  // Sauvegarder l'IP dans le localStorage si elle n'existe pas
  useEffect(() => {
    if (!localStorage.getItem('user_ip')) {
      localStorage.setItem('user_ip', userIP);
    }
  }, [userIP]);

  // Récupérer le nombre de likes
  const { data: category } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('likes_count')
        .eq('id', categoryId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Vérifier si l'utilisateur a déjà liké
  const { data: hasLiked } = useQuery({
    queryKey: ['category_like', categoryId, userIP],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('category_likes')
        .select('id')
        .eq('category_id', categoryId)
        .eq('user_ip', userIP)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    }
  });

  // Mutation pour liker/unliker
  const likeMutation = useMutation({
    mutationFn: async (isLiking: boolean) => {
      if (isLiking) {
        // Ajouter le like
        const { error: likeError } = await supabase
          .from('category_likes')
          .insert({ category_id: categoryId, user_ip: userIP });
        
        if (likeError) throw likeError;

        // Incrémenter le compteur
        const { error: updateError } = await supabase
          .from('categories')
          .update({ likes_count: (category?.likes_count || 0) + 1 })
          .eq('id', categoryId);
        
        if (updateError) throw updateError;
      } else {
        // Retirer le like
        const { error: unlikeError } = await supabase
          .from('category_likes')
          .delete()
          .eq('category_id', categoryId)
          .eq('user_ip', userIP);
        
        if (unlikeError) throw unlikeError;

        // Décrémenter le compteur
        const { error: updateError } = await supabase
          .from('categories')
          .update({ likes_count: Math.max(0, (category?.likes_count || 0) - 1) })
          .eq('id', categoryId);
        
        if (updateError) throw updateError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category', categoryId] });
      queryClient.invalidateQueries({ queryKey: ['category_like', categoryId, userIP] });
    }
  });

  const toggleLike = () => {
    likeMutation.mutate(!hasLiked);
  };

  return {
    likesCount: category?.likes_count || 0,
    hasLiked: !!hasLiked,
    toggleLike,
    isLoading: likeMutation.isPending
  };
};
