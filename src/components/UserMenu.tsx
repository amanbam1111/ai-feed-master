import { useState } from 'react';
import { Bell, Settings, User, LogOut, Clock, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSessionManager } from '@/hooks/useSessionManager';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  variant?: 'header' | 'sidebar';
  showNotifications?: boolean;
}

export function UserMenu({ variant = 'header', showNotifications = true }: UserMenuProps) {
  const { user, profile } = useAuth();
  const { sessionStatus, handleLogout, formatTimeRemaining, isWarning } = useSessionManager();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getInitials = (name?: string | null) => {
    if (!name) return user?.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleLogoutClick = async () => {
    setIsLoggingOut(true);
    try {
      await handleLogout(true);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getSubscriptionBadge = () => {
    const tier = profile?.subscription_tier || 'free';
    const colors = {
      free: 'bg-muted',
      pro: 'bg-gradient-to-r from-blue-500 to-purple-600',
      premium: 'bg-gradient-to-r from-purple-600 to-pink-600'
    };
    
    return (
      <Badge className={cn('text-xs', colors[tier as keyof typeof colors])}>
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </Badge>
    );
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      {showNotifications && (
        <Button variant="ghost" size="sm" className="hover:bg-accent/20 relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className={cn(
              "relative rounded-full hover:bg-accent/20 p-1",
              variant === 'sidebar' ? "w-full justify-start gap-3 rounded-lg px-3 py-2" : "h-9 w-9"
            )}
          >
            <Avatar className={variant === 'sidebar' ? "h-8 w-8" : "h-9 w-9"}>
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || ''} />
              <AvatarFallback className="bg-gradient-primary text-white text-sm">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            {variant === 'sidebar' && (
              <div className="flex flex-col items-start min-w-0 flex-1">
                <span className="text-sm font-medium text-foreground truncate">
                  {profile?.full_name || 'User'}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user.email}
                </span>
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-64 bg-card/95 backdrop-blur-md border-glass-border" 
          align="end"
        >
          {/* User Info Header */}
          <div className="flex items-center justify-start gap-3 p-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || ''} />
              <AvatarFallback className="bg-gradient-primary text-white">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.full_name || 'User'}
                </p>
                {getSubscriptionBadge()}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Session Status */}
          <div className="px-3 pb-2">
            <div className={cn(
              "flex items-center gap-2 text-xs p-2 rounded-md",
              isWarning ? "bg-destructive/10 text-destructive" : "bg-muted/50 text-muted-foreground"
            )}>
              <Clock className="w-3 h-3" />
              <span>Session: {formatTimeRemaining}</span>
              {sessionStatus.showWarning && (
                <Badge variant="destructive" className="text-xs">Expiring Soon</Badge>
              )}
            </div>
          </div>

          <DropdownMenuSeparator className="bg-glass-border" />

          {/* Menu Items */}
          <DropdownMenuItem asChild className="hover:bg-accent/20 cursor-pointer">
            <Link to="/profile" className="flex items-center">
              <User className="mr-3 h-4 w-4" />
              <div>
                <div className="font-medium">Profile Settings</div>
                <div className="text-xs text-muted-foreground">Manage your account</div>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem className="hover:bg-accent/20">
            <Settings className="mr-3 h-4 w-4" />
            <div>
              <div className="font-medium">Preferences</div>
              <div className="text-xs text-muted-foreground">App settings & privacy</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem className="hover:bg-accent/20">
            <Shield className="mr-3 h-4 w-4" />
            <div>
              <div className="font-medium">Security</div>
              <div className="text-xs text-muted-foreground">Password & 2FA</div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-glass-border" />

          {/* Usage Stats */}
          <DropdownMenuLabel className="text-xs text-muted-foreground px-3 py-2">
            This Month: {profile?.posts_used_this_month || 0} posts used
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-glass-border" />

          {/* Logout */}
          <DropdownMenuItem 
            onClick={handleLogoutClick} 
            disabled={isLoggingOut}
            className="hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-medium">
                  {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                </div>
                <div className="text-xs opacity-70">
                  Safely logout from account
                </div>
              </div>
              {isLoggingOut && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              )}
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}