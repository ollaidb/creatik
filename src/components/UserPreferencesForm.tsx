import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';
import { useSubcategoriesLevel2 } from '@/hooks/useSubcategoriesLevel2';
import { useCreators } from '@/hooks/useCreators';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, X, Search, Plus } from 'lucide-react';

const creatorTypes = [
  { value: 'influenceur', label: 'Influenceur' },
  { value: 'createur_contenu', label: 'Créateur de contenu' },
  { value: 'entreprise', label: 'Entreprise' },
  { value: 'artiste', label: 'Artiste' },
  { value: 'expert', label: 'Expert/Mentor' },
  { value: 'blogger', label: 'Blogger' },
  { value: 'youtuber', label: 'YouTuber' },
  { value: 'tiktoker', label: 'TikToker' },
  { value: 'autre', label: 'Autre' }
];

const commonValues = [
  'Authenticité',
  'Créativité',
  'Inspiration',
  'Éducation',
  'Divertissement',
  'Bienveillance',
  'Innovation',
  'Impact social',
  'Croissance personnelle',
  'Liberté',
  'Passion',
  'Communauté'
];

const finalGoalOptions = [
  'Se faire de l\'argent',
  'Se faire connaître',
  'Vendre des produits/services',
  'Construire une communauté',
  'Partager mes connaissances',
  'Développer ma marque personnelle',
  'Inspirer les autres',
  'Documenter mon parcours',
  'Générer des leads',
  'Augmenter ma visibilité',
  'Créer du contenu de qualité',
  'Autre'
];

interface UserPreferencesFormData {
  preferred_category_id: string;
  preferred_subcategory_id: string;
  preferred_subcategory_level2_id: string;
  similar_titles_ids: string[];
  inspiring_creators_ids: string[];
  final_goal: string[]; // Changé en tableau pour les checkboxes
  values: string[];
  creator_type: string;
  // Anciens champs conservés
  age: string;
  profession: string;
  interests: string[];
  content_preferences: string[];
  platforms: string[];
  experience: string;
  goals: string;
  frequency: string;
}

const UserPreferencesForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const { data: categories } = useCategories();
  const { data: subcategories } = useSubcategories();
  const { data: creators } = useCreators();
  
  const [formData, setFormData] = useState<UserPreferencesFormData>({
    preferred_category_id: '',
    preferred_subcategory_id: '',
    preferred_subcategory_level2_id: '',
    similar_titles_ids: [],
    inspiring_creators_ids: [],
    final_goal: [],
    values: [],
    creator_type: '',
    age: '',
    profession: '',
    interests: [],
    content_preferences: [],
    platforms: [],
    experience: '',
    goals: '',
    frequency: ''
  });

  // États pour les sélections
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('');
  const [selectedSubcategoryLevel2Id, setSelectedSubcategoryLevel2Id] = useState<string>('');
  
  // Vérifier si la catégorie a le niveau 2
  const [hasLevel2, setHasLevel2] = useState(false);
  
  // États pour la recherche de titres et créateurs
  const [titleSearchTerm, setTitleSearchTerm] = useState('');
  const [creatorSearchTerm, setCreatorSearchTerm] = useState('');
  interface TitleWithSubcategory {
    id: string;
    title: string;
    subcategories?: {
      id: string;
      name: string;
      categories?: {
        id: string;
        name: string;
      } | null;
    } | null;
  }
  
  const [availableTitles, setAvailableTitles] = useState<TitleWithSubcategory[]>([]);
  const [showTitleSearch, setShowTitleSearch] = useState(false);
  const [showCreatorSearch, setShowCreatorSearch] = useState(false);

  // Charger les sous-catégories lorsque la catégorie change
  const { data: categorySubcategories } = useSubcategories(selectedCategoryId);
  
  // Charger les sous-catégories niveau 2 lorsque la sous-catégorie change
  const { data: subcategoryLevel2List } = useSubcategoriesLevel2(selectedSubcategoryId);

  // Charger les préférences existantes
  useEffect(() => {
    if (!user) return;
    
    const loadPreferences = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Erreur lors du chargement des préférences:', error);
          return;
        }

        if (data) {
          setFormData({
            preferred_category_id: data.preferred_category_id || '',
            preferred_subcategory_id: data.preferred_subcategory_id || '',
            preferred_subcategory_level2_id: data.preferred_subcategory_level2_id || '',
            similar_titles_ids: data.similar_titles_ids || [],
            inspiring_creators_ids: data.inspiring_creators_ids || [],
            final_goal: Array.isArray(data.final_goal) ? data.final_goal : (data.final_goal ? [data.final_goal] : []),
            values: data.values || [],
            creator_type: data.creator_type || '',
            age: data.age || '',
            profession: data.profession || '',
            interests: data.interests || [],
            content_preferences: data.content_preferences || [],
            platforms: data.platforms || [],
            experience: data.experience || '',
            goals: data.goals || '',
            frequency: data.frequency || ''
          });
          
          setSelectedCategoryId(data.preferred_category_id || '');
          setSelectedSubcategoryId(data.preferred_subcategory_id || '');
          setSelectedSubcategoryLevel2Id(data.preferred_subcategory_level2_id || '');
        }
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Vérifier si la catégorie a le niveau 2
  useEffect(() => {
    const checkLevel2 = async () => {
      if (!selectedCategoryId) {
        setHasLevel2(false);
        return;
      }

      const { data } = await supabase
        .from('category_hierarchy_config')
        .select('has_level2')
        .eq('category_id', selectedCategoryId)
        .single();

      setHasLevel2(data?.has_level2 || false);
    };

    checkLevel2();
  }, [selectedCategoryId]);

  // Rechercher des titres et proposer des suggestions
  useEffect(() => {
    const searchTitles = async () => {
      // Si l'utilisateur a une sous-catégorie sélectionnée, proposer des titres de cette catégorie
      if (!titleSearchTerm && selectedSubcategoryId) {
        const { data } = await supabase
          .from('content_titles')
          .select('id, title, subcategories(id, name, categories(id, name))')
          .eq('subcategory_id', selectedSubcategoryId)
          .eq('type', 'title')
          .limit(10);

        if (data && data.length > 0) {
          setAvailableTitles((data as unknown as TitleWithSubcategory[]).filter(t => !formData.similar_titles_ids.includes(t.id)));
        }
        return;
      }

      // Si l'utilisateur tape quelque chose, rechercher
      if (titleSearchTerm && titleSearchTerm.length >= 2) {
        const { data } = await supabase
          .from('content_titles')
          .select('id, title, subcategories(id, name, categories(id, name))')
          .ilike('title', `%${titleSearchTerm}%`)
          .eq('type', 'title')
          .limit(15);

        if (data) {
          setAvailableTitles((data as unknown as TitleWithSubcategory[]).filter(t => !formData.similar_titles_ids.includes(t.id)));
        }
      } else if (!titleSearchTerm && !selectedSubcategoryId) {
        setAvailableTitles([]);
      }
    };

    const timeoutId = setTimeout(searchTitles, 300);
    return () => clearTimeout(timeoutId);
  }, [titleSearchTerm, selectedSubcategoryId, formData.similar_titles_ids]);

  // Gérer le changement de catégorie
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId('');
    setSelectedSubcategoryLevel2Id('');
    setFormData(prev => ({
      ...prev,
      preferred_category_id: categoryId,
      preferred_subcategory_id: '',
      preferred_subcategory_level2_id: ''
    }));
  };

  // Gérer le changement de sous-catégorie
  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategoryId(subcategoryId);
    setSelectedSubcategoryLevel2Id('');
    setFormData(prev => ({
      ...prev,
      preferred_subcategory_id: subcategoryId,
      preferred_subcategory_level2_id: ''
    }));
  };

  // Gérer le changement de sous-catégorie niveau 2
  const handleSubcategoryLevel2Change = (level2Id: string) => {
    setSelectedSubcategoryLevel2Id(level2Id);
    setFormData(prev => ({
      ...prev,
      preferred_subcategory_level2_id: level2Id
    }));
  };

  // Gérer l'ajout/suppression de titres similaires
  const handleToggleTitle = (titleId: string) => {
    setFormData(prev => ({
      ...prev,
      similar_titles_ids: prev.similar_titles_ids.includes(titleId)
        ? prev.similar_titles_ids.filter(id => id !== titleId)
        : [...prev.similar_titles_ids, titleId]
    }));
  };

  // Gérer l'ajout/suppression de créateurs inspirants
  const handleToggleCreator = (creatorId: string) => {
    setFormData(prev => ({
      ...prev,
      inspiring_creators_ids: prev.inspiring_creators_ids.includes(creatorId)
        ? prev.inspiring_creators_ids.filter(id => id !== creatorId)
        : [...prev.inspiring_creators_ids, creatorId]
    }));
  };

  // Gérer l'ajout/suppression de valeurs
  const handleToggleValue = (value: string) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.includes(value)
        ? prev.values.filter(v => v !== value)
        : [...prev.values, value]
    }));
  };

  // Gérer l'ajout/suppression d'objectifs
  const handleToggleGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      final_goal: prev.final_goal.includes(goal)
        ? prev.final_goal.filter(g => g !== goal)
        : [...prev.final_goal, goal]
    }));
  };

  // Sauvegarder les préférences
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour sauvegarder vos préférences.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const preferencesData = {
        user_id: user.id,
        preferred_category_id: formData.preferred_category_id || null,
        preferred_subcategory_id: formData.preferred_subcategory_id || null,
        preferred_subcategory_level2_id: formData.preferred_subcategory_level2_id || null,
        similar_titles_ids: formData.similar_titles_ids || [],
        inspiring_creators_ids: formData.inspiring_creators_ids || [],
        final_goal: formData.final_goal.length > 0 ? formData.final_goal : null,
        values: formData.values || [],
        creator_type: formData.creator_type || null,
        // Anciens champs
        age: formData.age || null,
        profession: formData.profession || null,
        interests: formData.interests || [],
        content_preferences: formData.content_preferences || [],
        platforms: formData.platforms || [],
        experience: formData.experience || null,
        goals: formData.goals || null,
        frequency: formData.frequency || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_preferences')
        .upsert(preferencesData, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      toast({
        title: "Préférences sauvegardées",
        description: "Vos préférences ont été enregistrées avec succès. La section 'Pour toi' sera personnalisée selon vos choix."
      });

      // Rediriger vers la page d'accueil après 1 seconde
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error: unknown) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Obtenir les titres sélectionnés
  const selectedTitles = availableTitles.filter(t => 
    formData.similar_titles_ids.includes(t.id)
  );

  // Obtenir les créateurs sélectionnés
  const selectedCreators = (creators || []).filter(c =>
    formData.inspiring_creators_ids.includes(c.id)
  );

  // Filtrer les créateurs par recherche
  const filteredCreators = (creators || []).filter(c =>
    c.name.toLowerCase().includes(creatorSearchTerm.toLowerCase()) ||
    (c.display_name && c.display_name.toLowerCase().includes(creatorSearchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Personnalisez votre section "Pour toi"</CardTitle>
        <CardDescription>
          Remplissez ce formulaire pour que nous puissions vous proposer du contenu adapté à votre style et à vos objectifs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Type de créateur */}
          <div>
            <Label htmlFor="creator_type">Type de créateur *</Label>
            <Select
              value={formData.creator_type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, creator_type: value }))}
            >
              <SelectTrigger id="creator_type" className="w-full mt-2">
                <SelectValue placeholder="Sélectionnez votre type" />
              </SelectTrigger>
              <SelectContent>
                {creatorTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Catégorie et sous-catégories */}
          <div className="space-y-4">
            <Label>Catégorie et sous-catégorie principale *</Label>
            
            {/* Catégorie */}
            <div>
              <Label htmlFor="category" className="text-sm font-normal">Catégorie</Label>
              <Select
                value={selectedCategoryId}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger id="category" className="w-full mt-1">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {(categories || []).map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sous-catégorie */}
            {selectedCategoryId && categorySubcategories && categorySubcategories.length > 0 && (
              <div>
                <Label htmlFor="subcategory" className="text-sm font-normal">Sous-catégorie</Label>
                <Select
                  value={selectedSubcategoryId}
                  onValueChange={handleSubcategoryChange}
                >
                  <SelectTrigger id="subcategory" className="w-full mt-1">
                    <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorySubcategories.map(sub => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Sous-catégorie niveau 2 */}
            {hasLevel2 && selectedSubcategoryId && subcategoryLevel2List && subcategoryLevel2List.length > 0 && (
              <div>
                <Label htmlFor="subcategory_level2" className="text-sm font-normal">Sous-catégorie niveau 2 (optionnel)</Label>
                <Select
                  value={selectedSubcategoryLevel2Id}
                  onValueChange={handleSubcategoryLevel2Change}
                >
                  <SelectTrigger id="subcategory_level2" className="w-full mt-1">
                    <SelectValue placeholder="Sélectionnez une sous-catégorie niveau 2" />
                  </SelectTrigger>
                  <SelectContent>
                    {subcategoryLevel2List.map(level2 => (
                      <SelectItem key={level2.id} value={level2.id}>
                        {level2.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Titres qui ressemblent */}
          <div>
            <Label>Titres qui vous ressemblent (optionnel)</Label>
            
            {/* Titres sélectionnés */}
            {selectedTitles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTitles.map(title => (
                  <Badge key={title.id} variant="secondary" className="flex items-center gap-1">
                    {title.title}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleToggleTitle(title.id)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Suggestions automatiques si une sous-catégorie est sélectionnée */}
            {!titleSearchTerm && selectedSubcategoryId && availableTitles.length > 0 && (
              <div className="mb-3">
                <Label className="text-sm mb-2 block">Suggestions automatiques :</Label>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded-md p-2">
                  {availableTitles
                    .filter(t => !formData.similar_titles_ids.includes(t.id))
                    .slice(0, 10)
                    .map(title => (
                      <div
                        key={title.id}
                        className="p-2 hover:bg-muted cursor-pointer border rounded-md flex items-center justify-between"
                        onClick={() => handleToggleTitle(title.id)}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{title.title}</div>
                          {title.subcategories && (
                            <div className="text-xs text-muted-foreground">
                              {title.subcategories.categories?.name} {'→'} {title.subcategories.name}
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTitle(title.id);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Recherche de titres */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des titres..."
                value={titleSearchTerm}
                onChange={(e) => {
                  setTitleSearchTerm(e.target.value);
                  setShowTitleSearch(true);
                }}
                onFocus={() => setShowTitleSearch(true)}
                onBlur={() => setTimeout(() => setShowTitleSearch(false), 200)}
                className="pl-10"
              />
              
              {/* Résultats de recherche */}
              {showTitleSearch && titleSearchTerm && availableTitles.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {availableTitles
                    .filter(t => !formData.similar_titles_ids.includes(t.id))
                    .map(title => (
                      <div
                        key={title.id}
                        className="p-2 hover:bg-muted cursor-pointer border-b"
                        onClick={() => {
                          handleToggleTitle(title.id);
                          setTitleSearchTerm('');
                          setShowTitleSearch(false);
                        }}
                      >
                        <div className="font-medium">{title.title}</div>
                        {title.subcategories && (
                          <div className="text-sm text-muted-foreground">
                            {title.subcategories.categories?.name} {'→'} {title.subcategories.name}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Créateurs inspirants */}
          <div>
            <Label>Créateurs qui vous inspirent (optionnel)</Label>
            
            {/* Créateurs sélectionnés */}
            {selectedCreators.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedCreators.map(creator => (
                  <Badge key={creator.id} variant="secondary" className="flex items-center gap-1">
                    {creator.display_name || creator.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleToggleCreator(creator.id)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Recherche de créateurs */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher des créateurs..."
                value={creatorSearchTerm}
                onChange={(e) => {
                  setCreatorSearchTerm(e.target.value);
                  setShowCreatorSearch(true);
                }}
                onFocus={() => setShowCreatorSearch(true)}
                className="pl-10"
              />
              
              {/* Résultats de recherche */}
              {showCreatorSearch && filteredCreators.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredCreators
                    .filter(c => !formData.inspiring_creators_ids.includes(c.id))
                    .map(creator => (
                      <div
                        key={creator.id}
                        className="p-2 hover:bg-muted cursor-pointer border-b"
                        onClick={() => {
                          handleToggleCreator(creator.id);
                          setCreatorSearchTerm('');
                          setShowCreatorSearch(false);
                        }}
                      >
                        <div className="font-medium">{creator.display_name || creator.name}</div>
                        {creator.bio && (
                          <div className="text-sm text-muted-foreground truncate">
                            {creator.bio}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Objectif final */}
          <div>
            <Label>Objectif final * (sélectionnez plusieurs options)</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {finalGoalOptions.map(goal => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={`goal-${goal}`}
                    checked={formData.final_goal.includes(goal)}
                    onCheckedChange={() => handleToggleGoal(goal)}
                  />
                  <Label htmlFor={`goal-${goal}`} className="text-sm cursor-pointer">
                    {goal}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Valeurs */}
          <div>
            <Label>Vos valeurs (sélectionnez plusieurs options)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {commonValues.map(value => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`value-${value}`}
                    checked={formData.values.includes(value)}
                    onCheckedChange={() => handleToggleValue(value)}
                  />
                  <Label htmlFor={`value-${value}`} className="text-sm cursor-pointer">
                    {value}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sauvegarde en cours...
              </>
            ) : (
              'Sauvegarder mes préférences'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserPreferencesForm;
