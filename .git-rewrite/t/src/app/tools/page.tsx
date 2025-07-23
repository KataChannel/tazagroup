"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Link, 
  QrCode, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Copy,
  Download,
  Share,
  Settings,
  Palette,
  Code,
  Smartphone,
  Globe
} from "lucide-react"

interface Tool {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  isPro?: boolean
}

const tools: Tool[] = [
  {
    id: "link-generator",
    name: "Tạo Link Affiliate",
    description: "Tạo link affiliate tracking cho các chiến dịch",
    icon: <Link className="h-6 w-6" />,
    category: "links"
  },
  {
    id: "qr-generator", 
    name: "Tạo QR Code",
    description: "Tạo mã QR cho link affiliate của bạn",
    icon: <QrCode className="h-6 w-6" />,
    category: "links"
  },
  {
    id: "banner-maker",
    name: "Tạo Banner",
    description: "Thiết kế banner quảng cáo chuyên nghiệp",
    icon: <ImageIcon className="h-6 w-6" />,
    category: "creative",
    isPro: true
  },
  {
    id: "video-editor",
    name: "Chỉnh sửa Video",
    description: "Công cụ chỉnh sửa video marketing",
    icon: <Video className="h-6 w-6" />,
    category: "creative",
    isPro: true
  },
  {
    id: "landing-builder",
    name: "Tạo Landing Page",
    description: "Xây dựng trang đích chuyển đổi cao",
    icon: <Globe className="h-6 w-6" />,
    category: "pages"
  },
  {
    id: "mobile-app",
    name: "App Mobile",
    description: "Ứng dụng di động cho affiliate",
    icon: <Smartphone className="h-6 w-6" />,
    category: "mobile"
  }
]

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white">
              {tool.icon}
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {tool.name}
                {tool.isPro && (
                  <Badge variant="secondary" className="text-xs px-2 py-0">
                    PRO
                  </Badge>
                )}
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {tool.description}
        </p>
        
        <Button className="w-full">
          Sử dụng ngay
        </Button>
      </CardContent>
    </Card>
  )
}

export default function ToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [linkUrl, setLinkUrl] = useState("")
  const [affiliateLink, setAffiliateLink] = useState("")

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "links", name: "Link & QR" },
    { id: "creative", name: "Sáng tạo" },
    { id: "pages", name: "Landing Page" },
    { id: "mobile", name: "Mobile" }
  ]

  const filteredTools = selectedCategory === "all" 
    ? tools 
    : tools.filter(tool => tool.category === selectedCategory)

  const generateAffiliateLink = () => {
    if (!linkUrl) return
    const baseUrl = "https://timona.vn/redirect"
    const params = new URLSearchParams({
      url: linkUrl,
      campaign_id: "12345",
      affiliate_id: "your_id",
      timestamp: Date.now().toString()
    })
    setAffiliateLink(`${baseUrl}?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Công cụ Affiliate</h1>
          <p className="text-muted-foreground">
            Bộ công cụ đầy đủ để tối ưu hóa chiến dịch affiliate marketing của bạn
          </p>
        </div>

        <Tabs defaultValue="tools" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tools">Tất cả công cụ</TabsTrigger>
            <TabsTrigger value="link-generator">Tạo Link</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Tools Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="link-generator" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Link Generator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link className="h-5 w-5" />
                    Tạo Link Affiliate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">URL gốc</label>
                    <Input
                      placeholder="https://example.com/product"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                    />
                  </div>
                  
                  <Button onClick={generateAffiliateLink} className="w-full">
                    Tạo Link Affiliate
                  </Button>
                  
                  {affiliateLink && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Link Affiliate</label>
                      <div className="flex gap-2">
                        <Input
                          value={affiliateLink}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => navigator.clipboard.writeText(affiliateLink)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* QR Code Generator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Tạo QR Code
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Link cần tạo QR</label>
                    <Input
                      placeholder="Nhập link affiliate"
                      value={affiliateLink}
                      onChange={(e) => setAffiliateLink(e.target.value)}
                    />
                  </div>
                  
                  <Button className="w-full">
                    Tạo QR Code
                  </Button>
                  
                  {/* QR Code Preview */}
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                    <QrCode className="h-32 w-32 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-500">QR Code sẽ hiển thị ở đây</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Analytics Tools */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Tracking Setup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cài đặt mã tracking cho website của bạn
                  </p>
                  <Button className="w-full">
                    Cài đặt Tracking
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    API Integration  
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tích hợp API để tự động hóa quy trình
                  </p>
                  <Button className="w-full">
                    Xem API Docs
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Brand Kit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tùy chỉnh thương hiệu cho link và tools
                  </p>
                  <Button className="w-full">
                    Tùy chỉnh Brand
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="justify-start">
                <Download className="h-4 w-4 mr-2" />
                Tải xuống báo cáo
              </Button>
              <Button variant="outline" className="justify-start">
                <Share className="h-4 w-4 mr-2" />
                Chia sẻ campaign
              </Button>
              <Button variant="outline" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Tạo content template
              </Button>
              <Button variant="outline" className="justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt nâng cao
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
