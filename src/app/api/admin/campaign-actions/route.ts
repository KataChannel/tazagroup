import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { CampaignNotificationService } from '@/lib/campaign-notifications'

// Admin API to simulate campaign approval/rejection events
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

    const { action, campaignId, userId, message } = await request.json()
    
    if (!action || !campaignId) {
      return NextResponse.json({ error: 'Action and campaignId are required' }, { status: 400 })
    }

    // Get campaign info
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    let notificationResult
    
    switch (action) {
      case 'approve_application':
        if (!userId) {
          return NextResponse.json({ error: 'UserId is required for approval' }, { status: 400 })
        }
        
        // Update application status
        await prisma.campaignUser.updateMany({
          where: {
            campaignId,
            userId,
            status: 'PENDING'
          },
          data: {
            status: 'APPROVED',
            approvedAt: new Date()
          }
        })

        // Send approval notification
        notificationResult = await CampaignNotificationService.triggerCampaignEvent({
          event: 'application_approved',
          campaignId,
          userIds: [userId],
          customData: {
            message: message || `Chúc mừng! Đơn đăng ký chiến dịch "${campaign.name}" đã được phê duyệt.`
          }
        })
        break

      case 'reject_application':
        if (!userId) {
          return NextResponse.json({ error: 'UserId is required for rejection' }, { status: 400 })
        }
        
        // Update application status
        await prisma.campaignUser.updateMany({
          where: {
            campaignId,
            userId,
            status: 'PENDING'
          },
          data: {
            status: 'REJECTED',
            rejectedAt: new Date(),
            reason: message || 'Đơn đăng ký không đáp ứng yêu cầu'
          }
        })

        // Send rejection notification
        notificationResult = await CampaignNotificationService.triggerCampaignEvent({
          event: 'application_rejected',
          campaignId,
          userIds: [userId],
          customData: {
            message: message || `Đơn đăng ký chiến dịch "${campaign.name}" chưa được phê duyệt lần này.`
          }
        })
        break

      case 'launch_campaign':
        // Get all users for new campaign notification
        const allUsers = await prisma.user.findMany({
          select: { id: true }
        })
        
        notificationResult = await CampaignNotificationService.triggerCampaignEvent({
          event: 'campaign_launched',
          campaignId,
          userIds: allUsers.map(u => u.id),
          customData: {
            message: message || `Chiến dịch mới "${campaign.name}" đã được phát hành với hoa hồng ${campaign.commission}%!`
          }
        })
        break

      case 'campaign_ending_soon':
        // Get approved participants
        const participants = await prisma.campaignUser.findMany({
          where: {
            campaignId,
            status: 'APPROVED'
          },
          select: { userId: true }
        })

        notificationResult = await CampaignNotificationService.triggerCampaignEvent({
          event: 'campaign_ending_soon',
          campaignId,
          userIds: participants.map(p => p.userId),
          customData: {
            message: message || `Chiến dịch "${campaign.name}" sẽ kết thúc trong vài ngày tới!`
          }
        })
        break

      case 'high_performance_alert':
        if (!userId) {
          return NextResponse.json({ error: 'UserId is required for performance alert' }, { status: 400 })
        }

        notificationResult = await CampaignNotificationService.triggerCampaignEvent({
          event: 'high_performance_alert',
          campaignId,
          userIds: [userId],
          customData: {
            message: message || `Chiến dịch "${campaign.name}" của bạn đang có hiệu suất xuất sắc!`
          }
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({
      message: `${action} completed successfully`,
      campaign,
      notification: notificationResult
    })

  } catch (error) {
    console.error('Campaign action error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get campaign applications for admin
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const campaignId = searchParams.get('campaignId')

    const whereClause = campaignId ? { campaignId } : {}

    const applications = await prisma.campaignUser.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        campaign: {
          select: {
            id: true,
            name: true,
            commission: true
          }
        }
      },
      orderBy: {
        appliedAt: 'desc'
      }
    })

    return NextResponse.json({ applications })

  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
