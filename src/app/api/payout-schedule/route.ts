import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { PayoutFrequency } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schedule = await prisma.payoutSchedule.findUnique({
      where: { userId: token.userId as string },
      include: {
        payouts: {
          orderBy: { scheduledDate: 'desc' },
          take: 10
        }
      }
    });

    return NextResponse.json({ 
      schedule: schedule || {
        frequency: 'MONTHLY',
        dayOfMonth: 1,
        minimumAmount: 100000,
        isActive: false,
        nextPayoutDate: null,
        lastPayoutDate: null
      }
    });
  } catch (error) {
    console.error('Error fetching payout schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { frequency, dayOfMonth, dayOfWeek, minimumAmount, isActive } = body;

    // Validate inputs
    if (!['WEEKLY', 'MONTHLY', 'QUARTERLY'].includes(frequency)) {
      return NextResponse.json({ error: 'Invalid frequency' }, { status: 400 });
    }

    if (frequency === 'MONTHLY' && (!dayOfMonth || dayOfMonth < 1 || dayOfMonth > 31)) {
      return NextResponse.json({ error: 'Invalid day of month' }, { status: 400 });
    }

    if (frequency === 'WEEKLY' && (dayOfWeek === undefined || dayOfWeek < 0 || dayOfWeek > 6)) {
      return NextResponse.json({ error: 'Invalid day of week' }, { status: 400 });
    }

    if (minimumAmount < 50000) {
      return NextResponse.json({ error: 'Minimum amount cannot be less than 50,000 VND' }, { status: 400 });
    }

    // Calculate next payout date
    const nextPayoutDate = calculateNextPayoutDate(frequency, dayOfMonth, dayOfWeek);

    const schedule = await prisma.payoutSchedule.upsert({
      where: { userId: token.userId as string },
      update: {
        frequency: frequency as PayoutFrequency,
        dayOfMonth,
        dayOfWeek,
        minimumAmount,
        isActive,
        nextPayoutDate: isActive ? nextPayoutDate : null
      },
      create: {
        userId: token.userId as string,
        frequency: frequency as PayoutFrequency,
        dayOfMonth,
        dayOfWeek,
        minimumAmount,
        isActive,
        nextPayoutDate: isActive ? nextPayoutDate : null
      },
      include: {
        payouts: {
          orderBy: { scheduledDate: 'desc' },
          take: 10
        }
      }
    });

    return NextResponse.json({ success: true, schedule });
  } catch (error) {
    console.error('Error updating payout schedule:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateNextPayoutDate(frequency: string, dayOfMonth?: number, dayOfWeek?: number): Date {
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
