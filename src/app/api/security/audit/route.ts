// src/app/api/security/audit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

interface AuditEvent {
  id: string
  userId: string
  userName: string
  userEmail: string
  action: string
  category: 'authentication' | 'payments' | 'profile' | 'security' | 'api' | 'admin'
  resourceType: string
  resourceId?: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  location?: string
  timestamp: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  outcome: 'success' | 'failure' | 'blocked' | 'pending'
}

// Mock audit events data (in production, this would come from a database)
const generateMockAuditEvents = (): AuditEvent[] => {
  const events: AuditEvent[] = []
  const now = new Date()
  
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com' }
  ]

  const actions = [
    { action: 'User Login', category: 'authentication', resource: 'session', risk: 'low' },
    { action: 'Password Change', category: 'authentication', resource: 'password', risk: 'medium' },
    { action: 'Profile Update', category: 'profile', resource: 'user_profile', risk: 'low' },
    { action: 'Payment Request', category: 'payments', resource: 'withdrawal', risk: 'medium' },
    { action: 'API Key Access', category: 'api', resource: 'api_key', risk: 'medium' },
    { action: 'Suspicious Login Attempt', category: 'security', resource: 'login', risk: 'high' },
    { action: 'Multiple Failed Logins', category: 'security', resource: 'login', risk: 'critical' },
    { action: 'Large Withdrawal Request', category: 'payments', resource: 'withdrawal', risk: 'high' }
  ]

  const outcomes = ['success', 'failure', 'blocked', 'pending']
  const ips = ['192.168.1.1', '10.0.0.1', '203.113.78.123', '115.78.22.45', '118.69.83.102']
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
  ]

  // Generate events for the last 7 days
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const actionData = actions[Math.floor(Math.random() * actions.length)]
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)] as AuditEvent['outcome']
    const timestamp = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)

    // Adjust risk level based on outcome
    let riskLevel = actionData.risk as AuditEvent['riskLevel']
    if (outcome === 'failure' || outcome === 'blocked') {
      riskLevel = riskLevel === 'low' ? 'medium' : riskLevel === 'medium' ? 'high' : 'critical'
    }

    events.push({
      id: `audit_${i + 1}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: actionData.action,
      category: actionData.category as AuditEvent['category'],
      resourceType: actionData.resource,
      resourceId: Math.random() > 0.5 ? `res_${Math.floor(Math.random() * 1000)}` : undefined,
      details: {
        browser: userAgents[Math.floor(Math.random() * userAgents.length)].split(' ')[0],
        platform: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'][Math.floor(Math.random() * 5)],
        sessionId: `sess_${Math.random().toString(36).substr(2, 9)}`,
        ...(actionData.category === 'payments' && { amount: Math.floor(Math.random() * 10000000) }),
        ...(actionData.category === 'authentication' && { loginMethod: ['password', '2fa', 'social'][Math.floor(Math.random() * 3)] })
      },
      ipAddress: ips[Math.floor(Math.random() * ips.length)],
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      location: ['Ho Chi Minh City, VN', 'Hanoi, VN', 'Da Nang, VN', 'Singapore, SG'][Math.floor(Math.random() * 4)],
      timestamp: timestamp.toISOString(),
      riskLevel,
      outcome
    })
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export async function GET(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Verify JWT token
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const riskLevel = searchParams.get('riskLevel') || 'all'
    const outcome = searchParams.get('outcome') || 'all'
    const dateRange = searchParams.get('dateRange') || 'all'
    const userId = searchParams.get('userId') || ''
    const search = searchParams.get('search') || ''

    let events = generateMockAuditEvents()

    // Apply filters
    if (category !== 'all') {
      events = events.filter(event => event.category === category)
    }

    if (riskLevel !== 'all') {
      events = events.filter(event => event.riskLevel === riskLevel)
    }

    if (outcome !== 'all') {
      events = events.filter(event => event.outcome === outcome)
    }

    if (userId) {
      events = events.filter(event => event.userId === userId)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      events = events.filter(event =>
        event.action.toLowerCase().includes(searchLower) ||
        event.userName.toLowerCase().includes(searchLower) ||
        event.userEmail.toLowerCase().includes(searchLower) ||
        event.resourceType.toLowerCase().includes(searchLower)
      )
    }

    // Apply date range filter
    if (dateRange !== 'all') {
      const now = new Date()
      let startDate: Date

      switch (dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        default:
          startDate = new Date(0)
      }

      events = events.filter(event => new Date(event.timestamp) >= startDate)
    }

    // Limit results for performance
    const limit = parseInt(searchParams.get('limit') || '100')
    events = events.slice(0, limit)

    return NextResponse.json({
      events,
      total: events.length,
      filters: {
        category,
        riskLevel,
        outcome,
        dateRange,
        userId,
        search
      }
    })

  } catch (error) {
    console.error('Audit trail API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
