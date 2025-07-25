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
import { Search } from "lucide-react";
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
      searchTerm,
      platform: selectedPlatform,
      type: selectedType,
      category: selectedCategory,
    });
    // Logique de recherche à implémenter
  };
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
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Plateforme</h4>
                <div className="flex flex-wrap gap-2">
                  {platformOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant={selectedPlatform === option.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPlatform(option.id)}
                      className="rounded-full"
                    >
                      {option.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Type de contenu</h4>
                <div className="flex flex-wrap gap-2">
                  {contentTypeOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant={selectedType === option.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(option.id)}
                      className="rounded-full"
                    >
                      {option.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Catégorie</h4>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                    className="rounded-full"
                  >
                    Toutes
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="rounded-full"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={handleSearch}>
                Rechercher
              </Button>
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
