'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Target, 
  DollarSign, 
  Calendar,
  BarChart3,
  Zap,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PredictionData {
  metric: string;
  current: number;
  predicted: number;
  change: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  timeframe: string;
}

interface CampaignPrediction {
  campaignId: string;
  campaignName: string;
  predictedRevenue: number;
  predictedClicks: number;
  predictedConversions: number;
  riskScore: number;
  recommendation: string;
  confidence: number;
}

export function PredictiveAnalytics() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [campaignPredictions, setCampaignPredictions] = useState<CampaignPrediction[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);

  useEffect(() => {
    fetchPredictiveData();
  }, [selectedTimeframe]);

  const fetchPredictiveData = async () => {
    setIsLoading(true);
    try {
      // Simulate ML API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock predictive data
      setPredictions([
        {
          metric: 'Revenue',
          current: 1250000,
          predicted: 1450000,
          change: 16.0,
          confidence: 87,
          trend: 'up',
          timeframe: selectedTimeframe
        },
        {
          metric: 'Clicks',
          current: 15400,
          predicted: 18200,
          change: 18.2,
          confidence: 82,
          trend: 'up',
          timeframe: selectedTimeframe
        },
        {
          metric: 'Conversions',
          current: 340,
          predicted: 385,
          change: 13.2,
          confidence: 75,
          trend: 'up',
          timeframe: selectedTimeframe
        },
        {
          metric: 'Conversion Rate',
          current: 2.21,
          predicted: 2.11,
          change: -4.5,
          confidence: 69,
          trend: 'down',
          timeframe: selectedTimeframe
        }
      ]);

      setCampaignPredictions([
        {
          campaignId: '1',
          campaignName: 'E-commerce Fashion Campaign',
          predictedRevenue: 450000,
          predictedClicks: 5400,
          predictedConversions: 120,
          riskScore: 0.25,
          recommendation: 'Increase budget by 20%',
          confidence: 89
        },
        {
          campaignId: '2',
          campaignName: 'Tech Gadgets Promotion',
          predictedRevenue: 380000,
          predictedClicks: 4800,
          predictedConversions: 95,
          riskScore: 0.45,
          recommendation: 'Monitor closely',
          confidence: 76
        },
        {
          campaignId: '3',
          campaignName: 'Home Decor Collection',
          predictedRevenue: 220000,
          predictedClicks: 3200,
          predictedConversions: 68,
          riskScore: 0.65,
          recommendation: 'Consider reducing budget',
          confidence: 72
        }
      ]);

      // Generate forecast data
      const today = new Date();
      const forecastData = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        const baseRevenue = 45000 + Math.sin(i * 0.2) * 5000;
        const trend = i * 500;
        const noise = (Math.random() - 0.5) * 3000;
        
        forecastData.push({
          date: date.toISOString().split('T')[0],
          actual: i < 7 ? baseRevenue + noise : null,
          predicted: baseRevenue + trend + noise,
          confidence_upper: baseRevenue + trend + noise + 5000,
          confidence_lower: Math.max(0, baseRevenue + trend + noise - 5000)
        });
      }
      setForecastData(forecastData);

    } catch (error) {
      console.error('Error fetching predictive data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore <= 0.3) return 'text-green-600 bg-green-50';
    if (riskScore <= 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Analyzing data with AI...</p>
            <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-600" />
            Predictive Analytics
          </h2>
          <p className="text-gray-600 mt-1">AI-powered insights and forecasting</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="14d">14 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
              <SelectItem value="90d">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchPredictiveData} disabled={isLoading}>
            <Zap className="h-4 w-4 mr-2" />
            Refresh Predictions
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Predictions</TabsTrigger>
          <TabsTrigger value="forecast">Revenue Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Prediction Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {predictions.map((prediction, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{prediction.metric}</CardTitle>
                  <div className={`p-2 rounded-full ${
                    prediction.trend === 'up' ? 'bg-green-100' : 
                    prediction.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    {prediction.trend === 'up' ? 
                      <TrendingUp className="h-4 w-4 text-green-600" /> :
                      prediction.trend === 'down' ?
                      <TrendingDown className="h-4 w-4 text-red-600" /> :
                      <BarChart3 className="h-4 w-4 text-gray-600" />
                    }
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {prediction.metric === 'Revenue' ? 
                      formatCurrency(prediction.predicted) : 
                      prediction.predicted.toLocaleString('vi-VN')
                    }
                  </div>
                  <p className={`text-xs flex items-center gap-1 mt-1 ${
                    prediction.change > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {prediction.change > 0 ? '+' : ''}{prediction.change.toFixed(1)}%
                    <span className="text-gray-500">vs current</span>
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">Confidence</span>
                    <span className={`text-xs font-medium ${getConfidenceColor(prediction.confidence)}`}>
                      {prediction.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className={`h-1 rounded-full ${
                        prediction.confidence >= 80 ? 'bg-green-500' :
                        prediction.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Strong Growth Predicted</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Revenue is predicted to increase by 16% over the next {selectedTimeframe}. 
                    This growth is driven by improved campaign performance and seasonal trends.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Conversion Rate Alert</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Conversion rate is expected to decline slightly by 4.5%. Consider optimizing 
                    landing pages and targeting strategies to maintain current performance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Optimization Opportunity</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    ML analysis suggests focusing marketing efforts on weekends and evenings 
                    for 23% better performance based on historical patterns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Predictions</CardTitle>
              <p className="text-sm text-gray-600">AI predictions for individual campaigns</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPredictions.map((campaign) => (
                  <div key={campaign.campaignId} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{campaign.campaignName}</h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(campaign.riskScore)}`}>
                        {campaign.riskScore <= 0.3 ? 'Low Risk' : 
                         campaign.riskScore <= 0.6 ? 'Medium Risk' : 'High Risk'}
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3 mb-3">
                      <div>
                        <div className="text-sm text-gray-500">Predicted Revenue</div>
                        <div className="text-lg font-semibold text-green-600">
                          {formatCurrency(campaign.predictedRevenue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Predicted Clicks</div>
                        <div className="text-lg font-semibold">
                          {campaign.predictedClicks.toLocaleString('vi-VN')}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Predicted Conversions</div>
                        <div className="text-lg font-semibold">
                          {campaign.predictedConversions}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-500">Recommendation: </span>
                        <span className="font-medium">{campaign.recommendation}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Confidence: </span>
                        <span className={`font-medium ${getConfidenceColor(campaign.confidence)}`}>
                          {campaign.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                30-Day Revenue Forecast
              </CardTitle>
              <p className="text-sm text-gray-600">AI-powered revenue predictions with confidence intervals</p>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString('vi-VN')}
                      formatter={(value, name) => [
                        value ? formatCurrency(value as number) : 'N/A',
                        name === 'actual' ? 'Actual' : 
                        name === 'predicted' ? 'Predicted' :
                        name === 'confidence_upper' ? 'Upper Bound' : 'Lower Bound'
                      ]}
                    />
                    
                    {/* Confidence interval area */}
                    <defs>
                      <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    
                    <Line 
                      type="monotone" 
                      dataKey="confidence_upper" 
                      stroke="transparent"
                      fill="url(#confidenceGradient)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="confidence_lower" 
                      stroke="transparent"
                      fill="url(#confidenceGradient)"
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      connectNulls={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="#3b82f6" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-green-500"></div>
                  <span>Actual Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-blue-500 border-dashed"></div>
                  <span>Predicted Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 bg-blue-100"></div>
                  <span>Prediction Confidence</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
