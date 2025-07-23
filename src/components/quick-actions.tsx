"use client"

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { 
  Zap, 
  Search, 
  Plus, 
  Link, 
  BarChart3, 
  DollarSign, 
  Target, 
  Users, 
  Settings, 
  Calendar, 
  Download, 
  Upload, 
  RefreshCw, 
  FileText, 
  TrendingUp, 
  Calculator, 
  QrCode, 
  Archive, 
  Bookmark, 
  Bell, 
  Shield, 
  Globe, 
  Code, 
  Palette, 
  Database, 
  Mail, 
  Phone, 
  MessageSquare, 
  Share, 
  Filter, 
  Edit, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Heart, 
  Clock, 
  ExternalLink,
  Command as CommandIcon,
  ArrowRight,
  ChevronRight,
  Keyboard,
  Layers,
  Grid3X3,
  Layout,
  Terminal
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Quick Action Types
export interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category: ActionCategory
  action: () => void | Promise<void>
  shortcut?: string
  keywords: string[]
  isFrequent?: boolean
  lastUsed?: Date
  useCount?: number
  requiresConfirmation?: boolean
  confirmationMessage?: string
  isExternal?: boolean
  url?: string
  isCustom?: boolean
}

export type ActionCategory = 
  | 'navigation' 
  | 'campaigns' 
  | 'reports' 
  | 'tools' 
  | 'payments' 
  | 'settings' 
  | 'data' 
  | 'external'
  | 'custom'

export interface QuickActionGroup {
  label: string
  actions: QuickAction[]
  icon: React.ReactNode
  color: string
}

// Pre-defined Quick Actions
const createQuickActions = (
  onNavigate: (path: string) => void, 
  onAction: (actionId: string) => void,
  toast: any
): QuickAction[] => [
  // Navigation Actions
  {
    id: 'nav-dashboard',
    title: 'Go to Dashboard',
    description: 'Navigate to the main dashboard',
    icon: <Layout className="h-4 w-4" />,
    category: 'navigation',
    action: () => onNavigate('/dashboard'),
    shortcut: 'Ctrl+D',
    keywords: ['dashboard', 'home', 'main', 'overview']
  },
  {
    id: 'nav-campaigns',
    title: 'View Campaigns',
    description: 'Browse all available campaigns',
    icon: <Target className="h-4 w-4" />,
    category: 'navigation',
    action: () => onNavigate('/campaigns'),
    shortcut: 'Ctrl+C',
    keywords: ['campaigns', 'offers', 'programs', 'affiliate']
  },
  {
    id: 'nav-reports',
    title: 'Analytics & Reports',
    description: 'View performance reports and analytics',
    icon: <BarChart3 className="h-4 w-4" />,
    category: 'navigation',
    action: () => onNavigate('/reports'),
    shortcut: 'Ctrl+R',
    keywords: ['reports', 'analytics', 'stats', 'performance', 'data']
  },
  {
    id: 'nav-payments',
    title: 'Payment Center',
    description: 'Manage payments and withdrawals',
    icon: <DollarSign className="h-4 w-4" />,
    category: 'navigation',
    action: () => onNavigate('/payments'),
    shortcut: 'Ctrl+P',
    keywords: ['payments', 'money', 'withdraw', 'balance', 'payout']
  },
  {
    id: 'nav-profile',
    title: 'Profile Settings',
    description: 'Edit your profile and account settings',
    icon: <Settings className="h-4 w-4" />,
    category: 'navigation',
    action: () => onNavigate('/profile'),
    shortcut: 'Ctrl+U',
    keywords: ['profile', 'settings', 'account', 'user', 'preferences']
  },

  // Campaign Actions
  {
    id: 'campaign-new',
    title: 'Apply to Campaign',
    description: 'Quick apply to a new campaign',
    icon: <Plus className="h-4 w-4" />,
    category: 'campaigns',
    action: () => onNavigate('/campaigns?action=apply'),
    keywords: ['apply', 'join', 'new', 'campaign', 'register']
  },
  {
    id: 'campaign-favorites',
    title: 'Favorite Campaigns',
    description: 'View your starred campaigns',
    icon: <Star className="h-4 w-4" />,
    category: 'campaigns',
    action: () => onNavigate('/campaigns?filter=favorites'),
    keywords: ['favorites', 'starred', 'bookmarked', 'saved']
  },
  {
    id: 'campaign-top-performing',
    title: 'Top Performing Campaigns',
    description: 'View highest earning campaigns',
    icon: <TrendingUp className="h-4 w-4" />,
    category: 'campaigns',
    action: () => onNavigate('/campaigns?sort=performance'),
    keywords: ['top', 'best', 'performing', 'high', 'earning', 'profitable']
  },

  // Tools Actions
  {
    id: 'tool-link-generator',
    title: 'Generate Affiliate Link',
    description: 'Create trackable affiliate links',
    icon: <Link className="h-4 w-4" />,
    category: 'tools',
    action: () => onNavigate('/tools/link-generator'),
    shortcut: 'Ctrl+L',
    keywords: ['link', 'generate', 'affiliate', 'tracking', 'url']
  },
  {
    id: 'tool-qr-code',
    title: 'QR Code Generator',
    description: 'Generate QR codes for your links',
    icon: <QrCode className="h-4 w-4" />,
    category: 'tools',
    action: () => onNavigate('/tools/qr-generator'),
    keywords: ['qr', 'code', 'generate', 'mobile', 'scan']
  },
  {
    id: 'tool-commission-calc',
    title: 'Commission Calculator',
    description: 'Calculate potential earnings',
    icon: <Calculator className="h-4 w-4" />,
    category: 'tools',
    action: () => onNavigate('/tools/commission-calculator'),
    keywords: ['commission', 'calculator', 'earnings', 'profit', 'calculate']
  },
  {
    id: 'tool-deep-link',
    title: 'Deep Link Generator',
    description: 'Create advanced tracking links',
    icon: <ExternalLink className="h-4 w-4" />,
    category: 'tools',
    action: () => onNavigate('/tools/deep-link-generator'),
    keywords: ['deep', 'link', 'advanced', 'tracking', 'utm']
  },

  // Reports Actions
  {
    id: 'report-revenue',
    title: 'Revenue Report',
    description: 'View detailed revenue analytics',
    icon: <DollarSign className="h-4 w-4" />,
    category: 'reports',
    action: () => onNavigate('/reports/revenue'),
    keywords: ['revenue', 'earnings', 'income', 'money', 'financial']
  },
  {
    id: 'report-performance',
    title: 'Performance Report',
    description: 'Analyze click and conversion metrics',
    icon: <TrendingUp className="h-4 w-4" />,
    category: 'reports',
    action: () => onNavigate('/reports/performance'),
    keywords: ['performance', 'metrics', 'clicks', 'conversions', 'analytics']
  },
  {
    id: 'report-commission',
    title: 'Commission Report',
    description: 'Detailed commission breakdown',
    icon: <FileText className="h-4 w-4" />,
    category: 'reports',
    action: () => onNavigate('/reports/commission'),  
    keywords: ['commission', 'breakdown', 'detailed', 'tier', 'structure']
  },

  // Payment Actions
  {
    id: 'payment-withdraw',
    title: 'Request Withdrawal',
    description: 'Withdraw your earnings',
    icon: <Download className="h-4 w-4" />,
    category: 'payments',
    action: () => onNavigate('/payments/withdraw'),
    requiresConfirmation: true,
    confirmationMessage: 'Are you sure you want to proceed with a withdrawal request?',
    keywords: ['withdraw', 'payout', 'cash', 'out', 'money']
  },
  {
    id: 'payment-history',
    title: 'Payment History',
    description: 'View all payment transactions',
    icon: <Clock className="h-4 w-4" />,
    category: 'payments',
    action: () => onNavigate('/payments/history'),
    keywords: ['history', 'transactions', 'past', 'payments', 'record']
  },
  {
    id: 'payment-schedule',
    title: 'Payout Schedule',
    description: 'View upcoming payment dates',
    icon: <Calendar className="h-4 w-4" />,
    category: 'payments',
    action: () => onNavigate('/payments/schedule'),
    keywords: ['schedule', 'upcoming', 'dates', 'calendar', 'future']
  },

  // Data Actions
  {
    id: 'data-export',
    title: 'Export Data',
    description: 'Export reports and analytics data',
    icon: <Download className="h-4 w-4" />,
    category: 'data',
    action: () => {
      toast({
        title: "Export Started",
        description: "Your data export is being prepared..."
      })
      onAction('export-data')
    },
    keywords: ['export', 'download', 'data', 'csv', 'excel', 'backup']
  },
  {
    id: 'data-refresh',
    title: 'Refresh All Data',
    description: 'Update all dashboard metrics',
    icon: <RefreshCw className="h-4 w-4" />,
    category: 'data',
    action: () => {
      toast({
        title: "Data Refreshed",
        description: "All metrics have been updated."
      })
      onAction('refresh-data')
    },
    shortcut: 'F5',
    keywords: ['refresh', 'update', 'reload', 'sync', 'latest']
  },

  // Settings Actions
  {
    id: 'settings-notifications',
    title: 'Notification Settings',
    description: 'Manage notification preferences',
    icon: <Bell className="h-4 w-4" />,
    category: 'settings',
    action: () => onNavigate('/settings/notifications'),
    keywords: ['notifications', 'alerts', 'preferences', 'email', 'push']
  },
  {
    id: 'settings-security',
    title: 'Security Settings',
    description: 'Two-factor auth and security',
    icon: <Shield className="h-4 w-4" />,
    category: 'settings',
    action: () => onNavigate('/settings/security'),
    keywords: ['security', '2fa', 'password', 'authentication', 'safety']
  },
  {
    id: 'settings-themes',
    title: 'Customize Theme',
    description: 'Change appearance and theme',
    icon: <Palette className="h-4 w-4" />,
    category: 'settings',
    action: () => onNavigate('/settings/themes'),
    keywords: ['theme', 'appearance', 'customize', 'colors', 'dark', 'light']
  },

  // External Actions
  {
    id: 'external-support',
    title: 'Contact Support',
    description: 'Get help from our support team',
    icon: <MessageSquare className="h-4 w-4" />,
    category: 'external',
    action: () => window.open('mailto:support@accesstrade.vn', '_blank'),
    isExternal: true,
    url: 'mailto:support@accesstrade.vn',
    keywords: ['support', 'help', 'contact', 'assistance', 'email']
  },
  {
    id: 'external-documentation',
    title: 'API Documentation',
    description: 'View API documentation',
    icon: <Code className="h-4 w-4" />,
    category: 'external',
    action: () => onNavigate('/api/docs'),
    isExternal: true,
    keywords: ['api', 'documentation', 'docs', 'reference', 'developer']
  },
  {
    id: 'external-blog',
    title: 'AccessTrade Blog',
    description: 'Latest affiliate marketing tips',
    icon: <Globe className="h-4 w-4" />,
    category: 'external',
    action: () => window.open('https://blog.accesstrade.vn', '_blank'),
    isExternal: true,
    url: 'https://blog.accesstrade.vn',
    keywords: ['blog', 'tips', 'news', 'marketing', 'articles']
  }
]

// Action Categories Configuration
const ACTION_CATEGORIES = {
  navigation: { 
    label: 'Navigation', 
    icon: <Layout className="h-4 w-4" />, 
    color: 'bg-blue-100 text-blue-800',
    description: 'Navigate between pages and sections'
  },
  campaigns: { 
    label: 'Campaigns', 
    icon: <Target className="h-4 w-4" />, 
    color: 'bg-green-100 text-green-800',
    description: 'Campaign-related actions and shortcuts'
  },
  reports: { 
    label: 'Reports', 
    icon: <BarChart3 className="h-4 w-4" />, 
    color: 'bg-purple-100 text-purple-800',
    description: 'Analytics and reporting tools'
  },
  tools: { 
    label: 'Tools', 
    icon: <Settings className="h-4 w-4" />, 
    color: 'bg-orange-100 text-orange-800',
    description: 'Marketing tools and utilities'
  },
  payments: { 
    label: 'Payments', 
    icon: <DollarSign className="h-4 w-4" />, 
    color: 'bg-emerald-100 text-emerald-800',
    description: 'Payment and withdrawal actions'
  },
  settings: { 
    label: 'Settings', 
    icon: <Settings className="h-4 w-4" />, 
    color: 'bg-gray-100 text-gray-800',
    description: 'Account and system settings'
  },
  data: { 
    label: 'Data', 
    icon: <Database className="h-4 w-4" />, 
    color: 'bg-indigo-100 text-indigo-800',
    description: 'Data management and export'
  },
  external: { 
    label: 'External', 
    icon: <ExternalLink className="h-4 w-4" />, 
    color: 'bg-pink-100 text-pink-800',
    description: 'External links and resources'
  },
  custom: { 
    label: 'Custom', 
    icon: <Star className="h-4 w-4" />, 
    color: 'bg-yellow-100 text-yellow-800',
    description: 'User-defined custom actions'
  }
}

interface QuickActionsProps {
  onNavigate?: (path: string) => void
  onAction?: (actionId: string) => void
  className?: string
}

export function QuickActions({ onNavigate = () => {}, onAction = () => {}, className }: QuickActionsProps) {
  const { toast } = useToast()
  
  // State management
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ActionCategory | 'all'>('all')
  const [frequentActions, setFrequentActions] = useState<string[]>([])
  const [recentActions, setRecentActions] = useState<string[]>([])
  const [customActions, setCustomActions] = useState<QuickAction[]>([])

  // Create actions with handlers
  const actions = useMemo(() => 
    createQuickActions(onNavigate, onAction, toast), 
    [onNavigate, onAction, toast]
  )

  // All actions including custom ones
  const allActions = useMemo(() => [...actions, ...customActions], [actions, customActions])

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open command palette with Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandOpen(true)
        return
      }

      // Handle individual shortcuts
      if (e.ctrlKey || e.metaKey) {
        const shortcutAction = allActions.find(action => {
          if (!action.shortcut) return false
          const shortcut = action.shortcut.toLowerCase().replace('ctrl+', '').replace('cmd+', '')
          return shortcut === e.key.toLowerCase()
        })

        if (shortcutAction) {
          e.preventDefault()
          executeAction(shortcutAction)
        }
      }

      // F5 for refresh
      if (e.key === 'F5') {
        const refreshAction = allActions.find(action => action.id === 'data-refresh')
        if (refreshAction) {
          e.preventDefault()
          executeAction(refreshAction)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [allActions])

  // Execute action with confirmation and tracking
  const executeAction = useCallback(async (action: QuickAction) => {
    // Confirmation dialog for destructive actions
    if (action.requiresConfirmation) {
      const confirmed = window.confirm(action.confirmationMessage || `Are you sure you want to ${action.title.toLowerCase()}?`)
      if (!confirmed) return
    }

    try {
      // Track usage
      setFrequentActions(prev => {
        const updated = [action.id, ...prev.filter(id => id !== action.id)]
        return updated.slice(0, 10) // Keep top 10
      })
      
      setRecentActions(prev => {
        const updated = [action.id, ...prev.filter(id => id !== action.id)]
        return updated.slice(0, 5) // Keep recent 5
      })

      // Execute action
      await action.action()
      
      // Close command palette
      setIsCommandOpen(false)
      
      // Show success toast for certain actions
      if (!action.isExternal && !action.url?.startsWith('/')) {
        toast({
          title: "Action Executed",
          description: `${action.title} completed successfully.`
        })
      }
    } catch (error) {
      console.error('Error executing action:', error)
      toast({
        title: "Action Failed",
        description: `Failed to execute ${action.title}. Please try again.`,
        variant: "destructive"
      })
    }
  }, [toast])

  // Filtered actions
  const filteredActions = useMemo(() => {
    let filtered = allActions

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(action =>
        action.title.toLowerCase().includes(term) ||
        action.description.toLowerCase().includes(term) ||
        action.keywords.some(keyword => keyword.toLowerCase().includes(term))
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(action => action.category === selectedCategory)
    }

    return filtered
  }, [allActions, searchTerm, selectedCategory])

  // Group actions by category for command palette
  const groupedActions = useMemo(() => {
    const groups: Record<ActionCategory, QuickAction[]> = {
      navigation: [],
      campaigns: [],
      reports: [],
      tools: [],  
      payments: [],
      settings: [],
      data: [],
      external: [],
      custom: []
    }

    filteredActions.forEach(action => {
      groups[action.category].push(action)
    })

    return Object.entries(groups)
      .filter(([_, actions]) => actions.length > 0)
      .map(([category, actions]) => ({
        category: category as ActionCategory,
        actions
      }))
  }, [filteredActions])

  // Get frequent and recent actions
  const frequentActionsList = useMemo(() => 
    frequentActions.map(id => allActions.find(a => a.id === id)).filter(Boolean).slice(0, 6),
    [frequentActions, allActions]
  )

  const recentActionsList = useMemo(() =>
    recentActions.map(id => allActions.find(a => a.id === id)).filter(Boolean).slice(0, 4),
    [recentActions, allActions]
  )

  return (
    <div className={className}>
      {/* Quick Actions Trigger Button */}
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="outline"
          onClick={() => setIsCommandOpen(true)}
          className="gap-2 text-left justify-start flex-1 max-w-sm"
        >
          <Search className="h-4 w-4" />
          <span className="text-muted-foreground">Search actions...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsCommandOpen(true)}
          title="Quick Actions (⌘K)"
        >
          <Zap className="h-4 w-4" />
        </Button>
      </div>

      {/* Frequent Actions */}
      {frequentActionsList.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Frequent Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {frequentActionsList.map(action => (
                <Button
                  key={action!.id}
                  variant="ghost"
                  className="justify-start gap-3 h-auto py-3"
                  onClick={() => executeAction(action!)}
                >
                  <div className="p-1 rounded" style={{ 
                    backgroundColor: `${ACTION_CATEGORIES[action!.category].color.includes('blue') ? '#dbeafe' : 
                      ACTION_CATEGORIES[action!.category].color.includes('green') ? '#dcfce7' :
                      ACTION_CATEGORIES[action!.category].color.includes('purple') ? '#f3e8ff' :
                      ACTION_CATEGORIES[action!.category].color.includes('orange') ? '#fed7aa' :
                      ACTION_CATEGORIES[action!.category].color.includes('emerald') ? '#d1fae5' :
                      ACTION_CATEGORIES[action!.category].color.includes('gray') ? '#f3f4f6' :
                      ACTION_CATEGORIES[action!.category].color.includes('indigo') ? '#e0e7ff' :
                      ACTION_CATEGORIES[action!.category].color.includes('pink') ? '#fce7f3' :
                      '#fef3c7'}20` 
                  }}>
                    {action!.icon}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{action!.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {action!.shortcut}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Actions */}
      {recentActionsList.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActionsList.map(action => (
                <Button
                  key={action!.id}
                  variant="ghost"
                  className="w-full justify-start gap-3 h-auto py-2"
                  onClick={() => executeAction(action!)}
                >
                  {action!.icon}
                  <span className="text-sm">{action!.title}</span>
                  {action!.isExternal && <ExternalLink className="h-3 w-3 ml-auto" />}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Categories */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(ACTION_CATEGORIES).map(([key, category]) => {
          const categoryActions = allActions.filter(action => action.category === key)
          if (categoryActions.length === 0) return null

          return (
            <Card key={key} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  {category.icon}
                  {category.label}
                  <Badge variant="secondary" className="ml-auto">
                    {categoryActions.length}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {categoryActions.slice(0, 4).map(action => (
                    <Button
                      key={action.id}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 h-8"
                      onClick={() => executeAction(action)}
                    >
                      {action.icon}
                      <span className="text-xs truncate">{action.title}</span>
                      {action.shortcut && (
                        <kbd className="ml-auto text-xs bg-muted px-1 rounded">
                          {action.shortcut.replace('Ctrl+', '⌘')}
                        </kbd>
                      )}
                    </Button>
                  ))}
                  {categoryActions.length > 4 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-center text-xs text-muted-foreground"
                      onClick={() => {
                        setSelectedCategory(key as ActionCategory)
                        setIsCommandOpen(true)
                      }}
                    >
                      +{categoryActions.length - 4} more actions
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Command Palette Dialog */}
      <CommandDialog open={isCommandOpen} onOpenChange={setIsCommandOpen}>
        <CommandInput 
          placeholder="Type a command or search..." 
          value={searchTerm}
          onValueChange={setSearchTerm}
        />
        <CommandList>
          <CommandEmpty>No actions found.</CommandEmpty>
          
          {/* Recent Actions Group */}
          {recentActionsList.length > 0 && !searchTerm && (
            <CommandGroup heading="Recent">
              {recentActionsList.map(action => (
                <CommandItem
                  key={action!.id}
                  onSelect={() => executeAction(action!)}
                  className="flex items-center gap-2"
                >
                  {action!.icon}
                  <div className="flex flex-col">
                    <span>{action!.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {action!.description}
                    </span>
                  </div>
                  {action!.shortcut && (
                    <CommandShortcut>{action!.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Grouped Actions */}
          {groupedActions.map(({ category, actions }) => (
            <CommandGroup key={category} heading={ACTION_CATEGORIES[category].label}>
              {actions.map(action => (
                <CommandItem
                  key={action.id}
                  onSelect={() => executeAction(action)}
                  className="flex items-center gap-2"
                >
                  {action.icon}
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      <span>{action.title}</span>
                      {action.isExternal && <ExternalLink className="h-3 w-3" />}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {action.description}
                    </span>
                  </div>
                  {action.shortcut && (
                    <CommandShortcut>{action.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>

      {/* Keyboard Shortcuts Help */}
      <Card className="mt-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Keyboard className="h-4 w-4" />
            Keyboard Shortcuts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Open Quick Actions</span>
              <kbd className="bg-muted px-2 py-1 rounded text-xs">⌘K</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Go to Dashboard</span>
              <kbd className="bg-muted px-2 py-1 rounded text-xs">⌘D</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>View Campaigns</span>
              <kbd className="bg-muted px-2 py-1 rounded text-xs">⌘C</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Analytics & Reports</span>
              <kbd className="bg-muted px-2 py-1 rounded text-xs">⌘R</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Payment Center</span>
              <kbd className="bg-muted px-2 py-1 rounded text-xs">⌘P</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Generate Link</span>
              <kbd className="bg-muted px-2 py-1 rounded text-xs">⌘L</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Refresh Data</span>
              <kbd className="bg-muted px-2 py-1 rounded text-xs">F5</kbd>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuickActions
