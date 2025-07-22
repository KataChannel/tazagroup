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
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
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
        description: `Tài khoản ${user.email} đã được tạo thành công`
      }
    })
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user
    
    return NextResponse.json(
      { 
        message: 'Đăng ký thành công',
        user: userWithoutPassword 
      },
      { status: 201 }
    )
    
  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trong quá trình đăng ký' },
      { status: 500 }
    )
  }
}
