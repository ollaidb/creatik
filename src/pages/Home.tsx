import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Lightbulb, Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useContentSearch } from '@/hooks/useContentSearch';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

interface SearchResult {
  id: string;
  title: string;
  content_type: 'category' | 'subcategory' | 'title';
  category_name?: string;
  subcategory_name?: string;
  subcategory_id?: string;
  relevance: number;
}
const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { history, addToHistory } = useSearchHistory();
  const { searchContent, searchResults, loading, error } = useContentSearch();
  const [hasSearched, setHasSearched] = useState(false);
  // Organiser les résultats par type
  const categories = searchResults.filter(result => result.content_type === 'category');
  const subcategories = searchResults.filter(result => result.content_type === 'subcategory');
  const titles = searchResults.filter(result => result.content_type === 'title');
  const handleCategoryClick = (category: SearchResult) => {
    navigate(`/category/${category.id}/subcategories`);
  };
  const handleSubcategoryClick = (subcategory: SearchResult) => {
    navigate(`/category/${subcategory.id}/subcategories`);
  };
  const handleTitleClick = (title: SearchResult) => {
    if (title.subcategory_id) {
      navigate(`/category/${title.subcategory_id}/subcategory/${title.id}`);
    }
  };
  const handleViewMoreCategories = () => {
    navigate(`/categories`);
  };
  const handleViewMoreSubcategories = () => {
    if (categories.length > 0) {
      navigate(`/category/${categories[0].id}/subcategories`);
    }
  };
  const handleViewMoreTitles = () => {
    if (subcategories.length > 0) {
      navigate(`/category/${subcategories[0].id}/subcategories`);
    }
  };
  // Callback pour la recherche depuis le header
  const handleSearchFromHeader = (query: string) => {
    addToHistory(query);
    searchContent(query);
    setHasSearched(true);
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

      <main className="max-w-4xl mx-auto p-4">
        {/* Affichage conditionnel : soit la page d'accueil, soit les résultats */}
        {!hasSearched ? (
          <>
            {/* Page d'accueil normale */}
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold mb-4">
                Trouve des idées créatives
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Découvre des milliers d'idées de contenu pour tes créations
              </p>
            </div>
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
                      onClick={() => {
                        searchContent(item.query);
                        setHasSearched(true);
                      }}
                      className="rounded-full"
                    >
                      {item.query}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Résultats de recherche directement */
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
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
            ) : searchResults.length > 0 ? (
              <>
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
              </>
            ) : (
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
        )}
      </main>
      <Navigation />
    </div>
  );
};
export default Home; 