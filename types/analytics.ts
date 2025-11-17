// 后台统计分析相关类型

// 匿名用户信息
export interface AnonymousUser {
  id: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  age: number;
  region?: string;
  createdAt: string;
  updatedAt: string;
}

// 测评记录（提交到后台）
export interface AssessmentRecord {
  // 基本信息
  id: string;
  userId: string; // 关联用户 ID
  scaleId: string;
  scaleTitle: string;

  // 测评结果
  totalScore: number;
  normalizedScore: number;
  level: string;
  dimensionScores?: Record<string, number>;

  // 时间信息
  completedAt: string; // ISO 8601 格式
  duration?: number; // 测评用时（秒）

  // 答题记录
  answers: Array<{
    questionId: string;
    answer: number | string;
  }>;
}

// 用于前端提交的完整数据（包含用户信息）
export interface AssessmentSubmission {
  // 用户信息
  userId: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  age: number;
  region?: string;

  // 测评记录
  record: AssessmentRecord;
}

// 统计数据响应
export interface AnalyticsStats {
  scaleId: string;
  totalCount: number;
  avgScore: number;
  scoreDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  genderDistribution: {
    gender: string;
    count: number;
    avgScore: number;
  }[];
  ageDistribution: {
    ageGroup: string;
    count: number;
    avgScore: number;
  }[];
}

// 百分位计算请求
export interface PercentileRequest {
  scaleId: string;
  score: number;
}

// 百分位计算响应
export interface PercentileResponse {
  percentile: number; // 0-100
  totalCount: number;
  higherCount: number;
  lowerCount: number;
}
