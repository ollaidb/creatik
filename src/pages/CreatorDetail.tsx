import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Share2,
  Users,
  Globe,
  Lock,
  Layers3,
  Sparkles,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { useCreator } from '@/hooks/useCreators';
import {
  useUserPublicationsById,
  Publication,
  PublicationContentType,
} from '@/hooks/usePublications';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navigation from '@/components/Navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type PublicTabKey = 'all' | PublicationContentType;

const TAB_CONFIG: Record<PublicTabKey, { label: string; gradient: string }> = {
  all: { label: 'Tout', gradient: 'from-purple-500 to-pink-500' },
  content: { label: 'Contenu', gradient: 'from-orange-400 to-red-500' },
  creator: { label: 'Créateurs', gradient: 'from-amber-500 to-orange-500' },
  hooks: { label: 'Hooks', gradient: 'from-indigo-500 to-blue-500' },
  pseudo: { label: 'Pseudos', gradient: 'from-teal-500 to-emerald-500' },
  title: { label: 'Titres', gradient: 'from-purple-500 to-violet-500' },
  source: { label: 'Sources', gradient: 'from-blue-500 to-cyan-500' },
  category: { label: 'Catégories', gradient: 'from-slate-500 to-gray-600' },
  subcategory: { label: 'Sous-catégories', gradient: 'from-rose-500 to-red-500' },
  subcategory_level2: { label: 'Sous-catégories N2', gradient: 'from-pink-500 to-fuchsia-500' },
  account: { label: 'Comptes', gradient: 'from-amber-500 to-yellow-500' },
  challenge: { label: 'Challenges', gradient: 'from-purple-600 to-indigo-600' },
};

const getTabKeysInOrder = (publications: Publication[]): PublicTabKey[] => {
  const encountered = new Set<PublicationContentType>();

  publications.forEach((publication) => {
    encountered.add(publication.content_type);
  });

  return (['all'] as PublicTabKey[]).concat(
    (Object.keys(TAB_CONFIG) as PublicTabKey[]).filter(
      (key) => key === 'all' || encountered.has(key as PublicationContentType)
    )
  );
};

const formatPublicationDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "dd MMM yyyy 'à' HH:mm", { locale: fr });
  } catch {
    return null;
  }
};

const PublicPublicationCard: React.FC<{ publication: Publication }> = ({ publication }) => (
  <Card className="border-border/60 bg-card/80 backdrop-blur">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between gap-2">
        <CardTitle className="text-base font-semibold leading-tight text-foreground">
          {publication.title}
        </CardTitle>
        <Badge variant="secondary" className="text-xs">
          {TAB_CONFIG[publication.content_type]?.label ?? publication.content_type}
        </Badge>
      </div>
      {publication.description && (
        <p className="text-sm text-muted-foreground mt-1 leading-snug">
          {publication.description}
        </p>
      )}
    </CardHeader>
    <CardContent className="pt-0 text-xs text-muted-foreground space-y-2">
      {publication.platform && (
        <div className="flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 opacity-70" />
          <span className="capitalize">{publication.platform}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Calendar className="h-3.5 w-3.5 opacity-70" />
        <span>
          {formatPublicationDate(publication.created_at) ?? 'Date inconnue'}
        </span>
      </div>
    </CardContent>
  </Card>
);

const CreatorDetail: React.FC = () => {
  const { creatorId } = useParams<{ creatorId: string }>();
  const { navigateBack } = useSmartNavigation();
  const [activeTab, setActiveTab] = useState<PublicTabKey>('all');

  const {
    data: creator,
    isLoading: creatorLoading,
    isError: creatorError,
  } = useCreator(creatorId || '');

  const ownerUserId = creator?.owner_user_id ?? null;
  const {
    publications,
    loading: publicationsLoading,
    error: publicationsError,
  } = useUserPublicationsById(ownerUserId);

  useEffect(() => {
    if (!creator) return;

    const orderedTabs = getTabKeysInOrder(publications);
    if (!orderedTabs.includes(activeTab)) {
      setActiveTab(orderedTabs[0] ?? 'all');
    }
  }, [creator, publications, activeTab]);

  const availableTabs = useMemo(() => getTabKeysInOrder(publications), [publications]);

  const filteredPublications = useMemo(() => {
    if (activeTab === 'all') {
      return publications;
    }
    return publications.filter((publication) => publication.content_type === activeTab);
  }, [publications, activeTab]);

  if (creatorLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Chargement du profil public...</p>
        </div>
      </div>
    );
  }

  if (creatorError || !creator) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-6">
        <Layers3 className="h-10 w-10 text-muted-foreground mb-4" />
        <h1 className="text-xl font-semibold mb-2">Profil introuvable</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          Nous n’avons pas réussi à charger ce profil public. Le créateur a peut-être supprimé son compte ou l’URL a changé.
        </p>
        <Button className="mt-6" onClick={navigateBack}>
          Retour
        </Button>
      </div>
    );
  }

  const heroBio = creator.public_bio || creator.bio;
  const socialNetworks = creator.social_networks ?? [];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10" />
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex flex-col gap-4">
            {!creator.is_public && (
              <div className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50/70 px-3 py-2 text-sm text-amber-800">
                <Lock className="h-4 w-4" />
                <span>
                  Ce créateur n’a pas encore activé son profil public. Certaines sections
                  peuvent être limitées, mais ses informations principales restent visibles ici.
                </span>
              </div>
            )}
            <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={navigateBack} className="bg-white/10 text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-white/60 shadow-lg">
                  <AvatarImage src={creator.avatar || undefined} alt={creator.name} />
                  <AvatarFallback className="bg-white/20 text-lg font-semibold">
                    {creator.name
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white/80">
                    <Globe className="h-3.5 w-3.5" />
                    Profil public
                  </span>
                  <h1 className="text-2xl font-semibold leading-tight">{creator.name}</h1>
                  {creator.display_name && (
                    <p className="text-sm text-white/80">@{creator.display_name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 backdrop-blur text-white border-white/30">
                  Ouvert aux collaborations
                </Badge>
                <Button
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10"
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      void navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                   </div>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-[2fr,1fr]">
            <Card className="bg-white/15 backdrop-blur border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4" />
                  À propos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/90 leading-relaxed">
                  {heroBio || "Ce créateur n'a pas encore partagé de biographie."}
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/15 backdrop-blur border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" />
                  Réseaux connectés
                </CardTitle>
              </CardHeader>
              <CardContent>
                {socialNetworks.length === 0 ? (
                  <p className="text-sm text-white/80">
                    Aucun réseau social n’est encore connecté.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {socialNetworks.map((network) => (
                      <Badge
                        key={network.id}
                        className="bg-white/20 text-white border-white/20 capitalize"
                      >
                        {network.platform_info?.label ?? network.platform}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
              </div>
                  </div>
      </section>

      {/* Publications */}
      <main className="container mx-auto px-4 py-6 space-y-8">
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
              <h2 className="text-xl font-semibold text-foreground">Publications</h2>
              <p className="text-sm text-muted-foreground">
                Les inspirations et contenus que {creator.name} partage avec la communauté Creatik.
              </p>
                </div>
              </div>

          {publicationsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="h-40 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : publicationsError ? (
            <Card className="border-destructive/30 bg-destructive/10">
              <CardContent className="py-8 text-center space-y-3">
                <Layers3 className="h-8 w-8 text-destructive mx-auto" />
                <h3 className="text-lg font-semibold">Impossible de charger les publications</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {publicationsError}
                </p>
              </CardContent>
            </Card>
          ) : publications.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center space-y-3">
                <Sparkles className="h-8 w-8 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold">Pas encore de publications</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Ce créateur n’a pas encore partagé de contenus avec la communauté. Revenez plus tard pour découvrir ses idées.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-2 pb-2 min-w-max">
                  {availableTabs.map((tabKey) => {
                    const tab = TAB_CONFIG[tabKey];
                    const isActive = activeTab === tabKey;
                    return (
                      <motion.button
                        key={tabKey}
                        onClick={() => setActiveTab(tabKey)}
                        className={`px-3 py-2 rounded-lg transition-all duration-300 min-w-[90px] text-center text-xs sm:text-sm ${
                          isActive
                            ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg scale-105`
                            : 'bg-card border border-border text-foreground hover:border-primary/40'
                        }`}
                        whileTap={{ scale: 0.96 }}
                      >
                        {tab.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPublications.map((publication) => (
                  <PublicPublicationCard key={publication.id} publication={publication} />
                ))}
                </div>
            </>
          )}
        </section>

        {/* Réseaux sociaux détaillés */}
        {socialNetworks.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Présence sociale</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {socialNetworks.map((network) => (
                <Card key={network.id} className="border-border bg-card/80">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base flex items-center gap-2 capitalize">
                          <Globe className="h-4 w-4 text-primary" />
                          {network.platform_info?.label ?? network.platform}
                        </CardTitle>
                        {network.handle && (
                          <p className="text-xs text-muted-foreground">
                            @{network.handle}
                          </p>
                        )}
                      </div>
                      {network.profile_url && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground"
                          asChild
                        >
                          <a href={network.profile_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                         </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    {network.followers_count && network.followers_count > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" />
                        <span>{new Intl.NumberFormat('fr-FR').format(network.followers_count)} abonnés</span>
                       </div>
                    )}
                    <p>
                      {network.content_summary ||
                        "Le créateur n'a pas encore détaillé ses contenus pour cette plateforme."}
                    </p>
                  </CardContent>
                </Card>
                     ))}
                   </div>
          </section>
        )}
      </main>
      
      <Navigation />
    </div>
  );
};

export default CreatorDetail;

