import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const year = parseInt(url.searchParams.get('year') || new Date().getFullYear().toString());

    // Get user's conversions for the specified year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year + 1, 0, 1);

    const conversions = await prisma.conversion.findMany({
      where: {
        userId: token.userId as string,
        status: 'APPROVED',
        approvedAt: {
          gte: startDate,
          lt: endDate
        }
      },
      include: {
        campaign: {
          select: {
            name: true,
            category: true
          }
        }
      },
      orderBy: {
        approvedAt: 'desc'
      }
    });

    // Calculate tax summary
    const totalIncome = conversions.reduce((sum, conv) => sum + conv.commission, 0);
    const quarterlyBreakdown = calculateQuarterlyBreakdown(conversions, year);
    
    // Calculate tax based on Vietnamese tax rates
    const taxCalculation = calculatePersonalIncomeTax(totalIncome);
    
    const summary = {
      currentYear: year,
      totalIncome,
      totalTax: taxCalculation.taxAmount,
      quarterlyBreakdown,
      deductions: [
        { type: 'self', amount: 11000000, description: 'Giảm trừ bản thân' },
        { type: 'dependent', amount: 0, description: 'Người phụ thuộc' },
        { type: 'insurance', amount: 0, description: 'Bảo hiểm xã hội' }
      ]
    };

    // Get existing tax reports
    const reports = await prisma.taxReport.findMany({
      where: {
        userId: token.userId as string,
        year
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      summary,
      reports: reports.map(report => ({
        id: report.id,
        year: report.year,
        quarter: report.quarter,
        totalIncome: report.totalIncome,
        totalCommission: report.totalCommission,
        taxableIncome: report.taxableIncome,
        taxAmount: report.taxAmount,
        taxRate: report.taxRate,
        status: report.status,
        createdAt: report.createdAt.toISOString(),
        submittedAt: report.submittedAt?.toISOString(),
        dueDate: report.dueDate.toISOString()
      }))
    });
  } catch (error) {
    console.error('Error fetching tax data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function calculateQuarterlyBreakdown(conversions: any[], year: number) {
  const quarters = [1, 2, 3, 4].map(quarter => {
    const quarterStart = new Date(year, (quarter - 1) * 3, 1);
    const quarterEnd = new Date(year, quarter * 3, 0);
    
    const quarterConversions = conversions.filter(conv => {
      const date = new Date(conv.approvedAt);
      return date >= quarterStart && date <= quarterEnd;
    });
    
    const income = quarterConversions.reduce((sum, conv) => sum + conv.commission, 0);
    const taxCalc = calculatePersonalIncomeTax(income);
    
    return {
      quarter,
      income,
      tax: taxCalc.taxAmount,
      status: 'draft' // Default status
    };
  });
  
  return quarters;
}

function calculatePersonalIncomeTax(income: number, deductions: number = 11000000) {
  const taxableIncome = Math.max(0, income - deductions);
  
  const brackets = [
    { min: 0, max: 5000000, rate: 0.05 },
    { min: 5000000, max: 10000000, rate: 0.10 },
    { min: 10000000, max: 18000000, rate: 0.15 },
    { min: 18000000, max: 32000000, rate: 0.20 },
    { min: 32000000, max: 52000000, rate: 0.25 },
    { min: 52000000, max: 80000000, rate: 0.30 },
    { min: 80000000, max: Infinity, rate: 0.35 }
  ];
  
  let tax = 0;
  let remainingIncome = taxableIncome;
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const taxableAtThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableAtThisBracket * bracket.rate;
    remainingIncome -= taxableAtThisBracket;
  }
  
  return {
    taxableIncome,
    taxAmount: tax,
    effectiveRate: income > 0 ? (tax / income) * 100 : 0
  };
}
