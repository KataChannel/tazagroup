import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/lib/auth-context";
import PWAProvider from "@/components/pwa-provider";
import { OfflineIndicator, PWAInstallPrompt } from "@/components/offline-indicator";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Timona - Nền tảng Affiliate Marketing #1 Việt Nam",
  description: "Tham gia Timona để kiếm tiền online với affiliate marketing. Hoa hồng cao, thanh toán nhanh, hỗ trợ 24/7.",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Timona",
    startupImage: [
      "/icons/apple-splash-2048-2732.jpg",
      "/icons/apple-splash-1668-2224.jpg",
      "/icons/apple-splash-1536-2048.jpg",
      "/icons/apple-splash-1125-2436.jpg",
      "/icons/apple-splash-1242-2208.jpg",
      "/icons/apple-splash-750-1334.jpg",
      "/icons/apple-splash-828-1792.jpg",
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Timona",
    title: "Timona - Nền tảng Affiliate Marketing #1 Việt Nam",
    description: "Tham gia Timona để kiếm tiền online với affiliate marketing. Hoa hồng cao, thanh toán nhanh, hỗ trợ 24/7.",
  },
  twitter: {
    card: "summary",
    title: "Timona - Nền tảng Affiliate Marketing #1 Việt Nam",
    description: "Tham gia Timona để kiếm tiền online với affiliate marketing. Hoa hồng cao, thanh toán nhanh, hỗ trợ 24/7.",
  },
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <PWAProvider />
          <AuthProvider>
            <OfflineIndicator />
            <PWAInstallPrompt />
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
