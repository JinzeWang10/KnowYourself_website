import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyRateLimit, RATE_LIMITS, getRateLimitHeaders } from '@/lib/rate-limiter';

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

export async function GET(request: NextRequest) {
  // 应用速率限制（管理接口更严格）
  const rateLimitResponse = applyRateLimit(request, RATE_LIMITS.ADMIN);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // 总体统计
    const totalUsers = await prisma.anonymousUser.count();
    const totalRecords = await prisma.assessmentRecord.count();
    const avgRecordsPerUser = totalUsers > 0 ? totalRecords / totalUsers : 0;

    // 获取所有测评记录，包含用户信息
    const records = await prisma.assessmentRecord.findMany({
      include: {
        user: true,
      },
    });

    // 按量表分组统计
    const scaleMap = new Map<string, {
      title: string;
      records: typeof records;
    }>();

    records.forEach(record => {
      if (!scaleMap.has(record.scaleId)) {
        scaleMap.set(record.scaleId, {
          title: record.scaleTitle,
          records: [],
        });
      }
      scaleMap.get(record.scaleId)!.records.push(record);
    });

    // 计算每个量表的统计信息
    const scaleStats: ScaleStats[] = [];

    for (const [scaleId, data] of scaleMap) {
      const { title, records: scaleRecords } = data;

      // 性别分布
      const genderDistribution = {
        male: 0,
        female: 0,
        other: 0,
        prefer_not_to_say: 0,
      };

      scaleRecords.forEach(record => {
        const gender = record.user.gender as keyof typeof genderDistribution;
        if (gender in genderDistribution) {
          genderDistribution[gender]++;
        }
      });

      // 年龄分布
      const ages = scaleRecords.map(r => r.user.age);
      const ageRanges = {
        '0-17': 0,
        '18-24': 0,
        '25-34': 0,
        '35-44': 0,
        '45-54': 0,
        '55-64': 0,
        '65+': 0,
      };

      ages.forEach(age => {
        if (age < 18) ageRanges['0-17']++;
        else if (age <= 24) ageRanges['18-24']++;
        else if (age <= 34) ageRanges['25-34']++;
        else if (age <= 44) ageRanges['35-44']++;
        else if (age <= 54) ageRanges['45-54']++;
        else if (age <= 64) ageRanges['55-64']++;
        else ageRanges['65+']++;
      });

      scaleStats.push({
        scaleId,
        scaleTitle: title,
        count: scaleRecords.length,
        genderDistribution,
        ageDistribution: {
          min: Math.min(...ages),
          max: Math.max(...ages),
          avg: Math.round(ages.reduce((a, b) => a + b, 0) / ages.length),
          ranges: ageRanges,
        },
      });
    }

    // 按参与数量排序
    scaleStats.sort((a, b) => b.count - a.count);

    // 分析不同类型用户
    const users = await prisma.anonymousUser.findMany({
      include: {
        assessments: true,
      },
    });

    const userTypeMap = new Map<string, typeof users>();

    users.forEach(user => {
      const count = user.assessments.length;
      let type: string;

      if (count === 0) type = '未完成测评';
      else if (count === 1) type = '完成1次';
      else if (count <= 3) type = '完成2-3次';
      else if (count <= 5) type = '完成4-5次';
      else if (count <= 10) type = '完成6-10次';
      else type = '完成10次以上';

      if (!userTypeMap.has(type)) {
        userTypeMap.set(type, []);
      }
      userTypeMap.get(type)!.push(user);
    });

    const userTypes: UserTypeStats[] = [];
    const typeOrder = ['未完成测评', '完成1次', '完成2-3次', '完成4-5次', '完成6-10次', '完成10次以上'];

    typeOrder.forEach(type => {
      const users = userTypeMap.get(type) || [];
      if (users.length === 0) return;

      const totalAssessments = users.reduce((sum, u) => sum + u.assessments.length, 0);
      const avgAssessments = users.length > 0 ? totalAssessments / users.length : 0;

      userTypes.push({
        userType: type,
        userCount: users.length,
        avgAssessments: Math.round(avgAssessments * 10) / 10,
        totalAssessments,
      });
    });

    // 最近24小时活跃情况
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const newUsers = await prisma.anonymousUser.count({
      where: {
        createdAt: {
          gte: yesterday,
        },
      },
    });

    const recentRecords = await prisma.assessmentRecord.findMany({
      where: {
        completedAt: {
          gte: yesterday,
        },
      },
      select: {
        scaleId: true,
        scaleTitle: true,
      },
    });

    const scaleRecordsMap = new Map<string, { title: string; count: number }>();

    recentRecords.forEach(record => {
      if (!scaleRecordsMap.has(record.scaleId)) {
        scaleRecordsMap.set(record.scaleId, {
          title: record.scaleTitle,
          count: 0,
        });
      }
      scaleRecordsMap.get(record.scaleId)!.count++;
    });

    const scaleRecords = Array.from(scaleRecordsMap.entries())
      .map(([scaleId, data]) => ({
        scaleId,
        scaleTitle: data.title,
        newRecords: data.count,
      }))
      .sort((a, b) => b.newRecords - a.newRecords);

    const analyticsData: AnalyticsData = {
      overall: {
        totalUsers,
        totalRecords,
        avgRecordsPerUser: Math.round(avgRecordsPerUser * 100) / 100,
      },
      scaleStats,
      userTypes,
      recentActivity: {
        newUsers,
        scaleRecords,
      },
    };

    // 添加速率限制响应头
    const rateLimitHeaders = getRateLimitHeaders(request, RATE_LIMITS.ADMIN);

    return NextResponse.json(analyticsData, {
      headers: rateLimitHeaders,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
