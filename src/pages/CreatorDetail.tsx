import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Globe, Calendar, ExternalLink, Heart, BookOpen, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { useCreator, useCreatorChallenges } from '@/hooks/useCreators';

const CreatorDetail = () => {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'wiki' | 'challenges'>('wiki');

  // Récupérer les vraies données du créateur
  const { data: creator, isLoading: creatorLoading } = useCreator(creatorId || '');
  const { data: creatorChallenges, isLoading: challengesLoading } = useCreatorChallenges(creatorId || '');

  if (creatorLoading || !creator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header simplifié */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="p-2 h-10 w-10 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Profil créateur
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

             {/* Profil horizontal compact */}
       <div className="max-w-4xl mx-auto px-4 py-4">
         <div className="flex items-center gap-4 mb-6">
           {/* Photo de profil en cercle */}
           <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg border-2 border-white dark:border-gray-800 overflow-hidden flex-shrink-0">
             <img 
               src={creator.avatar || '/placeholder.svg'} 
               alt={creator.name}
               className="w-full h-full object-cover"
             />
           </div>
           
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

        {/* Premier menu horizontal : Wiki et Défis */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveSection('wiki')}
            className={`
              px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2
              ${activeSection === 'wiki'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }
            `}
          >
            <BookOpen className={`h-4 w-4 ${activeSection === 'wiki' ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
            <span className="font-medium">Wiki</span>
          </button>
          
          <button
            onClick={() => setActiveSection('challenges')}
            className={`
              px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2
              ${activeSection === 'challenges'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }
            `}
          >
            <Heart className={`h-4 w-4 ${activeSection === 'challenges' ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`} />
            <span className="font-medium">Défis</span>
          </button>
        </div>

        {/* Deuxième menu : Réseaux sociaux */}
        <div className="mb-6">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-2 min-w-max">
              {creator.social_networks && creator.social_networks.length > 0 ? (
                creator.social_networks.map((network) => (
                  <div
                    key={network.id}
                    className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer group"
                  >
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: network.network.color_theme || '#6B7280' }}
                    ></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {network.network.display_name}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">Aucun réseau social configuré</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenu des menus */}
        <div className="mt-6">
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
        </div>
      </div>
      
      <Navigation />
    </div>
  );
};

export default CreatorDetail;
