'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Link, Copy, ExternalLink, Settings, History, Plus, Trash2 } from 'lucide-react'

interface Campaign {
  id: string
  name: string
  url: string
  status: string
}

interface DeepLink {
  id: string
  trackingId: string
  originalUrl: string
  trackedUrl: string
  shortenedUrl: string
  campaign: {
    id: string
    name: string
  }
  parameters: Record<string, string>
  createdAt: string
}

interface CustomParameter {
  key: string
  value: string
}

export default function DeepLinkGenerator() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<string>('')
  const [targetUrl, setTargetUrl] = useState<string>('')
  const [utmSource, setUtmSource] = useState<string>('affiliate')
  const [utmMedium, setUtmMedium] = useState<string>('deeplink')
  const [utmCampaign, setUtmCampaign] = useState<string>('')
  const [utmContent, setUtmContent] = useState<string>('')
  const [utmTerm, setUtmTerm] = useState<string>('')
  const [customParameters, setCustomParameters] = useState<CustomParameter[]>([])
  const [generatedLink, setGeneratedLink] = useState<DeepLink | null>(null)
  const [recentLinks, setRecentLinks] = useState<DeepLink[]>([])
  const [loading, setLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    fetchCampaigns()
    fetchRecentLinks()
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

  const fetchRecentLinks = async () => {
    try {
      const response = await fetch('/api/tools/deeplink')
      if (response.ok) {
        const data = await response.json()
        setRecentLinks(data.deepLinks || [])
      }
    } catch (error) {
      console.error('Failed to fetch recent links:', error)
    }
  }

  const addCustomParameter = () => {
    setCustomParameters([...customParameters, { key: '', value: '' }])
  }

  const updateCustomParameter = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...customParameters]
    updated[index][field] = value
    setCustomParameters(updated)
  }

  const removeCustomParameter = (index: number) => {
    setCustomParameters(customParameters.filter((_, i) => i !== index))
  }

  const generateDeepLink = async () => {
    if (!selectedCampaign || !targetUrl) {
      alert('Please select a campaign and enter a target URL')
      return
    }

    setLoading(true)

    try {
      const customParams = customParameters.reduce((acc, param) => {
        if (param.key && param.value) {
          acc[param.key] = param.value
        }
        return acc
      }, {} as Record<string, string>)

      const response = await fetch('/api/tools/deeplink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          campaignId: selectedCampaign,
          targetUrl,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          utm_content: utmContent,
          utm_term: utmTerm,
          customParameters: customParams
        })
      })

      if (response.ok) {
        const data = await response.json()
        setGeneratedLink(data.deepLink)
        fetchRecentLinks() // Refresh recent links
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to generate deep link')
      }
    } catch (error) {
      console.error('Failed to generate deep link:', error)
      alert('Failed to generate deep link')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const resetForm = () => {
    setSelectedCampaign('')
    setTargetUrl('')
    setUtmCampaign('')
    setUtmContent('')
    setUtmTerm('')
    setCustomParameters([])
    setGeneratedLink(null)
  }

  const presetConfigurations = [
    {
      name: 'Social Media',
      config: {
        utm_source: 'social',
        utm_medium: 'post',
        utm_content: 'organic'
      }
    },
    {
      name: 'Email Newsletter',
      config: {
        utm_source: 'email',
        utm_medium: 'newsletter',
        utm_content: 'weekly'
      }
    },
    {
      name: 'Blog Article',
      config: {
        utm_source: 'blog',
        utm_medium: 'article',
        utm_content: 'inline'
      }
    }
  ]

  const applyPreset = (preset: typeof presetConfigurations[0]) => {
    setUtmSource(preset.config.utm_source)
    setUtmMedium(preset.config.utm_medium)
    setUtmContent(preset.config.utm_content)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-blue-500" />
            Deep Link Generator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Generate trackable deep links with UTM parameters for precise campaign tracking
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generator Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generate Deep Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Campaign Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Campaign *</label>
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a campaign...</option>
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name} ({campaign.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Target URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Target URL *</label>
              <Input
                type="url"
                placeholder="https://example.com/product"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
              />
            </div>

            {/* Preset Configurations */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Presets</label>
              <div className="flex gap-2 flex-wrap">
                {presetConfigurations.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Basic UTM Parameters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">UTM Source</label>
                <Input
                  placeholder="affiliate"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">UTM Medium</label>
                <Input
                  placeholder="deeplink"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">UTM Campaign</label>
              <Input
                placeholder="summer-sale-2025"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
              />
            </div>

            {/* Advanced Parameters */}
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                {showAdvanced ? 'Hide' : 'Show'} Advanced Options
              </Button>

              {showAdvanced && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">UTM Content</label>
                      <Input
                        placeholder="banner-top"
                        value={utmContent}
                        onChange={(e) => setUtmContent(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">UTM Term</label>
                      <Input
                        placeholder="keyword"
                        value={utmTerm}
                        onChange={(e) => setUtmTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Custom Parameters */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Custom Parameters</label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addCustomParameter}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    
                    {customParameters.map((param, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Parameter name"
                          value={param.key}
                          onChange={(e) => updateCustomParameter(index, 'key', e.target.value)}
                          className="flex-1"
                        />
                        <Input
                          placeholder="Parameter value"
                          value={param.value}
                          onChange={(e) => updateCustomParameter(index, 'value', e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeCustomParameter(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={generateDeepLink}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={loading || !selectedCampaign || !targetUrl}
              >
                {loading ? 'Generating...' : 'Generate Link'}
              </Button>
              <Button
                variant="outline"
                onClick={resetForm}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Link Result */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Generated Link</CardTitle>
          </CardHeader>
          <CardContent>
            {generatedLink ? (
              <div className="space-y-6">
                {/* Full Tracked URL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Tracked URL</label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedLink.trackedUrl}
                      readOnly
                      className="flex-1 text-xs"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedLink.trackedUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(generatedLink.trackedUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Shortened URL */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shortened URL</label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedLink.shortenedUrl}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedLink.shortenedUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Link Details */}
                <div className="space-y-3">
                  <h4 className="font-medium">Link Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Campaign:</span>
                      <Badge variant="outline">{generatedLink.campaign.name}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tracking ID:</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {generatedLink.trackingId}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created:</span>
                      <span>{new Date(generatedLink.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* UTM Parameters */}
                <div className="space-y-3">
                  <h4 className="font-medium">UTM Parameters</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(generatedLink.parameters).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500">{key}:</span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {value}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Link className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Link Generated Yet
                </h3>
                <p className="text-gray-500">
                  Fill out the form and click "Generate Link" to create your trackable deep link
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Links */}
      {recentLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Recent Deep Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLinks.slice(0, 10).map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium truncate">
                        {link.campaign?.name || 'Unknown Campaign'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {new Date(link.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {link.trackedUrl}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(link.trackedUrl)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(link.trackedUrl, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
