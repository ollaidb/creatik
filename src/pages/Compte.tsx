import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';

const Compte = () => {
  const navigate = useNavigate();

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
                <h1 className="text-xl font-semibold text-foreground">Compte</h1>
                <p className="text-sm text-muted-foreground">
                  Gestion de votre compte
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center min-h-[400px]"
        >
          <Card className="max-w-md w-full bg-card border-border">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-primary/10 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Page Compte
              </h2>
              <p className="text-muted-foreground mb-6">
                Cette page sera développée avec les fonctionnalités de gestion de compte.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
                className="border-border text-foreground hover:bg-accent"
              >
                Retour
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Navigation />
    </div>
  );
};

export default Compte;
