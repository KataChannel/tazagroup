import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')
    
    if (token) {
      // If we had a valid token, log the logout activity
      // Note: In a full implementation, you'd verify the token first
      // to get the user ID for logging
    }
    
    const response = NextResponse.json(
      { message: 'Đăng xuất thành công' },
      { status: 200 }
    )
    
    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trong quá trình đăng xuất' },
      { status: 500 }
    )
  }
}
