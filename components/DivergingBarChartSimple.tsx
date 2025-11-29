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
          // value=0表示完全左侧，value=100表示完全右侧
          // 百分比显示逻辑：
          // value=0表示完全左侧(100%左)，value=100表示完全右侧(100%右)
          // 左侧标签应该显示：100-value（左侧特质的百分比）
          // 右侧标签应该显示：value（右侧特质的百分比）
          const leftPercentageDisplay = Math.round(100 - item.value); // 左侧特质的百分比
          const rightPercentageDisplay = Math.round(item.value); // 右侧特质的百分比

          // 判断哪边百分比更高，决定填充方向
          const fillFromLeft = leftPercentageDisplay > rightPercentageDisplay; // true=从左侧填充，false=从右侧填充
          const barWidth = fillFromLeft ? leftPercentageDisplay : rightPercentageDisplay;

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
                  {/* 中心线参考 */}
                  <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-neutral-300/50"></div>

                  {/* 进度条 - 哪边百分比高，就从哪边填充 */}
                  <div
                    className={`absolute top-0 bottom-0 ${fillFromLeft ? 'left-0' : 'right-0'}`}
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>

                {/* 右标签 */}
                <span className={`${compact ? 'text-[10px]' : 'text-xs'} text-neutral-600 font-medium whitespace-nowrap flex-shrink-0`}>
                  {item.rightLabel}
                </span>
              </div>

              {/* 百分比 */}
              <div className="flex items-center justify-between mt-1 px-0.5">
                <span className={`${compact ? 'text-[10px]' : 'text-xs'} ${leftPercentageDisplay > rightPercentageDisplay ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
                  {leftPercentageDisplay}%
                </span>
                <span className={`${compact ? 'text-[10px]' : 'text-xs'} ${rightPercentageDisplay > leftPercentageDisplay ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
                  {rightPercentageDisplay}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
