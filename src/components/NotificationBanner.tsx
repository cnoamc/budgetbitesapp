import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { AppNotification } from '@/lib/notifications';

export const NotificationBanner: React.FC = () => {
  const { notifications, markAsRead } = useNotifications();
  const [visible, setVisible] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<AppNotification | null>(null);

  useEffect(() => {
    const unread = notifications.find(n => !n.read);
    if (unread && !visible) {
      setCurrentNotification(unread);
      setVisible(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        markAsRead(unread.id);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notifications, visible, markAsRead]);

  const handleDismiss = () => {
    if (currentNotification) {
      markAsRead(currentNotification.id);
    }
    setVisible(false);
  };

  if (!visible || !currentNotification) return null;

  return (
    <div className="fixed left-4 right-4 z-50 animate-slide-down top-safe mt-4"> 
      <div className="max-w-lg mx-auto bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl p-4 shadow-elevated">
        <div className="flex items-start gap-3">
          {currentNotification.emoji && (
            <span className="text-2xl">{currentNotification.emoji}</span>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{currentNotification.title}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{currentNotification.message}</p>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};
