import { Post, Analytics } from '../types';

export const samplePosts: Post[] = [
  {
    id: '1',
    content: '🚀 Excited to announce our new AI-powered features! The future of social media management is here. #AI #SocialMedia #Innovation',
    platform: 'linkedin',
    status: 'published',
    scheduledDate: new Date('2024-01-15T10:00:00'),
    createdDate: new Date('2024-01-14T15:30:00'),
    hashtags: ['#AI', '#SocialMedia', '#Innovation'],
    engagement: {
      likes: 245,
      comments: 18,
      shares: 32,
      reach: 3420
    }
  },
  {
    id: '2',
    content: '✨ Behind the scenes of our latest product photoshoot! Swipe to see the magic happen ➡️ #BehindTheScenes #Photography #Creative',
    platform: 'instagram',
    status: 'scheduled',
    scheduledDate: new Date('2024-01-20T16:00:00'),
    createdDate: new Date('2024-01-18T09:15:00'),
    hashtags: ['#BehindTheScenes', '#Photography', '#Creative']
  },
  {
    id: '3',
    content: 'Quick tip: The best time to post on social media varies by platform and audience. Use analytics to find YOUR optimal posting times! 📊',
    platform: 'twitter',
    status: 'published',
    scheduledDate: new Date('2024-01-16T14:30:00'),
    createdDate: new Date('2024-01-16T08:20:00'),
    hashtags: ['#SocialMediaTips', '#Analytics', '#Marketing'],
    engagement: {
      likes: 89,
      comments: 12,
      shares: 24,
      reach: 1560
    }
  },
  {
    id: '4',
    content: '🎯 Content planning doesn\'t have to be overwhelming! Here are 5 simple steps to streamline your social media strategy...',
    platform: 'linkedin',
    status: 'draft',
    scheduledDate: new Date('2024-01-22T11:00:00'),
    createdDate: new Date('2024-01-19T13:45:00'),
    hashtags: ['#ContentStrategy', '#SocialMediaMarketing', '#Productivity']
  },
  {
    id: '5',
    content: '🌟 Monday motivation: Your only limit is your mind. What are you creating today? Share your projects below! 👇',
    platform: 'instagram',
    status: 'scheduled',
    scheduledDate: new Date('2024-01-22T09:00:00'),
    createdDate: new Date('2024-01-20T16:30:00'),
    hashtags: ['#MondayMotivation', '#Creativity', '#Inspiration']
  },
  {
    id: '6',
    content: 'The power of AI in content creation is incredible! Just generated 10 unique post ideas in under 30 seconds ⚡ #AI #ContentCreation',
    platform: 'twitter',
    status: 'published',
    scheduledDate: new Date('2024-01-17T15:45:00'),
    createdDate: new Date('2024-01-17T10:20:00'),
    hashtags: ['#AI', '#ContentCreation', '#Productivity'],
    engagement: {
      likes: 156,
      comments: 23,
      shares: 45,
      reach: 2340
    }
  },
  {
    id: '7',
    content: '📈 Data-driven decision making is the key to social media success. Here\'s how we increased our engagement by 300% last quarter...',
    platform: 'linkedin',
    status: 'scheduled',
    scheduledDate: new Date('2024-01-23T10:30:00'),
    createdDate: new Date('2024-01-21T14:15:00'),
    hashtags: ['#DataDriven', '#SocialMediaStrategy', '#Growth']
  },
  {
    id: '8',
    content: '🎨 Color psychology in social media: Did you know that blue increases trust while orange creates urgency? Choose your brand colors wisely!',
    platform: 'facebook',
    status: 'published',
    scheduledDate: new Date('2024-01-18T12:00:00'),
    createdDate: new Date('2024-01-17T16:45:00'),
    hashtags: ['#ColorPsychology', '#Branding', '#Design'],
    engagement: {
      likes: 78,
      comments: 15,
      shares: 28,
      reach: 1890
    }
  }
];

export const sampleAnalytics: Analytics = {
  totalPosts: 145,
  engagementRate: 4.8,
  totalReach: 125600,
  scheduledPosts: 23,
  weeklyData: [
    { date: '2024-01-15', engagement: 320, reach: 4500, posts: 3 },
    { date: '2024-01-16', engagement: 280, reach: 3800, posts: 2 },
    { date: '2024-01-17', engagement: 450, reach: 6200, posts: 4 },
    { date: '2024-01-18', engagement: 380, reach: 5100, posts: 3 },
    { date: '2024-01-19', engagement: 520, reach: 7300, posts: 5 },
    { date: '2024-01-20', engagement: 290, reach: 4200, posts: 2 },
    { date: '2024-01-21', engagement: 410, reach: 5800, posts: 4 }
  ],
  platformData: [
    { platform: 'Instagram', posts: 45, engagement: 5.2, color: '#E1306C' },
    { platform: 'LinkedIn', posts: 38, engagement: 3.8, color: '#0077B5' },
    { platform: 'Twitter', posts: 52, engagement: 4.1, color: '#1DA1F2' },
    { platform: 'Facebook', posts: 10, engagement: 2.9, color: '#1877F2' }
  ]
};