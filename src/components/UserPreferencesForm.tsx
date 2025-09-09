import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
const UserPreferencesForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    age: '',
    profession: '',
    interests: [] as string[],
    contentPreferences: [] as string[],
    platforms: [] as string[],
    experience: '',
    goals: '',
    frequency: ''
  });
  const interestOptions = [
    'Lifestyle', 'Tech', 'Mode', 'Cuisine', 'Voyage', 'Sport', 
    'Éducation', 'Business', 'Art', 'Musique', 'Santé', 'Gaming'
  ];
  const contentOptions = [
    'Tutoriels', 'Divertissement', 'Éducatif', 'Inspiration', 
    'Actualités', 'Reviews', 'Challenges', 'Storytelling'
  ];
  const platformOptions = [
    'TikTok', 'Instagram Stories', 'Instagram Reels', 'YouTube Shorts', 
    'YouTube Long', 'LinkedIn', 'Twitter', 'Facebook'
  ];
  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };
  const handleContentPreferenceChange = (content: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      contentPreferences: checked 
        ? [...prev.contentPreferences, content]
        : prev.contentPreferences.filter(c => c !== content)
    }));
  };
  const handlePlatformChange = (platform: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      platforms: checked 
        ? [...prev.platforms, platform]
        : prev.platforms.filter(p => p !== platform)
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici on sauvegarderait les préférences en base
    toast({
      title: "Préférences sauvegardées",
      description: "Vos préférences ont été enregistrées avec succès. Nous pourrons maintenant vous proposer du contenu personnalisé."
    });
  };
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Personnalisez votre expérience</CardTitle>
        <CardDescription>
          Remplissez ce formulaire pour recevoir des recommandations personnalisées
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Tranche d'âge</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={formData.age}
                onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
              >
                <option value="">Sélectionnez</option>
                <option value="16-24">16-24 ans</option>
                <option value="25-34">25-34 ans</option>
                <option value="35-44">35-44 ans</option>
                <option value="45+">45+ ans</option>
              </select>
            </div>
            <div>
              <Label htmlFor="profession">Profession/Domaine</Label>
              <Input
                id="profession"
                value={formData.profession}
                onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                placeholder="ex: Marketing, Étudiant, Entrepreneur..."
              />
            </div>
          </div>
          {/* Centres d'intérêt */}
          <div>
            <Label>Centres d'intérêt</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {interestOptions.map(interest => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                  />
                  <Label htmlFor={interest} className="text-sm">{interest}</Label>
                </div>
              ))}
            </div>
          </div>
          {/* Préférences de contenu */}
          <div>
            <Label>Types de contenu préférés</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {contentOptions.map(content => (
                <div key={content} className="flex items-center space-x-2">
                  <Checkbox
                    id={content}
                    checked={formData.contentPreferences.includes(content)}
                    onCheckedChange={(checked) => handleContentPreferenceChange(content, checked as boolean)}
                  />
                  <Label htmlFor={content} className="text-sm">{content}</Label>
                </div>
              ))}
            </div>
          </div>
          {/* Plateformes */}
          <div>
            <Label>Plateformes utilisées</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {platformOptions.map(platform => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform}
                    checked={formData.platforms.includes(platform)}
                    onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
                  />
                  <Label htmlFor={platform} className="text-sm">{platform}</Label>
                </div>
              ))}
            </div>
          </div>
          {/* Expérience */}
          <div>
            <Label htmlFor="experience">Niveau d'expérience en création de contenu</Label>
            <select 
              className="w-full p-2 border rounded-md"
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
            >
              <option value="">Sélectionnez</option>
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="avance">Avancé</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          {/* Objectifs */}
          <div>
            <Label htmlFor="goals">Vos objectifs de création de contenu</Label>
            <Textarea
              id="goals"
              value={formData.goals}
              onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
              placeholder="ex: Développer ma marque personnelle, partager mes passions, créer une communauté..."
              rows={3}
            />
          </div>
          {/* Fréquence */}
          <div>
            <Label htmlFor="frequency">Fréquence de publication souhaitée</Label>
            <select 
              className="w-full p-2 border rounded-md"
              value={formData.frequency}
              onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
            >
              <option value="">Sélectionnez</option>
              <option value="quotidien">Quotidiennement</option>
              <option value="hebdomadaire">Plusieurs fois par semaine</option>
              <option value="occasionnel">Occasionnellement</option>
              <option value="rare">Rarement</option>
            </select>
          </div>
          <Button type="submit" className="w-full">
            Sauvegarder mes préférences
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
export default UserPreferencesForm;
