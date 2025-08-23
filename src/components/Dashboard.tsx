import { TrendingUp, Users, Calendar, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { sampleAnalytics, samplePosts } from '@/data/sampleData';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  trend: 'up' | 'down';
}

function MetricCard({ title, value, change, icon: Icon, trend }: MetricCardProps) {
  return (
    <Card className="glass-card p-6 hover:shadow-elevated transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className={`text-sm mt-1 ${trend === 'up' ? 'text-success' : 'text-destructive'}`}>
            {change}
          </p>
        </div>
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </Card>
  );
}

interface RecentActivityProps {
  posts: typeof samplePosts;
}

function RecentActivity({ posts }: RecentActivityProps) {
  const recentPosts = posts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
    .slice(0, 5);

  const getPlatformColor = (platform: string) => {
    const colors = {
      instagram: 'platform-instagram',
      linkedin: 'platform-linkedin',
      twitter: 'platform-twitter',
      facebook: 'platform-facebook'
    };
    return colors[platform as keyof typeof colors] || 'bg-primary';
  };

  return (
    <Card className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentPosts.map((post) => (
          <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors">
            <div className={`w-3 h-3 rounded-full ${getPlatformColor(post.platform)} mt-2`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{post.content}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="capitalize">{post.platform}</span>
                <span>{new Date(post.scheduledDate).toLocaleDateString()}</span>
                {post.engagement && (
                  <span>{post.engagement.likes} likes</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

interface DashboardProps {
  onCreatePost: () => void;
  onOpenAIGenerator: () => void;
}

export function Dashboard({ onCreatePost, onOpenAIGenerator }: DashboardProps) {
  const { totalPosts, engagementRate, totalReach, scheduledPosts } = sampleAnalytics;

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-4">
        <Button onClick={onCreatePost} className="glass-button">
          <Zap className="w-4 h-4 mr-2" />
          Create New Post
        </Button>
        <Button onClick={onOpenAIGenerator} variant="outline" className="glass-card border-primary/20 hover:bg-primary/10">
          <TrendingUp className="w-4 h-4 mr-2" />
          AI Content Generator
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Posts"
          value={totalPosts}
          change="+12% from last month"
          icon={Calendar}
          trend="up"
        />
        <MetricCard
          title="Engagement Rate"
          value={`${engagementRate}%`}
          change="+0.8% from last month"
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard
          title="Total Reach"
          value={`${(totalReach / 1000).toFixed(1)}k`}
          change="+23% from last month"
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Scheduled Posts"
          value={scheduledPosts}
          change="5 for next week"
          icon={Zap}
          trend="up"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity posts={samplePosts} />
        
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
          <div className="space-y-4">
            {sampleAnalytics.platformData.map((platform) => (
              <div key={platform.platform} className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-sm font-medium text-foreground">{platform.platform}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{platform.posts} posts</p>
                  <p className="text-xs text-muted-foreground">{platform.engagement}% engagement</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}