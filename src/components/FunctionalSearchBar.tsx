import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useAuth } from '@/hooks/useAuth';
interface FunctionalSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}
const FunctionalSearchBar: React.FC<FunctionalSearchBarProps> = ({ 
  onSearch, 
  placeholder = "Rechercher des idées...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { history, addToHistory } = useSearchHistory();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      if (user) {
        addToHistory(query.trim());
      }
      setShowHistory(false);
      inputRef.current?.blur();
    }
  };
  const handleInputFocus = () => {
    if (user && history.length > 0) {
      setShowHistory(true);
    }
  };
  const handleHistoryClick = (searchQuery: string) => {
    setQuery(searchQuery);
    onSearch(searchQuery);
    setShowHistory(false);
    inputRef.current?.blur();
  };
  const clearQuery = () => {
    setQuery('');
    inputRef.current?.focus();
  };
  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-card border border-border rounded-lg shadow-sm">
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="flex-shrink-0 ml-1"
          >
            <Search className="h-4 w-4" />
          </Button>
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
          />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearQuery}
              className="flex-shrink-0 mr-1"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
      {/* Historique des recherches */}
      {showHistory && user && history.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          <div className="p-3 border-b border-border">
            <h4 className="text-sm font-medium text-muted-foreground">Recherches récentes</h4>
          </div>
          {history.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => handleHistoryClick(item.query)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent transition-colors text-left"
            >
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm truncate">{item.query}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
export default FunctionalSearchBar;
