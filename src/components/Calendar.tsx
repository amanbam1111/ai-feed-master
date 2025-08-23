import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { samplePosts } from '@/data/sampleData';
import { cn } from '@/lib/utils';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getPlatformColor(platform: string) {
  const colors = {
    instagram: 'bg-pink-500',
    linkedin: 'bg-blue-500',
    twitter: 'bg-cyan-500',
    facebook: 'bg-blue-700'
  };
  return colors[platform as keyof typeof colors] || 'bg-primary';
}

interface CalendarProps {
  onCreatePost: () => void;
}

export function Calendar({ onCreatePost }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(year, month + (direction === 'next' ? 1 : -1), 1));
  };

  const getPostsForDate = (date: Date) => {
    return samplePosts.filter(post => {
      const postDate = new Date(post.scheduledDate);
      return postDate.toDateString() === date.toDateString();
    });
  };

  const getDaysArray = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate?.toDateString() === date.toDateString();
  };

  const selectedDatePosts = selectedDate ? getPostsForDate(selectedDate) : [];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Calendar */}
      <div className="xl:col-span-3">
        <Card className="glass-card p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {MONTHS[month]} {year}
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="glass-card border-accent/50 hover:bg-accent/50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="glass-card border-accent/50 hover:bg-accent/50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {DAYS.map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}

            {/* Calendar Days */}
            {getDaysArray().map((date, index) => {
              if (!date) {
                return <div key={index} className="p-3 h-24" />;
              }

              const posts = getPostsForDate(date);
              const dayIsToday = isToday(date);
              const dayIsSelected = isSelected(date);

              return (
                <div
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "p-2 h-24 border border-accent/30 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/30",
                    dayIsToday && "border-primary bg-primary/10",
                    dayIsSelected && "border-primary bg-primary/20 shadow-glow"
                  )}
                >
                  <div className="text-sm font-medium text-foreground mb-1">
                    {date.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {posts.slice(0, 2).map((post, idx) => (
                      <div
                        key={`${post.id}-${idx}`}
                        className={cn(
                          "text-xs px-2 py-1 rounded text-white truncate",
                          getPlatformColor(post.platform)
                        )}
                      >
                        {post.platform}
                      </div>
                    ))}
                    {posts.length > 2 && (
                      <div className="text-xs text-muted-foreground px-2">
                        +{posts.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Quick Add */}
        <Card className="glass-card p-4">
          <Button onClick={onCreatePost} className="w-full glass-button">
            <Plus className="w-4 h-4 mr-2" />
            Quick Add Post
          </Button>
        </Card>

        {/* Selected Date Posts */}
        <Card className="glass-card p-4">
          <h3 className="font-semibold text-foreground mb-4">
            {selectedDate 
              ? `Posts for ${selectedDate.toLocaleDateString()}` 
              : 'Select a date to view posts'
            }
          </h3>
          
          {selectedDatePosts.length > 0 ? (
            <div className="space-y-3">
              {selectedDatePosts.map((post) => (
                <div key={post.id} className="p-3 bg-accent/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("w-3 h-3 rounded-full", getPlatformColor(post.platform))} />
                    <Badge variant="outline" className="text-xs capitalize">
                      {post.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{post.content}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(post.scheduledDate).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : selectedDate ? (
            <p className="text-muted-foreground text-sm">No posts scheduled for this date</p>
          ) : (
            <p className="text-muted-foreground text-sm">Click on a date to see scheduled posts</p>
          )}
        </Card>

        {/* Quick Stats */}
        <Card className="glass-card p-4">
          <h3 className="font-semibold text-foreground mb-4">This Month</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Posts</span>
              <span className="text-sm font-medium text-foreground">
                {samplePosts.filter(post => 
                  new Date(post.scheduledDate).getMonth() === month
                ).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Scheduled</span>
              <span className="text-sm font-medium text-foreground">
                {samplePosts.filter(post => 
                  post.status === 'scheduled' && 
                  new Date(post.scheduledDate).getMonth() === month
                ).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Published</span>
              <span className="text-sm font-medium text-foreground">
                {samplePosts.filter(post => 
                  post.status === 'published' && 
                  new Date(post.scheduledDate).getMonth() === month
                ).length}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}