"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { DashboardStats } from "@/components/dashboard-stats"
import { RevenueChart } from "@/components/revenue-chart"
import { RecentActivity } from "@/components/recent-activity"
import RealTimeAnalytics from "@/components/real-time-analytics"
import DateRangeAnalytics from "@/components/date-range-analytics"
import { NotificationDemo } from "@/components/notification-demo"
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendingUp, DollarSign, MousePointer, Target, Calendar, ArrowRight, BarChart3, Activity } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

interface BalanceData {
  totalEarned: number
  totalPaid: number
  availableBalance: number
  monthlyEarnings: Array<{
    month: string
    amount: number
  }>
  topCampaigns: Array<{
    name: string
    earnings: number
    clicks: number
    conversions: number
  }>
}

interface Campaign {
  id: string
  name: string
  category: string
  commission: number
  status: string
  image?: string
  description: string
}

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth()
  const [balance, setBalance] = useState<BalanceData | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const t = useTranslations('dashboard')

  useEffect(() => {
    if (!user) return

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch balance data
        const balanceResponse = await fetch('/api/dashboard/balance')
        if (balanceResponse.ok) {
          const balanceData = await balanceResponse.json()
          setBalance(balanceData)
        }

        // Fetch recommended campaigns
        const campaignResponse = await fetch('/api/campaigns/recommended')
        if (campaignResponse.ok) {
          const campaignData = await campaignResponse.json()
          setCampaigns(campaignData.slice(0, 3)) // Show top 3 campaigns
        }
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error('Dashboard data fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">{t('auth.loginRequired')}</h1>
        <p className="text-gray-600 mb-6">{t('auth.loginMessage')}</p>
        <Button asChild>
          <Link href="/">{t('auth.backToHome')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{t('welcome', { name: user.name || 'User' })}</h1>
          <p className="text-gray-600 mt-1">{t('subtitle')}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/campaigns">
              <Target className="h-4 w-4 mr-2" />
              {t('actions.browseCampaigns')}
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/tools">
              <BarChart3 className="h-4 w-4 mr-2" />
              {t('actions.viewTools')}
            </Link>
          </Button>
        </div>
      </div>

      {/* Dashboard Stats */}
      <DashboardStats />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">{t('tabs.overview')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('tabs.analytics')}</TabsTrigger>
          <TabsTrigger value="realtime">{t('tabs.realtime')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('tabs.notifications')}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts and Activity */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>
            <div>
              <RecentActivity />
            </div>
          </div>

          {/* Balance Overview */}
          {balance && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">{t('balance.title')}</h3>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/payments">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {t('balance.viewPayments')}
                  </Link>
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ${balance.totalEarned.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600">{t('balance.totalEarned')}</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ${balance.availableBalance.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-600">{t('balance.available')}</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    ${balance.totalPaid.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">{t('balance.totalPaid')}</div>
                </div>
              </div>

              {/* Top Performing Campaigns */}
              {balance.topCampaigns && balance.topCampaigns.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-4">{t('balance.topCampaigns')}</h4>
                  <div className="space-y-3">
                    {balance.topCampaigns.map((campaign, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-gray-600">
                            {campaign.clicks} {t('balance.clicks')} • {campaign.conversions} {t('balance.conversions')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">${campaign.earnings}</div>
                          <Badge variant="secondary">#{index + 1}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Recommended Campaigns */}
          {campaigns.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">{t('campaigns.recommended')}</h3>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/campaigns">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {t('campaigns.viewAll')}
                  </Link>
                </Button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{campaign.name}</h4>
                        <p className="text-sm text-gray-600">{campaign.category}</p>
                      </div>
                      <Badge 
                        variant={campaign.status === 'active' ? 'default' : 'secondary'}
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {campaign.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium text-green-600">
                          {campaign.commission}% {t('campaigns.commission')}
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        {t('campaigns.joinNow')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <DateRangeAnalytics />
        </TabsContent>

        <TabsContent value="realtime">
          <RealTimeAnalytics />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationDemo />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('quickActions.title')}</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="h-auto p-4" asChild>
            <Link href="/tools">
              <div className="text-center">
                <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">{t('quickActions.linkGenerator')}</div>
                <div className="text-xs text-gray-600">{t('quickActions.linkGeneratorDesc')}</div>
              </div>
            </Link>
          </Button>
          
          <Button variant="outline" className="h-auto p-4" asChild>
            <Link href="/reports">
              <div className="text-center">
                <Activity className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">{t('quickActions.viewReports')}</div>
                <div className="text-xs text-gray-600">{t('quickActions.viewReportsDesc')}</div>
              </div>
            </Link>
          </Button>
          
          <Button variant="outline" className="h-auto p-4" asChild>
            <Link href="/payments">
              <div className="text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">{t('quickActions.paymentSettings')}</div>
                <div className="text-xs text-gray-600">{t('quickActions.paymentSettingsDesc')}</div>
              </div>
            </Link>
          </Button>
          
          <Button variant="outline" className="h-auto p-4" asChild>
            <Link href="/support">
              <div className="text-center">
                <Target className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">{t('quickActions.getHelp')}</div>
                <div className="text-xs text-gray-600">{t('quickActions.getHelpDesc')}</div>
              </div>
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
