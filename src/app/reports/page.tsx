"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import DataExport from "@/components/data-export"
import DateRangeAnalytics from "@/components/date-range-analytics"
import { PerformanceComparison } from "@/components/performance-comparison"
import { CommissionReports } from "@/components/commission-reports"
import { PayoutSchedule } from "@/components/payout-schedule"
import { AdvancedFiltering } from "@/components/advanced-filtering"
import { TaxReports } from "@/components/tax-reports"
import { MinimumPayoutSettings } from "@/components/minimum-payout-settings"
import { PayoutReports } from "@/components/payout-reports"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { 
  CalendarDays, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MousePointer, 
  Eye,
  FileSpreadsheet,
  Clock,
  Filter,
  Receipt,
  Settings,
  CreditCard
} from "lucide-react"

// Sample data for charts
const performanceData = [
  { date: "01/07", clicks: 1200, conversions: 45, revenue: 2500000 },
  { date: "02/07", clicks: 1350, conversions: 52, revenue: 2800000 },
  { date: "03/07", clicks: 1100, conversions: 38, revenue: 2200000 },
  { date: "04/07", clicks: 1400, conversions: 58, revenue: 3100000 },
  { date: "05/07", clicks: 1600, conversions: 62, revenue: 3400000 },
  { date: "06/07", clicks: 1450, conversions: 55, revenue: 3000000 },
  { date: "07/07", clicks: 1700, conversions: 68, revenue: 3800000 },
]

const campaignData = [
  { name: "Shopee", revenue: 15000000, percentage: 35 },
  { name: "Tiki", revenue: 8500000, percentage: 20 },
  { name: "Lazada", revenue: 7200000, percentage: 17 },
  { name: "Grab", revenue: 6000000, percentage: 14 },
  { name: "Khác", revenue: 6000000, percentage: 14 },
]

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

const transactionData = [
  {
    id: "TXN001",
    campaign: "Shopee Affiliate",
    date: "2024-07-22",
    time: "14:30",
    amount: "125,000₫",
    commission: "15,000₫",
    status: "completed",
    type: "purchase"
  },
  {
    id: "TXN002", 
    campaign: "Tiki Partnership",
    date: "2024-07-22",
    time: "12:15",
    amount: "89,000₫", 
    commission: "8,900₫",
    status: "pending",
    type: "purchase"
  },
  {
    id: "TXN003",
    campaign: "Lazada Associates", 
    date: "2024-07-21",
    time: "18:45",
    amount: "200,000₫",
    commission: "36,000₫",
    status: "completed",
    type: "purchase"
  },
  {
    id: "TXN004",
    campaign: "Grab Business",
    date: "2024-07-21", 
    time: "09:20",
    amount: "45,000₫",
    commission: "4,500₫",
    status: "failed",
    type: "delivery"
  }
]

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}

function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className={`inline-flex items-center ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {change}
          </span>
          {" "}so với tháng trước
        </p>
      </CardContent>
    </Card>
  )
}

interface TransactionRowProps {
  transaction: {
    id: string;
    campaign: string;
    date: string;
    time: string;
    amount: string;
    commission: string;
    status: string;
    type: string;
  };
}

function TransactionRow({ transaction }: TransactionRowProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>
      case "failed":
        return <Badge variant="destructive">Thất bại</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="font-medium text-sm">{transaction.id}</div>
        <div className="text-xs text-gray-500">{transaction.campaign}</div>
      </td>
      <td className="py-3 px-4 text-sm">
        <div>{transaction.date}</div>
        <div className="text-xs text-gray-500">{transaction.time}</div>
      </td>
      <td className="py-3 px-4">
        <div className="font-medium text-sm">{transaction.amount}</div>
        <div className="text-xs text-green-600">+{transaction.commission}</div>
      </td>
      <td className="py-3 px-4">
        {getStatusBadge(transaction.status)}
      </td>
    </tr>
  )
}

export default function ReportsPage() {
  const stats: Array<{
    title: string;
    value: string;
    change: string;
    trend: "up" | "down";
    icon: React.ReactNode;
  }> = [
    {
      title: "Tổng doanh thu",
      value: "24,567,000₫",
      change: "+12.5%",
      trend: "up",
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      title: "Tổng click",
      value: "8,945",
      change: "+8.2%", 
      trend: "up",
      icon: <MousePointer className="h-4 w-4" />
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: "3.8%",
      change: "-0.5%",
      trend: "down", 
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      title: "Lượt view",
      value: "234,567",
      change: "+15.3%",
      trend: "up",
      icon: <Eye className="h-4 w-4" />
    }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Báo cáo & Thống kê</h1>
            <p className="text-muted-foreground">
              Theo dõi hiệu suất và phân tích dữ liệu chi tiết
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <CalendarDays className="h-4 w-4 mr-2" />
              Chọn thời gian
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              icon={stat.icon}
            />
          ))}
        </div>

        {/* Charts */}
        <Tabs defaultValue="performance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
            <TabsTrigger value="campaigns">Chiến dịch</TabsTrigger>
            <TabsTrigger value="comparison">So sánh</TabsTrigger>
            <TabsTrigger value="commission">Hoa hồng</TabsTrigger>
            <TabsTrigger value="payout" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Lịch thanh toán
            </TabsTrigger>
            <TabsTrigger value="filtering" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Lọc nâng cao
            </TabsTrigger>
            <TabsTrigger value="tax" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Báo cáo thuế
            </TabsTrigger>
            <TabsTrigger value="payout-settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Cài đặt thanh toán
            </TabsTrigger>
            <TabsTrigger value="payout-reports" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Báo cáo thanh toán
            </TabsTrigger>
            <TabsTrigger value="daterange">Phân tích theo thời gian</TabsTrigger>
            <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Xuất dữ liệu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu theo ngày</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${Number(value).toLocaleString('vi-VN')}₫`, 'Doanh thu']}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#2563eb" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Click & Chuyển đổi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="clicks" fill="#3b82f6" />
                        <Bar dataKey="conversions" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="campaigns">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu theo chiến dịch</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={campaignData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="revenue"
                        >
                          {campaignData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${Number(value).toLocaleString('vi-VN')}₫`, 'Doanh thu']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top chiến dịch</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaignData.map((campaign, index) => (
                      <div key={campaign.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                          <span className="font-medium">{campaign.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{campaign.revenue.toLocaleString('vi-VN')}₫</div>
                          <div className="text-xs text-gray-500">{campaign.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <PerformanceComparison />
          </TabsContent>

          <TabsContent value="commission">
            <CommissionReports />
          </TabsContent>

          <TabsContent value="payout">
            <PayoutSchedule />
          </TabsContent>

          <TabsContent value="filtering">
            <AdvancedFiltering />
          </TabsContent>

          <TabsContent value="tax">
            <TaxReports />
          </TabsContent>

          <TabsContent value="payout-settings">
            <MinimumPayoutSettings />
          </TabsContent>

          <TabsContent value="payout-reports">
            <PayoutReports />
          </TabsContent>

          <TabsContent value="daterange">
            <DateRangeAnalytics />
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Giao dịch gần đây</CardTitle>
                <div className="flex gap-2">
                  <Input placeholder="Tìm kiếm..." className="w-64" />
                  <Button variant="outline">Lọc</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Mã giao dịch</th>
                        <th className="text-left py-3 px-4 font-medium">Thời gian</th>
                        <th className="text-left py-3 px-4 font-medium">Số tiền</th>
                        <th className="text-left py-3 px-4 font-medium">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionData.map((transaction) => (
                        <TransactionRow key={transaction.id} transaction={transaction} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export">
            <DataExport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
