"use client";

import { useEffect, useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

export interface RadarDataPoint {
  dimension: string;
  value: number;
  fullMark?: number;
}

interface DimensionRadarChartProps {
  data: RadarDataPoint[];
  title?: string;
  showLegend?: boolean;
  compact?: boolean; // 紧凑模式用于ShareCard
}

export default function DimensionRadarChart({
  data,
  title,
  showLegend = true,
  compact = false,
}: DimensionRadarChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 使用固定的 100 作为最大值，因为所有数据都已归一化到 0-100
  const maxDomain = 100;

  if (!mounted) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-50 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">加载图表中...</p>
        </div>
      </div>
    );
  }

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const value = data.value;
      const percentage = (value / maxDomain) * 100;
      let level = '较低';
      let color = '#10b981'; // green

      if (percentage >= 67) {
        level = '较高';
        color = '#8b5cf6'; // purple
      } else if (percentage >= 34) {
        level = '中等';
        color = '#3b82f6'; // blue
      }

      return (
        <div className="bg-white px-4 py-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-1">{data.dimension}</p>
          <p className="text-2xl font-bold" style={{ color }}>
            {value.toFixed(1)}分
          </p>
        </div>
      );
    }
    return null;
  };

  // 自定义角度轴标签
  const CustomAngleAxisTick = ({ payload, x, y, cx, cy }: any) => {
    const radius = 10;
    const offsetX = (x - cx) * radius / Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    const offsetY = (y - cy) * radius / Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

    const text = payload.value;
    const maxLength = 5; // 超过5个字符则换行

    // 如果文本长度超过限制，拆分为两行
    if (text.length > maxLength) {
      const mid = Math.ceil(text.length / 2);
      const line1 = text.substring(0, mid);
      const line2 = text.substring(mid);

      return (
        <text
          x={x + offsetX}
          y={y + offsetY}
          textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
          className="fill-gray-700 text-sm font-medium"
        >
          <tspan x={x + offsetX} dy="-0.6em">{line1}</tspan>
          <tspan x={x + offsetX} dy="1.2em">{line2}</tspan>
        </text>
      );
    }

    return (
      <text
        x={x + offsetX}
        y={y + offsetY}
        textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
        dominantBaseline="central"
        className="fill-gray-700 text-sm font-medium"
      >
        {payload.value}
      </text>
    );
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {title}
        </h3>
      )}

      {/* 雷达图容器 - 使用纯色背景以确保图片导出正常 */}
      <div className={compact ? "relative" : "relative p-3 sm:p-6 rounded-2xl"} style={compact ? {} : { backgroundColor: '#f5f3ff' }}>
        {compact ? (
          // 紧凑模式：使用固定尺寸，避免 ResponsiveContainer 在导出时的渲染问题
          <div className="flex justify-center">
            <RadarChart width={500} height={300} data={data} margin={{ top: 10, right: 80, bottom: 10, left: 80 }}>
              {/* 网格 - 更精致的样式 */}
              <PolarGrid
                stroke="#d4d4d8"
                strokeDasharray="5 5"
                strokeWidth={1}
                strokeOpacity={0.6}
              />

              {/* 角度轴（维度名称） */}
              <PolarAngleAxis
                dataKey="dimension"
                tick={<CustomAngleAxisTick />}
              />

              {/* 半径轴（分数） - 自适应最大值 */}
              <PolarRadiusAxis
                angle={90}
                domain={[0, maxDomain]}
                tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }}
                tickCount={6}
                stroke="#e4e4e7"
              />

              {/* 雷达区域 - 使用实色以确保图片导出正常 */}
              <Radar
                name="得分"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.5}
                strokeWidth={3}
                dot={{
                  r: 6,
                  fill: '#8b5cf6',
                  strokeWidth: 3,
                  stroke: '#fff',
                }}
                activeDot={{
                  r: 8,
                  fill: '#7c3aed',
                  strokeWidth: 3,
                  stroke: '#fff',
                }}
              />

              {/* 提示框 */}
              <Tooltip content={<CustomTooltip />} />

              {/* 图例 */}
              {showLegend && (
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                  }}
                />
              )}
            </RadarChart>
          </div>
        ) : (
          // 非紧凑模式：使用 ResponsiveContainer 以适应不同屏幕尺寸
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data} margin={{ top: 10, right: 80, bottom: 10, left: 80 }}>
              {/* 网格 - 更精致的样式 */}
              <PolarGrid
                stroke="#d4d4d8"
                strokeDasharray="5 5"
                strokeWidth={1}
                strokeOpacity={0.6}
              />

              {/* 角度轴（维度名称） */}
              <PolarAngleAxis
                dataKey="dimension"
                tick={<CustomAngleAxisTick />}
              />

              {/* 半径轴（分数） - 自适应最大值 */}
              <PolarRadiusAxis
                angle={90}
                domain={[0, maxDomain]}
                tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }}
                tickCount={6}
                stroke="#e4e4e7"
              />

              {/* 雷达区域 - 使用实色以确保图片导出正常 */}
              <Radar
                name="得分"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.5}
                strokeWidth={3}
                dot={{
                  r: 6,
                  fill: '#8b5cf6',
                  strokeWidth: 3,
                  stroke: '#fff',
                }}
                activeDot={{
                  r: 8,
                  fill: '#7c3aed',
                  strokeWidth: 3,
                  stroke: '#fff',
                }}
              />

              {/* 提示框 */}
              <Tooltip content={<CustomTooltip />} />

              {/* 图例 */}
              {showLegend && (
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                  }}
                />
              )}
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 图例说明 - 精美卡片样式（非紧凑模式显示） */}
      {!compact && (
        <>


          {/* 说明文字 */}
          <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
            <p className="text-xs text-neutral-600 text-center leading-relaxed">
              <span className="font-medium">💡 提示：</span> 雷达图展示各维度得分（满分 100 分），便于查看各维度表现
            </p>
          </div>
        </>
      )}
    </div>
  );
}
