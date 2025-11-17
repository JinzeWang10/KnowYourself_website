/**
 * API 客户端工具函数
 * 用于与后端 API 通信
 */

import type { AssessmentSubmission, AssessmentRecord } from '@/types/analytics';

/**
 * 提交测评记录到后台
 */
export async function submitAssessmentRecord(submission: AssessmentSubmission): Promise<{
  success: boolean;
  recordId?: string;
  error?: string;
  duplicate?: boolean;
}> {
  try {
    const response = await fetch('/api/assessments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submission),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('提交测评记录失败:', error);
    return {
      success: false,
      error: '网络错误',
    };
  }
}

/**
 * 获取百分位排名
 */
export async function getPercentileRank(
  scaleId: string,
  score: number
): Promise<{
  success: boolean;
  data?: {
    percentile: number | null;
    totalCount: number;
    higherCount?: number;
    lowerCount?: number;
    message?: string;
  };
  error?: string;
}> {
  try {
    const response = await fetch(
      `/api/percentile?scaleId=${encodeURIComponent(scaleId)}&score=${score}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取百分位失败:', error);
    return {
      success: false,
      error: '网络错误',
    };
  }
}

/**
 * 获取统计数据（管理员功能）
 */
export async function getAssessmentStats(scaleId: string): Promise<{
  success: boolean;
  data?: {
    scaleId: string;
    totalCount: number;
    avgScore: number;
    genderDistribution: Array<{
      gender: string;
      count: number;
      avgScore: number;
    }>;
    ageDistribution: Array<{
      ageGroup: string;
      count: number;
      avgScore: number;
    }>;
    latestRecords?: AssessmentRecord[];
  };
  error?: string;
}> {
  try {
    const response = await fetch(
      `/api/assessments?scaleId=${encodeURIComponent(scaleId)}`
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取统计数据失败:', error);
    return {
      success: false,
      error: '网络错误',
    };
  }
}
