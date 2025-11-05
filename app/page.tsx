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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <Header />

      {/* Hero Section - 全屏展示 */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 渐变球体装饰 */}
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-gradient-to-br from-blue-200/40 to-cyan-200/40 rounded-full blur-3xl animate-float-slower"></div>

          {/* 网格背景 */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        </div>

        {/* Hero内容 */}
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            {/* 标签 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md border border-neutral-200/50 rounded-full shadow-soft">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-neutral-700">专业心理测评平台</span>
            </div>

            {/* 主标题 */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-neutral-900 leading-tight tracking-tight">
              <span className="block mb-2">Know</span>
              <span className="block gradient-text-hero">Yourself</span>
            </h1>

            {/* 副标题 */}
            <p className="text-lg sm:text-xl md:text-2xl text-neutral-600 font-light max-w-2xl mx-auto leading-relaxed">
              了解更真实的自己<br className="sm:hidden" />
              <span className="hidden sm:inline"> · </span>
              从科学的心理测评开始
            </p>

            {/* CTA按钮组 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/scales"
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary hover:bg-primary-dark text-white text-lg font-bold rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105 overflow-hidden w-full sm:w-auto"
              >
                <span className="relative z-10">开始测评</span>
                <span className="relative z-10 text-xl transition-transform duration-300 group-hover:translate-x-1">→</span>

                {/* 按钮光效 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              </Link>

              <Link
                href="/history"
                className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-white/60 backdrop-blur-md hover:bg-white border-2 border-neutral-200 hover:border-primary text-neutral-700 hover:text-primary text-lg font-semibold rounded-2xl transition-all shadow-soft hover:shadow-soft-lg w-full sm:w-auto"
              >
                <span>查看历史</span>
              </Link>
            </div>

            {/* 数据展示 */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8 text-sm text-neutral-600">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>科学专业</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>完全匿名</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✓</span>
                <span>免费使用</span>
              </div>
            </div>
          </div>

          {/* 向下滚动指示器 */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
            <div className="flex flex-col items-center gap-2 text-neutral-400">
              <span className="text-xs font-medium">了解更多</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 精简版 */}
      <section className="relative py-24 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">为什么选择我们</h2>
            <p className="text-lg text-neutral-600 font-light">专业、安全、可靠</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* 特性卡片 1 */}
            <div className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 border border-neutral-100/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/50 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">🔬</div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-900">科学专业</h3>
                <p className="text-neutral-600 leading-relaxed">
                  基于国际标准化心理量表，具有良好的信效度，提供可靠的评估结果
                </p>
              </div>
            </div>

            {/* 特性卡片 2 */}
            <div className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 border border-neutral-100/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100/50 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">🔒</div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-900">隐私保护</h3>
                <p className="text-neutral-600 leading-relaxed">
                  所有数据仅保存在本地浏览器，不上传服务器，完全匿名，保护隐私
                </p>
              </div>
            </div>

            {/* 特性卡片 3 */}
            <div className="group relative bg-white/80 backdrop-blur-sm p-10 rounded-3xl shadow-soft hover:shadow-soft-xl transition-all duration-500 hover:-translate-y-2 border border-neutral-100/50">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">📊</div>
                <h3 className="text-2xl font-bold mb-4 text-neutral-900">详细报告</h3>
                <p className="text-neutral-600 leading-relaxed">
                  提供多维度的评估结果和专业建议，帮助你深入了解自己的心理状态
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary-50/50 via-purple-50/50 to-indigo-50/50 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-br from-purple/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-neutral-900 leading-tight">
              准备好了解真实的自己吗？
            </h2>
            <p className="text-lg md:text-xl text-neutral-600 font-light">
              只需几分钟，开启你的自我认知之旅
            </p>
            <div className="pt-4">
              <Link
                href="/scales"
                className="inline-flex items-center gap-3 px-12 py-6 bg-primary hover:bg-primary-dark text-white text-xl font-bold rounded-2xl shadow-glow hover:shadow-glow-lg transition-all duration-300 hover:scale-105"
              >
                <span>立即开始</span>
                <span className="text-2xl">→</span>
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
