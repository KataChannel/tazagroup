// src/components/audit-trail.tsx
"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
  User, 
  Shield, 
  CreditCard, 
  Key, 
  Calendar,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

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

interface AuditFilters {
  category: string
  riskLevel: string
  outcome: string
  dateRange: string
  userId: string
  search: string
}

export function AuditTrail() {
  const t = useTranslations()
  const [events, setEvents] = useState<AuditEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<AuditEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null)
  const [filters, setFilters] = useState<AuditFilters>({
    category: 'all',
    riskLevel: 'all',
    outcome: 'all',
    dateRange: 'today',
    userId: '',
    search: ''
  })

  useEffect(() => {
    fetchAuditEvents()
  }, [filters])

  useEffect(() => {
    applyFilters()
  }, [events, filters])

  const fetchAuditEvents = async () => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams({
        category: filters.category,
        riskLevel: filters.riskLevel,
        outcome: filters.outcome,
        dateRange: filters.dateRange,
        userId: filters.userId,
        search: filters.search
      })

      const response = await fetch(`/api/security/audit?${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Failed to fetch audit events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...events]

    if (filters.category !== 'all') {
      filtered = filtered.filter(event => event.category === filters.category)
    }

    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter(event => event.riskLevel === filters.riskLevel)
    }

    if (filters.outcome !== 'all') {
      filtered = filtered.filter(event => event.outcome === filters.outcome)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(event => 
        event.action.toLowerCase().includes(searchLower) ||
        event.userName.toLowerCase().includes(searchLower) ||
        event.userEmail.toLowerCase().includes(searchLower) ||
        event.resourceType.toLowerCase().includes(searchLower)
      )
    }

    setFilteredEvents(filtered)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <Key className="h-4 w-4" />
      case 'payments': return <CreditCard className="h-4 w-4" />
      case 'profile': return <User className="h-4 w-4" />
      case 'security': return <Shield className="h-4 w-4" />
      case 'api': return <Activity className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-blue-100 text-blue-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failure': return <XCircle className="h-4 w-4 text-red-600" />
      case 'blocked': return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const exportAuditLog = async () => {
    try {
      const response = await fetch('/api/security/audit/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to export audit log:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('security.auditTrail')}</h2>
          <p className="text-muted-foreground">
            {t('security.auditTrailDesc')}
          </p>
        </div>
        <Button onClick={exportAuditLog}>
          <Download className="h-4 w-4 mr-2" />
          {t('security.exportLog')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t('security.filters')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('security.category')}
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('security.allCategories')}</option>
                <option value="authentication">{t('security.authentication')}</option>
                <option value="payments">{t('security.payments')}</option>
                <option value="profile">{t('security.profile')}</option>
                <option value="security">{t('security.security')}</option>
                <option value="api">{t('security.api')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('security.riskLevel')}
              </label>
              <select
                value={filters.riskLevel}
                onChange={(e) => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('security.allLevels')}</option>
                <option value="low">{t('security.low')}</option>
                <option value="medium">{t('security.medium')}</option>
                <option value="high">{t('security.high')}</option>
                <option value="critical">{t('security.critical')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('security.outcome')}
              </label>
              <select
                value={filters.outcome}
                onChange={(e) => setFilters(prev => ({ ...prev, outcome: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t('security.allOutcomes')}</option>
                <option value="success">{t('security.success')}</option>
                <option value="failure">{t('security.failure')}</option>
                <option value="blocked">{t('security.blocked')}</option>
                <option value="pending">{t('security.pending')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('common.search')}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('security.searchEvents')}
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{t('security.auditEvents')} ({filteredEvents.length})</span>
            <Badge variant="outline">
              {t('security.lastUpdated')}: {new Date().toLocaleString()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t('security.noEvents')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(event.category)}
                      {getOutcomeIcon(event.outcome)}
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{event.action}</span>
                        <Badge className={getRiskLevelColor(event.riskLevel)}>
                          {t(`security.${event.riskLevel}`)}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        {event.userName} ({event.userEmail}) • {event.ipAddress}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium capitalize">
                      {event.category}
                    </div>
                    <div className="text-xs text-gray-500">
                      {event.resourceType}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getCategoryIcon(selectedEvent.category)}
                  {t('security.eventDetails')}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('security.action')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEvent.action}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('security.category')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedEvent.category}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('security.user')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedEvent.userName} ({selectedEvent.userEmail})
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('security.timestamp')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedEvent.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('security.ipAddress')}
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{selectedEvent.ipAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('security.riskLevel')}
                    </label>
                    <Badge className={getRiskLevelColor(selectedEvent.riskLevel)}>
                      {t(`security.${selectedEvent.riskLevel}`)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('security.userAgent')}
                  </label>
                  <p className="mt-1 text-sm text-gray-900 break-all">
                    {selectedEvent.userAgent}
                  </p>
                </div>

                {selectedEvent.details && Object.keys(selectedEvent.details).length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {t('security.details')}
                    </label>
                    <pre className="mt-1 text-xs text-gray-900 bg-gray-100 p-3 rounded-md overflow-auto">
                      {JSON.stringify(selectedEvent.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
