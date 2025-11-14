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

// 角色ID到图片文件名的映射（使用优化后的WebP格式）
export const CHARACTER_IMAGE_MAP: Record<string, string> = {
  'zhenhuan_early': '甄嬛前期.webp',
  'zhenhuan_late': '甄嬛后期.webp',
  'anlingrong': '安陵容.webp',
  'queen': '皇后.webp',
  'huafei': '华妃.webp',
  'shenmeizhuang': '沈眉庄.webp',
  'huanbi': '浣碧.webp',
  'supeisheng': '苏培盛.webp',
  'guojunwang': '果郡王.webp',
  'wentaiyi': '温太医.webp',
  'emperor': '皇上.webp',
  'ningguiren': '宁贵人.webp',
} as const;

// 角色核心特质（用于分享卡片）
export const CHARACTER_CORE_TRAITS: Record<string, string> = {
  'zhenhuan_early': '你心思细腻、善良温婉，重情重义。你相信人性美好，也因此容易受伤。你有极高的同理心与道德感，愿意为了爱和真诚而妥协。在人际关系中，你倾向于用理解和包容去化解矛盾，对待情感时充满浪漫的期待。',
  'zhenhuan_late': '你经历了成长的蜕变，明白柔软也需要锋芒。你懂得平衡理想与现实，用策略守护底线。在复杂的人际关系中，你能够保持清醒的头脑，既不轻易信任也不轻易放弃，善于在适当的时机采取行动。',
  'anlingrong': '你内心敏感、渴望被爱，却害怕被忽视。外界评价对你影响深远，容易自责与焦虑。你努力想要证明自己，却又担心不够好。在人际交往中，你善于察言观色，但也容易过度解读他人的态度。',
  'queen': '你思维缜密、计划周全，擅长在复杂关系中掌握主动。你不轻信他人，也极度自律。在你眼中，世界是一个需要精心管理的系统，你习惯于制定规则、掌控局面，并确保一切按照计划进行。',
  'huafei': '你自信张扬、情感浓烈，喜欢掌控场面，也害怕孤独。热情是真实的你，骄傲是你的盔甲。你不喜欢隐藏，爱恨分明，情绪表达直接而强烈。在社交场合中，你往往是焦点，但也渴望被真正理解。',
  'shenmeizhuang': '你看似温柔，实则坚韧。在困境中保持自尊，宁可受委屈，也不丢分寸。你有着强大的内在力量和自我约束力，懂得在适当的时候坚持原则，也知道何时该妥协。你是典型的外柔内刚型人格。',
  'huanbi': '你务实果断，能在理想与现实之间找到平衡。有野心但也有情义，擅长隐忍与自我调节。你清楚地知道自己想要什么，也懂得为了目标该付出什么。你不会被不切实际的幻想束缚，但也不是冷血的功利主义者。',
  'supeisheng': '你懂人情世故，知道何时出声、何时沉默。不求锋芒，但求安稳与圆满。你是团队中的润滑剂，善于观察和调节气氛，不会成为冲突的中心，但往往是关键时刻的稳定力量。',
  'guojunwang': '你热情真诚、富有浪漫主义精神。追求真爱与自由，不愿被束缚在权力之中。你相信真情实感，愿意为了理想和爱情放弃世俗的利益。你的真诚和热情感染着周围的人。',
  'wentaiyi': '你关心他人，愿意为别人承担痛苦。在安静中展现力量，在理智中守护温情。你有着温暖的内心和冷静的头脑，既能感同身受，又能保持专业的距离。你是天生的倾听者和疗愈者。',
  'emperor': '你冷静决断，擅长统筹全局。理性强于感性，重视控制感和结果导向。你习惯站在高处俯瞰全局，善于在复杂的局势中做出最优决策。你是天生的领导者和决策者。',
  'ningguiren': '你深谙权衡之道，懂得用表面的温和掩饰锋芒。你擅长策略与时机判断，是典型的隐形强者。你不急于表现，而是静待时机，在关键时刻才展露实力。你是大器晚成型人格。',
} as const;

// 角色详细特质（用于结果页面详细解读）
export const CHARACTER_DETAILED_TRAITS: Record<string, {
  advantages: string[];
  risks: string[];
}> = {
  'zhenhuan_early': {
    advantages: [
      '共情力强：能够敏锐感知他人情绪，善于建立情感连接',
      '道德感高：坚守原则，不轻易违背自己的价值观',
      '真诚温暖：容易获得他人的信任和好感'
    ],
    risks: [
      '过度理想化：容易对人对事抱有不切实际的期待，失望后受伤严重',
      '边界模糊：为了维护关系，可能牺牲自己的需求',
      '易受伤害：对批评和负面评价敏感，容易陷入自我怀疑'
    ]
  },
  'zhenhuan_late': {
    advantages: [
      '战略思维：能够从全局角度分析形势，制定长远计划',
      '情绪掌控：不轻易被情绪左右，能够隐藏真实想法',
      '适应能力强：在变化的环境中快速调整策略'
    ],
    risks: [
      '信任困难：过度防备可能让你难以建立真正的亲密关系',
      '情感压抑：长期隐藏情绪可能导致内心疲惫',
      '孤独感：站在高处看清一切，却难有知心人'
    ]
  },
  'anlingrong': {
    advantages: [
      '细致敏锐：能够发现他人忽略的细节',
      '努力上进：强烈的进取心驱使你不断提升自己',
      '艺术天赋：敏感的情绪体验让你在艺术表达上有独特优势'
    ],
    risks: [
      '自我价值感低：过度依赖外界认可，缺乏内在稳定性',
      '情绪起伏大：小事也可能引发强烈的情绪反应',
      '关系依赖：害怕被抛弃，可能在关系中过度付出或讨好'
    ]
  },
  'queen': {
    advantages: [
      '系统思维：能够构建完整的计划体系，考虑周全',
      '自律能力强：高度的自我管理能力，能够延迟满足',
      '沉着冷静：在危机时刻保持清醒，不被情绪控制'
    ],
    risks: [
      '过度控制：对不确定性的恐惧可能导致过度干预',
      '情感冷漠：过分理性可能忽略他人的情感需求',
      '完美主义：对自己和他人要求过高，难以接受失败'
    ]
  },
  'huafei': {
    advantages: [
      '感染力强：热情洋溢，能够激励和带动他人',
      '自信果敢：敢于表达，不畏权威，行动力强',
      '真实坦率：不虚伪做作，让人感到真诚'
    ],
    risks: [
      '情绪化：容易被情绪主导，做出冲动决定',
      '需要关注：过度依赖外界的认可和注意',
      '难以示弱：骄傲的外壳下可能隐藏着脆弱'
    ]
  },
  'shenmeizhuang': {
    advantages: [
      '韧性强：能够承受压力和挫折，不轻易放弃',
      '自尊自重：有清晰的自我认知和边界意识',
      '情绪稳定：不轻易被外界干扰，内心平和'
    ],
    risks: [
      '过度压抑：为了维护形象，可能忽视自己的真实需求',
      '难以求助：自尊心强，不愿示弱或寻求帮助',
      '情感隐藏：不善于表达内心情感，可能被误解为冷淡'
    ]
  },
  'huanbi': {
    advantages: [
      '执行力强：说干就干，能够将计划转化为行动',
      '现实务实：能够准确评估形势，不做无谓的牺牲',
      '忠诚可靠：对认定的人和目标保持忠诚'
    ],
    risks: [
      '过于实际：可能在利益权衡中忽视情感价值',
      '野心膨胀：对成功的渴望可能导致不择手段',
      '情感矛盾：在忠诚与野心之间可能产生内心冲突'
    ]
  },
  'supeisheng': {
    advantages: [
      '情商高：善于察言观色，理解不同人的需求',
      '忠诚可靠：对团队和领导忠心耿耿',
      '灵活应变：能够在复杂情境中找到合适的应对方式'
    ],
    risks: [
      '缺乏主见：过度适应他人可能失去自我',
      '回避冲突：为了维持和谐，可能逃避必要的对抗',
      '自我价值感低：习惯服务他人，可能忽视自己的需求'
    ]
  },
  'guojunwang': {
    advantages: [
      '真诚坦率：不虚伪，让人感到可信赖',
      '热情洋溢：对生活充满激情，富有感染力',
      '独立思考：不盲从权威，有自己的价值判断'
    ],
    risks: [
      '理想主义：可能忽视现实的复杂性和残酷性',
      '冲动决策：情感主导可能导致不理智的选择',
      '情感受伤：真诚的付出可能遭遇背叛和利用'
    ]
  },
  'wentaiyi': {
    advantages: [
      '同理心强：能够深刻理解他人的痛苦',
      '理性温和：情感与理智的完美平衡',
      '宽容包容：不轻易评判他人，愿意理解不同立场'
    ],
    risks: [
      '过度付出：为他人承担过多情绪负担',
      '回避冲突：和平主义可能让你逃避必要的对抗',
      '自我忽视：照顾他人时忽略自己的需求'
    ]
  },
  'emperor': {
    advantages: [
      '战略眼光：能够看到他人看不到的大局和趋势',
      '决断力强：关键时刻能够果断做出决定',
      '统筹能力：善于协调各方资源，实现目标'
    ],
    risks: [
      '权力欲望：对控制的需求可能变成压迫',
      '情感淡漠：过度理性可能忽视人性化关怀',
      '孤独感：高处不胜寒，难以建立平等关系'
    ]
  },
  'ningguiren': {
    advantages: [
      '耐心十足：能够长期潜伏，等待最佳时机',
      '洞察力强：善于观察和分析复杂局势',
      '策略思维：善于制定长期计划并坚持执行'
    ],
    risks: [
      '过度谨慎：可能错失需要果断行动的机会',
      '情感压抑：长期隐藏真实想法可能导致心理负担',
      '信任缺失：防备心过重可能难以建立深层关系'
    ]
  }
} as const;

// 获取角色图片路径的辅助函数
export function getCharacterImagePath(characterId: string): string {
  const fileName = CHARACTER_IMAGE_MAP[characterId];
  if (!fileName) {
    console.warn(`No image found for character: ${characterId}`);
    return '/characters/placeholder.svg';
  }
  return `/zhz/${fileName}`;
}

// 获取角色核心特质的辅助函数
export function getCharacterCoreTrait(characterId: string): string {
  return CHARACTER_CORE_TRAITS[characterId] || '';
}

// 获取角色subtitle的辅助函数
export function getCharacterSubtitle(characterId: string): string {
  const character = CHARACTER_PROFILES[characterId as keyof typeof CHARACTER_PROFILES];
  return character?.subtitle || '';
}

// 获取角色emoji的辅助函数
export function getCharacterEmoji(characterId: string): string {
  const character = CHARACTER_PROFILES[characterId as keyof typeof CHARACTER_PROFILES];
  return character?.emoji || '';
}

// 获取角色详细特质的辅助函数
export function getCharacterDetailedTraits(characterId: string): { advantages: string[]; risks: string[] } | null {
  return CHARACTER_DETAILED_TRAITS[characterId] || null;
}

export const zhz: QuizTemplate = {
  id: 'zhz',
  title: '甄嬛传人格测评',
  titleEn: 'The Legend of Zhen Huan Personality Assessment',
  description: '以《甄嬛传》12位核心人物为原型，测试你最像谁',
  category: '趣味测评',
  purpose: '通过28道现代生活场景题，从情感、理性、策略、进取心等8个维度，判断你最接近哪种"宫廷人格"',
  duration: '7-10分钟',
  questionCount: 28,

  dimensions: [
    {
      id: 'emotional',
      name: ZHZ_DIMENSIONS.emotional,
      description: '对他人情绪、评价的反应强度',
      questionIds: [] // ZHZ使用自定义计算，不需要questionIds
    },
    {
      id: 'strategy',
      name: ZHZ_DIMENSIONS.strategy,
      description: '行动前的思考深度、谋略性与控制欲',
      questionIds: []
    },
    {
      id: 'energy',
      name: ZHZ_DIMENSIONS.energy,
      description: '表达力、自信与外向程度',
      questionIds: []
    },
    {
      id: 'idealism',
      name: ZHZ_DIMENSIONS.idealism,
      description: '对爱、道德、理想的执着',
      questionIds: []
    },
    {
      id: 'stability',
      name: ZHZ_DIMENSIONS.stability,
      description: '内在稳定性、责任感与耐心',
      questionIds: []
    },
    {
      id: 'ambition',
      name: ZHZ_DIMENSIONS.ambition,
      description: '对成功的渴望、自我驱动力',
      questionIds: []
    },
    {
      id: 'authenticity',
      name: ZHZ_DIMENSIONS.authenticity,
      description: '表达真我的意愿 vs 社会面具/形象管理',
      questionIds: []
    },
    {
      id: 'novelty',
      name: ZHZ_DIMENSIONS.novelty,
      description: '拥抱变化、探索欲望 vs 偏好稳定熟悉',
      questionIds: []
    }
  ],

  questions: [
    // Q1
    {
      id: 'zhz_q1',
      type: 'scale',
      question: '团队开会吵翻天，你的做法是？💼',
      dimension: 'conflict_handling',
      options: [
        { value: 1, label: '当和事佬，让每个人都感觉被理解', scores: {"emotional":0.16,"idealism":0.14} },
        { value: 2, label: '先观察局势，找准关键人物再出手', scores: {"strategy":0.18,"ambition":0.12} },
        { value: 3, label: '有话直说，最烦拐弯抹角！', scores: {"energy":0.18,"authenticity":0.16} },
        { value: 4, label: '表面保持中立，暗中推动自己的方案', scores: {"strategy":0.2,"ambition":0.16,"authenticity":-0.12} },
        { value: 5, label: '看戏就好，最后听领导的', scores: {"ambition":-0.12,"stability":0.1} },
      ],
      required: true,
    },

    // Q2
    {
      id: 'zhz_q2',
      type: 'scale',
      question: '有人公开挑衅你，你会？🔥',
      dimension: 'competition_response',
      options: [
        { value: 1, label: '表面不动声色，私下留意TA的一举一动', scores: {"strategy":0.18,"ambition":0.14,"authenticity":-0.1} },
        { value: 2, label: '当场刚回去，谁怕谁？', scores: {"energy":0.18,"authenticity":0.16} },
        { value: 3, label: '忍住，用成绩狠狠打脸TA', scores: {"emotional":0.14,"stability":0.1,"ambition":0.1} },
        { value: 4, label: '微笑应对，但已经开始布局反击了', scores: {"strategy":0.18,"ambition":0.16,"authenticity":-0.08} },
        { value: 5, label: '随TA去吧，不值得我浪费时间', scores: {"ambition":-0.14,"stability":0.12} },
      ],
      required: true,
    },

    // Q3
    {
      id: 'zhz_q3',
      type: 'scale',
      question: '❤️ 恋爱中，你最想要的是什么？',
      dimension: 'love_values',
      options: [
        { value: 1, label: '真诚相待，彼此信任的安全感', scores: {"emotional":0.12,"idealism":0.18,"authenticity":0.12} },
        { value: 2, label: '相互尊重，谁也别越界', scores: {"stability":0.16,"idealism":0.1} },
        { value: 3, label: '强烈的占有欲和热烈的爱', scores: {"energy":0.18,"emotional":0.12} },
        { value: 4, label: '灵魂契合，诗与远方的浪漫', scores: {"idealism":0.2,"novelty":0.14} },
        { value: 5, label: '被看见、被珍惜、被需要的感觉', scores: {"emotional":0.18} },
      ],
      required: true,
    },

    // Q4
    {
      id: 'zhz_q4',
      type: 'scale',
      question: '被人误会冤枉了，你会？😤',
      dimension: 'misunderstanding_handling',
      options: [
        { value: 1, label: '当面解释清楚，绝不含糊！', scores: {"energy":0.18,"authenticity":0.14} },
        { value: 2, label: '保持沉默，清者自清', scores: {"stability":0.16,"idealism":0.1} },
        { value: 3, label: '先收集证据，然后一次性翻盘', scores: {"strategy":0.18,"ambition":0.12} },
        { value: 4, label: '表面不说，但会一辈子记在心里', scores: {"emotional":0.18} },
        { value: 5, label: '劝自己放下，时间会证明一切', scores: {"stability":0.14,"idealism":0.12} },
      ],
      required: true,
    },

    // Q5
    {
      id: 'zhz_q5',
      type: 'scale',
      question: '💘 面对心动的人，你会？',
      dimension: 'romantic_approach',
      options: [
        { value: 1, label: '主动制造浪漫惊喜，让TA感受到我的心意', scores: {"energy":0.16,"idealism":0.14,"novelty":0.12} },
        { value: 2, label: '偷偷观察，不敢主动表白', scores: {"emotional":0.16,"energy":-0.14} },
        { value: 3, label: '小心试探，确认TA对我也有意思', scores: {"emotional":0.12,"strategy":0.1} },
        { value: 4, label: '直接开门见山，喜欢就说！', scores: {"energy":0.18,"authenticity":0.16} },
        { value: 5, label: '顺其自然吧，是你的跑不掉', scores: {"ambition":-0.12,"stability":0.1} },
      ],
      required: true,
    },

    // Q6
    {
      id: 'zhz_q6',
      type: 'scale',
      question: '工作出了大差错，你会？😰',
      dimension: 'mistake_handling',
      options: [
        { value: 1, label: '立刻找原因，主动承担责任', scores: {"stability":0.16,"authenticity":0.12} },
        { value: 2, label: '想办法补救，尽量别让领导发现', scores: {"strategy":0.14,"ambition":0.12,"authenticity":-0.08} },
        { value: 3, label: '先安抚团队情绪，再一起想办法', scores: {"emotional":0.16,"idealism":0.12} },
        { value: 4, label: '分析是谁的锅，想办法让别人背', scores: {"strategy":0.18,"ambition":0.14,"authenticity":-0.16} },
        { value: 5, label: '冷静复盘，吸取教训下次改进', scores: {"stability":0.16} },
      ],
      required: true,
    },

    // Q7
    {
      id: 'zhz_q7',
      type: 'scale',
      question: '闺蜜/兄弟背叛了你，你会？💔',
      dimension: 'betrayal_response',
      options: [
        { value: 1, label: '表面原谅，但从此保持距离', scores: {"strategy":0.16,"authenticity":-0.12} },
        { value: 2, label: '冷处理，不撕破脸但也不再来往', scores: {"stability":0.16} },
        { value: 3, label: '恨一辈子！哪怕不报复也忘不了', scores: {"emotional":0.18} },
        { value: 4, label: '当众撕破脸，让所有人都知道TA是什么人', scores: {"energy":0.18,"authenticity":0.16} },
        { value: 5, label: '试着理解TA的苦衷和难处', scores: {"emotional":0.12,"idealism":0.16} },
      ],
      required: true,
    },

    // Q8
    {
      id: 'zhz_q8',
      type: 'scale',
      question: '🎭 理想的社交状态是？',
      dimension: 'social_preference',
      options: [
        { value: 1, label: '热闹聚会的中心，万众瞩目的感觉真好！', scores: {"energy":0.2} },
        { value: 2, label: '小圈子深度交流，三五知己足矣', scores: {"emotional":0.12,"idealism":0.14} },
        { value: 3, label: '精准社交，只和对我有帮助的人建立关系', scores: {"strategy":0.18,"ambition":0.14,"authenticity":-0.12} },
        { value: 4, label: '找到灵魂伴侣，一起聊理想聊人生', scores: {"idealism":0.18,"novelty":0.12} },
        { value: 5, label: '最好不用社交，自己待着最舒服', scores: {"energy":-0.16,"ambition":-0.1} },
      ],
      required: true,
    },

    // Q9
    {
      id: 'zhz_q9',
      type: 'scale',
      question: '面对巨大诱惑时，你更可能？🍎',
      dimension: 'temptation_handling',
      options: [
        { value: 1, label: '不符合我的原则，直接拒绝！', scores: {"stability":0.16,"idealism":0.14} },
        { value: 2, label: '内心挣扎但最终克制住', scores: {"emotional":0.12,"idealism":0.14,"stability":0.1} },
        { value: 3, label: '机会难得，先抓住再说', scores: {"ambition":0.18,"novelty":0.1} },
        { value: 4, label: '表面推辞，暗中想办法利用这个机会', scores: {"strategy":0.18,"ambition":0.14,"authenticity":-0.14} },
        { value: 5, label: '情感冲昏头脑，顾不了那么多了', scores: {"emotional":0.18,"stability":-0.12} },
      ],
      required: true,
    },

    // Q10
    {
      id: 'zhz_q10',
      type: 'scale',
      question: '有人抢走了你的功劳？😠',
      dimension: 'credit_stealing',
      options: [
        { value: 1, label: '当场据理力争，必须要个说法！', scores: {"energy":0.18,"authenticity":0.14} },
        { value: 2, label: '算了，不想浪费精力在这种人身上', scores: {"ambition":-0.14,"stability":0.1} },
        { value: 3, label: '记下这笔账，找机会扳回来', scores: {"strategy":0.18,"ambition":0.14} },
        { value: 4, label: '表面祝贺TA，暗中让TA付出代价', scores: {"strategy":0.2,"ambition":0.16,"authenticity":-0.16} },
        { value: 5, label: '默默继续努力，用实力证明谁才是最强的', scores: {"stability":0.16,"ambition":0.1} },
      ],
      required: true,
    },

    // Q11
    {
      id: 'zhz_q11',
      type: 'scale',
      question: '压力山大时，你的反应是？😫',
      dimension: 'stress_response',
      options: [
        { value: 1, label: '越挫越勇，反而更想赢了！', scores: {"ambition":0.18,"stability":0.12} },
        { value: 2, label: '会先自我怀疑："我是不是不行？"', scores: {"emotional":0.18,"stability":-0.1} },
        { value: 3, label: '冷静分析问题，一步步解决', scores: {"stability":0.18,"strategy":0.1} },
        { value: 4, label: '外表云淡风轻，内心早已翻江倒海', scores: {"emotional":0.14,"authenticity":-0.1} },
        { value: 5, label: '暴躁发泄一通就好了', scores: {"energy":0.16,"authenticity":0.12} },
      ],
      required: true,
    },

    // Q12
    {
      id: 'zhz_q12',
      type: 'scale',
      question: '💢 你的底线是什么？',
      dimension: 'intolerance',
      options: [
        { value: 1, label: '被背叛，这辈子都不会原谅！', scores: {"emotional":0.14,"idealism":0.12} },
        { value: 2, label: '被忽视被无视，好像我不存在一样', scores: {"emotional":0.18} },
        { value: 3, label: '质疑我的能力和权威', scores: {"ambition":0.18,"energy":0.1} },
        { value: 4, label: '限制我的自由，把我困在牢笼里', scores: {"novelty":0.18,"authenticity":0.14} },
        { value: 5, label: '其实都还好，没什么不能忍的', scores: {"stability":0.14} },
      ],
      required: true,
    },

    // Q13
    {
      id: 'zhz_q13',
      type: 'scale',
      question: '💼 如果你当了领导，你会？',
      dimension: 'leadership_style',
      options: [
        { value: 1, label: '严谨稳重，把每件事都安排得明明白白', scores: {"strategy":0.18,"stability":0.14} },
        { value: 2, label: '用热情感染大家，带领团队冲冲冲！', scores: {"energy":0.18,"authenticity":0.12} },
        { value: 3, label: '平衡关系，让每个人都有好处', scores: {"strategy":0.16,"emotional":0.1} },
        { value: 4, label: '少说多看，暗中观察每个人', scores: {"strategy":0.16,"authenticity":-0.1} },
        { value: 5, label: '不太想当领导，太累了', scores: {"ambition":-0.16} },
      ],
      required: true,
    },

    // Q14
    {
      id: 'zhz_q14',
      type: 'scale',
      question: '以下哪句话最打动你？💭',
      dimension: 'justice_view',
      options: [
        { value: 1, label: '"愿得一心人，白首不相离。"', scores: {"idealism":0.18,"emotional":0.12} },
        { value: 2, label: '"世上没有绝对的正义，只有立场不同。"', scores: {"strategy":0.16,"idealism":-0.1} },
        { value: 3, label: '"宁可站着死，不愿跪着生。"', scores: {"authenticity":0.18,"energy":0.12} },
        { value: 4, label: '"做人如兰，心静而芳。"', scores: {"stability":0.16,"idealism":0.1} },
        { value: 5, label: '"人生在世，不过求心安二字。"', scores: {"stability":0.14,"idealism":0.12} },
      ],
      required: true,
    },

    // Q15
    {
      id: 'zhz_q15',
      type: 'scale',
      question: '突然升职加薪了，你会？📈',
      dimension: 'promotion_reaction',
      options: [
        { value: 1, label: '兴奋！立刻规划如何做得更好', scores: {"ambition":0.16,"energy":0.1} },
        { value: 2, label: '冷静分析：为什么是我？背后有什么目的？', scores: {"strategy":0.18} },
        { value: 3, label: '担心别人嫉妒，小心翼翼做人', scores: {"emotional":0.16} },
        { value: 4, label: '制定长远计划，巩固自己的地位', scores: {"strategy":0.16,"ambition":0.14} },
        { value: 5, label: '无所谓，继续按自己的节奏来', scores: {"ambition":-0.12} },
      ],
      required: true,
    },

    // Q16
    {
      id: 'zhz_q16',
      type: 'scale',
      question: '到了全新的环境，你会？🌍',
      dimension: 'new_environment',
      options: [
        { value: 1, label: '主动融入，快速和大家打成一片', scores: {"energy":0.18,"novelty":0.12} },
        { value: 2, label: '先观察氛围，慢慢适应节奏', scores: {"emotional":0.12,"strategy":0.1} },
        { value: 3, label: '迅速找到核心人物，掌握关键信息', scores: {"strategy":0.18,"ambition":0.12} },
        { value: 4, label: '不刻意迎合，保持自己的节奏', scores: {"authenticity":0.16,"stability":0.1} },
        { value: 5, label: '让自己成为有用的人，获得认可', scores: {"ambition":0.14,"strategy":0.1} },
      ],
      required: true,
    },

    // Q17
    {
      id: 'zhz_q17',
      type: 'scale',
      question: '💔 当你发现喜欢的人心有所属？',
      dimension: 'unrequited_love',
      options: [
        { value: 1, label: '痛苦但祝福，爱TA就希望TA幸福', scores: {"idealism":0.16,"stability":0.12} },
        { value: 2, label: '假装不在意，一个人偷偷崩溃', scores: {"emotional":0.18,"authenticity":-0.12} },
        { value: 3, label: '不甘心！我要努力争取！', scores: {"ambition":0.16,"energy":0.12} },
        { value: 4, label: '默默退出，把爱藏在心底', scores: {"emotional":0.14,"idealism":0.12} },
        { value: 5, label: '转移注意力，重新开始就好', scores: {"stability":0.12,"novelty":0.12} },
      ],
      required: true,
    },

    // Q18
    {
      id: 'zhz_q18',
      type: 'scale',
      question: '如果你有超能力，你希望是？✨',
      dimension: 'desired_ability',
      options: [
        { value: 1, label: '看透人心，掌握所有人的想法', scores: {"strategy":0.2,"ambition":0.14} },
        { value: 2, label: '让所有人都喜欢我', scores: {"emotional":0.18} },
        { value: 3, label: '治愈他人的痛苦和伤痛', scores: {"emotional":0.14,"idealism":0.16} },
        { value: 4, label: '完全掌控自己的命运', scores: {"ambition":0.18,"strategy":0.1} },
        { value: 5, label: '拥有无敌的力量，想做什么就做什么！', scores: {"energy":0.18,"ambition":0.12} },
      ],
      required: true,
    },

    // Q19
    {
      id: 'zhz_q19',
      type: 'scale',
      question: '如果用一句话形容理想的自己？🌟',
      dimension: 'legacy',
      options: [
        { value: 1, label: '"真诚待人，温柔而有力量。"', scores: {"authenticity":0.14,"idealism":0.14,"emotional":0.1} },
        { value: 2, label: '"温柔坚定，宠辱不惊。"', scores: {"stability":0.18,"emotional":0.1} },
        { value: 3, label: '"运筹帷幄，掌控自己的命运。"', scores: {"strategy":0.18,"ambition":0.14} },
        { value: 4, label: '"光芒万丈，无人能挡。"', scores: {"energy":0.2,"ambition":0.12} },
        { value: 5, label: '"治愈他人，自渡渡人。"', scores: {"idealism":0.16,"emotional":0.14} },
      ],
      required: true,
    },

    // Q20
    {
      id: 'zhz_q20',
      type: 'scale',
      question: '🤝 哪句话最符合你的友情观？',
      dimension: 'friendship_values',
      options: [
        { value: 1, label: '"真心换真心，四两换半斤。"', scores: {"authenticity":0.14,"idealism":0.14} },
        { value: 2, label: '"朋友是资源，互相利用才能共赢。"', scores: {"strategy":0.16,"ambition":0.12,"authenticity":-0.12} },
        { value: 3, label: '"患难见真情，岁月见人心。"', scores: {"stability":0.16,"idealism":0.1} },
        { value: 4, label: '"江湖路远，有你足矣。"', scores: {"idealism":0.18,"authenticity":0.12} },
        { value: 5, label: '"相识一场便是缘，散了也无妨。"', scores: {"stability":0.12,"emotional":-0.1} },
      ],
      required: true,
    },

    // 新增题目 Q21-Q28

    // Q21
    {
      id: 'zhz_q21',
      type: 'scale',
      question: '看到同龄人成功，你的第一反应是？📊',
      dimension: 'peer_success',
      options: [
        { value: 1, label: '分析TA的成功路径，想办法超越！', scores: {"strategy":0.16,"ambition":0.16} },
        { value: 2, label: '祝福TA，但我也要加油追赶', scores: {"ambition":0.14,"idealism":0.1} },
        { value: 3, label: '焦虑，担心自己被甩在后面', scores: {"emotional":0.18,"ambition":0.1} },
        { value: 4, label: '无所谓，我有自己的节奏', scores: {"ambition":-0.12,"stability":0.12} },
        { value: 5, label: '真心为TA高兴，替TA开心！', scores: {"emotional":0.12,"idealism":0.14} },
      ],
      required: true,
    },

    // Q22
    {
      id: 'zhz_q22',
      type: 'scale',
      question: '高薪但压力巨大的机会，你会？💰',
      dimension: 'high_pressure_opportunity',
      options: [
        { value: 1, label: '果断接受，这是上升的机会！', scores: {"ambition":0.2,"stability":0.1} },
        { value: 2, label: '仔细评估利弊，值得就拼一把', scores: {"strategy":0.16,"ambition":0.14} },
        { value: 3, label: '担心自己做不好，犹豫不决', scores: {"emotional":0.16,"ambition":-0.08} },
        { value: 4, label: '拒绝，不想牺牲生活质量', scores: {"ambition":-0.14,"stability":0.12} },
        { value: 5, label: '算了吧，压力太大不值得', scores: {"ambition":-0.16} },
      ],
      required: true,
    },

    // Q23
    {
      id: 'zhz_q23',
      type: 'scale',
      question: '📱 朋友圈和真实生活，你的状态是？',
      dimension: 'social_media_authenticity',
      options: [
        { value: 1, label: '基本一致，我不喜欢装！', scores: {"authenticity":0.2} },
        { value: 2, label: '展示积极面，但不刻意美化', scores: {"authenticity":0.14,"energy":0.1} },
        { value: 3, label: '基本不发，觉得没必要晒', scores: {"energy":-0.1,"authenticity":0.08} },
        { value: 4, label: '非常用心经营，展示最好的自己', scores: {"strategy":0.14,"authenticity":-0.1} },
        { value: 5, label: '精心打造人设，朋友圈≠真实生活', scores: {"strategy":0.16,"authenticity":-0.16} },
      ],
      required: true,
    },

    // Q24
    {
      id: 'zhz_q24',
      type: 'scale',
      question: '别人问你"过得好吗"，你通常？🗣️',
      dimension: 'emotional_disclosure',
      options: [
        { value: 1, label: '实话实说，好就是好，不好就是不好', scores: {"authenticity":0.2} },
        { value: 2, label: '看关系远近，亲近的才说真话', scores: {"authenticity":0.12,"emotional":0.1} },
        { value: 3, label: '总说"还好"，不想暴露真实状态', scores: {"strategy":0.12,"authenticity":-0.1} },
        { value: 4, label: '永远说"很好"，不让人看到我的脆弱', scores: {"strategy":0.14,"authenticity":-0.14} },
        { value: 5, label: '表面云淡风轻，内心早已千疮百孔', scores: {"emotional":0.16,"authenticity":-0.12} },
      ],
      required: true,
    },

    // Q25
    {
      id: 'zhz_q25',
      type: 'scale',
      question: '💼 职场中，你更倾向于？',
      dimension: 'workplace_authenticity',
      options: [
        { value: 1, label: '做真实的自己，不合适就换工作', scores: {"authenticity":0.2,"novelty":0.1} },
        { value: 2, label: '保留底线，其他可以适当调整', scores: {"authenticity":0.12,"stability":0.12} },
        { value: 3, label: '有策略地展示不同面，适应环境', scores: {"strategy":0.16,"authenticity":-0.08} },
        { value: 4, label: '非常在意职业形象管理，打造完美人设', scores: {"strategy":0.18,"authenticity":-0.14} },
        { value: 5, label: '扮演别人期待的角色，隐藏真实想法', scores: {"strategy":0.14,"authenticity":-0.16} },
      ],
      required: true,
    },

    // Q26
    {
      id: 'zhz_q26',
      type: 'scale',
      question: '换城市、换行业这种大改变，你的态度是？🚀',
      dimension: 'life_change_attitude',
      options: [
        { value: 1, label: '期待新鲜感，很想尝试！', scores: {"novelty":0.2,"energy":0.12} },
        { value: 2, label: '如果有明确好处就会考虑', scores: {"strategy":0.14,"novelty":0.1} },
        { value: 3, label: '倾向稳定，除非迫不得已', scores: {"stability":0.18,"novelty":-0.12} },
        { value: 4, label: '害怕变化，需要很长适应期', scores: {"emotional":0.14,"novelty":-0.14} },
        { value: 5, label: '完全不想变，现状挺好的', scores: {"stability":0.16,"novelty":-0.16} },
      ],
      required: true,
    },

    // Q27
    {
      id: 'zhz_q27',
      type: 'scale',
      question: '🎨 生活中，你更喜欢？',
      dimension: 'lifestyle_preference',
      options: [
        { value: 1, label: '经常尝试新餐厅、新路线、新爱好', scores: {"novelty":0.2,"energy":0.1} },
        { value: 2, label: '偶尔换换口味，但主要还是熟悉的好', scores: {"novelty":0.1,"stability":0.1} },
        { value: 3, label: '固定的模式最舒服，有安全感', scores: {"stability":0.18,"novelty":-0.12} },
        { value: 4, label: '大家都去的地方我也去，跟着走就行', scores: {"strategy":-0.08,"authenticity":-0.08} },
        { value: 5, label: '随缘吧，有机会就试试新的', scores: {"novelty":0.08} },
      ],
      required: true,
    },

    // Q28
    {
      id: 'zhz_q28',
      type: 'scale',
      question: '🆕 面对新技术、新观念，你通常？',
      dimension: 'innovation_acceptance',
      options: [
        { value: 1, label: '率先尝试，享受探索新事物的感觉！', scores: {"novelty":0.2,"energy":0.12} },
        { value: 2, label: '观察一段时间，确认有用再学', scores: {"strategy":0.16,"novelty":0.08} },
        { value: 3, label: '等大多数人都用了再考虑', scores: {"novelty":-0.08} },
        { value: 4, label: '不想学，旧的用得好好的为啥要换？', scores: {"stability":0.16,"novelty":-0.14} },
        { value: 5, label: '抗拒变化，除非被迫才会改', scores: {"stability":0.18,"novelty":-0.18} },
      ],
      required: true,
    },
  ],
};

// 自定义计算逻辑（使用加权欧式距离）
export function calculateZHZResults(answers: Record<string, number>) {
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
  }

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
