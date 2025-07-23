'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  Eye,
  Target,
  BarChart3,
  PieChart as PieChartIcon,
  RefreshCw,
  Search
} from 'lucide-react'

interface CommissionData {
  summary: {
    totalCommission: number
    pendingCommission: number
    confirmedCommission: number
    averageCommission: number
    commissionRate: number
    topCampaign: string
  }
  timeline: Array<{
    date: string
    commission: number
    conversions: number
    averageCommission: number
  }>
  campaigns: Array<{
    id: string
    name: string
    totalCommission: number
    conversions: number
    commissionRate: number
    averageCommission: number
    status: string
    change: number
  }>
  commissionTiers: Array<{
    tier: string
    minCommission: number
    maxCommission: number
    count: number
    totalAmount: number
    percentage: number
  }>
  transactions: Array<{
    id: string
    campaignName: string
    date: string
    type: string
    amount: number
    commission: number
    rate: number
    status: 'confirmed' | 'pending' | 'rejected'
  }>
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#EC4899']

export function CommissionReports() {
  const [data, setData] = useState<CommissionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedCampaign, setSelectedCampaign] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchCommissionData = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        period: selectedPeriod,
        campaign: selectedCampaign,
        search: searchQuery
      })

      const response = await fetch(`/api/reports/commission?${params}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Failed to fetch commission data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCommissionData()
  }, [selectedPeriod, selectedCampaign])

  const handleSearch = () => {
    fetchCommissionData()
  }

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
        <p className="text-gray-500">Không thể tải dữ liệu hoa hồng</p>
        <Button onClick={fetchCommissionData} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Thử lại
        </Button>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Đã xác nhận</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xác nhận</Badge>
      case 'rejected':
        return <Badge variant="destructive">Từ chối</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Báo cáo Hoa hồng</h2>
          <p className="text-gray-600">Phân tích chi tiết thu nhập hoa hồng theo chiến dịch</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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

          <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Chọn chiến dịch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả chiến dịch</SelectItem>
              <SelectItem value="shopee">Shopee</SelectItem>
              <SelectItem value="tiki">Tiki</SelectItem>
              <SelectItem value="lazada">Lazada</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-48"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} variant="outline">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <Button>
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng Hoa hồng</p>
                <p className="text-2xl font-bold">{data.summary.totalCommission.toLocaleString('vi-VN')}₫</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5% so với tháng trước
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chờ xác nhận</p>
                <p className="text-2xl font-bold">{data.summary.pendingCommission.toLocaleString('vi-VN')}₫</p>
                <p className="text-xs text-yellow-600 flex items-center mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  {((data.summary.pendingCommission / data.summary.totalCommission) * 100).toFixed(1)}% tổng
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Eye className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã xác nhận</p>
                <p className="text-2xl font-bold">{data.summary.confirmedCommission.toLocaleString('vi-VN')}₫</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {((data.summary.confirmedCommission / data.summary.totalCommission) * 100).toFixed(1)}% tổng
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoa hồng trung bình</p>
                <p className="text-2xl font-bold">{data.summary.averageCommission.toLocaleString('vi-VN')}₫</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <PieChartIcon className="h-3 w-3 mr-1" />
                  {data.summary.commissionRate}% tỷ lệ
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="campaigns">Theo chiến dịch</TabsTrigger>
          <TabsTrigger value="tiers">Phân tầng</TabsTrigger>
          <TabsTrigger value="timeline">Theo thời gian</TabsTrigger>
          <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Xu hướng Hoa hồng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.timeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          `${Number(value).toLocaleString('vi-VN')}₫`,
                          name === 'commission' ? 'Hoa hồng' : 'Hoa hồng TB'
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="commission"
                        stroke="#3B82F6"
                        fill="url(#commissionGradient)"
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phân bố Hoa hồng theo Chiến dịch</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.campaigns.slice(0, 6)}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${(((value || 0) / data.summary.totalCommission) * 100).toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalCommission"
                      >
                        {data.campaigns.slice(0, 6).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${Number(value).toLocaleString('vi-VN')}₫`, 'Hoa hồng']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hoa hồng theo Chiến dịch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Chiến dịch</th>
                      <th className="text-left py-3 px-4 font-medium">Tổng Hoa hồng</th>
                      <th className="text-left py-3 px-4 font-medium">Chuyển đổi</th>
                      <th className="text-left py-3 px-4 font-medium">Tỷ lệ (%)</th>
                      <th className="text-left py-3 px-4 font-medium">TB/Chuyển đổi</th>
                      <th className="text-left py-3 px-4 font-medium">Trạng thái</th>
                      <th className="text-left py-3 px-4 font-medium">Thay đổi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.campaigns.map((campaign, index) => (
                      <tr key={campaign.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="h-3 w-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span className="font-medium">{campaign.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {campaign.totalCommission.toLocaleString('vi-VN')}₫
                        </td>
                        <td className="py-3 px-4">{campaign.conversions}</td>
                        <td className="py-3 px-4">{campaign.commissionRate}%</td>
                        <td className="py-3 px-4">
                          {campaign.averageCommission.toLocaleString('vi-VN')}₫
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(campaign.status)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`flex items-center ${campaign.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {campaign.change >= 0 ? 
                              <TrendingUp className="h-3 w-3 mr-1" /> : 
                              <TrendingDown className="h-3 w-3 mr-1" />
                            }
                            {campaign.change >= 0 ? '+' : ''}{campaign.change}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tiers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Phân tầng Hoa hồng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.commissionTiers}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tier" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => [
                          name === 'count' ? value : `${Number(value).toLocaleString('vi-VN')}₫`,
                          name === 'count' ? 'Số lượng' : 'Tổng tiền'
                        ]}
                      />
                      <Bar dataKey="totalAmount" fill="#3B82F6" />
                      <Bar dataKey="count" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chi tiết Phân tầng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.commissionTiers.map((tier, index) => (
                    <div key={tier.tier} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-4 w-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <div>
                          <p className="font-medium">{tier.tier}</p>
                          <p className="text-sm text-gray-600">
                            {tier.minCommission.toLocaleString('vi-VN')}₫ - {tier.maxCommission.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{tier.count} giao dịch</p>
                        <p className="text-sm text-gray-600">{tier.percentage}% tổng</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Biểu đồ Thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.timeline}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'conversions' ? value : `${Number(value).toLocaleString('vi-VN')}₫`,
                        name === 'commission' ? 'Hoa hồng' : 
                        name === 'averageCommission' ? 'HH Trung bình' : 'Chuyển đổi'
                      ]}
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="commission" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      name="commission"
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="averageCommission" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="averageCommission"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="conversions" 
                      stroke="#F59E0B" 
                      strokeWidth={2}
                      name="conversions"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết Giao dịch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Mã GD</th>
                      <th className="text-left py-3 px-4 font-medium">Chiến dịch</th>
                      <th className="text-left py-3 px-4 font-medium">Ngày</th>
                      <th className="text-left py-3 px-4 font-medium">Loại</th>
                      <th className="text-left py-3 px-4 font-medium">Giá trị</th>
                      <th className="text-left py-3 px-4 font-medium">Hoa hồng</th>
                      <th className="text-left py-3 px-4 font-medium">Tỷ lệ</th>
                      <th className="text-left py-3 px-4 font-medium">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm">{transaction.id}</td>
                        <td className="py-3 px-4">{transaction.campaignName}</td>
                        <td className="py-3 px-4 text-sm">{transaction.date}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{transaction.type}</Badge>
                        </td>
                        <td className="py-3 px-4 font-semibold">
                          {transaction.amount.toLocaleString('vi-VN')}₫
                        </td>
                        <td className="py-3 px-4 font-semibold text-green-600">
                          +{transaction.commission.toLocaleString('vi-VN')}₫
                        </td>
                        <td className="py-3 px-4">{transaction.rate}%</td>
                        <td className="py-3 px-4">
                          {getStatusBadge(transaction.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
