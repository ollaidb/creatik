
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategory } from "@/hooks/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";
import { useCategoryLikes } from "@/hooks/useCategoryLikes";
import { ArrowLeft, FolderOpen, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SubcategoryCard from "@/components/SubcategoryCard";
import Navigation from "@/components/Navigation";
import ExpandableText from "@/components/ExpandableText";

const CategoryDetails = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const { data: category, isLoading: categoryLoading } = useCategory(categoryId!);
  const { data: subcategories, isLoading: subcategoriesLoading } = useSubcategories(categoryId);
  const { likesCount, hasLiked, toggleLike, isLoading: likesLoading } = useCategoryLikes(categoryId!);

  if (categoryLoading || subcategoriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-creatik-dark dark:to-gray-900">
        <Navigation />
        <div className="creatik-container pt-20">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-creatik-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Chargement...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-creatik-dark dark:to-gray-900">
        <Navigation />
        <div className="creatik-container pt-20">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Catégorie non trouvée
            </h1>
            <button
              onClick={() => navigate('/categories')}
              className="text-creatik-primary hover:underline"
            >
              Retour aux catégories
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-creatik-dark dark:to-gray-900">
      <header className="sticky top-0 z-10 bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/categories')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">{category.name}</h1>
        </div>
        <Button 
          size="sm"
          onClick={() => navigate('/publish')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Publier
        </Button>
      </header>
      
      <div className="creatik-container pt-8 pb-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              {category.description && (
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                  {category.description}
                </p>
              )}
            </div>
            
            {/* Bouton de like */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLike}
              disabled={likesLoading}
              className="flex items-center gap-2 hover:text-red-500"
            >
              <Heart 
                size={20} 
                className={hasLiked ? "fill-red-500 text-red-500" : "text-gray-400"}
              />
              <span className="text-sm">{likesCount}</span>
            </Button>
          </div>

          {/* Définition de la catégorie */}
          {category.definition && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Définition
              </h3>
              <ExpandableText 
                text={category.definition}
                className="text-gray-600 dark:text-gray-300"
              />
            </div>
          )}

          {/* Guide de personnalisation */}
          {category.personalization_guide && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Guide de personnalisation
              </h3>
              <ExpandableText 
                text={category.personalization_guide}
                className="text-gray-600 dark:text-gray-300"
              />
            </div>
          )}
        </div>

        {/* Subcategories Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Sous-catégories
          </h2>
          
          {subcategories && subcategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subcategories.map((subcategory) => (
                <SubcategoryCard
                  key={subcategory.id}
                  subcategory={subcategory}
                  onClick={() => navigate(`/categories/${categoryId}/subcategories/${subcategory.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600 dark:text-gray-300">
              <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
              <p>Aucune sous-catégorie disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
      
      <Navigation />
    </div>
  );
};

export default CategoryDetails;
