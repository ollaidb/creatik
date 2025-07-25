import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Plus, Heart, Tag, ExternalLink, Filter } from "lucide-react";
import { MarketplaceItem } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// Données mockées pour l'exemple
const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: "1",
    title: "Comment créer des vidéos captivantes pour TikTok",
    description: "Un guide complet avec 10 idées de contenus qui garantissent l'engagement sur TikTok. Inclut scripts, conseils de cadrage et stratégie de hashtags.",
    price: 9.99,
    seller: "CreativeDigital",
    type: "content_idea",
    category: "education",
    subcategory: "tutorials",
    target: "Créateurs débutants",
    format: "Guide PDF + Scripts vidéo",
    createdAt: new Date(),
    likes: 24
  },
  {
    id: "2",
    title: "Concept de compte Instagram fitness",
    description: "Stratégie complète pour un compte fitness avec planification éditoriale sur 3 mois, modèles de posts, palette de couleurs et ton de voix défini.",
    price: 29.99,
    seller: "FitCreator",
    type: "concept",
    category: "health",
    subcategory: "fitness",
    target: "Coachs de fitness",
    format: "Dossier complet + Canva templates",
    createdAt: new Date(),
    likes: 42
  },
  {
    id: "3",
    title: "Sous-catégorie Business B2B",
    description: "Contribution à la base de données CréaTik avec une nouvelle sous-catégorie pour le secteur B2B.",
    price: 0,
    seller: "BusinessPro",
    type: "database_contribution",
    category: "business",
    createdAt: new Date(),
    likes: 8
  },
  {
    id: "4",
    title: "30 idées de Reels pour entrepreneurs",
    description: "Collection de 30 idées de Reels prêtes à l'emploi pour entrepreneurs avec scripts, musiques recommandées et timing.",
    price: 14.99,
    seller: "ReelsMaster",
    type: "content_idea",
    category: "business",
    subcategory: "marketing",
    target: "Entrepreneurs et TPE",
    format: "Document Word + Planning Excel",
    createdAt: new Date(),
    likes: 37
  },
];
// Schéma de validation pour le formulaire de création d'annonce
const marketplaceFormSchema = z.object({
  publishType: z.enum(["database_contribution", "content_idea", "concept"]),
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  category: z.string().min(1, "La catégorie est requise"),
  subcategory: z.string().optional(),
  price: z.coerce.number().min(0, "Le prix doit être supérieur ou égal à 0").optional(),
  target: z.string().optional(),
  format: z.string().optional(),
});
type MarketplaceFormValues = z.infer<typeof marketplaceFormSchema>;
const Marketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [openPublishDialog, setOpenPublishDialog] = useState(false);
  const { toast } = useToast();
  const form = useForm<MarketplaceFormValues>({
    resolver: zodResolver(marketplaceFormSchema),
    defaultValues: {
      publishType: "content_idea",
      title: "",
      description: "",
      category: "",
      subcategory: "",
      price: 0,
      target: "",
      format: "",
    },
  });
  // Surveiller le type de publication pour afficher les champs appropriés
  const publishType = form.watch("publishType");
  const handlePublish = (values: MarketplaceFormValues) => {
    // Afficher un message de succès
    toast({
      title: "Publication soumise avec succès",
      description: `Votre ${
        values.publishType === "database_contribution" ? "contribution" :
        values.publishType === "content_idea" ? "idée de contenu" : "concept"
      } a été soumise et sera bientôt disponible.`,
    });
    // Fermer le dialogue et réinitialiser le formulaire
    setOpenPublishDialog(false);
    form.reset();
  };
  const handleBuy = (item: MarketplaceItem) => {
    toast({
      title: "Achat en cours",
      description: `Vous allez être redirigé vers le processus d'achat pour "${item.title}"`,
    });
  };
  const handleLike = (id: string) => {
    toast({
      title: "Ajouté aux favoris",
      description: "Cette annonce a été ajoutée à vos favoris.",
    });
  };
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
  return (
    <div className="min-h-screen pb-20">
      <header className="bg-background border-b p-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <Button onClick={() => setOpenPublishDialog(true)} className="flex items-center gap-2">
            <Plus size={18} />
            Publier
          </Button>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="browse">Parcourir</TabsTrigger>
            <TabsTrigger value="my-purchases">Mes achats</TabsTrigger>
            <TabsTrigger value="my-listings">Mes annonces</TabsTrigger>
          </TabsList>
          <TabsContent value="browse" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Annonces récentes</h2>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter size={16} />
                Filtrer
              </Button>
            </div>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {mockMarketplaceItems.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <Card className="h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            item.type === "content_idea" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" : 
                            item.type === "concept" ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" : 
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          }`}>
                            {item.type === "content_idea" ? "Idée de contenu" : 
                             item.type === "concept" ? "Concept" : 
                             "Contribution"}
                          </span>
                          {item.type !== "database_contribution" && (
                            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                              {item.price.toFixed(2)} €
                            </span>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleLike(item.id)}>
                          <Heart size={16} />
                        </Button>
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 pt-0">
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="bg-muted text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Tag size={12} />
                          {item.category}
                        </span>
                        {item.subcategory && (
                          <span className="bg-muted text-xs px-2 py-1 rounded-full">
                            {item.subcategory}
                          </span>
                        )}
                      </div>
                      {(item.target || item.format) && (
                        <div className="text-sm text-muted-foreground">
                          {item.target && <div className="mb-1">Cible : {item.target}</div>}
                          {item.format && <div>Format : {item.format}</div>}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-2 mt-auto">
                      <div className="flex justify-between items-center w-full">
                        <div className="text-xs text-muted-foreground">
                          Par {item.seller} • {item.likes} likes
                        </div>
                        {item.type !== "database_contribution" ? (
                          <Button size="sm" onClick={() => handleBuy(item)}>
                            Acheter
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            Voir plus
                          </Button>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
          <TabsContent value="my-purchases">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Aucun achat pour le moment</h3>
              <p className="text-muted-foreground mb-6">
                Explorez la marketplace et achetez des idées de contenu ou des concepts complets.
              </p>
              <Button onClick={() => setActiveTab("browse")}>
                Explorer la marketplace
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="my-listings">
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Vous n'avez pas encore d'annonces</h3>
              <p className="text-muted-foreground mb-6">
                Publiez vos idées de contenu ou vos concepts pour les proposer à la communauté.
              </p>
              <Button onClick={() => setOpenPublishDialog(true)}>
                Créer une annonce
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Dialog open={openPublishDialog} onOpenChange={setOpenPublishDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Publier sur la marketplace</DialogTitle>
            <DialogDescription>
              Contribuez à la communauté en enrichissant la base de données CréaTik ou proposez vos idées à la vente.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePublish)} className="space-y-4">
              <FormField
                control={form.control}
                name="publishType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de publication</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="database_contribution">Contribution à la base de données</SelectItem>
                        <SelectItem value="content_idea">Idée de contenu à vendre</SelectItem>
                        <SelectItem value="concept">Concept complet à vendre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Le type de contenu que vous souhaitez publier.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input placeholder="Titre de votre publication" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="education">Éducation</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="health">Santé</SelectItem>
                        <SelectItem value="entertainment">Divertissement</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subcategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sous-catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une sous-catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tutorials">Tutoriels</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="cooking">Cuisine</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez votre publication en détail" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {publishType !== "database_contribution" && (
                <>
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prix (€)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="target"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cible</FormLabel>
                        <FormControl>
                          <Input placeholder="À qui s'adresse cette publication ?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Format</FormLabel>
                        <FormControl>
                          <Input placeholder="Format de livraison" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <DialogFooter>
                <Button type="submit">Publier</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Navigation />
    </div>
  );
};
export default Marketplace;
