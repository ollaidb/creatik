import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Plus, ChevronUp, ArrowRight } from 'lucide-react';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/components/ui/use-toast';

interface RecommendationsSectionProps {
  onAddToPublications?: (title: string, titleId: string) => void;
  onLikeTitle?: (titleId: string) => void;
  isTitleFavorite?: (titleId: string) => boolean;
}

export const RecommendationsSection: React.FC<RecommendationsSectionProps> = ({
  onAddToPublications,
  onLikeTitle,
  isTitleFavorite
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { recommendations, loading, hasMore, loadMore } = usePersonalizedRecommendations(0, 10);
  const { toggleFavorite: toggleTitleFavorite, isFavorite: isTitleFavoriteHook } = useFavorites('title');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // États pour le scroll progressif
  const y = useMotionValue(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const controls = useAnimation();
  
  const isFavorite = isTitleFavorite || isTitleFavoriteHook;

  // Observer pour charger une nouvelle recommandation quand on arrive en bas
  useEffect(() => {
    if (!loadingRef.current || !hasMore || loading || !isActive) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observerRef.current.observe(loadingRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMore, isActive, recommendations.length]);

  // Gestion du scroll progressif de la section
  useEffect(() => {
    if (!isActive) {
      setScrollProgress(0);
      controls.start({ y: 0 });
      return;
    }

    let lastScrollY = window.scrollY;
    let accumulatedScroll = 0;
    const scrollThreshold = 100; // Pixels de scroll pour charger une nouvelle recommandation et remonter

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      
      // Si on scroll vers le bas (on descend dans la page)
      if (scrollDelta > 0 && currentScrollY > 0) {
        accumulatedScroll += scrollDelta;
        
        // Chaque fois qu'on atteint le seuil, charger une nouvelle recommandation et remonter la section
        if (accumulatedScroll >= scrollThreshold && hasMore && !loading) {
          accumulatedScroll = 0;
          loadMore();
          
          // Remonter la section progressivement (10% de la hauteur de l'écran à chaque fois)
          setScrollProgress(prev => {
            const newProgress = Math.min(0.9, prev + 0.1);
            const offset = -newProgress * window.innerHeight;
            controls.start({
              y: offset,
              transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
            });
            return newProgress;
          });
        }
      }
      
      // Si on scroll vers le haut en haut de la page, remettre la section à sa place
      if (currentScrollY <= 10 && scrollProgress > 0) {
        setScrollProgress(0);
        controls.start({
          y: 0,
          transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isActive, scrollProgress, hasMore, loading, loadMore, controls]);

  const handleLike = async (titleId: string) => {
    if (onLikeTitle) {
      onLikeTitle(titleId);
    } else {
      try {
        const wasFavorite = isFavorite(titleId);
        await toggleTitleFavorite(titleId);
        toast({
          title: wasFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
        });
      } catch (error) {
        console.error('Erreur lors du like:', error);
        toast({
          title: "Erreur",
          variant: "destructive",
        });
      }
    }
  };

  const handleAdd = (title: string, titleId: string) => {
    if (onAddToPublications) {
      onAddToPublications(title, titleId);
    }
  };

  const handleActivate = () => {
    setIsActive(true);
    setScrollProgress(0);
    controls.start({ y: 0 });
  };

  const handleDeactivate = () => {
    setIsActive(false);
    setScrollProgress(0);
    controls.start({ y: 0 });
  };

  if (recommendations.length === 0 && !loading) {
    return null;
  }

  return (
    <motion.section
      ref={sectionRef}
      className="container mx-auto px-4 py-2 relative"
      style={{ y }}
      animate={controls}
      initial={{ y: 0 }}
    >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Pour toi
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={isActive ? handleDeactivate : handleActivate}
            className="p-2 h-8 w-8"
          >
            <ChevronUp className={`w-4 h-4 transition-transform ${isActive ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      
      {loading && recommendations.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          Chargement des recommandations...
        </div>
      ) : (
        <div 
          ref={scrollContainerRef}
          className={`space-y-3 transition-all duration-300 ${
            isActive 
              ? 'max-h-[calc(100vh-200px)] overflow-y-auto' 
              : 'max-h-[600px] overflow-y-auto'
          } pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent`}
        >
          {recommendations.map((rec, index) => (
            <motion.div
              key={`rec-${rec.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    if (rec.category_id && rec.subcategory_id) {
                      navigate(`/category/${rec.category_id}/subcategory/${rec.subcategory_id}`);
                    } else if (rec.category_id) {
                      navigate(`/category/${rec.category_id}/subcategories`);
                    }
                  }}
                >
                  <h3 className="text-foreground font-medium text-base leading-relaxed">
                    {rec.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(rec.id);
                    }}
                    className={`p-2 h-8 w-8 transition-all duration-200 ${
                      isFavorite(rec.id)
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <Heart
                      size={16}
                      className={`transition-all duration-200 ${
                        isFavorite(rec.id)
                          ? 'fill-red-500 text-red-500'
                          : 'fill-transparent text-current'
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdd(rec.title, rec.id);
                    }}
                    className="p-2 h-8 w-8 text-gray-400 hover:text-primary transition-all duration-200"
                    title="Ajouter aux publications"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Indicateur de chargement */}
          {loading && (
            <div className="text-center py-4 text-muted-foreground">
              Chargement...
            </div>
          )}

          {/* Observer pour le scroll infini */}
          <div ref={loadingRef} className="h-4" />
        </div>
      )}
    </motion.section>
  );
};
