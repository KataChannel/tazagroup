"use client"

import { useTranslations } from 'next-intl'
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
    time: "16:20",
    amount: "45,000₫",
    commission: "4,500₫",
    status: "failed",
    type: "purchase"
  }
]

function TransactionRow({ transaction, t }: { transaction: any; t: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('reports.completed')
      case 'pending': return t('reports.pending')
      case 'failed': return t('reports.failed')
      default: return status
    }
  }

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4">
        <div>
          <div className="font-medium">{transaction.id}</div>
          <div className="text-xs text-gray-500">{transaction.campaign}</div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div>
          <div className="text-sm">{transaction.date}</div>
          <div className="text-xs text-gray-500">{transaction.time}</div>
        </div>
      </td>
      <td className="py-3 px-4">
        <div>
          <div className="font-medium">{transaction.amount}</div>
          <div className="text-xs text-green-600">{t('reports.commission')}: {transaction.commission}</div>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge className={getStatusColor(transaction.status)}>
          {getStatusText(transaction.status)}
        </Badge>
      </td>
    </tr>
  )
}

export default function ReportsPage() {
  const t = useTranslations()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('reports.title')}</h1>
            <p className="text-muted-foreground">
              {t('reports.subtitle')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <CalendarDays className="h-4 w-4 mr-2" />
              {t('reports.dateRange')}
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              {t('reports.exportReport')}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reports.totalRevenue')}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42,750,000₫</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% {t('dashboard.changeVsLastMonth')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reports.totalClicks')}</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9,850</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% {t('dashboard.changeVsLastMonth')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reports.conversions')}</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">378</div>
              <div className="flex items-center text-xs text-red-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.1% {t('dashboard.changeVsLastMonth')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('reports.conversionRate')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.84%</div>
              <div className="flex items-center text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.3% {t('dashboard.changeVsLastMonth')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('reports.performanceChart')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name={t('reports.revenue')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name={t('reports.clicks')}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('reports.campaignDistribution')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Reports Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
            <TabsTrigger value="overview" className="text-xs">
              <FileSpreadsheet className="h-3 w-3 mr-1" />
              {t('reports.overview')}
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs">
              <Receipt className="h-3 w-3 mr-1" />
              {t('reports.transactions')}
            </TabsTrigger>
            <TabsTrigger value="comparison" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              {t('reports.comparison')}
            </TabsTrigger>
            <TabsTrigger value="commission" className="text-xs">
              <DollarSign className="h-3 w-3 mr-1" />
              {t('reports.commission')}
            </TabsTrigger>
            <TabsTrigger value="payout" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {t('reports.payout')}
            </TabsTrigger>
            <TabsTrigger value="filtering" className="text-xs">
              <Filter className="h-3 w-3 mr-1" />
              {t('reports.filtering')}
            </TabsTrigger>
            <TabsTrigger value="tax" className="text-xs">
              <Receipt className="h-3 w-3 mr-1" />
              {t('reports.tax')}
            </TabsTrigger>
            <TabsTrigger value="payout-settings" className="text-xs">
              <Settings className="h-3 w-3 mr-1" />
              {t('reports.payoutSettings')}
            </TabsTrigger>
            <TabsTrigger value="payout-reports" className="text-xs">
              <CreditCard className="h-3 w-3 mr-1" />
              {t('reports.payoutReports')}
            </TabsTrigger>
            <TabsTrigger value="export" className="text-xs">
              <Download className="h-3 w-3 mr-1" />
              {t('common.export')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DateRangeAnalytics />
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
                <CardTitle>{t('reports.recentTransactions')}</CardTitle>
                <div className="flex gap-2">
                  <Input placeholder={t('common.search')} className="w-64" />
                  <Button variant="outline">{t('common.filter')}</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">{t('reports.transactionId')}</th>
                        <th className="text-left py-3 px-4 font-medium">{t('reports.time')}</th>
                        <th className="text-left py-3 px-4 font-medium">{t('reports.amount')}</th>
                        <th className="text-left py-3 px-4 font-medium">{t('reports.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionData.map((transaction) => (
                        <TransactionRow key={transaction.id} transaction={transaction} t={t} />
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
