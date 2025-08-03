export interface DatabaseCategory {
  id: string;
  name: string;
  color: 'primary' | 'orange' | 'green' | 'pink';
  description?: string;
  created_at: string;
  updated_at: string;
}
export interface DatabaseSubcategory {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  category?: DatabaseCategory;
}
export interface DatabaseContentTitle {
  id: string;
  subcategory_id: string;
  title: string;
  type?: 'title' | 'hashtag' | 'hook';
  format?: 'video-longue' | 'video-courte' | 'image' | 'all';
  platform?: 'tiktok' | 'instagram' | 'youtube' | 'blog' | 'article' | 'all';
  created_at: string;
}
export interface DatabaseExemplaryAccount {
  id: string;
  subcategory_id: string;
  account_name: string;
  platform: 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'blog' | 'article' | 'other';
  account_url: string;
  description?: string;
  created_at: string;
}
export interface DatabaseContentExample {
  id: string;
  subcategory_id: string;
  title: string;
  creator_name: string;
  description?: string;
  content_url: string;
  format?: 'video-longue' | 'video-courte' | 'image' | 'story';
  platform?: 'tiktok' | 'instagram' | 'youtube' | 'blog' | 'article' | 'other';
  created_at: string;
}
export interface DatabaseInspiringContent {
  id: string;
  subcategory_id: string;
  title: string;
  hook?: string;
  hashtags?: string[];
  account_example?: string;
  account_url?: string;
  video_url?: string;
  format?: 'storytime' | 'tips' | 'humour' | 'tutorial' | 'challenge' | 'other';
  platform?: 'tiktok' | 'instagram' | 'youtube' | 'blog' | 'article' | 'all';
  status?: 'idee-brute' | 'brouillon' | 'pret';
  popularity_score?: number;
  created_at: string;
  updated_at: string;
}
