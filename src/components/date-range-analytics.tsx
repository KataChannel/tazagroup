'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import DateRangePicker, { DateRange } from '@/components/date-range-picker'
import { TrendingUp, TrendingDown, DollarSign, MousePointer, Target, BarChart3, RefreshCw } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface AnalyticsSummary {
  clicks: { value: number; change: number }
  conversions: { value: number; change: number }
  earnings: { value: number; change: number }
  conversionRate: { value: number; change: number }
}

interface ChartDataPoint {
  date: string
  dateDisplay: string
  clicks: number
  conversions: number
  earnings: number
  conversionRate: number
}

interface TopCampaign {
  id: string
  name: string
  category: string
  conversions: number
  earnings: number
}

interface DateRangeAnalyticsData {
  dateRange: {
    startDate: string
    endDate: string
    days: number
    label: string
  }
  summary: AnalyticsSummary
  chartData: ChartDataPoint[]
  topCampaigns: TopCampaign[]
  timestamp: string
}

interface DateRangeAnalyticsProps {
  className?: string
}

export default function DateRangeAnalytics({ className }: DateRangeAnalyticsProps) {
  const [data, setData] = useState<DateRangeAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>()
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

  const fetchAnalytics = async (customRange?: DateRange) => {
    setLoading(true)
    try {
      let url = '/api/analytics/daterange'
      const params = new URLSearchParams()

      if (customRange) {
        params.append('startDate', customRange.from.toISOString().split('T')[0])
        params.append('endDate', customRange.to.toISOString().split('T')[0])
      } else {
        params.append('range', 'last30days')
      }

      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      } else {
        console.error('Failed to fetch analytics:', response.statusText)
      }
    } catch (error) {
      console.error('Analytics fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange)
    fetchAnalytics(newRange)
  }

  const handleRefresh = () => {
    fetchAnalytics(dateRange)
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />
    if (change < 0) return <TrendingDown className="h-3 w-3" />
    return null
  }

  if (loading && !data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Phân tích theo khoảng thời gian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Đang tải dữ liệu phân tích...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Date Range Picker */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Phân tích theo khoảng thời gian</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DateRangePicker 
            value={dateRange}
            onChange={handleDateRangeChange}
          />
        </CardContent>
      </Card>

      {data && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Lượt click</p>
                    <p className="text-2xl font-bold">{formatNumber(data.summary.clicks.value)}</p>
                  </div>
                  <MousePointer className="h-8 w-8 text-blue-500" />
                </div>
                <div className={`flex items-center mt-2 text-sm ${getChangeColor(data.summary.clicks.change)}`}>
                  {getChangeIcon(data.summary.clicks.change)}
                  <span className="ml-1">
                    {data.summary.clicks.change > 0 ? '+' : ''}{data.summary.clicks.change.toFixed(1)}%
                  </span>
                  <span className="text-gray-500 ml-1">so với kỳ trước</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Chuyển đổi</p>
                    <p className="text-2xl font-bold">{formatNumber(data.summary.conversions.value)}</p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
                <div className={`flex items-center mt-2 text-sm ${getChangeColor(data.summary.conversions.change)}`}>
                  {getChangeIcon(data.summary.conversions.change)}
                  <span className="ml-1">
                    {data.summary.conversions.change > 0 ? '+' : ''}{data.summary.conversions.change.toFixed(1)}%
                  </span>
                  <span className="text-gray-500 ml-1">so với kỳ trước</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Thu nhập</p>
                    <p className="text-2xl font-bold">{formatCurrency(data.summary.earnings.value)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-500" />
                </div>
                <div className={`flex items-center mt-2 text-sm ${getChangeColor(data.summary.earnings.change)}`}>
                  {getChangeIcon(data.summary.earnings.change)}
                  <span className="ml-1">
                    {data.summary.earnings.change > 0 ? '+' : ''}{data.summary.earnings.change.toFixed(1)}%
                  </span>
                  <span className="text-gray-500 ml-1">so với kỳ trước</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tỷ lệ chuyển đổi</p>
                    <p className="text-2xl font-bold">{data.summary.conversionRate.value.toFixed(2)}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
                <div className={`flex items-center mt-2 text-sm ${getChangeColor(data.summary.conversionRate.change)}`}>
                  {getChangeIcon(data.summary.conversionRate.change)}
                  <span className="ml-1">
                    {data.summary.conversionRate.change > 0 ? '+' : ''}{data.summary.conversionRate.change.toFixed(1)}%
                  </span>
                  <span className="text-gray-500 ml-1">so với kỳ trước</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Biểu đồ hiệu suất ({data.dateRange.label})</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={chartType === 'line' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('line')}
                  >
                    Đường
                  </Button>
                  <Button
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                  >
                    Cột
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={data.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="dateDisplay" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        labelFormatter={(label, payload) => {
                          const dataPoint = payload?.[0]?.payload
                          return dataPoint ? dataPoint.date : label
                        }}
                        formatter={(value, name) => {
                          if (name === 'earnings') return [formatCurrency(Number(value)), 'Thu nhập']
                          if (name === 'conversionRate') return [`${Number(value).toFixed(2)}%`, 'Tỷ lệ chuyển đổi']
                          return [formatNumber(Number(value)), name === 'clicks' ? 'Lượt click' : 'Chuyển đổi']
                        }}
                      />
                      <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} />
                      <Line yAxisId="left" type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="conversionRate" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  ) : (
                    <BarChart data={data.chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="dateDisplay" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        labelFormatter={(label, payload) => {
                          const dataPoint = payload?.[0]?.payload
                          return dataPoint ? dataPoint.date : label
                        }}
                        formatter={(value, name) => {
                          if (name === 'earnings') return [formatCurrency(Number(value)), 'Thu nhập']
                          if (name === 'conversionRate') return [`${Number(value).toFixed(2)}%`, 'Tỷ lệ chuyển đổi']
                          return [formatNumber(Number(value)), name === 'clicks' ? 'Lượt click' : 'Chuyển đổi']
                        }}
                      />
                      <Bar yAxisId="left" dataKey="clicks" fill="#3b82f6" />
                      <Bar yAxisId="left" dataKey="conversions" fill="#10b981" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Campaigns */}
          <Card>
            <CardHeader>
              <CardTitle>Top chiến dịch hiệu suất cao</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topCampaigns.length > 0 ? (
                  data.topCampaigns.map((campaign, index) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-gray-600">{campaign.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(campaign.earnings)}</p>
                        <p className="text-sm text-gray-600">{formatNumber(campaign.conversions)} chuyển đổi</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Chưa có dữ liệu chiến dịch trong khoảng thời gian này
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
