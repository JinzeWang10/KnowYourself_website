// 量表问题类型
export interface QuizQuestion {
  id: string;
  type: 'single' | 'multiple' | 'scale' | 'text' | 'likert';
  question: string;
  dimension?: string;
  options: QuizOption[];
  required?: boolean;
  reversed?: boolean;
}

// 问题选项
export interface QuizOption {
  value: number;
  label: string;
  scores?: Record<string, number>; // 部分维度的贡献值（0-1之间），只定义选项影响的维度
  [key: string]: any; // 允许其他扩展字段
}

// 量表维度
export interface ScaleDimension {
  id: string;
  name: string;
  description: string;
  questionIds: string[];
}

// 评分范围
export interface ScoreRange {
  min: number;
  max: number;
  level: string;
  description: string;
  color: string;
  psychologicalTraits?: string; // 心理特征
  suggestions?: string[];
}

// 参考文献
export interface Reference {
  title: string;
  // authors/year may be absent for simplified reference entries
  authors?: string;
  journal?: string;
  year?: number;
  doi?: string;
  // 可选的补充字段：卷号、页码或简化内容描述
  volume?: string | number;
  pages?: string;
  content?: string;
}

// 量表模板
export interface QuizTemplate {
  id: string;
  title: string;
  titleEn?: string;
  description: string;
  category: string;
  purpose: string;
  duration: string; // 时间范围，如 "5-7分钟"
  questionCount: number;
  questions: QuizQuestion[];
  dimensions?: ScaleDimension[];
  scoring?: {
    method?: 'sum' | 'average' | 'dimension' | 'custom';
    scaleRange: {
      min: number;
      max: number;
      description: string;
    };
    ranges: ScoreRange[];
  };
  references?: Reference[];
  instructions?: string;
  // 自定义计算函数（可选）
  calculateResults?: (answers: Record<string, number>) => {
    totalScore: number;
    dimensionScores?: Array<{ dimension: string; score: number }>;
    interpretation: string;
    recommendations?: string[];
    metadata?: any;
  };
}

// 用户答案
export interface UserAnswer {
  questionId: string;
  answer: number;
}

// 测评结果
export interface QuizResult {
  id: string;
  quizId: string;
  quizTitle: string;
  score: number;
  normalizedScore?: number;
  level: string;
  completedAt: Date;
  answers: UserAnswer[];
  dimensionScores?: Record<string, number>;
  interpretation?: string; // 结果解读（用于自定义计算的量表）
  report?: {
    summary: string;
    details: string[];
    recommendations: string[];
  };
  metadata?: any; // 用于存储量表特定的额外数据（如ZHZ的角色匹配信息）
}

// 用户信息
export interface UserInfo {
  gender: 'male' | 'female';
  age: number;
  timestamp: number;
}
