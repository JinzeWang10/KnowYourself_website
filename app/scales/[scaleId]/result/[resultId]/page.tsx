"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getScaleById, calculateDimensionScores, normalizeScore } from '@/lib/scales';
import { quizApi } from '@/lib/api';
import type { QuizResult, PercentileData } from '@/types/quiz';
import type { RadarDataPoint } from '@/components/DimensionRadarChart';

// 动态导入雷达图组件（仅客户端）
const DimensionRadarChart = dynamic(
  () => import('@/components/DimensionRadarChart'),
  { ssr: false }
);

// 动态导入百分位图组件（仅客户端）
const PercentileChart = dynamic(
  () => import('@/components/PercentileChart'),
  { ssr: false }
);

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
  const [percentileData, setPercentileData] = useState<PercentileData | null>(null);
  const [isLoadingPercentile, setIsLoadingPercentile] = useState(true);
  const scale = getScaleById(scaleId);

  // 设置页面标题
  usePageTitle(scale ? `${scale.title} - 测评结果 | 心理量表` : '测评结果 | 心理量表');

  useEffect(() => {
    // 从历史记录中获取结果
    const history = JSON.parse(localStorage.getItem('quiz-history') || '[]');
    const foundResult = history.find((r: QuizResult) => r.id === resultId);

    if (foundResult) {
      setResult(foundResult);
      // 获取百分位数据
      fetchPercentileData(foundResult.score);
    } else {
      // 如果找不到结果，跳转回量表介绍页
      router.push(`/scales/${scaleId}`);
    }
  }, [resultId, scaleId, router]);

  // 获取百分位数据
  const fetchPercentileData = async (score: number) => {
    try {
      setIsLoadingPercentile(true);
      const response = await quizApi.getPercentile(scaleId, score);
      if (response.success) {
        setPercentileData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch percentile data:', error);
      // 即使失败也不影响主要功能，只是不显示百分位
    } finally {
      setIsLoadingPercentile(false);
    }
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

  // 重建 answers 对象
  const answers: Record<string, number | string> = {};
  result.answers.forEach((a) => {
    if (typeof a.answer !== 'object') {
      answers[a.questionId] = a.answer;
    }
  });

  const dimensionScores = calculateDimensionScores(scale, answers);
  const scoreLevel = scale.scoring.ranges.find(
    (r) => result.score >= r.min && result.score <= r.max
  );

  const normalizedScore = normalizeScore(scale, result.score);
  const scorePercentage = normalizedScore;

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light/10 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <span className="text-xl font-bold text-primary">心理量表</span>
          </Link>
          <Link href="/" className="text-gray-600 hover:text-primary transition text-sm">
            返回首页 →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              测评结果
            </h1>
            <p className="text-gray-600">{scale.title}</p>
            <p className="text-sm text-gray-500 mt-2">
              完成时间: {new Date(result.completedAt).toLocaleString('zh-CN')}
            </p>
          </div>

          {/* Score Display */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-primary-light to-primary mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">{normalizedScore}</div>
                  <div className="text-sm text-white/90">分</div>
                </div>
              </div>

              <h2
                className="text-2xl font-bold mb-2"
                style={{ color: scoreLevel?.color }}
              >
                {scoreLevel?.level}
              </h2>

              {/* Score Bar */}
              <div className="max-w-md mx-auto">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000"
                    style={{
                      width: `${scorePercentage}%`,
                      backgroundColor: scoreLevel?.color
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>100</span>
                </div>
              </div>

              {/* 原始得分备注 */}
              <p className="text-sm text-gray-500 mt-3">
                得分已归一化到 0-100 范围（原始得分: {result.score} / {scale.scoring.scaleRange.max}）
              </p>
            </div>

            {/* Score Description */}
            <div className="mt-6 p-6 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-2">结果解读</h3>
              <p className="text-gray-700 leading-relaxed">
                {scoreLevel?.description}
              </p>
            </div>
          </div>

          {/* Percentile Chart - 百分位分析 */}
          {!isLoadingPercentile && percentileData && (
            <PercentileChart
              percentile={percentileData.percentile}
              totalCount={percentileData.totalCount}
              minSampleSize={30}
            />
          )}

          {/* Loading state for percentile */}
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

          {/* Radar Chart for Dimensions */}
          {scale.dimensions && scale.dimensions.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                维度分析雷达图
              </h2>

              {(() => {
                // 准备雷达图数据
                const radarData: RadarDataPoint[] = scale.dimensions.map((dimension) => {
                  const dimScore = dimensionScores[dimension.id] || 0;
                  // 根据量表类型确定最高分
                  let maxScorePerQuestion = 7; // 默认7分制
                  if (scaleId === 'ppus') {
                    maxScorePerQuestion = 5; // PPUS是0-5分制
                  }
                  const maxScore = dimension.questionIds.length * maxScorePerQuestion;
                  const normalizedValue = (dimScore / maxScore) * 100;

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
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                维度得分详情
              </h2>

              <div className="space-y-6">
                {scale.dimensions.map((dimension) => {
                  const dimScore = dimensionScores[dimension.id] || 0;
                  const maxScore = dimension.questionIds.length * 7; // 假设每题最高7分
                  const dimPercentage = (dimScore / maxScore) * 100;

                  return (
                    <div key={dimension.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {dimension.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {dimension.description}
                          </p>
                        </div>
                        <span className="text-2xl font-bold text-primary ml-4">
                          {dimScore}
                        </span>
                      </div>

                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-1000"
                          style={{ width: `${dimPercentage}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span>{maxScore}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
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

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.push(`/scales/${scaleId}/quiz`)}
              className="px-6 py-3 bg-white border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition"
            >
              重新测评
            </button>

            <Link
              href="/history"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition inline-block"
            >
              查看历史记录
            </Link>

            <Link
              href="/"
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition inline-block"
            >
              返回首页
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
