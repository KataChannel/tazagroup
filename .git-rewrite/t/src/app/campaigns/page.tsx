"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Star, ExternalLink, Copy, Heart } from "lucide-react"

interface Campaign {
  id: string
  name: string
  merchant: string
  category: string
  commission: string
  rating: number
  description: string
  isHot?: boolean
  isFavorite?: boolean
  minPayout: string
  cookieDuration: string
}

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Shopee Affiliate Program",
    merchant: "Shopee",
    category: "E-commerce",
    commission: "Lên đến 12%",
    rating: 4.8,
    description: "Chương trình affiliate của sàn thương mại điện tử lớn nhất Đông Nam Á",
    isHot: true,
    minPayout: "500,000₫",
    cookieDuration: "30 ngày"
  },
  {
    id: "2",
    name: "Tiki Partnership",
    merchant: "Tiki",
    category: "E-commerce", 
    commission: "8-15%",
    rating: 4.7,
    description: "Đối tác với Tiki - nền tảng mua sắm trực tuyến hàng đầu",
    minPayout: "300,000₫",
    cookieDuration: "15 ngày"
  },
  {
    id: "3",
    name: "Lazada Associates",
    merchant: "Lazada",
    category: "E-commerce",
    commission: "10-18%", 
    rating: 4.9,
    description: "Chương trình liên kết với Lazada, hoa hồng hấp dẫn",
    isHot: true,
    minPayout: "200,000₫",
    cookieDuration: "7 ngày"
  },
  {
    id: "4",
    name: "Grab for Business",
    merchant: "Grab",
    category: "Delivery",
    commission: "5-10%",
    rating: 4.6,
    description: "Dịch vụ giao hàng và di chuyển số 1 Đông Nam Á",
    minPayout: "100,000₫",
    cookieDuration: "24 giờ"
  },
  {
    id: "5",
    name: "Sendo Affiliate",
    merchant: "Sendo",
    category: "E-commerce",
    commission: "6-12%",
    rating: 4.5,
    description: "Nền tảng thương mại điện tử Made in Vietnam",
    minPayout: "250,000₫",
    cookieDuration: "14 ngày"
  },
  {
    id: "6",
    name: "FPT Shop Partner",
    merchant: "FPT Shop",
    category: "Technology",
    commission: "3-8%",
    rating: 4.4,
    description: "Chuỗi bán lẻ công nghệ hàng đầu Việt Nam",
    minPayout: "500,000₫",
    cookieDuration: "10 ngày"
  }
]

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [isFavorite, setIsFavorite] = useState(campaign.isFavorite || false)

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {campaign.merchant.charAt(0)}
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {campaign.merchant}
                {campaign.isHot && (
                  <Badge variant="destructive" className="text-xs px-2 py-0">
                    HOT
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">{campaign.rating}</span>
                <span className="text-xs text-muted-foreground">• {campaign.category}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-1"
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-sm mb-2">{campaign.name}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {campaign.description}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-muted-foreground">Hoa hồng</p>
            <p className="font-semibold text-green-600">{campaign.commission}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Tối thiểu</p>
            <p className="font-medium">{campaign.minPayout}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Cookie</p>
            <p className="font-medium">{campaign.cookieDuration}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Trạng thái</p>
            <Badge variant="secondary" className="text-xs px-2 py-0">
              Đang hoạt động
            </Badge>
          </div>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button size="sm" className="flex-1">
            <ExternalLink className="h-3 w-3 mr-2" />
            Tham gia
          </Button>
          <Button size="sm" variant="outline">
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", "E-commerce", "Technology", "Delivery", "Finance", "Travel"]

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.merchant.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || campaign.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Chiến dịch Affiliate</h1>
          <p className="text-muted-foreground">
            Khám phá hàng trăm chương trình affiliate từ các thương hiệu hàng đầu
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm chiến dịch, thương hiệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="lg:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category === "all" ? "Tất cả" : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Hiển thị {filteredCampaigns.length} chiến dịch
        </div>

        {/* Campaign Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Xem thêm chiến dịch
          </Button>
        </div>
      </div>
    </div>
  )
}
