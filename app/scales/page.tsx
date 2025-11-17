import type { Metadata } from 'next';
import Link from "next/link";
import { getScaleList } from '@/lib/scales';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "选择测评量表 - KnowYourself 知己",
  description: "选择适合你的心理测评量表，包括SCL-90、ESS、INI等专业量表，帮助你更好地了解自己。",
  keywords: "心理测评,量表选择,SCL-90,ESS,INI,心理健康评估",
};

export default function ScalesPage() {
  const scales = getScaleList();

  // 量表图标映射
  const scaleIcons: Record<string, string> = {
    'zhz': '🌹',
    'ani': '🎯',
    'scl90': '🧠',
    'ess': '💭',
    'ini': '😴',
    'bes': '🍽️',
  };

  // 量表主题色配置
  const scaleThemes: Record<string, { gradient: string; border: string; glow: string }> = {
    'zhz': {
      gradient: 'from-rose-50/80 via-pink-50/60 to-white/80',
      border: 'from-rose-400 via-pink-400 to-fuchsia-400',
      glow: 'group-hover:shadow-[0_0_40px_rgba(244,114,182,0.25)]',
    },
    'ani': {
      gradient: 'from-indigo-50/80 via-purple-50/60 to-white/80',
      border: 'from-indigo-400 via-purple-400 to-pink-400',
      glow: 'group-hover:shadow-[0_0_40px_rgba(129,140,248,0.25)]',
    },
    'scl90': {
      gradient: 'from-emerald-50/80 via-teal-50/60 to-white/80',
      border: 'from-emerald-400 via-teal-400 to-cyan-400',
      glow: 'group-hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]',
    },
    'ess': {
      gradient: 'from-amber-50/80 via-orange-50/60 to-white/80',
      border: 'from-amber-400 via-orange-400 to-rose-400',
      glow: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.25)]',
    },
    'ini': {
      gradient: 'from-blue-50/80 via-indigo-50/60 to-white/80',
      border: 'from-blue-400 via-indigo-400 to-purple-400',
      glow: 'group-hover:shadow-[0_0_40px_rgba(59,130,246,0.25)]',
    },
    'bes': {
      gradient: 'from-orange-50/80 via-red-50/60 to-white/80',
      border: 'from-orange-400 via-red-400 to-pink-400',
      glow: 'group-hover:shadow-[0_0_40px_rgba(249,115,22,0.25)]',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      {/* Header */}
      <Header />

      {/* Page Header */}
      <section className="container mx-auto px-4 pt-12 pb-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 leading-tight">
            了解自己，从一个测评开始
          </h1>
        </div>
      </section>

      {/* Scales Grid */}
      <section id="scales" className="container mx-auto px-4 py-8 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {scales.map((scale, idx) => {
            const theme = scaleThemes[scale.id] || scaleThemes['ani'];
            return (
              <div
                key={scale.id}
                className="animate-slide-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`
                  group relative overflow-hidden
                  bg-gradient-to-br ${theme.gradient}
                  backdrop-blur-md
                  rounded-3xl
                  shadow-soft hover:shadow-soft-xl
                  transition-all duration-500 ease-out
                  hover:-translate-y-2
                  ${theme.glow}
                  border-2 border-transparent
                  before:absolute before:inset-0 before:rounded-3xl
                  before:p-[2px] before:bg-gradient-to-br before:${theme.border}
                  before:opacity-0 before:transition-opacity before:duration-500
                  hover:before:opacity-100
                  before:-z-10
                  after:absolute after:inset-[2px] after:rounded-[22px]
                  after:bg-gradient-to-br after:${theme.gradient}
                  after:-z-10
                `}>
                  <div className="relative z-10 p-8">
                    {/* 顶部：图标 + 标题区域 */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="text-5xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        {scaleIcons[scale.id] || '📝'}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-neutral-900 mb-1 group-hover:text-primary transition-colors duration-300">
                          {scale.title}
                        </h4>
                        <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
                          {scale.titleEn || ''}
                        </p>
                      </div>
                    </div>

                    {/* 中部：描述 */}
                    <p className="text-sm text-neutral-700 mb-6 leading-relaxed min-h-[3rem]">
                      {scale.description}
                    </p>

                    {/* 底部：元信息 + 按钮 */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200/60">
                      <div className="flex items-center gap-4 text-xs text-neutral-600 font-medium">
                        <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                          <span className="text-sm">📝</span>
                          {scale.questionCount}题
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/60 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                          <span className="text-sm">⏱️</span>
                          {scale.duration}
                        </span>
                      </div>

                      <Link
                        href={`/scales/${scale.id}`}
                        className="
                          inline-flex items-center gap-2
                          px-4 py-2
                          bg-primary hover:bg-primary-dark
                          text-white text-sm font-bold
                          rounded-xl
                          transition-all duration-300
                          hover:gap-3 hover:shadow-glow
                          group/btn
                        "
                      >
                        开始
                        <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>

                  {/* 背景装饰渐变 */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-white/40 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部说明 */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="max-w-2xl mx-auto mb-8">
            <p className="text-sm text-neutral-600 leading-relaxed">
              💡 <strong>温馨提示：</strong>请在安静的环境中完成测评，确保测评结果的准确性。所有数据仅保存在本地，完全保护您的隐私。
            </p>
          </div>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/60 backdrop-blur-sm hover:bg-white border-2 border-neutral-200 hover:border-primary text-neutral-700 hover:text-primary rounded-xl font-semibold transition-all shadow-soft hover:shadow-soft-lg"
          >
            查看测评历史
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
