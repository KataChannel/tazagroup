"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs } from '@/components/ui/tabs'
import { User, Phone, MapPin, CreditCard, Globe, Building2, FileText, Camera } from 'lucide-react'

interface UserProfile {
  id: string
  firstName?: string
  lastName?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  bankName?: string
  bankAccount?: string
  bankOwner?: string
  taxCode?: string
  website?: string
  company?: string
  bio?: string
  avatar?: string
}

interface UserWithProfile {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  isVerified: boolean
  createdAt: string
  profile?: UserProfile
  _count: {
    campaigns: number
    clicks: number
    conversions: number
  }
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [userProfile, setUserProfile] = useState<UserWithProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('info')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    country: 'VN',
    bankName: '',
    bankAccount: '',
    bankOwner: '',
    taxCode: '',
    website: '',
    company: '',
    bio: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data.user)
        
        // Fill form with existing data
        if (data.user.profile) {
          setFormData({
            firstName: data.user.profile.firstName || '',
            lastName: data.user.profile.lastName || '',
            phone: data.user.profile.phone || '',
            address: data.user.profile.address || '',
            city: data.user.profile.city || '',
            country: data.user.profile.country || 'VN',
            bankName: data.user.profile.bankName || '',
            bankAccount: data.user.profile.bankAccount || '',
            bankOwner: data.user.profile.bankOwner || '',
            taxCode: data.user.profile.taxCode || '',
            website: data.user.profile.website || '',
            company: data.user.profile.company || '',
            bio: data.user.profile.bio || '',
          })
        }
      } else {
        setError('Không thể tải thông tin hồ sơ')
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi tải hồ sơ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Cập nhật hồ sơ thành công!')
        fetchProfile() // Refresh data
      } else {
        setError(data.error || 'Đã xảy ra lỗi khi cập nhật hồ sơ')
      }
    } catch (err) {
      setError('Đã xảy ra lỗi kết nối')
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Không thể tải thông tin hồ sơ</p>
          <Button onClick={fetchProfile} className="mt-4">
            Thử lại
          </Button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'info', label: 'Thông tin cá nhân', icon: User },
    { id: 'payment', label: 'Thông tin thanh toán', icon: CreditCard },
    { id: 'business', label: 'Thông tin doanh nghiệp', icon: Building2 },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
        <p className="text-gray-600 mt-2">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Profile Summary */}
        <Card className="lg:col-span-1 p-6">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userProfile.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="font-semibold text-lg">{userProfile.name}</h3>
            <p className="text-gray-600 text-sm">{userProfile.email}</p>
            
            <div className="flex justify-center mt-3">
              <Badge variant={userProfile.isVerified ? "default" : "secondary"}>
                {userProfile.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
              </Badge>
            </div>
            
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Chiến dịch:</span>
                <span className="font-medium">{userProfile._count.campaigns}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Click:</span>
                <span className="font-medium">{userProfile._count.clicks.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Chuyển đổi:</span>
                <span className="font-medium">{userProfile._count.conversions}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Form */}
        <Card className="lg:col-span-3 p-6">
          {/* Notifications */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 px-4 py-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Tab */}
            {activeTab === 'info' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin cá nhân
                </h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ
                    </label>
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="Nguyễn"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên
                    </label>
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Văn A"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Số điện thoại
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="0123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Địa chỉ
                  </label>
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="123 Đường ABC, Phường XYZ"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thành phố
                    </label>
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Hồ Chí Minh"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quốc gia
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="VN">Việt Nam</option>
                      <option value="US">United States</option>
                      <option value="SG">Singapore</option>
                      <option value="TH">Thailand</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Viết vài dòng giới thiệu về bản thân..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Payment Information Tab */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Thông tin thanh toán
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên ngân hàng
                  </label>
                  <Input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange('bankName', e.target.value)}
                    placeholder="Vietcombank, Techcombank, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tài khoản
                  </label>
                  <Input
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên chủ tài khoản
                  </label>
                  <Input
                    type="text"
                    value={formData.bankOwner}
                    onChange={(e) => handleInputChange('bankOwner', e.target.value)}
                    placeholder="NGUYEN VAN A"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Lưu ý:</strong> Thông tin thanh toán sẽ được sử dụng để chi trả hoa hồng. Vui lòng kiểm tra kỹ thông tin trước khi lưu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Business Information Tab */}
            {activeTab === 'business' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Thông tin doanh nghiệp
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên công ty
                  </label>
                  <Input
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="ABC Company Ltd."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã số thuế
                  </label>
                  <Input
                    type="text"
                    value={formData.taxCode}
                    onChange={(e) => handleInputChange('taxCode', e.target.value)}
                    placeholder="0123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Website
                  </label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button type="submit" disabled={isSaving} className="px-8">
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
