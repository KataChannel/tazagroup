'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  Target, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { CampaignNotificationService } from '@/lib/campaign-notifications'
import { useNotifications } from '@/hooks/use-notifications'

export function NotificationDemo() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastAction, setLastAction] = useState<string>('')
  const { refreshNotifications } = useNotifications()

  const triggerNotification = async (type: string, message: string) => {
    setIsLoading(true)
    setLastAction(message)
    
    try {
      await CampaignNotificationService.createNotification(type, undefined, message)
      // Refresh notifications to show the new one
      setTimeout(() => refreshNotifications(), 500)
    } catch (error) {
      console.error('Failed to create notification:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const testNotifications = [
    {
      type: 'CAMPAIGN_NEW',
      title: 'Chiến dịch mới',
      message: 'Chiến dịch Fashion Sale 2025 với hoa hồng 15% vừa được phát hành!',
      icon: Target,
      color: 'text-blue-600'
    },
    {
      type: 'CAMPAIGN_APPROVED',
      title: 'Phê duyệt đơn',
      message: 'Chúc mừng! Đơn đăng ký chiến dịch Electronics Deal đã được phê duyệt.',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      type: 'CAMPAIGN_REJECTED',
      title: 'Từ chối đơn',
      message: 'Đơn đăng ký chiến dịch Premium Brands chưa được phê duyệt lần này.',
      icon: XCircle,
      color: 'text-red-600'
    },
    {
      type: 'PAYMENT_PROCESSED',
      title: 'Thanh toán',
      message: 'Khoản hoa hồng 2,500,000₫ đã được chuyển vào tài khoản của bạn.',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      type: 'CAMPAIGN_HIGH_PERFORMANCE',
      title: 'Hiệu suất cao',
      message: 'Chiến dịch Tech Gadgets đang có tỷ lệ chuyển đổi 8.5%! Tăng cường quảng bá ngay!',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      type: 'MILESTONE_ACHIEVED',
      title: 'Cột mốc mới',
      message: 'Chúc mừng! Bạn đã đạt 1,000 click trong tháng này và nhận thêm 5% bonus!',
      icon: Bell,
      color: 'text-yellow-600'
    }
  ]

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          Hệ thống thông báo chiến dịch
          <Badge variant="secondary" className="ml-2">Demo</Badge>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Thử nghiệm các loại thông báo khác nhau trong hệ thống. Nhấn vào các nút bên dưới để tạo thông báo mẫu.
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {testNotifications.map((notification, index) => {
            const Icon = notification.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 text-left justify-start"
                disabled={isLoading}
                onClick={() => triggerNotification(notification.type, notification.message)}
              >
                <div className="flex items-start gap-3 w-full">
                  <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${notification.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm mb-1">{notification.title}</div>
                    <div className="text-xs text-gray-600 line-clamp-2">
                      {notification.message}
                    </div>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>

        {isLoading && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Đang tạo thông báo: {lastAction}</span>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">📋 Hướng dẫn:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Nhấn vào các nút trên để tạo thông báo mẫu</li>
            <li>• Kiểm tra biểu tượng thông báo (🔔) ở header để xem thông báo mới</li>
            <li>• Thông báo sẽ hiển thị badge đỏ khi có thông báo chưa đọc</li>
            <li>• Nhấn vào thông báo để đánh dấu đã đọc và điều hướng</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
