import { useState } from 'react';
import { CalendarDays, LayoutDashboard, Plus, BarChart3, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'calendar', name: 'Calendar', icon: CalendarDays },
  { id: 'create', name: 'Create Post', icon: Plus },
  { id: 'ai-generator', name: 'AI Generator', icon: Sparkles },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'posts', name: 'Posts', icon: FileText },
];

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-gradient-glass backdrop-blur-xl border-r border-glass-border transition-all duration-300 z-50",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-foreground">SocialAI</h1>
                <p className="text-sm text-muted-foreground">Content Scheduler</p>
              </div>
            )}
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full justify-start gap-3 transition-all duration-200",
                    isActive 
                      ? "bg-primary/20 text-primary border border-primary/20 shadow-glow" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
                    sidebarCollapsed && "px-3"
                  )}
                >
                  <Icon className={cn("flex-shrink-0", sidebarCollapsed ? "w-5 h-5" : "w-4 h-4")} />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute bottom-4 left-4 right-4 text-muted-foreground hover:text-foreground"
        >
          {sidebarCollapsed ? '→' : '←'}
        </Button>
      </div>

      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        {/* Header */}
        <header className="bg-gradient-glass backdrop-blur-xl border-b border-glass-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground capitalize">
                {navigation.find(nav => nav.id === activeTab)?.name || 'Dashboard'}
              </h2>
              <p className="text-muted-foreground">
                Manage your social media presence with AI
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}