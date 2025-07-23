// src/app/api/security/audit/export/route.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

interface AuditEvent {
  id: string
  userId: string
  userName: string
  userEmail: string
  action: string
  category: string
  resourceType: string
  resourceId?: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  location?: string
  timestamp: string
  riskLevel: string
  outcome: string
}

// This would normally fetch from the same source as the GET route
// For now, we'll use the same mock data generation logic
const generateMockAuditEvents = (): AuditEvent[] => {
  // Same logic as in the main audit route
  // In production, this would use the same database query
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

  for (let i = 0; i < 100; i++) {
    const user = users[Math.floor(Math.random() * users.length)]
    const actionData = actions[Math.floor(Math.random() * actions.length)]
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)]
    const timestamp = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000)

    let riskLevel = actionData.risk
    if (outcome === 'failure' || outcome === 'blocked') {
      riskLevel = riskLevel === 'low' ? 'medium' : riskLevel === 'medium' ? 'high' : 'critical'
    }

    events.push({
      id: `audit_${i + 1}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      action: actionData.action,
      category: actionData.category,
      resourceType: actionData.resource,
      resourceId: Math.random() > 0.5 ? `res_${Math.floor(Math.random() * 1000)}` : undefined,
      details: {
        browser: userAgents[Math.floor(Math.random() * userAgents.length)].split(' ')[0],
        platform: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'][Math.floor(Math.random() * 5)],
        sessionId: `sess_${Math.random().toString(36).substr(2, 9)}`
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

const convertToCSV = (events: AuditEvent[]): string => {
  const headers = [
    'ID',
    'Timestamp',
    'User Name',
    'User Email',
    'Action',
    'Category',
    'Resource Type',
    'Resource ID',
    'IP Address',
    'Location',
    'Risk Level',
    'Outcome',
    'User Agent'
  ]

  const csvRows = [
    headers.join(','),
    ...events.map(event => [
      event.id,
      event.timestamp,
      `"${event.userName}"`,
      event.userEmail,
      `"${event.action}"`,
      event.category,
      event.resourceType,
      event.resourceId || '',
      event.ipAddress,
      `"${event.location || ''}"`,
      event.riskLevel,
      event.outcome,
      `"${event.userAgent}"`
    ].join(','))
  ]

  return csvRows.join('\n')
}

export async function POST(request: NextRequest) {
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

    const filters = await request.json()

    let events = generateMockAuditEvents()

    // Apply the same filters as in the main audit route
    if (filters.category && filters.category !== 'all') {
      events = events.filter((event: AuditEvent) => event.category === filters.category)
    }

    if (filters.riskLevel && filters.riskLevel !== 'all') {
      events = events.filter((event: AuditEvent) => event.riskLevel === filters.riskLevel)
    }

    if (filters.outcome && filters.outcome !== 'all') {
      events = events.filter((event: AuditEvent) => event.outcome === filters.outcome)
    }

    if (filters.userId) {
      events = events.filter((event: AuditEvent) => event.userId === filters.userId)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      events = events.filter((event: AuditEvent) =>
        event.action.toLowerCase().includes(searchLower) ||
        event.userName.toLowerCase().includes(searchLower) ||
        event.userEmail.toLowerCase().includes(searchLower) ||
        event.resourceType.toLowerCase().includes(searchLower)
      )
    }

    // Apply date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date()
      let startDate: Date

      switch (filters.dateRange) {
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

      events = events.filter((event: AuditEvent) => new Date(event.timestamp) >= startDate)
    }

    // Convert to CSV
    const csvContent = convertToCSV(events)

    // Return as downloadable file
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-log-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })

  } catch (error) {
    console.error('Audit export API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
