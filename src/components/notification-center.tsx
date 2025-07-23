"use client"

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth-context'
import { 
  Bell, 
  Settings, 
  Check, 
  CheckCheck, 
  Target, 
  DollarSign, 
  AlertCircle,
  Lightbulb,
  Clock,
  X
} from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import Link from 'next/link'

interface Notification {
  id: string
  title: string
  message: string
  type: 'CAMPAIGN_NEW' | 'CAMPAIGN_APPROVED' | 'CAMPAIGN_REJECTED' | 'CAMPAIGN_UPDATED' | 'CAMPAIGN_ENDING' | 'PAYMENT_PROCESSED' | 'PAYMENT_FAILED' | 'SYSTEM_UPDATE' | 'ACHIEVEMENT' | 'REMINDER'
  campaignId?: string
  actionUrl?: string
  isRead: boolean
  createdAt: string
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'CAMPAIGN_NEW':
    case 'CAMPAIGN_UPDATED':
      return <Target className="h-4 w-4 text-blue-600" />
    case 'CAMPAIGN_APPROVED':
      return <CheckCheck className="h-4 w-4 text-green-600" />
    case 'CAMPAIGN_REJECTED':
      return <X className="h-4 w-4 text-red-600" />
    case 'CAMPAIGN_ENDING':
      return <Clock className="h-4 w-4 text-orange-600" />
    case 'PAYMENT_PROCESSED':
      return <DollarSign className="h-4 w-4 text-green-600" />
    case 'PAYMENT_FAILED':
      return <DollarSign className="h-4 w-4 text-red-600" />
    case 'SYSTEM_UPDATE':
      return <Settings className="h-4 w-4 text-gray-600" />
    case 'ACHIEVEMENT':
      return <Lightbulb className="h-4 w-4 text-yellow-600" />
    case 'REMINDER':
      return <AlertCircle className="h-4 w-4 text-purple-600" />
    default:
      return <Bell className="h-4 w-4 text-gray-600" />
  }
}

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'CAMPAIGN_NEW':
    case 'CAMPAIGN_UPDATED':
      return 'border-l-blue-500'
    case 'CAMPAIGN_APPROVED':
    case 'PAYMENT_PROCESSED':
      return 'border-l-green-500'
    case 'CAMPAIGN_REJECTED':
    case 'PAYMENT_FAILED':
      return 'border-l-red-500'
    case 'CAMPAIGN_ENDING':
      return 'border-l-orange-500'
    case 'ACHIEVEMENT':
      return 'border-l-yellow-500'
    case 'REMINDER':
      return 'border-l-purple-500'
    default:
      return 'border-l-gray-500'
  }
}

const getTypeLabel = (type: Notification['type']) => {
  switch (type) {
    case 'CAMPAIGN_NEW':
      return 'Chiến dịch mới'
    case 'CAMPAIGN_APPROVED':
      return 'Phê duyệt'
    case 'CAMPAIGN_REJECTED':
      return 'Từ chối'
    case 'CAMPAIGN_UPDATED':
      return 'Cập nhật'
    case 'CAMPAIGN_ENDING':
      return 'Sắp kết thúc'
    case 'PAYMENT_PROCESSED':
      return 'Thanh toán'
    case 'PAYMENT_FAILED':
      return 'Lỗi thanh toán'
    case 'SYSTEM_UPDATE':
      return 'Hệ thống'
    case 'ACHIEVEMENT':
      return 'Thành tích'
    case 'REMINDER':
      return 'Nhắc nhở'
    default:
      return 'Thông báo'
  }
}

export function NotificationCenter() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const fetchNotifications = async () => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/notifications', {
        method: 'GET',
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationIds: string[]) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          notificationIds,
          markAsRead: true
        })
      })

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(n => 
            notificationIds.includes(n.id) ? { ...n, isRead: true } : n
          )
        )
        setUnreadCount(prev => Math.max(0, prev - notificationIds.length))
      }
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id)
    if (unreadIds.length > 0) {
      await markAsRead(unreadIds)
    }
  }

  useEffect(() => {
    if (user && isOpen) {
      fetchNotifications()
    }
  }, [user, isOpen])

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    if (user) {
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  if (!user) return null

  const displayedNotifications = showAll 
    ? notifications 
    : notifications.slice(0, 5)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Thông báo</h3>
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {unreadCount} mới
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Đánh dấu tất cả
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">Không có thông báo nào</p>
                <p className="text-gray-400 text-xs mt-1">
                  Chúng tôi sẽ thông báo khi có cập nhật mới
                </p>
              </div>
            ) : (
              <>
                <ScrollArea className="max-h-96">
                  <div className="divide-y">
                    {displayedNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${getNotificationColor(notification.type)} ${
                          !notification.isRead ? 'bg-blue-50/30' : ''
                        }`}
                        onClick={() => {
                          if (!notification.isRead) {
                            markAsRead([notification.id])
                          }
                          if (notification.actionUrl) {
                            setIsOpen(false)
                            // Navigate to the action URL
                            window.location.href = notification.actionUrl
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge 
                                variant="outline" 
                                className="text-xs px-2 py-0"
                              >
                                {getTypeLabel(notification.type)}
                              </Badge>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            
                            <h4 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                              {notification.title}
                            </h4>
                            
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                              </span>
                              
                              {notification.actionUrl && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-xs px-2 py-1 h-auto"
                                >
                                  Xem chi tiết
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {notifications.length > 5 && (
                  <>
                    <Separator />
                    <div className="p-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-sm"
                        onClick={() => setShowAll(!showAll)}
                      >
                        {showAll ? 'Thu gọn' : `Xem tất cả ${notifications.length} thông báo`}
                      </Button>
                    </div>
                  </>
                )}

                <Separator />
                <div className="p-3">
                  <Link href="/notifications">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Quản lý thông báo
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
