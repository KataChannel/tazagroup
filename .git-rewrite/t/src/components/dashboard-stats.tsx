"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, MousePointer, Eye } from "lucide-react"

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
  const stats = [
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
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          icon={stat.icon}
        />
      ))}
    </div>
  )
}
