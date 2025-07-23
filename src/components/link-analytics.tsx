'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  MousePointer,
  Target,
  DollarSign,
  TrendingUp,
  Globe,
  Monitor,
  Smartphone,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface LinkAnalytics {
  link: {
    id: string
    title: string
    shortCode: string
    originalUrl: string
    isActive: boolean
    createdAt: string
    campaign: {
      id: string
      name: string
      commission: number
      category: string
    }
  }
  summary: {
    total: {
      clicks: number
      conversions: number
      revenue: number
      ctr: number
      avgRevenue: number
    }
    period: {
      clicks: number
      conversions: number
      revenue: number
      ctr: number
      days: number
    }
  }
  timeline: {
    clicks: Array<{ date: string; clicks: number }>
    conversions: Array<{ date: string; conversions: number; revenue: number }>
  }
  demographics: {
    countries: Array<{ country: string; clicks: number; percentage: number }>
    devices: Array<{ device: string; clicks: number; percentage: number }>
    browsers: Array<{ browser: string; clicks: number; percentage: number }>
    referrers: Array<{ source: string; clicks: number; percentage: number }>
  }
}

const COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

interface LinkAnalyticsProps {
  linkId: string
}

export function LinkAnalytics({ linkId }: LinkAnalyticsProps) {
  const [analytics, setAnalytics] = useState<LinkAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [period, setPeriod] = useState('30d')
  const [timeframe, setTimeframe] = useState('day')

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/links/${linkId}?period=${period}&timeframe=${timeframe}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [linkId, period, timeframe])

  const copyLinkUrl = () => {
    if (analytics?.link) {
      const url = `${window.location.origin}/l/${analytics.link.shortCode}`
      navigator.clipboard.writeText(url)
      // Could show toast notification here
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">Không thể tải dữ liệu phân tích</p>
      </div>
    )
  }

  const { link, summary, timeline, demographics } = analytics

  return (
    <div className="space-y-6">
      {/* Link Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{link.title || 'Untitled Link'}</h2>
                <Badge variant={link.isActive ? 'default' : 'secondary'}>
                  {link.isActive ? 'Hoạt động' : 'Tạm dừng'}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-blue-600 font-medium">
                  {window.location.origin}/l/{link.shortCode}
                </p>
                <p className="text-xs text-gray-500 break-all">
                  → {link.originalUrl}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Chiến dịch: {link.campaign.name}</span>
                  <span>Hoa hồng: {link.campaign.commission}%</span>
                  <span>Tạo: {new Date(link.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={copyLinkUrl}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={link.originalUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit
                </a>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Period and Timeframe Selectors */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 ngày</SelectItem>
              <SelectItem value="30d">30 ngày</SelectItem>
              <SelectItem value="90d">90 ngày</SelectItem>
              <SelectItem value="1y">1 năm</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Ngày</SelectItem>
            <SelectItem value="week">Tuần</SelectItem>
            <SelectItem value="month">Tháng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <MousePointer className="h-5 w-5 text-blue-600" />
              <div className="space-y-1">
                <p className="text-2xl font-bold">{summary.total.clicks.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Total Clicks</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {summary.period.clicks} trong {summary.period.days} ngày qua
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <div className="space-y-1">
                <p className="text-2xl font-bold">{summary.total.conversions.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Conversions</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {summary.period.conversions} trong {summary.period.days} ngày qua
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div className="space-y-1">
                <p className="text-2xl font-bold">{summary.total.revenue.toLocaleString()}₫</p>
                <p className="text-xs text-gray-600">Revenue</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {summary.period.revenue.toLocaleString()}₫ trong {summary.period.days} ngày qua
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div className="space-y-1">
                <p className="text-2xl font-bold">{summary.total.ctr}%</p>
                <p className="text-xs text-gray-600">CTR</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {summary.period.ctr}% trong {summary.period.days} ngày qua
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <div className="space-y-1">
                <p className="text-2xl font-bold">{summary.total.avgRevenue.toLocaleString()}₫</p>
                <p className="text-xs text-gray-600">Avg Revenue</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Per conversion
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="technology">Technology</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeline.clicks}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conversions & Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timeline.conversions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversions" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Geographic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demographics.countries.map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="font-medium">{country.country}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{country.clicks.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{country.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technology">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demographics.devices.map((device, index) => (
                    <div key={device.device} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{device.clicks.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{device.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Browsers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demographics.browsers.map((browser, index) => (
                    <div key={browser.browser} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="font-medium">{browser.browser}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{browser.clicks.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{browser.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sources">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demographics.referrers.map((referrer, index) => (
                  <div key={referrer.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="font-medium">{referrer.source}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{referrer.clicks.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">{referrer.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
