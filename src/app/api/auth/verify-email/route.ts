import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token xác thực là bắt buộc' },
        { status: 400 }
      )
    }

    // Find user with valid verification token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date() // Token hasn't expired
        },
        isVerified: false
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Token xác thực không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      )
    }

    // Update user as verified and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        emailVerified: new Date(),
        resetToken: null,
        resetTokenExpiry: null
      }
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'LOGIN',
        title: 'Xác thực email',
        description: `Email ${user.email} đã được xác thực thành công`
      }
    })

    return NextResponse.json({
      message: 'Email đã được xác thực thành công'
    })

  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xác thực email' },
      { status: 500 }
    )
  }
}
