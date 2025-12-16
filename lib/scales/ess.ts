import type { QuizTemplate } from '@/types/quiz';

/**
 * 情绪稳定性量表（Emotional Stability Scale, ESS）
 *
 * 目的：衡量个体的情绪稳定性，评估其在不同情境下的情绪反应、调节能力、压力应对以及情绪恢复能力
 *
 * 结构：4个维度，共20道题，5点Likert量表
 * - 维度一：情绪反应性（Emotional Reactivity）
 * - 维度二：情绪调节能力（Emotional Regulation）
 * - 维度三：压力应对（Stress Coping）
 * - 维度四：情绪回归速度（Emotional Recovery）
 */

export const essScale: QuizTemplate = {
  id: 'ess',
  title: '情绪稳定性量表',
  titleEn: 'Emotional Stability Scale (ESS)',
  description: '衡量个体的情绪稳定性，评估情绪反应、调节能力、压力应对以及情绪恢复能力',
  category: '情绪评估',
  purpose: '本量表旨在衡量个体的情绪稳定性，评估其在不同情境下的情绪反应、调节能力、压力应对以及情绪恢复能力。通过该量表可以了解个体在面对挑战和压力时的情绪波动及其调节能力。',
  duration: '5-7分钟',
  questionCount: 20,

  questions: [
    // 维度一：情绪反应性（Emotional Reactivity）- 题目1-5
    {
      id: 'ess_1',
      type: 'likert',
      question: '当我感到焦虑时，我很难集中注意力。',
      dimension: 'emotional_reactivity',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      reversed: true, // 负向题目，需要反向计分
    },
    {
      id: 'ess_2',
      type: 'likert',
      question: '面对负面事件时，我容易产生强烈的情绪反应。',
      dimension: 'emotional_reactivity',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      reversed: true, // 负向题目，需要反向计分
    },
    {
      id: 'ess_3',
      type: 'likert',
      question: '在压力大的情况下，我会感到情绪失控。',
      dimension: 'emotional_reactivity',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      reversed: true, // 负向题目，需要反向计分
    },
    {
      id: 'ess_4',
      type: 'likert',
      question: '即使是小小的挫折也能让我感到非常沮丧。',
      dimension: 'emotional_reactivity',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      reversed: true, // 负向题目，需要反向计分
    },
    {
      id: 'ess_5',
      type: 'likert',
      question: '在遭遇批评或拒绝时，我会感到极度不安或愤怒。',
      dimension: 'emotional_reactivity',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      reversed: true, // 负向题目，需要反向计分
    },

    // 维度二：情绪调节能力（Emotional Regulation）- 题目6-10
    {
      id: 'ess_6',
      type: 'likert',
      question: '当我感到愤怒时，我能通过改变思维方式来冷静自己。',
      dimension: 'emotional_regulation',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },
    {
      id: 'ess_7',
      type: 'likert',
      question: '当我感到沮丧时，我能找到积极的方式来改变我的情绪状态。',
      dimension: 'emotional_regulation',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },
    {
      id: 'ess_8',
      type: 'likert',
      question: '当我感到焦虑时，我能通过深呼吸或冥想来减轻情绪。',
      dimension: 'emotional_regulation',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },
    {
      id: 'ess_9',
      type: 'likert',
      question: '面对挑战时，我通常能控制自己的情绪反应。',
      dimension: 'emotional_regulation',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },
    {
      id: 'ess_10',
      type: 'likert',
      question: '即使我情绪低落，我也能找到方法提升自己的情绪。',
      dimension: 'emotional_regulation',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },

    // 维度三：压力应对（Stress Coping）- 题目11-15
    {
      id: 'ess_11',
      type: 'likert',
      question: '当我遇到压力时，我会主动采取行动解决问题。',
      dimension: 'stress_coping',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },
    {
      id: 'ess_12',
      type: 'likert',
      question: '面对工作中的挑战时，我能够保持冷静并进行理智决策。',
      dimension: 'stress_coping',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },
    {
      id: 'ess_13',
      type: 'likert',
      question: '我通常会寻求帮助来解决压力问题。',
      dimension: 'stress_coping',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },
    {
      id: 'ess_14',
      type: 'likert',
      question: '当生活压力增加时，我会找到方法缓解压力，而不是让它影响我的情绪。',
      dimension: 'stress_coping',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },
    {
      id: 'ess_15',
      type: 'likert',
      question: '我能够将压力看作一种挑战而不是威胁。',
      dimension: 'stress_coping',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },

    // 维度四：情绪回归速度（Emotional Recovery）- 题目16-20
    {
      id: 'ess_16',
      type: 'likert',
      question: '当我感到失落时，我能很快恢复积极的情绪。',
      dimension: 'emotional_recovery',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },
    {
      id: 'ess_17',
      type: 'likert',
      question: '即使我感到非常生气，我也能迅速让自己冷静下来。',
      dimension: 'emotional_recovery',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },
    {
      id: 'ess_18',
      type: 'likert',
      question: '经历情绪波动后，我能在很短时间内恢复到正常状态。',
      dimension: 'emotional_recovery',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },
    {
      id: 'ess_19',
      type: 'likert',
      question: '当我感到沮丧时，我通常能迅速从不愉快的情绪中恢复过来。',
      dimension: 'emotional_recovery',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },
    {
      id: 'ess_20',
      type: 'likert',
      question: '在面对负面情绪时，我能保持乐观并迅速摆脱不良情绪。',
      dimension: 'emotional_recovery',
      options: [
        { value: 1, label: '强烈不同意' },
        { value: 2, label: '不同意' },
        { value: 3, label: '中立' },
        { value: 4, label: '同意' },
        { value: 5, label: '强烈同意' },
      ],
      required: true,
      // 正向题目，不需要反向计分
    },
  ],

  dimensions: [
    {
      id: 'emotional_reactivity',
      name: '情绪反应性',
      description: '衡量个体对外部刺激的情绪反应强度。较高的情绪反应性意味着在面对压力时情绪波动较大，容易感到焦虑、沮丧或愤怒。得分越低（反向计分后），表示情绪反应越平稳。',
      questionIds: ['ess_1', 'ess_2', 'ess_3', 'ess_4', 'ess_5'],
    },
    {
      id: 'emotional_regulation',
      name: '情绪调节能力',
      description: '衡量个体对负面情绪的管理和调节能力。调节能力强的人能够有效控制情绪波动，维持情绪平衡。得分越高表示越能通过认知重评、正念等方式管理情绪。',
      questionIds: ['ess_6', 'ess_7', 'ess_8', 'ess_9', 'ess_10'],
    },
    {
      id: 'stress_coping',
      name: '压力应对',
      description: '衡量个体在面对压力时所采取的应对策略。较好的压力应对能力表明能够有效管理压力，采取问题导向的应对方式，而非回避或情绪化反应。',
      questionIds: ['ess_11', 'ess_12', 'ess_13', 'ess_14', 'ess_15'],
    },
    {
      id: 'emotional_recovery',
      name: '情绪回归速度',
      description: '衡量个体从情绪波动中恢复的速度。恢复得越快，情绪稳定性越高。得分高的人能够迅速从负面情绪中走出，重新获得积极状态。',
      questionIds: ['ess_16', 'ess_17', 'ess_18', 'ess_19', 'ess_20'],
    },
  ],

  scoring: {
    method: 'sum',
    scaleRange: {
      min: 20,
      max: 100,
      description: '总分范围为20-100分，得分越高表示情绪稳定性越高',
    },
    ranges: [
      {
        min: 80,
        max: 100,
        level: '高情绪稳定性',
        color: '#10b981',
        description: '您表现出极强的情绪调节能力，能够有效应对压力和挑战，情绪波动较小，通常能保持冷静和理性。在面对生活中的负面事件时，能够迅速调整情绪，恢复平衡。您在情绪管理、压力应对和情绪恢复方面表现得非常成熟，具有较强的心理韧性。通常能够采取有效的策略（如认知重评、积极应对等）来处理压力和负面情绪。',
        suggestions: [
          '继续保持情绪调节策略的应用，如保持日常的冥想、放松训练和情绪自我监控',
          '可以帮助他人提升情绪调节能力，成为周围人的情绪支持者',
          '关注情绪调节中的细节，不断反思和优化应对策略，避免情绪压抑或忽视自身需求',
        ],
      },
      {
        min: 60,
        max: 79,
        level: '中等情绪稳定性',
        color: '#3b82f6',
        description: '您具有一定的情绪调节能力，能够在大多数情境下保持较为平衡的情绪状态。然而，面临较大的压力或冲突时，情绪可能出现波动，恢复情绪的速度可能较慢。尽管如此，您仍然能够有效处理日常生活中的情绪挑战。在面对压力时可能会出现一些焦虑或烦躁情绪，但通常能够通过某些方式（如休息、与朋友交流等）恢复平静。',
        suggestions: [
          '增强情绪调节能力，可以尝试学习和应用更有效的情绪调节方法，如情绪重评和正念冥想',
          '在面对压力时，积极采取问题导向应对策略，解决问题而不是回避或过度情绪化',
          '提高情绪恢复力，学会接受挑战和压力，并快速调整自己的情绪反应',
        ],
      },
      {
        min: 40,
        max: 59,
        level: '低情绪稳定性',
        color: '#f59e0b',
        description: '您的情绪波动较大，容易受到外部压力和负面情绪的影响。情绪恢复较慢，在面对冲突、批评或生活中的不如意时，可能会产生较强的情绪反应，并且这些情绪难以快速平复。情绪的波动性可能会影响工作效率、人际关系和心理健康。您可能缺乏有效的情绪调节策略，对压力的应对方式较为消极，可能倾向于回避情绪问题或通过不健康的方式（如情绪抑制或自我指责）应对情绪困扰。',
        suggestions: [
          '学习并应用情绪调节策略，特别是认知重评、情绪自我觉察和放松技巧等',
          '在面对压力时，尽量避免情绪失控，尝试短时间内通过深呼吸、冥想或散步等方式冷静下来',
          '提升情绪恢复力，学会放松和恢复情绪，可以考虑参加情绪管理课程或心理辅导',
        ],
      },
      {
        min: 20,
        max: 39,
        level: '极低情绪稳定性',
        color: '#ef4444',
        description: '您的情绪反应过于强烈，且难以有效调节和管理。面对压力、批评或挑战时，情绪可能迅速失控，且情绪波动的恢复速度极慢。容易产生过度的焦虑、抑郁或愤怒情绪，影响日常功能和心理健康。长期处于情绪不稳定的状态可能导致心理健康问题加重。您可能缺乏足够的应对技能，面对生活中的不顺时容易陷入情绪困境。',
        suggestions: [
          '强烈建议尽快寻求专业心理咨询或治疗，帮助提升情绪调节能力',
          '练习基础的情绪调节方法，如每天记录情绪日记、练习自我接纳和情绪重评技巧',
          '学习并采纳更健康的应对策略，避免情绪逃避或过度压抑，学会接纳负面情绪并采取适当的行动',
        ],
      },
    ],
  },

  references: [
    {
      title: 'The NEO Personality Inventory-Revised (NEO-PI-R)',
      authors: 'Costa, P. T., & McCrae, R. R.',
      year: 1992,
      journal: '大五人格理论：情绪稳定性是大五人格模型中神经质维度的反面',
    },
    {
      title: 'Emotion regulation: Affective, cognitive, and social consequences',
      authors: 'Gross, J. J.',
      year: 2002,
      journal: 'Psychophysiology',
      doi: '10.1111/1469-8986.3930281',
    },
    {
      title: 'Stress, Appraisal, and Coping',
      authors: 'Lazarus, R. S., & Folkman, S.',
      year: 1984,
      journal: 'Springer Publishing',
    },
    {
      title: 'Resilient individuals use positive emotions to bounce back from negative emotional experiences',
      authors: 'Tugade, M. M., & Fredrickson, B. L.',
      year: 2004,
      journal: 'Journal of Personality and Social Psychology',
      doi: '10.1037/0022-3514.86.2.320',
    },
  ],
};
