import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useSearchHistory } from './useSearchHistory';

export interface RecommendedTitle {
  id: string;
  title: string;
  category_id?: string;
  subcategory_id?: string;
  category_name?: string;
  subcategory_name?: string;
  relevance_score: number;
}

export const usePersonalizedRecommendations = () => {
  const { user } = useAuth();
  const { history } = useSearchHistory();
  const [recommendations, setRecommendations] = useState<RecommendedTitle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = useCallback(async () => {
    if (!user) {
      setRecommendations([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Récupérer les titres likés
      const { data: likedTitles } = await supabase
        .from('user_favorites')
        .select('item_id')
        .eq('user_id', user.id)
        .eq('item_type', 'title');

      // 2. Récupérer les catégories likées
      const { data: likedCategories } = await supabase
        .from('user_favorites')
        .select('item_id')
        .eq('user_id', user.id)
        .eq('item_type', 'category');

      const likedTitleIds = likedTitles?.map(t => t.item_id) || [];
      const likedCategoryIds = likedCategories?.map(c => c.item_id) || [];

      let recommendedTitles: RecommendedTitle[] = [];

      // 3. Si l'utilisateur a liké des catégories, récupérer les titres de ces catégories
      if (likedCategoryIds.length > 0) {
        // Récupérer les sous-catégories des catégories likées
        const { data: subcategories } = await supabase
          .from('subcategories')
          .select('id, category_id, name')
          .in('category_id', likedCategoryIds);

        const subcategoryIds = subcategories?.map(s => s.id) || [];
        const subcategoryMap = new Map(subcategories?.map(s => [s.id, s]) || []);

        if (subcategoryIds.length > 0) {
          // Récupérer les titres de ces sous-catégories
          const { data: titles } = await supabase
            .from('content_titles')
            .select(`
              id,
              title,
              subcategory_id,
              subcategories(id, name, category_id)
            `)
            .in('subcategory_id', subcategoryIds)
            .limit(20);

          if (titles && titles.length > 0) {
            // Récupérer les catégories pour chaque sous-catégorie
            const categoryIds = [...new Set(subcategories?.map(s => s.category_id).filter(Boolean) || [])];
            const { data: categories } = await supabase
              .from('categories')
              .select('id, name')
              .in('id', categoryIds);

            const categoryMap = new Map(categories?.map(c => [c.id, c]) || []);

            recommendedTitles = titles
              .filter((title: any) => !likedTitleIds.includes(title.id))
              .map((title: any) => {
                const subcat = subcategoryMap.get(title.subcategory_id);
                const category = subcat?.category_id ? categoryMap.get(subcat.category_id) : null;
                return {
                  id: title.id,
                  title: title.title,
                  category_id: subcat?.category_id,
                  subcategory_id: title.subcategory_id,
                  category_name: category?.name,
                  subcategory_name: subcat?.name || title.subcategories?.name,
                  relevance_score: 0.8 // Score élevé pour catégories likées
                };
              });
          }
        }
      }

      // 4. Analyser l'historique de recherche pour trouver des mots-clés fréquents
      if (recommendedTitles.length < 10 && history.length > 0) {
        const searchKeywords = history
          .slice(0, 10)
          .map(h => h.query.toLowerCase())
          .join(' ');

        const keywords = searchKeywords
          .split(' ')
          .filter(k => k.length > 3)
          .slice(0, 5); // Limiter à 5 mots-clés
        
        if (keywords.length > 0) {
          // Construire la requête OR pour chaque mot-clé
          const orConditions = keywords.map(k => `title.ilike.%${k}%`).join(',');
          
          const { data: searchTitles } = await supabase
            .from('content_titles')
            .select(`
              id,
              title,
              subcategory_id,
              subcategories(id, name, category_id)
            `)
            .or(orConditions)
            .not('id', 'in', `(${[...likedTitleIds, ...recommendedTitles.map(t => t.id)].filter(Boolean).join(',') || 'null'})`)
            .limit(10 - recommendedTitles.length);

          if (searchTitles && searchTitles.length > 0) {
            // Récupérer les catégories
            const subcatIds = [...new Set(searchTitles.map((t: any) => t.subcategory_id).filter(Boolean))];
            const { data: subcats } = await supabase
              .from('subcategories')
              .select('id, category_id, name')
              .in('id', subcatIds);
            
            const subcatMap = new Map(subcats?.map(s => [s.id, s]) || []);
            const catIds = [...new Set(subcats?.map(s => s.category_id).filter(Boolean) || [])];
            const { data: cats } = await supabase
              .from('categories')
              .select('id, name')
              .in('id', catIds);
            
            const catMap = new Map(cats?.map(c => [c.id, c]) || []);

            const searchRecommendations = searchTitles.map((title: any) => {
              const subcat = subcatMap.get(title.subcategory_id);
              const cat = subcat?.category_id ? catMap.get(subcat.category_id) : null;
              return {
                id: title.id,
                title: title.title,
                category_id: subcat?.category_id,
                subcategory_id: title.subcategory_id,
                category_name: cat?.name,
                subcategory_name: subcat?.name,
                relevance_score: 0.6 // Score moyen pour recherche
              };
            });
            recommendedTitles = [...recommendedTitles, ...searchRecommendations];
          }
        }
      }

      // 5. Si on n'a toujours pas assez de recommandations, ajouter des titres populaires
      if (recommendedTitles.length < 5) {
        const { data: popularTitles } = await supabase
          .from('content_titles')
          .select(`
            id,
            title,
            subcategory_id,
            subcategories(id, name, category_id)
          `)
          .not('id', 'in', `(${[...likedTitleIds, ...recommendedTitles.map(t => t.id)].filter(Boolean).join(',') || 'null'})`)
          .order('created_at', { ascending: false })
          .limit(5 - recommendedTitles.length);

        if (popularTitles && popularTitles.length > 0) {
          // Récupérer les catégories
          const subcatIds = [...new Set(popularTitles.map((t: any) => t.subcategory_id).filter(Boolean))];
          const { data: subcats } = await supabase
            .from('subcategories')
            .select('id, category_id, name')
            .in('id', subcatIds);
          
          const subcatMap = new Map(subcats?.map(s => [s.id, s]) || []);
          const catIds = [...new Set(subcats?.map(s => s.category_id).filter(Boolean) || [])];
          const { data: cats } = await supabase
            .from('categories')
            .select('id, name')
            .in('id', catIds);
          
          const catMap = new Map(cats?.map(c => [c.id, c]) || []);

          const popularRecommendations = popularTitles.map((title: any) => {
            const subcat = subcatMap.get(title.subcategory_id);
            const cat = subcat?.category_id ? catMap.get(subcat.category_id) : null;
            return {
              id: title.id,
              title: title.title,
              category_id: subcat?.category_id,
              subcategory_id: title.subcategory_id,
              category_name: cat?.name,
              subcategory_name: subcat?.name,
              relevance_score: 0.4 // Score bas pour recommandations générales
            };
          });
          recommendedTitles = [...recommendedTitles, ...popularRecommendations];
        }
      }

      // 6. Trier par score de pertinence et limiter à 5
      recommendedTitles = recommendedTitles
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .slice(0, 5);

      setRecommendations(recommendedTitles);
    } catch (err) {
      console.error('Erreur lors du chargement des recommandations:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [user, history]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  return {
    recommendations,
    loading,
    error,
    refreshRecommendations: loadRecommendations
  };
};

