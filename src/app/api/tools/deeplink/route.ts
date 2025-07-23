import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import crypto from 'crypto'

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

    const { 
      campaignId, 
      targetUrl, 
      utm_source = 'affiliate',
      utm_medium = 'deeplink',
      utm_campaign,
      utm_content,
      utm_term,
      customParameters = {} 
    } = await request.json()

    const userId = decoded.userId

    if (!campaignId || !targetUrl) {
      return NextResponse.json(
        { error: 'Campaign ID and target URL are required' },
        { status: 400 }
      )
    }

    // Verify campaign exists and user has access
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    })

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Check if user is approved for this campaign
    const campaignUser = await prisma.campaignUser.findUnique({
      where: {
        userId_campaignId: {
          userId,
          campaignId
        }
      }
    })

    if (!campaignUser || campaignUser.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'You are not approved for this campaign' },
        { status: 403 }
      )
    }

    // Generate unique tracking ID
    const trackingId = crypto.randomBytes(16).toString('hex')
    
    // Build deep link URL with parameters
    const url = new URL(targetUrl)
    
    // Add UTM parameters
    url.searchParams.set('utm_source', utm_source)
    url.searchParams.set('utm_medium', utm_medium)
    url.searchParams.set('utm_campaign', utm_campaign || campaign.name.toLowerCase().replace(/\s+/g, '-'))
    
    if (utm_content) url.searchParams.set('utm_content', utm_content)
    if (utm_term) url.searchParams.set('utm_term', utm_term)
    
    // Add affiliate tracking parameters
    url.searchParams.set('aff_id', userId)
    url.searchParams.set('campaign_id', campaignId)
    url.searchParams.set('tracking_id', trackingId)
    
    // Add custom parameters
    Object.entries(customParameters).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, String(value))
      }
    })

    // Create tracking record
    await prisma.activity.create({
      data: {
        userId,
        type: 'CLICK', // We'll track when this link is actually used
        title: 'Deep Link Generated',
        description: `Generated deep link for campaign: ${campaign.name}`,
        metadata: JSON.stringify({
          campaignId,
          trackingId,
          targetUrl,
          generatedUrl: url.toString(),
          utm_parameters: {
            utm_source,
            utm_medium,
            utm_campaign: utm_campaign || campaign.name.toLowerCase().replace(/\s+/g, '-'),
            utm_content,
            utm_term
          },
          customParameters
        })
      }
    })

    // Generate shortened version (optional)
    const shortCode = crypto.randomBytes(6).toString('hex')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const shortenedUrl = `${baseUrl}/link/${shortCode}`

    return NextResponse.json({
      success: true,
      deepLink: {
        id: trackingId,
        originalUrl: targetUrl,
        trackedUrl: url.toString(),
        shortenedUrl,
        shortCode,
        campaign: {
          id: campaign.id,
          name: campaign.name
        },
        parameters: {
          utm_source,
          utm_medium,
          utm_campaign: utm_campaign || campaign.name.toLowerCase().replace(/\s+/g, '-'),
          utm_content,
          utm_term,
          ...customParameters
        },
        createdAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Deep link generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate deep link' },
      { status: 500 }
    )
  }
}

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

    // Get user's generated deep links from activities
    const activities = await prisma.activity.findMany({
      where: {
        userId,
        title: 'Deep Link Generated'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    })

    const deepLinks = activities.map(activity => {
      let metadata = {}
      try {
        metadata = JSON.parse(activity.metadata || '{}')
      } catch (e) {
        console.error('Failed to parse metadata:', e)
      }

      return {
        id: activity.id,
        trackingId: metadata.trackingId || 'unknown',
        campaignId: metadata.campaignId,
        targetUrl: metadata.targetUrl,
        generatedUrl: metadata.generatedUrl,
        parameters: metadata.utm_parameters || {},
        customParameters: metadata.customParameters || {},
        createdAt: activity.createdAt
      }
    })

    return NextResponse.json({
      deepLinks
    })

  } catch (error) {
    console.error('Get deep links error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deep links' },
      { status: 500 }
    )
  }
}
