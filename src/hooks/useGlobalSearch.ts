import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GlobalSearchResult {
  id: string;
  title: string;
  content_type: 'category' | 'subcategory' | 'title' | 'creator' | 'event' | 'hook' | 'blog' | 'article' | 'source';
  category_name?: string;
  subcategory_name?: string;
  subcategory_id?: string;
  category_id?: string;
  description?: string;
  platform?: string;
  relevance: number;
  metadata?: Record<string, unknown>;
}

export const useGlobalSearch = () => {
  const [searchResults, setSearchResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsCacheRef = useRef<Map<string, GlobalSearchResult[]>>(new Map());

  const calculateRelevance = (text: string, searchTerm: string): number => {
    const textLower = text.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    // Correspondance exacte
    if (textLower === searchLower) return 100;
    
    // Commence par le terme de recherche
    if (textLower.startsWith(searchLower)) return 90;
    
    // Contient le terme de recherche
    if (textLower.includes(searchLower)) return 70;
    
    // Correspondance partielle par mots
    const searchWords = searchLower.split(' ').filter(w => w.length > 0);
    const textWords = textLower.split(' ');
    const matchingWords = searchWords.filter(word => 
      textWords.some(textWord => textWord.includes(word))
    );
    
    if (matchingWords.length > 0) {
      return 50 + (matchingWords.length / searchWords.length) * 20;
    }
    
    return 30;
  };

  const searchGlobal = async (searchTerm: string): Promise<GlobalSearchResult[]> => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return [];
    }

    const searchTermLower = searchTerm.toLowerCase().trim();
    
    // Vérifier le cache
    if (resultsCacheRef.current.has(searchTermLower)) {
      const cachedResults = resultsCacheRef.current.get(searchTermLower);
      if (cachedResults && cachedResults.length > 0) {
        setSearchResults(cachedResults);
        return cachedResults;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const results: GlobalSearchResult[] = [];

      // 1. Rechercher dans les catégories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name')
        .ilike('name', `%${searchTermLower}%`)
        .limit(5);

      if (categoriesData) {
        categoriesData.forEach((item) => {
          results.push({
            id: item.id,
            title: item.name,
            content_type: 'category',
            category_name: item.name,
            relevance: calculateRelevance(item.name, searchTermLower)
          });
        });
      }

      // 2. Rechercher dans les sous-catégories
      const { data: subcategoriesData } = await supabase
        .from('subcategories')
        .select(`
          id,
          name,
          categories!inner(id, name)
        `)
        .ilike('name', `%${searchTermLower}%`)
        .limit(5);

      if (subcategoriesData) {
        subcategoriesData.forEach((item: any) => {
          results.push({
            id: item.id,
            title: item.name,
            content_type: 'subcategory',
            category_name: item.categories?.name || '',
            subcategory_name: item.name,
            category_id: item.categories?.id || '',
            relevance: calculateRelevance(item.name, searchTermLower)
          });
        });
      }

      // 3. Rechercher dans les titres (content_titles)
      const { data: titlesData } = await supabase
        .from('content_titles')
        .select(`
          id,
          title,
          platform,
          type,
          subcategories!left(
            id,
            name,
            categories!left(id, name)
          )
        `)
        .ilike('title', `%${searchTermLower}%`)
        .limit(10);

      if (titlesData) {
        titlesData.forEach((item: any) => {
          results.push({
            id: item.id,
            title: item.title,
            content_type: 'title',
            category_name: item.subcategories?.categories?.name || '',
            subcategory_name: item.subcategories?.name || '',
            subcategory_id: item.subcategories?.id || '',
            category_id: item.subcategories?.categories?.id || '',
            platform: item.platform,
            relevance: calculateRelevance(item.title, searchTermLower)
          });
        });
      }

      // 4. Rechercher dans les hooks (content_titles avec type='hook')
      const { data: hooksData } = await supabase
        .from('content_titles')
        .select(`
          id,
          title,
          platform,
          subcategories!left(
            id,
            name,
            categories!left(id, name)
          )
        `)
        .eq('type', 'hook')
        .ilike('title', `%${searchTermLower}%`)
        .limit(5);

      if (hooksData) {
        hooksData.forEach((item: any) => {
          results.push({
            id: item.id,
            title: item.title,
            content_type: 'hook',
            category_name: item.subcategories?.categories?.name || '',
            subcategory_name: item.subcategories?.name || '',
            subcategory_id: item.subcategories?.id || '',
            category_id: item.subcategories?.categories?.id || '',
            platform: item.platform,
            relevance: calculateRelevance(item.title, searchTermLower)
          });
        });
      }

      // 5. Rechercher dans les créateurs
      const { data: creatorsData } = await supabase
        .from('creators')
        .select(`
          id,
          name,
          display_name,
          bio,
          category_id,
          subcategory_id,
          categories:category_id(id, name),
          subcategories:subcategory_id(id, name)
        `)
        .or(`name.ilike.%${searchTermLower}%,display_name.ilike.%${searchTermLower}%,bio.ilike.%${searchTermLower}%`)
        .limit(5);

      if (creatorsData) {
        creatorsData.forEach((item: any) => {
          const displayName = item.display_name || item.name;
          results.push({
            id: item.id,
            title: displayName,
            content_type: 'creator',
            description: item.bio,
            category_name: item.categories?.name || '',
            subcategory_name: item.subcategories?.name || '',
            category_id: item.category_id,
            subcategory_id: item.subcategory_id,
            relevance: Math.max(
              calculateRelevance(displayName, searchTermLower),
              item.bio ? calculateRelevance(item.bio, searchTermLower) * 0.7 : 0
            )
          });
        });
      }

      // 6. Rechercher dans les événements (daily_events)
      const { data: eventsData } = await supabase
        .from('daily_events')
        .select('id, title, person_name, description, date, event_type')
        .or(`title.ilike.%${searchTermLower}%,person_name.ilike.%${searchTermLower}%,description.ilike.%${searchTermLower}%`)
        .eq('is_active', true)
        .limit(5);

      if (eventsData) {
        eventsData.forEach((item: any) => {
          const eventTitle = item.person_name || item.title;
          results.push({
            id: item.id,
            title: eventTitle,
            content_type: 'event',
            description: item.description,
            relevance: Math.max(
              calculateRelevance(eventTitle, searchTermLower),
              item.description ? calculateRelevance(item.description, searchTermLower) * 0.7 : 0
            ),
            metadata: {
              event_type: item.event_type,
              date: item.date
            }
          });
        });
      }

      // 7. Rechercher dans les blogs
      const { data: blogsData } = await supabase
        .from('content_blogs')
        .select(`
          id,
          title,
          content,
          platform,
          category_id,
          subcategory_id
        `)
        .ilike('title', `%${searchTermLower}%`)
        .limit(5);

      if (blogsData && blogsData.length > 0) {
        // Récupérer les catégories et sous-catégories séparément
        const categoryIds = [...new Set(blogsData.map(b => b.category_id).filter(Boolean))];
        const subcategoryIds = [...new Set(blogsData.map(b => b.subcategory_id).filter(Boolean))];
        
        const categoriesMap = new Map();
        const subcategoriesMap = new Map();
        
        if (categoryIds.length > 0) {
          const { data: cats } = await supabase
            .from('categories')
            .select('id, name')
            .in('id', categoryIds);
          if (cats) {
            cats.forEach(cat => categoriesMap.set(cat.id, cat.name));
          }
        }
        
        if (subcategoryIds.length > 0) {
          const { data: subcats } = await supabase
            .from('subcategories')
            .select('id, name, category_id')
            .in('id', subcategoryIds);
          if (subcats) {
            subcats.forEach(subcat => subcategoriesMap.set(subcat.id, subcat));
          }
        }
        
        blogsData.forEach((item: any) => {
          const subcat = subcategoriesMap.get(item.subcategory_id);
          results.push({
            id: item.id,
            title: item.title,
            content_type: 'blog',
            description: item.content,
            category_name: subcat ? categoriesMap.get(subcat.category_id) || '' : '',
            subcategory_name: subcat?.name || '',
            subcategory_id: item.subcategory_id || '',
            category_id: subcat?.category_id || item.category_id || '',
            platform: item.platform,
            relevance: calculateRelevance(item.title, searchTermLower)
          });
        });
      }

      // 8. Rechercher dans les articles
      const { data: articlesData } = await supabase
        .from('content_articles')
        .select(`
          id,
          title,
          content,
          platform,
          category_id,
          subcategory_id
        `)
        .ilike('title', `%${searchTermLower}%`)
        .limit(5);

      if (articlesData && articlesData.length > 0) {
        // Récupérer les catégories et sous-catégories séparément
        const categoryIds = [...new Set(articlesData.map(a => a.category_id).filter(Boolean))];
        const subcategoryIds = [...new Set(articlesData.map(a => a.subcategory_id).filter(Boolean))];
        
        const categoriesMap = new Map();
        const subcategoriesMap = new Map();
        
        if (categoryIds.length > 0) {
          const { data: cats } = await supabase
            .from('categories')
            .select('id, name')
            .in('id', categoryIds);
          if (cats) {
            cats.forEach(cat => categoriesMap.set(cat.id, cat.name));
          }
        }
        
        if (subcategoryIds.length > 0) {
          const { data: subcats } = await supabase
            .from('subcategories')
            .select('id, name, category_id')
            .in('id', subcategoryIds);
          if (subcats) {
            subcats.forEach(subcat => subcategoriesMap.set(subcat.id, subcat));
          }
        }
        
        articlesData.forEach((item: any) => {
          const subcat = subcategoriesMap.get(item.subcategory_id);
          results.push({
            id: item.id,
            title: item.title,
            content_type: 'article',
            description: item.content,
            category_name: subcat ? categoriesMap.get(subcat.category_id) || '' : '',
            subcategory_name: subcat?.name || '',
            subcategory_id: item.subcategory_id || '',
            category_id: subcat?.category_id || item.category_id || '',
            platform: item.platform,
            relevance: calculateRelevance(item.title, searchTermLower)
          });
        });
      }

      // 9. Rechercher dans les sources
      const { data: sourcesData } = await supabase
        .from('sources')
        .select('id, name, description, url')
        .ilike('name', `%${searchTermLower}%`)
        .limit(5);

      if (sourcesData) {
        sourcesData.forEach((item: any) => {
          results.push({
            id: item.id,
            title: item.name,
            content_type: 'source',
            description: item.description,
            relevance: calculateRelevance(item.name, searchTermLower),
            metadata: {
              url: item.url
            }
          });
        });
      }

      // Trier par pertinence et limiter à 20 résultats
      const sortedResults = results
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 20);

      // Mettre en cache
      resultsCacheRef.current.set(searchTermLower, sortedResults);
      setSearchResults(sortedResults);
      return sortedResults;
    } catch (err) {
      console.error('Erreur lors de la recherche globale:', err);
      setError('Erreur lors de la recherche');
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults([]);
    setError(null);
  };

  return {
    searchResults,
    loading,
    error,
    searchGlobal,
    clearSearch
  };
};

