'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Mail, ArrowRight, Loader2 } from 'lucide-react'

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setStatus('error')
      setMessage('Token xác thực không hợp lệ')
    }
  }, [token])

  const verifyEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message)
      } else {
        if (response.status === 400 && data.error?.includes('hết hạn')) {
          setStatus('expired')
          setMessage('Token xác thực đã hết hạn')
        } else {
          setStatus('error')
          setMessage(data.error || 'Có lỗi xảy ra khi xác thực email')
        }
      }
    } catch (error) {
      setStatus('error')
      setMessage('Có lỗi xảy ra khi kết nối với server')
    }
  }

  const handleGoToLogin = () => {
    router.push('/')
  }

  const handleResendVerification = () => {
    router.push('/')
    // User can use forgot password feature to resend verification
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <div className="p-6 text-center">
          <div className="mb-6">
            {status === 'loading' && (
              <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            )}
            
            {status === 'success' && (
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            )}
            
            {(status === 'error' || status === 'expired') && (
              <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            )}

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {status === 'loading' && 'Đang xác thực email...'}
              {status === 'success' && 'Xác thực thành công!'}
              {status === 'error' && 'Xác thực thất bại'}
              {status === 'expired' && 'Token đã hết hạn'}
            </h1>

            <p className="text-gray-600">
              {message}
            </p>
          </div>

          <div className="space-y-3">
            {status === 'success' && (
              <Button 
                onClick={handleGoToLogin}
                className="w-full"
              >
                Đăng nhập ngay
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            {(status === 'error' || status === 'expired') && (
              <>
                <Button 
                  onClick={handleResendVerification}
                  className="w-full"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Gửi lại email xác thực
                </Button>
                
                <Button 
                  onClick={handleGoToLogin}
                  variant="outline"
                  className="w-full"
                >
                  Quay lại trang chủ
                </Button>
              </>
            )}

            {status === 'loading' && (
              <div className="text-sm text-gray-500">
                Vui lòng đợi trong giây lát...
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Bạn có thắc mắc? 
              <a href="/support" className="text-blue-600 hover:underline ml-1">
                Liên hệ hỗ trợ
              </a>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
