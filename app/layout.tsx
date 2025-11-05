import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scales.example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KnowYourself 知己 - 了解更真实的自己",
    template: "%s | KnowYourself 知己"
  },
  description: "KnowYourself 专业的心理量表测评平台，提供多种心理健康评估工具，帮助你更好地了解自己。包括SCL-90等科学量表，匿名测评，专业解读。",
  keywords: "KnowYourself,知己,心理测评,心理健康,量表测评,SCL-90,心理评估,自我认知",
  authors: [{ name: "KnowYourself Team" }],
  creator: "KnowYourself",
  publisher: "KnowYourself 知己",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/knowyourself_logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/knowyourself_logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/knowyourself_logo.png',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/knowyourself_logo.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
