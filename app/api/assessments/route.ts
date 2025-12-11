import { NextRequest, NextResponse } from 'next/server';
import type { AssessmentSubmission } from '@/types/analytics';
import { prisma } from '@/lib/prisma';
import { applyRateLimit, RATE_LIMITS, getRateLimitHeaders } from '@/lib/rate-limiter';
import {
  validateRequestBody,
  validateAge,
  validateGender,
  validateScore,
  validateId,
  validateJSONSafety,
  createValidationErrorResponse,
} from '@/lib/input-validator';

/**
 * POST /api/assessments
 * 提交测评记录到后台
 */
export async function POST(request: NextRequest) {
  // 应用速率限制
  const rateLimitResponse = applyRateLimit(request, RATE_LIMITS.POST);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // 验证并解析请求体
    let data: AssessmentSubmission;
    try {
      data = (await validateRequestBody(request)) as AssessmentSubmission;
    } catch (error) {
      const message = error instanceof Error ? error.message : '数据验证失败';
      return createValidationErrorResponse(message);
    }

    const { userId, gender, age, region, record } = data;

    // 严格的数据验证
    if (!userId || !record.scaleId || !gender || !age || record.totalScore === undefined || !record.answers) {
      return createValidationErrorResponse('缺少必要字段');
    }

    // 验证 userId 格式
    if (!validateId(userId)) {
      return createValidationErrorResponse('userId 格式无效');
    }

    // 验证 scaleId 格式
    if (!validateId(record.scaleId)) {
      return createValidationErrorResponse('scaleId 格式无效');
    }

    // 验证性别
    if (!validateGender(gender)) {
      return createValidationErrorResponse('性别值无效');
    }

    // 验证年龄
    if (!validateAge(age)) {
      return createValidationErrorResponse('年龄范围无效（1-120）');
    }

    // 验证分数
    if (!validateScore(record.totalScore)) {
      return createValidationErrorResponse('totalScore 无效');
    }

    if (record.normalizedScore !== undefined && !validateScore(record.normalizedScore)) {
      return createValidationErrorResponse('normalizedScore 无效');
    }

    // 验证 answers 格式
    if (!Array.isArray(record.answers) || record.answers.length === 0) {
      return createValidationErrorResponse('answers 必须是非空数组');
    }

    // 验证 answers 内容安全性
    const answersValidation = validateJSONSafety(record.answers);
    if (!answersValidation.valid) {
      return createValidationErrorResponse(answersValidation.error || 'answers 数据不安全');
    }

    // 验证 dimensionScores（如果存在）
    if (record.dimensionScores) {
      const dimensionValidation = validateJSONSafety(record.dimensionScores);
      if (!dimensionValidation.valid) {
        return createValidationErrorResponse(dimensionValidation.error || 'dimensionScores 数据不安全');
      }
    }

    // 强制使用服务器时间（忽略客户端提交的时间）
    const serverTime = new Date();
    const completedAt = serverTime.toISOString();
    record.completedAt = completedAt;

    // 生成唯一ID（如果未提供）
    if (!record.id) {
      record.id = `record-${Date.now()}-${crypto.randomUUID()}`;
    }

    // 检查是否已存在相同 ID 的记录（防止重复提交）
    const existingRecord = await prisma.assessmentRecord.findUnique({
      where: { id: record.id },
    });

    if (existingRecord) {
      console.log(`[Analytics] 记录已存在，忽略重复提交: ${record.id}`);
      return NextResponse.json({
        success: true,
        message: '记录已存在',
        recordId: existingRecord.id,
        duplicate: true,
      });
    }

    // 使用事务确保用户和测评记录一起创建/更新
    const result = await prisma.$transaction(async (tx) => {
      // 1. 创建或更新用户信息
      const user = await tx.anonymousUser.upsert({
        where: { id: userId },
        create: {
          id: userId,
          gender,
          age,
          region: region || null,
        },
        update: {
          gender,
          age,
          region: region || null,
        },
      });

      // 2. 创建测评记录
      const assessmentRecord = await tx.assessmentRecord.create({
        data: {
          id: record.id,
          user: {
            connect: { id: user.id }
          },
          scaleId: record.scaleId,
          scaleTitle: record.scaleTitle,
          totalScore: record.totalScore,
          normalizedScore: record.normalizedScore,
          level: record.level,
          dimensionScores: record.dimensionScores || undefined,
          answers: record.answers,
          completedAt: new Date(completedAt),
          duration: record.duration || null,
        },
      });

      return { user, record: assessmentRecord };
    });

    console.log(`[Analytics] 新测评记录已保存: ${record.scaleId}, 用户: ${userId}, 性别: ${gender}, 年龄: ${age}, 得分: ${record.totalScore}`);

    // 添加速率限制响应头
    const rateLimitHeaders = getRateLimitHeaders(request, RATE_LIMITS.POST);

    return NextResponse.json(
      {
        success: true,
        message: '测评记录已保存',
        recordId: result.record.id,
      },
      {
        headers: rateLimitHeaders,
      }
    );
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
  // 应用速率限制
  const rateLimitResponse = applyRateLimit(request, RATE_LIMITS.GET);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const { searchParams } = new URL(request.url);
    const scaleId = searchParams.get('scaleId');

    if (!scaleId) {
      return NextResponse.json(
        { success: false, error: '缺少 scaleId 参数' },
        { status: 400 }
      );
    }

    // 验证 scaleId 格式
    if (!validateId(scaleId)) {
      return createValidationErrorResponse('scaleId 格式无效');
    }

    // 从数据库查询指定量表的记录（关联用户信息）
    // 限制查询数量，防止大量数据查询导致性能问题
    const records = await prisma.assessmentRecord.findMany({
      where: { scaleId },
      include: { user: true },
      orderBy: { completedAt: 'desc' },
      take: 10000, // 最多返回 10000 条记录
    });

    if (records.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          scaleId,
          totalCount: 0,
          avgScore: 0,
          genderDistribution: [],
          ageDistribution: [],
          latestRecords: [],
        },
      });
    }

    // 计算统计数据
    const totalScore = records.reduce((sum, r) => sum + r.totalScore, 0);
    const avgScore = totalScore / records.length;

    // 性别分布统计
    const genderStats = records.reduce((acc, r) => {
      const gender = r.user.gender;
      if (!acc[gender]) {
        acc[gender] = { count: 0, totalScore: 0 };
      }
      acc[gender].count++;
      acc[gender].totalScore += r.totalScore;
      return acc;
    }, {} as Record<string, { count: number; totalScore: number }>);

    const genderDistribution = Object.entries(genderStats).map(([gender, stats]) => ({
      gender,
      count: stats.count,
      avgScore: Math.round(stats.totalScore / stats.count * 10) / 10,
    }));

    // 年龄分布统计（分组）
    const ageGroups = ['<18', '18-25', '26-35', '36-45', '46-60', '>60'];
    const ageStats: Record<string, { count: number; totalScore: number }> = {};

    records.forEach(r => {
      const age = r.user.age;
      let group = '>60';
      if (age < 18) group = '<18';
      else if (age <= 25) group = '18-25';
      else if (age <= 35) group = '26-35';
      else if (age <= 45) group = '36-45';
      else if (age <= 60) group = '46-60';

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

    // 转换最近10条记录格式
    const latestRecords = records.slice(0, 10).map(r => ({
      id: r.id,
      userId: r.userId,
      scaleId: r.scaleId,
      scaleTitle: r.scaleTitle,
      totalScore: r.totalScore,
      normalizedScore: r.normalizedScore,
      level: r.level,
      dimensionScores: r.dimensionScores as Record<string, number> | undefined,
      completedAt: r.completedAt.toISOString(),
      duration: r.duration || undefined,
      // 用户信息
      gender: r.user.gender,
      age: r.user.age,
      region: r.user.region || undefined,
    }));

    // 添加速率限制响应头
    const rateLimitHeaders = getRateLimitHeaders(request, RATE_LIMITS.GET);

    return NextResponse.json(
      {
        success: true,
        data: {
          scaleId,
          totalCount: records.length,
          avgScore: Math.round(avgScore * 10) / 10,
          genderDistribution,
          ageDistribution,
          latestRecords,
        },
      },
      {
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    console.error('[Analytics] 获取统计数据失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
