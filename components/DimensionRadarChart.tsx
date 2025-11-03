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
}

export default function DimensionRadarChart({
  data,
  title,
  showLegend = true,
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

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          {/* 网格 */}
          <PolarGrid stroke="#e5e7eb" strokeDasharray="3 3" />

          {/* 角度轴（维度名称） */}
          <PolarAngleAxis
            dataKey="dimension"
            tick={<CustomAngleAxisTick />}
          />

          {/* 半径轴（分数） */}
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickCount={6}
          />

          {/* 雷达区域 */}
          <Radar
            name="得分"
            dataKey="value"
            stroke="#8b5cf6"
            fill="#8b5cf6"
            fillOpacity={0.6}
            strokeWidth={2}
            dot={{
              r: 5,
              fill: '#8b5cf6',
              strokeWidth: 2,
              stroke: '#fff',
            }}
            activeDot={{
              r: 7,
              fill: '#7c3aed',
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

      {/* 图例说明 */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-gray-600">健康范围 (0-33)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span className="text-gray-600">需要关注 (34-66)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-600">高风险 (67-100)</span>
        </div>
      </div>

      {/* 说明文字 */}
      <p className="text-xs text-gray-500 text-center mt-4">
        * 所有维度得分已归一化到0-100范围，便于对比分析
      </p>
    </div>
  );
}
