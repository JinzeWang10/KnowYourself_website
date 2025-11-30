/**
 * Zootopia: 疯狂动物城人格测评
 *
 * 基于《疯狂动物城》中的8位核心角色为原型
 * 通过五维度模型评估用户的人格特征
 */

import type { QuizTemplate } from '@/types/quiz';

// 五大心理维度定义（双极模型）
export const ZOOTOPIA_DIMENSIONS = {
  pace: '行动速度',           // 处理任务的速度、反应节奏、行动倾向（低=慢条斯理 ↔ 高=高速执行）
  orderliness: '秩序偏好',    // 对规则、规范、流程的接受度与依赖程度（低=随性灵活 ↔ 高=自律严谨）
  sincerity: '真诚指数',      // 动机透明度、表达方式、言行一致程度（低=策略圆滑 ↔ 高=坦率透明）
  extraversion: '外向呈现',   // 社交场合中的表达方式、存在感与能量来源（低=内向克制 ↔ 高=外向张扬）
  ambition: '进取心',         // 成就动机、目标追求程度及奋斗心态（低=安于现状 ↔ 高=强烈目标驱动）
} as const;

// 维度双极标签（用于条形图可视化）
export const ZOOTOPIA_DIMENSION_LABELS = {
  pace: {
    left: '慢条斯理',
    right: '高速执行'
  },
  orderliness: {
    left: '随性灵活',
    right: '自律严谨'
  },
  sincerity: {
    left: '策略圆滑',
    right: '坦率透明'
  },
  extraversion: {
    left: '内向克制',
    right: '外向张扬'
  },
  ambition: {
    left: '安于现状',
    right: '目标驱动'
  }
} as const;

// 8个角色的五维度坐标（0-1范围）
export const CHARACTER_PROFILES = {
  'judy_hopps': {
    name: '朱迪 Judy Hopps',
    emoji: '🐰',
    subtitle: '理想驱动的高速奋斗者',
    scores: {
      pace: 0.95,
      orderliness: 0.85,
      sincerity: 0.80,
      extraversion: 0.80,
      ambition: 0.95,
    }
  },
  'nick_wilde': {
    name: '尼克 Nick Wilde',
    emoji: '🦊',
    subtitle: '机智圆滑的低调进取者',
    scores: {
      pace: 0.75,
      orderliness: 0.45,
      sincerity: 0.30,
      extraversion: 0.55,
      ambition: 0.40,
    }
  },
  'mayor_lionheart': {
    name: '马市长 Winddancer',
    emoji: '🐴',
    subtitle: '庄重有序的高野心领袖',
    scores: {
      pace: 0.55,
      orderliness: 0.90,
      sincerity: 0.80,
      extraversion: 0.65,
      ambition: 0.90,
    }
  },
  'clawhauser': {
    name: '豹子警官 Clawhauser',
    emoji: '🐆',
    subtitle: '热情温暖的社交型推动者',
    scores: {
      pace: 0.60,
      orderliness: 0.80,
      sincerity: 0.75,
      extraversion: 0.90,
      ambition: 0.55,
    }
  },
  'flash': {
    name: '闪电 Flash',
    emoji: '🦥',
    subtitle: '温和稳健的低野心洞察者',
    scores: {
      pace: 0.00,
      orderliness: 0.30,
      sincerity: 0.85,
      extraversion: 0.20,
      ambition: 0.15,
    }
  },
  'mr_big': {
    name: '大先生 Mr. Big',
    emoji: '🐭',
    subtitle: '内敛冷静的隐性野心者',
    scores: {
      pace: 0.40,
      orderliness: 0.20,
      sincerity: 0.40,
      extraversion: 0.10,
      ambition: 0.65,
    }
  },
  'gary': {
    name: '盖瑞 Gary',
    emoji: '🐍',
    subtitle: '稳健可靠的适配型执行者',
    scores: {
      pace: 0.65,
      orderliness: 0.55,
      sincerity: 0.60,
      extraversion: 0.75,
      ambition: 0.50,
    }
  },
  'sheep': {
    name: '夏奇羊 Gazelle',
    emoji: '🐏',
    subtitle: '魅力四射的高野心表达者',
    scores: {
      pace: 0.70,
      orderliness: 0.60,
      sincerity: 0.85,
      extraversion: 0.95,
      ambition: 0.95,
    }
  },
} as const;

// 角色ID到图片文件名的映射（使用优化后的WebP格式）
export const CHARACTER_IMAGE_MAP: Record<string, string> = {
  'judy_hopps': '朱迪.webp',
  'nick_wilde': '尼克.webp',
  'mayor_lionheart': '马市长.webp',
  'clawhauser': '豹子警官.webp',
  'flash': '闪电.webp',
  'mr_big': '大先生.webp',
  'gary': '蛇盖瑞.webp',
  'sheep': '夏奇羊.webp',
} as const;

// 角色核心特质（用于分享卡片）
export const CHARACTER_CORE_TRAITS: Record<string, string> = {
  'judy_hopps': '你像朱迪一样怀抱强烈理想，相信"只要努力就能改变世界"。你行动迅速、原则坚定，同时充满社交活力，能在团队中带动整体节奏。你的野心不带攻击性，而是带着正向使命感：你想成为更好的自己，也想推动世界更公平。你对目标有执着的追求，不畏挑战，总是第一个冲出去的人。',
  'nick_wilde': '你像尼克一样聪明、灵活、具有高社会智慧。你不会主动表现野心，但内在依然追求体面的生活与个人价值。你不依赖规则，而依靠策略与判断突破困难。你懂人性，懂得在适当的时候低调前行，也是那种"想做则必能做成"的类型。',
  'mayor_lionheart': '你像马市长一样秩序感强、责任感重，有长远规划与明确目标。你有野心，但表达稳重，追求的是系统性的成功与影响力，而非短期成就。你自律、权威、能稳住团队，是典型的"管理型进取者"。',
  'clawhauser': '你像雪豹警官一样热情、真诚、充满积极能量。你外向、亲和，是团队氛围的中心。你的野心不是对外的竞争，而是对内的"把事情做好、让大家开心"的热情驱动。你靠情绪能量帮助团队前进。',
  'flash': '你像闪电一样节奏稳定、温柔、真诚。你追求的是"舒适、稳定、细水长流"，不喜欢争抢，也不追求名利地位。你的洞察力深、表达温和，是团队中的安静力量。',
  'mr_big': '你像大先生一样冷静、谨慎、深藏锋芒。你不会抢风头，但在关键时刻你能做出决定性动作。你的野心是"保持掌控"、"保住地盘"，重视忠诚与长期稳定。你是沉默但强大的存在。',
  'gary': '你像盖瑞一样节奏平衡、适应力强。你的野心不高不低，主要来自"想把事情做好"的专业追求，而非对权力或影响力的渴望。你是团队中最稳的人——不抢功，也不掉链子。',
  'sheep': '你像 Gazelle 一样外向、艺术性强、影响力巨大。你有明确目标，愿意为理想和热情坚持到底，并通过表达与魅力影响他人。你是团队中最具"明星领袖潜质"的人。',
} as const;

// 角色详细特质（用于结果页面详细解读）
export const CHARACTER_DETAILED_TRAITS: Record<string, {
  advantages: string[];
  risks: string[];
}> = {
  'judy_hopps': {
    advantages: [
      '执行力极强',
      '真诚可靠',
      '强烈的成就动机与自我驱动'
    ],
    risks: [
      '容易过度投入',
      '速度快导致疏忽细节',
      '期望过高导致失落'
    ]
  },
  'nick_wilde': {
    advantages: [
      '情境判断力与策略能力强',
      '幽默、善于调和氛围',
      '适应环境能力极佳'
    ],
    risks: [
      '易被误解为"心机"或"不真诚"',
      '不喜欢结构化管理环境',
      '野心表达隐晦，容易错失机会'
    ]
  },
  'mayor_lionheart': {
    advantages: [
      '强大的组织与系统思维',
      '稳定可靠的领导气场',
      '清晰的目标感与责任心'
    ],
    risks: [
      '承担过多压力',
      '偶尔僵化',
      '情绪表达过于克制'
    ]
  },
  'clawhauser': {
    advantages: [
      '超强亲和力',
      '真诚透明',
      '社交场合感染力强'
    ],
    risks: [
      '容易过度付出',
      '对冲突敏感',
      '在高度竞争环境中可能缺乏主动力'
    ]
  },
  'flash': {
    advantages: [
      '稳定耐心',
      '洞察细节',
      '情绪温和、不制造冲突'
    ],
    risks: [
      '速度慢与环境节奏冲突',
      '容易被忽视',
      '成长动力不足'
    ]
  },
  'mr_big': {
    advantages: [
      '稳重决断',
      '长期策略视野',
      '高忠诚度'
    ],
    risks: [
      '情绪表达少，难被理解',
      '社交圈窄',
      '过度谨慎错过机会'
    ]
  },
  'gary': {
    advantages: [
      '稳定的执行力',
      '高适应性',
      '情绪平和'
    ],
    risks: [
      '易被低估',
      '关键时刻可能缺乏果断',
      '过度顾及他人导致界限不清'
    ]
  },
  'sheep': {
    advantages: [
      '强大影响力',
      '情感表达能力极强',
      '高目标驱动力'
    ],
    risks: [
      '可能过度关注外界评价',
      '能量消耗大',
      '容易因追求完美而焦虑'
    ]
  },
} as const;

// 题目列表
const questions: QuizTemplate['questions'] = [
  // Q1: sincerity
  {
    id: 'zootopia_q1',
    type: 'scale',
    question: '你对不满意的事情会：',
    options: [
      { value: 1, label: '坦率表达，让对方知道', scores: { sincerity: 1 } },
      { value: 2, label: '稍微表达一点点', scores: { sincerity: 0.7 } },
      { value: 3, label: '忍一忍就过去了', scores: { sincerity: 0.3 } },
      { value: 4, label: '表面没意见，把不满藏在心里', scores: { sincerity: 0 } }
    ],
    required: true
  },
  // Q2: pace
  {
    id: 'zootopia_q2',
    type: 'scale',
    question: '你收到一条工作消息，你的反应：',
    options: [
      { value: 1, label: '秒回并立刻处理', scores: { pace: 1 } },
      { value: 2, label: '快速回复，有空了再做', scores: { pace: 0.7 } },
      { value: 3, label: '看心情与情况', scores: { pace: 0.3 } },
      { value: 4, label: '等一会儿再回复', scores: { pace: 0 } }
    ],
    required: true
  },
  // Q3: sincerity
  {
    id: 'zootopia_q3',
    type: 'scale',
    question: '面对一个需要投入大量精力、但成功后能极大提升个人名望的项目，你会？',
    options: [
      { value: 1, label: '拒绝，不想让生活失衡', scores: { ambition: 0 } },
      { value: 2, label: '评估一下，如果代价太大就放弃', scores: { ambition: 0.3 } },
      { value: 3, label: '即使困难也愿意尝试，毕竟值得', scores: { ambition: 0.7 } },
      { value: 4, label: '立刻接受，并愿意牺牲休息、社交，把它当成关键突破点', scores: { ambition: 1 } }
    ],
    required: true
  },
  
  // Q4: orderliness
  {
    id: 'zootopia_q4',
    type: 'scale',
    question: '当团队准备修改既定流程，你的第一反应：',
    options: [
      { value: 1, label: '"最好别改，按原来的流程最稳妥。"', scores: { orderliness: 1 } },
      { value: 2, label: '"可以改，但要经过正式讨论。"', scores: { orderliness: 0.7 } },
      { value: 3, label: '"按情况来，改也没关系。"', scores: { orderliness: 0.3 } },
      { value: 4, label: '"流程什么的都无所谓，能解决问题就好。"', scores: { orderliness: 0 } }
    ],
    required: true
  },
  // Q5: pace
  {
    id: 'zootopia_q5',
    type: 'scale',
    question: '任务堆积在一起时，你通常的状态是：',
    options: [
      { value: 1, label: '越急越兴奋，能高速推进', scores: { pace: 1 } },
      { value: 2, label: '有压力但能快速处理', scores: { pace: 0.7 } },
      { value: 3, label: '会有点慌乱，需要慢下来', scores: { pace: 0.3 } },
      { value: 4, label: '我喜欢慢节奏处理，不急', scores: { pace: 0 } }
    ],
    required: true
  },
  // Q6: sincerity
  {
    id: 'zootopia_q6',
    type: 'scale',
    question: '答应别人时，你的习惯：',
    options: [
      { value: 1, label: '只要我答应了就一定做到', scores: { sincerity: 1 } },
      { value: 2, label: '会尽力做到', scores: { sincerity: 0.7 } },
      { value: 3, label: '看情况做，没完成也没关系', scores: { sincerity: 0.3 } },
      { value: 4, label: '答应别人只是为了先应付一下', scores: { sincerity: 0 } }
    ],
    required: true
  },
  {
    id: 'zootopia_q7',
    type: 'scale',
    question: '你发现公司内部将开放一个竞争激烈但很宝贵的晋升名额，你会？',
    options: [
      { value: 1, label: '不考虑，不想让自己太累', scores: { ambition: 0 } },
      { value: 2, label: '观望一下，如果竞争不激烈再试', scores: { ambition: 0.3 } },
      { value: 3, label: '仔细准备材料，认真参与竞争', scores: { ambition: 0.7 } },
      { value: 4, label: '把它当成必须拿下的目标，全力投入准备', scores: { ambition: 1 } }
    ],
    required: true
  },
  // Q7: pace
  
  // Q8: orderliness
  {
    id: 'zootopia_q8',
    type: 'scale',
    question: '看到有人违反公共秩序（插队、占道等），你会：',
    options: [
      { value: 1, label: '主动提醒对方遵守规则', scores: { orderliness: 1 } },
      { value: 2, label: '委婉向管理人员反馈', scores: { orderliness: 0.7 } },
      { value: 3, label: '保持沉默但心里不舒服', scores: { orderliness: 0.3 } },
      { value: 4, label: '不在乎，跟我没有关系', scores: { orderliness: 0 } }
    ],
    required: true
  },
  // Q9: extraversion
  {
    id: 'zootopia_q9',
    type: 'scale',
    question: '一个聚会中，你通常会：',
    options: [
      { value: 1, label: '自然成为氛围中心', scores: { extraversion: 1 } },
      { value: 2, label: '主动参与但不一定最显眼', scores: { extraversion: 0.7 } },
      { value: 3, label: '稍微参与，更多观察别人', scores: { extraversion: 0.3 } },
      { value: 4, label: '和人交流好累，只想待在安静角落', scores: { extraversion: 0 } }
    ],
    required: true
  },
  // Q10: extraversion
  {
    id: 'zootopia_q10',
    type: 'scale',
    question: '与你不熟的人主动交谈，你会：',
    options: [
      { value: 1, label: '热情回应并继续拓展对话', scores: { extraversion: 1 } },
      { value: 2, label: '正常回应，对话自然发展', scores: { extraversion: 0.7 } },
      { value: 3, label: '简单回答，不主动延伸', scores: { extraversion: 0.3 } },
      { value: 4, label: '尽量保持简短，早点结束', scores: { extraversion: 0 } }
    ],
    required: true
  },
  // Q11: extraversion
  {
    id: 'zootopia_q11',
    type: 'scale',
    question: '在一个需要分工合作的任务里，你通常：',
    options: [
      { value: 1, label: '主动组织、带领团队', scores: { extraversion: 1 } },
      { value: 2, label: '提出你的意见并参与讨论', scores: { extraversion: 0.7 } },
      { value: 3, label: '听安排，按分工执行就行', scores: { extraversion: 0.3 } },
      { value: 4, label: '不喜欢团队合作，更喜欢安静地自己做', scores: { extraversion: 0 } }
    ],
    required: true
  },
  // Q12: orderliness
  {
    id: 'zootopia_q12',
    type: 'scale',
    question: '公司的制度要求所有人填写一份复杂表格，你会：',
    options: [
      { value: 1, label: '从头到尾严格按要求填写', scores: { orderliness: 1 } },
      { value: 2, label: '认真填写关键项，其余看情况填写', scores: { orderliness: 0.7 } },
      { value: 3, label: '简单填写一下，出了问题再改', scores: { orderliness: 0.3 } },
      { value: 4, label: '没什么意义，等别人填完我模仿修改一下就好', scores: { orderliness: 0 } }
    ],
    required: true
  },
  // Q13: ambition
  {
    id: 'zootopia_q13',
    type: 'scale',
    question: '在一个你特别喜欢的兴趣领域（运动、音乐、游戏、手工等），你发现有人水平明显比你强。你会？',
    options: [
      { value: 1, label: '觉得没必要比较，自己玩得开心就好', scores: { ambition: 0 } },
      { value: 2, label: '好奇对方怎么做到的，但不会特别深入努力', scores: { ambition: 0.3 } },
      { value: 3, label: '产生动力，想追上去，会主动练习或研究', scores: { ambition: 0.7 } },
      { value: 4, label: '立刻开始系统训练/学习，希望超越对方成为最强者', scores: { ambition: 1 } }
    ],
    required: true
  },
  // Q14: ambition
  {
    id: 'zootopia_q14',
    type: 'scale',
    question: '你临时接到一个必须马上决定的选择，你会：',
    options: [
      { value: 1, label: '立刻拍板', scores: { pace: 1 } },
      { value: 2, label: '思考片刻后执行', scores: { pace: 0.7 } },
      { value: 3, label: '再确认一下别人意见', scores: { pace: 0.3 } },
      { value: 4, label: '压力好大，拖延一下再做', scores: { pace: 0 } }
    ],
    required: true
  },
  // Q15: ambition
  {
    id: 'zootopia_q15',
    type: 'scale',
    question: '有人向你询问个人隐私类的问题，你会：',
    options: [
      { value: 1, label: '实话实说，有什么说什么', scores: { sincerity: 1 } },
      { value: 2, label: '简单带过但不说细节', scores: { sincerity: 0.7 } },
      { value: 3, label: '礼貌转移话题', scores: { sincerity: 0.3 } },
      { value: 4, label: '可以说，但是不一定说真实的', scores: { sincerity: 0 } }
    ],
    required: true
  },
  // Q16-Q20: 锚点量表题
  {
    id: 'zootopia_q16',
    type: 'likert',
    question: '我处理事情通常迅速而果断',
    dimension: 'pace',
    options: [
      { value: 1, label: '完全不同意' },
      { value: 2, label: '比较不同意' },
      { value: 3, label: '中立' },
      { value: 4, label: '比较同意' },
      { value: 5, label: '完全同意' }
    ],
    required: true
  },
  {
    id: 'zootopia_q17',
    type: 'likert',
    question: '我倾向于严格遵守规则和制度',
    dimension: 'orderliness',
    options: [
      { value: 1, label: '完全不同意' },
      { value: 2, label: '比较不同意' },
      { value: 3, label: '中立' },
      { value: 4, label: '比较同意' },
      { value: 5, label: '完全同意' }
    ],
    required: true
  },
  {
    id: 'zootopia_q18',
    type: 'likert',
    question: '我表达想法时直接坦率，很少拐弯抹角',
    dimension: 'sincerity',
    options: [
      { value: 1, label: '完全不同意' },
      { value: 2, label: '比较不同意' },
      { value: 3, label: '中立' },
      { value: 4, label: '比较同意' },
      { value: 5, label: '完全同意' }
    ],
    required: true
  },
  {
    id: 'zootopia_q19',
    type: 'likert',
    question: '在社交场合，我更喜欢主动表达自己',
    dimension: 'extraversion',
    options: [
      { value: 1, label: '完全不同意' },
      { value: 2, label: '比较不同意' },
      { value: 3, label: '中立' },
      { value: 4, label: '比较同意' },
      { value: 5, label: '完全同意' }
    ],
    required: true
  },
  {
    id: 'zootopia_q20',
    type: 'likert',
    question: '我对实现个人目标和成就有强烈追求',
    dimension: 'ambition',
    options: [
      { value: 1, label: '完全不同意' },
      { value: 2, label: '比较不同意' },
      { value: 3, label: '中立' },
      { value: 4, label: '比较同意' },
      { value: 5, label: '完全同意' }
    ],
    required: true
  }
];

/**
 * 四阶段向量建模计分算法
 */
function calculateCharacterMatch(answers: Record<string, string | number>): {
  topMatches: Array<{
    characterId: string;
    similarity: number;
    userScores: Record<string, number>;
  }>;
  userDimensionScores: Record<string, number>;
} {
  const dimensions = ['pace', 'orderliness', 'sincerity', 'extraversion', 'ambition'] as const;

  // 阶段1: 维度得分累加（Raw Score Accumulation）
  const rawScores: Record<string, number> = {
    pace: 0,
    orderliness: 0,
    sincerity: 0,
    extraversion: 0,
    ambition: 0,
  };

  // 处理强迫选择题（Q1-Q15）
  questions.slice(0, 15).forEach((q) => {
    const answer = answers[q.id];
    if (answer && q.type === 'scale') {
      const selectedOption = q.options?.find((opt) => opt.value === answer);
      if (selectedOption?.scores) {
        Object.entries(selectedOption.scores).forEach(([dim, score]) => {
          if (typeof score === 'number') {
            rawScores[dim] = (rawScores[dim] || 0) + score;
          }
        });
      }
    }
  });

  // 阶段2: 锚点量表校准（Anchor Calibration）
  const anchorScores: Record<string, number> = {};
  questions.slice(15, 20).forEach((q) => {
    const answer = answers[q.id];
    if (answer && q.type === 'likert' && q.dimension) {
      // 将1-5分转换为0-1范围
      anchorScores[q.dimension] = (Number(answer) - 1) / 4;
    }
  });

  // 计算最大可能得分（用于归一化）
  // 对每道题，只取该维度在所有选项中的最大正值
  const maxPossibleScores: Record<string, number> = {
    pace: 0,
    orderliness: 0,
    sincerity: 0,
    extraversion: 0,
    ambition: 0,
  };

  questions.slice(0, 15).forEach((q) => {
    if (q.type === 'scale' && q.options) {
      // 对每个维度，找出这道题所有选项中的最大加分
      const maxScoresInQuestion: Record<string, number> = {
        pace: 0,
        orderliness: 0,
        sincerity: 0,
        extraversion: 0,
        ambition: 0,
      };

      q.options.forEach((opt) => {
        if (opt.scores) {
          Object.entries(opt.scores).forEach(([dim, score]) => {
            if (typeof score === 'number' && score > 0) {
              maxScoresInQuestion[dim] = Math.max(maxScoresInQuestion[dim], score);
            }
          });
        }
      });

      // 累加每道题的最大值
      Object.entries(maxScoresInQuestion).forEach(([dim, maxScore]) => {
        maxPossibleScores[dim] += maxScore;
      });
    }
  });

  // 阶段3: 混合校准（Hybrid Calibration）
  const alpha = 0.7; // 强迫选择题权重
  const beta = 0.3;  // 锚点量表权重

  const calibratedScores: Record<string, number> = {};
  dimensions.forEach((dim) => {
    const relativeScore = maxPossibleScores[dim] > 0
      ? Math.max(0, Math.min(1, rawScores[dim] / maxPossibleScores[dim]))
      : 0;
    const anchorScore = anchorScores[dim] ?? 0.5;
    calibratedScores[dim] = alpha * relativeScore + beta * anchorScore;
  });

  // 阶段4: 欧氏距离匹配
  const characterMatches = Object.entries(CHARACTER_PROFILES).map(([id, profile]) => {
    // 计算欧氏距离
    let squaredDifference = 0;
    dimensions.forEach((dim) => {
      const diff = calibratedScores[dim] - profile.scores[dim];
      squaredDifference += diff * diff;
    });

    // 归一化欧氏距离（除以sqrt(维度数)使其在0-1范围）
    const euclideanDistance = Math.sqrt(squaredDifference) / Math.sqrt(dimensions.length);

    // 转换为相似度（距离越小，相似度越高）
    const similarity = 1 - euclideanDistance;

    return {
      characterId: id,
      similarity: similarity,
      userScores: { ...calibratedScores },
    };
  });

  // 按相似度排序，取前3名
  const topMatches = characterMatches
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 3);

  return {
    topMatches,
    userDimensionScores: calibratedScores,
  };
}

// 导出量表配置
export const zootopia: QuizTemplate = {
  id: 'zootopia',
  title: '疯狂动物城人格测评',
  titleEn: 'Zootopia Personality Assessment',
  description: '以《疯狂动物城》8位核心角色为原型，测试你最像谁',
  category: '趣味测评',
  purpose: '通过20道题目（15道情景选择题 + 5道人格锚点题），从行动速度、秩序偏好、真诚指数、外向呈现、进取心等5个维度，判断你最接近哪种"动物城人格"',
  duration: '5-7分钟',
  questionCount: 20,

  dimensions: [
    {
      id: 'pace',
      name: ZOOTOPIA_DIMENSIONS.pace,
      description: '处理任务的速度、反应节奏、行动倾向（低=慢条斯理 ↔ 高=高速执行）',
      questionIds: []
    },
    {
      id: 'orderliness',
      name: ZOOTOPIA_DIMENSIONS.orderliness,
      description: '对规则、规范、流程的接受度与依赖程度（低=随性灵活 ↔ 高=自律严谨）',
      questionIds: []
    },
    {
      id: 'sincerity',
      name: ZOOTOPIA_DIMENSIONS.sincerity,
      description: '动机透明度、表达方式、言行一致程度（低=策略圆滑 ↔ 高=坦率透明）',
      questionIds: []
    },
    {
      id: 'extraversion',
      name: ZOOTOPIA_DIMENSIONS.extraversion,
      description: '社交场合中的表达方式、存在感与能量来源（低=内向克制 ↔ 高=外向张扬）',
      questionIds: []
    },
    {
      id: 'ambition',
      name: ZOOTOPIA_DIMENSIONS.ambition,
      description: '成就动机、目标追求程度及奋斗心态（低=安于现状 ↔ 高=强烈目标驱动）',
      questionIds: []
    }
  ],

  scoring: {
    method: 'custom',
    scaleRange: {
      min: 0,
      max: 100,
      description: '相似度分数（0-100分）'
    }
  },

  questions,

  calculateResults: (answers: Record<string, number>) => {
    const { topMatches, userDimensionScores } = calculateCharacterMatch(answers);
    const topMatch = topMatches[0];
    const character = CHARACTER_PROFILES[topMatch.characterId as keyof typeof CHARACTER_PROFILES];

    return {
      totalScore: Math.round(topMatch.similarity * 100),
      dimensionScores: Object.entries(userDimensionScores).map(([dimension, score]) => ({
        dimension: ZOOTOPIA_DIMENSIONS[dimension as keyof typeof ZOOTOPIA_DIMENSIONS],
        score: Math.round(score * 100)
      })),
      interpretation: `你最像${character.name}（${character.subtitle}），相似度${Math.round(topMatch.similarity * 100)}%`,
      recommendations: [
        CHARACTER_CORE_TRAITS[topMatch.characterId as keyof typeof CHARACTER_CORE_TRAITS]
      ],
      metadata: {
        primaryResult: {
          characterId: topMatch.characterId,
          characterName: character.name,
          characterEmoji: character.emoji,
          characterSubtitle: character.subtitle,
          similarity: Math.round(topMatch.similarity * 100),
          coreTrait: CHARACTER_CORE_TRAITS[topMatch.characterId as keyof typeof CHARACTER_CORE_TRAITS],
          detailedTraits: CHARACTER_DETAILED_TRAITS[topMatch.characterId as keyof typeof CHARACTER_DETAILED_TRAITS],
          dimensionScores: userDimensionScores,
          characterScores: character.scores,
        },
        secondaryMatches: topMatches.slice(1, 3).map((match) => {
          const char = CHARACTER_PROFILES[match.characterId as keyof typeof CHARACTER_PROFILES];
          return {
            characterId: match.characterId,
            characterName: char.name,
            characterEmoji: char.emoji,
            similarity: Math.round(match.similarity * 100),
          };
        }),
        dimensionLabels: ZOOTOPIA_DIMENSION_LABELS,
      }
    };
  }
};
