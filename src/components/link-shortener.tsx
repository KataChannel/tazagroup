"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, ExternalLink, BarChart3, Scissors, QrCode } from 'lucide-react'
import { toast } from 'sonner'

interface ShortenedLink {
  id: string
  originalUrl: string
  shortCode: string
  shortUrl: string
  clicks: number
  createdAt: string
  isActive: boolean
}

export default function LinkShortener() {
  const [url, setUrl] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shortenedLinks, setShortenedLinks] = useState<ShortenedLink[]>([
    {
      id: '1',
      originalUrl: 'https://example.com/very-long-affiliate-link-here',
      shortCode: 'xyz123',
      shortUrl: 'https://short.ly/xyz123',
      clicks: 245,
      createdAt: '2025-01-15',
      isActive: true
    },
    {
      id: '2', 
      originalUrl: 'https://another-example.com/campaign/summer-sale-2025',
      shortCode: 'summer25',
      shortUrl: 'https://short.ly/summer25',
      clicks: 89,
      createdAt: '2025-01-10',
      isActive: true
    }
  ])

  const handleShortenUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) {
      toast.error('Vui lòng nhập URL')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const shortCode = customCode || generateRandomCode()
      const newLink: ShortenedLink = {
        id: Date.now().toString(),
        originalUrl: url,
        shortCode,
        shortUrl: `https://short.ly/${shortCode}`,
        clicks: 0,
        createdAt: new Date().toISOString().split('T')[0],
        isActive: true
      }
      
      setShortenedLinks([newLink, ...shortenedLinks])
      setUrl('')
      setCustomCode('')
      toast.success('Đã tạo link rút gọn thành công!')
      
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo link rút gọn')
    } finally {
      setIsLoading(false)
    }
  }

  const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Đã sao chép link!')
  }

  const toggleLinkStatus = (id: string) => {
    setShortenedLinks(links => 
      links.map(link => 
        link.id === id ? { ...link, isActive: !link.isActive } : link
      )
    )
    toast.success('Đã cập nhật trạng thái link')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          <Scissors className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Link Shortener</h1>
          <p className="text-gray-600">Rút gọn và quản lý các link affiliate của bạn</p>
        </div>
      </div>

      {/* URL Shortener Form */}
      <Card>
        <CardHeader>
          <CardTitle>Tạo Link Rút Gọn</CardTitle>
          <CardDescription>
            Nhập URL dài và tạo link rút gọn dễ chia sẻ với tùy chọn custom code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleShortenUrl} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL gốc *
              </label>
              <Input
                type="url"
                placeholder="https://example.com/your-long-affiliate-link"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Code (tùy chọn)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-sm">short.ly/</span>
                <Input
                  placeholder="custom-code"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Chỉ sử dụng chữ cái, số và dấu gạch ngang. Để trống để tự động tạo.
              </p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Đang tạo...' : 'Tạo Link Rút Gọn'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Shortened Links List */}
      <Card>
        <CardHeader>
          <CardTitle>Link Đã Rút Gọn ({shortenedLinks.length})</CardTitle>
          <CardDescription>
            Quản lý và theo dõi hiệu suất các link rút gọn của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {shortenedLinks.map((link) => (
              <div key={link.id} className="border rounded-lg p-4 space-y-3">
                {/* Short URL */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <a 
                          href={link.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium truncate"
                        >
                          {link.shortUrl}
                        </a>
                        <Badge variant={link.isActive ? "default" : "secondary"}>
                          {link.isActive ? 'Hoạt động' : 'Tạm dừng'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {link.originalUrl}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(link.shortUrl)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(link.shortUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toast.info('QR Code generator đang được phát triển')}
                    >
                      <QrCode className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      <span>{link.clicks} clicks</span>
                    </div>
                    <span>Tạo: {new Date(link.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast.info('Chi tiết analytics đang được phát triển')}
                    >
                      Xem Chi Tiết
                    </Button>
                    <Button
                      variant={link.isActive ? "secondary" : "default"}
                      size="sm"
                      onClick={() => toggleLinkStatus(link.id)}
                    >
                      {link.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {shortenedLinks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Scissors className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Chưa có link nào được rút gọn</p>
                <p className="text-sm">Tạo link rút gọn đầu tiên của bạn ở trên</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng Links</p>
                <p className="text-2xl font-bold">{shortenedLinks.length}</p>
              </div>
              <Scissors className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng Clicks</p>
                <p className="text-2xl font-bold">
                  {shortenedLinks.reduce((sum, link) => sum + link.clicks, 0)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Links Hoạt Động</p>
                <p className="text-2xl font-bold">
                  {shortenedLinks.filter(link => link.isActive).length}
                </p>
              </div>
              <ExternalLink className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
