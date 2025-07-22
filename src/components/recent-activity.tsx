"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, MousePointer, ShoppingCart } from "lucide-react"

interface Activity {
  id: string
  type: "commission" | "click" | "conversion"
  description: string
  amount?: string
  timestamp: string
  status: "pending" | "completed" | "failed"
}

const activities: Activity[] = [
  {
    id: "1",
    type: "commission",
    description: "Hoa hồng từ đơn hàng Shopee #SH123456",
    amount: "125,000₫",
    timestamp: "2 phút trước",
    status: "completed"
  },
  {
    id: "2", 
    type: "click",
    description: "Click vào link Tiki sản phẩm điện thoại",
    timestamp: "15 phút trước",
    status: "completed"
  },
  {
    id: "3",
    type: "conversion", 
    description: "Chuyển đổi thành công từ Lazada",
    amount: "89,000₫",
    timestamp: "1 giờ trước",
    status: "pending"
  },
  {
    id: "4",
    type: "commission",
    description: "Hoa hồng từ Grab delivery",
    amount: "15,000₫", 
    timestamp: "3 giờ trước",
    status: "completed"
  },
  {
    id: "5",
    type: "click",
    description: "Click vào banner FPT Shop", 
    timestamp: "5 giờ trước",
    status: "completed"
  }
]

function getActivityIcon(type: Activity["type"]) {
  switch (type) {
    case "commission":
      return <DollarSign className="h-4 w-4 text-green-600" />
    case "click":
      return <MousePointer className="h-4 w-4 text-blue-600" />
    case "conversion":
      return <ShoppingCart className="h-4 w-4 text-purple-600" />
  }
}

function getStatusBadge(status: Activity["status"]) {
  switch (status) {
    case "completed":
      return <Badge variant="secondary" className="text-green-600 bg-green-50">Hoàn thành</Badge>
    case "pending":
      return <Badge variant="secondary" className="text-yellow-600 bg-yellow-50">Chờ xử lý</Badge>
    case "failed":
      return <Badge variant="destructive">Thất bại</Badge>
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hoạt động gần đây</CardTitle>
        <Button variant="outline" size="sm">
          Xem tất cả
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {activity.amount && (
                  <span className="text-sm font-semibold text-green-600">
                    {activity.amount}
                  </span>
                )}
                {getStatusBadge(activity.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
