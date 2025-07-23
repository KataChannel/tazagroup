"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DashboardStats } from "@/components/dashboard-stats"
import { RevenueChart } from "@/components/revenue-chart"
import { RecentActivity } from "@/components/recent-activity"
import RealTimeAnalytics from "@/components/real-time-analytics"
import DateRangeAnalytics from "@/components/date-range-analytics"
import { NotificationDemo } from "@/components/notification-demo"
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, DollarSign, MousePointer, Target, Calendar, ArrowRight, BarChart3, Activity } from 'lucide-react'
import Link from 'next/link'

interface BalanceData {
  totalEarned: number
  totalPaid: number
  availableBalance: number
  monthlyEarnings: Array<{
    month: string
    amount: number
  }>
  topCampaigns: Array<{
    name: string
    earnings: number
    clicks: number
    conversions: number
  }>
}

interface Campaign {
  id: string
  name: string
  category: string
  commission: number
  status: string
  image?: string
  description: string
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const [balance, setBalance] = useState<BalanceData | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user && !authLoading) {
      fetchDashboardData()
    }
  }, [user, authLoading])

  const fetchDashboardData = async () => {
    try {
      const [balanceRes, campaignRes] = await Promise.all([
        fetch('/api/balance'),
        fetch('/api/campaigns?limit=6')
      ])

      if (balanceRes.ok) {
        const balanceData = await balanceRes.json()
        setBalance(balanceData)
      }

      if (campaignRes.ok) {
        const campaignData = await campaignRes.json()
        setCampaigns(campaignData.campaigns || [])
      }
    } catch (err) {
      setError('Không thể tải dữ liệu dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Chào mừng đến với AccessTrade</h1>
        <p className="text-gray-600 mb-8">Vui lòng đăng nhập để truy cập dashboard</p>
        <Button>Đăng nhập</Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchDashboardData}>Thử lại</Button>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Chào mừng trở lại, {user.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Theo dõi hiệu suất và quản lý chiến dịch affiliate của bạn
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/campaigns">
            <Button variant="outline" className="w-full sm:w-auto">
              <Target className="w-4 h-4 mr-2" />
              Chiến dịch mới
            </Button>
          </Link>
          <Link href="/profile">
            <Button className="w-full sm:w-auto">
              <Calendar className="w-4 h-4 mr-2" />
              Cập nhật hồ sơ
            </Button>
          </Link>
        </div>
      </div>

      {/* Balance Overview */}
      {balance && (
        <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <DollarSign className="w-5 h-5" />
                <span className="text-sm opacity-90">Tổng thu nhập</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                {formatCurrency(balance.totalEarned)}
              </p>
            </div>
            
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm opacity-90">Số dư khả dụng</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                {formatCurrency(balance.availableBalance)}
              </p>
            </div>
            
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <MousePointer className="w-5 h-5" />
                <span className="text-sm opacity-90">Đã thanh toán</span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold">
                {formatCurrency(balance.totalPaid)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <Button variant="secondary" className="flex-1 sm:flex-none">
              <Link href="/reports" className="flex items-center justify-center">
                Xem báo cáo chi tiết
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            {balance.availableBalance > 0 && (
              <Button variant="outline" className="flex-1 sm:flex-none bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                Rút tiền
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Dashboard Stats */}
      <section>
        <DashboardStats />
      </section>

      {/* Analytics Tabs */}
      <Card className="p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Real-time
            </TabsTrigger>
            <TabsTrigger value="daterange" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Custom Range
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RevenueChart />
              </div>
              <div>
                <DashboardStats />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="realtime" className="mt-6">
            <RealTimeAnalytics />
          </TabsContent>
          
          <TabsContent value="daterange" className="mt-6">
            <DateRangeAnalytics />
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            <RecentActivity />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Notification System Demo */}
      <NotificationDemo />

      {/* Top Performing Campaigns */}
      {balance?.topCampaigns && balance.topCampaigns.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Chiến dịch hiệu quả nhất</h3>
            <Link href="/campaigns">
              <Button variant="outline" size="sm">
                Xem tất cả
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {balance.topCampaigns.map((campaign, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-sm sm:text-base line-clamp-2">{campaign.name}</h4>
                  <Badge variant="default" className="ml-2 text-xs">
                    Top {index + 1}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Thu nhập:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(campaign.earnings)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Click:</span>
                    <span className="font-medium">{campaign.clicks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Chuyển đổi:</span>
                    <span className="font-medium">{campaign.conversions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Available Campaigns */}
      {campaigns.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Chiến dịch đang hoạt động</h3>
            <Link href="/campaigns">
              <Button variant="outline" size="sm">
                Xem tất cả
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {campaigns.slice(0, 6).map((campaign) => (
              <div key={campaign.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {campaign.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm sm:text-base truncate">{campaign.name}</h4>
                    <p className="text-xs text-gray-600">{campaign.category}</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {campaign.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600">
                    {campaign.commission}% hoa hồng
                  </span>
                  <Badge 
                    variant={campaign.status === 'ACTIVE' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {campaign.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm dừng'}
                  </Badge>
                </div>
                
                <Link href={`/campaigns/${campaign.id}`}>
                  <Button size="sm" className="w-full mt-3">
                    Tham gia ngay
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">Thao tác nhanh</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/campaigns" className="block">
            <div className="p-4 text-center border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <Target className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-medium mb-1">Tìm chiến dịch</h4>
              <p className="text-sm text-gray-600">Khám phá cơ hội mới</p>
            </div>
          </Link>
          
          <Link href="/tools" className="block">
            <div className="p-4 text-center border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <MousePointer className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-medium mb-1">Công cụ</h4>
              <p className="text-sm text-gray-600">Link builder, analytics</p>
            </div>
          </Link>
          
          <Link href="/reports" className="block">
            <div className="p-4 text-center border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-medium mb-1">Báo cáo</h4>
              <p className="text-sm text-gray-600">Phân tích hiệu suất</p>
            </div>
          </Link>
          
          <Link href="/support" className="block">
            <div className="p-4 text-center border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <h4 className="font-medium mb-1">Hỗ trợ</h4>
              <p className="text-sm text-gray-600">Liên hệ team support</p>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  )
}
