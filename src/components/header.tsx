"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, User, Bell, Search, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AuthModal } from "@/components/auth-modal"
import { NotificationCenter } from "@/components/notification-center"
import { useAuth } from "@/lib/auth-context"
import { useNotifications } from "@/hooks/use-notifications"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login')
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout, isLoading } = useAuth()
  const { unreadCount, refreshNotifications } = useNotifications()

  // Refresh notifications when user logs in
  useEffect(() => {
    if (user) {
      refreshNotifications()
    }
  }, [user, refreshNotifications])

  const handleLogout = async () => {
    await logout()
    setIsUserMenuOpen(false)
  }

  const openAuthModal = (tab: 'login' | 'register') => {
    setAuthModalTab(tab)
    setIsAuthModalOpen(true)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-gradient-to-r from-blue-600 to-purple-600"></div>
              <span className="font-bold text-xl">AccessTrade</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/campaigns" className="text-sm font-medium hover:text-primary">
                Chiến dịch
              </Link>
              <Link href="/links" className="text-sm font-medium hover:text-primary">
                Link Analytics
              </Link>
              <Link href="/favorites" className="text-sm font-medium hover:text-primary">
                Yêu thích
              </Link>
              <Link href="/tools" className="text-sm font-medium hover:text-primary">
                Công cụ
              </Link>
              <Link href="/reports" className="text-sm font-medium hover:text-primary">
                Báo cáo
              </Link>
              <Link href="/training" className="text-sm font-medium hover:text-primary">
                Đào tạo
              </Link>
              <Link href="/api-docs" className="text-sm font-medium hover:text-primary">
                API Docs
              </Link>
              <Link href="/support" className="text-sm font-medium hover:text-primary">
                Hỗ trợ
              </Link>
            </nav>

            {/* Search & Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Tìm kiếm..."
                  className="w-48 lg:w-64 pl-8"
                />
              </div>

              {!isLoading && (
                <>
                  {user ? (
                    <>
                      <div className="relative">
                        <NotificationCenter />
                      </div>
                      <div className="relative">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                          <User className="h-5 w-5" />
                        </Button>
                        
                        {isUserMenuOpen && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                              <div className="font-medium">{user.name}</div>
                              <div className="text-gray-500">{user.email}</div>
                            </div>
                            <Link 
                              href="/profile" 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Hồ sơ cá nhân
                            </Link>
                            <Link 
                              href="/dashboard" 
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <User className="h-4 w-4 mr-2" />
                              Dashboard
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Đăng xuất
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        onClick={() => openAuthModal('login')}
                      >
                        Đăng nhập
                      </Button>
                      <Button 
                        onClick={() => openAuthModal('register')}
                      >
                        Đăng ký
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t py-4">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/campaigns" 
                  className="text-sm font-medium hover:text-primary py-2 px-2 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Chiến dịch
                </Link>
                <Link 
                  href="/links" 
                  className="text-sm font-medium hover:text-primary py-2 px-2 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Link Analytics
                </Link>
                <Link 
                  href="/favorites" 
                  className="text-sm font-medium hover:text-primary py-2 px-2 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Yêu thích
                </Link>
                <Link 
                  href="/tools" 
                  className="text-sm font-medium hover:text-primary py-2 px-2 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Công cụ
                </Link>
                <Link 
                  href="/reports" 
                  className="text-sm font-medium hover:text-primary py-2 px-2 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Báo cáo
                </Link>
                <Link 
                  href="/training" 
                  className="text-sm font-medium hover:text-primary py-2 px-2 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đào tạo
                </Link>
                <Link 
                  href="/api-docs" 
                  className="text-sm font-medium hover:text-primary py-2 px-2 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  API Docs
                </Link>
                <Link 
                  href="/support" 
                  className="text-sm font-medium hover:text-primary py-2 px-2 rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hỗ trợ
                </Link>
                
                {/* Mobile search */}
                <div className="relative pt-2">
                  <Search className="absolute left-3 top-4.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm..."
                    className="pl-8"
                  />
                </div>
                
                {/* Mobile auth buttons */}
                {!isLoading && !user && (
                  <div className="flex flex-col space-y-3 pt-4 border-t">
                    <Button 
                      variant="ghost" 
                      className="justify-start w-full"
                      onClick={() => {
                        openAuthModal('login')
                        setIsMenuOpen(false)
                      }}
                    >
                      Đăng nhập
                    </Button>
                    <Button 
                      className="justify-start w-full"
                      onClick={() => {
                        openAuthModal('register')
                        setIsMenuOpen(false)
                      }}
                    >
                      Đăng ký
                    </Button>
                  </div>
                )}

                {user && (
                  <div className="flex flex-col space-y-3 pt-4 border-t">
                    <div className="text-sm text-gray-600 px-2 py-1 bg-gray-50 rounded-md">
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs opacity-75">{user.email}</div>
                    </div>
                    <Link 
                      href="/dashboard" 
                      className="text-sm font-medium hover:text-primary py-2 px-2 rounded-md hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      📊 Dashboard
                    </Link>
                    <Link 
                      href="/profile" 
                      className="text-sm font-medium hover:text-primary py-2 px-2 rounded-md hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      👤 Hồ sơ cá nhân
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="text-sm font-medium text-red-600 hover:text-red-700 text-left py-2 px-2 rounded-md hover:bg-red-50 transition-colors"
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </>
  )
}
