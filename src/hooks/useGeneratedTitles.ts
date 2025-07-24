import { useQuery } from '@tanstack/react-query';

export const useGeneratedTitles = (subcategoryId?: string) => {
  return useQuery({
    queryKey: ['generated-titles', subcategoryId],
    queryFn: async () => {
      // Données mock en attendant la migration
      return [
        { id: '1', title_text: 'Comment créer du contenu viral sur TikTok', source_type: 'combinatoire', engagement_potential: 8 },
        { id: '2', title_text: 'Les secrets des influenceurs Instagram', source_type: 'ai', engagement_potential: 9 },
        { id: '3', title_text: '5 erreurs à éviter quand tu postes', source_type: 'combinatoire', engagement_potential: 7 },
        { id: '4', title_text: 'Pourquoi ton contenu ne marche pas', source_type: 'ai', engagement_potential: 8 },
        { id: '5', title_text: 'Comment devenir viral en 30 jours', source_type: 'combinatoire', engagement_potential: 9 },
        { id: '6', title_text: 'Les meilleures pratiques TikTok', source_type: 'combinatoire', engagement_potential: 8 },
        { id: '7', title_text: 'Stratégies de croissance Instagram', source_type: 'ai', engagement_potential: 9 },
        { id: '8', title_text: 'Créer du contenu authentique', source_type: 'combinatoire', engagement_potential: 7 },
      ];
      
      // TODO: Décommenter quand la migration sera appliquée
      /*
      let query = supabase
        .from('generated_titles')
        .select(`
          *,
          template:title_templates(template_text, description)
        `)
        .order('created_at', { ascending: false });
      
      if (subcategoryId) {
        query = query.eq('subcategory_id', subcategoryId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
      */
    },
    enabled: !!subcategoryId
  });
}; 