"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  isExpanded?: boolean
}

interface Ticket {
  id: string
  title: string
  status: "open" | "pending" | "resolved"
  priority: "low" | "medium" | "high"
  date: string
  category: string
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "Làm sao để bắt đầu với AccessTrade?",
    answer: "Để bắt đầu với AccessTrade, bạn cần đăng ký tài khoản, xác thực thông tin, sau đó có thể tham gia các chiến dịch affiliate phù hợp.",
    category: "getting-started"
  },
  {
    id: "2",
    question: "Khi nào tôi nhận được hoa hồng?",
    answer: "Hoa hồng sẽ được thanh toán hàng tuần vào mỗi thứ 6, với điều kiện đạt ngưỡng tối thiểu 500,000 VND.",
    category: "payment"
  },
  {
    id: "3",
    question: "Tại sao link affiliate của tôi không hoạt động?",
    answer: "Có thể do link đã hết hạn, chiến dịch đã kết thúc, hoặc có lỗi trong quá trình tạo link. Hãy kiểm tra lại trong mục Tools.",
    category: "technical"
  },
  {
    id: "4",
    question: "Làm sao để tăng tỷ lệ chuyển đổi?",
    answer: "Tập trung vào nội dung chất lượng, chọn sản phẩm phù hợp với đối tượng, và sử dụng các công cụ tối ưu hóa có sẵn.",
    category: "optimization"
  }
]

const tickets: Ticket[] = [
  {
    id: "TICK-001",
    title: "Không nhận được hoa hồng từ đơn hàng #SH123456",
    status: "open",
    priority: "high",
    date: "22/07/2024",
    category: "Payment"
  },
  {
    id: "TICK-002", 
    title: "Link affiliate bị lỗi 404",
    status: "pending",
    priority: "medium",
    date: "21/07/2024",
    category: "Technical"
  },
  {
    id: "TICK-003",
    title: "Yêu cầu tăng hạn mức thanh toán",
    status: "resolved",
    priority: "low", 
    date: "20/07/2024",
    category: "Account"
  }
]

function FAQItem({ faq, isExpanded, onToggle }: { faq: FAQ, isExpanded: boolean, onToggle: () => void }) {
  return (
    <div className="border rounded-lg">
      <button
        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
        onClick={onToggle}
      >
        <span className="font-medium">{faq.question}</span>
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 text-sm text-muted-foreground border-t">
          {faq.answer}
        </div>
      )}
    </div>
  )
}

function TicketRow({ ticket }: { ticket: Ticket }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">Đang mở</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Đã giải quyết</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600"
      case "medium": return "text-yellow-600"
      case "low": return "text-green-600"
      default: return "text-gray-600"
    }
  }

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-3 px-4">
        <div className="font-medium text-sm">{ticket.id}</div>
        <div className="text-xs text-gray-500">{ticket.title}</div>
      </td>
      <td className="py-3 px-4">
        {getStatusBadge(ticket.status)}
      </td>
      <td className="py-3 px-4">
        <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
          {ticket.priority === "high" && "Cao"}
          {ticket.priority === "medium" && "Trung bình"}
          {ticket.priority === "low" && "Thấp"}
        </span>
      </td>
      <td className="py-3 px-4 text-sm">
        {ticket.date}
      </td>
      <td className="py-3 px-4">
        <Button variant="ghost" size="sm">
          Xem chi tiết
        </Button>
      </td>
    </tr>
  )
}

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "getting-started", name: "Bắt đầu" },
    { id: "payment", name: "Thanh toán" },
    { id: "technical", name: "Kỹ thuật" },
    { id: "optimization", name: "Tối ưu" }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Trung tâm hỗ trợ</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
          </p>
        </div>

        {/* Quick Contact */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <MessageCircle className="h-8 w-8 mx-auto text-blue-600 mb-3" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Trò chuyện trực tiếp với đội hỗ trợ
              </p>
              <Button className="w-full">Bắt đầu chat</Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Phone className="h-8 w-8 mx-auto text-green-600 mb-3" />
              <h3 className="font-semibold mb-2">Hotline</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Gọi điện trực tiếp: 1900-xxx-xxx
              </p>
              <Button className="w-full" variant="outline">Gọi ngay</Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Mail className="h-8 w-8 mx-auto text-purple-600 mb-3" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Gửi email: support@accesstrade.vn
              </p>
              <Button className="w-full" variant="outline">Gửi email</Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">Câu hỏi thường gặp</TabsTrigger>
            <TabsTrigger value="tickets">Ticket hỗ trợ</TabsTrigger>
            <TabsTrigger value="guides">Hướng dẫn</TabsTrigger>
            <TabsTrigger value="contact">Liên hệ</TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm câu hỏi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
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

            {/* FAQ List */}
            <div className="max-w-4xl mx-auto space-y-2">
              {filteredFAQs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isExpanded={expandedFAQ === faq.id}
                  onToggle={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Ticket hỗ trợ của bạn</h2>
              <Button>
                Tạo ticket mới
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium">Ticket ID</th>
                        <th className="text-left py-3 px-4 font-medium">Trạng thái</th>
                        <th className="text-left py-3 px-4 font-medium">Độ ưu tiên</th>
                        <th className="text-left py-3 px-4 font-medium">Ngày tạo</th>
                        <th className="text-left py-3 px-4 font-medium">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => (
                        <TicketRow key={ticket.id} ticket={ticket} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Hướng dẫn bắt đầu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Các bước cơ bản để bắt đầu với AccessTrade
                  </p>
                  <Button variant="outline" className="w-full">
                    Xem hướng dẫn
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Tối ưu hóa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Cách tối ưu hóa chiến dịch để tăng doanh thu
                  </p>
                  <Button variant="outline" className="w-full">
                    Xem hướng dẫn
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Xử lý sự cố
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Hướng dẫn xử lý các vấn đề thường gặp
                  </p>
                  <Button variant="outline" className="w-full">
                    Xem hướng dẫn
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle>Gửi yêu cầu hỗ trợ</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Họ tên</label>
                      <Input placeholder="Nhập họ tên của bạn" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="Nhập email của bạn" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chủ đề</label>
                    <Input placeholder="Tóm tắt vấn đề của bạn" />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nội dung</label>
                    <textarea 
                      className="w-full p-3 border rounded-md h-32"
                      placeholder="Mô tả chi tiết vấn đề..."
                    />
                  </div>
                  
                  <Button className="w-full">
                    Gửi yêu cầu
                  </Button>
                </CardContent>
              </Card>

              {/* Support Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Thời gian hỗ trợ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Thứ 2 - Thứ 6:</span>
                      <span>8:00 - 22:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thứ 7 - Chủ nhật:</span>
                      <span>9:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Live Chat:</span>
                      <span className="text-green-600">24/7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
