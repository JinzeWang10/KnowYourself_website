/**
 * Zootopia: 疯狂动物城人格测评
 *
 * 基于《疯狂动物城》中的8位核心角色为原型
 * 通过五维度模型评估用户的人格特征
 */

import type { QuizTemplate } from '@/types/quiz';

// 四大心理维度定义（双极模型）
export const ZOOTOPIA_DIMENSIONS = {
  pace: '行动速度',           // 处理任务的速度、反应节奏、行动倾向（低=慢条斯理 ↔ 高=高速执行）
  orderliness: '秩序偏好',    // 对规则、规范、流程的接受度与依赖程度（低=随性灵活 ↔ 高=自律严谨）
  sincerity: '真诚指数',      // 动机透明度、表达方式、言行一致程度（低=策略圆滑 ↔ 高=坦率透明）
  extraversion: '外向呈现',   // 社交场合中的表达方式、存在感与能量来源（低=内向克制 ↔ 高=外向张扬）
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
  }
} as const;

// 8个角色的四维度坐标（0-1范围）
export const CHARACTER_PROFILES = {
  'judy_hopps': {
    name: '朱迪 Judy Hopps',
    emoji: '🐰',
    subtitle: '理想驱动的高速行动派',
    scores: {
      pace: 0.95,
      orderliness: 0.85,
      sincerity: 0.80,
      extraversion: 0.80,
    }
  },
  'nick_wilde': {
    name: '尼克 Nick Wilde',
    emoji: '🦊',
    subtitle: '机智灵活的游刃派谈判者',
    scores: {
      pace: 0.75,
      orderliness: 0.20,
      sincerity: 0.30,
      extraversion: 0.55,
    }
  },
  'mayor_lionheart': {
    name: '马市长 Lionheart',
    emoji: '🦁',
    subtitle: '威仪十足的秩序守护者',
    scores: {
      pace: 0.55,
      orderliness: 0.90,
      sincerity: 0.55,
      extraversion: 0.65,
    }
  },
  'clawhauser': {
    name: '豹子警官 Clawhauser',
    emoji: '🐆',
    subtitle: '热情外向的温暖社交家',
    scores: {
      pace: 0.60,
      orderliness: 0.80,
      sincerity: 0.75,
      extraversion: 0.90,
    }
  },
  'flash': {
    name: '闪电 Flash',
    emoji: '🦥',
    subtitle: '敏感温和的慢节奏观察者',
    scores: {
      pace: 0.00,
      orderliness: 0.30,
      sincerity: 0.85,
      extraversion: 0.20,
    }
  },
  'mr_big': {
    name: '大先生 Mr. Big',
    emoji: '🐭',
    subtitle: '沉静稳重的战略掌控者',
    scores: {
      pace: 0.40,
      orderliness: 0.10,
      sincerity: 0.40,
      extraversion: 0.10,
    }
  },
  'gary': {
    name: '盖瑞 Gary',
    emoji: '🐍',
    subtitle: '灵活稳健的情境型执行者',
    scores: {
      pace: 0.65,
      orderliness: 0.55,
      sincerity: 0.60,
      extraversion: 0.75,
    }
  },
  'sheep': {
    name: '夏奇羊 Gazelle',
    emoji: '🐏',
    subtitle: '魅力四射的公众偶像',
    scores: {
      pace: 0.70,
      orderliness: 0.60,
      sincerity: 0.85,
      extraversion: 0.95,
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
  'judy_hopps': '你像朱迪一样，内心怀着强烈的理想主义，相信只要努力便能突破环境限制、实现自我价值。你行动迅速，执行力强，对规则和原则保持高度尊重，同时又拥有积极的社交能量，让你在团队中总是格外亮眼。你乐观、真诚、朝气十足，是那种能点亮现场氛围、也能推动团队前进的人。你对公平和正义有天然敏感度，更愿意主动改变不合理的现状，而不是被动接受。',
  'nick_wilde': '你像尼克一样拥有敏锐的洞察力、超强的情境判断与灵活变通能力。你不按常规出牌，懂得根据局势调整策略，是天生的"社会导航高手"。你擅长观察人性，也擅长用幽默化解尴尬，让你在人际场合总能保持游刃有余。你不喜欢僵硬的规则，更倾向以智慧和机敏突破障碍。虽然你看似随性，但骨子里却有自己坚持的价值线，只是选择更隐蔽、更柔软的表达方式。',
  'mayor_lionheart': '你像马市长一样稳重、有权威感，关注整体秩序与结构性的长远发展。你擅长规划，也愿意承担责任，是那种在压力时刻依旧能稳住情绪、带领团队的人。你对规则与制度保持尊重，同时具备一定的理想主义，希望通过组织、制度与领导力推动世界更好地运作。你的外向气场适中，不张扬却能让人感到可靠，是团队中的定心丸。',
  'clawhauser': '你像雪豹警官一样亲切、热情、真诚，是社交场合中能迅速让氛围变轻松的人。你的外向特质明显，发自内心喜欢帮助他人，为团队带来积极能量。虽然你对规则保持尊重，但你并非僵硬执行者，而是带着温度的秩序维持者。你情绪透明、表达自然，不会刻意隐藏自己的喜好，是那种让人放下戒心、快速建立信任的伙伴。',
  'flash': '你像闪电一样步调沉稳、动作缓慢、不被外界急躁节奏影响。你做事谨慎、细致、重视体验胜过速度。你真诚、坦率，很少玩心机；你的表达常常温和，不争不抢，却拥有独特的洞察力——因为你看得比别人更细、更深。你偏内向，享受独处与稳定的环境，在熟悉的人面前却能展现幽默的一面，是人群中"安静但可信赖"的存在。',
  'mr_big': '你像大先生一样低调、冷静、重视掌控节奏，不会被情绪左右。你做事谨慎精准，即便行动不快，却能确保每一步都踏稳。你不喜欢引人注目，但你具备过人的判断力与战略思维，会在最关键的时刻作出决定。你社交上偏内敛，不喜欢流于表面的互动，更注重忠诚、信任与长久关系。你少言，但每句话都带分量。',
  'gary': '你像盖瑞一样执行力强、适应性佳，能在不同角色之间切换自如。你既不像高速行动派那样冲动，也不像慢节奏者那样迟缓，而是用"恰到好处"的速度完成任务。你对规则保持适度尊重，但不会被其限制；你真诚但不失分寸，社交能量稳定又让人感到舒服。你是团队中"可靠又不打扰"的存在，擅长用稳健方式推进目标。',
  'sheep': '你像 Gazelle 一样拥有强烈的舞台魅力和公众影响力，优雅自信，擅长用艺术与情感连接他人。你兼具亲和力与专业性，既能在聚光灯下展现光彩，也能以柔和的方式影响周围人。你重视信念与表达，不喜欢被条条框框束缚，善于运用个人魅力推动社会话题或情感共鸣。你是那种能用温度和力量同时打动别人的人。',
} as const;

// 角色详细特质（用于结果页面详细解读）
export const CHARACTER_DETAILED_TRAITS: Record<string, {
  advantages: string[];
  risks: string[];
}> = {
  'judy_hopps': {
    advantages: [
      '行动迅捷果断：你不拖延、不犹豫，总能第一时间把计划落实，让进度保持高速推进',
      '价值观稳定真诚：你坚持原则，坦率表达，是别人眼中可靠、可信任的伙伴',
      '高度社交亲和力：你善于沟通、热情积极，能快速建立关系并激励周围的人'
    ],
    risks: [
      '容易过度投入：你的理想主义可能让你在复杂现实前感到挫败，需要适度留有弹性',
      '速度过快忽略细节：快节奏常让你遗漏风险点，应偶尔放慢步伐审视全局',
      '对人信任度较高：当遇到心机较深的人，你可能需要更谨慎地辨别动机'
    ]
  },
  'nick_wilde': {
    advantages: [
      '策略能力出众：你善于看清局势、灵活应对，总能找到聪明的解决方案',
      '表达风趣自然：你让人如沐春风，是人际沟通中的调节者和"润滑剂"',
      '适应力极强：面对变化你毫不畏惧，能轻松切换节奏与角色'
    ],
    risks: [
      '动机易被误解：你的策略性有时让人难以看透，可能被误判为"不够真诚"',
      '对规则兴趣不高：可能在需要结构化、高纪律的环境中感到束缚',
      '容易隐藏真实感受：过度依赖幽默与机智，可能掩盖需要被正视的情绪'
    ]
  },
  'mayor_lionheart': {
    advantages: [
      '组织与规划能力强：你能统筹资源、洞察全局，擅长做长期布局',
      '稳定的领导气场：你冷静、有担当，关键时刻能给人安全感',
      '原则感明确：你坚持秩序与责任，是团队中值得信赖的中坚力量'
    ],
    risks: [
      '容易承担过多责任：你可能无意识承担超出自己负荷的事务',
      '过度强调秩序：在高度灵活的情境中可能显得不够适应',
      '情绪表达较克制：可能让他人误以为你距离感较强'
    ]
  },
  'clawhauser': {
    advantages: [
      '极高的亲和力：你给人安全、温暖、愉快的感受，人际关系轻松顺畅',
      '真诚而坦率：你几乎不掩饰情绪，让人感到可信、可依赖',
      '乐于支持他人：你愿意贡献情绪能量，是团队气氛的核心来源之一'
    ],
    risks: [
      '容易过度付出：你为了照顾关系可能牺牲自己的需求',
      '情绪外显度高：在严肃或高压场合可能被认为"过于投入"',
      '对冲突较敏感：你可能会回避直接对抗，以避免破坏和谐'
    ]
  },
  'flash': {
    advantages: [
      '极高耐心：你能稳定处理长期任务，不被外界干扰节奏',
      '真诚无负担：你动机透明、表达简单直接，是让人安心的类型',
      '深度观察者：你能捕捉细节，常在关键时刻提出关键见解'
    ],
    risks: [
      '节奏与外界不匹配：在要求快速回应的环境中可能感到压力',
      '表达过于克制：可能让他人无法准确理解你的真实想法',
      '容易被忽视：你不主动争取机会，可能错过应得的资源'
    ]
  },
  'mr_big': {
    advantages: [
      '稳定且果断：你做决定不多，但一旦做出，便坚定执行',
      '高度策略性：你擅长布局，能在复杂局势中保持冷静',
      '社交忠诚度高：你珍惜信任关系，是值得托付的存在'
    ],
    risks: [
      '情绪表达不足：你的冷静可能让他人误以为你疏远或冷漠',
      '社交圈狭窄：你不主动扩展关系，容易形成信息闭环',
      '过度谨慎：可能在关键机会前犹豫太久'
    ]
  },
  'gary': {
    advantages: [
      '节奏平衡良好：你能根据环境调整行动速度，保持效率与稳妥兼具',
      '情绪稳定：你不易被外界影响，面对压力能维持冷静',
      '社交自然温和：你不会刻意讨好，却容易让人产生好感'
    ],
    risks: [
      '容易被低估：你不张扬，可能让别人忽略你的能力与贡献',
      '角色切换过多：在多任务环境中可能一度感到能量被分散',
      '对原则界线不够鲜明：你倾向顾及他人，可能在关键冲突中犹豫'
    ]
  },
  'sheep': {
    advantages: [
      '强大号召力：你能迅速吸引关注并影响群体情绪或观点',
      '情感表达丰富：你擅长以艺术化的方式沟通，容易触动他人的内心',
      '适应公众场域：你在社交与公开场合中游刃有余，能有效把握场面氛围'
    ],
    risks: [
      '过度在意他人期待：公众形象压力可能让你忽视自我需求与界限',
      '对规则反感：你追求表达自由，遇到严格流程或官僚时可能感到受限或抵触',
      '情绪曝光带来脆弱：高度情感化的表达有时会被放大，带来外界评论或误读'
    ]
  },
} as const;

// 题目列表
const questions: QuizTemplate['questions'] = [
  // Q1-Q20: 强迫选择题
  {
    id: 'zootopia_q1',
    type: 'scale',
    question: '你在街上散步时看到朱迪正在劝说一只乱扔垃圾的小动物，你会？',
    options: [
      {
        value: 1,
        label: '主动上前支持朱迪，一起劝说',
        scores: { pace: 0.18, orderliness: 0.20, sincerity: 0.15, extraversion: 0.20 }
      },
      {
        value: 2,
        label: '观察情况，不插手',
        scores: { pace: -0.10, sincerity: -0.05 }
      },
      {
        value: 3,
        label: '拍照发社交平台提醒大家',
        scores: { extraversion: 0.15, orderliness: 0.05 }
      },
      {
        value: 4,
        label: '默默将垃圾捡起来再离开',
        scores: { sincerity: 0.12, orderliness: 0.10 }
      },
      {
        value: 5,
        label: '转头离开，不想管',
        scores: { pace: -0.12, sincerity: -0.10 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q2',
    type: 'scale',
    question: '和尼克搭档执勤，一个小动物试图占小便宜被你们抓住，你会？',
    options: [
      {
        value: 1,
        label: '按规定立即处罚',
        scores: { orderliness: 0.20, pace: 0.15 }
      },
      {
        value: 2,
        label: '先口头提醒，看对方态度',
        scores: { sincerity: 0.10, extraversion: 0.08 }
      },
      {
        value: 3,
        label: '征求尼克意见，让他决定',
        scores: { extraversion: 0.05, pace: -0.08 }
      },
      {
        value: 4,
        label: '用玩笑缓解气氛，再教育',
        scores: { extraversion: 0.15, sincerity: -0.05 }
      },
      {
        value: 5,
        label: '小事化了，不追究',
        scores: { orderliness: -0.12, sincerity: -0.10 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q3',
    type: 'scale',
    question: '马市长交给你一场市政活动，你会如何组织？',
    options: [
      {
        value: 1,
        label: '按制度严格推进',
        scores: { orderliness: 0.18, pace: 0.12 }
      },
      {
        value: 2,
        label: '做详细计划确保顺利完成',
        scores: { orderliness: 0.15, sincerity: 0.05 }
      },
      {
        value: 3,
        label: '按现场反馈灵活微调',
        scores: { pace: 0.05, extraversion: 0.10 }
      },
      {
        value: 4,
        label: '加入欢乐互动环节',
        scores: { extraversion: 0.15 }
      },
      {
        value: 5,
        label: '借机突出自己',
        scores: { sincerity: -0.12, extraversion: 0.08 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q4',
    type: 'scale',
    question: '闪电因做事太慢被嘲笑，你在旁边会？',
    options: [
      {
        value: 1,
        label: '阻止嘲笑者，维护闪电',
        scores: { sincerity: 0.12, extraversion: 0.12 }
      },
      {
        value: 2,
        label: '安抚闪电，告诉他别介意',
        scores: { sincerity: 0.15 }
      },
      {
        value: 3,
        label: '帮闪电把事情做完',
        scores: { pace: 0.15 }
      },
      {
        value: 4,
        label: '用幽默把话题带开',
        scores: { extraversion: 0.15, sincerity: -0.05 }
      },
      {
        value: 5,
        label: '装作没看到',
        scores: { pace: -0.10, sincerity: -0.10 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q5',
    type: 'scale',
    question: '你在图书馆发现借到的书被前一位读者严重损坏，你会？',
    options: [
      {
        value: 1,
        label: '告知管理员查清情况',
        scores: { orderliness: 0.18, sincerity: 0.12 }
      },
      {
        value: 2,
        label: '换一本不破的',
        scores: { sincerity: -0.10 }
      },
      {
        value: 3,
        label: '发朋友圈吐槽',
        scores: { extraversion: 0.15 }
      },
      {
        value: 4,
        label: '自己修补好再还',
        scores: { sincerity: 0.12, pace: -0.05 }
      },
      {
        value: 5,
        label: '不管它',
        scores: { orderliness: -0.12, sincerity: -0.08 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q6',
    type: 'scale',
    question: '你看到雪豹警官在帮一只小动物找走失的宠物，你会？',
    options: [
      {
        value: 1,
        label: '立即加入搜寻',
        scores: { pace: 0.18, extraversion: 0.10 }
      },
      {
        value: 2,
        label: '提供线索或建议',
        scores: { sincerity: 0.10, extraversion: 0.10 }
      },
      {
        value: 3,
        label: '拍照发群寻求扩散',
        scores: { extraversion: 0.15 }
      },
      {
        value: 4,
        label: '鼓励几句后继续赶路',
        scores: { sincerity: -0.05 }
      },
      {
        value: 5,
        label: '快速离开，不参与',
        scores: { pace: -0.05, sincerity: -0.10 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q7',
    type: 'scale',
    question: '在茶水间，你发现尼克似乎在做违规的小动作，你会？',
    options: [
      {
        value: 1,
        label: '直接制止',
        scores: { orderliness: 0.18, sincerity: 0.15 }
      },
      {
        value: 2,
        label: '私下沟通了解情况',
        scores: { sincerity: 0.12 }
      },
      {
        value: 3,
        label: '报告给上级',
        scores: { orderliness: 0.15 }
      },
      {
        value: 4,
        label: '假装没看到',
        scores: { orderliness: -0.12, sincerity: -0.12 }
      },
      {
        value: 5,
        label: '参与分一杯羹',
        scores: { sincerity: -0.15 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q8',
    type: 'scale',
    question: '你开出租车时，闪电在后座睡着了马上到站，你会？',
    options: [
      {
        value: 1,
        label: '轻声叫醒',
        scores: { sincerity: 0.15 }
      },
      {
        value: 2,
        label: '拍座椅或按喇叭',
        scores: { pace: 0.15, sincerity: -0.05 }
      },
      {
        value: 3,
        label: '用玩笑唤醒他',
        scores: { extraversion: 0.15, sincerity: -0.08 }
      },
      {
        value: 4,
        label: '继续开远点等他醒',
        scores: { pace: -0.12 }
      },
      {
        value: 5,
        label: '停车自己也休息',
        scores: { pace: -0.18 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q9',
    type: 'scale',
    question: '在健身房，朱迪和尼克为训练方法争论，你会？',
    options: [
      {
        value: 1,
        label: '直接告诉他们标准做法',
        scores: { orderliness: 0.15, pace: 0.15 }
      },
      {
        value: 2,
        label: '让他们各自尝试',
        scores: { orderliness: -0.05 }
      },
      {
        value: 3,
        label: '加入讨论分享经验',
        scores: { extraversion: 0.15 }
      },
      {
        value: 4,
        label: '嘲笑他们',
        scores: { sincerity: -0.15 }
      },
      {
        value: 5,
        label: '不干涉',
        scores: { orderliness: -0.12 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q10',
    type: 'scale',
    question: '室友深夜弹钢琴影响你休息，你会？',
    options: [
      {
        value: 1,
        label: '正面提出问题',
        scores: { sincerity: 0.12, pace: 0.12 }
      },
      {
        value: 2,
        label: '写纸条提醒',
        scores: { orderliness: 0.08 }
      },
      {
        value: 3,
        label: '买耳塞忍着',
        scores: { pace: -0.10 }
      },
      {
        value: 4,
        label: '在群里暗示',
        scores: { extraversion: 0.12, sincerity: -0.12 }
      },
      {
        value: 5,
        label: '也深夜制造噪音',
        scores: { sincerity: -0.10 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q11',
    type: 'scale',
    question: '有人长期违法停车堵消防通道，你会？',
    options: [
      {
        value: 1,
        label: '直接找车主交涉',
        scores: { pace: 0.18, extraversion: 0.10 }
      },
      {
        value: 2,
        label: '投诉物业或交警',
        scores: { orderliness: 0.18, pace: 0.12 }
      },
      {
        value: 3,
        label: '在业主群提醒',
        scores: { extraversion: 0.15 }
      },
      {
        value: 4,
        label: '贴幽默纸条提醒',
        scores: { extraversion: 0.12 }
      },
      {
        value: 5,
        label: '无视',
        scores: { sincerity: -0.08 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q12',
    type: 'scale',
    question: '摄影比赛中你发现有人使用 AI 作弊，你会？',
    options: [
      {
        value: 1,
        label: '取消资格',
        scores: { orderliness: 0.18, pace: 0.15 }
      },
      {
        value: 2,
        label: '私下劝他退赛',
        scores: { sincerity: 0.10 }
      },
      {
        value: 3,
        label: '上报组委会',
        scores: { orderliness: 0.15 }
      },
      {
        value: 4,
        label: '视而不见',
        scores: { orderliness: -0.15 }
      },
      {
        value: 5,
        label: '发群里公开讨论',
        scores: { extraversion: 0.18 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q13',
    type: 'scale',
    question: '执行任务时，你发现雪豹警官犯了可能导致危险的错误，你会？',
    options: [
      {
        value: 1,
        label: '立即提醒制止',
        scores: { pace: 0.20, sincerity: 0.12 }
      },
      {
        value: 2,
        label: '私下指出',
        scores: { sincerity: 0.10 }
      },
      {
        value: 3,
        label: '等任务结束后复盘',
        scores: { orderliness: 0.08 }
      },
      {
        value: 4,
        label: '自己默默补救',
        scores: { pace: 0.05, sincerity: 0.05 }
      },
      {
        value: 5,
        label: '不提醒',
        scores: { sincerity: -0.12 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q14',
    type: 'scale',
    question: '你在广场看到一只小动物迷路了，你会？',
    options: [
      {
        value: 1,
        label: '带他去找警察',
        scores: { sincerity: 0.15, pace: 0.12 }
      },
      {
        value: 2,
        label: '问清情况后提供建议',
        scores: { sincerity: 0.12 }
      },
      {
        value: 3,
        label: '拍照发群扩散',
        scores: { extraversion: 0.15 }
      },
      {
        value: 4,
        label: '给他指个大概方向',
        scores: { pace: -0.05 }
      },
      {
        value: 5,
        label: '继续路过',
        scores: { sincerity: -0.10 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q15',
    type: 'scale',
    question: '工作中你发现一份关键报告存在错误，你会？',
    options: [
      {
        value: 1,
        label: '立即反馈并要求整改',
        scores: { orderliness: 0.18 }
      },
      {
        value: 2,
        label: '自己默默修好',
        scores: { pace: 0.05 }
      },
      {
        value: 3,
        label: '通知团队大家讨论',
        scores: { extraversion: 0.15 }
      },
      {
        value: 4,
        label: '等别人发现',
        scores: { orderliness: -0.10 }
      },
      {
        value: 5,
        label: '视而不见',
        scores: { sincerity: -0.10 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q16',
    type: 'scale',
    question: '闪电向你借钱但含糊其辞，你会？',
    options: [
      {
        value: 1,
        label: '坦率拒绝',
        scores: { sincerity: 0.12 }
      },
      {
        value: 2,
        label: '问清楚用途再决定',
        scores: { orderliness: 0.10 }
      },
      {
        value: 3,
        label: '还是借给他',
        scores: { sincerity: 0.08 }
      },
      {
        value: 4,
        label: '转移话题装作没听懂',
        scores: { pace: -0.05 }
      },
      {
        value: 5,
        label: '直接忽略',
        scores: { sincerity: -0.12 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q17',
    type: 'scale',
    question: '你参加志愿活动，组织者临时缺人，你会？',
    options: [
      {
        value: 1,
        label: '立即补位',
        scores: { pace: 0.15, extraversion: 0.10 }
      },
      {
        value: 2,
        label: '问清楚要做什么再决定',
        scores: { orderliness: 0.10 }
      },
      {
        value: 3,
        label: '帮忙联系其他志愿者',
        scores: { extraversion: 0.12 }
      },
      {
        value: 4,
        label: '继续做自己的部分',
        scores: { pace: -0.05 }
      },
      {
        value: 5,
        label: '什么也不做',
        scores: { sincerity: -0.10 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q18',
    type: 'scale',
    question: '尼克邀请你参加他的聚会，你其实不太想去，你会？',
    options: [
      {
        value: 1,
        label: '直接拒绝',
        scores: { sincerity: 0.15 }
      },
      {
        value: 2,
        label: '找个借口推掉',
        scores: { sincerity: -0.08 }
      },
      {
        value: 3,
        label: '勉强去一下',
        scores: { extraversion: 0.10 }
      },
      {
        value: 4,
        label: '建议改成别的活动',
        scores: { extraversion: 0.05 }
      },
      {
        value: 5,
        label: '不回复',
        scores: { sincerity: -0.12 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q19',
    type: 'scale',
    question: '你在公交上看到有人插队，你会？',
    options: [
      {
        value: 1,
        label: '直接制止',
        scores: { pace: 0.15 }
      },
      {
        value: 2,
        label: '委婉提醒',
        scores: { sincerity: 0.10 }
      },
      {
        value: 3,
        label: '用玩笑化解',
        scores: { extraversion: 0.12 }
      },
      {
        value: 4,
        label: '拍照吐槽',
        scores: { extraversion: 0.15 }
      },
      {
        value: 5,
        label: '默默忍受',
        scores: { pace: -0.10 }
      }
    ],
    required: true
  },
  {
    id: 'zootopia_q20',
    type: 'scale',
    question: '你和大先生在同个会议上，他明显情绪不佳，你会？',
    options: [
      {
        value: 1,
        label: '主动询问是否需要协助',
        scores: { sincerity: 0.15, extraversion: 0.08 }
      },
      {
        value: 2,
        label: '等他来找你',
        scores: { pace: -0.05 }
      },
      {
        value: 3,
        label: '给他倒一杯水缓和氛围',
        scores: { sincerity: 0.12 }
      },
      {
        value: 4,
        label: '用笑话试图让他放松',
        scores: { extraversion: 0.15 }
      },
      {
        value: 5,
        label: '不干涉',
        scores: { pace: -0.10 }
      }
    ],
    required: true
  },
  // Q21-Q24: 锚点量表题（李克特量表）
  {
    id: 'zootopia_q21',
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
    id: 'zootopia_q22',
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
    id: 'zootopia_q23',
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
    id: 'zootopia_q24',
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
  const dimensions = ['pace', 'orderliness', 'sincerity', 'extraversion'] as const;

  // 阶段1: 维度得分累加（Raw Score Accumulation）
  const rawScores: Record<string, number> = {
    pace: 0,
    orderliness: 0,
    sincerity: 0,
    extraversion: 0,
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
  questions.slice(20, 24).forEach((q) => {
    const answer = answers[q.id];
    if (answer && q.type === 'likert' && q.dimension) {
      // 将1-5分转换为0-1范围
      anchorScores[q.dimension] = (Number(answer) - 1) / 4;
    }
  });

  // 计算最大可能得分（用于归一化）
  const maxPossibleScores: Record<string, number> = {
    pace: 0,
    orderliness: 0,
    sincerity: 0,
    extraversion: 0,
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
  purpose: '通过24道题目（20道情景选择题 + 4道人格锚点题），从行动速度、秩序偏好、真诚指数、外向呈现等4个维度，判断你最接近哪种"动物城人格"',
  duration: '6-8分钟',
  questionCount: 24,

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
