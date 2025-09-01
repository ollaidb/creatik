import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/mockData";
import { Search, Clock, Grid, Folder, TrendingUp } from "lucide-react";

const platformOptions = [
  { id: "all", name: "Tous" },
  { id: "tiktok", name: "TikTok" },
  { id: "instagram", name: "Instagram" },
  { id: "youtube", name: "YouTube Shorts" },
];

const contentTypeOptions = [
  { id: "all", name: "Tous types" },
  { id: "storytelling", name: "Storytelling" },
  { id: "humor", name: "Humour" },
  { id: "educational", name: "Éducatif" },
  { id: "trending", name: "Tendance" },
];

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSearch = () => {
    console.log({
      searchTerm,
      platform: selectedPlatform,
      type: selectedType,
      category: selectedCategory,
    });
    // Logique de recherche à implémenter
  };

  // Données de test pour la nouvelle structure
  const searchHistory = [
    'contenu viral',
    'tendances tiktok',
    'idées instagram',
    'storytelling',
    'humour'
  ];

  const subcategories = [
    { id: '1', name: 'Beauté' },
    { id: '2', name: 'Fitness' },
    { id: '3', name: 'Voyage' },
    { id: '4', name: 'Mode' },
    { id: '5', name: 'Santé' },
    { id: '6', name: 'Bien-être' }
  ];

  const popularTrends = [
    'contenu viral',
    'tendances tiktok',
    'idées instagram',
    'storytelling',
    'humour',
    'lifestyle',
    'technologie',
    'éducation'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-2 w-full"
    >
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Rechercher des idées de contenu..."
          className="pl-9 pr-4 py-2 rounded-full w-full bg-white dark:bg-gray-800/60 border-0 shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full bg-white dark:bg-gray-800/60 border-0 shadow-sm">Filtres</Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 max-h-[80vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Historique */}
              {searchHistory.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Votre historique
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((term, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="rounded-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Catégories */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Grid className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Rechercher par catégorie
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {categories.slice(0, 6).map((category) => (
                    <Button
                      key={category.id}
                      variant="outline"
                      className="h-16 rounded-xl bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: category.color }}
                        >
                          {category.name.charAt(0)}
                        </div>
                        <span className="text-xs">{category.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sous-catégories */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Folder className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Sous-catégories
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {subcategories.slice(0, 6).map((subcategory) => (
                    <Button
                      key={subcategory.id}
                      variant="outline"
                      className="h-16 rounded-xl bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
                          {subcategory.name.charAt(0)}
                        </div>
                        <span className="text-xs text-center">{subcategory.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tendances */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Plus recherché
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularTrends.map((trend, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="rounded-full bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                    >
                      {trend}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button onClick={handleSearch} size="icon" className="rounded-full">
          <Search className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default SearchBar;
