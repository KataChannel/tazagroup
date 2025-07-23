'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar, Clock, DollarSign, Settings, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface PayoutSchedule {
  id?: string
  frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY'
  dayOfMonth?: number
  dayOfWeek?: number
  minimumAmount: number
  isActive: boolean
  nextPayoutDate?: string
  lastPayoutDate?: string
  payouts?: ScheduledPayout[]
}

interface ScheduledPayout {
  id: string
  amount: number
  currency: string
  status: string
  scheduledDate: string
  processedDate?: string
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
]

const FREQUENCY_DESCRIPTIONS = {
  WEEKLY: 'Payments are processed every week on the selected day',
  MONTHLY: 'Payments are processed monthly on the selected date',
  QUARTERLY: 'Payments are processed every 3 months on the 1st day'
}

export function PayoutSchedule() {
  const [schedule, setSchedule] = useState<PayoutSchedule>({
    frequency: 'MONTHLY',
    dayOfMonth: 1,
    minimumAmount: 100000,
    isActive: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      const response = await fetch('/api/payout-schedule')
      if (response.ok) {
        const data = await response.json()
        setSchedule(data.schedule)
      }
    } catch (error) {
      console.error('Error fetching schedule:', error)
      console.error('Failed to load payout schedule')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/payout-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(schedule)
      })

      if (response.ok) {
        const data = await response.json()
        setSchedule(data.schedule)
        console.log('Payout schedule updated successfully')
      } else {
        const error = await response.json()
        console.error(error.error || 'Failed to update schedule')
      }
    } catch (error) {
      console.error('Error saving schedule:', error)
      console.error('Failed to save payout schedule')
    } finally {
      setSaving(false)
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Pending' },
      PROCESSING: { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Processing' },
      COMPLETED: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Completed' },
      FAILED: { color: 'bg-red-100 text-red-800', icon: XCircle, label: 'Failed' },
      CANCELLED: { color: 'bg-gray-100 text-gray-800', icon: XCircle, label: 'Cancelled' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-96 bg-gray-200 rounded animate-pulse" />
          <div className="h-96 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payout Schedule</h2>
          <p className="text-muted-foreground">Configure automatic payment schedules</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Settings className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Schedule Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule Configuration
            </CardTitle>
            <CardDescription>
              Set up your automatic payout preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Active Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium leading-none">Enable Automatic Payouts</label>
                <p className="text-sm text-muted-foreground">
                  Turn on to receive automatic scheduled payments
                </p>
              </div>
              <button
                type="button"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  schedule.isActive ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                onClick={() => setSchedule(prev => ({ ...prev, isActive: !prev.isActive }))}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out ${
                    schedule.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <Separator />

            {/* Frequency Selection */}
            <div className="space-y-2">
              <label htmlFor="frequency" className="text-sm font-medium leading-none">Payment Frequency</label>
              <Select
                value={schedule.frequency}
                onValueChange={(value: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY') => 
                  setSchedule(prev => ({ ...prev, frequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {FREQUENCY_DESCRIPTIONS[schedule.frequency]}
              </p>
            </div>

            {/* Day Selection */}
            {schedule.frequency === 'WEEKLY' && (
              <div className="space-y-2">
                <label htmlFor="dayOfWeek" className="text-sm font-medium leading-none">Day of Week</label>
                <Select
                  value={schedule.dayOfWeek?.toString()}
                  onValueChange={(value) => setSchedule(prev => ({ ...prev, dayOfWeek: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map(day => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {schedule.frequency === 'MONTHLY' && (
              <div className="space-y-2">
                <label htmlFor="dayOfMonth" className="text-sm font-medium leading-none">Day of Month</label>
                <Input
                  id="dayOfMonth"
                  type="number"
                  min="1"
                  max="31"
                  value={schedule.dayOfMonth || ''}
                  onChange={(e) => setSchedule(prev => ({ 
                    ...prev, 
                    dayOfMonth: parseInt(e.target.value) || 1 
                  }))}
                  placeholder="1-31"
                />
                <p className="text-sm text-muted-foreground">
                  If the day doesn't exist in a month, the last day will be used
                </p>
              </div>
            )}

            {/* Minimum Amount */}
            <div className="space-y-2">
              <label htmlFor="minimumAmount" className="text-sm font-medium leading-none">Minimum Payout Amount (VND)</label>
              <Input
                id="minimumAmount"
                type="number"
                min="50000"
                step="10000"
                value={schedule.minimumAmount}
                onChange={(e) => setSchedule(prev => ({ 
                  ...prev, 
                  minimumAmount: parseInt(e.target.value) || 50000 
                }))}
                placeholder="100,000"
              />
              <p className="text-sm text-muted-foreground">
                Minimum balance required to trigger automatic payout
              </p>
            </div>

            {/* Next Payout Info */}
            {schedule.isActive && schedule.nextPayoutDate && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">Next Payout</span>
                </div>
                <p className="text-blue-800">
                  {formatDate(schedule.nextPayoutDate)}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Minimum amount: {formatCurrency(schedule.minimumAmount)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payouts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Recent Scheduled Payouts
            </CardTitle>
            <CardDescription>
              History of your scheduled automatic payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {schedule.payouts && schedule.payouts.length > 0 ? (
              <div className="space-y-4">
                {schedule.payouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{formatCurrency(payout.amount)}</span>
                        {getStatusBadge(payout.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Scheduled: {formatDate(payout.scheduledDate)}
                      </p>
                      {payout.processedDate && (
                        <p className="text-sm text-muted-foreground">
                          Processed: {formatDate(payout.processedDate)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Payouts</h3>
                <p className="text-gray-500">
                  Enable automatic payouts to see scheduled payments here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="text-2xl font-bold">
                  {schedule.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
              <div className={`p-2 rounded-full ${schedule.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                {schedule.isActive ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <XCircle className="h-6 w-6 text-gray-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Frequency</p>
                <p className="text-2xl font-bold capitalize">
                  {schedule.frequency.toLowerCase()}
                </p>
              </div>
              <div className="p-2 rounded-full bg-blue-100">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Minimum Amount</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(schedule.minimumAmount)}
                </p>
              </div>
              <div className="p-2 rounded-full bg-purple-100">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
