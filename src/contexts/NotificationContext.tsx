import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  AppNotification, 
  NotificationSettings, 
  NotificationCategory,
  defaultNotificationSettings,
  notificationTemplates 
} from '@/lib/notifications';
import { useApp } from './AppContext';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  settings: NotificationSettings;
  addNotification: (category: NotificationCategory, title: string, message: string, emoji?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  updateSettings: (updates: Partial<NotificationSettings>) => void;
  triggerSmartNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'bb_notifications';
const SETTINGS_KEY = 'bb_notification_settings';
const LAST_NOTIFICATION_KEY = 'bb_last_notification';

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultNotificationSettings);
  const { progress, monthlySavings } = useApp();

  // Load from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem(STORAGE_KEY);
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed.map((n: any) => ({ ...n, createdAt: new Date(n.createdAt) })));
      } catch (e) {
        console.error('Failed to parse notifications:', e);
      }
    }
    
    if (savedSettings) {
      try {
        setSettings({ ...defaultNotificationSettings, ...JSON.parse(savedSettings) });
      } catch (e) {
        console.error('Failed to parse notification settings:', e);
      }
    }
  }, []);

  // Save to localStorage when notifications change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const isQuietHours = useCallback(() => {
    const now = new Date().getHours();
    if (settings.quietHoursStart > settings.quietHoursEnd) {
      // Quiet hours span midnight
      return now >= settings.quietHoursStart || now < settings.quietHoursEnd;
    }
    return now >= settings.quietHoursStart && now < settings.quietHoursEnd;
  }, [settings.quietHoursStart, settings.quietHoursEnd]);

  const shouldSendNotification = useCallback((category: NotificationCategory) => {
    if (isQuietHours()) return false;
    if (!settings[category]) return false;
    
    // Check frequency
    const lastNotification = localStorage.getItem(LAST_NOTIFICATION_KEY);
    if (lastNotification) {
      const lastTime = new Date(lastNotification).getTime();
      const now = Date.now();
      const hoursSinceLast = (now - lastTime) / (1000 * 60 * 60);
      
      switch (settings.frequency) {
        case 'minimal':
          if (hoursSinceLast < 24) return false;
          break;
        case 'smart':
          if (hoursSinceLast < 4) return false;
          break;
        case 'daily':
          if (hoursSinceLast < 1) return false;
          break;
      }
    }
    
    return true;
  }, [settings, isQuietHours]);

  const addNotification = useCallback((
    category: NotificationCategory, 
    title: string, 
    message: string, 
    emoji?: string
  ) => {
    if (!shouldSendNotification(category)) return;
    
    const newNotification: AppNotification = {
      id: crypto.randomUUID(),
      category,
      title,
      message,
      emoji,
      createdAt: new Date(),
      read: false,
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
    localStorage.setItem(LAST_NOTIFICATION_KEY, new Date().toISOString());
  }, [shouldSendNotification]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateSettings = useCallback((updates: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  // Trigger smart notifications based on user behavior
  const triggerSmartNotification = useCallback(() => {
    const categories: NotificationCategory[] = ['delivery_vs_cooking', 'savings_progress', 'smart_reminder', 'motivational'];
    
    // Pick a random enabled category
    const enabledCategories = categories.filter(cat => settings[cat]);
    if (enabledCategories.length === 0) return;
    
    const category = enabledCategories[Math.floor(Math.random() * enabledCategories.length)];
    const templates = notificationTemplates[category];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Customize message based on actual data
    let message = template.message;
    if (category === 'savings_progress' && monthlySavings > 0) {
      message = `חסכת כבר ₪${monthlySavings} החודש! 🎯`;
    }
    
    addNotification(category, template.title, message, template.emoji);
  }, [settings, addNotification, monthlySavings]);

  // Auto-trigger notifications based on user activity
  useEffect(() => {
    // Trigger savings progress notification when milestone reached
    const milestones = [100, 200, 300, 500, 750, 1000];
    const reachedMilestone = milestones.find(m => 
      monthlySavings >= m && monthlySavings < m + 50
    );
    
    if (reachedMilestone && settings.savings_progress) {
      addNotification(
        'savings_progress',
        'יעד חדש! 🎯',
        `הגעת ל-₪${reachedMilestone} חיסכון החודש!`,
        '🎯'
      );
    }
  }, [monthlySavings, settings.savings_progress, addNotification]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      settings,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      updateSettings,
      triggerSmartNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
