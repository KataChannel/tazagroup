'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface RealTimeStats {
  today: {
    clicks: number
    conversions: number
    earnings: number
    conversionRate: number
  }
  week: {
    clicks: number
    conversions: number
    earnings: number
    conversionRate: number
  }
  month: {
    clicks: number
    conversions: number
    earnings: number
    conversionRate: number
  }
  hourlyTrend: Array<{
    hour: number
    clicks: number
    time: string
  }>
}

interface RealTimeAnalyticsProps {
  refreshInterval?: number
}

export default function RealTimeAnalytics({ refreshInterval = 30000 }: RealTimeAnalyticsProps) {
  const [stats, setStats] = useState<RealTimeStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const [isLive, setIsLive] = useState(true)

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch('/api/analytics/realtime')
      if (response.ok) {
        const data = await response.json()
        setStats(data.realTimeStats)
        setLastUpdated(new Date(data.timestamp).toLocaleTimeString())
        setLoading(false)
      }
    } catch (error) {
      console.error('Failed to fetch real-time data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRealTimeData()
    
    const interval = setInterval(() => {
      if (isLive) {
        fetchRealTimeData()
      }
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [refreshInterval, isLive])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            Real-time Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading real-time data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return null
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              Real-time Analytics
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLive(!isLive)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isLive 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isLive ? 'LIVE' : 'PAUSED'}
              </button>
              <span className="text-xs text-gray-500">
                Last updated: {lastUpdated}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">
              Today (24h)
              <Badge variant="secondary" className="ml-2">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Clicks</span>
                <span className="font-semibold">{formatNumber(stats.today.clicks)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Conversions</span>
                <span className="font-semibold">{formatNumber(stats.today.conversions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Earnings</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(stats.today.earnings)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Conv. Rate</span>
                <span className="font-semibold">{formatPercentage(stats.today.conversionRate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Week Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">This Week (7d)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Clicks</span>
                <span className="font-semibold">{formatNumber(stats.week.clicks)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Conversions</span>
                <span className="font-semibold">{formatNumber(stats.week.conversions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Earnings</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(stats.week.earnings)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Conv. Rate</span>
                <span className="font-semibold">{formatPercentage(stats.week.conversionRate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* This Month Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">This Month (30d)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Clicks</span>
                <span className="font-semibold">{formatNumber(stats.month.clicks)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Conversions</span>
                <span className="font-semibold">{formatNumber(stats.month.conversions)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Earnings</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(stats.month.earnings)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Conv. Rate</span>
                <span className="font-semibold">{formatPercentage(stats.month.conversionRate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-600">
            24-Hour Click Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-1">
            {stats.hourlyTrend.map((data, index) => {
              const maxClicks = Math.max(...stats.hourlyTrend.map(d => d.clicks))
              const height = maxClicks > 0 ? (data.clicks / maxClicks) * 100 : 0
              
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center group relative"
                >
                  <div
                    className="w-full bg-blue-500 hover:bg-blue-600 rounded-t transition-colors"
                    style={{ height: `${height}%`, minHeight: '2px' }}
                  />
                  <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left">
                    {data.hour}h
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {data.clicks} clicks at {data.hour}:00
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
