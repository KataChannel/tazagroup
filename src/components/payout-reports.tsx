'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Download,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'

interface PayoutReport {
  id: string
  amount: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  method: string
  createdAt: string
  processedAt?: string
  description?: string
  fee: number
  netAmount: number
}

interface PayoutStats {
  totalPayouts: number
  totalAmount: number
  completedPayouts: number
  pendingPayouts: number
  failedPayouts: number
  thisMonthPayouts: number
  thisMonthAmount: number
}

export function PayoutReports() {
  const [reports, setReports] = useState<PayoutReport[]>([])
  const [stats, setStats] = useState<PayoutStats>({
    totalPayouts: 0,
    totalAmount: 0,
    completedPayouts: 0,
    pendingPayouts: 0,
    failedPayouts: 0,
    thisMonthPayouts: 0,
    thisMonthAmount: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateFilter, setDateFilter] = useState<string>('all')
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    loadPayoutReports()
  }, [])

  const loadPayoutReports = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/payout-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'get_history' })
      })

      if (!response.ok) {
        throw new Error('Failed to load payout reports')
      }

      const data = await response.json()
      
      // Transform the data to match our interface
      const transformedReports: PayoutReport[] = data.history.map((item: any) => ({
        id: item.id,
        amount: Math.abs(item.amount), // Convert negative amounts to positive for display
        status: item.status,
        method: item.method || 'BANK_TRANSFER',
        createdAt: item.createdAt,
        processedAt: item.paidAt, // Use paidAt as processedAt
        description: item.description,
        fee: Math.abs(item.amount) * 0.01, // Assume 1% fee for demo
        netAmount: Math.abs(item.amount) * 0.99
      }))

      setReports(transformedReports)

      // Calculate stats
      const newStats: PayoutStats = {
        totalPayouts: transformedReports.length,
        totalAmount: transformedReports.reduce((sum, report) => sum + report.amount, 0),
        completedPayouts: transformedReports.filter(r => r.status === 'COMPLETED').length,
        pendingPayouts: transformedReports.filter(r => r.status === 'PENDING').length,
        failedPayouts: transformedReports.filter(r => r.status === 'FAILED').length,
        thisMonthPayouts: transformedReports.filter(r => {
          const date = new Date(r.createdAt)
          const now = new Date()
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        }).length,
        thisMonthAmount: transformedReports
          .filter(r => {
            const date = new Date(r.createdAt)
            const now = new Date()
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
          })
          .reduce((sum, report) => sum + report.amount, 0)
      }

      setStats(newStats)
    } catch (error) {
      console.error('Error loading payout reports:', error)
      toast.error('Không thể tải báo cáo thanh toán')
    } finally {
      setLoading(false)
    }
  }

  const exportReports = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      setExporting(true)
      const response = await fetch('/api/reports/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'payout-reports',
          format,
          filters: {
            status: statusFilter,
            dateRange: dateFilter,
            search: searchTerm
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to export reports')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `payout-reports-${new Date().toISOString().split('T')[0]}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`Xuất báo cáo ${format.toUpperCase()} thành công`)
    } catch (error) {
      console.error('Error exporting reports:', error)
      toast.error('Không thể xuất báo cáo')
    } finally {
      setExporting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800">Đang chờ</Badge>
      case 'FAILED':
        return <Badge className="bg-red-100 text-red-800">Thất bại</Badge>
      case 'CANCELLED':
        return <Badge className="bg-gray-100 text-gray-800">Đã hủy</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter
    const matchesDate = dateFilter === 'all' || (() => {
      const reportDate = new Date(report.createdAt)
      const now = new Date()
      switch (dateFilter) {
        case 'today':
          return reportDate.toDateString() === now.toDateString()
        case 'this-week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return reportDate >= weekAgo
        case 'this-month':
          return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear()
        case 'this-year':
          return reportDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })()

    return matchesSearch && matchesStatus && matchesDate
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Đang tải báo cáo thanh toán...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Báo cáo thanh toán</h2>
          <p className="text-muted-foreground">Theo dõi và phân tích lịch sử thanh toán</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadPayoutReports}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button 
            variant="outline" 
            onClick={() => exportReports('csv')}
            disabled={exporting}
          >
            <Download className="h-4 w-4 mr-2" />
            {exporting ? 'Đang xuất...' : 'Xuất CSV'}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thanh toán</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPayouts}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.totalAmount)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoàn thành</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedPayouts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalPayouts > 0 ? Math.round((stats.completedPayouts / stats.totalPayouts) * 100) : 0}% thành công
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang chờ</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingPayouts}</div>
            <p className="text-xs text-muted-foreground">
              Cần xử lý
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tháng này</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.thisMonthPayouts}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(stats.thisMonthAmount)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Lọc báo cáo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Mã thanh toán, mô tả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trạng thái</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                  <SelectItem value="PENDING">Đang chờ</SelectItem>
                  <SelectItem value="FAILED">Thất bại</SelectItem>
                  <SelectItem value="CANCELLED">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Thời gian</label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="this-week">Tuần này</SelectItem>
                  <SelectItem value="this-month">Tháng này</SelectItem>
                  <SelectItem value="this-year">Năm này</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Xuất dữ liệu</label>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportReports('pdf')}
                  disabled={exporting}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  PDF
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => exportReports('excel')}
                  disabled={exporting}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Excel
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử thanh toán ({filteredReports.length} kết quả)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Mã thanh toán</th>
                  <th className="text-left py-3 px-4 font-medium">Ngày tạo</th>
                  <th className="text-left py-3 px-4 font-medium">Số tiền</th>
                  <th className="text-left py-3 px-4 font-medium">Phí</th>
                  <th className="text-left py-3 px-4 font-medium">Thực nhận</th>
                  <th className="text-left py-3 px-4 font-medium">Phương thức</th>
                  <th className="text-left py-3 px-4 font-medium">Trạng thái</th>
                  <th className="text-left py-3 px-4 font-medium">Xử lý</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{report.id}</td>
                    <td className="py-3 px-4">
                      {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 font-semibold">
                      {formatCurrency(report.amount)}
                    </td>
                    <td className="py-3 px-4 text-red-600">
                      -{formatCurrency(report.fee)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-green-600">
                      {formatCurrency(report.netAmount)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                        {report.method === 'BANK_TRANSFER' ? 'Chuyển khoản' : report.method}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(report.status)}
                    </td>
                    <td className="py-3 px-4">
                      {report.processedAt ? (
                        <span className="text-sm text-muted-foreground">
                          {new Date(report.processedAt).toLocaleDateString('vi-VN')}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredReports.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Không tìm thấy báo cáo thanh toán nào
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
