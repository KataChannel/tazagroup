'use client'

import { useState, useEffect, useCallback } from 'react'
import { CampaignNotificationService } from '@/lib/campaign-notifications'

interface UseNotificationsOptions {
  autoRefresh?: boolean
  refreshInterval?: number
  limit?: number
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  campaignId?: string
  actionUrl?: string
  isRead: boolean
  createdAt: string
}

interface NotificationsData {
  notifications: Notification[]
  unreadCount: number
  total: number
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const {
    autoRefresh = true,
    refreshInterval = 30000, // 30 seconds
    limit = 20
  } = options

  const [data, setData] = useState<NotificationsData>({
    notifications: [],
    unreadCount: 0,
    total: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async (offset = 0, unreadOnly = false) => {
    try {
      setLoading(true)
      setError(null)

      const result = await CampaignNotificationService.getNotifications(
        limit,
        offset,
        unreadOnly
      )

      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }, [limit])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await CampaignNotificationService.markAsRead(notificationId)
      
      // Update local state
      setData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1)
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read')
    }
  }, [])

  const markAllAsRead = useCallback(async () => {
    try {
      await CampaignNotificationService.markAllAsRead()
      
      // Update local state
      setData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, isRead: true })),
        unreadCount: 0
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all as read')
    }
  }, [])

  const refresh = useCallback(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const loadMore = useCallback(async () => {
    if (data.notifications.length >= data.total) return

    try {
      const result = await CampaignNotificationService.getNotifications(
        limit,
        data.notifications.length
      )

      setData(prev => ({
        ...result,
        notifications: [...prev.notifications, ...result.notifications]
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more')
    }
  }, [data.notifications.length, data.total, limit])

  // Initial load
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchNotifications()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchNotifications])

  return {
    notifications: data.notifications,
    unreadCount: data.unreadCount,
    total: data.total,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh,
    refreshNotifications: refresh, // Alias for backwards compatibility
    loadMore,
    hasMore: data.notifications.length < data.total
  }
}

// Hook for creating notifications
export function useCreateNotification() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createNotification = useCallback(async (
    type: string, 
    campaignId?: string, 
    customMessage?: string
  ) => {
    try {
      setLoading(true)
      setError(null)

      const result = await CampaignNotificationService.createNotification(
        type,
        campaignId,
        customMessage
      )

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create notification'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    createNotification,
    loading,
    error
  }
}

// Hook for real-time notification updates
export function useRealtimeNotifications() {
  const [lastNotification, setLastNotification] = useState<Notification | null>(null)
  const [hasNewNotification, setHasNewNotification] = useState(false)

  // Simulate real-time updates with polling
  useEffect(() => {
    let lastCheck = new Date()

    const checkForNewNotifications = async () => {
      try {
        const result = await CampaignNotificationService.getNotifications(5, 0)
        
        if (result.notifications.length > 0) {
          const newest = result.notifications[0]
          const newestDate = new Date(newest.createdAt)
          
          if (newestDate > lastCheck) {
            setLastNotification(newest)
            setHasNewNotification(true)
            lastCheck = newestDate
          }
        }
      } catch (error) {
        console.error('Real-time notification check error:', error)
      }
    }

    const interval = setInterval(checkForNewNotifications, 10000) // Check every 10 seconds
    
    return () => clearInterval(interval)
  }, [])

  const clearNewNotification = useCallback(() => {
    setHasNewNotification(false)
  }, [])

  return {
    lastNotification,
    hasNewNotification,
    clearNewNotification
  }
}
