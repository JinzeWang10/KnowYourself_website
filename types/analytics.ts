// 后台统计分析相关类型

// 测评记录（提交到后台）
export interface AssessmentRecord {
  // 基本信息
  id: string;
  scaleId: string;
  scaleTitle: string;

  // 用户信息（匿名化）
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  age: number;

  // 测评结果
  totalScore: number;
  normalizedScore: number;
  level: string;
  dimensionScores?: Record<string, number>;

  // 时间信息
  completedAt: string; // ISO 8601 格式
  duration?: number; // 测评用时（秒）

  // 可选：地理位置（仅国家/地区级别）
  region?: string;

  // 答题记录
  answers: Array<{
    questionId: string;
    answer: number | string;
  }>;
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
