import { QuizTemplate, QuizResult, UserAnswer } from '@/types/quiz';
import { scl90 } from './scl90';
import { ani } from './ani';
import { essScale } from './ess';
import { ini } from './ini';

// 所有可用的量表
const scales: QuizTemplate[] = [
  essScale,
  ini,
  ani,
  scl90,
];

// 获取所有量表列表
export function getScaleList(): QuizTemplate[] {
  return scales;
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
  const { min, max } = scale.scoring.scaleRange;
  return Math.round(((rawScore - min) / (max - min)) * 100);
}

// 获取分数对应的等级
export function getScoreLevel(scale: QuizTemplate, score: number) {
  const range = scale.scoring.ranges.find(r => score >= r.min && score <= r.max);
  return range || scale.scoring.ranges[0];
}

// 计算维度归一化分数
export function normalizeDimensionScore(dimensionScore: number, questionCount: number): number {
  // 每题1-5分，归一化到0-100
  const min = questionCount * 1;
  const max = questionCount * 5;
  return Math.round(((dimensionScore - min) / (max - min)) * 100);
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
