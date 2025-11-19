import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Receipt, Type, Mail, Package, AppWindow, Sparkles, Calculator, Shield, Globe, GraduationCap, Handshake, Info, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useSmartNavigation } from '@/hooks/useNavigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    'Intégration avec Kreea pour synchroniser vos workflows (vision future).'
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
  
  // États pour le calculateur d'impôts
  const [taxCalculator, setTaxCalculator] = useState({
    country: 'FR',
    revenue: '',
    status: 'micro-entreprise',
    hasBusiness: false,
    businessRevenue: ''
  });
  const [taxResult, setTaxResult] = useState<number | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const currentTab = resourceTabs.find(tab => tab.key === selectedTab) ?? resourceTabs[0];

  // Calculateur d'impôts simplifié (France)
  const calculateTax = () => {
    const revenue = parseFloat(taxCalculator.revenue) || 0;
    const businessRevenue = parseFloat(taxCalculator.businessRevenue) || 0;
    const totalRevenue = revenue + businessRevenue;

    if (totalRevenue === 0) {
      setTaxResult(null);
      return;
    }

    let tax = 0;

    // Calcul simplifié pour micro-entreprise (France)
    if (taxCalculator.status === 'micro-entreprise' && taxCalculator.country === 'FR') {
      // Abattement de 34% pour les prestations de services
      const taxableRevenue = totalRevenue * 0.66;
      // Tranches d'imposition simplifiées
      if (taxableRevenue <= 10225) {
        tax = 0;
      } else if (taxableRevenue <= 26070) {
        tax = (taxableRevenue - 10225) * 0.11;
      } else if (taxableRevenue <= 74545) {
        tax = (26070 - 10225) * 0.11 + (taxableRevenue - 26070) * 0.30;
      } else {
        tax = (26070 - 10225) * 0.11 + (74545 - 26070) * 0.30 + (taxableRevenue - 74545) * 0.41;
      }
    } else {
      // Calcul générique (approximation)
      tax = totalRevenue * 0.20; // 20% approximatif
    }

    setTaxResult(Math.round(tax * 100) / 100);
  };

  // FAQ sur les impôts
  const faqItems = [
    {
      id: '1',
      question: 'Qu\'est-ce qu\'un impôt et pourquoi dois-je le déclarer ?',
      answer: 'Un impôt est une contribution financière obligatoire versée à l\'État. En tant que créateur de contenu, vous devez déclarer tous vos revenus (collaborations, publicités, ventes) car c\'est une obligation légale. Ne pas déclarer peut entraîner des sanctions financières et pénales. La déclaration permet aussi de bénéficier de déductions fiscales sur vos dépenses professionnelles.'
    },
    {
      id: '2',
      question: 'Quels revenus dois-je déclarer ?',
      answer: 'Vous devez déclarer tous vos revenus liés à la création de contenu : collaborations rémunérées (argent ou produits), revenus publicitaires (YouTube AdSense, etc.), affiliations et commissions, ventes de produits dérivés, prestations de conseil. Même les produits reçus gratuitement ont une valeur fiscale à déclarer.'
    },
    {
      id: '3',
      question: 'Comment déclarer mes revenus de créateur de contenu ?',
      answer: 'En France, vous pouvez opter pour le statut de micro-entrepreneur (auto-entrepreneur) si vos revenus sont inférieurs à 188 700€. Vous devez déclarer vos revenus mensuellement ou trimestriellement sur le site impots.gouv.fr. Pour d\'autres pays, consultez le site officiel des impôts de votre pays de résidence.'
    },
    {
      id: '4',
      question: 'Que faire si j\'ai un business à côté ?',
      answer: 'Si vous avez une autre activité professionnelle, vous devez déclarer tous vos revenus cumulés. Vous pouvez opter pour une déclaration unique si vous êtes en micro-entreprise, ou séparer les activités si vous avez des statuts différents. Il est recommandé de consulter un expert-comptable pour optimiser votre situation fiscale.'
    },
    {
      id: '5',
      question: 'Quelles charges puis-je déduire ?',
      answer: 'Vous pouvez déduire vos dépenses professionnelles : matériel de création (caméras, éclairage), logiciels et abonnements (Canva, Adobe), frais de déplacement professionnels, location de studio, formation professionnelle, frais de communication (internet, téléphone pro), et une partie de vos charges si vous travaillez à domicile.'
    },
    {
      id: '6',
      question: 'Quand dois-je déclarer mes impôts ?',
      answer: 'En France, la déclaration annuelle se fait entre avril et mai pour les revenus de l\'année précédente. Si vous êtes micro-entrepreneur, vous devez déclarer mensuellement ou trimestriellement. Les dates varient selon les pays, consultez le calendrier fiscal de votre pays.'
    },
    {
      id: '7',
      question: 'Que se passe-t-il si je ne déclare pas mes revenus ?',
      answer: 'Ne pas déclarer ses revenus est une fraude fiscale. Les sanctions peuvent inclure : majoration de 10% à 80% des impôts dus, intérêts de retard, amendes, et dans les cas graves, des poursuites pénales. Il est toujours préférable de régulariser sa situation.'
    }
  ];

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
          {selectedTab === 'taxes' ? (
            <>
              {/* Section Informations sur les impôts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Qu'est-ce qu'un impôt ?
                  </CardTitle>
                  <CardDescription>Comprendre les bases de la fiscalité</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground">
                      <strong className="text-foreground">Un impôt</strong> est une contribution financière obligatoire 
                      versée à l'État (ou aux collectivités territoriales) pour financer les services publics 
                      (éducation, santé, sécurité, infrastructures, etc.).
                    </p>
                    <p className="text-muted-foreground">
                      En tant que créateur de contenu, tous vos revenus professionnels sont soumis à l'impôt, 
                      qu'ils proviennent de collaborations, de publicités, d'affiliations ou de ventes.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Section Pourquoi déclarer */}
              <Card>
                <CardHeader>
                  <CardTitle>Pourquoi déclarer ses impôts ?</CardTitle>
                  <CardDescription>Les raisons légales et pratiques</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                      <div>
                        <strong className="text-foreground">Obligation légale :</strong>
                        <p className="text-muted-foreground">
                          La déclaration d'impôts est obligatoire dans tous les pays. Ne pas déclarer constitue 
                          une fraude fiscale passible de sanctions.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                      <div>
                        <strong className="text-foreground">Éviter les sanctions :</strong>
                        <p className="text-muted-foreground">
                          Les contrôles fiscaux peuvent entraîner des majorations de 10% à 80%, des intérêts 
                          de retard et des amendes.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                      <div>
                        <strong className="text-foreground">Bénéficier de déductions :</strong>
                        <p className="text-muted-foreground">
                          En déclarant, vous pouvez déduire vos charges professionnelles (matériel, logiciels, 
                          frais de déplacement) et réduire votre impôt.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                      <div>
                        <strong className="text-foreground">Construire un historique :</strong>
                        <p className="text-muted-foreground">
                          Un historique fiscal régulier facilite l'obtention de prêts, crédits et partenariats 
                          professionnels.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section Comment déclarer */}
              <Card>
                <CardHeader>
                  <CardTitle>Comment déclarer ses impôts ?</CardTitle>
                  <CardDescription>Guide selon vos revenus</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4 text-sm">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">💰 Revenus de collaborations</h4>
                      <p className="text-muted-foreground mb-2">
                        Les paiements reçus des marques pour des posts, stories ou vidéos doivent être déclarés 
                        comme revenus professionnels.
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Comment :</strong> Créez une facture pour chaque collaboration et déclarez le montant 
                        sur votre déclaration fiscale. En France, utilisez le statut micro-entrepreneur si vos revenus 
                        sont inférieurs à 188 700€.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">📱 Revenus de création de contenu</h4>
                      <p className="text-muted-foreground mb-2">
                        Les revenus publicitaires (YouTube AdSense, TikTok Creator Fund, etc.) sont des revenus 
                        professionnels à déclarer.
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Comment :</strong> Ces plateformes vous envoient généralement un relevé fiscal. 
                        Déclarez le montant total dans la catégorie "Revenus professionnels" ou "Bénéfices non commerciaux".
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">🏢 Si vous avez un business à côté</h4>
                      <p className="text-muted-foreground mb-2">
                        Si vous avez une autre activité professionnelle, vous devez déclarer tous vos revenus cumulés.
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Comment :</strong> Vous pouvez soit déclarer toutes vos activités ensemble si vous 
                        êtes en micro-entreprise, soit les séparer si vous avez des statuts différents. 
                        <strong className="text-foreground"> Consultez un expert-comptable</strong> pour optimiser 
                        votre situation fiscale.
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <h4 className="font-semibold mb-2">📅 Calendrier fiscal (France)</h4>
                      <ul className="text-muted-foreground space-y-1 ml-4">
                        <li>• <strong>Déclaration annuelle :</strong> Avril-Mai (revenus de l'année précédente)</li>
                        <li>• <strong>Déclarations trimestrielles :</strong> Si micro-entreprise (janvier, avril, juillet, octobre)</li>
                        <li>• <strong>Site officiel :</strong> impots.gouv.fr</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calculateur d'impôts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Calculateur d'impôts
                  </CardTitle>
                  <CardDescription>Estimez le montant de vos impôts (estimation indicative)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="country">Pays</Label>
                      <Select 
                        value={taxCalculator.country} 
                        onValueChange={(value) => setTaxCalculator({ ...taxCalculator, country: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="BE">Belgique</SelectItem>
                          <SelectItem value="CH">Suisse</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="US">États-Unis</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status">Statut fiscal</Label>
                      <Select 
                        value={taxCalculator.status} 
                        onValueChange={(value) => setTaxCalculator({ ...taxCalculator, status: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="micro-entreprise">Micro-entreprise / Auto-entrepreneur</SelectItem>
                          <SelectItem value="eurl">EURL</SelectItem>
                          <SelectItem value="sasu">SASU</SelectItem>
                          <SelectItem value="bic">BIC (Bénéfices Industriels et Commerciaux)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="revenue">Revenus de création de contenu (€)</Label>
                      <Input
                        id="revenue"
                        type="number"
                        placeholder="0"
                        value={taxCalculator.revenue}
                        onChange={(e) => setTaxCalculator({ ...taxCalculator, revenue: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="hasBusiness">Avez-vous un autre business ?</Label>
                      <Select 
                        value={taxCalculator.hasBusiness ? 'yes' : 'no'} 
                        onValueChange={(value) => setTaxCalculator({ ...taxCalculator, hasBusiness: value === 'yes' })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no">Non</SelectItem>
                          <SelectItem value="yes">Oui</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {taxCalculator.hasBusiness && (
                      <div>
                        <Label htmlFor="businessRevenue">Revenus du business (€)</Label>
                        <Input
                          id="businessRevenue"
                          type="number"
                          placeholder="0"
                          value={taxCalculator.businessRevenue}
                          onChange={(e) => setTaxCalculator({ ...taxCalculator, businessRevenue: e.target.value })}
                        />
                      </div>
                    )}

                    <Button onClick={calculateTax} className="w-full">
                      <Calculator className="h-4 w-4 mr-2" />
                      Calculer mes impôts
                    </Button>

                    {taxResult !== null && (
                      <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/20">
                        <div className="text-sm">
                          <p className="text-muted-foreground mb-1">Estimation de vos impôts :</p>
                          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                            {taxResult.toLocaleString('fr-FR')} €
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            ⚠️ Cette estimation est indicative. Consultez un expert-comptable pour un calcul précis 
                            tenant compte de vos déductions et de votre situation spécifique.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* FAQ */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Questions fréquentes
                  </CardTitle>
                  <CardDescription>Réponses aux questions courantes sur les impôts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {faqItems.map((faq) => (
                    <div key={faq.id} className="border rounded-lg">
                      <button
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-accent transition-colors"
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      >
                        <span className="font-medium text-sm">{faq.question}</span>
                        {expandedFAQ === faq.id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      {expandedFAQ === faq.id && (
                        <div className="px-4 pb-4">
                          <p className="text-sm text-muted-foreground">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Avertissement */}
              <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">⚠️ Important :</strong> Les informations fournies sont à titre 
                    indicatif et basées sur la réglementation fiscale générale. Les règles varient selon les pays, 
                    les statuts et les situations individuelles. Il est fortement recommandé de consulter un 
                    expert-comptable ou un conseiller fiscal pour votre situation spécifique.
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
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
                    Nous construisons actuellement l'interface complète pour la section « {currentTab.label} ».
                    Vous pourrez bientôt générer et exporter vos documents en quelques secondes.
                  </p>
                  <p>
                    Si vous avez des besoins spécifiques, notez-les et nous les intégrerons au futur générateur.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      </div>

      <Navigation />
    </div>
  );
};

export default Resources;