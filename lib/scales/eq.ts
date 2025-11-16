/**
 * EQ: Empathy Quotient
 * 共情商数量表（社交理解与情感认知问卷）
 *
 * 评估个体的共情能力，包括认知共情、情绪共情和社交技能三个维度
 * 共 40 题，采用 Likert 4 点量表
 */

import type { QuizTemplate } from '@/types/quiz';

// 所有题目使用相同的选项标签
// value 使用 1-4 作为唯一标识，计分时根据正反向题转换
const POSITIVE_OPTIONS = [
  { value: 1, label: '强烈不同意' },
  { value: 2, label: '稍微不同意' },
  { value: 3, label: '稍微同意' },
  { value: 4, label: '强烈同意' },
];

const NEGATIVE_OPTIONS = [
  { value: 1, label: '强烈不同意' },
  { value: 2, label: '稍微不同意' },
  { value: 3, label: '稍微同意' },
  { value: 4, label: '强烈同意' },
];

export const eq: QuizTemplate = {
  id: 'eq',
  title: '共情商数量表',
  titleEn: 'Empathy Quotient (EQ)',
  description: '评估个体的共情能力，包括认知共情、情绪共情和社交技能三个维度',
  category: '社交与情感',
  purpose: '通过评估认知共情、情绪共情和社交技能，帮助了解个体在理解他人、感受他人情绪以及社交互动方面的能力',
  duration: '8-10分钟',
  questionCount: 40,

  questions: [
    // 题目 1 - 认知共情（正向）
    {
      id: 'eq_1',
      type: 'likert',
      question: '我能很容易判断别人是否想加入对话。',
      dimension: 'cognitive_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 2 - 社交技能（反向）
    {
      id: 'eq_2',
      type: 'likert',
      question: '当别人一开始不理解一件事时，我发现很难向他们解释。',
      dimension: 'social_skills',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 3 - 情绪共情（正向）
    {
      id: 'eq_3',
      type: 'likert',
      question: '我非常喜欢关心他人。',
      dimension: 'emotional_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 4 - 社交技能（反向）
    {
      id: 'eq_4',
      type: 'likert',
      question: '在社交场合，我常常不知道该做什么。',
      dimension: 'social_skills',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 5 - （反向）
    {
      id: 'eq_5',
      type: 'likert',
      question: '人们经常告诉我，在讨论中我过于强调自己的观点。',
      dimension: 'other',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 6 - （反向）
    {
      id: 'eq_6',
      type: 'likert',
      question: '如果我和朋友见面迟到了，我不会烦恼。',
      dimension: 'other',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 7 - 社交技能（反向）
    {
      id: 'eq_7',
      type: 'likert',
      question: '友谊和人际关系太复杂，所以我往往不去理会。',
      dimension: 'social_skills',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 8 - 社交技能（反向）
    {
      id: 'eq_8',
      type: 'likert',
      question: '我经常发现很难判断某件事是礼貌还是无礼。',
      dimension: 'social_skills',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 9 - （反向）
    {
      id: 'eq_9',
      type: 'likert',
      question: '在对话中，我倾向于关注自己的想法，而不是倾听者的感受。',
      dimension: 'other',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 10 - （反向）
    {
      id: 'eq_10',
      type: 'likert',
      question: '小时候，我喜欢切开虫子看看会发生什么。',
      dimension: 'other',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 11 - 认知共情（正向）
    {
      id: 'eq_11',
      type: 'likert',
      question: '我能迅速察觉别人表面说一件事，但实际想说另一件事。',
      dimension: 'cognitive_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 12 - 情绪共情（反向）
    {
      id: 'eq_12',
      type: 'likert',
      question: '我很难理解为什么有些事情会让人如此生气。',
      dimension: 'emotional_empathy',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 13 - 情绪共情（正向）
    {
      id: 'eq_13',
      type: 'likert',
      question: '我能轻松设身处地为他人着想。',
      dimension: 'emotional_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 14 - 认知共情（正向）
    {
      id: 'eq_14',
      type: 'likert',
      question: '我擅长预测别人的感受。',
      dimension: 'cognitive_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 15 - 认知共情（正向）
    {
      id: 'eq_15',
      type: 'likert',
      question: '群体中有人感到尴尬或不舒服时，我能快速发现。',
      dimension: 'cognitive_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 16 - 情绪共情（反向）
    {
      id: 'eq_16',
      type: 'likert',
      question: '如果我说了冒犯别人的话，我会认为那是他们的问题，而不是我的。',
      dimension: 'emotional_empathy',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 17 - （反向）
    {
      id: 'eq_17',
      type: 'likert',
      question: '如果有人问我是否喜欢他们的发型，即使我不喜欢，我也会如实回答。',
      dimension: 'other',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 18 - 情绪共情（反向）
    {
      id: 'eq_18',
      type: 'likert',
      question: '我不经常能理解别人为什么会因为某句话感到冒犯。',
      dimension: 'emotional_empathy',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 19 - 情绪共情（反向）
    {
      id: 'eq_19',
      type: 'likert',
      question: '看见别人哭并不会真正让我难过。',
      dimension: 'emotional_empathy',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 20 - （反向）
    {
      id: 'eq_20',
      type: 'likert',
      question: '我非常直率，有些人认为我无礼，但这并非故意。',
      dimension: 'other',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 21 - 社交技能（正向）
    {
      id: 'eq_21',
      type: 'likert',
      question: '我不容易觉得社交场合令人困惑。',
      dimension: 'social_skills',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 22 - 认知共情（正向）
    {
      id: 'eq_22',
      type: 'likert',
      question: '其他人告诉我，我善于理解他们的感受和想法。',
      dimension: 'cognitive_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 23 - （正向）
    {
      id: 'eq_23',
      type: 'likert',
      question: '与人交谈时，我倾向于谈论他们的经历，而不是我自己的。',
      dimension: 'other',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 24 - （正向）
    {
      id: 'eq_24',
      type: 'likert',
      question: '看到动物受苦会让我感到难过。',
      dimension: 'other',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 25 - （反向）
    {
      id: 'eq_25',
      type: 'likert',
      question: '我能做决定而不被他人的情绪影响。',
      dimension: 'other',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 26 - 认知共情（正向）
    {
      id: 'eq_26',
      type: 'likert',
      question: '我能轻松判断别人是否对我说的话感兴趣或感到无聊。',
      dimension: 'cognitive_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 27 - 情绪共情（正向）
    {
      id: 'eq_27',
      type: 'likert',
      question: '看到新闻里有人受苦会让我难过。',
      dimension: 'emotional_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 28 - 情绪共情（正向）
    {
      id: 'eq_28',
      type: 'likert',
      question: '朋友通常会告诉我他们的问题，因为我很善解人意。',
      dimension: 'emotional_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 29 - 认知共情（正向）
    {
      id: 'eq_29',
      type: 'likert',
      question: '即使别人没有告诉我，我也能察觉自己是否打扰了他们。',
      dimension: 'cognitive_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 30 - （反向）
    {
      id: 'eq_30',
      type: 'likert',
      question: '人们有时会告诉我，我开玩笑开得过头。',
      dimension: 'other',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 31 - 情绪共情（反向）
    {
      id: 'eq_31',
      type: 'likert',
      question: '其他人常说我不敏感，尽管我不总能理解为什么。',
      dimension: 'emotional_empathy',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 32 - （反向）
    {
      id: 'eq_32',
      type: 'likert',
      question: '当我在一群人中看到一个陌生人，我认为他应该自己努力融入。',
      dimension: 'other',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 33 - 情绪共情（反向）
    {
      id: 'eq_33',
      type: 'likert',
      question: '看电影时，我通常保持情感上的超然。',
      dimension: 'emotional_empathy',
            options: NEGATIVE_OPTIONS,
      required: true,
      reversed: true,
    },
    // 题目 34 - 认知共情（正向）
    {
      id: 'eq_34',
      type: 'likert',
      question: '我能快速地感知别人的感受。',
      dimension: 'cognitive_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 35 - 认知共情（正向）
    {
      id: 'eq_35',
      type: 'likert',
      question: '我能轻松猜出别人可能想谈论的话题。',
      dimension: 'cognitive_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 36 - 认知共情（正向）
    {
      id: 'eq_36',
      type: 'likert',
      question: '我能察觉别人是否在掩饰真实情绪。',
      dimension: 'cognitive_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 37 - 社交技能（正向）
    {
      id: 'eq_37',
      type: 'likert',
      question: '我不会有意识地去制定社交场合的规则。',
      dimension: 'social_skills',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 38 - 认知共情（正向）
    {
      id: 'eq_38',
      type: 'likert',
      question: '我擅长预测别人会做什么。',
      dimension: 'cognitive_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 39 - 情绪共情（正向）
    {
      id: 'eq_39',
      type: 'likert',
      question: '我倾向于从情感上卷入朋友的问题。',
      dimension: 'emotional_empathy',
            options: POSITIVE_OPTIONS,
      required: true,
    },
    // 题目 40 - （正向）
    {
      id: 'eq_40',
      type: 'likert',
      question: '我能欣赏他人的观点，即使我不同意。',
      dimension: 'other',
            options: POSITIVE_OPTIONS,
      required: true,
    },
  ],

  dimensions: [
    {
      id: 'cognitive_empathy',
      name: '认知共情',
      description: '理解他人心理状态和观点的能力。能够理性地理解他人的意图和想法，而不一定分享其情绪体验。',
      questionIds: ['eq_1', 'eq_11', 'eq_14', 'eq_15', 'eq_22', 'eq_26', 'eq_29', 'eq_34', 'eq_35', 'eq_36', 'eq_38'],
    },
    {
      id: 'emotional_empathy',
      name: '情绪共情',
      description: '感受并共鸣他人情绪的能力，容易吸收他人的情绪。',
      questionIds: ['eq_3', 'eq_12', 'eq_13', 'eq_16', 'eq_18', 'eq_19', 'eq_27', 'eq_28', 'eq_31', 'eq_33', 'eq_39'],
    },
    {
      id: 'social_skills',
      name: '社交技能',
      description: '有效沟通、适应社交情境并与他人互动的能力。',
      questionIds: ['eq_2', 'eq_4', 'eq_7', 'eq_8', 'eq_21', 'eq_37'],
    },
  ],

  scoring: {
    method: 'sum',
    scaleRange: {
      min: 0,
      max: 100,
      description: '总分范围为0-100分（向上取整），得分越高表示共情能力越强',
    },
    ranges: [
      {
        min: 70,
        max: 100,
        level: '高共情能力',
        color: '#10b981',
        description: '您表现出极强的共情能力，善于理解他人的思维和情绪，能够准确把握他人的观点与心理状态。在社交场合中表现自如，能够建立温暖的人际关系。您对他人的情绪高度敏感，容易感受到他人的喜怒哀乐，并能够适当地回应。在人际交往中，您能够灵活适应不同情境，有效沟通并处理冲突。',
        suggestions: [
          '继续保持您的共情优势，但要注意避免过度吸收他人的负面情绪，保护好自己的情绪健康',
          '可以利用您的共情能力帮助他人，成为朋友圈中的情感支持者',
          '在保持对他人敏感的同时，也要学会设定适当的界限，避免情绪过载',
        ],
      },
      {
        min: 40,
        max: 69,
        level: '中等共情能力',
        color: '#3b82f6',
        description: '您具有一定的共情能力，能够在大多数情境下理解他人的想法和情绪。在常规的社交场合中表现良好，能够与他人建立正常的人际关系。然而，在复杂或压力情境下，您可能会遇到一些理解他人或表达共情的困难。您对他人情绪有一定的觉察，但可能不如高共情者那样敏感。',
        suggestions: [
          '尝试提升您的情绪识别能力，多观察他人的面部表情和肢体语言',
          '在与人交流时，练习主动倾听，试着从对方的角度思考问题',
          '可以通过阅读心理学相关书籍或参加情绪智力培训来增强共情能力',
        ],
      },
      {
        min: 0,
        max: 39,
        level: '低共情能力',
        color: '#ef4444',
        description: '您的共情能力较低，可能在理解他人的想法、情绪和社交互动方面存在一定困难。您可能难以准确判断他人的意图或情绪状态，在社交场合中可能会感到困惑或不知所措。对他人的情绪觉察不足，可能在人际关系中显得冷漠或疏离。这可能会影响您的人际关系质量和社交适应能力。',
        suggestions: [
          '建议学习基本的情绪识别技巧，了解常见的情绪表达方式',
          '在社交互动中，尝试多问问题，了解他人的感受和想法',
          '如果共情能力的不足严重影响了您的生活质量，建议寻求专业心理咨询的帮助',
          '可以从简单的练习开始，比如观看电影时尝试理解角色的情绪和动机',
        ],
      },
    ],
  },

  references: [
    {
      title: 'The Empathy Quotient: An Investigation of Adults with Asperger Syndrome or High Functioning Autism, and Normal Sex Differences',
      authors: 'Baron-Cohen, S., & Wheelwright, S.',
      year: 2004,
      journal: 'Journal of Autism and Developmental Disorders',
      volume: 34,
      pages: '163-175',
    },
  ],

  // 自定义计分函数
  calculateResults: (answers: Record<string, number>) => {
    // EQ 量表的计分规则：
    // 正向题：1->0, 2->0, 3->1.25, 4->2.5
    // 反向题：1->2.5, 2->1.25, 3->0, 4->0

    const positiveScoreMap: Record<number, number> = {
      1: 0,
      2: 0,
      3: 1.25,
      4: 2.5,
    };

    const negativeScoreMap: Record<number, number> = {
      1: 2.5,
      2: 1.25,
      3: 0,
      4: 0,
    };

    // 正向题列表
    const positiveQuestions = [
      'eq_1', 'eq_3', 'eq_11', 'eq_13', 'eq_14', 'eq_15', 'eq_21', 'eq_22', 'eq_23',
      'eq_24', 'eq_26', 'eq_27', 'eq_28', 'eq_29', 'eq_34', 'eq_35', 'eq_36', 'eq_37',
      'eq_38', 'eq_39', 'eq_40'
    ];

    let totalScore = 0;
    const dimensionScores: Record<string, number> = {
      cognitive_empathy: 0,
      emotional_empathy: 0,
      social_skills: 0,
    };

    // 定义各维度的题目列表（基于文档）
    const cognitiveEmpathyQuestions = ['eq_1', 'eq_11', 'eq_14', 'eq_15', 'eq_22', 'eq_26', 'eq_29', 'eq_34', 'eq_35', 'eq_36', 'eq_38'];
    const emotionalEmpathyQuestions = ['eq_3', 'eq_12', 'eq_13', 'eq_16', 'eq_18', 'eq_19', 'eq_27', 'eq_28', 'eq_31', 'eq_33', 'eq_39'];
    const socialSkillsQuestions = ['eq_2', 'eq_4', 'eq_7', 'eq_8', 'eq_21', 'eq_37'];

    // 计算总分和各维度分数
    Object.entries(answers).forEach(([questionId, answer]) => {
      const isPositive = positiveQuestions.includes(questionId);
      const scoreMap = isPositive ? positiveScoreMap : negativeScoreMap;
      const score = scoreMap[answer] || 0;

      totalScore += score;

      // 归类到维度（只计算属于三大维度的题目）
      if (cognitiveEmpathyQuestions.includes(questionId)) {
        dimensionScores.cognitive_empathy += score;
      } else if (emotionalEmpathyQuestions.includes(questionId)) {
        dimensionScores.emotional_empathy += score;
      } else if (socialSkillsQuestions.includes(questionId)) {
        dimensionScores.social_skills += score;
      }
    });

    // 向上取整
    totalScore = Math.ceil(totalScore);

    // 计算各维度的最大分数
    // 认知共情：11题 × 2.5 = 27.5
    // 情绪共情：11题 × 2.5 = 27.5
    // 社交技能：6题 × 2.5 = 15
    const maxScores = {
      cognitive_empathy: 11 * 2.5,  // 27.5
      emotional_empathy: 11 * 2.5,  // 27.5
      social_skills: 6 * 2.5,       // 15
    };

    // 计算各维度的百分比得分（实际得分/最大得分 × 100）
    const dimensionPercentages = {
      cognitive_empathy: Math.round((dimensionScores.cognitive_empathy / maxScores.cognitive_empathy) * 100),
      emotional_empathy: Math.round((dimensionScores.emotional_empathy / maxScores.emotional_empathy) * 100),
      social_skills: Math.round((dimensionScores.social_skills / maxScores.social_skills) * 100),
    };

    // 确定等级
    let level = '低共情能力';
    let interpretation = '';
    if (totalScore >= 70) {
      level = '高共情能力';
      interpretation = '您表现出极强的共情能力，在认知共情、情绪共情和社交技能方面均表现优秀。';
    } else if (totalScore >= 40) {
      level = '中等共情能力';
      interpretation = '您具有一定的共情能力，在大多数情境下能够理解和回应他人。';
    } else {
      level = '低共情能力';
      interpretation = '您的共情能力有较大的提升空间，建议通过练习来增强。';
    }

    return {
      totalScore,
      dimensionScores: [
        { dimension: '认知共情', dimensionId: 'cognitive_empathy', score: dimensionPercentages.cognitive_empathy },
        { dimension: '情绪共情', dimensionId: 'emotional_empathy', score: dimensionPercentages.emotional_empathy },
        { dimension: '社交技能', dimensionId: 'social_skills', score: dimensionPercentages.social_skills },
      ],
      interpretation,
      recommendations: [],
    };
  },
};
