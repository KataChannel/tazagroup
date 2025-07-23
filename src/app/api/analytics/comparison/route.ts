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
    const currentStart = searchParams.get('currentStart')
    const currentEnd = searchParams.get('currentEnd')
    const previousStart = searchParams.get('previousStart')
    const previousEnd = searchParams.get('previousEnd')

    if (!currentStart || !currentEnd || !previousStart || !previousEnd) {
      return NextResponse.json(
        { error: 'Missing required date parameters' },
        { status: 400 }
      )
    }

    const userId = decoded.userId as string

    // Parse dates
    const currentStartDate = new Date(currentStart)
    const currentEndDate = new Date(currentEnd)
    const previousStartDate = new Date(previousStart)
    const previousEndDate = new Date(previousEnd)

    // Ensure end dates include the full day
    currentEndDate.setHours(23, 59, 59, 999)
    previousEndDate.setHours(23, 59, 59, 999)

    // Get current period metrics
    const [currentClicks, currentConversions, currentRevenue, currentCampaigns] = await Promise.all([
      prisma.click.count({
        where: {
          userId,
          clickedAt: {
            gte: currentStartDate,
            lte: currentEndDate,
          },
        },
      }),
      prisma.conversion.count({
        where: {
          userId,
          convertedAt: {
            gte: currentStartDate,
            lte: currentEndDate,
          },
        },
      }),
      prisma.conversion.aggregate({
        where: {
          userId,
          convertedAt: {
            gte: currentStartDate,
            lte: currentEndDate,
          },
        },
        _sum: {
          commission: true,
        },
      }),
      prisma.campaignUser.count({
        where: {
          userId,
          status: 'APPROVED',
          appliedAt: {
            gte: currentStartDate,
            lte: currentEndDate,
          },
        },
      }),
    ])

    // Get previous period metrics
    const [previousClicks, previousConversions, previousRevenue, previousCampaigns] = await Promise.all([
      prisma.click.count({
        where: {
          userId,
          clickedAt: {
            gte: previousStartDate,
            lte: previousEndDate,
          },
        },
      }),
      prisma.conversion.count({
        where: {
          userId,
          convertedAt: {
            gte: previousStartDate,
            lte: previousEndDate,
          },
        },
      }),
      prisma.conversion.aggregate({
        where: {
          userId,
          convertedAt: {
            gte: previousStartDate,
            lte: previousEndDate,
          },
        },
        _sum: {
          commission: true,
        },
      }),
      prisma.campaignUser.count({
        where: {
          userId,
          status: 'APPROVED',
          appliedAt: {
            gte: previousStartDate,
            lte: previousEndDate,
          },
        },
      }),
    ])

    // Calculate metrics
    const currentRevenueAmount = currentRevenue._sum.commission || 0
    const previousRevenueAmount = previousRevenue._sum.commission || 0

    const currentCtr = currentClicks > 0 ? (currentConversions / currentClicks) * 100 : 0
    const previousCtr = previousClicks > 0 ? (previousConversions / previousClicks) * 100 : 0

    const currentAvgRevenue = currentConversions > 0 ? currentRevenueAmount / currentConversions : 0
    const previousAvgRevenue = previousConversions > 0 ? previousRevenueAmount / previousConversions : 0

    // Get timeline data for current period
    const currentTimelineData = await getTimelineData(userId, currentStartDate, currentEndDate)
    const previousTimelineData = await getTimelineData(userId, previousStartDate, previousEndDate)

    // Get campaign comparison data
    const campaignComparisons = await getCampaignComparisons(
      userId,
      currentStartDate,
      currentEndDate,
      previousStartDate,
      previousEndDate
    )

    const comparisonData = {
      current: {
        period: `${currentStartDate.toLocaleDateString()} - ${currentEndDate.toLocaleDateString()}`,
        metrics: {
          clicks: currentClicks,
          conversions: currentConversions,
          revenue: currentRevenueAmount,
          ctr: currentCtr,
          avgRevenue: currentAvgRevenue,
          campaigns: currentCampaigns,
        },
        timeline: currentTimelineData,
      },
      previous: {
        period: `${previousStartDate.toLocaleDateString()} - ${previousEndDate.toLocaleDateString()}`,
        metrics: {
          clicks: previousClicks,
          conversions: previousConversions,
          revenue: previousRevenueAmount,
          ctr: previousCtr,
          avgRevenue: previousAvgRevenue,
          campaigns: previousCampaigns,
        },
        timeline: previousTimelineData,
      },
      campaigns: campaignComparisons,
    }

    return NextResponse.json(comparisonData)
  } catch (error) {
    console.error('Comparison API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getTimelineData(userId: string, startDate: Date, endDate: Date) {
  // Generate daily timeline data
  const days = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dayStart = new Date(currentDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(currentDate)
    dayEnd.setHours(23, 59, 59, 999)

    const [clicks, conversions, revenue] = await Promise.all([
      prisma.click.count({
        where: {
          userId,
          clickedAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      }),
      prisma.conversion.count({
        where: {
          userId,
          convertedAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
      }),
      prisma.conversion.aggregate({
        where: {
          userId,
          convertedAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
        _sum: {
          commission: true,
        },
      }),
    ])

    days.push({
      date: currentDate.toISOString().split('T')[0],
      clicks,
      conversions,
      revenue: revenue._sum.commission || 0,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
}

async function getCampaignComparisons(
  userId: string,
  currentStart: Date,
  currentEnd: Date,
  previousStart: Date,
  previousEnd: Date
) {
  // Get all campaigns the user has applied to
  const userCampaigns = await prisma.campaignUser.findMany({
    where: {
      userId,
      status: 'APPROVED',
    },
    include: {
      campaign: true,
    },
  })

  const campaignComparisons = []

  for (const application of userCampaigns) {
    const campaignId = application.campaignId

    // Current period metrics
    const [currentClicks, currentConversions, currentRevenue] = await Promise.all([
      prisma.click.count({
        where: {
          userId,
          campaignId,
          clickedAt: {
            gte: currentStart,
            lte: currentEnd,
          },
        },
      }),
      prisma.conversion.count({
        where: {
          userId,
          campaignId,
          convertedAt: {
            gte: currentStart,
            lte: currentEnd,
          },
        },
      }),
      prisma.conversion.aggregate({
        where: {
          userId,
          campaignId,
          convertedAt: {
            gte: currentStart,
            lte: currentEnd,
          },
        },
        _sum: {
          commission: true,
        },
      }),
    ])

    // Previous period metrics
    const [previousClicks, previousConversions, previousRevenue] = await Promise.all([
      prisma.click.count({
        where: {
          userId,
          campaignId,
          clickedAt: {
            gte: previousStart,
            lte: previousEnd,
          },
        },
      }),
      prisma.conversion.count({
        where: {
          userId,
          campaignId,
          convertedAt: {
            gte: previousStart,
            lte: previousEnd,
          },
        },
      }),
      prisma.conversion.aggregate({
        where: {
          userId,
          campaignId,
          convertedAt: {
            gte: previousStart,
            lte: previousEnd,
          },
        },
        _sum: {
          commission: true,
        },
      }),
    ])

    const currentRevenueAmount = currentRevenue._sum.commission || 0
    const previousRevenueAmount = previousRevenue._sum.commission || 0

    const currentCtr = currentClicks > 0 ? (currentConversions / currentClicks) * 100 : 0
    const previousCtr = previousClicks > 0 ? (previousConversions / previousClicks) * 100 : 0

    const currentAvgRevenue = currentConversions > 0 ? currentRevenueAmount / currentConversions : 0
    const previousAvgRevenue = previousConversions > 0 ? previousRevenueAmount / previousConversions : 0

    // Calculate changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100 * 100) / 100
    }

    campaignComparisons.push({
      id: campaignId,
      name: application.campaign.name,
      current: {
        clicks: currentClicks,
        conversions: currentConversions,
        revenue: currentRevenueAmount,
        ctr: currentCtr,
        avgRevenue: currentAvgRevenue,
        campaigns: 1,
      },
      previous: {
        clicks: previousClicks,
        conversions: previousConversions,
        revenue: previousRevenueAmount,
        ctr: previousCtr,
        avgRevenue: previousAvgRevenue,
        campaigns: 1,
      },
      change: {
        clicks: calculateChange(currentClicks, previousClicks),
        conversions: calculateChange(currentConversions, previousConversions),
        revenue: calculateChange(currentRevenueAmount, previousRevenueAmount),
        ctr: calculateChange(currentCtr, previousCtr),
      },
    })
  }

  return campaignComparisons
}
