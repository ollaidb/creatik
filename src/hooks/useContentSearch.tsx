import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
interface SearchResult {
  content_type: 'title' | 'category' | 'subcategory';
  id: string;
  title: string;
  category_name: string;
  subcategory_name?: string;
  subcategory_id?: string;
  category_id?: string;
  relevance: number;
}
interface TitleData {
  id: string;
  title: string;
  subcategories: {
    id: string;
    name: string;
    categories: {
      id: string;
      name: string;
    };
  };
}
interface CategoryData {
  id: string;
  name: string;
}
interface SubcategoryData {
  id: string;
  name: string;
  categories: {
    id: string;
    name: string;
  };
}
export const useContentSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchContent = async (searchTerm: string): Promise<SearchResult[]> => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return [];
    }
    setLoading(true);
    setError(null);
    try {
      const searchTermLower = searchTerm.toLowerCase();
      const results: SearchResult[] = [];
      // 1. Rechercher dans les titres
      const { data: titlesData, error: titlesError } = await (supabase as any)
        .from('content_titles')
        .select(`
          id,
          title,
          subcategories!inner(
            id,
            name,
            categories!inner(
              id,
              name
            )
          )
        `)
        .ilike('title', `%${searchTermLower}%`)
        .limit(10);
      if (titlesError) {
        console.error('Erreur recherche titres:', titlesError);
      } else {
        const titleResults: SearchResult[] = (titlesData || []).map((item: TitleData) => ({
          content_type: 'title',
          id: item.id,
          title: item.title,
          category_name: item.subcategories?.categories?.name || '',
          subcategory_name: item.subcategories?.name || '',
          subcategory_id: item.subcategories?.id || '',
          category_id: item.subcategories?.categories?.id || '',
          relevance: calculateRelevance(item.title, searchTermLower)
        }));
        results.push(...titleResults);
      }
      // 2. Rechercher dans les catégories
      const { data: categoriesData, error: categoriesError } = await (supabase as any)
        .from('categories')
        .select('id, name')
        .ilike('name', `%${searchTermLower}%`)
        .limit(5);
      if (categoriesError) {
        console.error('Erreur recherche catégories:', categoriesError);
      } else {
        const categoryResults: SearchResult[] = (categoriesData || []).map((item: CategoryData) => ({
          content_type: 'category',
          id: item.id,
          title: item.name,
          category_name: item.name,
          relevance: calculateRelevance(item.name, searchTermLower)
        }));
        results.push(...categoryResults);
      }
      // 3. Rechercher dans les sous-catégories
      const { data: subcategoriesData, error: subcategoriesError } = await (supabase as any)
        .from('subcategories')
        .select(`
          id,
          name,
          categories!inner(
            id,
            name
          )
        `)
        .ilike('name', `%${searchTermLower}%`)
        .limit(5);
      if (subcategoriesError) {
        console.error('Erreur recherche sous-catégories:', subcategoriesError);
      } else {
        const subcategoryResults: SearchResult[] = (subcategoriesData || []).map((item: SubcategoryData) => ({
          content_type: 'subcategory',
          id: item.id,
          title: item.name,
          category_name: item.categories?.name || '',
          subcategory_name: item.name,
          category_id: item.categories?.id || '',
          relevance: calculateRelevance(item.name, searchTermLower)
        }));
        results.push(...subcategoryResults);
      }
      // Trier par pertinence
      const sortedResults = results
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, 20);
      setSearchResults(sortedResults);
      return sortedResults;
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      setError('Erreur lors de la recherche');
      setSearchResults([]);
      return [];
    } finally {
      setLoading(false);
    }
  };
  const calculateRelevance = (text: string, searchTerm: string): number => {
    const textLower = text.toLowerCase();
    // Correspondance exacte
    if (textLower === searchTerm) return 100;
    // Commence par le terme de recherche
    if (textLower.startsWith(searchTerm)) return 90;
    // Contient le terme de recherche
    if (textLower.includes(searchTerm)) return 70;
    // Correspondance partielle
    const words = searchTerm.split(' ');
    const textWords = textLower.split(' ');
    const matchingWords = words.filter(word => 
      textWords.some(textWord => textWord.includes(word))
    );
    if (matchingWords.length > 0) {
      return 50 + (matchingWords.length / words.length) * 20;
    }
    return 30;
  };
  const clearSearch = () => {
    setSearchResults([]);
    setError(null);
  };
  return {
    searchResults,
    loading,
    error,
    searchContent,
    clearSearch
  };
}; 