'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DateRangePicker from '@/components/date-range-picker'
import { TrendingUp, TrendingDown, DollarSign, MousePointer, Target, Percent } from 'lucide-react'

interface AnalyticsData {
  period: {
    startDate: string
    endDate: string
  }
  summary: {
    clicks: number
    conversions: number
    earnings: number
    conversionRate: string
  }
  dailyStats: Array<{
    date: string
    conversions: number
    earnings: number
  }>
  campaignStats: Array<{
    campaignId: string
    _count: { id: number }
    _sum: { commission: number }
    campaign: { name: string; category: string }
  }>
}

export default function RealTimeAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Default to last 30 days
  const getDefaultDates = () => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    }
  }

  const [dateRange, setDateRange] = useState(getDefaultDates())

  const fetchAnalytics = async (start: string, end: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/analytics?startDate=${start}&endDate=${end}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch analytics')
      }
      
      setAnalyticsData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics(dateRange.startDate, dateRange.endDate)
  }, [dateRange.startDate, dateRange.endDate])

  const handleDateChange = (start: string, end: string) => {
    setDateRange({ startDate: start, endDate: end })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    color = 'blue' 
  }: {
    title: string
    value: string | number
    icon: React.ElementType
    change?: number
    color?: 'blue' | 'green' | 'purple' | 'orange'
  }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    }

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{value}</p>
                {change !== undefined && (
                  <div className={`flex items-center gap-1 text-sm ${
                    change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {change >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {Math.abs(change)}%
                  </div>
                )}
              </div>
            </div>
            <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Phân tích thời gian thực</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Phân tích thời gian thực</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Lỗi: {error}</p>
              <button 
                onClick={() => fetchAnalytics(dateRange.startDate, dateRange.endDate)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Thử lại
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Phân tích thời gian thực</h1>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onDateChange={handleDateChange}
      />

      {/* Summary Stats */}
      {analyticsData && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Lượt click"
              value={analyticsData.summary.clicks.toLocaleString()}
              icon={MousePointer}
              color="blue"
            />
            <StatCard
              title="Chuyển đổi"
              value={analyticsData.summary.conversions.toLocaleString()}
              icon={Target}
              color="green"
            />
            <StatCard
              title="Thu nhập"
              value={formatCurrency(analyticsData.summary.earnings)}
              icon={DollarSign}
              color="purple"
            />
            <StatCard
              title="Tỷ lệ chuyển đổi"
              value={`${analyticsData.summary.conversionRate}%`}
              icon={Percent}
              color="orange"
            />
          </div>

          {/* Daily Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ thu nhập theo ngày</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-end space-x-2">
                {analyticsData.dailyStats.map((day, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-blue-500/20 rounded-t flex flex-col justify-end min-h-[20px]"
                    style={{
                      height: `${Math.max(20, (day.earnings / Math.max(...analyticsData.dailyStats.map(d => d.earnings))) * 300)}px`
                    }}
                  >
                    <div className="bg-blue-500 rounded-t p-1 text-xs text-white text-center">
                      {formatCurrency(day.earnings)}
                    </div>
                    <div className="text-xs text-center mt-1 text-gray-600">
                      {new Date(day.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Campaign Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Hiệu suất chiến dịch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.campaignStats.slice(0, 10).map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium">{campaign.campaign.name}</h3>
                      <p className="text-sm text-gray-600">{campaign.campaign.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(campaign._sum.commission || 0)}</p>
                      <p className="text-sm text-gray-600">{campaign._count.id} chuyển đổi</p>
                    </div>
                  </div>
                ))}
                {analyticsData.campaignStats.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    Chưa có dữ liệu trong khoảng thời gian này
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
