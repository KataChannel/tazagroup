import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Timonacore',
    template: '%s | Timonacore',
  },
  description: 'Enterprise Fullstack Starter Kit with Next.js, NestJS, GraphQL, Prisma, Redis, and Minio',
  keywords: ['fullstack', 'starter-kit', 'nextjs', 'nestjs', 'graphql', 'prisma', 'redis', 'minio'],
  authors: [{ name: 'Timonacore Team' }],
  creator: 'Timonacore Team',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Timonacore',
    description: 'Enterprise Fullstack Starter Kit',
    siteName: 'Timonacore',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Timonacore',
    description: 'Enterprise Fullstack Starter Kit',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <div className="min-h-full flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
