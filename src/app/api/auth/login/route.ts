import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, signToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: {
        profile: true
      }
    })
    
    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }
    
    // Verify password
    const isValidPassword = await verifyPassword(validatedData.password, user.password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }
    
    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Tài khoản đã bị khóa' },
        { status: 403 }
      )
    }
    
    // Generate JWT token
    const token = await signToken({ 
      userId: user.id, 
      email: user.email,
      role: user.role 
    })
    
    // Log activity
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'LOGIN',
        title: 'Đăng nhập',
        description: `Đăng nhập thành công từ ${clientIp}`
      }
    })
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user
    
    const response = NextResponse.json(
      { 
        message: 'Đăng nhập thành công',
        user: userWithoutPassword,
        token 
      },
      { status: 200 }
    )
    
    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return response
    
  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trong quá trình đăng nhập' },
      { status: 500 }
    )
  }
}
