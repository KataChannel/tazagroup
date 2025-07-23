"use client"

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations()
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
      setError(t('payments.loadError'))
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
        setError(t('payments.invalidAmount'))
        return
      }

      if (balance && amount > balance.availableBalance) {
        setError(t('payments.insufficientBalance'))
        return
      }

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'WITHDRAWAL',
          amount,
          method: withdrawalForm.method,
          description: withdrawalForm.description
        })
      })

      if (response.ok) {
        setSuccess(t('payments.requestSubmitted'))
        setWithdrawalForm({ amount: '', method: 'BANK_TRANSFER', description: '' })
        fetchData() // Refresh data
      } else {
        const errorData = await response.json()
        setError(errorData.message || t('payments.requestFailed'))
      }
    } catch (err) {
      setError(t('payments.requestFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      COMPLETED: { color: 'bg-green-100 text-green-800', icon: Check, text: t('payments.completed') },
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: t('payments.pending') },
      FAILED: { color: 'bg-red-100 text-red-800', icon: X, text: t('payments.failed') },
      PROCESSING: { color: 'bg-blue-100 text-blue-800', icon: Clock, text: t('payments.processing') }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>{t('common.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">{t('payments.title')}</h1>
          <p className="text-muted-foreground">
            {t('payments.subtitle')}
          </p>
        </div>

        {/* Balance Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('payments.availableBalance')}</p>
                <p className="text-2xl font-bold">
                  {balance ? formatCurrency(balance.availableBalance) : '0₫'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('payments.totalEarnings')}</p>
                <p className="text-2xl font-bold">
                  {balance ? formatCurrency(balance.totalEarned) : '0₫'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('payments.totalPaid')}</p>
                <p className="text-2xl font-bold">
                  {balance ? formatCurrency(balance.totalPaid) : '0₫'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Withdrawal Form */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('payments.withdrawalRequest')}</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex">
                <Check className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleWithdrawal} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('payments.amount')}
                </label>
                <Input
                  type="number"
                  value={withdrawalForm.amount}
                  onChange={(e) => setWithdrawalForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0"
                  min="0"
                  step="1000"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t('payments.minimumAmount')}: 100,000₫
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('payments.paymentMethod')}
                </label>
                <select
                  value={withdrawalForm.method}
                  onChange={(e) => setWithdrawalForm(prev => ({ ...prev, method: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BANK_TRANSFER">{t('payments.bankTransfer')}</option>
                  <option value="E_WALLET">{t('payments.eWallet')}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('payments.description')} ({t('common.optional')})
              </label>
              <Input
                value={withdrawalForm.description}
                onChange={(e) => setWithdrawalForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('payments.descriptionPlaceholder')}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full md:w-auto"
            >
              {isSubmitting ? t('common.loading') : t('payments.withdraw')}
            </Button>
          </form>
        </Card>

        {/* Payment History */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('payments.paymentHistory')}</h2>
          
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">{t('payments.noTransactions')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">{t('payments.transactionId')}</th>
                    <th className="text-left py-3 px-4 font-medium">{t('payments.amount')}</th>
                    <th className="text-left py-3 px-4 font-medium">{t('payments.method')}</th>
                    <th className="text-left py-3 px-4 font-medium">{t('payments.date')}</th>
                    <th className="text-left py-3 px-4 font-medium">{t('payments.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-sm">{payment.id}</div>
                          {payment.description && (
                            <div className="text-xs text-gray-500">{payment.description}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                          {payment.method === 'BANK_TRANSFER' ? t('payments.bankTransfer') : t('payments.eWallet')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="text-sm">{formatDate(payment.createdAt)}</div>
                          {payment.paidAt && (
                            <div className="text-xs text-gray-500">
                              {t('payments.paidAt')}: {formatDate(payment.paidAt)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(payment.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Payment Methods */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('payments.paymentMethods')}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <CreditCard className="h-6 w-6 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium">{t('payments.bankTransfer')}</p>
                  <p className="text-sm text-gray-500">{t('payments.bankTransferDesc')}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                {t('payments.configure')}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
