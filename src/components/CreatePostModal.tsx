import { useState } from 'react';
import { X, Calendar, Clock, Hash, Image, Type } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const platformOptions = [
  { value: 'instagram', label: 'Instagram', limit: 2200, color: 'platform-instagram' },
  { value: 'linkedin', label: 'LinkedIn', limit: 3000, color: 'platform-linkedin' },
  { value: 'twitter', label: 'Twitter', limit: 280, color: 'platform-twitter' },
  { value: 'facebook', label: 'Facebook', limit: 63206, color: 'platform-facebook' },
];

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [mode, setMode] = useState<'draft' | 'schedule'>('schedule');
  const { toast } = useToast();

  const selectedPlatform = platformOptions.find(p => p.value === platform);
  const characterCount = content.length;
  const characterLimit = selectedPlatform?.limit || 2200;
  const isOverLimit = characterCount > characterLimit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || !platform) {
      toast({
        title: "Missing Information",
        description: "Please fill in the content and select a platform.",
        variant: "destructive"
      });
      return;
    }

    if (mode === 'schedule' && (!scheduledDate || !scheduledTime)) {
      toast({
        title: "Missing Schedule",
        description: "Please set a date and time for your scheduled post.",
        variant: "destructive"
      });
      return;
    }

    if (isOverLimit) {
      toast({
        title: "Content Too Long",
        description: `Please reduce your content to under ${characterLimit} characters.`,
        variant: "destructive"
      });
      return;
    }

    // Here you would normally save the post
    toast({
      title: mode === 'draft' ? "Draft Saved!" : "Post Scheduled!",
      description: mode === 'draft' 
        ? "Your post has been saved as a draft." 
        : `Your post will be published on ${scheduledDate} at ${scheduledTime}.`,
    });

    // Reset form
    setContent('');
    setPlatform('');
    setScheduledDate('');
    setScheduledTime('');
    setHashtags('');
    setMode('schedule');
    onClose();
  };

  const generateHashtags = () => {
    const suggestions = ['#socialmedia', '#content', '#marketing', '#AI', '#automation'];
    setHashtags(suggestions.join(' '));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-glass-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Create New Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Platform Selection */}
          <div>
            <Label htmlFor="platform" className="text-foreground">Platform *</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="mt-1 bg-accent/30 border-accent/50">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${option.color}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content" className="text-foreground">Content *</Label>
            <Textarea
              id="content"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 min-h-32 bg-accent/30 border-accent/50 resize-none"
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Type className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Rich text formatting available
                </span>
              </div>
              <span className={cn(
                "text-sm",
                isOverLimit ? "text-destructive" : "text-muted-foreground"
              )}>
                {characterCount}/{characterLimit}
              </span>
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="hashtags" className="text-foreground">Hashtags</Label>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={generateHashtags}
                className="text-primary hover:text-primary/80"
              >
                <Hash className="w-4 h-4 mr-1" />
                Generate
              </Button>
            </div>
            <Input
              id="hashtags"
              placeholder="#hashtag #content #marketing"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="mt-1 bg-accent/30 border-accent/50"
            />
          </div>

          {/* Image Upload Placeholder */}
          <div>
            <Label className="text-foreground">Media</Label>
            <div className="mt-1 border-2 border-dashed border-accent/50 rounded-lg p-8 text-center">
              <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop images/videos
              </p>
            </div>
          </div>

          {/* Schedule Options */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                type="button"
                variant={mode === 'draft' ? 'default' : 'outline'}
                onClick={() => setMode('draft')}
                className={mode === 'draft' ? 'glass-button' : 'glass-card border-accent/50'}
              >
                Save as Draft
              </Button>
              <Button
                type="button"
                variant={mode === 'schedule' ? 'default' : 'outline'}
                onClick={() => setMode('schedule')}
                className={mode === 'schedule' ? 'glass-button' : 'glass-card border-accent/50'}
              >
                Schedule Post
              </Button>
            </div>

            {mode === 'schedule' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="text-foreground">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="mt-1 bg-accent/30 border-accent/50"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="time" className="text-foreground">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="mt-1 bg-accent/30 border-accent/50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          {content && platform && (
            <div className="border border-accent/50 rounded-lg p-4 bg-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${selectedPlatform?.color}`} />
                <span className="text-sm font-medium text-foreground">
                  {selectedPlatform?.label} Preview
                </span>
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap">{content}</p>
              {hashtags && (
                <p className="text-sm text-primary mt-2">{hashtags}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="glass-button"
              disabled={!content.trim() || !platform || isOverLimit}
            >
              {mode === 'draft' ? 'Save Draft' : 'Schedule Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}