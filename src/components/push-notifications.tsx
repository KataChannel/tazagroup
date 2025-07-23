'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscriptionStatus();
    }
  }, []);

  const checkSubscriptionStatus = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const subscribeToNotifications = async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Generate VAPID key for demo purposes (in production, this should be from your server)
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI9stpSBD1NjqhQHUtzHq8ZOaOjCBbfMm8LNqDPJUoSDfIHTJVjHfr0E-Y';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      // Send subscription to server
      const response = await fetch('/api/push-notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription }),
      });

      if (response.ok) {
        setIsSubscribed(true);
        console.log('Push notification subscription successful');
      } else {
        throw new Error('Failed to subscribe to push notifications');
      }
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      alert('Failed to enable push notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const unsubscribeFromNotifications = async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Remove subscription from server
        await fetch('/api/push-notifications', {
          method: 'DELETE',
        });
        
        setIsSubscribed(false);
        console.log('Push notification unsubscription successful');
      }
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      alert('Failed to disable push notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {isSubscribed ? (
        <Button
          variant="outline"
          size="sm"
          onClick={unsubscribeFromNotifications}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <BellOff className="h-4 w-4" />
          {isLoading ? 'Disabling...' : 'Disable Notifications'}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={subscribeToNotifications}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Bell className="h-4 w-4" />
          {isLoading ? 'Enabling...' : 'Enable Notifications'}
        </Button>
      )}
    </div>
  );
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission;
    }
    return 'denied';
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        ...options,
      });
    }
  };

  return {
    permission,
    requestPermission,
    showNotification,
  };
}
