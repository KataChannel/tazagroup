import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

// Get link details with analytics
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: linkId } = await params
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'
    const timeframe = searchParams.get('timeframe') || 'day'

    // Get date range based on period
    const getDateRange = (period: string) => {
      const now = new Date()
      const ranges: Record<string, Date> = {
        '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        '90d': new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        '1y': new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      }
      return ranges[period] || ranges['30d']
    }

    const startDate = getDateRange(period)

    // Get link details
    const link = await prisma.affiliateLink.findUnique({
        where: {
          id: linkId,
          userId: decoded.userId
        },
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            commission: true,
            category: true
          }
        }
      }
    })

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    // Get analytics data
    const [
      totalStats,
      periodStats,
      clicksTimeline,
      conversionsTimeline,
      topCountries,
      topDevices,
      topBrowsers,
      topReferrers
    ] = await Promise.all([
      // Total stats
      Promise.all([
        prisma.linkClick.count({ where: { linkId: linkId } }),
        prisma.linkConversion.count({ where: { linkId: linkId } }),
        prisma.linkConversion.aggregate({
          where: { linkId: linkId },
          _sum: { commission: true }
        })
      ]),

      // Period stats
      Promise.all([
        prisma.linkClick.count({ 
          where: { 
            linkId: linkId, 
            clickedAt: { gte: startDate } 
          } 
        }),
        prisma.linkConversion.count({ 
          where: { 
            linkId: linkId, 
            convertedAt: { gte: startDate } 
          } 
        }),
        prisma.linkConversion.aggregate({
          where: { 
            linkId: linkId, 
            convertedAt: { gte: startDate } 
          },
          _sum: { commission: true }
        })
      ]),

      // Timeline data - Clicks
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC(${timeframe}, clicked_at) as date,
          COUNT(*) as clicks
        FROM link_clicks 
        WHERE link_id = ${linkId} 
        AND clicked_at >= ${startDate}
        GROUP BY DATE_TRUNC(${timeframe}, clicked_at)
        ORDER BY date
      `,

      // Timeline data - Conversions
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC(${timeframe}, converted_at) as date,
          COUNT(*) as conversions,
          SUM(commission) as revenue
        FROM link_conversions 
        WHERE link_id = ${linkId} 
        AND converted_at >= ${startDate}
        GROUP BY DATE_TRUNC(${timeframe}, converted_at)
        ORDER BY date
      `,

      // Top countries
      prisma.$queryRaw`
        SELECT 
          country,
          COUNT(*) as clicks,
          ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM link_clicks 
        WHERE link_id = ${linkId} 
        AND clicked_at >= ${startDate}
        AND country IS NOT NULL
        GROUP BY country
        ORDER BY clicks DESC
        LIMIT 10
      `,

      // Top devices
      prisma.$queryRaw`
        SELECT 
          device,
          COUNT(*) as clicks,
          ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM link_clicks 
        WHERE link_id = ${linkId} 
        AND clicked_at >= ${startDate}
        AND device IS NOT NULL
        GROUP BY device
        ORDER BY clicks DESC
        LIMIT 10
      `,

      // Top browsers
      prisma.$queryRaw`
        SELECT 
          browser,
          COUNT(*) as clicks,
          ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM link_clicks 
        WHERE link_id = ${linkId} 
        AND clicked_at >= ${startDate}
        AND browser IS NOT NULL
        GROUP BY browser
        ORDER BY clicks DESC
        LIMIT 10
      `,

      // Top referrers
      prisma.$queryRaw`
        SELECT 
          CASE 
            WHEN referer IS NULL OR referer = '' THEN 'Direct'
            ELSE SPLIT_PART(SPLIT_PART(referer, '://', 2), '/', 1)
          END as source,
          COUNT(*) as clicks,
          ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
        FROM link_clicks 
        WHERE link_id = ${linkId} 
        AND clicked_at >= ${startDate}
        GROUP BY source
        ORDER BY clicks DESC
        LIMIT 10
      `
    ])

    const [totalClicks, totalConversions, totalRevenueAgg] = totalStats
    const [periodClicks, periodConversions, periodRevenueAgg] = periodStats

    const totalRevenue = totalRevenueAgg._sum.commission || 0
    const periodRevenue = periodRevenueAgg._sum.commission || 0

    // Calculate rates
    const totalCTR = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0
    const periodCTR = periodClicks > 0 ? (periodConversions / periodClicks) * 100 : 0
    const avgRevenue = totalConversions > 0 ? totalRevenue / totalConversions : 0

    const analytics = {
      link,
      summary: {
        total: {
          clicks: totalClicks,
          conversions: totalConversions,
          revenue: totalRevenue,
          ctr: Math.round(totalCTR * 100) / 100,
          avgRevenue: Math.round(avgRevenue * 100) / 100
        },
        period: {
          clicks: periodClicks,
          conversions: periodConversions,
          revenue: periodRevenue,
          ctr: Math.round(periodCTR * 100) / 100,
          days: Math.ceil((new Date().getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
        }
      },
      timeline: {
        clicks: clicksTimeline,
        conversions: conversionsTimeline
      },
      demographics: {
        countries: topCountries,
        devices: topDevices,
        browsers: topBrowsers,
        referrers: topReferrers
      }
    }

    return NextResponse.json(analytics)

  } catch (error) {
    console.error('Get link analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update link
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: linkId } = await params
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, tags, isActive, expiresAt } = body

    // Update link
    const updatedLink = await prisma.affiliateLink.update({
      where: {
        id: linkId,
        userId: decoded.userId
      },
      data: {
        title,
        description,
        tags: tags || [],
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        updatedAt: new Date()
      },
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            commission: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Link updated successfully',
      link: updatedLink
    })

  } catch (error) {
    console.error('Update link error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Delete link
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: linkId } = await params
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Delete link (this will cascade delete related data)
    await prisma.affiliateLink.delete({
      where: {
        id: linkId,
        userId: decoded.userId
      }
    })

    return NextResponse.json({
      message: 'Link deleted successfully'
    })

  } catch (error) {
    console.error('Delete link error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
