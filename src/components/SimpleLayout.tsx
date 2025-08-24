import { Sparkles } from 'lucide-react';
import { UserMenu } from '@/components/UserMenu';
import { Link } from 'react-router-dom';

interface SimpleLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function SimpleLayout({ children, title }: SimpleLayoutProps) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-glass-border">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">ContentAI</span>
              </Link>
              {title && (
                <>
                  <div className="w-1 h-6 bg-accent/50 mx-2" />
                  <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                </>
              )}
            </div>
            
            <UserMenu variant="header" showNotifications={true} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}