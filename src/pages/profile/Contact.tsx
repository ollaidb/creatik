import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Mail, MessageCircle, Bug, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import StickyHeader from '@/components/StickyHeader';
const Contact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici on traiterait normalement l'envoi du message
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais."
    });
    setFormData({ name: '', email: '', subject: '', category: '', message: '' });
  };
  const contactOptions = [
    {
      icon: MessageCircle,
      title: 'Question générale',
      description: 'Pour toute question sur CréaTik'
    },
    {
      icon: Bug,
      title: 'Signaler un problème',
      description: 'Signalez un bug ou un dysfonctionnement'
    },
    {
      icon: Lightbulb,
      title: 'Suggestion',
      description: 'Proposez une amélioration ou nouvelle fonctionnalité'
    },
    {
      icon: Mail,
      title: 'Support technique',
      description: 'Aide technique et assistance'
    }
  ];
  return (
    <div className="min-h-screen pb-20">
      <StickyHeader showSearchBar={false} />
      <header className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/profile')} 
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Contact</h1>
        </div>
        <Button 
          size="sm"
          onClick={() => navigate('/publish')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Publier
        </Button>
      </header>
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Options de contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-4 flex items-start space-x-4">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <option.icon className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Formulaire de contact */}
        <Card>
          <CardHeader>
            <CardTitle>Nous contacter</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Question générale</SelectItem>
                    <SelectItem value="bug">Signaler un problème</SelectItem>
                    <SelectItem value="suggestion">Suggestion</SelectItem>
                    <SelectItem value="support">Support technique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject">Sujet</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Envoyer le message
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Navigation />
    </div>
  );
};
export default Contact;
