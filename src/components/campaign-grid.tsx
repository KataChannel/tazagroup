"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ExternalLink, Copy } from "lucide-react"

interface Campaign {
  id: string
  name: string
  merchant: string
  logo: string
  commission: string
  category: string
  rating: number
  isHot?: boolean
  description: string
}

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Shopee Affiliate",
    merchant: "Shopee",
    logo: "/api/placeholder/64/64",
    commission: "Lên đến 12%",
    category: "E-commerce",
    rating: 4.8,
    isHot: true,
    description: "Kiếm tiền với sàn thương mại điện tử hàng đầu Việt Nam"
  },
  {
    id: "2", 
    name: "Tiki Partnership",
    merchant: "Tiki",
    logo: "/api/placeholder/64/64",
    commission: "8-15%",
    category: "E-commerce",
    rating: 4.7,
    description: "Chương trình đối tác với Tiki - mua sắm trực tuyến"
  },
  {
    id: "3",
    name: "Grab for Business",
    merchant: "Grab",
    logo: "/api/placeholder/64/64", 
    commission: "5-10%",
    category: "Delivery",
    rating: 4.6,
    description: "Dịch vụ giao hàng và di chuyển hàng đầu"
  },
  {
    id: "4",
    name: "Sendo Affiliate",
    merchant: "Sendo",
    logo: "/api/placeholder/64/64",
    commission: "6-12%", 
    category: "E-commerce",
    rating: 4.5,
    description: "Nền tảng thương mại điện tử tại Việt Nam"
  },
  {
    id: "5",
    name: "Lazada Associates",
    merchant: "Lazada",
    logo: "/api/placeholder/64/64",
    commission: "10-18%",
    category: "E-commerce", 
    rating: 4.9,
    isHot: true,
    description: "Chương trình liên kết Lazada với hoa hồng cao"
  },
  {
    id: "6",
    name: "FPT Shop Partner",
    merchant: "FPT Shop", 
    logo: "/api/placeholder/64/64",
    commission: "3-8%",
    category: "Technology",
    rating: 4.4,
    description: "Đối tác bán lẻ công nghệ hàng đầu"
  }
]

function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
              <div className="h-8 w-8 rounded bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </div>
            <div>
              <CardTitle className="text-base">{campaign.merchant}</CardTitle>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">{campaign.rating}</span>
              </div>
            </div>
          </div>
          {campaign.isHot && (
            <Badge variant="destructive" className="text-xs">
              HOT
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-sm mb-1">{campaign.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {campaign.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Hoa hồng</p>
            <p className="font-semibold text-green-600">{campaign.commission}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {campaign.category}
          </Badge>
        </div>
        
        <div className="flex space-x-2">
          <Button size="sm" className="flex-1">
            <ExternalLink className="h-3 w-3 mr-1" />
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

export function CampaignGrid() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Chiến dịch nổi bật</h2>
        <Button variant="outline">Xem tất cả</Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  )
}
