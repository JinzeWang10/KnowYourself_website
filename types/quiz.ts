// 量表问题类型
export interface QuizQuestion {
  id: string;
  type: 'single' | 'multiple' | 'scale' | 'text';
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
  duration: number;
  questionCount: number;
  questions: QuizQuestion[];
  dimensions?: ScaleDimension[];
  scoring: {
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
  report?: {
    summary: string;
    details: string[];
    recommendations: string[];
  };
}

// 用户信息
export interface UserInfo {
  gender: 'male' | 'female';
  age: number;
  timestamp: number;
}
