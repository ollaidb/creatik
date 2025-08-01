import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Loader2, ArrowLeft, Search, X, Check, AlertTriangle, Eye, FileText, Link, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';
import { usePendingPublish } from '@/hooks/usePendingPublish';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { useSocialNetworks } from '@/hooks/useSocialNetworks';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Subcategory {
  id: string;
  name: string;
  description: string;
  category_id: string;
}

const Publish = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { publishContent, isPublishing } = usePendingPublish();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content_type: 'title' as 'category' | 'subcategory' | 'title' | 'challenge' | 'source' | 'account' | 'hooks' | 'inspiration',
    category_id: '',
    subcategory_id: '',
    description: '', // Added for challenges
    url: '', // Added for sources and accounts
    platform: '' // Added for accounts
  });

  // États pour les barres de recherche
  const [categorySearch, setCategorySearch] = useState('');
  const [subcategorySearch, setSubcategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const { data: socialNetworks } = useSocialNetworks();

  // Refs pour les dropdowns
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const subcategoryDropdownRef = useRef<HTMLDivElement>(null);

  // Récupérer les données
  const { data: categories } = useCategories();
  const { data: subcategories } = useSubcategories(formData.category_id);

  // Filtrer les catégories selon la recherche
  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  ) || [];

  // Filtrer les sous-catégories selon la recherche
  const filteredSubcategories = subcategories?.filter(subcategory =>
    subcategory.name.toLowerCase().includes(subcategorySearch.toLowerCase())
  ) || [];

  // Fermer les dropdowns quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (subcategoryDropdownRef.current && !subcategoryDropdownRef.current.contains(event.target as Node)) {
        setShowSubcategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour publier du contenu",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title || !formData.content_type) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    // Validation selon le type de contenu
    if (formData.content_type === 'subcategory' && !formData.category_id) {
      toast({
        title: "Catégorie requise",
        description: "Veuillez sélectionner une catégorie pour une sous-catégorie",
        variant: "destructive"
      });
      return;
    }

    if ((formData.content_type === 'title' || formData.content_type === 'source' || formData.content_type === 'account') && (!formData.category_id || !formData.subcategory_id)) {
      toast({
        title: "Catégorie et sous-catégorie requises",
        description: "Veuillez sélectionner une catégorie et une sous-catégorie",
        variant: "destructive"
      });
      return;
    }

    // Validation pour les sources
    if (formData.content_type === 'source' && !formData.url) {
      toast({
        title: "URL requise",
        description: "Veuillez entrer l'URL de la source",
        variant: "destructive"
      });
      return;
    }

    // Validation pour les comptes
    if (formData.content_type === 'account' && (!formData.platform || !formData.url)) {
      toast({
        title: "Champs requis",
        description: "Veuillez entrer la plateforme et l'URL du compte",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Publier avec vérification des doublons
      const result = await publishContent({
        content_type: formData.content_type,
        title: formData.title,
        category_id: formData.category_id || undefined,
        subcategory_id: formData.subcategory_id || undefined,
        description: formData.content_type === 'challenge' ? formData.description : undefined,
        url: (formData.content_type === 'source' || formData.content_type === 'account') ? formData.url : undefined,
        platform: formData.content_type === 'account' ? formData.platform : undefined,
        social_network_id: selectedNetwork !== 'all' ? selectedNetwork : undefined
      });

      if (result && result.success) {
        toast({
          title: "Publication soumise !",
          description: "Votre contenu sera validé dans quelques secondes"
        });
        // Reset form
        setFormData({
          title: '',
          content_type: 'title',
          category_id: '',
          subcategory_id: '',
          description: '',
          url: '',
          platform: ''
        });
        setCategorySearch('');
        setSubcategorySearch('');
      } else {
        throw new Error(result?.error || 'Échec de la publication');
      }
    } catch (error) {
      console.error('=== ERREUR PUBLICATION ===');
      console.error('Erreur complète:', error);
      console.error('Message:', error.message);
      toast({
        title: "Erreur",
        description: `Erreur lors de la publication: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setFormData(prev => ({
      ...prev,
      category_id: category.id,
      subcategory_id: '' // Reset subcategory when category changes
    }));
    setCategorySearch(category.name);
    setShowCategoryDropdown(false);
    setSubcategorySearch(''); // Reset subcategory search
  };

  const handleSubcategorySelect = (subcategory: Subcategory) => {
    setFormData(prev => ({
      ...prev,
      subcategory_id: subcategory.id
    }));
    setSubcategorySearch(subcategory.name);
    setShowSubcategoryDropdown(false);
  };

  // Fonction pour obtenir le label du titre selon le type ET le réseau
  const getTitleLabel = () => {
    switch (formData.content_type) {
      case 'category': return 'Nom de la catégorie';
      case 'subcategory': return 'Nom de la sous-catégorie';
      case 'challenge': return 'Nom du challenge';
      case 'source': return 'Titre de la source';
      case 'account': return 'Pseudo de la personne';
      case 'inspiration': return 'Idée d\'inspiration';
      case 'hooks': return 'Hook vidéo';
      default: return 'Titre';
    }
  };

  // Fonction pour obtenir le placeholder du titre selon le type ET le réseau
  const getTitlePlaceholder = () => {
    switch (formData.content_type) {
      case 'category': return 'Entrez le nom de la catégorie';
      case 'subcategory': return 'Entrez le nom de la sous-catégorie';
      case 'challenge': return 'Entrez le nom de votre challenge';
      case 'source': return 'Entrez le titre de la source (ex: "TikTok", "Instagram", "YouTube")';
      case 'account': return 'Entrez le pseudo de la personne (ex: "@username")';
      case 'inspiration': return 'Entrez votre idée d\'inspiration textuelle';
      case 'hooks': return 'Entrez votre hook pour captiver l\'audience';
      default: return 'Entrez le titre de votre contenu';
    }
  };

  // Fonction pour déterminer si on doit afficher la sélection de catégorie
  const shouldShowCategorySelection = () => {
    return ['subcategory', 'title', 'source', 'account', 'hooks', 'inspiration'].includes(formData.content_type);
  };

  // Fonction pour déterminer si on doit afficher la sélection de sous-catégorie
  const shouldShowSubcategorySelection = () => {
    return ['title', 'source', 'account', 'hooks', 'inspiration'].includes(formData.content_type) && formData.category_id;
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')} 
              className="p-2 h-10 w-10 rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold">Publier du contenu</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
        {/* NOUVELLE STRUCTURE : Formulaire en étapes */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
          
          {/* Section 1 : Informations de base */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Informations de base
            </h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Réseau social */}
                <div className="space-y-2">
                  <Label htmlFor="network">Réseau social *</Label>
                  <select
                    id="network"
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900"
                    required
                  >
                    <option value="all">Tous les réseaux</option>
                    {socialNetworks?.map((network) => (
                      <option key={network.id} value={network.id}>
                        {network.display_name}
                      </option>
                    ))}
                  </select>
            </div>

              {/* Type de contenu */}
              <div className="space-y-2">
                <Label htmlFor="content_type">Type de contenu *</Label>
                <select
                  id="content_type"
                  value={formData.content_type}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                        content_type: e.target.value as 'category' | 'subcategory' | 'title' | 'challenge' | 'source' | 'account' | 'hooks' | 'inspiration',
                        category_id: '',
                        subcategory_id: '',
                        description: '',
                        url: '',
                        platform: ''
                      }));
                      setCategorySearch('');
                      setSubcategorySearch('');
                  }}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900"
                  required
                >
                  <option value="title">Titre</option>
                  <option value="subcategory">Sous-catégorie</option>
                  <option value="category">Catégorie</option>
                  <option value="challenge">Challenge</option>
                  <option value="source">Source</option>
                  <option value="account">Compte</option>
                    {selectedNetwork === 'youtube' && <option value="hooks">Hooks</option>}
                    {(selectedNetwork === 'instagram' || selectedNetwork === 'tiktok' || selectedNetwork === 'youtube') && (
                      <option value="inspiration">Inspiration</option>
                    )}
                </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 : Contenu principal */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Contenu principal
            </h2>
            
            <div className="space-y-6">
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="title">{getTitleLabel()} *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={getTitlePlaceholder()}
                  required
                />
              </div>

              {/* Catégorie (si nécessaire) */}
              {shouldShowCategorySelection() && (
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie *</Label>
                  <div className="relative" ref={categoryDropdownRef}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Rechercher une catégorie..."
                        value={categorySearch}
                        onChange={(e) => {
                          setCategorySearch(e.target.value);
                          setShowCategoryDropdown(true);
                        }}
                        onFocus={() => setShowCategoryDropdown(true)}
                        className="pl-10 pr-10"
                      />
                      {categorySearch && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                          onClick={() => {
                            setCategorySearch('');
                            setFormData(prev => ({ ...prev, category_id: '', subcategory_id: '' }));
                            setSubcategorySearch('');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {showCategoryDropdown && filteredCategories.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredCategories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-900"
                            onClick={() => handleCategorySelect(category)}
                          >
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-gray-900">{category.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Sous-catégorie (si nécessaire) */}
              {shouldShowSubcategorySelection() && (
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Sous-catégorie *</Label>
                  <div className="relative" ref={subcategoryDropdownRef}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Rechercher une sous-catégorie..."
                        value={subcategorySearch}
                        onChange={(e) => {
                          setSubcategorySearch(e.target.value);
                          setShowSubcategoryDropdown(true);
                        }}
                        onFocus={() => setShowSubcategoryDropdown(true)}
                        className="pl-10 pr-10"
                      />
                      {subcategorySearch && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                          onClick={() => {
                            setSubcategorySearch('');
                            setFormData(prev => ({ ...prev, subcategory_id: '' }));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {showSubcategoryDropdown && filteredSubcategories.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredSubcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-gray-900"
                            onClick={() => handleSubcategorySelect(subcategory)}
                          >
                            <div>
                              <div className="font-medium text-gray-900">{subcategory.name}</div>
                              {subcategory.description && (
                                <div className="text-sm text-gray-500 truncate">
                                  {subcategory.description}
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3 : Informations supplémentaires */}
          <div className="mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-6">
                {formData.content_type === 'account' && (
                  <div className="space-y-2">
                    <Label htmlFor="platform">Plateforme *</Label>
                    <select
                      id="platform"
                      value={formData.platform}
                      onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Sélectionnez une plateforme</option>
                      <option value="tiktok">TikTok</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="twitter">Twitter/X</option>
                      <option value="facebook">Facebook</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="pinterest">Pinterest</option>
                      <option value="snapchat">Snapchat</option>
                      <option value="twitch">Twitch</option>
                      <option value="discord">Discord</option>
                      <option value="telegram">Telegram</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                )}

                {formData.content_type === 'challenge' && (
                  <div className="space-y-2">
                    <Label htmlFor="description">Description du challenge *</Label>
                    <textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez votre challenge en détail..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-h-[100px] resize-vertical"
                      required
                    />
                  </div>
                )}

                {(formData.content_type === 'source' || formData.content_type === 'account') && (
                  <div className="space-y-2">
                    <Label htmlFor="url">
                      {formData.content_type === 'source' ? 'URL de la source' : 'URL du compte'} *
                    </Label>
                    <div className="relative">
                      <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="url"
                        type="url"
                        value={formData.url || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                        placeholder={formData.content_type === 'source' ? 'https://example.com' : 'https://tiktok.com/@username'}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4 : Soumission */}
          <div className="border-t pt-6">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || isPublishing || !formData.title || !formData.content_type || 
                         (formData.content_type === 'subcategory' && !formData.category_id) ||
                         ((formData.content_type === 'title' || formData.content_type === 'source' || formData.content_type === 'account' || formData.content_type === 'hooks' || formData.content_type === 'inspiration') && (!formData.category_id || !formData.subcategory_id)) ||
                         (formData.content_type === 'challenge' && !formData.description) ||
                         (formData.content_type === 'source' && !formData.url) ||
                         (formData.content_type === 'account' && (!formData.platform || !formData.url))}
              >
                {isSubmitting || isPublishing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publication en cours...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Publier le contenu
                  </>
                )}
              </Button>
          </div>
        </form>
        </div>
      </main>
      <Navigation />
    </div>
  );
};

export default Publish;
