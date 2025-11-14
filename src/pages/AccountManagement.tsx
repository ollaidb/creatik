import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { 
  ArrowLeft, 
  Lightbulb, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  Search,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  Target,
  Users,
  TrendingUp,
  Hash,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import Navigation from '@/components/Navigation';
import CreateAccountForm from '@/components/forms/CreateAccountForm';

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

const AccountManagement = () => {
  const navigate = useNavigate();
  const { navigateBack } = useSmartNavigation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Mon compte mode féminine',
      theme: 'Mode & Beauté',
      network: 'Instagram',
      category: 'Mode',
      subcategory: 'Femme',
      subSubcategory: 'Accessoires',
      objective: 'Partager des looks tendance et inspirer les femmes',
      subject: 'Mode féminine tendance',
      keywords: ['mode', 'fashion', 'style', 'looks', 'tendance'],
      values: ['authenticité', 'confiance', 'élégance', 'créativité'],
      description: 'Un compte dédié à la mode féminine avec des looks inspirants et des conseils style.',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
      status: 'active'
    },
    {
      id: '2',
      name: 'Tech & Innovation',
      theme: 'Technologie',
      network: 'LinkedIn',
      category: 'Gadgets',
      subcategory: 'Smartphones',
      objective: 'Partager les dernières innovations technologiques',
      subject: 'Technologie et innovation',
      keywords: ['tech', 'innovation', 'gadgets', 'smartphone', 'IA'],
      values: ['innovation', 'excellence', 'partage', 'apprentissage'],
      description: 'Un compte professionnel sur les dernières tendances technologiques.',
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16'),
      status: 'active'
    },
    {
      id: '3',
      name: 'Cuisine Créative',
      theme: 'Cuisine',
      network: 'TikTok',
      category: 'Recettes',
      subcategory: 'Desserts',
      objective: 'Partager des recettes créatives et faciles',
      subject: 'Cuisine créative et desserts',
      keywords: ['cuisine', 'recettes', 'desserts', 'créatif', 'facile'],
      values: ['créativité', 'partage', 'simplicité', 'plaisir'],
      description: 'Un compte dédié à la cuisine créative avec des recettes originales.',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-12'),
      status: 'inactive'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'archived'>('all');
  const [showArchived, setShowArchived] = useState(false);

  const handleCreateAccount = (accountData: Record<string, unknown>) => {
    const newAccount: Account = {
      id: Date.now().toString(),
      ...accountData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    };
    setAccounts(prev => [newAccount, ...prev]);
  };

  const handleEditAccount = (account: Account) => {
    // TODO: Ouvrir l'éditeur de compte
    console.log('Éditer le compte:', account);
  };

  const handleDeleteAccount = (accountId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      setAccounts(prev => prev.filter(account => account.id !== accountId));
    }
  };

  const handleViewAccount = (account: Account) => {
    navigate(`/account/${account.id}`);
  };

  const filteredAccounts = accounts.filter(account => {
    if (!showArchived && account.status === 'archived') return false;
    if (filterStatus !== 'all' && account.status !== filterStatus) return false;
    if (searchQuery && !account.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !account.theme.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusColor = (status: Account['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Account['status']) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'inactive': return 'Inactif';
      case 'archived': return 'Archivé';
      default: return 'Inconnu';
    }
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
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={navigateBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Gestion des comptes</h1>
                <p className="text-sm text-muted-foreground">
                  Gérez tous vos comptes créés
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau compte
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher un compte..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs value={filterStatus} onValueChange={(value) => setFilterStatus(value as 'all' | 'active' | 'inactive' | 'archived')}>
              <TabsList>
                <TabsTrigger value="all">Tous</TabsTrigger>
                <TabsTrigger value="active">Actifs</TabsTrigger>
                <TabsTrigger value="inactive">Inactifs</TabsTrigger>
                <TabsTrigger value="archived">Archivés</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center border border-border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={showArchived}
                onCheckedChange={setShowArchived}
              />
              <Label className="text-sm">Afficher les archivés</Label>
            </div>
          </div>
        </div>

        {/* Accounts List */}
        {filteredAccounts.length > 0 ? (
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-2"
          )}>
            <AnimatePresence>
              {filteredAccounts.map((account, index) => (
                <motion.div
                  key={account.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {viewMode === 'grid' ? (
                    <Card className="hover:shadow-md transition-shadow group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 bg-green-500/10 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewAccount(account)}
                              className="h-6 w-6 p-0"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAccount(account)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                >
                                  <MoreHorizontal className="w-3 h-3" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-48" align="end">
                                <div className="space-y-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditAccount(account)}
                                    className="w-full justify-start"
                                  >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Modifier
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleViewAccount(account)}
                                    className="w-full justify-start"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Voir
                                  </Button>
                                  <Separator />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteAccount(account.id)}
                                    className="w-full justify-start text-red-500 hover:text-red-600"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer
                                  </Button>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h3 className="font-semibold text-sm line-clamp-2">{account.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getStatusColor(account.status)} text-white text-xs`}>
                              {getStatusLabel(account.status)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {account.network}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {account.theme}
                            </div>
                            <div className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {account.category}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Créé le {formatDate(account.createdAt)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group">
                      <div className="p-2 bg-green-500/10 rounded-lg">
                        <Lightbulb className="w-4 h-4 text-green-500" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm truncate">{account.name}</h3>
                          <Badge className={`${getStatusColor(account.status)} text-white text-xs`}>
                            {getStatusLabel(account.status)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {account.network}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>{account.theme}</span>
                          <span>{account.category}</span>
                          <span>Créé le {formatDate(account.createdAt)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewAccount(account)}
                          className="h-6 w-6 p-0"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAccount(account)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAccount(account.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-muted/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Lightbulb className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucun compte trouvé
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Aucun compte ne correspond à votre recherche'
                : 'Commencez par créer votre premier compte'
              }
            </p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un compte
            </Button>
          </div>
        )}
      </main>

      {/* Create Account Form */}
      <CreateAccountForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCreate={handleCreateAccount}
      />

      <Navigation />
    </div>
  );
};

export default AccountManagement;
