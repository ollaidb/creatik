import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Clock, Hash, User, Calendar, FileText, Folder, Sparkles, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useAuth } from '@/hooks/useAuth';
import { useGlobalSearch, type GlobalSearchResult } from '@/hooks/useGlobalSearch';
import { useCategories } from '@/hooks/useCategories';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface GlobalIntelligentSearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const GlobalIntelligentSearchBar: React.FC<GlobalIntelligentSearchBarProps> = ({ 
  onSearch, 
  placeholder = "Rechercher dans toute l'application...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { history, addToHistory } = useSearchHistory();
  const { searchGlobal, loading: searchLoading } = useGlobalSearch();
  const { data: categories } = useCategories();

  // Suggestions basées sur les catégories populaires
  const fixedSuggestions = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    return categories.slice(0, 6).map((category, index) => {
      const icons = ['💡', '📚', '🎨', '💻', '🌟', '🍳'];
      const colors = [
        'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
        'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300', 
        'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
        'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300',
        'bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300',
        'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
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
  }, [categories]);

  // Gérer le clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  // Recherche en temps réel dès la première lettre
  useEffect(() => {
    const performSearch = async (searchQuery: string) => {
      if (searchQuery.length < 1) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const results = await searchGlobal(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Erreur de recherche:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query.trim());
      } else {
        setSearchResults([]);
        setLoading(false);
      }
    }, query.length === 1 ? 100 : 300); // Plus rapide pour la première lettre

    return () => clearTimeout(timeoutId);
  }, [query, searchGlobal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(true);
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
      if (onSearch) {
        onSearch(query.trim());
      } else {
        navigate(`/search?search=${encodeURIComponent(query.trim())}`);
      }
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (result: GlobalSearchResult | typeof fixedSuggestions[0]) => {
    if ('icon' in result) {
      // C'est une suggestion fixe (catégorie)
      navigate(`/category/${result.id}/subcategories`);
    } else {
      // C'est un résultat de recherche
      addToHistory(result.title);
      
      switch (result.content_type) {
        case 'category':
          navigate(`/category/${result.id}/subcategories`);
          break;
        case 'subcategory':
          navigate(`/category/${result.category_id}/subcategory/${result.id}`);
          break;
        case 'title':
        case 'hook':
          if (result.category_id && result.subcategory_id) {
            navigate(`/category/${result.category_id}/subcategory/${result.subcategory_id}`);
          }
          break;
        case 'creator':
          navigate(`/creator/${result.id}`);
          break;
        case 'event':
          navigate(`/events`);
          break;
        case 'blog':
        case 'article':
          if (result.category_id && result.subcategory_id) {
            navigate(`/category/${result.category_id}/subcategory/${result.subcategory_id}`);
          }
          break;
        case 'source':
          if (result.metadata?.url) {
            window.open(result.metadata.url as string, '_blank');
          }
          break;
      }
    }
    setShowSuggestions(false);
    setQuery('');
  };

  const handleHistoryClick = async (historyItem: { id: string; query: string }) => {
    setQuery(historyItem.query);
    addToHistory(historyItem.query);
    if (onSearch) {
      onSearch(historyItem.query);
    } else {
      navigate(`/search?search=${encodeURIComponent(historyItem.query)}`);
    }
    setShowSuggestions(false);
  };

  const clearQuery = () => {
    setQuery('');
    setSearchResults([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: GlobalSearchResult['content_type']) => {
    switch (type) {
      case 'category':
        return <Folder className="w-4 h-4" />;
      case 'subcategory':
        return <Folder className="w-4 h-4" />;
      case 'title':
        return <FileText className="w-4 h-4" />;
      case 'hook':
        return <Hash className="w-4 h-4" />;
      case 'creator':
        return <User className="w-4 h-4" />;
      case 'event':
        return <Calendar className="w-4 h-4" />;
      case 'blog':
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'source':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: GlobalSearchResult['content_type']) => {
    switch (type) {
      case 'category':
        return 'Catégorie';
      case 'subcategory':
        return 'Sous-catégorie';
      case 'title':
        return 'Titre';
      case 'hook':
        return 'Hook';
      case 'creator':
        return 'Créateur';
      case 'event':
        return 'Événement';
      case 'blog':
        return 'Blog';
      case 'article':
        return 'Article';
      case 'source':
        return 'Source';
      default:
        return 'Résultat';
    }
  };

  const hasResults = searchResults.length > 0;
  const hasHistory = user && history.length > 0;
  const showContent = showSuggestions && (hasResults || !query.trim() || loading || hasHistory);

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
            className="pl-4 pr-16 w-full"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {query && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearQuery}
                className="h-6 w-6 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleSubmit}
              className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      {/* Suggestions et résultats */}
      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
          >
            {loading || searchLoading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Recherche en cours...</p>
              </div>
            ) : (
              <div className="p-2">
                {/* Historique des recherches en premier */}
                {hasHistory && (
                  <div className="mb-2">
                    <div className="text-xs font-semibold text-muted-foreground mb-2 px-2 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      RECHERCHES RÉCENTES
                    </div>
                    {history.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleHistoryClick(item)}
                      >
                        <div className="p-2 rounded-lg bg-muted flex-shrink-0">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{item.query}</h3>
                          <p className="text-xs text-muted-foreground">Recherche récente</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Résultats de recherche ou suggestions */}
                {query.trim() ? (
                  hasResults ? (
                    <div className={hasHistory ? "border-t border-border pt-2 mt-2" : ""}>
                      <div className="text-xs font-semibold text-muted-foreground mb-2 px-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        RÉSULTATS ({searchResults.length})
                      </div>
                      {searchResults.slice(0, 8).map((item) => (
                        <div
                          key={`${item.content_type}-${item.id}`}
                          className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handleSuggestionClick(item)}
                        >
                          <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
                            {getTypeIcon(item.content_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                {getTypeLabel(item.content_type)}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.category_name && `${item.category_name}`}
                              {item.subcategory_name && ` > ${item.subcategory_name}`}
                              {item.platform && ` • ${item.platform}`}
                            </p>
                            {item.description && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-4 text-center text-sm text-muted-foreground ${hasHistory ? "border-t border-border pt-2 mt-2" : ""}`}>
                      Aucun résultat trouvé pour "{query}"
                    </div>
                  )
                ) : (
                  fixedSuggestions.length > 0 && (
                    <div className={hasHistory ? "border-t border-border pt-2 mt-2" : ""}>
                      <div className="text-xs font-semibold text-muted-foreground mb-2 px-2 flex items-center gap-2">
                        <TrendingUp className="w-3 h-3" />
                        SUGGESTIONS
                      </div>
                      {fixedSuggestions.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent transition-colors"
                          onClick={() => handleSuggestionClick(item)}
                        >
                          <div className={`p-2 rounded-lg ${item.color} flex-shrink-0`}>
                            <span className="text-lg">{item.icon}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{item.title}</h3>
                            <p className="text-xs text-muted-foreground">Catégorie</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalIntelligentSearchBar;

