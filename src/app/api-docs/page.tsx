'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Code,
  Copy,
  Check,
  BookOpen,
  Globe,
  Key,
  Shield,
  Zap,
  Database,
  Users,
  BarChart3,
  CreditCard,
  Bell,
  Link as LinkIcon,
  Search,
  ChevronRight,
  ExternalLink
} from 'lucide-react'

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  summary: string
  description: string
  authentication: boolean
  parameters?: {
    name: string
    type: string
    required: boolean
    description: string
    example?: string
  }[]
  requestBody?: {
    contentType: string
    schema: object
    example: object
  }
  responses: {
    status: number
    description: string
    example: object
  }[]
  tags: string[]
}

const API_ENDPOINTS: ApiEndpoint[] = [
  // Authentication Endpoints
  {
    method: 'POST',
    path: '/api/auth/login',
    summary: 'User Login',
    description: 'Authenticate user and return JWT token',
    authentication: false,
    requestBody: {
      contentType: 'application/json',
      schema: {
        email: 'string',
        password: 'string'
      },
      example: {
        email: 'user@example.com',
        password: 'password123'
      }
    },
    responses: [
      {
        status: 200,
        description: 'Login successful',
        example: {
          success: true,
          user: {
            id: 'user_123',
            email: 'user@example.com',
            name: 'John Doe',
            role: 'PUBLISHER'
          }
        }
      },
      {
        status: 401,
        description: 'Invalid credentials',
        example: {
          error: 'Invalid email or password'
        }
      }
    ],
    tags: ['Authentication']
  },
  {
    method: 'POST',
    path: '/api/auth/register',
    summary: 'User Registration',
    description: 'Create new user account',
    authentication: false,
    requestBody: {
      contentType: 'application/json',
      schema: {
        name: 'string',
        email: 'string',
        password: 'string'
      },
      example: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword123'
      }
    },
    responses: [
      {
        status: 201,
        description: 'User created successfully',
        example: {
          success: true,
          message: 'Registration successful. Please verify your email.'
        }
      }
    ],
    tags: ['Authentication']
  },
  {
    method: 'GET',
    path: '/api/auth/me',
    summary: 'Get Current User',
    description: 'Get authenticated user information',
    authentication: true,
    responses: [
      {
        status: 200,
        description: 'User information',
        example: {
          id: 'user_123',
          email: 'user@example.com',
          name: 'John Doe',
          role: 'PUBLISHER',
          isVerified: true,
          createdAt: '2025-01-01T00:00:00Z'
        }
      }
    ],
    tags: ['Authentication']
  },

  // Campaign Endpoints
  {
    method: 'GET',
    path: '/api/campaigns',
    summary: 'List Campaigns',
    description: 'Get list of available campaigns with filtering and pagination',
    authentication: true,
    parameters: [
      {
        name: 'page',
        type: 'number',
        required: false,
        description: 'Page number for pagination',
        example: '1'
      },
      {
        name: 'limit',
        type: 'number',
        required: false,
        description: 'Number of items per page',
        example: '10'
      },
      {
        name: 'category',
        type: 'string',
        required: false,
        description: 'Filter by campaign category',
        example: 'E-commerce'
      },
      {
        name: 'search',
        type: 'string',
        required: false,
        description: 'Search campaigns by title or description',
        example: 'fashion'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'List of campaigns',
        example: {
          campaigns: [
            {
              id: 'campaign_123',
              title: 'Fashion Store Campaign',
              description: 'Promote latest fashion trends',
              category: 'Fashion',
              commission: 10.5,
              currency: 'VND',
              status: 'ACTIVE',
              image: 'https://example.com/image.jpg'
            }
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 50,
            totalPages: 5
          }
        }
      }
    ],
    tags: ['Campaigns']
  },
  {
    method: 'POST',
    path: '/api/campaigns/{id}/apply',
    summary: 'Apply to Campaign',
    description: 'Submit application to join a campaign',
    authentication: true,
    parameters: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Campaign ID',
        example: 'campaign_123'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Application submitted',
        example: {
          success: true,
          message: 'Application submitted successfully',
          applicationId: 'app_123'
        }
      }
    ],
    tags: ['Campaigns']
  },

  // Analytics Endpoints
  {
    method: 'GET',
    path: '/api/analytics',
    summary: 'Get Analytics Data',
    description: 'Retrieve performance analytics for date range',
    authentication: true,
    parameters: [
      {
        name: 'startDate',
        type: 'string',
        required: false,
        description: 'Start date (ISO format)',
        example: '2025-01-01T00:00:00Z'
      },
      {
        name: 'endDate',
        type: 'string',
        required: false,
        description: 'End date (ISO format)',
        example: '2025-01-31T23:59:59Z'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Analytics data',
        example: {
          summary: {
            clicks: 1250,
            conversions: 75,
            revenue: 15000,
            ctr: 6.0,
            conversionRate: 4.5
          },
          timeline: [
            {
              date: '2025-01-01',
              clicks: 50,
              conversions: 3,
              revenue: 750
            }
          ]
        }
      }
    ],
    tags: ['Analytics']
  },
  {
    method: 'GET',
    path: '/api/analytics/comparison',
    summary: 'Performance Comparison',
    description: 'Compare performance between two periods',
    authentication: true,
    parameters: [
      {
        name: 'currentStart',
        type: 'string',
        required: true,
        description: 'Current period start date',
        example: '2025-01-15T00:00:00Z'
      },
      {
        name: 'currentEnd',
        type: 'string',
        required: true,
        description: 'Current period end date',
        example: '2025-01-22T23:59:59Z'
      },
      {
        name: 'previousStart',
        type: 'string',
        required: true,
        description: 'Previous period start date',
        example: '2025-01-08T00:00:00Z'
      },
      {
        name: 'previousEnd',
        type: 'string',
        required: true,
        description: 'Previous period end date',
        example: '2025-01-15T23:59:59Z'
      }
    ],
    responses: [
      {
        status: 200,
        description: 'Comparison data',
        example: {
          current: {
            period: '1/15/2025 - 1/22/2025',
            metrics: {
              clicks: 125,
              conversions: 8,
              revenue: 2000,
              ctr: 6.4,
              avgRevenue: 250
            }
          },
          previous: {
            period: '1/8/2025 - 1/15/2025',
            metrics: {
              clicks: 100,
              conversions: 6,
              revenue: 1500,
              ctr: 6.0,
              avgRevenue: 250
            }
          }
        }
      }
    ],
    tags: ['Analytics']
  },

  // Link Management Endpoints
  {
    method: 'GET',
    path: '/api/links',
    summary: 'List Affiliate Links',
    description: 'Get user\'s affiliate links with analytics',
    authentication: true,
    responses: [
      {
        status: 200,
        description: 'List of affiliate links',
        example: {
          links: [
            {
              id: 'link_123',
              shortCode: 'abc123',
              originalUrl: 'https://example.com/product',
              title: 'Product Link',
              isActive: true,
              totalClicks: 250,
              totalConversions: 15,
              totalRevenue: 3750,
              createdAt: '2025-01-01T00:00:00Z'
            }
          ]
        }
      }
    ],
    tags: ['Links']
  },

  // Payment Endpoints
  {
    method: 'GET',
    path: '/api/balance',
    summary: 'Get Account Balance',
    description: 'Retrieve current account balance and recent transactions',
    authentication: true,
    responses: [
      {
        status: 200,
        description: 'Balance information',
        example: {
          balance: {
            available: 15000,
            pending: 2500,
            total: 17500,
            currency: 'VND'
          },
          recentTransactions: [
            {
              id: 'txn_123',
              type: 'COMMISSION',
              amount: 500,
              description: 'Commission from Fashion Store',
              date: '2025-01-20T10:30:00Z'
            }
          ]
        }
      }
    ],
    tags: ['Payments']
  },
  {
    method: 'POST',
    path: '/api/payments',
    summary: 'Request Withdrawal',
    description: 'Submit withdrawal request',
    authentication: true,
    requestBody: {
      contentType: 'application/json',
      schema: {
        amount: 'number',
        method: 'string',
        accountInfo: 'object'
      },
      example: {
        amount: 10000,
        method: 'BANK_TRANSFER',
        accountInfo: {
          bankName: 'Vietcombank',
          accountNumber: '1234567890',
          accountName: 'John Doe'
        }
      }
    },
    responses: [
      {
        status: 201,
        description: 'Withdrawal request created',
        example: {
          success: true,
          paymentId: 'pay_123',
          message: 'Withdrawal request submitted successfully'
        }
      }
    ],
    tags: ['Payments']
  }
]

const API_CATEGORIES = [
  { id: 'all', name: 'All Endpoints', icon: Globe, count: API_ENDPOINTS.length },
  { id: 'Authentication', name: 'Authentication', icon: Shield, count: API_ENDPOINTS.filter(e => e.tags.includes('Authentication')).length },
  { id: 'Campaigns', name: 'Campaigns', icon: Users, count: API_ENDPOINTS.filter(e => e.tags.includes('Campaigns')).length },
  { id: 'Analytics', name: 'Analytics', icon: BarChart3, count: API_ENDPOINTS.filter(e => e.tags.includes('Analytics')).length },
  { id: 'Links', name: 'Links', icon: LinkIcon, count: API_ENDPOINTS.filter(e => e.tags.includes('Links')).length },
  { id: 'Payments', name: 'Payments', icon: CreditCard, count: API_ENDPOINTS.filter(e => e.tags.includes('Payments')).length }
]

export default function ApiDocsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const filteredEndpoints = API_ENDPOINTS.filter(endpoint => {
    const categoryMatch = selectedCategory === 'all' || endpoint.tags.includes(selectedCategory)
    const searchMatch = searchQuery === '' || 
      endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endpoint.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return categoryMatch && searchMatch
  })

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(type)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const generateCurlExample = (endpoint: ApiEndpoint) => {
    let curl = `curl -X ${endpoint.method} '${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}${endpoint.path}'`
    
    if (endpoint.authentication) {
      curl += ` \\\n  -H 'Authorization: Bearer YOUR_JWT_TOKEN'`
    }
    
    if (endpoint.requestBody) {
      curl += ` \\\n  -H 'Content-Type: ${endpoint.requestBody.contentType}' \\\n  -d '${JSON.stringify(endpoint.requestBody.example, null, 2)}'`
    }
    
    return curl
  }

  const generateJavaScriptExample = (endpoint: ApiEndpoint) => {
    const fetchOptions: any = {
      method: endpoint.method,
      headers: {}
    }

    if (endpoint.authentication) {
      fetchOptions.headers['Authorization'] = 'Bearer YOUR_JWT_TOKEN'
    }

    if (endpoint.requestBody) {
      fetchOptions.headers['Content-Type'] = endpoint.requestBody.contentType
      fetchOptions.body = JSON.stringify(endpoint.requestBody.example, null, 2)
    }

    return `fetch('${process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}${endpoint.path}', ${JSON.stringify(fetchOptions, null, 2)})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
              <p className="text-gray-600">Complete reference for Timona Affiliate Platform API</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Endpoints</p>
                    <p className="text-xl font-bold">{API_ENDPOINTS.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Authentication</p>
                    <p className="text-xl font-bold">JWT Tokens</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Database className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Response Format</p>
                    <p className="text-xl font-bold">JSON</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Globe className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Base URL</p>
                    <p className="text-sm font-mono">api.timona.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">API Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {API_CATEGORIES.map((category) => {
                    const Icon = category.icon
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          selectedCategory === category.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{category.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Authentication</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Most endpoints require authentication using JWT tokens.
                  </p>
                  <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                    Authorization: Bearer YOUR_JWT_TOKEN
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Base URL</h4>
                  <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                    {process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'}/api
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Rate Limits</h4>
                  <p className="text-sm text-gray-600">
                    1000 requests per hour per API key
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedEndpoint ? (
              /* Endpoint Detail View */
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={selectedEndpoint.method === 'GET' ? 'default' : 
                                selectedEndpoint.method === 'POST' ? 'secondary' : 
                                selectedEndpoint.method === 'PUT' ? 'outline' : 'destructive'}
                        className="font-mono"
                      >
                        {selectedEndpoint.method}
                      </Badge>
                      <code className="text-lg font-mono bg-gray-100 px-2 py-1 rounded">
                        {selectedEndpoint.path}
                      </code>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedEndpoint(null)}
                    >
                      ← Back
                    </Button>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2">{selectedEndpoint.summary}</h2>
                    <p className="text-gray-600">{selectedEndpoint.description}</p>
                    {selectedEndpoint.authentication && (
                      <Badge variant="outline" className="mt-2">
                        <Shield className="h-3 w-3 mr-1" />
                        Authentication Required
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="parameters">Parameters</TabsTrigger>
                      <TabsTrigger value="examples">Examples</TabsTrigger>
                      <TabsTrigger value="responses">Responses</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Description</h3>
                        <p className="text-gray-600">{selectedEndpoint.description}</p>
                      </div>
                      
                      {selectedEndpoint.requestBody && (
                        <div>
                          <h3 className="font-semibold mb-2">Request Body</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Content-Type: {selectedEndpoint.requestBody.contentType}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(JSON.stringify(selectedEndpoint.requestBody?.schema, null, 2), 'schema')}
                              >
                                {copiedCode === 'schema' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                            <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
                              <code>{JSON.stringify(selectedEndpoint.requestBody.schema, null, 2)}</code>
                            </pre>
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="parameters" className="space-y-4">
                      {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 ? (
                        <div className="space-y-4">
                          {selectedEndpoint.parameters.map((param, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <code className="font-mono bg-gray-100 px-2 py-1 rounded">{param.name}</code>
                                <Badge variant={param.required ? 'destructive' : 'secondary'} className="text-xs">
                                  {param.required ? 'Required' : 'Optional'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {param.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{param.description}</p>
                              {param.example && (
                                <div className="bg-gray-50 p-2 rounded text-sm font-mono">
                                  Example: {param.example}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No parameters required for this endpoint.</p>
                      )}
                    </TabsContent>

                    <TabsContent value="examples" className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-3">cURL Example</h3>
                        <div className="bg-gray-900 text-white p-4 rounded-lg relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 text-white hover:bg-gray-700"
                            onClick={() => copyToClipboard(generateCurlExample(selectedEndpoint), 'curl')}
                          >
                            {copiedCode === 'curl' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          <pre className="text-sm overflow-x-auto">
                            <code>{generateCurlExample(selectedEndpoint)}</code>
                          </pre>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">JavaScript Example</h3>
                        <div className="bg-gray-900 text-white p-4 rounded-lg relative">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 text-white hover:bg-gray-700"
                            onClick={() => copyToClipboard(generateJavaScriptExample(selectedEndpoint), 'js')}
                          >
                            {copiedCode === 'js' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          <pre className="text-sm overflow-x-auto">
                            <code>{generateJavaScriptExample(selectedEndpoint)}</code>
                          </pre>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="responses" className="space-y-4">
                      {selectedEndpoint.responses.map((response, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge 
                              variant={response.status < 300 ? 'default' : 
                                      response.status < 400 ? 'secondary' : 'destructive'}
                              className="font-mono"
                            >
                              {response.status}
                            </Badge>
                            <span className="font-medium">{response.description}</span>
                          </div>
                          <div className="bg-gray-50 p-3 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Response Example</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(JSON.stringify(response.example, null, 2), `response-${index}`)}
                              >
                                {copiedCode === `response-${index}` ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              </Button>
                            </div>
                            <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
                              <code>{JSON.stringify(response.example, null, 2)}</code>
                            </pre>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              /* Endpoints List View */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    {selectedCategory === 'all' ? 'All Endpoints' : 
                     API_CATEGORIES.find(c => c.id === selectedCategory)?.name}
                  </h2>
                  <Badge variant="secondary">
                    {filteredEndpoints.length} endpoint{filteredEndpoints.length !== 1 ? 's' : ''}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {filteredEndpoints.map((endpoint, index) => (
                    <Card 
                      key={index} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedEndpoint(endpoint)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={endpoint.method === 'GET' ? 'default' : 
                                      endpoint.method === 'POST' ? 'secondary' : 
                                      endpoint.method === 'PUT' ? 'outline' : 'destructive'}
                              className="font-mono text-xs"
                            >
                              {endpoint.method}
                            </Badge>
                            <div>
                              <div className="flex items-center gap-2">
                                <code className="font-mono text-sm">{endpoint.path}</code>
                                {endpoint.authentication && (
                                  <Shield className="h-3 w-3 text-gray-400" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{endpoint.summary}</p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredEndpoints.length === 0 && (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No endpoints found</h3>
                    <p className="text-gray-500">Try adjusting your search or category filter.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
