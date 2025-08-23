import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Calendar, BarChart3, Users, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Sparkles,
    title: "AI Content Generation",
    description: "Create engaging, platform-optimized content in seconds with our advanced AI"
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Schedule posts across all platforms with intelligent timing recommendations"
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track performance, engagement, and growth with detailed insights"
  },
  {
    icon: Users,
    title: "Multi-Platform Support",
    description: "Manage Instagram, LinkedIn, Twitter, and Facebook from one dashboard"
  }
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "5 AI-generated posts per month",
      "Basic scheduling",
      "1 social platform",
      "Basic analytics",
      "Community support"
    ],
    popular: false,
    cta: "Get Started Free"
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For growing businesses",
    features: [
      "100 AI-generated posts per month",
      "Advanced scheduling",
      "All social platforms",
      "Advanced analytics & insights",
      "Priority support",
      "Content calendar",
      "Hashtag optimization"
    ],
    popular: true,
    cta: "Start Pro Trial"
  },
  {
    name: "Business",
    price: "$99",
    period: "per month", 
    description: "For teams and agencies",
    features: [
      "Unlimited AI-generated posts",
      "Team collaboration",
      "All Pro features",
      "Custom branding",
      "API access",
      "Dedicated support",
      "Advanced reporting",
      "White-label options"
    ],
    popular: false,
    cta: "Contact Sales"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "TechStart Inc",
    content: "ContentAI has revolutionized our social media strategy. We've seen a 300% increase in engagement!"
  },
  {
    name: "Mike Chen",
    role: "Founder",
    company: "Growth Co",
    content: "The AI content generation saves us 10 hours per week. It's like having a marketing team in your pocket."
  }
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      {/* Header */}
      <header className="border-b border-accent/20 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">ContentAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?tab=signup">
                <Button className="glass-button">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-gradient-primary text-white border-0">
            ✨ AI-Powered Social Media Scheduling
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Create, Schedule &
            <span className="text-transparent bg-clip-text bg-gradient-primary"> Grow</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Generate engaging content with AI, schedule across all platforms, and track your growth. 
            The complete social media management solution for modern businesses.
          </p>
          <div className="flex items-center justify-center gap-4 mb-12">
            <Link to="/auth?tab=signup">
              <Button size="lg" className="glass-button text-lg px-8 py-4">
                Start Free Trial <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-accent/20 border-accent/50 hover:bg-accent/30">
              Watch Demo
            </Button>
          </div>
          
          {/* Hero Image Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="glass-card p-8 rounded-2xl">
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl h-96 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-24 h-24 text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground">Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-accent/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything you need to dominate social media
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to save time, increase engagement, and grow your audience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card p-6 text-center hover:shadow-elevated transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Choose your plan
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free, scale as you grow
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`glass-card p-8 relative ${plan.popular ? 'ring-2 ring-primary shadow-elevated' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-white border-0">
                    Most Popular
                  </Badge>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/auth?tab=signup" className="block">
                  <Button 
                    className={`w-full ${plan.popular ? 'glass-button' : 'bg-accent/30 hover:bg-accent/40 text-foreground'}`}
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-accent/10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Loved by thousands of creators
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card p-8">
                <p className="text-foreground mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="glass-card p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Ready to transform your social media?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of creators and businesses using ContentAI to grow their audience
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/auth?tab=signup">
                <Button size="lg" className="glass-button text-lg px-8 py-4">
                  Get Started Free <Zap className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-accent/20 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-primary rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">ContentAI</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 ContentAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}