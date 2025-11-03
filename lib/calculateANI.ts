/**
 * ANI (Abstinence Necessity Index) 计算逻辑
 *
 * ANI由4个维度加权计算得出：
 * - HBI 负面后果维度: 25%
 * - PPUS 功能损害维度: 30%
 * - PPCS 复发+戒断维度: 30%
 * - R-MSGS 性罪恶感: 15%
 */

/**
 * 归一化函数：将原始得分转换到0-100范围
 */
function normalize(score: number, min: number, max: number): number {
  if (max === min) return 0;
  const normalized = ((score - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, normalized)); // 确保在0-100范围内
}

/**
 * ANI维度得分接口
 */
export interface ANIDimensionScores {
  hbi_consequences: {
    raw: number;
    normalized: number;
    weight: number;
  };
  ppus_functional: {
    raw: number;
    normalized: number;
    weight: number;
  };
  ppcs_relapse_withdrawal: {
    raw: number;
    normalized: number;
    weight: number;
  };
  rmsgs_guilt: {
    raw: number;
    normalized: number;
    weight: number;
  };
}

/**
 * ANI计算结果接口
 */
export interface ANIResult {
  totalScore: number; // 0-100范围的ANI总分
  level: string; // 等级名称
  levelColor: string; // 等级对应颜色
  levelDescription: string; // 等级描述
  suggestions: string[]; // 建议列表
  dimensionScores: ANIDimensionScores; // 各维度详细得分
}

/**
 * 计算ANI指数
 *
 * @param answers - 用户答案对象 {questionId: value}
 * @returns ANI计算结果
 */
export function calculateANI(answers: Record<string, number | string>): ANIResult {
  // ========== 1. 计算各维度原始得分 ==========

  // HBI 负面后果维度 (5题，每题1-5分，总分5-25)
  const hbiQuestions = ['hbi_q11', 'hbi_q12', 'hbi_q13', 'hbi_q14', 'hbi_q15'];
  const hbiRaw = hbiQuestions.reduce((sum, qId) => {
    const answer = answers[qId];
    return sum + (typeof answer === 'number' ? answer : 0);
  }, 0);
  const hbiNormalized = normalize(hbiRaw, 5, 25);

  // PPUS 功能损害维度 (3题，每题0-5分，总分0-15)
  const ppusQuestions = ['ppus_q1', 'ppus_q2', 'ppus_q3'];
  const ppusRaw = ppusQuestions.reduce((sum, qId) => {
    const answer = answers[qId];
    return sum + (typeof answer === 'number' ? answer : 0);
  }, 0);
  const ppusNormalized = normalize(ppusRaw, 0, 15);

  // PPCS 复发维度 (3题，每题1-7分，总分3-21)
  const ppcsRelapseQuestions = ['ppcs_q5', 'ppcs_q11', 'ppcs_q17'];
  const ppcsRelapseRaw = ppcsRelapseQuestions.reduce((sum, qId) => {
    const answer = answers[qId];
    return sum + (typeof answer === 'number' ? answer : 0);
  }, 0);
  const ppcsRelapseNormalized = normalize(ppcsRelapseRaw, 3, 21);

  // PPCS 戒断维度 (3题，每题1-7分，总分3-21)
  const ppcsWithdrawalQuestions = ['ppcs_q6', 'ppcs_q12', 'ppcs_q18'];
  const ppcsWithdrawalRaw = ppcsWithdrawalQuestions.reduce((sum, qId) => {
    const answer = answers[qId];
    return sum + (typeof answer === 'number' ? answer : 0);
  }, 0);
  const ppcsWithdrawalNormalized = normalize(ppcsWithdrawalRaw, 3, 21);

  // PPCS 综合 (复发+戒断的平均值)
  const ppcsNormalized = (ppcsRelapseNormalized + ppcsWithdrawalNormalized) / 2;
  const ppcsRaw = ppcsRelapseRaw + ppcsWithdrawalRaw;

  // R-MSGS 性罪恶感 (19题，每题1-7分，总分19-133)
  const rmsgQuestions = [
    'rmsgs_q1', 'rmsgs_q2', 'rmsgs_q3', 'rmsgs_q4', 'rmsgs_q5',
    'rmsgs_q6', 'rmsgs_q7', 'rmsgs_q8', 'rmsgs_q9', 'rmsgs_q10',
    'rmsgs_q11', 'rmsgs_q12', 'rmsgs_q13', 'rmsgs_q14', 'rmsgs_q15',
    'rmsgs_q16', 'rmsgs_q17', 'rmsgs_q18', 'rmsgs_q19',
  ];
  const rmsgRaw = rmsgQuestions.reduce((sum, qId) => {
    const answer = answers[qId];
    return sum + (typeof answer === 'number' ? answer : 0);
  }, 0);
  const rmsgNormalized = normalize(rmsgRaw, 19, 133);

  // ========== 2. 计算加权ANI总分 ==========

  const weights = {
    hbi: 0.25,
    ppus: 0.30,
    ppcs: 0.30,
    rmsg: 0.15,
  };

  const aniScore =
    hbiNormalized * weights.hbi +
    ppusNormalized * weights.ppus +
    ppcsNormalized * weights.ppcs +
    rmsgNormalized * weights.rmsg;

  const totalScore = Math.round(aniScore * 10) / 10; // 保留一位小数

  // ========== 3. 确定等级 ==========

  let level = '';
  let levelColor = '';
  let levelDescription = '';
  let suggestions: string[] = [];

  if (totalScore <= 25) {
    level = '低戒断必要性';
    levelColor = '#10b981'; // green
    levelDescription = '你的色情使用处于低风险范围，目前没有明显的问题性使用迹象。虽然可能偶尔使用色情内容，但这并未对你的生活、工作或人际关系造成显著负面影响，也没有出现明显的失控感或戒断困难。';
    suggestions = [
      '保持健康的生活方式和多元化的娱乐活动',
      '继续关注自己的使用频率，避免形成依赖习惯',
      '培养其他健康的压力释放方式（运动、社交、兴趣爱好）',
      '如果使用频率开始增加，及时进行自我调整',
      '定期进行自我评估，保持觉察',
    ];
  } else if (totalScore <= 50) {
    level = '中等戒断必要性';
    levelColor = '#f59e0b'; // amber
    levelDescription = '你的色情使用开始显现出一些问题倾向，可能在某些方面已经对生活产生了轻度影响。你可能经历过一些戒断尝试的失败，或在某些情况下感到一定程度的内疚和冲突。这个阶段是开始关注和调整使用习惯的重要时机。';
    suggestions = [
      '建议开始有意识地限制色情内容的使用频率',
      '设定明确的使用规则和时间限制',
      '识别触发使用的情境和情绪，寻找替代应对方式',
      '考虑使用内容过滤软件或问责应用',
      '加入支持小组或在线社区获取同伴支持',
      '培养新的兴趣爱好来填补时间和精力',
      '如果问题持续或加重，建议寻求专业心理咨询',
    ];
  } else if (totalScore <= 75) {
    level = '高戒断必要性';
    levelColor = '#f97316'; // orange
    levelDescription = '你的色情使用已经达到需要认真对待的程度。它可能已经对你的工作效率、人际关系、心理健康或日常功能造成了明显的负面影响。你可能多次尝试戒断但反复失败，或在无法使用时出现明显的戒断症状。你的价值观可能与使用行为产生了强烈冲突，导致显著的心理痛苦。';
    suggestions = [
      '强烈建议寻求专业心理咨询或性治疗师的帮助',
      '制定详细的戒断计划，设定清晰的阶段性目标',
      '考虑认知行为疗法（CBT）或接纳承诺疗法（ACT）',
      '建立问责系统：向信任的朋友或治疗师汇报进度',
      '使用内容过滤和监控软件，创建安全的数字环境',
      '加入专业指导的戒断支持小组',
      '处理可能存在的共病问题（焦虑、抑郁、创伤等）',
      '改善整体生活质量：规律作息、健康饮食、定期运动',
    ];
  } else {
    level = '紧急戒断必要性';
    levelColor = '#ef4444'; // red
    levelDescription = '你的色情使用已经达到严重程度，可能符合临床诊断标准。它已经严重影响了你的生活质量、社会功能、人际关系或身心健康。你可能经历了严重的负面后果（如关系破裂、工作/学业问题、法律或经济困境），但仍然难以停止。戒断尝试屡次失败，戒断症状明显，价值观冲突极其强烈。这种情况需要立即采取行动，寻求专业干预。';
    suggestions = [
      '请立即寻求专业帮助：联系精神科医生或临床心理学家',
      '可能需要密集的门诊治疗或结构化的康复计划',
      '考虑参加专业的成瘾治疗项目或住院治疗（如情况严重）',
      '全面评估心理健康状况，排查共病（ADHD、双相障碍、创伤等）',
      '考虑药物治疗配合心理治疗（如SSRIs，需医生评估）',
      '制定详细的危机干预计划，识别高风险情境',
      '告知信任的家人或朋友，建立支持网络',
      '加入专业指导的密集治疗小组或康复项目',
      '评估和治疗其他成瘾问题（酒精、药物、赌博等）',
      '彻底重建生活结构：作息、环境、社交圈、职业规划',
      '学习健康的情绪调节和压力管理技能',
      '考虑暂时改变生活环境或数字使用习惯（如断网、换手机等）',
    ];
  }

  // ========== 4. 构建返回结果 ==========

  return {
    totalScore,
    level,
    levelColor,
    levelDescription,
    suggestions,
    dimensionScores: {
      hbi_consequences: {
        raw: hbiRaw,
        normalized: Math.round(hbiNormalized * 10) / 10,
        weight: weights.hbi,
      },
      ppus_functional: {
        raw: ppusRaw,
        normalized: Math.round(ppusNormalized * 10) / 10,
        weight: weights.ppus,
      },
      ppcs_relapse_withdrawal: {
        raw: ppcsRaw,
        normalized: Math.round(ppcsNormalized * 10) / 10,
        weight: weights.ppcs,
      },
      rmsgs_guilt: {
        raw: rmsgRaw,
        normalized: Math.round(rmsgNormalized * 10) / 10,
        weight: weights.rmsg,
      },
    },
  };
}
