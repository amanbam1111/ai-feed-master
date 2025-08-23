import { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Wand2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const platformOptions = [
  { value: 'instagram', label: 'Instagram', color: 'platform-instagram' },
  { value: 'linkedin', label: 'LinkedIn', color: 'platform-linkedin' },
  { value: 'twitter', label: 'Twitter', color: 'platform-twitter' },
  { value: 'facebook', label: 'Facebook', color: 'platform-facebook' },
];

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'motivational', label: 'Motivational' },
  { value: 'educational', label: 'Educational' },
  { value: 'funny', label: 'Funny' },
];

const industryOptions = [
  { value: 'tech', label: 'Technology' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'business', label: 'Business' },
  { value: 'health', label: 'Health & Wellness' },
  { value: 'general', label: 'General' },
];

const sampleGeneratedContent = {
  instagram: {
    professional: "🚀 Innovation drives success. Our latest AI features are revolutionizing social media management. What's your biggest content challenge? Share below! #AI #Innovation #SocialMedia #ContentStrategy #BusinessGrowth",
    casual: "Just tried this amazing new AI tool and WOW! 🤯 It literally generated my entire week's content in 5 minutes. Who else is loving AI for content creation? Drop your fave tools below! ✨ #AITools #ContentCreation #SocialMedia",
    motivational: "✨ Your dreams don't have an expiration date. Every expert was once a beginner. Every pro was once an amateur. Keep pushing forward! 💪 What's one goal you're working towards this week? #MondayMotivation #Goals #Success #GrowthMindset",
  },
  linkedin: {
    professional: "The future of content marketing lies in AI-human collaboration. After implementing AI tools in our workflow, we've seen a 300% increase in content efficiency while maintaining authenticity. Key insights: 1) AI handles ideation 2) Humans add personal touch 3) Data drives optimization. What's your experience with AI in content creation?",
    casual: "Had an interesting conversation with a client today about AI in marketing. They were worried AI would replace creativity. Here's what I told them: AI doesn't replace creativity, it amplifies it. It handles the heavy lifting so you can focus on strategy and storytelling. Thoughts?",
    motivational: "Leadership isn't about having all the answers. It's about asking the right questions and empowering your team to find solutions. This week, challenge yourself to lead with curiosity instead of certainty. What questions will you ask? #Leadership #GrowthMindset #TeamDevelopment",
  }
};

export function AIGenerator() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('');
  const [tone, setTone] = useState('');
  const [industry, setIndustry] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic || !platform || !tone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation delay
    setTimeout(() => {
      const content = sampleGeneratedContent[platform as keyof typeof sampleGeneratedContent]?.[tone as keyof typeof sampleGeneratedContent.instagram] || 
        "🚀 Amazing content generated for your social media! This AI-powered post is optimized for engagement and perfectly tailored to your audience. #AI #SocialMedia #Content";
      
      setGeneratedContent(content);
      setIsGenerating(false);
      
      toast({
        title: "Content Generated!",
        description: "Your AI-optimized content is ready to use.",
      });
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
  };

  const getCharacterLimit = (platform: string) => {
    const limits = {
      twitter: 280,
      instagram: 2200,
      linkedin: 3000,
      facebook: 63206
    };
    return limits[platform as keyof typeof limits] || 2200;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">AI Content Generator</h1>
        <p className="text-muted-foreground">Create engaging, platform-optimized content in seconds</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="glass-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Content Parameters</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="topic" className="text-foreground">Topic or Brief Description *</Label>
              <Textarea
                id="topic"
                placeholder="e.g., New product launch, industry insights, motivational quote..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1 bg-accent/30 border-accent/50"
              />
            </div>

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

            <div>
              <Label htmlFor="tone" className="text-foreground">Tone *</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="mt-1 bg-accent/30 border-accent/50">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="industry" className="text-foreground">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className="mt-1 bg-accent/30 border-accent/50">
                  <SelectValue placeholder="Select industry (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {industryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full glass-button"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Generated Content */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Generated Content</h2>
            {generatedContent && (
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
                <Copy className="w-4 h-4" />
                Copy
              </Button>
            )}
          </div>

          {generatedContent ? (
            <div className="space-y-4">
              <div className="p-4 bg-accent/30 rounded-lg border border-accent/50">
                <p className="text-foreground whitespace-pre-wrap">{generatedContent}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Characters: {generatedContent.length}</span>
                {platform && (
                  <span>
                    Limit: {getCharacterLimit(platform)} 
                    <span className={generatedContent.length > getCharacterLimit(platform) ? 'text-destructive ml-1' : 'text-success ml-1'}>
                      ({getCharacterLimit(platform) - generatedContent.length} remaining)
                    </span>
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleGenerate} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Regenerate
                </Button>
                <Button size="sm" className="glass-button">
                  Use This Content
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Fill in the parameters and click generate to create AI-optimized content</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}