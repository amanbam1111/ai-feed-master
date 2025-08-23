import { useState } from 'react';
import { Search, Filter, MoreHorizontal, Edit, Copy, Trash2, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { samplePosts } from '@/data/sampleData';
import { cn } from '@/lib/utils';

const statusColors = {
  draft: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20',
  scheduled: 'bg-blue-500/20 text-blue-500 border-blue-500/20',
  published: 'bg-green-500/20 text-green-500 border-green-500/20'
};

const platformColors = {
  instagram: 'bg-pink-500/20 text-pink-400 border-pink-500/20',
  linkedin: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
  twitter: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/20',
  facebook: 'bg-blue-700/20 text-blue-300 border-blue-700/20'
};

export function PostsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');

  const filteredPosts = samplePosts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || post.platform === platformFilter;
    
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-accent/30 border-accent/50"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-accent/30 border-accent/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>

            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="w-32 bg-accent/30 border-accent/50">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredPosts.length} of {samplePosts.length} posts
          </span>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="glass-card p-6 hover:shadow-elevated transition-all duration-300">
            <div className="flex items-start gap-4">
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={cn("text-xs", statusColors[post.status])}>
                      {post.status}
                    </Badge>
                    <Badge variant="outline" className={cn("text-xs", platformColors[post.platform])}>
                      {post.platform}
                    </Badge>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Edit className="w-4 h-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Copy className="w-4 h-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Calendar className="w-4 h-4" />
                        Reschedule
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-foreground mb-3 line-clamp-3">{post.content}</p>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>Scheduled: {formatDate(post.scheduledDate)}</span>
                  {post.engagement && (
                    <>
                      <span>{post.engagement.likes} likes</span>
                      <span>{post.engagement.comments} comments</span>
                      <span>{post.engagement.reach} reach</span>
                    </>
                  )}
                </div>

                {post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.hashtags.slice(0, 3).map((hashtag, index) => (
                      <span key={index} className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                        {hashtag}
                      </span>
                    ))}
                    {post.hashtags.length > 3 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{post.hashtags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Post Preview */}
              <div className="w-20 h-20 bg-accent/30 rounded-lg flex items-center justify-center">
                <span className="text-2xl">
                  {post.platform === 'instagram' ? '📸' : 
                   post.platform === 'linkedin' ? '💼' : 
                   post.platform === 'twitter' ? '🐦' : '👥'}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <Card className="glass-card p-12 text-center">
          <div className="text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No posts found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        </Card>
      )}
    </div>
  );
}