import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Không tìm thấy token' },
        { status: 401 }
      )
    }
    
    // Verify token
    const payload = await verifyToken(token)
    
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: 'Token không hợp lệ' },
        { status: 401 }
      )
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: {
        profile: true,
        _count: {
          select: {
            campaigns: true,
            clicks: true,
            conversions: true
          }
        }
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng' },
        { status: 404 }
      )
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user
    
    return NextResponse.json(
      { user: userWithoutPassword },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Me error:', error)
    
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
