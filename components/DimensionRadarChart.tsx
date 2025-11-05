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
  fullMark: 100;
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
      let level = '健康范围';
      let color = '#10b981'; // green

      if (value >= 67) {
        level = '高风险';
        color = '#ef4444'; // red
      } else if (value >= 34) {
        level = '需要关注';
        color = '#f59e0b'; // amber
      }

      return (
        <div className="bg-white px-4 py-3 shadow-lg rounded-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-1">{data.dimension}</p>
          <p className="text-2xl font-bold" style={{ color }}>
            {value.toFixed(1)}分
          </p>
          <p className="text-sm text-gray-500 mt-1">{level}</p>
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

      {/* 雷达图容器 - 添加渐变背景 */}
      <div className={compact ? "relative" : "relative p-6 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/50 rounded-2xl"}>
        <ResponsiveContainer width="100%" height={compact ? 300 : 450}>
          <RadarChart data={data}>
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

            {/* 半径轴（分数） */}
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }}
              tickCount={6}
              stroke="#e4e4e7"
            />

            {/* 雷达区域 - 使用渐变色 */}
            <Radar
              name="得分"
              dataKey="value"
              stroke="url(#radarGradient)"
              fill="url(#radarFill)"
              fillOpacity={0.65}
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

            {/* 定义渐变 */}
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="50%" stopColor="#a855f7" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#ec4899" stopOpacity={0.4} />
              </linearGradient>
            </defs>

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
      </div>

      {/* 图例说明 - 精美卡片样式（非紧凑模式显示） */}
      {!compact && (
        <>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200/50 shadow-soft">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-soft"></div>
              <span className="text-sm font-medium text-neutral-700">健康范围 (0-33)</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 shadow-soft">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-soft"></div>
              <span className="text-sm font-medium text-neutral-700">需要关注 (34-66)</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border border-red-200/50 shadow-soft">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-soft"></div>
              <span className="text-sm font-medium text-neutral-700">高风险 (67-100)</span>
            </div>
          </div>

          {/* 说明文字 */}
          <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
            <p className="text-xs text-neutral-600 text-center leading-relaxed">
              <span className="font-medium">💡 提示：</span> 所有维度得分已归一化到0-100范围，便于对比分析
            </p>
          </div>
        </>
      )}
    </div>
  );
}
