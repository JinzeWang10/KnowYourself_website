"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { getScaleById, calculateDimensionScores, normalizeScore, normalizeDimensionScore, getScaleScoreRange } from '@/lib/scales';
import { getCharacterImagePath, getCharacterCoreTrait, getCharacterSubtitle, getCharacterEmoji, getCharacterDetailedTraits } from '@/lib/scales/zhz';
import {
  CHARACTER_PROFILES as ZOOTOPIA_PROFILES,
  CHARACTER_CORE_TRAITS as ZOOTOPIA_CORE_TRAITS,
  CHARACTER_DETAILED_TRAITS as ZOOTOPIA_DETAILED_TRAITS,
  CHARACTER_IMAGE_MAP as ZOOTOPIA_IMAGE_MAP
} from '@/lib/scales/zootopia';
// import { getPercentileRank } from '@/lib/api-client';
import { exportWithFeedback } from '@/lib/export-image';
import type { QuizResult } from '@/types/quiz';
import type { RadarDataPoint } from '@/components/DimensionRadarChart';
import ShareCard from '@/components/ShareCard';
import ZHZShareCard from '@/components/ZHZShareCard';
import ZootopiaShareCard from '@/components/ZootopiaShareCard';

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
  const [showSuccessToast, setShowSuccessToast] = useState(false);
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

    // 生成安全的文件名（移除斜杠等特殊字符）
    const now = new Date();
    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const filename = `${scale?.title || '测评结果'}_${dateStr}`;

    await exportWithFeedback(
      shareCardRef.current,
      filename,
      {
        onStart: () => setIsExporting(true),
        onComplete: (success) => {
          setIsExporting(false);
          if (success) {
            // 显示成功提示
            setShowSuccessToast(true);
            // 3秒后自动隐藏
            setTimeout(() => setShowSuccessToast(false), 3000);
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

  // 对于有自定义 calculateResults 的量表（如 EQ），直接使用保存的维度得分
  // 否则使用通用计算函数重新计算
  const dimensionScores = result.dimensionScores || calculateDimensionScores(scale, numericAnswers);
  const scoreLevel = scale.scoring?.ranges?.find(
    (r) => result.score >= r.min && result.score <= r.max
  );

  const normalizedScore = scale.scoring ? normalizeScore(scale, result.score) : result.score;
  const scorePercentage = normalizedScore;

  // 获取量表的分值范围，用于维度归一化
  const scoreRange = getScaleScoreRange(scale);

  // 检查是否是 ZHZ 量表，需要特殊处理
  const isZHZ = scaleId === 'zhz';
  const zhzMetadata = isZHZ && result.metadata ? result.metadata : null;

  // 检查是否是 Zootopia 量表，需要特殊处理
  const isZootopia = scaleId === 'zootopia';
  const zootopiaMetadata = isZootopia && result.metadata ? result.metadata : null;

  // 调试日志
  if (isZootopia) {
    console.log('🦊 Zootopia scale detected');
    console.log('🦊 Result metadata:', result.metadata);
    console.log('🦊 Zootopia metadata:', zootopiaMetadata);
  }

  // 检查是否是 PAT 量表，需要展示心理年龄
  const isPAT = scaleId === 'pat';
  const patMetadata = isPAT && result.metadata ? result.metadata : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50/30 to-pink-50/30">
      {/* 成功提示Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-[60] animate-slide-in-right">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-glow-lg flex items-center gap-3">
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-bold">图片已保存！</p>
              <p className="text-sm opacity-90">可在下载文件夹中查看</p>
            </div>
          </div>
        </div>
      )}

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

          {/* ZHZ Character Hero Section - 人物角色展示区 */}


          {/* ShareCard - 精美分享卡片置顶 */}
          {(() => {
            // 准备雷达图数据（如果有维度）
            let radarData: RadarDataPoint[] | undefined;

            // 对于 ZHZ 量表，使用 metadata 中的 userVector
            if (isZHZ && zhzMetadata && zhzMetadata.userVector) {
              radarData = scale.dimensions?.map((dimension) => ({
                dimension: dimension.name,
                value: Math.round((zhzMetadata.userVector[dimension.id] || 0) * 100 * 10) / 10,
                fullMark: 100,
              }));
            } else if (isZootopia && zootopiaMetadata && zootopiaMetadata.primaryResult && zootopiaMetadata.primaryResult.dimensionScores) {
              // 对于 Zootopia 量表，使用 metadata 中的 dimensionScores（0-1范围，需要转换为0-100）
              radarData = scale.dimensions?.map((dimension) => ({
                dimension: dimension.name,
                value: Math.round((zootopiaMetadata.primaryResult.dimensionScores[dimension.id] || 0) * 100 * 10) / 10,
                fullMark: 100,
              }));
            } else {
              // 其他量表使用标准计算
              radarData = scale.dimensions?.map((dimension) => {
                const dimScore = dimensionScores[dimension.id] || 0;

                // 对于 EQ、PAT、Workhorse 量表，dimensionScores 中已经是百分比（0-100），不需要再归一化
                // 对于其他量表，需要使用 normalizeDimensionScore 转换
                let normalizedValue: number;
                if ((scaleId === 'eq' || scaleId === 'pat' || scaleId === 'workhorse') && result.dimensionScores) {
                  // EQ、PAT、Workhorse 量表直接使用已计算的百分比
                  normalizedValue = dimScore;
                } else {
                  // 其他量表需要归一化
                  normalizedValue = normalizeDimensionScore(
                    dimScore,
                    dimension.questionIds.length,
                    scoreRange.min,
                    scoreRange.max
                  );
                }

                return {
                  dimension: dimension.name,
                  value: Math.round(normalizedValue * 10) / 10,
                  fullMark: 100,
                };
              });
            }

            // 对于 ZHZ 量表，使用专属的 ZHZShareCard
            if (isZHZ && zhzMetadata && zhzMetadata.topCharacters && zhzMetadata.topCharacters.length > 0) {
              const topChar = zhzMetadata.topCharacters[0];

              // 提取核心关键词（从解读文本中提取）
              const coreKeywords: string[] = [];
              const descriptionMatch = result.interpretation?.match(/\*\*关键词[：:](.*?)\*\*/);
              if (descriptionMatch) {
                const keywordsText = descriptionMatch[1].trim();
                coreKeywords.push(...keywordsText.split(/[、，,]/).map(k => k.trim()).slice(0, 3));
              }

              return (
                <ZHZShareCard
                  ref={shareCardRef}
                  scaleTitle={scale.title}
                  mainCharacter={{
                    id: topChar.id,
                    name: topChar.name,
                    similarity: topChar.similarity,
                    imagePath: getCharacterImagePath(topChar.id),
                    coreTrait: getCharacterCoreTrait(topChar.id)
                  }}
                  otherCharacters={zhzMetadata.topCharacters.slice(1, 3).map((char: any) => ({
                    id: char.id,
                    name: char.name,
                    similarity: char.similarity,
                    imagePath: getCharacterImagePath(char.id),
                    coreTrait: getCharacterCoreTrait(char.id)
                  }))}
                  completedAt={typeof result.completedAt === 'string' ? result.completedAt : new Date(result.completedAt).toISOString()}
                  radarData={radarData}
                  coreKeywords={coreKeywords}
                />
              );
            }

            // 对于 Zootopia 量表，使用专属的 ZootopiaShareCard
            if (isZootopia && zootopiaMetadata && zootopiaMetadata.primaryResult) {
              console.log('🦊 Zootopia metadata found:', zootopiaMetadata);
              console.log('🦊 Radar data:', radarData);
              const primaryResult = zootopiaMetadata.primaryResult;
              const secondaryMatches = zootopiaMetadata.secondaryMatches || [];

              // 提取核心关键词（可以从特质文本中提取或预定义）
              const coreKeywords: string[] = [];
              // 简单示例：从角色 subtitle 提取关键词
              const subtitle = ZOOTOPIA_PROFILES[primaryResult.characterId as keyof typeof ZOOTOPIA_PROFILES]?.subtitle || '';
              if (subtitle) {
                const keywordMatch = subtitle.match(/(.+?)的(.+)/);
                if (keywordMatch) {
                  coreKeywords.push(keywordMatch[1], keywordMatch[2]);
                }
              }

              return (
                <ZootopiaShareCard
                  ref={shareCardRef}
                  scaleTitle={scale.title}
                  mainCharacter={{
                    id: primaryResult.characterId,
                    name: primaryResult.characterName,
                    similarity: primaryResult.similarity,
                    imagePath: `/zootopia/${ZOOTOPIA_IMAGE_MAP[primaryResult.characterId as keyof typeof ZOOTOPIA_IMAGE_MAP] || 'placeholder.svg'}`,
                    coreTrait: primaryResult.coreTrait || ZOOTOPIA_CORE_TRAITS[primaryResult.characterId as keyof typeof ZOOTOPIA_CORE_TRAITS] || ''
                  }}
                  otherCharacters={secondaryMatches.map((match: any) => ({
                    id: match.characterId,
                    name: match.characterName,
                    similarity: match.similarity,
                    imagePath: `/zootopia/${ZOOTOPIA_IMAGE_MAP[match.characterId as keyof typeof ZOOTOPIA_IMAGE_MAP] || 'placeholder.svg'}`,
                    coreTrait: ZOOTOPIA_CORE_TRAITS[match.characterId as keyof typeof ZOOTOPIA_CORE_TRAITS] || ''
                  }))}
                  completedAt={typeof result.completedAt === 'string' ? result.completedAt : new Date(result.completedAt).toISOString()}
                  radarData={radarData}
                  coreKeywords={coreKeywords.length > 0 ? coreKeywords : undefined}
                />
              );
            }

            // 对于 PAT 量表，使用新的年龄解读
            let description = '';
            let level = '';
            let levelColor = '#6366F1';

            if (isPAT) {
              if (patMetadata?.ageInterpretation) {
                // 有完整的年龄解读数据
                description = patMetadata.ageInterpretation.description;
                level = patMetadata.ageInterpretation.title;
                levelColor = patMetadata.ageInterpretation.level === 'A' || patMetadata.ageInterpretation.level === 'B'
                  ? '#10b981'
                  : patMetadata.ageInterpretation.level === 'C'
                  ? '#f59e0b'
                  : '#ef4444';
              } else if (patMetadata?.psychologicalAge) {
                // 只有心理年龄数据，生成通用描述
                description = `你的心理年龄为 ${patMetadata.psychologicalAge} 岁，展现出相应的心理成熟度特征。这个结果反映了你在情绪管理、自我认知、责任意识等方面的综合表现。`;
                level = `心理年龄 ${patMetadata.psychologicalAge} 岁`;
                // 根据心理年龄判断颜色
                levelColor = patMetadata.psychologicalAge >= 30 ? '#10b981' : patMetadata.psychologicalAge >= 20 ? '#f59e0b' : '#6366F1';
              } else {
                // 完全没有元数据，使用分数级别
                description = scoreLevel?.description || '测评已完成，请查看详细维度分析了解你的心理成熟度。';
                level = scoreLevel?.level || '已完成';
                levelColor = scoreLevel?.color || '#6366F1';
              }
            } else {
              // 非 PAT 量表
              // Workhorse 量表使用个性化简评（result.interpretation），其他量表使用固定描述
              if (scaleId === 'workhorse' && result.interpretation) {
                // 移除 Markdown 格式符号（如 ** 用于加粗）
                description = result.interpretation.replace(/\*\*/g, '');
              } else {
                description = scoreLevel?.description || '';
              }
              level = scoreLevel?.level || '';
              levelColor = scoreLevel?.color || '#6366F1';
            }

            return (
              <ShareCard
                ref={shareCardRef}
                scaleTitle={scale.title}
                score={normalizedScore}
                level={level}
                levelColor={levelColor}
                description={description}
                completedAt={typeof result.completedAt === 'string' ? result.completedAt : new Date(result.completedAt).toISOString()}
                percentile={undefined}
                radarData={radarData}
                isPAT={isPAT}
                patMetadata={patMetadata}
              />
            );
          })()}

          {/* 下载分享卡片按钮 */}
          <div className="text-center mb-6 sm:mb-8 animate-fade-in animation-delay-100">
            <button
              onClick={handleExportImage}
              disabled={isExporting}
              className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white rounded-2xl font-bold hover:shadow-glow-xl transition-all duration-300 shadow-soft-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base sm:text-lg overflow-hidden min-w-[280px] sm:min-w-[320px]"
            >
              {/* 光效背景 */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-light/50 via-purple-400/50 to-pink-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

              {/* 按钮内容 */}
              <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                {isExporting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-bold">正在生成图片...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-bold">一键保存分享图</span>
                  </>
                )}
              </span>
            </button>
            <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-xs sm:text-sm text-neutral-600 font-medium">
                高清图片 · 一键下载 · 直接分享
              </p>
            </div>
          </div>

          {/* PAT 量表不显示详细解读区，其他量表显示 */}
          {!isPAT && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft-xl p-5 sm:p-10 mb-6 sm:mb-8 border border-neutral-100/50 animate-slide-up">
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-soft">
                  <span className="text-xl sm:text-2xl">📖</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">详细解读</h2>
              </div>

              {/* ZHZ 测评专属解读 */}
              {isZHZ && zhzMetadata && zhzMetadata.topCharacters && zhzMetadata.topCharacters.length > 0 ? (
                <>
                  {/* 核心特质 */}
                  <div className="p-5 sm:p-8 bg-gradient-to-br from-neutral-50 to-purple-50/30 rounded-xl sm:rounded-2xl border border-neutral-200/30 shadow-soft mb-4 sm:mb-6">
                    <h3 className="font-bold text-neutral-900 mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                      <span className="text-xl sm:text-2xl">🎯</span>
                      核心特质
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                      {getCharacterCoreTrait(zhzMetadata.topCharacters[0].id)}
                    </p>
                  </div>

                  {(() => {
                    const detailedTraits = getCharacterDetailedTraits(zhzMetadata.topCharacters[0].id);
                    return detailedTraits ? (
                      <>
                        {/* 性格优势 */}
                        <div className="p-5 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl border border-green-200/30 shadow-soft mb-4 sm:mb-6">
                          <h3 className="font-bold text-neutral-900 mb-4 sm:mb-6 text-base sm:text-lg flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">✨</span>
                            性格优势
                          </h3>
                          <div className="space-y-3 sm:space-y-4">
                            {detailedTraits.advantages.map((advantage: string, index: number) => (
                              <div key={index} className="flex items-start gap-3 sm:gap-4 group hover:translate-x-1 transition-transform">
                                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs sm:text-sm flex items-center justify-center font-bold shadow-soft group-hover:shadow-glow transition-shadow">
                                  {index + 1}
                                </span>
                                <span className="text-sm sm:text-base text-neutral-700 leading-relaxed flex-1 pt-0.5">
                                  {advantage}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 潜在风险 */}
                        <div className="p-5 sm:p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl border border-amber-200/30 shadow-soft">
                          <h3 className="font-bold text-neutral-900 mb-4 sm:mb-6 text-base sm:text-lg flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">⚠️</span>
                            潜在风险
                          </h3>
                          <div className="space-y-3 sm:space-y-4">
                            {detailedTraits.risks.map((risk: string, index: number) => (
                              <div key={index} className="flex items-start gap-3 sm:gap-4 group hover:translate-x-1 transition-transform">
                                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs sm:text-sm flex items-center justify-center font-bold shadow-soft group-hover:shadow-glow transition-shadow">
                                  {index + 1}
                                </span>
                                <span className="text-sm sm:text-base text-neutral-700 leading-relaxed flex-1 pt-0.5">
                                  {risk}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : null;
                  })()}
                </>
              ) : isZootopia && zootopiaMetadata && zootopiaMetadata.primaryResult ? (
                <>
                  {/* Zootopia 测评专属解读 */}
                  {/* 核心特质 */}
                  <div className="p-5 sm:p-8 bg-gradient-to-br from-neutral-50 to-blue-50/30 rounded-xl sm:rounded-2xl border border-blue-200/30 shadow-soft mb-4 sm:mb-6">
                    <h3 className="font-bold text-neutral-900 mb-3 sm:mb-4 text-base sm:text-lg flex items-center gap-2">
                      <span className="text-xl sm:text-2xl">🎯</span>
                      核心特质
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                      {zootopiaMetadata.primaryResult.coreTrait || ZOOTOPIA_CORE_TRAITS[zootopiaMetadata.primaryResult.characterId as keyof typeof ZOOTOPIA_CORE_TRAITS] || ''}
                    </p>
                  </div>

                  {(() => {
                    const detailedTraits = zootopiaMetadata.primaryResult.detailedTraits ||
                      ZOOTOPIA_DETAILED_TRAITS[zootopiaMetadata.primaryResult.characterId as keyof typeof ZOOTOPIA_DETAILED_TRAITS];
                    return detailedTraits ? (
                      <>
                        {/* 性格优势 */}
                        <div className="p-5 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl sm:rounded-2xl border border-green-200/30 shadow-soft mb-4 sm:mb-6">
                          <h3 className="font-bold text-neutral-900 mb-4 sm:mb-6 text-base sm:text-lg flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">✨</span>
                            性格优势
                          </h3>
                          <div className="space-y-3 sm:space-y-4">
                            {detailedTraits.advantages.map((advantage: string, index: number) => (
                              <div key={index} className="flex items-start gap-3 sm:gap-4 group hover:translate-x-1 transition-transform">
                                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs sm:text-sm flex items-center justify-center font-bold shadow-soft group-hover:shadow-glow transition-shadow">
                                  {index + 1}
                                </span>
                                <span className="text-sm sm:text-base text-neutral-700 leading-relaxed flex-1 pt-0.5">
                                  {advantage}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 潜在风险 */}
                        <div className="p-5 sm:p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl border border-amber-200/30 shadow-soft">
                          <h3 className="font-bold text-neutral-900 mb-4 sm:mb-6 text-base sm:text-lg flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">⚠️</span>
                            潜在风险
                          </h3>
                          <div className="space-y-3 sm:space-y-4">
                            {detailedTraits.risks.map((risk: string, index: number) => (
                              <div key={index} className="flex items-start gap-3 sm:gap-4 group hover:translate-x-1 transition-transform">
                                <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xs sm:text-sm flex items-center justify-center font-bold shadow-soft group-hover:shadow-glow transition-shadow">
                                  {index + 1}
                                </span>
                                <span className="text-sm sm:text-base text-neutral-700 leading-relaxed flex-1 pt-0.5">
                                  {risk}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : null;
                  })()}
                </>
              ) : (
                <>
                  {/* 其他测评的原有解读 */}
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

                  {/* Workhorse 量表维度分析 */}
                  {scaleId === 'workhorse' && result.metadata?.dimensionEvaluations && (
                    <>
                      {/* 各维度详细评价 */}
                      <div className="space-y-4 sm:space-y-5">
                        <h3 className="font-bold text-neutral-900 text-base sm:text-lg flex items-center gap-2">
                          <span className="text-xl sm:text-2xl">🔍</span>
                          维度详细分析
                        </h3>
                        {result.metadata.dimensionEvaluations.map((dimEval: any, index: number) => {
                          // 根据等级确定颜色
                          const getLevelColor = (level: string) => {
                            if (level === '轻松' || level === '优秀' || level === '健康' || level === '广阔' || level === '良好') {
                              return 'text-green-600 bg-green-100 border-green-300';
                            } else if (level === '适中' || level === '良好' || level === '普通' || level === '有限' || level === '轻度疲惫') {
                              return 'text-amber-600 bg-amber-100 border-amber-300';
                            } else if (level === '较重' || level === '一般' || level === '压抑' || level === '狭窄' || level === '中度倦怠') {
                              return 'text-orange-600 bg-orange-100 border-orange-300';
                            } else {
                              return 'text-red-600 bg-red-100 border-red-300';
                            }
                          };

                          return (
                            <div key={dimEval.id} className="p-5 sm:p-6 bg-white/80 rounded-xl border border-neutral-200/50 shadow-soft hover:shadow-soft-lg transition-shadow">
                              {/* 维度标题和等级标签 */}
                              <div className="flex items-center justify-between mb-3 sm:mb-4">
                                <h4 className="font-bold text-neutral-900 text-base sm:text-lg">
                                  {dimEval.name}
                                </h4>
                                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-bold border ${getLevelColor(dimEval.level)}`}>
                                  {dimEval.level}
                                </span>
                              </div>

                              {/* 维度评价 */}
                              <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
                                {dimEval.description}
                              </p>

                              {/* 关键特征 */}
                              {dimEval.characteristics && dimEval.characteristics.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-xs sm:text-sm font-semibold text-neutral-600 mb-2">关键特征：</p>
                                  <div className="flex flex-wrap gap-2">
                                    {dimEval.characteristics.map((char: string, charIndex: number) => (
                                      <span key={charIndex} className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-md">
                                        {char}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* 改善建议 */}
                              {dimEval.suggestions && dimEval.suggestions.length > 0 && (
                                <div>
                                  <p className="text-xs sm:text-sm font-semibold text-neutral-600 mb-2">建议：</p>
                                  <ul className="space-y-1.5 text-sm text-neutral-700">
                                    {dimEval.suggestions.map((suggestion: string, sugIndex: number) => (
                                      <li key={sugIndex} className="flex items-start gap-2">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span className="flex-1">{suggestion}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* EQ 量表整体评价（综合三个维度） */}
                  {scaleId === 'eq' && scale.dimensions && (
                    <div className="p-5 sm:p-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl sm:rounded-2xl border border-purple-200/30 shadow-soft mt-4 sm:mt-6">
                      <h3 className="font-bold text-neutral-900 mb-4 sm:mb-6 text-base sm:text-lg flex items-center gap-2">
                        <span className="text-xl sm:text-2xl">🌟</span>
                        整体评价
                      </h3>
                      {(() => {
                        // EQ 量表的 dimensionScores 已经是百分比（0-100），直接使用
                        const cognitivePercentage = dimensionScores['cognitive_empathy'] || 0;
                        const emotionalPercentage = dimensionScores['emotional_empathy'] || 0;
                        const socialPercentage = dimensionScores['social_skills'] || 0;

                        // 判断各维度档次
                        const getDimensionLevel = (percentage: number) => {
                          if (percentage < 40) return '低';
                          if (percentage < 70) return '中';
                          return '高';
                        };

                        const cogLevel = getDimensionLevel(cognitivePercentage);
                        const emoLevel = getDimensionLevel(emotionalPercentage);
                        const socLevel = getDimensionLevel(socialPercentage);

                        // 生成综合评价
                        let overallAssessment = '';
                        const strongAreas: string[] = [];
                        const weakAreas: string[] = [];

                        if (cogLevel === '高') strongAreas.push('认知共情');
                        if (emoLevel === '高') strongAreas.push('情绪共情');
                        if (socLevel === '高') strongAreas.push('社交技能');

                        if (cogLevel === '低') weakAreas.push('认知共情');
                        if (emoLevel === '低') weakAreas.push('情绪共情');
                        if (socLevel === '低') weakAreas.push('社交技能');

                        if (strongAreas.length === 3) {
                          overallAssessment = '您在共情能力的三个维度上均表现优秀，具有全面而均衡的共情能力。您不仅能够理性地理解他人的想法和意图（认知共情），还能深刻地感受和共鸣他人的情绪（情绪共情），同时在社交场合中游刃有余（社交技能）。这种全面的共情能力使您在人际关系中占据优势，能够建立深厚而温暖的人际连接。';
                        } else if (strongAreas.length === 2) {
                          overallAssessment = `您在${strongAreas.join('和')}方面表现出色，显示出较强的共情潜力。建议在保持优势的同时，适当提升${weakAreas.length > 0 ? weakAreas.join('和') : '其他'}方面的能力，以实现更全面的共情能力发展。`;
                        } else if (strongAreas.length === 1) {
                          overallAssessment = `您在${strongAreas[0]}方面表现突出，这是您的优势所在。然而，共情能力是多维度的，建议您在${weakAreas.join('和')}等方面加强练习，以提升整体共情水平。均衡发展各个维度将帮助您更好地理解和回应他人，建立更深层的人际关系。`;
                        } else if (weakAreas.length === 3) {
                          overallAssessment = '您在共情能力的三个维度上均有较大的提升空间。共情能力是可以通过有意识的练习和学习来提升的。建议从基础的情绪识别和换位思考开始，逐步提升理解他人、感受他人和有效社交的能力。如果这影响了您的生活质量，建议寻求专业心理咨询的帮助。';
                        } else {
                          // 中等水平为主
                          const midAreas: string[] = [];
                          if (cogLevel === '中') midAreas.push('认知共情');
                          if (emoLevel === '中') midAreas.push('情绪共情');
                          if (socLevel === '中') midAreas.push('社交技能');

                          if (strongAreas.length > 0) {
                            overallAssessment = `您在${strongAreas.join('和')}方面表现优秀，而在${midAreas.join('和')}方面处于中等水平。继续保持您的优势领域，同时针对性地提升中等和较弱的维度，将使您的共情能力更加全面和成熟。`;
                          } else {
                            overallAssessment = `您的共情能力整体处于中等水平，在日常社交中基本能够理解和回应他人。通过有针对性的练习和学习，您有很大的提升空间。建议重点关注${weakAreas.length > 0 ? weakAreas.join('和') : midAreas.join('和')}等方面，以提升整体共情水平。`;
                          }
                        }

                        return (
                          <div className="space-y-4">
                            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                              {overallAssessment}
                            </p>

                            {/* 维度分布概览 */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
                              <div className="p-3 rounded-lg bg-white/60 border border-neutral-200/50 text-center">
                                <div className="text-xs text-neutral-600 mb-1">认知共情</div>
                                <div className={`text-lg sm:text-xl font-bold ${
                                  cogLevel === '高' ? 'text-green-600' :
                                  cogLevel === '中' ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                  {cogLevel}
                                </div>
                                <div className="text-xs text-neutral-500">{cognitivePercentage.toFixed(0)}%</div>
                              </div>
                              <div className="p-3 rounded-lg bg-white/60 border border-neutral-200/50 text-center">
                                <div className="text-xs text-neutral-600 mb-1">情绪共情</div>
                                <div className={`text-lg sm:text-xl font-bold ${
                                  emoLevel === '高' ? 'text-green-600' :
                                  emoLevel === '中' ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                  {emoLevel}
                                </div>
                                <div className="text-xs text-neutral-500">{emotionalPercentage.toFixed(0)}%</div>
                              </div>
                              <div className="p-3 rounded-lg bg-white/60 border border-neutral-200/50 text-center">
                                <div className="text-xs text-neutral-600 mb-1">社交技能</div>
                                <div className={`text-lg sm:text-xl font-bold ${
                                  socLevel === '高' ? 'text-green-600' :
                                  socLevel === '中' ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                  {socLevel}
                                </div>
                                <div className="text-xs text-neutral-500">{socialPercentage.toFixed(0)}%</div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </>
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

          {/* Radar Chart for Dimensions - ZHZ测评、Zootopia测评、PAT测评和Workhorse测评不显示雷达图 */}
          {!isZHZ && !isZootopia && !isPAT && scaleId !== 'workhorse' && scale.dimensions && scale.dimensions.length > 0 && (
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

                  // 对于 EQ、PAT、Workhorse 量表，dimensionScores 中已经是百分比，直接使用
                  // 其他量表需要归一化
                  let normalizedValue: number;
                  if ((scaleId === 'eq' || scaleId === 'pat' || scaleId === 'workhorse') && result.dimensionScores) {
                    normalizedValue = dimScore;
                  } else {
                    normalizedValue = normalizeDimensionScore(
                      dimScore,
                      dimension.questionIds.length,
                      scoreRange.min,
                      scoreRange.max
                    );
                  }

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

          {/* Dimension Scores - ZHZ量表、Zootopia量表和Workhorse量表在分享卡片中已有，其他量表使用传统进度条 */}
          {!isZHZ && !isZootopia && scaleId !== 'workhorse' && scale.dimensions && scale.dimensions.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-soft-lg p-5 sm:p-10 mb-6 sm:mb-8 border border-neutral-100/50 animate-slide-up animation-delay-200">
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-soft">
                  <span className="text-xl sm:text-2xl">📊</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">维度得分详情</h2>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {scale.dimensions.map((dimension, index): React.ReactElement => {
                  const dimScore = dimensionScores[dimension.id] || 0;

                  // 对于 EQ、PAT 量表，dimensionScores 中已经是百分比，直接使用
                  // 其他量表需要归一化
                  let dimPercentage: number;
                  if ((scaleId === 'eq' || scaleId === 'pat') && result.dimensionScores) {
                    dimPercentage = dimScore;
                  } else {
                    dimPercentage = normalizeDimensionScore(
                      dimScore,
                      dimension.questionIds.length,
                      scoreRange.min,
                      scoreRange.max
                    );
                  }

                  // 根据分数确定颜色和档次（针对 EQ 量表）
                  let barColor = 'from-green-500 to-emerald-600';
                  let bgColor = 'from-green-50 to-emerald-50';
                  let levelText = '高';
                  let levelDesc = '';

                  if (scaleId === 'eq') {
                    // EQ 量表特殊处理：0-39低、40-69中、70-100高
                    if (dimPercentage < 40) {
                      barColor = 'from-red-500 to-rose-600';
                      bgColor = 'from-red-50 to-rose-50';
                      levelText = '低';

                      if (dimension.id === 'cognitive_empathy') {
                        levelDesc = '对他人的思维和意图理解能力有限。容易误解他人行为或观点，换位思考困难。需要提升逻辑理解他人意图的能力。';
                      } else if (dimension.id === 'emotional_empathy') {
                        levelDesc = '情绪共鸣能力较弱，对他人情绪感知不足，难以表达同理或关怀。可能在社交关系中显得冷漠或疏离。';
                      } else if (dimension.id === 'social_skills') {
                        levelDesc = '社交能力有限，沟通不顺畅，难以处理复杂社交情境。需要训练基本社交技巧和互动规则。';
                      }
                    } else if (dimPercentage < 70) {
                      barColor = 'from-amber-500 to-orange-600';
                      bgColor = 'from-amber-50 to-orange-50';
                      levelText = '中';

                      if (dimension.id === 'cognitive_empathy') {
                        levelDesc = '能理解他人的心理状态和观点，但在复杂或压力情境下仍可能理解不准确。适合练习多角度思考和理性判断。';
                      } else if (dimension.id === 'emotional_empathy') {
                        levelDesc = '能感受到他人情绪，但在情绪吸收和共情上存在一定波动。可通过练习情绪识别和情绪表达增强共情力。';
                      } else if (dimension.id === 'social_skills') {
                        levelDesc = '社交能力一般，能应对常规人际交往，但在冲突或复杂社交场景下可能表现不佳。可通过练习沟通策略和社交礼仪提高。';
                      }
                    } else {
                      levelText = '高';

                      if (dimension.id === 'cognitive_empathy') {
                        levelDesc = '善于理解他人的思维和意图，能够准确把握他人的观点与心理状态。换位思考能力强，社交理解能力突出。';
                      } else if (dimension.id === 'emotional_empathy') {
                        levelDesc = '情绪敏感且易于共情，能够感受到他人情绪并适当回应。善于表达关怀，能够建立温暖的人际关系。';
                      } else if (dimension.id === 'social_skills') {
                        levelDesc = '社交能力强，能够灵活适应不同情境，有效沟通并建立良好的人际关系。能够自如处理冲突与合作。';
                      }
                    }
                  } else {
                    // 其他量表使用原有逻辑
                    if (dimPercentage >= 67) {
                      barColor = 'from-red-500 to-rose-600';
                      bgColor = 'from-red-50 to-rose-50';
                      levelText = '高风险';
                    } else if (dimPercentage >= 34) {
                      barColor = 'from-amber-500 to-orange-600';
                      bgColor = 'from-amber-50 to-orange-50';
                      levelText = '需关注';
                    } else {
                      levelText = '健康';
                    }
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
                      <div className="relative mb-4">
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

                      {/* 维度档次和详细描述（EQ 和 PAT 量表） */}
                      {scaleId === 'eq' && levelDesc && (
                        <div className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br ${bgColor} border border-neutral-200/30`}>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-bold rounded-lg bg-gradient-to-r ${barColor} text-white shadow-soft`}>
                              {levelText}
                            </span>
                            <span className="text-xs sm:text-sm font-semibold text-neutral-700">
                              {dimPercentage.toFixed(0)}分 / 100分
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                            {levelDesc}
                          </p>
                        </div>
                      )}

                      {/* PAT 量表维度详细解析 */}
                      {scaleId === 'pat' && 'scoreRanges' in dimension && dimension.scoreRanges && (
                        ((): React.ReactNode => {
                          // 找到对应的分数段
                          const scoreRange = dimension.scoreRanges!.find(
                            range => dimPercentage >= range.min && dimPercentage <= range.max
                          );

                          if (!scoreRange) return null;

                          // 根据分数确定颜色
                          let patBarColor = 'from-green-500 to-emerald-600';
                          let patBgColor = 'from-green-50 to-emerald-50';

                          if (dimPercentage < 36) {
                            patBarColor = 'from-red-500 to-rose-600';
                            patBgColor = 'from-red-50 to-rose-50';
                          } else if (dimPercentage < 61) {
                            patBarColor = 'from-amber-500 to-orange-600';
                            patBgColor = 'from-amber-50 to-orange-50';
                          } else if (dimPercentage < 81) {
                            patBarColor = 'from-blue-500 to-indigo-600';
                            patBgColor = 'from-blue-50 to-indigo-50';
                          }

                          return (
                            <div className={`p-3 sm:p-5 rounded-xl bg-gradient-to-br ${patBgColor} border border-neutral-200/30 space-y-3 sm:space-y-4`}>
                              {/* 档次标签 */}
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2 sm:px-3 py-1 text-xs font-bold rounded-lg bg-gradient-to-r ${patBarColor} text-white shadow-soft`}>
                                  {scoreRange.level}
                                </span>
                                <span className="text-xs sm:text-sm font-semibold text-neutral-700">
                                  {dimPercentage.toFixed(0)}分 / 100分
                                </span>
                              </div>

                              {/* 维度描述 */}
                              {dimension.fullDescription && (
                                <div className="p-3 rounded-lg bg-white/60 border border-neutral-200/20">
                                  <p className="text-xs text-neutral-600 font-medium mb-1">💡 维度说明</p>
                                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                                    {dimension.fullDescription}
                                  </p>
                                </div>
                              )}

                              {/* 分数段描述 */}
                              <div>
                                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                                  {scoreRange.description}
                                </p>
                              </div>

                              {/* 关键指标 */}
                              {dimension.keyIndicators && dimension.keyIndicators.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-neutral-700 mb-2">🎯 关键指标</p>
                                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {dimension.keyIndicators.map((indicator, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 text-[10px] sm:text-xs bg-white/70 text-neutral-600 rounded-md border border-neutral-200/30"
                                      >
                                        {indicator}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* 表现特征 */}
                              {scoreRange.characteristics && scoreRange.characteristics.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-neutral-700 mb-2">📋 表现特征</p>
                                  <ul className="space-y-1.5">
                                    {scoreRange.characteristics.map((char, idx) => (
                                      <li key={idx} className="text-xs sm:text-sm text-neutral-700 flex items-start gap-2">
                                        <span className="text-neutral-400 mt-0.5">•</span>
                                        <span className="flex-1">{char}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* 提升建议 */}
                              {scoreRange.suggestions && scoreRange.suggestions.length > 0 && (
                                <div>
                                  <p className="text-xs font-semibold text-neutral-700 mb-2">💪 提升建议</p>
                                  <ul className="space-y-1.5">
                                    {scoreRange.suggestions.map((suggestion, idx) => (
                                      <li key={idx} className="text-xs sm:text-sm text-neutral-700 flex items-start gap-2">
                                        <span className="text-emerald-500 mt-0.5">✓</span>
                                        <span className="flex-1">{suggestion}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })()
                      )}
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
