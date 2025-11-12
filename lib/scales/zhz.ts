/**
 * ZHZ: 甄嬛传人格测评
 *
 * 基于《甄嬛传》中的12位核心人物为原型
 * 通过八维度模型评估用户的人格特征（5个传统维度 + 3个现代维度）
 */

import type { QuizTemplate } from '@/types/quiz';

// 八大心理维度定义
export const ZHZ_DIMENSIONS = {
  emotional: '情感敏感度',     // 对他人情绪、评价的反应强度
  strategy: '策略思维',       // 行动前的思考深度、谋略性与控制欲
  energy: '外显能量',         // 表达力、自信与外向程度
  idealism: '情感理想化',     // 对爱、道德、理想的执着
  stability: '稳定与自律',    // 内在稳定性、责任感与耐心
  ambition: '进取心',         // 对成功的渴望、自我驱动力 vs 躺平接受现状
  authenticity: '真实性',     // 表达真我的意愿 vs 社会面具/形象管理
  novelty: '求新倾向',        // 拥抱变化、探索欲望 vs 偏好稳定熟悉
} as const;

// 维度权重（用于加权欧式距离计算）
export const DIMENSION_WEIGHTS = {
  emotional: 1.0,      // 重要维度
  strategy: 1.3,       // 核心维度
  energy: 1.0,         // 重要维度
  idealism: 0.8,       // 辅助维度
  stability: 0.8,      // 辅助维度
  ambition: 1.2,       // 核心维度
  authenticity: 1.2,   // 核心维度
  novelty: 1.0,        // 重要维度
} as const;

// 12个角色的八维度坐标（极端化版本）
export const CHARACTER_PROFILES = {
  'zhenhuan_early': {
    name: '甄嬛（前期）',
    emoji: '🕊️',
    subtitle: '理想主义与温柔的力量',
    scores: {
      emotional: 0.85,
      strategy: 0.3,
      energy: 0.35,
      idealism: 0.95,
      stability: 0.45,
      ambition: 0.35,
      authenticity: 0.8,
      novelty: 0.5,
    }
  },
  'zhenhuan_late': {
    name: '甄嬛（后期）',
    emoji: '🦢',
    subtitle: '理智与权衡的女王',
    scores: {
      emotional: 0.4,
      strategy: 0.95,
      energy: 0.25,
      idealism: 0.25,
      stability: 0.8,
      ambition: 0.9,
      authenticity: 0.2,
      novelty: 0.75,
    }
  },
  'anlingrong': {
    name: '安陵容',
    emoji: '🪞',
    subtitle: '敏感而脆弱的自我怀疑者',
    scores: {
      emotional: 0.95,
      strategy: 0.5,
      energy: 0.2,
      idealism: 0.75,
      stability: 0.25,
      ambition: 0.45,
      authenticity: 0.6,
      novelty: 0.15,
    }
  },
  'queen': {
    name: '皇后',
    emoji: '👑',
    subtitle: '理性与秩序的掌控者',
    scores: {
      emotional: 0.3,
      strategy: 1.0,
      energy: 0.15,
      idealism: 0.2,
      stability: 0.95,
      ambition: 0.95,
      authenticity: 0.1,
      novelty: 0.1,
    }
  },
  'huafei': {
    name: '华妃',
    emoji: '🔥',
    subtitle: '外放能量与极致情感',
    scores: {
      emotional: 0.2,
      strategy: 0.2,
      energy: 1.0,
      idealism: 0.3,
      stability: 0.2,
      ambition: 0.75,
      authenticity: 0.95,
      novelty: 0.8,
    }
  },
  'shenmeizhuang': {
    name: '沈眉庄',
    emoji: '🌿',
    subtitle: '优雅与坚韧并存的理性者',
    scores: {
      emotional: 0.5,
      strategy: 0.6,
      energy: 0.25,
      idealism: 0.8,
      stability: 0.95,
      ambition: 0.4,
      authenticity: 0.7,
      novelty: 0.15,
    }
  },
  'huanbi': {
    name: '浣碧',
    emoji: '💧',
    subtitle: '现实与忠诚的行动派',
    scores: {
      emotional: 0.35,
      strategy: 0.75,
      energy: 0.5,
      idealism: 0.3,
      stability: 0.65,
      ambition: 0.85,
      authenticity: 0.45,
      novelty: 0.55,
    }
  },
  'supeisheng': {
    name: '苏培盛',
    emoji: '🪶',
    subtitle: '忠心耿耿的中庸者',
    scores: {
      emotional: 0.65,
      strategy: 0.5,
      energy: 0.85,
      idealism: 0.55,
      stability: 0.5,
      ambition: 0.3,
      authenticity: 0.5,
      novelty: 0.25,
    }
  },
  'guojunwang': {
    name: '果郡王',
    emoji: '🌞',
    subtitle: '浪漫自由的理想行动派',
    scores: {
      emotional: 0.7,
      strategy: 0.2,
      energy: 0.9,
      idealism: 0.95,
      stability: 0.4,
      ambition: 0.4,
      authenticity: 0.95,
      novelty: 0.9,
    }
  },
  'wentaiyi': {
    name: '温太医',
    emoji: '🌸',
    subtitle: '温柔理智的疗愈者',
    scores: {
      emotional: 0.95,
      strategy: 0.15,
      energy: 0.35,
      idealism: 0.9,
      stability: 0.75,
      ambition: 0.1,
      authenticity: 0.85,
      novelty: 0.2,
    }
  },
  'emperor': {
    name: '皇上',
    emoji: '🦅',
    subtitle: '权力与秩序的掌舵者',
    scores: {
      emotional: 0.2,
      strategy: 0.95,
      energy: 0.7,
      idealism: 0.2,
      stability: 0.75,
      ambition: 0.95,
      authenticity: 0.35,
      novelty: 0.45,
    }
  },
  'ningguiren': {
    name: '宁贵人',
    emoji: '🕰️',
    subtitle: '隐忍深思的现实派',
    scores: {
      emotional: 0.45,
      strategy: 0.9,
      energy: 0.35,
      idealism: 0.35,
      stability: 0.7,
      ambition: 0.8,
      authenticity: 0.15,
      novelty: 0.3,
    }
  },
} as const;

export const zhz: QuizTemplate = {
  id: 'zhz',
  title: '甄嬛传人格测评',
  titleEn: 'The Legend of Zhen Huan Personality Assessment',
  description: '以《甄嬛传》12位核心人物为原型，测试你最像谁',
  category: '趣味测评',
  purpose: '通过28道现代生活场景题，从情感、理性、策略、进取心等8个维度，判断你最接近哪种"宫廷人格"',
  duration: '7-10分钟',
  questionCount: 28,

  questions: [
    // Q1
    {
      id: 'zhz_q1',
      type: 'scale',
      question: '当团队出现分歧时，你会怎么做？',
      dimension: 'conflict_handling',
      options: [
        { value: 1, label: '尽量协调大家的情绪，让每个人都被理解', scores: { emotional: 0.85, strategy: 0.3, energy: 0.35, idealism: 0.95, stability: 0.45, ambition: 0.35, authenticity: 0.8, novelty: 0.5 } },
        { value: 2, label: '先观察，找到关键人物再出手', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 3, label: '有什么就直接说，不喜欢兜圈子', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 4, label: '暗中影响决策，表面不露声色', scores: { emotional: 0.3, strategy: 1.0, energy: 0.15, idealism: 0.2, stability: 0.95, ambition: 0.95, authenticity: 0.1, novelty: 0.1 } },
        { value: 5, label: '不参与争论，服从最终决定', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
      ],
      required: true,
    },

    // Q2
    {
      id: 'zhz_q2',
      type: 'scale',
      question: '面对竞争对手的挑衅，你更可能？',
      dimension: 'competition_response',
      options: [
        { value: 1, label: '假装不在意，暗中留意', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 2, label: '回怼回去，不吃亏！', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 3, label: '默默忍耐，希望用成绩证明', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
        { value: 4, label: '表面温和，实则早布后路', scores: { emotional: 0.2, strategy: 0.95, energy: 0.7, idealism: 0.2, stability: 0.75, ambition: 0.95, authenticity: 0.35, novelty: 0.45 } },
        { value: 5, label: '完全不在意，对方爱怎样就怎样', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
      ],
      required: true,
    },

    // Q3
    {
      id: 'zhz_q3',
      type: 'scale',
      question: '在恋爱中，你更在意什么？',
      dimension: 'love_values',
      options: [
        { value: 1, label: '真诚和安全感', scores: { emotional: 0.85, strategy: 0.3, energy: 0.35, idealism: 0.95, stability: 0.45, ambition: 0.35, authenticity: 0.8, novelty: 0.5 } },
        { value: 2, label: '尊重与界限', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 3, label: '占有欲和热情', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 4, label: '浪漫与精神共鸣', scores: { emotional: 0.7, strategy: 0.2, energy: 0.9, idealism: 0.95, stability: 0.4, ambition: 0.4, authenticity: 0.95, novelty: 0.9 } },
        { value: 5, label: '能被看见、被认可的感觉', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
      ],
      required: true,
    },

    // Q4
    {
      id: 'zhz_q4',
      type: 'scale',
      question: '如果你被误会，你会？',
      dimension: 'misunderstanding_handling',
      options: [
        { value: 1, label: '当面澄清，不喜欢模糊', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 2, label: '沉默，让时间说明一切', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 3, label: '收集证据，翻盘反击', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 4, label: '忍下来，心里却永远记得', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
        { value: 5, label: '劝自己放下，不值得计较', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
      ],
      required: true,
    },

    // Q5
    {
      id: 'zhz_q5',
      type: 'scale',
      question: '面对喜欢的人，你会？',
      dimension: 'romantic_approach',
      options: [
        { value: 1, label: '主动制造浪漫与惊喜', scores: { emotional: 0.7, strategy: 0.2, energy: 0.9, idealism: 0.95, stability: 0.4, ambition: 0.4, authenticity: 0.95, novelty: 0.9 } },
        { value: 2, label: '偷偷观察，不敢表露', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
        { value: 3, label: '小心试探，确认对方意图', scores: { emotional: 0.85, strategy: 0.3, energy: 0.35, idealism: 0.95, stability: 0.45, ambition: 0.35, authenticity: 0.8, novelty: 0.5 } },
        { value: 4, label: '明确表达，关系要清晰', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 5, label: '顺其自然，有缘自会在一起', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
      ],
      required: true,
    },

    // Q6
    {
      id: 'zhz_q6',
      type: 'scale',
      question: '工作中出现重大失误，你会？',
      dimension: 'mistake_handling',
      options: [
        { value: 1, label: '立刻找原因，主动承担', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 2, label: '想办法补救，不让领导知道', scores: { emotional: 0.35, strategy: 0.75, energy: 0.5, idealism: 0.3, stability: 0.65, ambition: 0.85, authenticity: 0.45, novelty: 0.55 } },
        { value: 3, label: '先安抚同事情绪，再商量解决', scores: { emotional: 0.85, strategy: 0.3, energy: 0.35, idealism: 0.95, stability: 0.45, ambition: 0.35, authenticity: 0.8, novelty: 0.5 } },
        { value: 4, label: '盘算如何避免责任落到自己身上', scores: { emotional: 0.3, strategy: 1.0, energy: 0.15, idealism: 0.2, stability: 0.95, ambition: 0.95, authenticity: 0.1, novelty: 0.1 } },
        { value: 5, label: '平静分析，吸取教训', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
      ],
      required: true,
    },

    // Q7
    {
      id: 'zhz_q7',
      type: 'scale',
      question: '朋友背叛了你，你会？',
      dimension: 'betrayal_response',
      options: [
        { value: 1, label: '表面原谅，暗中防备', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 2, label: '冷处理，不再来往', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 3, label: '记恨一辈子，哪怕不报复', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
        { value: 4, label: '当众撕破脸，绝不留情', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 5, label: '尝试理解对方的原因', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
      ],
      required: true,
    },

    // Q8
    {
      id: 'zhz_q8',
      type: 'scale',
      question: '你更喜欢的社交方式是？',
      dimension: 'social_preference',
      options: [
        { value: 1, label: '热闹场合，成为焦点', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 2, label: '安静环境，小圈交流', scores: { emotional: 0.85, strategy: 0.3, energy: 0.35, idealism: 0.95, stability: 0.45, ambition: 0.35, authenticity: 0.8, novelty: 0.5 } },
        { value: 3, label: '精准选择人脉，带目的接触', scores: { emotional: 0.3, strategy: 1.0, energy: 0.15, idealism: 0.2, stability: 0.95, ambition: 0.95, authenticity: 0.1, novelty: 0.1 } },
        { value: 4, label: '与志同道合的人深聊', scores: { emotional: 0.7, strategy: 0.2, energy: 0.9, idealism: 0.95, stability: 0.4, ambition: 0.4, authenticity: 0.95, novelty: 0.9 } },
        { value: 5, label: '能不社交就不社交，被动参与', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
      ],
      required: true,
    },

    // Q9
    {
      id: 'zhz_q9',
      type: 'scale',
      question: '面对诱惑时，你更可能？',
      dimension: 'temptation_handling',
      options: [
        { value: 1, label: '直接拒绝，不纠结', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 2, label: '动心但会克制', scores: { emotional: 0.85, strategy: 0.3, energy: 0.35, idealism: 0.95, stability: 0.45, ambition: 0.35, authenticity: 0.8, novelty: 0.5 } },
        { value: 3, label: '顺势而为，不浪费机会', scores: { emotional: 0.2, strategy: 0.95, energy: 0.7, idealism: 0.2, stability: 0.75, ambition: 0.95, authenticity: 0.35, novelty: 0.45 } },
        { value: 4, label: '表面拒绝，暗中利用', scores: { emotional: 0.45, strategy: 0.9, energy: 0.35, idealism: 0.35, stability: 0.7, ambition: 0.8, authenticity: 0.15, novelty: 0.3 } },
        { value: 5, label: '被情感冲昏头脑', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
      ],
      required: true,
    },

    // Q10
    {
      id: 'zhz_q10',
      type: 'scale',
      question: '如果有人抢走了你的功劳？',
      dimension: 'credit_stealing',
      options: [
        { value: 1, label: '直接据理力争，当场要说法', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 2, label: '心里不爽但算了，不想浪费精力', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
        { value: 3, label: '记下来，找机会扳回来', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 4, label: '表面祝贺，暗中让他付出代价', scores: { emotional: 0.3, strategy: 1.0, energy: 0.15, idealism: 0.2, stability: 0.95, ambition: 0.95, authenticity: 0.1, novelty: 0.1 } },
        { value: 5, label: '默默继续努力，用实力证明自己', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
      ],
      required: true,
    },

    // Q11
    {
      id: 'zhz_q11',
      type: 'scale',
      question: '面对压力，你的反应是？',
      dimension: 'stress_response',
      options: [
        { value: 1, label: '越挫越勇，更想赢', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 2, label: '会先自我怀疑', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
        { value: 3, label: '平静分析，逐步解决', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 4, label: '外表冷静，内心翻腾', scores: { emotional: 0.85, strategy: 0.3, energy: 0.35, idealism: 0.95, stability: 0.45, ambition: 0.35, authenticity: 0.8, novelty: 0.5 } },
        { value: 5, label: '暴躁发泄一通就好', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
      ],
      required: true,
    },

    // Q12
    {
      id: 'zhz_q12',
      type: 'scale',
      question: '你最不能忍受的是？',
      dimension: 'intolerance',
      options: [
        { value: 1, label: '被背叛', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 2, label: '被忽视', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
        { value: 3, label: '被质疑能力', scores: { emotional: 0.2, strategy: 0.95, energy: 0.7, idealism: 0.2, stability: 0.75, ambition: 0.95, authenticity: 0.35, novelty: 0.45 } },
        { value: 4, label: '被束缚自由', scores: { emotional: 0.7, strategy: 0.2, energy: 0.9, idealism: 0.95, stability: 0.4, ambition: 0.4, authenticity: 0.95, novelty: 0.9 } },
        { value: 5, label: '其实都能忍受，没什么大不了', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
      ],
      required: true,
    },

    // Q13
    {
      id: 'zhz_q13',
      type: 'scale',
      question: '在领导岗位上，你会？',
      dimension: 'leadership_style',
      options: [
        { value: 1, label: '严谨稳重，事事安排周全', scores: { emotional: 0.3, strategy: 1.0, energy: 0.15, idealism: 0.2, stability: 0.95, ambition: 0.95, authenticity: 0.1, novelty: 0.1 } },
        { value: 2, label: '激励大家，靠热情感染', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 3, label: '平衡关系，人人有分', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 4, label: '少说话，多观察形势', scores: { emotional: 0.45, strategy: 0.9, energy: 0.35, idealism: 0.35, stability: 0.7, ambition: 0.8, authenticity: 0.15, novelty: 0.3 } },
        { value: 5, label: '不太想当领导', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
      ],
      required: true,
    },

    // Q14
    {
      id: 'zhz_q14',
      type: 'scale',
      question: '你如何看待"正义"？',
      dimension: 'justice_view',
      options: [
        { value: 1, label: '必须维护，即便会牺牲', scores: { emotional: 0.85, strategy: 0.3, energy: 0.35, idealism: 0.95, stability: 0.45, ambition: 0.35, authenticity: 0.8, novelty: 0.5 } },
        { value: 2, label: '要灵活，正义要服务现实', scores: { emotional: 0.2, strategy: 0.95, energy: 0.7, idealism: 0.2, stability: 0.75, ambition: 0.95, authenticity: 0.35, novelty: 0.45 } },
        { value: 3, label: '没有绝对正义，只有立场不同', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 4, label: '愿意为弱者发声', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 5, label: '不太想这些，做好自己就行', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
      ],
      required: true,
    },

    // Q15
    {
      id: 'zhz_q15',
      type: 'scale',
      question: '如果你突然升职，你会？',
      dimension: 'promotion_reaction',
      options: [
        { value: 1, label: '兴奋，立刻计划如何做得更好', scores: { emotional: 0.35, strategy: 0.75, energy: 0.5, idealism: 0.3, stability: 0.65, ambition: 0.85, authenticity: 0.45, novelty: 0.55 } },
        { value: 2, label: '冷静分析背后的原因和目的', scores: { emotional: 0.3, strategy: 1.0, energy: 0.15, idealism: 0.2, stability: 0.95, ambition: 0.95, authenticity: 0.1, novelty: 0.1 } },
        { value: 3, label: '担心别人嫉妒，小心翼翼行事', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
        { value: 4, label: '制定长远计划，巩固地位', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 5, label: '不太在意，继续按自己节奏做事', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
      ],
      required: true,
    },

    // Q16
    {
      id: 'zhz_q16',
      type: 'scale',
      question: '面对一个新环境，你会？',
      dimension: 'new_environment',
      options: [
        { value: 1, label: '主动融入，快速建立关系', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 2, label: '观察氛围，慢慢适应', scores: { emotional: 0.85, strategy: 0.3, energy: 0.35, idealism: 0.95, stability: 0.45, ambition: 0.35, authenticity: 0.8, novelty: 0.5 } },
        { value: 3, label: '掌握关键人物信息', scores: { emotional: 0.3, strategy: 1.0, energy: 0.15, idealism: 0.2, stability: 0.95, ambition: 0.95, authenticity: 0.1, novelty: 0.1 } },
        { value: 4, label: '不刻意融入，保持自己节奏', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
        { value: 5, label: '让自己成为有用的人', scores: { emotional: 0.35, strategy: 0.75, energy: 0.5, idealism: 0.3, stability: 0.65, ambition: 0.85, authenticity: 0.45, novelty: 0.55 } },
      ],
      required: true,
    },

    // Q17
    {
      id: 'zhz_q17',
      type: 'scale',
      question: '当你意识到喜欢的人另有所爱？',
      dimension: 'unrequited_love',
      options: [
        { value: 1, label: '痛苦但祝福', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 2, label: '假装不在意，内心崩溃', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
        { value: 3, label: '不甘心，会努力争取', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 4, label: '默默退出，藏于心底', scores: { emotional: 0.85, strategy: 0.3, energy: 0.35, idealism: 0.95, stability: 0.45, ambition: 0.35, authenticity: 0.8, novelty: 0.5 } },
        { value: 5, label: '转移注意力，重新开始', scores: { emotional: 0.7, strategy: 0.2, energy: 0.9, idealism: 0.95, stability: 0.4, ambition: 0.4, authenticity: 0.95, novelty: 0.9 } },
      ],
      required: true,
    },

    // Q18
    {
      id: 'zhz_q18',
      type: 'scale',
      question: '如果你有一项强大能力，你希望是？',
      dimension: 'desired_ability',
      options: [
        { value: 1, label: '看透人心', scores: { emotional: 0.3, strategy: 1.0, energy: 0.15, idealism: 0.2, stability: 0.95, ambition: 0.95, authenticity: 0.1, novelty: 0.1 } },
        { value: 2, label: '让别人喜欢自己', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
        { value: 3, label: '治愈他人痛苦', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
        { value: 4, label: '控制命运', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 5, label: '无敌的力量，想做什么就做什么', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
      ],
      required: true,
    },

    // Q19
    {
      id: 'zhz_q19',
      type: 'scale',
      question: '你最希望被人如何记住？',
      dimension: 'legacy',
      options: [
        { value: 1, label: '善良真挚', scores: { emotional: 0.85, strategy: 0.3, energy: 0.35, idealism: 0.95, stability: 0.45, ambition: 0.35, authenticity: 0.8, novelty: 0.5 } },
        { value: 2, label: '坚定优雅', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 3, label: '聪明果断', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 4, label: '独立自信', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 5, label: '温柔体贴', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
      ],
      required: true,
    },

    // Q20
    {
      id: 'zhz_q20',
      type: 'scale',
      question: '你最看重友谊的什么？',
      dimension: 'friendship_values',
      options: [
        { value: 1, label: '信任与真心', scores: { emotional: 0.85, strategy: 0.3, energy: 0.35, idealism: 0.95, stability: 0.45, ambition: 0.35, authenticity: 0.8, novelty: 0.5 } },
        { value: 2, label: '利益上的互助', scores: { emotional: 0.45, strategy: 0.9, energy: 0.35, idealism: 0.35, stability: 0.7, ambition: 0.8, authenticity: 0.15, novelty: 0.3 } },
        { value: 3, label: '共同成长的陪伴', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 4, label: '永远的忠诚', scores: { emotional: 0.65, strategy: 0.5, energy: 0.85, idealism: 0.55, stability: 0.5, ambition: 0.3, authenticity: 0.5, novelty: 0.25 } },
        { value: 5, label: '随缘，关系淡了也无妨', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
      ],
      required: true,
    },

    // 新增题目 Q21-Q28

    // Q21
    {
      id: 'zhz_q21',
      type: 'scale',
      question: '当你看到同龄人成功时，你的第一反应是？',
      dimension: 'peer_success',
      options: [
        { value: 1, label: '分析他的方法，想办法超越', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 2, label: '祝福他，但也想努力追赶', scores: { emotional: 0.35, strategy: 0.75, energy: 0.5, idealism: 0.3, stability: 0.65, ambition: 0.85, authenticity: 0.45, novelty: 0.55 } },
        { value: 3, label: '感到焦虑，担心自己落后', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
        { value: 4, label: '无所谓，我有自己的节奏', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
        { value: 5, label: '真心为他高兴，替他开心', scores: { emotional: 0.85, strategy: 0.3, energy: 0.35, idealism: 0.95, stability: 0.45, ambition: 0.35, authenticity: 0.8, novelty: 0.5 } },
      ],
      required: true,
    },

    // Q22
    {
      id: 'zhz_q22',
      type: 'scale',
      question: '如果有一个高薪但压力巨大的机会，你会？',
      dimension: 'high_pressure_opportunity',
      options: [
        { value: 1, label: '果断接受，这是上升的机会', scores: { emotional: 0.3, strategy: 1.0, energy: 0.15, idealism: 0.2, stability: 0.95, ambition: 0.95, authenticity: 0.1, novelty: 0.1 } },
        { value: 2, label: '仔细评估，值得就拼一把', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 3, label: '担心自己做不好，犹豫不决', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
        { value: 4, label: '拒绝，不想牺牲生活质量', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
        { value: 5, label: '算了，压力太大不值得', scores: { emotional: 0.65, strategy: 0.5, energy: 0.85, idealism: 0.55, stability: 0.5, ambition: 0.3, authenticity: 0.5, novelty: 0.25 } },
      ],
      required: true,
    },

    // Q23
    {
      id: 'zhz_q23',
      type: 'scale',
      question: '朋友圈和真实生活，你的状态是？',
      dimension: 'social_media_authenticity',
      options: [
        { value: 1, label: '基本一致，我不喜欢装', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 2, label: '展示积极面，但不刻意美化', scores: { emotional: 0.7, strategy: 0.2, energy: 0.9, idealism: 0.95, stability: 0.4, ambition: 0.4, authenticity: 0.95, novelty: 0.9 } },
        { value: 3, label: '基本不发，觉得没必要', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 4, label: '非常用心经营，展示最好的自己', scores: { emotional: 0.3, strategy: 1.0, energy: 0.15, idealism: 0.2, stability: 0.95, ambition: 0.95, authenticity: 0.1, novelty: 0.1 } },
        { value: 5, label: '精心打造人设，生活是生活，朋友圈是朋友圈', scores: { emotional: 0.45, strategy: 0.9, energy: 0.35, idealism: 0.35, stability: 0.7, ambition: 0.8, authenticity: 0.15, novelty: 0.3 } },
      ],
      required: true,
    },

    // Q24
    {
      id: 'zhz_q24',
      type: 'scale',
      question: '当别人问你过得好不好时，你通常？',
      dimension: 'emotional_disclosure',
      options: [
        { value: 1, label: '实话实说，好就是好，不好就是不好', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 2, label: '如果关系亲近会坦诚，否则客套应对', scores: { emotional: 0.85, strategy: 0.3, energy: 0.35, idealism: 0.95, stability: 0.45, ambition: 0.35, authenticity: 0.8, novelty: 0.5 } },
        { value: 3, label: '总说"还好"，不想暴露真实状态', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 4, label: '永远说"很好"，不想让人担心或看轻', scores: { emotional: 0.3, strategy: 1.0, energy: 0.15, idealism: 0.2, stability: 0.95, ambition: 0.95, authenticity: 0.1, novelty: 0.1 } },
        { value: 5, label: '表面云淡风轻，内心翻江倒海', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
      ],
      required: true,
    },

    // Q25
    {
      id: 'zhz_q25',
      type: 'scale',
      question: '职场中，你更倾向于？',
      dimension: 'workplace_authenticity',
      options: [
        { value: 1, label: '做真实的自己，不合适就算了', scores: { emotional: 0.7, strategy: 0.2, energy: 0.9, idealism: 0.95, stability: 0.4, ambition: 0.4, authenticity: 0.95, novelty: 0.9 } },
        { value: 2, label: '保留底线，其他可以适当调整', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 3, label: '有策略地展示不同面，适应环境', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 4, label: '非常在意职业形象管理', scores: { emotional: 0.3, strategy: 1.0, energy: 0.15, idealism: 0.2, stability: 0.95, ambition: 0.95, authenticity: 0.1, novelty: 0.1 } },
        { value: 5, label: '扮演别人期待的角色，隐藏真实想法', scores: { emotional: 0.45, strategy: 0.9, energy: 0.35, idealism: 0.35, stability: 0.7, ambition: 0.8, authenticity: 0.15, novelty: 0.3 } },
      ],
      required: true,
    },

    // Q26
    {
      id: 'zhz_q26',
      type: 'scale',
      question: '对于生活方式的改变（如换城市、换行业），你的态度是？',
      dimension: 'life_change_attitude',
      options: [
        { value: 1, label: '期待新鲜感，愿意尝试', scores: { emotional: 0.7, strategy: 0.2, energy: 0.9, idealism: 0.95, stability: 0.4, ambition: 0.4, authenticity: 0.95, novelty: 0.9 } },
        { value: 2, label: '如果有明确好处就会考虑', scores: { emotional: 0.4, strategy: 0.95, energy: 0.25, idealism: 0.25, stability: 0.8, ambition: 0.9, authenticity: 0.2, novelty: 0.75 } },
        { value: 3, label: '倾向稳定，除非迫不得已', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 4, label: '害怕变化，需要很长适应期', scores: { emotional: 0.95, strategy: 0.5, energy: 0.2, idealism: 0.75, stability: 0.25, ambition: 0.45, authenticity: 0.6, novelty: 0.15 } },
        { value: 5, label: '完全不想变，现状就很好', scores: { emotional: 0.3, strategy: 1.0, energy: 0.15, idealism: 0.2, stability: 0.95, ambition: 0.95, authenticity: 0.1, novelty: 0.1 } },
      ],
      required: true,
    },

    // Q27
    {
      id: 'zhz_q27',
      type: 'scale',
      question: '在生活中，你更喜欢？',
      dimension: 'lifestyle_preference',
      options: [
        { value: 1, label: '经常尝试新餐厅、新路线、新爱好', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 2, label: '偶尔换换口味，但主要还是熟悉的', scores: { emotional: 0.35, strategy: 0.75, energy: 0.5, idealism: 0.3, stability: 0.65, ambition: 0.85, authenticity: 0.45, novelty: 0.55 } },
        { value: 3, label: '喜欢固定的模式，有安全感', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 4, label: '固定就好，但如果大家都去我也去', scores: { emotional: 0.65, strategy: 0.5, energy: 0.85, idealism: 0.55, stability: 0.5, ambition: 0.3, authenticity: 0.5, novelty: 0.25 } },
        { value: 5, label: '随缘，有机会就试试', scores: { emotional: 0.95, strategy: 0.15, energy: 0.35, idealism: 0.9, stability: 0.75, ambition: 0.1, authenticity: 0.85, novelty: 0.2 } },
      ],
      required: true,
    },

    // Q28
    {
      id: 'zhz_q28',
      type: 'scale',
      question: '面对新技术、新观念，你通常？',
      dimension: 'innovation_acceptance',
      options: [
        { value: 1, label: '率先尝试，享受探索的感觉', scores: { emotional: 0.2, strategy: 0.2, energy: 1.0, idealism: 0.3, stability: 0.2, ambition: 0.75, authenticity: 0.95, novelty: 0.8 } },
        { value: 2, label: '观察一段时间，确认有用再接受', scores: { emotional: 0.2, strategy: 0.95, energy: 0.7, idealism: 0.2, stability: 0.75, ambition: 0.95, authenticity: 0.35, novelty: 0.45 } },
        { value: 3, label: '等大家都用了再考虑', scores: { emotional: 0.65, strategy: 0.5, energy: 0.85, idealism: 0.55, stability: 0.5, ambition: 0.3, authenticity: 0.5, novelty: 0.25 } },
        { value: 4, label: '不太想学，旧的用得好好的', scores: { emotional: 0.5, strategy: 0.6, energy: 0.25, idealism: 0.8, stability: 0.95, ambition: 0.4, authenticity: 0.7, novelty: 0.15 } },
        { value: 5, label: '抗拒变化，除非被迫', scores: { emotional: 0.3, strategy: 1.0, energy: 0.15, idealism: 0.2, stability: 0.95, ambition: 0.95, authenticity: 0.1, novelty: 0.1 } },
      ],
      required: true,
    },
  ],

  // 自定义计算逻辑（使用加权欧式距离）
  calculateResults: (answers: Record<string, number>) => {
    // 1. 计算用户的八维度平均分
    const userScores = {
      emotional: 0,
      strategy: 0,
      energy: 0,
      idealism: 0,
      stability: 0,
      ambition: 0,
      authenticity: 0,
      novelty: 0,
    };

    let totalQuestions = 0;

    // 遍历所有答案，累加各维度分数
    zhz.questions.forEach((question) => {
      const answerId = answers[question.id];
      if (answerId !== undefined) {
        const selectedOption = question.options.find(opt => opt.value === answerId);
        if (selectedOption && 'scores' in selectedOption) {
          const scores = selectedOption.scores as Record<string, number>;
          Object.keys(userScores).forEach((dim) => {
            userScores[dim as keyof typeof userScores] += scores[dim] || 0;
          });
          totalQuestions++;
        }
      }
    });

    // 计算平均值
    Object.keys(userScores).forEach((dim) => {
      userScores[dim as keyof typeof userScores] /= totalQuestions;
    });

    // 2. 计算与每个角色的加权欧式距离
    const similarities: Array<{ character: string; similarity: number }> = [];

    Object.entries(CHARACTER_PROFILES).forEach(([charId, charData]) => {
      const distance = weightedEuclideanDistance(userScores, charData.scores);
      // 将距离转换为相似度（距离越小，相似度越高）
      const similarity = 1 / (1 + distance);
      similarities.push({ character: charId, similarity });
    });

    // 3. 按相似度排序，取前3
    similarities.sort((a, b) => b.similarity - a.similarity);
    const topMatches = similarities.slice(0, 3);

    // 4. 构建结果
    const primaryChar = CHARACTER_PROFILES[topMatches[0].character as keyof typeof CHARACTER_PROFILES];

    return {
      totalScore: Math.round(topMatches[0].similarity * 100),
      dimensionScores: Object.entries(userScores).map(([key, value]) => ({
        dimension: ZHZ_DIMENSIONS[key as keyof typeof ZHZ_DIMENSIONS],
        score: Math.round(value * 100),
      })),
      interpretation: generateInterpretation(topMatches, userScores),
      recommendations: [
        `你的首要人格类型是 ${primaryChar.emoji} ${primaryChar.name}`,
        `相似度：${topMatches.map(m => {
          const char = CHARACTER_PROFILES[m.character as keyof typeof CHARACTER_PROFILES];
          return `${char.name} ${Math.round(m.similarity * 100)}%`;
        }).join(' | ')}`,
      ],
      metadata: {
        topCharacters: topMatches.map(m => ({
          id: m.character,
          name: CHARACTER_PROFILES[m.character as keyof typeof CHARACTER_PROFILES].name,
          similarity: Math.round(m.similarity * 100),
        })),
        userVector: userScores,
      }
    };
  },
};

// 加权欧式距离计算
function weightedEuclideanDistance(
  vec1: Record<string, number>,
  vec2: Record<string, number>
): number {
  const keys = Object.keys(vec1);
  let sumSquaredDiff = 0;

  keys.forEach(key => {
    const weight = DIMENSION_WEIGHTS[key as keyof typeof DIMENSION_WEIGHTS] || 1.0;
    const diff = vec1[key] - vec2[key];
    sumSquaredDiff += weight * (diff ** 2);
  });

  return Math.sqrt(sumSquaredDiff);
}

// 生成个性化解读
function generateInterpretation(
  topMatches: Array<{ character: string; similarity: number }>,
  userScores: Record<string, number>
): string {
  const primaryChar = CHARACTER_PROFILES[topMatches[0].character as keyof typeof CHARACTER_PROFILES];

  // 找到用户最突出的维度
  const sortedDims = Object.entries(userScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  const dimNames = sortedDims.map(([key]) =>
    ZHZ_DIMENSIONS[key as keyof typeof ZHZ_DIMENSIONS]
  );

  return `${primaryChar.emoji} **你最像【${primaryChar.name}】**\n\n` +
    `**${primaryChar.subtitle}**\n\n` +
    getCharacterDescription(topMatches[0].character) + '\n\n' +
    `你的核心特质体现在 **${dimNames.join('** 和 **')}** 上。\n\n` +
    `**与你相似的其他角色：**\n` +
    topMatches.slice(1).map(m => {
      const char = CHARACTER_PROFILES[m.character as keyof typeof CHARACTER_PROFILES];
      return `• ${char.emoji} ${char.name} (${Math.round(m.similarity * 100)}%)`;
    }).join('\n');
}

// 角色详细描述
function getCharacterDescription(characterId: string): string {
  const descriptions: Record<string, string> = {
    'zhenhuan_early': '你心思细腻、善良温婉，重情重义。你相信人性美好，也因此容易受伤。你有极高的同理心与道德感，愿意为了爱和真诚而妥协。在人际关系中，你倾向于用理解和包容去化解矛盾，对待情感时充满浪漫的期待。\n\n**关键词：共情力、道德感、真诚温暖**',

    'zhenhuan_late': '你经历了成长的蜕变，明白柔软也需要锋芒。你懂得平衡理想与现实，用策略守护底线。在复杂的人际关系中，你能够保持清醒的头脑，既不轻易信任也不轻易放弃，善于在适当的时机采取行动。\n\n**关键词：战略思维、情绪掌控、适应能力**',

    'anlingrong': '你内心敏感、渴望被爱，却害怕被忽视。外界评价对你影响深远，容易自责与焦虑。你努力想要证明自己，却又担心不够好。在人际交往中，你善于察言观色，但也容易过度解读他人的态度。\n\n**关键词：细致敏锐、努力上进、自我价值感低**',

    'queen': '你思维缜密、计划周全，擅长在复杂关系中掌握主动。你不轻信他人，也极度自律。在你眼中，世界是一个需要精心管理的系统，你习惯于制定规则、掌控局面，并确保一切按照计划进行。\n\n**关键词：系统思维、自律、沉着冷静**',

    'huafei': '你自信张扬、情感浓烈，喜欢掌控场面，也害怕孤独。热情是真实的你，骄傲是你的盔甲。你不喜欢隐藏，爱恨分明，情绪表达直接而强烈。在社交场合中，你往往是焦点，但也渴望被真正理解。\n\n**关键词：感染力、自信果敢、真实坦率**',

    'shenmeizhuang': '你看似温柔，实则坚韧。在困境中保持自尊，宁可受委屈，也不丢分寸。你有着强大的内在力量和自我约束力，懂得在适当的时候坚持原则，也知道何时该妥协。你是典型的外柔内刚型人格。\n\n**关键词：韧性、自尊自重、情绪稳定**',

    'huanbi': '你务实果断，能在理想与现实之间找到平衡。有野心但也有情义，擅长隐忍与自我调节。你清楚地知道自己想要什么，也懂得为了目标该付出什么。你不会被不切实际的幻想束缚，但也不是冷血的功利主义者。\n\n**关键词：执行力、现实务实、忠诚可靠**',

    'supeisheng': '你懂人情世故，知道何时出声、何时沉默。不求锋芒，但求安稳与圆满。你是团队中的润滑剂，善于观察和调节气氛，不会成为冲突的中心，但往往是关键时刻的稳定力量。\n\n**关键词：情商高、忠诚可靠、灵活应变**',

    'guojunwang': '你热情真诚、富有浪漫主义精神。追求真爱与自由，不愿被束缚在权力之中。你相信真情实感，愿意为了理想和爱情放弃世俗的利益。你的真诚和热情感染着周围的人。\n\n**关键词：真诚坦率、热情洋溢、独立思考**',

    'wentaiyi': '你关心他人，愿意为别人承担痛苦。在安静中展现力量，在理智中守护温情。你有着温暖的内心和冷静的头脑，既能感同身受，又能保持专业的距离。你是天生的倾听者和疗愈者。\n\n**关键词：同理心、理性温和、宽容包容**',

    'emperor': '你冷静决断，擅长统筹全局。理性强于感性，重视控制感和结果导向。你习惯站在高处俯瞰全局，善于在复杂的局势中做出最优决策。你是天生的领导者和决策者。\n\n**关键词：战略眼光、决断力、统筹能力**',

    'ningguiren': '你深谙权衡之道，懂得用表面的温和掩饰锋芒。你擅长策略与时机判断，是典型的隐形强者。你不急于表现，而是静待时机，在关键时刻才展露实力。你是大器晚成型人格。\n\n**关键词：耐心、洞察力、策略思维**',
  };

  return descriptions[characterId] || '';
}
