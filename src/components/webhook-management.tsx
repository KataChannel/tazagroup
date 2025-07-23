"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  Webhook, 
  Send, 
  Shield, 
  Key, 
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Copy,
  Edit,
  Trash2,
  MoreVertical,
  Zap,
  Activity,
  BarChart3,
  Settings,
  Eye,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

interface WebhookEndpoint {
  id: string
  name: string
  url: string
  events: string[]
  enabled: boolean
  secret: string
  headers: Record<string, string>
  timeout: number
  retryAttempts: number
  createdAt: string
  lastTriggered?: string
  status: 'active' | 'failed' | 'disabled'
  successRate: number
  totalDeliveries: number
}

interface WebhookDelivery {
  id: string
  webhookId: string
  event: string
  status: 'success' | 'failed' | 'pending' | 'retry'
  statusCode?: number
  responseTime: number
  timestamp: string
  payload: any
  response?: string
  error?: string
  attempts: number
}

export default function WebhookManagement() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([
    {
      id: '1',
      name: 'Campaign Events',
      url: 'https://api.example.com/webhooks/campaigns',
      events: ['campaign.created', 'campaign.updated', 'campaign.deleted'],
      enabled: true,
      secret: 'whsec_1234567890abcdef',
      headers: { 'X-Custom-Header': 'value' },
      timeout: 30,
      retryAttempts: 3,
      createdAt: '2025-01-20T10:00:00Z',
      lastTriggered: '2025-01-23T09:30:00Z',
      status: 'active',
      successRate: 98.5,
      totalDeliveries: 1247
    },
    {
      id: '2',
      name: 'Payment Notifications',
      url: 'https://payments.example.com/webhook',
      events: ['payment.completed', 'payment.failed', 'payout.processed'],
      enabled: true,
      secret: 'whsec_abcdef1234567890',
      headers: {},
      timeout: 15,
      retryAttempts: 5,
      createdAt: '2025-01-18T14:20:00Z',
      lastTriggered: '2025-01-23T10:15:00Z',
      status: 'active',
      successRate: 99.2,
      totalDeliveries: 892
    }
  ])

  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([
    {
      id: '1',
      webhookId: '1',
      event: 'campaign.created',
      status: 'success',
      statusCode: 200,
      responseTime: 245,
      timestamp: '2025-01-23T10:30:00Z',
      payload: { id: 'camp_123', name: 'New Campaign' },
      response: '{"status":"received"}',
      attempts: 1
    },
    {
      id: '2',
      webhookId: '2',
      event: 'payment.completed',
      status: 'failed',
      statusCode: 500,
      responseTime: 5000,
      timestamp: '2025-01-23T10:15:00Z',
      payload: { id: 'pay_456', amount: 100 },
      error: 'Connection timeout',
      attempts: 3
    }
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingWebhook, setEditingWebhook] = useState<WebhookEndpoint | null>(null)
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null)

  const availableEvents = [
    { id: 'campaign.created', name: 'Campaign Created', description: 'When a new campaign is created' },
    { id: 'campaign.updated', name: 'Campaign Updated', description: 'When a campaign is modified' },
    { id: 'campaign.deleted', name: 'Campaign Deleted', description: 'When a campaign is removed' },
    { id: 'payment.completed', name: 'Payment Completed', description: 'When a payment is successful' },
    { id: 'payment.failed', name: 'Payment Failed', description: 'When a payment fails' },
    { id: 'payout.processed', name: 'Payout Processed', description: 'When a payout is completed' },
    { id: 'user.registered', name: 'User Registered', description: 'When a new user signs up' },
    { id: 'click.recorded', name: 'Click Recorded', description: 'When an affiliate click is tracked' },
    { id: 'conversion.completed', name: 'Conversion Completed', description: 'When a conversion occurs' }
  ]

  const createWebhook = (webhookData: Partial<WebhookEndpoint>) => {
    const newWebhook: WebhookEndpoint = {
      id: `wh_${Date.now()}`,
      name: webhookData.name || '',
      url: webhookData.url || '',
      events: webhookData.events || [],
      enabled: true,
      secret: `whsec_${Math.random().toString(36).substring(2, 18)}`,
      headers: webhookData.headers || {},
      timeout: webhookData.timeout || 30,
      retryAttempts: webhookData.retryAttempts || 3,
      createdAt: new Date().toISOString(),
      status: 'active',
      successRate: 0,
      totalDeliveries: 0
    }
    
    setWebhooks([...webhooks, newWebhook])
    setShowCreateModal(false)
    toast.success('Webhook endpoint created successfully!')
  }

  const updateWebhook = (id: string, updates: Partial<WebhookEndpoint>) => {
    setWebhooks(webhooks.map(wh => 
      wh.id === id ? { ...wh, ...updates } : wh
    ))
    toast.success('Webhook updated successfully!')
  }

  const deleteWebhook = (id: string) => {
    if (!confirm('Are you sure you want to delete this webhook? This action cannot be undone.')) {
      return
    }
    
    setWebhooks(webhooks.filter(wh => wh.id !== id))
    toast.success('Webhook deleted successfully!')
  }

  const testWebhook = async (webhookId: string) => {
    const webhook = webhooks.find(wh => wh.id === webhookId)
    if (!webhook) return
    
    try {
      toast.info('Sending test webhook...')
      
      // Simulate webhook test
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const testDelivery: WebhookDelivery = {
        id: `test_${Date.now()}`,
        webhookId: webhook.id,
        event: 'test.webhook',
        status: 'success',
        statusCode: 200,
        responseTime: 234,
        timestamp: new Date().toISOString(),
        payload: { test: true, timestamp: new Date().toISOString() },
        response: '{"status":"test_received"}',
        attempts: 1
      }
      
      setDeliveries([testDelivery, ...deliveries])
      toast.success('Test webhook sent successfully!')
    } catch (error) {
      toast.error('Failed to send test webhook')
    }
  }

  const retryDelivery = (deliveryId: string) => {
    const delivery = deliveries.find(d => d.id === deliveryId)
    if (!delivery) return
    
    const updatedDelivery = {
      ...delivery,
      status: 'retry' as const,
      attempts: delivery.attempts + 1
    }
    
    setDeliveries(deliveries.map(d => 
      d.id === deliveryId ? updatedDelivery : d
    ))
    
    toast.info('Retrying webhook delivery...')
    
    // Simulate retry
    setTimeout(() => {
      const finalDelivery = {
        ...updatedDelivery,
        status: Math.random() > 0.3 ? 'success' as const : 'failed' as const,
        statusCode: Math.random() > 0.3 ? 200 : 500,
        responseTime: Math.floor(Math.random() * 1000) + 100
      }
      
      setDeliveries(deliveries.map(d => 
        d.id === deliveryId ? finalDelivery : d
      ))
    }, 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'retry': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'disabled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />
      case 'failed': return <XCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'retry': return <RefreshCw className="w-4 h-4" />
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'disabled': return <XCircle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('vi-VN')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          <Webhook className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Webhook Management</h1>
          <p className="text-gray-600">Configure and monitor webhook endpoints for real-time notifications</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Endpoints</p>
                <p className="text-2xl font-bold">{webhooks.length}</p>
              </div>
              <Webhook className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Endpoints</p>
                <p className="text-2xl font-bold text-green-600">
                  {webhooks.filter(wh => wh.enabled).length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deliveries</p>
                <p className="text-2xl font-bold">
                  {webhooks.reduce((sum, wh) => sum + wh.totalDeliveries, 0)}
                </p>
              </div>
              <Send className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {webhooks.length > 0 
                    ? (webhooks.reduce((sum, wh) => sum + wh.successRate, 0) / webhooks.length).toFixed(1)
                    : 0
                  }%
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="endpoints" className="space-y-4">
        <TabsList>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="deliveries">Delivery Logs</TabsTrigger>
          <TabsTrigger value="events">Event Types</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="endpoints">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Webhook Endpoints</CardTitle>
                  <CardDescription>
                    Manage your webhook endpoints and their configurations
                  </CardDescription>
                </div>
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Endpoint
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${webhook.enabled ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <Webhook className={`w-4 h-4 ${webhook.enabled ? 'text-green-600' : 'text-gray-400'}`} />
                        </div>
                        <div>
                          <h3 className="font-medium">{webhook.name}</h3>
                          <p className="text-sm text-gray-600">{webhook.url}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(webhook.status)}>
                          {getStatusIcon(webhook.status)}
                          {webhook.status}
                        </Badge>
                        <Switch
                          checked={webhook.enabled}
                          onCheckedChange={(enabled) => updateWebhook(webhook.id, { enabled })}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => testWebhook(webhook.id)}>
                              <Send className="w-4 h-4 mr-2" />
                              Test Webhook
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingWebhook(webhook)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyToClipboard(webhook.secret)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Secret
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => deleteWebhook(webhook.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Events</p>
                        <p className="font-medium">{webhook.events.length} subscribed</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Success Rate</p>
                        <p className="font-medium">{webhook.successRate}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Deliveries</p>
                        <p className="font-medium">{webhook.totalDeliveries}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Last Triggered</p>
                        <p className="font-medium">
                          {webhook.lastTriggered 
                            ? formatTimestamp(webhook.lastTriggered)
                            : 'Never'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="secondary" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}

                {webhooks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Webhook className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No webhook endpoints</h3>
                    <p className="mb-4">Create your first webhook endpoint to start receiving real-time notifications</p>
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Endpoint
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deliveries">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Logs</CardTitle>
              <CardDescription>
                Monitor webhook delivery attempts and their responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveries.slice(0, 10).map((delivery) => {
                  const webhook = webhooks.find(wh => wh.id === delivery.webhookId)
                  return (
                    <div key={delivery.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(delivery.status)}>
                            {getStatusIcon(delivery.status)}
                            {delivery.status}
                          </Badge>
                          <div>
                            <p className="font-medium">{delivery.event}</p>
                            <p className="text-sm text-gray-600">{webhook?.name}</p>
                          </div>
                        </div>
                        
                        <div className="text-right text-sm text-gray-600">
                          <p>{formatTimestamp(delivery.timestamp)}</p>
                          <p>{delivery.responseTime}ms</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">Status Code</p>
                          <p className="font-mono">{delivery.statusCode || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Attempts</p>
                          <p>{delivery.attempts}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">Response Time</p>
                          <p>{delivery.responseTime}ms</p>
                        </div>
                      </div>

                      {delivery.error && (
                        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-sm text-red-800">{delivery.error}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedWebhook(delivery.id)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Payload
                        </Button>
                        
                        {delivery.status === 'failed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => retryDelivery(delivery.id)}
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}

                {deliveries.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Send className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No deliveries yet</h3>
                    <p>Webhook deliveries will appear here once events are triggered</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Available Event Types</CardTitle>
              <CardDescription>
                Events you can subscribe to with your webhook endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <h3 className="font-medium">{event.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    <Badge variant="secondary" className="text-xs font-mono">
                      {event.id}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Settings</CardTitle>
              <CardDescription>
                Configure global webhook behavior and security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Webhook Signatures</Label>
                  <p className="text-sm text-gray-600">
                    Sign webhook payloads with HMAC-SHA256
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Automatic Retries</Label>
                  <p className="text-sm text-gray-600">
                    Automatically retry failed webhook deliveries
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Default Timeout (seconds)</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                    <SelectItem value="120">120 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default Retry Attempts</Label>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 attempt</SelectItem>
                    <SelectItem value="3">3 attempts</SelectItem>
                    <SelectItem value="5">5 attempts</SelectItem>
                    <SelectItem value="10">10 attempts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-3">Security Best Practices</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Always verify webhook signatures to ensure authenticity</p>
                  <p>• Use HTTPS endpoints to encrypt data in transit</p>
                  <p>• Implement idempotency to handle duplicate deliveries</p>
                  <p>• Set appropriate timeout values for your endpoints</p>
                  <p>• Monitor delivery logs for failed attempts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
