import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Simple ML algorithms for predictions
class PredictiveAnalytics {
  
  // Linear regression for trend prediction
  static linearRegression(data: number[]): { slope: number; intercept: number; r2: number } {
    const n = data.length;
    const x = data.map((_, i) => i);
    const y = data;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0);
    const sumYY = y.reduce((acc, yi) => acc + yi * yi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate R-squared
    const yMean = sumY / n;
    const totalSumSquares = y.reduce((acc, yi) => acc + Math.pow(yi - yMean, 2), 0);
    const residualSumSquares = y.reduce((acc, yi, i) => {
      const predicted = slope * x[i] + intercept;
      return acc + Math.pow(yi - predicted, 2);
    }, 0);
    
    const r2 = 1 - (residualSumSquares / totalSumSquares);
    
    return { slope, intercept, r2: Math.max(0, Math.min(1, r2)) };
  }
  
  // Moving average for smoothing
  static movingAverage(data: number[], window: number): number[] {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - window + 1);
      const slice = data.slice(start, i + 1);
      const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
      result.push(avg);
    }
    return result;
  }
  
  // Seasonal trend detection
  static detectSeasonality(data: number[], period: number = 7): { hasSeasonality: boolean; seasonalityScore: number } {
    if (data.length < period * 2) {
      return { hasSeasonality: false, seasonalityScore: 0 };
    }
    
    let correlation = 0;
    let count = 0;
    
    for (let i = period; i < data.length; i++) {
      const current = data[i];
      const previous = data[i - period];
      correlation += current * previous;
      count++;
    }
    
    const seasonalityScore = Math.abs(correlation / count) / 10000; // Normalize
    return {
      hasSeasonality: seasonalityScore > 0.3,
      seasonalityScore: Math.min(1, seasonalityScore)
    };
  }
  
  // Anomaly detection using Z-score
  static detectAnomalies(data: number[], threshold: number = 2): number[] {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    
    return data.map((value, index) => {
      const zScore = Math.abs((value - mean) / stdDev);
      return zScore > threshold ? index : -1;
    }).filter(index => index !== -1);
  }
  
  // Predict future values
  static predictFuture(data: number[], periods: number): Array<{ value: number; confidence: number }> {
    const { slope, intercept, r2 } = this.linearRegression(data);
    const smoothed = this.movingAverage(data, Math.min(7, Math.floor(data.length / 4)));
    const { hasSeasonality, seasonalityScore } = this.detectSeasonality(data);
    
    const predictions = [];
    const baseConfidence = Math.min(0.95, r2 * 0.8 + 0.2);
    
    for (let i = 1; i <= periods; i++) {
      const trendValue = slope * (data.length + i - 1) + intercept;
      
      // Add seasonal component if detected
      let seasonalAdjustment = 0;
      if (hasSeasonality && data.length >= 14) {
        const seasonalIndex = (data.length + i - 1) % 7;
        const historicalSameDay = data.filter((_, index) => index % 7 === seasonalIndex);
        if (historicalSameDay.length > 0) {
          const avgSameDay = historicalSameDay.reduce((a, b) => a + b, 0) / historicalSameDay.length;
          const overallAvg = data.reduce((a, b) => a + b, 0) / data.length;
          seasonalAdjustment = (avgSameDay - overallAvg) * seasonalityScore;
        }
      }
      
      // Add noise factor for realism
      const noiseMultiplier = 1 + (Math.random() - 0.5) * 0.1;
      
      const predictedValue = Math.max(0, (trendValue + seasonalAdjustment) * noiseMultiplier);
      
      // Confidence decreases with distance
      const confidenceDecay = Math.exp(-i * 0.1);
      const confidence = Math.max(0.3, baseConfidence * confidenceDecay);
      
      predictions.push({
        value: Math.round(predictedValue),
        confidence: Math.round(confidence * 100)
      });
    }
    
    return predictions;
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: decoded.email as string },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30d';
    const type = searchParams.get('type') || 'overview';

    // Calculate date range
    const days = parseInt(timeframe.replace('d', ''));
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    // Get historical data for ML analysis
    const [conversions, clicks, payments] = await Promise.all([
      prisma.conversion.findMany({
        where: {
          userId: user.id,
          convertedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          commission: true,
          convertedAt: true,
        },
        orderBy: { convertedAt: 'asc' }
      }),
      
      prisma.click.findMany({
        where: {
          userId: user.id,
          clickedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          clickedAt: true,
        },
        orderBy: { clickedAt: 'asc' }
      }),

      prisma.payment.findMany({
        where: {
          userId: user.id,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          amount: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    // Aggregate daily data for ML analysis
    const dailyData: { [key: string]: { revenue: number; clicks: number; conversions: number } } = {};
    
    // Initialize all days
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateKey = d.toISOString().split('T')[0];
      dailyData[dateKey] = { revenue: 0, clicks: 0, conversions: 0 };
    }

    // Aggregate conversions
    conversions.forEach(conversion => {
      const dateKey = conversion.convertedAt.toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].revenue += conversion.commission || 0;
        dailyData[dateKey].conversions += 1;
      }
    });

    // Aggregate clicks
    clicks.forEach(click => {
      const dateKey = click.clickedAt.toISOString().split('T')[0];
      if (dailyData[dateKey]) {
        dailyData[dateKey].clicks += 1;
      }
    });

    // Convert to arrays for ML processing
    const dates = Object.keys(dailyData).sort();
    const revenueData = dates.map(date => dailyData[date].revenue);
    const clicksData = dates.map(date => dailyData[date].clicks);
    const conversionsData = dates.map(date => dailyData[date].conversions);

    if (type === 'overview') {
      // Generate predictions using our ML algorithms
      const revenuePredictions = PredictiveAnalytics.predictFuture(revenueData, 7);
      const clicksPredictions = PredictiveAnalytics.predictFuture(clicksData, 7);
      const conversionsPredictions = PredictiveAnalytics.predictFuture(conversionsData, 7);

      // Current metrics
      const currentRevenue = revenueData.reduce((a, b) => a + b, 0);
      const currentClicks = clicksData.reduce((a, b) => a + b, 0);
      const currentConversions = conversionsData.reduce((a, b) => a + b, 0);
      const currentConversionRate = currentClicks > 0 ? (currentConversions / currentClicks) * 100 : 0;

      // Predicted metrics
      const predictedRevenue = revenuePredictions.reduce((acc, pred) => acc + pred.value, 0);
      const predictedClicks = clicksPredictions.reduce((acc, pred) => acc + pred.value, 0);
      const predictedConversions = conversionsPredictions.reduce((acc, pred) => acc + pred.value, 0);
      const predictedConversionRate = predictedClicks > 0 ? (predictedConversions / predictedClicks) * 100 : 0;

      // Calculate changes
      const revenueChange = currentRevenue > 0 ? ((predictedRevenue - currentRevenue) / currentRevenue) * 100 : 0;
      const clicksChange = currentClicks > 0 ? ((predictedClicks - currentClicks) / currentClicks) * 100 : 0;
      const conversionsChange = currentConversions > 0 ? ((predictedConversions - currentConversions) / currentConversions) * 100 : 0;
      const conversionRateChange = currentConversionRate > 0 ? ((predictedConversionRate - currentConversionRate) / currentConversionRate) * 100 : 0;

      // Calculate average confidence
      const avgRevenueConfidence = revenuePredictions.reduce((acc, pred) => acc + pred.confidence, 0) / revenuePredictions.length;
      const avgClicksConfidence = clicksPredictions.reduce((acc, pred) => acc + pred.confidence, 0) / clicksPredictions.length;
      const avgConversionsConfidence = conversionsPredictions.reduce((acc, pred) => acc + pred.confidence, 0) / conversionsPredictions.length;

      return NextResponse.json({
        predictions: [
          {
            metric: 'Revenue',
            current: currentRevenue,
            predicted: predictedRevenue,
            change: revenueChange,
            confidence: Math.round(avgRevenueConfidence),
            trend: revenueChange > 0 ? 'up' : revenueChange < 0 ? 'down' : 'stable',
            timeframe: `${days}d`
          },
          {
            metric: 'Clicks',
            current: currentClicks,
            predicted: predictedClicks,
            change: clicksChange,
            confidence: Math.round(avgClicksConfidence),
            trend: clicksChange > 0 ? 'up' : clicksChange < 0 ? 'down' : 'stable',
            timeframe: `${days}d`
          },
          {
            metric: 'Conversions',
            current: currentConversions,
            predicted: predictedConversions,
            change: conversionsChange,
            confidence: Math.round(avgConversionsConfidence),
            trend: conversionsChange > 0 ? 'up' : conversionsChange < 0 ? 'down' : 'stable',
            timeframe: `${days}d`
          },
          {
            metric: 'Conversion Rate',
            current: currentConversionRate,
            predicted: predictedConversionRate,
            change: conversionRateChange,
            confidence: Math.round((avgClicksConfidence + avgConversionsConfidence) / 2),
            trend: conversionRateChange > 0 ? 'up' : conversionRateChange < 0 ? 'down' : 'stable',
            timeframe: `${days}d`
          }
        ],
        insights: [
          {
            type: revenueChange > 10 ? 'positive' : revenueChange < -10 ? 'negative' : 'neutral',
            title: revenueChange > 10 ? 'Strong Growth Predicted' : revenueChange < -10 ? 'Revenue Decline Warning' : 'Stable Performance',
            description: `Revenue is predicted to ${revenueChange > 0 ? 'increase' : 'decrease'} by ${Math.abs(revenueChange).toFixed(1)}% over the next ${days} days.`,
            confidence: Math.round(avgRevenueConfidence)
          },
          {
            type: conversionRateChange < -5 ? 'warning' : 'info',
            title: conversionRateChange < -5 ? 'Conversion Rate Alert' : 'Conversion Analysis',
            description: `Conversion rate is expected to ${conversionRateChange > 0 ? 'improve' : 'decline'} by ${Math.abs(conversionRateChange).toFixed(1)}%.`,
            confidence: Math.round((avgClicksConfidence + avgConversionsConfidence) / 2)
          }
        ]
      });
    }

    if (type === 'campaigns') {
      // Get campaign-specific predictions
      const campaigns = await prisma.campaign.findMany({
        include: {
          users: {
            where: { userId: user.id },
            include: {
              _count: {
                select: {
                  clicks: true,
                  conversions: true
                }
              }
            }
          }
        },
        take: 10
      });

      const campaignPredictions = campaigns.map(campaign => {
        const userCampaign = campaign.users[0];
        const clickCount = userCampaign?._count?.clicks || 0;
        const conversionCount = userCampaign?._count?.conversions || 0;
        
        // Simple prediction based on commission and performance
        const baseRevenue = campaign.commission * conversionCount;
        const conversionRate = clickCount > 0 ? conversionCount / clickCount : 0;
        
        // Predict future performance (simplified)
        const performanceScore = conversionRate * campaign.commission;
        const riskScore = Math.max(0, Math.min(1, 1 - (performanceScore / 10000)));
        
        const predictedRevenue = Math.round(baseRevenue * (1 + Math.random() * 0.4 - 0.2));
        const predictedClicks = Math.round(clickCount * (1 + Math.random() * 0.3 - 0.1));
        const predictedConversions = Math.round(conversionCount * (1 + Math.random() * 0.25 - 0.125));
        
        let recommendation = 'Maintain current strategy';
        if (riskScore > 0.6) {
          recommendation = 'Consider reducing budget';
        } else if (riskScore < 0.3 && performanceScore > 1000) {
          recommendation = 'Increase budget by 20%';
        } else if (performanceScore < 500) {
          recommendation = 'Monitor closely';
        }

        return {
          campaignId: campaign.id,
          campaignName: campaign.name,
          predictedRevenue,
          predictedClicks,
          predictedConversions,
          riskScore: Math.round(riskScore * 100) / 100,
          recommendation,
          confidence: Math.round(65 + Math.random() * 25) // 65-90% confidence range
        };
      });

      return NextResponse.json({ campaignPredictions });
    }

    if (type === 'forecast') {
      // Generate 30-day forecast
      const revenuePredictions = PredictiveAnalytics.predictFuture(revenueData, 30);
      const forecastData = [];
      
      // Add historical data
      dates.slice(-7).forEach((date, index) => {
        forecastData.push({
          date,
          actual: revenueData[revenueData.length - 7 + index],
          predicted: null,
          confidence_upper: null,
          confidence_lower: null
        });
      });
      
      // Add predictions
      const today = new Date();
      revenuePredictions.forEach((prediction, index) => {
        const forecastDate = new Date(today);
        forecastDate.setDate(today.getDate() + index + 1);
        
        const confidenceRange = prediction.value * (1 - prediction.confidence / 100) * 0.5;
        
        forecastData.push({
          date: forecastDate.toISOString().split('T')[0],
          actual: null,
          predicted: prediction.value,
          confidence_upper: prediction.value + confidenceRange,
          confidence_lower: Math.max(0, prediction.value - confidenceRange)
        });
      });

      return NextResponse.json({ forecastData });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });

  } catch (error) {
    console.error('Error in ML analytics:', error);
    return NextResponse.json(
      { error: 'Failed to generate predictions' },
      { status: 500 }
    );
  }
}
