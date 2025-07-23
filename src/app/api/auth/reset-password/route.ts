import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { z } from 'zod'

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token là bắt buộc'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Xác nhận mật khẩu là bắt buộc')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword']
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = resetPasswordSchema.parse(body)
    
    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: validatedData.token,
        resetTokenExpiry: {
          gt: new Date() // Token hasn't expired
        }
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Token không hợp lệ hoặc đã hết hạn' },
        { status: 400 }
      )
    }
    
    // Hash new password
    const hashedPassword = await hashPassword(validatedData.password)
    
    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    })
    
    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        type: 'LOGIN',
        title: 'Đặt lại mật khẩu',
        description: 'Mật khẩu đã được thay đổi thành công'
      }
    })
    
    return NextResponse.json({
      message: 'Mật khẩu đã được đặt lại thành công'
    })
    
  } catch (error: any) {
    console.error('Password reset error:', error)
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi đặt lại mật khẩu' },
      { status: 500 }
    )
  }
}
