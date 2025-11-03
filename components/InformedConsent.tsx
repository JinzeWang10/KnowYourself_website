"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface InformedConsentProps {
  scaleId: string;
  scaleTitle: string;
  scaleDescription: string;
  references?: Array<{
    authors: string;
    year: number;
    title: string;
    journal?: string;
    doi?: string;
  }>;
}

export default function InformedConsent({
  scaleId,
  scaleTitle,
  scaleDescription,
  references,
}: InformedConsentProps) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);

  const handleProceed = () => {
    if (agreed) {
      // 保存同意记录到 localStorage
      localStorage.setItem(`consent_${scaleId}`, JSON.stringify({
        agreed: true,
        timestamp: new Date().toISOString(),
      }));

      // 检查是否已经填写过用户信息
      const savedUserInfo = localStorage.getItem('userInfo');
      if (savedUserInfo) {
        // 如果已经填写过，直接跳转到测试页面
        router.push(`/scales/${scaleId}/quiz`);
      } else {
        // 否则跳转到用户信息填写页面
        router.push(`/scales/${scaleId}/userinfo`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <span className="text-xl font-bold text-primary">心理量表</span>
          </Link>
          <Link href={`/scales/${scaleId}`} className="text-gray-600 hover:text-primary transition text-sm">
            返回量表介绍 →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">知情同意书</h1>
            <p className="text-lg text-gray-600 mb-8">{scaleTitle}</p>

            {/* 评估目的 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                评估目的
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {scaleDescription}本评估基于科学研究和标准化量表，旨在帮助您进行自我探索和了解，
                促进您对自身心理健康状态的认知和理解。
              </p>
              {references && references.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 mb-2">量表来源：</p>
                  {references.map((ref, index) => (
                    <p key={index} className="text-sm text-gray-600 leading-relaxed mb-1">
                      {ref.authors} ({ref.year}). <em>{ref.title}</em>
                      {ref.journal && `. ${ref.journal}`}
                      {ref.doi && ` doi: ${ref.doi}`}
                    </p>
                  ))}
                </div>
              )}
            </section>

            {/* 隐私保护 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">🔒</span>
                隐私保护
              </h2>
              <p className="text-gray-700 leading-relaxed">
                您的所有回答将完全匿名化处理，仅保存在您的设备本地，不会上传到任何服务器。
                我们不收集任何可识别个人身份的信息。您可以随时清除浏览器缓存来删除本地保存的数据，
                也可以选择将结果截图保存用于个人记录。您的隐私和数据安全是我们的首要关注。
              </p>
            </section>

            {/* 自愿参与 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">✋</span>
                自愿参与
              </h2>
              <p className="text-gray-700 leading-relaxed">
                参与本评估完全基于自愿原则。您可以在任何时候退出评估，无需说明理由。
                对于任何让您感到不适的问题，您都可以选择跳过或中止评估。
                评估过程中如果您感到不适，请立即停止并考虑寻求专业心理健康服务的帮助。
              </p>
            </section>

            {/* 非诊断性质 */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-2xl">⚕️</span>
                非诊断性质
              </h2>
              <p className="text-gray-700 leading-relaxed">
                本评估结果仅供自我了解和反思使用，不能替代专业的心理健康诊断或治疗。
                如果您在心理健康方面有困扰或疑问，强烈建议咨询合格的心理健康专业人士（如心理咨询师、临床心理学家或精神科医生）。
                评估结果不应被用于医疗决策或自我诊断。
              </p>
            </section>

            {/* 重要提醒 */}
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-bold text-red-900 mb-2 flex items-center gap-2">
                <span className="text-2xl">⚠️</span>
                重要提醒
              </h3>
              <p className="text-red-800 leading-relaxed">
                如果您目前正在经历严重的心理困扰、抑郁、焦虑或有自伤、自杀倾向，
                请立即寻求专业心理健康服务的帮助或拨打心理危机热线（如：全国心理援助热线 400-161-9995）。
                本评估不适合处于急性心理危机状态的人群。
              </p>
            </div>

            {/* 统一确认框 */}
            <div className="mb-8">
              <label className="flex items-start gap-3 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-6 h-6 text-primary rounded focus:ring-2 focus:ring-primary"
                />
                <span className="text-gray-900 font-medium">
                  我已仔细阅读并理解上述所有内容，包括评估目的、隐私保护政策、自愿参与原则、非诊断性质以及重要提醒。
                  我同意参与本次评估。
                </span>
              </label>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4 justify-center">
              <Link
                href={`/scales/${scaleId}`}
                className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                返回
              </Link>
              <button
                onClick={handleProceed}
                disabled={!agreed}
                className={`px-8 py-3 rounded-lg font-semibold transition ${
                  agreed
                    ? 'bg-primary hover:bg-primary-dark text-white shadow-lg transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {agreed ? '开始评估' : '请先勾选同意'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
