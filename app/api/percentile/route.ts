import { NextRequest, NextResponse } from 'next/server';

// 临时使用内存存储（应与 assessments API 共享数据源）
// 生产环境应使用数据库
interface StoredRecord {
  scaleId: string;
  totalScore: number;
}

// 临时存储，实际应从数据库读取
let scoreRecords: StoredRecord[] = [];

/**
 * GET /api/percentile?scaleId=xxx&score=yyy
 * 计算用户得分的百分位排名
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scaleId = searchParams.get('scaleId');
    const scoreParam = searchParams.get('score');

    if (!scaleId || !scoreParam) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const score = parseFloat(scoreParam);
    if (isNaN(score)) {
      return NextResponse.json(
        { success: false, error: '分数格式无效' },
        { status: 400 }
      );
    }

    // 获取该量表的所有历史得分
    // TODO: 从数据库查询
    const scaleRecords = scoreRecords.filter(r => r.scaleId === scaleId);

    if (scaleRecords.length < 10) {
      // 样本量过小，不提供百分位
      return NextResponse.json({
        success: true,
        data: {
          percentile: null,
          totalCount: scaleRecords.length,
          message: '样本量不足，暂无百分位数据',
        },
      });
    }

    // 计算百分位
    const lowerCount = scaleRecords.filter(r => r.totalScore < score).length;
    const totalCount = scaleRecords.length;
    const percentile = Math.round((lowerCount / totalCount) * 100);

    return NextResponse.json({
      success: true,
      data: {
        percentile,
        totalCount,
        higherCount: totalCount - lowerCount,
        lowerCount,
      },
    });
  } catch (error) {
    console.error('[Percentile] 计算百分位失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/percentile
 * 添加得分记录（供内部调用）
 */
export async function POST(request: NextRequest) {
  try {
    const data: StoredRecord = await request.json();

    if (!data.scaleId || data.totalScore === undefined) {
      return NextResponse.json(
        { success: false, error: '缺少必要字段' },
        { status: 400 }
      );
    }

    // 存储记录
    scoreRecords.push(data);

    return NextResponse.json({
      success: true,
      message: '得分记录已添加',
    });
  } catch (error) {
    console.error('[Percentile] 添加得分记录失败:', error);
    return NextResponse.json(
      { success: false, error: '服务器错误' },
      { status: 500 }
    );
  }
}
