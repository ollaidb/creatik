import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { ArrowLeft, FileText, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';

const Notes = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();



  return (
    <div className="min-h-screen bg-background">
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
                <h1 className="text-xl font-semibold text-foreground">Notes</h1>
                <p className="text-sm text-muted-foreground">
                  Écrire du contenu et noter des idées
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Section avec deux blocs */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Bloc Idées de Contenu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <Card 
                className="hover:shadow-md transition-shadow cursor-pointer bg-card border-border"
                onClick={() => navigate('/contenu')}
              >
                <CardContent className="p-4 sm:p-6 flex items-center justify-center min-h-[120px] sm:min-h-[180px]">
                  <div className="text-center">
                    <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 flex items-center justify-center">
                      <FileText className="w-5 h-5 sm:w-8 sm:h-8 text-blue-500" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1">Écrire du contenu</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">Articles, posts, textes</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bloc Idées de Compte */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1"
            >
              <Card 
                className="hover:shadow-md transition-shadow cursor-pointer bg-card border-border"
                onClick={() => navigate('/idees-compte')}
              >
                <CardContent className="p-4 sm:p-6 flex items-center justify-center min-h-[120px] sm:min-h-[180px]">
                  <div className="text-center">
                    <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 sm:w-8 sm:h-8 text-green-500" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1">Noter une idée de compte</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">Organisation, stratégie</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

          </div>
        </section>
      </main>

      <Navigation />
    </div>
  );
};

export default Notes;
