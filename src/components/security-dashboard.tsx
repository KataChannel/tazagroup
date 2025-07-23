"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertTriangle, Shield, Eye, Users, TrendingUp, Activity } from 'lucide-react'

interface SecurityAlert {
  id: string
  type: 'fraud' | 'suspicious' | 'anomaly' | 'violation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  userId: string
  userName: string
  timestamp: string
  status: 'active' | 'investigating' | 'resolved' | 'false_positive'
  data: any
}

interface SecurityMetrics {
  totalAlerts: number
  activeThreats: number
  resolvedToday: number
  fraudPrevented: number
  riskScore: number
  fraudDetectedValue: number
}

export function SecurityDashboard() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null)

  useEffect(() => {
    fetchSecurityData()
    const interval = setInterval(fetchSecurityData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchSecurityData = async () => {
    try {
      const [alertsResponse, metricsResponse] = await Promise.all([
        fetch('/api/security/alerts'),
        fetch('/api/security/metrics')
      ])

      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json()
        setAlerts(alertsData.alerts || [])
      }

      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json()
        setMetrics(metricsData)
      }
    } catch (error) {
      console.error('Failed to fetch security data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAlertAction = async (alertId: string, action: string) => {
    try {
      const response = await fetch(`/api/security/alerts/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        fetchSecurityData() // Refresh data
      }
    } catch (error) {
      console.error('Failed to update alert:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'fraud': return <AlertTriangle className="h-4 w-4" />
      case 'suspicious': return <Eye className="h-4 w-4" />
      case 'anomaly': return <TrendingUp className="h-4 w-4" />
      case 'violation': return <Shield className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            Security Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time threat monitoring and fraud detection
          </p>
        </div>
        <Button onClick={fetchSecurityData}>
          <Activity className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Security Metrics */}
      {metrics && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Threats</p>
                <p className="text-2xl font-bold text-red-600">{metrics.activeThreats}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fraud Prevented</p>
                <p className="text-2xl font-bold text-green-600">${metrics.fraudPrevented.toLocaleString()}</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Score</p>
                <p className="text-2xl font-bold text-orange-600">{metrics.riskScore}/100</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-blue-600">{metrics.resolvedToday}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
        </div>
      )}

      {/* Security Tabs */}
      <Tabs defaultValue="alerts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="analytics">Threat Analytics</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Security Alerts</h3>
            
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No active security alerts</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-gray-100">
                          {getTypeIcon(alert.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{alert.title}</h4>
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>User: {alert.userName}</span>
                            <span>Time: {new Date(alert.timestamp).toLocaleString()}</span>
                            <span>Status: {alert.status.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedAlert(alert)}
                        >
                          View Details
                        </Button>
                        
                        {alert.status === 'active' && (
                          <Button
                            size="sm"
                            onClick={() => handleAlertAction(alert.id, 'investigate')}
                          >
                            Investigate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Live Threat Monitoring</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Click Fraud Detection</h4>
                <p className="text-sm text-gray-600 mb-3">
                  AI-powered detection of fraudulent clicks and conversions
                </p>
                <div className="text-2xl font-bold text-green-600">Active</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Bot Detection</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Automated detection of bot traffic and suspicious patterns
                </p>
                <div className="text-2xl font-bold text-green-600">Active</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Velocity Monitoring</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Detection of unusual activity patterns and velocity spikes
                </p>
                <div className="text-2xl font-bold text-green-600">Active</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">IP Analysis</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Real-time IP reputation and geolocation analysis
                </p>
                <div className="text-2xl font-bold text-green-600">Active</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Threat Analytics</h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Top Threat Types (Last 30 Days)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Click Fraud</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded">
                        <div className="w-3/4 h-2 bg-red-500 rounded"></div>
                      </div>
                      <span className="text-sm">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Bot Traffic</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded">
                        <div className="w-1/2 h-2 bg-orange-500 rounded"></div>
                      </div>
                      <span className="text-sm">50%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Suspicious Activity</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded">
                        <div className="w-1/4 h-2 bg-yellow-500 rounded"></div>
                      </div>
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Geographic Risk Analysis</h4>
                <p className="text-sm text-gray-600">
                  High-risk regions identified based on fraud patterns
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Security Configuration</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Real-time Monitoring</h4>
                  <p className="text-sm text-gray-600">Enable continuous threat monitoring</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Alert Thresholds</h4>
                  <p className="text-sm text-gray-600">Set custom alert sensitivity levels</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Auto-block Rules</h4>
                  <p className="text-sm text-gray-600">Automatic blocking of high-risk activities</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold">Alert Details</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedAlert(null)}
                >
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(selectedAlert.type)}
                  <span className="font-medium">{selectedAlert.title}</span>
                  <Badge className={getSeverityColor(selectedAlert.severity)}>
                    {selectedAlert.severity.toUpperCase()}
                  </Badge>
                </div>
                
                <p>{selectedAlert.description}</p>
                
                <div className="grid gap-2 text-sm">
                  <div><strong>User:</strong> {selectedAlert.userName} ({selectedAlert.userId})</div>
                  <div><strong>Time:</strong> {new Date(selectedAlert.timestamp).toLocaleString()}</div>
                  <div><strong>Status:</strong> {selectedAlert.status.replace('_', ' ')}</div>
                </div>
                
                {selectedAlert.data && (
                  <div>
                    <h4 className="font-medium mb-2">Additional Data</h4>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                      {JSON.stringify(selectedAlert.data, null, 2)}
                    </pre>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => handleAlertAction(selectedAlert.id, 'resolve')}
                    disabled={selectedAlert.status === 'resolved'}
                  >
                    Mark Resolved
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => handleAlertAction(selectedAlert.id, 'false_positive')}
                  >
                    False Positive
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
