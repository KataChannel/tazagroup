"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, User, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
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
            <Link href="/tools" className="text-sm font-medium hover:text-primary">
              Công cụ
            </Link>
            <Link href="/reports" className="text-sm font-medium hover:text-primary">
              Báo cáo
            </Link>
            <Link href="/training" className="text-sm font-medium hover:text-primary">
              Đào tạo
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
                className="w-64 pl-8"
              />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
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
              <Link href="/campaigns" className="text-sm font-medium hover:text-primary">
                Chiến dịch
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
              <Link href="/support" className="text-sm font-medium hover:text-primary">
                Hỗ trợ
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
