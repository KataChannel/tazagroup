'use client'

import { useState, useEffect } from 'react'
import { Calendar as CalendarIcon, ChevronDown, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export interface DateRange {
  from: Date
  to: Date
  label?: string
}

interface DateRangePickerProps {
  startDate?: string
  endDate?: string
  onDateChange?: (start: string, end: string) => void
  value?: DateRange
  onChange?: (dateRange: DateRange) => void
  className?: string
}

const presetRanges = [
  { label: 'Hôm nay', value: 'today', days: 0 },
  { label: 'Hôm qua', value: 'yesterday', days: 1 },
  { label: '7 ngày qua', value: 'last7days', days: 7 },
  { label: '14 ngày qua', value: 'last14days', days: 14 },
  { label: '30 ngày qua', value: 'last30days', days: 30 },
  { label: '60 ngày qua', value: 'last60days', days: 60 },
  { label: '90 ngày qua', value: 'last90days', days: 90 },
  { label: 'Tuần này', value: 'thisweek', days: -1 },
  { label: 'Tuần trước', value: 'lastweek', days: -2 },
  { label: 'Tháng này', value: 'thismonth', days: -3 },
  { label: 'Tháng trước', value: 'lastmonth', days: -4 },
  { label: '3 tháng qua', value: 'last3months', days: 90 },
  { label: '6 tháng qua', value: 'last6months', days: 180 },
  { label: '1 năm qua', value: 'last1year', days: 365 }
]

export default function DateRangePicker({ 
  startDate,
  endDate,
  onDateChange,
  value,
  onChange,
  className = '' 
}: DateRangePickerProps) {
  const [selectedPreset, setSelectedPreset] = useState('last30days')
  const [currentRange, setCurrentRange] = useState<DateRange>()

  const getPresetDateRange = (preset: string): DateRange => {
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    switch (preset) {
      case 'today':
        return { from: todayStart, to: todayStart, label: 'Hôm nay' }
      case 'yesterday': {
        const yesterday = new Date(todayStart)
        yesterday.setDate(yesterday.getDate() - 1)
        return { from: yesterday, to: yesterday, label: 'Hôm qua' }
      }
      case 'last7days': {
        const start = new Date(todayStart)
        start.setDate(start.getDate() - 6)
        return { from: start, to: todayStart, label: '7 ngày qua' }
      }
      case 'last14days': {
        const start = new Date(todayStart)
        start.setDate(start.getDate() - 13)
        return { from: start, to: todayStart, label: '14 ngày qua' }
      }
      case 'last30days': {
        const start = new Date(todayStart)
        start.setDate(start.getDate() - 29)
        return { from: start, to: todayStart, label: '30 ngày qua' }
      }
      case 'last60days': {
        const start = new Date(todayStart)
        start.setDate(start.getDate() - 59)
        return { from: start, to: todayStart, label: '60 ngày qua' }
      }
      case 'last90days': {
        const start = new Date(todayStart)
        start.setDate(start.getDate() - 89)
        return { from: start, to: todayStart, label: '90 ngày qua' }
      }
      case 'thisweek': {
        const start = new Date(todayStart)
        const day = start.getDay()
        const diff = start.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
        start.setDate(diff)
        return { from: start, to: todayStart, label: 'Tuần này' }
      }
      case 'lastweek': {
        const start = new Date(todayStart)
        const day = start.getDay()
        const diff = start.getDate() - day + (day === 0 ? -6 : 1)
        start.setDate(diff - 7)
        const end = new Date(start)
        end.setDate(end.getDate() + 6)
        return { from: start, to: end, label: 'Tuần trước' }
      }
      case 'thismonth': {
        const start = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1)
        return { from: start, to: todayStart, label: 'Tháng này' }
      }
      case 'lastmonth': {
        const start = new Date(todayStart.getFullYear(), todayStart.getMonth() - 1, 1)
        const end = new Date(todayStart.getFullYear(), todayStart.getMonth(), 0)
        return { from: start, to: end, label: 'Tháng trước' }
      }
      case 'last3months': {
        const start = new Date(todayStart)
        start.setDate(start.getDate() - 89)
        return { from: start, to: todayStart, label: '3 tháng qua' }
      }
      case 'last6months': {
        const start = new Date(todayStart)
        start.setDate(start.getDate() - 179)
        return { from: start, to: todayStart, label: '6 tháng qua' }
      }
      case 'last1year': {
        const start = new Date(todayStart)
        start.setDate(start.getDate() - 364)
        return { from: start, to: todayStart, label: '1 năm qua' }
      }
      default:
        const defaultStart = new Date(todayStart)
        defaultStart.setDate(defaultStart.getDate() - 29)
        return { from: defaultStart, to: todayStart, label: '30 ngày qua' }
    }
  }

  const handlePresetChange = (preset: string) => {
    setSelectedPreset(preset)
    const newRange = getPresetDateRange(preset)
    setCurrentRange(newRange)
    
    // Support both callback patterns
    if (onChange) {
      onChange(newRange)
    }
    if (onDateChange) {
      onDateChange(
        newRange.from.toISOString().split('T')[0],
        newRange.to.toISOString().split('T')[0]
      )
    }
  }

  const handleCustomDateChange = (type: 'start' | 'end', dateString: string) => {
    const newDate = new Date(dateString)
    const current = currentRange || getPresetDateRange('last30days')
    
    const newRange = type === 'start' 
      ? { ...current, from: newDate }
      : { ...current, to: newDate }
    
    setCurrentRange(newRange)
    setSelectedPreset('custom')
    
    if (onChange) {
      onChange(newRange)
    }
    if (onDateChange) {
      onDateChange(
        newRange.from.toISOString().split('T')[0],
        newRange.to.toISOString().split('T')[0]
      )
    }
  }

  const formatDateRange = (range: DateRange) => {
    const formatDate = (date: Date) => {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }

    if (range.from.getTime() === range.to.getTime()) {
      return formatDate(range.from)
    }
    return `${formatDate(range.from)} - ${formatDate(range.to)}`
  }

  const getDaysDifference = (range: DateRange) => {
    const diffTime = Math.abs(range.to.getTime() - range.from.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  // Initialize current range
  useEffect(() => {
    if (value) {
      setCurrentRange(value)
    } else if (startDate && endDate) {
      setCurrentRange({
        from: new Date(startDate),
        to: new Date(endDate)
      })
    } else {
      const defaultRange = getPresetDateRange('last30days')
      setCurrentRange(defaultRange)
    }
  }, [value, startDate, endDate])

  const displayRange = currentRange || getPresetDateRange('last30days')

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          {/* Preset Selector */}
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {presetRanges.map((preset) => (
                  <SelectItem key={preset.value} value={preset.value}>
                    {preset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Inputs */}
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">
                  Từ
                </label>
                <input
                  type="date"
                  value={displayRange.from.toISOString().split('T')[0]}
                  onChange={(e) => handleCustomDateChange('start', e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-600 mb-1">
                  Đến
                </label>
                <input
                  type="date"
                  value={displayRange.to.toISOString().split('T')[0]}
                  onChange={(e) => handleCustomDateChange('end', e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Range Display & Stats */}
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled className="cursor-default">
              {formatDateRange(displayRange)}
            </Button>
            <Badge variant="secondary" className="text-xs">
              {getDaysDifference(displayRange)} ngày
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
