
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
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

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useCategories();

  const handleSearch = (query: string) => {
    navigate(`/search?search=${encodeURIComponent(query)}`);
  };

  if (isLoading) {
    return (
      <section className="relative py-4 bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] dark:from-gray-900 dark:to-gray-800/80">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">
            <p>Chargement des catégories...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-4 bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] dark:from-gray-900 dark:to-gray-800/80">
      <div className="container mx-auto px-4">
        {/* Titre et barre de recherche */}
        <div className="mb-8">
          {/* Version Desktop - Titre et barre sur même ligne */}
          <div className="hidden md:flex items-center justify-between px-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Creatik
            </h1>
            
            <div className="w-[600px]">
              <IntelligentSearchBar 
                onSearch={handleSearch}
                placeholder="Rechercher des idées de contenu..."
                className="w-full"
              />
            </div>
          </div>

          {/* Version Mobile - Titre en haut, barre en bas */}
          <div className="md:hidden">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
              Creatik
            </h1>
            
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
          <div className="bg-white/80 dark:bg-gray-800/30 rounded-xl p-2 shadow-sm">
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
                {categories?.map((category) => (
                  <CarouselItem key={category.id} className="pl-1 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                    <div className="p-1">
                      <CategoryCard 
                        category={{
                          id: category.id,
                          name: category.name,
                          color: category.color
                        }}
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
