
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, ChevronDown } from 'lucide-react';
import { useCategoriesByTheme, useThemes } from '@/hooks/useThemes';
import CategoryCard from '@/components/CategoryCard';
import Navigation from '@/components/Navigation';
import StickyHeader from '@/components/StickyHeader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const Categories = () => {
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [isThemeSheetOpen, setIsThemeSheetOpen] = useState(false);
  
  const { data: themes } = useThemes();
  const { data: categories, isLoading } = useCategoriesByTheme(selectedTheme);

  const selectedThemeName = themes?.find(theme => 
    theme.name === 'Tout' ? 'all' === selectedTheme : theme.id === selectedTheme
  )?.name || 'Tous les thèmes';

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
      <StickyHeader />
      
      <header className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Catégories</h1>
        </div>
        <Button 
          size="sm"
          onClick={() => navigate('/publish')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Publier</span>
        </Button>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* Menu des thèmes - Version Desktop (masqué sur mobile) */}
        <div className="mb-6 hidden md:block">
          <div className="flex flex-wrap gap-2 justify-center">
            {themes?.map((theme) => (
              <Button
                key={theme.id}
                variant={selectedTheme === (theme.name === 'Tout' ? 'all' : theme.id) ? 'default' : 'outline'}
                onClick={() => setSelectedTheme(theme.name === 'Tout' ? 'all' : theme.id)}
                className="rounded-full flex-1 min-w-0 max-w-xs"
              >
                {theme.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Menu des thèmes - Version Mobile (visible uniquement sur mobile) */}
        <div className="mb-6 md:hidden">
          <Select 
            value={selectedTheme} 
            onValueChange={setSelectedTheme}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un thème">
                {selectedThemeName}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {themes?.map((theme) => (
                <SelectItem 
                  key={theme.id} 
                  value={theme.name === 'Tout' ? 'all' : theme.id}
                >
                  {theme.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p>Chargement des catégories...</p>
          </div>
        ) : (
          <>
            {/* Grille des catégories - Responsive */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {categories?.map((category) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <CategoryCard 
                    category={{
                      id: category.id,
                      name: category.name,
                      color: category.color
                    }}
                    className="w-full h-20 sm:h-24 md:h-28"
                    onClick={() => navigate(`/categories/${category.id}`)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {categories?.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-60 text-center px-4">
                <h3 className="text-lg font-medium">Aucune catégorie trouvée</h3>
                <p className="text-muted-foreground mt-2">
                  Aucune catégorie disponible pour ce thème
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <Navigation />
    </div>
  );
};

export default Categories;
