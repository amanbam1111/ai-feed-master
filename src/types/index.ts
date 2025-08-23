export interface Post {
  id: string;
  content: string;
  platform: 'instagram' | 'linkedin' | 'twitter' | 'facebook';
  status: 'draft' | 'scheduled' | 'published';
  scheduledDate: Date;
  createdDate: Date;
  imageUrl?: string;
  hashtags: string[];
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
    reach: number;
  };
}

export interface Analytics {
  totalPosts: number;
  engagementRate: number;
  totalReach: number;
  scheduledPosts: number;
  weeklyData: {
    date: string;
    engagement: number;
    reach: number;
    posts: number;
  }[];
  platformData: {
    platform: string;
    posts: number;
    engagement: number;
    color: string;
  }[];
}

export interface AIGeneratorOptions {
  topic: string;
  platform: 'instagram' | 'linkedin' | 'twitter' | 'facebook';
  tone: 'professional' | 'casual' | 'motivational' | 'educational' | 'funny';
  industry: 'tech' | 'fashion' | 'food' | 'business' | 'health' | 'general';
}