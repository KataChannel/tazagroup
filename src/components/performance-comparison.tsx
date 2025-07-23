'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  MousePointer,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw
} from 'lucide-react'

interface ComparisonPeriod {
  label: string
  current: {
    start: Date
    end: Date
  }
  previous: {
    start: Date
    end: Date
  }
}

interface PerformanceMetrics {
  clicks: number
  conversions: number
  revenue: number
  ctr: number
  avgRevenue: number
  campaigns: number
}

interface ComparisonData {
  current: {
    period: string
    metrics: PerformanceMetrics
    timeline: Array<{
      date: string
      clicks: number
      conversions: number
      revenue: number
    }>
  }
  previous: {
    period: string
    metrics: PerformanceMetrics
    timeline: Array<{
      date: string
      clicks: number
      conversions: number
      revenue: number
    }>
  }
  campaigns: Array<{
    id: string
    name: string
    current: PerformanceMetrics
    previous: PerformanceMetrics
    change: {
      clicks: number
      conversions: number
      revenue: number
      ctr: number
    }
  }>
}

const PRESET_PERIODS: ComparisonPeriod[] = [
  {
    label: 'Last 7 days vs Previous 7 days',
    current: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    previous: {
      start: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  },
  {
    label: 'Last 30 days vs Previous 30 days',
    current: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    previous: {
      start: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      end: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
  },
  {
    label: 'This month vs Last month',
    current: {
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date()
    },
    previous: {
      start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 0)
    }
  }
]

function getChangeIcon(change: number) {
  if (change > 0) return <ArrowUpRight className="h-4 w-4 text-green-600" />
  if (change < 0) return <ArrowDownRight className="h-4 w-4 text-red-600" />
  return <Minus className="h-4 w-4 text-gray-400" />
}

function getChangeColor(change: number) {
  if (change > 0) return 'text-green-600'
  if (change < 0) return 'text-red-600'
  return 'text-gray-400'
}

export function PerformanceComparison() {
  const [data, setData] = useState<ComparisonData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState(0)
  const [viewMode, setViewMode] = useState<'overview' | 'campaigns'>('overview')

  const fetchComparisonData = async () => {
    setIsLoading(true)
    try {
      const period = PRESET_PERIODS[selectedPeriod]
      const params = new URLSearchParams({
        currentStart: period.current.start.toISOString(),
        currentEnd: period.current.end.toISOString(),
        previousStart: period.previous.start.toISOString(),
        previousEnd: period.previous.end.toISOString()
      })

      const response = await fetch(`/api/analytics/comparison?${params}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Failed to fetch comparison data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchComparisonData()
  }, [selectedPeriod])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Không thể tải dữ liệu so sánh</p>
        <Button onClick={fetchComparisonData} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Thử lại
        </Button>
      </div>
    )
  }

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100 * 100) / 100
  }

  const clicksChange = calculateChange(data.current.metrics.clicks, data.previous.metrics.clicks)
  const conversionsChange = calculateChange(data.current.metrics.conversions, data.previous.metrics.conversions)
  const revenueChange = calculateChange(data.current.metrics.revenue, data.previous.metrics.revenue)
  const ctrChange = calculateChange(data.current.metrics.ctr, data.previous.metrics.ctr)

  // Combine timeline data for comparison charts
  const combinedTimeline = data.current.timeline.map((current, index) => {
    const previous = data.previous.timeline[index] || { clicks: 0, conversions: 0, revenue: 0 }
    return {
      date: current.date,
      currentClicks: current.clicks,
      previousClicks: previous.clicks,
      currentConversions: current.conversions,
      previousConversions: previous.conversions,
      currentRevenue: current.revenue,
      previousRevenue: previous.revenue
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Performance Comparison</h2>
        <div className="flex items-center gap-4">
          <Select value={selectedPeriod.toString()} onValueChange={(value) => setSelectedPeriod(parseInt(value))}>
            <SelectTrigger className="w-80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRESET_PERIODS.map((period, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={fetchComparisonData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Period Labels */}
      <div className="flex items-center justify-center gap-8 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="font-medium">Current Period</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{data.current.period}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-400 rounded"></div>
            <span className="font-medium">Previous Period</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{data.previous.period}</p>
        </div>
      </div>

      {/* Comparison Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <MousePointer className="h-5 w-5 text-blue-600" />
              {getChangeIcon(clicksChange)}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{data.current.metrics.clicks.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Clicks</p>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getChangeColor(clicksChange)}`}>
                  {clicksChange > 0 ? '+' : ''}{clicksChange}%
                </span>
                <span className="text-xs text-gray-500">
                  vs {data.previous.metrics.clicks.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-5 w-5 text-green-600" />
              {getChangeIcon(conversionsChange)}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{data.current.metrics.conversions.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Conversions</p>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getChangeColor(conversionsChange)}`}>
                  {conversionsChange > 0 ? '+' : ''}{conversionsChange}%
                </span>
                <span className="text-xs text-gray-500">
                  vs {data.previous.metrics.conversions.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              {getChangeIcon(revenueChange)}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{data.current.metrics.revenue.toLocaleString()}₫</p>
              <p className="text-xs text-gray-600">Revenue</p>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getChangeColor(revenueChange)}`}>
                  {revenueChange > 0 ? '+' : ''}{revenueChange}%
                </span>
                <span className="text-xs text-gray-500">
                  vs {data.previous.metrics.revenue.toLocaleString()}₫
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              {getChangeIcon(ctrChange)}
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{data.current.metrics.ctr}%</p>
              <p className="text-xs text-gray-600">CTR</p>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getChangeColor(ctrChange)}`}>
                  {ctrChange > 0 ? '+' : ''}{ctrChange}%
                </span>
                <span className="text-xs text-gray-500">
                  vs {data.previous.metrics.ctr}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Charts */}
      <Tabs defaultValue="clicks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clicks">Clicks</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="clicks">
          <Card>
            <CardHeader>
              <CardTitle>Clicks Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={combinedTimeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="currentClicks" 
                      stackId="1" 
                      stroke="#3b82f6" 
                      fill="#3b82f6"
                      fillOpacity={0.6}
                      name="Current Period"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="previousClicks" 
                      stackId="2" 
                      stroke="#9ca3af" 
                      fill="#9ca3af"
                      fillOpacity={0.3}
                      name="Previous Period"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions">
          <Card>
            <CardHeader>
              <CardTitle>Conversions Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={combinedTimeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="currentConversions" fill="#10b981" name="Current Period" />
                    <Bar dataKey="previousConversions" fill="#d1d5db" name="Previous Period" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={combinedTimeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="currentRevenue" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      name="Current Period"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="previousRevenue" 
                      stroke="#9ca3af" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Previous Period"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Campaign Comparison */}
      {data.campaigns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.campaigns.slice(0, 10).map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3">{campaign.name}</h4>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <MousePointer className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600">Clicks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{campaign.current.clicks.toLocaleString()}</span>
                        <div className="flex items-center gap-1">
                          {getChangeIcon(campaign.change.clicks)}
                          <span className={`text-sm ${getChangeColor(campaign.change.clicks)}`}>
                            {campaign.change.clicks > 0 ? '+' : ''}{campaign.change.clicks}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-600">Conversions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{campaign.current.conversions}</span>
                        <div className="flex items-center gap-1">
                          {getChangeIcon(campaign.change.conversions)}
                          <span className={`text-sm ${getChangeColor(campaign.change.conversions)}`}>
                            {campaign.change.conversions > 0 ? '+' : ''}{campaign.change.conversions}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-600">Revenue</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{campaign.current.revenue.toLocaleString()}₫</span>
                        <div className="flex items-center gap-1">
                          {getChangeIcon(campaign.change.revenue)}
                          <span className={`text-sm ${getChangeColor(campaign.change.revenue)}`}>
                            {campaign.change.revenue > 0 ? '+' : ''}{campaign.change.revenue}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-600">CTR</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{campaign.current.ctr}%</span>
                        <div className="flex items-center gap-1">
                          {getChangeIcon(campaign.change.ctr)}
                          <span className={`text-sm ${getChangeColor(campaign.change.ctr)}`}>
                            {campaign.change.ctr > 0 ? '+' : ''}{campaign.change.ctr}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
