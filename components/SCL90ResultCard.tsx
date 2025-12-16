import React, { forwardRef } from 'react';
import type { RadarDataPoint } from './DimensionRadarChart';
import dynamic from 'next/dynamic';

// 动态导入雷达图组件（仅客户端渲染）
const DimensionRadarChart = dynamic(
  () => import('./DimensionRadarChart'),
  { ssr: false }
);

interface SCL90ResultCardProps {
  scaleTitle: string;
  totalScore: number;
  gsi: number;
  pst: number;
  psdi: number;
  isScreeningPositive: boolean;
  crisisWarnings: string[];
  completedAt: string;
  radarData?: RadarDataPoint[];
}

const SCL90ResultCard = forwardRef<HTMLDivElement, SCL90ResultCardProps>(
  ({ scaleTitle, totalScore, gsi, pst, psdi, isScreeningPositive, crisisWarnings, completedAt, radarData }, ref) => {
    return (
      <div ref={ref} className="bg-white rounded-3xl shadow-soft-xl overflow-hidden">
        {/* Header - 顶部装饰带 */}
        <div className={`h-3 bg-gradient-to-r ${isScreeningPositive ? 'from-orange-400 via-red-400 to-pink-400' : 'from-green-400 via-emerald-400 to-teal-400'}`}></div>

        <div className="p-10 sm:p-12">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="text-3xl">🧠</div>
              <h1 className="text-2xl font-bold text-neutral-900">{scaleTitle}</h1>
            </div>
            <p className="text-sm text-neutral-500">
              {new Date(completedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* 核心指标卡片 */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* 总分 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50">
              <div className="text-xs text-blue-600 font-semibold mb-2">总分</div>
              <div className="text-3xl font-bold text-blue-900">{totalScore}</div>
              <div className="text-xs text-blue-600 mt-1">满分 450</div>
            </div>

            {/* GSI */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200/50">
              <div className="text-xs text-purple-600 font-semibold mb-2">总均分 (GSI)</div>
              <div className="text-3xl font-bold text-purple-900">{gsi.toFixed(2)}</div>
              <div className="text-xs text-purple-600 mt-1">满分 5.00</div>
            </div>

            {/* PST */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200/50">
              <div className="text-xs text-amber-600 font-semibold mb-2">阳性项目数 (PST)</div>
              <div className="text-3xl font-bold text-amber-900">{pst}</div>
              <div className="text-xs text-amber-600 mt-1">总共 90 项</div>
            </div>

            {/* PSDI */}
            <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-2xl p-6 border border-rose-200/50">
              <div className="text-xs text-rose-600 font-semibold mb-2">阳性症状均分 (PSDI)</div>
              <div className="text-3xl font-bold text-rose-900">{psdi.toFixed(2)}</div>
              <div className="text-xs text-rose-600 mt-1">满分 5.00</div>
            </div>
          </div>

          {/* 筛查结果 */}
          <div className={`rounded-2xl p-6 mb-8 ${isScreeningPositive ? 'bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${isScreeningPositive ? 'bg-orange-500' : 'bg-green-500'} flex items-center justify-center shadow-soft`}>
                <span className="text-2xl">{isScreeningPositive ? '⚠️' : '✅'}</span>
              </div>
              <h3 className={`text-lg font-bold ${isScreeningPositive ? 'text-orange-900' : 'text-green-900'}`}>
                {isScreeningPositive ? '筛查阳性' : '心理健康'}
              </h3>
            </div>
            <p className={`text-sm leading-relaxed ${isScreeningPositive ? 'text-orange-800' : 'text-green-800'}`}>
              {isScreeningPositive
                ? '检测结果显示您可能存在一定程度的心理症状，建议寻求专业心理咨询或评估。'
                : '检测结果显示您目前整体心理健康状况良好，请继续保持积极的生活态度。'}
            </p>
          </div>

          {/* 危机预警（如果有） */}
          {crisisWarnings.length > 0 && (
            <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shadow-soft">
                  <span className="text-2xl">🚨</span>
                </div>
                <h3 className="text-lg font-bold text-red-900">危机预警</h3>
              </div>
              <div className="space-y-2">
                {crisisWarnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <p className="text-sm text-red-800 leading-relaxed flex-1">{warning}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-red-200">
                <p className="text-xs text-red-700 font-semibold">
                  ⚠️ 请立即联系专业机构：心理危机热线 400-161-9995（24小时）
                </p>
              </div>
            </div>
          )}

          {/* 雷达图 */}
          {radarData && radarData.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span>
                因子得分分布
              </h3>
              <div className="bg-gradient-to-br from-neutral-50 to-purple-50/30 rounded-2xl p-6 border border-neutral-200/50">
                <DimensionRadarChart data={radarData} />
              </div>
              <p className="text-xs text-neutral-500 text-center mt-3">
                因子分 &lt; 2：正常范围 | 2-3：中度症状 | ≥ 3：严重症状
              </p>
            </div>
          )}

          {/* Footer - 品牌标识 */}
          <div className="text-center pt-6 border-t border-neutral-200">
            <p className="text-sm font-bold gradient-text mb-1">KnowYourself</p>
            <p className="text-xs text-neutral-400">专业心理测评 · 科学可信</p>
          </div>
        </div>
      </div>
    );
  }
);

SCL90ResultCard.displayName = 'SCL90ResultCard';

export default SCL90ResultCard;
