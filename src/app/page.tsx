import { DashboardStats } from "@/components/dashboard-stats";
import { CampaignGrid } from "@/components/campaign-grid";
import { RevenueChart } from "@/components/revenue-chart";
import { RecentActivity } from "@/components/recent-activity";
import { PWAFeaturesShowcase } from "@/components/pwa-features-showcase";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 px-4">
          Kiếm tiền online với <br />
          <span className="text-yellow-300">AccessTrade</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 px-4">
          Nền tảng affiliate marketing hàng đầu Việt Nam
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 max-w-md sm:max-w-none mx-auto">
          <button className="bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Đăng ký ngay
          </button>
          <button className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Tìm hiểu thêm
          </button>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-2 sm:px-0">Tổng quan hiệu suất</h2>
        <DashboardStats />
      </section>

      {/* Charts and Activity */}
      <section className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </section>

      {/* Campaign Grid */}
      <section>
        <CampaignGrid />
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Tại sao chọn AccessTrade?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center p-6">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Hoa hồng cao</h3>
            <p className="text-gray-600">Lên đến 20% hoa hồng cho mỗi giao dịch thành công</p>
          </div>
          
          <div className="text-center p-6">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Thanh toán nhanh</h3>
            <p className="text-gray-600">Thanh toán hằng tuần, không có giới hạn tối thiểu</p>
          </div>
          
          <div className="text-center p-6">
            <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Báo cáo chi tiết</h3>
            <p className="text-gray-600">Theo dõi hiệu suất realtime với dashboard chuyên nghiệp</p>
          </div>
          
          <div className="text-center p-6">
            <div className="h-16 w-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.2v3.6m0 12.4v3.6M2.2 12h3.6m12.4 0h3.6" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Hỗ trợ 24/7</h3>
            <p className="text-gray-600">Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp đỡ</p>
          </div>
        </div>
      </section>

      {/* Phase 2 Features Showcase */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
            Phase 2 Complete - 100%
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Enterprise Financial Management</h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Nền tảng giờ đây đã được trang bị đầy đủ các tính năng quản lý tài chính doanh nghiệp với khả năng tự động hóa và tuân thủ thuế Việt Nam
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Tax Reports</h3>
            <p className="text-gray-600 text-sm mb-3">Hệ thống báo cáo thuế tự động với tính toán theo bậc thuế Việt Nam, hỗ trợ cả cá nhân và doanh nghiệp</p>
            <div className="text-xs text-blue-600 font-medium">✓ Vietnam Tax Compliance</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-4a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Advanced Filtering</h3>
            <p className="text-gray-600 text-sm mb-3">Lọc dữ liệu đa tiêu chí với khả năng xuất báo cáo và preset nhanh cho phân tích chuyên sâu</p>
            <div className="text-xs text-purple-600 font-medium">✓ Multi-Criteria & Export</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Payout Schedule</h3>
            <p className="text-gray-600 text-sm mb-3">Lập lịch thanh toán tự động theo tuần/tháng/quý với kiểm soát ngưỡng tối thiểu và xác thực số dư</p>
            <div className="text-xs text-green-600 font-medium">✓ Automated & Configurable</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Payout Settings</h3>
            <p className="text-gray-600 text-sm mb-3">Cấu hình ngưỡng thanh toán tối thiểu với kiểm soát tự động và theo dõi trạng thái số dư realtime</p>
            <div className="text-xs text-red-600 font-medium">✓ Threshold & Balance Control</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Payout Reports</h3>
            <p className="text-gray-600 text-sm mb-3">Dashboard phân tích lịch sử thanh toán toàn diện với thống kê tổng quan và khả năng xuất báo cáo</p>
            <div className="text-xs text-indigo-600 font-medium">✓ Analytics & Export</div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg mb-2">Performance Analysis</h3>
            <p className="text-gray-600 text-sm mb-3">So sánh hiệu suất theo thời gian với phân tích xu hướng và insights cho từng chiến dịch</p>
            <div className="text-xs text-yellow-600 font-medium">✓ Period Comparison & Trends</div>
          </div>
        </div>

        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-600">
              <div className="font-semibold text-gray-900">Production Ready</div>
              <div>Enterprise-level financial management</div>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="text-sm text-gray-600">
              <div className="font-semibold text-gray-900">Phase 3 Active</div>
              <div>PWA, Offline, Push Notifications</div>
            </div>
          </div>
        </div>
      </section>

      {/* Phase 3 PWA Features Showcase */}
      <PWAFeaturesShowcase />
    </div>
  );
}
