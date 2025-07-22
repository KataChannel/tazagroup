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
    
    // Get user's financial data
    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      include: {
        conversions: {
          where: { status: 'APPROVED' },
          select: { commission: true, convertedAt: true }
        },
        payments: {
          where: { status: 'COMPLETED' },
          select: { amount: true, paidAt: true }
        },
        clicks: {
          select: { clickedAt: true }
        }
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Không tìm thấy người dùng' },
        { status: 404 }
      )
    }
    
    // Calculate balance
    const totalEarned = user.conversions.reduce((sum, conv) => sum + conv.commission, 0)
    const totalPaid = user.payments.reduce((sum, payment) => sum + payment.amount, 0)
    const availableBalance = totalEarned - totalPaid
    
    // Get monthly earnings (last 12 months)
    const now = new Date()
    const monthlyEarnings = []
    
    for (let i = 11; i >= 0; i--) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const earnings = user.conversions
        .filter(conv => {
          const convertedAt = new Date(conv.convertedAt)
          return convertedAt >= startOfMonth && convertedAt <= endOfMonth
        })
        .reduce((sum, conv) => sum + conv.commission, 0)
      
      monthlyEarnings.push({
        month: startOfMonth.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit' }),
        earnings
      })
    }
    
    // Get recent transactions
    const recentTransactions = [
      ...user.conversions.slice(-10).map(conv => ({
        type: 'earning',
        amount: conv.commission,
        date: conv.convertedAt,
        description: 'Hoa hồng từ chuyển đổi'
      })),
      ...user.payments.slice(-10).map(payment => ({
        type: 'payout',
        amount: -payment.amount,
        date: payment.paidAt || new Date(),
        description: 'Rút tiền'
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)
    
    const balance = {
      totalEarned,
      totalPaid,
      availableBalance,
      monthlyEarnings,
      recentTransactions,
      totalClicks: user.clicks.length,
      totalConversions: user.conversions.length,
      conversionRate: user.clicks.length > 0 ? (user.conversions.length / user.clicks.length * 100) : 0
    }
    
    return NextResponse.json(
      { balance },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Get balance error:', error)
    
    return NextResponse.json(
      { error: 'Đã xảy ra lỗi' },
      { status: 500 }
    )
  }
}
