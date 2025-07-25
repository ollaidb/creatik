import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
export const useSubcategoryHooks = (subcategoryId: string) => {
  return useQuery({
    queryKey: ['subcategory-hooks', subcategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategory_hooks')
        .select('*')
        .eq('subcategory_id', subcategoryId)
        .order('hook_order');
      if (error) throw error;
      return data;
    },
    enabled: !!subcategoryId
  });
};
export const useSubcategoryHashtags = (subcategoryId: string) => {
  return useQuery({
    queryKey: ['subcategory-hashtags', subcategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategory_hashtags')
        .select('*')
        .eq('subcategory_id', subcategoryId)
        .order('hashtag_order');
      if (error) throw error;
      return data;
    },
    enabled: !!subcategoryId
  });
};
export const useSubcategoryMetrics = (subcategoryId: string) => {
  return useQuery({
    queryKey: ['subcategory-metrics', subcategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategory_metrics')
        .select('*')
        .eq('subcategory_id', subcategoryId)
        .order('metric_order');
      if (error) throw error;
      return data;
    },
    enabled: !!subcategoryId
  });
};
export const useSubcategoryTemplates = (subcategoryId: string) => {
  return useQuery({
    queryKey: ['subcategory-templates', subcategoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subcategory_content_templates')
        .select('*')
        .eq('subcategory_id', subcategoryId)
        .order('created_at');
      if (error) throw error;
      return data;
    },
    enabled: !!subcategoryId
  });
};
// Hook pour déclencher la génération automatique
export const useAutoGenerateContent = () => {
  const generateContent = async (subcategoryId: string) => {
    // Temporarily disabled since Edge Function doesn't exist
    // const { data, error } = await supabase.functions.invoke(
    //   'auto-generate-subcategory-content',
    //   {
    //     body: { subcategoryId }
    //   }
    // );
    // if (error) throw error;
    // return data;
    // For now, just return success without doing anything
    return { success: true, message: 'Auto-generation temporarily disabled' };
  };
  return { generateContent };
};
