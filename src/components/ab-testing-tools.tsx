"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  TestTube, 
  Play, 
  Pause, 
  TrendingUp, 
  Users, 
  MousePointer, 
  Target,
  BarChart3,
  Settings,
  Plus,
  Eye
} from 'lucide-react'
import { toast } from 'sonner'

interface ABTest {
  id: string
  name: string
  description: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  type: 'landing_page' | 'email' | 'banner' | 'link'
  createdAt: string
  startDate: string
  endDate?: string
  variants: ABVariant[]
  trafficSplit: number[]
  metrics: {
    totalVisitors: number
    conversions: number
    conversionRate: number
  }
}

interface ABVariant {
  id: string
  name: string
  description: string
  url?: string
  content?: string
  visitors: number
  conversions: number
  conversionRate: number
  isControl: boolean
}

export default function ABTestingTools() {
  const [activeTab, setActiveTab] = useState('tests')
  const [tests, setTests] = useState<ABTest[]>([
    {
      id: '1',
      name: 'Landing Page Headlines Test',
      description: 'Testing different headlines for campaign landing page',
      status: 'running',
      type: 'landing_page',
      createdAt: '2025-01-10',
      startDate: '2025-01-15',
      trafficSplit: [50, 50],
      variants: [
        {
          id: 'v1',
          name: 'Control - Original Headline',
          description: 'Current headline: "Earn More with Affiliate Marketing"',
          visitors: 1245,
          conversions: 87,
          conversionRate: 7.0,
          isControl: true
        },
        {
          id: 'v2', 
          name: 'Variant A - Urgent Headline',
          description: 'New headline: "Start Earning Today - Limited Time Offer"',
          visitors: 1198,
          conversions: 112,
          conversionRate: 9.3,
          isControl: false
        }
      ],
      metrics: {
        totalVisitors: 2443,
        conversions: 199,
        conversionRate: 8.15
      }
    },
    {
      id: '2',
      name: 'Email Subject Line Test',
      description: 'Testing email subject lines for campaign promotions',
      status: 'completed',
      type: 'email',
      createdAt: '2025-01-05',
      startDate: '2025-01-08',
      endDate: '2025-01-12',
      trafficSplit: [33, 33, 34],
      variants: [
        {
          id: 'v1',
          name: 'Control - Direct',
          description: 'New Campaign Available',
          visitors: 1000,
          conversions: 145,
          conversionRate: 14.5,
          isControl: true
        },
        {
          id: 'v2',
          name: 'Variant A - Urgency',
          description: 'Only 24 Hours Left - New Campaign',
          visitors: 1000,
          conversions: 189,
          conversionRate: 18.9,
          isControl: false
        },
        {
          id: 'v3',
          name: 'Variant B - Personal',
          description: 'Your Personal Campaign Recommendation',
          visitors: 1020,
          conversions: 163,
          conversionRate: 16.0,
          isControl: false
        }
      ],
      metrics: {
        totalVisitors: 3020,
        conversions: 497,
        conversionRate: 16.5
      }
    }
  ])

  const [newTest, setNewTest] = useState({
    name: '',
    description: '',
    type: 'landing_page',
    variants: [
      { name: 'Control', description: '', isControl: true },
      { name: 'Variant A', description: '', isControl: false }
    ]
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Play className="w-3 h-3" />
      case 'paused': return <Pause className="w-3 h-3" />
      case 'completed': return <Target className="w-3 h-3" />
      default: return <Settings className="w-3 h-3" />
    }
  }

  const toggleTestStatus = (testId: string) => {
    setTests(tests.map(test => {
      if (test.id === testId) {
        const newStatus = test.status === 'running' ? 'paused' : 'running'
        return { ...test, status: newStatus }
      }
      return test
    }))
    toast.success('Đã cập nhật trạng thái test')
  }

  const createTest = () => {
    if (!newTest.name.trim()) {
      toast.error('Vui lòng nhập tên test')
      return
    }

    const test: ABTest = {
      id: Date.now().toString(),
      name: newTest.name,
      description: newTest.description,
      status: 'draft',
      type: newTest.type as any,
      createdAt: new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      trafficSplit: [50, 50],
      variants: newTest.variants.map((v, index) => ({
        id: `v${index + 1}`,
        name: v.name,
        description: v.description,
        visitors: 0,
        conversions: 0,
        conversionRate: 0,
        isControl: v.isControl
      })),
      metrics: {
        totalVisitors: 0,
        conversions: 0,
        conversionRate: 0
      }
    }

    setTests([test, ...tests])
    setNewTest({
      name: '',
      description: '',
      type: 'landing_page',
      variants: [
        { name: 'Control', description: '', isControl: true },
        { name: 'Variant A', description: '', isControl: false }
      ]
    })
    setActiveTab('tests')
    toast.success('Đã tạo A/B test mới!')
  }

  const calculateWinner = (variants: ABVariant[]) => {
    return variants.reduce((prev, current) => 
      current.conversionRate > prev.conversionRate ? current : prev
    )
  }

  const calculateConfidence = (control: ABVariant, variant: ABVariant) => {
    // Simplified confidence calculation for demo
    const diff = Math.abs(variant.conversionRate - control.conversionRate)
    if (diff < 1) return 'Thấp (< 90%)'
    if (diff < 3) return 'Trung bình (90-95%)'
    return 'Cao (> 95%)'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
          <TestTube className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">A/B Testing Tools</h1>
          <p className="text-gray-600">Tối ưu hóa hiệu suất campaigns thông qua A/B testing</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng Tests</p>
                <p className="text-2xl font-bold">{tests.length}</p>
              </div>
              <TestTube className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang Chạy</p>
                <p className="text-2xl font-bold">
                  {tests.filter(t => t.status === 'running').length}
                </p>
              </div>
              <Play className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoàn Thành</p>
                <p className="text-2xl font-bold">
                  {tests.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg CVR</p>
                <p className="text-2xl font-bold">
                  {(tests.reduce((sum, t) => sum + t.metrics.conversionRate, 0) / tests.length || 0).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="create">Tạo Test Mới</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          {tests.map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {test.name}
                      <Badge className={getStatusColor(test.status)}>
                        {getStatusIcon(test.status)}
                        {test.status}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info('Chi tiết test đang được phát triển')}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Xem Chi Tiết
                    </Button>
                    {test.status !== 'completed' && (
                      <Button
                        variant={test.status === 'running' ? 'secondary' : 'default'}
                        size="sm"
                        onClick={() => toggleTestStatus(test.id)}
                      >
                        {test.status === 'running' ? (
                          <>
                            <Pause className="w-4 h-4 mr-1" />
                            Tạm Dừng
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Bắt Đầu
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Test Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Visitors</span>
                      </div>
                      <p className="text-2xl font-bold">{test.metrics.totalVisitors.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <MousePointer className="w-4 h-4" />
                        <span className="text-sm">Conversions</span>
                      </div>
                      <p className="text-2xl font-bold">{test.metrics.conversions}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-gray-600 mb-1">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm">Conversion Rate</span>
                      </div>
                      <p className="text-2xl font-bold">{test.metrics.conversionRate}%</p>
                    </div>
                  </div>

                  {/* Variants */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Variants Performance</h4>
                    {test.variants.map((variant) => {
                      const isWinner = test.status === 'completed' && 
                        variant.id === calculateWinner(test.variants).id
                      
                      return (
                        <div key={variant.id} className={`border rounded-lg p-4 ${
                          isWinner ? 'border-green-500 bg-green-50' : ''
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h5 className="font-medium flex items-center gap-2">
                                {variant.name}
                                {variant.isControl && (
                                  <Badge variant="outline">Control</Badge>
                                )}
                                {isWinner && (
                                  <Badge className="bg-green-100 text-green-800">
                                    Winner
                                  </Badge>
                                )}
                              </h5>
                              <p className="text-sm text-gray-600">{variant.description}</p>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-lg font-semibold">{variant.conversionRate}%</p>
                              <p className="text-sm text-gray-500">
                                {variant.conversions}/{variant.visitors}
                              </p>
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(variant.visitors / test.metrics.totalVisitors) * 100}%` }}
                            />
                          </div>
                          
                          {test.status === 'completed' && !variant.isControl && (
                            <div className="mt-2 text-sm">
                              <span className="text-gray-600">Confidence: </span>
                              <span className="font-medium">
                                {calculateConfidence(test.variants.find(v => v.isControl)!, variant)}
                              </span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Test Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t">
                    <span>Tạo: {new Date(test.createdAt).toLocaleDateString('vi-VN')}</span>
                    <span>Bắt đầu: {new Date(test.startDate).toLocaleDateString('vi-VN')}</span>
                    {test.endDate && (
                      <span>Kết thúc: {new Date(test.endDate).toLocaleDateString('vi-VN')}</span>
                    )}
                    <span>Loại: {test.type.replace('_', ' ')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {tests.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <TestTube className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">Chưa có A/B test nào</h3>
              <p className="mb-4">Tạo test đầu tiên để bắt đầu tối ưu hóa hiệu suất</p>
              <Button onClick={() => setActiveTab('create')}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo Test Mới
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Tạo A/B Test Mới</CardTitle>
              <CardDescription>
                Thiết lập test để so sánh hiệu suất giữa các variants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="test-name">Tên Test *</Label>
                  <Input
                    id="test-name"
                    placeholder="VD: Landing Page Headlines Test"
                    value={newTest.name}
                    onChange={(e) => setNewTest({...newTest, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="test-type">Loại Test</Label>
                  <Select 
                    value={newTest.type} 
                    onValueChange={(value) => setNewTest({...newTest, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landing_page">Landing Page</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="link">Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="test-description">Mô Tả</Label>
                <Input
                  id="test-description"
                  placeholder="Mô tả chi tiết về test này..."
                  value={newTest.description}
                  onChange={(e) => setNewTest({...newTest, description: e.target.value})}
                />
              </div>

              <div>
                <Label className="text-base font-medium">Variants</Label>
                <div className="space-y-4 mt-2">
                  {newTest.variants.map((variant, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <h4 className="font-medium">{variant.name}</h4>
                        {variant.isControl && (
                          <Badge variant="outline">Control</Badge>
                        )}
                      </div>
                      
                      <Input
                        placeholder="Mô tả variant này..."
                        value={variant.description}
                        onChange={(e) => {
                          const updatedVariants = [...newTest.variants]
                          updatedVariants[index].description = e.target.value
                          setNewTest({...newTest, variants: updatedVariants})
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button onClick={createTest} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo Test
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => toast.info('Advanced settings đang được phát triển')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Cài Đặt Nâng Cao
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>A/B Test Analytics</CardTitle>
              <CardDescription>
                Tổng quan về hiệu suất của tất cả A/B tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Test Success Rate</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tests thành công</span>
                      <span>{tests.filter(t => t.status === 'completed').length}/{tests.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ 
                          width: `${(tests.filter(t => t.status === 'completed').length / tests.length) * 100 || 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Improvement Rate</h4>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">+12.5%</p>
                    <p className="text-sm text-gray-600">Tăng conversion trung bình</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Test Types Distribution</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['landing_page', 'email', 'banner', 'link'].map(type => (
                    <div key={type} className="text-center p-3 border rounded-lg">
                      <p className="text-2xl font-bold">
                        {tests.filter(t => t.type === type).length}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">
                        {type.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
