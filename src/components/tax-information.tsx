"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Receipt, 
  Download, 
  FileText, 
  Calculator, 
  AlertTriangle, 
  CheckCircle,
  User,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Percent
} from 'lucide-react'
import { toast } from 'sonner'

interface TaxInfo {
  residencyStatus: 'resident' | 'non-resident'
  taxId: string
  fullName: string
  address: string
  city: string
  country: string
  postalCode: string
  phoneNumber: string
  email: string
  bankAccount: string
  bankName: string
  businessType: 'individual' | 'business'
  companyName?: string
  companyTaxId?: string
  taxYear: string
  withholdingTaxRate: number
  isW8FormRequired: boolean
  hasSubmittedW8: boolean
  w8ExpiryDate?: string
}

interface TaxDocument {
  id: string
  type: 'W8' | '1099' | 'Tax_Statement' | 'Withholding_Certificate'
  name: string
  year: string
  amount: number
  status: 'generated' | 'sent' | 'downloaded'
  createdAt: string
  downloadUrl?: string
}

export default function TaxInformation() {
  const [activeTab, setActiveTab] = useState('info')
  const [taxInfo, setTaxInfo] = useState<TaxInfo>({
    residencyStatus: 'resident',
    taxId: '123456789',
    fullName: 'Nguyen Van A',
    address: '123 Le Loi Street',
    city: 'Ho Chi Minh City',
    country: 'Vietnam',
    postalCode: '700000',
    phoneNumber: '+84 123 456 789',
    email: 'user@example.com',
    bankAccount: '1234567890',
    bankName: 'Vietcombank',
    businessType: 'individual',
    taxYear: '2025',
    withholdingTaxRate: 20,
    isW8FormRequired: false,
    hasSubmittedW8: false
  })

  const [taxDocuments, setTaxDocuments] = useState<TaxDocument[]>([
    {
      id: '1',
      type: 'Tax_Statement',
      name: 'Tax Statement 2024',
      year: '2024',
      amount: 2500.00,
      status: 'generated',
      createdAt: '2025-01-01'
    },
    {
      id: '2',
      type: 'Withholding_Certificate',
      name: 'Withholding Tax Certificate Q4 2024',
      year: '2024',
      amount: 500.00,
      status: 'sent',
      createdAt: '2024-12-31'
    }
  ])

  const [isEditMode, setIsEditMode] = useState(false)
  const [yearToGenerate, setYearToGenerate] = useState('2024')

  const updateTaxInfo = (field: keyof TaxInfo, value: any) => {
    setTaxInfo(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveTaxInfo = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsEditMode(false)
      toast.success('Đã cập nhật thông tin thuế thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông tin thuế')
    }
  }

  const generateTaxDocument = async (type: TaxDocument['type']) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newDoc: TaxDocument = {
        id: Date.now().toString(),
        type,
        name: `${type.replace('_', ' ')} ${yearToGenerate}`,
        year: yearToGenerate,
        amount: Math.random() * 5000,
        status: 'generated',
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setTaxDocuments([newDoc, ...taxDocuments])
      toast.success(`Đã tạo ${type} thành công!`)
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo tài liệu thuế')
    }
  }

  const downloadDocument = (doc: TaxDocument) => {
    // Simulate file download
    const link = document.createElement('a')
    link.href = '#'
    link.download = `${doc.name}.pdf`
    link.click()
    
    // Update document status
    setTaxDocuments(docs => 
      docs.map(d => 
        d.id === doc.id ? { ...d, status: 'downloaded' } : d
      )
    )
    
    toast.success('Đã tải xuống tài liệu!')
  }

  const calculateTaxLiability = () => {
    // Simplified tax calculation for demo
    const yearlyEarnings = 50000000 // 50M VND
    const taxRate = taxInfo.residencyStatus === 'resident' ? 0.20 : 0.22
    const taxLiability = yearlyEarnings * taxRate
    
    return {
      earnings: yearlyEarnings,
      taxRate: taxRate * 100,
      taxLiability,
      netEarnings: yearlyEarnings - taxLiability
    }
  }

  const taxCalculation = calculateTaxLiability()

  const getDocumentIcon = (type: TaxDocument['type']) => {
    switch (type) {
      case 'W8': return '📋'
      case '1099': return '📊'
      case 'Tax_Statement': return '📄'
      case 'Withholding_Certificate': return '🧾'
      default: return '📄'
    }
  }

  const getStatusColor = (status: TaxDocument['status']) => {
    switch (status) {
      case 'generated': return 'bg-blue-100 text-blue-800'
      case 'sent': return 'bg-green-100 text-green-800'
      case 'downloaded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
          <Receipt className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Information</h1>
          <p className="text-gray-600">Quản lý thông tin thuế và tài liệu liên quan đến thuế</p>
        </div>
      </div>

      {/* Tax Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thu Nhập 2024</p>
                <p className="text-2xl font-bold">
                  {(taxCalculation.earnings / 1000000).toFixed(0)}M VND
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thuế Phải Nộp</p>
                <p className="text-2xl font-bold">
                  {(taxCalculation.taxLiability / 1000000).toFixed(1)}M VND
                </p>
              </div>
              <Calculator className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thuế Suất</p>
                <p className="text-2xl font-bold">{taxCalculation.taxRate}%</p>
              </div>
              <Percent className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Thu Nhập Ròng</p>
                <p className="text-2xl font-bold">
                  {(taxCalculation.netEarnings / 1000000).toFixed(1)}M VND
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="info">Thông Tin Thuế</TabsTrigger>
          <TabsTrigger value="documents">Tài Liệu Thuế</TabsTrigger>
          <TabsTrigger value="calculator">Tính Thuế</TabsTrigger>
          <TabsTrigger value="compliance">Tuân Thủ</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Thông Tin Cá Nhân & Thuế</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin cá nhân và thuế để tuân thủ quy định
                  </CardDescription>
                </div>
                
                <Button 
                  variant={isEditMode ? "default" : "outline"}
                  onClick={() => isEditMode ? handleSaveTaxInfo() : setIsEditMode(true)}
                >
                  {isEditMode ? 'Lưu Thay Đổi' : 'Chỉnh Sửa'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Residency Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tình Trạng Cư Trú</Label>
                  <Select 
                    value={taxInfo.residencyStatus} 
                    onValueChange={(value: 'resident' | 'non-resident') => updateTaxInfo('residencyStatus', value)}
                    disabled={!isEditMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resident">Cư dân thuế</SelectItem>
                      <SelectItem value="non-resident">Không phải cư dân thuế</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Loại Hình Kinh Doanh</Label>
                  <Select 
                    value={taxInfo.businessType} 
                    onValueChange={(value: 'individual' | 'business') => updateTaxInfo('businessType', value)}
                    disabled={!isEditMode}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Cá nhân</SelectItem>
                      <SelectItem value="business">Doanh nghiệp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Thông Tin Cá Nhân
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Họ và Tên *</Label>
                    <Input
                      value={taxInfo.fullName}
                      onChange={(e) => updateTaxInfo('fullName', e.target.value)}
                      disabled={!isEditMode}
                    />
                  </div>
                  
                  <div>
                    <Label>Mã Số Thuế *</Label>
                    <Input
                      value={taxInfo.taxId}
                      onChange={(e) => updateTaxInfo('taxId', e.target.value)}
                      disabled={!isEditMode}
                    />
                  </div>
                  
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={taxInfo.email}
                      onChange={(e) => updateTaxInfo('email', e.target.value)}
                      disabled={!isEditMode}
                    />
                  </div>
                  
                  <div>
                    <Label>Số Điện Thoại</Label>
                    <Input
                      value={taxInfo.phoneNumber}
                      onChange={(e) => updateTaxInfo('phoneNumber', e.target.value)}
                      disabled={!isEditMode}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Địa Chỉ</Label>
                  <Input
                    value={taxInfo.address}
                    onChange={(e) => updateTaxInfo('address', e.target.value)}
                    disabled={!isEditMode}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Thành Phố</Label>
                    <Input
                      value={taxInfo.city}
                      onChange={(e) => updateTaxInfo('city', e.target.value)}
                      disabled={!isEditMode}
                    />
                  </div>
                  
                  <div>
                    <Label>Quốc Gia</Label>
                    <Input
                      value={taxInfo.country}
                      onChange={(e) => updateTaxInfo('country', e.target.value)}
                      disabled={!isEditMode}
                    />
                  </div>
                  
                  <div>
                    <Label>Mã Bưu Điện</Label>
                    <Input
                      value={taxInfo.postalCode}
                      onChange={(e) => updateTaxInfo('postalCode', e.target.value)}
                      disabled={!isEditMode}
                    />
                  </div>
                </div>
              </div>

              {/* Business Information */}
              {taxInfo.businessType === 'business' && (
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Thông Tin Doanh Nghiệp
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Tên Công Ty</Label>
                      <Input
                        value={taxInfo.companyName || ''}
                        onChange={(e) => updateTaxInfo('companyName', e.target.value)}
                        disabled={!isEditMode}
                      />
                    </div>
                    
                    <div>
                      <Label>Mã Số Thuế Doanh Nghiệp</Label>
                      <Input
                        value={taxInfo.companyTaxId || ''}
                        onChange={(e) => updateTaxInfo('companyTaxId', e.target.value)}
                        disabled={!isEditMode}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Banking Information */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Thông Tin Ngân Hàng
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tên Ngân Hàng</Label>
                    <Input
                      value={taxInfo.bankName}
                      onChange={(e) => updateTaxInfo('bankName', e.target.value)}
                      disabled={!isEditMode}
                    />
                  </div>
                  
                  <div>
                    <Label>Số Tài Khoản</Label>
                    <Input
                      value={taxInfo.bankAccount}
                      onChange={(e) => updateTaxInfo('bankAccount', e.target.value)}
                      disabled={!isEditMode}
                    />
                  </div>
                </div>
              </div>

              {/* Tax Settings */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Cài Đặt Thuế
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Năm Thuế</Label>
                    <Select 
                      value={taxInfo.taxYear} 
                      onValueChange={(value) => updateTaxInfo('taxYear', value)}
                      disabled={!isEditMode}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Thuế Suất Khấu Trừ (%)</Label>
                    <Input
                      type="number"
                      value={taxInfo.withholdingTaxRate}
                      onChange={(e) => updateTaxInfo('withholdingTaxRate', parseFloat(e.target.value))}
                      disabled={!isEditMode}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      checked={taxInfo.isW8FormRequired}
                      onCheckedChange={(checked) => updateTaxInfo('isW8FormRequired', checked)}
                      disabled={!isEditMode}
                    />
                    <Label>Yêu cầu form W8</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tài Liệu Thuế</CardTitle>
                  <CardDescription>
                    Quản lý và tải xuống các tài liệu thuế
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={yearToGenerate} onValueChange={setYearToGenerate}>
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button onClick={() => generateTaxDocument('Tax_Statement')}>
                    <FileText className="w-4 h-4 mr-2" />
                    Tạo Báo Cáo Thuế
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taxDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getDocumentIcon(doc.type)}</span>
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>Năm: {doc.year}</span>
                          <span>•</span>
                          <span>Số tiền: {doc.amount.toLocaleString()} VND</span>
                          <span>•</span>
                          <span>Tạo: {new Date(doc.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status === 'generated' && 'Đã tạo'}
                        {doc.status === 'sent' && 'Đã gửi'}
                        {doc.status === 'downloaded' && 'Đã tải'}
                      </Badge>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument(doc)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Tải Xuống
                      </Button>
                    </div>
                  </div>
                ))}

                {taxDocuments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Chưa có tài liệu thuế nào</p>
                    <p className="text-sm">Tạo tài liệu thuế đầu tiên của bạn</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle>Tính Toán Thuế</CardTitle>
              <CardDescription>
                Ước tính thuế phải nộp dựa trên thu nhập affiliate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Thông Tin Thu Nhập</h4>
                    
                    <div>
                      <Label>Thu Nhập Affiliate (VND)</Label>
                      <Input
                        type="number"
                        value={taxCalculation.earnings}
                        className="font-mono"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <Label>Tình Trạng Cư Trú</Label>
                      <Badge variant="outline">
                        {taxInfo.residencyStatus === 'resident' ? 'Cư dân thuế' : 'Không phải cư dân thuế'}
                      </Badge>
                    </div>
                    
                    <div>
                      <Label>Thuế Suất Áp Dụng</Label>
                      <div className="text-2xl font-bold text-blue-600">
                        {taxCalculation.taxRate}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Kết Quả Tính Thuế</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span>Thu nhập gốc:</span>
                        <span className="font-bold">
                          {(taxCalculation.earnings / 1000000).toFixed(2)}M VND
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span>Thuế phải nộp:</span>
                        <span className="font-bold text-red-600">
                          -{(taxCalculation.taxLiability / 1000000).toFixed(2)}M VND
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span>Thu nhập ròng:</span>
                        <span className="font-bold text-blue-600">
                          {(taxCalculation.netEarnings / 1000000).toFixed(2)}M VND
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tax Brackets Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-3">Biểu Thuế Thu Nhập Cá Nhân (Tham khảo)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">0 - 60M VND:</span>
                      <span className="ml-2">5%</span>
                    </div>
                    <div>
                      <span className="font-medium">60M - 120M VND:</span>
                      <span className="ml-2">10%</span>
                    </div>
                    <div>
                      <span className="font-medium">Trên 120M VND:</span>
                      <span className="ml-2">20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Tuân Thủ Thuế</CardTitle>
              <CardDescription>
                Kiểm tra tình trạng tuân thủ các quy định thuế
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Compliance Checklist */}
                <div className="space-y-4">
                  <h4 className="font-medium">Checklist Tuân Thủ</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium">Đã cung cấp thông tin thuế</p>
                        <p className="text-sm text-gray-600">Mã số thuế và thông tin cá nhân đã đầy đủ</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <p className="font-medium">Xác thực thông tin ngân hàng</p>
                        <p className="text-sm text-gray-600">Thông tin tài khoản ngân hàng đã được xác thực</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <div className="flex-1">
                        <p className="font-medium">Khai báo thuế định kỳ</p>
                        <p className="text-sm text-gray-600">Cần khai báo thuế cho quý IV/2024</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Cần thực hiện</Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      {taxInfo.isW8FormRequired ? (
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">Form W8 (nếu cần)</p>
                        <p className="text-sm text-gray-600">
                          {taxInfo.isW8FormRequired 
                            ? 'Cần nộp form W8 cho thu nhập từ nguồn nước ngoài' 
                            : 'Không yêu cầu form W8'}
                        </p>
                      </div>
                      <Badge className={
                        taxInfo.isW8FormRequired 
                          ? "bg-yellow-100 text-yellow-800" 
                          : "bg-gray-100 text-gray-800"
                      }>
                        {taxInfo.isW8FormRequired ? 'Cần thực hiện' : 'Không áp dụng'}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Important Notices */}
                <div className="space-y-4">
                  <h4 className="font-medium">Thông Báo Quan Trọng</h4>
                  
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-800">Hạn nộp thuế quý</p>
                          <p className="text-sm text-blue-700">
                            Hạn cuối nộp tờ khai thuế quý IV/2024: 31/01/2025
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800">Thay đổi quy định</p>
                          <p className="text-sm text-yellow-700">
                            Từ 2025, thuế suất đối với thu nhập affiliate có thể thay đổi. 
                            Vui lòng cập nhật thông tin mới nhất.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Tax Support */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Cần hỗ trợ về thuế?</h4>
                      <p className="text-sm text-gray-600">
                        Liên hệ với đội ngũ hỗ trợ thuế của chúng tôi
                      </p>
                    </div>
                    
                    <Button variant="outline">
                      Liên Hệ Hỗ Trợ
                    </Button>
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
