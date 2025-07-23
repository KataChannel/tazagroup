import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const payload = await verifyToken(token)
    
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        minimumPayout: true,
        autoPayoutEnabled: true,
        payoutThreshold: true,
        holdPayouts: true,
        preferredPayoutMethod: true,
        payoutDay: true, // For weekly/monthly payouts
        taxWithholding: true,
        payoutCurrency: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get current balance and pending payouts
    const balance = await prisma.payment.aggregate({
      where: {
        userId: user.id,
        status: 'COMPLETED'
      },
      _sum: {
        amount: true
      }
    })

    const pendingWithdrawals = await prisma.payment.aggregate({
      where: {
        userId: user.id,
        status: 'PENDING',
        // Assume negative amounts are withdrawals
        amount: {
          lt: 0
        }
      },
      _sum: {
        amount: true
      }
    })

    const availableBalance = (balance._sum?.amount || 0) + (pendingWithdrawals._sum?.amount || 0)

    return NextResponse.json({
      settings: {
        minimumPayout: user.minimumPayout || 100000, // Default 100k VND
        autoPayoutEnabled: user.autoPayoutEnabled || false,
        payoutThreshold: user.payoutThreshold || 500000, // Default 500k VND
        holdPayouts: user.holdPayouts || false,
        preferredPayoutMethod: user.preferredPayoutMethod || 'BANK_TRANSFER',
        payoutDay: user.payoutDay || 1, // Default 1st of month
        taxWithholding: user.taxWithholding || 0,
        payoutCurrency: user.payoutCurrency || 'VND'
      },
      balance: {
        available: availableBalance,
        pending: Math.abs(pendingWithdrawals._sum?.amount || 0),
        total: balance._sum?.amount || 0
      }
    })

  } catch (error) {
    console.error('Error fetching payout settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const payload = await verifyToken(token)
    
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const {
      minimumPayout,
      autoPayoutEnabled,
      payoutThreshold,
      holdPayouts,
      preferredPayoutMethod,
      payoutDay,
      taxWithholding,
      payoutCurrency
    } = body

    // Validation
    if (minimumPayout && (minimumPayout < 50000 || minimumPayout > 10000000)) {
      return NextResponse.json(
        { error: 'Minimum payout must be between 50,000 and 10,000,000 VND' },
        { status: 400 }
      )
    }

    if (payoutThreshold && (payoutThreshold < minimumPayout)) {
      return NextResponse.json(
        { error: 'Payout threshold must be greater than minimum payout' },
        { status: 400 }
      )
    }

    if (payoutDay && (payoutDay < 1 || payoutDay > 31)) {
      return NextResponse.json(
        { error: 'Payout day must be between 1 and 31' },
        { status: 400 }
      )
    }

    if (taxWithholding && (taxWithholding < 0 || taxWithholding > 50)) {
      return NextResponse.json(
        { error: 'Tax withholding must be between 0% and 50%' },
        { status: 400 }
      )
    }

    // Update user settings
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        minimumPayout: minimumPayout || undefined,
        autoPayoutEnabled: autoPayoutEnabled !== undefined ? autoPayoutEnabled : undefined,
        payoutThreshold: payoutThreshold || undefined,
        holdPayouts: holdPayouts !== undefined ? holdPayouts : undefined,
        preferredPayoutMethod: preferredPayoutMethod || undefined,
        payoutDay: payoutDay || undefined,
        taxWithholding: taxWithholding !== undefined ? taxWithholding : undefined,
        payoutCurrency: payoutCurrency || undefined
      },
      select: {
        minimumPayout: true,
        autoPayoutEnabled: true,
        payoutThreshold: true,
        holdPayouts: true,
        preferredPayoutMethod: true,
        payoutDay: true,
        taxWithholding: true,
        payoutCurrency: true
      }
    })

    // Log the settings change
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastActivityAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Payout settings updated successfully',
      settings: updatedUser
    })

  } catch (error) {
    console.error('Error updating payout settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get payout history and statistics
export async function PUT(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token
    const payload = await verifyToken(token)
    
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { action } = await request.json()

    if (action === 'get_history') {
      // Get payout history for the last 12 months
      const payoutHistory = await prisma.payment.findMany({
        where: {
          userId: user.id,
          amount: {
            lt: 0 // Assume negative amounts are withdrawals/payouts
          },
          createdAt: {
            gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last 12 months
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 50,
        select: {
          id: true,
          amount: true,
          status: true,
          method: true,
          createdAt: true,
          paidAt: true,
          description: true
        }
      })

      // Get payout statistics
      const stats = await prisma.payment.groupBy({
        by: ['status'],
        where: {
          userId: user.id,
          amount: {
            lt: 0 // Assume negative amounts are withdrawals/payouts
          },
          createdAt: {
            gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          }
        },
        _sum: {
          amount: true
        },
        _count: {
          id: true
        }
      })

      return NextResponse.json({
        history: payoutHistory,
        statistics: stats
      })
    }

    if (action === 'test_settings') {
      // Test if current balance meets payout requirements
      const balance = await prisma.payment.aggregate({
        where: {
          userId: user.id,
          status: 'COMPLETED'
        },
        _sum: {
          amount: true
        }
      })

      const userSettings = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          minimumPayout: true,
          payoutThreshold: true,
          holdPayouts: true
        }
      })

      const availableBalance = balance._sum.amount || 0
      const minimumPayout = userSettings?.minimumPayout || 100000
      const payoutThreshold = userSettings?.payoutThreshold || 500000
      const holdPayouts = userSettings?.holdPayouts || false

      const canPayout = !holdPayouts && availableBalance >= minimumPayout
      const autoPayoutEligible = !holdPayouts && availableBalance >= payoutThreshold

      return NextResponse.json({
        availableBalance,
        minimumPayout,
        payoutThreshold,
        canPayout,
        autoPayoutEligible,
        holdPayouts,
        nextAutoPayoutAmount: autoPayoutEligible ? availableBalance : 0
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Error processing payout settings request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
