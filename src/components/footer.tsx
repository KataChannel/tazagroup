import Link from "next/link"
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-gradient-to-r from-blue-600 to-purple-600"></div>
              <span className="font-bold text-xl">Timona</span>
            </div>
            <p className="text-gray-300 text-sm">
              Nền tảng affiliate marketing hàng đầu Việt Nam, kết nối nhà quảng cáo và publisher một cách hiệu quả.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><Link href="/campaigns" className="text-gray-300 hover:text-white text-sm">Chiến dịch</Link></li>
              <li><Link href="/tools" className="text-gray-300 hover:text-white text-sm">Công cụ</Link></li>
              <li><Link href="/reports" className="text-gray-300 hover:text-white text-sm">Báo cáo</Link></li>
              <li><Link href="/payments" className="text-gray-300 hover:text-white text-sm">Thanh toán</Link></li>
              <li><Link href="/training" className="text-gray-300 hover:text-white text-sm">Đào tạo</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-300 hover:text-white text-sm">Trung tâm trợ giúp</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white text-sm">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white text-sm">Liên hệ</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-white text-sm">Điều khoản</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white text-sm">Bảo mật</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Thông tin liên hệ</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">
                  123 Đường ABC, Quận 1, TP.HCM
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">
                  +84 123 456 789
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">
                  support@timona.vn
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Timona Vietnam. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm">
                Điều khoản sử dụng
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm">
                Chính sách bảo mật
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-sm">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
