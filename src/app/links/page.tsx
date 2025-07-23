'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LinkAnalytics } from '@/components/link-analytics'
import {
  MousePointer,
  Target,
  DollarSign,
  TrendingUp,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  ExternalLink,
  BarChart3,
  Calendar,
  Link as LinkIcon
} from 'lucide-react'
import Link from 'next/link'

interface AffiliateLink {
  id: string
  title: string
  shortCode: string
  originalUrl: string
  customAlias?: string
  isActive: boolean
  createdAt: string
  totalClicks: number
  totalConversions: number
  totalRevenue: number
  campaign: {
    id: string
    name: string
    commission: number
  }
  analytics: {
    recent30Days: {
      clicks: number
      conversions: number
      revenue: number
    }
    ctr: number
    avgRevenue: number
    conversionRate: number
  }
}

interface LinkStats {
  totalLinks: number
  activeLinks: number
  totalClicks: number
  totalConversions: number
  totalRevenue: number
  averageCTR: number
}

export default function LinksPage() {
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [stats, setStats] = useState<LinkStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLink, setSelectedLink] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [filterCampaign, setFilterCampaign] = useState('')

  const fetchLinks = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        search,
        sortBy,
        sortOrder,
        ...(filterCampaign && { campaignId: filterCampaign })
      })
      
      const response = await fetch(`/api/links?${params}`)
      if (response.ok) {
        const data = await response.json()
        setLinks(data.links)
        
        // Calculate stats
        const totalClicks = data.links.reduce((sum: number, link: AffiliateLink) => sum + link.totalClicks, 0)
        const totalConversions = data.links.reduce((sum: number, link: AffiliateLink) => sum + link.totalConversions, 0)
        const totalRevenue = data.links.reduce((sum: number, link: AffiliateLink) => sum + link.totalRevenue, 0)
        const activeLinks = data.links.filter((link: AffiliateLink) => link.isActive).length
        const averageCTR = data.links.length > 0 
          ? data.links.reduce((sum: number, link: AffiliateLink) => sum + link.analytics.ctr, 0) / data.links.length
          : 0

        setStats({
          totalLinks: data.links.length,
          activeLinks,
          totalClicks,
          totalConversions,
          totalRevenue,
          averageCTR: Math.round(averageCTR * 100) / 100
        })
      }
    } catch (error) {
      console.error('Failed to fetch links:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [search, sortBy, sortOrder, filterCampaign])

  const copyLinkUrl = (shortCode: string) => {
    const url = `${window.location.origin}/l/${shortCode}`
    navigator.clipboard.writeText(url)
    // Could show toast notification here
  }

  const toggleLinkStatus = async (linkId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      })
      
      if (response.ok) {
        fetchLinks() // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update link:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (selectedLink) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setSelectedLink(null)}>
            ← Back to Links
          </Button>
          <h1 className="text-2xl font-bold">Link Analytics</h1>
        </div>
        <LinkAnalytics linkId={selectedLink} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Link Analytics</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Link
        </Button>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-blue-600" />
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stats.totalLinks}</p>
                  <p className="text-xs text-gray-600">Total Links</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stats.activeLinks}</p>
                  <p className="text-xs text-gray-600">Active Links</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <MousePointer className="h-5 w-5 text-blue-600" />
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Total Clicks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stats.totalConversions.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Conversions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()}₫</p>
                  <p className="text-xs text-gray-600">Total Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stats.averageCTR}%</p>
                  <p className="text-xs text-gray-600">Average CTR</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Created</SelectItem>
            <SelectItem value="totalClicks">Total Clicks</SelectItem>
            <SelectItem value="totalConversions">Conversions</SelectItem>
            <SelectItem value="totalRevenue">Revenue</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Desc</SelectItem>
            <SelectItem value="asc">Asc</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Affiliate Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {links.map((link) => (
              <div key={link.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{link.title || 'Untitled Link'}</h3>
                      <Badge variant={link.isActive ? 'default' : 'secondary'}>
                        {link.isActive ? 'Active' : 'Paused'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <p className="text-blue-600 font-medium">
                        {window.location.origin}/l/{link.shortCode}
                      </p>
                      <p className="text-gray-500 truncate max-w-md">→ {link.originalUrl}</p>
                      <p className="text-gray-600">Campaign: {link.campaign.name} ({link.campaign.commission}%)</p>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <MousePointer className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{link.totalClicks.toLocaleString()}</span>
                        <span className="text-gray-500">clicks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{link.totalConversions}</span>
                        <span className="text-gray-500">conversions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{link.totalRevenue.toLocaleString()}₫</span>
                        <span className="text-gray-500">revenue</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">{link.analytics.ctr}%</span>
                        <span className="text-gray-500">CTR</span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">
                      Last 30 days: {link.analytics.recent30Days.clicks} clicks, {link.analytics.recent30Days.conversions} conversions, {link.analytics.recent30Days.revenue.toLocaleString()}₫
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedLink(link.id)}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyLinkUrl(link.shortCode)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleLinkStatus(link.id, link.isActive)}
                    >
                      {link.isActive ? 'Pause' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {links.length === 0 && (
              <div className="text-center py-8">
                <LinkIcon className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No links found</p>
                <p className="text-gray-400 text-sm mt-1">
                  Create your first affiliate link to start tracking performance
                </p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Link
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
