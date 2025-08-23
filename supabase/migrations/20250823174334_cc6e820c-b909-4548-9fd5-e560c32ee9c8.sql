-- Create profiles table for user information and subscription management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'business')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  posts_used_this_month INTEGER NOT NULL DEFAULT 0,
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due')),
  subscription_end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create social_posts table for storing user posts
CREATE TABLE public.social_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'linkedin', 'twitter', 'facebook')),
  scheduled_time TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  engagement_data JSONB DEFAULT '{}',
  image_url TEXT,
  hashtags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create ai_generations table for tracking AI content generation
CREATE TABLE public.ai_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  generated_content TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'linkedin', 'twitter', 'facebook')),
  tone TEXT NOT NULL CHECK (tone IN ('professional', 'casual', 'funny', 'inspirational', 'educational')),
  industry TEXT CHECK (industry IN ('tech', 'fashion', 'food', 'business', 'health', 'fitness', 'general')),
  hashtags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create analytics table for storing post performance data
CREATE TABLE public.analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.social_posts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'linkedin', 'twitter', 'facebook')),
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create social_accounts table for managing connected social media accounts
CREATE TABLE public.social_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'linkedin', 'twitter', 'facebook')),
  platform_user_id TEXT NOT NULL,
  platform_username TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_connected BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for social_posts table
CREATE POLICY "Users can view their own posts" ON public.social_posts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own posts" ON public.social_posts
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.social_posts
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.social_posts
FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for ai_generations table
CREATE POLICY "Users can view their own AI generations" ON public.ai_generations
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create AI generations" ON public.ai_generations
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for analytics table
CREATE POLICY "Users can view their own analytics" ON public.analytics
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert analytics" ON public.analytics
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update analytics" ON public.analytics
FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for social_accounts table
CREATE POLICY "Users can view their own social accounts" ON public.social_accounts
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own social accounts" ON public.social_accounts
FOR ALL USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_posts_updated_at
  BEFORE UPDATE ON public.social_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_accounts_updated_at
  BEFORE UPDATE ON public.social_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to reset monthly post usage (to be called by cron)
CREATE OR REPLACE FUNCTION public.reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles SET posts_used_this_month = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX idx_social_posts_user_id ON public.social_posts(user_id);
CREATE INDEX idx_social_posts_scheduled_time ON public.social_posts(scheduled_time);
CREATE INDEX idx_social_posts_status ON public.social_posts(status);
CREATE INDEX idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX idx_analytics_date ON public.analytics(date);
CREATE INDEX idx_ai_generations_user_id ON public.ai_generations(user_id);