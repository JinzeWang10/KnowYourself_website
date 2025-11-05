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

  // 量表图标映射
  const scaleIcons: Record<string, string> = {
    'ani': '🎯',
    'scl90': '🧠',
    'ess': '💭',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      {/* Header */}
      <Header />

      {/* Hero Section - 精简版 */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl font-bold text-neutral-900 mb-3 leading-tight">
            了解自己，从心理测评开始
          </h1>
          <p className="text-sm text-neutral-500 mb-8 max-w-xl mx-auto font-light">
            通过科学的心理量表测评，深入了解你的心理健康状态和性格特点
          </p>
        </div>
      </section>

      {/* Scales Section - 更显眼 */}
      <section id="scales" className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-3xl font-bold text-neutral-900 mb-2">专业量表测评</h2>
          <p className="text-sm text-neutral-500 font-light">基于国际标准化工具，科学专业</p>
        </div>

        {/* 直接显示所有量表，不分类 */}
        <div className="grid md:grid-cols-3 gap-6">
          {scales.map((scale, idx) => (
            <div
              key={scale.id}
              className={`group bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-soft hover:shadow-soft-xl transition-all duration-300 hover:-translate-y-1 border border-neutral-100 animate-slide-up`}
              style={{ animationDelay: `${(idx + 1) * 100}ms` }}
            >
              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">
                {scaleIcons[scale.id] || '📝'}
              </div>
              <h4 className="text-xl font-semibold mb-2 text-neutral-900 group-hover:text-primary transition-colors">
                {scale.title}
              </h4>
              <p className="text-neutral-500 mb-3 text-sm font-light">{scale.titleEn || ''}</p>
              <p className="text-sm text-neutral-600 mb-5 leading-relaxed">
                {scale.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-neutral-500 mb-6 font-medium">
                <span className="flex items-center gap-1">
                  <span className="text-base">📝</span>
                  {scale.questionCount}题
                </span>
                <span className="flex items-center gap-1">
                  <span className="text-base">⏱️</span>
                  {scale.duration}
                </span>
              </div>
              <Link
                href={`/scales/${scale.id}`}
                className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all font-semibold group-hover:text-primary-dark"
              >
                开始测评
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 animate-fade-in">
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/60 backdrop-blur-sm hover:bg-white border-2 border-neutral-200 hover:border-primary text-neutral-700 hover:text-primary rounded-xl font-semibold transition-all shadow-soft hover:shadow-soft-lg"
          >
            查看测评历史
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-primary-50/50 to-purple-50/50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">为什么选择我们</h2>
            <p className="text-neutral-500 font-light">专业、安全、可靠的心理测评平台</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-soft hover:shadow-soft-xl transition-all hover:-translate-y-2 border border-neutral-100">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🔬</div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-900">科学专业</h3>
              <p className="text-neutral-600 leading-relaxed">
                所有量表均基于国际标准化工具，具有良好的信效度
              </p>
            </div>
            <div className="group bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-soft hover:shadow-soft-xl transition-all hover:-translate-y-2 border border-neutral-100">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">🔒</div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-900">隐私保护</h3>
              <p className="text-neutral-600 leading-relaxed">
                所有数据仅保存在本地，不上传服务器，完全匿名
              </p>
            </div>
            <div className="group bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-soft hover:shadow-soft-xl transition-all hover:-translate-y-2 border border-neutral-100">
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-2xl font-bold mb-4 text-neutral-900">详细报告</h3>
              <p className="text-neutral-600 leading-relaxed">
                提供多维度的评估结果和专业建议
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <p className="text-neutral-300">&copy; 2025 KnowYourself 知己. All rights reserved.</p>
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
