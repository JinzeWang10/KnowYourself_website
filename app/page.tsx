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

  // 按分类组织量表
  const scalesByCategory = scales.reduce((acc, scale) => {
    const category = scale.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(scale);
    return acc;
  }, {} as Record<string, typeof scales>);

  // 量表图标映射
  const categoryIcons: Record<string, string> = {
    '综合评估': '🎯',
    '心理健康评估': '🧠',
    '情绪评估': '💭',
    '人格评估': '🎭',
    '认知评估': '🤔',
  };

  const scaleIcons: Record<string, string> = {
    'ani': '🎯',
    'scl90': '🧠',
    'ess': '💭',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          了解自己，从心理测评开始
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          通过科学的心理量表测评<br />
          深入了解你的心理健康状态和性格特点
        </p>
      </section>

      {/* Scales Section */}
      <section id="scales" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">专业量表测评</h2>

        {/* 动态显示所有分类的量表 */}
        {Object.entries(scalesByCategory).map(([category, categoryScales], categoryIndex) => (
          <div key={category} className={categoryIndex < Object.keys(scalesByCategory).length - 1 ? "mb-12" : ""}>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-3xl">{categoryIcons[category] || '📋'}</span>
              {category}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {categoryScales.map((scale) => (
                <div key={scale.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
                  <div className="text-4xl mb-4">{scaleIcons[scale.id] || '📝'}</div>
                  <h4 className="text-xl font-semibold mb-2">{scale.title}</h4>
                  <p className="text-gray-600 mb-2">{scale.titleEn || ''}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {scale.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <span>📝 {scale.questionCount}题</span>
                    <span>⏱️ {scale.duration}分钟</span>
                  </div>
                  <Link
                    href={`/scales/${scale.id}`}
                    className="text-primary hover:underline font-medium"
                  >
                    开始测评 →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-12">
          <Link
            href="/history"
            className="inline-block px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition"
          >
            查看测评历史 →
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-primary-light/10 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">为什么选择我们</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl mb-4">🔬</div>
              <h3 className="text-xl font-bold mb-3">科学专业</h3>
              <p className="text-gray-600">
                所有量表均基于国际标准化工具，具有良好的信效度
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3">隐私保护</h3>
              <p className="text-gray-600">
                所有数据仅保存在本地，不上传服务器，完全匿名
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">详细报告</h3>
              <p className="text-gray-600">
                提供多维度的评估结果和专业建议
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <p>&copy; 2025 KnowYourself 知己. All rights reserved.</p>
            <p className="mt-2 text-sm">了解更真实的自己 · 专注于心理健康与自我认知</p>
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/terms" className="hover:text-white transition">
              用户协议
            </Link>
            <Link href="/privacy" className="hover:text-white transition">
              隐私政策
            </Link>
            <Link href="/disclaimer" className="hover:text-white transition">
              免责声明
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
