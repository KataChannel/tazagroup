import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Default to last 30 days if no dates provided
    const defaultEndDate = new Date()
    const defaultStartDate = new Date()
    defaultStartDate.setDate(defaultStartDate.getDate() - 30)

    const start = startDate ? new Date(startDate) : defaultStartDate
    const end = endDate ? new Date(endDate) : defaultEndDate

    // Ensure end date includes the full day
    end.setHours(23, 59, 59, 999)

    const userId = decoded.userId

    // Get clicks for date range
    const clicks = await prisma.click.count({
      where: {
        userId,
        clickedAt: {
          gte: start,
          lte: end,
        },
      },
    })

    // Get conversions for date range
    const conversions = await prisma.conversion.count({
      where: {
        userId,
        convertedAt: {
          gte: start,
          lte: end,
        },
      },
    })

    // Get earnings for date range
    const earnings = await prisma.conversion.aggregate({
      where: {
        userId,
        status: 'APPROVED',
        convertedAt: {
          gte: start,
          lte: end,
        },
      },
      _sum: {
        commission: true,
      },
    })

    // Get daily breakdown for chart
    const dailyStats = await prisma.$queryRaw`
      SELECT 
        DATE(converted_at) as date,
        COUNT(*)::integer as conversions,
        SUM(commission)::float as earnings
      FROM "Conversion" 
      WHERE 
        user_id = ${userId} 
        AND converted_at >= ${start} 
        AND converted_at <= ${end}
        AND status = 'APPROVED'
      GROUP BY DATE(converted_at)
      ORDER BY DATE(converted_at)
    `

    // Get campaign performance
    const campaignStats = await prisma.conversion.groupBy({
      by: ['campaignId'],
      where: {
        userId,
        status: 'APPROVED',
        convertedAt: {
          gte: start,
          lte: end,
        },
      },
      _count: {
        id: true,
      },
      _sum: {
        commission: true,
      },
    })

    // Get campaign details
    const campaignDetails = await Promise.all(
      campaignStats.map(async (stat) => {
        const campaign = await prisma.campaign.findUnique({
          where: { id: stat.campaignId },
          select: { name: true, category: true },
        })
        return {
          ...stat,
          campaign,
        }
      })
    )

    return NextResponse.json({
      period: {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
      },
      summary: {
        clicks,
        conversions,
        earnings: earnings._sum.commission || 0,
        conversionRate: clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : '0.00',
      },
      dailyStats,
      campaignStats: campaignDetails,
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
