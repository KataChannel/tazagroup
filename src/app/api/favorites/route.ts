import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { campaignId } = await request.json()
    
    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 })
    }

    // Check if campaign exists
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId }
    })

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Check if already favorited
    const existingFavorite = await prisma.favoriteCampaign.findUnique({
      where: {
        userId_campaignId: {
          userId: decoded.userId,
          campaignId
        }
      }
    })

    if (existingFavorite) {
      return NextResponse.json({ error: 'Campaign already favorited' }, { status: 400 })
    }

    // Add to favorites
    const favorite = await prisma.favoriteCampaign.create({
      data: {
        userId: decoded.userId,
        campaignId
      }
    })

    return NextResponse.json({ 
      message: 'Campaign added to favorites',
      favorite 
    })
  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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
    const campaignId = searchParams.get('campaignId')
    
    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 })
    }

    // Remove from favorites
    const deleted = await prisma.favoriteCampaign.delete({
      where: {
        userId_campaignId: {
          userId: decoded.userId,
          campaignId
        }
      }
    })

    return NextResponse.json({ 
      message: 'Campaign removed from favorites',
      deleted 
    })
  } catch (error) {
    console.error('Remove favorite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

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

    // Get user's favorite campaigns
    const favorites = await prisma.favoriteCampaign.findMany({
      where: {
        userId: decoded.userId
      },
      include: {
        campaign: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
