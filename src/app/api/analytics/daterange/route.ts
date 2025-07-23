import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { startOfDay, endOfDay, subDays, format, eachDayOfInterval } from 'date-fns'

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
    const { searchParams } = new URL(request.url)
    
    // Get date range from query parameters
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')
    const rangeType = searchParams.get('range') || 'last30days'

    let startDate: Date
    let endDate: Date

    // Handle custom date range or preset ranges
    if (startDateParam && endDateParam) {
      startDate = startOfDay(new Date(startDateParam))
      endDate = endOfDay(new Date(endDateParam))
    } else {
      // Use preset ranges
      const today = new Date()
      endDate = endOfDay(today)
      
      switch (rangeType) {
        case 'today':
          startDate = startOfDay(today)
          break
        case 'yesterday':
          startDate = startOfDay(subDays(today, 1))
          endDate = endOfDay(subDays(today, 1))
          break
        case 'last7days':
          startDate = startOfDay(subDays(today, 6))
          break
        case 'last14days':
          startDate = startOfDay(subDays(today, 13))
          break
        case 'last30days':
          startDate = startOfDay(subDays(today, 29))
          break
        case 'last60days':
          startDate = startOfDay(subDays(today, 59))
          break
        case 'last90days':
          startDate = startOfDay(subDays(today, 89))
          break
        default:
          startDate = startOfDay(subDays(today, 29))
      }
    }

    // Validate date range (max 1 year)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    if (daysDiff > 365) {
      return NextResponse.json(
        { error: 'Date range cannot exceed 365 days' },
        { status: 400 }
      )
    }

    // Get analytics data for the date range
    const [clicks, conversions, earnings] = await Promise.all([
      // Total clicks in range
      prisma.click.count({
        where: {
          userId,
          clickedAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),
      
      // Total conversions in range
      prisma.conversion.count({
        where: {
          userId,
          convertedAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }),
      
      // Total earnings in range
      prisma.conversion.aggregate({
        where: {
          userId,
          convertedAt: {
            gte: startDate,
            lte: endDate
          },
          status: 'APPROVED'
        },
        _sum: { commission: true }
      })
    ])

    // Get daily breakdown for chart data
    const dailyStats = await Promise.all([
      // Daily clicks
      prisma.click.groupBy({
        by: ['clickedAt'],
        where: {
          userId,
          clickedAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _count: { id: true }
      }),
      
      // Daily conversions
      prisma.conversion.groupBy({
        by: ['convertedAt'],
        where: {
          userId,
          convertedAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _count: { id: true },
        _sum: { commission: true }
      })
    ])

    // Process daily data into chart format
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate })
    const chartData = dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd')
      
      // Find clicks for this date
      const dayClicks = dailyStats[0].filter(item => {
        const itemDate = format(new Date(item.clickedAt), 'yyyy-MM-dd')
        return itemDate === dateStr
      }).reduce((sum, item) => sum + item._count.id, 0)
      
      // Find conversions for this date
      const dayConversions = dailyStats[1].filter(item => {
        const itemDate = format(new Date(item.convertedAt), 'yyyy-MM-dd')
        return itemDate === dateStr
      })
      
      const dayConversionCount = dayConversions.reduce((sum, item) => sum + item._count.id, 0)
      const dayEarnings = dayConversions.reduce((sum, item) => sum + (item._sum.commission || 0), 0)
      
      return {
        date: dateStr,
        dateDisplay: format(date, 'dd/MM'),
        clicks: dayClicks,
        conversions: dayConversionCount,
        earnings: dayEarnings,
        conversionRate: dayClicks > 0 ? (dayConversionCount / dayClicks * 100) : 0
      }
    })

    // Get top performing campaigns in the date range
    const topCampaigns = await prisma.conversion.groupBy({
      by: ['campaignId'],
      where: {
        userId,
        convertedAt: {
          gte: startDate,
          lte: endDate
        },
        status: 'APPROVED'
      },
      _count: { id: true },
      _sum: { commission: true },
      orderBy: {
        _sum: { commission: 'desc' }
      },
      take: 5
    })

    // Get campaign details for top campaigns
    const campaignIds = topCampaigns.map(item => item.campaignId).filter(Boolean)
    const campaignDetails = await prisma.campaign.findMany({
      where: { id: { in: campaignIds } },
      select: { id: true, name: true, category: true }
    })

    const topCampaignsWithDetails = topCampaigns.map(item => {
      const campaign = campaignDetails.find(c => c.id === item.campaignId)
      return {
        id: item.campaignId,
        name: campaign?.name || 'Unknown Campaign',
        category: campaign?.category || 'General',
        conversions: item._count.id,
        earnings: item._sum.commission || 0
      }
    })

    // Calculate comparison with previous period
    const previousStartDate = new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime()))
    const previousEndDate = new Date(startDate.getTime() - 1)

    const [previousClicks, previousConversions, previousEarnings] = await Promise.all([
      prisma.click.count({
        where: {
          userId,
          clickedAt: {
            gte: previousStartDate,
            lte: previousEndDate
          }
        }
      }),
      
      prisma.conversion.count({
        where: {
          userId,
          convertedAt: {
            gte: previousStartDate,
            lte: previousEndDate
          }
        }
      }),
      
      prisma.conversion.aggregate({
        where: {
          userId,
          convertedAt: {
            gte: previousStartDate,
            lte: previousEndDate
          },
          status: 'APPROVED'
        },
        _sum: { commission: true }
      })
    ])

    // Calculate percentage changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous) * 100
    }

    const conversionRate = clicks > 0 ? (conversions / clicks * 100) : 0
    const previousConversionRate = previousClicks > 0 ? (previousConversions / previousClicks * 100) : 0

    return NextResponse.json({
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        days: daysDiff,
        label: `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`
      },
      summary: {
        clicks: {
          value: clicks,
          change: calculateChange(clicks, previousClicks)
        },
        conversions: {
          value: conversions,
          change: calculateChange(conversions, previousConversions)
        },
        earnings: {
          value: earnings._sum.commission || 0,
          change: calculateChange(earnings._sum.commission || 0, previousEarnings._sum.commission || 0)
        },
        conversionRate: {
          value: conversionRate,
          change: calculateChange(conversionRate, previousConversionRate)
        }
      },
      chartData,
      topCampaigns: topCampaignsWithDetails,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
