"use client"

import React, { useState, useCallback, useMemo } from 'react'
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DropResult 
} from '@hello-pangea/dnd'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Settings2, 
  Plus, 
  Eye, 
  EyeOff, 
  GripVertical, 
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Calendar,
  Link,
  Bell,
  Activity,
  PieChart,
  LineChart,
  Archive,
  RefreshCw,
  Download,
  Filter,
  Search,
  Grid3X3,
  Layout,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Widget Types Definition
export interface Widget {
  id: string
  type: WidgetType
  title: string
  description: string
  icon: React.ReactNode
  category: WidgetCategory
  size: WidgetSize
  position: { x: number; y: number }
  isVisible: boolean
  config: WidgetConfig
  data?: any
}

export type WidgetType = 
  | 'revenue-chart'
  | 'balance-overview' 
  | 'recent-activity'
  | 'top-campaigns'
  | 'performance-metrics'
  | 'quick-stats'
  | 'notifications'
  | 'link-analytics'
  | 'commission-tracker'
  | 'payout-schedule'
  | 'traffic-sources'
  | 'conversion-funnel'

export type WidgetCategory = 'analytics' | 'financial' | 'campaigns' | 'tools' | 'notifications'

export type WidgetSize = 'small' | 'medium' | 'large' | 'extra-large'

export interface WidgetConfig {
  refreshInterval?: number
  dateRange?: string
  showLegend?: boolean
  chartType?: string
  maxItems?: number
  customTitle?: string
  theme?: 'light' | 'dark'
  compactMode?: boolean
}

export interface DashboardLayout {
  id: string
  name: string
  widgets: Widget[]
  columns: number
  isDefault: boolean
  createdAt: Date
}

// Available Widgets Catalog
const AVAILABLE_WIDGETS: Omit<Widget, 'id' | 'position' | 'isVisible' | 'config'>[] = [
  {
    type: 'revenue-chart',
    title: 'Revenue Chart',
    description: 'Track your earnings over time with interactive charts',
    icon: <BarChart3 className="h-4 w-4" />,
    category: 'analytics',
    size: 'large',
    data: null
  },
  {
    type: 'balance-overview',
    title: 'Balance Overview',
    description: 'Current balance and pending payments summary',
    icon: <DollarSign className="h-4 w-4" />,
    category: 'financial',
    size: 'medium',
    data: null
  },
  {
    type: 'recent-activity',
    title: 'Recent Activity',
    description: 'Latest clicks, conversions, and transactions',
    icon: <Activity className="h-4 w-4" />,
    category: 'analytics',
    size: 'medium',
    data: null
  },
  {
    type: 'top-campaigns',
    title: 'Top Campaigns',
    description: 'Best performing campaigns this month',
    icon: <Target className="h-4 w-4" />,
    category: 'campaigns',
    size: 'medium',
    data: null
  },
  {
    type: 'performance-metrics',
    title: 'Performance Metrics',
    description: 'Key performance indicators and trends',
    icon: <TrendingUp className="h-4 w-4" />,
    category: 'analytics',
    size: 'large',
    data: null
  },
  {
    type: 'quick-stats',
    title: 'Quick Stats',
    description: 'Essential metrics at a glance',
    icon: <PieChart className="h-4 w-4" />,
    category: 'analytics',
    size: 'small',
    data: null
  },
  {
    type: 'notifications',
    title: 'Notifications',
    description: 'Recent alerts and system messages',
    icon: <Bell className="h-4 w-4" />,
    category: 'notifications',
    size: 'medium',
    data: null
  },
  {
    type: 'link-analytics',
    title: 'Link Analytics',
    description: 'Click tracking and link performance',
    icon: <Link className="h-4 w-4" />,
    category: 'tools',
    size: 'large',
    data: null
  },
  {
    type: 'commission-tracker',
    title: 'Commission Tracker',
    description: 'Track commission earnings by source',
    icon: <LineChart className="h-4 w-4" />,
    category: 'financial',
    size: 'medium',
    data: null
  },
  {
    type: 'payout-schedule',
    title: 'Payout Schedule',
    description: 'Upcoming payments and payout calendar',
    icon: <Calendar className="h-4 w-4" />,
    category: 'financial',
    size: 'medium',
    data: null
  },
  {
    type: 'traffic-sources',
    title: 'Traffic Sources',
    description: 'Breakdown of traffic by source and medium',
    icon: <Users className="h-4 w-4" />,
    category: 'analytics',
    size: 'medium',
    data: null
  },
  {
    type: 'conversion-funnel',
    title: 'Conversion Funnel',
    description: 'Visualize the customer conversion process',
    icon: <Filter className="h-4 w-4" />,
    category: 'analytics',
    size: 'large',
    data: null
  }
]

// Widget Size Configurations
const WIDGET_SIZES = {
  small: { cols: 1, rows: 1, className: 'col-span-1 row-span-1' },
  medium: { cols: 2, rows: 1, className: 'col-span-1 md:col-span-2 row-span-1' },
  large: { cols: 3, rows: 2, className: 'col-span-1 md:col-span-2 lg:col-span-3 row-span-2' },
  'extra-large': { cols: 4, rows: 3, className: 'col-span-1 md:col-span-2 lg:col-span-4 row-span-3' }
}

// Sample Data Generator (Replace with real data in production)
const generateSampleData = (widgetType: WidgetType) => {
  switch (widgetType) {
    case 'revenue-chart':
      return {
        data: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 1000) + 500
        })),
        total: 25670
      }
    case 'balance-overview':
      return {
        currentBalance: 12450.50,
        pendingPayments: 3200.00,
        lastPayout: 8900.00,
        nextPayoutDate: '2024-02-15'
      }
    case 'quick-stats':
      return {
        clicks: 15420,
        conversions: 342,
        conversionRate: 2.22,
        averageEarnings: 36.50
      }
    case 'top-campaigns':
      return [
        { id: 1, name: 'Summer Fashion Sale', revenue: 2450, clicks: 1240, conversionRate: 3.2 },
        { id: 2, name: 'Tech Gadgets Promo', revenue: 1850, clicks: 980, conversionRate: 2.8 },
        { id: 3, name: 'Home & Garden', revenue: 1200, clicks: 750, conversionRate: 2.1 }
      ]
    case 'recent-activity':
      return [
        { type: 'click', description: 'Campaign: Summer Sale', timestamp: '2 minutes ago', amount: null },
        { type: 'conversion', description: 'Order #12345 confirmed', timestamp: '15 minutes ago', amount: 45.50 },
        { type: 'payout', description: 'Payment processed', timestamp: '2 hours ago', amount: 890.00 }
      ]
    default:
      return null
  }
}

interface WidgetSystemProps {
  initialLayout?: DashboardLayout
  onLayoutChange?: (layout: DashboardLayout) => void
}

export function WidgetSystem({ initialLayout, onLayoutChange }: WidgetSystemProps) {
  const { toast } = useToast()
  
  // Current dashboard state
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout>(
    initialLayout || {
      id: 'default',
      name: 'Default Dashboard',
      widgets: AVAILABLE_WIDGETS.slice(0, 6).map((widget, index) => ({
        ...widget,
        id: `widget-${index}`,
        position: { x: index % 3, y: Math.floor(index / 3) },
        isVisible: true,
        config: {
          refreshInterval: 300000, // 5 minutes
          dateRange: '30d',
          showLegend: true,
          maxItems: 10,
          theme: 'light',
          compactMode: false
        },
        data: generateSampleData(widget.type)
      })),
      columns: 3,
      isDefault: true,
      createdAt: new Date()
    }
  )

  // Layout management state
  const [savedLayouts, setSavedLayouts] = useState<DashboardLayout[]>([currentLayout])
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Widget management
  const addWidget = useCallback((widgetType: WidgetType) => {
    const widgetTemplate = AVAILABLE_WIDGETS.find(w => w.type === widgetType)
    if (!widgetTemplate) return

    const newWidget: Widget = {
      ...widgetTemplate,
      id: `widget-${Date.now()}`,
      position: { x: 0, y: 0 },
      isVisible: true,
      config: {
        refreshInterval: 300000,
        dateRange: '30d',
        showLegend: true,
        maxItems: 10,
        theme: 'light',
        compactMode: false
      },
      data: generateSampleData(widgetType)
    }

    setCurrentLayout(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget]
    }))

    toast({
      title: "Widget Added",
      description: `${widgetTemplate.title} has been added to your dashboard.`
    })
  }, [toast])

  const removeWidget = useCallback((widgetId: string) => {
    setCurrentLayout(prev => ({
      ...prev,
      widgets: prev.widgets.filter(w => w.id !== widgetId)
    }))

    toast({
      title: "Widget Removed",
      description: "Widget has been removed from your dashboard."
    })
  }, [toast])

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setCurrentLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(w => 
        w.id === widgetId ? { ...w, isVisible: !w.isVisible } : w
      )
    }))
  }, [])

  const updateWidgetConfig = useCallback((widgetId: string, config: Partial<WidgetConfig>) => {
    setCurrentLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(w => 
        w.id === widgetId ? { ...w, config: { ...w.config, ...config } } : w
      )
    }))
  }, [])

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result
    const newWidgets = Array.from(currentLayout.widgets)
    const [reorderedWidget] = newWidgets.splice(source.index, 1)
    newWidgets.splice(destination.index, 0, reorderedWidget)

    setCurrentLayout(prev => ({
      ...prev,
      widgets: newWidgets
    }))
  }, [currentLayout.widgets])

  const saveLayout = useCallback((name?: string) => {
    const layoutName = name || `Layout ${savedLayouts.length + 1}`
    const newLayout: DashboardLayout = {
      ...currentLayout,
      id: `layout-${Date.now()}`,
      name: layoutName,
      isDefault: false,
      createdAt: new Date()
    }

    setSavedLayouts(prev => [...prev, newLayout])
    onLayoutChange?.(newLayout)

    toast({
      title: "Layout Saved",
      description: `Dashboard layout "${layoutName}" has been saved.`
    })
  }, [currentLayout, savedLayouts.length, onLayoutChange, toast])

  const loadLayout = useCallback((layout: DashboardLayout) => {
    setCurrentLayout(layout)
    toast({
      title: "Layout Loaded",
      description: `Dashboard layout "${layout.name}" has been loaded.`
    })
  }, [toast])

  // Filter widgets by search term
  const filteredAvailableWidgets = useMemo(() => {
    return AVAILABLE_WIDGETS.filter(widget =>
      widget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      widget.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      widget.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  // Group widgets by category
  const widgetsByCategory = useMemo(() => {
    return filteredAvailableWidgets.reduce((acc, widget) => {
      if (!acc[widget.category]) {
        acc[widget.category] = []
      }
      acc[widget.category].push(widget)
      return acc
    }, {} as Record<WidgetCategory, typeof AVAILABLE_WIDGETS>)
  }, [filteredAvailableWidgets])

  const refreshAllWidgets = useCallback(() => {
    setCurrentLayout(prev => ({
      ...prev,
      widgets: prev.widgets.map(widget => ({
        ...widget,
        data: generateSampleData(widget.type)
      }))
    }))

    toast({
      title: "Widgets Refreshed",
      description: "All widget data has been updated."
    })
  }, [toast])

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            {currentLayout.name} • {currentLayout.widgets.filter(w => w.isVisible).length} widgets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAllWidgets}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Layout className="h-4 w-4" />
                Layouts
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Manage Dashboard Layouts</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Layout name"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        saveLayout(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  <Button onClick={() => saveLayout()}>Save Current</Button>
                </div>

                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {savedLayouts.map((layout) => (
                    <div
                      key={layout.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card"
                    >
                      <div>
                        <p className="font-medium">{layout.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {layout.widgets.length} widgets • {layout.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {layout.isDefault && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => loadLayout(layout)}
                        >
                          Load
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant={isCustomizing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
            className="gap-2"
          >
            <Settings2 className="h-4 w-4" />
            {isCustomizing ? 'Done' : 'Customize'}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Widget
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Widgets to Dashboard</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search widgets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                    <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                    <TabsTrigger value="tools">Tools</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredAvailableWidgets.map((widget) => (
                        <Card key={widget.type} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {widget.icon}
                                <CardTitle className="text-sm">{widget.title}</CardTitle>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {widget.size}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-muted-foreground mb-3">
                              {widget.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">
                                {widget.category}
                              </Badge>
                              <Button 
                                size="sm"
                                onClick={() => addWidget(widget.type)}
                                disabled={currentLayout.widgets.some(w => w.type === widget.type)}
                              >
                                {currentLayout.widgets.some(w => w.type === widget.type) ? 'Added' : 'Add'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {Object.entries(widgetsByCategory).map(([category, widgets]) => (
                    <TabsContent key={category} value={category} className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {widgets.map((widget) => (
                          <Card key={widget.type} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {widget.icon}
                                  <CardTitle className="text-sm">{widget.title}</CardTitle>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {widget.size}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-sm text-muted-foreground mb-3">
                                {widget.description}
                              </p>
                              <Button 
                                size="sm"
                                onClick={() => addWidget(widget.type)}
                                disabled={currentLayout.widgets.some(w => w.type === widget.type)}
                                className="w-full"
                              >
                                {currentLayout.widgets.some(w => w.type === widget.type) ? 'Added' : 'Add'}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Customization Panel */}
      {isCustomizing && (
        <Card className="p-4 border-dashed">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Widget Management</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentLayout(prev => ({
                  ...prev,
                  columns: prev.columns === 2 ? 3 : prev.columns === 3 ? 4 : 2
                }))}
                className="gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                {currentLayout.columns} Columns
              </Button>
            </div>
          </div>

          <div className="grid gap-2 max-h-40 overflow-y-auto">
            {currentLayout.widgets.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between p-2 rounded-lg border bg-background"
              >
                <div className="flex items-center gap-3">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  {widget.icon}
                  <span className="font-medium text-sm">{widget.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {widget.size}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={widget.isVisible}
                    onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedWidget(widget)}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWidget(widget.id)}
                  >
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Widget Configuration Dialog */}
      {selectedWidget && (
        <Dialog open={!!selectedWidget} onOpenChange={() => setSelectedWidget(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedWidget.icon}
                Configure {selectedWidget.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="customTitle">Custom Title</Label>
                <Input
                  id="customTitle"
                  value={selectedWidget.config.customTitle || selectedWidget.title}
                  onChange={(e) => updateWidgetConfig(selectedWidget.id, { customTitle: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="refreshInterval">Refresh Interval (minutes)</Label>
                <Input
                  id="refreshInterval"
                  type="number"
                  min="1"
                  max="1440"
                  value={(selectedWidget.config.refreshInterval || 300000) / 60000}
                  onChange={(e) => updateWidgetConfig(selectedWidget.id, { 
                    refreshInterval: parseInt(e.target.value) * 60000 
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showLegend">Show Legend</Label>
                <Switch
                  id="showLegend"
                  checked={selectedWidget.config.showLegend}
                  onCheckedChange={(checked) => updateWidgetConfig(selectedWidget.id, { showLegend: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="compactMode">Compact Mode</Label>
                <Switch
                  id="compactMode"
                  checked={selectedWidget.config.compactMode}
                  onCheckedChange={(checked) => updateWidgetConfig(selectedWidget.id, { compactMode: checked })}
                />
              </div>

              {(selectedWidget.type === 'recent-activity' || selectedWidget.type === 'top-campaigns') && (
                <div className="grid gap-2">
                  <Label htmlFor="maxItems">Maximum Items</Label>
                  <Input
                    id="maxItems"
                    type="number"
                    min="1"
                    max="50"
                    value={selectedWidget.config.maxItems || 10}
                    onChange={(e) => updateWidgetConfig(selectedWidget.id, { 
                      maxItems: parseInt(e.target.value) 
                    })}
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dashboard Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`grid gap-4 auto-rows-fr ${
                currentLayout.columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
                currentLayout.columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}
            >
              {currentLayout.widgets
                .filter(widget => widget.isVisible)
                .map((widget, index) => (
                  <Draggable
                    key={widget.id}
                    draggableId={widget.id}
                    index={index}
                    isDragDisabled={!isCustomizing}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${WIDGET_SIZES[widget.size].className} ${
                          snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/20' : ''
                        }`}
                      >
                        <WidgetRenderer
                          widget={widget}
                          isCustomizing={isCustomizing}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

// Widget Renderer Component
interface WidgetRendererProps {
  widget: Widget
  isCustomizing: boolean
  dragHandleProps: any
}

function WidgetRenderer({ widget, isCustomizing, dragHandleProps }: WidgetRendererProps) {
  const renderWidgetContent = () => {
    const { data, config } = widget

    switch (widget.type) {
      case 'revenue-chart':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${data?.total?.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Revenue Chart Visualization</p>
            </div>
          </div>
        )

      case 'balance-overview':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-lg font-bold">${data?.currentBalance?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-lg font-bold text-orange-600">${data?.pendingPayments?.toLocaleString()}</p>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">Next payout: {data?.nextPayoutDate}</p>
            </div>
          </div>
        )

      case 'quick-stats':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold">{data?.clicks?.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Clicks</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{data?.conversions}</p>
              <p className="text-xs text-muted-foreground">Conversions</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{data?.conversionRate}%</p>
              <p className="text-xs text-muted-foreground">Conv. Rate</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">${data?.averageEarnings}</p>
              <p className="text-xs text-muted-foreground">Avg. Earnings</p>
            </div>
          </div>
        )

      case 'top-campaigns':
        return (
          <div className="space-y-3">
            {data?.slice(0, config.maxItems || 3).map((campaign: any, index: number) => (
              <div key={campaign.id} className="flex items-center justify-between p-2 rounded border">
                <div className="flex-1">
                  <p className="font-medium text-sm truncate">{campaign.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {campaign.clicks} clicks • {campaign.conversionRate}% conv.
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">${campaign.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        )

      case 'recent-activity':
        return (
          <div className="space-y-3">
            {data?.slice(0, config.maxItems || 5).map((activity: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'conversion' ? 'bg-green-500' :
                  activity.type === 'payout' ? 'bg-blue-500' : 'bg-gray-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                </div>
                {activity.amount && (
                  <p className="text-sm font-medium">${activity.amount}</p>
                )}
              </div>
            ))}
          </div>
        )

      default:
        return (
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <div className="text-center">
              {widget.icon}
              <p className="text-sm mt-2">Widget content coming soon</p>
            </div>
          </div>
        )
    }
  }

  return (
    <Card className={`h-full ${isCustomizing ? 'ring-2 ring-dashed ring-muted-foreground/20' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isCustomizing && (
              <div {...dragHandleProps} className="cursor-grab">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            {widget.icon}
            <CardTitle className="text-sm">
              {widget.config.customTitle || widget.title}
            </CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {widget.config.compactMode && (
              <Minimize2 className="h-3 w-3 text-muted-foreground" />
            )}
            <Badge variant="outline" className="text-xs">
              {widget.size}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className={widget.config.compactMode ? "pt-0 pb-3" : "pt-0"}>
        {renderWidgetContent()}
      </CardContent>
    </Card>
  )
}

export default WidgetSystem
