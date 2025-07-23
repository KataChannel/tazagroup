'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  Search,
  X,
  Plus,
  Download,
  RefreshCw
} from 'lucide-react'

interface FilterCriteria {
  id: string
  field: string
  operator: string
  value: string
  label: string
}

interface FilterOptions {
  campaigns: Array<{ id: string; name: string }>
  statuses: Array<{ value: string; label: string }>
  paymentMethods: Array<{ value: string; label: string }>
  dateRanges: Array<{ value: string; label: string }>
}

const FILTER_FIELDS = [
  { value: 'campaign', label: 'Campaign' },
  { value: 'status', label: 'Status' },
  { value: 'amount', label: 'Amount' },
  { value: 'commission', label: 'Commission' },
  { value: 'date', label: 'Date' },
  { value: 'paymentMethod', label: 'Payment Method' },
  { value: 'country', label: 'Country' },
  { value: 'device', label: 'Device' },
  { value: 'browser', label: 'Browser' }
]

const OPERATORS = {
  text: [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' }
  ],
  number: [
    { value: 'equals', label: 'Equals' },
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'lessThan', label: 'Less than' },
    { value: 'between', label: 'Between' }
  ],
  date: [
    { value: 'equals', label: 'On date' },
    { value: 'after', label: 'After' },
    { value: 'before', label: 'Before' },
    { value: 'between', label: 'Between' },
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'thisMonth', label: 'This month' },
    { value: 'lastMonth', label: 'Last month' }
  ],
  select: [
    { value: 'equals', label: 'Is' },
    { value: 'in', label: 'Is one of' },
    { value: 'notIn', label: 'Is not one of' }
  ]
}

const FIELD_TYPES = {
  campaign: 'select',
  status: 'select',
  amount: 'number',
  commission: 'number',
  date: 'date',
  paymentMethod: 'select',
  country: 'text',
  device: 'text',
  browser: 'text'
}

export function AdvancedFiltering() {
  const [filters, setFilters] = useState<FilterCriteria[]>([])
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    campaigns: [],
    statuses: [
      { value: 'completed', label: 'Completed' },
      { value: 'pending', label: 'Pending' },
      { value: 'failed', label: 'Failed' },
      { value: 'cancelled', label: 'Cancelled' }
    ],
    paymentMethods: [
      { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
      { value: 'PAYPAL', label: 'PayPal' },
      { value: 'MOMO', label: 'MoMo' },
      { value: 'ZALOPAY', label: 'ZaloPay' }
    ],
    dateRanges: [
      { value: 'today', label: 'Today' },
      { value: 'yesterday', label: 'Yesterday' },
      { value: 'last7days', label: 'Last 7 days' },
      { value: 'last30days', label: 'Last 30 days' },
      { value: 'thisMonth', label: 'This month' },
      { value: 'lastMonth', label: 'Last month' },
      { value: 'custom', label: 'Custom range' }
    ]
  })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [totalResults, setTotalResults] = useState(0)

  useEffect(() => {
    loadFilterOptions()
  }, [])

  const loadFilterOptions = async () => {
    try {
      // Load campaigns for filter options
      const campaignsResponse = await fetch('/api/campaigns')
      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json()
        setFilterOptions(prev => ({
          ...prev,
          campaigns: campaignsData.campaigns?.map((c: any) => ({
            id: c.id,
            name: c.name
          })) || []
        }))
      }
    } catch (error) {
      console.error('Error loading filter options:', error)
    }
  }

  const addFilter = () => {
    const newFilter: FilterCriteria = {
      id: Date.now().toString(),
      field: 'campaign',
      operator: 'equals',
      value: '',
      label: ''
    }
    setFilters([...filters, newFilter])
  }

  const removeFilter = (filterId: string) => {
    setFilters(filters.filter(f => f.id !== filterId))
  }

  const updateFilter = (filterId: string, updates: Partial<FilterCriteria>) => {
    setFilters(filters.map(f => 
      f.id === filterId 
        ? { ...f, ...updates, label: generateFilterLabel({ ...f, ...updates }) }
        : f
    ))
  }

  const generateFilterLabel = (filter: FilterCriteria) => {
    const field = FILTER_FIELDS.find(f => f.value === filter.field)?.label || filter.field
    const operator = getOperatorsForField(filter.field).find(o => o.value === filter.operator)?.label || filter.operator
    return `${field} ${operator} ${filter.value}`
  }

  const getOperatorsForField = (field: string) => {
    const fieldType = FIELD_TYPES[field as keyof typeof FIELD_TYPES] || 'text'
    return OPERATORS[fieldType as keyof typeof OPERATORS] || OPERATORS.text
  }

  const getFieldOptions = (field: string) => {
    switch (field) {
      case 'campaign':
        return filterOptions.campaigns.map(c => ({ value: c.id, label: c.name }))
      case 'status':
        return filterOptions.statuses
      case 'paymentMethod':
        return filterOptions.paymentMethods
      default:
        return []
    }
  }

  const applyFilters = async () => {
    setLoading(true)
    try {
      const filterQuery = {
        filters: filters.map(f => ({
          field: f.field,
          operator: f.operator,
          value: f.value
        }))
      }

      const response = await fetch('/api/reports/filtered', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filterQuery)
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
        setTotalResults(data.total || 0)
      } else {
        console.error('Failed to apply filters')
      }
    } catch (error) {
      console.error('Error applying filters:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearAllFilters = () => {
    setFilters([])
    setResults([])
    setTotalResults(0)
  }

  const exportResults = async () => {
    try {
      const filterQuery = {
        filters: filters.map(f => ({
          field: f.field,
          operator: f.operator,
          value: f.value
        })),
        export: true
      }

      const response = await fetch('/api/reports/filtered', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filterQuery)
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `filtered-report-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting results:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Filtering</h2>
          <p className="text-muted-foreground">Create complex filters to analyze your data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearAllFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={addFilter}>
            <Plus className="h-4 w-4 mr-2" />
            Add Filter
          </Button>
        </div>
      </div>

      {/* Filter Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter Criteria
          </CardTitle>
          <CardDescription>
            Build custom filters to refine your data analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {filters.length === 0 ? (
            <div className="text-center py-8">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Filters Applied</h3>
              <p className="text-gray-500 mb-4">
                Add filters to analyze your data with specific criteria
              </p>
              <Button onClick={addFilter}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Filter
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filters.map((filter, index) => (
                <div key={filter.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  {index > 0 && (
                    <Badge variant="secondary" className="px-2 py-1">
                      AND
                    </Badge>
                  )}
                  
                  {/* Field Selection */}
                  <div className="flex-1">
                    <Select
                      value={filter.field}
                      onValueChange={(value) => updateFilter(filter.id, { field: value, operator: 'equals', value: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {FILTER_FIELDS.map(field => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Operator Selection */}
                  <div className="flex-1">
                    <Select
                      value={filter.operator}
                      onValueChange={(value) => updateFilter(filter.id, { operator: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {getOperatorsForField(filter.field).map(operator => (
                          <SelectItem key={operator.value} value={operator.value}>
                            {operator.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Value Input */}
                  <div className="flex-1">
                    {getFieldOptions(filter.field).length > 0 ? (
                      <Select
                        value={filter.value}
                        onValueChange={(value) => updateFilter(filter.id, { value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select value" />
                        </SelectTrigger>
                        <SelectContent>
                          {getFieldOptions(filter.field).map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        placeholder="Enter value"
                        value={filter.value}
                        onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                        type={FIELD_TYPES[filter.field as keyof typeof FIELD_TYPES] === 'number' ? 'number' : 'text'}
                      />
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFilter(filter.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={applyFilters} disabled={loading || filters.some(f => !f.value)}>
                  <Search className="h-4 w-4 mr-2" />
                  {loading ? 'Applying...' : 'Apply Filters'}
                </Button>
                <Button variant="outline" onClick={exportResults} disabled={results.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Filters Display */}
      {filters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Filters</CardTitle>
            <CardDescription>
              Currently applied filter criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <Badge key={filter.id} variant="secondary" className="px-3 py-1">
                  {filter.label || `${filter.field} ${filter.operator} ${filter.value}`}
                  <button
                    onClick={() => removeFilter(filter.id)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      {totalResults > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Filter Results</span>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {totalResults.toLocaleString()} records found
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <DollarSign className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-900">
                  {formatCurrency(results.reduce((sum, r) => sum + (r.amount || 0), 0))}
                </div>
                <div className="text-sm text-blue-600">Total Amount</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrency(results.reduce((sum, r) => sum + (r.commission || 0), 0))}
                </div>
                <div className="text-sm text-green-600">Total Commission</div>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-900">
                  {new Set(results.map(r => r.date?.split('T')[0])).size}
                </div>
                <div className="text-sm text-purple-600">Unique Days</div>
              </div>

              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <RefreshCw className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-900">
                  {(results.reduce((sum, r) => sum + (r.commission || 0), 0) / Math.max(results.reduce((sum, r) => sum + (r.amount || 0), 0), 1) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-orange-600">Avg Commission Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Filter Presets */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Filter Presets</CardTitle>
          <CardDescription>
            Common filter combinations for quick analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {
                clearAllFilters()
                setFilters([{
                  id: Date.now().toString(),
                  field: 'status',
                  operator: 'equals',
                  value: 'completed',
                  label: 'Status equals Completed'
                }])
              }}
            >
              <Badge className="mr-2 bg-green-100 text-green-800">Completed</Badge>
              Successful Transactions
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {
                clearAllFilters()
                setFilters([{
                  id: Date.now().toString(),
                  field: 'date',
                  operator: 'last30days',
                  value: 'last30days',
                  label: 'Date in Last 30 days'
                }])
              }}
            >
              <Badge className="mr-2 bg-blue-100 text-blue-800">30d</Badge>
              Last 30 Days
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {
                clearAllFilters()
                setFilters([{
                  id: Date.now().toString(),
                  field: 'amount',
                  operator: 'greaterThan',
                  value: '1000000',
                  label: 'Amount greater than 1,000,000'
                }])
              }}
            >
              <Badge className="mr-2 bg-purple-100 text-purple-800">High</Badge>
              High Value ({'>'}1M)
            </Button>

            <Button
              variant="outline"
              className="justify-start"
              onClick={() => {
                clearAllFilters()
                setFilters([{
                  id: Date.now().toString(),
                  field: 'status',
                  operator: 'equals',
                  value: 'pending',
                  label: 'Status equals Pending'
                }])
              }}
            >
              <Badge className="mr-2 bg-yellow-100 text-yellow-800">Pending</Badge>
              Pending Review
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
