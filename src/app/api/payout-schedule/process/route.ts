import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PayoutFrequency, ScheduledPayoutStatus, PaymentStatus, PaymentMethod } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    // This would typically be called by a cron job with proper authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find active schedules that are due for payout
    const dueSchedules = await prisma.payoutSchedule.findMany({
      where: {
        isActive: true,
        nextPayoutDate: {
          lte: today
        }
      },
      include: {
        user: {
          include: {
            profile: true,
            conversions: {
              where: {
                status: 'APPROVED',
                approvedAt: {
                  not: null
                }
              }
            }
          }
        }
      }
    });

    const results = [];

    for (const schedule of dueSchedules) {
      try {
        // Calculate available balance (approved conversions minus paid amounts)
        const paidPayments = await prisma.payment.aggregate({
          where: {
            userId: schedule.userId,
            status: 'COMPLETED'
          },
          _sum: {
            amount: true
          }
        });

        const totalEarnings = schedule.user.conversions.reduce((sum, conv) => sum + conv.commission, 0);
        const availableBalance = totalEarnings - (paidPayments._sum.amount || 0);

        if (availableBalance >= schedule.minimumAmount) {
          // Create scheduled payout
          const scheduledPayout = await prisma.scheduledPayout.create({
            data: {
              userId: schedule.userId,
              scheduleId: schedule.id,
              amount: availableBalance,
              scheduledDate: schedule.nextPayoutDate!,
              status: 'PENDING'
            }
          });

          // Create actual payment record
          const payment = await prisma.payment.create({
            data: {
              userId: schedule.userId,
              amount: availableBalance,
              method: 'BANK_TRANSFER', // Default method
              status: 'PENDING',
              description: `Scheduled payout - ${schedule.frequency}`,
              reference: `SCHED_${scheduledPayout.id}`
            }
          });

          // Update scheduled payout with payment reference
          await prisma.scheduledPayout.update({
            where: { id: scheduledPayout.id },
            data: {
              paymentId: payment.id,
              status: 'PROCESSING'
            }
          });

          // Calculate next payout date
          const nextPayoutDate = calculateNextPayoutDate(
            schedule.frequency,
            schedule.dayOfMonth,
            schedule.dayOfWeek
          );

          // Update schedule with next payout date
          await prisma.payoutSchedule.update({
            where: { id: schedule.id },
            data: {
              nextPayoutDate,
              lastPayoutDate: schedule.nextPayoutDate
            }
          });

          results.push({
            userId: schedule.userId,
            amount: availableBalance,
            status: 'processed',
            paymentId: payment.id
          });
        } else {
          results.push({
            userId: schedule.userId,
            amount: availableBalance,
            status: 'insufficient_balance',
            minimumRequired: schedule.minimumAmount
          });
        }
      } catch (error) {
        console.error(`Error processing payout for user ${schedule.userId}:`, error);
        results.push({
          userId: schedule.userId,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results
    });
  } catch (error) {
    console.error('Error processing scheduled payouts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get scheduled payouts for a user
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const scheduledPayouts = await prisma.scheduledPayout.findMany({
      where: { userId },
      orderBy: { scheduledDate: 'desc' },
      take: 50
    });

    return NextResponse.json({ scheduledPayouts });
  } catch (error) {
    console.error('Error fetching scheduled payouts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateNextPayoutDate(frequency: PayoutFrequency, dayOfMonth?: number | null, dayOfWeek?: number | null): Date {
  const now = new Date();
  let nextDate = new Date();

  switch (frequency) {
    case 'WEEKLY':
      const currentDay = now.getDay();
      const daysUntilNext = ((dayOfWeek! - currentDay + 7) % 7) || 7;
      nextDate.setDate(now.getDate() + daysUntilNext);
      break;

    case 'MONTHLY':
      const targetDay = Math.min(dayOfMonth!, new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
      nextDate.setMonth(now.getMonth() + 1);
      nextDate.setDate(targetDay);
      
      // If the target day has already passed this month, set for next month
      if (now.getDate() >= targetDay && now.getMonth() === nextDate.getMonth()) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      break;

    case 'QUARTERLY':
      const currentMonth = now.getMonth();
      const nextQuarter = Math.floor(currentMonth / 3) + 1;
      const nextQuarterMonth = (nextQuarter * 3) % 12;
      nextDate.setMonth(nextQuarterMonth);
      nextDate.setDate(1);
      
      if (nextQuarterMonth === 0) {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
      break;
  }

  nextDate.setHours(9, 0, 0, 0); // Set to 9 AM
  return nextDate;
}
