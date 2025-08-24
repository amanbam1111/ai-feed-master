import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SessionStatus {
  isActive: boolean;
  timeRemaining: number;
  showWarning: boolean;
  lastActivity: number;
}

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout
const INACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

export function useSessionManager() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({
    isActive: true,
    timeRemaining: SESSION_TIMEOUT,
    showWarning: false,
    lastActivity: Date.now(),
  });
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();

  const resetSession = useCallback(() => {
    const now = Date.now();
    setSessionStatus(prev => ({
      ...prev,
      lastActivity: now,
      timeRemaining: SESSION_TIMEOUT,
      showWarning: false,
    }));

    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    // Set warning timer
    warningRef.current = setTimeout(() => {
      setSessionStatus(prev => ({ ...prev, showWarning: true }));
      toast({
        title: "Session Expiring Soon",
        description: "Your session will expire in 5 minutes. Click to extend.",
        duration: 10000,
        action: (
          <button 
            onClick={extendSession}
            className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90"
          >
            Extend
          </button>
        ),
      });
    }, SESSION_TIMEOUT - WARNING_TIME);

    // Set logout timer
    timeoutRef.current = setTimeout(async () => {
      await handleSessionExpiry();
    }, SESSION_TIMEOUT);
  }, []);

  const extendSession = useCallback(() => {
    resetSession();
    toast({
      title: "Session Extended",
      description: "Your session has been extended for another 30 minutes.",
    });
  }, [resetSession]);

  const handleSessionExpiry = useCallback(async () => {
    setSessionStatus(prev => ({ ...prev, isActive: false }));
    await signOut();
    toast({
      title: "Session Expired",
      description: "You have been logged out due to inactivity.",
      variant: "destructive",
    });
  }, [signOut]);

  const handleLogout = useCallback(async (showConfirmation = true) => {
    if (showConfirmation) {
      const confirmed = window.confirm("Are you sure you want to log out?");
      if (!confirmed) return false;
    }

    // Clear all timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (intervalRef.current) clearTimeout(intervalRef.current);

    // Clear localStorage preferences if not "remember me"
    const rememberMe = localStorage.getItem('rememberMe');
    if (!rememberMe) {
      localStorage.removeItem('userPreferences');
      localStorage.removeItem('lastRoute');
    }

    try {
      await signOut();
      toast({
        title: "Successfully Logged Out",
        description: "You have been safely logged out of your account.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [signOut]);

  // Activity tracking
  useEffect(() => {
    if (!user) return;

    const handleActivity = () => {
      if (sessionStatus.isActive) {
        resetSession();
      }
    };

    // Add event listeners for user activity
    INACTIVITY_EVENTS.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Update timer every second
    intervalRef.current = setInterval(() => {
      setSessionStatus(prev => {
        const timeElapsed = Date.now() - prev.lastActivity;
        const remaining = Math.max(0, SESSION_TIMEOUT - timeElapsed);
        
        return {
          ...prev,
          timeRemaining: remaining,
        };
      });
    }, 1000);

    // Initialize session
    resetSession();

    return () => {
      INACTIVITY_EVENTS.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [user, resetSession, sessionStatus.isActive]);

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    sessionStatus,
    extendSession,
    handleLogout,
    formatTimeRemaining: formatTimeRemaining(sessionStatus.timeRemaining),
    isWarning: sessionStatus.showWarning,
  };
}