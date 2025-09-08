import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Settings, FileText, Target, Bell, Receipt, History } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface MenuItem {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  color: string;
}

const ProfileDetails = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();

  const profileMenuItems: MenuItem[] = [
    {
      title: 'Centres d\'intérêt',
      description: 'Personnalisez vos préférences',
      icon: Settings,
      path: '/profile/preferences',
      color: 'text-blue-500'
    },
    {
      title: "Publications",
      description: "Gérez vos publications et suivez leur statut",
      icon: FileText,
      path: '/profile/publications',
      color: 'text-blue-600'
    },
    {
      title: 'Mes Défis',
      description: 'Gérez vos défis personnels et suivez votre progression',
      icon: Target,
      path: '/challenges',
      color: 'text-orange-500'
    },
    {
      title: 'Notifications',
      description: 'Rappels de défis, réactions et réponses',
      icon: Bell,
      path: '/profile/notifications',
      color: 'text-yellow-500'
    },
    {
      title: 'Ressources',
      description: 'Reçus et contrats d\'influenceur',
      icon: Receipt,
      path: '/profile/resources',
      color: 'text-emerald-500'
    },
    {
      title: 'Historique',
      description: 'Consultez votre historique de navigation',
      icon: History,
      path: '/profile/history',
      color: 'text-purple-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleMenuClick = (item: MenuItem) => {
    navigate(item.path);
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-background border-b p-4 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
            onClick={navigateBack}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Mon Profil</h1>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-12">
        {/* Menu Items */}
        <motion.div
          className="grid gap-3 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {profileMenuItems.map((item) => (
            <motion.div key={item.title} variants={itemVariants}>
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300 h-full"
                onClick={() => handleMenuClick(item)}
              >
                <CardContent className="p-4 h-full flex items-center">
                  <div className="flex items-center space-x-2 w-full">
                    <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-xs">{item.title}</h3>
                    </div>
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

export default ProfileDetails;
