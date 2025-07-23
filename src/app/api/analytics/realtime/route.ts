import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

    const userId = decoded.userId

    // Get real-time stats for the last 24 hours
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get real-time click data
    const [clicksToday, clicksWeek, clicksMonth] = await Promise.all([
      prisma.click.count({
        where: {
          userId,
          clickedAt: { gte: last24Hours }
        }
      }),
      prisma.click.count({
        where: {
          userId,
          clickedAt: { gte: lastWeek }
        }
      }),
      prisma.click.count({
        where: {
          userId,
          clickedAt: { gte: lastMonth }
        }
      })
    ])

    // Get real-time conversion data
    const [conversionsToday, conversionsWeek, conversionsMonth] = await Promise.all([
      prisma.conversion.count({
        where: {
          userId,
          convertedAt: { gte: last24Hours }
        }
      }),
      prisma.conversion.count({
        where: {
          userId,
          convertedAt: { gte: lastWeek }
        }
      }),
      prisma.conversion.count({
        where: {
          userId,
          convertedAt: { gte: lastMonth }
        }
      })
    ])

    // Get real-time earnings data
    const [earningsToday, earningsWeek, earningsMonth] = await Promise.all([
      prisma.conversion.aggregate({
        where: {
          userId,
          convertedAt: { gte: last24Hours },
          status: 'APPROVED'
        },
        _sum: { commission: true }
      }),
      prisma.conversion.aggregate({
        where: {
          userId,
          convertedAt: { gte: lastWeek },
          status: 'APPROVED'
        },
        _sum: { commission: true }
      }),
      prisma.conversion.aggregate({
        where: {
          userId,
          convertedAt: { gte: lastMonth },
          status: 'APPROVED'
        },
        _sum: { commission: true }
      })
    ])

    // Get hourly data for today's trend
    const hourlyData = await prisma.click.groupBy({
      by: ['clickedAt'],
      where: {
        userId,
        clickedAt: { gte: last24Hours }
      },
      _count: { id: true }
    })

    // Process hourly data into 24-hour format
    const hourlyStats = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date(now)
      hour.setHours(hour.getHours() - (23 - i), 0, 0, 0)
      
      const hourData = hourlyData.filter(item => {
        const itemHour = new Date(item.clickedAt)
        return itemHour.getHours() === hour.getHours() && 
               itemHour.getDate() === hour.getDate()
      })
      
      return {
        hour: hour.getHours(),
        clicks: hourData.reduce((sum, item) => sum + item._count.id, 0),
        time: hour.toISOString()
      }
    })

    // Calculate conversion rates
    const conversionRateToday = clicksToday > 0 ? (conversionsToday / clicksToday * 100) : 0
    const conversionRateWeek = clicksWeek > 0 ? (conversionsWeek / clicksWeek * 100) : 0
    const conversionRateMonth = clicksMonth > 0 ? (conversionsMonth / clicksMonth * 100) : 0

    return NextResponse.json({
      realTimeStats: {
        today: {
          clicks: clicksToday,
          conversions: conversionsToday,
          earnings: earningsToday._sum.commission || 0,
          conversionRate: conversionRateToday
        },
        week: {
          clicks: clicksWeek,
          conversions: conversionsWeek,
          earnings: earningsWeek._sum.commission || 0,
          conversionRate: conversionRateWeek
        },
        month: {
          clicks: clicksMonth,
          conversions: conversionsMonth,
          earnings: earningsMonth._sum.commission || 0,
          conversionRate: conversionRateMonth
        },
        hourlyTrend: hourlyStats
      },
      timestamp: now.toISOString()
    })

  } catch (error) {
    console.error('Real-time analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch real-time analytics' },
      { status: 500 }
    )
  }
}
