import { DashboardStats } from "@/components/dashboard-stats";
import { CampaignGrid } from "@/components/campaign-grid";
import { RevenueChart } from "@/components/revenue-chart";
import { RecentActivity } from "@/components/recent-activity";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Kiếm tiền online với <br />
          <span className="text-yellow-300">AccessTrade</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Nền tảng affiliate marketing hàng đầu Việt Nam
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Đăng ký ngay
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Tìm hiểu thêm
          </button>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Tổng quan hiệu suất</h2>
        <DashboardStats />
      </section>

      {/* Charts and Activity */}
      <section className="grid gap-8 lg:grid-cols-3">
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
      <section className="py-16">
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
    </div>
  );
}
