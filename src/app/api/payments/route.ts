import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
    
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const status = url.searchParams.get('status')
    
    const skip = (page - 1) * limit
    
    const where: any = {
      userId: payload.userId as string
    }
    
    if (status) {
      where.status = status
    }
    
    // Get payments
    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.payment.count({ where })
    ])
    
    return NextResponse.json(
      { 
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Get payments error:', error)
    
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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
    const { amount, method, description } = body
    
    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Số tiền không hợp lệ' },
        { status: 400 }
      )
    }
    
    // Check user's balance (total approved conversions - total paid)
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: {
        conversions: {
          where: { status: 'APPROVED' },
          select: { commission: true }
        },
        payments: {
          where: { status: 'COMPLETED' },
          select: { amount: true }
        }
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng' },
        { status: 404 }
      )
    }
    
    const totalEarned = user.conversions.reduce((sum, conv) => sum + conv.commission, 0)
    const totalPaid = user.payments.reduce((sum, payment) => sum + payment.amount, 0)
    const availableBalance = totalEarned - totalPaid
    
    if (amount > availableBalance) {
      return NextResponse.json(
        { error: 'Số dư không đủ' },
        { status: 400 }
      )
    }
    
    // Create payment request
    const payment = await prisma.payment.create({
      data: {
        userId: payload.userId as string,
        amount,
        method: method || 'BANK_TRANSFER',
        description: description || 'Yêu cầu rút tiền',
        status: 'PENDING'
      }
    })
    
    // Log activity
    await prisma.activity.create({
      data: {
        userId: payload.userId as string,
        type: 'PAYMENT',
        title: 'Yêu cầu thanh toán',
        description: `Yêu cầu rút ${amount.toLocaleString('vi-VN')} VND`
      }
    })
    
    return NextResponse.json(
      { 
        message: 'Tạo yêu cầu thanh toán thành công',
        payment 
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Create payment error:', error)
    
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi trong quá trình tạo yêu cầu thanh toán' },
      { status: 500 }
    )
  }
}
