import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '../components/Header';
import Footer from '../components/Footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'SONAVERSE - 최고의 제품과 서비스',
    template: '%s | SONAVERSE'
  },
  description: '최고의 제품과 서비스로 고객 만족을 추구하는 SONAVERSE입니다.',
  keywords: ['SONAVERSE', '만보 보행기', '보듬 기저귀', '제품', '서비스'],
  authors: [{ name: 'SONAVERSE' }],
  creator: 'SONAVERSE',
  publisher: 'SONAVERSE',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sonaverse.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SONAVERSE - 최고의 제품과 서비스',
    description: '최고의 제품과 서비스로 고객 만족을 추구하는 SONAVERSE입니다.',
    url: 'https://sonaverse.com',
    siteName: 'SONAVERSE',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SONAVERSE - 최고의 제품과 서비스',
    description: '최고의 제품과 서비스로 고객 만족을 추구하는 SONAVERSE입니다.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
