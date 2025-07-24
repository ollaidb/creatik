import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter, TrendingUp, Clock, Lightbulb, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useContentSearch } from '@/hooks/useContentSearch';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import IntelligentSearchBar from '@/components/IntelligentSearchBar';

interface SearchResult {
  id: string;
  title: string;
  content_type: 'category' | 'subcategory' | 'title';
  category_name?: string;
  subcategory_name?: string;
  subcategory_id?: string;
  relevance: number;
}

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('search') || '';
  const [activeFilter, setActiveFilter] = useState('all');
  
  const { user } = useAuth();
  const { history } = useSearchHistory();
  const { searchContent, searchResults, loading, error } = useContentSearch();

  useEffect(() => {
    if (query) {
      searchContent(query);
    }
  }, [query]);

  const handleSearch = (newQuery: string) => {
    navigate(`/search?search=${encodeURIComponent(newQuery)}`);
  };

  // Organiser les résultats par type
  const categories = searchResults.filter(result => result.content_type === 'category');
  const subcategories = searchResults.filter(result => result.content_type === 'subcategory');
  const titles = searchResults.filter(result => result.content_type === 'title');

  const handleCategoryClick = (category: SearchResult) => {
    navigate(`/category/${category.id}/subcategories`);
  };

  const handleSubcategoryClick = (subcategory: SearchResult) => {
    // Extraire categoryId depuis subcategory.category_name ou utiliser une logique différente
    navigate(`/category/${subcategory.id}/subcategories`);
  };

  const handleTitleClick = (title: SearchResult) => {
    // Naviguer vers la page des titres de cette sous-catégorie
    if (title.subcategory_id) {
      navigate(`/category/${title.subcategory_id}/subcategory/${title.id}`);
    }
  };

  const handleViewMoreCategories = () => {
    navigate(`/categories`);
  };

  const handleViewMoreSubcategories = () => {
    // Naviguer vers la première catégorie trouvée ou une page générale
    if (categories.length > 0) {
      navigate(`/category/${categories[0].id}/subcategories`);
    }
  };

  const handleViewMoreTitles = () => {
    // Naviguer vers la première sous-catégorie trouvée
    if (subcategories.length > 0) {
      navigate(`/category/${subcategories[0].id}/subcategories`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header avec barre de recherche */}
      <header className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')} 
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <IntelligentSearchBar onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {/* Résultats de recherche */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Recherche en cours...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erreur de recherche</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : query ? (
          <>
            {/* En-tête des résultats */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                Résultats pour "{query}"
              </h1>
              <p className="text-muted-foreground">
                {searchResults.length} résultat{searchResults.length !== 1 ? 's' : ''} trouvé{searchResults.length !== 1 ? 's' : ''}
              </p>
            </div>

            <motion.div
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Section CATÉGORIES */}
              {categories.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      CATÉGORIES
                    </h2>
                    {categories.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleViewMoreCategories}
                        className="text-primary hover:text-primary/80"
                      >
                        Voir plus
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {categories.slice(0, 2).map((category) => (
                      <Card 
                        key={category.id} 
                        className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-100">
                              <TrendingUp className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{category.title}</h3>
                              <p className="text-sm text-muted-foreground">Catégorie</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Section SOUS-CATÉGORIES */}
              {subcategories.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-green-500" />
                      SOUS-CATÉGORIES
                    </h2>
                    {subcategories.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleViewMoreSubcategories}
                        className="text-primary hover:text-primary/80"
                      >
                        Voir plus
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {subcategories.slice(0, 2).map((subcategory) => (
                      <Card 
                        key={subcategory.id} 
                        className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        onClick={() => handleSubcategoryClick(subcategory)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-100">
                              <Lightbulb className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{subcategory.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {subcategory.category_name} • Sous-catégorie
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Section TITRES */}
              {titles.length > 0 && (
                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Search className="h-5 w-5 text-purple-500" />
                      TITRES
                    </h2>
                    {titles.length > 5 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleViewMoreTitles}
                        className="text-primary hover:text-primary/80"
                      >
                        Voir plus
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {titles.slice(0, 5).map((title) => (
                      <Card 
                        key={title.id} 
                        className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        onClick={() => handleTitleClick(title)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-purple-100">
                              <Search className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{title.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {title.category_name} {title.subcategory_name && `> ${title.subcategory_name}`} • Titre
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Message si aucun résultat */}
              {searchResults.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
                  <p className="text-muted-foreground mb-4">
                    Essayez d'autres mots-clés ou explorez nos catégories
                  </p>
                  <Button onClick={() => navigate('/categories')}>
                    Explorer les catégories
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Recherche vide</h3>
            <p className="text-muted-foreground">
              Entrez un terme de recherche pour commencer
            </p>
          </div>
        )}

        {/* Historique des recherches */}
        {user && history.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recherches récentes
            </h2>
            <div className="flex flex-wrap gap-2">
              {history.slice(0, 8).map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(item.query)}
                  className="rounded-full"
                >
                  {item.query}
                </Button>
              ))}
            </div>
          </div>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default SearchResults; 