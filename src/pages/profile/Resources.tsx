import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Receipt, Type, Mail, Package, AppWindow, Sparkles, Calculator, Shield, Globe, GraduationCap, Handshake } from 'lucide-react';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';

const resourceTabs = [
  { key: 'contracts', label: 'Contrats', gradient: 'from-blue-500 to-sky-500', icon: FileText },
  { key: 'receipts', label: 'Reçus', gradient: 'from-emerald-500 to-teal-500', icon: Receipt },
  { key: 'captions', label: 'Légendes', gradient: 'from-purple-500 to-fuchsia-500', icon: Type },
  { key: 'emails', label: 'Mails', gradient: 'from-orange-500 to-amber-500', icon: Mail },
  { key: 'equipment', label: 'Matériel', gradient: 'from-teal-500 to-emerald-500', icon: Package },
  { key: 'apps', label: 'Apps', gradient: 'from-rose-500 to-pink-500', icon: AppWindow },
  { key: 'taxes', label: 'Impôts', gradient: 'from-amber-500 to-yellow-500', icon: Calculator },
  { key: 'help', label: 'Aide', gradient: 'from-red-500 to-rose-500', icon: Shield },
  { key: 'international-account', label: 'Compte international', gradient: 'from-indigo-500 to-blue-500', icon: Globe },
  { key: 'training', label: 'Formation', gradient: 'from-teal-500 to-cyan-500', icon: GraduationCap },
  { key: 'collaboration', label: 'Collaboration', gradient: 'from-pink-500 to-rose-500', icon: Handshake }
] as const;

const resourceDescriptions: Record<typeof resourceTabs[number]['key'], string[]> = {
  contracts: [
    'Modèles adaptables (collaboration, sponsoring, UGC).',
    'Sections pré-remplies avec clauses clés pour protéger vos intérêts.',
    'Signature électronique et export PDF intégrés (à venir).'
  ],
  receipts: [
    'Générez un reçu professionnel en quelques clics.',
    'Ajoutez vos prestations, tarifs et coordonnées automatiquement.',
    'Historique exportable pour la comptabilité (à venir).'
  ],
  captions: [
    'Légendes organisées par plateformes et objectifs (vente, engagement...).',
    'Variables dynamiques pour personnaliser les messages.',
    'Suggestions basées sur vos performances (vision future).'
  ],
  emails: [
    'Templates pour démarcher les marques et répondre aux briefings.',
    'Ton ajustable (professionnel, friendly, urgent).',
    'Proposition de séquences d\'emails complètes.'
  ],
  equipment: [
    'Listes d\'équipement recommandées selon votre budget.',
    'Fiches pratiques d\'installation et d\'entretien.',
    'Liens d\'achat vérifiés et comparatifs (à venir).'
  ],
  apps: [
    'Sélection d\'apps pour planifier, filmer, monter et analyser.',
    'Filtres par plateforme, prix et niveau.',
    'Intégration avec Creatik pour synchroniser vos workflows (vision future).'
  ],
  taxes: [
    'Calculatrice d\'impôts adaptée à votre pays.',
    'Guide pour déclarer vos revenus d\'influenceur.',
    'Informations sur les statuts fiscaux et charges déductibles.'
  ],
  help: [
    'Ressources sur la sécurité et le cyber harcèlement.',
    'Informations sur vos droits et devoirs en tant que créateur.',
    'Guides légaux et contacts d\'urgence.'
  ],
  'international-account': [
    'Guide pour créer un compte bancaire américain.',
    'Solutions pour recevoir des paiements internationaux.',
    'Informations sur les comptes multi-devises et services bancaires.'
  ],
  training: [
    'Ressources de formation pour améliorer vos compétences.',
    'Cours et tutoriels pour créateurs de contenu.',
    'Guides pratiques et bonnes pratiques du secteur.'
  ],
  collaboration: [
    'Outils pour gérer vos collaborations avec les marques.',
    'Templates de contrats et guides de négociation.',
    'Conseils pour établir des partenariats durables.'
  ]
};

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
};

const Resources = () => {
  const { navigateBack } = useSmartNavigation();
  const [selectedTab, setSelectedTab] = useState<(typeof resourceTabs)[number]['key']>('contracts');

  const currentTab = resourceTabs.find(tab => tab.key === selectedTab) ?? resourceTabs[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={navigateBack}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Ressources</h1>
          </div>
        </div>

        <div className="mb-6 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2 min-w-max">
            {resourceTabs.map((tab, index) => {
              const isActive = selectedTab === tab.key;
              return (
                <motion.button
                  key={tab.key}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`
                    px-3 py-2 rounded-lg transition-all duration-300 min-w-[80px] text-center flex items-center justify-center gap-2
                    ${isActive 
                      ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg scale-105` 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tab.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-current'}`} />
                  <span className="text-xs font-medium leading-tight">
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <motion.div
          key={currentTab.key}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <currentTab.icon className="h-5 w-5" />
                  {currentTab.label}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Retrouvez ici toutes les ressources liées à cette catégorie.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                Mode aperçu
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {resourceDescriptions[currentTab.key].map((bullet, idx) => (
                <div key={bullet} className="flex gap-3">
                  <div className={`mt-1 h-2 w-2 rounded-full bg-gradient-to-r ${currentTab.gradient}`} />
                  <span>{bullet}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader>
              <CardTitle>Prochaine étape</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                Nous construisons actuellement l’interface complète pour la section « {currentTab.label} ».
                Vous pourrez bientôt générer et exporter vos documents en quelques secondes.
              </p>
              <p>
                Si vous avez des besoins spécifiques, notez-les et nous les intégrerons au futur générateur.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Navigation />
    </div>
  );
};

export default Resources;