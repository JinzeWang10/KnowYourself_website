"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { QuizTemplate } from '@/types/quiz';

interface ScaleIntroClientProps {
  scale: QuizTemplate;
  scaleId: string;
}

export default function ScaleIntroClient({ scale, scaleId }: ScaleIntroClientProps) {
  const router = useRouter();

  // JSON-LD 结构化数据
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: scale.title,
    description: scale.description,
    url: `https://scales.example.com/scales/${scaleId}`,
    about: {
      '@type': 'MedicalCondition',
      name: scale.category,
    },
    mainEntity: {
      '@type': 'MedicalTest',
      name: scale.title,
      description: scale.purpose,
      usedToDiagnose: scale.category,
    },
    inLanguage: 'zh-CN',
    educationalLevel: 'General audience',
  };

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <Image
              src="/knowyourself_logo.png"
              alt="KnowYourself Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary">KnowYourself</span>
              <span className="text-xs text-gray-600">知己</span>
            </div>
          </Link>
          <Link href="/" className="text-gray-600 hover:text-primary transition text-sm">
            返回首页 →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {scale.title}
                </h1>
                {scale.titleEn && (
                  <p className="text-lg text-gray-600 mb-4">{scale.titleEn}</p>
                )}
                <p className="text-gray-700 text-lg">{scale.description}</p>
              </div>
              <span className="ml-4 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold whitespace-nowrap">
                {scale.category}
              </span>
            </div>

            {/* Meta Info */}
            <div className="flex gap-6 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-2xl">📝</span>
                <div>
                  <div className="text-sm text-gray-500">题目数量</div>
                  <div className="font-semibold">{scale.questionCount} 题</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-2xl">⏱️</span>
                <div>
                  <div className="text-sm text-gray-500">预计时间</div>
                  <div className="font-semibold">{scale.duration} 分钟</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="text-sm text-gray-500">评分范围</div>
                  <div className="font-semibold">
                    {scale.scoring.scaleRange.min}-{scale.scoring.scaleRange.max} 分
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Purpose Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              衡量维度
            </h2>
            <p className="text-gray-700 leading-relaxed">{scale.purpose}</p>

            {scale.dimensions && scale.dimensions.length > 0 && (
              <div className="mt-6 space-y-3">
                {scale.dimensions.map((dimension) => (
                  <div
                    key={dimension.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {dimension.name}
                    </h3>
                    <p className="text-sm text-gray-600">{dimension.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          {scale.instructions && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">💡</span>
                测评说明
              </h2>
              <p className="text-blue-800">{scale.instructions}</p>
            </div>
          )}

          {/* References */}
          {scale.references && scale.references.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">📚</span>
                科学依据
              </h2>
              <div className="space-y-3">
                {scale.references.map((ref, index) => {
                  // 检查是否为学术参考文献格式
                  if ('authors' in ref && 'year' in ref && 'journal' in ref) {
                    return (
                      <div key={index} className="text-sm text-gray-700 leading-relaxed">
                        <p>
                          {ref.authors} ({ref.year}). <em>{ref.title}</em>.{' '}
                          <span className="font-semibold">{ref.journal}</span>
                          {ref.volume && `, ${ref.volume}`}
                          {ref.pages && `, ${ref.pages}`}.
                          {ref.doi && (
                            <span className="block mt-1 text-gray-500">
                              DOI: {ref.doi}
                            </span>
                          )}
                        </p>
                      </div>
                    );
                  } else {
                    // 简化的参考信息格式
                    return (
                      <div key={index} className="mb-3 last:mb-0">
                        <p className="text-sm font-semibold text-gray-800">{ref.title}</p>
                        <p className="text-sm text-gray-600 leading-relaxed mt-1">{ref.content}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}

          {/* Start Button */}
          <div className="flex justify-center">
            <button
              onClick={() => router.push(`/scales/${scaleId}/consent`)}
              className="px-12 py-4 bg-primary hover:bg-primary-dark text-white text-lg font-semibold rounded-xl shadow-lg transition transform hover:scale-105"
            >
              开始测评
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            点击后您将进入知情同意书页面
          </p>
        </div>
      </main>
      </div>
    </>
  );
}
