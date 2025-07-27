interface TrendingTopic {
  id: string;
  title: string;
  description: string;
  platform: 'twitter' | 'reddit' | 'instagram' | 'tiktok';
  hashtags: string[];
  engagement: number;
  category: string;
}

class SocialTrendsService {
  // Reddit API (gratuit)
  async getRedditTrends(): Promise<TrendingTopic[]> {
    try {
      const response = await fetch('https://www.reddit.com/r/popular.json');
      const data = await response.json();
      
      return data.data.children.slice(0, 10).map((post: any) => ({
        id: post.data.id,
        title: post.data.title,
        description: post.data.selftext || '',
        platform: 'reddit' as const,
        hashtags: this.extractHashtags(post.data.title + ' ' + post.data.selftext),
        engagement: post.data.score + post.data.num_comments,
        category: this.categorizeContent(post.data.title)
      }));
    } catch (error) {
      console.error('Erreur Reddit API:', error);
      return [];
    }
  }

  // Twitter Trends (simulation - nécessite API key)
  async getTwitterTrends(): Promise<TrendingTopic[]> {
    // Simulation - en production, utilisez l'API Twitter officielle
    return [
      {
        id: '1',
        title: 'Tendances Tech 2024',
        description: 'Les nouvelles technologies qui dominent',
        platform: 'twitter',
        hashtags: ['#Tech2024', '#Innovation'],
        engagement: 15000,
        category: 'technology'
      }
    ];
  }

  // Extraction des hashtags
  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
    return text.match(hashtagRegex) || [];
  }

  // Catégorisation automatique
  private categorizeContent(title: string): string {
    const categories = {
      technology: ['tech', 'ai', 'app', 'software', 'digital'],
      lifestyle: ['life', 'style', 'fashion', 'beauty', 'health'],
      entertainment: ['movie', 'music', 'game', 'show', 'celebrity'],
      business: ['business', 'startup', 'entrepreneur', 'money', 'finance']
    };

    const lowerTitle = title.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => lowerTitle.includes(keyword))) {
        return category;
      }
    }
    return 'general';
  }

  // Service principal
  async getAllTrends(): Promise<TrendingTopic[]> {
    const [redditTrends, twitterTrends] = await Promise.all([
      this.getRedditTrends(),
      this.getTwitterTrends()
    ]);

    return [...redditTrends, ...twitterTrends]
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 20);
  }
}

export const socialTrendsService = new SocialTrendsService(); 