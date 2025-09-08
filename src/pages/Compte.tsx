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

  const settingsMenuItems = [
    {
      title: 'Contact',
      description: 'Support et assistance',
      icon: MessageSquare,
      path: '/profile/contact',
      color: 'bg-teal-500',
      badge: null
    },
    {
      title: 'Paramètres',
      description: 'Gérer vos préférences et paramètres',
      icon: Settings,
      path: '/profile/settings',
      color: 'bg-blue-500',
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
                <h1 className="text-xl font-semibold text-foreground">Paramètres et confidentialité</h1>
                <p className="text-sm text-muted-foreground">
                  Gérez vos paramètres et confidentialité
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Settings Menu Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {settingsMenuItems.map((item, index) => (
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

      </main>

      <Navigation />
    </div>
  );
};

export default Compte;
