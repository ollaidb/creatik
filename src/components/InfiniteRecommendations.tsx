import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useAnimation, PanInfo } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Plus, ChevronDown } from 'lucide-react';
import { usePersonalizedRecommendations } from '@/hooks/usePersonalizedRecommendations';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/components/ui/use-toast';

interface InfiniteRecommendationsProps {
  onAddToPublications?: (title: string, titleId: string) => void;
  onLikeTitle?: (titleId: string) => void;
  isTitleFavorite?: (titleId: string) => boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const InfiniteRecommendations: React.FC<InfiniteRecommendationsProps> = ({
  onAddToPublications,
  onLikeTitle,
  isTitleFavorite,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { recommendations, loading, hasMore, loadMore } = usePersonalizedRecommendations(0, 10);
  const { toggleFavorite: toggleTitleFavorite, isFavorite: isTitleFavoriteHook } = useFavorites('title');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  
  // États pour le glissement vertical
  const y = useMotionValue(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const controls = useAnimation();
  
  const isFavorite = isTitleFavorite || isTitleFavoriteHook;

  // Observer pour le scroll infini
  useEffect(() => {
    if (!loadingRef.current || !hasMore || loading) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(loadingRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMore]);

  // Gestion du glissement vertical (style TikTok)
  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    
    // Si on glisse vers le haut (négatif), soulever la section
    if (info.offset.y < -threshold) {
      setIsExpanded(true);
      controls.start({
        y: -window.innerHeight,
        transition: { duration: 0.3, ease: 'easeOut' }
      });
    } else {
      // Sinon, revenir à la position initiale
      setIsExpanded(false);
      controls.start({
        y: 0,
        transition: { duration: 0.3, ease: 'easeOut' }
      });
    }
  }, [controls]);

  // Gestion du scroll de la page pour revenir à la section
  useEffect(() => {
    const handleScroll = () => {
      // Si on scroll vers le haut en haut de la page et que la section est soulevée, la ramener
      if (isExpanded && window.scrollY === 0) {
        setIsExpanded(false);
        controls.start({
          y: 0,
          transition: { duration: 0.3, ease: 'easeOut' }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isExpanded, controls]);

  // Réinitialiser la position quand on ouvre/ferme
  useEffect(() => {
    if (!isOpen) {
      setIsExpanded(false);
      controls.start({ y: 0 });
    }
  }, [isOpen, controls]);

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

  if (!isOpen || (recommendations.length === 0 && !loading)) {
    return null;
  }

  return (
    <motion.section
      className="fixed inset-0 bg-background z-50 overflow-hidden"
      style={{ y }}
      animate={controls}
      drag="y"
      dragConstraints={{ top: -window.innerHeight, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      initial={{ y: 0 }}
    >
      <div className="h-full flex flex-col">
        {/* En-tête fixe */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Recommandations pour vous
          </h2>
          <div className="flex items-center gap-2">
            {isExpanded && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsExpanded(false);
                  controls.start({
                    y: 0,
                    transition: { duration: 0.3 }
                  });
                }}
                className="text-xs"
              >
                <ChevronDown className="w-4 h-4 mr-1" />
                Revenir
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Fermer
            </Button>
          </div>
        </div>

        {/* Zone de scroll infini */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {recommendations.map((rec) => (
            <motion.div
              key={`rec-${rec.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
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

          {/* Indicateur de chargement pour le scroll infini */}
          {loading && (
            <div className="text-center py-4 text-muted-foreground">
              Chargement...
            </div>
          )}

          {/* Observer pour le scroll infini */}
          <div ref={loadingRef} className="h-4" />
        </div>
      </div>
    </motion.section>
  );
};

