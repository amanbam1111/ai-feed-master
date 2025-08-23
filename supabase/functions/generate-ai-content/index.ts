import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateRequest {
  prompt: string;
  platform: 'instagram' | 'linkedin' | 'twitter' | 'facebook';
  tone: 'professional' | 'casual' | 'funny' | 'inspirational' | 'educational';
  industry?: 'tech' | 'fashion' | 'food' | 'business' | 'health' | 'fitness' | 'general';
}

const platformCharacterLimits = {
  twitter: 280,
  instagram: 2200,
  linkedin: 3000,
  facebook: 63206
};

const platformInstructions = {
  instagram: "Create an engaging Instagram post with emojis and relevant hashtags. Focus on visual storytelling and engagement.",
  linkedin: "Write a professional LinkedIn post that provides value to the audience. Include industry insights and professional tone.",
  twitter: "Create a concise, engaging tweet that fits within character limits. Use relevant hashtags and a conversational tone.",
  facebook: "Write a Facebook post that encourages engagement and community interaction. Use a friendly, accessible tone."
};

function generateHashtags(platform: string, industry: string, topic: string): string[] {
  const commonHashtags = {
    instagram: ['#content', '#socialmedia', '#digitalmarketing', '#growth'],
    linkedin: ['#professional', '#business', '#leadership', '#innovation'],
    twitter: ['#trending', '#content', '#digital'],
    facebook: ['#community', '#engagement', '#social']
  };
  
  const industryHashtags = {
    tech: ['#technology', '#innovation', '#AI', '#startup', '#digital'],
    fashion: ['#fashion', '#style', '#trends', '#design', '#lifestyle'],
    food: ['#food', '#recipe', '#cooking', '#nutrition', '#foodie'],
    business: ['#business', '#entrepreneur', '#strategy', '#growth', '#success'],
    health: ['#health', '#wellness', '#fitness', '#selfcare', '#lifestyle'],
    fitness: ['#fitness', '#workout', '#health', '#motivation', '#training'],
    general: ['#inspiration', '#motivation', '#tips', '#advice', '#life']
  };
  
  const platformTags = commonHashtags[platform as keyof typeof commonHashtags] || [];
  const industryTags = industryHashtags[industry as keyof typeof industryHashtags] || [];
  
  // Combine and limit hashtags
  const allTags = [...platformTags.slice(0, 2), ...industryTags.slice(0, 3)];
  return allTags.slice(0, 5);
}

Deno.serve(async (req) => {
  console.log('🚀 AI Content Generation function started');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Authenticate user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) {
      throw new Error('Invalid authentication token');
    }

    console.log(`✅ User authenticated: ${userData.user.email}`);

    // Get request body
    const body: GenerateRequest = await req.json();
    const { prompt, platform, tone, industry = 'general' } = body;

    if (!prompt || !platform || !tone) {
      throw new Error('Missing required fields: prompt, platform, tone');
    }

    console.log(`📝 Generation request: ${platform} - ${tone} - ${industry}`);

    // Check usage limits
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('subscription_tier, posts_used_this_month')
      .eq('user_id', userData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      throw new Error('Failed to fetch user profile');
    }

    // Enforce usage limits
    const limits = {
      free: 5,
      pro: 100,
      business: Infinity
    };

    const userLimit = limits[profile.subscription_tier as keyof typeof limits] || 5;
    if (profile.posts_used_this_month >= userLimit) {
      throw new Error(`Usage limit reached. Upgrade your plan to generate more content.`);
    }

    console.log(`📊 Usage: ${profile.posts_used_this_month}/${userLimit === Infinity ? '∞' : userLimit}`);

    // Prepare OpenAI request
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const characterLimit = platformCharacterLimits[platform];
    const platformInstruction = platformInstructions[platform];

    const systemPrompt = `You are an expert social media content creator specializing in ${platform} content. 
    
    Platform: ${platform}
    Tone: ${tone}
    Industry: ${industry}
    Character limit: ${characterLimit}
    
    Instructions: ${platformInstruction}
    
    Create engaging content that:
    - Fits within the character limit
    - Matches the specified tone
    - Is relevant to the ${industry} industry
    - Includes appropriate emojis for engagement
    - Ends with relevant hashtags (but don't exceed the character limit)
    
    Return only the content text, no additional explanations.`;

    console.log('🤖 Calling OpenAI API...');

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('Failed to generate content with AI');
    }

    const openAIData = await openAIResponse.json();
    const generatedContent = openAIData.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated by AI');
    }

    console.log('✨ Content generated successfully');

    // Generate hashtags
    const hashtags = generateHashtags(platform, industry, prompt);

    // Store generation in database
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { error: insertError } = await supabaseService
      .from('ai_generations')
      .insert({
        user_id: userData.user.id,
        prompt,
        generated_content: generatedContent,
        platform,
        tone,
        industry,
        hashtags
      });

    if (insertError) {
      console.error('Failed to store generation:', insertError);
    }

    // Update usage count
    const { error: usageError } = await supabaseService
      .from('profiles')
      .update({ 
        posts_used_this_month: profile.posts_used_this_month + 1 
      })
      .eq('user_id', userData.user.id);

    if (usageError) {
      console.error('Failed to update usage count:', usageError);
    }

    console.log('📈 Usage count updated');

    return new Response(JSON.stringify({
      content: generatedContent,
      hashtags,
      characterCount: generatedContent.length,
      characterLimit,
      usage: {
        used: profile.posts_used_this_month + 1,
        limit: userLimit === Infinity ? null : userLimit,
        tier: profile.subscription_tier
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('❌ Error in AI content generation:', error);
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});