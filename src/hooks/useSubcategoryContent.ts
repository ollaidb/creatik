
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useContentTitles = (subcategoryId: string) => {
  return useQuery({
    queryKey: ['content-titles', subcategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_titles')
        .select('*')
        .eq('subcategory_id', subcategoryId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!subcategoryId
  });
};

export const useExemplaryAccounts = (subcategoryId: string) => {
  return useQuery({
    queryKey: ['exemplary-accounts', subcategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exemplary_accounts')
        .select('*')
        .eq('subcategory_id', subcategoryId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!subcategoryId
  });
};

export const useContentExamples = (subcategoryId: string) => {
  return useQuery({
    queryKey: ['content-examples', subcategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_examples')
        .select('*')
        .eq('subcategory_id', subcategoryId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!subcategoryId
  });
};

export const useInspiringContent = (subcategoryId: string) => {
  return useQuery({
    queryKey: ['inspiring-content', subcategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inspiring_content')
        .select('*')
        .eq('subcategory_id', subcategoryId)
        .order('popularity_score', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!subcategoryId
  });
};
