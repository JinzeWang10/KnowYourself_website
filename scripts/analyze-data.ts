/**
 * 数据库数据分析脚本
 * 分析测评参与情况、用户分布、活跃度等统计信息
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

async function analyzeScaleStats(): Promise<ScaleStats[]> {
  console.log('\n📊 分析各个测评的参与情况...\n');

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
  const stats: ScaleStats[] = [];

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

    stats.push({
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
  stats.sort((a, b) => b.count - a.count);

  // 打印结果
  stats.forEach((stat, index) => {
    console.log(`${index + 1}. ${stat.scaleTitle} (${stat.scaleId})`);
    console.log(`   参与人数: ${stat.count}`);
    console.log(`   性别分布: 男 ${stat.genderDistribution.male}, 女 ${stat.genderDistribution.female}, 其他 ${stat.genderDistribution.other}, 不愿透露 ${stat.genderDistribution.prefer_not_to_say}`);
    console.log(`   年龄范围: ${stat.ageDistribution.min}-${stat.ageDistribution.max} 岁 (平均 ${stat.ageDistribution.avg} 岁)`);
    console.log(`   年龄分布:`);
    Object.entries(stat.ageDistribution.ranges).forEach(([range, count]) => {
      if (count > 0) {
        console.log(`     ${range}岁: ${count}`);
      }
    });
    console.log('');
  });

  return stats;
}

async function analyzeUserTypes(): Promise<UserTypeStats[]> {
  console.log('\n👥 分析不同类型用户的测评情况...\n');

  // 获取所有用户及其测评记录
  const users = await prisma.anonymousUser.findMany({
    include: {
      assessments: true,
    },
  });

  // 按测评数量分组用户
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

  // 计算统计
  const stats: UserTypeStats[] = [];
  const typeOrder = ['未完成测评', '完成1次', '完成2-3次', '完成4-5次', '完成6-10次', '完成10次以上'];

  typeOrder.forEach(type => {
    const users = userTypeMap.get(type) || [];
    if (users.length === 0) return;

    const totalAssessments = users.reduce((sum, u) => sum + u.assessments.length, 0);
    const avgAssessments = users.length > 0 ? totalAssessments / users.length : 0;

    stats.push({
      userType: type,
      userCount: users.length,
      avgAssessments: Math.round(avgAssessments * 10) / 10,
      totalAssessments,
    });

    console.log(`${type}:`);
    console.log(`  用户数: ${users.length}`);
    console.log(`  平均测评数: ${avgAssessments.toFixed(1)}`);
    console.log(`  总测评数: ${totalAssessments}`);
    console.log('');
  });

  return stats;
}

async function analyzeFavoriteScales(): Promise<void> {
  console.log('\n⭐ 分析最受欢迎的测评类型...\n');

  // 按量表统计参与人数
  const scaleStats = await prisma.assessmentRecord.groupBy({
    by: ['scaleId', 'scaleTitle'],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
  });

  console.log('测评受欢迎程度排名:');
  scaleStats.forEach((stat, index) => {
    console.log(`${index + 1}. ${stat.scaleTitle}: ${stat._count.id} 次测评`);
  });
}

async function analyzeRecentActivity(): Promise<RecentActivity> {
  console.log('\n📈 分析最近24小时的活跃情况...\n');

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  // 新增用户数
  const newUsers = await prisma.anonymousUser.count({
    where: {
      createdAt: {
        gte: yesterday,
      },
    },
  });

  console.log(`新增用户: ${newUsers}`);
  console.log('');

  // 各测评新增记录数
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

  console.log('各测评新增记录数:');
  scaleRecords.forEach(stat => {
    console.log(`  ${stat.scaleTitle}: ${stat.newRecords} 条`);
  });

  if (scaleRecords.length === 0) {
    console.log('  (暂无新增记录)');
  }

  return {
    newUsers,
    scaleRecords,
  };
}

async function analyzeOverallStats(): Promise<void> {
  console.log('\n📋 总体统计信息...\n');

  const totalUsers = await prisma.anonymousUser.count();
  const totalRecords = await prisma.assessmentRecord.count();
  const avgRecordsPerUser = totalUsers > 0 ? totalRecords / totalUsers : 0;

  console.log(`总用户数: ${totalUsers}`);
  console.log(`总测评记录数: ${totalRecords}`);
  console.log(`平均每用户测评数: ${avgRecordsPerUser.toFixed(2)}`);
}

async function main() {
  console.log('═══════════════════════════════════════════════════');
  console.log('   测评数据分析报告');
  console.log('═══════════════════════════════════════════════════');

  try {
    await analyzeOverallStats();
    await analyzeScaleStats();
    await analyzeUserTypes();
    await analyzeFavoriteScales();
    await analyzeRecentActivity();

    console.log('\n═══════════════════════════════════════════════════');
    console.log('   分析完成 ✓');
    console.log('═══════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('分析过程中出现错误:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
