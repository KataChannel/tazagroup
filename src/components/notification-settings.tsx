"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Globe, 
  Settings, 
  Volume2, 
  VolumeX,
  Check,
  X,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'
import { toast } from 'sonner'

interface NotificationPreference {
  id: string
  category: 'campaigns' | 'payments' | 'performance' | 'system' | 'marketing'
  title: string
  description: string
  channels: {
    email: boolean
    push: boolean
    sms: boolean
    inApp: boolean
  }
  frequency: 'instant' | 'daily' | 'weekly' | 'monthly'
  priority: 'low' | 'medium' | 'high'
  enabled: boolean
}

interface NotificationChannel {
  id: 'email' | 'push' | 'sms' | 'inApp'
  name: string
  icon: React.ReactNode
  description: string
  enabled: boolean
  verified?: boolean
}

export default function NotificationSettings() {
  const [activeTab, setActiveTab] = useState('preferences')
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([
    {
      id: '1',
      category: 'campaigns',
      title: 'Chiến dịch mới',
      description: 'Thông báo khi có chiến dịch mới phù hợp với bạn',
      channels: { email: true, push: true, sms: false, inApp: true },
      frequency: 'instant',
      priority: 'high',
      enabled: true
    },
    {
      id: '2',
      category: 'campaigns',
      title: 'Trạng thái đăng ký',
      description: 'Cập nhật về trạng thái đăng ký tham gia chiến dịch',
      channels: { email: true, push: true, sms: false, inApp: true },
      frequency: 'instant',
      priority: 'high',
      enabled: true
    },
    {
      id: '3',
      category: 'payments',
      title: 'Thanh toán thành công',
      description: 'Xác nhận khi thanh toán được xử lý thành công',
      channels: { email: true, push: true, sms: true, inApp: true },
      frequency: 'instant',
      priority: 'high',
      enabled: true
    },
    {
      id: '4',
      category: 'payments',
      title: 'Yêu cầu rút tiền',
      description: 'Cập nhật về trạng thái yêu cầu rút tiền',
      channels: { email: true, push: true, sms: false, inApp: true },
      frequency: 'instant',
      priority: 'high',
      enabled: true
    },
    {
      id: '5',
      category: 'performance',
      title: 'Báo cáo hiệu suất',
      description: 'Báo cáo định kỳ về hiệu suất affiliate',
      channels: { email: true, push: false, sms: false, inApp: true },
      frequency: 'weekly',
      priority: 'medium',
      enabled: true
    },
    {
      id: '6',
      category: 'performance',
      title: 'Mục tiêu đạt được',
      description: 'Thông báo khi đạt được mục tiêu hoa hồng',
      channels: { email: true, push: true, sms: false, inApp: true },
      frequency: 'instant',
      priority: 'medium',
      enabled: true
    },
    {
      id: '7',
      category: 'system',
      title: 'Bảo trì hệ thống',
      description: 'Thông báo về lịch bảo trì và cập nhật hệ thống',
      channels: { email: true, push: true, sms: false, inApp: true },
      frequency: 'instant',
      priority: 'medium',
      enabled: true
    },
    {
      id: '8',
      category: 'marketing',
      title: 'Tips & Tricks',
      description: 'Mẹo và chiến lược để tối ưu hóa affiliate marketing',
      channels: { email: true, push: false, sms: false, inApp: false },
      frequency: 'weekly',
      priority: 'low',
      enabled: false
    }
  ])

  const [channels, setChannels] = useState<NotificationChannel[]>([
    {
      id: 'email',
      name: 'Email',
      icon: <Mail className="w-4 h-4" />,
      description: 'Nhận thông báo qua email',
      enabled: true,
      verified: true
    },
    {
      id: 'push',
      name: 'Push Notifications',
      icon: <Bell className="w-4 h-4" />,
      description: 'Thông báo đẩy trên trình duyệt và app',
      enabled: true,
      verified: true
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: <Smartphone className="w-4 h-4" />,
      description: 'Thông báo qua tin nhắn SMS',
      enabled: false,
      verified: false
    },
    {
      id: 'inApp',
      name: 'In-App',
      icon: <Globe className="w-4 h-4" />,
      description: 'Thông báo trong ứng dụng',
      enabled: true,
      verified: true
    }
  ])

  const [globalSettings, setGlobalSettings] = useState({
    doNotDisturb: false,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    },
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'vi',
    sound: true,
    desktop: true
  })

  const updatePreference = (id: string, updates: Partial<NotificationPreference>) => {
    setNotificationPreferences(prefs => 
      prefs.map(pref => 
        pref.id === id ? { ...pref, ...updates } : pref
      )
    )
  }

  const toggleChannel = (channelId: 'email' | 'push' | 'sms' | 'inApp') => {
    setChannels(channels => 
      channels.map(channel => 
        channel.id === channelId 
          ? { ...channel, enabled: !channel.enabled }
          : channel
      )
    )
  }

  const saveSettings = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Đã lưu cài đặt thông báo!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu cài đặt')
    }
  }

  const testNotification = (type: string) => {
    // Show test notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Test Notification - ${type}`, {
        body: 'Đây là thông báo thử nghiệm từ AccessTrade',
        icon: '/icons/icon-192x192.png'
      })
    }
    toast.success(`Đã gửi thông báo thử nghiệm: ${type}`)
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        toast.success('Đã cấp quyền thông báo!')
        setChannels(channels => 
          channels.map(channel => 
            channel.id === 'push' 
              ? { ...channel, verified: true }
              : channel
          )
        )
      } else {
        toast.error('Quyền thông báo bị từ chối')
      }
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'campaigns': return <Target className="w-4 h-4" />
      case 'payments': return <DollarSign className="w-4 h-4" />
      case 'performance': return <TrendingUp className="w-4 h-4" />
      case 'system': return <Settings className="w-4 h-4" />
      case 'marketing': return <Mail className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'campaigns': return 'bg-blue-100 text-blue-800'
      case 'payments': return 'bg-green-100 text-green-800'
      case 'performance': return 'bg-purple-100 text-purple-800'
      case 'system': return 'bg-orange-100 text-orange-800'
      case 'marketing': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
          <Bell className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification Settings</h1>
          <p className="text-gray-600">Tùy chỉnh cách bạn nhận thông báo từ AccessTrade</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thông Báo Kích Hoạt</p>
                <p className="text-2xl font-bold">
                  {notificationPreferences.filter(p => p.enabled).length}
                </p>
              </div>
              <Bell className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kênh Kích Hoạt</p>
                <p className="text-2xl font-bold">
                  {channels.filter(c => c.enabled).length}
                </p>
              </div>
              <Globe className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ưu Tiên Cao</p>
                <p className="text-2xl font-bold">
                  {notificationPreferences.filter(p => p.priority === 'high' && p.enabled).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Không Làm Phiền</p>
                <p className="text-2xl font-bold">
                  {globalSettings.doNotDisturb ? 'ON' : 'OFF'}
                </p>
              </div>
              {globalSettings.doNotDisturb ? (
                <VolumeX className="w-8 h-8 text-gray-500" />
              ) : (
                <Volume2 className="w-8 h-8 text-purple-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="preferences">Tùy Chọn</TabsTrigger>
          <TabsTrigger value="channels">Kênh Thông Báo</TabsTrigger>
          <TabsTrigger value="global">Cài Đặt Chung</TabsTrigger>
          <TabsTrigger value="test">Kiểm Tra</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tùy Chọn Thông Báo</CardTitle>
                  <CardDescription>
                    Chọn loại thông báo bạn muốn nhận và cách thức nhận
                  </CardDescription>
                </div>
                <Button onClick={saveSettings}>
                  Lưu Cài Đặt
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Group by category */}
                {['campaigns', 'payments', 'performance', 'system', 'marketing'].map(category => {
                  const categoryPrefs = notificationPreferences.filter(p => p.category === category)
                  if (categoryPrefs.length === 0) return null

                  return (
                    <div key={category} className="space-y-4">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(category)}
                        <h3 className="font-medium capitalize">
                          {category === 'campaigns' && 'Chiến Dịch'}
                          {category === 'payments' && 'Thanh Toán'}
                          {category === 'performance' && 'Hiệu Suất'}
                          {category === 'system' && 'Hệ Thống'}
                          {category === 'marketing' && 'Marketing'}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {categoryPrefs.map((pref) => (
                          <div key={pref.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium">{pref.title}</h4>
                                  <Badge className={getCategoryColor(pref.category)}>
                                    {getCategoryIcon(pref.category)}
                                  </Badge>
                                  <Badge className={getPriorityColor(pref.priority)}>
                                    {pref.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{pref.description}</p>
                              </div>
                              
                              <Switch
                                checked={pref.enabled}
                                onCheckedChange={(checked) => updatePreference(pref.id, { enabled: checked })}
                              />
                            </div>

                            {pref.enabled && (
                              <div className="space-y-3 pt-3 border-t">
                                {/* Channels */}
                                <div>
                                  <Label className="text-sm font-medium">Kênh thông báo</Label>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                    {Object.entries(pref.channels).map(([channelId, enabled]) => {
                                      const channel = channels.find(c => c.id === channelId)
                                      if (!channel?.enabled) return null

                                      return (
                                        <div
                                          key={channelId}
                                          className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${
                                            enabled ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                                          }`}
                                          onClick={() => updatePreference(pref.id, {
                                            channels: { ...pref.channels, [channelId]: !enabled }
                                          })}
                                        >
                                          {channel.icon}
                                          <span className="text-sm">{channel.name}</span>
                                          {enabled && <Check className="w-3 h-3 text-blue-600 ml-auto" />}
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>

                                {/* Frequency */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Tần suất</Label>
                                    <Select
                                      value={pref.frequency}
                                      onValueChange={(value: any) => updatePreference(pref.id, { frequency: value })}
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="instant">Ngay lập tức</SelectItem>
                                        <SelectItem value="daily">Hàng ngày</SelectItem>
                                        <SelectItem value="weekly">Hàng tuần</SelectItem>
                                        <SelectItem value="monthly">Hàng tháng</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div>
                                    <Label className="text-sm font-medium">Độ ưu tiên</Label>
                                    <Select
                                      value={pref.priority}
                                      onValueChange={(value: any) => updatePreference(pref.id, { priority: value })}
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="low">Thấp</SelectItem>
                                        <SelectItem value="medium">Trung bình</SelectItem>
                                        <SelectItem value="high">Cao</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle>Kênh Thông Báo</CardTitle>
              <CardDescription>
                Cấu hình các kênh thông báo và xác thực
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channels.map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                        {channel.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{channel.name}</h4>
                          {channel.verified && (
                            <Badge className="bg-green-100 text-green-800">
                              <Check className="w-3 h-3 mr-1" />
                              Đã xác thực
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{channel.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!channel.verified && channel.id === 'push' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={requestNotificationPermission}
                        >
                          Cấp Quyền
                        </Button>
                      )}
                      
                      {!channel.verified && channel.id === 'sms' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info('Tính năng SMS đang được phát triển')}
                        >
                          Xác Thực
                        </Button>
                      )}
                      
                      <Switch
                        checked={channel.enabled}
                        onCheckedChange={() => toggleChannel(channel.id)}
                        disabled={channel.id === 'sms' && !channel.verified}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global">
          <Card>
            <CardHeader>
              <CardTitle>Cài Đặt Chung</CardTitle>
              <CardDescription>
                Cấu hình chung cho tất cả thông báo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Do Not Disturb */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-medium">Không làm phiền</Label>
                  <p className="text-sm text-gray-600">
                    Tạm thời tắt tất cả thông báo
                  </p>
                </div>
                <Switch
                  checked={globalSettings.doNotDisturb}
                  onCheckedChange={(checked) => 
                    setGlobalSettings(prev => ({ ...prev, doNotDisturb: checked }))
                  }
                />
              </div>

              {/* Quiet Hours */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Giờ yên tĩnh</Label>
                    <p className="text-sm text-gray-600">
                      Không gửi thông báo trong khoảng thời gian này
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.quietHours.enabled}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({
                        ...prev,
                        quietHours: { ...prev.quietHours, enabled: checked }
                      }))
                    }
                  />
                </div>

                {globalSettings.quietHours.enabled && (
                  <div className="grid grid-cols-2 gap-4 pl-4">
                    <div>
                      <Label>Bắt đầu</Label>
                      <Select
                        value={globalSettings.quietHours.start}
                        onValueChange={(value) =>
                          setGlobalSettings(prev => ({
                            ...prev,
                            quietHours: { ...prev.quietHours, start: value }
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0')
                            return (
                              <SelectItem key={i} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Kết thúc</Label>
                      <Select
                        value={globalSettings.quietHours.end}
                        onValueChange={(value) =>
                          setGlobalSettings(prev => ({
                            ...prev,
                            quietHours: { ...prev.quietHours, end: value }
                          }))
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => {
                            const hour = i.toString().padStart(2, '0')
                            return (
                              <SelectItem key={i} value={`${hour}:00`}>
                                {hour}:00
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              {/* Other Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Âm thanh thông báo</Label>
                    <p className="text-sm text-gray-600">
                      Phát âm thanh khi có thông báo mới
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.sound}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, sound: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Thông báo desktop</Label>
                    <p className="text-sm text-gray-600">
                      Hiển thị thông báo trên desktop
                    </p>
                  </div>
                  <Switch
                    checked={globalSettings.desktop}
                    onCheckedChange={(checked) => 
                      setGlobalSettings(prev => ({ ...prev, desktop: checked }))
                    }
                  />
                </div>
              </div>

              {/* Timezone & Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Múi giờ</Label>
                  <Select
                    value={globalSettings.timezone}
                    onValueChange={(value) => 
                      setGlobalSettings(prev => ({ ...prev, timezone: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Ho_Chi_Minh">GMT+7 (Ho Chi Minh)</SelectItem>
                      <SelectItem value="UTC">GMT+0 (UTC)</SelectItem>
                      <SelectItem value="America/New_York">GMT-5 (New York)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Ngôn ngữ</Label>
                  <Select
                    value={globalSettings.language}
                    onValueChange={(value) => 
                      setGlobalSettings(prev => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <Card>
            <CardHeader>
              <CardTitle>Kiểm Tra Thông Báo</CardTitle>
              <CardDescription>
                Gửi thông báo thử nghiệm để kiểm tra cài đặt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { type: 'Chiến dịch mới', description: 'Thông báo về chiến dịch mới' },
                    { type: 'Thanh toán', description: 'Xác nhận thanh toán thành công' },
                    { type: 'Hiệu suất', description: 'Báo cáo hiệu suất hàng tuần' },
                    { type: 'Hệ thống', description: 'Thông báo bảo trì hệ thống' }
                  ].map((item) => (
                    <div key={item.type} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{item.type}</h4>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => testNotification(item.type)}
                      >
                        Gửi Thử
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Lưu ý</p>
                      <p className="text-sm text-yellow-700">
                        Thông báo thử nghiệm chỉ được gửi qua các kênh đã được kích hoạt và xác thực.
                        Nếu không nhận được thông báo, vui lòng kiểm tra cài đặt trình duyệt.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
