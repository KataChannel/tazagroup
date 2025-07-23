import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Mock security alerts storage (in production, this would be a database)
// This should be shared with the main alerts route, but for demo purposes we'll import it
let securityAlerts: any[] = []

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { action } = await request.json()
    const alertId = params.id

    // Find the alert
    const alertIndex = securityAlerts.findIndex(alert => alert.id === alertId)
    
    if (alertIndex === -1) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
    }

    // Update alert status based on action
    switch (action) {
      case 'investigate':
        securityAlerts[alertIndex].status = 'investigating'
        break
      case 'resolve':
        securityAlerts[alertIndex].status = 'resolved'
        securityAlerts[alertIndex].resolvedAt = new Date().toISOString()
        break
      case 'false_positive':
        securityAlerts[alertIndex].status = 'false_positive'
        securityAlerts[alertIndex].resolvedAt = new Date().toISOString()
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Add action history
    if (!securityAlerts[alertIndex].history) {
      securityAlerts[alertIndex].history = []
    }
    
    securityAlerts[alertIndex].history.push({
      action,
      timestamp: new Date().toISOString(),
      userId: decoded.userId
    })

    return NextResponse.json({
      success: true,
      alert: securityAlerts[alertIndex]
    })

  } catch (error) {
    console.error('Update alert error:', error)
    return NextResponse.json(
      { error: 'Failed to update security alert' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = await verifyToken(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const alertId = params.id
    const alert = securityAlerts.find(alert => alert.id === alertId)
    
    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      alert
    })

  } catch (error) {
    console.error('Get alert error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch security alert' },
      { status: 500 }
    )
  }
}
