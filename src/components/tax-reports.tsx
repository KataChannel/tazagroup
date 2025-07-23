'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  FileText,
  Download,
  Calendar,
  DollarSign,
  Calculator,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Building,
  User
} from 'lucide-react'

interface TaxReport {
  id: string
  year: number
  quarter?: number
  totalIncome: number
  totalCommission: number
  taxableIncome: number
  taxAmount: number
  taxRate: number
  status: 'draft' | 'submitted' | 'approved'
  createdAt: string
  submittedAt?: string
  dueDate: string
}

interface TaxSummary {
  currentYear: number
  totalIncome: number
  totalTax: number
  quarterlyBreakdown: Array<{
    quarter: number
    income: number
    tax: number
    status: string
  }>
  deductions: Array<{
    type: string
    amount: number
    description: string
  }>
}

const TAX_RATES = {
  PERSONAL: [
    { min: 0, max: 5000000, rate: 5, description: 'Thu nhập <= 5 triệu VND' },
    { min: 5000000, max: 10000000, rate: 10, description: '5 - 10 triệu VND' },
    { min: 10000000, max: 18000000, rate: 15, description: '10 - 18 triệu VND' },
    { min: 18000000, max: 32000000, rate: 20, description: '18 - 32 triệu VND' },
    { min: 32000000, max: 52000000, rate: 25, description: '32 - 52 triệu VND' },
    { min: 52000000, max: 80000000, rate: 30, description: '52 - 80 triệu VND' },
    { min: 80000000, max: Infinity, rate: 35, description: 'Trên 80 triệu VND' }
  ],
  BUSINESS: [
    { min: 0, max: Infinity, rate: 20, description: 'Thuế thu nhập doanh nghiệp' }
  ]
}

const DEDUCTION_TYPES = [
  { value: 'self', label: 'Giảm trừ bản thân', amount: 11000000 },
  { value: 'dependent', label: 'Giảm trừ người phụ thuộc', amount: 4400000 },
  { value: 'insurance', label: 'Bảo hiểm xã hội', amount: 0 },
  { value: 'charity', label: 'Từ thiện', amount: 0 },
  { value: 'education', label: 'Học tập', amount: 0 }
]

export function TaxReports() {
  const [reports, setReports] = useState<TaxReport[]>([])
  const [summary, setSummary] = useState<TaxSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [taxType, setTaxType] = useState<'PERSONAL' | 'BUSINESS'>('PERSONAL')
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchTaxData()
  }, [selectedYear])

  const fetchTaxData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reports/tax?year=${selectedYear}`)
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports || [])
        setSummary(data.summary || null)
      }
    } catch (error) {
      console.error('Error fetching tax data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateTaxReport = async (quarter?: number) => {
    setGenerating(true)
    try {
      const response = await fetch('/api/reports/tax/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          year: selectedYear,
          quarter,
          taxType
        })
      })

      if (response.ok) {
        const data = await response.json()
        setReports(prev => [...prev, data.report])
        console.log('Tax report generated successfully')
        await fetchTaxData() // Refresh data
      } else {
        console.error('Failed to generate tax report')
      }
    } catch (error) {
      console.error('Error generating tax report:', error)
    } finally {
      setGenerating(false)
    }
  }

  const downloadReport = async (reportId: string) => {
    try {
      const response = await fetch(`/api/reports/tax/${reportId}/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `tax-report-${reportId}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading report:', error)
    }
  }

  const calculateTax = (income: number, deductions: number = 11000000) => {
    const taxableIncome = Math.max(0, income - deductions)
    const rates = TAX_RATES[taxType]
    let tax = 0

    if (taxType === 'BUSINESS') {
      tax = taxableIncome * 0.2
    } else {
      let remainingIncome = taxableIncome
      for (const bracket of rates) {
        if (remainingIncome <= 0) break
        
        const taxableAtThisBracket = Math.min(remainingIncome, bracket.max - bracket.min)
        tax += taxableAtThisBracket * (bracket.rate / 100)
        remainingIncome -= taxableAtThisBracket
      }
    }

    return {
      taxableIncome,
      taxAmount: tax,
      effectiveRate: income > 0 ? (tax / income) * 100 : 0
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Nháp' },
      submitted: { color: 'bg-blue-100 text-blue-800', icon: AlertCircle, label: 'Đã nộp' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Đã duyệt' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
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
          <h2 className="text-2xl font-bold">Tax Reports</h2>
          <p className="text-muted-foreground">Generate and manage your tax documentation</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2024, 2025, 2026].map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => generateTaxReport()} disabled={generating}>
            <Receipt className="h-4 w-4 mr-2" />
            {generating ? 'Generating...' : 'Generate Report'}
          </Button>
        </div>
      </div>

      {/* Tax Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Tax Type Configuration
          </CardTitle>
          <CardDescription>
            Select your tax filing type to calculate accurate tax amounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <button
              className={`flex items-center gap-2 p-4 border rounded-lg transition-colors ${
                taxType === 'PERSONAL' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setTaxType('PERSONAL')}
            >
              <User className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Personal Income Tax</div>
                <div className="text-sm text-muted-foreground">Individual tax filing</div>
              </div>
            </button>
            <button
              className={`flex items-center gap-2 p-4 border rounded-lg transition-colors ${
                taxType === 'BUSINESS' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setTaxType('BUSINESS')}
            >
              <Building className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Business Income Tax</div>
                <div className="text-sm text-muted-foreground">Corporate tax filing</div>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Tax Summary */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Income</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(summary.totalIncome)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-green-100">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tax Owed</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(summary.totalTax)}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-red-100">
                  <Receipt className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Effective Rate</p>
                  <p className="text-2xl font-bold">
                    {summary.totalIncome > 0 ? ((summary.totalTax / summary.totalIncome) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="p-2 rounded-full bg-blue-100">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Reports Filed</p>
                  <p className="text-2xl font-bold">
                    {reports.filter(r => r.status !== 'draft').length}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-purple-100">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tax Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Tax Calculator
            </CardTitle>
            <CardDescription>
              Calculate your tax liability based on current rates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="text-sm font-medium">Annual Income (VND)</label>
              <Input
                type="number"
                placeholder="Enter your annual income"
                onChange={(e) => {
                  const income = parseFloat(e.target.value) || 0
                  const result = calculateTax(income)
                  // Update UI with calculation results
                }}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Deductions</label>
              <div className="space-y-2">
                {DEDUCTION_TYPES.map(deduction => (
                  <div key={deduction.value} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{deduction.label}</span>
                    <span className="text-sm font-medium">
                      {deduction.amount > 0 ? formatCurrency(deduction.amount) : 'Variable'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium">Tax Brackets ({taxType === 'PERSONAL' ? 'Personal' : 'Business'})</h4>
              <div className="space-y-1">
                {TAX_RATES[taxType].map((bracket, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{bracket.description}</span>
                    <span className="font-medium">{bracket.rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tax Reports ({selectedYear})
            </CardTitle>
            <CardDescription>
              Your generated tax reports for the selected year
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {report.quarter ? `Q${report.quarter} ${report.year}` : `Annual ${report.year}`}
                        </span>
                        {getStatusBadge(report.status)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Income: {formatCurrency(report.totalIncome)} • 
                        Tax: {formatCurrency(report.taxAmount)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Due: {new Date(report.dueDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(report.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Tax Reports</h3>
                <p className="text-gray-500 mb-4">
                  Generate your first tax report to get started
                </p>
                <Button onClick={() => generateTaxReport()}>
                  <Receipt className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quarterly Breakdown */}
      {summary?.quarterlyBreakdown && summary.quarterlyBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Breakdown ({selectedYear})</CardTitle>
            <CardDescription>
              Tax liability by quarter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {summary.quarterlyBreakdown.map((quarter) => (
                <div key={quarter.quarter} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Q{quarter.quarter}</h4>
                    {getStatusBadge(quarter.status)}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                      Income: {formatCurrency(quarter.income)}
                    </div>
                    <div className="text-sm font-medium">
                      Tax: {formatCurrency(quarter.tax)}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => generateTaxReport(quarter.quarter)}
                    disabled={generating}
                  >
                    Generate Q{quarter.quarter} Report
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
