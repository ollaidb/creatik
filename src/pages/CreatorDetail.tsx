import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Globe, Calendar, ExternalLink, Heart, BookOpen, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { useCreator, useCreatorChallenges, useCreatorPublications } from '@/hooks/useCreators';
import { useSocialNetworks } from '@/hooks/useSocialNetworks';

// Fonction pour obtenir la description par défaut selon le réseau
const getDefaultDescription = (networkName: string | null, creatorName: string): string => {
  if (!networkName) {
    return `${creatorName} est actif sur les réseaux sociaux et partage régulièrement du contenu avec sa communauté.`;
  }
  
  const networkLower = networkName.toLowerCase();
  const descriptions: Record<string, string> = {
    youtube: `${creatorName} publie régulièrement des vidéos sur YouTube, couvrant des sujets variés et engageants pour sa communauté.`,
    tiktok: `${creatorName} crée du contenu court et dynamique sur TikTok, partageant des moments authentiques et des tendances actuelles.`,
    instagram: `${creatorName} partage des photos, stories et reels sur Instagram, offrant un aperçu de son univers créatif et personnel.`,
    twitter: `${creatorName} publie des tweets réguliers sur Twitter, partageant ses pensées, actualités et interactions avec sa communauté.`,
    facebook: `${creatorName} partage du contenu sur Facebook, interagissant avec sa communauté et partageant des moments de sa vie.`,
    linkedin: `${creatorName} publie du contenu professionnel sur LinkedIn, partageant ses expertises et actualités professionnelles.`,
    twitch: `${creatorName} diffuse en direct sur Twitch, créant du contenu interactif et engageant pour sa communauté.`,
    blog: `${creatorName} publie des articles de blog, partageant ses réflexions et expertises sur différents sujets.`,
    article: `${creatorName} écrit des articles approfondis, offrant des analyses détaillées et des perspectives uniques.`,
  };
  
  return descriptions[networkLower] || `${creatorName} est actif sur ${networkName} et partage régulièrement du contenu avec sa communauté.`;
};

const CreatorDetail = () => {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const [activeSection, setActiveSection] = useState<'wiki' | 'challenges'>('wiki');
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

  // Récupérer les vraies données du créateur
  const { data: creator, isLoading: creatorLoading } = useCreator(creatorId || '');
  const { data: creatorChallenges, isLoading: challengesLoading } = useCreatorChallenges(creatorId || '');
  const { data: allSocialNetworks = [] } = useSocialNetworks();
  
  // Utiliser tous les réseaux de la table social_networks (exclure "all" qui est un filtre spécial)
  const displayedNetworks = allSocialNetworks.filter(network => 
    network.name.toLowerCase() !== 'all'
  );
  
  // Récupérer les publications du créateur pour le réseau sélectionné (seulement si un réseau est sélectionné)
  const { data: publications = [], isLoading: publicationsLoading } = useCreatorPublications(
    creatorId || '',
    selectedNetwork
  );

  if (creatorLoading || !creator) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Chargement du créateur...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-background" style={{ 
      WebkitOverflowScrolling: 'touch',
      overscrollBehavior: 'contain'
    }}>
      {/* Header simplifié */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateBack}
            className="p-2 h-10 w-10 rounded-full text-foreground hover:bg-accent touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground truncate">
              Profil créateur
            </h1>
          </div>
        </div>
      </div>

      {/* Profil horizontal compact */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4 mb-6">
          {/* Zone de profil avec fond blanc */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex-shrink-0"></div>
          
          {/* Nom et pseudo */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">
              {creator.name}
            </h1>
            <p className="text-sm sm:text-base text-purple-600 dark:text-purple-400 leading-tight">
              {creator.display_name}
            </p>
          </div>
        </div>

        {/* Premier menu horizontal : Wiki et Défis (toujours visible) */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setActiveSection('wiki');
              setSelectedNetwork(null); // Désélectionner le réseau si on clique sur Wiki
            }}
            className={`
              px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2
              ${activeSection === 'wiki' && !selectedNetwork
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }
            `}
          >
            <BookOpen className={`h-4 w-4 ${activeSection === 'wiki' && !selectedNetwork ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
            <span className="font-medium">Wiki</span>
          </button>
          
          <button
            onClick={() => {
              setActiveSection('challenges');
              setSelectedNetwork(null); // Désélectionner le réseau si on clique sur Défis
            }}
            className={`
              px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2
              ${activeSection === 'challenges' && !selectedNetwork
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }
            `}
          >
            <Heart className={`h-4 w-4 ${activeSection === 'challenges' && !selectedNetwork ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
            <span className="font-medium">Défis</span>
          </button>
        </div>

        {/* Deuxième menu : Réseaux sociaux */}
        <div className="mb-4">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-2 min-w-max">
              {displayedNetworks.map((network) => {
                // Vérifier si ce réseau est configuré pour le créateur
                const configuredNetwork = creator.social_networks?.find(
                  cn => cn.social_network_id === network.id || 
                        cn.network?.id === network.id || 
                        cn.network?.name === network.name
                );
                const isSelected = selectedNetwork === network.name;
                
                return (
                  <button
                    key={network.id}
                    onClick={() => {
                      // Si le réseau est déjà sélectionné, le désélectionner
                      if (selectedNetwork === network.name) {
                        setSelectedNetwork(null);
                      } else {
                        setSelectedNetwork(network.name);
                      }
                    }}
                    className={`
                      px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2
                      ${isSelected
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                      }
                    `}
                  >
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ 
                        backgroundColor: isSelected 
                          ? 'white' 
                          : (network.color_theme || '#6B7280') 
                      }}
                    ></div>
                    <span className="font-medium whitespace-nowrap">
                      {network.display_name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contenu : Change selon la sélection (réseau OU Wiki/Défis) */}
        <div className="mt-6">
          {selectedNetwork ? (
            <>
              {publicationsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Chargement des publications...</p>
                </div>
              ) : publications.length > 0 ? (
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {publications.map((publication, index) => {
                    // Trouver le réseau configuré pour obtenir l'URL du profil
                    const configuredNetwork = creator.social_networks?.find(
                      cn => cn.network?.name === selectedNetwork || cn.network?.id === selectedNetwork
                    );
                    
                    // Utiliser l'URL de la publication si disponible, sinon l'URL du profil du créateur
                    const publicationUrl = publication.url || configuredNetwork?.profile_url || null;
                    
                    const handleClick = () => {
                      if (publicationUrl && publicationUrl !== '#') {
                        window.open(publicationUrl, '_blank', 'noopener,noreferrer');
                      }
                    };
                    
                    return (
                      <motion.div
                        key={publication.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div 
                          onClick={handleClick}
                          className={`
                            bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 
                            transition-all duration-200
                            ${publicationUrl && publicationUrl !== '#' 
                              ? 'cursor-pointer hover:shadow-md hover:border-purple-300 dark:hover:border-purple-600' 
                              : 'cursor-default'
                            }
                          `}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-gray-900 dark:text-white font-medium text-base leading-relaxed">
                                {publication.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {getDefaultDescription(selectedNetwork, creator.name)}
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <>
          {activeSection === 'wiki' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Wiki - {creator.name}</h2>
              </div>
              
              {/* Informations du créateur */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Biographie</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    {creator.bio || 'Aucune biographie disponible'}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">Catégories</h3>
                  <div className="flex flex-wrap gap-2">
                    {creator.category && (
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-sm rounded-full">
                        {creator.category}
                      </span>
                    )}
                    {creator.subcategory && (
                      <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 text-sm rounded-full">
                        {creator.subcategory}
                      </span>
                    )}
                  </div>
                </div>
                

              </div>
              
              {/* Défis */}
              <div className="mt-8">
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Défis récents</h3>
                {creatorChallenges && creatorChallenges.length > 0 ? (
                  <div className="space-y-3">
                    {creatorChallenges.slice(0, 3).map((challenge) => (
                      <div key={challenge.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-purple-400">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {challenge.challenge?.title || 'Défi sans titre'}
                          </h4>
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                            {challenge.network?.display_name || 'Réseau inconnu'}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-xs mb-2">
                          {challenge.content || 'Aucun contenu disponible'}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Par utilisateur</span>
                          <span>{new Date(challenge.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <Heart className="h-10 w-10 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm">Aucun défi pour le moment</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'challenges' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Défis - {creator.name}</h2>
              </div>
              
              {creatorChallenges && creatorChallenges.length > 0 ? (
                <div className="space-y-4">
                  {creatorChallenges.map((challenge) => (
                    <div key={challenge.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            {challenge.challenge?.title || 'Défi sans titre'}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                            {challenge.content || 'Aucun contenu disponible'}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                          {challenge.network?.display_name || 'Réseau inconnu'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Par utilisateur</span>
                        <span>{new Date(challenge.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Heart className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                  <p>Aucun défi n'a encore tagué ce créateur</p>
                </div>
              )}
            </motion.div>
          )}
            </>
          )}
        </div>
      </div>
      
      <Navigation />
    </div>
  );
};

export default CreatorDetail;
