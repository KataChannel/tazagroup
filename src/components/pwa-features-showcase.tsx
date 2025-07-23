'use client';

import { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Wifi, 
  Bell, 
  Download, 
  Zap, 
  Shield,
  Globe,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PushNotificationManager } from '@/components/push-notifications';

export function PWAFeaturesShowcase() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if app is installable
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    // Check online/offline status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setInstallPrompt(null);
      }
    }
  };

  return (
    <section className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-xl p-6 sm:p-8 mt-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <span className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse"></span>
          Phase 3 - Progressive Web App
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">App-like Experience</h2>
        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
          AccessTrade hiện đã hỗ trợ PWA với khả năng offline, push notifications và cài đặt như ứng dụng native
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
            <Smartphone className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">App Installation</h3>
          <p className="text-gray-600 text-sm mb-3">Cài đặt AccessTrade như ứng dụng native trên điện thoại và máy tính</p>
          <div className="text-xs text-indigo-600 font-medium">
            {isInstallable ? '✓ Ready to Install' : '✓ PWA Enabled'}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <Wifi className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Offline Support</h3>
          <p className="text-gray-600 text-sm mb-3">Truy cập dữ liệu đã cache và thực hiện các thao tác cơ bản khi offline</p>
          <div className={`text-xs font-medium ${isOffline ? 'text-red-600' : 'text-green-600'}`}>
            {isOffline ? '⚠ Currently Offline' : '✓ Online & Cached'}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <Bell className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Push Notifications</h3>
          <p className="text-gray-600 text-sm mb-3">Nhận thông báo realtime về chiến dịch mới và cập nhật quan trọng</p>
          <div className="text-xs text-blue-600 font-medium">✓ Real-time Updates</div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Zap className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Fast Performance</h3>
          <p className="text-gray-600 text-sm mb-3">Tốc độ tải trang nhanh với service worker caching và preloading</p>
          <div className="text-xs text-purple-600 font-medium">✓ Optimized Caching</div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="font-semibold text-lg mb-4">PWA Features & Controls</h3>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium">App Installation</div>
                <div className="text-sm text-gray-500">Install as native app</div>
              </div>
            </div>
            {isInstallable && (
              <Button size="sm" onClick={handleInstall}>
                Install
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-gray-500">Real-time updates</div>
              </div>
            </div>
            <PushNotificationManager />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-600" />
              <div>
                <div className="font-medium">Secure & Reliable</div>
                <div className="text-sm text-gray-500">HTTPS required</div>
              </div>
            </div>
            <div className="text-sm text-green-600 font-medium">✓ Active</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-8">
        <div className="text-center">
          <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <h4 className="font-semibold mb-2">Cross-Platform</h4>
          <p className="text-gray-600 text-sm">Hoạt động trên mọi thiết bị và trình duyệt hiện đại</p>
        </div>

        <div className="text-center">
          <div className="h-16 w-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <h4 className="font-semibold mb-2">Real-time Sync</h4>
          <p className="text-gray-600 text-sm">Đồng bộ dữ liệu tự động khi kết nối internet trở lại</p>
        </div>

        <div className="text-center">
          <div className="h-16 w-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h4 className="font-semibold mb-2">Lightning Fast</h4>
          <p className="text-gray-600 text-sm">Trải nghiệm native-like với hiệu suất cao</p>
        </div>
      </div>

      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
          <div className="text-sm text-gray-600">
            <div className="font-semibold text-gray-900">PWA Ready</div>
            <div>Progressive Web App capabilities</div>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="text-sm text-gray-600">
            <div className="font-semibold text-gray-900">Phase 3 Features</div>
            <div>Offline, Push, Install, Cache</div>
          </div>
        </div>
      </div>
    </section>
  );
}
