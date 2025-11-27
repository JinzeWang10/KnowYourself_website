/**
 * Zootopia: 疯狂动物城人格测评
 *
 * 基于《疯狂动物城》中的8位核心角色为原型
 * 通过五维度模型评估用户的人格特征
 */

import type { QuizTemplate } from '@/types/quiz';

// 五大心理维度定义（双极模型）
export const ZOOTOPIA_DIMENSIONS = {
  trust: '社会信任度',        // 对他人和社会的信任与合作意愿（低=警惕怀疑 ↔ 高=信任开放）
  lawfulness: '律法遵从度',   // 遵守规则、制度的倾向（低=灵活变通 ↔ 高=严守规则）
  pace: '行动节奏',           // 做事快慢、果断与从容（低=从容慢调 ↔ 高=快速果断）
  extraversion: '社交呈现方式', // 社交行为倾向与表达力（低=内敛低调 ↔ 高=外向张扬）
  idealism: '理想主义指数',   // 重视原则与理想的程度（低=实用主义 ↔ 高=理想主义）
} as const;

// 维度双极标签（用于条形图可视化）
export const ZOOTOPIA_DIMENSION_LABELS = {
  trust: {
    left: '警惕怀疑',
    right: '信任开放'
  },
  lawfulness: {
    left: '灵活变通',
    right: '严守规则'
  },
  pace: {
    left: '从容慢调',
    right: '快速果断'
  },
  extraversion: {
    left: '内敛低调',
    right: '外向张扬'
  },
  idealism: {
    left: '实用主义',
    right: '理想主义'
  }
} as const;

// 8个角色的五维度坐标（0-1范围）
export const CHARACTER_PROFILES = {
  'judy_hopps': {
    name: '朱迪 Judy Hopps',
    emoji: '🐰',
    subtitle: '理想主义的行动派警官',
    scores: {
      trust: 0.80,
      lawfulness: 0.85,
      pace: 0.90,
      extraversion: 0.85,
      idealism: 0.90,
    }
  },
  'nick_wilde': {
    name: '尼克 Nick Wilde',
    emoji: '🦊',
    subtitle: '机智灵活的现实主义者',
    scores: {
      trust: 0.40,
      lawfulness: 0.50,
      pace: 0.75,
      extraversion: 0.60,
      idealism: 0.50,
    }
  },
  'mayor_lionheart': {
    name: '马市长 Mayor Lionheart',
    emoji: '🦁',
    subtitle: '守序理性的城市管理者',
    scores: {
      trust: 0.55,
      lawfulness: 0.90,
      pace: 0.50,
      extraversion: 0.55,
      idealism: 0.45,
    }
  },
  'clawhauser': {
    name: '雪豹警官 Clawhauser',
    emoji: '🐆',
    subtitle: '职业忠诚的稳健执行者',
    scores: {
      trust: 0.45,
      lawfulness: 0.80,
      pace: 0.60,
      extraversion: 0.40,
      idealism: 0.40,
    }
  },
  'flash': {
    name: '闪电 Flash',
    emoji: '🦥',
    subtitle: '慢节奏的乐观社交家',
    scores: {
      trust: 0.90,
      lawfulness: 0.30,
      pace: 0.20,
      extraversion: 0.95,
      idealism: 0.85,
    }
  },
  'mr_big': {
    name: '大先生 Mr. Big',
    emoji: '🐭',
    subtitle: '低调谨慎的策略家',
    scores: {
      trust: 0.15,
      lawfulness: 0.25,
      pace: 0.50,
      extraversion: 0.25,
      idealism: 0.10,
    }
  },
  'gary': {
    name: '盖瑞 Gary',
    emoji: '🐍',
    subtitle: '灵活聪慧的社交高手',
    scores: {
      trust: 0.70,
      lawfulness: 0.55,
      pace: 0.65,
      extraversion: 0.75,
      idealism: 0.70,
    }
  },
  'sheep': {
    name: '夏奇羊 Sheep',
    emoji: '🐏',
    subtitle: '中庸务实的独立思考者',
    scores: {
      trust: 0.35,
      lawfulness: 0.40,
      pace: 0.65,
      extraversion: 0.35,
      idealism: 0.55,
    }
  },
} as const;

// 角色ID到图片文件名的映射（使用优化后的WebP格式）
export const CHARACTER_IMAGE_MAP: Record<string, string> = {
  'judy_hopps': '朱迪.webp',
  'nick_wilde': '尼克.webp',
  'mayor_lionheart': '马市长.webp',
  'clawhauser': '雪豹警官.webp',
  'flash': '闪电.webp',
  'mr_big': '大先生.webp',
  'gary': '盖瑞.webp',
  'sheep': '夏奇羊.webp',
} as const;

// 角色核心特质（用于分享卡片）
export const CHARACTER_CORE_TRAITS: Record<string, string> = {
  'judy_hopps': '你像朱迪一样充满理想和正义感，相信每个人都能通过努力改变世界。你信任他人，严格遵守规则，行动力超强，社交能力出色。你勇于挑战不可能，为了目标全力以赴。你相信公平与正义，愿意为理想付出一切努力。',
  'nick_wilde': '你像尼克一样聪明狡黠、机智灵活，善于在复杂环境中找到生存之道。你对人保持适度的警惕，不会轻易信任他人，但内心依然保留一份善良。你务实而灵活，行动力强，能快速适应变化。你懂得权衡利弊，用理性而非情感做决策。',
  'mayor_lionheart': '你像马市长一样守规矩、理性冷静，做事有条不紊。你高度遵守规则和制度，以秩序和稳定为优先，处理事务沉稳而系统。你对他人保持适度信任，能理性判断形势。你不追求个人风头，更注重实际效果和长远利益。',
  'clawhauser': '你像雪豹警官一样职业忠诚、稳重果敢，有强烈的职业原则和执行力。你严格遵守规则，情绪稳定，适合处理需要精准执行的任务。你内敛低调，不喜欢过多的社交，更倾向于用行动而非言语表达。你务实而谨慎，对人保持一定距离。',
  'flash': '你像闪电一样慢节奏、幽默随性，乐于享受生活。你对人充满信任，社交能力超强，容易吸引他人关注。你保持积极乐观的心态，重视理想和原则。你不喜欢被规则束缚，更喜欢按照自己的节奏生活。你用幽默和温暖感染身边的人。',
  'mr_big': '你像大先生一样小巧精悍、老谋深算，社会经验丰富。你对人高度警惕，几乎不轻易信任他人，只对极少数人敞开心扉。你不遵守常规规则，更相信自己的生存法则。你低调而高效，社交节制，选择性地与人交往。你务实而精明，理想主义几乎为零。',
  'gary': '你像盖瑞一样灵活聪慧、社交能力强，善于权衡规则与现实。你对人保持适度的信任，既不过度怀疑也不盲目相信。你在遵守规则和灵活变通之间找到平衡，行动灵活高效。你社交能力出色，能够轻松处理各种人际关系。你追求中庸的理想，现实与理想兼顾。',
  'sheep': '你像夏奇羊一样中庸理性、勤恳务实，行事稳健。你对人保持警惕，不轻易信任他人，更相信自己的判断。你不是严格的规则遵守者，更倾向于灵活应对。你行动节奏适中，执行力稳定。你社交表现中庸，不张扬也不过分内敛。你追求适度的理想，更注重现实可行。',
} as const;

// 角色详细特质（用于结果页面详细解读）
export const CHARACTER_DETAILED_TRAITS: Record<string, {
  advantages: string[];
  risks: string[];
}> = {
  'judy_hopps': {
    advantages: [
      '超强行动力：你像朱迪一样，一旦确定目标就会立即行动，不畏艰难，勇于尝试新事物，这让你在工作和生活中充满冲劲和活力',
      '高度信任与合作：你对他人抱有信任，乐于与人合作，这让你容易建立良好的人际关系，获得他人的支持和帮助',
      '理想主义驱动：你追求公平与正义，有强烈的道德感和使命感，这份理想主义让你在困境中依然坚持初心，成为他人的榜样'
    ],
    risks: [
      '过度理想化：你容易对人对事抱有过高期待，当现实与理想差距过大时，会感到深深的失望和挫败，需要学会接受不完美',
      '冲动决策风险：你的高行动力有时会让你在未充分思考时就做出决定，可能忽略细节或潜在风险，导致不必要的麻烦',
      '易被利用：你的高信任度让你容易相信他人，在复杂的人际关系中可能被狡猾的人利用，需要提升警觉性和边界感'
    ]
  },
  'nick_wilde': {
    advantages: [
      '机智应变能力：你善于观察局势，快速找到问题的解决方案，在复杂的人际关系和工作环境中游刃有余',
      '社交灵活性：你懂得根据不同情况调整自己的表达方式，能与各种类型的人相处，这让你在职场和生活中如鱼得水',
      '现实主义智慧：你不会被理想蒙蔽双眼，能够看清现实，做出务实的选择，这让你避免了很多不必要的风险'
    ],
    risks: [
      '信任障碍：你对他人的信任度较低，可能因过度警惕而错失真诚的友谊和合作机会，长期来看可能让你感到孤独',
      '理想主义欠缺：你过于务实可能让你失去追求更高目标的动力，有时会在"够用就好"的心态中停滞不前',
      '行动风险：你的快速决策和行动力虽然有效，但有时可能因为过于追求效率而忽略长期影响'
    ]
  },
  'mayor_lionheart': {
    advantages: [
      '高度守规有序：你严格遵守规则和制度，做事有条不紊，这让你在组织管理和执行任务时表现出色，值得信赖',
      '冷静理性决策：你善于统筹全局，能够在复杂情况下保持冷静，做出理性的判断和决策，避免情绪化的失误',
      '适度信任平衡：你对他人的信任度适中，既不过度怀疑也不盲目相信，能够合理评估风险和机会'
    ],
    risks: [
      '行动节奏慢：你过于注重计划和稳妥，可能在需要快速决策时错失良机，在快节奏的环境中可能显得反应迟缓',
      '灵活性不足：你过于依赖规则和既定流程，面对突发情况或创新需求时可能缺乏应变能力',
      '社交亲近感弱：你的中庸社交风格虽然不会得罪人，但也难以建立深层的情感连接，可能让你在团队中显得疏离'
    ]
  },
  'clawhauser': {
    advantages: [
      '高度职业忠诚：你秉公执法、严格遵守职业规范，这让你在需要原则和纪律的环境中表现出色，赢得他人尊重',
      '情绪稳定可靠：你情绪稳定，不易受外界干扰，适合处理紧急事件和高压任务，是团队中的稳定力量',
      '稳步推进能力：你行动节奏适中，能够稳步推进任务，不急不躁，确保每一步都扎实可靠'
    ],
    risks: [
      '社交能力受限：你的内敛低调可能让你在需要沟通协调的场合表现不佳，难以建立广泛的人际网络',
      '创新能力欠缺：你的理想主义不足，可能缺乏对新想法和创新的追求，容易陷入"按部就班"的工作模式',
      '信任度低：你对他人的信任度较低，可能造成团队协作中的隔阂，影响团队凝聚力'
    ]
  },
  'flash': {
    advantages: [
      '超强社交魅力：你外向张扬，幽默风趣，容易成为人群中的焦点，能够轻松建立广泛的人际关系',
      '高度信任开放：你对人充满信任，乐于帮助他人，这让你成为朋友们眼中温暖可靠的存在',
      '理想主义乐观：你保持积极心态，重视理想和原则，即使在困境中也能保持希望，感染身边的人'
    ],
    risks: [
      '效率极低：你的慢节奏可能让你在需要快速响应的工作和生活场景中表现不佳，容易错过时机或拖累团队',
      '规则意识弱：你不喜欢被规则束缚，可能在需要遵守制度的环境中引发误解或冲突',
      '过度乐观风险：你对人对事过于信任和乐观，可能忽略潜在风险，在复杂情况下容易受伤或被利用'
    ]
  },
  'mr_big': {
    advantages: [
      '策略布局能力：你善于谋划，能够在复杂环境中制定长远策略，保护自己和家人的利益',
      '低调谨慎：你不张扬不炫耀，懂得隐藏实力，在需要的时候才出手，这让你在竞争中占据优势',
      '选择性信任：你对人的信任极度谨慎，虽然社交圈小，但都是经过时间考验的可靠关系'
    ],
    risks: [
      '严重信任障碍：你对他人几乎不信任，可能让你长期处于孤立状态，难以体验真诚的人际温暖',
      '规则游离风险：你不遵守常规规则，可能在法律和道德的边缘游走，存在越界的风险',
      '理想主义缺失：你过于务实和精明，缺乏对美好事物的追求，可能让生活失去更高层次的意义和幸福感'
    ]
  },
  'gary': {
    advantages: [
      '出色社交能力：你善于处理人际关系，能够轻松应对各种社交场合，建立广泛而深入的人脉网络',
      '灵活应变：你能够快速适应环境变化，在规则和现实之间找到最佳平衡点，这让你在职场和生活中游刃有余',
      '中庸平衡智慧：你的理想主义适中，既追求美好又脚踏实地，能够在现实与理想之间找到可行的路径'
    ],
    risks: [
      '过度戒备：你虽然信任度适中，但可能因为过多权衡而保持过多戒心，错失一些真诚的机会',
      '决策犹豫：你追求平衡和权衡，有时可能在需要果断决策时显得犹豫不决，错失最佳时机',
      '影响力受限：你虽然社交能力强，但不够极致张扬，可能在需要强大个人影响力的场合表现不够突出'
    ]
  },
  'sheep': {
    advantages: [
      '稳定执行力：你行动节奏适中，能够稳定地推进任务，不急不躁，确保工作质量',
      '避免冲突：你社交表现中庸，不张扬也不过分内敛，能够在团队中保持和谐，避免不必要的冲突',
      '现实可行性：你的理想主义适中，能够在追求目标时保持现实性，制定可行的计划'
    ],
    risks: [
      '信任度低：你对人保持警惕，可能因过度保守而错失合作机会，难以建立深层的信任关系',
      '缺乏激情：你的行动力虽然稳定，但缺乏激情和冲劲，可能在需要突破和创新的场合显得被动',
      '存在感弱：你的中庸社交和不够张扬的个性，可能让你在团队中难以引起关注，影响个人发展'
    ]
  },
} as const;

// 题目列表
const questions: QuizTemplate['questions'] = [
  // Q1-Q20: 强迫选择题
  {
    id: 'zootopia_q1',
    type: 'scale',
    question: '你在街上散步时看到朱迪正劝说一只乱扔垃圾的小动物，此时你的反应是？',
    options: [
      {
        value: 1,
        label: '主动上前支持朱迪，一起劝说',
        scores: { lawfulness: 0.15, trust: 0.10 }
      },
      {
        value: 2,
        label: '观察情况，不插手',
        scores: { pace: -0.05 }
      },
      {
        value: 3,
        label: '拍照发社交平台提醒大家',
        scores: { extraversion: 0.12, idealism: 0.05 }
      },
      {
        value: 4,
        label: '偷偷把垃圾捡起来，但不说话',
        scores: { lawfulness: 0.10 }
      },
      {
        value: 5,
        label: '笑着离开，不理会',
        scores: { trust: -0.05 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q2',
    type: 'scale',
    question: '和尼克搭档执勤时，你们抓住一个试图占小便宜的狐狸。你倾向于如何处理？',
    options: [
      {
        value: 1,
        label: '立即按规定处罚',
        scores: { lawfulness: 0.15, pace: 0.10 }
      },
      {
        value: 2,
        label: '先口头警告，看他态度',
        scores: { trust: 0.12, lawfulness: 0.08 }
      },
      {
        value: 3,
        label: '问尼克的意见，让他决定',
        scores: { extraversion: -0.05, trust: 0.10 }
      },
      {
        value: 4,
        label: '讲个笑话让气氛轻松点，再教育他',
        scores: { extraversion: 0.15 }
      },
      {
        value: 5,
        label: '睁一只眼闭一只眼，小事化了',
        scores: { lawfulness: -0.10, idealism: -0.08 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q3',
    type: 'scale',
    question: '马市长委派你策划一场市政活动，你的工作方式更可能是？',
    options: [
      {
        value: 1,
        label: '严格按照规定安排活动',
        scores: { lawfulness: 0.18, extraversion: 0.12 }
      },
      {
        value: 2,
        label: '私下策划确保顺利完成',
        scores: { pace: 0.15, idealism: 0.08 }
      },
      {
        value: 3,
        label: '观察民众反应，灵活调整',
        scores: { trust: 0.10, pace: 0.10 }
      },
      {
        value: 4,
        label: '安排趣味节目让大家开心',
        scores: { extraversion: 0.15 }
      },
      {
        value: 5,
        label: '利用活动为自己宣传',
        scores: { idealism: -0.12, extraversion: 0.08 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q4',
    type: 'scale',
    question: '闪电因为办事太慢被旁边的动物嘲笑，你恰好在场，你会？',
    options: [
      {
        value: 1,
        label: '上前制止嘲笑者，这样不尊重',
        scores: { lawfulness: 0.15, idealism: 0.10 }
      },
      {
        value: 2,
        label: '安慰闪电说每个人节奏不同',
        scores: { trust: 0.15, extraversion: 0.08 }
      },
      {
        value: 3,
        label: '帮闪电把事情做完',
        scores: { pace: 0.15, trust: 0.10 }
      },
      {
        value: 4,
        label: '开个玩笑把话题岔开',
        scores: { extraversion: 0.15 }
      },
      {
        value: 5,
        label: '装作没看见，避免尴尬',
        scores: { extraversion: -0.08, trust: -0.05 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q5',
    type: 'scale',
    question: '在疯狂动物城图书馆，你发现借阅的书被前一位读者严重损坏，而管理员没注意到。你会？',
    options: [
      {
        value: 1,
        label: '主动告知管理员，要求追责',
        scores: { lawfulness: 0.15, idealism: 0.10 }
      },
      {
        value: 2,
        label: '悄悄换一本完好的',
        scores: { pace: 0.12 }
      },
      {
        value: 3,
        label: '拍照发朋友圈吐槽',
        scores: { extraversion: 0.12 }
      },
      {
        value: 4,
        label: '自己修补好再还',
        scores: { trust: 0.10, lawfulness: 0.08 }
      },
      {
        value: 5,
        label: '不管，反正不是我弄的',
        scores: { trust: -0.08, lawfulness: -0.05 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q6',
    type: 'scale',
    question: '雪豹警官正在帮一只小动物找回走失的宠物，你路过时看到这一幕。你会？',
    options: [
      {
        value: 1,
        label: '立刻加入搜索队伍',
        scores: { trust: 0.15, pace: 0.12 }
      },
      {
        value: 2,
        label: '询问情况，提供线索或建议',
        scores: { trust: 0.12, extraversion: 0.10 }
      },
      {
        value: 3,
        label: '拍照发到社区群帮忙扩散',
        scores: { extraversion: 0.12, idealism: 0.08 }
      },
      {
        value: 4,
        label: '说句"加油"然后继续赶路',
        scores: { pace: 0.08 }
      },
      {
        value: 5,
        label: '走开，警察会处理的',
        scores: { trust: -0.08, pace: 0.05 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q7',
    type: 'scale',
    question: '在警局茶水间，你无意中发现尼克在偷偷做一些违规的小交易。你的第一反应是？',
    options: [
      {
        value: 1,
        label: '当场严肃指出，要求他停止',
        scores: { lawfulness: 0.18, pace: 0.12 }
      },
      {
        value: 2,
        label: '私下找他谈，了解情况',
        scores: { trust: 0.15, extraversion: 0.08 }
      },
      {
        value: 3,
        label: '向上级报告这件事',
        scores: { lawfulness: 0.15, idealism: 0.10 }
      },
      {
        value: 4,
        label: '装作没看见，不想惹麻烦',
        scores: { lawfulness: -0.10, trust: -0.05 }
      },
      {
        value: 5,
        label: '我也要参与其中分一杯羹',
        scores: { lawfulness: -0.12, trust: -0.05, extraversion: 0.04 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q8',
    type: 'scale',
    question: '开出租车时，你发现闪电在后座睡着了，马上就要到站。此时你会？',
    options: [
      {
        value: 1,
        label: '温柔地叫醒他"先生，到地方了"',
        scores: { trust: 0.15, extraversion: 0.08 }
      },
      {
        value: 2,
        label: '直接按喇叭或拍座椅叫醒',
        scores: { pace: 0.15 }
      },
      {
        value: 3,
        label: '开个玩笑"树懒先生，该下车啦"',
        scores: { extraversion: 0.15 }
      },
      {
        value: 4,
        label: '继续往前开，等他醒了再折返',
        scores: { trust: 0.10, pace: -0.10 }
      },
      {
        value: 5,
        label: '停表熄火，自己也休息等他醒',
        scores: { pace: -0.12, lawfulness: 0.08 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q9',
    type: 'scale',
    question: '朱迪和尼克在健身房为训练方法争论不休，作为教练的你会怎么介入？',
    options: [
      {
        value: 1,
        label: '立即制止，告诉他们标准做法',
        scores: { lawfulness: 0.15, pace: 0.10 }
      },
      {
        value: 2,
        label: '让他们各自尝试，用效果说话',
        scores: { idealism: 0.12, trust: 0.08 }
      },
      {
        value: 3,
        label: '加入讨论，分享自己的经验',
        scores: { extraversion: 0.15 }
      },
      {
        value: 4,
        label: '开个玩笑"你俩这是要打起来吗"',
        scores: { extraversion: 0.12 }
      },
      {
        value: 5,
        label: '不管他们，爱怎么练怎么练',
        scores: { lawfulness: -0.08, trust: -0.05 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q10',
    type: 'scale',
    question: '你的室友（大先生的侄子）总在深夜弹钢琴，已经严重影响你休息。你会？',
    options: [
      {
        value: 1,
        label: '第二天严肃地提出抗议',
        scores: { pace: 0.15, lawfulness: 0.10 }
      },
      {
        value: 2,
        label: '写纸条贴在门上委婉提醒',
        scores: { extraversion: -0.05, lawfulness: 0.08 }
      },
      {
        value: 3,
        label: '买副耳塞忍着',
        scores: { trust: 0.08, pace: -0.08 }
      },
      {
        value: 4,
        label: '在群聊里发段子暗示',
        scores: { extraversion: 0.12 }
      },
      {
        value: 5,
        label: '也在深夜放音乐回敬',
        scores: { idealism: -0.10, lawfulness: -0.08 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q11',
    type: 'scale',
    question: '你住的楼下有人长期违规停车，挡住了消防通道。面对这种情况，你会？',
    options: [
      {
        value: 1,
        label: '直接找车主严肃交涉',
        scores: { lawfulness: 0.15, pace: 0.12 }
      },
      {
        value: 2,
        label: '拍照向物业或交警投诉',
        scores: { lawfulness: 0.12, idealism: 0.08 }
      },
      {
        value: 3,
        label: '在业主群里发消息提醒',
        scores: { extraversion: 0.12, lawfulness: 0.08 }
      },
      {
        value: 4,
        label: '贴个幽默纸条"消防车过不去啦"',
        scores: { extraversion: 0.15 }
      },
      {
        value: 5,
        label: '算了，反正也不常出事',
        scores: { lawfulness: -0.10, trust: -0.08 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q12',
    type: 'scale',
    question: '协助马市长组织的摄影比赛中，你意外发现有参赛者使用AI作弊。此时你会？',
    options: [
      {
        value: 1,
        label: '立即取消该选手资格',
        scores: { lawfulness: 0.18, pace: 0.12 }
      },
      {
        value: 2,
        label: '私下提醒他主动退赛',
        scores: { lawfulness: 0.12, trust: 0.10 }
      },
      {
        value: 3,
        label: '向组委会汇报，让他们决定',
        scores: { lawfulness: 0.15, pace: 0.08 }
      },
      {
        value: 4,
        label: '睁一只眼闭一只眼，比赛重在参与',
        scores: { lawfulness: -0.10, idealism: -0.08 }
      },
      {
        value: 5,
        label: '发到群里让大家评评理',
        scores: { extraversion: 0.15, idealism: 0.08 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q13',
    type: 'scale',
    question: '和雪豹警官搭档时，你注意到他在执行任务中犯了一个可能导致危险的错误。你会？',
    options: [
      {
        value: 1,
        label: '立即大声提醒制止',
        scores: { pace: 0.18, lawfulness: 0.12 }
      },
      {
        value: 2,
        label: '私下委婉指出错误',
        scores: { trust: 0.15, extraversion: 0.05 }
      },
      {
        value: 3,
        label: '自己默默补救，不让他难堪',
        scores: { trust: 0.12, pace: 0.10 }
      },
      {
        value: 4,
        label: '事后向上级汇报这个隐患',
        scores: { lawfulness: 0.15, idealism: 0.08 }
      },
      {
        value: 5,
        label: '相信他的经验，不多管',
        scores: { trust: 0.10, lawfulness: -0.05 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q14',
    type: 'scale',
    question: '项目截止日临近，但闪电完成任务的速度依然慢得出奇。你的选择是？',
    options: [
      {
        value: 1,
        label: '自己接手快速完成',
        scores: { pace: 0.18, trust: -0.05 }
      },
      {
        value: 2,
        label: '继续耐心等他做完',
        scores: { trust: 0.15, pace: -0.10 }
      },
      {
        value: 3,
        label: '提供帮助加快进度',
        scores: { trust: 0.12, pace: 0.10 }
      },
      {
        value: 4,
        label: '催促并设定明确时间节点',
        scores: { pace: 0.15, lawfulness: 0.08 }
      },
      {
        value: 5,
        label: '向上级申请延期',
        scores: { lawfulness: 0.10, idealism: 0.08 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q15',
    type: 'scale',
    question: '朱迪邀请你周末参加"动物城马拉松"，但你本来计划宅家休息。你会？',
    options: [
      {
        value: 1,
        label: '立刻答应，调整自己计划',
        scores: { pace: 0.15, trust: 0.10 }
      },
      {
        value: 2,
        label: '婉拒，保持自己节奏',
        scores: { pace: -0.05 }
      },
      {
        value: 3,
        label: '说考虑考虑，其实不想去',
        scores: { trust: -0.08 }
      },
      {
        value: 4,
        label: '反邀她来家里玩游戏',
        scores: { extraversion: 0.10 }
      },
      {
        value: 5,
        label: '答应陪她但只走一半',
        scores: { idealism: -0.05, pace: 0.08 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q16',
    type: 'scale',
    question: '公园里有只小兔子不小心掉进了水池，夏奇羊二话不说跳下去救起了他。你在旁边看到后？',
    options: [
      {
        value: 1,
        label: '上前帮忙照顾受惊的小兔子',
        scores: { trust: 0.15, pace: 0.10 }
      },
      {
        value: 2,
        label: '大声夸赞夏奇羊的勇敢',
        scores: { extraversion: 0.15, idealism: 0.08 }
      },
      {
        value: 3,
        label: '递毛巾或外套给夏奇羊',
        scores: { trust: 0.12, pace: 0.10 }
      },
      {
        value: 4,
        label: '拍照记录这个英雄瞬间',
        scores: { extraversion: 0.12 }
      },
      {
        value: 5,
        label: '心里感慨一下就离开了',
        scores: { extraversion: -0.05 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q17',
    type: 'scale',
    question: '朱迪最近为了破案连续加班好几天，精神状态很差。作为朋友，你会？',
    options: [
      {
        value: 1,
        label: '主动提出帮她分担案件工作',
        scores: { trust: 0.15, pace: 0.12 }
      },
      {
        value: 2,
        label: '送吃的喝的，陪她聊天放松',
        scores: { trust: 0.12, extraversion: 0.10 }
      },
      {
        value: 3,
        label: '建议她先休息，别累坏身体',
        scores: { trust: 0.10, idealism: 0.08 }
      },
      {
        value: 4,
        label: '给她打气"你一定能破案"',
        scores: { idealism: 0.12, extraversion: 0.08 }
      },
      {
        value: 5,
        label: '等她忙完再联系',
        scores: { trust: -0.05, pace: -0.05 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q18',
    type: 'scale',
    question: '你偶然得知好友尼克最近又开始做一些"灰色地带"的小生意。你打算？',
    options: [
      {
        value: 1,
        label: '严肃警告他这样不行',
        scores: { lawfulness: 0.18, pace: 0.10 }
      },
      {
        value: 2,
        label: '了解情况，分析风险劝他停手',
        scores: { trust: 0.15, idealism: 0.08 }
      },
      {
        value: 3,
        label: '理解他的难处，但保持距离',
        scores: { trust: 0.08, lawfulness: 0.05 }
      },
      {
        value: 4,
        label: '只要不伤害别人，随他去吧',
        scores: { lawfulness: -0.08, idealism: -0.05 }
      },
      {
        value: 5,
        label: '帮他想合法的赚钱办法',
        scores: { trust: 0.15, idealism: 0.12 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q19',
    type: 'scale',
    question: '街头发生了一起口角，朱迪和尼克正在调解。路过的你会？',
    options: [
      {
        value: 1,
        label: '上前帮忙一起调解',
        scores: { trust: 0.15, pace: 0.12 }
      },
      {
        value: 2,
        label: '站在旁边以防万一',
        scores: { trust: 0.10, pace: 0.08 }
      },
      {
        value: 3,
        label: '录视频留存证据',
        scores: { lawfulness: 0.10, pace: 0.08 }
      },
      {
        value: 4,
        label: '问一句"需要帮忙吗"再决定',
        scores: { extraversion: 0.12, trust: 0.08 }
      },
      {
        value: 5,
        label: '绕道走，别卷入麻烦',
        scores: { trust: -0.08, pace: 0.05 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q20',
    type: 'scale',
    question: '夏奇羊自发在社区组织了一场公益清洁活动，你恰好看到招募信息。你的反应是？',
    options: [
      {
        value: 1,
        label: '主动加入',
        scores: { trust: 0.15, pace: 0.10 }
      },
      {
        value: 2,
        label: '赞赏但不参与',
        scores: { extraversion: 0.08 }
      },
      {
        value: 3,
        label: '提出改进建议',
        scores: { idealism: 0.10 }
      },
      {
        value: 4,
        label: '拍照记录',
        scores: { extraversion: 0.12 }
      },
      {
        value: 5,
        label: '无动于衷',
        scores: { trust: -0.08 }
      }
    ],
    required: true
  },
  // Q21-Q25: 锚点量表题（李克特量表）
  {
    id: 'zootopia_q21',
    type: 'likert',
    question: '我倾向于严格遵守规则和制度',
    dimension: 'lawfulness',
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
    id: 'zootopia_q22',
    type: 'likert',
    question: '我相信大多数人都是值得信任的',
    dimension: 'trust',
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
    id: 'zootopia_q23',
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
    id: 'zootopia_q24',
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
    id: 'zootopia_q25',
    type: 'likert',
    question: '我重视原则和理想，即使有时不利于自己',
    dimension: 'idealism',
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
  const dimensions = ['trust', 'lawfulness', 'pace', 'extraversion', 'idealism'] as const;

  // 阶段1: 维度得分累加（Raw Score Accumulation）
  const rawScores: Record<string, number> = {
    trust: 0,
    lawfulness: 0,
    pace: 0,
    extraversion: 0,
    idealism: 0,
  };

  // 处理强迫选择题（Q1-Q20）
  questions.slice(0, 20).forEach((q) => {
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
  questions.slice(20, 25).forEach((q) => {
    const answer = answers[q.id];
    if (answer && q.type === 'likert' && q.dimension) {
      // 将1-5分转换为0-1范围
      anchorScores[q.dimension] = (Number(answer) - 1) / 4;
    }
  });

  // 计算最大可能得分（用于归一化）
  const maxPossibleScores: Record<string, number> = {
    trust: 0,
    lawfulness: 0,
    pace: 0,
    extraversion: 0,
    idealism: 0,
  };

  questions.slice(0, 20).forEach((q) => {
    if (q.type === 'scale' && q.options) {
      q.options.forEach((opt) => {
        if (opt.scores) {
          Object.entries(opt.scores).forEach(([dim, score]) => {
            if (typeof score === 'number' && score > 0) {
              maxPossibleScores[dim] = (maxPossibleScores[dim] || 0) + score;
            }
          });
        }
      });
    }
  });

  // 阶段3: 混合校准（Hybrid Calibration）
  const alpha = 0.65; // 强迫选择题权重
  const beta = 0.35;  // 锚点量表权重

  const calibratedScores: Record<string, number> = {};
  dimensions.forEach((dim) => {
    const relativeScore = maxPossibleScores[dim] > 0
      ? Math.max(0, Math.min(1, rawScores[dim] / maxPossibleScores[dim]))
      : 0;
    const anchorScore = anchorScores[dim] || 0.5;
    calibratedScores[dim] = alpha * relativeScore + beta * anchorScore;
  });

  // 阶段4: 混合相似度匹配（Hybrid Similarity）
  const characterMatches = Object.entries(CHARACTER_PROFILES).map(([id, profile]) => {
    // 计算余弦相似度
    let dotProduct = 0;
    let userMagnitude = 0;
    let characterMagnitude = 0;

    dimensions.forEach((dim) => {
      const userScore = calibratedScores[dim];
      const charScore = profile.scores[dim];
      dotProduct += userScore * charScore;
      userMagnitude += userScore * userScore;
      characterMagnitude += charScore * charScore;
    });

    const cosineSimilarity = dotProduct / (Math.sqrt(userMagnitude) * Math.sqrt(characterMagnitude));

    // 计算欧氏距离
    let squaredDifference = 0;
    dimensions.forEach((dim) => {
      const diff = calibratedScores[dim] - profile.scores[dim];
      squaredDifference += diff * diff;
    });
    const euclideanDistance = Math.sqrt(squaredDifference) / Math.sqrt(dimensions.length);

    // 混合相似度（余弦0.7 + 欧氏0.3）
    const hybridSimilarity = 0.7 * cosineSimilarity + 0.3 * (1 - euclideanDistance);

    return {
      characterId: id,
      similarity: hybridSimilarity,
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
  purpose: '通过25道题目（20道情景选择题 + 5道人格锚点题），从社会信任度、律法遵从度、行动节奏、社交呈现方式、理想主义指数等5个维度，判断你最接近哪种"动物城人格"',
  duration: '6-8分钟',
  questionCount: 25,

  dimensions: [
    {
      id: 'trust',
      name: ZOOTOPIA_DIMENSIONS.trust,
      description: '对他人和社会的信任与合作意愿（低=警惕怀疑 ↔ 高=信任开放）',
      questionIds: []
    },
    {
      id: 'lawfulness',
      name: ZOOTOPIA_DIMENSIONS.lawfulness,
      description: '遵守规则、制度的倾向（低=灵活变通 ↔ 高=严守规则）',
      questionIds: []
    },
    {
      id: 'pace',
      name: ZOOTOPIA_DIMENSIONS.pace,
      description: '做事快慢、果断与从容（低=从容慢调 ↔ 高=快速果断）',
      questionIds: []
    },
    {
      id: 'extraversion',
      name: ZOOTOPIA_DIMENSIONS.extraversion,
      description: '社交行为倾向与表达力（低=内敛低调 ↔ 高=外向张扬）',
      questionIds: []
    },
    {
      id: 'idealism',
      name: ZOOTOPIA_DIMENSIONS.idealism,
      description: '重视原则与理想的程度（低=实用主义 ↔ 高=理想主义）',
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
