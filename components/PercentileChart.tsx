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
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">📊</span>
        <h3 className="text-xl font-bold text-gray-900">相对位置分析</h3>
      </div>

      {/* 百分位显示 */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center mb-4">
          <span className="text-4xl mr-3">{emoji}</span>
          <div>
            <div className="text-5xl font-bold" style={{ color }}>
              {percentile}%
            </div>
            <div className="text-sm text-gray-600 mt-1">百分位排名</div>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* 可视化条形图 */}
      <div className="relative h-16 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full overflow-hidden mb-4">
        {/* 指示器 */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gray-900 shadow-lg"
          style={{ left: `${percentile}%` }}
        >
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded text-sm font-semibold whitespace-nowrap">
            您的位置
          </div>
        </div>
      </div>

      {/* 刻度说明 */}
      <div className="flex justify-between text-xs text-gray-500 mb-6">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{totalCount}</div>
          <div className="text-sm text-gray-600 mt-1">总测评人数</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {Math.round(((100 - percentile) / 100) * totalCount)}
          </div>
          <div className="text-sm text-gray-600 mt-1">得分高于您的人数</div>
        </div>
      </div>

      {/* 说明文字 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 leading-relaxed">
          💡 <strong>百分位说明：</strong>
          百分位表示您的得分超过了百分之多少的其他用户。例如，75%表示您的得分超过了75%的用户。
          此数据基于 {totalCount} 名用户的测评结果。
        </p>
      </div>
    </div>
  );
}
