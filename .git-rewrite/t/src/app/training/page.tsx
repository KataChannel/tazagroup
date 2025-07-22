"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Award,
  CheckCircle
} from "lucide-react"

interface Course {
  id: string
  title: string
  description: string
  duration: string
  level: "beginner" | "intermediate" | "advanced"
  rating: number
  students: number
  thumbnail: string
  isCompleted?: boolean
  progress?: number
}

interface Article {
  id: string
  title: string
  excerpt: string
  readTime: string
  category: string
  date: string
}

const courses: Course[] = [
  {
    id: "1",
    title: "Affiliate Marketing cho người mới bắt đầu",
    description: "Học cách kiếm tiền online với affiliate marketing từ con số 0",
    duration: "4 giờ 30 phút",
    level: "beginner",
    rating: 4.8,
    students: 1254,
    thumbnail: "/api/placeholder/300/200",
    progress: 65
  },
  {
    id: "2", 
    title: "Tối ưu hóa chiến dịch Affiliate",
    description: "Nâng cao ROI và tỷ lệ chuyển đổi cho các chiến dịch affiliate",
    duration: "3 giờ 15 phút",
    level: "intermediate",
    rating: 4.9,
    students: 892,
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: "3",
    title: "Facebook Ads cho Affiliate",
    description: "Chiến lược quảng cáo Facebook hiệu quả cho affiliate marketer",
    duration: "5 giờ 45 phút", 
    level: "advanced",
    rating: 4.7,
    students: 567,
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: "4",
    title: "SEO Content cho Affiliate",
    description: "Xây dựng content SEO để tăng traffic tự nhiên",
    duration: "2 giờ 30 phút",
    level: "intermediate", 
    rating: 4.6,
    students: 743,
    thumbnail: "/api/placeholder/300/200",
    isCompleted: true
  }
]

const articles: Article[] = [
  {
    id: "1",
    title: "10 Chiến lược Affiliate Marketing hiệu quả nhất 2024",
    excerpt: "Khám phá những chiến lược mới nhất để tăng doanh thu affiliate trong năm 2024",
    readTime: "5 phút đọc",
    category: "Chiến lược",
    date: "22/07/2024"
  },
  {
    id: "2",
    title: "Cách tạo landing page chuyển đổi cao",
    excerpt: "Hướng dẫn chi tiết thiết kế landing page để tối ưu tỷ lệ chuyển đổi",
    readTime: "8 phút đọc", 
    category: "Landing Page",
    date: "21/07/2024"
  },
  {
    id: "3",
    title: "Phân tích đối thủ cạnh tranh trong Affiliate Marketing",
    excerpt: "Công cụ và phương pháp để nghiên cứu đối thủ một cách hiệu quả",
    readTime: "6 phút đọc",
    category: "Phân tích",
    date: "20/07/2024"
  }
]

function CourseCard({ course }: { course: Course }) {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-800"
      case "intermediate": return "bg-yellow-100 text-yellow-800"
      case "advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner": return "Cơ bản"
      case "intermediate": return "Trung cấp" 
      case "advanced": return "Nâng cao"
      default: return level
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg"></div>
        {course.isCompleted && (
          <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full">
            <CheckCircle className="h-4 w-4" />
          </div>
        )}
        <Button
          size="icon"
          className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-white/90 hover:bg-white"
        >
          <Play className="h-6 w-6 text-blue-600" />
        </Button>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Badge className={getLevelColor(course.level)}>
            {getLevelText(course.level)}
          </Badge>
        </div>
        <CardTitle className="text-base leading-tight">
          {course.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {course.duration}
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {course.students.toLocaleString()} học viên
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{course.rating}</span>
          </div>
          {course.progress && (
            <div className="text-sm text-blue-600 font-medium">
              {course.progress}% hoàn thành
            </div>
          )}
        </div>
        
        {course.progress && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        )}
        
        <Button className="w-full">
          {course.isCompleted ? "Xem lại" : course.progress ? "Tiếp tục học" : "Bắt đầu học"}
        </Button>
      </CardContent>
    </Card>
  )
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {article.category}
            </Badge>
            <span className="text-xs text-muted-foreground">{article.date}</span>
          </div>
          
          <h3 className="font-semibold text-lg leading-tight hover:text-blue-600 cursor-pointer">
            {article.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {article.readTime}
            </div>
            <Button variant="ghost" size="sm">
              Đọc thêm
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function TrainingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Đào tạo Affiliate Marketing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nâng cao kỹ năng và kiến thức để trở thành affiliate marketer chuyên nghiệp
          </p>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Khóa học</TabsTrigger>
            <TabsTrigger value="articles">Bài viết</TabsTrigger>
            <TabsTrigger value="webinars">Webinar</TabsTrigger>
            <TabsTrigger value="certificates">Chứng chỉ</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            {/* Course Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Khóa học</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <div className="text-2xl font-bold">24h</div>
                  <div className="text-sm text-muted-foreground">Thời lượng học</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
                  <div className="text-2xl font-bold">3</div>
                  <div className="text-sm text-muted-foreground">Chứng chỉ đạt được</div>
                </CardContent>
              </Card>
            </div>

            {/* Learning Path */}
            <Card>
              <CardHeader>
                <CardTitle>Lộ trình học tập được đề xuất</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">1</div>
                    <div className="flex-1">
                      <h3 className="font-medium">Nền tảng Affiliate Marketing</h3>
                      <p className="text-sm text-muted-foreground">Học các khái niệm cơ bản và cách thức hoạt động</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 border rounded-lg bg-blue-50">
                    <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">2</div>
                    <div className="flex-1">
                      <h3 className="font-medium">Tối ưu hóa chiến dịch</h3>
                      <p className="text-sm text-muted-foreground">Nâng cao hiệu suất và ROI của các chiến dịch</p>
                    </div>
                    <div className="text-sm text-blue-600 font-medium">Đang học</div>
                  </div>
                  
                  <div className="flex items-center space-x-4 p-4 border rounded-lg opacity-60">
                    <div className="h-8 w-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">3</div>
                    <div className="flex-1">
                      <h3 className="font-medium">Quảng cáo nâng cao</h3>
                      <p className="text-sm text-muted-foreground">Facebook Ads, Google Ads cho affiliate</p>
                    </div>
                    <div className="text-sm text-gray-500">Chưa bắt đầu</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Courses Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="webinars" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Webinar sắp tới</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h3 className="font-semibold">Xu hướng Affiliate Marketing 2024</h3>
                        <p className="text-sm text-muted-foreground">
                          Thảo luận về những xu hướng mới và cơ hội trong affiliate marketing
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>📅 25/07/2024</span>
                          <span>🕐 20:00 - 21:30</span>
                          <span>👥 245 người đăng ký</span>
                        </div>
                      </div>
                      <Button>Đăng ký</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Chứng chỉ Affiliate Marketing cơ bản
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Hoàn thành khóa học cơ bản và vượt qua bài kiểm tra
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-800">Đã đạt được</Badge>
                      <Button variant="outline" size="sm">Tải xuống</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Chứng chỉ Chuyên gia Affiliate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Hoàn thành tất cả khóa học nâng cao
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Đang tiến hành</Badge>
                      <span className="text-sm text-muted-foreground">65% hoàn thành</span>
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
