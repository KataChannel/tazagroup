import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email là bắt buộc' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email không tồn tại trong hệ thống' },
        { status: 404 }
      )
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: 'Email đã được xác thực' },
        { status: 400 }
      )
    }

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

    // Save verification token to user (using resetToken field temporarily)
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: verificationToken,
        resetTokenExpiry: tokenExpiry
      }
    })

    // In a real application, you would send an email here
    // For now, we'll just return the token (remove this in production)
    console.log(`Email verification token for ${email}: ${verificationToken}`)

    return NextResponse.json({
      message: 'Link xác thực email đã được gửi đến địa chỉ email của bạn',
      // Remove this in production - only for development
      verificationToken: process.env.NODE_ENV === 'development' ? verificationToken : undefined
    })

  } catch (error) {
    console.error('Email verification request error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi gửi email xác thực' },
      { status: 500 }
    )
  }
}
