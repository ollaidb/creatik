import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useAuth } from '@/hooks/useAuth';
import { useContentSearch } from '@/hooks/useContentSearch';
import { useCategories } from '@/hooks/useCategories';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
interface IntelligentSearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}
interface SearchResult {
  id: string;
  title: string;
  content_type: 'category' | 'subcategory' | 'title';
  category_name?: string;
  subcategory_name?: string;
  subcategory_id?: string;
  category_id?: string;
  relevance: number;
}
interface HistoryItem {
  id: string;
  query: string;
}
interface FixedSuggestion {
  id: string;
  title: string;
  content_type: 'category' | 'subcategory' | 'title';
  category_name?: string;
  subcategory_name?: string;
  subcategory_id?: string;
  category_id?: string;
  icon: string;
  color: string;
}
const IntelligentSearchBar: React.FC<IntelligentSearchBarProps> = ({ 
  onSearch, 
  placeholder = "Rechercher des idées créatives...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { history, addToHistory } = useSearchHistory();
  const { searchContent } = useContentSearch();
  const { data: categories } = useCategories();
  // Créer des suggestions basées sur les vraies catégories
  const getFixedSuggestions = (): FixedSuggestion[] => {
    if (!categories || categories.length === 0) return [];
    // Prendre les 6 premières catégories
    return categories.slice(0, 6).map((category, index) => {
      const icons = ['💡', '📚', '🎨', '💻', '🌟', '🍳'];
      const colors = [
        'bg-blue-100 text-blue-600',
        'bg-green-100 text-green-600', 
        'bg-purple-100 text-purple-600',
        'bg-orange-100 text-orange-600',
        'bg-pink-100 text-pink-600',
        'bg-red-100 text-red-600'
      ];
      return {
        id: category.id,
        title: category.name,
        content_type: 'category' as const,
        category_name: category.name,
        icon: icons[index % icons.length],
        color: colors[index % colors.length]
      };
    });
  };
  const fixedSuggestions = getFixedSuggestions();
  // Gérer le clic en dehors pour fermer les suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Ne fermer que si on clique vraiment en dehors, pas si on bouge la souris
        setTimeout(() => {
          if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setShowSuggestions(false);
          }
        }, 100);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // Rechercher du contenu
  const searchContentWithDebounce = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const results = await searchContent(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Erreur de recherche:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };
  // Debounce pour la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        searchContentWithDebounce(query.trim());
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true); // Garder les suggestions ouvertes
  };
  const handleInputFocus = () => {
    setShowSuggestions(true);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };
  const handleSubmit = async () => {
    if (query.trim()) {
      addToHistory(query.trim());
      // Faire une recherche directe
      try {
        setLoading(true);
        const results = await searchContent(query.trim());
        if (results.length > 0) {
          // Prendre le premier résultat (le plus pertinent)
          const bestResult = results[0];
          handleSuggestionClick(bestResult);
        } else {
          // Si aucun résultat, naviguer vers la page de recherche
          if (onSearch) {
            onSearch(query.trim());
          }
        }
      } catch (error) {
        console.error('Erreur de recherche:', error);
        // En cas d'erreur, naviguer vers la page de recherche
        if (onSearch) {
          onSearch(query.trim());
        }
      } finally {
        setLoading(false);
        setShowSuggestions(false);
      }
    }
  };
  const handleSearchButtonClick = () => {
    handleSubmit();
  };
  const handleSuggestionClick = (suggestion: FixedSuggestion | SearchResult) => {
    // Navigation directe vers la page finale
    if (suggestion.content_type === 'category') {
      navigate(`/category/${suggestion.id}/subcategories`);
    } else if (suggestion.content_type === 'subcategory') {
      // Pour les sous-catégories, naviguer vers la page des titres de cette sous-catégorie
      navigate(`/category/${suggestion.id}/subcategories`);
    } else if (suggestion.content_type === 'title' && suggestion.subcategory_id && suggestion.category_id) {
      // Pour les titres, naviguer vers la page des titres de cette sous-catégorie
      navigate(`/category/${suggestion.category_id}/subcategory/${suggestion.subcategory_id}`);
    }
    setShowSuggestions(false);
    setQuery(''); // Vider le champ de recherche après navigation
  };
  const handleHistoryClick = async (historyItem: HistoryItem) => {
    setQuery(historyItem.query);
    // Faire une recherche directe avec l'historique
    try {
      setLoading(true);
      const results = await searchContent(historyItem.query);
      if (results.length > 0) {
        // Prendre le premier résultat (le plus pertinent)
        const bestResult = results[0];
        handleSuggestionClick(bestResult);
      } else {
        // Si aucun résultat, naviguer vers la page de recherche
        if (onSearch) {
          onSearch(historyItem.query);
        }
      }
    } catch (error) {
      console.error('Erreur de recherche:', error);
      // En cas d'erreur, naviguer vers la page de recherche
      if (onSearch) {
        onSearch(historyItem.query);
      }
    } finally {
      setLoading(false);
      setShowSuggestions(false);
    }
  };
  const clearQuery = () => {
    setQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  const hasSuggestions = fixedSuggestions.length > 0 || searchResults.length > 0;
  const hasHistory = user && history.length > 0;
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className="pl-4 pr-16"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleSearchButtonClick}
              className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
      {/* Suggestions et résultats */}
      <AnimatePresence>
        {showSuggestions && (hasSuggestions || hasHistory || loading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
          >
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Recherche en cours...</p>
              </div>
            ) : (
              <div className="p-2">
                {/* Suggestions fixes ou résultats de recherche */}
                {(query.trim() ? searchResults.length > 0 : fixedSuggestions.length > 0) && (
                  <div className="mb-2">
                    <div className="text-sm font-semibold text-muted-foreground mb-2 px-2">
                      {query.trim() ? 'RÉSULTATS' : 'SUGGESTIONS'}
                    </div>
                    {(query.trim() ? searchResults : fixedSuggestions).slice(0, 6).map((item, index) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent"
                        onClick={() => handleSuggestionClick(item)}
                      >
                        <div className={`p-2 rounded-lg ${'color' in item ? item.color : 'bg-blue-100 text-blue-600'}`}>
                          <span className="text-lg">{'icon' in item ? item.icon : '🔍'}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {item.category_name} {item.subcategory_name && `> ${item.subcategory_name}`} • {item.content_type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Historique des recherches */}
                {hasHistory && (
                  <div className="border-t pt-2">
                    <div className="text-sm font-semibold text-muted-foreground mb-2 px-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      RECHERCHES RÉCENTES
                    </div>
                    {history.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent"
                        onClick={() => handleHistoryClick(item)}
                      >
                        <div className="p-2 rounded-lg bg-gray-100">
                          <Clock className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{item.query}</h3>
                          <p className="text-xs text-muted-foreground">Recherche récente</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default IntelligentSearchBar; 