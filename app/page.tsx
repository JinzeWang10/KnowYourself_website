import type { Metadata } from 'next';
import Link from "next/link";
import { getScaleList } from '@/lib/scales';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: "KnowYourself 知己 - 了解更真实的自己",
  description: "KnowYourself 专业的心理量表测评平台，提供多种心理健康评估工具，帮助你更好地了解自己。包括SCL-90等科学量表，匿名测评，专业解读。",
  keywords: "KnowYourself,知己,心理测评,心理健康,量表测评,SCL-90,心理评估,自我认知",
};

export default function HomePage() {
  const scales = getScaleList();
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Hero Section - 全屏展示 */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-neutral-50 to-white">
        {/* 背景装饰 - 更简洁 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 微妙的渐变装饰 */}
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple/5 rounded-full blur-3xl"></div>
        </div>

        {/* Hero内容 */}
        <div className="relative container mx-auto px-4 py-12 text-center">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in-up">
            {/* 主标题 - 更简洁直接 */}
            <div className="space-y-4">
              <h1 className="block gradient-text-hero text-4xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-neutral-900 leading-tight">
                KnowYourself
              </h1>

              <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-neutral-900 leading-tight">
                了解真实的自己
              </h1>

              {/* 副标题 */}
              <p className="text-lg sm:text-xl md:text-2xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                专业心理测评 · 科学准确 · 完全免费
              </p>
            </div>

            {/* CTA按钮 - 单个大按钮更突出 */}
            <div className="flex flex-col items-center gap-6">
              <Link
                href="/scales"
                className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-primary hover:bg-primary-dark text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span>免费开始测评</span>
                <span className="text-2xl">→</span>
              </Link>

              {/* 特点说明 - 更简洁 */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-500">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>科学准确</span>
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>5-15分钟完成</span>
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>隐私保护</span>
                </span>
              </div>

              {/* 次要操作 */}
              <Link
                href="/history"
                className="text-neutral-600 hover:text-primary transition-colors text-sm font-medium"
              >
                查看测评历史 →
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section - 精简版 */}
      <section className="relative py-20 bg-white border-t border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">为什么选择 KnowYourself</h2>
            <p className="text-base text-neutral-500">基于国际标准的专业心理测评工具</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* 特性卡片 1 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-neutral-900">科学权威</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                采用国际标准化量表，确保测评结果的准确性与可靠性
              </p>
            </div>

            {/* 特性卡片 2 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-neutral-900">隐私安全</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                所有数据本地存储，完全匿名，绝不上传服务器
              </p>
            </div>

            {/* 特性卡片 3 */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2 text-neutral-900">专业报告</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                提供详细的多维度分析和专业的心理健康建议
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-neutral-50 border-t border-neutral-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight">
              开始你的自我探索之旅
            </h2>
            <p className="text-lg text-neutral-600">
              选择适合你的心理测评，更好地了解自己
            </p>
            <div className="pt-4">
              <Link
                href="/scales"
                className="inline-flex items-center gap-3 px-10 py-4 bg-primary hover:bg-primary-dark text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span>查看所有量表</span>
                <span className="text-xl">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <p className="text-neutral-300 font-medium">&copy; 2025 KnowYourself 知己. All rights reserved.</p>
            <p className="mt-3 text-sm font-light">了解更真实的自己 · 专注于心理健康与自我认知</p>
          </div>
          <div className="flex justify-center gap-8 text-sm">
            <Link href="/terms" className="hover:text-white transition-colors font-medium">
              用户协议
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors font-medium">
              隐私政策
            </Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors font-medium">
              免责声明
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
