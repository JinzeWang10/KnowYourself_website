/**
 * ZHZ: 甄嬛传人格测评
 *
 * 基于《甄嬛传》中的12位核心人物为原型
 * 通过六维度模型评估用户的人格特征
 */

import type { QuizTemplate } from '@/types/quiz';

// 六大心理维度定义
export const ZHZ_DIMENSIONS = {
  emotional: '情感敏感度', // 对他人情绪、评价的反应强度
  strategy: '策略与心机',  // 行动前的思考深度与谋略性
  dominance: '支配与掌控', // 主导欲、控制环境的倾向
  energy: '外显能量',     // 表达力、自信与外向程度
  idealism: '情感理想化', // 对爱、道德、理想的执着
  stability: '稳定与自律', // 内在稳定性、责任感与耐心
} as const;

// 12个角色的六维度坐标
export const CHARACTER_PROFILES = {
  'zhenhuan_early': {
    name: '甄嬛（前期）',
    emoji: '🕊️',
    subtitle: '理想主义与温柔的力量',
    scores: {
      emotional: 0.8,
      strategy: 0.4,
      dominance: 0.3,
      energy: 0.4,
      idealism: 0.9,
      stability: 0.5,
    }
  },
  'zhenhuan_late': {
    name: '甄嬛（后期）',
    emoji: '🦢',
    subtitle: '理智与权衡的女王',
    scores: {
      emotional: 0.5,
      strategy: 0.9,
      dominance: 0.8,
      energy: 0.3,
      idealism: 0.4,
      stability: 0.7,
    }
  },
  'anlingrong': {
    name: '安陵容',
    emoji: '🪞',
    subtitle: '敏感而脆弱的自我怀疑者',
    scores: {
      emotional: 0.9,
      strategy: 0.5,
      dominance: 0.2,
      energy: 0.3,
      idealism: 0.7,
      stability: 0.3,
    }
  },
  'queen': {
    name: '皇后',
    emoji: '👑',
    subtitle: '理性与秩序的掌控者',
    scores: {
      emotional: 0.4,
      strategy: 0.95,
      dominance: 0.9,
      energy: 0.2,
      idealism: 0.3,
      stability: 0.8,
    }
  },
  'huafei': {
    name: '华妃',
    emoji: '🔥',
    subtitle: '外放能量与极致情感',
    scores: {
      emotional: 0.3,
      strategy: 0.3,
      dominance: 0.6,
      energy: 0.95,
      idealism: 0.4,
      stability: 0.3,
    }
  },
  'shenmeizhuang': {
    name: '沈眉庄',
    emoji: '🌿',
    subtitle: '优雅与坚韧并存的理性者',
    scores: {
      emotional: 0.5,
      strategy: 0.6,
      dominance: 0.5,
      energy: 0.3,
      idealism: 0.7,
      stability: 0.9,
    }
  },
  'huanbi': {
    name: '浣碧',
    emoji: '💧',
    subtitle: '现实与忠诚的行动派',
    scores: {
      emotional: 0.4,
      strategy: 0.7,
      dominance: 0.6,
      energy: 0.5,
      idealism: 0.4,
      stability: 0.6,
    }
  },
  'supeisheng': {
    name: '苏培盛',
    emoji: '🪶',
    subtitle: '忠心耿耿的中庸者',
    scores: {
      emotional: 0.6,
      strategy: 0.7,
      dominance: 0.4,
      energy: 0.8,
      idealism: 0.5,
      stability: 0.5,
    }
  },
  'guojunwang': {
    name: '果郡王',
    emoji: '🌞',
    subtitle: '浪漫自由的理想行动派',
    scores: {
      emotional: 0.7,
      strategy: 0.3,
      dominance: 0.3,
      energy: 0.9,
      idealism: 0.9,
      stability: 0.5,
    }
  },
  'wentaiyi': {
    name: '温太医',
    emoji: '🌸',
    subtitle: '温柔理智的疗愈者',
    scores: {
      emotional: 0.9,
      strategy: 0.2,
      dominance: 0.3,
      energy: 0.4,
      idealism: 0.8,
      stability: 0.7,
    }
  },
  'emperor': {
    name: '皇上',
    emoji: '🦅',
    subtitle: '权力与秩序的掌舵者',
    scores: {
      emotional: 0.3,
      strategy: 0.8,
      dominance: 1.0,
      energy: 0.6,
      idealism: 0.3,
      stability: 0.7,
    }
  },
  'ningguiren': {
    name: '宁贵人',
    emoji: '🕰️',
    subtitle: '隐忍深思的现实派',
    scores: {
      emotional: 0.5,
      strategy: 0.85,
      dominance: 0.7,
      energy: 0.4,
      idealism: 0.4,
      stability: 0.6,
    }
  },
} as const;

export const zhz: QuizTemplate = {
  id: 'zhz',
  title: '甄嬛传人格测评',
  titleEn: 'The Legend of Zhen Huan Personality Assessment',
  description: '以《甄嬛传》12位核心人物为原型，测试你最像谁',
  category: '趣味测评',
  purpose: '通过20道现代生活场景题，从情感、理性、策略、自控等维度，判断你最接近哪种"宫廷人格"',
  duration: '5-8分钟',
  questionCount: 20,

  questions: [
    // Q1
    {
      id: 'zhz_q1',
      type: 'scale',
      question: '当团队出现分歧时，你会怎么做？',
      dimension: 'conflict_handling',
      options: [
        { value: 1, label: '尽量协调大家的情绪，让每个人都被理解', scores: { emotional: 0.8, strategy: 0.4, dominance: 0.3, energy: 0.4, idealism: 0.9, stability: 0.5 } },
        { value: 2, label: '先观察，找到关键人物再出手', scores: { emotional: 0.5, strategy: 0.9, dominance: 0.8, energy: 0.3, idealism: 0.4, stability: 0.7 } },
        { value: 3, label: '有什么就直接说，不喜欢兜圈子', scores: { emotional: 0.3, strategy: 0.3, dominance: 0.6, energy: 0.95, idealism: 0.4, stability: 0.3 } },
        { value: 4, label: '暗中影响决策，让结果倾向我', scores: { emotional: 0.4, strategy: 0.95, dominance: 0.9, energy: 0.2, idealism: 0.3, stability: 0.8 } },
        { value: 5, label: '劝大家冷静，把目标摆出来统一方向', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
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
        { value: 1, label: '假装不在意，暗中留意', scores: { emotional: 0.5, strategy: 0.9, dominance: 0.8, energy: 0.3, idealism: 0.4, stability: 0.7 } },
        { value: 2, label: '回怼回去，不吃亏！', scores: { emotional: 0.3, strategy: 0.3, dominance: 0.6, energy: 0.95, idealism: 0.4, stability: 0.3 } },
        { value: 3, label: '默默忍耐，希望用成绩证明', scores: { emotional: 0.9, strategy: 0.5, dominance: 0.2, energy: 0.3, idealism: 0.7, stability: 0.3 } },
        { value: 4, label: '表面温和，实则早布后路', scores: { emotional: 0.3, strategy: 0.8, dominance: 1.0, energy: 0.6, idealism: 0.3, stability: 0.7 } },
        { value: 5, label: '转移注意力，不被小事干扰', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
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
        { value: 1, label: '真诚和安全感', scores: { emotional: 0.8, strategy: 0.4, dominance: 0.3, energy: 0.4, idealism: 0.9, stability: 0.5 } },
        { value: 2, label: '尊重与界限', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
        { value: 3, label: '占有欲和热情', scores: { emotional: 0.3, strategy: 0.3, dominance: 0.6, energy: 0.95, idealism: 0.4, stability: 0.3 } },
        { value: 4, label: '对方的聪明与远见', scores: { emotional: 0.5, strategy: 0.9, dominance: 0.8, energy: 0.3, idealism: 0.4, stability: 0.7 } },
        { value: 5, label: '能被看见、被认可的感觉', scores: { emotional: 0.9, strategy: 0.5, dominance: 0.2, energy: 0.3, idealism: 0.7, stability: 0.3 } },
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
        { value: 1, label: '当面澄清，不喜欢模糊', scores: { emotional: 0.3, strategy: 0.3, dominance: 0.6, energy: 0.95, idealism: 0.4, stability: 0.3 } },
        { value: 2, label: '沉默，让时间说明一切', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
        { value: 3, label: '收集证据，翻盘反击', scores: { emotional: 0.5, strategy: 0.9, dominance: 0.8, energy: 0.3, idealism: 0.4, stability: 0.7 } },
        { value: 4, label: '忍下来，心里却永远记得', scores: { emotional: 0.9, strategy: 0.5, dominance: 0.2, energy: 0.3, idealism: 0.7, stability: 0.3 } },
        { value: 5, label: '劝自己放下，不值得计较', scores: { emotional: 0.9, strategy: 0.2, dominance: 0.3, energy: 0.4, idealism: 0.8, stability: 0.7 } },
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
        { value: 1, label: '主动制造浪漫与惊喜', scores: { emotional: 0.7, strategy: 0.3, dominance: 0.3, energy: 0.9, idealism: 0.9, stability: 0.5 } },
        { value: 2, label: '偷偷观察，不敢表露', scores: { emotional: 0.9, strategy: 0.5, dominance: 0.2, energy: 0.3, idealism: 0.7, stability: 0.3 } },
        { value: 3, label: '小心试探，确认对方意图', scores: { emotional: 0.8, strategy: 0.4, dominance: 0.3, energy: 0.4, idealism: 0.9, stability: 0.5 } },
        { value: 4, label: '明确表达，关系要清晰', scores: { emotional: 0.3, strategy: 0.3, dominance: 0.6, energy: 0.95, idealism: 0.4, stability: 0.3 } },
        { value: 5, label: '深藏情感，只用行动表现', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
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
        { value: 1, label: '立刻找原因，主动承担', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
        { value: 2, label: '想办法补救，不让领导知道', scores: { emotional: 0.4, strategy: 0.7, dominance: 0.6, energy: 0.5, idealism: 0.4, stability: 0.6 } },
        { value: 3, label: '先安抚同事情绪，再商量解决', scores: { emotional: 0.8, strategy: 0.4, dominance: 0.3, energy: 0.4, idealism: 0.9, stability: 0.5 } },
        { value: 4, label: '盘算如何避免责任落到自己身上', scores: { emotional: 0.4, strategy: 0.95, dominance: 0.9, energy: 0.2, idealism: 0.3, stability: 0.8 } },
        { value: 5, label: '平静分析，吸取教训', scores: { emotional: 0.9, strategy: 0.2, dominance: 0.3, energy: 0.4, idealism: 0.8, stability: 0.7 } },
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
        { value: 1, label: '表面原谅，暗中防备', scores: { emotional: 0.5, strategy: 0.9, dominance: 0.8, energy: 0.3, idealism: 0.4, stability: 0.7 } },
        { value: 2, label: '冷处理，不再来往', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
        { value: 3, label: '记恨一辈子，哪怕不报复', scores: { emotional: 0.9, strategy: 0.5, dominance: 0.2, energy: 0.3, idealism: 0.7, stability: 0.3 } },
        { value: 4, label: '当众撕破脸，绝不留情', scores: { emotional: 0.3, strategy: 0.3, dominance: 0.6, energy: 0.95, idealism: 0.4, stability: 0.3 } },
        { value: 5, label: '尝试理解对方的原因', scores: { emotional: 0.9, strategy: 0.2, dominance: 0.3, energy: 0.4, idealism: 0.8, stability: 0.7 } },
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
        { value: 1, label: '热闹场合，成为焦点', scores: { emotional: 0.3, strategy: 0.3, dominance: 0.6, energy: 0.95, idealism: 0.4, stability: 0.3 } },
        { value: 2, label: '安静环境，小圈交流', scores: { emotional: 0.8, strategy: 0.4, dominance: 0.3, energy: 0.4, idealism: 0.9, stability: 0.5 } },
        { value: 3, label: '精准选择人脉，带目的接触', scores: { emotional: 0.4, strategy: 0.95, dominance: 0.9, energy: 0.2, idealism: 0.3, stability: 0.8 } },
        { value: 4, label: '与志同道合的人深聊', scores: { emotional: 0.7, strategy: 0.3, dominance: 0.3, energy: 0.9, idealism: 0.9, stability: 0.5 } },
        { value: 5, label: '沉默观察，适时出手', scores: { emotional: 0.5, strategy: 0.9, dominance: 0.8, energy: 0.3, idealism: 0.4, stability: 0.7 } },
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
        { value: 1, label: '直接拒绝，不纠结', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
        { value: 2, label: '动心但会克制', scores: { emotional: 0.8, strategy: 0.4, dominance: 0.3, energy: 0.4, idealism: 0.9, stability: 0.5 } },
        { value: 3, label: '顺势而为，不浪费机会', scores: { emotional: 0.3, strategy: 0.8, dominance: 1.0, energy: 0.6, idealism: 0.3, stability: 0.7 } },
        { value: 4, label: '表面拒绝，暗中利用', scores: { emotional: 0.5, strategy: 0.85, dominance: 0.7, energy: 0.4, idealism: 0.4, stability: 0.6 } },
        { value: 5, label: '被情感冲昏头脑', scores: { emotional: 0.9, strategy: 0.5, dominance: 0.2, energy: 0.3, idealism: 0.7, stability: 0.3 } },
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
        { value: 1, label: '直接据理力争', scores: { emotional: 0.3, strategy: 0.3, dominance: 0.6, energy: 0.95, idealism: 0.4, stability: 0.3 } },
        { value: 2, label: '心里不爽但懒得争', scores: { emotional: 0.9, strategy: 0.2, dominance: 0.3, energy: 0.4, idealism: 0.8, stability: 0.7 } },
        { value: 3, label: '记下来，以后慢慢算账', scores: { emotional: 0.5, strategy: 0.9, dominance: 0.8, energy: 0.3, idealism: 0.4, stability: 0.7 } },
        { value: 4, label: '笑着祝贺，暗中布局', scores: { emotional: 0.4, strategy: 0.95, dominance: 0.9, energy: 0.2, idealism: 0.3, stability: 0.8 } },
        { value: 5, label: '表示理解，继续努力', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
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
        { value: 1, label: '越挫越勇，更想赢', scores: { emotional: 0.5, strategy: 0.9, dominance: 0.8, energy: 0.3, idealism: 0.4, stability: 0.7 } },
        { value: 2, label: '会先自我怀疑', scores: { emotional: 0.9, strategy: 0.5, dominance: 0.2, energy: 0.3, idealism: 0.7, stability: 0.3 } },
        { value: 3, label: '平静分析，逐步解决', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
        { value: 4, label: '外表冷静，内心翻腾', scores: { emotional: 0.8, strategy: 0.4, dominance: 0.3, energy: 0.4, idealism: 0.9, stability: 0.5 } },
        { value: 5, label: '暴躁发泄一通就好', scores: { emotional: 0.3, strategy: 0.3, dominance: 0.6, energy: 0.95, idealism: 0.4, stability: 0.3 } },
      ],
      required: true,
    },

    // Q12
    {
      id: 'zhz_q12',
      type: 'scale',
      question: '你最看重友谊的什么？',
      dimension: 'friendship_values',
      options: [
        { value: 1, label: '信任与真心', scores: { emotional: 0.8, strategy: 0.4, dominance: 0.3, energy: 0.4, idealism: 0.9, stability: 0.5 } },
        { value: 2, label: '利益上的互助', scores: { emotional: 0.5, strategy: 0.85, dominance: 0.7, energy: 0.4, idealism: 0.4, stability: 0.6 } },
        { value: 3, label: '共同成长的陪伴', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
        { value: 4, label: '永远的忠诚', scores: { emotional: 0.6, strategy: 0.7, dominance: 0.4, energy: 0.8, idealism: 0.5, stability: 0.5 } },
        { value: 5, label: '随缘，关系淡了也无妨', scores: { emotional: 0.9, strategy: 0.2, dominance: 0.3, energy: 0.4, idealism: 0.8, stability: 0.7 } },
      ],
      required: true,
    },

    // Q13
    {
      id: 'zhz_q13',
      type: 'scale',
      question: '你最不能忍受的是？',
      dimension: 'intolerance',
      options: [
        { value: 1, label: '被背叛', scores: { emotional: 0.5, strategy: 0.9, dominance: 0.8, energy: 0.3, idealism: 0.4, stability: 0.7 } },
        { value: 2, label: '被忽视', scores: { emotional: 0.9, strategy: 0.5, dominance: 0.2, energy: 0.3, idealism: 0.7, stability: 0.3 } },
        { value: 3, label: '被质疑能力', scores: { emotional: 0.3, strategy: 0.8, dominance: 1.0, energy: 0.6, idealism: 0.3, stability: 0.7 } },
        { value: 4, label: '被束缚自由', scores: { emotional: 0.7, strategy: 0.3, dominance: 0.3, energy: 0.9, idealism: 0.9, stability: 0.5 } },
        { value: 5, label: '被误解动机', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
      ],
      required: true,
    },

    // Q14
    {
      id: 'zhz_q14',
      type: 'scale',
      question: '在领导岗位上，你会？',
      dimension: 'leadership_style',
      options: [
        { value: 1, label: '严谨稳重，事事安排周全', scores: { emotional: 0.4, strategy: 0.95, dominance: 0.9, energy: 0.2, idealism: 0.3, stability: 0.8 } },
        { value: 2, label: '激励大家，靠热情感染', scores: { emotional: 0.3, strategy: 0.3, dominance: 0.6, energy: 0.95, idealism: 0.4, stability: 0.3 } },
        { value: 3, label: '平衡关系，人人有分', scores: { emotional: 0.5, strategy: 0.9, dominance: 0.8, energy: 0.3, idealism: 0.4, stability: 0.7 } },
        { value: 4, label: '少说话，多观察形势', scores: { emotional: 0.5, strategy: 0.85, dominance: 0.7, energy: 0.4, idealism: 0.4, stability: 0.6 } },
        { value: 5, label: '不太想当领导', scores: { emotional: 0.9, strategy: 0.2, dominance: 0.3, energy: 0.4, idealism: 0.8, stability: 0.7 } },
      ],
      required: true,
    },

    // Q15
    {
      id: 'zhz_q15',
      type: 'scale',
      question: '你如何看待"正义"？',
      dimension: 'justice_view',
      options: [
        { value: 1, label: '必须维护，即便会牺牲', scores: { emotional: 0.8, strategy: 0.4, dominance: 0.3, energy: 0.4, idealism: 0.9, stability: 0.5 } },
        { value: 2, label: '要灵活，正义要服务现实', scores: { emotional: 0.3, strategy: 0.8, dominance: 1.0, energy: 0.6, idealism: 0.3, stability: 0.7 } },
        { value: 3, label: '没有绝对正义，只有立场不同', scores: { emotional: 0.5, strategy: 0.9, dominance: 0.8, energy: 0.3, idealism: 0.4, stability: 0.7 } },
        { value: 4, label: '愿意为弱者发声', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
        { value: 5, label: '选择对自己最稳妥的方式', scores: { emotional: 0.5, strategy: 0.85, dominance: 0.7, energy: 0.4, idealism: 0.4, stability: 0.6 } },
      ],
      required: true,
    },

    // Q16
    {
      id: 'zhz_q16',
      type: 'scale',
      question: '如果你突然升职，你会？',
      dimension: 'promotion_reaction',
      options: [
        { value: 1, label: '表面谦虚，内心喜悦', scores: { emotional: 0.8, strategy: 0.4, dominance: 0.3, energy: 0.4, idealism: 0.9, stability: 0.5 } },
        { value: 2, label: '立刻分析背后的原因', scores: { emotional: 0.4, strategy: 0.95, dominance: 0.9, energy: 0.2, idealism: 0.3, stability: 0.8 } },
        { value: 3, label: '担心别人嫉妒，谨慎行事', scores: { emotional: 0.9, strategy: 0.5, dominance: 0.2, energy: 0.3, idealism: 0.7, stability: 0.3 } },
        { value: 4, label: '立刻计划下一步策略', scores: { emotional: 0.5, strategy: 0.9, dominance: 0.8, energy: 0.3, idealism: 0.4, stability: 0.7 } },
        { value: 5, label: '不太在意，继续努力', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
      ],
      required: true,
    },

    // Q17
    {
      id: 'zhz_q17',
      type: 'scale',
      question: '面对一个新环境，你会？',
      dimension: 'new_environment',
      options: [
        { value: 1, label: '主动融入，快速建立关系', scores: { emotional: 0.3, strategy: 0.3, dominance: 0.6, energy: 0.95, idealism: 0.4, stability: 0.3 } },
        { value: 2, label: '观察氛围，慢慢适应', scores: { emotional: 0.8, strategy: 0.4, dominance: 0.3, energy: 0.4, idealism: 0.9, stability: 0.5 } },
        { value: 3, label: '掌握关键人物信息', scores: { emotional: 0.4, strategy: 0.95, dominance: 0.9, energy: 0.2, idealism: 0.3, stability: 0.8 } },
        { value: 4, label: '安静学习规则', scores: { emotional: 0.9, strategy: 0.2, dominance: 0.3, energy: 0.4, idealism: 0.8, stability: 0.7 } },
        { value: 5, label: '让自己成为有用的人', scores: { emotional: 0.4, strategy: 0.7, dominance: 0.6, energy: 0.5, idealism: 0.4, stability: 0.6 } },
      ],
      required: true,
    },

    // Q18
    {
      id: 'zhz_q18',
      type: 'scale',
      question: '当你意识到喜欢的人另有所爱？',
      dimension: 'unrequited_love',
      options: [
        { value: 1, label: '痛苦但祝福', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
        { value: 2, label: '假装不在意，内心崩溃', scores: { emotional: 0.9, strategy: 0.5, dominance: 0.2, energy: 0.3, idealism: 0.7, stability: 0.3 } },
        { value: 3, label: '不甘心，会努力争取', scores: { emotional: 0.3, strategy: 0.3, dominance: 0.6, energy: 0.95, idealism: 0.4, stability: 0.3 } },
        { value: 4, label: '默默退出，藏于心底', scores: { emotional: 0.8, strategy: 0.4, dominance: 0.3, energy: 0.4, idealism: 0.9, stability: 0.5 } },
        { value: 5, label: '转移注意力，重新开始', scores: { emotional: 0.7, strategy: 0.3, dominance: 0.3, energy: 0.9, idealism: 0.9, stability: 0.5 } },
      ],
      required: true,
    },

    // Q19
    {
      id: 'zhz_q19',
      type: 'scale',
      question: '如果你有一项强大能力，你希望是？',
      dimension: 'desired_ability',
      options: [
        { value: 1, label: '看透人心', scores: { emotional: 0.4, strategy: 0.95, dominance: 0.9, energy: 0.2, idealism: 0.3, stability: 0.8 } },
        { value: 2, label: '让别人喜欢自己', scores: { emotional: 0.9, strategy: 0.5, dominance: 0.2, energy: 0.3, idealism: 0.7, stability: 0.3 } },
        { value: 3, label: '治愈他人痛苦', scores: { emotional: 0.9, strategy: 0.2, dominance: 0.3, energy: 0.4, idealism: 0.8, stability: 0.7 } },
        { value: 4, label: '控制命运', scores: { emotional: 0.5, strategy: 0.9, dominance: 0.8, energy: 0.3, idealism: 0.4, stability: 0.7 } },
        { value: 5, label: '带给人幸福', scores: { emotional: 0.7, strategy: 0.3, dominance: 0.3, energy: 0.9, idealism: 0.9, stability: 0.5 } },
      ],
      required: true,
    },

    // Q20
    {
      id: 'zhz_q20',
      type: 'scale',
      question: '你最希望被人如何记住？',
      dimension: 'legacy',
      options: [
        { value: 1, label: '善良真挚', scores: { emotional: 0.8, strategy: 0.4, dominance: 0.3, energy: 0.4, idealism: 0.9, stability: 0.5 } },
        { value: 2, label: '坚定优雅', scores: { emotional: 0.5, strategy: 0.6, dominance: 0.5, energy: 0.3, idealism: 0.7, stability: 0.9 } },
        { value: 3, label: '聪明果断', scores: { emotional: 0.5, strategy: 0.9, dominance: 0.8, energy: 0.3, idealism: 0.4, stability: 0.7 } },
        { value: 4, label: '独立自信', scores: { emotional: 0.3, strategy: 0.3, dominance: 0.6, energy: 0.95, idealism: 0.4, stability: 0.3 } },
        { value: 5, label: '温柔体贴', scores: { emotional: 0.9, strategy: 0.2, dominance: 0.3, energy: 0.4, idealism: 0.8, stability: 0.7 } },
      ],
      required: true,
    },
  ],

  // 自定义计算逻辑
  calculateResults: (answers: Record<string, number>) => {
    // 1. 计算用户的六维度平均分
    const userScores = {
      emotional: 0,
      strategy: 0,
      dominance: 0,
      energy: 0,
      idealism: 0,
      stability: 0,
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

    // 2. 计算与每个角色的余弦相似度
    const similarities: Array<{ character: string; similarity: number }> = [];

    Object.entries(CHARACTER_PROFILES).forEach(([charId, charData]) => {
      const similarity = cosineSimilarity(userScores, charData.scores);
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

// 余弦相似度计算
function cosineSimilarity(
  vec1: Record<string, number>,
  vec2: Record<string, number>
): number {
  const keys = Object.keys(vec1);

  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;

  keys.forEach(key => {
    dotProduct += vec1[key] * vec2[key];
    norm1 += vec1[key] ** 2;
    norm2 += vec2[key] ** 2;
  });

  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
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
    'zhenhuan_early': '你心思细腻、善良温婉，重情重义。你相信人性美好，也因此容易受伤。你有同理心与道德感，愿意为了爱和真诚而妥协。\n\n**关键词：感性、善良、共情力**',

    'zhenhuan_late': '你经历了成长的蜕变，明白柔软也需要锋芒。你懂得平衡理想与现实，用策略守护底线。\n\n**关键词:掌控力、成熟、策略性**',

    'anlingrong': '你内心敏感、渴望被爱，却害怕被忽视。外界评价对你影响深远，容易自责与焦虑。\n\n**关键词：自卑、敏感、需要认可**',

    'queen': '你思维缜密、计划周全，擅长在复杂关系中掌握主动。你不轻信他人，也极度自律。\n\n**关键词：权谋、冷静、自控**',

    'huafei': '你自信张扬、情感浓烈，喜欢掌控场面，也害怕孤独。热情是真实的你，骄傲是你的盔甲。\n\n**关键词：外向、主导、热烈**',

    'shenmeizhuang': '你看似温柔，实则坚韧。在困境中保持自尊，宁可受委屈，也不丢分寸。\n\n**关键词：理智、稳重、自尊**',

    'huanbi': '你务实果断，能在理想与现实之间找到平衡。有野心但也有情义，擅长隐忍与自我调节。\n\n**关键词：实干、隐忍、执行力**',

    'supeisheng': '你懂人情世故，知道何时出声、何时沉默。不求锋芒，但求安稳与圆满。\n\n**关键词：圆融、忠诚、温和**',

    'guojunwang': '你热情真诚、富有浪漫主义精神。追求真爱与自由，不愿被束缚在权力之中。\n\n**关键词：浪漫、真诚、独立**',

    'wentaiyi': '你关心他人，愿意为别人承担痛苦。在安静中展现力量，在理智中守护温情。\n\n**关键词：温暖、理性、治愈力**',

    'emperor': '你冷静决断，擅长统筹全局。理性强于感性，重视控制感和结果导向。\n\n**关键词：决断、权威、掌控**',

    'ningguiren': '你深谙权衡之道，懂得用表面的温和掩饰锋芒。你擅长策略与时机判断，是典型的隐形强者。\n\n**关键词：谨慎、现实、布局感**',
  };

  return descriptions[characterId] || '';
}
