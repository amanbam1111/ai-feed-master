import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSessionManager } from '@/hooks/useSessionManager';

export function SessionWarning() {
  const { sessionStatus, extendSession, formatTimeRemaining, isWarning } = useSessionManager();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(isWarning && sessionStatus.timeRemaining > 0);
  }, [isWarning, sessionStatus.timeRemaining]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <Alert className="bg-destructive/10 border-destructive/20 backdrop-blur-md">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-medium text-destructive">Session Expiring Soon</span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Time remaining: {formatTimeRemaining}
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => {
              extendSession();
              setIsVisible(false);
            }}
            className="ml-2"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Extend
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}