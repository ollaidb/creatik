
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Send, Loader2 } from 'lucide-react';
import { useUserPublications } from '@/hooks/useUserPublications';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  color: string;
  description?: string;
}

interface PublishBarProps {
  categories: Category[];
}

const PublishBar: React.FC<PublishBarProps> = ({ categories }) => {
  const [formData, setFormData] = useState({
    content_type: '',
    title: '',
    description: '',
    category_id: '',
    platform: '',
    content_format: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createPublication } = useUserPublications();
  const { user } = useAuth();
  const { toast } = useToast();

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

    if (!formData.content_type || !formData.title) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir au moins le type de contenu et le titre",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createPublication({
        content_type: formData.content_type,
        title: formData.title,
        description: formData.description || undefined,
        category_id: formData.category_id || undefined,
        platform: formData.platform || undefined,
        content_format: formData.content_format || undefined
      });

      // Reset form
      setFormData({
        content_type: '',
        title: '',
        description: '',
        category_id: '',
        platform: '',
        content_format: ''
      });
    } catch (error) {
      console.error('Error submitting publication:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Partager votre contenu
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type de contenu */}
          <div className="space-y-2">
            <Label htmlFor="content_type">Type de contenu *</Label>
            <Select value={formData.content_type} onValueChange={(value) => handleInputChange('content_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de contenu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category">Catégorie</SelectItem>
                <SelectItem value="subcategory">Sous-catégorie</SelectItem>
                <SelectItem value="title">Titre/Accroche</SelectItem>
                <SelectItem value="content">Contenu créatif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Donnez un titre à votre contenu"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Décrivez votre contenu..."
              rows={4}
            />
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
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

          {/* Plateforme */}
          <div className="space-y-2">
            <Label htmlFor="platform">Plateforme</Label>
            <Select value={formData.platform} onValueChange={(value) => handleInputChange('platform', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une plateforme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Format de contenu */}
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Select value={formData.content_format} onValueChange={(value) => handleInputChange('content_format', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video-courte">Vidéo courte</SelectItem>
                <SelectItem value="video-longue">Vidéo longue</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="text">Texte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting || !formData.content_type || !formData.title}
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
        </form>
      </CardContent>
    </Card>
  );
};

export default PublishBar;
