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
    const period = searchParams.get('period') || '30d'
    const campaign = searchParams.get('campaign') || 'all'
    const search = searchParams.get('search') || ''

    const userId = decoded.userId as string

    // Calculate date range based on period
    const endDate = new Date()
    const startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(startDate.getDate() - 30)
    }

    endDate.setHours(23, 59, 59, 999)
    startDate.setHours(0, 0, 0, 0)

    // Build where clause for filtering
    const whereClause: any = {
      userId,
      convertedAt: {
        gte: startDate,
        lte: endDate,
      },
    }

    if (campaign !== 'all') {
      whereClause.campaignId = campaign
    }

    if (search) {
      whereClause.OR = [
        {
          campaign: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ]
    }

    // Get total commission data
    const [totalCommissions, confirmedCommissions, pendingCommissions] = await Promise.all([
      prisma.conversion.aggregate({
        where: whereClause,
        _sum: {
          commission: true,
        },
        _count: true,
      }),
      prisma.conversion.aggregate({
        where: {
          ...whereClause,
          status: 'CONFIRMED',
        },
        _sum: {
          commission: true,
        },
      }),
      prisma.conversion.aggregate({
        where: {
          ...whereClause,
          status: 'PENDING',
        },
        _sum: {
          commission: true,
        },
      }),
    ])

    const totalCommission = totalCommissions._sum.commission || 0
    const confirmedCommission = confirmedCommissions._sum.commission || 0
    const pendingCommission = pendingCommissions._sum.commission || 0
    const averageCommission = totalCommissions._count > 0 ? totalCommission / totalCommissions._count : 0

    // Get timeline data
    const timelineData = await getCommissionTimeline(userId, startDate, endDate, campaign)

    // Get campaign breakdown
    const campaignData = await getCampaignCommissions(userId, startDate, endDate, search)

    // Get commission tiers
    const commissionTiers = await getCommissionTiers(userId, startDate, endDate, campaign)

    // Get recent transactions
    const transactions = await getCommissionTransactions(userId, startDate, endDate, campaign, search)

    // Get top campaign
    const topCampaign = campaignData.length > 0 ? campaignData[0].name : 'N/A'

    const commissionReportData = {
      summary: {
        totalCommission,
        pendingCommission,
        confirmedCommission,
        averageCommission,
        commissionRate: 12.5, // This could be calculated based on business logic
        topCampaign,
      },
      timeline: timelineData,
      campaigns: campaignData,
      commissionTiers,
      transactions,
    }

    return NextResponse.json(commissionReportData)
  } catch (error) {
    console.error('Commission reports API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getCommissionTimeline(userId: string, startDate: Date, endDate: Date, campaign: string) {
  const days = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    const dayStart = new Date(currentDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(currentDate)
    dayEnd.setHours(23, 59, 59, 999)

    const whereClause: any = {
      userId,
      convertedAt: {
        gte: dayStart,
        lte: dayEnd,
      },
    }

    if (campaign !== 'all') {
      whereClause.campaignId = campaign
    }

    const [commissionData, conversions] = await Promise.all([
      prisma.conversion.aggregate({
        where: whereClause,
        _sum: {
          commission: true,
        },
        _count: true,
      }),
      prisma.conversion.count({
        where: whereClause,
      }),
    ])

    const commission = commissionData._sum.commission || 0
    const averageCommission = commissionData._count > 0 ? commission / commissionData._count : 0

    days.push({
      date: currentDate.toISOString().split('T')[0],
      commission,
      conversions,
      averageCommission,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
}

async function getCampaignCommissions(userId: string, startDate: Date, endDate: Date, search: string) {
  const whereClause: any = {
    userId,
    convertedAt: {
      gte: startDate,
      lte: endDate,
    },
  }

  if (search) {
    whereClause.campaign = {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    }
  }

  const campaignCommissions = await prisma.conversion.groupBy({
    by: ['campaignId'],
    where: whereClause,
    _sum: {
      commission: true,
    },
    _count: true,
    orderBy: {
      _sum: {
        commission: 'desc',
      },
    },
  })

  const campaignData = []

  for (const commission of campaignCommissions) {
    const campaign = await prisma.campaign.findUnique({
      where: { id: commission.campaignId },
      select: { name: true, commission: true },
    })

    if (campaign) {
      campaignData.push({
        id: commission.campaignId,
        name: campaign.name,
        totalCommission: commission._sum.commission || 0,
        conversions: commission._count,
        commissionRate: campaign.commission,
        averageCommission: commission._count > 0 ? (commission._sum.commission || 0) / commission._count : 0,
        status: 'confirmed',
        change: Math.floor(Math.random() * 30) - 10, // Mock data for change percentage
      })
    }
  }

  return campaignData
}

async function getCommissionTiers(userId: string, startDate: Date, endDate: Date, campaign: string) {
  const whereClause: any = {
    userId,
    convertedAt: {
      gte: startDate,
      lte: endDate,
    },
  }

  if (campaign !== 'all') {
    whereClause.campaignId = campaign
  }

  const commissions = await prisma.conversion.findMany({
    where: whereClause,
    select: {
      commission: true,
    },
  })

  // Define tiers
  const tiers = [
    { tier: '< 100K', min: 0, max: 100000 },
    { tier: '100K - 500K', min: 100000, max: 500000 },
    { tier: '500K - 1M', min: 500000, max: 1000000 },
    { tier: '1M - 5M', min: 1000000, max: 5000000 },
    { tier: '> 5M', min: 5000000, max: Infinity },
  ]

  const tierData = tiers.map(tier => {
    const tierCommissions = commissions.filter(c => 
      (c.commission || 0) >= tier.min && (c.commission || 0) < tier.max
    )
    const totalAmount = tierCommissions.reduce((sum, c) => sum + (c.commission || 0), 0)
    const count = tierCommissions.length
    const percentage = commissions.length > 0 ? (count / commissions.length) * 100 : 0

    return {
      tier: tier.tier,
      minCommission: tier.min,
      maxCommission: tier.max === Infinity ? 10000000 : tier.max,
      count,
      totalAmount,
      percentage: Math.round(percentage * 100) / 100,
    }
  })

  return tierData
}

async function getCommissionTransactions(userId: string, startDate: Date, endDate: Date, campaign: string, search: string) {
  const whereClause: any = {
    userId,
    convertedAt: {
      gte: startDate,
      lte: endDate,
    },
  }

  if (campaign !== 'all') {
    whereClause.campaignId = campaign
  }

  if (search) {
    whereClause.campaign = {
      name: {
        contains: search,
        mode: 'insensitive',
      },
    }
  }

  const transactions = await prisma.conversion.findMany({
    where: whereClause,
    include: {
      campaign: {
        select: {
          name: true,
          commission: true,
        },
      },
    },
    orderBy: {
      convertedAt: 'desc',
    },
    take: 50,
  })

  return transactions.map(transaction => ({
    id: transaction.id,
    campaignName: transaction.campaign.name,
    date: transaction.convertedAt.toLocaleDateString('vi-VN'),
    type: 'purchase',
    amount: transaction.amount || 0,
    commission: transaction.commission || 0,
    rate: transaction.campaign.commission,
    status: transaction.status?.toLowerCase() || 'pending',
  }))
}
