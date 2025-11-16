"use client";

import React from 'react';

export interface DivergingBarDataPoint {
  dimension: string;
  value: number; // 0-100
  leftLabel: string;
  rightLabel: string;
}

interface DivergingBarChartSimpleProps {
  data: DivergingBarDataPoint[];
  compact?: boolean;
}

const DIMENSION_COLORS = [
  "#6EA8FE", // 高级亮蓝
  "#FF8B94", // 柔粉红
  "#8FD19E", // 清新绿
  "#B79CFF", // 薰衣紫
  "#FFC98F", // 奶油橙
  "#7CD4E6", // 冰湖青
];

export default function DivergingBarChartSimple({ data, compact = false }: DivergingBarChartSimpleProps) {

  return (
    <div className="w-full" style={{ minHeight: '200px', minWidth: '200px' }}>
      <div className={compact ? 'space-y-3' : 'space-y-4'}>
        {data.map((item, index) => {
          const isLeft = item.value >= 50;

          const leftWidth = Math.round(item.value);
          const rightWidth = Math.round(100 - item.value);

          // 为每个维度分配专属颜色
          const color = DIMENSION_COLORS[index % DIMENSION_COLORS.length];

          return (
            <div key={index}>
              {/* 维度名称 */}
              <div className="text-center mb-2">
                <h4 className={`font-bold text-neutral-900 ${compact ? 'text-xs' : 'text-sm'}`}>
                  {item.dimension}
                </h4>
              </div>

              <div className="flex items-center gap-2">

                {/* 左标签 */}
                <span className={`${compact ? 'text-[10px]' : 'text-xs'} text-neutral-600 font-medium whitespace-nowrap flex-shrink-0`}>
                  {item.leftLabel}
                </span>

                {/* 条形图 */}
                <div
                  className={`relative ${compact ? 'h-6' : 'h-8'} rounded-full overflow-hidden border border-neutral-200 flex-1 bg-neutral-100`}
                >
                  {/* 中心线 */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-neutral-300"></div>

                  {/* 左进度条 */}
                  {isLeft && (
                    <div
                      className="absolute top-0 bottom-0 left-0"
                      style={{
                        width: `${leftWidth}%`,
                        backgroundColor: color,
                      }}
                    />
                  )}

                  {/* 右进度条 */}
                  {!isLeft && (
                    <div
                      className="absolute top-0 bottom-0 right-0"
                      style={{
                        width: `${rightWidth}%`,
                        backgroundColor: color,
                      }}
                    />
                  )}
                </div>

                {/* 右标签 */}
                <span className={`${compact ? 'text-[10px]' : 'text-xs'} text-neutral-600 font-medium whitespace-nowrap flex-shrink-0`}>
                  {item.rightLabel}
                </span>
              </div>

              {/* 百分比 */}
              <div className="flex items-center justify-between mt-1 px-0.5">
                <span className={`${compact ? 'text-[10px]' : 'text-xs'} ${isLeft ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
                  {leftWidth}%
                </span>
                <span className={`${compact ? 'text-[10px]' : 'text-xs'} ${!isLeft ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
                  {rightWidth}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
