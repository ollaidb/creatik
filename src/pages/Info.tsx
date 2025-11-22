import React, { useState, useEffect, useRef } from 'react';

import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Info, Target, Settings, BookOpen, Lightbulb, Users, Star, TrendingUp, Calendar, Hash, Wrench, CheckCircle, Handshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useCategories } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';
import { useCategoryGuide } from '@/hooks/useCategoryGuide';
import { useSubcategoryCollaboration } from '@/hooks/useSubcategoryCollaboration';
import Navigation from '@/components/Navigation';

const CategoryInfo = () => {
  const { categoryId, subcategoryId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { navigateBack } = useSmartNavigation();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'explication');
  const tabsListRef = useRef<HTMLDivElement>(null);
  
  const { data: categories } = useCategories();
  const { data: subcategories } = useSubcategories(categoryId);
  const { guide, loading: guideLoading, error: guideError } = useCategoryGuide(categoryId);
  
  // Récupérer subcategoryId depuis les paramètres de requête si disponible
  const subcategoryIdFromQuery = searchParams.get('subcategoryId');
  const effectiveSubcategoryId = subcategoryId || subcategoryIdFromQuery;
  const { collaboration, loading: collaborationLoading } = useSubcategoryCollaboration(effectiveSubcategoryId);
  
  const currentCategory = categories?.find(cat => cat.id === categoryId);
  const currentSubcategory = subcategories?.find(sub => sub.id === effectiveSubcategoryId);
  
  // Mettre à jour l'onglet actif si le paramètre tab change
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleBackClick = () => {
    if (subcategoryId) {
      navigate(`/category/${categoryId}/subcategories`);
    } else {
      navigate(`/categories`);
    }
  };

  // Faire défiler vers l'onglet actif
  useEffect(() => {
    if (tabsListRef.current) {
      const activeTabElement = tabsListRef.current.querySelector(`[data-state="active"]`);
      if (activeTabElement) {
        activeTabElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  // S'assurer que le premier onglet est visible au chargement
  useEffect(() => {
    if (tabsListRef.current) {
      // Scroll vers le début pour montrer "Définition"
      tabsListRef.current.scrollLeft = 0;
    }
  }, []);

  // Utiliser les données de la base de données
  const categoryInfo = guide ? {
    description: guide.description,
    howTo: guide.how_to,
    personalization: guide.personalization
  } : {
    description: 'Cette catégorie couvre un domaine spécifique avec de nombreuses possibilités de contenu créatif.',
    howTo: 'Pour créer du contenu dans cette catégorie, identifiez votre angle unique et votre audience cible.',
    personalization: 'Personnalisez votre approche en fonction de vos compétences, de votre style et des besoins de votre communauté.'
  };

  // Affichage du chargement du guide
  if (guideLoading) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Guide de la catégorie</h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <Card className="text-center py-12">
            <CardContent>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium mb-2">Chargement du guide...</h3>
              <p className="text-muted-foreground">
                Récupération des informations de la catégorie
              </p>
            </CardContent>
          </Card>
        </main>
        <Navigation />
      </div>
    );
  }

  // Affichage des erreurs du guide
  if (guideError) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Guide de la catégorie</h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-red-500 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Erreur lors du chargement</h3>
              <p className="text-muted-foreground mb-4">
                {guideError}
              </p>
              <Button onClick={handleBackClick}>
                Retour
              </Button>
            </CardContent>
          </Card>
        </main>
        <Navigation />
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Informations</h1>
        </header>
        <main className="max-w-4xl mx-auto p-4">
          <Card className="text-center py-12">
            <CardContent>
              <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Catégorie non trouvée</h3>
              <p className="text-muted-foreground mb-4">
                Impossible de charger les informations de cette catégorie.
              </p>
              <Button onClick={handleBackClick}>
                Retour
              </Button>
            </CardContent>
          </Card>
        </main>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-background border-b p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBackClick} 
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">Guide de la catégorie</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="text-xs">
              {currentCategory.name}
            </Badge>
            {currentSubcategory && (
              <>
                <span className="text-muted-foreground text-sm">→</span>
                <Badge variant="outline" className="text-xs">
                  {currentSubcategory.name}
                </Badge>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value);
          // Mettre à jour l'URL avec le paramètre tab sans recharger
          const params = new URLSearchParams(searchParams);
          if (value === 'explication') {
            params.delete('tab');
          } else {
            params.set('tab', value);
          }
          navigate(`/category/${categoryId}/info?${params.toString()}`, { replace: true });
        }} className="w-full">
          <div className="overflow-x-auto scrollbar-hide touch-pan-x">
            <TabsList ref={tabsListRef} className="flex w-max min-w-full mb-4 sm:mb-6 bg-transparent border-0 p-0 gap-1 sm:gap-2 scroll-smooth">
            <TabsTrigger 
              value="explication" 
              className="flex-shrink-0 bg-transparent data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-fit"
            >
              Définition
            </TabsTrigger>
            <TabsTrigger 
              value="comment-faire" 
              className="flex-shrink-0 bg-transparent data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-fit"
            >
              Réalisation
            </TabsTrigger>
            <TabsTrigger 
              value="collaboration" 
              className="flex-shrink-0 bg-transparent data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-fit"
            >
              Collaboration
            </TabsTrigger>
            <TabsTrigger 
              value="personnalisation" 
              className="flex-shrink-0 bg-transparent data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-fit"
            >
              Personnalisation
            </TabsTrigger>
            <TabsTrigger 
              value="outils" 
              className="flex-shrink-0 bg-transparent data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-fit"
            >
              Outils
            </TabsTrigger>
            <TabsTrigger 
              value="mots-cles" 
              className="flex-shrink-0 bg-transparent data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap min-w-fit"
            >
              Mots-clés
            </TabsTrigger>
          </TabsList>
          </div>

          {/* Onglet Explication */}
          <TabsContent value="explication" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Qu'est-ce que la catégorie {currentCategory.name} ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    {categoryInfo.description}
                  </p>
                </div>

                {/* Caractéristiques de la catégorie */}
                {guide?.characteristics && guide.characteristics.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Caractéristiques principales
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {guide.characteristics.map((char, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className={`w-5 h-5 rounded-full bg-${char.color}-500 flex items-center justify-center`}>
                            <span className="text-white text-xs">★</span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{char.title}</div>
                            <div className="text-xs text-muted-foreground">{char.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Où trouver cette catégorie */}
                {guide?.platforms && guide.platforms.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-500" />
                      Où peut-on retrouver cette catégorie ?
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {guide.platforms.map((platform, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-2 justify-center py-2">
                          <span>{platform.icon}</span>
                          {platform.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Comment faire */}
          <TabsContent value="comment-faire" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Comment faire la catégorie {currentCategory.name} ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    {categoryInfo.howTo}
                  </p>
                </div>

                {/* Étapes pratiques */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Étapes pour commencer</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <div>
                        <div className="font-medium">Définir votre angle</div>
                        <div className="text-sm text-muted-foreground">Choisissez ce qui vous rend unique dans cette catégorie</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <div>
                        <div className="font-medium">Identifier votre audience</div>
                        <div className="text-sm text-muted-foreground">Déterminez qui va consommer votre contenu</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <div>
                        <div className="font-medium">Planifier votre contenu</div>
                        <div className="text-sm text-muted-foreground">Créez un calendrier éditorial cohérent</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                        4
                      </div>
                      <div>
                        <div className="font-medium">Produire et publier</div>
                        <div className="text-sm text-muted-foreground">Lancez-vous et apprenez en faisant</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conseils pratiques */}
                {guide?.tips && guide.tips.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Conseils pratiques
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {guide.tips.map((tip, index) => {
                        const colorMap: { [key: string]: string } = {
                          'blue': 'blue',
                          'green': 'green',
                          'purple': 'purple',
                          'orange': 'orange',
                          'red': 'red',
                          'yellow': 'yellow'
                        };
                        const color = colorMap[tip.color] || 'blue';
                        
                        return (
                          <div key={index} className={`p-4 bg-${color}-50 dark:bg-${color}-900/20 rounded-lg border-l-4 border-${color}-500`}>
                            <h4 className={`font-medium text-${color}-900 dark:text-${color}-100 mb-2`}>{tip.title}</h4>
                            <p className={`text-sm text-${color}-800 dark:text-${color}-200`}>
                              {tip.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Collaboration */}
          <TabsContent value="collaboration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="w-5 h-5" />
                  Types de collaboration {currentSubcategory ? `pour ${currentSubcategory.name}` : `dans ${currentCategory.name}`}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    {collaboration?.description || `Découvrez les différents types de collaboration possibles ${currentSubcategory ? `dans la sous-catégorie ${currentSubcategory.name}` : `dans la catégorie ${currentCategory?.name || ''}`}. Trouvez des partenaires et créez ensemble du contenu engageant.`}
                  </p>
                </div>
                
                {!subcategoryId && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg mb-4">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      💡 Pour voir les types de collaboration spécifiques à une sous-catégorie, sélectionnez d'abord une sous-catégorie depuis la page des sous-catégories.
                    </p>
                  </div>
                )}

                {/* Types de collaboration par défaut si aucune donnée n'est disponible */}
                {!collaborationLoading && (
                  <div className="mt-6 space-y-6">
                    {collaboration?.collaboration_types && collaboration.collaboration_types.length > 0 ? (
                      collaboration.collaboration_types.map((collabType, index) => (
                        <div key={collabType.id || index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Users className="w-5 h-5 text-blue-500" />
                            <h3 className="text-lg font-semibold">{collabType.title}</h3>
                            <Badge variant="outline" className="ml-auto">
                              {collabType.type}
                            </Badge>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {collabType.description}
                          </p>

                          {collabType.requirements && collabType.requirements.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4 text-green-500" />
                                Prérequis
                              </h4>
                              <div className="space-y-2">
                                {collabType.requirements.map((req, reqIndex) => (
                                  <div key={reqIndex} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{req}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {collabType.benefits && collabType.benefits.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                Avantages
                              </h4>
                              <ul className="space-y-2">
                                {collabType.benefits.map((benefit, benefitIndex) => (
                                  <li key={benefitIndex} className="flex items-start gap-2 text-sm">
                                    <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {collabType.examples && collabType.examples.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
                                <Star className="w-4 h-4 text-purple-500" />
                                Exemples
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {collabType.examples.map((example, exampleIndex) => (
                                  <Badge key={exampleIndex} variant="secondary" className="p-2 text-sm">
                                    {example}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      // Types de collaboration par défaut
                      [
                        {
                          id: '1',
                          type: 'Partenariat de contenu',
                          title: 'Création de contenu collaboratif',
                          description: 'Collaborez avec d\'autres créateurs pour produire du contenu ensemble dans cette catégorie.',
                          requirements: ['Audience similaire', 'Style complémentaire', 'Engagement actif'],
                          benefits: ['Exposition mutuelle', 'Croissance de l\'audience', 'Contenu varié'],
                          examples: ['Vidéos en duo', 'Challenges collaboratifs', 'Séries de posts']
                        },
                        {
                          id: '2',
                          type: 'Échange de compétences',
                          title: 'Partage d\'expertise',
                          description: 'Échangez vos compétences avec d\'autres créateurs spécialisés dans cette catégorie.',
                          requirements: ['Expertise reconnue', 'Disponibilité', 'Bonne communication'],
                          benefits: ['Apprentissage mutuel', 'Amélioration des compétences', 'Réseau professionnel'],
                          examples: ['Tutoriels croisés', 'Mentorat réciproque', 'Workshops collaboratifs']
                        },
                        {
                          id: '3',
                          type: 'Projet commun',
                          title: 'Projets collaboratifs',
                          description: 'Lancez des projets communs avec d\'autres créateurs pour maximiser l\'impact.',
                          requirements: ['Vision alignée', 'Engagement long terme', 'Ressources complémentaires'],
                          benefits: ['Impact plus large', 'Ressources partagées', 'Innovation'],
                          examples: ['Séries collaboratives', 'Événements communs', 'Produits conjoints']
                        }
                      ].map((collabType, index) => (
                        <div key={collabType.id || index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="flex items-center gap-2 mb-3">
                            <Users className="w-5 h-5 text-blue-500" />
                            <h3 className="text-lg font-semibold">{collabType.title}</h3>
                            <Badge variant="outline" className="ml-auto">
                              {collabType.type}
                            </Badge>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">
                            {collabType.description}
                          </p>

                          {collabType.requirements && collabType.requirements.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
                                <Target className="w-4 h-4 text-green-500" />
                                Prérequis
                              </h4>
                              <div className="space-y-2">
                                {collabType.requirements.map((req, reqIndex) => (
                                  <div key={reqIndex} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">{req}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {collabType.benefits && collabType.benefits.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                Avantages
                              </h4>
                              <ul className="space-y-2">
                                {collabType.benefits.map((benefit, benefitIndex) => (
                                  <li key={benefitIndex} className="flex items-start gap-2 text-sm">
                                    <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <span>{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {collabType.examples && collabType.examples.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
                                <Star className="w-4 h-4 text-purple-500" />
                                Exemples
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {collabType.examples.map((example, exampleIndex) => (
                                  <Badge key={exampleIndex} variant="secondary" className="p-2 text-sm">
                                    {example}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {collaborationLoading && (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement des informations de collaboration...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Personnalisation */}
          <TabsContent value="personnalisation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Comment personnaliser la catégorie {currentCategory.name} ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    {categoryInfo.personalization}
                  </p>
                </div>

                {/* Axes de personnalisation */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Axes de personnalisation</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        Votre audience cible
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Adaptez votre contenu selon l'âge, les intérêts et le niveau de connaissance de votre audience
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Débutants</Badge>
                        <Badge variant="secondary">Intermédiaires</Badge>
                        <Badge variant="secondary">Experts</Badge>
                        <Badge variant="secondary">Professionnels</Badge>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        Votre style unique
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Développez votre signature visuelle et narrative
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Humoristique</Badge>
                        <Badge variant="secondary">Éducatif</Badge>
                        <Badge variant="secondary">Inspirant</Badge>
                        <Badge variant="secondary">Pratique</Badge>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Votre niche spécifique
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Trouvez votre sous-catégorie ou angle unique dans cette catégorie
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Spécialisation</Badge>
                        <Badge variant="secondary">Approche unique</Badge>
                        <Badge variant="secondary">Expertise particulière</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exemples de personnalisation */}
                {guide?.examples && guide.examples.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Exemples concrets</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {guide.examples.map((example, index) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <h4 className="font-medium mb-2">{example.type}</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {example.items.map((item, itemIndex) => (
                              <li key={itemIndex}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Mots-clés */}
          <TabsContent value="mots-cles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Mots-clés à maîtriser pour {currentCategory.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    Maîtrisez ces termes clés pour créer du contenu professionnel et engageant dans cette catégorie.
                  </p>
                </div>

                {/* Mots-clés essentiels */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Mots-clés essentiels</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Badge variant="outline" className="p-2 text-sm">Terme technique 1</Badge>
                    <Badge variant="outline" className="p-2 text-sm">Concept clé 2</Badge>
                    <Badge variant="outline" className="p-2 text-sm">Vocabulaire spécialisé 3</Badge>
                    <Badge variant="outline" className="p-2 text-sm">Terme technique 4</Badge>
                    <Badge variant="outline" className="p-2 text-sm">Concept clé 5</Badge>
                    <Badge variant="outline" className="p-2 text-sm">Vocabulaire spécialisé 6</Badge>
                  </div>
                </div>

                {/* Mots-clés par niveau */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Par niveau de complexité</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <h4 className="font-medium mb-2 text-green-800 dark:text-green-200">Débutant</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Terme de base 1</Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Terme de base 2</Badge>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Terme de base 3</Badge>
                      </div>
                    </div>
                    <div className="p-4 border border-yellow-200 dark:border-yellow-700 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <h4 className="font-medium mb-2 text-yellow-800 dark:text-yellow-200">Intermédiaire</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Terme avancé 1</Badge>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Terme avancé 2</Badge>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Terme avancé 3</Badge>
                      </div>
                    </div>
                    <div className="p-4 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <h4 className="font-medium mb-2 text-red-800 dark:text-red-200">Expert</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-800">Terme expert 1</Badge>
                        <Badge variant="secondary" className="bg-red-100 text-red-800">Terme expert 2</Badge>
                        <Badge variant="secondary" className="bg-red-100 text-red-800">Terme expert 3</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Outils */}
          <TabsContent value="outils" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="w-5 h-5" />
                  Outils nécessaires pour {currentCategory.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                    Découvrez les outils essentiels pour créer du contenu de qualité dans cette catégorie.
                  </p>
                </div>

                {/* Outils par catégorie */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Outils de création</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        Outils de conception
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Outil de design 1</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Outil de design 2</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Outil de design 3</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Outil de design 4</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-500" />
                        Outils d'analyse
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Outil d'analyse 1</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Outil d'analyse 2</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Outil d'analyse 3</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Outil d'analyse 4</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-purple-500" />
                        Outils de production
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">Outil de production 1</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">Outil de production 2</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">Outil de production 3</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">Outil de production 4</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outils gratuits vs payants */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Gratuits vs Payants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <h4 className="font-medium mb-2 text-green-800 dark:text-green-200 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Outils gratuits
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Outil gratuit 1</li>
                        <li>• Outil gratuit 2</li>
                        <li>• Outil gratuit 3</li>
                        <li>• Outil gratuit 4</li>
                      </ul>
                    </div>
                    <div className="p-4 border border-blue-200 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Outils premium
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Outil premium 1</li>
                        <li>• Outil premium 2</li>
                        <li>• Outil premium 3</li>
                        <li>• Outil premium 4</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Navigation />
    </div>
  );
};

export default CategoryInfo;
