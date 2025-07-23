import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

interface FilterCriteria {
  field: string;
  operator: string;
  value: string;
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    if (!token?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { filters, export: shouldExport } = body;

    // Build dynamic where clause based on filters
    const whereClause = buildWhereClause(filters, token.userId as string);

    // Query conversions with filters
    const conversions = await prisma.conversion.findMany({
      where: whereClause,
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            category: true
          }
        }
      },
      orderBy: {
        convertedAt: 'desc'
      },
      take: shouldExport ? undefined : 1000 // Limit for non-export queries
    });

    // If export is requested, return CSV format
    if (shouldExport) {
      const csvData = convertToCSV(conversions);
      return new NextResponse(csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="filtered-report.csv"'
        }
      });
    }

    // Process results for summary statistics
    const results = conversions.map(conversion => ({
      id: conversion.id,
      campaignId: conversion.campaignId,
      campaignName: conversion.campaign.name,
      campaignCategory: conversion.campaign.category,
      amount: conversion.amount,
      commission: conversion.commission,
      currency: conversion.currency,
      status: conversion.status,
      date: conversion.convertedAt.toISOString(),
      approvedAt: conversion.approvedAt?.toISOString(),
      ip: conversion.ip,
      userAgent: conversion.userAgent
    }));

    // Calculate summary statistics
    const summary = {
      totalAmount: results.reduce((sum, r) => sum + r.amount, 0),
      totalCommission: results.reduce((sum, r) => sum + r.commission, 0),
      totalTransactions: results.length,
      averageAmount: results.length > 0 ? results.reduce((sum, r) => sum + r.amount, 0) / results.length : 0,
      averageCommission: results.length > 0 ? results.reduce((sum, r) => sum + r.commission, 0) / results.length : 0,
      statusBreakdown: getStatusBreakdown(results),
      campaignBreakdown: getCampaignBreakdown(results)
    };

    return NextResponse.json({
      success: true,
      results,
      total: results.length,
      summary
    });
  } catch (error) {
    console.error('Error processing filtered report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function buildWhereClause(filters: FilterCriteria[], userId: string) {
  const baseWhere: any = {
    userId: userId
  };

  if (!filters || filters.length === 0) {
    return baseWhere;
  }

  const conditions: any[] = [];

  filters.forEach(filter => {
    const condition = buildFilterCondition(filter);
    if (condition) {
      conditions.push(condition);
    }
  });

  if (conditions.length > 0) {
    baseWhere.AND = conditions;
  }

  return baseWhere;
}

function buildFilterCondition(filter: FilterCriteria) {
  const { field, operator, value } = filter;

  if (!value) return null;

  switch (field) {
    case 'campaign':
      return buildCampaignFilter(operator, value);
    case 'status':
      return buildStatusFilter(operator, value);
    case 'amount':
      return buildNumberFilter('amount', operator, value);
    case 'commission':
      return buildNumberFilter('commission', operator, value);
    case 'date':
      return buildDateFilter(operator, value);
    case 'country':
      return buildTextFilter('ip', operator, value); // Simplified - would need IP to country mapping
    case 'device':
    case 'browser':
      return buildTextFilter('userAgent', operator, value);
    default:
      return null;
  }
}

function buildCampaignFilter(operator: string, value: string) {
  switch (operator) {
    case 'equals':
      return { campaignId: value };
    case 'in':
      return { campaignId: { in: value.split(',') } };
    case 'notIn':
      return { campaignId: { notIn: value.split(',') } };
    default:
      return { campaignId: value };
  }
}

function buildStatusFilter(operator: string, value: string) {
  switch (operator) {
    case 'equals':
      return { status: value.toUpperCase() };
    case 'in':
      return { status: { in: value.split(',').map(v => v.toUpperCase()) } };
    case 'notIn':
      return { status: { notIn: value.split(',').map(v => v.toUpperCase()) } };
    default:
      return { status: value.toUpperCase() };
  }
}

function buildNumberFilter(field: string, operator: string, value: string) {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return null;

  switch (operator) {
    case 'equals':
      return { [field]: numValue };
    case 'greaterThan':
      return { [field]: { gt: numValue } };
    case 'lessThan':
      return { [field]: { lt: numValue } };
    case 'between':
      const [min, max] = value.split(',').map(v => parseFloat(v.trim()));
      if (!isNaN(min) && !isNaN(max)) {
        return { [field]: { gte: min, lte: max } };
      }
      return null;
    default:
      return { [field]: numValue };
  }
}

function buildDateFilter(operator: string, value: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (operator) {
    case 'equals':
      const targetDate = new Date(value);
      const nextDay = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);
      return {
        convertedAt: {
          gte: targetDate,
          lt: nextDay
        }
      };
    case 'after':
      return { convertedAt: { gt: new Date(value) } };
    case 'before':
      return { convertedAt: { lt: new Date(value) } };
    case 'between':
      const [startDate, endDate] = value.split(',');
      return {
        convertedAt: {
          gte: new Date(startDate.trim()),
          lte: new Date(endDate.trim())
        }
      };
    case 'last7days':
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { convertedAt: { gte: sevenDaysAgo } };
    case 'last30days':
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { convertedAt: { gte: thirtyDaysAgo } };
    case 'thisMonth':
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return { convertedAt: { gte: thisMonthStart } };
    case 'lastMonth':
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      return {
        convertedAt: {
          gte: lastMonthStart,
          lte: lastMonthEnd
        }
      };
    default:
      return null;
  }
}

function buildTextFilter(field: string, operator: string, value: string) {
  switch (operator) {
    case 'contains':
      return { [field]: { contains: value, mode: 'insensitive' } };
    case 'equals':
      return { [field]: { equals: value, mode: 'insensitive' } };
    case 'startsWith':
      return { [field]: { startsWith: value, mode: 'insensitive' } };
    case 'endsWith':
      return { [field]: { endsWith: value, mode: 'insensitive' } };
    default:
      return { [field]: { contains: value, mode: 'insensitive' } };
  }
}

function getStatusBreakdown(results: any[]) {
  const breakdown = results.reduce((acc, result) => {
    acc[result.status] = (acc[result.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(breakdown).map(([status, count]) => ({
    status,
    count: count as number,
    percentage: (((count as number) / results.length) * 100).toFixed(1)
  }));
}

function getCampaignBreakdown(results: any[]) {
  const breakdown = results.reduce((acc, result) => {
    const key = result.campaignName;
    if (!acc[key]) {
      acc[key] = {
        name: result.campaignName,
        count: 0,
        totalAmount: 0,
        totalCommission: 0
      };
    }
    acc[key].count += 1;
    acc[key].totalAmount += result.amount;
    acc[key].totalCommission += result.commission;
    return acc;
  }, {} as Record<string, any>);

  return Object.values(breakdown)
    .sort((a: any, b: any) => b.totalAmount - a.totalAmount)
    .slice(0, 10); // Top 10 campaigns
}

function convertToCSV(conversions: any[]): string {
  const headers = [
    'ID',
    'Campaign',
    'Category',
    'Amount',
    'Commission',
    'Currency',
    'Status',
    'Date',
    'Approved Date',
    'IP',
    'User Agent'
  ];

  const rows = conversions.map(conversion => [
    conversion.id,
    conversion.campaign.name,
    conversion.campaign.category,
    conversion.amount,
    conversion.commission,
    conversion.currency,
    conversion.status,
    conversion.convertedAt.toISOString(),
    conversion.approvedAt?.toISOString() || '',
    conversion.ip,
    conversion.userAgent || ''
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  return csvContent;
}
