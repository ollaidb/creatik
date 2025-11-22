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

      // 2. Charger les préférences utilisateur pour la personnalisation
      const { data: userPreferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      let allRecommendedTitles: RecommendedTitle[] = [];

      // 2.1. Si l'utilisateur a défini une catégorie préférée, c'est la priorité maximale
      if (userPreferences?.preferred_category_id) {
        let subcategoryIds: string[] = [];
        
        // Si une sous-catégorie niveau 2 est définie, prioriser celle-ci
        if (userPreferences.preferred_subcategory_level2_id) {
          const { data: level2Subcategory } = await supabase
            .from('subcategories_level2')
            .select('subcategory_id')
            .eq('id', userPreferences.preferred_subcategory_level2_id)
            .single();
          
          if (level2Subcategory?.subcategory_id) {
            subcategoryIds = [level2Subcategory.subcategory_id];
          }
        } 
        // Sinon, si une sous-catégorie niveau 1 est définie
        else if (userPreferences.preferred_subcategory_id) {
          subcategoryIds = [userPreferences.preferred_subcategory_id];
        } 
        // Sinon, prendre toutes les sous-catégories de la catégorie
        else {
          const { data: categorySubcategories } = await supabase
            .from('subcategories')
            .select('id')
            .eq('category_id', userPreferences.preferred_category_id)
            .limit(50);
          
          subcategoryIds = categorySubcategories?.map(s => s.id) || [];
        }

        if (subcategoryIds.length > 0) {
          const excludeIds = likedTitleIds.length > 0 ? likedTitleIds : ['00000000-0000-0000-0000-000000000000'];
          const { data: preferredTitles } = await supabase
            .from('content_titles')
            .select(`
              id,
              title,
              subcategory_id,
              subcategories!inner(id, name, category_id, categories(id, name))
            `)
            .in('subcategory_id', subcategoryIds)
            .not('id', 'in', `(${excludeIds.join(',')})`)
            .limit(30);

          if (preferredTitles && preferredTitles.length > 0) {
            const preferredRecommendations = preferredTitles
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
                  relevance_score: 1.0 // Score maximum pour les préférences définies
                };
              });
            
            allRecommendedTitles = [...allRecommendedTitles, ...preferredRecommendations];
          }
        }
      }

      // 2.2. Si l'utilisateur a sélectionné des titres similaires, trouver des titres similaires
      if (userPreferences?.similar_titles_ids && userPreferences.similar_titles_ids.length > 0) {
        // Récupérer les sous-catégories des titres similaires
        const { data: similarTitles } = await supabase
          .from('content_titles')
          .select('subcategory_id')
          .in('id', userPreferences.similar_titles_ids.slice(0, 10));
        
        const similarSubcategoryIds = [...new Set(similarTitles?.map(t => t.subcategory_id).filter(Boolean) || [])];
        
        if (similarSubcategoryIds.length > 0) {
          const excludeIds = [...likedTitleIds, ...allRecommendedTitles.map(t => t.id)].filter(Boolean);
          const excludeCondition = excludeIds.length > 0 ? excludeIds.join(',') : '00000000-0000-0000-0000-000000000000';
          
          const { data: similarRecommendations } = await supabase
            .from('content_titles')
            .select(`
              id,
              title,
              subcategory_id,
              subcategories!inner(id, name, category_id, categories(id, name))
            `)
            .in('subcategory_id', similarSubcategoryIds)
            .not('id', 'in', `(${excludeCondition})`)
            .limit(20);

          if (similarRecommendations && similarRecommendations.length > 0) {
            const similarRecs = similarRecommendations
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
                  relevance_score: 0.9 // Score élevé pour les titres similaires
                };
              });
            
            allRecommendedTitles = [...allRecommendedTitles, ...similarRecs];
          }
        }
      }

      // 2.3. Si l'utilisateur a sélectionné des créateurs inspirants, trouver leurs catégories/sous-catégories
      if (userPreferences?.inspiring_creators_ids && userPreferences.inspiring_creators_ids.length > 0) {
        const { data: inspiringCreators } = await supabase
          .from('creators')
          .select('category_id, subcategory_id')
          .in('id', userPreferences.inspiring_creators_ids.slice(0, 10));
        
        const creatorCategoryIds = [...new Set(inspiringCreators?.map(c => c.category_id).filter(Boolean) || [])];
        const creatorSubcategoryIds = [...new Set(inspiringCreators?.map(c => c.subcategory_id).filter(Boolean) || [])];
        
        let creatorSubcategoryIdsToUse: string[] = [];
        
        if (creatorSubcategoryIds.length > 0) {
          creatorSubcategoryIdsToUse = creatorSubcategoryIds;
        } else if (creatorCategoryIds.length > 0) {
          const { data: categorySubcategories } = await supabase
            .from('subcategories')
            .select('id')
            .in('category_id', creatorCategoryIds)
            .limit(50);
          
          creatorSubcategoryIdsToUse = categorySubcategories?.map(s => s.id) || [];
        }
        
        if (creatorSubcategoryIdsToUse.length > 0) {
          const excludeIds = [...likedTitleIds, ...allRecommendedTitles.map(t => t.id)].filter(Boolean);
          const excludeCondition = excludeIds.length > 0 ? excludeIds.join(',') : '00000000-0000-0000-0000-000000000000';
          
          const { data: creatorRecommendations } = await supabase
            .from('content_titles')
            .select(`
              id,
              title,
              subcategory_id,
              subcategories!inner(id, name, category_id, categories(id, name))
            `)
            .in('subcategory_id', creatorSubcategoryIdsToUse)
            .not('id', 'in', `(${excludeCondition})`)
            .limit(20);

          if (creatorRecommendations && creatorRecommendations.length > 0) {
            const creatorRecs = creatorRecommendations
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
                  relevance_score: 0.85 // Score élevé pour les créateurs inspirants
                };
              });
            
            allRecommendedTitles = [...allRecommendedTitles, ...creatorRecs];
          }
        }
      }

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
