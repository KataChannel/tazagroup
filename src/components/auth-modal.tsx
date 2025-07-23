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
  defaultTab?: 'login' | 'register' | 'forgot-password' | 'reset-password'
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
  const [success, setSuccess] = useState('')
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

  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: ''
  })

  const [resetPasswordData, setResetPasswordData] = useState({
    token: '',
    password: '',
    confirmPassword: ''
  })

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab)
      setError('')
      setSuccess('')
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

  const validateForm = (data: Record<string, unknown>, isLogin: boolean): ValidationErrors => {
    const errors: ValidationErrors = {}
    
    if (!isLogin && (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2)) {
      errors.name = 'Tên phải có ít nhất 2 ký tự'
    }
    
    if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Vui lòng nhập email hợp lệ'
    }
    
    if (!data.password || typeof data.password !== 'string' || (isLogin ? data.password.length === 0 : data.password.length < 6)) {
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
    setSuccess('')

    const result = await login(loginData.email, loginData.password)
    
    if (result.success) {
      onClose()
      setLoginData({ email: '', password: '' })
    } else {
      if (result.error?.includes('chưa được xác thực')) {
        setError(result.error)
        // Auto-fill email for resending verification
        setForgotPasswordData({ email: loginData.email })
        // Show option to resend verification
        setSuccess('Bạn có thể gửi lại email xác thực bằng cách chuyển sang "Quên mật khẩu".')
      } else {
        setError(result.error || 'Đã xảy ra lỗi')
      }
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
    setSuccess('')

    const result = await register(registerData)
    
    if (result.success) {
      if (result.requiresVerification) {
        setSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.')
        setRegisterData({ name: '', email: '', password: '', confirmPassword: '' })
        // Don't close modal - show success message
      } else {
        onClose()
        setRegisterData({ name: '', email: '', password: '', confirmPassword: '' })
      }
    } else {
      setError(result.error || 'Đã xảy ra lỗi')
    }
    
    setIsLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!forgotPasswordData.email) {
      setValidationErrors({ email: 'Vui lòng nhập email' })
      return
    }
    
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forgotPasswordData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Link đặt lại mật khẩu đã được gửi đến email của bạn')
        if (process.env.NODE_ENV === 'development' && data.resetToken) {
          // Auto-fill token in development mode
          setResetPasswordData(prev => ({ ...prev, token: data.resetToken }))
          setActiveTab('reset-password')
        }
      } else {
        setError(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi gửi yêu cầu')
    }
    
    setIsLoading(false)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors: ValidationErrors = {}
    
    if (!resetPasswordData.token) {
      errors.email = 'Token là bắt buộc'
    }
    
    if (!resetPasswordData.password || resetPasswordData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }
    
    if (resetPasswordData.password !== resetPasswordData.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }
    
    setValidationErrors(errors)
    
    if (Object.keys(errors).length > 0) {
      return
    }
    
    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resetPasswordData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSuccess('Mật khẩu đã được đặt lại thành công')
        setResetPasswordData({ token: '', password: '', confirmPassword: '' })
        setTimeout(() => {
          setActiveTab('login')
          setSuccess('')
        }, 2000)
      } else {
        setError(data.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi đặt lại mật khẩu')
    }
    
    setIsLoading(false)
  }

  const switchTab = (tab: 'login' | 'register' | 'forgot-password' | 'reset-password') => {
    setActiveTab(tab)
    setError('')
    setSuccess('')
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
              {activeTab === 'login' ? 'Đăng nhập' : 
               activeTab === 'register' ? 'Tạo tài khoản' :
               activeTab === 'forgot-password' ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}
            </h2>
            <p className="text-gray-600 text-sm">
              {activeTab === 'login' 
                ? 'Chào mừng bạn trở lại với Timona' 
                : activeTab === 'register' 
                ? 'Bắt đầu hành trình affiliate marketing của bạn'
                : activeTab === 'forgot-password'
                ? 'Nhập email để nhận link đặt lại mật khẩu'
                : 'Nhập mật khẩu mới của bạn'
              }
            </p>
          </div>

          {/* Tabs */}
          {(activeTab === 'login' || activeTab === 'register') && (
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
          )}

          {/* Back Button for Forgot/Reset Password */}
          {(activeTab === 'forgot-password' || activeTab === 'reset-password') && (
            <div className="mb-6">
              <button
                onClick={() => switchTab('login')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                ← Quay lại đăng nhập
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <div className="w-4 h-4 text-red-500 mt-0.5">⚠️</div>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-start gap-2">
              <div className="w-4 h-4 text-green-500 mt-0.5">✓</div>
              <span>{success}</span>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
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

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchTab('forgot-password')}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Quên mật khẩu?
                </button>
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
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
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

          {/* Forgot Password Form */}
          {activeTab === 'forgot-password' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    value={forgotPasswordData.email}
                    onChange={(e) => setForgotPasswordData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@email.com"
                    className={`pl-10 ${validationErrors.email ? 'border-red-300' : ''}`}
                    required
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
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
                    Đang gửi email...
                  </div>
                ) : (
                  'Gửi link đặt lại mật khẩu'
                )}
              </Button>
            </form>
          )}

          {/* Reset Password Form */}
          {activeTab === 'reset-password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token xác thực
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    value={resetPasswordData.token}
                    onChange={(e) => setResetPasswordData(prev => ({ ...prev, token: e.target.value }))}
                    placeholder="Nhập token từ email"
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
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={resetPasswordData.password}
                    onChange={(e) => setResetPasswordData(prev => ({ ...prev, password: e.target.value }))}
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
                    value={resetPasswordData.confirmPassword}
                    onChange={(e) => setResetPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
                    Đang đặt lại mật khẩu...
                  </div>
                ) : (
                  'Đặt lại mật khẩu'
                )}
              </Button>
            </form>
          )}

          {/* Terms and Privacy */}
          {(activeTab === 'login' || activeTab === 'register') && (
            <div className="mt-6 text-center text-xs text-gray-500">
              Bằng việc {activeTab === 'login' ? 'đăng nhập' : 'đăng ký'}, bạn đồng ý với{' '}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Điều khoản sử dụng
              </a>{' '}
              và{' '}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Chính sách bảo mật
              </a>{' '}
              của Timona
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
