import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { registerSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 400 }
      )
    }
    
    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)
    
    // Generate verification token for email verification
    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    
    // Create user with unverified status
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        isVerified: false, // User needs to verify email
        resetToken: verificationToken, // Using resetToken field for verification
        resetTokenExpiry: tokenExpiry,
        profile: {
          create: {}
        }
      },
      include: {
        profile: true
      }
    })
    
    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'REGISTER',
        title: 'Đăng ký tài khoản',
        description: `Tài khoản ${user.email} đã được tạo thành công - Chờ xác thực email`
      }
    })
    
    // In a real application, send verification email here
    console.log(`Email verification token for ${user.email}: ${verificationToken}`)
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json(
      { 
        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
        user: userWithoutPassword,
        // Remove this in production - only for development
        verificationToken: process.env.NODE_ENV === 'development' ? verificationToken : undefined
      },
      { status: 201 }
    )
    
  } catch (error: unknown) {
    console.error('Registration error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trong quá trình đăng ký' },
      { status: 500 }
    )
  }
}
