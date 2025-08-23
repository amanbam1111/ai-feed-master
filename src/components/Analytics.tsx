import { TrendingUp, Users, Heart, Share2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
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
          <p className="text-3xl font-bold text-foreground">{value}</p>
          <p className={`text-sm mt-1 flex items-center gap-1 ${trend === 'up' ? 'text-success' : 'text-destructive'}`}>
            <TrendingUp className={`w-3 h-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
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

export function Analytics() {
  const { totalPosts, engagementRate, totalReach, weeklyData, platformData } = sampleAnalytics;

  // Calculate total engagement
  const totalEngagement = samplePosts.reduce((sum, post) => {
    if (post.engagement) {
      return sum + post.engagement.likes + post.engagement.comments + post.engagement.shares;
    }
    return sum;
  }, 0);

  // Top performing posts
  const topPosts = samplePosts
    .filter(post => post.engagement)
    .sort((a, b) => {
      const aTotal = (a.engagement?.likes || 0) + (a.engagement?.comments || 0) + (a.engagement?.shares || 0);
      const bTotal = (b.engagement?.likes || 0) + (b.engagement?.comments || 0) + (b.engagement?.shares || 0);
      return bTotal - aTotal;
    })
    .slice(0, 5);

  // Engagement trend data
  const engagementTrendData = weeklyData.map(day => ({
    ...day,
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Engagement"
          value={totalEngagement.toLocaleString()}
          change="+18.2% vs last week"
          icon={Heart}
          trend="up"
        />
        <MetricCard
          title="Engagement Rate"
          value={`${engagementRate}%`}
          change="+0.8% vs last week"
          icon={TrendingUp}
          trend="up"
        />
        <MetricCard
          title="Total Reach"
          value={`${(totalReach / 1000).toFixed(1)}K`}
          change="+23.1% vs last week"
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Avg. Shares"
          value="28.5"
          change="+12.3% vs last week"
          icon={Share2}
          trend="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Engagement Trend Chart */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Engagement Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Platform Performance */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Platform Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="platform" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar 
                  dataKey="engagement" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Platform Distribution */}
        <Card className="glass-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Content Distribution</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="posts"
                >
                  {platformData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {platformData.map((platform) => (
              <div key={platform.platform} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: platform.color }}
                  />
                  <span className="text-foreground">{platform.platform}</span>
                </div>
                <span className="text-muted-foreground">{platform.posts} posts</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Performing Posts */}
        <Card className="glass-card p-6 xl:col-span-2">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Posts</h3>
          <div className="space-y-4">
            {topPosts.map((post, index) => {
              const totalEngagement = (post.engagement?.likes || 0) + 
                                     (post.engagement?.comments || 0) + 
                                     (post.engagement?.shares || 0);
              
              return (
                <div key={post.id} className="flex items-start gap-4 p-3 bg-accent/30 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-2 mb-1">{post.content}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="capitalize">{post.platform}</span>
                      <span>{post.engagement?.likes || 0} likes</span>
                      <span>{post.engagement?.comments || 0} comments</span>
                      <span>{post.engagement?.shares || 0} shares</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{totalEngagement}</p>
                    <p className="text-xs text-muted-foreground">total engagement</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}