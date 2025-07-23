import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { 
      type, 
      dateRange, 
      format = 'csv',
      campaignIds = [] 
    } = await request.json()

    const userId = decoded.userId

    if (!type || !['clicks', 'conversions', 'payments', 'campaigns', 'activities'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid export type' },
        { status: 400 }
      )
    }

    // Parse date range
    let startDate: Date | undefined
    let endDate: Date | undefined
    
    if (dateRange) {
      startDate = new Date(dateRange.from)
      endDate = new Date(dateRange.to)
      endDate.setHours(23, 59, 59, 999) // End of day
    }

    let data: any[] = []
    let filename = ''
    let headers: string[] = []

    switch (type) {
      case 'clicks':
        const clicksQuery: any = {
          where: { userId }
        }
        
        if (startDate && endDate) {
          clicksQuery.where.clickedAt = {
            gte: startDate,
            lte: endDate
          }
        }
        
        if (campaignIds.length > 0) {
          clicksQuery.where.campaignId = { in: campaignIds }
        }

        clicksQuery.include = {
          campaign: { select: { name: true, category: true } }
        }
        clicksQuery.orderBy = { clickedAt: 'desc' }

        const clicks = await prisma.click.findMany(clicksQuery)
        
        data = clicks.map(click => ({
          'Click ID': click.id,
          'Campaign': click.campaign.name,
          'Category': click.campaign.category,
          'IP Address': click.ip,
          'User Agent': click.userAgent || 'N/A',
          'Referer': click.referer || 'N/A',
          'Country': click.country || 'N/A',
          'Device': click.device || 'N/A',
          'Browser': click.browser || 'N/A',
          'OS': click.os || 'N/A',
          'Clicked At': click.clickedAt.toISOString()
        }))
        
        filename = `clicks_export_${Date.now()}.${format}`
        headers = ['Click ID', 'Campaign', 'Category', 'IP Address', 'User Agent', 'Referer', 'Country', 'Device', 'Browser', 'OS', 'Clicked At']
        break

      case 'conversions':
        const conversionsQuery: any = {
          where: { userId }
        }
        
        if (startDate && endDate) {
          conversionsQuery.where.convertedAt = {
            gte: startDate,
            lte: endDate
          }
        }
        
        if (campaignIds.length > 0) {
          conversionsQuery.where.campaignId = { in: campaignIds }
        }

        conversionsQuery.include = {
          campaign: { select: { name: true, category: true } }
        }
        conversionsQuery.orderBy = { convertedAt: 'desc' }

        const conversions = await prisma.conversion.findMany(conversionsQuery)
        
        data = conversions.map(conversion => ({
          'Conversion ID': conversion.id,
          'Campaign': conversion.campaign.name,
          'Category': conversion.campaign.category,
          'Order ID': conversion.orderId || 'N/A',
          'Amount': conversion.amount,
          'Commission': conversion.commission,
          'Currency': conversion.currency,
          'Status': conversion.status,
          'Converted At': conversion.convertedAt.toISOString(),
          'Approved At': conversion.approvedAt?.toISOString() || 'N/A'
        }))
        
        filename = `conversions_export_${Date.now()}.${format}`
        headers = ['Conversion ID', 'Campaign', 'Category', 'Order ID', 'Amount', 'Commission', 'Currency', 'Status', 'Converted At', 'Approved At']
        break

      case 'payments':
        const paymentsQuery: any = {
          where: { userId }
        }
        
        if (startDate && endDate) {
          paymentsQuery.where.createdAt = {
            gte: startDate,
            lte: endDate
          }
        }

        paymentsQuery.orderBy = { createdAt: 'desc' }

        const payments = await prisma.payment.findMany(paymentsQuery)
        
        data = payments.map(payment => ({
          'Payment ID': payment.id,
          'Amount': payment.amount,
          'Currency': payment.currency,
          'Method': payment.method,
          'Status': payment.status,
          'Reference': payment.reference || 'N/A',
          'Description': payment.description || 'N/A',
          'Paid At': payment.paidAt?.toISOString() || 'N/A',
          'Created At': payment.createdAt.toISOString()
        }))
        
        filename = `payments_export_${Date.now()}.${format}`
        headers = ['Payment ID', 'Amount', 'Currency', 'Method', 'Status', 'Reference', 'Description', 'Paid At', 'Created At']
        break

      case 'campaigns':
        const campaignsQuery: any = {
          where: {
            users: {
              some: { userId }
            }
          }
        }

        campaignsQuery.include = {
          users: {
            where: { userId },
            select: { status: true, appliedAt: true, approvedAt: true }
          },
          _count: {
            select: {
              clicks: { where: { userId } },
              conversions: { where: { userId } }
            }
          }
        }

        const campaigns = await prisma.campaign.findMany(campaignsQuery)
        
        data = campaigns.map(campaign => ({
          'Campaign ID': campaign.id,
          'Name': campaign.name,
          'Category': campaign.category,
          'Commission': campaign.commission,
          'Currency': campaign.currency,
          'Status': campaign.status,
          'User Status': campaign.users[0]?.status || 'N/A',
          'Applied At': campaign.users[0]?.appliedAt?.toISOString() || 'N/A',
          'Approved At': campaign.users[0]?.approvedAt?.toISOString() || 'N/A',
          'Total Clicks': campaign._count.clicks,
          'Total Conversions': campaign._count.conversions,
          'Start Date': campaign.startDate.toISOString(),
          'End Date': campaign.endDate?.toISOString() || 'N/A',
          'Created At': campaign.createdAt.toISOString()
        }))
        
        filename = `campaigns_export_${Date.now()}.${format}`
        headers = ['Campaign ID', 'Name', 'Category', 'Commission', 'Currency', 'Status', 'User Status', 'Applied At', 'Approved At', 'Total Clicks', 'Total Conversions', 'Start Date', 'End Date', 'Created At']
        break

      case 'activities':
        const activitiesQuery: any = {
          where: { userId }
        }
        
        if (startDate && endDate) {
          activitiesQuery.where.createdAt = {
            gte: startDate,
            lte: endDate
          }
        }

        activitiesQuery.orderBy = { createdAt: 'desc' }
        activitiesQuery.take = 1000 // Limit to prevent too large exports

        const activities = await prisma.activity.findMany(activitiesQuery)
        
        data = activities.map(activity => ({
          'Activity ID': activity.id,
          'Type': activity.type,
          'Title': activity.title,
          'Description': activity.description,
          'Metadata': activity.metadata || 'N/A',
          'Created At': activity.createdAt.toISOString()
        }))
        
        filename = `activities_export_${Date.now()}.${format}`
        headers = ['Activity ID', 'Type', 'Title', 'Description', 'Metadata', 'Created At']
        break
    }

    if (format === 'csv') {
      // Generate CSV content
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header] || ''
            // Escape quotes and wrap in quotes if contains comma or quotes
            return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
              ? `"${value.replace(/"/g, '""')}"` 
              : value
          }).join(',')
        )
      ].join('\n')

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      })
    } else if (format === 'json') {
      return NextResponse.json({
        data,
        metadata: {
          type,
          totalRecords: data.length,
          dateRange: dateRange ? { from: startDate, to: endDate } : null,
          exportedAt: new Date().toISOString(),
          filename: filename.replace('.csv', '.json')
        }
      })
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 })

  } catch (error) {
    console.error('Data export error:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}
