import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Target, User, Plus, Hash, Calendar, Star, Lightbulb, Users, Globe, Camera, Video, FileText, MessageSquare } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';
import Navigation from '@/components/Navigation';

interface ChallengeFormData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  difficulty: string;
  duration_days: number;
  points: number;
  platform: string;
  tags: string[];
}

interface ContentChallengeData extends ChallengeFormData {
  content_type: string;
  requirements: string;
}

interface AccountChallengeData extends ChallengeFormData {
  account_name: string;
  account_description: string;
  content_ideas: string[];
  target_audience: string;
  content_style: string;
}

const Publish = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: categories = [] } = useCategories();
  const { data: subcategories = [] } = useSubcategories();
  
  // Fonction pour filtrer les sous-catégories par catégorie
  const getSubcategoriesByCategory = (categoryId: string) => {
    return subcategories.filter(sub => sub.category_id === categoryId);
  };
  
  const [activeTab, setActiveTab] = useState('content');
  const [loading, setLoading] = useState(false);
  
  // États pour les formulaires
  const [contentChallenge, setContentChallenge] = useState<ContentChallengeData>({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    difficulty: 'medium',
    duration_days: 1,
    points: 50,
    platform: '',
    tags: [],
    content_type: 'post',
    requirements: ''
  });

  const [accountChallenge, setAccountChallenge] = useState<AccountChallengeData>({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    difficulty: 'medium',
    duration_days: 1,
    points: 50,
    platform: '',
    tags: [],
    account_name: '',
    account_description: '',
    content_ideas: [''],
    target_audience: '',
    content_style: ''
  });

  const [newTag, setNewTag] = useState('');
  const [newContentIdea, setNewContentIdea] = useState('');

  // Options pour les sélecteurs
  const difficultyOptions = [
    { value: 'easy', label: 'Facile', points: 25 },
    { value: 'medium', label: 'Moyen', points: 50 },
    { value: 'hard', label: 'Difficile', points: 100 }
  ];

  const contentTypes = [
    { value: 'post', label: 'Post', icon: FileText },
    { value: 'video', label: 'Vidéo', icon: Video },
    { value: 'story', label: 'Story', icon: Camera },
    { value: 'reel', label: 'Reel', icon: Video },
    { value: 'carousel', label: 'Carousel', icon: FileText },
    { value: 'thread', label: 'Thread', icon: MessageSquare }
  ];

  const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'multi', label: 'Multi-plateforme' }
  ];

  const contentStyles = [
    { value: 'professional', label: 'Professionnel' },
    { value: 'casual', label: 'Décontracté' },
    { value: 'humorous', label: 'Humoristique' },
    { value: 'educational', label: 'Éducatif' },
    { value: 'inspirational', label: 'Inspirant' },
    { value: 'trendy', label: 'Tendance' }
  ];

  // Gestion des tags
  const addTag = (tags: string[], setTags: (tags: string[]) => void) => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string, tags: string[], setTags: (tags: string[]) => void) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Gestion des idées de contenu
  const addContentIdea = () => {
    if (newContentIdea.trim()) {
      setAccountChallenge({
        ...accountChallenge,
        content_ideas: [...accountChallenge.content_ideas, newContentIdea.trim()]
      });
      setNewContentIdea('');
    }
  };

  const removeContentIdea = (index: number) => {
    setAccountChallenge({
      ...accountChallenge,
      content_ideas: accountChallenge.content_ideas.filter((_, i) => i !== index)
    });
  };

  const updateContentIdea = (index: number, value: string) => {
    const newIdeas = [...accountChallenge.content_ideas];
    newIdeas[index] = value;
    setAccountChallenge({
      ...accountChallenge,
      content_ideas: newIdeas
    });
  };

  // Mise à jour automatique des points selon la difficulté
  const updateDifficulty = (difficulty: string, setChallenge: any, challenge: any) => {
    const difficultyOption = difficultyOptions.find(d => d.value === difficulty);
    setChallenge({
      ...challenge,
      difficulty,
      points: difficultyOption?.points || 50
    });
  };

  // Validation des formulaires
  const validateContentChallenge = (): boolean => {
    return !!(
      contentChallenge.title &&
      contentChallenge.description &&
      contentChallenge.category &&
      contentChallenge.content_type &&
      contentChallenge.platform
    );
  };

  const validateAccountChallenge = (): boolean => {
    return !!(
      accountChallenge.title &&
      accountChallenge.description &&
      accountChallenge.account_name &&
      accountChallenge.account_description &&
      accountChallenge.platform &&
      accountChallenge.content_ideas.some(idea => idea.trim())
    );
  };

  // Publication des challenges
  const publishChallenge = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour publier un challenge",
        variant: "destructive"
      });
      return;
    }

    const isContentTab = activeTab === 'content';
    const isValid = isContentTab ? validateContentChallenge() : validateAccountChallenge();

    if (!isValid) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Ici tu ajouteras la logique pour insérer dans la base de données
      // Pour l'instant, on simule la publication
      
      await new Promise(resolve => setTimeout(resolve, 1000));

        toast({
        title: "Succès !",
        description: `Challenge ${isContentTab ? 'de contenu' : 'de compte'} publié avec succès`,
      });

      // Rediriger vers la page des challenges publics
      navigate('/public-challenges');
      
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de publier le challenge. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
  return (
      <div className="min-h-screen pb-20">
        <header className="bg-background border-b p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')} 
            className="mr-2"
            >
            <ArrowLeft className="h-5 w-5" />
            </Button>
          <h1 className="text-xl font-semibold">Publier un Challenge</h1>
        </header>
        <main className="max-w-2xl mx-auto p-4">
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Connexion requise</h3>
              <p className="text-muted-foreground mb-4">
                Vous devez être connecté pour publier un challenge
              </p>
              <Button onClick={() => navigate('/auth')}>
                Se connecter
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
          onClick={() => navigate('/public-challenges')} 
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Publier un Challenge</h1>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Challenge de Contenu
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Challenge de Compte
            </TabsTrigger>
          </TabsList>

          {/* Onglet Challenge de Contenu */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Challenge de Contenu
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Créez un défi pour la création de contenu créatif
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Titre */}
                <div className="space-y-2">
                  <Label htmlFor="content-title">Titre du challenge *</Label>
                  <Input
                    id="content-title"
                    placeholder="Ex: Créer un titre viral sur la mode"
                    value={contentChallenge.title}
                    onChange={(e) => setContentChallenge({
                      ...contentChallenge,
                      title: e.target.value
                    })}
                  />
                  </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="content-description">Description *</Label>
                  <Textarea
                    id="content-description"
                    placeholder="Décrivez en détail ce que vous attendez des participants"
                    rows={4}
                    value={contentChallenge.description}
                    onChange={(e) => setContentChallenge({
                      ...contentChallenge,
                      description: e.target.value
                    })}
                  />
                </div>

                {/* Type de contenu et plateforme */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="content-type">Type de contenu *</Label>
                    <Select
                      value={contentChallenge.content_type}
                      onValueChange={(value) => setContentChallenge({
                        ...contentChallenge,
                        content_type: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                {type.label}
                </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
              </div>

                  <div className="space-y-2">
                    <Label htmlFor="content-platform">Plateforme *</Label>
                    <Select
                      value={contentChallenge.platform}
                      onValueChange={(value) => setContentChallenge({
                        ...contentChallenge,
                        platform: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une plateforme" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
            </div>
          </div>

                {/* Catégorie et sous-catégorie */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="content-category">Catégorie</Label>
                    <Select
                      value={contentChallenge.category}
                      onValueChange={(value) => setContentChallenge({
                        ...contentChallenge,
                        category: value,
                        subcategory: ''
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content-subcategory">Sous-catégorie</Label>
                    <Select
                      value={contentChallenge.subcategory}
                      onValueChange={(value) => setContentChallenge({
                        ...contentChallenge,
                        subcategory: value
                      })}
                      disabled={!contentChallenge.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une sous-catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentChallenge.category && getSubcategoriesByCategory(contentChallenge.category).map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
            </div>
          </div>

                {/* Difficulté et durée */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="content-difficulty">Difficulté</Label>
                    <Select
                      value={contentChallenge.difficulty}
                      onValueChange={(value) => updateDifficulty(value, setContentChallenge, contentChallenge)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{option.label}</span>
                              <Badge variant="secondary" className="ml-2">
                                {option.points} pts
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content-duration">Durée (jours)</Label>
                    <Input
                      id="content-duration"
                      type="number"
                      min="1"
                      max="30"
                      value={contentChallenge.duration_days}
                      onChange={(e) => setContentChallenge({
                        ...contentChallenge,
                        duration_days: parseInt(e.target.value) || 1
                      })}
                    />
                </div>
              </div>

                {/* Points */}
                <div className="space-y-2">
                  <Label htmlFor="content-points">Points à gagner</Label>
                  <div className="flex items-center gap-2">
                <Input
                      id="content-points"
                      type="number"
                      min="25"
                      max="200"
                      value={contentChallenge.points}
                      onChange={(e) => setContentChallenge({
                        ...contentChallenge,
                        points: parseInt(e.target.value) || 50
                      })}
                    />
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {contentChallenge.points} points
                    </Badge>
              </div>
            </div>

                {/* Exigences */}
                <div className="space-y-2">
                  <Label htmlFor="content-requirements">Exigences spécifiques</Label>
                  <Textarea
                    id="content-requirements"
                    placeholder="Détaillez les exigences techniques, créatives ou autres..."
                    rows={3}
                    value={contentChallenge.requirements}
                    onChange={(e) => setContentChallenge({
                      ...contentChallenge,
                      requirements: e.target.value
                    })}
                  />
          </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                      <Input
                      placeholder="Ajouter un tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag(contentChallenge.tags, (tags) => setContentChallenge({...contentChallenge, tags}))}
                    />
                        <Button
                          type="button"
                      variant="outline"
                      onClick={() => addTag(contentChallenge.tags, (tags) => setContentChallenge({...contentChallenge, tags}))}
                    >
                      <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                  {contentChallenge.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {contentChallenge.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeTag(tag, contentChallenge.tags, (tags) => setContentChallenge({...contentChallenge, tags}))}
                        >
                          #{tag} ×
                        </Badge>
                        ))}
                      </div>
                    )}
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Challenge de Compte */}
          <TabsContent value="accounts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Challenge de Compte
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Créez un défi pour la création ou le développement de comptes
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Titre */}
                <div className="space-y-2">
                  <Label htmlFor="account-title">Titre du challenge *</Label>
                  <Input
                    id="account-title"
                    placeholder="Ex: Créer un compte Instagram de cuisine"
                    value={accountChallenge.title}
                    onChange={(e) => setAccountChallenge({
                      ...accountChallenge,
                      title: e.target.value
                    })}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="account-description">Description *</Label>
                  <Textarea
                    id="account-description"
                    placeholder="Décrivez ce que vous attendez des participants pour ce challenge de compte"
                    rows={4}
                    value={accountChallenge.description}
                    onChange={(e) => setAccountChallenge({
                      ...accountChallenge,
                      description: e.target.value
                    })}
                  />
              </div>

                {/* Nom et description du compte */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-name">Nom du compte *</Label>
                    <Input
                      id="account-name"
                      placeholder="Ex: Cuisine_Creative"
                      value={accountChallenge.account_name}
                      onChange={(e) => setAccountChallenge({
                        ...accountChallenge,
                        account_name: e.target.value
                      })}
                    />
            </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-platform">Plateforme *</Label>
                    <Select
                      value={accountChallenge.platform}
                      onValueChange={(value) => setAccountChallenge({
                        ...accountChallenge,
                        platform: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une plateforme" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description du compte */}
                <div className="space-y-2">
                  <Label htmlFor="account-account-description">Description du compte *</Label>
                  <Textarea
                    id="account-account-description"
                    placeholder="Décrivez le concept, le style et l'objectif du compte"
                    rows={3}
                    value={accountChallenge.account_description}
                    onChange={(e) => setAccountChallenge({
                      ...accountChallenge,
                      account_description: e.target.value
                    })}
                  />
                </div>

                {/* Idées de contenu */}
                <div className="space-y-2">
                  <Label>Idées de contenu *</Label>
                  <div className="space-y-2">
                    {accountChallenge.content_ideas.map((idea, index) => (
                      <div key={index} className="flex gap-2">
                      <Input
                          placeholder={`Idée ${index + 1}`}
                          value={idea}
                          onChange={(e) => updateContentIdea(index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeContentIdea(index)}
                          disabled={accountChallenge.content_ideas.length === 1}
                        >
                          ×
                        </Button>
                    </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ajouter une nouvelle idée"
                        value={newContentIdea}
                        onChange={(e) => setNewContentIdea(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addContentIdea()}
                      />
                      <Button
                            type="button"
                        variant="outline"
                        onClick={addContentIdea}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                                </div>
                            </div>
                      </div>

                {/* Audience cible et style de contenu */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-audience">Audience cible</Label>
                    <Input
                      id="account-audience"
                      placeholder="Ex: 25-35 ans, passionnés de cuisine"
                      value={accountChallenge.target_audience}
                      onChange={(e) => setAccountChallenge({
                        ...accountChallenge,
                        target_audience: e.target.value
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-style">Style de contenu</Label>
                    <Select
                      value={accountChallenge.content_style}
                      onValueChange={(value) => setAccountChallenge({
                        ...accountChallenge,
                        content_style: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un style" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
              </div>

                {/* Catégorie et sous-catégorie */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-category">Catégorie</Label>
                    <Select
                      value={accountChallenge.category}
                      onValueChange={(value) => setAccountChallenge({
                        ...accountChallenge,
                        category: value,
                        subcategory: ''
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-subcategory">Sous-catégorie</Label>
                    <Select
                      value={accountChallenge.subcategory}
                      onValueChange={(value) => setAccountChallenge({
                        ...accountChallenge,
                        subcategory: value
                      })}
                      disabled={!accountChallenge.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une sous-catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {accountChallenge.category && getSubcategoriesByCategory(accountChallenge.category).map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Difficulté et durée */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-difficulty">Difficulté</Label>
                    <Select
                      value={accountChallenge.difficulty}
                      onValueChange={(value) => updateDifficulty(value, setAccountChallenge, accountChallenge)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficultyOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center justify-between w-full">
                              <span>{option.label}</span>
                              <Badge variant="secondary" className="ml-2">
                                {option.points} pts
                              </Badge>
              </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
            </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-duration">Durée (jours)</Label>
                    <Input
                      id="account-duration"
                      type="number"
                      min="1"
                      max="30"
                      value={accountChallenge.duration_days}
                      onChange={(e) => setAccountChallenge({
                        ...accountChallenge,
                        duration_days: parseInt(e.target.value) || 1
                      })}
                  />
                </div>
              </div>

                {/* Points */}
                <div className="space-y-2">
                  <Label htmlFor="account-points">Points à gagner</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="account-points"
                      type="number"
                      min="25"
                      max="200"
                      value={accountChallenge.points}
                      onChange={(e) => setAccountChallenge({
                        ...accountChallenge,
                        points: parseInt(e.target.value) || 50
                      })}
                    />
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {accountChallenge.points} points
                    </Badge>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ajouter un tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag(accountChallenge.tags, (tags) => setAccountChallenge({...accountChallenge, tags}))}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addTag(accountChallenge.tags, (tags) => setAccountChallenge({...accountChallenge, tags}))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
              </div>
                  {accountChallenge.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {accountChallenge.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeTag(tag, accountChallenge.tags, (tags) => setAccountChallenge({...accountChallenge, tags}))}
                        >
                          #{tag} ×
                        </Badge>
                      ))}
            </div>
          )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bouton de publication */}
        <div className="mt-8 flex justify-center">
              <Button 
            onClick={publishChallenge}
            disabled={loading || (activeTab === 'content' ? !validateContentChallenge() : !validateAccountChallenge())}
            size="lg"
            className="px-8"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Publication...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Publier le Challenge
              </div>
                )}
              </Button>
        </div>
      </main>
      <Navigation />
    </div>
  );
};

export default Publish;
