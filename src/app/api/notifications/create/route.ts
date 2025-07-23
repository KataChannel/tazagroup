import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { type, campaignId, customMessage } = await request.json()
    
    if (!type) {
      return NextResponse.json({ error: 'Notification type is required' }, { status: 400 })
    }

    let title = ''
    let message = ''
    let actionUrl = ''

    // Get campaign info if campaignId is provided
    let campaign = null
    if (campaignId) {
      campaign = await prisma.campaign.findUnique({
        where: { id: campaignId }
      })
    }

    // Generate notification content based on type
    switch (type) {
      case 'CAMPAIGN_NEW':
        title = 'Chiến dịch mới có sẵn!'
        message = campaign 
          ? `Chiến dịch "${campaign.name}" vừa được phát hành. Commission tới ${campaign.commission}%!`
          : 'Có chiến dịch affiliate mới dành cho bạn.'
        actionUrl = campaignId ? `/campaigns/${campaignId}` : '/campaigns'
        break

      case 'CAMPAIGN_APPROVED':
        title = 'Đơn đăng ký được duyệt!'
        message = campaign 
          ? `Đơn đăng ký chiến dịch "${campaign.name}" đã được chấp thuận. Bạn có thể bắt đầu kiếm hoa hồng ngay!`
          : 'Đơn đăng ký chiến dịch của bạn đã được duyệt.'
        actionUrl = campaignId ? `/campaigns/${campaignId}` : '/campaigns'
        break

      case 'CAMPAIGN_REJECTED':
        title = 'Đơn đăng ký bị từ chối'
        message = campaign 
          ? `Đơn đăng ký chiến dịch "${campaign.name}" chưa được chấp thuận. Hãy thử lại sau.`
          : 'Đơn đăng ký chiến dịch của bạn chưa được duyệt.'
        actionUrl = campaignId ? `/campaigns/${campaignId}` : '/campaigns'
        break

      case 'CAMPAIGN_UPDATED':
        title = 'Chiến dịch được cập nhật'
        message = campaign 
          ? `Chiến dịch "${campaign.name}" đã có thông tin mới. Hãy kiểm tra ngay!`
          : 'Có chiến dịch được cập nhật thông tin mới.'
        actionUrl = campaignId ? `/campaigns/${campaignId}` : '/campaigns'
        break

      case 'CAMPAIGN_ENDING':
        title = 'Chiến dịch sắp kết thúc!'
        message = campaign 
          ? `Chiến dịch "${campaign.name}" sẽ kết thúc trong 3 ngày. Đừng bỏ lỡ cơ hội!`
          : 'Một chiến dịch bạn tham gia sắp kết thúc.'
        actionUrl = campaignId ? `/campaigns/${campaignId}` : '/campaigns'
        break

      case 'CAMPAIGN_HIGH_PERFORMANCE':
        title = 'Chiến dịch hiệu suất cao!'
        message = campaign 
          ? `Chiến dịch "${campaign.name}" đang có tỷ lệ chuyển đổi cao. Tăng cường quảng bá ngay!`
          : 'Bạn có chiến dịch đang có hiệu suất rất tốt.'
        actionUrl = campaignId ? `/campaigns/${campaignId}` : '/dashboard'
        break

      case 'PAYMENT_PROCESSED':
        title = 'Thanh toán thành công!'
        message = customMessage || 'Khoản thanh toán hoa hồng của bạn đã được xử lý thành công.'
        actionUrl = '/payments'
        break

      case 'MILESTONE_ACHIEVED':
        title = 'Chúc mừng cột mốc mới!'
        message = customMessage || 'Bạn đã đạt được một cột mốc quan trọng trong hành trình affiliate.'
        actionUrl = '/dashboard'
        break

      default:
        if (customMessage) {
          title = 'Thông báo mới'
          message = customMessage
        } else {
          return NextResponse.json({ error: 'Invalid notification type' }, { status: 400 })
        }
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId: decoded.userId,
        title,
        message,
        type,
        campaignId,
        actionUrl,
        isRead: false
      }
    })

    return NextResponse.json({ 
      message: 'Notification created successfully',
      notification 
    })

  } catch (error) {
    console.error('Create notification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// API to trigger campaign notifications based on events
export async function PUT(request: NextRequest) {
  try {
    const { event, campaignId, userIds, customData } = await request.json()
    
    if (!event || !userIds || !Array.isArray(userIds)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    const notifications = []

    // Create notifications for multiple users
    for (const userId of userIds) {
      let notificationType = 'SYSTEM_UPDATE'
      let customMessage = ''

      switch (event) {
        case 'campaign_launched':
          notificationType = 'CAMPAIGN_NEW'
          break
        case 'application_approved':
          notificationType = 'CAMPAIGN_APPROVED'
          break
        case 'application_rejected':
          notificationType = 'CAMPAIGN_REJECTED'
          break
        case 'campaign_updated':
          notificationType = 'CAMPAIGN_UPDATED'
          break
        case 'campaign_ending_soon':
          notificationType = 'CAMPAIGN_ENDING'
          break
        case 'high_performance_alert':
          notificationType = 'CAMPAIGN_HIGH_PERFORMANCE'
          break
        case 'payment_processed':
          notificationType = 'PAYMENT_PROCESSED'
          customMessage = customData?.message || ''
          break
        case 'milestone_achieved':
          notificationType = 'MILESTONE_ACHIEVED'
          customMessage = customData?.message || ''
          break
      }

      // Generate notification content
      let title = ''
      let message = ''
      let actionUrl = ''

      const campaign = campaignId ? await prisma.campaign.findUnique({
        where: { id: campaignId }
      }) : null

      switch (notificationType) {
        case 'CAMPAIGN_NEW':
          title = 'Chiến dịch mới có sẵn!'
          message = campaign 
            ? `Chiến dịch "${campaign.name}" vừa được phát hành với commission ${campaign.commission}%!`
            : 'Có chiến dịch affiliate mới phù hợp với bạn.'
          actionUrl = campaignId ? `/campaigns/${campaignId}` : '/campaigns'
          break

        case 'CAMPAIGN_APPROVED':
          title = 'Đơn đăng ký được duyệt!'
          message = campaign 
            ? `Chúc mừng! Đơn đăng ký chiến dịch "${campaign.name}" đã được duyệt.`
            : 'Đơn đăng ký chiến dịch của bạn đã được chấp thuận.'
          actionUrl = campaignId ? `/campaigns/${campaignId}` : '/campaigns'
          break

        case 'CAMPAIGN_REJECTED':
          title = 'Đơn đăng ký chưa được duyệt'
          message = campaign 
            ? `Đơn đăng ký chiến dịch "${campaign.name}" chưa được chấp thuận lúc này.`
            : 'Đơn đăng ký chiến dịch của bạn chưa được duyệt.'
          actionUrl = campaignId ? `/campaigns/${campaignId}` : '/campaigns'
          break

        case 'CAMPAIGN_ENDING':
          title = 'Chiến dịch sắp kết thúc'
          message = campaign 
            ? `Chiến dịch "${campaign.name}" sẽ kết thúc trong vài ngày tới!`
            : 'Một chiến dịch bạn tham gia sắp kết thúc.'
          actionUrl = campaignId ? `/campaigns/${campaignId}` : '/campaigns'
          break

        case 'CAMPAIGN_HIGH_PERFORMANCE':
          title = 'Hiệu suất vượt trội!'
          message = campaign 
            ? `Chiến dịch "${campaign.name}" đang có hiệu suất rất tốt. Tăng cường quảng bá!`
            : 'Bạn có chiến dịch đang có hiệu suất xuất sắc.'
          actionUrl = '/dashboard'
          break

        case 'PAYMENT_PROCESSED':
          title = 'Thanh toán thành công'
          message = customMessage || 'Khoản hoa hồng của bạn đã được thanh toán.'
          actionUrl = '/payments'
          break

        case 'MILESTONE_ACHIEVED':
          title = 'Cột mốc mới!'
          message = customMessage || 'Chúc mừng bạn đã đạt cột mốc quan trọng!'
          actionUrl = '/dashboard'
          break
      }

      const notification = await prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type: notificationType,
          campaignId,
          actionUrl,
          isRead: false
        }
      })

      notifications.push(notification)
    }

    return NextResponse.json({ 
      message: `Created ${notifications.length} notifications`,
      notifications 
    })

  } catch (error) {
    console.error('Bulk create notifications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
