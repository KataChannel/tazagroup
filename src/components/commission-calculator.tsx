'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calculator, TrendingUp, DollarSign, Percent, Info } from 'lucide-react'

interface CalculationResult {
  grossSales: number
  commission: number
  commissionRate: number
  netEarnings: number
  taxAmount?: number
  finalAmount: number
}

interface Campaign {
  id: string
  name: string
  commission: number
  currency: string
}

export default function CommissionCalculator() {
  const [salesAmount, setSalesAmount] = useState<string>('')
  const [commissionRate, setCommissionRate] = useState<string>('')
  const [taxRate, setTaxRate] = useState<string>('10') // Default 10% tax
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<string>('')
  const [customRate, setCustomRate] = useState(false)

  useEffect(() => {
    // Fetch user's campaigns for quick calculation
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns')
      if (response.ok) {
        const data = await response.json()
        setCampaigns(data.campaigns || [])
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error)
    }
  }

  const calculateCommission = () => {
    const sales = parseFloat(salesAmount)
    const rate = parseFloat(commissionRate)
    const tax = parseFloat(taxRate)

    if (isNaN(sales) || isNaN(rate) || sales <= 0 || rate <= 0) {
      return
    }

    const commission = (sales * rate) / 100
    const taxAmount = tax > 0 ? (commission * tax) / 100 : 0
    const finalAmount = commission - taxAmount

    const calculationResult: CalculationResult = {
      grossSales: sales,
      commission: commission,
      commissionRate: rate,
      netEarnings: commission,
      taxAmount: taxAmount,
      finalAmount: finalAmount
    }

    setResult(calculationResult)
  }

  const handleCampaignSelect = (campaignId: string) => {
    const campaign = campaigns.find(c => c.id === campaignId)
    if (campaign) {
      setSelectedCampaign(campaignId)
      setCommissionRate(campaign.commission.toString())
      setCustomRate(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const resetCalculator = () => {
    setSalesAmount('')
    setCommissionRate('')
    setSelectedCampaign('')
    setResult(null)
    setCustomRate(false)
  }

  // Pre-defined calculation scenarios
  const quickScenarios = [
    { sales: 1000000, rate: 10, label: '1M VND @ 10%' },
    { sales: 5000000, rate: 15, label: '5M VND @ 15%' },
    { sales: 10000000, rate: 20, label: '10M VND @ 20%' },
  ]

  const runQuickScenario = (scenario: { sales: number; rate: number; label: string }) => {
    setSalesAmount(scenario.sales.toString())
    setCommissionRate(scenario.rate.toString())
    setCustomRate(true)
    
    // Auto calculate
    setTimeout(() => {
      const sales = scenario.sales
      const rate = scenario.rate
      const tax = parseFloat(taxRate)
      
      const commission = (sales * rate) / 100
      const taxAmount = tax > 0 ? (commission * tax) / 100 : 0
      const finalAmount = commission - taxAmount

      setResult({
        grossSales: sales,
        commission: commission,
        commissionRate: rate,
        netEarnings: commission,
        taxAmount: taxAmount,
        finalAmount: finalAmount
      })
    }, 100)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-500" />
            Commission Calculator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Calculate your potential earnings from affiliate sales
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calculator Input */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calculate Commission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Campaign Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Campaign (Optional)</label>
              <select
                value={selectedCampaign}
                onChange={(e) => handleCampaignSelect(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a campaign...</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name} - {campaign.commission}%
                  </option>
                ))}
              </select>
            </div>

            {/* Sales Amount */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sales Amount (VND)</label>
              <Input
                type="number"
                placeholder="Enter sales amount"
                value={salesAmount}
                onChange={(e) => setSalesAmount(e.target.value)}
                className="text-lg"
              />
            </div>

            {/* Commission Rate */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Commission Rate (%)</label>
                {!customRate && selectedCampaign && (
                  <Badge variant="secondary">From selected campaign</Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter commission rate"
                  value={commissionRate}
                  onChange={(e) => {
                    setCommissionRate(e.target.value)
                    setCustomRate(true)
                    setSelectedCampaign('')
                  }}
                  step="0.1"
                  className="text-lg"
                />
                <div className="flex items-center px-3 bg-gray-100 rounded-md">
                  <Percent className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>

            {/* Tax Rate */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tax Rate (%) - Optional</label>
              <Input
                type="number"
                placeholder="Enter tax rate"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                step="0.1"
                className="text-lg"
              />
              <p className="text-xs text-gray-500">
                <Info className="h-3 w-3 inline mr-1" />
                Personal income tax or withholding tax if applicable
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={calculateCommission}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={!salesAmount || !commissionRate}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </Button>
              <Button
                variant="outline"
                onClick={resetCalculator}
              >
                Reset
              </Button>
            </div>

            {/* Quick Scenarios */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Scenarios</label>
              <div className="grid grid-cols-1 gap-2">
                {quickScenarios.map((scenario, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => runQuickScenario(scenario)}
                    className="justify-start"
                  >
                    {scenario.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Main Results */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Gross Sales</span>
                    <span className="text-lg font-semibold">
                      {formatCurrency(result.grossSales)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Commission Rate</span>
                    <span className="text-lg font-semibold text-blue-600">
                      {result.commissionRate}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Gross Commission</span>
                    <span className="text-lg font-semibold text-green-600">
                      {formatCurrency(result.commission)}
                    </span>
                  </div>

                  {result.taxAmount && result.taxAmount > 0 && (
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium">Tax ({taxRate}%)</span>
                      <span className="text-lg font-semibold text-red-600">
                        -{formatCurrency(result.taxAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg">
                    <span className="font-medium">Final Earnings</span>
                    <span className="text-xl font-bold">
                      {formatCurrency(result.finalAmount)}
                    </span>
                  </div>
                </div>

                {/* Breakdown Chart */}
                <div className="space-y-3">
                  <h4 className="font-medium">Earnings Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div 
                        className="h-4 bg-green-500 rounded-l"
                        style={{ width: `${(result.finalAmount / result.commission) * 100}%` }}
                      ></div>
                      {result.taxAmount && result.taxAmount > 0 && (
                        <div 
                          className="h-4 bg-red-500 rounded-r"
                          style={{ width: `${(result.taxAmount / result.commission) * 100}%` }}
                        ></div>
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Net Earnings: {((result.finalAmount / result.commission) * 100).toFixed(1)}%</span>
                      {result.taxAmount && result.taxAmount > 0 && (
                        <span>Tax: {((result.taxAmount / result.commission) * 100).toFixed(1)}%</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Insights */}
                <div className="space-y-2">
                  <h4 className="font-medium">Insights</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• To earn ₫1,000,000, you need to generate {formatCurrency((1000000 / result.commissionRate) * 100)} in sales</p>
                    <p>• Your effective commission rate after tax: {((result.finalAmount / result.grossSales) * 100).toFixed(2)}%</p>
                    <p>• Break-even point for ₫100,000 earnings: {formatCurrency((100000 / result.commissionRate) * 100)} in sales</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ready to Calculate
                </h3>
                <p className="text-gray-500">
                  Enter your sales amount and commission rate to see your potential earnings
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
