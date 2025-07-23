"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Eye,
  Clock,
  Globe,
  Zap,
  Ban,
  CheckCircle,
  XCircle,
  Bot,
  MousePointer,
  BarChart3,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'

interface FraudAlert {
  id: string
  type: 'click_fraud' | 'bot_traffic' | 'suspicious_pattern' | 'vpn_detected' | 'duplicate_clicks'
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: string
  description: string
  ipAddress: string
  userAgent: string
  campaignId?: string
  status: 'active' | 'resolved' | 'investigating'
  confidence: number
}

interface FraudRule {
  id: string
  name: string
  type: 'click_rate' | 'ip_frequency' | 'conversion_rate' | 'geographic' | 'user_agent'
  enabled: boolean
  threshold: number
  action: 'flag' | 'block' | 'investigate'
  description: string
}

export default function FraudDetection() {
  const [alerts, setAlerts] = useState<FraudAlert[]>([
    {
      id: '1',
      type: 'click_fraud',
      severity: 'high',
      timestamp: '2025-01-23T10:30:00Z',
      description: 'Unusual click pattern detected from IP range',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      campaignId: 'camp_123',
      status: 'active',
      confidence: 0.85
    },
    {
      id: '2',
      type: 'bot_traffic',
      severity: 'medium',
      timestamp: '2025-01-23T09:15:00Z',
      description: 'Bot-like behavior detected',
      ipAddress: '10.0.0.50',
      userAgent: 'Bot/1.0',
      status: 'investigating',
      confidence: 0.92
    }
  ])

  const [fraudRules, setFraudRules] = useState<FraudRule[]>([
    {
      id: '1',
      name: 'High Click Rate Detection',
      type: 'click_rate',
      enabled: true,
      threshold: 100,
      action: 'flag',
      description: 'Flag IPs with more than 100 clicks per hour'
    },
    {
      id: '2',
      name: 'Bot User Agent Detection',
      type: 'user_agent',
      enabled: true,
      threshold: 1,
      action: 'block',
      description: 'Block known bot user agents'
    },
    {
      id: '3',
      name: 'Geographic Anomaly Detection',
      type: 'geographic',
      enabled: true,
      threshold: 50,
      action: 'investigate',
      description: 'Investigate traffic from unusual geographic locations'
    }
  ])

  const [stats, setStats] = useState({
    totalAlerts: 15,
    activeAlerts: 8,
    blockedAttempts: 247,
    falsePositives: 3,
    fraudPrevented: 12.5, // in percentage
    riskScore: 'medium'
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800'
      case 'investigating': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'click_fraud': return <MousePointer className="w-4 h-4" />
      case 'bot_traffic': return <Bot className="w-4 h-4" />
      case 'suspicious_pattern': return <Activity className="w-4 h-4" />
      case 'vpn_detected': return <Globe className="w-4 h-4" />
      case 'duplicate_clicks': return <Eye className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const updateAlertStatus = (alertId: string, status: 'active' | 'resolved' | 'investigating') => {
    setAlerts(alerts => 
      alerts.map(alert => 
        alert.id === alertId ? { ...alert, status } : alert
      )
    )
    toast.success(`Alert status updated to ${status}`)
  }

  const toggleRule = (ruleId: string) => {
    setFraudRules(rules => 
      rules.map(rule => 
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    )
  }

  const updateRuleThreshold = (ruleId: string, threshold: number) => {
    setFraudRules(rules => 
      rules.map(rule => 
        rule.id === ruleId ? { ...rule, threshold } : rule
      )
    )
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('vi-VN')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
          <Shield className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fraud Detection</h1>
          <p className="text-gray-600">Monitor and prevent fraudulent activities</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Alerts</p>
                <p className="text-2xl font-bold">{stats.totalAlerts}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-red-600">{stats.activeAlerts}</p>
              </div>
              <Activity className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blocked Attempts</p>
                <p className="text-2xl font-bold text-green-600">{stats.blockedAttempts}</p>
              </div>
              <Ban className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fraud Prevented</p>
                <p className="text-2xl font-bold text-blue-600">{stats.fraudPrevented}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="rules">Detection Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Alerts</CardTitle>
              <CardDescription>
                Monitor and manage fraud detection alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div>
                          <h3 className="font-medium">{alert.description}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimestamp(alert.timestamp)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {alert.ipAddress}
                            </span>
                            <span>Confidence: {(alert.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                        <Badge variant={alert.severity === 'critical' || alert.severity === 'high' ? 'destructive' : 'secondary'}>
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm text-gray-600">
                        <p className="truncate max-w-md">User Agent: {alert.userAgent}</p>
                        {alert.campaignId && <p>Campaign: {alert.campaignId}</p>}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {alert.status === 'active' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateAlertStatus(alert.id, 'investigating')}
                            >
                              Investigate
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => updateAlertStatus(alert.id, 'resolved')}
                            >
                              Block IP
                            </Button>
                          </>
                        )}
                        {alert.status === 'investigating' && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => updateAlertStatus(alert.id, 'resolved')}
                          >
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {alerts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No active alerts</h3>
                    <p>Your system is secure - no fraud detected</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <CardTitle>Detection Rules</CardTitle>
              <CardDescription>
                Configure automated fraud detection rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fraudRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                        <div>
                          <h3 className="font-medium">{rule.name}</h3>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                        </div>
                      </div>
                      
                      <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                        {rule.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    {rule.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t">
                        <div>
                          <Label>Threshold</Label>
                          <Input
                            type="number"
                            value={rule.threshold}
                            onChange={(e) => updateRuleThreshold(rule.id, parseInt(e.target.value) || 0)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label>Action</Label>
                          <Select value={rule.action}>
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="flag">Flag for Review</SelectItem>
                              <SelectItem value="block">Block Immediately</SelectItem>
                              <SelectItem value="investigate">Auto-Investigate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label>Type</Label>
                          <Input
                            value={rule.type.replace('_', ' ').toUpperCase()}
                            disabled
                            className="mt-1 bg-gray-50"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Trends</CardTitle>
                <CardDescription>
                  Weekly fraud detection patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Fraud analytics chart</p>
                      <p className="text-sm">Coming soon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>
                  Current security risk level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
                      <Shield className="w-10 h-10 text-yellow-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Medium Risk</h3>
                    <p className="text-gray-600">Your account has moderate risk exposure</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Click Fraud Risk</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/2 h-2 bg-yellow-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">50%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Bot Traffic Risk</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/3 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">30%</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Geographic Risk</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-1/4 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection Settings</CardTitle>
              <CardDescription>
                Configure global fraud detection preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Real-time Monitoring</Label>
                  <p className="text-sm text-gray-600">
                    Enable continuous fraud monitoring
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Auto-block Suspicious IPs</Label>
                  <p className="text-sm text-gray-600">
                    Automatically block high-risk IP addresses
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Email Alerts</Label>
                  <p className="text-sm text-gray-600">
                    Receive email notifications for critical alerts
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Alert Sensitivity</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Fewer false positives</SelectItem>
                    <SelectItem value="medium">Medium - Balanced detection</SelectItem>
                    <SelectItem value="high">High - Maximum protection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data Retention Period</Label>
                <Select defaultValue="90">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
