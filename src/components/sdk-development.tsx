"use client"

import React, { useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { 
  Code, 
  Download, 
  Copy, 
  ExternalLink, 
  Book, 
  Terminal, 
  Package, 
  Key, 
  Settings, 
  Globe, 
  Smartphone, 
  Monitor, 
  Zap, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Github, 
  Npm,
  Play,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Search,
  Filter,
  BarChart3,
  Activity,
  Users,
  Target,
  Link,
  DollarSign,
  Calendar,
  Bell,
  Database,
  Cloud,
  Lock,
  Unlock,
  Star,
  Heart,
  Bookmark,
  Share,
  Archive,
  Clock,
  TrendingUp,
  Layers,
  Box,
  Cpu,
  HardDrive,
  Network,
  Server
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// SDK Types and Interfaces
export interface SDKPackage {
  id: string
  name: string
  displayName: string
  description: string
  version: string
  platform: SDKPlatform
  language: ProgrammingLanguage
  category: SDKCategory
  status: SDKStatus
  downloadUrl: string
  documentationUrl: string
  repositoryUrl?: string
  packageManager?: string
  installCommand: string
  size: string
  lastUpdated: Date
  downloads: number
  rating: number
  features: string[]
  dependencies: string[]
  examples: CodeExample[]
  changelog: ChangelogEntry[]
  isOfficial: boolean
  maintainer: string
  license: string
}

export type SDKPlatform = 'web' | 'mobile' | 'desktop' | 'server' | 'universal'
export type ProgrammingLanguage = 'javascript' | 'typescript' | 'python' | 'php' | 'java' | 'csharp' | 'go' | 'ruby' | 'swift' | 'kotlin' | 'dart'
export type SDKCategory = 'core' | 'tracking' | 'analytics' | 'ui' | 'utilities' | 'payments' | 'authentication'
export type SDKStatus = 'stable' | 'beta' | 'alpha' | 'deprecated' | 'development'

export interface CodeExample {
  id: string
  title: string
  description: string
  language: ProgrammingLanguage
  code: string
  category: 'quickstart' | 'advanced' | 'integration' | 'custom'
}

export interface ChangelogEntry {
  version: string
  date: Date
  changes: string[]
  type: 'major' | 'minor' | 'patch'
}

export interface APIKey {
  id: string
  name: string
  key: string
  permissions: string[]
  createdAt: Date
  lastUsed?: Date
  isActive: boolean
  environment: 'development' | 'staging' | 'production'
  rateLimit: number
  usage: {
    requests: number
    period: string
  }
}

// Sample SDK data
const SAMPLE_SDKS: SDKPackage[] = [
  {
    id: 'accesstrade-js',
    name: 'accesstrade-js',
    displayName: 'AccessTrade JavaScript SDK',
    description: 'Official JavaScript SDK for AccessTrade affiliate platform with comprehensive tracking and analytics capabilities.',
    version: '2.1.4',
    platform: 'web',
    language: 'javascript',
    category: 'core',
    status: 'stable',
    downloadUrl: 'https://cdn.jsdelivr.net/npm/accesstrade-js@latest/dist/accesstrade.min.js',
    documentationUrl: 'https://docs.accesstrade.vn/sdk/javascript',
    repositoryUrl: 'https://github.com/accesstrade-vn/accesstrade-js',
    packageManager: 'npm',
    installCommand: 'npm install accesstrade-js',
    size: '45.2 KB',
    lastUpdated: new Date('2024-01-15'),
    downloads: 15420,
    rating: 4.8,
    features: [
      'Link tracking',
      'Conversion tracking',
      'Real-time analytics',
      'Custom events',
      'A/B testing',
      'Revenue attribution'
    ],
    dependencies: [],
    examples: [
      {
        id: 'js-quickstart',
        title: 'Quick Start',
        description: 'Basic initialization and link tracking',
        language: 'javascript',
        category: 'quickstart',
        code: `// Initialize AccessTrade SDK
import AccessTrade from 'accesstrade-js';

const at = new AccessTrade({
  apiKey: 'your-api-key',
  environment: 'production'
});

// Track affiliate link click
at.trackClick('campaign-id', {
  userId: 'user-123',
  source: 'website',
  medium: 'banner'
});

// Track conversion
at.trackConversion('order-456', {
  campaignId: 'campaign-id',
  revenue: 29.99,
  currency: 'USD'
});`
      },
      {
        id: 'js-advanced',
        title: 'Advanced Tracking',
        description: 'Custom events and detailed analytics',
        language: 'javascript',
        category: 'advanced',
        code: `// Custom event tracking
at.trackEvent('product_view', {
  productId: 'product-123',
  category: 'electronics',
  value: 299.99,
  customData: {
    brand: 'TechBrand',
    model: 'TB-2024'
  }
});

// Revenue attribution
at.attributeRevenue({
  orderId: 'order-789',
  items: [
    { sku: 'ITEM-001', price: 19.99, quantity: 2 },
    { sku: 'ITEM-002', price: 29.99, quantity: 1 }
  ],
  shippingCost: 5.99,
  tax: 4.50
});`
      }
    ],
    changelog: [
      {
        version: '2.1.4',
        date: new Date('2024-01-15'),
        type: 'patch',
        changes: [
          'Fixed Safari tracking issues',
          'Improved error handling',
          'Updated TypeScript definitions'
        ]
      },
      {
        version: '2.1.0',
        date: new Date('2024-01-01'),
        type: 'minor',
        changes: [
          'Added A/B testing support',
          'New revenue attribution methods',
          'Performance improvements'
        ]
      }
    ],
    isOfficial: true,
    maintainer: 'AccessTrade Team',
    license: 'MIT'
  },
  {
    id: 'accesstrade-python',
    name: 'accesstrade-python',
    displayName: 'AccessTrade Python SDK',
    description: 'Python SDK for server-side integration with AccessTrade APIs, perfect for data analysis and backend automation.',
    version: '1.3.2',
    platform: 'server',
    language: 'python',
    category: 'core',
    status: 'stable',
    downloadUrl: 'https://pypi.org/project/accesstrade/',
    documentationUrl: 'https://docs.accesstrade.vn/sdk/python',
    repositoryUrl: 'https://github.com/accesstrade-vn/accesstrade-python',
    packageManager: 'pip',
    installCommand: 'pip install accesstrade',
    size: '125 KB',
    lastUpdated: new Date('2024-01-10'),
    downloads: 8950,
    rating: 4.6,
    features: [
      'Campaign management',
      'Analytics API',
      'Bulk operations',
      'Data export',
      'Webhook handling',
      'Rate limiting'
    ],
    dependencies: ['requests>=2.25.0', 'python-dateutil>=2.8.0'],
    examples: [
      {
        id: 'py-quickstart',
        title: 'Getting Started',
        description: 'Initialize client and fetch campaigns',
        language: 'python',
        category: 'quickstart',
        code: `import accesstrade

# Initialize client
client = accesstrade.Client(
    api_key='your-api-key',
    secret_key='your-secret-key',
    environment='production'
)

# Get campaigns
campaigns = client.campaigns.list(
    status='active',
    limit=50
)

for campaign in campaigns:
    print(f"Campaign: {campaign.name} - Rate: {campaign.commission_rate}%")`
      },
      {
        id: 'py-analytics',
        title: 'Analytics Data',
        description: 'Fetch performance analytics and reports',
        language: 'python',
        category: 'advanced',
        code: `from datetime import datetime, timedelta

# Get performance report
report = client.analytics.performance(
    start_date=datetime.now() - timedelta(days=30),
    end_date=datetime.now(),
    group_by=['campaign_id', 'date'],
    metrics=['clicks', 'conversions', 'revenue']
)

# Export to CSV
client.analytics.export_csv(
    report_id=report.id,
    filename='performance_report.csv'
)`
      }
    ],
    changelog: [
      {
        version: '1.3.2',
        date: new Date('2024-01-10'),
        type: 'patch',
        changes: [
          'Fixed timezone handling',
          'Improved error messages',
          'Added retry mechanism'
        ]
      }
    ],
    isOfficial: true,
    maintainer: 'AccessTrade Team',
    license: 'MIT'
  },
  {
    id: 'accesstrade-react',
    name: 'accesstrade-react',
    displayName: 'AccessTrade React Components',
    description: 'Pre-built React components for quick integration of AccessTrade features into your React applications.',
    version: '1.2.0',
    platform: 'web',
    language: 'typescript',
    category: 'ui',
    status: 'stable',
    downloadUrl: 'https://www.npmjs.com/package/accesstrade-react',
    documentationUrl: 'https://docs.accesstrade.vn/sdk/react',
    repositoryUrl: 'https://github.com/accesstrade-vn/accesstrade-react',
    packageManager: 'npm',
    installCommand: 'npm install accesstrade-react',
    size: '78.5 KB',
    lastUpdated: new Date('2024-01-08'),
    downloads: 3240,
    rating: 4.7,
    features: [
      'Ready-to-use components',
      'TypeScript support',
      'Customizable themes',
      'Responsive design',
      'Built-in analytics',
      'SSR compatible'
    ],
    dependencies: ['react>=16.8.0', 'react-dom>=16.8.0'],
    examples: [
      {
        id: 'react-components',
        title: 'React Components',
        description: 'Using pre-built AccessTrade components',
        language: 'typescript',
        category: 'quickstart',
        code: `import { 
  AccessTradeProvider, 
  CampaignGrid, 
  RevenueChart, 
  LinkGenerator 
} from 'accesstrade-react';

function App() {
  return (
    <AccessTradeProvider apiKey="your-api-key">
      <div className="container">
        <RevenueChart 
          dateRange="30d" 
          showComparison={true} 
        />
        
        <CampaignGrid 
          category="fashion"
          limit={12}
          onCampaignClick={handleCampaignClick}
        />
        
        <LinkGenerator 
          onLinkGenerated={handleLinkGenerated}
        />
      </div>
    </AccessTradeProvider>
  );
}`
      }
    ],
    changelog: [
      {
        version: '1.2.0',
        date: new Date('2024-01-08'),
        type: 'minor',
        changes: [
          'Added dark mode support',
          'New CampaignGrid component',
          'Improved accessibility'
        ]
      }
    ],
    isOfficial: true,
    maintainer: 'AccessTrade Team',
    license: 'MIT'
  },
  {
    id: 'accesstrade-php',
    name: 'accesstrade-php',
    displayName: 'AccessTrade PHP SDK',
    description: 'PHP SDK for integrating AccessTrade affiliate functionality into WordPress plugins and PHP applications.',
    version: '2.0.1',
    platform: 'server',
    language: 'php',
    category: 'core',
    status: 'stable',
    downloadUrl: 'https://packagist.org/packages/accesstrade/php-sdk',
    documentationUrl: 'https://docs.accesstrade.vn/sdk/php',
    repositoryUrl: 'https://github.com/accesstrade-vn/accesstrade-php',
    packageManager: 'composer',
    installCommand: 'composer require accesstrade/php-sdk',
    size: '95 KB',
    lastUpdated: new Date('2024-01-05'),
    downloads: 5670,
    rating: 4.5,
    features: [
      'PSR-4 compliant',
      'Laravel integration',
      'WordPress plugin support',
      'Caching layer',
      'Error handling',
      'Unit tested'
    ],
    dependencies: ['php>=7.4', 'guzzlehttp/guzzle>=7.0'],
    examples: [
      {
        id: 'php-basic',
        title: 'Basic Usage',
        description: 'Initialize and make API calls',
        language: 'php',
        category: 'quickstart',
        code: `<?php
require_once 'vendor/autoload.php';

use AccessTrade\\Client;

$client = new Client([
    'api_key' => 'your-api-key',
    'secret_key' => 'your-secret-key',
    'environment' => 'production'
]);

// Get campaigns
$campaigns = $client->campaigns()->list([
    'status' => 'active',
    'category' => 'fashion'
]);

foreach ($campaigns as $campaign) {
    echo "Campaign: {$campaign->name}\\n";
    echo "Commission: {$campaign->commission_rate}%\\n";
}`
      }
    ],
    changelog: [
      {
        version: '2.0.1',
        date: new Date('2024-01-05'),
        type: 'patch',
        changes: [
          'PHP 8.2 compatibility',
          'Fixed namespace issues',
          'Updated dependencies'
        ]
      }
    ],
    isOfficial: true,
    maintainer: 'AccessTrade Team',
    license: 'MIT'
  },
  {
    id: 'accesstrade-flutter',
    name: 'accesstrade_flutter',
    displayName: 'AccessTrade Flutter Plugin',
    description: 'Flutter plugin for mobile app integration with AccessTrade affiliate tracking and monetization features.',
    version: '0.5.2',
    platform: 'mobile',
    language: 'dart',
    category: 'core',
    status: 'beta',
    downloadUrl: 'https://pub.dev/packages/accesstrade_flutter',
    documentationUrl: 'https://docs.accesstrade.vn/sdk/flutter',
    repositoryUrl: 'https://github.com/accesstrade-vn/accesstrade-flutter',
    packageManager: 'pub',
    installCommand: 'flutter pub add accesstrade_flutter',
    size: '156 KB',
    lastUpdated: new Date('2024-01-03'),
    downloads: 1250,
    rating: 4.3,
    features: [
      'iOS and Android support',
      'Deep link handling',
      'In-app purchases',
      'Push notifications',
      'Offline tracking',
      'Analytics dashboard'
    ],
    dependencies: ['flutter>=2.5.0'],
    examples: [
      {
        id: 'flutter-init',
        title: 'Flutter Integration',
        description: 'Initialize plugin and track events',
        language: 'dart',
        category: 'quickstart',
        code: `import 'package:accesstrade_flutter/accesstrade_flutter.dart';

class _MyAppState extends State<MyApp> {
  @override
  void initState() {
    super.initState();
    
    // Initialize AccessTrade
    AccessTradeFlutter.initialize(
      apiKey: 'your-api-key',
      environment: Environment.production,
    );
  }

  void trackPurchase() async {
    await AccessTradeFlutter.trackConversion(
      orderId: 'order-123',
      revenue: 29.99,
      currency: 'USD',
      items: [
        ConversionItem(
          sku: 'ITEM-001',
          name: 'Product Name',
          price: 29.99,
          quantity: 1,
        )
      ],
    );
  }
}`
      }
    ],
    changelog: [
      {
        version: '0.5.2',
        date: new Date('2024-01-03'),
        type: 'patch',
        changes: [
          'iOS 17 compatibility',
          'Android 14 support',
          'Bug fixes'
        ]
      }
    ],
    isOfficial: true,
    maintainer: 'AccessTrade Team',
    license: 'MIT'
  }
]

// Sample API Keys
const SAMPLE_API_KEYS: APIKey[] = [
  {
    id: 'key-1',
    name: 'Production Website',
    key: 'at_prod_abc123....',
    permissions: ['campaigns:read', 'analytics:read', 'tracking:write'],
    createdAt: new Date('2024-01-01'),
    lastUsed: new Date('2024-01-15'),
    isActive: true,
    environment: 'production',
    rateLimit: 10000,
    usage: {
      requests: 8750,
      period: 'monthly'
    }
  },
  {
    id: 'key-2',
    name: 'Development Testing',
    key: 'at_dev_xyz789....',
    permissions: ['campaigns:read', 'analytics:read'],
    createdAt: new Date('2024-01-10'),
    lastUsed: new Date('2024-01-14'),
    isActive: true,
    environment: 'development',
    rateLimit: 1000,
    usage: {
      requests: 245,
      period: 'monthly'
    }
  }
]

interface SDKDevelopmentProps {
  className?: string
}

export function SDKDevelopment({ className }: SDKDevelopmentProps) {
  const { toast } = useToast()

  // State management
  const [selectedSDK, setSelectedSDK] = useState<SDKPackage | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<SDKCategory | 'all'>('all')
  const [selectedPlatform, setSelectedPlatform] = useState<SDKPlatform | 'all'>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [apiKeys, setApiKeys] = useState(SAMPLE_API_KEYS)
  const [isCreateKeyOpen, setIsCreateKeyOpen] = useState(false)
  const [selectedExample, setSelectedExample] = useState<CodeExample | null>(null)

  // API Key form
  const [keyForm, setKeyForm] = useState({
    name: '',
    environment: 'development' as 'development' | 'staging' | 'production',
    permissions: [] as string[]
  })

  // Filtered SDKs
  const filteredSDKs = useMemo(() => {
    return SAMPLE_SDKS.filter(sdk => {
      const matchesSearch = !searchTerm || 
        sdk.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sdk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sdk.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCategory = selectedCategory === 'all' || sdk.category === selectedCategory
      const matchesPlatform = selectedPlatform === 'all' || sdk.platform === selectedPlatform
      const matchesLanguage = selectedLanguage === 'all' || sdk.language === selectedLanguage

      return matchesSearch && matchesCategory && matchesPlatform && matchesLanguage
    })
  }, [searchTerm, selectedCategory, selectedPlatform, selectedLanguage])

  // Copy code to clipboard
  const copyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code Copied",
      description: "Code has been copied to clipboard."
    })
  }, [toast])

  // Generate API key
  const generateApiKey = useCallback(() => {
    const environments = {
      development: 'dev',
      staging: 'stg',
      production: 'prod'
    }

    const newKey: APIKey = {
      id: `key-${Date.now()}`,
      name: keyForm.name,
      key: `at_${environments[keyForm.environment]}_${Math.random().toString(36).substring(2, 15)}`,
      permissions: keyForm.permissions,
      createdAt: new Date(),
      isActive: true,
      environment: keyForm.environment,
      rateLimit: keyForm.environment === 'production' ? 10000 : 1000,
      usage: {
        requests: 0,
        period: 'monthly'
      }
    }

    setApiKeys(prev => [...prev, newKey])
    setKeyForm({ name: '', environment: 'development', permissions: [] })
    setIsCreateKeyOpen(false)

    toast({
      title: "API Key Generated",
      description: `New ${keyForm.environment} API key has been created.`
    })
  }, [keyForm, toast])

  // Revoke API key
  const revokeApiKey = useCallback((keyId: string) => {
    setApiKeys(prev => prev.map(key => 
      key.id === keyId ? { ...key, isActive: false } : key
    ))

    toast({
      title: "API Key Revoked",
      description: "The API key has been deactivated."
    })
  }, [toast])

  // Status badge color
  const getStatusColor = (status: SDKStatus) => {
    switch (status) {
      case 'stable': return 'bg-green-100 text-green-800'
      case 'beta': return 'bg-blue-100 text-blue-800'
      case 'alpha': return 'bg-yellow-100 text-yellow-800'
      case 'deprecated': return 'bg-red-100 text-red-800'
      case 'development': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Platform icon
  const getPlatformIcon = (platform: SDKPlatform) => {
    switch (platform) {
      case 'web': return <Globe className="h-4 w-4" />
      case 'mobile': return <Smartphone className="h-4 w-4" />
      case 'desktop': return <Monitor className="h-4 w-4" />
      case 'server': return <Server className="h-4 w-4" />
      case 'universal': return <Layers className="h-4 w-4" />
      default: return <Box className="h-4 w-4" />
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">SDK Development</h2>
          <p className="text-muted-foreground">
            Official SDKs and tools for AccessTrade integration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Book className="h-4 w-4" />
            Documentation
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Github className="h-4 w-4" />
            GitHub
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sdks" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sdks">SDKs & Libraries</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="examples">Code Examples</TabsTrigger>
          <TabsTrigger value="tools">Developer Tools</TabsTrigger>
        </TabsList>

        {/* SDKs Tab */}
        <TabsContent value="sdks" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search SDKs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as SDKCategory | 'all')}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Categories</option>
                <option value="core">Core SDKs</option>
                <option value="tracking">Tracking</option>
                <option value="analytics">Analytics</option>
                <option value="ui">UI Components</option>
                <option value="utilities">Utilities</option>
                <option value="payments">Payments</option>
                <option value="authentication">Authentication</option>
              </select>

              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as SDKPlatform | 'all')}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Platforms</option>
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="desktop">Desktop</option>
                <option value="server">Server</option>
                <option value="universal">Universal</option>
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as ProgrammingLanguage | 'all')}
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Languages</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="php">PHP</option>
                <option value="java">Java</option>
                <option value="csharp">C#</option>
                <option value="go">Go</option>
                <option value="ruby">Ruby</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
                <option value="dart">Dart</option>
              </select>
            </div>
          </div>

          {/* SDK Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSDKs.map(sdk => (
              <Card key={sdk.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(sdk.platform)}
                      <div>
                        <CardTitle className="text-lg">{sdk.displayName}</CardTitle>
                        <p className="text-sm text-muted-foreground">v{sdk.version}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {sdk.isOfficial && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Official
                        </Badge>
                      )}
                      <Badge className={getStatusColor(sdk.status)} variant="secondary">
                        {sdk.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {sdk.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {sdk.downloads.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {sdk.rating}
                      </div>
                    </div>
                    <span>{sdk.size}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {sdk.features.slice(0, 3).map(feature => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {sdk.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{sdk.features.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => setSelectedSDK(sdk)}
                        className="gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCode(sdk.installCommand)}
                        className="gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Install
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      {sdk.repositoryUrl && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(sdk.repositoryUrl, '_blank')}
                          className="h-8 w-8 p-0"
                        >
                          <Github className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(sdk.documentationUrl, '_blank')}
                        className="h-8 w-8 p-0"
                      >
                        <Book className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(sdk.downloadUrl, '_blank')}
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">API Keys</h3>
              <p className="text-sm text-muted-foreground">
                Manage your API keys for different environments
              </p>
            </div>

            <Dialog open={isCreateKeyOpen} onOpenChange={setIsCreateKeyOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="keyName">Key Name</Label>
                    <Input
                      id="keyName"
                      value={keyForm.name}
                      onChange={(e) => setKeyForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Production Website"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="environment">Environment</Label>
                    <select
                      id="environment"
                      value={keyForm.environment}
                      onChange={(e) => setKeyForm(prev => ({ ...prev, environment: e.target.value as any }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="development">Development</option>
                      <option value="staging">Staging</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Permissions</Label>
                    <div className="space-y-2">
                      {[
                        'campaigns:read',
                        'campaigns:write',
                        'analytics:read',
                        'tracking:write',
                        'payments:read',
                        'payments:write'
                      ].map(permission => (
                        <label key={permission} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={keyForm.permissions.includes(permission)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setKeyForm(prev => ({
                                  ...prev,
                                  permissions: [...prev.permissions, permission]
                                }))
                              } else {
                                setKeyForm(prev => ({
                                  ...prev,
                                  permissions: prev.permissions.filter(p => p !== permission)
                                }))
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateKeyOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={generateApiKey} disabled={!keyForm.name || keyForm.permissions.length === 0}>
                    Generate Key
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {apiKeys.map(key => (
              <Card key={key.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold flex items-center gap-2">
                        <Key className="h-4 w-4" />
                        {key.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Created {key.createdAt.toLocaleDateString()}
                        {key.lastUsed && ` • Last used ${key.lastUsed.toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={key.isActive ? "default" : "secondary"}>
                        {key.isActive ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                        {key.isActive ? 'Active' : 'Revoked'}
                      </Badge>
                      <Badge variant="outline">
                        {key.environment}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                        {key.key}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCode(key.key)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Permissions: {key.permissions.length}</span>
                        <span>Rate limit: {key.rateLimit.toLocaleString()}/month</span>
                        <span>Usage: {key.usage.requests.toLocaleString()}/{key.rateLimit.toLocaleString()}</span>
                      </div>
                      {key.isActive && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => revokeApiKey(key.id)}
                        >
                          Revoke
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {key.permissions.map(permission => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Code Examples Tab */}
        <TabsContent value="examples" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Code Examples</h3>
            <p className="text-sm text-muted-foreground">
              Copy-paste examples to get started quickly
            </p>
          </div>

          <div className="grid gap-6">
            {SAMPLE_SDKS.flatMap(sdk => sdk.examples).map(example => (
              <Card key={example.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{example.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{example.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{example.language}</Badge>
                      <Badge variant="outline">{example.category}</Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyCode(example.code)}
                        className="gap-1"
                      >
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{example.code}</code>
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Developer Tools Tab */}
        <TabsContent value="tools" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Developer Tools</h3>
            <p className="text-sm text-muted-foreground">
              Tools and utilities for development and testing
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'API Explorer',
                description: 'Interactive API documentation and testing',
                icon: <Terminal className="h-8 w-8" />,
                url: '/api/explorer',
                features: ['Interactive docs', 'Request testing', 'Response examples']
              },
              {
                name: 'Webhook Tester',
                description: 'Test and debug webhook integrations',
                icon: <Zap className="h-8 w-8" />,
                url: '/tools/webhook-tester',
                features: ['Webhook simulation', 'Payload testing', 'Response validation']
              },
              {
                name: 'Link Validator',
                description: 'Validate and test affiliate links',
                icon: <Link className="h-8 w-8" />,
                url: '/tools/link-validator',
                features: ['Link validation', 'Tracking verification', 'Redirect testing']
              },
              {
                name: 'SDK Generator',
                description: 'Generate custom SDK for your language',
                icon: <Code className="h-8 w-8" />,
                url: '/tools/sdk-generator',
                features: ['Custom generation', 'Multiple languages', 'API binding']
              },
              {
                name: 'Analytics Simulator',
                description: 'Simulate analytics data for testing',
                icon: <BarChart3 className="h-8 w-8" />,
                url: '/tools/analytics-simulator',
                features: ['Data simulation', 'Testing scenarios', 'Performance testing']
              },
              {
                name: 'Integration Helper',
                description: 'Step-by-step integration guide',
                icon: <Settings className="h-8 w-8" />,
                url: '/tools/integration-helper',
                features: ['Guided setup', 'Code generation', 'Troubleshooting']
              }
            ].map(tool => (
              <Card key={tool.name} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    {tool.icon}
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {tool.features.map(feature => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Button className="w-full gap-2" onClick={() => window.open(tool.url, '_blank')}>
                      <Play className="h-4 w-4" />
                      Launch Tool
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* SDK Details Modal */}
      {selectedSDK && (
        <Dialog open={!!selectedSDK} onOpenChange={() => setSelectedSDK(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {getPlatformIcon(selectedSDK.platform)}
                {selectedSDK.displayName}
                <Badge className={getStatusColor(selectedSDK.status)} variant="secondary">
                  {selectedSDK.status}
                </Badge>
                {selectedSDK.isOfficial && (
                  <Badge variant="secondary">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Official
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <p className="text-muted-foreground mb-4">{selectedSDK.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Version</p>
                    <p className="font-medium">{selectedSDK.version}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Size</p>
                    <p className="font-medium">{selectedSDK.size}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Downloads</p>
                    <p className="font-medium">{selectedSDK.downloads.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rating</p>
                    <p className="font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      {selectedSDK.rating}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Installation</h4>
                <div className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-muted rounded text-sm font-mono">
                    {selectedSDK.installCommand}
                  </code>
                  <Button
                    variant="outline"
                    onClick={() => copyCode(selectedSDK.installCommand)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSDK.features.map(feature => (
                    <Badge key={feature} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedSDK.dependencies.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Dependencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSDK.dependencies.map(dep => (
                      <Badge key={dep} variant="secondary">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-3">Examples</h4>
                <div className="space-y-4">
                  {selectedSDK.examples.map(example => (
                    <div key={example.id}>
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{example.title}</h5>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyCode(example.code)}
                          className="gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {example.description}
                      </p>
                      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                        <code>{example.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Changelog</h4>
                <div className="space-y-3">
                  {selectedSDK.changelog.map(entry => (
                    <div key={entry.version} className="border-l-2 border-muted pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">v{entry.version}</span>
                        <Badge variant="outline" className="text-xs">
                          {entry.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {entry.date.toLocaleDateString()}
                        </span>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {entry.changes.map((change, index) => (
                          <li key={index}>• {change}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedSDK.documentationUrl, '_blank')}
                  className="gap-2"
                >
                  <Book className="h-4 w-4" />
                  Documentation
                </Button>
                {selectedSDK.repositoryUrl && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedSDK.repositoryUrl, '_blank')}
                    className="gap-2"
                  >
                    <Github className="h-4 w-4" />
                    Repository
                  </Button>
                )}
                <Button
                  onClick={() => window.open(selectedSDK.downloadUrl, '_blank')}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default SDKDevelopment
