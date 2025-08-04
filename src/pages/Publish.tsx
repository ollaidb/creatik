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
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { useSocialNetworks } from '@/hooks/useSocialNetworks';
import { useThemes } from '@/hooks/useThemes';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content_type: 'title' as 'category' | 'subcategory' | 'title' | 'challenge' | 'source' | 'account' | 'hooks' | 'blog' | 'article' | 'mots-cles' | 'exemple' | 'idee' | 'podcast',
    category_id: '',
    subcategory_id: '',
    description: '', // Added for challenges
    url: '', // Added for sources and accounts
    platform: '', // Added for accounts
    theme: '' // Added for content theme
  });

  // États pour les barres de recherche
  const [categorySearch, setCategorySearch] = useState('');
  const [subcategorySearch, setSubcategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const { data: socialNetworks } = useSocialNetworks();
  const { data: themes } = useThemes();

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
    
    console.log('=== DÉBUT PUBLICATION ===');
    console.log('User:', user);
    console.log('FormData:', formData);
    console.log('Content Type:', formData.content_type);
    console.log('Selected Network:', selectedNetwork);
    
    if (!user) {
      toast({
        title: "Connexion requise",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title || !formData.content_type) {
      toast({
        title: "Champs manquants",
        variant: "destructive"
      });
      return;
    }

    // Validation du réseau social seulement pour les types qui en ont besoin
    const needsNetwork = ['title', 'hooks'].includes(formData.content_type);
    if (needsNetwork && (!selectedNetwork || selectedNetwork === '')) {
      toast({
        title: "Réseau requis",
        variant: "destructive"
      });
      return;
    }

    // Validations spécifiques selon le type de contenu
    if (formData.content_type === 'subcategory' && !formData.category_id) {
      toast({
        title: "Catégorie requise",
        variant: "destructive"
      });
      return;
    }

    if ((formData.content_type === 'title' || formData.content_type === 'account') && !formData.subcategory_id) {
      toast({
        title: "Sous-catégorie requise",
        variant: "destructive"
      });
      return;
    }

    if (formData.content_type === 'challenge' && !formData.description) {
      toast({
        title: "Description requise",
        variant: "destructive"
      });
      return;
    }

    if (formData.content_type === 'source' && !formData.url) {
      toast({
        title: "URL requise",
        variant: "destructive"
      });
      return;
    }

    if (formData.content_type === 'account' && (!formData.platform || !formData.url)) {
      toast({
        title: "Infos manquantes",
        variant: "destructive"
      });
      return;
    }

    // Validation du thème de contenu pour les catégories
    if (formData.content_type === 'category' && !formData.theme) {
      toast({
        title: "Thème requis",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('=== TENTATIVE DE PUBLICATION ===');
      console.log('Type de contenu:', formData.content_type);
      
      // Publication directe selon le type de contenu
      if (formData.content_type === 'category') {
        console.log('Publication catégorie...');
        // Couleurs valides pour les catégories (mises à jour)
        const colors = ['primary', 'orange', 'green', 'pink', 'blue', 'purple', 'red', 'yellow', 'gray', 'indigo', 'teal', 'cyan', 'emerald', 'violet', 'amber', 'lime', 'rose', 'slate'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        console.log('Couleur sélectionnée:', randomColor);
        
        const { error } = await supabase
          .from('categories')
          .insert({
            name: formData.title,
            description: formData.description || 'Catégorie publiée',
            color: randomColor
          });
        
        if (error) {
          console.error('Erreur catégorie:', error);
          console.error('Code d\'erreur:', error.code);
          console.error('Message d\'erreur:', error.message);
          console.error('Détails:', error.details);
          throw error;
        }
        
        console.log('Catégorie publiée avec succès');
        toast({
          title: "Catégorie publiée"
        });
      } else if (formData.content_type === 'subcategory') {
        console.log('Publication sous-catégorie...');
        const { error } = await supabase
          .from('subcategories')
          .insert({
            name: formData.title,
            description: formData.description || 'Sous-catégorie publiée',
            category_id: formData.category_id
          });
        
        if (error) {
          console.error('Erreur sous-catégorie:', error);
          throw error;
        }
        
        console.log('Sous-catégorie publiée avec succès');
        toast({
          title: "Sous-catégorie publiée"
        });
      } else if (formData.content_type === 'title') {
        console.log('Publication titre...');
        const { error } = await supabase
          .from('content_titles')
          .insert({
            title: formData.title,
            subcategory_id: formData.subcategory_id,
            platform: selectedNetwork,
            type: 'title'
          });
        
        if (error) {
          console.error('Erreur titre:', error);
          throw error;
        }
        
        console.log('Titre publié avec succès');
        toast({
          title: "Titre publié"
        });
      } else if (formData.content_type === 'challenge') {
        console.log('Publication challenge...');
        const { error } = await supabase
          .from('challenges')
          .insert({
            title: formData.title,
            description: formData.description,
            category: 'Challenge',
            points: 50,
            difficulty: 'medium',
            duration_days: 1,
            is_daily: false,
            is_active: true
          });
        
        if (error) {
          console.error('Erreur challenge:', error);
          throw error;
        }
        
        console.log('Challenge publié avec succès');
        toast({
          title: "Challenge publié"
        });
      } else if (formData.content_type === 'source') {
        console.log('Publication source...');
        const { error } = await supabase
          .from('sources')
          .insert({
            name: formData.title,
            description: formData.description || 'Source publiée',
            url: formData.url
          });
        
        if (error) {
          console.error('Erreur source:', error);
          throw error;
        }
        
        console.log('Source publiée avec succès');
        toast({
          title: "Source publiée"
        });
      } else if (formData.content_type === 'account') {
        console.log('Publication compte...');
        const { error } = await supabase
          .from('exemplary_accounts')
          .insert({
            account_name: formData.title,
            description: formData.description || 'Compte publié',
            platform: formData.platform,
            account_url: formData.url,
            subcategory_id: formData.subcategory_id
          });
        
        if (error) {
          console.error('Erreur compte:', error);
          throw error;
        }
        
        console.log('Compte publié avec succès');
        toast({
          title: "Compte publié"
        });
      } else if (formData.content_type === 'hooks') {
        console.log('Publication hook...');
        const { error } = await supabase
          .from('content_titles')
          .insert({
            title: formData.title,
            platform: selectedNetwork,
            type: 'hook'
          });
        
        if (error) {
          console.error('Erreur hook:', error);
          throw error;
        }
        
        console.log('Hook publié avec succès');
        toast({
          title: "Hook publié"
        });
      } else if (formData.content_type === 'blog') {
        console.log('Publication blog...');
        const { error } = await supabase
          .from('content_blogs')
          .insert({
            title: formData.title,
            content: formData.description,
            author_id: user.id,
            category_id: formData.category_id,
            subcategory_id: formData.subcategory_id,
            platform: selectedNetwork || 'blog'
          });
        
        if (error) {
          console.error('Erreur blog:', error);
          throw error;
        }
        
        console.log('Blog publié avec succès');
        toast({
          title: "Blog publié"
        });
      } else if (formData.content_type === 'article') {
        console.log('Publication article...');
        const { error } = await supabase
          .from('content_articles')
          .insert({
            title: formData.title,
            content: formData.description,
            author_id: user.id,
            category_id: formData.category_id,
            subcategory_id: formData.subcategory_id,
            platform: selectedNetwork || 'article'
          });
        
        if (error) {
          console.error('Erreur article:', error);
          throw error;
        }
        
        console.log('Article publié avec succès');
        toast({
          title: "Article publié"
        });
      } else if (formData.content_type === 'mots-cles') {
        console.log('Publication mots-clés...');
        const { error } = await supabase
          .from('content_mots_cles')
          .insert({
            title: formData.title,
            content: formData.description,
            author_id: user.id,
            category_id: formData.category_id,
            subcategory_id: formData.subcategory_id,
            platform: selectedNetwork || 'blog'
          });
        
        if (error) {
          console.error('Erreur mots-clés:', error);
          throw error;
        }
        
        console.log('Mots-clés publiés avec succès');
        toast({
          title: "Mots-clés publiés"
        });
      } else if (formData.content_type === 'exemple') {
        console.log('Publication exemple...');
        const { error } = await supabase
          .from('content_exemples')
          .insert({
            title: formData.title,
            content: formData.description,
            author_id: user.id,
            category_id: formData.category_id,
            subcategory_id: formData.subcategory_id,
            platform: selectedNetwork || 'twitter'
          });
        
        if (error) {
          console.error('Erreur exemple:', error);
          throw error;
        }
        
        console.log('Exemple publié avec succès');
        toast({
          title: "Exemple publié"
        });
      } else if (formData.content_type === 'idee') {
        console.log('Publication idée...');
        const { error } = await supabase
          .from('content_idees')
          .insert({
            title: formData.title,
            content: formData.description,
            author_id: user.id,
            category_id: formData.category_id,
            subcategory_id: formData.subcategory_id,
            platform: selectedNetwork || 'instagram'
          });
        
        if (error) {
          console.error('Erreur idée:', error);
          throw error;
        }
        
        console.log('Idée publiée avec succès');
        toast({
          title: "Idée publiée"
        });
      } else if (formData.content_type === 'podcast') {
        console.log('Publication podcast...');
        const { error } = await supabase
          .from('content_podcasts')
          .insert({
            title: formData.title,
            content: formData.description,
            author_id: user.id,
            category_id: formData.category_id,
            subcategory_id: formData.subcategory_id,
            platform: selectedNetwork || 'podcast'
          });
        
        if (error) {
          console.error('Erreur podcast:', error);
          throw error;
        }
        
        console.log('Podcast publié avec succès');
        toast({
          title: "Podcast publié"
        });
      }

      console.log('=== PUBLICATION RÉUSSIE ===');

      // AJOUTER LA PUBLICATION DANS USER_PUBLICATIONS
      try {
        console.log('=== AJOUT DANS USER_PUBLICATIONS ===');
        console.log('User ID:', user.id);
        console.log('Content Type:', formData.content_type);
        console.log('Title:', formData.title);
        console.log('Description:', formData.description);
        console.log('Category ID:', formData.category_id);
        console.log('Subcategory ID:', formData.subcategory_id);
        console.log('Platform:', selectedNetwork || formData.platform);
        console.log('URL:', formData.url);
        
        const publicationData = {
          user_id: user.id,
          content_type: formData.content_type,
          title: formData.title,
          description: formData.description,
          category_id: formData.category_id || null,
          subcategory_id: formData.subcategory_id || null,
          platform: selectedNetwork || formData.platform || null,
          url: formData.url || null,
          status: 'approved'
        };
        
        console.log('Données à insérer:', publicationData);
        
        const { data: insertedData, error: userPubError } = await supabase
          .from('user_publications')
          .insert(publicationData)
          .select();

        if (userPubError) {
          console.error('❌ Erreur lors de l\'ajout dans user_publications:', userPubError);
          console.error('Code d\'erreur:', userPubError.code);
          console.error('Message d\'erreur:', userPubError.message);
          console.error('Détails:', userPubError.details);
          console.error('Hint:', userPubError.hint);
          
          // Afficher l'erreur à l'utilisateur
          toast({
            title: "Attention",
            description: `Publication réussie mais problème d'enregistrement personnel: ${userPubError.message}`,
            variant: "destructive"
          });
        } else {
          console.log('✅ Publication ajoutée dans user_publications avec succès');
          console.log('Données insérées:', insertedData);
          
          toast({
            title: "Publication enregistrée",
            description: "Votre publication a été ajoutée à votre liste personnelle",
          });
        }
      } catch (userPubErr) {
        console.error('❌ Exception lors de l\'ajout dans user_publications:', userPubErr);
        console.error('Type d\'erreur:', typeof userPubErr);
        console.error('Message:', userPubErr instanceof Error ? userPubErr.message : 'Erreur inconnue');
        
        // Afficher l'erreur à l'utilisateur
        toast({
          title: "Attention",
          description: `Publication réussie mais problème d'enregistrement personnel: ${userPubErr instanceof Error ? userPubErr.message : 'Erreur inconnue'}`,
          variant: "destructive"
        });
      }

      // Réinitialiser le formulaire
      setFormData({
        title: '',
        content_type: 'title',
        category_id: '',
        subcategory_id: '',
        description: '',
        url: '',
        platform: '',
        theme: ''
      });
      setSelectedNetwork('');

      // REDIRIGER VERS MES PUBLICATIONS AU LIEU DE LA PAGE D'ACCUEIL
      toast({
        title: "Publication réussie !",
        description: "Votre publication a été ajoutée. Redirection vers vos publications...",
      });
      
      // Rediriger vers la page "Mes publications" après un délai
      setTimeout(() => {
        navigate('/profile/publications');
      }, 1500);

    } catch (error: unknown) {
      console.error('=== ERREUR DE PUBLICATION ===');
      console.error('Erreur complète:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('Message d\'erreur:', errorMessage);
      toast({
        title: "Erreur",
        description: `Une erreur est survenue lors de la publication: ${errorMessage}`,
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
      case 'hooks': return 'Entrez votre hook pour captiver l\'audience';
      default: return 'Entrez le titre de votre contenu';
    }
  };

  // Fonction pour déterminer si on doit afficher la sélection de catégorie
  const shouldShowCategorySelection = () => {
    return ['subcategory', 'title', 'source', 'account', 'hooks'].includes(formData.content_type);
  };

  // Fonction pour déterminer si on doit afficher la sélection de sous-catégorie
  const shouldShowSubcategorySelection = () => {
    return ['title', 'source', 'account', 'hooks'].includes(formData.content_type) && formData.category_id;
  };

  // Fonction pour déterminer si le réseau social est requis
  const needsNetwork = ['title', 'hooks'].includes(formData.content_type);

  return (
    <div className="min-h-screen pb-32" style={{ backgroundColor: '#0f0f10' }}>
      <header className="border-b border-gray-800 p-4" style={{ backgroundColor: '#0f0f10' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')} 
              className="p-2 h-10 w-10 rounded-full text-white hover:bg-gray-800"
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-xl font-semibold text-white">Publier du contenu</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
          
          {/* Section 1 : Réseau social */}
          {needsNetwork && (
          <div className="mb-3">
            <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
              <div className="space-y-1">
                <Label htmlFor="network" className="text-sm text-white">Réseau social *</Label>
                <div className="relative group">
                  <div className="flex items-center justify-between p-3 border border-gray-600 rounded-lg text-white text-sm cursor-pointer hover:bg-gray-800/50 transition-all duration-200" style={{ backgroundColor: '#0f0f10' }}>
                    <span className="font-medium">
                      {selectedNetwork && selectedNetwork !== '' ? 
                        socialNetworks?.find(n => n.name === selectedNetwork)?.display_name || 'Sélectionner un réseau' :
                        'Sélectionner un réseau'
                      }
                    </span>
                    <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45 transition-transform duration-200 group-hover:rotate-[-135deg]"></div>
                  </div>
                  <select
                    id="network"
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  >
                    <option value="">Sélectionner un réseau</option>
                    {socialNetworks?.map((network) => (
                      <option key={network.id} value={network.name}>
                        {network.display_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Section 2 : Type de contenu */}
          <div className="mb-3">
            <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
              <div className="space-y-1">
                <Label htmlFor="content_type" className="text-sm text-white">Type de contenu *</Label>
                <div className="relative group">
                  <div className="flex items-center justify-between p-3 border border-gray-600 rounded-lg text-white text-sm cursor-pointer hover:bg-gray-800/50 transition-all duration-200" style={{ backgroundColor: '#0f0f10' }}>
                    <span className="font-medium">
                      {formData.content_type === 'title' ? 'Titre' :
                       formData.content_type === 'subcategory' ? 'Sous-catégorie' :
                       formData.content_type === 'category' ? 'Catégorie' :
                       formData.content_type === 'challenge' ? 'Challenge' :
                       formData.content_type === 'source' ? 'Source' :
                       formData.content_type === 'account' ? 'Compte' :
                       formData.content_type === 'hooks' ? 'Hooks' : 'Sélectionner un type'}
                    </span>
                    <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45 transition-transform duration-200 group-hover:rotate-[-135deg]"></div>
                  </div>
                  <select
                    id="content_type"
                    value={formData.content_type}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                          content_type: e.target.value as 'category' | 'subcategory' | 'title' | 'challenge' | 'source' | 'account' | 'hooks' | 'blog' | 'article' | 'mots-cles' | 'exemple' | 'idee' | 'podcast',
                          category_id: '',
                          subcategory_id: '',
                          description: '',
                          url: '',
                          platform: '',
                          theme: ''
                        }));
                        setCategorySearch('');
                        setSubcategorySearch('');
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  >
                    <option value="title">Titre</option>
                    <option value="subcategory">Sous-catégorie</option>
                    <option value="category">Catégorie</option>
                    <option value="challenge">Challenge</option>
                    <option value="source">Source</option>
                    <option value="account">Compte</option>
                    <option value="hooks">Hooks</option>
                    <option value="blog">Blog</option>
                    <option value="article">Article</option>
                    <option value="mots-cles">Mots-clés</option>
                    <option value="exemple">Exemple</option>
                    <option value="idee">Idée</option>
                    <option value="podcast">Podcast</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 : Thème de contenu */}
          {formData.content_type === 'category' && (
            <div className="mb-3">
              <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
                <div className="space-y-1">
                  <Label htmlFor="theme" className="text-sm text-white">Thème de contenu *</Label>
                  <div className="relative group">
                    <div className="flex items-center justify-between p-3 border border-gray-600 rounded-lg text-white text-sm cursor-pointer hover:bg-gray-800/50 transition-all duration-200" style={{ backgroundColor: '#0f0f10' }}>
                      <span className="font-medium">
                        {formData.theme ? themes?.find(t => t.name === formData.theme)?.name : 'Sélectionnez un thème'}
                      </span>
                      <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45 transition-transform duration-200 group-hover:rotate-[-135deg]"></div>
                    </div>
                    <select
                      id="theme"
                      value={formData.theme}
                      onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                    >
                      <option value="">Sélectionnez un thème</option>
                      {themes?.map((theme) => (
                        <option key={theme.id} value={theme.name}>
                          {theme.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 4 : Titre */}
          <div className="mb-3">
            <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
              <div className="space-y-1">
                <Label htmlFor="title" className="text-sm text-white">{getTitleLabel()} *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={getTitlePlaceholder()}
                  className="text-sm border-gray-600 text-white placeholder-gray-400"
                  style={{ backgroundColor: '#0f0f10' }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 5 : Catégorie (si nécessaire) */}
          {shouldShowCategorySelection() && (
            <div className="mb-3">
              <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
                <div className="space-y-1">
                  <Label htmlFor="category" className="text-sm text-white">Catégorie *</Label>
                  <div className="relative" ref={categoryDropdownRef}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Rechercher une catégorie..."
                        value={categorySearch}
                        onChange={(e) => {
                          setCategorySearch(e.target.value);
                          setShowCategoryDropdown(true);
                        }}
                        onFocus={() => setShowCategoryDropdown(true)}
                        className="pl-8 pr-8 text-sm border-gray-600 text-white placeholder-gray-400"
                        style={{ backgroundColor: '#0f0f10' }}
                      />
                      {categorySearch && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-white"
                          onClick={() => {
                            setCategorySearch('');
                            setFormData(prev => ({ ...prev, category_id: '', subcategory_id: '' }));
                            setSubcategorySearch('');
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    {showCategoryDropdown && filteredCategories.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {filteredCategories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            className="w-full px-3 py-2 text-left hover:bg-gray-700 focus:bg-gray-700 focus:outline-none text-white text-sm"
                            onClick={() => handleCategorySelect(category)}
                          >
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-white">{category.name}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 6 : Sous-catégorie (si nécessaire) */}
          {shouldShowSubcategorySelection() && (
            <div className="mb-3">
              <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
                <div className="space-y-1">
                  <Label htmlFor="subcategory" className="text-sm text-white">Sous-catégorie *</Label>
                  <div className="relative" ref={subcategoryDropdownRef}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Rechercher une sous-catégorie..."
                        value={subcategorySearch}
                        onChange={(e) => {
                          setSubcategorySearch(e.target.value);
                          setShowSubcategoryDropdown(true);
                        }}
                        onFocus={() => setShowSubcategoryDropdown(true)}
                        className="pl-8 pr-8 text-sm border-gray-600 text-white placeholder-gray-400"
                        style={{ backgroundColor: '#0f0f10' }}
                      />
                      {subcategorySearch && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-white"
                          onClick={() => {
                            setSubcategorySearch('');
                            setFormData(prev => ({ ...prev, subcategory_id: '' }));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    {showSubcategoryDropdown && filteredSubcategories.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {filteredSubcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            className="w-full px-3 py-2 text-left hover:bg-gray-700 focus:bg-gray-700 focus:outline-none text-white text-sm"
                            onClick={() => handleSubcategorySelect(subcategory)}
                          >
                            <div>
                              <div className="font-medium text-white">{subcategory.name}</div>
                              {subcategory.description && (
                                <div className="text-xs text-gray-400 truncate">
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
              </div>
            </div>
          )}

          {/* Section 7 : Plateforme (pour les comptes) */}
          {formData.content_type === 'account' && (
            <div className="mb-3">
              <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
                <div className="space-y-1">
                  <Label htmlFor="platform" className="text-sm text-white">Plateforme *</Label>
                  <div className="relative group">
                    <div className="flex items-center justify-between p-3 border border-gray-600 rounded-lg text-white text-sm cursor-pointer hover:bg-gray-800/50 transition-all duration-200" style={{ backgroundColor: '#0f0f10' }}>
                      <span className="font-medium">
                        {formData.platform ? 
                          formData.platform.charAt(0).toUpperCase() + formData.platform.slice(1) : 
                          'Sélectionnez une plateforme'}
                      </span>
                      <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45 transition-transform duration-200 group-hover:rotate-[-135deg]"></div>
                    </div>
                    <select
                      id="platform"
                      value={formData.platform}
                      onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                    >
                      <option value="">Sélectionnez une plateforme</option>
                      <option value="tiktok">TikTok</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="twitter">Twitter/X</option>
                      <option value="facebook">Facebook</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitch">Twitch</option>
                      <option value="blog">Blog</option>
                      <option value="article">Article</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 8 : Description (pour les challenges) */}
          {formData.content_type === 'challenge' && (
            <div className="mb-3">
              <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
                <div className="space-y-1">
                  <Label htmlFor="description" className="text-sm text-white">Description du challenge *</Label>
                  <textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez votre challenge en détail..."
                    className="w-full p-2 border border-gray-600 rounded-md text-white min-h-[80px] resize-vertical text-sm placeholder-gray-400"
                    style={{ backgroundColor: '#0f0f10' }}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 9 : URL (pour les sources et comptes) */}
          {(formData.content_type === 'source' || formData.content_type === 'account') && (
            <div className="mb-3">
              <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
                <div className="space-y-1">
                  <Label htmlFor="url" className="text-sm text-white">
                    {formData.content_type === 'source' ? 'URL de la source' : 'URL du compte'} *
                  </Label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <Input
                      id="url"
                      type="url"
                      value={formData.url || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      placeholder={formData.content_type === 'source' ? 'https://example.com' : 'https://tiktok.com/@username'}
                      className="pl-8 text-sm border-gray-600 text-white placeholder-gray-400"
                      style={{ backgroundColor: '#0f0f10' }}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 10 : Soumission */}
          <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || 
                         !formData.title ||
                         !formData.content_type ||
                         (needsNetwork && !selectedNetwork) ||
                         (formData.content_type === 'subcategory' && !formData.category_id) ||
                         ((formData.content_type === 'title' || formData.content_type === 'account') && (!formData.category_id || !formData.subcategory_id)) ||
                         (formData.content_type === 'challenge' && !formData.description) ||
                         (formData.content_type === 'source' && !formData.url) ||
                         (formData.content_type === 'account' && (!formData.platform || !formData.url)) ||
                         (formData.content_type === 'category' && !formData.theme)}
              >
                {isSubmitting ? (
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
