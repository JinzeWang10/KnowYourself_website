/**
 * SCL-90 量表计算器
 * 包含总分、GSI、PST、PSDI、因子分等计算逻辑
 */

import { QuizTemplate } from '@/types/quiz';

export interface SCL90Scores {
  totalScore: number;
  gsi: number; // General Severity Index (总均分)
  pst: number; // Positive Symptom Total (阳性项目数)
  psdi: number; // Positive Symptom Distress Index (阳性症状均分)
  factorScores: Record<string, number>; // 各因子分
  isScreeningPositive: boolean; // 是否筛查阳性
  crisisWarnings: string[]; // 危机预警项
}

/**
 * 计算 SCL-90 完整分数
 */
export function calculateSCL90Scores(
  scale: QuizTemplate,
  answers: Record<string, number>
): SCL90Scores {
  // 1. 计算总分
  let totalScore = 0;
  let positiveCount = 0; // 阳性项目数（≥2分的项目）

  scale.questions.forEach(question => {
    const answer = answers[question.id];
    if (answer !== undefined) {
      totalScore += answer;
      if (answer >= 2) {
        positiveCount++;
      }
    }
  });

  // 2. 计算 GSI (总均分)
  const gsi = totalScore / 90;

  // 3. PST (阳性项目数)
  const pst = positiveCount;

  // 4. 计算 PSDI (阳性症状均分)
  const psdi = pst > 0 ? totalScore / pst : 0;

  // 5. 计算各因子分（因子均分）
  const factorScores: Record<string, number> = {};

  if (scale.dimensions) {
    scale.dimensions.forEach(dimension => {
      let dimensionTotal = 0;
      let dimensionCount = dimension.questionIds.length;

      dimension.questionIds.forEach(questionId => {
        const answer = answers[questionId];
        if (answer !== undefined) {
          dimensionTotal += answer;
        }
      });

      // 因子分 = 该因子各项分数之和 / 该因子项目数
      factorScores[dimension.id] = dimensionTotal / dimensionCount;
    });
  }

  // 6. 判断是否筛查阳性
  // 标准：总分 > 160 OR 任一因子分 ≥ 2 OR 阳性项目数 > 43
  const isScreeningPositive =
    totalScore > 160 ||
    Object.values(factorScores).some(score => score >= 2) ||
    pst > 43;

  // 7. 危机预警检测
  const crisisWarnings: string[] = [];

  // q15: 想结束自己的生命 (depression)
  if (answers['q15'] && answers['q15'] >= 3) {
    crisisWarnings.push('检测到自杀风险预警（q15评分≥3），建议立即寻求专业心理咨询或拨打心理危机热线');
  }

  // q59: 想到死亡的事 (other)
  if (answers['q59'] && answers['q59'] >= 3) {
    crisisWarnings.push('检测到死亡意念预警（q59评分≥3），建议寻求专业支持');
  }

  // q63: 有想打人或伤害他人的冲动 (hostility)
  if (answers['q63'] && answers['q63'] >= 3) {
    crisisWarnings.push('检测到暴力倾向预警（q63评分≥3），建议立即寻求专业帮助');
  }

  return {
    totalScore,
    gsi: Math.round(gsi * 100) / 100,
    pst,
    psdi: Math.round(psdi * 100) / 100,
    factorScores,
    isScreeningPositive,
    crisisWarnings,
  };
}

/**
 * 获取因子分等级描述
 */
export function getFactorLevel(factorScore: number): {
  level: string;
  color: string;
  description: string;
} {
  if (factorScore < 1.5) {
    return {
      level: '无症状',
      color: '#10b981',
      description: '该维度得分在正常范围内',
    };
  } else if (factorScore < 2) {
    return {
      level: '轻度',
      color: '#84cc16',
      description: '该维度存在轻微症状，建议关注',
    };
  } else if (factorScore < 3) {
    return {
      level: '中度',
      color: '#f59e0b',
      description: '该维度症状较为明显，建议寻求专业评估',
    };
  } else if (factorScore < 4) {
    return {
      level: '重度',
      color: '#ef4444',
      description: '该维度症状严重，强烈建议寻求专业帮助',
    };
  } else {
    return {
      level: '极重度',
      color: '#dc2626',
      description: '该维度症状极其严重，请立即寻求专业治疗',
    };
  }
}

/**
 * 获取 GSI 等级描述
 */
export function getGSILevel(gsi: number): {
  level: string;
  color: string;
  description: string;
} {
  if (gsi < 1.5) {
    return {
      level: '正常',
      color: '#10b981',
      description: '整体心理健康状况良好',
    };
  } else if (gsi < 2) {
    return {
      level: '轻度不适',
      color: '#84cc16',
      description: '存在轻微心理不适，建议自我调节',
    };
  } else if (gsi < 3) {
    return {
      level: '中度不适',
      color: '#f59e0b',
      description: '心理不适较为明显，建议寻求专业咨询',
    };
  } else {
    return {
      level: '严重不适',
      color: '#ef4444',
      description: '心理症状严重，强烈建议寻求专业治疗',
    };
  }
}

/**
 * 格式化因子分数用于雷达图
 */
export function formatFactorScoresForRadar(
  factorScores: Record<string, number>,
  dimensions: Array<{ id: string; name: string }>
): Array<{ dimension: string; score: number; maxScore: number }> {
  return dimensions.map(dim => ({
    dimension: dim.name,
    score: Math.round(factorScores[dim.id] * 100) / 100,
    maxScore: 5, // SCL-90 使用 1-5 分制
  }));
}
