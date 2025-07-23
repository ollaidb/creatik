
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./CategoryCard";
import { useCategories } from "@/hooks/useCategories";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import StickyHeader from "./StickyHeader";

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <>
        <StickyHeader />
        <section className="relative py-4 sm:py-8 bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] dark:from-creatik-dark dark:to-[#2C2C54]/80">
          <div className="creatik-container">
            <div className="text-center py-8">
              <p>Chargement des catégories...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <StickyHeader />
      <section className="relative py-4 sm:py-8 bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] dark:from-creatik-dark dark:to-[#2C2C54]/80">
        <div className="creatik-container">
          {/* Categories Carousel with visible background - Responsive */}
          <div className="relative px-2 sm:px-4 md:px-10 mb-4 sm:mb-8">
            <div className="bg-white/80 dark:bg-creatik-dark/30 rounded-xl p-2 sm:p-4 shadow-sm">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <div className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10">
                  <CarouselPrevious className="relative h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                
                <CarouselContent className="-ml-1 sm:-ml-2 md:-ml-4">
                  {categories?.map((category) => (
                    <CarouselItem key={category.id} className="pl-1 sm:pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                      <div className="p-1">
                        <CategoryCard 
                          category={{
                            id: category.id,
                            name: category.name,
                            color: category.color
                          }}
                          className="w-full h-24 sm:h-28 md:h-32"
                          onClick={() => navigate(`/categories/${category.id}`)}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                <div className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 z-10">
                  <CarouselNext className="relative h-8 w-8 sm:h-10 sm:w-10" />
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
