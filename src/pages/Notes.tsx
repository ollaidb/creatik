import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { ArrowLeft, User, FileText } from 'lucide-react';
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
                  Gestion du compte et du contenu
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Section unique avec les deux blocs ensemble */}
        <section>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            {/* Bloc Compte */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <Card 
                className="hover:shadow-md transition-shadow cursor-pointer bg-card border-border"
                onClick={() => navigate('/compte')}
              >
                <CardContent className="p-4 sm:p-8 flex items-center justify-center min-h-[120px] sm:min-h-[200px]">
                  <div className="text-center">
                    <div className="p-2 sm:p-3 bg-primary/10 rounded-lg w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 flex items-center justify-center">
                      <User className="w-5 h-5 sm:w-8 sm:h-8 text-primary" />
                    </div>
                    <h2 className="text-lg sm:text-2xl font-semibold text-foreground">Compte</h2>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bloc Contenu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex-1"
            >
              <Card 
                className="hover:shadow-md transition-shadow cursor-pointer bg-card border-border"
                onClick={() => navigate('/contenu')}
              >
                <CardContent className="p-4 sm:p-8 flex items-center justify-center min-h-[120px] sm:min-h-[200px]">
                  <div className="text-center">
                    <div className="p-2 sm:p-3 bg-blue-500 rounded-lg w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 flex items-center justify-center">
                      <FileText className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <h2 className="text-lg sm:text-2xl font-semibold text-foreground">Contenu</h2>
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
