"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, MousePointer, Eye, WifiOff } from "lucide-react"
import { useOfflineData } from "@/hooks/use-offline-data"

interface StatCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
}

function StatCard({ title, value, change, trend, icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className={`inline-flex items-center ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
            {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {change}
          </span>
          {" "}so với tháng trước
        </p>
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  // Use offline data hook for dashboard stats
  const { data: stats, isLoading, isOffline } = useOfflineData(
    'dashboard-stats',
    async () => {
      const response = await fetch('/api/balance');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      const data = await response.json();
      return [
        {
          title: "Tổng thu nhập",
          value: `${data.totalEarnings?.toLocaleString('vi-VN') || '0'}₫`,
          change: "+20.1%",
          trend: "up" as const,
          icon: <DollarSign className="h-4 w-4" />
        },
        {
          title: "Số click",
          value: data.totalClicks?.toLocaleString('vi-VN') || '0',
          change: "+15.3%",
          trend: "up" as const,
          icon: <MousePointer className="h-4 w-4" />
        },
        {
          title: "Tỷ lệ chuyển đổi",
          value: `${data.conversionRate || '0.00'}%`,
          change: "-2.1%",
          trend: "down" as const,
          icon: <TrendingUp className="h-4 w-4" />
        },
        {
          title: "Lượt xem",
          value: data.totalViews?.toLocaleString('vi-VN') || '0',
          change: "+12.5%",
          trend: "up" as const,
          icon: <Eye className="h-4 w-4" />
        }
      ];
    },
    {
      cacheTime: 5 * 60 * 1000, // Cache for 5 minutes
      staleTime: 60 * 1000, // Consider data stale after 1 minute
    }
  );

  // Fallback data for demo or error states
  const fallbackStats = [
    {
      title: "Tổng thu nhập",
      value: "45,231,000₫",
      change: "+20.1%",
      trend: "up" as const,
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      title: "Số click",
      value: "12,234",
      change: "+15.3%",
      trend: "up" as const,
      icon: <MousePointer className="h-4 w-4" />
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: "3.24%",
      change: "-2.1%",
      trend: "down" as const,
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      title: "Lượt xem",
      value: "573,456",
      change: "+12.5%",
      trend: "up" as const,
      icon: <Eye className="h-4 w-4" />
    }
  ];

  const displayStats = stats || fallbackStats;

  return (
    <div className="space-y-4">
      {isOffline && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
          <WifiOff className="h-4 w-4" />
          <span>Đang hiển thị dữ liệu đã lưu (offline mode)</span>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={isLoading ? "Loading..." : stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
          />
        ))}
      </div>
    </div>
  )
}
