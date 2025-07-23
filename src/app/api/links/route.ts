import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

// Create affiliate link schema
const createLinkSchema = z.object({
  campaignId: z.string(),
  originalUrl: z.string().url(),
  customAlias: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  expiresAt: z.string().datetime().optional()
})

// Get affiliate links
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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const campaignId = searchParams.get('campaignId')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      userId: decoded.userId
    }

    if (campaignId) {
      where.campaignId = campaignId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { customAlias: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get links with analytics
    const [links, total] = await Promise.all([
      prisma.affiliateLink.findMany({
        where,
        include: {
          campaign: {
            select: {
              id: true,
              name: true,
              commission: true
            }
          },
          _count: {
            select: {
              clicks: true,
              conversions: true
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder as 'asc' | 'desc'
        },
        skip,
        take: limit
      }),
      prisma.affiliateLink.count({ where })
    ])

    // Calculate analytics for each link
    const linksWithAnalytics = await Promise.all(
      links.map(async (link) => {
        // Get recent analytics (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const recentClicks = await prisma.linkClick.count({
          where: {
            linkId: link.id,
            clickedAt: { gte: thirtyDaysAgo }
          }
        })

        const recentConversions = await prisma.linkConversion.count({
          where: {
            linkId: link.id,
            convertedAt: { gte: thirtyDaysAgo }
          }
        })

        const recentRevenue = await prisma.linkConversion.aggregate({
          where: {
            linkId: link.id,
            convertedAt: { gte: thirtyDaysAgo }
          },
          _sum: {
            commission: true
          }
        })

        const ctr = link.totalClicks > 0 ? (link.totalConversions / link.totalClicks) * 100 : 0
        const avgRevenue = link.totalConversions > 0 ? link.totalRevenue / link.totalConversions : 0

        return {
          ...link,
          analytics: {
            recent30Days: {
              clicks: recentClicks,
              conversions: recentConversions,
              revenue: recentRevenue._sum.commission || 0
            },
            ctr: Math.round(ctr * 100) / 100,
            avgRevenue: Math.round(avgRevenue * 100) / 100,
            conversionRate: Math.round(ctr * 100) / 100
          }
        }
      })
    )

    return NextResponse.json({
      links: linksWithAnalytics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Get affiliate links error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Create new affiliate link
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

    const body = await request.json()
    const data = createLinkSchema.parse(body)

    // Verify campaign exists and user has access
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: data.campaignId,
        OR: [
          { isPrivate: false },
          { 
            users: {
              some: {
                userId: decoded.userId,
                status: 'APPROVED'
              }
            }
          }
        ]
      }
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found or access denied' },
        { status: 404 }
      )
    }

    // Generate unique short code
    const generateShortCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return result
    }

    let shortCode = data.customAlias || generateShortCode()
    let attempts = 0

    // Ensure unique short code
    while (attempts < 10) {
      const existing = await prisma.affiliateLink.findUnique({
        where: { shortCode }
      })

      if (!existing) break

      shortCode = generateShortCode()
      attempts++
    }

    if (attempts >= 10) {
      return NextResponse.json(
        { error: 'Could not generate unique short code' },
        { status: 500 }
      )
    }

    // Create affiliate link
    const affiliateLink = await prisma.affiliateLink.create({
      data: {
        userId: decoded.userId,
        campaignId: data.campaignId,
        originalUrl: data.originalUrl,
        shortCode,
        customAlias: data.customAlias,
        title: data.title,
        description: data.description,
        tags: data.tags || [],
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null
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

    // Log activity
    await prisma.activity.create({
      data: {
        userId: decoded.userId,
        type: 'CAMPAIGN_APPLY', // We can add new type later
        title: 'Tạo link affiliate',
        description: `Tạo link affiliate cho chiến dịch "${campaign.name}"`,
        metadata: JSON.stringify({
          linkId: affiliateLink.id,
          campaignId: data.campaignId,
          shortCode
        })
      }
    })

    return NextResponse.json({
      message: 'Affiliate link created successfully',
      link: affiliateLink
    }, { status: 201 })

  } catch (error) {
    console.error('Create affiliate link error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
