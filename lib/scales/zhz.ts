/**
 * ZHZ: 甄嬛传人格测评
 *
 * 基于《甄嬛传》中的12位核心人物为原型
 * 通过八维度模型评估用户的人格特征（5个传统维度 + 3个现代维度）
 */

import type { QuizTemplate } from '@/types/quiz';

// 六大心理维度定义（优化后：消除重叠，增强互斥性）
export const ZHZ_DIMENSIONS = {
  sensitivity: '情绪敏感性',   // 对情绪刺激的反应强度（低=稳定冷静 ↔ 高=敏感脆弱）
  rationality: '思维模式',     // 决策方式（低=直觉冲动 ↔ 高=理性谋划）
  sociability: '社交能量',     // 社交行为倾向（低=内向沉静 ↔ 高=外向张扬）
  idealism: '价值取向',        // 价值权衡倾向（低=实用主义 ↔ 高=理想主义）
  ambition: '野心指数',        // 成功追求程度（低=随遇而安 ↔ 高=进取心强）
  authenticity: '自我表达',    // 真实自我展露（低=战略掩饰 ↔ 高=真实坦率）
} as const;

// 维度双极标签（用于条形图可视化）
export const ZHZ_DIMENSION_LABELS = {
  sensitivity: {
    left: '稳定冷静',
    right: '敏感细腻'
  },
  rationality: {
    left: '直觉冲动',
    right: '理性谋划'
  },
  sociability: {
    left: '内向沉静',
    right: '外向张扬'
  },
  idealism: {
    left: '实用主义',
    right: '理想主义'
  },
  ambition: {
    left: '随遇而安',
    right: '进取心强'
  },
  authenticity: {
    left: '战略掩饰',
    right: '真实坦率'
  }
} as const;

// 12个角色的六维度坐标（0-1范围）
// 已手动调整以增强角色区分度和真实性
export const CHARACTER_PROFILES = {
  'zhenhuan_early': {
    name: '甄嬛（前期）',
    emoji: '🕊️',
    subtitle: '理想主义与温柔的力量',
    scores: {
      sensitivity: 0.80,    // 情感细腻与理想主义并存
      rationality: 0.45,    // 有一定判断力但更多凭感性
      sociability: 0.50,    // 带温暖的人际吸引力
      idealism: 0.90,       // 理想主义者
      ambition: 0.45,       // 初期野心不强
      authenticity: 0.70,   // 相对真诚
    }
  },
  'zhenhuan_late': {
    name: '甄嬛（后期）',
    emoji: '🦢',
    subtitle: '理智与权衡的女王',
    scores: {
      sensitivity: 0.35,    // 完成成长蜕变，情绪稳定
      rationality: 0.95,    // 兼具谋略与克制
      sociability: 0.40,    // 中等社交，不再低调
      idealism: 0.40,       // 更现实了
      ambition: 0.88,       // 强烈的进取心
      authenticity: 0.35,   // 学会了克制表达
    }
  },
  'anlingrong': {
    name: '安陵容',
    emoji: '🪞',
    subtitle: '敏感而脆弱的自我怀疑者',
    scores: {
      sensitivity: 0.92,    // 敏感脆弱且自我怀疑
      rationality: 0.60,    // 仍具一定判断力
      sociability: 0.25,    // 内向不善社交
      idealism: 0.65,       // 中等理想主义
      ambition: 0.55,       // 有一定野心但不强
      authenticity: 0.55,   // 中等表达
    }
  },
  'queen': {
    name: '皇后',
    emoji: '👑',
    subtitle: '理性与秩序的掌控者',
    scores: {
      sensitivity: 0.20,    // 极强理性与克制
      rationality: 1.00,    // 宫廷权谋的冷静中枢
      sociability: 0.15,    // 极端内敛
      idealism: 0.40,       // 有一定原则但偏现实
      ambition: 0.95,       // 强烈的权力欲
      authenticity: 0.10,   // 深度伪装
    }
  },
  'huafei': {
    name: '华妃',
    emoji: '🔥',
    subtitle: '外放能量与极致情感',
    scores: {
      sensitivity: 0.45,    // 情绪有波动但不敏感
      rationality: 0.40,    // 更多凭直觉
      sociability: 0.95,    // 情绪外放、强势直球
      idealism: 0.30,       // 更现实或功利
      ambition: 0.78,       // 较强野心
      authenticity: 0.95,   // 有压迫性张力，情绪明显
    }
  },
  'shenmeizhuang': {
    name: '沈眉庄',
    emoji: '🌿',
    subtitle: '优雅与坚韧并存的理性者',
    scores: {
      sensitivity: 0.35,    // 稳定可靠
      rationality: 0.65,    // 有判断力
      sociability: 0.30,    // 安静内敛
      idealism: 0.85,       // 重情重义，极强道德自律
      ambition: 0.40,       // 无意竞争
      authenticity: 0.60,   // 表达较克制
    }
  },
  'huanbi': {
    name: '浣碧',
    emoji: '💧',
    subtitle: '现实与忠诚的行动派',
    scores: {
      sensitivity: 0.50,    // 中等情绪稳定性
      rationality: 0.70,    // 有判断力也有野心
      sociability: 0.40,    // 中等社交
      idealism: 0.50,       // 中等价值取向
      ambition: 0.90,       // 行动路径更激进直接
      authenticity: 0.45,   // 有一定伪装
    }
  },
  'supeisheng': {
    name: '苏培盛',
    emoji: '🪶',
    subtitle: '忠心耿耿的中庸者',
    scores: {
      sensitivity: 0.65,    // 善于察言观色
      rationality: 0.55,    // 中等理性
      sociability: 0.85,    // 八面玲珑，社交能量高
      idealism: 0.60,       // 中等价值观
      ambition: 0.30,       // 没有权力欲
      authenticity: 0.35,   // 表达克制
    }
  },
  'guojunwang': {
    name: '果郡王',
    emoji: '🌞',
    subtitle: '浪漫自由的理想行动派',
    scores: {
      sensitivity: 0.70,    // 情感真挚
      rationality: 0.30,    // 更多凭情感与本能
      sociability: 0.85,    // 自由浪漫、外放又真诚
      idealism: 0.95,       // 理想主义者，富有骑士精神
      ambition: 0.45,       // 中等野心
      authenticity: 0.85,   // 情绪表达丰富
    }
  },
  'wentaiyi': {
    name: '温太医',
    emoji: '🌸',
    subtitle: '温柔理智的疗愈者',
    scores: {
      sensitivity: 0.75,    // 情感真挚
      rationality: 0.30,    // 不擅权力社会
      sociability: 0.35,    // 安静内敛
      idealism: 0.95,       // 理想主义者
      ambition: 0.10,       // 随遇而安
      authenticity: 0.85,   // 真诚表达
    }
  },
  'emperor': {
    name: '皇上',
    emoji: '🦅',
    subtitle: '权力与秩序的掌舵者',
    scores: {
      sensitivity: 0.30,    // 帝王人格：冷静
      rationality: 0.95,    // 理性强
      sociability: 0.60,    // 有威严的领袖气场
      idealism: 0.30,       // 更现实
      ambition: 1.00,       // 权力欲极强
      authenticity: 0.20,   // 行为克制
    }
  },
  'ningguiren': {
    name: '宁贵人',
    emoji: '🕰️',
    subtitle: '隐忍深思的现实派',
    scores: {
      sensitivity: 0.55,    // 中等敏感
      rationality: 0.85,    // 深度压抑的策略型人物
      sociability: 0.35,    // 倾向单独行动
      idealism: 0.40,       // 更现实
      ambition: 0.75,       // 较强野心
      authenticity: 0.15,   // 精于算计但不外露
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
  'zhenhuan_early': '你像初入宫的甄嬛，情感细腻、理想主义，对人对事都怀着赤诚之心。你相信真情可以感化人心，重视道德和情义。在爱情中追求灵魂共鸣，但也因高敏感度容易受伤。',
  'zhenhuan_late': '你像后期的甄嬛，完成了从少女到女王的蜕变。理性驾驭感性，用策略守护底线。你深谙人性复杂与权力法则，懂得何时隐忍何时出击，野心是为了掌握命运、保护在乎的人。',
  'anlingrong': '你像安陵容，内心敏感脆弱，渴望被认可却害怕被抛弃。自我价值依赖他人反馈，容易陷入自我怀疑。你善于察言观色，但也容易过度解读。理想与现实的落差让你倍感挫败。',
  'queen': '你像皇后，理性与秩序的化身。极度冷静、思维缜密，深谙权谋之道。情绪管理能力极强，相信只有掌控全局才能立于不败。野心强烈持久，更擅长幕后操控而非台前表演。',
  'huafei': '你像华妃，情绪与能量的代言人。自信张扬、热情似火，从不掩饰爱恨喜怒。你享受被关注，真实坦率是你的魅力也是盔甲。你渴望真诚的爱，相信实力和直接，不屑拐弯抹角的权谋。',
  'shenmeizhuang': '你像沈眉庄，外柔内刚。情绪稳定、自尊自重，坚守情义与道德，宁可受委屈也不违背良心。你不善社交周旋，更倾向真诚深度的关系。野心不强，只求守住自己的一方天地。',
  'huanbi': '你像浣碧，务实果断、目标明确。野心强烈，敢于为目标行动，知道如何为自己争取最大利益。你懂得隐忍和伪装，追求实实在在的改变。有情有义，但关键时刻会优先考虑自己的未来。',
  'supeisheng': '你像苏培盛，情商极高、八面玲珑。深谙人情世故，善于察言观色，在不同场合切换自如。野心不强，只求安稳圆满。你是团队的润滑剂和协调者，关键时刻的稳定力量。',
  'guojunwang': '你像果郡王，热情真诚、浪漫自由。对爱情和理想怀有纯粹追求，理想主义极强。你自然散发温暖魅力，相信真情实感，愿为爱和自由放弃世俗权力。是典型的理想主义行动派。',
  'wentaiyi': '你像温太医，温柔理性、富有同理心。情感细腻，愿为他人承担痛苦，坚守医者仁心。内向沉静，野心极低，随遇而安。真诚坦率不擅伪装，是天生的疗愈者，用温暖守护他人。',
  'emperor': '你像皇上，冷静理性、掌控全局。极度理性，一切以结果为导向。野心和权力欲强烈，善于在复杂局势中做最优决策。你有威严的领袖气场，是天生的领导者和决策者，习惯掌控而非被掌控。',
  'ningguiren': '你像宁贵人，深藏不露、城府极深。理性思维强，善于长期潜伏、等待时机。野心不小但懂得隐藏锋芒，情绪表达极度克制。你是典型的隐形强者，静待关键时刻的一击制胜。',
} as const;

// 角色详细特质（用于结果页面详细解读）
export const CHARACTER_DETAILED_TRAITS: Record<string, {
  advantages: string[];
  risks: string[];
}> = {
  'zhenhuan_early': {
    advantages: [
      '情感细腻敏锐：你对情绪的感知力极强，能够深刻理解他人的内心世界，这让你在人际交往中充满同理心和温暖',
      '理想主义情怀：你坚守内心的道德准则和美好信念，对爱情、友情、正义都怀有纯粹的追求，这份赤诚让你散发着独特的魅力',
      '真诚坦率：你不擅长掩饰和算计，待人真诚，这让你容易获得他人的信任，建立深层的情感连接'
    ],
    risks: [
      '情感脆弱易受伤：你对情绪刺激的反应强烈，容易因为他人的言行而受到深深的伤害，批评和冷漠都会让你痛苦很久',
      '过度理想化现实：你容易对人对事抱有不切实际的美好期待，当现实与理想差距过大时，会陷入深深的失望和自我怀疑',
      '缺乏自我保护：你不善于用策略和伪装保护自己，在复杂的人际关系中容易被利用或误解，边界感不够清晰可能让你过度付出'
    ]
  },
  'zhenhuan_late': {
    advantages: [
      '极强的理性思维：你能够冷静分析复杂局势，从全局角度制定长远计划，即使在情绪波动时也能保持清醒的判断力',
      '情绪掌控力卓越：你完成了情绪的蜕变，不再轻易被情感左右，能够在关键时刻隐藏真实想法，用策略而非冲动应对挑战',
      '强大的野心与执行力：你清楚自己想要什么，敢于为了目标而布局谋划，既有耐心等待时机，也有魄力果断出击'
    ],
    risks: [
      '信任困难与疏离感：长期的策略性思维可能让你习惯于隐藏真实想法，难以真正敞开心扉，建立深度的亲密关系',
      '情感压抑的代价：虽然你学会了控制情绪，但长期压抑可能导致内心疲惫，偶尔会感到孤独和无人理解',
      '理想与现实的妥协：你放下了曾经的理想主义，虽然更加务实，但也可能在某些时刻怀念当初那个纯粹的自己'
    ]
  },
  'anlingrong': {
    advantages: [
      '极度敏锐的洞察力：你能够捕捉到他人忽略的情绪细节和微妙变化，这让你在艺术创作和情感表达上有着独特的天赋',
      '一定的理性判断：虽然情感丰富，但你仍保有基本的判断力，不会完全被情绪冲昏头脑',
      '理想主义的追求：你内心仍然渴望美好和真诚，这份善良让你在黑暗中保有一丝光亮'
    ],
    risks: [
      '情绪极度脆弱：你对外界评价异常敏感，小小的忽视或批评都可能引发巨大的情绪波动，容易陷入自我怀疑和焦虑的深渊',
      '自我价值感严重依赖外界：你渴望被认可但又不善于主动表达，这种矛盾让你在关系中常常处于被动和痛苦的状态',
      '理想与现实的撕裂：你想要向上爬却又保持纯真，这种内在冲突让你在道德与野心之间挣扎，容易感到迷失'
    ]
  },
  'queen': {
    advantages: [
      '极致的理性与系统思维：你是宫廷权谋的冷静中枢，能够构建完整的计划体系，从不遗漏任何细节，任何局势在你眼中都是可以计算的棋局',
      '超强的自律与情绪控制：你几乎不被情绪左右，能够在最危机的时刻保持冷静，用理性而非感性做出每一个决策',
      '强大的野心与执行力：你对权力的渴望强烈而持久，既有长期布局的耐心，也有关键时刻的果断，是天生的掌控者'
    ],
    risks: [
      '情感冷漠与孤立：你习惯于隐藏一切真实想法，这让你难以建立真正的情感连接，可能陷入深深的孤独',
      '过度控制欲：你对不确定性的恐惧可能导致你过度干预和掌控，这种完美主义可能让周围的人感到压迫',
      '内向性格的局限：你更擅长幕后操控而非台前表演，这可能让你在某些需要公开魅力的场合处于劣势'
    ]
  },
  'huafei': {
    advantages: [
      '超强的社交能量：你是人群中的焦点，热情洋溢、充满感染力，能够轻松带动气氛、激励他人',
      '极致的真实坦率：你不虚伪、不做作，爱恨分明，这种直球性格让人感到强烈的真诚和信任',
      '较强的野心与行动力：你清楚自己想要什么，敢于直接争取，不会畏首畏尾'
    ],
    risks: [
      '情绪的真实暴露：你不善于掩饰情绪，虽然真实但也容易让人看穿你的弱点，在权谋场中可能处于劣势',
      '对认可和关注的渴望：你需要被看见、被崇拜，这种依赖可能让你在失去关注时感到深深的不安和孤独',
      '实用主义的冷酷：你相信实力和地位，可能在情感价值和功利追求之间失去平衡，骄傲可能让你难以示弱'
    ]
  },
  'shenmeizhuang': {
    advantages: [
      '情绪稳定与韧性：你内心坚韧，不轻易被外界干扰，能够在困境中保持冷静和自尊，是典型的外柔内刚',
      '极强的理想主义与道德感：你重情重义、坚守原则，宁可自己受委屈也不愿违背良心，这份清醒和自律让你在浊世中保持高洁',
      '适度的理性判断：你既有情感的温度，也有理性的判断力，能够在关键时刻做出明智的选择'
    ],
    risks: [
      '过度压抑真实情感：你不善于表达内心情感，为了维护形象可能忽视自己的真实需求，长期压抑可能导致内心疲惫',
      '野心不足的局限：你不追求权势，这让你在宫廷斗争中处于被动，可能错失自我保护的机会',
      '自尊心过强：你宁可受苦也不愿求助，这种自尊可能让你在需要帮助时陷入孤立'
    ]
  },
  'huanbi': {
    advantages: [
      '强大的野心与执行力：你目标明确、行动果断，敢于直接争取自己想要的东西，是典型的行动派',
      '较强的理性思维：你务实而冷静，能够准确评估形势，不做无谓的牺牲，知道如何在现实中为自己争取最大利益',
      '一定的伪装能力：你懂得隐忍和策略，知道什么该说、什么该藏，在复杂的人际关系中能够保护自己'
    ],
    risks: [
      '野心与情义的冲突：你有情有义但更重现实，在关键时刻可能优先考虑自己的利益，这种矛盾可能让你内心挣扎',
      '过度的功利主义：你追求实实在在的改变，但可能在利益权衡中忽视情感价值，显得有些冷酷',
      '情绪管理的代价：虽然你能够控制情绪，但偶尔也会感到压抑和疲惫，渴望被真正理解却又不敢完全敞开'
    ]
  },
  'supeisheng': {
    advantages: [
      '极高的情商与社交能力：你八面玲珑、善于察言观色，能够准确捕捉他人的需求和情绪，在不同的人和场合之间切换自如',
      '灵活应变与忠诚：你懂得人情世故，既忠诚可靠又灵活务实，是团队中不可或缺的润滑剂和协调者',
      '适度的伪装与保护：你知道在什么场合展现什么样的自己，这让你在复杂的环境中游刃有余'
    ],
    risks: [
      '野心不足的局限：你不追求权力的顶峰，只求安稳和圆满，这可能让你在竞争中处于被动',
      '过度适应他人：为了维持和谐，你可能过度迎合他人，逃避必要的对抗，长期下来可能失去自我',
      '自我价值感的迷失：你习惯服务他人，可能忽视自己的真实需求和感受，缺乏对自我价值的清晰认知'
    ]
  },
  'guojunwang': {
    advantages: [
      '极致的理想主义情怀：你相信真情实感，对爱情和自由有着近乎纯粹的追求，这份浪漫与骑士精神让你散发着独特的魅力',
      '强大的社交能量与真诚：你热情洋溢、真诚坦率，自然而然地散发温暖，这不是表演而是真实自我的流露',
      '情感丰富而敏感：你能够深刻感受情感的美好与痛苦，这让你在爱中充满激情和投入'
    ],
    risks: [
      '理想主义的天真：你的直觉和情感主导决策，可能忽视现实的复杂性和残酷性，在权谋斗争中显得格格不入',
      '情感的脆弱性：你不擅长也不喜欢隐藏，真诚的付出可能遭遇背叛和利用，让你受到深深的伤害',
      '野心不足的代价：你不在乎功名利禄，这份洒脱让你自由，但也可能让你在需要争取时显得软弱无力'
    ]
  },
  'wentaiyi': {
    advantages: [
      '深刻的同理心与疗愈能力：你能够深刻感受他人的痛苦，愿意为别人承担和分担，是天生的倾听者和疗愈者',
      '真诚坦率的品格：你不擅长伪装和算计，这让你在复杂的环境中保持了内心的纯粹和温暖',
      '内向沉静的力量：你不喜欢权力场上的争斗，更倾向于在安静中发挥自己的专业价值'
    ],
    risks: [
      '极低的野心与竞争力：你随遇而安，不追求高位和权势，这让你在需要自我保护时显得软弱和被动',
      '理想主义的脆弱：你对美好人性的信仰可能让你忽视人性的阴暗面，在残酷的现实中容易受伤',
      '过度付出与自我忽视：你为他人承担过多情绪负担，照顾他人时忽略自己的需求，可能导致自我耗竭'
    ]
  },
  'emperor': {
    advantages: [
      '极致的理性与战略思维：你能够看到他人看不到的大局和趋势，在复杂的局势中做出最优决策，是天生的领导者',
      '满分的野心与掌控欲：你对权力的渴望强烈而持久，习惯站在高处俯瞰全局，掌控一切才能让你安心',
      '适度的社交威严：你有着威严的领袖气场，但更多是理性的权威而非感性的魅力'
    ],
    risks: [
      '情感淡漠与孤立：你极度理性，几乎不被情绪左右，但这也让你难以建立真正的情感连接，高处不胜寒',
      '实用主义的冷酷：你相信理想需要服从于现实，一切以结果和效率为导向，可能忽视人性化的关怀',
      '过度控制的代价：你对控制的需求可能变成压迫，这种权力欲可能让周围的人感到恐惧而非信任'
    ]
  },
  'ningguiren': {
    advantages: [
      '强大的理性与策略思维：你善于长期潜伏、等待时机，能够观察和分析复杂局势，制定长期计划并坚持执行',
      '较强的野心与耐心：你的野心不小，但你懂得隐藏锋芒，用表面的温和掩饰内心的计算，是典型的隐形强者',
      '极度的情绪控制：你的情绪表达极度克制，几乎从不让人看穿你的真实想法，这让你在权谋斗争中占据优势'
    ],
    risks: [
      '深度的孤独与信任缺失：你习惯于独自行动，不喜欢过多的社交曝光，防备心过重可能让你难以建立深层关系',
      '过度谨慎的代价：你太善于等待，可能错失需要果断行动的机会，长期的隐藏也可能导致心理负担',
      '实用主义的冷漠：你一切以目标为导向，可能在情感价值和利益权衡中显得过于冷酷和算计'
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
  purpose: '通过30道题目（24道情景选择题 + 6道人格锚点题），从情绪敏感性、思维模式、社交能量、价值取向、野心指数、自我表达等6个维度，判断你最接近哪种"宫廷人格"',
  duration: '8-10分钟',
  questionCount: 30,

  dimensions: [
    {
      id: 'sensitivity',
      name: ZHZ_DIMENSIONS.sensitivity,
      description: '对情绪刺激的反应强度（低=稳定冷静 ↔ 高=敏感脆弱）',
      questionIds: [] // ZHZ使用自定义计算，不需要questionIds
    },
    {
      id: 'rationality',
      name: ZHZ_DIMENSIONS.rationality,
      description: '决策方式（低=直觉冲动 ↔ 高=理性谋划）',
      questionIds: []
    },
    {
      id: 'sociability',
      name: ZHZ_DIMENSIONS.sociability,
      description: '社交行为倾向（低=内向沉静 ↔ 高=外向张扬）',
      questionIds: []
    },
    {
      id: 'idealism',
      name: ZHZ_DIMENSIONS.idealism,
      description: '价值权衡倾向（低=实用主义 ↔ 高=理想主义）',
      questionIds: []
    },
    {
      id: 'ambition',
      name: ZHZ_DIMENSIONS.ambition,
      description: '成功追求程度（低=随遇而安 ↔ 高=进取心强）',
      questionIds: []
    },
    {
      id: 'authenticity',
      name: ZHZ_DIMENSIONS.authenticity,
      description: '真实自我展露（低=战略掩饰 ↔ 高=真实坦率）',
      questionIds: []
    }
  ],

  questions: [
    // ========== 第一组：情绪与冲突处理 ==========

    // Q1 - 冲突处理（主测：思维模式、社交能量）
    {
      id: 'zhz_q1',
      type: 'scale',
      question: '团队开会吵翻天，你的做法是？💼',
      dimension: 'conflict_handling',
      options: [
        { value: 1, label: '当和事佬，让每个人都感觉被理解', scores: {"sensitivity":0.18,"idealism":0.15} },
        { value: 2, label: '先观察局势，找准关键矛盾再行动', scores: {"rationality":0.22,"ambition":0.12} },
        { value: 3, label: '有话直说，最烦拐弯抹角！', scores: {"sociability":0.22,"authenticity":0.18} },
        { value: 4, label: '表面保持中立，暗中推动自己的方案', scores: {"rationality":0.24,"ambition":0.18,"authenticity":-0.14} },
        { value: 5, label: '看戏就好，最后听领导的', scores: {"ambition":-0.15,"sensitivity":-0.10} },
      ],
      required: true,
    },

    // Q2 - 竞争应对（主测：思维模式、野心指数）
    {
      id: 'zhz_q2',
      type: 'scale',
      question: '有人公开挑衅你，你会？🔥',
      dimension: 'competition_response',
      options: [
        { value: 1, label: '表面不动声色，私下留意TA的一举一动', scores: {"rationality":0.22,"ambition":0.16,"authenticity":-0.12} },
        { value: 2, label: '当场刚回去，谁怕谁？', scores: {"sociability":0.22,"authenticity":0.18} },
        { value: 3, label: '忍住，用成绩狠狠打脸TA', scores: {"sensitivity":0.15,"ambition":0.12} },
        { value: 4, label: '微笑应对，但已经开始布局反击了', scores: {"rationality":0.22,"ambition":0.18,"authenticity":-0.10} },
        { value: 5, label: '随TA去吧，不值得我浪费时间', scores: {"ambition":-0.16,"sensitivity":-0.12} },
      ],
      required: true,
    },

    // Q3 - 恋爱价值观（主测：价值取向、自我表达）
    {
      id: 'zhz_q3',
      type: 'scale',
      question: '❤️ 恋爱中，你最想要的是什么？',
      dimension: 'love_values',
      options: [
        { value: 1, label: '真诚相待，彼此信任的安全感', scores: {"idealism":0.22,"authenticity":0.15} },
        { value: 2, label: '相互尊重，谁也别越界', scores: {"sensitivity":-0.10,"idealism":0.12} },
        { value: 3, label: '强烈的占有欲和热烈的爱', scores: {"sociability":0.20,"sensitivity":0.15} },
        { value: 4, label: '灵魂契合，诗与远方的浪漫', scores: {"idealism":0.25} },
        { value: 5, label: '被看见、被珍惜、被需要的感觉', scores: {"sensitivity":0.22} },
      ],
      required: true,
    },

    // 锚点题1 - 情绪敏感性
    {
      id: 'zhz_anchor_sensitivity',
      type: 'likert',
      question: '💭 我经常会因为他人的评价或态度而感到焦虑不安',
      dimension: 'sensitivity',
      options: [
        { value: 1, label: '非常不符合' },
        { value: 2, label: '比较不符合' },
        { value: 3, label: '不确定' },
        { value: 4, label: '比较符合' },
        { value: 5, label: '非常符合' },
      ],
      required: true,
    },

    // Q4 - 误解处理（主测：自我表达、思维模式）
    {
      id: 'zhz_q4',
      type: 'scale',
      question: '被人误会冤枉了，你会？😤',
      dimension: 'misunderstanding_handling',
      options: [
        { value: 1, label: '当面解释清楚，绝不含糊！', scores: {"sociability":0.20,"authenticity":0.16} },
        { value: 2, label: '保持沉默，清者自清', scores: {"sensitivity":-0.12,"idealism":0.12} },
        { value: 3, label: '先收集证据，然后一次性翻盘', scores: {"rationality":0.22,"ambition":0.14} },
        { value: 4, label: '表面不说，但会一辈子记在心里', scores: {"sensitivity":0.22} },
        { value: 5, label: '劝自己放下，时间会证明一切', scores: {"sensitivity":-0.10,"idealism":0.14} },
      ],
      required: true,
    },

    // Q5 - 浪漫表达（主测：社交能量、自我表达）
    {
      id: 'zhz_q5',
      type: 'scale',
      question: '💘 面对心动的人，你会？',
      dimension: 'romantic_approach',
      options: [
        { value: 1, label: '主动制造浪漫惊喜，让TA感受到我的心意', scores: {"sociability":0.20,"idealism":0.16} },
        { value: 2, label: '偷偷观察，不敢主动表白', scores: {"sensitivity":0.20,"sociability":-0.16} },
        { value: 3, label: '小心试探，确认TA对我也有意思', scores: {"sensitivity":0.15,"rationality":0.12} },
        { value: 4, label: '直接开门见山，喜欢就说！', scores: {"sociability":0.22,"authenticity":0.18} },
        { value: 5, label: '顺其自然吧，是你的跑不掉', scores: {"ambition":-0.14,"sensitivity":-0.10} },
      ],
      required: true,
    },

    // Q6 - 错误处理（主测：自我表达、思维模式）
    {
      id: 'zhz_q6',
      type: 'scale',
      question: '工作出了大差错，你会？😰',
      dimension: 'mistake_handling',
      options: [
        { value: 1, label: '立刻找原因，主动承担责任', scores: {"sensitivity":-0.10,"authenticity":0.14} },
        { value: 2, label: '想办法补救，尽量别让领导发现', scores: {"rationality":0.18,"authenticity":-0.10} },
        { value: 3, label: '先安抚团队情绪，再一起想办法', scores: {"sensitivity":0.18,"idealism":0.14} },
        { value: 4, label: '分析是谁的锅，想办法让别人背', scores: {"rationality":0.22,"ambition":0.16,"authenticity":-0.18} },
        { value: 5, label: '冷静复盘，吸取教训下次改进', scores: {"sensitivity":-0.12,"rationality":0.14} },
      ],
      required: true,
    },

    // Q7 - 背叛反应（主测：情绪敏感性、自我表达）
    {
      id: 'zhz_q7',
      type: 'scale',
      question: '闺蜜/兄弟背叛了你，你会？💔',
      dimension: 'betrayal_response',
      options: [
        { value: 1, label: '表面原谅，但从此保持距离', scores: {"rationality":0.18,"authenticity":-0.14} },
        { value: 2, label: '冷处理，不撕破脸但也不再来往', scores: {"sensitivity":-0.12,"rationality":0.14} },
        { value: 3, label: '恨一辈子！哪怕不报复也忘不了', scores: {"sensitivity":0.22} },
        { value: 4, label: '当众撕破脸，让所有人都知道TA是什么人', scores: {"sociability":0.20,"authenticity":0.18} },
        { value: 5, label: '试着理解TA的苦衷和难处', scores: {"sensitivity":0.14,"idealism":0.18} },
      ],
      required: true,
    },

    // 锚点题2 - 思维模式
    {
      id: 'zhz_anchor_rationality',
      type: 'likert',
      question: '🧠 在做重要决定前，我习惯深思熟虑并权衡各种可能性',
      dimension: 'rationality',
      options: [
        { value: 1, label: '非常不符合' },
        { value: 2, label: '比较不符合' },
        { value: 3, label: '不确定' },
        { value: 4, label: '比较符合' },
        { value: 5, label: '非常符合' },
      ],
      required: true,
    },

    // ========== 第二组：社交与价值观 ==========

    // Q8 - 社交偏好（主测：社交能量、价值取向）
    {
      id: 'zhz_q8',
      type: 'scale',
      question: '🎭 理想的社交状态是？',
      dimension: 'social_preference',
      options: [
        { value: 1, label: '热闹聚会的中心，万众瞩目的感觉真好！', scores: {"sociability":0.25} },
        { value: 2, label: '小圈子深度交流，三五知己足矣', scores: {"sensitivity":0.12,"idealism":0.16} },
        { value: 3, label: '精准社交，只和对我有帮助的人建立关系', scores: {"rationality":0.22,"ambition":0.16,"authenticity":-0.14} },
        { value: 4, label: '找到灵魂伴侣，一起聊理想聊人生', scores: {"idealism":0.22} },
        { value: 5, label: '最好不用社交，自己待着最舒服', scores: {"sociability":-0.18,"ambition":-0.12} },
      ],
      required: true,
    },

    // Q9 - 诱惑处理（主测：价值取向、野心指数）
    {
      id: 'zhz_q9',
      type: 'scale',
      question: '面对巨大诱惑时，你更可能？🍎',
      dimension: 'temptation_handling',
      options: [
        { value: 1, label: '不符合我的原则，直接拒绝！', scores: {"sensitivity":-0.12,"idealism":0.18} },
        { value: 2, label: '内心挣扎但最终克制住', scores: {"sensitivity":0.15,"idealism":0.16} },
        { value: 3, label: '机会难得，先抓住再说', scores: {"ambition":0.22,"idealism":-0.10} },
        { value: 4, label: '表面推辞，暗中想办法利用这个机会', scores: {"rationality":0.22,"ambition":0.16,"authenticity":-0.16} },
        { value: 5, label: '情感冲昏头脑，顾不了那么多了', scores: {"sensitivity":0.22,"rationality":-0.14} },
      ],
      required: true,
    },

    // Q10 - 功劳被抢（主测：野心指数、自我表达）
    {
      id: 'zhz_q10',
      type: 'scale',
      question: '有人抢走了你的功劳？😠',
      dimension: 'credit_stealing',
      options: [
        { value: 1, label: '当场据理力争，必须要个说法！', scores: {"sociability":0.20,"authenticity":0.16} },
        { value: 2, label: '算了，不想浪费精力在这种人身上', scores: {"ambition":-0.16,"sensitivity":-0.10} },
        { value: 3, label: '记下这笔账，找机会扳回来', scores: {"rationality":0.22,"ambition":0.16} },
        { value: 4, label: '表面祝贺TA，暗中让TA付出代价', scores: {"rationality":0.24,"ambition":0.18,"authenticity":-0.18} },
        { value: 5, label: '默默继续努力，用实力证明谁才是最强的', scores: {"sensitivity":-0.12,"ambition":0.12} },
      ],
      required: true,
    },

    // Q11 - 压力反应（主测：情绪敏感性、野心指数）
    {
      id: 'zhz_q11',
      type: 'scale',
      question: '压力山大时，你的反应是？😫',
      dimension: 'stress_response',
      options: [
        { value: 1, label: '越挫越勇，反而更想赢了！', scores: {"ambition":0.22,"sensitivity":-0.12} },
        { value: 2, label: '会先自我怀疑："我是不是不行？"', scores: {"sensitivity":0.24} },
        { value: 3, label: '冷静分析问题，一步步解决', scores: {"sensitivity":-0.14,"rationality":0.12} },
        { value: 4, label: '外表云淡风轻，内心早已翻江倒海', scores: {"sensitivity":0.18,"authenticity":-0.12} },
        { value: 5, label: '暴躁发泄一通就好了', scores: {"sociability":0.18,"authenticity":0.14} },
      ],
      required: true,
    },

    // 锚点题3 - 社交能量
    {
      id: 'zhz_anchor_sociability',
      type: 'likert',
      question: '✨ 我在大多数社交场合都能表现得自信并且外向',
      dimension: 'sociability',
      options: [
        { value: 1, label: '非常不符合' },
        { value: 2, label: '比较不符合' },
        { value: 3, label: '不确定' },
        { value: 4, label: '比较符合' },
        { value: 5, label: '非常符合' },
      ],
      required: true,
    },

    // ========== 第三组：底线与价值 ==========

    // Q12 - 领导风格（主测：思维模式、社交能量）
    {
      id: 'zhz_q12',
      type: 'scale',
      question: '💼 如果你当了领导，你会？',
      dimension: 'leadership_style',
      options: [
        { value: 1, label: '严谨稳重，把每件事都安排得明明白白', scores: {"rationality":0.22,"sensitivity":-0.10} },
        { value: 2, label: '用热情感染大家，带领团队冲冲冲！', scores: {"sociability":0.22,"authenticity":0.14} },
        { value: 3, label: '平衡关系，让每个人都有好处', scores: {"rationality":0.18,"sensitivity":0.12} },
        { value: 4, label: '少说多看，暗中观察每个人', scores: {"rationality":0.20,"authenticity":-0.12} },
        { value: 5, label: '不太想当领导，太累了', scores: {"ambition":-0.18} },
      ],
      required: true,
    },

    // Q13 - 价值格言（主测：价值取向、自我表达）
    {
      id: 'zhz_q13',
      type: 'scale',
      question: '以下哪句话最打动你？💭',
      dimension: 'justice_view',
      options: [
        { value: 1, label: '"愿得一心人，白首不相离。"', scores: {"idealism":0.22,"sensitivity":0.14} },
        { value: 2, label: '"世上没有绝对的正义，只有立场不同。"', scores: {"rationality":0.20,"idealism":-0.12} },
        { value: 3, label: '"宁可站着死，不愿跪着生。"', scores: {"authenticity":0.22,"sociability":0.14} },
        { value: 4, label: '"做人如兰，心静而芳。"', scores: {"sensitivity":-0.12,"idealism":0.12} },
        { value: 5, label: '"人生在世，不过求心安二字。"', scores: {"sensitivity":-0.10,"idealism":0.14} },
      ],
      required: true,
    },

    // Q14 - 升职反应（主测：野心指数、情绪敏感性）
    {
      id: 'zhz_q14',
      type: 'scale',
      question: '突然升职加薪了，你会？📈',
      dimension: 'promotion_reaction',
      options: [
        { value: 1, label: '兴奋！立刻规划如何做得更好', scores: {"ambition":0.20,"sociability":0.12} },
        { value: 2, label: '冷静分析：为什么是我？背后有什么目的？', scores: {"rationality":0.22} },
        { value: 3, label: '担心别人嫉妒，小心翼翼做人', scores: {"sensitivity":0.20} },
        { value: 4, label: '制定长远计划，巩固自己的地位', scores: {"rationality":0.20,"ambition":0.16} },
        { value: 5, label: '无所谓，继续按自己的节奏来', scores: {"ambition":-0.14} },
      ],
      required: true,
    },

    // 锚点题4 - 价值取向
    {
      id: 'zhz_anchor_idealism',
      type: 'likert',
      question: '⭐ 我对关系、价值观和理想有着非常坚定的坚持',
      dimension: 'idealism',
      options: [
        { value: 1, label: '非常不符合' },
        { value: 2, label: '比较不符合' },
        { value: 3, label: '不确定' },
        { value: 4, label: '比较符合' },
        { value: 5, label: '非常符合' },
      ],
      required: true,
    },

    // ========== 第四组：适应与追求 ==========

    // Q15 - 新环境适应（主测：社交能量、思维模式）
    {
      id: 'zhz_q15',
      type: 'scale',
      question: '到了全新的环境，你会？🌍',
      dimension: 'new_environment',
      options: [
        { value: 1, label: '主动融入，快速和大家打成一片', scores: {"sociability":0.22} },
        { value: 2, label: '先观察氛围，慢慢适应节奏', scores: {"sensitivity":0.14,"rationality":0.12} },
        { value: 3, label: '迅速找到核心人物，掌握关键信息', scores: {"rationality":0.22,"ambition":0.14} },
        { value: 4, label: '不刻意迎合，保持自己的节奏', scores: {"authenticity":0.18,"sensitivity":-0.10} },
        { value: 5, label: '让自己成为有用的人，获得认可', scores: {"ambition":0.16,"rationality":0.12} },
      ],
      required: true,
    },

    // Q16 - 失恋处理（主测：价值取向、情绪敏感性）
    {
      id: 'zhz_q16',
      type: 'scale',
      question: '💔 当你发现喜欢的人心有所属？',
      dimension: 'unrequited_love',
      options: [
        { value: 1, label: '痛苦但祝福，爱TA就希望TA幸福', scores: {"idealism":0.20,"sensitivity":-0.10} },
        { value: 2, label: '假装不在意，一个人偷偷崩溃', scores: {"sensitivity":0.22,"authenticity":-0.14} },
        { value: 3, label: '不甘心！我要努力争取！', scores: {"ambition":0.20,"sociability":0.14} },
        { value: 4, label: '默默退出，把爱藏在心底', scores: {"sensitivity":0.18,"idealism":0.14} },
        { value: 5, label: '转移注意力，重新开始就好', scores: {"sensitivity":-0.12,"rationality":0.12} },
      ],
      required: true,
    },

    // Q17 - 超能力期望（主测：野心指数、价值取向）
    {
      id: 'zhz_q17',
      type: 'scale',
      question: '如果你有超能力，你希望是？✨',
      dimension: 'desired_ability',
      options: [
        { value: 1, label: '看透人心，掌握所有人的想法', scores: {"rationality":0.24,"ambition":0.16} },
        { value: 2, label: '让所有人都喜欢我', scores: {"sensitivity":0.22} },
        { value: 3, label: '治愈他人的痛苦和伤痛', scores: {"sensitivity":0.16,"idealism":0.20} },
        { value: 4, label: '完全掌控自己的命运', scores: {"ambition":0.22,"rationality":0.12} },
        { value: 5, label: '拥有无敌的力量，想做什么就做什么！', scores: {"sociability":0.20,"ambition":0.14} },
      ],
      required: true,
    },

    // Q18 - 理想自我（主测：价值取向、自我表达）
    {
      id: 'zhz_q18',
      type: 'scale',
      question: '如果用一句话形容理想的自己？🌟',
      dimension: 'legacy',
      options: [
        { value: 1, label: '"真诚待人，温柔而有力量。"', scores: {"authenticity":0.16,"idealism":0.16,"sensitivity":0.12} },
        { value: 2, label: '"温柔坚定，宠辱不惊。"', scores: {"sensitivity":-0.14,"idealism":0.12} },
        { value: 3, label: '"运筹帷幄，掌控自己的命运。"', scores: {"rationality":0.22,"ambition":0.16} },
        { value: 4, label: '"光芒万丈，无人能挡。"', scores: {"sociability":0.24,"ambition":0.14} },
        { value: 5, label: '"治愈他人，自渡渡人。"', scores: {"idealism":0.20,"sensitivity":0.16} },
      ],
      required: true,
    },

    // 锚点题5 - 野心指数
    {
      id: 'zhz_anchor_ambition',
      type: 'likert',
      question: '🚀 我会主动追求更高的成就，而不是等待机会来临',
      dimension: 'ambition',
      options: [
        { value: 1, label: '非常不符合' },
        { value: 2, label: '比较不符合' },
        { value: 3, label: '不确定' },
        { value: 4, label: '比较符合' },
        { value: 5, label: '非常符合' },
      ],
      required: true,
    },

    // ========== 第五组：友情与态度 ==========

    // Q19 - 友情观（主测：价值取向、自我表达）
    {
      id: 'zhz_q19',
      type: 'scale',
      question: '🤝 哪句话最符合你的友情观？',
      dimension: 'friendship_values',
      options: [
        { value: 1, label: '"真心换真心，四两换半斤。"', scores: {"authenticity":0.16,"idealism":0.16} },
        { value: 2, label: '"朋友是资源，互相利用才能共赢。"', scores: {"rationality":0.20,"ambition":0.14,"authenticity":-0.14} },
        { value: 3, label: '"患难见真情，岁月见人心。"', scores: {"sensitivity":-0.12,"idealism":0.12} },
        { value: 4, label: '"江湖路远，有你足矣。"', scores: {"idealism":0.22,"authenticity":0.14} },
        { value: 5, label: '"相识一场便是缘，散了也无妨。"', scores: {"sensitivity":-0.10} },
      ],
      required: true,
    },

    // Q20 - 同龄人成功（主测：野心指数、情绪敏感性）
    {
      id: 'zhz_q20',
      type: 'scale',
      question: '看到同龄人成功，你的第一反应是？📊',
      dimension: 'peer_success',
      options: [
        { value: 1, label: '分析TA的成功路径，想办法超越！', scores: {"rationality":0.18,"ambition":0.20} },
        { value: 2, label: '祝福TA，但我也要加油追赶', scores: {"ambition":0.16,"idealism":0.12} },
        { value: 3, label: '焦虑，担心自己被甩在后面', scores: {"sensitivity":0.22,"ambition":0.12} },
        { value: 4, label: '无所谓，我有自己的节奏', scores: {"ambition":-0.14,"sensitivity":-0.12} },
        { value: 5, label: '真心为TA高兴，替TA开心！', scores: {"sensitivity":0.14,"idealism":0.16} },
      ],
      required: true,
    },

    // Q21 - 高压机会（主测：野心指数、情绪敏感性）
    {
      id: 'zhz_q21',
      type: 'scale',
      question: '高薪但压力巨大的机会，你会？💰',
      dimension: 'high_pressure_opportunity',
      options: [
        { value: 1, label: '果断接受，这是上升的机会！', scores: {"ambition":0.24,"sensitivity":-0.12} },
        { value: 2, label: '仔细评估利弊，值得就拼一把', scores: {"rationality":0.20,"ambition":0.16} },
        { value: 3, label: '担心自己做不好，犹豫不决', scores: {"sensitivity":0.20,"ambition":-0.10} },
        { value: 4, label: '拒绝，不想牺牲生活质量', scores: {"ambition":-0.16,"sensitivity":-0.10} },
        { value: 5, label: '算了吧，压力太大不值得', scores: {"ambition":-0.20} },
      ],
      required: true,
    },

    // Q22 - 社交媒体真实性（主测：自我表达）
    {
      id: 'zhz_q22',
      type: 'scale',
      question: '📱 朋友圈和真实生活，你的状态是？',
      dimension: 'social_media_authenticity',
      options: [
        { value: 1, label: '基本一致，我不喜欢装！', scores: {"authenticity":0.24} },
        { value: 2, label: '展示积极面，但不刻意美化', scores: {"authenticity":0.16,"sociability":0.12} },
        { value: 3, label: '基本不发，觉得没必要晒', scores: {"sociability":-0.12,"authenticity":0.10} },
        { value: 4, label: '非常用心经营，展示最好的自己', scores: {"rationality":0.16,"authenticity":-0.12} },
        { value: 5, label: '精心打造人设，朋友圈≠真实生活', scores: {"rationality":0.20,"authenticity":-0.18} },
      ],
      required: true,
    },

    // ========== 第六组：真实性与自我表达 ==========

    // Q23 - 情绪披露（主测：自我表达、情绪敏感性）
    {
      id: 'zhz_q23',
      type: 'scale',
      question: '别人问你"过得好吗"，你通常？🗣️',
      dimension: 'emotional_disclosure',
      options: [
        { value: 1, label: '实话实说，好就是好，不好就是不好', scores: {"authenticity":0.24} },
        { value: 2, label: '看关系远近，亲近的才说真话', scores: {"authenticity":0.14,"sensitivity":0.12} },
        { value: 3, label: '总说"还好"，不想暴露真实状态', scores: {"rationality":0.14,"authenticity":-0.12} },
        { value: 4, label: '永远说"很好"，不让人看到我的脆弱', scores: {"rationality":0.16,"authenticity":-0.16} },
        { value: 5, label: '表面云淡风轻，内心早已千疮百孔', scores: {"sensitivity":0.20,"authenticity":-0.14} },
      ],
      required: true,
    },

    // Q24 - 职场真实性（主测：自我表达、思维模式）
    {
      id: 'zhz_q24',
      type: 'scale',
      question: '💼 职场中，你更倾向于？',
      dimension: 'workplace_authenticity',
      options: [
        { value: 1, label: '做真实的自己，不合适就换工作', scores: {"authenticity":0.24} },
        { value: 2, label: '保留底线，其他可以适当调整', scores: {"authenticity":0.14,"sensitivity":-0.10} },
        { value: 3, label: '有策略地展示不同面，适应环境', scores: {"rationality":0.20,"authenticity":-0.10} },
        { value: 4, label: '非常在意职业形象管理，打造完美人设', scores: {"rationality":0.22,"authenticity":-0.16} },
        { value: 5, label: '扮演别人期待的角色，隐藏真实想法', scores: {"rationality":0.18,"authenticity":-0.20} },
      ],
      required: true,
    },

    // 锚点题6 - 自我表达
    {
      id: 'zhz_anchor_authenticity',
      type: 'likert',
      question: '💎 在大多数情况下，我更愿意真实表达自己而不是迎合他人期待',
      dimension: 'authenticity',
      options: [
        { value: 1, label: '非常不符合' },
        { value: 2, label: '比较不符合' },
        { value: 3, label: '不确定' },
        { value: 4, label: '比较符合' },
        { value: 5, label: '非常符合' },
      ],
      required: true,
    },
  ],
};

/**
 * 计算每个维度的理论最大和最小得分
 * 遍历所有题目，分别计算：
 * - 最大得分：每题选择该维度的最大增量（包括正分）
 * - 最小得分：每题选择该维度的最小增量（包括负分）
 */
function calculateDimensionScoreRanges() {
  const dimensions = ['sensitivity', 'rationality', 'sociability', 'idealism', 'ambition', 'authenticity'] as const;
  type DimensionKey = typeof dimensions[number];

  const minScores: Record<DimensionKey, number> = {
    sensitivity: 0,
    rationality: 0,
    sociability: 0,
    idealism: 0,
    ambition: 0,
    authenticity: 0,
  };

  const maxScores: Record<DimensionKey, number> = {
    sensitivity: 0,
    rationality: 0,
    sociability: 0,
    idealism: 0,
    ambition: 0,
    authenticity: 0,
  };

  zhz.questions.forEach((question) => {
    // 对每个维度，找到该题中的最大和最小增量
    dimensions.forEach((dim) => {
      let maxIncrementForDim = 0;
      let minIncrementForDim = 0;

      question.options.forEach((option) => {
        if ('scores' in option) {
          const scores = option.scores as Record<string, number>;
          const increment = scores[dim] || 0;
          maxIncrementForDim = Math.max(maxIncrementForDim, increment);
          minIncrementForDim = Math.min(minIncrementForDim, increment);
        }
      });

      maxScores[dim] += maxIncrementForDim;
      minScores[dim] += minIncrementForDim;
    });
  });

  return { minScores, maxScores };
}

/**
 * 余弦相似度计算
 * similarity = (u · r) / (||u|| * ||r||)
 *
 * @param vec1 用户向量
 * @param vec2 角色向量
 * @returns 相似度 [0, 1]
 */
function cosineSimilarity(
  vec1: Record<string, number>,
  vec2: Record<string, number>
): number {
  const keys = Object.keys(vec1);

  // 计算点积
  let dotProduct = 0;
  keys.forEach((key) => {
    dotProduct += vec1[key] * vec2[key];
  });

  // 计算模长
  let norm1 = 0;
  let norm2 = 0;
  keys.forEach((key) => {
    norm1 += vec1[key] ** 2;
    norm2 += vec2[key] ** 2;
  });
  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);

  // 防止除以0
  if (norm1 === 0 || norm2 === 0) {
    return 0;
  }

  return dotProduct / (norm1 * norm2);
}

/**
 * 归一化欧氏距离计算
 * distance = sqrt(Σ(u_i - r_i)²) / sqrt(n)
 *
 * @param vec1 用户向量
 * @param vec2 角色向量
 * @returns 归一化距离 [0, 1]
 */
function normalizedEuclideanDistance(
  vec1: Record<string, number>,
  vec2: Record<string, number>
): number {
  const keys = Object.keys(vec1);
  const n = keys.length;

  let sumSquaredDiff = 0;
  keys.forEach((key) => {
    const diff = vec1[key] - vec2[key];
    sumSquaredDiff += diff * diff;
  });

  // 归一化到 [0, 1]：除以 sqrt(n)（最大可能距离）
  return Math.sqrt(sumSquaredDiff) / Math.sqrt(n);
}

/**
 * 混合相似度算法（余弦相似度 + 欧氏距离）
 * 同时考虑向量方向和绝对差异
 *
 * similarity = 0.5 × 余弦相似度 + 0.5 × (1 - 归一化欧氏距离)
 *
 * @param vec1 用户向量
 * @param vec2 角色向量
 * @returns 混合相似度 [0, 1]
 */
function hybridSimilarity(
  vec1: Record<string, number>,
  vec2: Record<string, number>
): number {
  const cosineSim = cosineSimilarity(vec1, vec2);
  const euclideanDist = normalizedEuclideanDistance(vec1, vec2);

  // 混合：余弦相似度（方向）+ 欧氏距离转相似度（绝对差异）
  return 0.5 * cosineSim + 0.5 * (1 - euclideanDist);
}

/**
 * 四阶段向量建模方法（加入 Likert 锚点校准）
 *
 * 阶段1：维度得分累加（Raw Score Accumulation from forced-choice questions）
 * 阶段2：Min-Max归一化（Normalization - 得到相对偏好向量）
 * 阶段3：Likert 锚点校准（Anchor Calibration - 恢复绝对水平）
 * 阶段4：余弦相似度匹配（Cosine Similarity）
 */
export function calculateZHZResults(answers: Record<string, number>) {
    const dimensions = ['sensitivity', 'rationality', 'sociability', 'idealism', 'ambition', 'authenticity'] as const;
    type DimensionKey = typeof dimensions[number];

    // ============ 阶段1：维度得分累加（仅 forced-choice 题）============
    const rawScores: Record<DimensionKey, number> = {
      sensitivity: 0,
      rationality: 0,
      sociability: 0,
      idealism: 0,
      ambition: 0,
      authenticity: 0,
    };

    // 遍历所有答案，累加各维度分数（排除锚点题）
    zhz.questions.forEach((question) => {
      // 跳过 Likert 锚点题，只处理 forced-choice 题
      if (question.type === 'likert') return;

      const answerId = answers[question.id];
      if (answerId !== undefined) {
        const selectedOption = question.options.find(opt => opt.value === answerId);
        if (selectedOption && 'scores' in selectedOption) {
          const scores = selectedOption.scores as Record<string, number>;
          Object.keys(rawScores).forEach((dim) => {
            const score = scores[dim] || 0;
            rawScores[dim as keyof typeof rawScores] += score;
          });
        }
      }
    });

    // ============ 阶段2：Min-Max归一化（得到相对偏好向量）============
    // 计算每个维度的理论最小值和最大值（考虑负分）
    const { minScores: minPossible, maxScores: maxPossible } = calculateDimensionScoreRanges();

    const relativeScores: Record<DimensionKey, number> = {
      sensitivity: 0,
      rationality: 0,
      sociability: 0,
      idealism: 0,
      ambition: 0,
      authenticity: 0,
    };

    Object.keys(rawScores).forEach((dim) => {
      const dimKey = dim as keyof typeof rawScores;
      const min = minPossible[dimKey];
      const max = maxPossible[dimKey];
      const range = max - min;

      if (range > 0) {
        // 归一化到 0-1 范围：(实际得分 - 最小值) / (最大值 - 最小值)
        relativeScores[dimKey] = Math.max(0, Math.min(1, (rawScores[dimKey] - min) / range));
      } else {
        // 如果范围为0（该维度没有任何得分变化），设为0.5（中性）
        relativeScores[dimKey] = 0.5;
      }
    });

    // ============ 阶段3：Likert 锚点校准（恢复绝对水平）============
    // 从锚点题获取各维度的绝对水平（1-5分）
    const anchorScores: Record<DimensionKey, number> = {
      sensitivity: 0,
      rationality: 0,
      sociability: 0,
      idealism: 0,
      ambition: 0,
      authenticity: 0,
    };

    // 读取锚点题答案
    dimensions.forEach((dim) => {
      const anchorId = `zhz_anchor_${dim}`;
      const anchorAnswer = answers[anchorId];
      if (anchorAnswer !== undefined) {
        // Likert 得分归一化到 0-1：(答案 - 1) / (5 - 1)
        anchorScores[dim] = (anchorAnswer - 1) / 4;
      } else {
        // 如果用户未回答锚点题，默认使用中性值 0.5
        anchorScores[dim] = 0.5;
      }
    });

    // 校准方法：加权混合
    // calibratedScore = α × relativeScore + β × anchorScore
    // 其中 α = 0.6（相对偏好权重），β = 0.4（绝对水平权重）
    const alpha = 0.6; // 相对偏好权重
    const beta = 0.4;  // 绝对水平权重

    const calibratedScores: Record<DimensionKey, number> = {
      sensitivity: 0,
      rationality: 0,
      sociability: 0,
      idealism: 0,
      ambition: 0,
      authenticity: 0,
    };

    dimensions.forEach((dim) => {
      calibratedScores[dim] = alpha * relativeScores[dim] + beta * anchorScores[dim];
    });

    // ============ 阶段4：混合相似度匹配 ============
    // 使用校准后的得分进行角色匹配（混合算法：余弦相似度 + 欧氏距离）
    const similarities: Array<{ character: string; similarity: number }> = [];

    Object.entries(CHARACTER_PROFILES).forEach(([charId, charData]) => {
      const similarity = hybridSimilarity(calibratedScores, charData.scores);
      similarities.push({ character: charId, similarity });
    });

    // 按相似度排序，取前3
    similarities.sort((a, b) => b.similarity - a.similarity);
    const topMatches = similarities.slice(0, 3);

    // 5. 构建结果
    const primaryChar = CHARACTER_PROFILES[topMatches[0].character as keyof typeof CHARACTER_PROFILES];

    return {
      totalScore: Math.round(topMatches[0].similarity * 100),
      dimensionScores: Object.entries(calibratedScores).map(([key, value]) => ({
        dimension: ZHZ_DIMENSIONS[key as keyof typeof ZHZ_DIMENSIONS],
        score: Math.round(value * 100),
      })),
      interpretation: generateInterpretation(topMatches, calibratedScores),
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
        userVector: calibratedScores,
        // 额外返回调试信息（可选）
        debug: {
          relativeScores,  // 仅来自 forced-choice 的相对偏好
          anchorScores,    // 仅来自 Likert 的绝对水平
          calibratedScores // 校准后的最终得分
        }
      }
    };
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
    'zhenhuan_early': '你像初入宫的甄嬛，心思细腻、善良温婉，重情重义。你的**情绪敏感性很高**（0.80），能够深刻感知他人的情绪，但也容易因此受伤。你怀有**极强的理想主义**（0.90），相信真情可以感化人心，相信善良终有回报，这份纯粹让你在复杂的世界中显得格外珍贵。你**相对真诚坦率**（0.70），不擅长掩饰和算计，在人际关系中倾向于用理解和包容去化解矛盾。你的理性不算高（0.45），更多凭借感性和直觉做决策，对待情感时充满浪漫的期待。\n\n**关键词：情感细腻、理想主义、真诚温暖**',

    'zhenhuan_late': '你像后期的甄嬛，完成了从少女到女王的蜕变。你的**理性思维极强**（0.95），能够冷静分析复杂局势，从全局角度制定长远计划。你的**情绪稳定性大幅提升**（敏感度降至0.35），不再轻易被情感左右，能够在关键时刻隐藏真实想法。你拥有**强大的野心**（0.88），清楚自己想要什么，敢于为了目标而布局谋划。但你也放下了曾经的理想主义（降至0.40），变得更加务实，学会了**战略性地掩饰真实想法**（真实度降至0.35）。你懂得何时隐忍、何时出击，在看似无解的困局中找到突破口。\n\n**关键词：理性谋划、情绪掌控、战略野心**',

    'anlingrong': '你像安陵容，内心**极度敏感而脆弱**（0.92），对外界的评价异常在意。你渴望被看见、被认可、被爱，却又害怕被辜负、被抛弃。你的自我价值感很大程度上依赖于他人的反馈，因此容易陷入自我怀疑的漩涡。你**不太擅长社交**（0.25），内向且不善于主动表达，这让你在关系中常常处于被动。你仍保有**一定的理想主义**（0.65），向往美好但又被现实打击。你有**一定的野心**（0.55），想要向上爬，但理性（0.60）又让你在道德与欲望之间挣扎，这种内在冲突让你倍感痛苦。\n\n**关键词：极度敏感、自我怀疑、渴望认可**',

    'queen': '你像皇后，是**理性与秩序的化身**。你拥有**满分的理性思维**（1.00），是宫廷权谋的冷静中枢，能够构建完整的计划体系，从不遗漏任何细节。你的**情绪控制力极强**（敏感度仅0.20），几乎不被情感左右，能够在最危机的时刻保持冷静。你的**野心强烈而持久**（0.95），对权力的渴望让你可以长期隐忍、精心筹划。但你**极度内向**（社交0.15），更擅长幕后操控而非台前表演。你几乎**从不展露真实想法**（真实度0.10），习惯于深度伪装，这让你在权力斗争中占尽优势，却也让你陷入深深的孤独。\n\n**关键词：极致理性、权谋掌控、深藏不露**',

    'huafei': '你像华妃，是**情绪与能量的代言人**。你拥有**极强的社交能量**（0.95），是人群中的焦点，热情洋溢、充满感染力。你**极度真实坦率**（0.95），从不掩饰自己的爱恨喜怒，这种直球性格让人感到强烈的真诚。你的**野心不小**（0.78），清楚自己想要什么，敢于直接争取。你的情绪虽有波动（敏感0.45），但并非不稳定，而是选择了真实表达而非刻意隐藏。你**相对理性不高**（0.40），更多凭直觉和情感做决策，也因此在权谋斗争中略显劣势。你的**理想主义较低**（0.30），更相信实力和地位，这让你显得功利但也更现实。\n\n**关键词：外向张扬、真实坦率、热情直接**',

    'shenmeizhuang': '你像沈眉庄，外表温婉柔和，内心却坚韧如钢。你**情绪稳定、自尊自重**（敏感0.35），不轻易被外界干扰，能够在困境中保持冷静。你拥有**极强的理想主义与道德感**（0.85），重情重义、坚守原则，宁可自己受委屈也不愿违背良心。你有**一定的理性判断力**（0.65），既有情感的温度，也有冷静的头脑。但你**不善于社交**（0.30），更倾向于真诚而深度的关系。你的**野心不强**（0.40），不追求权势，只求守住自己的一方天地。你的**真实表达较为克制**（0.60），不轻易展露内心情感，这让你显得有些疏离。\n\n**关键词：外柔内刚、道德自律、情绪稳定**',

    'huanbi': '你像浣碧，务实果断、目标明确。你有着**极强的野心与执行力**（0.90），敢于直接争取自己想要的东西，是典型的行动派。你的**理性思维较强**（0.70），务实而冷静，知道如何在现实中为自己争取最大利益。你**懂得隐忍和伪装**（真实度0.45），知道什么该说、什么该藏。你的**情绪管理能力不错**（敏感0.50），能够克制冲动、冷静应对。但你的**理想主义一般**（0.50），更重视现实利益而非虚无的情怀，这让你在道德与野心之间容易产生冲突。你的**社交能力适中**（0.40），不张扬也不孤僻。\n\n**关键词：野心勃勃、务实果断、执行力强**',

    'supeisheng': '你像苏培盛，情商极高、八面玲珑。你拥有**很强的社交能力**（0.85）和**较高的敏感度**（0.65），善于察言观色，能够准确捕捉他人的需求和情绪，在不同的人和场合之间切换自如。你的**理性适中**（0.55），既懂人情世故又不失灵活务实。但你的**野心不强**（0.30），不追求权力的顶峰，只求安稳和圆满。你**懂得适度伪装**（真实度0.35），知道在什么场合展现什么样的自己。你的**理想主义适中**（0.60），既有一定的原则，也懂得变通。你是团队中不可或缺的润滑剂和协调者，但也可能因过度适应他人而失去自我。\n\n**关键词：情商超高、八面玲珑、忠诚可靠**',

    'guojunwang': '你像果郡王，热情真诚、浪漫自由。你拥有**极致的理想主义情怀**（0.95），相信真情实感，对爱情和自由有着近乎纯粹的追求。你的**社交能量强**（0.85）且**极度真诚坦率**（0.85），自然而然地散发温暖，这不是表演而是真实自我的流露。你**情感丰富而敏感**（0.70），能够深刻感受情感的美好与痛苦。但你的**理性很低**（0.30），直觉和情感主导着你的决策，可能忽视现实的复杂性。你的**野心不强**（0.45），不在乎功名利禄，这份洒脱让你自由，但也让你在需要争取时显得软弱。\n\n**关键词：浪漫理想、真诚热情、自由洒脱**',

    'wentaiyi': '你像温太医，温柔理性、富有同理心。你**情感细腻**（敏感0.75），能够深刻感受他人的痛苦，拥有**极致的理想主义**（0.95）和对美好人性的信仰。你**极度真诚坦率**（0.85），不擅长伪装和算计，这让你保持了内心的纯粹。你**内向沉静**（社交0.35），不喜欢权力场上的争斗，更倾向于在安静中发挥专业价值。但你的**理性很低**（0.30），可能忽视人性的阴暗面，在残酷的现实中容易受伤。你的**野心极低**（0.10），随遇而安，不追求高位和权势，这让你在需要自我保护时显得软弱和被动。\n\n**关键词：温柔疗愈、理想纯粹、与世无争**',

    'emperor': '你像皇上，冷静理性、掌控全局。你拥有**极致的理性思维**（0.95）和**满分的野心**（1.00），能够看到他人看不到的大局和趋势，习惯站在高处俯瞰全局，掌控一切才能让你安心。你的**情绪控制力很强**（敏感0.30），几乎不被情绪左右，一切以结果和效率为导向。你有**适度的社交威严**（0.60），更多是理性的权威而非感性的魅力。但你**极少展露真实想法**（真实度0.20），习惯于深度掩饰。你的**理想主义很低**（0.30），相信理想需要服从于现实，这让你显得冷酷但也更务实。\n\n**关键词：极致理性、权力至上、统筹掌控**',

    'ningguiren': '你像宁贵人，深藏不露、城府极深。你拥有**极强的理性与策略思维**（0.85），善于长期潜伏、等待时机，能够观察和分析复杂局势。你的**野心不小**（0.75），但懂得隐藏锋芒，用表面的温和掩饰内心的计算。你的**情绪表达极度克制**（真实度0.15），几乎从不让人看穿真实想法，这让你在权谋斗争中占据优势。你**倾向于独自行动**（社交0.35），不喜欢过多的社交曝光，认为低调才是最好的保护。你的**敏感度适中**（0.55），能够观察局势但不会被情绪左右。你的**理想主义较低**（0.40），一切以目标为导向。\n\n**关键词：深藏不露、策略潜伏、隐形强者**',
  };

  return descriptions[characterId] || '';
}
