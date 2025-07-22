"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  DollarSign, 
  CreditCard, 
  Calendar, 
  Check, 
  Clock, 
  X, 
  AlertCircle,
  Wallet,
  TrendingUp
} from 'lucide-react'

interface Payment {
  id: string
  amount: number
  currency: string
  method: string
  status: string
  description?: string
  createdAt: string
  paidAt?: string
}

interface BalanceData {
  totalEarned: number
  totalPaid: number
  availableBalance: number
}

export default function PaymentsPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [balance, setBalance] = useState<BalanceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [withdrawalForm, setWithdrawalForm] = useState({
    amount: '',
    method: 'BANK_TRANSFER',
    description: ''
  })

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      const [paymentsRes, balanceRes] = await Promise.all([
        fetch('/api/payments?limit=20'),
        fetch('/api/balance')
      ])

      if (paymentsRes.ok) {
        const paymentsData = await paymentsRes.json()
        setPayments(paymentsData.payments || [])
      }

      if (balanceRes.ok) {
        const balanceData = await balanceRes.json()
        setBalance(balanceData)
      }
    } catch (err) {
      setError('Không thể tải dữ liệu thanh toán')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const amount = parseFloat(withdrawalForm.amount)
      
      if (!amount || amount <= 0) {
        setError('Vui lòng nhập số tiền hợp lệ')
        return
      }

      if (balance && amount > balance.availableBalance) {
        setError('Số tiền vượt quá số dư khả dụng')
        return
      }

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          method: withdrawalForm.method,
          description: withdrawalForm.description || `Rút tiền ${formatCurrency(amount)}`
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Yêu cầu rút tiền đã được gửi thành công!')
        setWithdrawalForm({ amount: '', method: 'BANK_TRANSFER', description: '' })
        fetchData() // Refresh data
      } else {
        setError(data.error || 'Đã xảy ra lỗi khi tạo yêu cầu rút tiền')
      }
    } catch (err) {
      setError('Đã xảy ra lỗi kết nối')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Check className="w-4 h-4 text-green-600" />
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'PROCESSING':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'FAILED':
      case 'CANCELLED':
        return <X className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800'
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Đã thanh toán'
      case 'PENDING':
        return 'Đang chờ'
      case 'PROCESSING':
        return 'Đang xử lý'
      case 'FAILED':
        return 'Thất bại'
      case 'CANCELLED':
        return 'Đã hủy'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-gray-600 mt-1">Quản lý thu nhập và yêu cầu rút tiền</p>
        </div>
      </div>

      {/* Balance Overview */}
      {balance && (
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng thu nhập</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {formatCurrency(balance.totalEarned)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Số dư khả dụng</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  {formatCurrency(balance.availableBalance)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Đã thanh toán</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-600">
                  {formatCurrency(balance.totalPaid)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Withdrawal Form */}
        <Card className="lg:col-span-1 p-6">
          <h3 className="text-lg font-semibold mb-4">Yêu cầu rút tiền</h3>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              {success}
            </div>
          )}

          {balance && balance.availableBalance > 0 ? (
            <form onSubmit={handleWithdrawal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền rút
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    step="1000"
                    min="10000"
                    max={balance.availableBalance}
                    value={withdrawalForm.amount}
                    onChange={(e) => setWithdrawalForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="100000"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-sm text-gray-500">VND</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tối thiểu: 10,000 VND • Tối đa: {formatCurrency(balance.availableBalance)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <select
                  value={withdrawalForm.method}
                  onChange={(e) => setWithdrawalForm(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
                  <option value="MOMO">MoMo</option>
                  <option value="ZALOPAY">ZaloPay</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  value={withdrawalForm.description}
                  onChange={(e) => setWithdrawalForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Thêm ghi chú cho yêu cầu rút tiền..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">Chưa có số dư</h3>
              <p className="text-sm text-gray-600 mb-4">
                Bạn cần có thu nhập để thực hiện rút tiền
              </p>
              <Button variant="outline" className="w-full">
                Xem chiến dịch
              </Button>
            </div>
          )}
        </Card>

        {/* Payment History */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold mb-4">Lịch sử thanh toán</h3>
          
          {payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-gray-100 rounded-lg mt-1">
                      <CreditCard className="w-4 h-4 text-gray-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm sm:text-base truncate">
                          {payment.description || `Rút tiền ${formatCurrency(payment.amount)}`}
                        </h4>
                        {getStatusIcon(payment.status)}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <span>{payment.method.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{formatDate(payment.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 mt-3 sm:mt-0">
                    <div className="text-right">
                      <p className="font-semibold text-sm sm:text-base">
                        {formatCurrency(payment.amount)}
                      </p>
                      {payment.paidAt && (
                        <p className="text-xs text-gray-500">
                          Đã thanh toán: {formatDate(payment.paidAt)}
                        </p>
                      )}
                    </div>
                    
                    <Badge className={`text-xs ${getStatusColor(payment.status)}`}>
                      {getStatusText(payment.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">Chưa có giao dịch nào</h3>
              <p className="text-sm text-gray-600">
                Các yêu cầu rút tiền của bạn sẽ hiển thị ở đây
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
