import React, { forwardRef } from 'react';
import type { RadarDataPoint } from './DimensionRadarChart';
import dynamic from 'next/dynamic';

// 动态导入雷达图组件（仅客户端渲染）
const DimensionRadarChart = dynamic(
  () => import('./DimensionRadarChart'),
  { ssr: false }
);

interface SCL90ShareCardProps {
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

const SCL90ShareCard = forwardRef<HTMLDivElement, SCL90ShareCardProps>(
  ({ scaleTitle, totalScore, gsi, pst, psdi, isScreeningPositive, crisisWarnings, completedAt, radarData }, ref) => {
    // 注意：ShareCard 需要固定宽高以便导出
    return (
      <div ref={ref} className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ width: '800px', minHeight: '1000px' }}>
        {/* Header - 顶部装饰带 */}
        <div className={`h-4 bg-gradient-to-r ${isScreeningPositive ? 'from-orange-400 via-red-400 to-pink-400' : 'from-green-400 via-emerald-400 to-teal-400'}`}></div>

        <div className="p-12">
          {/* Logo & Title */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-4xl">🧠</div>
              <h1 className="text-3xl font-bold text-neutral-900">{scaleTitle}</h1>
            </div>
            <p className="text-base text-neutral-500">
              {new Date(completedAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* 核心指标卡片 */}
          <div className="grid grid-cols-2 gap-5 mb-10">
            {/* 总分 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-7 border border-blue-200/50">
              <div className="text-sm text-blue-600 font-semibold mb-2">总分</div>
              <div className="text-4xl font-bold text-blue-900">{totalScore}</div>
              <div className="text-xs text-blue-600 mt-2">满分 450</div>
            </div>

            {/* GSI */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-7 border border-purple-200/50">
              <div className="text-sm text-purple-600 font-semibold mb-2">总均分 (GSI)</div>
              <div className="text-4xl font-bold text-purple-900">{gsi.toFixed(2)}</div>
              <div className="text-xs text-purple-600 mt-2">满分 5.00</div>
            </div>

            {/* PST */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-7 border border-amber-200/50">
              <div className="text-sm text-amber-600 font-semibold mb-2">阳性项目数 (PST)</div>
              <div className="text-4xl font-bold text-amber-900">{pst}</div>
              <div className="text-xs text-amber-600 mt-2">总共 90 项</div>
            </div>

            {/* PSDI */}
            <div className="bg-gradient-to-br from-rose-50 to-rose-100/50 rounded-2xl p-7 border border-rose-200/50">
              <div className="text-sm text-rose-600 font-semibold mb-2">阳性症状均分 (PSDI)</div>
              <div className="text-4xl font-bold text-rose-900">{psdi.toFixed(2)}</div>
              <div className="text-xs text-rose-600 mt-2">满分 5.00</div>
            </div>
          </div>

          {/* 筛查结果 */}
          <div className={`rounded-2xl p-7 mb-8 ${isScreeningPositive ? 'bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200' : 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-xl ${isScreeningPositive ? 'bg-orange-500' : 'bg-green-500'} flex items-center justify-center shadow-lg`}>
                <span className="text-3xl">{isScreeningPositive ? '⚠️' : '✅'}</span>
              </div>
              <h3 className={`text-2xl font-bold ${isScreeningPositive ? 'text-orange-900' : 'text-green-900'}`}>
                {isScreeningPositive ? '筛查阳性' : '心理健康'}
              </h3>
            </div>
            <p className={`text-base leading-relaxed ${isScreeningPositive ? 'text-orange-800' : 'text-green-800'}`}>
              {isScreeningPositive
                ? '检测结果显示您可能存在一定程度的心理症状，建议寻求专业心理咨询或评估。'
                : '检测结果显示您目前整体心理健康状况良好，请继续保持积极的生活态度。'}
            </p>
          </div>

          {/* 危机预警（如果有，仅显示提示不显示详细内容，保护隐私） */}
          {crisisWarnings.length > 0 && (
            <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-2xl p-7 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shadow-lg">
                  <span className="text-3xl">🚨</span>
                </div>
                <h3 className="text-2xl font-bold text-red-900">检测到危机预警</h3>
              </div>
              <p className="text-base text-red-800 leading-relaxed mb-3">
                检测到潜在的心理危机信号，请立即寻求专业帮助。
              </p>
              <div className="bg-red-100/50 rounded-xl p-4 border border-red-200">
                <p className="text-sm text-red-800 font-semibold">
                  🆘 24小时心理危机热线：400-161-9995
                </p>
              </div>
            </div>
          )}

          {/* 雷达图 */}
          {radarData && radarData.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-bold text-neutral-900 mb-5 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                十因子得分分布
              </h3>
              <div className="bg-gradient-to-br from-neutral-50 to-purple-50/30 rounded-2xl p-8 border border-neutral-200/50">
                <DimensionRadarChart data={radarData} />
              </div>
              <p className="text-sm text-neutral-500 text-center mt-4">
                因子分范围：1-5分 | &lt; 2：正常范围 | 2-3：中度症状 | ≥ 3：严重症状
              </p>
            </div>
          )}

          {/* 说明 */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-5 mb-8">
            <p className="text-sm text-amber-900 leading-relaxed">
              <strong>⚠️ 重要说明：</strong>本测评结果仅供参考，不能替代专业诊断。如有心理困扰，请寻求专业心理咨询师或精神科医生的帮助。
            </p>
          </div>

          {/* Footer - 品牌标识 */}
          <div className="text-center pt-8 border-t border-neutral-200">
            <p className="text-xl font-bold gradient-text mb-2">KnowYourself</p>
            <p className="text-sm text-neutral-400">专业心理测评 · 科学可信</p>
          </div>
        </div>
      </div>
    );
  }
);

SCL90ShareCard.displayName = 'SCL90ShareCard';

export default SCL90ShareCard;
