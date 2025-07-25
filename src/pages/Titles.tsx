import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Heart, Search, Plus } from 'lucide-react';
import { useSubcategory } from '@/hooks/useSubcategory';
import { useContentTitles } from '@/hooks/useContentTitles';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import IntelligentSearchBar from '@/components/IntelligentSearchBar';
import { useFavorites } from '@/hooks/useFavorites';
const Titles = () => {
  const { subcategoryId, categoryId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: subcategory, isLoading: subcategoryLoading } = useSubcategory(subcategoryId);
  const { data: titles, isLoading: titlesLoading, refetch: refreshTitles } = useContentTitles(subcategoryId);
  const handleSearch = (query: string) => {
    // Logique de recherche
  };
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: "Le titre a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le titre",
        variant: "destructive",
      });
    }
  };
  const handleLikeTitle = (titleId: string) => {
    // TODO: Implémenter la fonctionnalité de like
    toast({
      title: "Titre liké !",
      description: "Ce titre a été ajouté à tes favoris",
    });
  };
  // Onglet Titres / Comptes / Sources
  const [tab, setTab] = useState<'titres' | 'comptes' | 'sources'>('titres');
  // Gestion des favoris pour les titres
  const { favorites, toggleFavorite, isFavorite } = useFavorites('title');
  // Correction du bouton retour
  const handleBack = () => {
    if (categoryId) {
      navigate(`/category/${categoryId}/subcategories`);
    } else {
      navigate('/categories');
    }
  };
  if (subcategoryLoading || titlesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header fixe pour mobile */}
        <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/category/${subcategoryId}/subcategories`)} 
              className="p-2 h-10 w-10 rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {subcategory?.name || 'Sous-catégorie'}
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header fixe pour mobile */}
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleBack}
            className="p-2 h-10 w-10 rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {subcategory?.name || 'Sous-catégorie'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {titles?.length || 0} titres disponibles
            </p>
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
        {/* Onglets Titres / Comptes / Sources */}
        <div className="flex gap-2 mb-6 justify-center">
          <Button
            variant={tab === 'titres' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => setTab('titres')}
          >
            Titres
          </Button>
          <Button
            variant={tab === 'comptes' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => setTab('comptes')}
          >
            Comptes
          </Button>
          <Button
            variant={tab === 'sources' ? 'default' : 'outline'}
            size="sm"
            className="rounded-full"
            onClick={() => setTab('sources')}
          >
            Sources
          </Button>
        </div>
        {/* Barre de recherche intelligente */}
        <div className="mb-6">
          <div className="max-w-lg mx-auto md:max-w-2xl">
            <IntelligentSearchBar 
              onSearch={handleSearch}
              placeholder={tab === 'comptes' ? 'Rechercher un compte...' : 'Rechercher une source...'}
              className="w-full"
            />
          </div>
        </div>
        {/* Affichage selon l'onglet sélectionné */}
        {tab === 'titres' && (
          // Liste des titres (comptes)
          <div className="space-y-3">
            {titles?.map((title, index) => (
              <motion.div 
                key={title.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xs text-gray-500 font-mono flex-shrink-0">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <h3 className="font-medium text-gray-900 dark:text-white text-base leading-relaxed">
                      {title.title}
                    </h3>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(title.id)}
                      className="p-2 h-10 w-10 rounded-full"
                    >
                      <Heart size={18} className={isFavorite(title.id) ? 'text-red-500 fill-red-500' : ''} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {tab === 'comptes' && (
          // Placeholder pour la liste des comptes
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Aucun compte disponible pour cette sous-catégorie.</p>
          </div>
        )}
        {tab === 'sources' && (
          // Placeholder pour la liste des sources
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Aucune source disponible pour cette sous-catégorie.</p>
          </div>
        )}
        {/* Message si pas de titres (comptes) */}
        {tab === 'comptes' && titles?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
              Aucun titre disponible pour cette sous-catégorie
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Titles; 