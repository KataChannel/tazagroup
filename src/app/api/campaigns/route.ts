import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '12')
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')
    const status = url.searchParams.get('status')
    
    const skip = (page - 1) * limit
    
    const where: any = {}
    
    if (category && category !== 'all') {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status) {
      where.status = status
    } else {
      where.status = 'ACTIVE'
    }
    
    // If user is authenticated, include their application status
    const token = request.cookies.get('auth-token')?.value
    let userId = null
    
    if (token) {
      const payload = await verifyToken(token)
      if (payload && payload.userId) {
        userId = payload.userId as string
      }
    }
    
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        include: {
          users: userId ? {
            where: { userId },
            select: { status: true, appliedAt: true }
          } : false,
          _count: {
            select: {
              users: { where: { status: 'APPROVED' } },
              clicks: true,
              conversions: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.campaign.count({ where })
    ])
    
    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
    
  } catch (error) {
    console.error('Get campaigns error:', error)
    
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
