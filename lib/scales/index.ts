import { QuizTemplate, QuizResult, UserAnswer } from '@/types/quiz';
import { scl90 } from './scl90';
import { ani } from './ani';
import { essScale } from './ess';
import { ini } from './ini';
import { pat } from './pat';
import { zhz } from './zhz';
import { eq } from './eq';
import { bes } from './bes';
import { workhorse } from './workhorse';
import { zootopia } from './zootopia';

// 所有可用的量表
const scales: QuizTemplate[] = [
  zootopia,
  zhz,
  workhorse,
  pat,
  eq,
  bes,
  essScale,
  ini,
  ani,
  scl90,
];

// 测评分类配置
export interface ScaleCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  scaleIds: string[];
}

export const SCALE_CATEGORIES: ScaleCategory[] = [
  {
    id: 'clinical',
    name: '心理健康',
    emoji: '📊',
    description: '评估情绪状态、饮食行为、成瘾倾向等心理健康相关指标',
    scaleIds: ['scl90', 'ess', 'bes', 'ani'],
  },
  {
    id: 'personality',
    name: '人格测评',
    emoji: '🧠',
    description: '了解人格特质、心理年龄、自我认知等内在特征',
    scaleIds: ['pat', 'zootopia', 'zhz'],
  },
  {
    id: 'career',
    name: '职场生活',
    emoji: '💼',
    description: '评估工作状态、职业倦怠等职场相关议题',
    scaleIds: ['workhorse'],
  },
  {
    id: 'relationship',
    name: '人际情感',
    emoji: '❤️',
    description: '测量共情能力、亲密关系需求等社交情感维度',
    scaleIds: ['eq', 'ini'],
  },
];

// 获取所有量表列表
export function getScaleList(): QuizTemplate[] {
  return scales;
}

// 获取按分类组织的量表列表
export function getScalesByCategory(): Array<{
  category: ScaleCategory;
  scales: QuizTemplate[];
}> {
  return SCALE_CATEGORIES.map(category => ({
    category,
    scales: scales.filter(scale => category.scaleIds.includes(scale.id)),
  }));
}

// 根据ID获取量表
export function getScaleById(id: string): QuizTemplate | undefined {
  return scales.find(scale => scale.id === id);
}

// 计算总分
export function calculateScore(scale: QuizTemplate, answers: Record<string, number>): number {
  let totalScore = 0;

  scale.questions.forEach(question => {
    const answer = answers[question.id];
    if (answer !== undefined) {
      // 处理反向计分（reversed = true）
      if (question.reversed) {
        // 5点Likert量表：1->5, 2->4, 3->3, 4->2, 5->1
        totalScore += (6 - answer);
      } else {
        totalScore += answer;
      }
    }
  });

  return totalScore;
}

// 计算维度分数
export function calculateDimensionScores(
  scale: QuizTemplate,
  answers: Record<string, number>
): Record<string, number> {
  const dimensionScores: Record<string, number> = {};

  if (!scale.dimensions) return dimensionScores;

  scale.dimensions.forEach(dimension => {
    let score = 0;
    dimension.questionIds.forEach(questionId => {
      const answer = answers[questionId];
      const question = scale.questions.find(q => q.id === questionId);

      if (answer !== undefined && question) {
        // 处理反向计分
        if (question.reversed) {
          score += (6 - answer);
        } else {
          score += answer;
        }
      }
    });
    dimensionScores[dimension.id] = score;
  });

  return dimensionScores;
}

// 归一化分数到0-100范围
export function normalizeScore(scale: QuizTemplate, rawScore: number): number {
  if (!scale.scoring) return rawScore;
  const { min, max } = scale.scoring.scaleRange;
  return Math.round(((rawScore - min) / (max - min)) * 100);
}

// 获取分数对应的等级
export function getScoreLevel(scale: QuizTemplate, score: number) {
  if (!scale.scoring || !scale.scoring.ranges) return undefined;
  const range = scale.scoring.ranges.find(r => score >= r.min && score <= r.max);
  return range || scale.scoring.ranges[0];
}

// 获取量表的分值范围（每题的最小和最大分）
export function getScaleScoreRange(scale: QuizTemplate): { min: number; max: number } {
  // 从第一个问题的选项中获取分值范围
  if (scale.questions.length > 0 && scale.questions[0].options) {
    const values = scale.questions[0].options.map(opt => opt.value as number);
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }
  // 默认为1-5分制
  return { min: 1, max: 5 };
}

// 计算维度归一化分数
export function normalizeDimensionScore(
  dimensionScore: number,
  questionCount: number,
  minPerQuestion: number = 1,
  maxPerQuestion: number = 5
): number {
  // 根据实际的分值范围归一化到0-100
  const min = questionCount * minPerQuestion;
  const max = questionCount * maxPerQuestion;
  const normalized = ((dimensionScore - min) / (max - min)) * 100;
  // 确保结果在0-100范围内
  return Math.round(Math.max(0, Math.min(100, normalized)));
}

// 保存测评结果到localStorage
export function saveResult(result: QuizResult): void {
  const history = getHistory();
  history.unshift(result);
  localStorage.setItem('quiz-history', JSON.stringify(history));
}

// 获取测评历史
export function getHistory(): QuizResult[] {
  if (typeof window === 'undefined') return [];

  const historyStr = localStorage.getItem('quiz-history');
  if (!historyStr) return [];

  try {
    const history = JSON.parse(historyStr);
    return history.map((item: any) => ({
      ...item,
      completedAt: new Date(item.completedAt)
    }));
  } catch {
    return [];
  }
}

// 根据ID获取测评结果
export function getResultById(resultId: string): QuizResult | undefined {
  const history = getHistory();
  return history.find(result => result.id === resultId);
}

// 清除测评进度
export function clearProgress(scaleId: string): void {
  localStorage.removeItem(`quiz-progress-${scaleId}`);
}

// 获取测评进度
export function getProgress(scaleId: string): { answers: Record<string, number>; currentIndex: number } | null {
  if (typeof window === 'undefined') return null;

  const progressStr = localStorage.getItem(`quiz-progress-${scaleId}`);
  if (!progressStr) return null;

  try {
    return JSON.parse(progressStr);
  } catch {
    return null;
  }
}
