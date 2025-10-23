import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Lightbulb, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface CreateAccountFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (accountData: AccountFormData) => void;
}

interface AccountFormData {
  name: string;
  theme: string;
  network: string;
  category: string;
  subcategory: string;
  subSubcategory?: string;
  objective: string;
  subject: string;
  keywords: string[];
  values: string[];
  description: string;
}

const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [formData, setFormData] = useState<AccountFormData>({
    name: '',
    theme: '',
    network: '',
    category: '',
    subcategory: '',
    subSubcategory: '',
    objective: '',
    subject: '',
    keywords: [],
    values: [],
    description: ''
  });

  const [currentKeyword, setCurrentKeyword] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  const themes = [
    'Mode & Beauté',
    'Technologie',
    'Voyage',
    'Cuisine',
    'Fitness & Sport',
    'Éducation',
    'Business',
    'Lifestyle',
    'Art & Créativité',
    'Gaming',
    'Parentalité',
    'Finance'
  ];

  const networks = [
    'Instagram',
    'TikTok',
    'YouTube',
    'Twitter/X',
    'LinkedIn',
    'Facebook',
    'Pinterest',
    'Snapchat'
  ];

  const categories = {
    'Mode & Beauté': ['Mode', 'Maquillage', 'Skincare', 'Cheveux', 'Nails'],
    'Technologie': ['Gadgets', 'Apps', 'IA', 'Gaming', 'Crypto'],
    'Voyage': ['Destinations', 'Conseils', 'Budget', 'Aventure', 'Culture'],
    'Cuisine': ['Recettes', 'Restaurants', 'Nutrition', 'Pâtisserie', 'Végétarien'],
    'Fitness & Sport': ['Musculation', 'Cardio', 'Yoga', 'Running', 'Nutrition sportive'],
    'Éducation': ['Langues', 'Compétences', 'Tutoriels', 'Conseils carrière', 'Développement personnel'],
    'Business': ['Entrepreneuriat', 'Marketing', 'Finance', 'Leadership', 'Productivité'],
    'Lifestyle': ['Décoration', 'Organisation', 'Minimalisme', 'Bien-être', 'Relations'],
    'Art & Créativité': ['Dessin', 'Peinture', 'Photographie', 'Musique', 'Écriture'],
    'Gaming': ['Jeux vidéo', 'Streaming', 'Esport', 'Hardware', 'Communauté'],
    'Parentalité': ['Éducation', 'Activités', 'Conseils', 'Développement', 'Famille'],
    'Finance': ['Investissement', 'Épargne', 'Cryptomonnaies', 'Immobilier', 'Budget']
  };

  const subSubcategories = {
    'Mode': ['Femme', 'Homme', 'Enfant', 'Accessoires', 'Chaussures'],
    'Maquillage': ['Visage', 'Yeux', 'Lèvres', 'Ongles', 'Outils'],
    'Skincare': ['Visage', 'Corps', 'Cheveux', 'Solaire', 'Anti-âge'],
    'Gadgets': ['Smartphones', 'Ordinateurs', 'Audio', 'Smart home', 'Wearables'],
    'Apps': ['Productivité', 'Social', 'Gaming', 'Finance', 'Santé'],
    'Destinations': ['Europe', 'Asie', 'Amériques', 'Afrique', 'Océanie'],
    'Recettes': ['Entrées', 'Plats', 'Desserts', 'Boissons', 'Snacks'],
    'Musculation': ['Poids libres', 'Machines', 'Fonctionnel', 'Cardio', 'Récupération']
  };

  const handleInputChange = (field: keyof AccountFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddKeyword = () => {
    if (currentKeyword.trim() && !formData.keywords.includes(currentKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, currentKeyword.trim()]
      }));
      setCurrentKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleAddValue = () => {
    if (currentValue.trim() && !formData.values.includes(currentValue.trim())) {
      setFormData(prev => ({
        ...prev,
        values: [...prev.values, currentValue.trim()]
      }));
      setCurrentValue('');
    }
  };

  const handleRemoveValue = (value: string) => {
    setFormData(prev => ({
      ...prev,
      values: prev.values.filter(v => v !== value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.theme && formData.category) {
      onCreate(formData);
      setFormData({
        name: '',
        theme: '',
        network: '',
        category: '',
        subcategory: '',
        subSubcategory: '',
        objective: '',
        subject: '',
        keywords: [],
        values: [],
        description: ''
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      theme: '',
      network: '',
      category: '',
      subcategory: '',
      subSubcategory: '',
      objective: '',
      subject: '',
      keywords: [],
      values: [],
      description: ''
    });
    onClose();
  };

  const availableSubcategories = formData.theme ? categories[formData.theme as keyof typeof categories] || [] : [];
  const availableSubSubcategories = formData.subcategory ? subSubcategories[formData.subcategory as keyof typeof subSubcategories] || [] : [];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Créer un compte
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations de base</h3>
            
            <div>
              <Label htmlFor="account-name">Nom du compte *</Label>
              <Input
                id="account-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Mon compte mode"
                className="mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="theme">Thème *</Label>
                <Select value={formData.theme} onValueChange={(value) => handleInputChange('theme', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionnez un thème" />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map(theme => (
                      <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="network">Réseau social</Label>
                <Select value={formData.network} onValueChange={(value) => handleInputChange('network', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionnez un réseau" />
                  </SelectTrigger>
                  <SelectContent>
                    {networks.map(network => (
                      <SelectItem key={network} value={network}>{network}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Catégorie *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => {
                    handleInputChange('category', value);
                    handleInputChange('subcategory', '');
                    handleInputChange('subSubcategory', '');
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubcategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subcategory">Sous-catégorie</Label>
                <Select 
                  value={formData.subcategory} 
                  onValueChange={(value) => {
                    handleInputChange('subcategory', value);
                    handleInputChange('subSubcategory', '');
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubcategories.map(subcategory => (
                      <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {availableSubSubcategories.length > 0 && (
              <div>
                <Label htmlFor="sub-subcategory">Sous-sous-catégorie</Label>
                <Select value={formData.subSubcategory} onValueChange={(value) => handleInputChange('subSubcategory', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Sélectionnez une sous-sous-catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubSubcategories.map(subSubcategory => (
                      <SelectItem key={subSubcategory} value={subSubcategory}>{subSubcategory}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Objectifs et sujets */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Objectifs et sujets</h3>
            
            <div>
              <Label htmlFor="objective">Objectif du compte</Label>
              <Textarea
                id="objective"
                value={formData.objective}
                onChange={(e) => handleInputChange('objective', e.target.value)}
                placeholder="Décrivez l'objectif principal de ce compte..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="subject">Sujet principal</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Ex: Mode féminine tendance"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Mots-clés</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  placeholder="Ajouter un mot-clé..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                />
                <Button type="button" onClick={handleAddKeyword} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveKeyword(keyword)}>
                    {keyword} ×
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Valeurs et description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Valeurs et description</h3>
            
            <div>
              <Label>Valeurs du compte</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder="Ajouter une valeur..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddValue())}
                />
                <Button type="button" onClick={handleAddValue} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.values.map((value, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer" onClick={() => handleRemoveValue(value)}>
                    {value} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description du compte</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Décrivez votre compte en détail..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={!formData.name.trim() || !formData.theme || !formData.category}>
              <Plus className="w-4 h-4 mr-2" />
              Créer le compte
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAccountForm;
