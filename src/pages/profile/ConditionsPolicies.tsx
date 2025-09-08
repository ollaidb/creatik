import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  FileText, 
  Shield, 
  Scale,
  Copyright,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';

const ConditionsPolicies = () => {
  const navigate = useNavigate();

  const legalPages = [
    {
      id: 'terms',
      title: 'Conditions d\'utilisation',
      description: 'Règles et conditions d\'utilisation de l\'application',
      icon: FileText,
      color: 'bg-blue-500',
      path: '/profile/legal/terms',
      lastUpdated: '15 janvier 2024',
      required: true
    },
    {
      id: 'privacy',
      title: 'Politique de confidentialité',
      description: 'Comment nous collectons et utilisons vos données',
      icon: Shield,
      color: 'bg-green-500',
      path: '/profile/legal/privacy',
      lastUpdated: '15 janvier 2024',
      required: true
    },
    {
      id: 'legal',
      title: 'Mentions légales',
      description: 'Informations légales sur l\'éditeur et l\'hébergement',
      icon: Scale,
      color: 'bg-purple-500',
      path: '/profile/legal',
      lastUpdated: '15 janvier 2024',
      required: false
    },
    {
      id: 'copyright',
      title: 'Droits d\'auteur',
      description: 'Politique de protection de la propriété intellectuelle',
      icon: Copyright,
      color: 'bg-orange-500',
      path: '/profile/legal/copyright',
      lastUpdated: '15 janvier 2024',
      required: false
    },
    {
      id: 'cookies',
      title: 'Politique des cookies',
      description: 'Utilisation des cookies et technologies similaires',
      icon: FileText,
      color: 'bg-teal-500',
      path: '/profile/legal/cookies',
      lastUpdated: '15 janvier 2024',
      required: false
    },
    {
      id: 'gdpr',
      title: 'Conformité RGPD',
      description: 'Respect du règlement général sur la protection des données',
      icon: Shield,
      color: 'bg-indigo-500',
      path: '/profile/legal/gdpr',
      lastUpdated: '15 janvier 2024',
      required: false
    }
  ];

  const handlePageClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/compte')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Conditions et politiques</h1>
              <p className="text-sm text-muted-foreground">
                Toutes les informations légales et politiques de l'application
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/20 rounded-full">
                  <Scale className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    Informations légales
                  </h2>
                  <p className="text-muted-foreground">
                    Retrouvez ici toutes les informations légales, conditions d'utilisation, 
                    politiques de confidentialité et autres documents importants concernant 
                    l'utilisation de l'application Creatik.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pages légales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Documents légaux
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legalPages.map((page, index) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
              >
                <Card 
                  className="hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/30 hover:bg-card/50"
                  onClick={() => handlePageClick(page.path)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${page.color} text-white`}>
                          <page.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">
                              {page.title}
                            </h3>
                            {page.required && (
                              <Badge variant="secondary" className="text-xs">
                                Obligatoire
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {page.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Dernière mise à jour : {page.lastUpdated}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Informations importantes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
                  <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Informations importantes
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    En utilisant l'application Creatik, vous acceptez automatiquement 
                    nos conditions d'utilisation et notre politique de confidentialité. 
                    Nous vous recommandons de lire attentivement ces documents pour 
                    comprendre vos droits et obligations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact pour questions légales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">
                  Questions sur les aspects légaux ?
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Notre équipe juridique est à votre disposition pour toute question
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/profile/contact')}
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  Nous contacter
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

export default ConditionsPolicies;
