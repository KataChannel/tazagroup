import { DashboardStats } from "@/components/dashboard-stats";
import { CampaignGrid } from "@/components/campaign-grid";
import { RevenueChart } from "@/components/revenue-chart";
import { RecentActivity } from "@/components/recent-activity";
import { PWAFeaturesShowcase } from "@/components/pwa-features-showcase";
import { Button } from "@/components/ui/button";
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('home');

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl sm:rounded-2xl">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 px-4">
          {t('hero.title')} <br />
          <span className="text-yellow-300">{t('hero.brand')}</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 px-4">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 max-w-md sm:max-w-none mx-auto">
          <Button className="bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            {t('hero.registerButton')}
          </Button>
          <Button 
            variant="outline" 
            className="border-2 border-white text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            {t('hero.learnMoreButton')}
          </Button>
        </div>
      </section>

      {/* Dashboard Stats */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 px-2 sm:px-0">{t('stats.title')}</h2>
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
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t('features.title')}</h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {t('features.subtitle')}
          </p>
        </div>
        
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0">
          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{t('features.highCommission.title')}</h3>
            <p className="text-gray-600">{t('features.highCommission.description')}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{t('features.fastPayment.title')}</h3>
            <p className="text-gray-600">{t('features.fastPayment.description')}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{t('features.support247.title')}</h3>
            <p className="text-gray-600">{t('features.support247.description')}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{t('features.analytics.title')}</h3>
            <p className="text-gray-600">{t('features.analytics.description')}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{t('features.tools.title')}</h3>
            <p className="text-gray-600">{t('features.tools.description')}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{t('features.training.title')}</h3>
            <p className="text-gray-600">{t('features.training.description')}</p>
          </div>
        </div>
      </section>

      {/* PWA Features Showcase */}
      <section className="py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{t('pwa.title')}</h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            {t('pwa.subtitle')}
          </p>
        </div>
        <PWAFeaturesShowcase />
      </section>

      {/* CTA Section */}
      <section className="text-center py-12 sm:py-16 bg-gray-50 rounded-xl sm:rounded-2xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-4">{t('cta.title')}</h2>
        <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          {t('cta.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 max-w-md sm:max-w-none mx-auto">
          <button className="bg-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            {t('cta.startButton')}
          </button>
          <button className="border-2 border-blue-600 text-blue-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors">
            {t('cta.contactButton')}
          </button>
        </div>
      </section>
    </div>
  );
}
