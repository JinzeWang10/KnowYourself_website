"use client";

import React from 'react';

export interface DivergingBarDataPoint {
  dimension: string;
  value: number;
  leftLabel: string;
  rightLabel: string;
}

interface DivergingBarChartSimpleProps {
  data: DivergingBarDataPoint[];
  compact?: boolean;
}

/**
 * 简化版双极条形图（用于分享卡片）
 * - 无动画效果
 * - 紧凑布局
 * - 适合图片导出
 */
export default function DivergingBarChartSimple({ data, compact = false }: DivergingBarChartSimpleProps) {
  const getBarColor = (value: number) => {
    if (value < 40) {
      return 'from-blue-500 to-indigo-600';
    } else if (value > 60) {
      return 'from-purple-500 to-pink-600';
    } else {
      return 'from-teal-500 to-cyan-600';
    }
  };

  const getBarStyle = (value: number) => {
    const center = 50;
    const offset = value - center;
    const absOffset = Math.abs(offset);

    if (offset < 0) {
      return {
        left: `${center - absOffset}%`,
        width: `${absOffset}%`,
      };
    } else {
      return {
        left: `${center}%`,
        width: `${absOffset}%`,
      };
    }
  };

  return (
    <div className="w-full" style={{ minHeight: '200px', minWidth: '200px' }}>
      <div className={compact ? 'space-y-3' : 'space-y-4'}>
        {data.map((item, index) => {
          const barColor = getBarColor(item.value);
          const barStyle = getBarStyle(item.value);
          const isLeft = item.value < 50;

          return (
            <div key={index}>
              {/* 维度名称 */}
              <div className="text-center mb-1.5">
                <h4 className={`font-bold text-neutral-900 ${compact ? 'text-xs' : 'text-sm'}`}>
                  {item.dimension}
                </h4>
              </div>

              {/* 双极标签 */}
              <div className={`flex items-center justify-between ${compact ? 'text-[10px]' : 'text-xs'} text-neutral-600 mb-1 px-0.5`}>
                <span className={`font-medium ${isLeft ? 'text-blue-600 font-bold' : ''}`}>
                  {item.leftLabel}
                </span>
                <span className={`font-medium ${!isLeft && item.value !== 50 ? 'text-purple-600 font-bold' : ''}`}>
                  {item.rightLabel}
                </span>
              </div>

              {/* 条形图容器 */}
              <div
                className={`relative ${compact ? 'h-8' : 'h-10'} rounded-full overflow-hidden border border-neutral-200`}
                style={{
                  backgroundColor: '#f5f5f5',
                  minHeight: compact ? '32px' : '40px'
                }}
              >
                {/* 中心分割线 */}
                <div
                  className="absolute top-0 bottom-0 z-10"
                  style={{
                    left: '50%',
                    width: '2px',
                    backgroundColor: '#d4d4d4',
                    height: '100%'
                  }}
                ></div>

                {/* 进度条 - 纯色版本，避免渐变 */}
                <div
                  className="absolute top-0 bottom-0 z-0"
                  style={{
                    ...barStyle,
                    backgroundColor: isLeft ? '#3b82f6' : '#a855f7',
                    height: '100%'
                  }}
                ></div>

                {/* 数值指示器 */}
                <div
                  className="absolute z-20"
                  style={{
                    left: `${item.value}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div
                    className={`${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} rounded-lg text-white font-bold ${compact ? 'text-[10px]' : 'text-xs'} whitespace-nowrap`}
                    style={{
                      backgroundColor: isLeft ? '#3b82f6' : '#a855f7',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {Math.round(item.value)}%
                  </div>
                </div>
              </div>

              {/* 刻度标记 */}
              {!compact && (
                <div className="flex justify-between text-[9px] text-neutral-400 mt-1 px-0.5">
                  <span>0</span>
                  <span className="font-bold text-neutral-500">50</span>
                  <span>100</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
