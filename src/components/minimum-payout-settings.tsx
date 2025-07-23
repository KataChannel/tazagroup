'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Settings,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Save,
  RefreshCw,
  Wallet,
  CreditCard,
  TestTube
} from 'lucide-react'
import { toast } from 'sonner'

interface PayoutSettings {
  minimumPayout: number
  autoPayoutEnabled: boolean
  payoutThreshold: number
  holdPayouts: boolean
  preferredPayoutMethod: string
  payoutDay: number
  taxWithholding: number
  payoutCurrency: string
}

interface BalanceInfo {
  available: number
  pending: number
  total: number
}

interface PayoutTest {
  availableBalance: number
  minimumPayout: number
  payoutThreshold: number
  canPayout: boolean
  autoPayoutEligible: boolean
  holdPayouts: boolean
  nextAutoPayoutAmount: number
}

const MINIMUM_THRESHOLDS = [
  { value: 50000, label: '50,000 VND', recommended: false },
  { value: 100000, label: '100,000 VND', recommended: true },
  { value: 200000, label: '200,000 VND', recommended: false },
  { value: 500000, label: '500,000 VND', recommended: false },
  { value: 1000000, label: '1,000,000 VND', recommended: false },
  { value: 2000000, label: '2,000,000 VND', recommended: false },
  { value: 5000000, label: '5,000,000 VND', recommended: false }
]

const PAYOUT_METHODS = [
  { value: 'BANK_TRANSFER', label: 'Chuyển khoản ngân hàng', fees: '0 VND' },
  { value: 'MOMO', label: 'MoMo Wallet', fees: '2,000 VND' },
  { value: 'ZALOPAY', label: 'ZaloPay', fees: '1,500 VND' },
  { value: 'PAYPAL', label: 'PayPal', fees: '2.9% + 0.30 USD' }
]

export function MinimumPayoutSettings() {
  const [settings, setSettings] = useState<PayoutSettings>({
    minimumPayout: 100000,
    autoPayoutEnabled: false,
    payoutThreshold: 500000,
    holdPayouts: false,
    preferredPayoutMethod: 'BANK_TRANSFER',
    payoutDay: 1,
    taxWithholding: 0,
    payoutCurrency: 'VND'
  })

  const [balance, setBalance] = useState<BalanceInfo>({
    available: 0,
    pending: 0,
    total: 0
  })

  const [payoutTest, setPayoutTest] = useState<PayoutTest | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/payout-settings')
      
      if (!response.ok) {
        throw new Error('Không thể tải cài đặt thanh toán')
      }

      const data = await response.json()
      setSettings(data.settings)
      setBalance(data.balance)
    } catch (error) {
      console.error('Error loading payout settings:', error)
      toast.error('Không thể tải cài đặt thanh toán')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/payout-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Không thể lưu cài đặt')
      }

      const data = await response.json()
      setSettings(data.settings)
      toast.success('Cài đặt đã được lưu thành công')
    } catch (error) {
      console.error('Error saving payout settings:', error)
      toast.error(error instanceof Error ? error.message : 'Không thể lưu cài đặt')
    } finally {
      setSaving(false)
    }
  }

  const testSettings = async () => {
    try {
      setTesting(true)
      const response = await fetch('/api/payout-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'test_settings' })
      })

      if (!response.ok) {
        throw new Error('Không thể kiểm tra cài đặt')
      }

      const data = await response.json()
      setPayoutTest(data)
      toast.success('Kiểm tra cài đặt thành công')
    } catch (error) {
      console.error('Error testing payout settings:', error)
      toast.error('Không thể kiểm tra cài đặt')
    } finally {
      setTesting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getBalanceStatus = () => {
    if (balance.available >= settings.minimumPayout) {
      return {
        status: 'ready',
        message: 'Đủ điều kiện thanh toán',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: CheckCircle
      }
    } else if (balance.available >= settings.minimumPayout * 0.8) {
      return {
        status: 'near',
        message: 'Gần đạt mức tối thiểu',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: AlertTriangle
      }
    } else {
      return {
        status: 'below',
        message: 'Chưa đạt mức tối thiểu',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        icon: Info
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>Đang tải cài đặt...</span>
      </div>
    )
  }

  const balanceStatus = getBalanceStatus()
  const StatusIcon = balanceStatus.icon

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cài đặt thanh toán tối thiểu</h2>
          <p className="text-muted-foreground">Cấu hình tùy chọn thanh toán và ngưỡng tối thiểu</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={testSettings} disabled={testing}>
            <TestTube className="h-4 w-4 mr-2" />
            {testing ? 'Đang kiểm tra...' : 'Kiểm tra cài đặt'}
          </Button>
          <Button variant="outline" onClick={loadSettings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Làm mới
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </Button>
        </div>
      </div>

      {/* Current Balance Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Trạng thái số dư hiện tại
          </CardTitle>
          <CardDescription>
            Số dư hiện tại và điều kiện thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(balance.available)}
              </div>
              <div className="text-sm text-muted-foreground">Số dư khả dụng</div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(settings.minimumPayout)}
              </div>
              <div className="text-sm text-muted-foreground">Ngưỡng tối thiểu</div>
            </div>

            <div className={`text-center p-4 rounded-lg ${balanceStatus.bgColor}`}>
              <div className="flex items-center justify-center gap-2 mb-2">
                <StatusIcon className={`h-5 w-5 ${balanceStatus.color}`} />
                <span className={`font-medium ${balanceStatus.color}`}>
                  {balanceStatus.status.toUpperCase()}
                </span>
              </div>
              <div className={`text-sm ${balanceStatus.color}`}>{balanceStatus.message}</div>
            </div>
          </div>

          {balance.pending > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-900">Thanh toán đang chờ xử lý</span>
              </div>
              <p className="text-yellow-800">
                {formatCurrency(balance.pending)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {payoutTest && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Kết quả kiểm tra cài đặt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Có thể thanh toán:</span>
                  <Badge variant={payoutTest.canPayout ? "default" : "secondary"}>
                    {payoutTest.canPayout ? 'Có' : 'Không'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Đủ điều kiện tự động:</span>
                  <Badge variant={payoutTest.autoPayoutEligible ? "default" : "secondary"}>
                    {payoutTest.autoPayoutEligible ? 'Có' : 'Không'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Tạm dừng thanh toán:</span>
                  <Badge variant={payoutTest.holdPayouts ? "destructive" : "default"}>
                    {payoutTest.holdPayouts ? 'Có' : 'Không'}
                  </Badge>
                </div>
                {payoutTest.nextAutoPayoutAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span>Số tiền thanh toán tiếp theo:</span>
                    <span className="font-medium">{formatCurrency(payoutTest.nextAutoPayoutAmount)}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Minimum Amount Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Số tiền thanh toán tối thiểu</CardTitle>
            <CardDescription>
              Đặt số dư tối thiểu cần thiết trước khi thanh toán tự động
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Số tiền đề xuất</Label>
                <div className="grid gap-2">
                  {MINIMUM_THRESHOLDS.map(threshold => (
                    <button
                      key={threshold.value}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        settings.minimumPayout === threshold.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSettings(prev => ({ ...prev, minimumPayout: threshold.value }))}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{threshold.label}</span>
                        <div className="flex gap-2">
                          {threshold.recommended && (
                            <Badge variant="secondary" className="text-xs">
                              Khuyên dùng
                            </Badge>
                          )}
                          {settings.minimumPayout === threshold.value && (
                            <CheckCircle className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Số tiền tùy chỉnh (VND)</Label>
                <Input
                  type="number"
                  min="50000"
                  step="10000"
                  value={settings.minimumPayout}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    minimumPayout: parseInt(e.target.value) || 50000 
                  }))}
                  placeholder="Nhập số tiền tùy chỉnh"
                />
                <p className="text-xs text-muted-foreground">
                  Tối thiểu: 50,000 VND
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Auto Payout Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt thanh toán tự động</CardTitle>
            <CardDescription>
              Cấu hình thanh toán tự động và ngưỡng kích hoạt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Ngưỡng thanh toán tự động (VND)</Label>
                <Input
                  type="number"
                  min={settings.minimumPayout}
                  step="10000"
                  value={settings.payoutThreshold}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    payoutThreshold: parseInt(e.target.value) || settings.minimumPayout 
                  }))}
                  placeholder="Ngưỡng thanh toán tự động"
                />
                <p className="text-xs text-muted-foreground">
                  Phải lớn hơn hoặc bằng số tiền tối thiểu
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Bật thanh toán tự động</Label>
                  <p className="text-sm text-muted-foreground">
                    Tự động xử lý thanh toán khi đạt ngưỡng
                  </p>
                </div>
                <Switch
                  checked={settings.autoPayoutEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ 
                    ...prev, 
                    autoPayoutEnabled: checked 
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tạm dừng thanh toán</Label>
                  <p className="text-sm text-muted-foreground">
                    Tạm dừng tất cả thanh toán
                  </p>
                </div>
                <Switch
                  checked={settings.holdPayouts}
                  onCheckedChange={(checked) => setSettings(prev => ({ 
                    ...prev, 
                    holdPayouts: checked 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Ngày thanh toán trong tháng</Label>
                <Select
                  value={settings.payoutDay.toString()}
                  onValueChange={(value) => setSettings(prev => ({ 
                    ...prev, 
                    payoutDay: parseInt(value) 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                      <SelectItem key={day} value={day.toString()}>
                        Ngày {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method & Tax Settings */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Phương thức thanh toán</CardTitle>
            <CardDescription>
              Chọn phương thức thanh toán ưa thích
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Phương thức</Label>
              <Select
                value={settings.preferredPayoutMethod}
                onValueChange={(value) => setSettings(prev => ({ 
                  ...prev, 
                  preferredPayoutMethod: value 
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYOUT_METHODS.map(method => (
                    <SelectItem key={method.value} value={method.value}>
                      <div className="flex flex-col">
                        <span>{method.label}</span>
                        <span className="text-xs text-muted-foreground">Phí: {method.fees}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cài đặt thuế</CardTitle>
            <CardDescription>
              Cấu hình khấu trừ thuế tự động
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tỷ lệ khấu trừ thuế (%)</Label>
              <Input
                type="number"
                min="0"
                max="50"
                step="0.1"
                value={settings.taxWithholding}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  taxWithholding: parseFloat(e.target.value) || 0 
                }))}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Từ 0% đến 50%. Để trống hoặc 0 nếu không áp dụng
              </p>
            </div>

            <div className="space-y-2">
              <Label>Đơn vị tiền tệ</Label>
              <Select
                value={settings.payoutCurrency}
                onValueChange={(value) => setSettings(prev => ({ 
                  ...prev, 
                  payoutCurrency: value 
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VND">Việt Nam Đồng (VND)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
