'use client';

import { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import DivergingBarChartSimple from './DivergingBarChartSimple';
import type { DivergingBarDataPoint } from './DivergingBarChartSimple';
import type { RadarDataPoint } from './DimensionRadarChart';

interface ZootopiaCharacter {
  id: string;
  name: string;
  similarity: number;
  imagePath: string;
  coreTrait: string;
}

interface ZootopiaShareCardProps {
  scaleTitle: string;
  mainCharacter: ZootopiaCharacter;
  otherCharacters?: ZootopiaCharacter[]; // 其他相似角色（最多2个）
  completedAt: string;
  radarData?: RadarDataPoint[];
  coreKeywords?: string[]; // 核心关键词（最多3个）
}

// 维度标签映射（用于双极条形图）- 与zootopia.ts中的ZOOTOPIA_DIMENSION_LABELS保持一致
const dimensionLabels: Record<string, { left: string; right: string }> = {
  '行动速度': { left: '慢条斯理', right: '高速执行' },
  '秩序偏好': { left: '随性灵活', right: '自律严谨' },
  '真诚指数': { left: '策略圆滑', right: '坦率透明' },
  '外向呈现': { left: '内向克制', right: '外向张扬' },
};

function getLabelForDimension(dimension: string, side: 'left' | 'right'): string {
  return dimensionLabels[dimension]?.[side] || (side === 'left' ? '低' : '高');
}

const ZootopiaShareCard = forwardRef<HTMLDivElement, ZootopiaShareCardProps>(function ZootopiaShareCard({
  scaleTitle,
  mainCharacter,
  otherCharacters = [],
  completedAt,
  radarData,
  coreKeywords = [],
}, ref) {
  // 疯狂动物城配色方案 - 鲜艳活泼
  const zootopiaColorScheme = {
    gradient: 'from-green-500 via-blue-500 to-purple-500',
    glowLight: 'from-green-500/30 via-blue-500/30 to-purple-500/30',
    glowHeavy: 'from-green-600/40 via-blue-600/40 to-purple-600/40',
    bgGradient: 'from-green-50 via-blue-50 to-purple-50'
  };

  return (
    <div ref={ref} className="relative mx-auto mb-6 animate-slide-up" style={{ width: '1200px', maxWidth: '100%' }}>
      {/* 主卡片 */}
      <div className="relative bg-white rounded-3xl shadow-soft-xl overflow-hidden border-2 border-blue-200/50">
        {/* 顶部装饰性渐变条 */}
        <div className={`h-3 bg-gradient-to-r ${zootopiaColorScheme.gradient}`}></div>

        {/* 背景装饰图案 */}
        <div className="absolute inset-0 opacity-5 no-export">
          {/* 动物城市装饰 */}
          <svg className="absolute top-10 right-10 w-48 h-48" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,39.9,76.8C26,84.6,9.2,87.6,-6.5,86.8C-22.2,86,-37.8,81.4,-51.2,73.4C-64.6,65.4,-75.8,54,-82.6,40.2C-89.4,26.4,-91.8,10.2,-90.1,-5.3C-88.4,-20.8,-82.6,-35.6,-73.8,-48.2C-65,-60.8,-53.2,-71.2,-39.7,-78.6C-26.2,-86,-13.1,-90.4,1.3,-92.5C15.7,-94.6,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
          <svg className="absolute bottom-10 left-10 w-48 h-48 rotate-180" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,39.9,76.8C26,84.6,9.2,87.6,-6.5,86.8C-22.2,86,-37.8,81.4,-51.2,73.4C-64.6,65.4,-75.8,54,-82.6,40.2C-89.4,26.4,-91.8,10.2,-90.1,-5.3C-88.4,-20.8,-82.6,-35.6,-73.8,-48.2C-65,-60.8,-53.2,-71.2,-39.7,-78.6C-26.2,-86,-13.1,-90.4,1.3,-92.5C15.7,-94.6,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        <div className="relative" style={{ padding: '8px' }}>
          {/* Logo和标题 */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/knowyourself_logo.png"
                alt="KnowYourself"
                width={40}
                height={40}
                className="object-contain"
                crossOrigin="anonymous"
              />
              <div>
                <div className="font-bold text-xl text-green-600">KnowYourself</div>
                <div className="text-xs text-neutral-500 font-light">专业心理测评</div>
              </div>
            </div>
            <div className="text-xs text-neutral-400 font-light">
              {new Date(completedAt).toLocaleDateString('zh-CN')}
            </div>
          </div>

          {/* 量表标题 */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-neutral-900 mb-3">{scaleTitle}</h2>
            <div className={`h-1.5 w-24 bg-gradient-to-r ${zootopiaColorScheme.gradient} mx-auto rounded-full`}></div>
          </div>

          {/* 主角色展示区 - 核心视觉元素 */}
          <div className={`relative bg-gradient-to-br ${zootopiaColorScheme.bgGradient} rounded-3xl overflow-hidden mb-8`} style={{ padding: '16px' }}>
            {/* 装饰边框 */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className={`absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-blue-300/50 rounded-tl-3xl`}></div>
              <div className={`absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-blue-300/50 rounded-tr-3xl`}></div>
              <div className={`absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-blue-300/50 rounded-bl-3xl`}></div>
              <div className={`absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-blue-300/50 rounded-br-3xl`}></div>
            </div>

            <div className="flex flex-col items-center relative z-10">
              {/* 角色图片 + 相似度徽章 */}
              <div className="relative mb-6">
                {/* 角色图片 */}
                <div className="relative rounded-2xl overflow-hidden shadow-glow-lg bg-gradient-to-br from-blue-100 via-green-100 to-purple-100" style={{
                  width: '160px',
                  height: '160px',
                  border: '4px solid white',
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.25)'
                }}>
                  <img
                    src={mainCharacter.imagePath}
                    alt={mainCharacter.name}
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/characters/placeholder.svg';
                    }}
                  />
                </div>

                {/* 相似度徽章 - 右上角 */}
                <div className={`absolute -top-3 -right-3 bg-gradient-to-br ${zootopiaColorScheme.gradient} text-white rounded-xl shadow-glow-lg px-4 py-2`}>
                  <div className="text-center">
                    <div className="text-2xl font-black leading-none">{mainCharacter.similarity}%</div>
                    <div className="text-xs font-bold mt-0.5">相似度</div>
                  </div>
                </div>
              </div>

              {/* 角色名称 */}
              <div className="text-center mb-6">
                <h3 className="text-5xl font-black text-blue-600 mb-3">
                  {mainCharacter.name}
                </h3>
              </div>

              {/* 核心特质描述 */}
              <div className="bg-white rounded-2xl shadow-soft border border-blue-200/50 mb-6" style={{
                padding: '18px 16px',
                maxWidth: '100%',
                width: '100%'
              }}>
                <div className="text-base text-neutral-700 leading-relaxed text-left">
                  {mainCharacter.coreTrait}
                </div>
              </div>

              {/* 核心关键词标签 */}
              {coreKeywords && coreKeywords.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center mb-6">
                  {coreKeywords.map((keyword, index) => (
                    <div
                      key={index}
                      className={`px-5 py-2.5 bg-gradient-to-r ${zootopiaColorScheme.gradient} text-white rounded-full font-bold shadow-soft text-sm`}
                    >
                      {keyword}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 内容区域：双极条形图 + 其他角色 - 改为上下排列 */}
          <div className="flex flex-col gap-6 mb-8">
            {/* 人格维度双极条形图 */}
            {radarData && radarData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-soft border border-neutral-100" style={{ padding: '20px 16px' }}>
                <h3 className="text-center font-black text-neutral-900 mb-6 text-lg flex items-center justify-center gap-2">
                  <span>📊</span>
                  人格维度分析
                </h3>
                <div style={{ width: '100%', minHeight: '320px' }}>
                  <DivergingBarChartSimple
                    data={radarData.map((point) => ({
                      dimension: point.dimension,
                      value: point.value,
                      leftLabel: getLabelForDimension(point.dimension, 'left'),
                      rightLabel: getLabelForDimension(point.dimension, 'right')
                    }))}
                    compact={true}
                  />
                </div>
              </div>
            )}

            {/* 其他相似角色 */}
            {otherCharacters && otherCharacters.length > 0 && (
              <div className="bg-white rounded-2xl shadow-soft border border-neutral-100" style={{ padding: '24px 16px' }}>
                <h3 className="text-center font-black text-neutral-900 mb-4 text-lg flex items-center justify-center gap-2">
                  <span>🎭</span>
                  其他相似角色
                </h3>
                <div className="space-y-4">
                  {otherCharacters.slice(0, 2).map((char, index) => (
                    <div
                      key={char.id}
                      className={`relative flex items-center gap-4 p-4 bg-gradient-to-br ${zootopiaColorScheme.bgGradient} rounded-xl border border-blue-200/30 shadow-soft hover:shadow-soft-lg transition-all`}
                    >
                      {/* 排名徽章 */}
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-blue-400 to-green-500 text-white rounded-full flex items-center justify-center font-black text-sm shadow-soft">
                        {index + 2}
                      </div>

                      {/* 角色小图 */}
                      <div className="flex-shrink-0 relative rounded-xl overflow-hidden shadow-soft border-2 border-white" style={{ width: '80px', height: '80px' }}>
                        <img
                          src={char.imagePath}
                          alt={char.name}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                          crossOrigin="anonymous"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/zootopia/placeholder.svg';
                          }}
                        />
                      </div>

                      {/* 角色信息 */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-neutral-900 mb-1 text-lg">{char.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-neutral-600">相似度</span>
                          <span className="text-xl font-black text-blue-600">
                            {char.similarity}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 底部装饰和CTA */}
          <div className="flex items-center justify-between border-t-2 border-blue-200/30" style={{ paddingTop: '12px', gap: '12px' }}>
            <div className="text-sm text-neutral-500 flex items-center gap-2">
              <span className="text-lg">✨</span>
              扫码探索更多有趣测评
            </div>
            <div className="flex items-center gap-4">
              {/* 真实的二维码 */}
              <div className="bg-white rounded-xl shadow-soft border-2 border-blue-200/50" style={{ width: '72px', height: '72px', padding: '8px' }}>
                <QRCodeSVG
                  value="https://knowyourself.com.cn"
                  size={56}
                  level="M"
                  includeMargin={false}
                  className="w-full h-full"
                />
              </div>
              <div className="text-sm">
                <div className="font-black text-neutral-900 text-lg text-blue-600">
                  KnowYourself
                </div>
                <div className="leading-tight text-neutral-400 text-xs">
                  knowyourself.com.cn
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ZootopiaShareCard.displayName = 'ZootopiaShareCard';

export default ZootopiaShareCard;
