import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { profileSchema } from '@/lib/validations'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
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
    
    // Get user profile
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: {
        profile: true,
        _count: {
          select: {
            campaigns: { where: { status: 'APPROVED' } },
            clicks: true,
            conversions: { where: { status: 'APPROVED' } }
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
    console.error('Get profile error:', error)
    
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Không có quyền truy cập' },
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
    
    const body = await request.json()
    
    // Validate input
    const validatedData = profileSchema.parse(body)
    
    // Update profile
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId as string },
      data: {
        profile: {
          upsert: {
            create: validatedData,
            update: validatedData
          }
        }
      },
      include: {
        profile: true
      }
    })
    
    // Log activity
    await prisma.activity.create({
      data: {
        userId: payload.userId as string,
        type: 'PROFILE_UPDATE',
        title: 'Cập nhật hồ sơ',
        description: 'Thông tin hồ sơ đã được cập nhật'
      }
    })
    
    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser
    
    return NextResponse.json(
      { 
        message: 'Cập nhật hồ sơ thành công',
        user: userWithoutPassword 
      },
      { status: 200 }
    )
    
  } catch (error: any) {
    console.error('Update profile error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trong quá trình cập nhật' },
      { status: 500 }
    )
  }
}
