import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Loader2, ArrowLeft, Search, X, Check, AlertTriangle, Eye, FileText, Link, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCategories } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';
import { useSubcategoriesLevel2 } from '@/hooks/useSubcategoriesLevel2';
import { useSubcategoryHierarchy } from '@/hooks/useSubcategoryHierarchy';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { useSocialNetworks } from '@/hooks/useSocialNetworks';
import { useThemes } from '@/hooks/useThemes';
import { useCreators, Creator } from '@/hooks/useCreators';

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

interface SubcategoryLevel2 {
  id: string;
  name: string;
  description: string;
  subcategory_id: string;
}

const Publish = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content_type: 'title' as 'category' | 'subcategory' | 'subcategory_level2' | 'title' | 'content' | 'source' | 'account' | 'hooks' | 'pseudo',
    category_id: '',
    subcategory_id: '',
    subcategory_level2_id: '',
    description: '', // Added for content
    url: '', // Added for sources and accounts
    platform: '', // Added for accounts
    theme: '' // Added for content theme
  });

  // États pour les barres de recherche
  const [categorySearch, setCategorySearch] = useState('');
  const [subcategorySearch, setSubcategorySearch] = useState('');
  const [subcategoryLevel2Search, setSubcategoryLevel2Search] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
  const [showSubcategoryLevel2Dropdown, setShowSubcategoryLevel2Dropdown] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const { data: socialNetworks } = useSocialNetworks();
  const { data: themes } = useThemes();
  const { data: subcategoriesLevel2 } = useSubcategoriesLevel2(formData.subcategory_id);
  const { data: subcategoryHierarchy } = useSubcategoryHierarchy();
  const { data: creators } = useCreators();
  
  // États pour le type "contenu" (taguer un créateur)
  const [wantsToTagCreator, setWantsToTagCreator] = useState<boolean | null>(null);
  const [creatorSearch, setCreatorSearch] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [showCreatorDropdown, setShowCreatorDropdown] = useState(false);

  // Refs pour les dropdowns
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const subcategoryDropdownRef = useRef<HTMLDivElement>(null);
  const creatorDropdownRef = useRef<HTMLDivElement>(null);

  // Récupérer les données
  const { data: categories } = useCategories();
  const { data: subcategories } = useSubcategories(formData.category_id);

  // Filtrer les catégories selon la recherche
  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(categorySearch.toLowerCase())
  ) || [];

  // Filtrer les sous-catégories selon la recherche et le type de contenu
  const filteredSubcategories = (() => {
    if (!subcategories) return [];
    
    let baseSubcategories = subcategories.filter(subcategory => 
      subcategory.name.toLowerCase().includes(subcategorySearch.toLowerCase()) &&
      subcategory.category_id === formData.category_id
    );
    
    // Si on publie une sous-catégorie de niveau 2, montrer toutes les sous-catégories
    // (le système activera automatiquement la fonctionnalité si nécessaire)
    // Note: On pourrait filtrer ici si on veut seulement montrer celles qui ont déjà la fonctionnalité
    // Mais pour l'instant, on permet la création automatique
    
    return baseSubcategories;
  })();

  // Filtrer les créateurs selon la recherche
  const filteredCreators = creators?.filter(creator =>
    creator.name.toLowerCase().includes(creatorSearch.toLowerCase()) ||
    (creator.display_name && creator.display_name.toLowerCase().includes(creatorSearch.toLowerCase()))
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
      if (creatorDropdownRef.current && !creatorDropdownRef.current.contains(event.target as Node)) {
        setShowCreatorDropdown(false);
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
    const needsNetwork = ['title', 'hooks', 'pseudo', 'content', 'account'].includes(formData.content_type);
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

    if (formData.content_type === 'subcategory_level2' && !formData.subcategory_id) {
      toast({
        title: "Sous-catégorie requise",
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

    // Validation conditionnelle pour les sous-catégories de niveau 2
    if ((formData.content_type === 'title' || formData.content_type === 'account' || formData.content_type === 'source' || formData.content_type === 'hooks') && formData.subcategory_id) {
      // Vérifier si la sous-catégorie a des sous-catégories de niveau 2
      const hasLevel2Subcategories = subcategoryHierarchy?.some(config => 
        config.subcategory_id === formData.subcategory_id && config.has_level2 === true
      );
      
      // Si la sous-catégorie a des sous-catégories de niveau 2, alors subcategory_level2_id est requis
      if (hasLevel2Subcategories && !formData.subcategory_level2_id) {
        toast({
          title: "Sous-catégorie de niveau 2 requise",
          description: "Cette sous-catégorie a des sous-catégories de niveau 2. Veuillez en sélectionner une.",
          variant: "destructive"
        });
        return;
      }
    }

    if (formData.content_type === 'content') {
      if (wantsToTagCreator === null) {
        toast({
          title: "Réponse requise",
          description: "Veuillez indiquer si vous souhaitez taguer un créateur",
          variant: "destructive"
        });
        return;
      }
      if (wantsToTagCreator === true && !selectedCreator) {
        toast({
          title: "Créateur requis",
          description: "Veuillez sélectionner un créateur",
          variant: "destructive"
        });
        return;
      }
      if (!formData.description) {
        toast({
          title: "Description requise",
          description: "Veuillez ajouter une description pour le contenu",
          variant: "destructive"
        });
        return;
      }
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

    // Fonction helper pour créer un seul élément
    const createSingleItem = async (itemName: string, index: number): Promise<string | null> => {
      if (formData.content_type === 'category') {
        const colors = ['primary', 'orange', 'green', 'pink', 'blue', 'purple', 'red', 'yellow', 'gray', 'indigo', 'teal', 'cyan', 'emerald', 'violet', 'amber', 'lime', 'rose', 'slate'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        const { data, error } = await supabase
          .from('categories')
          .insert({
            name: itemName,
            description: formData.description || 'Catégorie publiée',
            color: randomColor
          })
          .select()
          .single();
        
        if (error) throw error;
        return data.id;
      } else if (formData.content_type === 'subcategory') {
        const { data, error } = await supabase
          .from('subcategories')
          .insert({
            name: itemName,
            description: formData.description || 'Sous-catégorie publiée',
            category_id: formData.category_id
          })
          .select()
          .single();
        
        if (error) throw error;
        return data.id;
      } else if (formData.content_type === 'subcategory_level2') {
        const hasLevel2Config = subcategoryHierarchy?.some(config => 
          config.subcategory_id === formData.subcategory_id && config.has_level2 === true
        );
        
        if (!hasLevel2Config) {
          await supabase
            .from('subcategory_hierarchy_config')
            .upsert({
              subcategory_id: formData.subcategory_id,
              has_level2: true,
              created_at: new Date().toISOString()
            });
        }
        
        const { data, error } = await supabase
          .from('subcategories_level2')
          .insert({
            name: itemName,
            description: formData.description || 'Sous-catégorie niveau 2 publiée',
            subcategory_id: formData.subcategory_id
          })
          .select()
          .single();
        
        if (error) throw error;
        return data.id;
      } else if (formData.content_type === 'title') {
        const { data, error } = await supabase
          .from('content_titles')
          .insert({
            title: itemName,
            subcategory_id: formData.subcategory_id,
            subcategory_level2_id: formData.subcategory_level2_id || null,
            platform: selectedNetwork,
            type: 'title'
          })
          .select()
          .single();
        
        if (error) throw error;
        return data.id;
      } else if (formData.content_type === 'hooks') {
        const { data, error } = await supabase
          .from('content_titles')
          .insert({
            title: itemName,
            subcategory_id: formData.subcategory_id,
            subcategory_level2_id: formData.subcategory_level2_id || null,
            platform: selectedNetwork,
            type: 'hook'
          })
          .select()
          .single();
        
        if (error) throw error;
        return data.id;
      } else if (formData.content_type === 'account') {
        const { data, error } = await supabase
          .from('creators')
          .insert({
            name: itemName,
            display_name: itemName,
            bio: formData.description || 'Créateur publié',
            category: null,
            subcategory: null,
            category_id: formData.category_id || null,
            subcategory_id: formData.subcategory_id || null,
            avatar_url: null
          })
          .select()
          .single();
        
        if (error) throw error;
        
        // Ajouter le réseau social si fourni (seulement pour le premier créateur)
        if (formData.platform && formData.url && index === 0) {
          const socialNetwork = socialNetworks?.find(n => n.name.toLowerCase() === formData.platform.toLowerCase());
          if (socialNetwork) {
            await supabase
              .from('creator_social_networks')
              .insert({
                creator_id: data.id,
                social_network_id: socialNetwork.id,
                username: itemName,
                profile_url: formData.url,
                is_primary: true
              });
          }
        }
        
        return data.id;
      } else if (formData.content_type === 'pseudo') {
        // Pour les pseudos, on utilise selectedNetwork comme social_network_id
        const socialNetwork = socialNetworks?.find(n => n.name === selectedNetwork || n.id === selectedNetwork);
        if (!socialNetwork) {
          throw new Error('Réseau social non trouvé');
        }
        
        const { data, error } = await supabase
          .from('username_ideas')
          .insert({
            pseudo: itemName,
            social_network_id: socialNetwork.id,
            user_id: user.id
          })
          .select()
          .single();
        
        if (error) throw error;
        return data.id;
      } else if (formData.content_type === 'source') {
        const { data, error } = await supabase
          .from('sources')
          .insert({
            name: itemName,
            description: formData.description || 'Source publiée',
            url: formData.url || ''
          })
          .select()
          .single();
        
        if (error) throw error;
        return data.id;
      }
      return null;
    };

    try {
      console.log('=== TENTATIVE DE PUBLICATION ===');
      console.log('Type de contenu:', formData.content_type);
      
      // Parser les éléments multiples
      const items = parseMultipleItems(formData.title);
      const maxItems = 10;
      
      // Validation : maximum 10 éléments
      if (items.length > maxItems) {
        toast({
          title: "Trop d'éléments",
          description: `Vous ne pouvez publier que ${maxItems} éléments maximum à la fois.`,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Vérifier les doublons pour chaque élément
      const supportsMultiple = ['title', 'category', 'subcategory', 'subcategory_level2', 'account', 'hooks', 'source', 'pseudo'].includes(formData.content_type);
      if (supportsMultiple && items.length > 1) {
        for (const item of items) {
          const isDuplicate = await checkDuplicate(
            formData.content_type,
            item,
            formData.category_id,
            formData.subcategory_id
          );
          if (isDuplicate) {
            toast({
              title: "Doublon détecté",
              description: `"${item}" existe déjà. Veuillez le retirer ou le modifier.`,
              variant: "destructive"
            });
            setIsSubmitting(false);
            return;
          }
        }
      }
      
      // Publication directe selon le type de contenu
      let createdItemIds: string[] = [];
      let createdItemId = null;
      
      // Si plusieurs éléments, créer chacun d'eux
      if (supportsMultiple && items.length > 1) {
        console.log(`Publication de ${items.length} éléments...`);
        
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          console.log(`Publication élément ${i + 1}/${items.length}: "${item}"`);
          
          const itemId = await createSingleItem(item, i);
          if (itemId) {
            createdItemIds.push(itemId);
          } else {
            // Si une erreur survient, arrêter tout
            throw new Error(`Erreur lors de la création de l'élément "${item}"`);
          }
        }
        
        // Utiliser le premier ID créé pour user_publications
        createdItemId = createdItemIds[0];
        
        toast({
          title: "Publication réussie",
          description: `${items.length} ${formData.content_type === 'title' ? 'titres' : formData.content_type === 'category' ? 'catégories' : formData.content_type === 'subcategory' ? 'sous-catégories' : formData.content_type === 'subcategory_level2' ? 'sous-catégories niveau 2' : formData.content_type === 'account' ? 'créateurs' : formData.content_type === 'hooks' ? 'hooks' : 'sources'} créés avec succès.`
        });
      } else {
        // Publication d'un seul élément (logique existante)
      
      if (formData.content_type === 'category') {
        console.log('Publication catégorie...');
        // Couleurs valides pour les catégories (mises à jour)
        const colors = ['primary', 'orange', 'green', 'pink', 'blue', 'purple', 'red', 'yellow', 'gray', 'indigo', 'teal', 'cyan', 'emerald', 'violet', 'amber', 'lime', 'rose', 'slate'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        console.log('Couleur sélectionnée:', randomColor);
        
        const { data: categoryData, error } = await supabase
          .from('categories')
          .insert({
            name: formData.title,
            description: formData.description || 'Catégorie publiée',
            color: randomColor
          })
          .select()
          .single();
        
        if (error) {
          console.error('Erreur catégorie:', error);
          console.error('Code d\'erreur:', error.code);
          console.error('Message d\'erreur:', error.message);
          console.error('Détails:', error.details);
          throw error;
        }
        
        createdItemId = categoryData.id;
        console.log('Catégorie publiée avec succès, ID:', createdItemId);
        toast({
          title: "Catégorie publiée"
        });
      } else if (formData.content_type === 'subcategory') {
        console.log('Publication sous-catégorie...');
        const { data: subcategoryData, error } = await supabase
          .from('subcategories')
          .insert({
            name: formData.title,
            description: formData.description || 'Sous-catégorie publiée',
            category_id: formData.category_id
          })
          .select()
          .single();
        
        if (error) {
          console.error('Erreur sous-catégorie:', error);
          throw error;
        }
        
        createdItemId = subcategoryData.id;
        console.log('Sous-catégorie publiée avec succès, ID:', createdItemId);
        toast({
          title: "Sous-catégorie publiée"
        });
      } else if (formData.content_type === 'subcategory_level2') {
        console.log('Publication sous-catégorie niveau 2...');
        
        // Vérifier si la sous-catégorie parent a déjà des sous-catégories de niveau 2
        const hasLevel2Config = subcategoryHierarchy?.some(config => 
          config.subcategory_id === formData.subcategory_id && config.has_level2 === true
        );
        
        // Si la sous-catégorie n'a pas de configuration pour les sous-catégories de niveau 2,
        // l'activer automatiquement
        if (!hasLevel2Config) {
          console.log('Activation automatique des sous-catégories de niveau 2 pour cette sous-catégorie...');
          
          const { error: configError } = await supabase
            .from('subcategory_hierarchy_config')
            .upsert({
              subcategory_id: formData.subcategory_id,
              has_level2: true,
              created_at: new Date().toISOString()
            });
          
          if (configError) {
            console.error('Erreur lors de l\'activation des sous-catégories de niveau 2:', configError);
            // On continue quand même la création
          } else {
            console.log('Configuration des sous-catégories de niveau 2 activée avec succès');
          }
        }
        
        const { data: subcategoryLevel2Data, error } = await supabase
          .from('subcategories_level2')
          .insert({
            name: formData.title,
            description: formData.description || 'Sous-catégorie niveau 2 publiée',
            subcategory_id: formData.subcategory_id
          })
          .select()
          .single();
        
        if (error) {
          console.error('Erreur sous-catégorie niveau 2:', error);
          throw error;
        }
        
        createdItemId = subcategoryLevel2Data.id;
        console.log('Sous-catégorie niveau 2 publiée avec succès, ID:', createdItemId);
        toast({
          title: "Sous-catégorie niveau 2 publiée",
          description: "La page des sous-catégories de niveau 2 a été automatiquement activée pour cette sous-catégorie"
        });
      } else if (formData.content_type === 'title') {
        console.log('Publication titre...');
        const { data: titleData, error } = await supabase
          .from('content_titles')
          .insert({
            title: formData.title,
            subcategory_id: formData.subcategory_id,
            subcategory_level2_id: formData.subcategory_level2_id || null,
            platform: selectedNetwork,
            type: 'title'
          })
          .select()
          .single();
        
        if (error) {
          console.error('Erreur titre:', error);
          throw error;
        }
        
        createdItemId = titleData.id;
        console.log('Titre publié avec succès, ID:', createdItemId);
        toast({
          title: "Titre publié"
        });
      } else if (formData.content_type === 'content') {
        console.log('Publication contenu...');
        const { data: challengeData, error } = await supabase
          .from('challenges')
          .insert({
            title: formData.title,
            description: formData.description,
            category: 'Communauté',
            challenge_type: 'content',
            platform: selectedNetwork,
            points: 50,
            difficulty: 'medium',
            duration_days: 1,
            is_daily: false,
            is_active: true
          })
          .select()
          .single();
        
        if (error) {
          console.error('Erreur contenu:', error);
          throw error;
        }
        
        createdItemId = challengeData.id;
        console.log('Contenu publié avec succès, ID:', createdItemId);
        
        // Si un créateur a été sélectionné, créer l'entrée dans creator_challenges
        if (selectedCreator && wantsToTagCreator === true) {
          console.log('Ajout du créateur au challenge...', selectedCreator.id);
          const { error: creatorChallengeError } = await supabase
            .from('creator_challenges')
            .insert({
              challenge_id: createdItemId,
              creator_id: selectedCreator.id,
              user_id: user.id,
              status: 'active'
            });
          
          if (creatorChallengeError) {
            console.error('Erreur lors de l\'ajout du créateur au challenge:', creatorChallengeError);
            // On continue quand même, ce n'est pas bloquant
            toast({
              title: "Contenu publié",
              description: "Attention: le créateur n'a pas pu être associé au challenge",
              variant: "default"
            });
          } else {
            console.log('Créateur ajouté au challenge avec succès');
            toast({
              title: "Contenu publié",
              description: `Le créateur ${selectedCreator.display_name || selectedCreator.name} a été associé au challenge`
            });
          }
        } else {
        toast({
          title: "Contenu publié"
        });
        }
      } else if (formData.content_type === 'source') {
        console.log('Publication source...');
        const { data: sourceData, error } = await supabase
          .from('sources')
          .insert({
            name: formData.title,
            description: formData.description || 'Source publiée',
            url: formData.url
          })
          .select()
          .single();
        
        if (error) {
          console.error('Erreur source:', error);
          throw error;
        }
        
        createdItemId = sourceData.id;
        console.log('Source publiée avec succès, ID:', createdItemId);
        toast({
          title: "Source publiée"
        });
      } else if (formData.content_type === 'account') {
        console.log('Publication compte...');
        // Créer d'abord un challenge pour le compte
        const { data: challengeData, error: challengeError } = await supabase
          .from('challenges')
          .insert({
            title: formData.title,
            description: formData.description || 'Compte publié',
            category: 'Communauté',
            challenge_type: 'account',
            platform: selectedNetwork,
            points: 50,
            difficulty: 'medium',
            duration_days: 1,
            is_daily: false,
            is_active: true
          })
          .select()
          .single();
        
        if (challengeError) {
          console.error('Erreur challenge compte:', challengeError);
          throw challengeError;
        }
        
        createdItemId = challengeData.id;
        console.log('Challenge compte publié avec succès, ID:', createdItemId);
        
        // Créer également un créateur si nécessaire
        if (formData.category_id && formData.subcategory_id) {
          const { data: creatorData, error: creatorError } = await supabase
            .from('creators')
            .insert({
              name: formData.title,
              display_name: formData.title,
              bio: formData.description || 'Créateur publié',
              category: null,
              subcategory: null,
              category_id: formData.category_id || null,
              subcategory_id: formData.subcategory_id || null,
              avatar_url: null
            })
            .select()
            .single();
          
          if (!creatorError && creatorData) {
            // Si une plateforme et une URL sont fournies, créer l'entrée dans creator_social_networks
            if (selectedNetwork && formData.url) {
              const socialNetwork = socialNetworks?.find(n => n.name === selectedNetwork || n.id === selectedNetwork);
              if (socialNetwork) {
                const { error: socialNetworkError } = await supabase
                  .from('creator_social_networks')
                  .insert({
                    creator_id: creatorData.id,
                    username: formData.title,
                    profile_url: formData.url,
                    social_network_id: socialNetwork.id,
                    is_primary: true
                  });
                
                if (socialNetworkError) {
                  console.error('Erreur lors de l\'ajout du réseau social:', socialNetworkError);
                  // On continue quand même, ce n'est pas bloquant
                }
              }
            }
          }
        }
        
        toast({
          title: "Compte publié"
        });
      } else if (formData.content_type === 'hooks') {
        console.log('Publication hook...');
        console.log('Subcategory ID:', formData.subcategory_id);
        console.log('Subcategory Level 2 ID:', formData.subcategory_level2_id);
        const { data: hookData, error } = await supabase
          .from('content_titles')
          .insert({
            title: formData.title,
            subcategory_id: formData.subcategory_id,
            subcategory_level2_id: formData.subcategory_level2_id || null,
            platform: selectedNetwork,
            type: 'hook'
          })
          .select()
          .single();
        
        if (error) {
          console.error('Erreur hook:', error);
          throw error;
        }
        
        createdItemId = hookData.id;
        console.log('Hook publié avec succès, ID:', createdItemId);
        toast({
          title: "Hook publié"
        });
      } else if (formData.content_type === 'pseudo') {
        console.log('Publication pseudo...');
        const socialNetwork = socialNetworks?.find(n => n.name === selectedNetwork || n.id === selectedNetwork);
        if (!socialNetwork) {
          toast({
            title: "Réseau social non trouvé",
            variant: "destructive"
          });
          throw new Error('Réseau social non trouvé');
        }
        
        const { data: pseudoData, error } = await supabase
          .from('username_ideas')
          .insert({
            pseudo: formData.title,
            social_network_id: socialNetwork.id,
            user_id: user.id
          })
          .select()
          .single();
        
        if (error) {
          console.error('Erreur pseudo:', error);
          throw error;
        }
        
        createdItemId = pseudoData.id;
        console.log('Pseudo publié avec succès, ID:', createdItemId);
        toast({
          title: "Pseudo publié"
        });
      }
      }

      console.log('=== PUBLICATION RÉUSSIE ===');

      // AJOUTER LA PUBLICATION DANS USER_PUBLICATIONS
      try {
        console.log('=== AJOUT DANS USER_PUBLICATIONS ===');
        console.log('User ID:', user.id);
        console.log('Content Type:', formData.content_type);
        console.log('Title:', formData.title);
        console.log('Description:', formData.description);
        console.log('Created Item ID:', createdItemId);
        console.log('Category ID:', formData.category_id);
        console.log('Subcategory ID:', formData.subcategory_id);
        console.log('Platform:', selectedNetwork || formData.platform);
        console.log('URL:', formData.url);
        
        // Déterminer les IDs à utiliser selon le type de contenu
        let categoryId = null;
        let subcategoryId = null;
        let subcategoryLevel2Id = null;
        
        if (formData.content_type === 'category') {
          categoryId = createdItemId;
        } else if (formData.content_type === 'subcategory') {
          subcategoryId = createdItemId;
          categoryId = formData.category_id;
        } else if (formData.content_type === 'subcategory_level2') {
          subcategoryLevel2Id = createdItemId;
          subcategoryId = formData.subcategory_id;
          categoryId = formData.category_id;
        } else if (formData.content_type === 'title' || formData.content_type === 'hooks') {
          subcategoryId = formData.subcategory_id;
          subcategoryLevel2Id = formData.subcategory_level2_id;
          categoryId = formData.category_id;
        } else if (formData.content_type === 'account') {
          subcategoryId = formData.subcategory_id;
          subcategoryLevel2Id = formData.subcategory_level2_id;
          categoryId = formData.category_id;
        }
        
        const publicationData = {
          user_id: user.id,
          content_type: formData.content_type,
          title: formData.title,
          description: formData.description,
          category_id: categoryId,
          subcategory_id: subcategoryId,
          subcategory_level2_id: subcategoryLevel2Id || null,
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
        subcategory_level2_id: '',
        description: '',
        url: '',
        platform: '',
        theme: ''
      });
      setSelectedNetwork('');
      setWantsToTagCreator(null);
      setSelectedCreator(null);
      setCreatorSearch('');

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
      subcategory_id: subcategory.id,
      subcategory_level2_id: ''
    }));
    setSubcategorySearch(subcategory.name);
    setShowSubcategoryDropdown(false);
  };

  const handleSubcategoryLevel2Select = (subcategoryLevel2: SubcategoryLevel2) => {
    setFormData(prev => ({
      ...prev,
      subcategory_level2_id: subcategoryLevel2.id
    }));
    setSubcategoryLevel2Search(subcategoryLevel2.name);
    setShowSubcategoryLevel2Dropdown(false);
  };

  // Fonction pour obtenir le label du titre selon le type ET le réseau
  const getTitleLabel = () => {
    switch (formData.content_type) {
      case 'category': return 'Nom de la catégorie';
      case 'subcategory': return 'Nom de la sous-catégorie';
      case 'subcategory_level2': return 'Nom de la sous-catégorie de niveau 2';
      case 'content': return 'Nom du contenu';
      case 'source': return 'Titre de la source';
      case 'account': return 'Nom du créateur';
      case 'hooks': return 'Hook vidéo';
      case 'pseudo': return 'Pseudo / Nom d\'utilisateur';
      default: return 'Titre';
    }
  };

  // Fonction pour obtenir le placeholder du titre selon le type ET le réseau
  const getTitlePlaceholder = () => {
    switch (formData.content_type) {
      case 'category': return 'Entrez le nom de la catégorie';
      case 'subcategory': return 'Entrez le nom de la sous-catégorie';
      case 'subcategory_level2': return 'Entrez le nom de la sous-catégorie de niveau 2';
      case 'content': return 'Entrez le nom de votre contenu';
      case 'source': return 'Entrez le titre de la source (ex: "TikTok", "Instagram", "YouTube")';
      case 'account': return 'Entrez le nom du créateur';
      case 'hooks': return 'Entrez votre hook pour captiver l\'audience';
      case 'pseudo': return 'Entrez le pseudo / nom d\'utilisateur';
      default: return 'Entrez le titre de votre contenu';
    }
  };

  // Fonction pour déterminer si on doit afficher la sélection de catégorie
  const shouldShowCategorySelection = () => {
    return ['subcategory', 'subcategory_level2', 'title', 'source', 'account', 'hooks'].includes(formData.content_type);
  };

  // Fonction pour déterminer si on doit afficher la sélection de sous-catégorie
  const shouldShowSubcategorySelection = () => {
    return ['subcategory_level2', 'title', 'source', 'account', 'hooks'].includes(formData.content_type) && formData.category_id;
  };

  // Fonction pour filtrer les sous-catégories qui ont des sous-catégories de niveau 2
  const getSubcategoriesWithLevel2 = () => {
    if (!subcategories || !subcategoryHierarchy) return [];
    
    return subcategories.filter(subcategory => {
      // Vérifier si cette sous-catégorie a des sous-catégories de niveau 2
      return subcategoryHierarchy.some(config => 
        config.subcategory_id === subcategory.id && config.has_level2 === true
      );
    });
  };

  // Fonction pour déterminer si on doit afficher la sélection de sous-catégorie de niveau 2
  const shouldShowSubcategoryLevel2Selection = () => {
    if (!['title', 'source', 'account', 'hooks'].includes(formData.content_type) || !formData.subcategory_id) {
      return false;
    }
    
    // Vérifier si la sous-catégorie a des sous-catégories de niveau 2
    const hasLevel2Subcategories = subcategoryHierarchy?.some(config => 
      config.subcategory_id === formData.subcategory_id && config.has_level2 === true
    );
    
    return hasLevel2Subcategories;
  };

  // Fonction pour déterminer si le réseau social est requis
  const needsNetwork = ['title', 'hooks', 'pseudo', 'content', 'account'].includes(formData.content_type);

  // Fonction pour parser les éléments séparés par point-virgule
  const parseMultipleItems = (text: string): string[] => {
    if (!text || !text.includes(';')) {
      return [text.trim()];
    }
    return text
      .split(';')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  // Fonction pour vérifier les doublons
  const checkDuplicate = async (contentType: string, itemName: string, categoryId?: string, subcategoryId?: string): Promise<boolean> => {
    try {
      if (contentType === 'category') {
        const { data, error } = await supabase
          .from('categories')
          .select('id')
          .ilike('name', itemName)
          .limit(1);
        return !error && (data?.length || 0) > 0;
      } else if (contentType === 'subcategory') {
        const { data, error } = await supabase
          .from('subcategories')
          .select('id')
          .ilike('name', itemName)
          .eq('category_id', categoryId)
          .limit(1);
        return !error && (data?.length || 0) > 0;
      } else if (contentType === 'subcategory_level2') {
        const { data, error } = await supabase
          .from('subcategories_level2')
          .select('id')
          .ilike('name', itemName)
          .eq('subcategory_id', subcategoryId)
          .limit(1);
        return !error && (data?.length || 0) > 0;
      } else if (contentType === 'title') {
        const { data, error } = await supabase
          .from('content_titles')
          .select('id')
          .ilike('title', itemName)
          .eq('subcategory_id', subcategoryId)
          .limit(1);
        return !error && (data?.length || 0) > 0;
      } else if (contentType === 'hooks') {
        const { data, error } = await supabase
          .from('content_titles')
          .select('id')
          .ilike('title', itemName)
          .eq('subcategory_id', subcategoryId)
          .eq('type', 'hook')
          .limit(1);
        return !error && (data?.length || 0) > 0;
      } else if (contentType === 'account') {
        const { data, error } = await supabase
          .from('creators')
          .select('id')
          .ilike('name', itemName)
          .eq('subcategory_id', subcategoryId)
          .limit(1);
        return !error && (data?.length || 0) > 0;
      } else if (contentType === 'pseudo') {
        // Pour les pseudos, on vérifie par réseau social
        const socialNetwork = socialNetworks?.find(n => n.name === selectedNetwork || n.id === selectedNetwork);
        if (!socialNetwork) return false;
        
        const { data, error } = await supabase
          .from('username_ideas')
          .select('id')
          .ilike('pseudo', itemName)
          .eq('social_network_id', socialNetwork.id)
          .limit(1);
        return !error && (data?.length || 0) > 0;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification des doublons:', error);
      return false;
    }
  };

  // Fonction pour obtenir le message d'aide selon le type
  const getHelpMessage = (): string => {
    const supportsMultiple = ['title', 'category', 'subcategory', 'subcategory_level2', 'account', 'hooks', 'source', 'pseudo'].includes(formData.content_type);
    if (!supportsMultiple) return '';
    
    const maxItems = 10;
    let message = `💡 Vous pouvez ajouter jusqu'à ${maxItems} ${formData.content_type === 'title' ? 'titres' : formData.content_type === 'category' ? 'catégories' : formData.content_type === 'subcategory' ? 'sous-catégories' : formData.content_type === 'subcategory_level2' ? 'sous-catégories niveau 2' : formData.content_type === 'account' ? 'créateurs' : formData.content_type === 'hooks' ? 'hooks' : formData.content_type === 'pseudo' ? 'pseudos' : 'sources'} en même temps.`;
    message += ` Séparez-les par un point-virgule (;).`;
    
    if (formData.content_type === 'subcategory') {
      message += ` Toutes les sous-catégories seront liées à la même catégorie sélectionnée.`;
    } else if (formData.content_type === 'subcategory_level2') {
      message += ` Toutes les sous-catégories niveau 2 seront liées à la même sous-catégorie parent sélectionnée.`;
    } else if (formData.content_type === 'pseudo') {
      message += ` Tous les pseudos seront enregistrés sur le même réseau social sélectionné.`;
    }
    
    return message;
  };

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
          
          {/* Section 1 : Type de contenu */}
          <div className="mb-3">
            <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
              <div className="space-y-1">
                <Label htmlFor="content_type" className="text-sm text-white">Type de contenu *</Label>
                <div className="relative group">
                  <div className="flex items-center justify-between p-3 border border-gray-600 rounded-lg text-white text-sm cursor-pointer hover:bg-gray-800/50 transition-all duration-200" style={{ backgroundColor: '#0f0f10' }}>
                    <span className="font-medium">
                      {formData.content_type === 'title' ? 'Titre' :
                       formData.content_type === 'subcategory' ? 'Sous-catégorie' :
                       formData.content_type === 'subcategory_level2' ? 'Sous-catégorie niveau 2' :
                       formData.content_type === 'category' ? 'Catégorie' :
                       formData.content_type === 'content' ? 'Contenu' :
                       formData.content_type === 'source' ? 'Source' :
                       formData.content_type === 'account' ? 'Compte' :
                       formData.content_type === 'hooks' ? 'Hooks' :
                       formData.content_type === 'pseudo' ? 'Pseudo' : 'Sélectionner un type'}
                    </span>
                    <div className="w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45 transition-transform duration-200 group-hover:rotate-[-135deg]"></div>
                  </div>
                  <select
                    id="content_type"
                    value={formData.content_type}
                    onChange={(e) => {
                      const newContentType = e.target.value as 'category' | 'subcategory' | 'title' | 'content' | 'source' | 'account' | 'hooks' | 'pseudo';
                      setFormData(prev => ({
                        ...prev,
                        content_type: newContentType,
                          category_id: '',
                          subcategory_id: '',
                          description: '',
                          url: '',
                          platform: '',
                          theme: ''
                        }));
                        setCategorySearch('');
                        setSubcategorySearch('');
                      // Réinitialiser les états pour "contenu"
                      if (newContentType !== 'content') {
                        setWantsToTagCreator(null);
                        setSelectedCreator(null);
                        setCreatorSearch('');
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                  >
                    <option value="title">Titre</option>
                    <option value="subcategory">Sous-catégorie</option>
                    <option value="subcategory_level2">Sous-catégorie niveau 2</option>
                    <option value="category">Catégorie</option>
                    <option value="content">Contenu</option>
                    <option value="account">Compte</option>
                    <option value="source">Source</option>
                    <option value="hooks">Hooks</option>
                    <option value="pseudo">Pseudo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 : Taguer un créateur - seulement pour "contenu" */}
          {formData.content_type === 'content' && (
            <div className="mb-3">
              <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
                <div className="space-y-1">
                  <Label className="text-sm text-white">Voulez-vous taguer un créateur ?</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={wantsToTagCreator === true ? 'default' : 'outline'}
                      onClick={() => {
                        setWantsToTagCreator(true);
                        setSelectedCreator(null);
                        setCreatorSearch('');
                      }}
                      className="flex-1"
                    >
                      Oui
                    </Button>
                    <Button
                      type="button"
                      variant={wantsToTagCreator === false ? 'default' : 'outline'}
                      onClick={() => {
                        setWantsToTagCreator(false);
                        setSelectedCreator(null);
                        setCreatorSearch('');
                        setShowCreatorDropdown(false);
                      }}
                      className="flex-1"
                    >
                      Non
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3 : Recherche de créateur - seulement si "contenu" > "oui" */}
          {formData.content_type === 'content' && wantsToTagCreator === true && (
            <div className="mb-3">
              <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
                <div className="space-y-1">
                  <Label htmlFor="creator" className="text-sm text-white">Rechercher un créateur *</Label>
                  <div className="relative" ref={creatorDropdownRef}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Rechercher un créateur..."
                        value={creatorSearch}
                        onChange={(e) => {
                          setCreatorSearch(e.target.value);
                          setShowCreatorDropdown(true);
                        }}
                        onFocus={() => setShowCreatorDropdown(true)}
                        className="pl-8 pr-8 text-sm border-gray-600 text-white placeholder-gray-400"
                        style={{ backgroundColor: '#0f0f10' }}
                      />
                      {creatorSearch && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-white"
                          onClick={() => {
                            setCreatorSearch('');
                            setSelectedCreator(null);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    {showCreatorDropdown && filteredCreators.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {filteredCreators.map((creator) => (
                          <button
                            key={creator.id}
                            type="button"
                            className="w-full px-3 py-2 text-left hover:bg-gray-700 focus:bg-gray-700 focus:outline-none text-white text-sm"
                            onClick={() => {
                              setSelectedCreator(creator);
                              setCreatorSearch(creator.display_name || creator.name);
                              setShowCreatorDropdown(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {(creator as any).avatar_url && (
                                <img 
                                  src={(creator as any).avatar_url} 
                                  alt={creator.name}
                                  className="w-6 h-6 rounded-full"
                                />
                              )}
                              <div>
                                <div className="font-medium text-white">{creator.display_name || creator.name}</div>
                                {creator.bio && (
                                  <div className="text-xs text-gray-400 truncate">
                                    {creator.bio}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    {selectedCreator && (
                      <div className="mt-2 p-2 bg-gray-800 rounded-md flex items-center gap-2">
                        {(selectedCreator as any).avatar_url && (
                          <img 
                            src={(selectedCreator as any).avatar_url} 
                            alt={selectedCreator.name}
                            className="w-8 h-8 rounded-full"
                          />
                        )}
                        <span className="text-white text-sm">{selectedCreator.display_name || selectedCreator.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="ml-auto h-6 w-6 text-gray-400 hover:text-white"
                          onClick={() => {
                            setSelectedCreator(null);
                            setCreatorSearch('');
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 5 : Réseau social - seulement pour les types qui en ont besoin */}
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

          {/* Section 6 : Thème de contenu */}
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

          {/* Section 7 : Titre */}
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
                {getHelpMessage() && (
                  <p className="text-xs text-gray-400 mt-1.5">
                    {getHelpMessage()}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 8 : Catégorie (si nécessaire) */}
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

          {/* Section 9 : Sous-catégorie (si nécessaire) */}
          {shouldShowSubcategorySelection() && (
            <div className="mb-3">
              <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
                <div className="space-y-1">
                  <Label htmlFor="subcategory" className="text-sm text-white">
                    Sous-catégorie *
                    {formData.content_type === 'subcategory_level2' && (
                      <span className="text-xs text-gray-400 ml-2">
                        (Le système activera automatiquement les sous-catégories de niveau 2 si nécessaire)
                      </span>
                    )}
                  </Label>
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
                    {showSubcategoryDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {filteredSubcategories.length > 0 ? (
                          filteredSubcategories.map((subcategory) => (
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
                          ))
                        ) : formData.content_type === 'subcategory_level2' ? (
                          <div className="px-3 py-2 text-sm text-gray-400">
                            <div className="mb-2">Aucune sous-catégorie trouvée pour cette recherche.</div>
                            <div className="text-xs">
                              💡 Vous pouvez publier une sous-catégorie de niveau 2 et le système activera automatiquement cette fonctionnalité pour la sous-catégorie parent.
                            </div>
                          </div>
                        ) : (
                          <div className="px-3 py-2 text-sm text-gray-400">
                            Aucune sous-catégorie trouvée.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 10 : Sous-catégorie niveau 2 (si nécessaire) */}
          {shouldShowSubcategoryLevel2Selection() && (
            <div className="mb-3">
              <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
                <div className="space-y-1">
                  <Label htmlFor="subcategory_level2" className="text-sm text-white">Sous-catégorie niveau 2 *</Label>
                  <div className="relative">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Rechercher une sous-catégorie niveau 2..."
                        value={subcategoryLevel2Search}
                        onChange={(e) => {
                          setSubcategoryLevel2Search(e.target.value);
                          setShowSubcategoryLevel2Dropdown(true);
                        }}
                        onFocus={() => setShowSubcategoryLevel2Dropdown(true)}
                        className="pl-8 pr-8 text-sm border-gray-600 text-white placeholder-gray-400"
                        style={{ backgroundColor: '#0f0f10' }}
                      />
                      {subcategoryLevel2Search && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-white"
                          onClick={() => {
                            setSubcategoryLevel2Search('');
                            setFormData(prev => ({ ...prev, subcategory_level2_id: '' }));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    {showSubcategoryLevel2Dropdown && subcategoriesLevel2 && subcategoriesLevel2.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                        {subcategoriesLevel2
                          .filter(subcategory => 
                            subcategory.name.toLowerCase().includes(subcategoryLevel2Search.toLowerCase())
                          )
                          .map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            className="w-full px-3 py-2 text-left hover:bg-gray-700 focus:bg-gray-700 focus:outline-none text-white text-sm"
                            onClick={() => handleSubcategoryLevel2Select(subcategory)}
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

          {/* Section 11 : Plateforme (pour les créateurs) */}
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

          {/* Section 4 : Description (pour les contenus) */}
          {formData.content_type === 'content' && (
            <div className="mb-3">
              <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
                <div className="space-y-1">
                  <Label htmlFor="description" className="text-sm text-white">Description du contenu *</Label>
                  <textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez votre contenu en détail..."
                    className="w-full p-2 border border-gray-600 rounded-md text-white min-h-[80px] resize-vertical text-sm placeholder-gray-400"
                    style={{ backgroundColor: '#0f0f10' }}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 13 : URL (pour les sources et créateurs) */}
          {(formData.content_type === 'source' || formData.content_type === 'account') && (
            <div className="mb-3">
              <div className="rounded-lg border border-gray-700 p-3" style={{ backgroundColor: '#0f0f10' }}>
                <div className="space-y-1">
                  <Label htmlFor="url" className="text-sm text-white">
                    {formData.content_type === 'source' ? 'URL de la source' : 'URL du créateur'} *
                  </Label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <Input
                      id="url"
                      type="url"
                      value={formData.url || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      placeholder={formData.content_type === 'source' ? 'https://example.com' : 'https://tiktok.com/@createur'}
                      className="pl-8 text-sm border-gray-600 text-white placeholder-gray-400"
                      style={{ backgroundColor: '#0f0f10' }}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 14 : Soumission */}
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
                         (formData.content_type === 'content' && (wantsToTagCreator === null || (wantsToTagCreator === true && !selectedCreator) || !formData.description)) ||
                         (formData.content_type === 'source' && !formData.url) ||
                         (formData.content_type === 'account' && !formData.url) ||
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
