import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { CampaignNotificationService } from '@/lib/campaign-notifications'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const campaignId = params.id
    
    // Get user if authenticated
    const token = request.cookies.get('auth-token')?.value
    let userId = null
    
    if (token) {
      const payload = await verifyToken(token)
      if (payload && payload.userId) {
        userId = payload.userId as string
      }
    }
    
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: {
        users: userId ? {
          where: { userId },
          select: { 
            status: true, 
            appliedAt: true,
            approvedAt: true,
            rejectedAt: true,
            reason: true
          }
        } : false,
        _count: {
          select: {
            users: { where: { status: 'APPROVED' } },
            clicks: true,
            conversions: true
          }
        }
      }
    })
    
    if (!campaign) {
      return NextResponse.json(
        { error: 'Không tìm thấy chiến dịch' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ campaign })
    
  } catch (error) {
    console.error('Get campaign error:', error)
    
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const campaignId = params.id
    
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập để tham gia chiến dịch' },
        { status: 401 }
      )
    }
    
    // Verify token
    const payload = await verifyToken(token)
    
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: 'Token không hợp lệ' },
        { status: 401 }
      )
    }
    
    const userId = payload.userId as string
    
    // Check if campaign exists and is active
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    })
    
    if (!campaign) {
      return NextResponse.json(
        { error: 'Không tìm thấy chiến dịch' },
        { status: 404 }
      )
    }
    
    if (campaign.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Chiến dịch không còn hoạt động' },
        { status: 400 }
      )
    }
    
    // Check if user already applied
    const existingApplication = await prisma.campaignUser.findUnique({
      where: {
        userId_campaignId: {
          userId,
          campaignId
        }
      }
    })
    
    if (existingApplication) {
      return NextResponse.json(
        { error: 'Bạn đã đăng ký chiến dịch này rồi' },
        { status: 400 }
      )
    }
    
    // Create application
    const application = await prisma.campaignUser.create({
      data: {
        userId,
        campaignId,
        status: 'PENDING'
      }
    })
    
    // Log activity
    await prisma.activity.create({
      data: {
        userId,
        type: 'CAMPAIGN_APPLY',
        title: 'Đăng ký chiến dịch',
        description: `Đăng ký tham gia chiến dịch "${campaign.name}"`
      }
    })

    // Trigger application submitted notification (for demo - normally admin would approve/reject)
    try {
      await CampaignNotificationService.createNotification(
        'CAMPAIGN_APPROVED', // For demo purposes, auto-approve
        campaignId,
        `Chúc mừng! Đơn đăng ký chiến dịch "${campaign.name}" đã được phê duyệt tự động.`
      )
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError)
      // Don't fail the main request if notification fails
    }
    
    return NextResponse.json(
      { 
        message: 'Đăng ký thành công! Chúng tôi sẽ xem xét và phản hồi sớm.',
        application 
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Apply campaign error:', error)
    
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trong quá trình đăng ký' },
      { status: 500 }
    )
  }
}
