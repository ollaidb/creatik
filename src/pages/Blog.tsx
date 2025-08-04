import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Heart, Search, Plus, User, ExternalLink, Link } from 'lucide-react';
import { useSubcategory } from '@/hooks/useSubcategory';
import { useSubcategoryLevel2 } from '@/hooks/useSubcategoryLevel2';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useFavorites } from '@/hooks/useFavorites';
import LocalSearchBar from '@/components/LocalSearchBar';
import SubcategoryTabs from '@/components/SubcategoryTabs';
import HashtagsSection from '@/components/HashtagsSection';
import Navigation from '@/components/Navigation';

const Blog = () => {
  const { subcategoryId, categoryId, subcategoryLevel2Id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedNetwork = searchParams.get('network') || 'blog';
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  // Détecter si nous sommes dans un contexte de niveau 2
  const isLevel2 = !!subcategoryLevel2Id;
  
  // Utiliser les hooks appropriés selon le niveau
  const { data: subcategory, isLoading: subcategoryLoading } = useSubcategory(subcategoryId);
  const { data: subcategoryLevel2, isLoading: subcategoryLevel2Loading } = useSubcategoryLevel2(subcategoryLevel2Id);
  
  const detectedNetwork = selectedNetwork;
  
  // TODO: Créer useBlogs hook
  const blogs = []; // Placeholder pour les blogs
  const blogsLoading = false;
  
  // Utiliser les données appropriées selon le niveau
  const currentSubcategory = isLevel2 ? subcategoryLevel2 : subcategory;
  const isLoading = isLevel2 ? 
    (subcategoryLevel2Loading || blogsLoading) : 
    (subcategoryLoading || blogsLoading);
  
  // Hooks pour les favoris
  const { favorites: blogFavorites, toggleFavorite: toggleBlogFavorite, isFavorite: isBlogFavorite } = useFavorites('blog');
  
  // Filtrer les blogs par searchTerm
  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fonction pour obtenir le nom d'affichage du réseau social
  const getNetworkDisplayName = (networkId: string) => {
    switch (networkId) {
      case 'blog': return 'Blog';
      default: return 'Blog';
    }
  };

  const handleCopyBlog = async (blog: string) => {
    try {
      await navigator.clipboard.writeText(blog);
      toast({
        title: "Blog copié"
      });
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      toast({
        title: "Erreur copie",
        variant: "destructive",
      });
    }
  };

  const handleLikeBlog = async (blogId: string) => {
    try {
      await toggleBlogFavorite(blogId);
      toast({
        title: isBlogFavorite(blogId) ? "Retiré" : "Ajouté"
      });
    } catch (error) {
      console.error('Erreur lors du like:', error);
      toast({
        title: "Erreur",
        variant: "destructive"
      });
    }
  };

  const handleAddToChallenge = (blogId: string) => {
    // Logique pour ajouter à un challenge
    console.log('Adding to challenge:', blogId);
  };

  const [activeTab, setActiveTab] = useState<'blogs' | 'sources' | 'mots-cles'>('blogs');

  const handleTabChange = (newTab: 'blogs' | 'sources' | 'mots-cles') => {
    setActiveTab(newTab);
  };

  const handleBack = () => {
    if (isLevel2) {
      navigate(`/category/${categoryId}/subcategory/${subcategoryId}/subcategories-level2?network=${selectedNetwork}`);
    } else {
      navigate(`/category/${categoryId}/subcategories?network=${selectedNetwork}`);
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
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        {/* Header fixe pour mobile */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:border-gray-700 px-4 py-3"
             style={{
               ...(window.matchMedia('(prefers-color-scheme: dark)').matches && {
                 backgroundColor: '#0f0f10'
               })
             }}>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBack} 
              className="p-2 h-10 w-10 rounded-full text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                Chargement...
              </h1>
            </div>
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header fixe pour mobile */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:border-gray-700 px-4 py-3"
           style={{
             ...(window.matchMedia('(prefers-color-scheme: dark)').matches && {
               backgroundColor: '#0f0f10'
             })
           }}>
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBack} 
            className="p-2 h-10 w-10 rounded-full text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {currentSubcategory?.name || 'Blogs'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredBlogs.length} blogs disponibles
            </p>
            {/* Indicateur du réseau social sélectionné */}
            {selectedNetwork !== 'all' && (
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {getNetworkDisplayName(detectedNetwork)}
              </p>
            )}
          </div>
          <Button 
            size="sm"
            onClick={() => navigate('/publish')}
            className="px-3 py-2 h-auto rounded-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Publier
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 py-4">
        {/* Barre de recherche intelligente */}
        <div className="mb-6">
          <div className="max-w-lg mx-auto md:max-w-2xl">
            <LocalSearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher tous les blogs..."
              className="w-full"
            />
          </div>
        </div>

        {/* Onglets */}
        <div className="mb-6">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-2 min-w-max">
              {[
                { key: 'blogs', label: 'Blogs' },
                { key: 'sources', label: 'Sources' },
                { key: 'mots-cles', label: 'Mots-clés' }
              ].map(tab => {
                const isActive = activeTab === tab.key;
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key as 'blogs' | 'sources' | 'mots-cles')}
                    className={`
                      px-3 py-2 rounded-lg transition-all duration-300 min-w-[70px] text-center flex items-center justify-center gap-2
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={isActive ? {
                      scale: [1, 1.1, 1.05],
                      boxShadow: [
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                      ]
                    } : {}}
                    transition={isActive ? {
                      duration: 0.6,
                      ease: "easeInOut"
                    } : {
                      duration: 0.2
                    }}
                  >
                    <span className={`
                      text-xs font-medium leading-tight
                      ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
                    `}>
                      {tab.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="mt-6">
          {activeTab === 'blogs' && (
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredBlogs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Aucun blog disponible pour {getNetworkDisplayName(detectedNetwork)}
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Les blogs incluent les articles de blog publiés.
                  </p>
                </div>
              ) : (
                filteredBlogs.map((blog, index) => (
                  <motion.div key={`blog-${blog.id}`} variants={itemVariants}>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-gray-900 dark:text-white font-medium text-base leading-relaxed">
                            {blog.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAddToChallenge(blog.id)}
                            className="p-2 h-8 w-8"
                          >
                            <Plus size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeBlog(blog.id)}
                            className={`p-2 h-8 w-8 transition-all duration-200 ${
                              isBlogFavorite(blog.id) 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-400 hover:text-red-400'
                            }`}
                          >
                            <Heart 
                              size={16} 
                              className={`transition-all duration-200 ${
                                isBlogFavorite(blog.id) 
                                  ? 'fill-red-500 text-red-500' 
                                  : 'fill-transparent text-current'
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'sources' && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Sources disponibles pour {getNetworkDisplayName(detectedNetwork)}
              </p>
            </div>
          )}

          {activeTab === 'mots-cles' && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Mots-clés disponibles pour {getNetworkDisplayName(detectedNetwork)}
              </p>
            </div>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Blog; 