'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface ValidationErrors {
  password?: string
  confirmPassword?: string
  token?: string
}

function ResetPasswordContent() {
  const [status, setStatus] = useState<'form' | 'loading' | 'success' | 'error'>('form')
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [formData, setFormData] = useState({
    token: '',
    password: '',
    confirmPassword: ''
  })
  
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setFormData(prev => ({ ...prev, token }))
    } else {
      setStatus('error')
      setMessage('Token không hợp lệ hoặc không tồn tại')
    }
  }, [searchParams])

  const validateForm = (): ValidationErrors => {
    const errors: ValidationErrors = {}
    
    if (!formData.token) {
      errors.token = 'Token là bắt buộc'
    }
    
    if (!formData.password || formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }
    
    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validateForm()
    setValidationErrors(errors)
    
    if (Object.keys(errors).length > 0) {
      return
    }
    
    setStatus('loading')
    setMessage('')
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
      } else {
        setStatus('error')
        setMessage(data.error || 'Có lỗi xảy ra khi đặt lại mật khẩu')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Có lỗi xảy ra khi kết nối với server')
    }
  }

  const handleGoToLogin = () => {
    router.push('/')
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Đặt lại mật khẩu thành công!
            </h1>
            
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            
            <Button onClick={handleGoToLogin} className="w-full">
              Đăng nhập ngay
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (status === 'error' && !formData.token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Link không hợp lệ
            </h1>
            
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            
            <Button onClick={handleGoToLogin} className="w-full">
              Quay lại trang chủ
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="h-10 w-10 rounded bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-3"></div>
            <h1 className="text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h1>
            <p className="text-gray-600 text-sm">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          {/* Error Message */}
          {status === 'error' && message && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Token Input (hidden but can be edited if needed) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Token xác thực
              </label>
              <Input
                type="text"
                value={formData.token}
                onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value }))}
                placeholder="Token từ email"
                className={validationErrors.token ? 'border-red-300' : ''}
                required
                readOnly
              />
              {validationErrors.token && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.token}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 ${validationErrors.password ? 'border-red-300' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="••••••••"
                  className={`pl-10 pr-10 ${validationErrors.confirmPassword ? 'border-red-300' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Đang đặt lại mật khẩu...
                </div>
              ) : (
                'Đặt lại mật khẩu'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleGoToLogin}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Quay lại trang chủ
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}
