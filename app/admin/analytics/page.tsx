'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ScaleStats {
  scaleId: string;
  scaleTitle: string;
  count: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
    prefer_not_to_say: number;
  };
  ageDistribution: {
    min: number;
    max: number;
    avg: number;
    ranges: {
      '0-17': number;
      '18-24': number;
      '25-34': number;
      '35-44': number;
      '45-54': number;
      '55-64': number;
      '65+': number;
    };
  };
}

interface UserTypeStats {
  userType: string;
  userCount: number;
  avgAssessments: number;
  totalAssessments: number;
}

interface RecentActivity {
  newUsers: number;
  scaleRecords: {
    scaleId: string;
    scaleTitle: string;
    newRecords: number;
  }[];
}

interface AnalyticsData {
  overall: {
    totalUsers: number;
    totalRecords: number;
    avgRecordsPerUser: number;
  };
  scaleStats: ScaleStats[];
  userTypes: UserTypeStats[];
  recentActivity: RecentActivity;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">错误: {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">暂无数据</div>
      </div>
    );
  }

  // 准备图表数据
  const scaleChartData = data.scaleStats.map(stat => ({
    name: stat.scaleTitle.length > 10 ? stat.scaleTitle.substring(0, 10) + '...' : stat.scaleTitle,
    参与人数: stat.count,
  }));

  const userTypeChartData = data.userTypes.map(ut => ({
    name: ut.userType,
    用户数: ut.userCount,
  }));

  const genderLabels: Record<string, string> = {
    male: '男性',
    female: '女性',
    other: '其他',
    prefer_not_to_say: '不愿透露',
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">数据分析Dashboard</h1>

        {/* 总体统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">总用户数</div>
            <div className="text-3xl font-bold text-blue-600">{data.overall.totalUsers}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">总测评记录数</div>
            <div className="text-3xl font-bold text-green-600">{data.overall.totalRecords}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-2">平均每用户测评数</div>
            <div className="text-3xl font-bold text-purple-600">{data.overall.avgRecordsPerUser}</div>
          </div>
        </div>

        {/* 最近24小时活跃情况 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📈 最近24小时活跃情况</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 rounded p-4">
              <div className="text-sm text-gray-600">新增用户</div>
              <div className="text-2xl font-bold text-blue-600">{data.recentActivity.newUsers}</div>
            </div>
            <div className="bg-green-50 rounded p-4">
              <div className="text-sm text-gray-600">新增测评记录</div>
              <div className="text-2xl font-bold text-green-600">
                {data.recentActivity.scaleRecords.reduce((sum, s) => sum + s.newRecords, 0)}
              </div>
            </div>
          </div>
          {data.recentActivity.scaleRecords.length > 0 && (
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">各测评新增记录</div>
              <div className="space-y-2">
                {data.recentActivity.scaleRecords.map((scale, index) => (
                  <div key={index} className="flex justify-between items-center bg-gray-50 rounded px-4 py-2">
                    <span className="text-sm">{scale.scaleTitle}</span>
                    <span className="font-semibold text-green-600">{scale.newRecords} 条</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 测评参与情况图表 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📊 测评参与情况</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scaleChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="参与人数" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 用户类型分布 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">👥 用户类型分布</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userTypeChartData}
                  dataKey="用户数"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {userTypeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {data.userTypes.map((ut, index) => (
                <div key={index} className="border-l-4 pl-4 py-2" style={{ borderColor: COLORS[index % COLORS.length] }}>
                  <div className="font-semibold">{ut.userType}</div>
                  <div className="text-sm text-gray-600">
                    用户数: {ut.userCount} | 平均测评数: {ut.avgAssessments}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 各测评详细统计 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">📋 各测评详细统计</h2>
          {data.scaleStats.map((scale, index) => {
            const genderData = Object.entries(scale.genderDistribution)
              .filter(([_, count]) => count > 0)
              .map(([gender, count]) => ({
                name: genderLabels[gender] || gender,
                value: count,
              }));

            const ageData = Object.entries(scale.ageDistribution.ranges)
              .filter(([_, count]) => count > 0)
              .map(([range, count]) => ({
                name: range + '岁',
                人数: count,
              }));

            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">{index + 1}. {scale.scaleTitle}</h3>
                  <div className="text-sm text-gray-600">测评ID: {scale.scaleId}</div>
                  <div className="text-sm text-gray-600">参与人数: {scale.count}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 性别分布 */}
                  <div>
                    <h4 className="font-medium mb-2">性别分布</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={genderData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          label
                        >
                          {genderData.map((entry, i) => (
                            <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 年龄分布 */}
                  <div>
                    <h4 className="font-medium mb-2">
                      年龄分布 (范围: {scale.ageDistribution.min}-{scale.ageDistribution.max}岁, 平均: {scale.ageDistribution.avg}岁)
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={ageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="人数" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
