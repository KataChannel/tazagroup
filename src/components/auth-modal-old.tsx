'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Mail, User, Lock, X } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: 'login' | 'register'
}

interface ValidationErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const { login, register } = useAuth()

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab)
      setError('')
      setValidationErrors({})
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
  }, [isOpen, defaultTab])

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const validateForm = (data: any, isLogin: boolean): ValidationErrors => {
    const errors: ValidationErrors = {}
    
    if (!isLogin && (!data.name || data.name.trim().length < 2)) {
      errors.name = 'Tên phải có ít nhất 2 ký tự'
    }
    
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Vui lòng nhập email hợp lệ'
    }
    
    if (!data.password || (isLogin ? data.password.length === 0 : data.password.length < 6)) {
      errors.password = isLogin ? 'Vui lòng nhập mật khẩu' : 'Mật khẩu phải có ít nhất 6 ký tự'
    }
    
    if (!isLogin && data.password !== data.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }
    
    return errors
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validateForm(loginData, true)
    setValidationErrors(errors)
    
    if (Object.keys(errors).length > 0) {
      return
    }
    
    setIsLoading(true)
    setError('')

    const result = await login(loginData.email, loginData.password)
    
    if (result.success) {
      onClose()
      setLoginData({ email: '', password: '' })
    } else {
      setError(result.error || 'Đã xảy ra lỗi')
    }
    
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validateForm(registerData, false)
    setValidationErrors(errors)
    
    if (Object.keys(errors).length > 0) {
      return
    }
    
    setIsLoading(true)
    setError('')

    const result = await register(registerData)
    
    if (result.success) {
      onClose()
      setRegisterData({ name: '', email: '', password: '', confirmPassword: '' })
    } else {
      setError(result.error || 'Đã xảy ra lỗi')
    }
    
    setIsLoading(false)
  }

  const switchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab)
    setError('')
    setValidationErrors({})
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 z-10"
          aria-label="Đóng"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="h-10 w-10 rounded bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-3"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </h2>
            <p className="text-gray-600 text-sm">
              {activeTab === 'login' 
                ? 'Chào mừng bạn trở lại với AccessTrade' 
                : 'Bắt đầu hành trình affiliate marketing của bạn'
              }
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`flex-1 pb-2 text-center font-medium transition-colors ${activeTab === 'login' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => switchTab('login')}
            >
              Đăng nhập
            </button>
            <button
              className={`flex-1 pb-2 text-center font-medium transition-colors ${activeTab === 'register' 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => switchTab('register')}
            >
              Đăng ký
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <div className="w-4 h-4 text-red-500 mt-0.5">⚠️</div>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@email.com"
                    className={`pl-10 ${validationErrors.email ? 'border-red-300' : ''}`}
                    required
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
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

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang đăng nhập...
                  </div>
                ) : (
                  'Đăng nhập'
                )}
              </Button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                    className={`pl-10 ${validationErrors.name ? 'border-red-300' : ''}`}
                    required
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@email.com"
                    className={`pl-10 ${validationErrors.email ? 'border-red-300' : ''}`}
                    required
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
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
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang tạo tài khoản...
                  </div>
                ) : (
                  'Tạo tài khoản'
                )}
              </Button>
            </form>
          )}

          {/* Terms and Privacy */}
          <div className="mt-6 text-center text-xs text-gray-500">
            Bằng việc {activeTab === 'login' ? 'đăng nhập' : 'đăng ký'}, bạn đồng ý với{' '}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Điều khoản sử dụng
            </a>{' '}
            và{' '}
            <a href="#" className="text-blue-600 hover:underline font-medium">
              Chính sách bảo mật
            </a>{' '}
            của AccessTrade
          </div>

          {/* Social Login (Optional) */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600 mb-4">Hoặc</p>
            <div className="grid gap-2">
              <Button variant="outline" type="button" className="w-full" disabled>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Tiếp tục với Google
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Bằng việc đăng ký, bạn đồng ý với{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Điều khoản sử dụng
            </a>{' '}
            và{' '}
            <a href="#" className="text-blue-600 hover:underline">
              Chính sách bảo mật
            </a>
          </div>
        </div>
      </Card>
    </div>
  )
}
