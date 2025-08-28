export type Category = {
  id: string;
  name: string;
  color: string; // Changé de union type vers string pour accepter les valeurs de la DB
};
export type ContentIdea = {
  id: string;
  title: string;
  description: string;
  platform: "tiktok" | "instagram" | "youtube" | "blog" | "article" | "all";
  type: "storytelling" | "humor" | "educational" | "trending";
  category: string;
  popularity: number;
  isFavorite?: boolean;
};
export type Challenge = {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
};
export type MarketplaceItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  seller: string;
  type: "content_idea" | "concept" | "database_contribution";
  category: string;
  subcategory?: string;
  target?: string;
  format?: string;
  preview?: string;
  createdAt: Date;
  likes: number;
};

// Types pour les guides de catégories
export type CategoryGuideTip = {
  title: string;
  description: string;
  icon: string;
  color: string;
};

export type CategoryGuideExample = {
  type: string;
  items: string[];
};

export type CategoryGuideCharacteristic = {
  title: string;
  description: string;
  icon: string;
  color: string;
};

export type CategoryGuidePlatform = {
  name: string;
  icon: string;
  color: string;
};

export type CategoryGuide = {
  id: string;
  category_id: string;
  title: string;
  description: string;
  how_to: string;
  personalization: string;
  tips: CategoryGuideTip[];
  examples: CategoryGuideExample[];
  characteristics: CategoryGuideCharacteristic[];
  platforms: CategoryGuidePlatform[];
  created_at: string;
  updated_at: string;
};
