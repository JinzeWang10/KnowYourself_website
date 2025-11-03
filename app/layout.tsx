import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://scales.example.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "心理量表测评平台",
    template: "%s | 心理量表"
  },
  description: "专业的心理量表测评平台，提供多种心理健康评估工具，帮助你更好地了解自己。包括SCL-90等科学量表，匿名测评，专业解读。",
  keywords: "心理测评,心理健康,量表测评,SCL-90,心理评估,自我认知",
  authors: [{ name: "心理量表团队" }],
  creator: "心理量表团队",
  publisher: "心理量表",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
