import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import IntelligentSearchBar from "./IntelligentSearchBar";
import { useCategories } from "@/hooks/useCategories";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: categories, isLoading } = useCategories();
  
  const handleSearch = (query: string) => {
    navigate(`/search?search=${encodeURIComponent(query)}`);
  };

  const handleFavoritesClick = () => {
    // Si on vient de la page d'accueil, on passe l'information
    const returnTo = location.pathname === '/' ? 'home' : 'profile';
    navigate(`/profile/favorites?returnTo=${returnTo}`);
  };



  if (isLoading) {
    return (
      <section className="relative py-4 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Chargement des catégories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-4 bg-card">
      <div className="container mx-auto px-4">
        {/* Titre et barre de recherche */}
        <div className="mb-8">
          {/* Version Desktop - Titre et barre sur même ligne */}
          <div className="hidden md:flex items-center justify-between px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Creatik
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-[600px]">
                <IntelligentSearchBar 
                  onSearch={handleSearch}
                  placeholder="Rechercher des idées de contenu..."
                  className="w-full"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoritesClick}
                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-accent"
              >
                <Heart className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/profile/notifications')}
                className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-accent"
                title="Notifications"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </Button>
            </div>
          </div>
          {/* Version Mobile - Titre en haut, barre en bas */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                Creatik
              </h1>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoritesClick}
                  className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-accent"
                >
                  <Heart className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/profile/notifications')}
                  className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-accent"
                  title="Notifications"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </Button>
              </div>
            </div>
            <div className="w-full">
              <IntelligentSearchBar 
                onSearch={handleSearch}
                placeholder="Rechercher..."
                className="w-full"
              />
            </div>
          </div>
        </div>
        {/* Categories Carousel with visible background - Responsive */}
        <div className="relative px-2 mb-4">
          <div className="bg-background/80 rounded-xl p-2 shadow-sm">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
                <CarouselPrevious className="relative h-8 w-8" />
              </div>
              <CarouselContent className="-ml-1">
                {categories?.map((category, index) => (
                  <CarouselItem key={category.id} className="pl-1 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                    <div className="p-1">
                      <CategoryCard 
                        category={{
                          id: category.id,
                          name: category.name,
                          color: category.color
                        }}
                        index={index}
                        className="w-full h-20 sm:h-24 md:h-28"
                        onClick={() => navigate(`/category/${category.id}/subcategories`)}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                <CarouselNext className="relative h-8 w-8" />
              </div>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
