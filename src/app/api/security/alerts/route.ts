import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Mock security alerts storage (in production, this would be a database)
let securityAlerts: any[] = []

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

    // For demo purposes, generate some sample alerts if none exist
    if (securityAlerts.length === 0) {
      securityAlerts = [
        {
          id: 'alert_001',
          type: 'fraud',
          severity: 'high',
          title: 'Suspected Click Fraud',
          description: 'Multiple rapid clicks detected from same IP address within 30 seconds',
          userId: 'user_123',
          userName: 'John Doe',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          data: {
            ip: '192.168.1.100',
            clickCount: 15,
            timeWindow: '30 seconds',
            riskScore: 85
          }
        },
        {
          id: 'alert_002',
          type: 'suspicious',
          severity: 'medium',
          title: 'Unusual Geographic Activity',
          description: 'User activity detected from multiple countries within short timeframe',
          userId: 'user_456',
          userName: 'Jane Smith',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'investigating',
          data: {
            countries: ['US', 'VN', 'CN'],
            timeWindow: '2 hours',
            riskScore: 45
          }
        },
        {
          id: 'alert_003',
          type: 'anomaly',
          severity: 'low',
          title: 'Unusual Conversion Pattern',
          description: 'Higher than normal conversion rate detected for new campaign',
          userId: 'user_789',
          userName: 'Bob Johnson',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          data: {
            conversionRate: '25%',
            normalRange: '2-5%',
            campaignId: 'camp_001',
            riskScore: 30
          }
        }
      ]
    }

    return NextResponse.json({
      success: true,
      alerts: securityAlerts.filter(alert => alert.status === 'active' || alert.status === 'investigating')
    })

  } catch (error) {
    console.error('Security alerts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch security alerts' },
      { status: 500 }
    )
  }
}

// Create new security alert
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const alertData = await request.json()
    
    const newAlert = {
      id: `alert_${Date.now()}`,
      type: alertData.type || 'suspicious',
      severity: alertData.severity || 'medium',
      title: alertData.title,
      description: alertData.description,
      userId: alertData.userId,
      userName: alertData.userName || 'Unknown User',
      timestamp: new Date().toISOString(),
      status: 'active',
      data: alertData.data || {}
    }

    securityAlerts.unshift(newAlert)

    return NextResponse.json({
      success: true,
      alert: newAlert
    })

  } catch (error) {
    console.error('Create alert error:', error)
    return NextResponse.json(
      { error: 'Failed to create security alert' },
      { status: 500 }
    )
  }
}
