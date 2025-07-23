import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create sample payment history data
    const samplePayments = [
      // Positive amounts (income)
      {
        userId: user.id,
        amount: 500000,
        currency: 'VND',
        method: 'BANK_TRANSFER',
        status: 'COMPLETED',
        description: 'Commission from Campaign A',
        paidAt: new Date('2025-01-15')
      },
      {
        userId: user.id,
        amount: 750000,
        currency: 'VND',
        method: 'BANK_TRANSFER',
        status: 'COMPLETED',
        description: 'Commission from Campaign B',
        paidAt: new Date('2025-02-10')
      },
      {
        userId: user.id,
        amount: 300000,
        currency: 'VND',
        method: 'BANK_TRANSFER',
        status: 'COMPLETED',
        description: 'Commission from Campaign C',
        paidAt: new Date('2025-03-05')
      },
      // Negative amounts (withdrawals/payouts)
      {
        userId: user.id,
        amount: -200000,
        currency: 'VND',
        method: 'BANK_TRANSFER',
        status: 'COMPLETED',
        description: 'Payout to bank account',
        paidAt: new Date('2025-02-20')
      },
      {
        userId: user.id,
        amount: -150000,
        currency: 'VND',
        method: 'MOMO',
        status: 'COMPLETED',
        description: 'Payout to MoMo wallet',
        paidAt: new Date('2025-03-15')
      },
      {
        userId: user.id,
        amount: -100000,
        currency: 'VND',
        method: 'BANK_TRANSFER',
        status: 'PENDING',
        description: 'Pending payout request'
      }
    ]

    // Create the payments
    for (const payment of samplePayments) {
      await prisma.payment.create({
        data: {
          ...payment,
          method: payment.method as import('@prisma/client').PaymentMethod,
          status: payment.status as import('@prisma/client').PaymentStatus
        }
      })
    }

    // Update user payout settings
    await prisma.user.update({
      where: { id: user.id },
      data: {
        minimumPayout: 100000,
        autoPayoutEnabled: true,
        payoutThreshold: 500000,
        holdPayouts: false,
        preferredPayoutMethod: 'BANK_TRANSFER',
        payoutDay: 1,
        taxWithholding: 10,
        payoutCurrency: 'VND'
      }
    })

    // Create sample tax reports
    await prisma.taxReport.createMany({
      data: [
        {
          userId: user.id,
          year: 2025,
          quarter: 1,
          totalIncome: 800000,
          totalCommission: 800000,
          taxableIncome: 689000, // After deductions
          taxAmount: 34450, // 5% rate
          taxRate: 5,
          status: 'SUBMITTED',
          submittedAt: new Date('2025-04-15'),
          dueDate: new Date('2025-04-30')
        }
      ]
    })

    return NextResponse.json({
      message: 'Test data created successfully',
      paymentsCreated: samplePayments.length,
      userUpdated: true,
      taxReportCreated: true
    })

  } catch (error) {
    console.error('Error creating test data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
