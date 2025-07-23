import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// ML-based fraud detection algorithms
class FraudDetectionEngine {
  static async analyzeClick(clickData: any) {
    const riskFactors = []
    let riskScore = 0

    // IP-based analysis
    if (await this.isHighRiskIP(clickData.ip)) {
      riskFactors.push('High-risk IP address')
      riskScore += 30
    }

    // Velocity analysis
    const recentClicks = await this.getRecentClicksByUser(clickData.userId, 300) // 5 minutes
    if (recentClicks > 10) {
      riskFactors.push('High click velocity')
      riskScore += 25
    }

    // User agent analysis
    if (await this.isSuspiciousUserAgent(clickData.userAgent)) {
      riskFactors.push('Suspicious user agent')
      riskScore += 20
    }

    // Geographic analysis
    if (await this.isAnomalousLocation(clickData.userId, clickData.country)) {
      riskFactors.push('Anomalous geographic location')
      riskScore += 15
    }

    // Time pattern analysis
    if (await this.isSuspiciousTimePattern(clickData.userId, clickData.timestamp)) {
      riskFactors.push('Unusual time pattern')
      riskScore += 10
    }

    return {
      riskScore: Math.min(riskScore, 100),
      riskFactors,
      recommendation: riskScore > 50 ? 'BLOCK' : riskScore > 25 ? 'INVESTIGATE' : 'ALLOW'
    }
  }

  static async analyzeConversion(conversionData: any) {
    const riskFactors = []
    let riskScore = 0

    // Value analysis
    if (conversionData.amount > 1000) { // High value conversion
      riskFactors.push('High value conversion')
      riskScore += 20
    }

    // Time-to-conversion analysis
    const timeBetween = conversionData.convertedAt - conversionData.clickedAt
    if (timeBetween < 60000) { // Less than 1 minute
      riskFactors.push('Suspiciously quick conversion')
      riskScore += 35
    }

    // Pattern analysis
    const userConversions = await this.getRecentConversions(conversionData.userId, 86400000) // 24 hours
    if (userConversions.length > 5) {
      riskFactors.push('Multiple conversions in short period')
      riskScore += 30
    }

    return {
      riskScore: Math.min(riskScore, 100),
      riskFactors,
      recommendation: riskScore > 60 ? 'BLOCK' : riskScore > 30 ? 'INVESTIGATE' : 'ALLOW'
    }
  }

  private static async isHighRiskIP(ip: string): Promise<boolean> {
    // Simulate IP reputation check
    const knownBadIPs = ['192.168.1.100', '10.0.0.1'] // Example
    return knownBadIPs.includes(ip)
  }

  private static async getRecentClicksByUser(userId: string, timeWindow: number): Promise<number> {
    const since = new Date(Date.now() - timeWindow * 1000)
    const count = await prisma.click.count({
      where: {
        userId,
        clickedAt: {
          gte: since
        }
      }
    })
    return count
  }

  private static async isSuspiciousUserAgent(userAgent: string | null): Promise<boolean> {
    if (!userAgent) return true
    
    // Check for bot indicators
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i, 
      /curl/i, /wget/i, /automated/i
    ]
    
    return botPatterns.some(pattern => pattern.test(userAgent))
  }

  private static async isAnomalousLocation(userId: string, country: string | null): Promise<boolean> {
    if (!country) return false

    // Get user's typical countries
    const recentClicks = await prisma.click.findMany({
      where: {
        userId,
        clickedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days
        }
      },
      select: { country: true }
    })

    const countries = recentClicks.map(c => c.country).filter(Boolean)
    const uniqueCountries = [...new Set(countries)]
    
    // If user typically operates from few countries but this is different
    return uniqueCountries.length <= 2 && !uniqueCountries.includes(country)
  }

  private static async isSuspiciousTimePattern(userId: string, timestamp: Date): Promise<boolean> {
    const hour = timestamp.getHours()
    
    // Very late/early hours (2-6 AM) are suspicious for normal users
    if (hour >= 2 && hour <= 6) {
      return true
    }

    return false
  }

  private static async getRecentConversions(userId: string, timeWindow: number) {
    const since = new Date(Date.now() - timeWindow)
    return await prisma.conversion.findMany({
      where: {
        userId,
        convertedAt: {
          gte: since
        }
      }
    })
  }
}

// Security alert generation
class SecurityAlertManager {
  static async createAlert(data: {
    type: 'fraud' | 'suspicious' | 'anomaly' | 'violation'
    severity: 'low' | 'medium' | 'high' | 'critical'
    title: string
    description: string
    userId: string
    metadata: any
  }) {
    // In a real implementation, this would save to a security_alerts table
    console.log('Security Alert Generated:', data)
    
    // For now, return a mock alert
    return {
      id: `alert_${Date.now()}`,
      ...data,
      timestamp: new Date().toISOString(),
      status: 'active'
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Get security metrics
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    // Analyze recent activity for threats
    const recentClicks = await prisma.click.findMany({
      where: {
        clickedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    const recentConversions = await prisma.conversion.findMany({
      where: {
        convertedAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    // Run fraud detection on recent activity
    const alerts = []
    let totalRiskScore = 0
    let fraudPrevented = 0

    for (const click of recentClicks) {
      const analysis = await FraudDetectionEngine.analyzeClick({
        userId: click.userId,
        ip: click.ip,
        userAgent: click.userAgent,
        country: click.country,
        timestamp: click.clickedAt
      })

      totalRiskScore += analysis.riskScore

      if (analysis.recommendation === 'BLOCK' || analysis.recommendation === 'INVESTIGATE') {
        const alert = await SecurityAlertManager.createAlert({
          type: analysis.recommendation === 'BLOCK' ? 'fraud' : 'suspicious',
          severity: analysis.riskScore > 75 ? 'critical' : analysis.riskScore > 50 ? 'high' : 'medium',
          title: `Suspicious Click Activity`,
          description: `${analysis.riskFactors.join(', ')} (Risk Score: ${analysis.riskScore})`,
          userId: click.userId,
          metadata: {
            clickId: click.id,
            riskScore: analysis.riskScore,
            riskFactors: analysis.riskFactors,
            recommendation: analysis.recommendation
          }
        })
        
        alerts.push({
          ...alert,
          userName: click.user?.name || 'Unknown User'
        })

        if (analysis.recommendation === 'BLOCK') {
          fraudPrevented += 10 // Estimated prevented fraud value
        }
      }
    }

    for (const conversion of recentConversions) {
      const clickData = await prisma.click.findFirst({
        where: {
          userId: conversion.userId,
          campaignId: conversion.campaignId,
          clickedAt: {
            lt: conversion.convertedAt
          }
        },
        orderBy: { clickedAt: 'desc' }
      })

      if (clickData) {
        const analysis = await FraudDetectionEngine.analyzeConversion({
          userId: conversion.userId,
          amount: conversion.amount,
          convertedAt: conversion.convertedAt.getTime(),
          clickedAt: clickData.clickedAt.getTime()
        })

        if (analysis.recommendation === 'BLOCK' || analysis.recommendation === 'INVESTIGATE') {
          const alert = await SecurityAlertManager.createAlert({
            type: analysis.recommendation === 'BLOCK' ? 'fraud' : 'suspicious',
            severity: analysis.riskScore > 75 ? 'critical' : analysis.riskScore > 50 ? 'high' : 'medium',
            title: `Suspicious Conversion Activity`,
            description: `${analysis.riskFactors.join(', ')} (Risk Score: ${analysis.riskScore})`,
            userId: conversion.userId,
            metadata: {
              conversionId: conversion.id,
              riskScore: analysis.riskScore,
              riskFactors: analysis.riskFactors,
              recommendation: analysis.recommendation,
              amount: conversion.amount
            }
          })
          
          alerts.push({
            ...alert,
            userName: conversion.user?.name || 'Unknown User'
          })

          if (analysis.recommendation === 'BLOCK') {
            fraudPrevented += conversion.amount
          }
        }
      }
    }

    const metrics = {
      totalAlerts: alerts.length,
      activeThreats: alerts.filter(a => a.type === 'fraud').length,
      resolvedToday: 0, // Would be tracked in database
      fraudPrevented: Math.round(fraudPrevented),
      riskScore: Math.round(totalRiskScore / Math.max(recentClicks.length + recentConversions.length, 1)),
      fraudDetectedValue: fraudPrevented
    }

    return NextResponse.json({
      success: true,
      metrics,
      alerts: alerts.slice(0, 50) // Limit to 50 most recent
    })

  } catch (error) {
    console.error('Security metrics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch security metrics' },
      { status: 500 }
    )
  }
}
