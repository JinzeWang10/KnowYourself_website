"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getScaleById, calculateDimensionScores, normalizeScore, normalizeDimensionScore, getScaleScoreRange } from '@/lib/scales';
// import { getPercentileRank } from '@/lib/api-client';
import { exportWithFeedback } from '@/lib/export-image';
import type { QuizResult } from '@/types/quiz';
import type { RadarDataPoint } from '@/components/DimensionRadarChart';
import ShareCard from '@/components/ShareCard';

// 动态导入雷达图组件（仅客户端）
const DimensionRadarChart = dynamic(
  () => import('@/components/DimensionRadarChart'),
  { ssr: false }
);

// 动态导入百分位图组件（仅客户端） - 暂时不使用
// const PercentileChart = dynamic(
//   () => import('@/components/PercentileChart'),
//   { ssr: false }
// );

// 动态设置页面标题
function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const scaleId = params.scaleId as string;
  const resultId = params.resultId as string;

  const [result, setResult] = useState<QuizResult | null>(null);
  // const [percentileData, setPercentileData] = useState<{
  //   percentile: number | null;
  //   totalCount: number;
  //   higherCount?: number;
  //   lowerCount?: number;
  //   message?: string;
  // } | null>(null);
  // const [isLoadingPercentile, setIsLoadingPercentile] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const scale = getScaleById(scaleId);

  // 设置页面标题
  usePageTitle(scale ? `${scale.title} - 测评结果 | KnowYourself` : '测评结果 | KnowYourself');

  useEffect(() => {
    // 从历史记录中获取结果
    const history = JSON.parse(localStorage.getItem('quiz-history') || '[]');
    const foundResult = history.find((r: QuizResult) => r.id === resultId);

    if (foundResult) {
      setResult(foundResult);
      // 获取百分位数据 - 暂时不使用
      // fetchPercentileData(foundResult.score);
    } else {
      // 如果找不到结果，跳转回量表介绍页
      router.push(`/scales/${scaleId}`);
    }
  }, [resultId, scaleId, router]);

  // 获取百分位数据 - 暂时不使用
  // const fetchPercentileData = async (score: number) => {
  //   try {
  //     setIsLoadingPercentile(true);
  //     const response = await getPercentileRank(scaleId, score);
  //     if (response.success && response.data) {
  //       setPercentileData(response.data);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch percentile data:', error);
  //     // 即使失败也不影响主要功能，只是不显示百分位
  //   } finally {
  //     setIsLoadingPercentile(false);
  //   }
  // };

  // 导出分享卡片为图片
  const handleExportImage = async () => {
    if (!shareCardRef.current) {
      alert('无法获取分享卡片，请稍后重试');
      return;
    }

    await exportWithFeedback(
      shareCardRef.current,
      `${scale?.title || '测评结果'}_${new Date().toLocaleDateString('zh-CN')}`,
      {
        onStart: () => setIsExporting(true),
        onComplete: (success) => {
          setIsExporting(false);
          if (success) {
            // 可以添加成功提示，这里暂时不做UI提示
          } else {
            alert('图片生成失败，请重试');
          }
        },
        onError: (error) => {
          setIsExporting(false);
          console.error('Export error:', error);
          alert('图片导出失败：' + error.message);
        },
      }
    );
  };

  if (!scale || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 重建 answers 对象（可能包含 string 或 number）
  const answers: Record<string, number | string> = {};
  result.answers.forEach((a) => {
    if (typeof a.answer !== 'object') {
      answers[a.questionId] = a.answer;
    }
  });

  // 将 answers 转换为 numericAnswers 以匹配计算接口
  const numericAnswers: Record<string, number> = Object.fromEntries(
    Object.entries(answers).map(([k, v]) => [k, typeof v === 'number' ? v : Number(v)])
  ) as Record<string, number>;

  const dimensionScores = calculateDimensionScores(scale, numericAnswers);
  const scoreLevel = scale.scoring?.ranges.find(
    (r) => result.score >= r.min && result.score <= r.max
  );

  const normalizedScore = scale.scoring ? normalizeScore(scale, result.score) : result.score;
  const scorePercentage = normalizedScore;

  // 获取量表的分值范围，用于维度归一化
  const scoreRange = getScaleScoreRange(scale);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50/30 to-pink-50/30">
      {/* Header */}
      <header className="glass-effect border-b border-neutral-200/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition group">
            <Image
              src="/knowyourself_logo.png"
              alt="KnowYourself Logo"
              width={32}
              height={32}
              className="object-contain transition-transform group-hover:scale-110"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold gradient-text">KnowYourself</span>
              <span className="text-xs text-neutral-500 font-light">知己</span>
            </div>
          </Link>
          <Link href="/" className="text-neutral-600 hover:text-primary transition-colors text-sm font-medium">
            返回首页 →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title - 更简洁的标题区 */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-soft border border-neutral-100/50 mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">🎯</span>
              <span className="text-xs sm:text-sm font-medium text-neutral-600">测评完成</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2 px-4">
              {scale.title}
            </h1>
            <p className="text-sm text-neutral-500 font-light">
              {new Date(result.completedAt).toLocaleString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* ShareCard - 精美分享卡片置顶 */}
          {(() => {
            // 准备雷达图数据（如果有维度）
            const radarData: RadarDataPoint[] | undefined = scale.dimensions?.map((dimension) => {
              const dimScore = dimensionScores[dimension.id] || 0;
              const normalizedValue = normalizeDimensionScore(
                dimScore,
                dimension.questionIds.length,
                scoreRange.min,
                scoreRange.max
              );

              return {
                dimension: dimension.name,
                value: Math.round(normalizedValue * 10) / 10,
                fullMark: 100,
              };
            });

            return (
              <ShareCard
                ref={shareCardRef}
                scaleTitle={scale.title}
                score={normalizedScore}
                level={scoreLevel?.level || ''}
                levelColor={scoreLevel?.color || '#6366F1'}
                description={scoreLevel?.description || ''}
                completedAt={typeof result.completedAt === 'string' ? result.completedAt : new Date(result.completedAt).toISOString()}
                percentile={undefined}
                radarData={radarData}
              />
            );
          })()}

          {/* 下载分享卡片按钮 - 暂时隐藏 */}
          {false && (
            <div className="text-center mb-6 sm:mb-8 animate-fade-in animation-delay-100">
              <button
                onClick={handleExportImage}
                disabled={isExporting}
                className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white rounded-xl sm:rounded-2xl font-bold hover:shadow-glow-lg transition-all duration-300 shadow-soft hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isExporting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      生成中...
                    </>
                  ) : (
                    <>
                      <span>📸</span>
                      下载分享图片
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <p className="text-xs sm:text-sm text-neutral-500 mt-2 sm:mt-3">
                💡 点击按钮生成精美分享图片，或截图此卡片分享至社交平台
              </p>
            </div>
          )}

          {/* Detailed Interpretation - 详细解读区 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft-xl p-5 sm:p-10 mb-6 sm:mb-8 border border-neutral-100/50 animate-slide-up">
            <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-soft">
                <span className="text-xl sm:text-2xl">📖</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">详细解读</h2>
            </div>

            {/* Score Description */}
            <div className="p-5 sm:p-8 bg-gradient-to-br from-neutral-50 to-purple-50/30 rounded-xl sm:rounded-2xl border border-neutral-200/30 shadow-soft mb-4 sm:mb-6">
              <h3 className="font-bold text-neutral-900 mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🎯</span>
                核心解读
              </h3>
              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                {scoreLevel?.description}
              </p>
            </div>

            {/* Psychological Traits - 心理特征 */}
            {scoreLevel?.psychologicalTraits && (
              <div className="p-5 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl border border-purple-200/30 shadow-soft mb-4 sm:mb-6">
                <h3 className="font-bold text-neutral-900 mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">🧠</span>
                  心理特征
                </h3>
                <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                  {scoreLevel.psychologicalTraits}
                </p>
              </div>
            )}

            {/* Suggestions - 建议 */}
            {scoreLevel?.suggestions && scoreLevel.suggestions.length > 0 && (
              <div className="p-5 sm:p-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl border border-blue-200/30 shadow-soft">
                <h3 className="font-bold text-neutral-900 mb-4 sm:mb-6 text-base sm:text-lg flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">💡</span>
                  改善建议
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {scoreLevel.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 sm:gap-4 group hover:translate-x-1 transition-transform">
                      <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 text-white text-xs sm:text-sm flex items-center justify-center font-bold shadow-soft group-hover:shadow-glow transition-shadow">
                        {index + 1}
                      </span>
                      <span className="text-sm sm:text-base text-neutral-700 leading-relaxed flex-1 pt-0.5">
                        {suggestion}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 免责声明和参考提示 */}
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <p className="text-sm text-gray-700 leading-relaxed">
                ℹ️ <strong>重要提示：</strong>测评结果仅供参考，不具备临床诊断效力。
                若您有心理健康疑虑，请咨询专业心理咨询师或医疗机构。
                详情请查阅
                <Link href="/disclaimer" target="_blank" className="text-primary hover:underline mx-1">
                  《免责声明》
                </Link>
              </p>
            </div>
          </div>

          {/* 心理援助信息（异常结果时显示） */}
          {normalizedScore >= 70 && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-3xl">🆘</span>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-900 mb-3">需要帮助？</h3>
                  <p className="text-red-800 leading-relaxed mb-4">
                    您的测评结果显示可能存在需要关注的情况。请不要过度担心，但建议您寻求专业帮助。
                  </p>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-gray-900 font-semibold mb-2">心理援助热线：</p>
                    <ul className="list-none text-gray-800 space-y-2 text-sm">
                      <li>🇨🇳 全国心理援助热线: <strong>400-161-9995</strong></li>
                      <li>🇭🇰 香港撒玛利亚防止自杀会: <strong>2389-2222</strong></li>
                      <li>🌏 国际心理援助: <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">findahelpline.com</a></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Percentile Chart - 百分位分析 - 暂时隐藏
          {!isLoadingPercentile && percentileData && (
            <PercentileChart
              percentile={percentileData.percentile}
              totalCount={percentileData.totalCount}
              minSampleSize={30}
            />
          )}

          {isLoadingPercentile && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📊</span>
                <h3 className="text-xl font-bold text-gray-900">相对位置分析</h3>
              </div>
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">加载统计数据中...</p>
              </div>
            </div>
          )}
          */}

          {/* Radar Chart for Dimensions */}
          {scale.dimensions && scale.dimensions.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft-lg p-5 sm:p-10 mb-6 sm:mb-8 border border-neutral-100/50 animate-slide-up animation-delay-100">
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-soft">
                  <span className="text-xl sm:text-2xl">📈</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">维度分析雷达图</h2>
              </div>

              {(() => {
                // 准备雷达图数据
                const radarData: RadarDataPoint[] = scale.dimensions.map((dimension) => {
                  const dimScore = dimensionScores[dimension.id] || 0;
                  // 使用正确的归一化函数计算百分比，传入量表的分值范围
                  const normalizedValue = normalizeDimensionScore(
                    dimScore,
                    dimension.questionIds.length,
                    scoreRange.min,
                    scoreRange.max
                  );

                  return {
                    dimension: dimension.name,
                    value: Math.round(normalizedValue * 10) / 10, // 保留一位小数
                    fullMark: 100,
                  };
                });

                return <DimensionRadarChart data={radarData} />;
              })()}
            </div>
          )}

          {/* Dimension Scores - Detailed Bars */}
          {scale.dimensions && scale.dimensions.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft-lg p-5 sm:p-10 mb-6 sm:mb-8 border border-neutral-100/50 animate-slide-up animation-delay-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-soft">
                  <span className="text-xl sm:text-2xl">📊</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">维度得分详情</h2>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {scale.dimensions.map((dimension, index) => {
                  const dimScore = dimensionScores[dimension.id] || 0;
                  // 使用正确的归一化函数计算百分比，传入量表的分值范围
                  const dimPercentage = normalizeDimensionScore(
                    dimScore,
                    dimension.questionIds.length,
                    scoreRange.min,
                    scoreRange.max
                  );

                  // 根据分数确定颜色
                  let barColor = 'from-green-500 to-emerald-600';
                  let bgColor = 'from-green-50 to-emerald-50';
                  if (dimPercentage >= 67) {
                    barColor = 'from-red-500 to-rose-600';
                    bgColor = 'from-red-50 to-rose-50';
                  } else if (dimPercentage >= 34) {
                    barColor = 'from-amber-500 to-orange-600';
                    bgColor = 'from-amber-50 to-orange-50';
                  }

                  return (
                    <div
                      key={dimension.id}
                      className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-neutral-50/50 to-purple-50/30 border border-neutral-100/50 hover:shadow-soft transition-all duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-neutral-900 text-base sm:text-lg mb-1">
                            {dimension.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-neutral-600">
                            {dimension.description}
                          </p>
                        </div>
                        <div className={`ml-3 sm:ml-6 px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${bgColor} border border-neutral-200/30 shadow-soft`}>
                          <span className={`text-2xl sm:text-3xl font-black bg-gradient-to-br ${barColor} bg-clip-text text-transparent`}>
                            {Math.round(dimPercentage)}
                          </span>
                          <span className="text-xs sm:text-sm text-neutral-600 font-medium">%</span>
                        </div>
                      </div>

                      {/* 3D进度条 */}
                      <div className="relative">
                        {/* 底层阴影 */}
                        <div className={`absolute inset-x-0 top-1 h-5 sm:h-6 bg-gradient-to-r ${barColor} opacity-10 rounded-full blur-sm`}></div>

                        {/* 背景轨道 */}
                        <div className="relative h-5 sm:h-6 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
                          {/* 进度条 */}
                          <div
                            className={`h-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out group-hover:brightness-110 relative overflow-hidden`}
                            style={{ width: `${dimPercentage}%` }}
                          >
                            {/* 高光效果 */}
                            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
                            {/* 动画光波 */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                          </div>
                        </div>

                        {/* 刻度标记 */}
                        <div className="flex justify-between text-[10px] sm:text-xs text-neutral-400 mt-2 font-medium">
                          <span>0</span>
                          <span className="hidden sm:inline">25</span>
                          <span>50</span>
                          <span className="hidden sm:inline">75</span>
                          <span>100</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* References */}
          {scale.references && scale.references.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft-lg p-5 sm:p-10 mb-6 sm:mb-8 border border-neutral-100/50">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-soft">
                  <span className="text-xl sm:text-2xl">📚</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">科学依据</h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {scale.references.map((ref, index) => {
                  // 检查是否为学术参考文献格式
                  if ('authors' in ref && 'year' in ref && 'journal' in ref) {
                    return (
                      <div key={index} className="p-4 sm:p-5 bg-gradient-to-br from-neutral-50 to-purple-50/30 rounded-xl border border-neutral-200/30">
                        <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                          {ref.authors} ({ref.year}). <em>{ref.title}</em>.{' '}
                          <span className="font-semibold">{ref.journal}</span>
                          {ref.volume && `, ${ref.volume}`}
                          {ref.pages && `, ${ref.pages}`}.
                          {ref.doi && (
                            <span className="block mt-2 text-neutral-500 text-xs">
                              DOI: {ref.doi}
                            </span>
                          )}
                        </p>
                      </div>
                    );
                  } else {
                    // 简化的参考信息格式
                    return (
                      <div key={index} className="p-4 sm:p-5 bg-gradient-to-br from-neutral-50 to-purple-50/30 rounded-xl border border-neutral-200/30">
                        <p className="text-xs sm:text-sm font-semibold text-neutral-900 mb-2">{ref.title}</p>
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{ref.content}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}

          {/* Action Buttons - 精美设计 */}
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center animate-fade-in animation-delay-300">
            <button
              onClick={() => router.push(`/scales/${scaleId}/quiz`)}
              className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-white border-2 border-primary text-primary rounded-xl sm:rounded-2xl font-bold hover:bg-primary hover:text-white transition-all duration-300 shadow-soft hover:shadow-soft-lg hover:scale-105 overflow-hidden text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>🔄</span>
                重新测评
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <Link
              href="/history"
              className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-br from-neutral-100 to-neutral-50 border-2 border-neutral-200 text-neutral-700 rounded-xl sm:rounded-2xl font-bold hover:border-neutral-300 transition-all duration-300 shadow-soft hover:shadow-soft-lg hover:scale-105 inline-block overflow-hidden text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>📜</span>
                <span className="hidden sm:inline">查看历史记录</span>
                <span className="sm:hidden">历史</span>
              </span>
            </Link>

            <Link
              href="/"
              className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white rounded-xl sm:rounded-2xl font-bold hover:shadow-glow-lg transition-all duration-300 shadow-soft hover:scale-105 inline-block overflow-hidden text-sm sm:text-base"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>🏠</span>
                返回首页
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
