import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Loader2, ArrowLeft, Search, X, Check, AlertTriangle, Eye, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';
import { usePendingPublish } from '@/hooks/usePendingPublish';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
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
  const { publishContent, isPublishing, publicationStatus } = usePendingPublish();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content_type: 'title', // 'category', 'subcategory', 'title'
    category_id: '',
    subcategory_id: '',
    description: '' // Added for challenges
  });
  // États pour les barres de recherche
  const [categorySearch, setCategorySearch] = useState('');
  const [subcategorySearch, setSubcategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
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
    if (formData.content_type === 'title' && (!formData.category_id || !formData.subcategory_id)) {
      toast({
        title: "Catégorie et sous-catégorie requises",
        description: "Veuillez sélectionner une catégorie et une sous-catégorie pour un titre",
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
        description: formData.content_type === 'challenge' ? formData.description : undefined
      });
      if (result) {
        toast({
          title: "Publication soumise !",
          description: "Votre contenu sera validé dans quelques secondes"
        });
        // Reset form seulement si la publication est réussie
        if (publicationStatus?.status === 'approved') {
          setFormData({
            title: '',
            content_type: 'title',
            category_id: '',
            subcategory_id: '',
            description: ''
          });
          setCategorySearch('');
          setSubcategorySearch('');
        }
      } else {
        throw new Error('Échec de la publication');
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/profile/publications')}
            className="flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Mes publications
        </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Contribuez à CréaTik</h2>
          <p className="text-muted-foreground">
            Partagez vos idées et enrichissez notre bibliothèque de contenu créatif
          </p>
        </div>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Publier du contenu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Suivi de vos publications
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Toutes vos publications apparaîtront dans "Mes publications" où vous pourrez suivre leur statut et les gérer.
                  </p>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type de contenu */}
              <div className="space-y-2">
                <Label htmlFor="content_type">Type de contenu *</Label>
                <select
                  id="content_type"
                  value={formData.content_type}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      content_type: e.target.value,
                      category_id: '', // Reset category when type changes
                      subcategory_id: '', // Reset subcategory when type changes
                      description: '' // Reset description when type changes
                    }));
                    setCategorySearch(''); // Reset search
                    setSubcategorySearch(''); // Reset search
                  }}
                  className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900"
                  required
                >
                  <option value="title">Titre</option>
                  <option value="subcategory">Sous-catégorie</option>
                  <option value="category">Catégorie</option>
                  <option value="challenge">Challenge</option>
                </select>
              </div>
              {/* Titre */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  {formData.content_type === 'category' ? 'Nom de la catégorie' : 
                   formData.content_type === 'subcategory' ? 'Nom de la sous-catégorie' : 
                   formData.content_type === 'challenge' ? 'Nom du challenge' :
                   'Titre'} *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={
                    formData.content_type === 'category' ? 'Entrez le nom de la catégorie' :
                    formData.content_type === 'subcategory' ? 'Entrez le nom de la sous-catégorie' :
                    formData.content_type === 'challenge' ? 'Entrez le nom de votre challenge' :
                    'Entrez le titre de votre contenu'
                  }
                  required
                />
              </div>
              {/* Description pour les challenges */}
              {formData.content_type === 'challenge' && (
                <div className="space-y-2">
                  <Label htmlFor="description">Description du challenge *</Label>
                  <textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez votre challenge en détail..."
                    className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-900 min-h-[100px] resize-vertical"
                    required
                  />
                </div>
              )}
              {/* Catégorie (pour sous-catégorie et titre) */}
              {(formData.content_type === 'subcategory' || formData.content_type === 'title') && (
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
              {/* Sous-catégorie (pour titre seulement) */}
              {formData.content_type === 'title' && formData.category_id && (
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
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || isPublishing || !formData.title || !formData.content_type || 
                         (formData.content_type === 'subcategory' && !formData.category_id) ||
                         (formData.content_type === 'title' && (!formData.category_id || !formData.subcategory_id)) ||
                         (formData.content_type === 'challenge' && !formData.description)}
              >
                {isSubmitting || isPublishing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {publicationStatus?.status === 'checking' ? 'Vérification en cours...' : 'Publication en cours...'}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Publier le contenu
                  </>
                )}
              </Button>
              {/* Afficher le statut de la publication */}
              {publicationStatus && (
                <div className={`mt-4 p-3 rounded-md ${
                  publicationStatus.status === 'approved' ? 'bg-green-50 text-green-700' :
                  publicationStatus.status === 'duplicate' ? 'bg-yellow-50 text-yellow-700' :
                  publicationStatus.status === 'rejected' ? 'bg-red-50 text-red-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {publicationStatus.status === 'checking' && <Loader2 className="h-4 w-4 animate-spin" />}
                      {publicationStatus.status === 'approved' && <Check className="h-4 w-4" />}
                      {publicationStatus.status === 'duplicate' && <AlertTriangle className="h-4 w-4" />}
                      {publicationStatus.status === 'rejected' && <X className="h-4 w-4" />}
                      <span className="text-sm font-medium">{publicationStatus.message}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/profile/publications')}
                      className="text-xs"
                    >
                      Voir mes publications
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </main>
      <Navigation />
    </div>
  );
};
export default Publish;
