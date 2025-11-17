'use client';

import { forwardRef } from 'react';
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
  isZHZ?: boolean; // ZHZ 量表特殊标记
  isPAT?: boolean; // PAT 量表特殊标记
  patMetadata?: {
    actualAge: number;
    psychologicalAge: number;
    ageDifference: number;
  };
}

const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(function ShareCard({
  scaleTitle,
  score,
  level,
  levelColor,
  description,
  completedAt,
  percentile,
  radarData,
  isZHZ = false,
  isPAT = false,
  patMetadata,
}, ref) {
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
    <div ref={ref} className="relative mx-auto mb-6 animate-slide-up" style={{ width: '1800px', maxWidth: '100%' }}>
      {/* 装饰性背景光晕 - 使用动态颜色 */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${colorScheme.glow} rounded-3xl blur-2xl`}></div>

      {/* 主卡片 */}
      <div className="relative bg-white rounded-3xl shadow-soft-xl overflow-hidden border border-neutral-100/50">
        {/* 顶部装饰性渐变条 - 使用动态颜色 */}
        <div className={`h-2 bg-gradient-to-r ${colorScheme.stripe}`}></div>

        {/* 背景装饰图案 */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,39.9,76.8C26,84.6,9.2,87.6,-6.5,86.8C-22.2,86,-37.8,81.4,-51.2,73.4C-64.6,65.4,-75.8,54,-82.6,40.2C-89.4,26.4,-91.8,10.2,-90.1,-5.3C-88.4,-20.8,-82.6,-35.6,-73.8,-48.2C-65,-60.8,-53.2,-71.2,-39.7,-78.6C-26.2,-86,-13.1,-90.4,1.3,-92.5C15.7,-94.6,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="relative" style={{ padding: '0px' }}>
          {/* Logo和标题 */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
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
            <h2 className="text-2xl font-bold text-neutral-900 mb-3 px-2">{scaleTitle}</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-purple-500 mx-auto rounded-full"></div>
          </div>

          {/* 分数展示区 - 核心视觉元素 */}
          <div className="relative mb-8">
            {/* 装饰性背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 rounded-3xl -z-10"></div>

            <div style={{ padding: '0px 0px', width: '100%' }}>
              {/* 分数圆环 */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* 外层装饰环 - 使用动态颜色 */}
                  <div className={`absolute bg-gradient-to-br ${colorScheme.glow} rounded-full blur-xl animate-pulse`} style={{ inset: '-16px' }}></div>

                  {/* 主圆环 - 使用动态颜色 */}
                  <div className={`relative rounded-full bg-gradient-to-br ${colorScheme.gradient} shadow-glow-lg`} style={{ width: '176px', height: '176px', padding: '4px' }}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <div className="text-center">
                        <div className={`font-black bg-gradient-to-br ${colorScheme.gradient} bg-clip-text text-transparent`} style={{ fontSize: '64px', lineHeight: '1' }}>
                          {score}
                        </div>
                        <div className="text-sm text-neutral-500 font-medium mt-2">{isZHZ ? '%' : '分'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 等级标签 */}
              <div className="text-center mb-6">
                <div
                  className="inline-flex items-center gap-2 rounded-full font-bold shadow-soft"
                  style={{
                    backgroundColor: `${levelColor}15`,
                    color: levelColor,
                    border: `2px solid ${levelColor}30`,
                    padding: '12px 24px',
                    fontSize: '20px'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>✨</span>
                  {level}
                </div>
              </div>

              {/* 百分位信息 */}
              {percentile !== null && percentile !== undefined && (
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full shadow-soft border border-neutral-100" style={{ padding: '8px 20px' }}>
                    <span style={{ fontSize: '18px' }}>📊</span>
                    <span className="text-sm text-neutral-600">
                      超过 <span className="font-bold text-primary" style={{ fontSize: '18px' }}>{percentile}%</span> 的测评者
                    </span>
                  </div>
                </div>
              )}

              {/* PAT心理年龄展示 */}
              {isPAT && patMetadata && (
                <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl shadow-soft mb-6 text-white" style={{ padding: '20px' }}>
                  <div className="text-center mb-3">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full" style={{ padding: '6px 16px' }}>
                      <span style={{ fontSize: '16px' }}>🎂</span>
                      <span style={{ fontSize: '12px', fontWeight: '600' }}>心理年龄</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center">
                      <div style={{ fontSize: '10px', opacity: 0.9, marginBottom: '4px' }}>实际年龄</div>
                      <div style={{ fontSize: '32px', fontWeight: '900' }}>{patMetadata.actualAge}</div>
                      <div style={{ fontSize: '10px', opacity: 0.75 }}>岁</div>
                    </div>

                    <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>

                    <div className="text-center">
                      <div style={{ fontSize: '10px', opacity: 0.9, marginBottom: '4px' }}>心理年龄</div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl shadow-glow" style={{ fontSize: '32px', fontWeight: '900', padding: '8px 16px' }}>
                        {patMetadata.psychologicalAge}
                      </div>
                      <div style={{ fontSize: '10px', opacity: 0.75 }}>岁</div>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg" style={{ padding: '6px 12px' }}>
                      {patMetadata.ageDifference > 0 ? (
                        <>
                          <span style={{ fontSize: '14px' }}>📈</span>
                          <span style={{ fontSize: '11px', fontWeight: '500' }}>
                            比实际年龄大 {patMetadata.ageDifference} 岁
                          </span>
                        </>
                      ) : patMetadata.ageDifference < 0 ? (
                        <>
                          <span style={{ fontSize: '14px' }}>📉</span>
                          <span style={{ fontSize: '11px', fontWeight: '500' }}>
                            比实际年龄小 {Math.abs(patMetadata.ageDifference)} 岁
                          </span>
                        </>
                      ) : (
                        <>
                          <span style={{ fontSize: '14px' }}>✨</span>
                          <span style={{ fontSize: '11px', fontWeight: '500' }}>与实际年龄相符</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 简短解读 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-neutral-100 mb-6" style={{ padding: '10px 4px' }}>
                <div className={`text-neutral-700 leading-relaxed ${isZHZ ? 'text-left' : 'text-center'} whitespace-pre-wrap`} style={{
                  lineHeight: '1.6',
                  fontSize: '12px',
                  maxHeight: '200px',
                  overflow: 'hidden'
                }}>
                  {/* 对于 ZHZ，只显示前几行 */}
                  {isZHZ ? (
                    description.split('\n').slice(0, 4).map((line, i) => (
                      <div key={i}>{line || '\u00A0'}</div>
                    ))
                  ) : (
                    description.length > 200 ? description.substring(0, 197) + '...' : description
                  )}
                </div>
              </div>

              {/* 雷达图 - 维度分析 */}
              {radarData && radarData.length > 0 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-soft border border-neutral-100" style={{ padding: '10px 4px' }}>
                  <h3 className="text-center font-bold text-neutral-900 mb-3" style={{ fontSize: '14px' }}>维度分析</h3>
                  <div style={{ width: '100%', height: '300px' }}>
                    <DimensionRadarChart data={radarData} showLegend={false} compact={true} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 底部装饰和CTA */}
          <div className="flex items-center justify-between border-t border-neutral-100" style={{ paddingTop: '24px', gap: '16px' }}>
            <div className="text-xs text-neutral-400">
              扫码了解更多心理测评
            </div>
            <div className="flex items-center gap-3">
              {/* 真实的二维码 */}
              <div className="bg-white rounded-lg shadow-soft border border-neutral-200" style={{ width: '64px', height: '64px', padding: '8px' }}>
                <QRCodeSVG
                  value="https://knowyourself.com.cn"
                  size={48}
                  level="M"
                  includeMargin={false}
                  className="w-full h-full"
                />
              </div>
              <div className="text-xs text-neutral-500">
                <div className="font-semibold text-neutral-900 text-sm">KnowYourself</div>
                <div className="leading-tight text-neutral-400" style={{ fontSize: '10px' }}>knowyourself.com.cn</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ShareCard.displayName = 'ShareCard';

export default ShareCard;
