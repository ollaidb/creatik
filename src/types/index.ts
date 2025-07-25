export type Category = {
  id: string;
  name: string;
  color: string; // Changé de union type vers string pour accepter les valeurs de la DB
};
export type ContentIdea = {
  id: string;
  title: string;
  description: string;
  platform: "tiktok" | "instagram" | "youtube" | "all";
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
