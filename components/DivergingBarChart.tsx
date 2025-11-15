"use client";

import React from 'react';

export interface DivergingBarDataPoint {
  dimension: string;          // 维度名称
  value: number;              // 0-100 的值
  leftLabel: string;          // 左侧标签（低值描述）
  rightLabel: string;         // 右侧标签（高值描述）
  description?: string;       // 可选的维度描述
}

interface DivergingBarChartProps {
  data: DivergingBarDataPoint[];
  height?: number;
}

export default function DivergingBarChart({ data, height = 400 }: DivergingBarChartProps) {
  // 计算每个条形的颜色（基于值的位置）
  const getBarColor = (value: number) => {
    // 使用渐变色，中间区域（40-60）为中性色
    if (value < 40) {
      return 'from-blue-500 to-indigo-600';
    } else if (value > 60) {
      return 'from-purple-500 to-pink-600';
    } else {
      return 'from-teal-500 to-cyan-600';
    }
  };

  // 计算条形从中点偏移的距离和方向
  const getBarStyle = (value: number) => {
    const center = 50;
    const offset = value - center;
    const absOffset = Math.abs(offset);

    if (offset < 0) {
      // 左侧
      return {
        left: `${center - absOffset}%`,
        width: `${absOffset}%`,
      };
    } else {
      // 右侧
      return {
        left: `${center}%`,
        width: `${absOffset}%`,
      };
    }
  };

  return (
    <div className="w-full" style={{ minHeight: height }}>
      <div className="space-y-8">
        {data.map((item, index) => {
          const barColor = getBarColor(item.value);
          const barStyle = getBarStyle(item.value);
          const isLeft = item.value < 50;

          return (
            <div
              key={index}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* 维度名称 */}
              <div className="text-center mb-3">
                <h4 className="font-bold text-neutral-900 text-sm sm:text-base">
                  {item.dimension}
                </h4>
                {item.description && (
                  <p className="text-xs text-neutral-500 mt-1">
                    {item.description}
                  </p>
                )}
              </div>

              {/* 双极标签 */}
              <div className="flex items-center justify-between text-xs sm:text-sm text-neutral-600 mb-2 px-1">
                <span className={`font-medium ${isLeft ? 'text-blue-600 font-bold' : ''}`}>
                  {item.leftLabel}
                </span>
                <span className={`font-medium ${!isLeft && item.value !== 50 ? 'text-purple-600 font-bold' : ''}`}>
                  {item.rightLabel}
                </span>
              </div>

              {/* 条形图容器 */}
              <div className="relative h-12 bg-gradient-to-r from-blue-50 via-neutral-50 to-purple-50 rounded-full overflow-hidden border border-neutral-200/50 shadow-inner">
                {/* 中心分割线 */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-neutral-300 z-10"></div>

                {/* 进度条 */}
                <div
                  className={`absolute top-0 bottom-0 bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out z-0 hover:brightness-110`}
                  style={barStyle}
                >
                  {/* 高光效果 */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
                  {/* 动画光波 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>

                {/* 数值指示器 */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-1000 ease-out"
                  style={{ left: `${item.value}%`, transform: 'translate(-50%, -50%)' }}
                >
                  <div className={`relative px-3 py-1.5 rounded-lg bg-gradient-to-r ${barColor} text-white font-bold text-xs sm:text-sm shadow-lg whitespace-nowrap`}>
                    {Math.round(item.value)}%
                    {/* 小三角形指向条形 */}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                      isLeft ? 'border-t-blue-600' : 'border-t-purple-600'
                    }`}></div>
                  </div>
                </div>
              </div>

              {/* 刻度标记 */}
              <div className="flex justify-between text-[10px] text-neutral-400 mt-1.5 px-1">
                <span>0</span>
                <span className="opacity-50">25</span>
                <span className="font-bold text-neutral-500">50</span>
                <span className="opacity-50">75</span>
                <span>100</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 图例说明 */}
      <div className="mt-8 p-4 bg-blue-50/50 rounded-xl border border-blue-200/30">
        <p className="text-xs sm:text-sm text-neutral-600 text-center leading-relaxed">
          <span className="font-semibold text-neutral-700">💡 解读提示：</span>
          每个维度没有"好"或"坏"之分，左右两端代表不同的性格特质。
          你的得分反映了在该维度上的倾向性。
        </p>
      </div>
    </div>
  );
}
