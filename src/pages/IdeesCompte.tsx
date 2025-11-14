import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { 
  ArrowLeft, 
  Lightbulb, 
  Plus,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateAccountForm from '@/components/forms/CreateAccountForm';
import Navigation from '@/components/Navigation';

interface Account {
  id: string;
  name: string;
  theme: string;
  network: string;
  category: string;
  subcategory: string;
  subSubcategory?: string;
  objective: string;
  subject: string;
  keywords: string[];
  values: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'archived';
}

const IdeesCompte = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const handleBack = () => {
    navigateBack();
  };

  const handleCreateAccount = () => {
    setShowCreateForm(true);
  };

  const handleAccountCreated = (accountData: { name: string; theme?: string; network?: string; category?: string; [key: string]: unknown }) => {
    const newAccount: Account = {
      id: Date.now().toString(),
      name: accountData.name,
      theme: accountData.theme,
      network: accountData.network,
      category: accountData.category,
      subcategory: accountData.subcategory,
      subSubcategory: accountData.subSubcategory,
      objective: accountData.objective,
      subject: accountData.subject,
      keywords: accountData.keywords,
      values: accountData.values,
      description: accountData.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    };
    setAccounts([...accounts, newAccount]);
    setShowCreateForm(false);
  };

  const handleViewAccount = (account: Account) => {
    navigate(`/account/${account.id}`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Lightbulb className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Noter une idée de compte</h1>
                <p className="text-sm text-muted-foreground">Créez et organisez vos idées de compte</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Menu de navigation */}
        <div className="mb-6">
          <Tabs value="comptes" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="comptes" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Mes comptes
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Contenu principal */}
        {accounts.length === 0 ? (
          /* Seulement le bouton quand il n'y a pas de compte */
          <div className="flex justify-center py-12">
            <Button 
              onClick={handleCreateAccount}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
            >
              <Plus className="w-6 h-6 mr-3" />
              Nouveau compte
            </Button>
          </div>
        ) : (
          /* Bouton + liste des comptes quand il y a des comptes */
          <>
            <div className="flex justify-end mb-6">
              <Button 
                onClick={handleCreateAccount}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau compte
              </Button>
            </div>

            <div className="space-y-3">
              {accounts.map((account) => (
                <div 
                  key={account.id}
                  className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewAccount(account)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{account.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Créé le {formatDate(account.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Navigation />

      {/* Formulaire de création de compte */}
      <CreateAccountForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCreate={handleAccountCreated}
      />
    </div>
  );
};

export default IdeesCompte;