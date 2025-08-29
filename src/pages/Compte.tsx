import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Settings, 
  Bell, 
  Heart, 
  FileText, 
  Calendar,
  MessageSquare,
  Shield,
  Palette,
  BookOpen,
  Users,
  Receipt
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';

const Compte = () => {
  const navigate = useNavigate();

  const profileMenuItems = [
    {
      title: 'Paramètres',
      description: 'Gérer vos préférences et paramètres',
      icon: Settings,
      path: '/profile/settings',
      color: 'bg-blue-500',
      badge: null
    },
    {
      title: 'Notifications',
      description: 'Gérer vos notifications et alertes',
      icon: Bell,
      path: '/profile/notifications',
      color: 'bg-orange-500',
      badge: '3'
    },
    {
      title: 'Favoris',
      description: 'Vos contenus et créateurs favoris',
      icon: Heart,
      path: '/profile/favorites',
      color: 'bg-red-500',
      badge: '12'
    },
    {
      title: 'Historique',
      description: 'Votre activité récente',
      icon: Calendar,
      path: '/profile/history',
      color: 'bg-green-500',
      badge: null
    },
    {
      title: 'Publications',
      description: 'Gérer vos publications',
      icon: FileText,
      path: '/profile/publications',
      color: 'bg-purple-500',
      badge: '5'
    },
    {
      title: 'Challenges',
      description: 'Vos défis et participations',
      icon: BookOpen,
      path: '/profile/challenges',
      color: 'bg-indigo-500',
      badge: '2'
    },
    {
      title: 'Ressources',
      description: 'Reçus et contrats d\'influenceur',
      icon: Receipt,
      path: '/profile/resources',
      color: 'bg-emerald-500',
      badge: 'Nouveau'
    },
    {
      title: 'Contact',
      description: 'Support et assistance',
      icon: MessageSquare,
      path: '/profile/contact',
      color: 'bg-teal-500',
      badge: null
    },
    {
      title: 'Confidentialité',
      description: 'Gérer votre vie privée',
      icon: Shield,
      path: '/profile/privacy',
      color: 'bg-gray-500',
      badge: null
    },
    {
      title: 'Préférences',
      description: 'Personnaliser votre expérience',
      icon: Palette,
      path: '/profile/preferences',
      color: 'bg-pink-500',
      badge: null
    },
    {
      title: 'Mentions légales',
      description: 'Informations légales',
      icon: Users,
      path: '/profile/legal',
      color: 'bg-slate-500',
      badge: null
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Profil</h1>
                <p className="text-sm text-muted-foreground">
                  Gérez votre compte et vos préférences
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Profile Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-primary/20 rounded-full">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    Bienvenue sur votre profil
                  </h2>
                  <p className="text-muted-foreground">
                    Accédez à toutes les fonctionnalités de gestion de votre compte
                  </p>
                </div>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                  Créateur
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Menu Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {profileMenuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            >
              <Card 
                className="hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/30 hover:bg-card/50"
                onClick={() => navigate(item.path)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${item.color} text-white`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {item.badge && (
                      <Badge 
                        variant={item.badge === 'Nouveau' ? 'default' : 'secondary'}
                        className={item.badge === 'Nouveau' ? 'bg-primary text-primary-foreground' : ''}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/profile/resources')}
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Créer un reçu
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/profile/resources')}
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Nouveau contrat
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/profile/settings')}
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Navigation />
    </div>
  );
};

export default Compte;
