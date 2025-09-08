import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Heart, 
  BookOpen, 
  Users, 
  Plus,
  Share2,
  MoreHorizontal,
  Bell,
  User,
  Target,
  FileText,
  Calendar,
  MessageSquare,
  Shield,
  Palette,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navigation from '@/components/Navigation';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Données mock pour le profil
  const userProfile = {
    name: "John Doe",
    profilePicture: null,
    publications: 45
  };

  // Publications pour réseaux sociaux mock
  const publications = [
    {
      id: 1,
      title: "10 idées pour booster votre engagement",
      date: "2024-01-15",
      time: "14:30"
    },
    {
      id: 2,
      title: "Les tendances 2024 en design",
      date: "2024-01-12",
      time: "09:15"
    },
    {
      id: 3,
      title: "Comment créer du contenu viral",
      date: "2024-01-10",
      time: "16:45"
    }
  ];


  const profileMenuItems = [
    { icon: Heart, label: "Favoris", path: "/profile/favorites", color: "text-red-500" },
    { icon: BookOpen, label: "Notes", path: "/notes", color: "text-blue-500" },
    { icon: Calendar, label: "Historique", path: "/profile/history", color: "text-green-500" },
    { icon: FileText, label: "Publications", path: "/profile/publications", color: "text-purple-500" },
    { icon: Target, label: "Challenges", path: "/profile/challenges", color: "text-orange-500" },
    { icon: Bell, label: "Notifications", path: "/profile/notifications", color: "text-yellow-500" },
    { icon: Shield, label: "Sécurité", path: "/profile/settings", color: "text-gray-500" },
    { icon: Palette, label: "Préférences", path: "/profile/preferences", color: "text-pink-500" }
  ];

  const renderPublications = () => (
    <div className="space-y-2">
      {publications.map((pub) => (
        <div key={pub.id} className="flex justify-between items-center p-3 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow">
          <div className="flex-1">
            <h3 className="font-medium text-foreground">{pub.title}</h3>
            <p className="text-sm text-muted-foreground">
              {pub.date} à {pub.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );


  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header du profil */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userProfile.profilePicture} />
              <AvatarFallback className="text-2xl">
                {userProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{userProfile.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>{userProfile.publications} publications</span>
              </div>
            </div>
            <div className="flex gap-2 relative" ref={menuRef}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2"
              >
                <MoreHorizontal className="w-4 h-4" />
                <ChevronDown className="w-3 h-3" />
              </Button>
              
              {/* Menu déroulant */}
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        // Fonction pour partager le profil
                        console.log('Partager le profil');
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Partager le profil</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/compte');
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-accent flex items-center gap-3"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Paramètres et confidentialité</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Icônes des pages existantes */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {profileMenuItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className="flex flex-col items-center gap-1 h-auto py-2 min-w-[60px] flex-shrink-0"
                onClick={() => navigate(item.path)}
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span className="text-xs text-center">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Réseaux sociaux */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Button
              variant="outline"
              className="min-w-[80px] flex-shrink-0 text-xs h-8"
            >
              Instagram
            </Button>
            
            <Button
              variant="outline"
              className="min-w-[80px] flex-shrink-0 text-xs h-8"
            >
              TikTok
            </Button>
            
            <Button
              variant="outline"
              className="min-w-[32px] flex-shrink-0 border-dashed flex items-center justify-center h-8"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Section 3: Playlists */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Button
              variant="outline"
              className="min-w-[80px] flex-shrink-0 text-xs h-8"
            >
              Inspiration Marketing
            </Button>
            
            <Button
              variant="outline"
              className="min-w-[80px] flex-shrink-0 text-xs h-8"
            >
              Design Trends 2024
            </Button>
            
            <Button
              variant="outline"
              className="min-w-[32px] flex-shrink-0 border-dashed flex items-center justify-center h-8"
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Section Publications */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Mes Publications</h3>
          {renderPublications()}
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default UserProfile;
