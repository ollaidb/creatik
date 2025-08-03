import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IntelligentSearchBar from './IntelligentSearchBar';
import { Button } from '@/components/ui/button';
interface StickyHeaderProps {
  title?: string;
  onSearch?: (query: string) => void;
}
const StickyHeader: React.FC<StickyHeaderProps> = ({ onSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleSearch = (query: string) => {
    if (location.pathname === '/') {
      // Sur la page d'accueil, utiliser le callback
      if (onSearch) {
        onSearch(query);
      }
    } else {
      // Sur les autres pages, naviguer vers la page de recherche
      navigate(`/search?search=${encodeURIComponent(query)}`);
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="text-xl font-bold"
              onClick={() => navigate('/')}
            >
              Creatik
            </Button>
          </div>
          {/* Barre de recherche - Version Desktop */}
          <div className="hidden md:flex flex-1 max-w-4xl mx-16">
            <IntelligentSearchBar onSearch={handleSearch} />
          </div>
          {/* Barre de recherche - Version Mobile */}
          <div className="md:hidden flex-1 mx-4">
            <IntelligentSearchBar 
              onSearch={handleSearch}
              placeholder="Rechercher..."
              className="w-full"
            />
          </div>
          {/* Espace vide pour équilibrer - Desktop seulement */}
          <div className="hidden md:block w-20"></div>
        </div>
      </div>
    </header>
  );
};
export default StickyHeader;
