import { useState, useEffect, useCallback, useRef } from 'react';
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

export const usePersonalizedRecommendations = (initialPage: number = 0, pageSize: number = 10) => {
  const { user } = useAuth();
  const { history } = useSearchHistory();
  const [recommendations, setRecommendations] = useState<RecommendedTitle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const loadedIdsRef = useRef<Set<string>>(new Set());
  const currentPageRef = useRef(0);

  const loadRecommendations = useCallback(async (append: boolean = false) => {
    if (!user) {
      setRecommendations([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Récupérer les favoris en parallèle (optimisation)
      const [likedTitlesResult, likedCategoriesResult] = await Promise.all([
        supabase
          .from('user_favorites')
          .select('item_id')
          .eq('user_id', user.id)
          .eq('item_type', 'title'),
        supabase
          .from('user_favorites')
          .select('item_id')
          .eq('user_id', user.id)
          .eq('item_type', 'category')
      ]);

      const likedTitleIds = likedTitlesResult.data?.map(t => t.item_id) || [];
      const likedCategoryIds = likedCategoriesResult.data?.map(c => c.item_id) || [];

      let allRecommendedTitles: RecommendedTitle[] = [];

      // 3. Si l'utilisateur a liké des catégories, récupérer les titres de ces catégories
      if (likedCategoryIds.length > 0) {
        const { data: subcategories } = await supabase
          .from('subcategories')
          .select('id, category_id, name')
          .in('category_id', likedCategoryIds)
          .limit(50);

        const subcategoryIds = subcategories?.map(s => s.id) || [];
        const subcategoryMap = new Map(subcategories?.map(s => [s.id, s]) || []);

        if (subcategoryIds.length > 0) {
          // Utiliser une seule requête avec jointure pour optimiser
          const excludeIds = likedTitleIds.length > 0 ? likedTitleIds : ['00000000-0000-0000-0000-000000000000'];
          const { data: titles } = await supabase
            .from('content_titles')
            .select(`
              id,
              title,
              subcategory_id,
              subcategories!inner(id, name, category_id, categories(id, name))
            `)
            .in('subcategory_id', subcategoryIds)
            .not('id', 'in', `(${excludeIds.join(',')})`)
            .limit(50);

          if (titles && titles.length > 0) {
            const categoryTitles = titles
              .filter((title: any) => !loadedIdsRef.current.has(title.id))
              .map((title: any) => {
                const subcat = subcategoryMap.get(title.subcategory_id) || title.subcategories;
                const category = title.subcategories?.categories || null;
                return {
                  id: title.id,
                  title: title.title,
                  category_id: subcat?.category_id || category?.id,
                  subcategory_id: title.subcategory_id,
                  category_name: category?.name,
                  subcategory_name: subcat?.name || title.subcategories?.name,
                  relevance_score: 0.8
                };
              });
            
            allRecommendedTitles = [...allRecommendedTitles, ...categoryTitles];
          }
        }
      }

      // 4. Analyser l'historique de recherche
      if (history.length > 0) {
        const searchKeywords = history
          .slice(0, 10)
          .map(h => h.query.toLowerCase())
          .join(' ');

        const keywords = searchKeywords
          .split(' ')
          .filter(k => k.length > 3)
          .slice(0, 5);
        
        if (keywords.length > 0) {
          const orConditions = keywords.map(k => `title.ilike.%${k}%`).join(',');
          const excludeIds = [...likedTitleIds, ...allRecommendedTitles.map(t => t.id)];
          
          const { data: searchTitles } = await supabase
            .from('content_titles')
            .select(`
              id,
              title,
              subcategory_id,
              subcategories(id, name, category_id)
            `)
            .or(orConditions)
            .not('id', 'in', `(${excludeIds.filter(Boolean).join(',') || 'null'})`)
            .limit(30);

          if (searchTitles && searchTitles.length > 0) {
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

            const searchRecommendations = searchTitles
              .filter((title: any) => !loadedIdsRef.current.has(title.id))
              .map((title: any) => {
                const subcat = subcatMap.get(title.subcategory_id);
                const cat = subcat?.category_id ? catMap.get(subcat.category_id) : null;
                return {
                  id: title.id,
                  title: title.title,
                  category_id: subcat?.category_id,
                  subcategory_id: title.subcategory_id,
                  category_name: cat?.name,
                  subcategory_name: subcat?.name,
                  relevance_score: 0.6
                };
              });
            
            allRecommendedTitles = [...allRecommendedTitles, ...searchRecommendations];
          }
        }
      }

      // 5. Charger des titres populaires pour compléter (optimisé avec jointure)
      const offset = loadedIdsRef.current.size;
      const excludeIds = [...likedTitleIds, ...allRecommendedTitles.map(t => t.id)].filter(Boolean);
      
      // Utiliser une seule requête avec jointure pour éviter les requêtes multiples
      const excludeCondition = excludeIds.length > 0 
        ? excludeIds.join(',') 
        : '00000000-0000-0000-0000-000000000000';
      
      const { data: popularTitles } = await supabase
        .from('content_titles')
        .select(`
          id,
          title,
          subcategory_id,
          subcategories!inner(id, name, category_id, categories(id, name))
        `)
        .not('id', 'in', `(${excludeCondition})`)
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (popularTitles && popularTitles.length > 0) {
        const popularRecommendations = popularTitles
          .filter((title: any) => !loadedIdsRef.current.has(title.id))
          .map((title: any) => {
            const subcat = title.subcategories;
            const cat = subcat?.categories || null;
            return {
              id: title.id,
              title: title.title,
              category_id: subcat?.category_id || cat?.id,
              subcategory_id: title.subcategory_id,
              category_name: cat?.name,
              subcategory_name: subcat?.name,
              relevance_score: 0.4
            };
          });
        
        allRecommendedTitles = [...allRecommendedTitles, ...popularRecommendations];
      }

      // 6. Trier par score de pertinence et prendre la page demandée
      allRecommendedTitles = allRecommendedTitles
        .sort((a, b) => b.relevance_score - a.relevance_score)
        .filter(t => !loadedIdsRef.current.has(t.id))
        .slice(0, pageSize);

      // Mettre à jour les IDs chargés
      allRecommendedTitles.forEach(t => loadedIdsRef.current.add(t.id));

      if (append) {
        setRecommendations(prev => [...prev, ...allRecommendedTitles]);
      } else {
        setRecommendations(allRecommendedTitles);
        loadedIdsRef.current.clear();
        allRecommendedTitles.forEach(t => loadedIdsRef.current.add(t.id));
      }

      // Vérifier s'il y a plus de contenu
      setHasMore(allRecommendedTitles.length === pageSize);
      currentPageRef.current += 1;
    } catch (err) {
      console.error('Erreur lors du chargement des recommandations:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, [user, history, pageSize]);

  useEffect(() => {
    if (initialPage === 0) {
      loadedIdsRef.current.clear();
      setRecommendations([]);
      currentPageRef.current = 0;
    }
    loadRecommendations(initialPage > 0);
  }, [initialPage, loadRecommendations]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadRecommendations(true);
    }
  }, [loading, hasMore, loadRecommendations]);

  return {
    recommendations,
    loading,
    error,
    hasMore,
    loadMore,
    refreshRecommendations: () => {
      loadedIdsRef.current.clear();
      setRecommendations([]);
      currentPageRef.current = 0;
      loadRecommendations(false);
    }
  };
};
