'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Calendar, FileText, BarChart3, MousePointer, DollarSign, Activity } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  category: string
}

interface DateRange {
  from: string
  to: string
}

export default function DataExport() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedType, setSelectedType] = useState<string>('clicks')
  const [selectedFormat, setSelectedFormat] = useState<string>('csv')
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    to: new Date().toISOString().split('T')[0] // today
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportHistory, setExportHistory] = useState<any[]>([])

  useEffect(() => {
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

  const exportTypes = [
    {
      id: 'clicks',
      name: 'Click Data',
      description: 'Export click tracking data with device, location, and timestamp information',
      icon: <MousePointer className="h-5 w-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'conversions',
      name: 'Conversion Data',
      description: 'Export conversion data with commission and payment information',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'bg-green-500'
    },
    {
      id: 'payments',
      name: 'Payment History',
      description: 'Export payment and withdrawal history',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'bg-purple-500'
    },
    {
      id: 'campaigns',
      name: 'Campaign Data',
      description: 'Export campaign details and performance metrics',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-orange-500'
    },
    {
      id: 'activities',
      name: 'Activity Log',
      description: 'Export user activity and system logs',
      icon: <Activity className="h-5 w-5" />,
      color: 'bg-gray-500'
    }
  ]

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      const exportData = {
        type: selectedType,
        format: selectedFormat,
        dateRange: {
          from: dateRange.from,
          to: dateRange.to
        },
        campaignIds: selectedCampaigns
      }

      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(exportData)
      })

      if (response.ok) {
        if (selectedFormat === 'csv') {
          // Download CSV file
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          
          const contentDisposition = response.headers.get('content-disposition')
          const filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || `export_${Date.now()}.csv`
          a.download = filename
          
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          
          // Add to export history
          setExportHistory(prev => [{
            id: Date.now(),
            type: selectedType,
            format: selectedFormat,
            filename,
            exportedAt: new Date().toISOString(),
            status: 'completed'
          }, ...prev.slice(0, 9)]) // Keep last 10 exports
          
        } else {
          // Handle JSON response
          const data = await response.json()
          console.log('JSON Export:', data)
          
          // Create downloadable JSON file
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = data.metadata.filename
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          
          setExportHistory(prev => [{
            id: Date.now(),
            type: selectedType,
            format: selectedFormat,
            filename: data.metadata.filename,
            exportedAt: new Date().toISOString(),
            recordCount: data.metadata.totalRecords,
            status: 'completed'
          }, ...prev.slice(0, 9)])
        }
        
        alert('Export completed successfully!')
      } else {
        const error = await response.json()
        alert(error.message || 'Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const toggleCampaignSelection = (campaignId: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId)
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    )
  }

  const selectAllCampaigns = () => {
    setSelectedCampaigns(campaigns.map(c => c.id))
  }

  const clearCampaignSelection = () => {
    setSelectedCampaigns([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-500" />
            Data Export
          </CardTitle>
          <p className="text-sm text-gray-600">
            Export your affiliate data for analysis, reporting, or backup purposes
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Export Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Export Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Data Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Data Type</label>
              <div className="grid gap-3">
                {exportTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedType(type.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg ${type.color} flex items-center justify-center text-white`}>
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{type.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                      </div>
                      {selectedType === type.id && (
                        <Badge variant="default" className="text-xs">Selected</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Date Range</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">From</label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">To</label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Format Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Export Format</label>
              <div className="flex gap-3">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedFormat === 'csv'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedFormat('csv')}
                >
                  CSV
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedFormat === 'json'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedFormat('json')}
                >
                  JSON
                </button>
              </div>
            </div>

            {/* Campaign Filter */}
            {(selectedType === 'clicks' || selectedType === 'conversions') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Filter by Campaigns (Optional)</label>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAllCampaigns}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearCampaignSelection}
                      className="text-xs text-gray-600 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                  {campaigns.map((campaign) => (
                    <label key={campaign.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCampaigns.includes(campaign.id)}
                        onChange={() => toggleCampaignSelection(campaign.id)}
                        className="rounded"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium">{campaign.name}</span>
                        <div className="text-xs text-gray-500">{campaign.category}</div>
                      </div>
                    </label>
                  ))}
                </div>
                
                {selectedCampaigns.length > 0 && (
                  <div className="text-xs text-gray-600">
                    {selectedCampaigns.length} campaign(s) selected
                  </div>
                )}
              </div>
            )}

            {/* Export Button */}
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isExporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Export Preview & History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Export Preview & History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Selection Preview */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Current Selection</h4>
              <div className="p-3 bg-gray-50 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Type:</span>
                  <span className="font-medium">{exportTypes.find(t => t.id === selectedType)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium uppercase">{selectedFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date Range:</span>
                  <span className="font-medium">
                    {new Date(dateRange.from).toLocaleDateString()} - {new Date(dateRange.to).toLocaleDateString()}
                  </span>
                </div>
                {selectedCampaigns.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Campaigns:</span>
                    <span className="font-medium">{selectedCampaigns.length} selected</span>
                  </div>
                )}
              </div>
            </div>

            {/* Export History */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Recent Exports</h4>
              {exportHistory.length > 0 ? (
                <div className="space-y-2">
                  {exportHistory.map((export_item) => (
                    <div key={export_item.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{exportTypes.find(t => t.id === export_item.type)?.name}</span>
                        <Badge 
                          variant={export_item.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {export_item.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Format: {export_item.format.toUpperCase()}</div>
                        <div>File: {export_item.filename}</div>
                        {export_item.recordCount && (
                          <div>Records: {export_item.recordCount.toLocaleString()}</div>
                        )}
                        <div>Exported: {new Date(export_item.exportedAt).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Download className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No exports yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
