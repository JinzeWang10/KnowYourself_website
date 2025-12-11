import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { applyRateLimit, RATE_LIMITS, getRateLimitHeaders } from '@/lib/rate-limiter';
import { validateId, validateScore, createValidationErrorResponse } from '@/lib/input-validator';

/**
 * GET /api/percentile?scaleId=xxx&score=yyy
 * 计算用户得分的百分位排名
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
    const scoreParam = searchParams.get('score');

    if (!scaleId || !scoreParam) {
      return createValidationErrorResponse('缺少必要参数');
    }

    // 验证 scaleId 格式
    if (!validateId(scaleId)) {
      return createValidationErrorResponse('scaleId 格式无效');
    }

    const score = parseFloat(scoreParam);
    if (isNaN(score) || !validateScore(score)) {
      return createValidationErrorResponse('分数格式无效');
    }

    // 从数据库查询该量表的所有历史得分
    const totalCount = await prisma.assessmentRecord.count({
      where: { scaleId },
    });

    if (totalCount < 10) {
      // 样本量过小，不提供百分位
      return NextResponse.json({
        success: true,
        data: {
          percentile: null,
          totalCount,
          message: '样本量不足，暂无百分位数据',
        },
      });
    }

    // 计算有多少记录的分数低于当前分数
    const lowerCount = await prisma.assessmentRecord.count({
      where: {
        scaleId,
        totalScore: {
          lt: score,
        },
      },
    });

    // 计算百分位（低于该分数的记录占比）
    const percentile = Math.round((lowerCount / totalCount) * 100);

    // 添加速率限制响应头
    const rateLimitHeaders = getRateLimitHeaders(request, RATE_LIMITS.GET);

    return NextResponse.json(
      {
        success: true,
        data: {
          percentile,
          totalCount,
          higherCount: totalCount - lowerCount,
          lowerCount,
        },
      },
      {
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    console.error('[Percentile] 计算百分位失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

// POST 方法已废弃，因为记录已通过 /api/assessments 直接保存到数据库
// 百分位计算现在直接查询数据库，无需单独存储
