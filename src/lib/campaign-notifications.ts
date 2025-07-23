// Campaign notification utilities and hooks
export interface CampaignNotificationEvent {
  event: 'campaign_launched' | 'application_approved' | 'application_rejected' | 
         'campaign_updated' | 'campaign_ending_soon' | 'high_performance_alert' |
         'payment_processed' | 'milestone_achieved'
  campaignId?: string
  userIds: string[]
  customData?: {
    message?: string
    amount?: number
    [key: string]: any
  }
}

export class CampaignNotificationService {
  private static baseUrl = '/api/notifications'

  // Send single notification to current user
  static async createNotification(
    type: string, 
    campaignId?: string, 
    customMessage?: string
  ) {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          campaignId,
          customMessage
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create notification')
      }

      return await response.json()
    } catch (error) {
      console.error('Create notification error:', error)
      throw error
    }
  }

  // Send bulk notifications for campaign events
  static async triggerCampaignEvent(eventData: CampaignNotificationEvent) {
    try {
      const response = await fetch(`${this.baseUrl}/create`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      })

      if (!response.ok) {
        throw new Error('Failed to trigger campaign event')
      }

      return await response.json()
    } catch (error) {
      console.error('Campaign event trigger error:', error)
      throw error
    }
  }

  // Get user notifications
  static async getNotifications(
    limit = 20, 
    offset = 0, 
    unreadOnly = false
  ) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        unreadOnly: unreadOnly.toString()
      })

      const response = await fetch(`${this.baseUrl}?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      return await response.json()
    } catch (error) {
      console.error('Get notifications error:', error)
      throw error
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string) {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notificationId,
          isRead: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }

      return await response.json()
    } catch (error) {
      console.error('Mark as read error:', error)
      throw error
    }
  }

  // Mark all notifications as read
  static async markAllAsRead() {
    try {
      const response = await fetch(`${this.baseUrl}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          markAllAsRead: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read')
      }

      return await response.json()
    } catch (error) {
      console.error('Mark all as read error:', error)
      throw error
    }
  }
}

// Predefined notification templates
export const NotificationTemplates = {
  CAMPAIGN_APPROVED: (campaignName: string) => ({
    title: 'Đơn đăng ký được duyệt!',
    message: `Chúc mừng! Đơn đăng ký chiến dịch "${campaignName}" đã được chấp thuận. Bạn có thể bắt đầu kiếm hoa hồng ngay bây giờ!`,
    type: 'CAMPAIGN_APPROVED'
  }),

  CAMPAIGN_NEW: (campaignName: string, commission: number) => ({
    title: 'Chiến dịch mới có sẵn!',
    message: `Chiến dịch "${campaignName}" vừa được phát hành với tỷ lệ hoa hồng ${commission}%. Đăng ký ngay để không bỏ lỡ!`,
    type: 'CAMPAIGN_NEW'
  }),

  HIGH_PERFORMANCE: (campaignName: string, conversionRate: number) => ({
    title: 'Hiệu suất vượt trội!',
    message: `Chiến dịch "${campaignName}" đang có tỷ lệ chuyển đổi ${conversionRate}%! Đây là thời cơ tuyệt vời để tăng cường quảng bá.`,
    type: 'CAMPAIGN_HIGH_PERFORMANCE'
  }),

  PAYMENT_SUCCESS: (amount: number) => ({
    title: 'Thanh toán thành công!',
    message: `Khoản hoa hồng ${amount.toLocaleString('vi-VN')}₫ đã được chuyển vào tài khoản của bạn.`,
    type: 'PAYMENT_PROCESSED'
  }),

  MILESTONE_EARNINGS: (totalEarnings: number) => ({
    title: 'Cột mốc thu nhập mới!',
    message: `Chúc mừng! Bạn đã đạt tổng thu nhập ${totalEarnings.toLocaleString('vi-VN')}₫. Tiếp tục phát huy!`,
    type: 'MILESTONE_ACHIEVED'
  }),

  CAMPAIGN_ENDING: (campaignName: string, daysLeft: number) => ({
    title: 'Chiến dịch sắp kết thúc!',
    message: `Chiến dịch "${campaignName}" sẽ kết thúc trong ${daysLeft} ngày. Đừng bỏ lỡ cơ hội cuối cùng!`,
    type: 'CAMPAIGN_ENDING'
  })
}

// Auto-trigger notifications based on system events
export const AutoNotificationTriggers = {
  // When a new campaign is launched
  onCampaignLaunched: async (campaignId: string, targetUserIds: string[]) => {
    await CampaignNotificationService.triggerCampaignEvent({
      event: 'campaign_launched',
      campaignId,
      userIds: targetUserIds
    })
  },

  // When user's campaign application is approved
  onApplicationApproved: async (campaignId: string, userId: string) => {
    await CampaignNotificationService.triggerCampaignEvent({
      event: 'application_approved',
      campaignId,
      userIds: [userId]
    })
  },

  // When user's campaign application is rejected
  onApplicationRejected: async (campaignId: string, userId: string) => {
    await CampaignNotificationService.triggerCampaignEvent({
      event: 'application_rejected',
      campaignId,
      userIds: [userId]
    })
  },

  // When campaign is updated
  onCampaignUpdated: async (campaignId: string, participantUserIds: string[]) => {
    await CampaignNotificationService.triggerCampaignEvent({
      event: 'campaign_updated',
      campaignId,
      userIds: participantUserIds
    })
  },

  // When campaign is ending soon
  onCampaignEndingSoon: async (campaignId: string, participantUserIds: string[]) => {
    await CampaignNotificationService.triggerCampaignEvent({
      event: 'campaign_ending_soon',
      campaignId,
      userIds: participantUserIds
    })
  },

  // When high performance is detected
  onHighPerformanceAlert: async (campaignId: string, userId: string) => {
    await CampaignNotificationService.triggerCampaignEvent({
      event: 'high_performance_alert',
      campaignId,
      userIds: [userId]
    })
  },

  // When payment is processed
  onPaymentProcessed: async (userId: string, amount: number) => {
    await CampaignNotificationService.triggerCampaignEvent({
      event: 'payment_processed',
      userIds: [userId],
      customData: {
        message: `Khoản hoa hồng ${amount.toLocaleString('vi-VN')}₫ đã được thanh toán thành công.`,
        amount
      }
    })
  },

  // When milestone is achieved
  onMilestoneAchieved: async (userId: string, milestone: string, value: number) => {
    await CampaignNotificationService.triggerCampaignEvent({
      event: 'milestone_achieved',
      userIds: [userId],
      customData: {
        message: `Chúc mừng! Bạn đã đạt ${milestone}: ${value.toLocaleString('vi-VN')}₫`,
        amount: value
      }
    })
  }
}
