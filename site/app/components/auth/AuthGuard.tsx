'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { siteConfig } from '../../lib/config/site';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    const isPublicRoute = (path: string) => {
        return siteConfig.auth.publicRoutes.some(route => {
            if (route.endsWith('*')) {
                return path.startsWith(route.slice(0, -1));
            }
            return path === route || path.startsWith(route);
        });
    };

    const isProtectedRoute = (path: string) => {
        return siteConfig.auth.protectedRoutes.some(route => {
            if (route.endsWith('*')) {
                return path.startsWith(route.slice(0, -1));
            }
            return path === route || path.startsWith(route);
        });
    };

    useEffect(() => {
        if (loading) return;

        const checkAuth = () => {
            // Nếu không yêu cầu đăng nhập, cho phép truy cập
            if (!siteConfig.auth.loginRequired) {
                setIsChecking(false);
                return;
            }

            // Nếu là route public, cho phép truy cập
            if (isPublicRoute(pathname)) {
                setIsChecking(false);
                return;
            }

            // Nếu user chưa đăng nhập và đang ở route protected
            if (!user?.isAuthenticated) {
                router.push(siteConfig.auth.redirectAfterLogout);
                return;
            }

            // Nếu user đã đăng nhập và đang ở trang login
            if (user?.isAuthenticated && pathname === '/login') {
                router.push(siteConfig.auth.redirectAfterLogin);
                return;
            }

            setIsChecking(false);
        };

        checkAuth();
    }, [user, loading, pathname, router]);

    // Hiển thị loading khi đang kiểm tra auth
    if (loading || isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang kiểm tra xác thực...</p>
                </div>
            </div>
        );
    }

    // Nếu yêu cầu đăng nhập và user chưa đăng nhập và không phải route public
    if (siteConfig.auth.loginRequired && !user?.isAuthenticated && !isPublicRoute(pathname)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
                        <div className="mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900">
                                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 8.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Yêu cầu đăng nhập
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Bạn cần đăng nhập để truy cập vào website này.
                        </p>
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Đăng nhập ngay
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
