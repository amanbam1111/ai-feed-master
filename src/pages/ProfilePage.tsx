import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, CreditCard, Settings, Crown, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { SimpleLayout } from '@/components/SimpleLayout';

export function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSubmitting(true);
    const { error } = await updateProfile(formData);
    setIsSubmitting(false);
    
    if (!error) {
      setIsEditing(false);
    }
  };

  const getSubscriptionIcon = (tier: string) => {
    switch (tier) {
      case 'pro':
        return <Zap className="w-4 h-4" />;
      case 'business':
        return <Crown className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getSubscriptionColor = (tier: string) => {
    switch (tier) {
      case 'pro':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'business':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getUsagePercentage = () => {
    if (!profile) return 0;
    
    const limits = {
      free: 5,
      pro: 100,
      business: Infinity
    };
    
    const limit = limits[profile.subscription_tier as keyof typeof limits] || 5;
    if (limit === Infinity) return 0;
    
    return (profile.posts_used_this_month / limit) * 100;
  };

  if (!profile) {
    return (
      <SimpleLayout title="Profile Settings">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <SimpleLayout title="Profile Settings">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-accent/20 border-accent/50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="pl-10 bg-accent/20 border-accent/30"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Email cannot be changed from this page
                  </p>
                </div>

                <div>
                  <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      value={isEditing ? formData.full_name : profile.full_name || ''}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={!isEditing}
                      className={`pl-10 ${isEditing ? 'bg-accent/30 border-accent/50' : 'bg-accent/20 border-accent/30'}`}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleSave}
                      disabled={isSubmitting}
                      className="glass-button"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="bg-accent/20 border-accent/50"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Subscription & Usage */}
          <div className="space-y-6">
            {/* Current Plan */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Current Plan</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className={`capitalize ${getSubscriptionColor(profile.subscription_tier)}`}>
                    {getSubscriptionIcon(profile.subscription_tier)}
                    <span className="ml-1">{profile.subscription_tier}</span>
                  </Badge>
                </div>

                <Separator className="bg-accent/30" />

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Posts Used This Month</span>
                    <span className="text-sm font-medium text-foreground">
                      {profile.posts_used_this_month} / {profile.subscription_tier === 'business' ? '∞' : profile.subscription_tier === 'pro' ? '100' : '5'}
                    </span>
                  </div>
                  
                  {profile.subscription_tier !== 'business' && (
                    <div className="w-full bg-accent/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                      />
                    </div>
                  )}
                </div>

                {profile.subscription_tier === 'free' && profile.posts_used_this_month >= 4 && (
                  <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-400">
                      You're approaching your monthly limit. Upgrade to Pro for 100 posts/month!
                    </p>
                  </div>
                )}

                <Button className="w-full glass-button">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Billing
                </Button>
              </div>
            </Card>

            {/* Account Status */}
            <Card className="glass-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Account Status</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Account Status</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    Active
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm text-foreground">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>

                {profile.subscription_end_date && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Next Billing</span>
                    <span className="text-sm text-foreground">
                      {new Date(profile.subscription_end_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}