"use client";

import { useState } from 'react';
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
  const [agreed, setAgreed] = useState(false);

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
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {scale.title}
                </h1>
                {scale.titleEn && (
                  <p className="text-sm sm:text-lg text-gray-600 mb-3 sm:mb-4">{scale.titleEn}</p>
                )}
                <p className="text-gray-700 text-sm sm:text-lg leading-relaxed">{scale.description}</p>
              </div>
              <span className="ml-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap">
                {scale.category}
              </span>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-3 sm:gap-6 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-xl sm:text-2xl">📝</span>
                <div>
                  <div className="text-xs sm:text-sm text-gray-500">题目数量</div>
                  <div className="text-sm sm:text-base font-semibold">{scale.questionCount} 题</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-xl sm:text-2xl">⏱️</span>
                <div>
                  <div className="text-xs sm:text-sm text-gray-500">预计时间</div>
                  <div className="text-sm sm:text-base font-semibold">{scale.duration}</div>
                </div>
              </div>
              {scale.scoring && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-xl sm:text-2xl">📊</span>
                  <div>
                    <div className="text-xs sm:text-sm text-gray-500">评分范围</div>
                    <div className="text-sm sm:text-base font-semibold">
                      {scale.scoring.scaleRange.min}-{scale.scoring.scaleRange.max} 分
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Purpose Section */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🎯</span>
              衡量维度
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{scale.purpose}</p>

            {scale.dimensions && scale.dimensions.length > 0 && (
              <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                {scale.dimensions.map((dimension) => (
                  <div
                    key={dimension.id}
                    className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                      {dimension.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">{dimension.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          {scale.instructions && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">💡</span>
                测评说明
              </h2>
              <p className="text-sm sm:text-base text-blue-800 leading-relaxed">{scale.instructions}</p>
            </div>
          )}

          {/* References */}
          {scale.references && scale.references.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">📚</span>
                科学依据
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {scale.references.map((ref, index) => {
                  // 检查是否为学术参考文献格式
                  if ('authors' in ref && 'year' in ref && 'journal' in ref) {
                    return (
                      <div key={index} className="text-xs sm:text-sm text-gray-700 leading-relaxed">
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
                      <div key={index} className="mb-2 sm:mb-3 last:mb-0">
                        <p className="text-xs sm:text-sm font-semibold text-gray-800">{ref.title}</p>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mt-1">{ref.content}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}

          {/* 同意条款 */}
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-4">
              <h3 className="text-base sm:text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span className="text-xl sm:text-2xl">⚠️</span>
                重要提示
              </h3>
              <div className="text-xs sm:text-sm text-blue-800 leading-relaxed space-y-2">
                <p>• 本测评结果仅供参考，不具备临床诊断效力</p>
                <p>• 您的数据将完全匿名化处理，仅保存在本地设备</p>
                <p>• 如有心理健康疑虑，请咨询专业心理咨询师或医疗机构</p>
              </div>
            </div>

            <label className="flex items-start gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-5 h-5 sm:w-6 sm:h-6 text-primary rounded focus:ring-2 focus:ring-primary flex-shrink-0"
              />
              <span className="text-xs sm:text-sm text-gray-900">
                我已阅读并理解上述提示，同意遵守
                <Link href="/terms" target="_blank" className="text-primary hover:underline mx-1">《用户协议》</Link>
                和
                <Link href="/privacy" target="_blank" className="text-primary hover:underline mx-1">《隐私政策》</Link>
                ，并接受
                <Link href="/disclaimer" target="_blank" className="text-primary hover:underline mx-1">《免责声明》</Link>
                的全部条款
              </span>
            </label>
          </div>

          {/* Start Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                if (!agreed) {
                  alert('请先同意用户协议和隐私政策');
                  return;
                }
                // 保存同意记录
                localStorage.setItem(`consent_${scaleId}`, JSON.stringify({
                  agreed: true,
                  timestamp: new Date().toISOString(),
                }));
                // 检查是否已经填写过用户信息
                const savedUserInfo = localStorage.getItem('userInfo');
                if (savedUserInfo) {
                  router.push(`/scales/${scaleId}/quiz`);
                } else {
                  router.push(`/scales/${scaleId}/userinfo`);
                }
              }}
              disabled={!agreed}
              className={`px-8 sm:px-12 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold shadow-lg transition transform ${
                agreed
                  ? 'bg-primary hover:bg-primary-dark text-white hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {agreed ? '开始测评' : '请先同意协议'}
            </button>
          </div>
        </div>
      </main>
      </div>
    </>
  );
}
