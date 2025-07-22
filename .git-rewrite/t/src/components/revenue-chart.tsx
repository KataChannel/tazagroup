"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

const revenueData = [
  { month: "T1", revenue: 4000000, clicks: 2400 },
  { month: "T2", revenue: 3000000, clicks: 1398 },
  { month: "T3", revenue: 5000000, clicks: 2800 },
  { month: "T4", revenue: 4500000, clicks: 2908 },
  { month: "T5", revenue: 6000000, clicks: 4800 },
  { month: "T6", revenue: 5500000, clicks: 3800 },
  { month: "T7", revenue: 7000000, clicks: 4300 },
]

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê thu nhập</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
            <TabsTrigger value="clicks">Lượt click</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${Number(value).toLocaleString('vi-VN')}₫`, 'Doanh thu']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    dot={{ fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="clicks" className="space-y-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${Number(value).toLocaleString('vi-VN')}`, 'Lượt click']}
                  />
                  <Bar 
                    dataKey="clicks" 
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
