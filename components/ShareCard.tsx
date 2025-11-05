'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { QRCodeSVG } from 'qrcode.react';
import type { RadarDataPoint } from './DimensionRadarChart';

// 动态导入雷达图组件
const DimensionRadarChart = dynamic(
  () => import('./DimensionRadarChart'),
  { ssr: false }
);

interface ShareCardProps {
  scaleTitle: string;
  score: number;
  level: string;
  levelColor: string;
  description: string;
  completedAt: string;
  percentile?: number | null;
  radarData?: RadarDataPoint[];
}

export default function ShareCard({
  scaleTitle,
  score,
  level,
  levelColor,
  description,
  completedAt,
  percentile,
  radarData,
}: ShareCardProps) {
  // 根据levelColor生成统一的配色方案
  const getColorScheme = (color: string) => {
    const normalizedColor = color.toLowerCase();

    // 绿色系 - 健康/良好
    if (normalizedColor.includes('#10b981') || normalizedColor.includes('#22c55e') || normalizedColor.includes('green')) {
      return {
        gradient: 'from-green-500 via-emerald-500 to-teal-500',
        glow: 'from-green-500/20 via-emerald-500/20 to-teal-500/20',
        stripe: 'from-green-500 via-emerald-500 to-teal-500'
      };
    }

    // 橙色系 - 中等/需关注
    if (normalizedColor.includes('#f59e0b') || normalizedColor.includes('#f97316') || normalizedColor.includes('orange') || normalizedColor.includes('amber')) {
      return {
        gradient: 'from-amber-500 via-orange-500 to-orange-600',
        glow: 'from-amber-500/20 via-orange-500/20 to-orange-600/20',
        stripe: 'from-amber-500 via-orange-500 to-orange-600'
      };
    }

    // 红色系 - 高风险/严重
    if (normalizedColor.includes('#ef4444') || normalizedColor.includes('#dc2626') || normalizedColor.includes('red')) {
      return {
        gradient: 'from-red-500 via-rose-500 to-pink-600',
        glow: 'from-red-500/20 via-rose-500/20 to-pink-600/20',
        stripe: 'from-red-500 via-rose-500 to-pink-600'
      };
    }

    // 默认使用实际的levelColor创建单色方案
    return {
      gradient: 'from-primary via-purple-500 to-indigo-600',
      glow: 'from-primary/20 via-purple-500/20 to-indigo-600/20',
      stripe: 'from-primary via-purple-500 to-indigo-600'
    };
  };

  const colorScheme = getColorScheme(levelColor);

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8 animate-slide-up">
      {/* 装饰性背景光晕 - 使用动态颜色 */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${colorScheme.glow} rounded-3xl blur-2xl`}></div>

      {/* 主卡片 */}
      <div className="relative bg-white rounded-3xl shadow-soft-xl overflow-hidden border border-neutral-100">
        {/* 顶部装饰性渐变条 - 使用动态颜色 */}
        <div className={`h-2 bg-gradient-to-r ${colorScheme.stripe}`}></div>

        {/* 背景装饰图案 */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,39.9,76.8C26,84.6,9.2,87.6,-6.5,86.8C-22.2,86,-37.8,81.4,-51.2,73.4C-64.6,65.4,-75.8,54,-82.6,40.2C-89.4,26.4,-91.8,10.2,-90.1,-5.3C-88.4,-20.8,-82.6,-35.6,-73.8,-48.2C-65,-60.8,-53.2,-71.2,-39.7,-78.6C-26.2,-86,-13.1,-90.4,1.3,-92.5C15.7,-94.6,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="relative p-10">
          {/* Logo和标题 */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/knowyourself_logo.png"
                alt="KnowYourself"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <div className="font-bold text-xl gradient-text">KnowYourself</div>
                <div className="text-xs text-neutral-500 font-light">专业心理测评</div>
              </div>
            </div>
            <div className="text-xs text-neutral-400 font-light">
              {new Date(completedAt).toLocaleDateString('zh-CN')}
            </div>
          </div>

          {/* 量表标题 */}
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">{scaleTitle}</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* 分数展示区 - 核心视觉元素 */}
          <div className="relative mb-8">
            {/* 装饰性背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 rounded-3xl -z-10"></div>

            <div className="py-10 px-8">
              {/* 分数圆环 */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* 外层装饰环 - 使用动态颜色 */}
                  <div className={`absolute -inset-2 sm:-inset-4 bg-gradient-to-br ${colorScheme.glow} rounded-full blur-xl animate-pulse`}></div>

                  {/* 主圆环 - 使用动态颜色 */}
                  <div className={`relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-br ${colorScheme.gradient} p-1 shadow-glow-lg`}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-5xl sm:text-6xl font-black bg-gradient-to-br ${colorScheme.gradient} bg-clip-text text-transparent`}>
                          {score}
                        </div>
                        <div className="text-sm text-neutral-500 font-medium mt-1">分</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 等级标签 */}
              <div className="text-center mb-6">
                <div
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xl shadow-soft"
                  style={{
                    backgroundColor: `${levelColor}15`,
                    color: levelColor,
                    border: `2px solid ${levelColor}30`
                  }}
                >
                  <span className="text-2xl">✨</span>
                  {level}
                </div>
              </div>

              {/* 百分位信息 */}
              {percentile !== null && percentile !== undefined && (
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-neutral-100">
                    <span className="text-lg">📊</span>
                    <span className="text-sm text-neutral-600">
                      超过 <span className="font-bold text-primary text-lg">{percentile}%</span> 的测评者
                    </span>
                  </div>
                </div>
              )}

              {/* 简短解读 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-soft border border-neutral-100 mb-6">
                <p className="text-neutral-700 leading-relaxed text-center text-sm line-clamp-3">
                  {description}
                </p>
              </div>

              {/* 雷达图 - 维度分析 */}
              {radarData && radarData.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-soft border border-neutral-100">
                  <h3 className="text-center text-base font-bold text-neutral-900 mb-2">维度分析</h3>
                  <DimensionRadarChart data={radarData} showLegend={false} compact={true} />
                </div>
              )}
            </div>
          </div>

          {/* 底部装饰和CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-100">
            <div className="text-xs text-neutral-400 text-center sm:text-left">
              扫码了解更多心理测评
            </div>
            <div className="flex items-center gap-3">
              {/* 真实的二维码 */}
              <div className="w-16 h-16 p-2 bg-white rounded-lg shadow-soft border border-neutral-200">
                <QRCodeSVG
                  value="https://knowyourself.cc"
                  size={48}
                  level="M"
                  includeMargin={false}
                  className="w-full h-full"
                />
              </div>
              <div className="text-xs text-neutral-500">
                <div className="font-semibold text-neutral-900">KnowYourself</div>
                <div className="text-[10px] leading-tight text-neutral-400">knowyourself.cc</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 提示文字 */}
      <div className="text-center mt-4">
        <p className="text-sm text-neutral-500">
          💡 截图此卡片可分享至社交平台
        </p>
      </div>
    </div>
  );
}
