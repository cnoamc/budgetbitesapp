import { useState, useEffect, useCallback } from 'react';

const PERMISSION_KEY = 'bb_notification_permission_asked';

export type NotificationPermissionStatus = 'default' | 'granted' | 'denied';

interface BrowserNotificationHook {
  permission: NotificationPermissionStatus;
  isSupported: boolean;
  requestPermission: () => Promise<NotificationPermissionStatus>;
  sendNotification: (title: string, options?: NotificationOptions) => void;
}

export const useBrowserNotifications = (): BrowserNotificationHook => {
  const [permission, setPermission] = useState<NotificationPermissionStatus>('default');
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission as NotificationPermissionStatus);
    }
  }, [isSupported]);

  const requestPermission = useCallback(async (): Promise<NotificationPermissionStatus> => {
    if (!isSupported) {
      console.log('Browser notifications not supported');
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result as NotificationPermissionStatus);
      localStorage.setItem(PERMISSION_KEY, 'true');
      return result as NotificationPermissionStatus;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }, [isSupported]);

  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!isSupported || permission !== 'granted') {
      console.log('Cannot send notification: not supported or not permitted');
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.png',
        badge: '/favicon.png',
        dir: 'rtl',
        lang: 'he',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }, [isSupported, permission]);

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
  };
};
