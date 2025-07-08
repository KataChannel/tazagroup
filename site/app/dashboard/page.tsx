'use client';

import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { siteConfig } from '../lib/config/site';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push(siteConfig.auth.redirectAfterLogout);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                Xin chào, {user?.displayName || user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-96">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-4">
                  Chào mừng đến với Dashboard
                </h2>
                <p className="text-gray-500 dark:text-gray-500">
                  Bạn đã đăng nhập thành công vào hệ thống!
                </p>
                <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
                    Thông tin tài khoản
                  </h3>
                  <div className="text-left space-y-2">
                    <p className="text-green-700 dark:text-green-300">
                      <strong>ID:</strong> {user?.id}
                    </p>
                    <p className="text-green-700 dark:text-green-300">
                      <strong>Email:</strong> {user?.email}
                    </p>
                    <p className="text-green-700 dark:text-green-300">
                      <strong>Tên hiển thị:</strong> {user?.displayName}
                    </p>
                    <p className="text-green-700 dark:text-green-300">
                      <strong>Vai trò:</strong> {user?.role?.name}
                    </p>
                    <p className="text-green-700 dark:text-green-300">
                      <strong>Trạng thái:</strong> {user?.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
