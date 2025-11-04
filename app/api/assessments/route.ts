import { NextRequest, NextResponse } from 'next/server';
import type { AssessmentRecord } from '@/types/analytics';

// 临时使用内存存储（生产环境应使用数据库）
// 这里仅作为示例，实际应连接数据库（如 PostgreSQL, MongoDB 等）
let assessmentRecords: AssessmentRecord[] = [];

/**
 * POST /api/assessments
 * 提交测评记录到后台
 */
export async function POST(request: NextRequest) {
  try {
    const data: AssessmentRecord = await request.json();

    // 数据验证
    if (!data.scaleId || !data.gender || !data.age || data.totalScore === undefined) {
      return NextResponse.json(
        { success: false, error: '缺少必要字段' },
        { status: 400 }
      );
    }

    // 年龄范围验证
    if (data.age < 1 || data.age > 120) {
      return NextResponse.json(
        { success: false, error: '年龄范围无效' },
        { status: 400 }
      );
    }

    // 添加时间戳（如果未提供）
    if (!data.completedAt) {
      data.completedAt = new Date().toISOString();
    }

    // 生成唯一ID（如果未提供）
    if (!data.id) {
      data.id = `record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // 存储记录
    // TODO: 替换为数据库存储
    assessmentRecords.push(data);

    // 可选：异步写入到文件或数据库
    // await saveToDatabase(data);

    console.log(`[Analytics] 新测评记录: ${data.scaleId}, 性别: ${data.gender}, 年龄: ${data.age}, 得分: ${data.totalScore}`);

    return NextResponse.json({
      success: true,
      message: '测评记录已保存',
      recordId: data.id,
    });
  } catch (error) {
    console.error('[Analytics] 保存测评记录失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/assessments?scaleId=xxx
 * 获取统计数据（管理员功能，生产环境需要鉴权）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scaleId = searchParams.get('scaleId');

    if (!scaleId) {
      return NextResponse.json(
        { success: false, error: '缺少 scaleId 参数' },
        { status: 400 }
      );
    }

    // 筛选指定量表的记录
    const records = assessmentRecords.filter(r => r.scaleId === scaleId);

    if (records.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          scaleId,
          totalCount: 0,
          avgScore: 0,
          records: [],
        },
      });
    }

    // 计算统计数据
    const totalScore = records.reduce((sum, r) => sum + r.totalScore, 0);
    const avgScore = totalScore / records.length;

    // 性别分布
    const genderStats = records.reduce((acc, r) => {
      if (!acc[r.gender]) {
        acc[r.gender] = { count: 0, totalScore: 0 };
      }
      acc[r.gender].count++;
      acc[r.gender].totalScore += r.totalScore;
      return acc;
    }, {} as Record<string, { count: number; totalScore: number }>);

    const genderDistribution = Object.entries(genderStats).map(([gender, stats]) => ({
      gender,
      count: stats.count,
      avgScore: Math.round(stats.totalScore / stats.count * 10) / 10,
    }));

    // 年龄分布（分组）
    const ageGroups = ['<18', '18-25', '26-35', '36-45', '46-60', '>60'];
    const ageStats: Record<string, { count: number; totalScore: number }> = {};

    records.forEach(r => {
      let group = '>60';
      if (r.age < 18) group = '<18';
      else if (r.age <= 25) group = '18-25';
      else if (r.age <= 35) group = '26-35';
      else if (r.age <= 45) group = '36-45';
      else if (r.age <= 60) group = '46-60';

      if (!ageStats[group]) {
        ageStats[group] = { count: 0, totalScore: 0 };
      }
      ageStats[group].count++;
      ageStats[group].totalScore += r.totalScore;
    });

    const ageDistribution = ageGroups
      .filter(group => ageStats[group])
      .map(group => ({
        ageGroup: group,
        count: ageStats[group].count,
        avgScore: Math.round(ageStats[group].totalScore / ageStats[group].count * 10) / 10,
      }));

    return NextResponse.json({
      success: true,
      data: {
        scaleId,
        totalCount: records.length,
        avgScore: Math.round(avgScore * 10) / 10,
        genderDistribution,
        ageDistribution,
        latestRecords: records.slice(-10).reverse(), // 最近10条记录
      },
    });
  } catch (error) {
    console.error('[Analytics] 获取统计数据失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
