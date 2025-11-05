'use client';

interface PercentileChartProps {
  percentile: number | null;
  totalCount: number;
  minSampleSize?: number;
}

export default function PercentileChart({
  percentile,
  totalCount,
  minSampleSize = 30,
}: PercentileChartProps) {
  // 如果百分位为null或样本量不足，显示提示信息
  if (percentile === null || totalCount < minSampleSize) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">📊</span>
          <h3 className="text-xl font-bold text-gray-900">相对位置分析</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600">
            样本量不足（当前: {totalCount}，需要: {minSampleSize}），暂无百分位数据
          </p>
          <p className="text-sm text-gray-500 mt-2">
            随着更多用户完成测评，我们将提供您在所有用户中的相对位置分析
          </p>
        </div>
      </div>
    );
  }

  // 确定百分位的描述和颜色
  let description = '';
  let color = '';
  let emoji = '';

  if (percentile >= 90) {
    description = '您的得分超过了90%以上的用户，表现优异！';
    color = '#10b981'; // green
    emoji = '🌟';
  } else if (percentile >= 75) {
    description = '您的得分超过了75%以上的用户，表现良好。';
    color = '#3b82f6'; // blue
    emoji = '👍';
  } else if (percentile >= 50) {
    description = '您的得分处于中等水平。';
    color = '#f59e0b'; // orange
    emoji = '📊';
  } else if (percentile >= 25) {
    description = '您的得分低于大多数用户。';
    color = '#f97316'; // orange-red
    emoji = '⚠️';
  } else {
    description = '您的得分较低，建议关注相关问题。';
    color = '#ef4444'; // red
    emoji = '🔴';
  }

  return (
    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft-xl p-10 mb-8 border border-neutral-100 animate-slide-up">
      {/* 装饰背景 */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full opacity-20 blur-3xl -z-10"></div>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-soft">
          <span className="text-2xl">📊</span>
        </div>
        <h3 className="text-2xl font-bold text-neutral-900">相对位置分析</h3>
      </div>

      {/* 百分位显示 - 更精美的设计 */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center mb-6">
          {/* 装饰光环 */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-500 opacity-10 blur-2xl rounded-full"></div>
            <div className="relative flex items-center gap-4">
              <span className="text-5xl">{emoji}</span>
              <div>
                <div className="text-6xl font-black bg-gradient-to-br from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {percentile}%
                </div>
                <div className="text-sm text-neutral-500 mt-1 font-medium">百分位排名</div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-neutral-700 leading-relaxed max-w-2xl mx-auto text-lg">
          {description}
        </p>
      </div>

      {/* 可视化条形图 - 3D效果 */}
      <div className="relative mb-6">
        {/* 3D底层阴影 */}
        <div className="absolute inset-x-0 top-2 h-16 bg-gradient-to-r from-green-500/20 via-yellow-500/20 to-red-500/20 rounded-full blur-md"></div>

        {/* 主渐变条 */}
        <div className="relative h-16 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full overflow-visible shadow-soft-lg">
          {/* 高光效果 */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded-full"></div>

          {/* 指示器 - 3D设计 */}
          <div
            className="absolute top-1/2 -translate-y-1/2 transition-all duration-500"
            style={{ left: `${percentile}%` }}
          >
            {/* 指示器阴影 */}
            <div className="absolute left-1/2 -translate-x-1/2 w-1 h-20 bg-neutral-900/30 blur-sm"></div>

            {/* 主指示器 */}
            <div className="relative flex flex-col items-center -translate-x-1/2">
              {/* 标签 */}
              <div className="mb-2 px-4 py-2 bg-gradient-to-br from-neutral-900 to-neutral-700 text-white rounded-xl text-sm font-bold whitespace-nowrap shadow-soft-lg animate-float">
                您的位置
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45"></div>
              </div>
              {/* 指示线 */}
              <div className="w-1 h-20 bg-gradient-to-b from-neutral-900 to-neutral-700 rounded-full shadow-soft"></div>
              {/* 底部圆点 */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-3 border-neutral-900 rounded-full shadow-soft"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 刻度说明 */}
      <div className="flex justify-between text-xs font-medium text-neutral-500 mb-8">
        <span className="flex flex-col items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          0%
        </span>
        <span className="flex flex-col items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-lime-500"></div>
          25%
        </span>
        <span className="flex flex-col items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          50%
        </span>
        <span className="flex flex-col items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          75%
        </span>
        <span className="flex flex-col items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          100%
        </span>
      </div>

      {/* 统计信息 - 精美卡片设计 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="relative overflow-hidden p-6 bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl border border-primary-100 shadow-soft">
          <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative">
            <div className="text-sm text-neutral-600 mb-2 font-medium">总测评人数</div>
            <div className="text-4xl font-black bg-gradient-to-br from-primary to-purple-600 bg-clip-text text-transparent">
              {totalCount.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden p-6 bg-gradient-to-br from-pink-50 to-orange-50 rounded-2xl border border-pink-100 shadow-soft">
          <div className="absolute top-0 right-0 w-20 h-20 bg-pink/5 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="relative">
            <div className="text-sm text-neutral-600 mb-2 font-medium">得分高于您</div>
            <div className="text-4xl font-black bg-gradient-to-br from-pink-600 to-orange-600 bg-clip-text text-transparent">
              {Math.round(((100 - percentile) / 100) * totalCount).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* 说明文字 */}
      <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
        <p className="text-sm text-neutral-700 leading-relaxed">
          <span className="text-lg mr-1">💡</span>
          <strong className="text-neutral-900">百分位说明：</strong>
          百分位表示您的得分超过了百分之多少的其他用户。例如，75%表示您的得分超过了75%的用户。
          此数据基于 <span className="font-bold text-primary">{totalCount}</span> 名用户的测评结果。
        </p>
      </div>
    </div>
  );
}
