/**
 * INI: Intimacy Needs Index
 * 亲密关系需求程度指数
 *
 * 评估个体在情感上对亲密关系的需求程度
 * 包含5个维度：情感需求、依赖性、孤独感、亲密互动需求、安全感需求
 */

import type { QuizTemplate } from '@/types/quiz';

export const ini: QuizTemplate = {
  id: 'ini',
  title: '亲密关系需求程度指数',
  titleEn: 'Intimacy Needs Index (INI)',
  description: '评估个体在情感上对亲密关系的需求程度，包括情感需求、依赖性、孤独感、亲密互动需求以及安全感需求等方面',
  category: '亲密关系',
  purpose: '通过评估五个核心维度，帮助分析个体在亲密关系中的依赖性和情感渴望',
  duration: '5-7分钟',
  questionCount: 20,

  instructions: '请根据您的实际感受，选择最符合您情况的选项。',

  questions: [
    // ========== 情感需求 (Emotional Need, 4题) ==========
    {
      id: 'q1',
      type: 'scale',
      question: '我觉得自己需要有人在我身边支持和关心。',
      dimension: 'emotional_need',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q2',
      type: 'scale',
      question: '当我感到困惑或痛苦时，我希望有一个人能理解我。',
      dimension: 'emotional_need',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q3',
      type: 'scale',
      question: '我在亲密关系中寻求深层次的情感交流。',
      dimension: 'emotional_need',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q4',
      type: 'scale',
      question: '我常常希望别人能了解我的感受和情绪。',
      dimension: 'emotional_need',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },

    // ========== 依赖性 (Dependency, 4题) ==========
    {
      id: 'q5',
      type: 'scale',
      question: '我在情感上经常依赖我的伴侣或亲密朋友。',
      dimension: 'dependency',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q6',
      type: 'scale',
      question: '在面对挑战时，我更倾向于依赖亲密关系中的另一方来获得安慰。',
      dimension: 'dependency',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q7',
      type: 'scale',
      question: '我很难独自应对生活中的压力，通常需要依靠他人。',
      dimension: 'dependency',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q8',
      type: 'scale',
      question: '我习惯于在亲密关系中寻求帮助和支持。',
      dimension: 'dependency',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },

    // ========== 孤独感 (Loneliness, 4题) ==========
    {
      id: 'q9',
      type: 'scale',
      question: '如果我没有亲密关系，我常常感到孤单。',
      dimension: 'loneliness',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q10',
      type: 'scale',
      question: '在没有亲密伴侣的情况下，我会觉得生活失去了很多色彩。',
      dimension: 'loneliness',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q11',
      type: 'scale',
      question: '我在没有亲密关系时感到情感上的空虚。',
      dimension: 'loneliness',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q12',
      type: 'scale',
      question: '我经常会因为没有人陪伴而感到孤独。',
      dimension: 'loneliness',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },

    // ========== 亲密互动需求 (Intimate Interaction Need, 4题) ==========
    {
      id: 'q13',
      type: 'scale',
      question: '我喜欢与伴侣或亲密朋友保持频繁的身体接触（如拥抱、亲吻、牵手等）。',
      dimension: 'intimate_interaction',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q14',
      type: 'scale',
      question: '我觉得与亲密关系中的人保持亲密互动非常重要。',
      dimension: 'intimate_interaction',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q15',
      type: 'scale',
      question: '我常常渴望与他人分享我的感受，特别是在情感上得到回应。',
      dimension: 'intimate_interaction',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q16',
      type: 'scale',
      question: '我对身体上的亲密接触（如拥抱、亲吻等）有很强的需求。',
      dimension: 'intimate_interaction',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },

    // ========== 安全感需求 (Need for Security, 4题) ==========
    {
      id: 'q17',
      type: 'scale',
      question: '在亲密关系中，我觉得非常需要情感上的安全感。',
      dimension: 'security_need',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q18',
      type: 'scale',
      question: '我希望伴侣或亲密关系中的人能承诺和支持我。',
      dimension: 'security_need',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q19',
      type: 'scale',
      question: '我对亲密关系中的稳定性有很高的需求。',
      dimension: 'security_need',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
    {
      id: 'q20',
      type: 'scale',
      question: '我觉得在亲密关系中得到的安全感对我的心理健康非常重要。',
      dimension: 'security_need',
      options: [
        { value: 5, label: '完全符合' },
        { value: 4, label: '比较符合' },
        { value: 3, label: '一般' },
        { value: 2, label: '不太符合' },
        { value: 1, label: '完全不符合' },
      ],
      required: true,
    },
  ],

  dimensions: [
    {
      id: 'emotional_need',
      name: '情感需求',
      description: '个体在情感上需要他人支持、理解和关心的程度',
      questionIds: ['q1', 'q2', 'q3', 'q4'],
    },
    {
      id: 'dependency',
      name: '依赖性',
      description: '个体在亲密关系中依赖他人获得情感支持的程度',
      questionIds: ['q5', 'q6', 'q7', 'q8'],
    },
    {
      id: 'loneliness',
      name: '孤独感',
      description: '缺乏亲密关系时个体感到孤单和空虚的程度',
      questionIds: ['q9', 'q10', 'q11', 'q12'],
    },
    {
      id: 'intimate_interaction',
      name: '亲密互动需求',
      description: '个体渴望与他人保持身体和情感亲密互动的程度',
      questionIds: ['q13', 'q14', 'q15', 'q16'],
    },
    {
      id: 'security_need',
      name: '安全感需求',
      description: '个体在亲密关系中寻求稳定性和情感安全感的程度',
      questionIds: ['q17', 'q18', 'q19', 'q20'],
    },
  ],

  scoring: {
    method: 'sum',
    scaleRange: {
      min: 20,
      max: 100,
      description: '总分范围20-100分，分数越高表示亲密关系需求程度越高',
    },
    ranges: [
      {
        min: 80,
        max: 100,
        level: '极高的亲密关系需求',
        description: '您在亲密关系中有非常强烈的情感需求，往往对亲密关系中的关爱、理解和支持有很高的依赖性。缺乏亲密关系时，情感空虚感和孤独感会变得更加明显，并且您可能非常渴望在关系中得到稳定的安全感。此类个体常常以亲密关系为情感生活的核心。',
        psychologicalTraits: '情感依赖性强，较为焦虑，容易对伴侣产生过度的依赖感。',
        color: '#ef4444',
        suggestions: [
          '建议培养情感独立性，寻找健康的情感调节策略，例如通过个人爱好、社交网络或心理疏导来缓解情感压力',
          '保持亲密关系中的良好沟通，避免情感依赖带来的负面影响',
          '学习独立应对情绪问题，减少对伴侣的过度依赖',
        ],
      },
      {
        min: 70,
        max: 79,
        level: '高亲密关系需求',
        description: '您在情感上对亲密关系有较高的需求，虽然不如极高需求群体那样完全依赖关系，但在面对压力和情感困扰时，仍然倾向于寻求亲密关系中的支持。孤独感和情感空虚感可能较为明显，尤其在关系质量欠佳时，情感上容易感到不安。',
        psychologicalTraits: '在压力大或情感受挫时，对伴侣的依赖性较高，可能会出现焦虑或过度依赖的情形。',
        color: '#f97316',
        suggestions: [
          '努力提升自我情感调节能力，尝试建立更为独立的情感支撑系统（如朋友、兴趣小组等）',
          '避免情感完全寄托在亲密关系上，增加情感自信',
          '提升关系中的沟通技巧，建立更健康的互动模式',
        ],
      },
      {
        min: 60,
        max: 69,
        level: '中等亲密关系需求',
        description: '您对亲密关系的需求适中，能够独立处理大多数情感问题，但在需要关怀、支持或陪伴时，仍然会渴望亲密关系的情感满足。孤独感较低，但情感支持的需求依然存在。',
        psychologicalTraits: '在情感需求上相对平衡，但在情绪波动时可能会渴望更多的亲密互动和支持。对关系的依赖性较低。',
        color: '#fbbf24',
        suggestions: [
          '保持独立的情感支持系统，同时加强情感调节能力',
          '在亲密关系中保持开放和有效的沟通',
          '通过不断培养个人的情感韧性，减少对关系的过度依赖',
        ],
      },
      {
        min: 50,
        max: 59,
        level: '较低的亲密关系需求',
        description: '您对亲密关系的需求较低，较少依赖亲密关系中的他人来获得情感支持和安慰。此类个体可能更倾向于保持独立，享受与他人之间的互动，但不会过度依赖。',
        psychologicalTraits: '情感上较为独立，情感需求较少表现出焦虑或强烈依赖。',
        color: '#84cc16',
        suggestions: [
          '虽然情感独立性较强，但仍需注意情感孤立的风险',
          '通过与他人的健康互动来避免情感上的疏远或孤独感',
          '适时参与社交活动，保持一定的亲密互动',
        ],
      },
      {
        min: 40,
        max: 49,
        level: '较低的亲密关系需求，偶尔依赖',
        description: '您对亲密关系的需求很低，通常能独立应对情感问题，但偶尔会渴望在情感上得到关怀和支持。亲密关系对您来说并非生活的核心，可能更注重个人成长和独立性。',
        psychologicalTraits: '偏向独立，较少表现出情感依赖。亲密关系的存在感不强。',
        color: '#22c55e',
        suggestions: [
          '在情感上保持独立性的同时，可以通过增加与他人的互动',
          '增强生活中的情感支持和社交互动',
          '避免长期孤立和情感空虚',
        ],
      },
      {
        min: 30,
        max: 39,
        level: '极低的亲密关系需求',
        description: '您对亲密关系几乎没有需求，可能在情感上非常独立，甚至回避亲密关系中的依赖。此类个体可能较为自给自足，较少渴望亲密互动或情感支持。',
        psychologicalTraits: '情感上完全独立或回避亲密关系。可能存在情感隔离或社交回避的情形。',
        color: '#06b6d4',
        suggestions: [
          '注意情感孤立可能带来的负面影响',
          '可以通过建立更多的社会联系和情感交流，平衡生活中的情感需求与独立性',
          '避免情感上的空虚和孤独感',
        ],
      },
      {
        min: 20,
        max: 29,
        level: '极度回避亲密关系需求',
        description: '您在情感上几乎完全回避亲密关系，极少渴望与他人产生深入的情感联系。可能在亲密关系中的依赖性非常低，甚至避免情感上的依赖。',
        psychologicalTraits: '情感孤立，回避亲密互动，可能有较强的自我保护心理。',
        color: '#3b82f6',
        suggestions: [
          '注意长期回避亲密关系可能导致的情感空虚和社交疏远',
          '适当寻求心理辅导，探索情感依赖与独立的平衡',
          '尝试在关系中建立更为健康的互动',
        ],
      },
    ],
  },

  references: [
    {
      title: '依恋理论（Attachment Theory）',
      content: '依恋理论是由英国精神分析学家约翰·鲍尔比（John Bowlby）在20世纪50年代提出的，是理解个体对亲密关系需求的重要理论框架。该理论认为,早期的依恋经验会影响个体一生的情感模式和人际关系质量。依恋类型（如焦虑型、回避型、安全型）对个体在情感和亲密关系中的需求和依赖性具有决定性影响。INI量表中的"情感需求"、"依赖性"、"孤独感"维度直接反映了不同依恋类型个体在亲密关系中的行为模式和情感体验。\n\n参考文献：Bowlby, J. (1988). A Secure Base: Parent-Child Attachment and Healthy Human Development. Basic Books. | Ainsworth, M. D. S., et al. (1978). Patterns of Attachment. Lawrence Erlbaum. | Bartholomew, K., & Horowitz, L. M. (1991). Attachment styles among young adults. Journal of Personality and Social Psychology, 61(2), 226-244.',
    },
    {
      title: '成人依恋理论（Adult Attachment Theory）',
      content: '成人依恋理论由辛迪·哈赞（Cindy Hazan）和菲利普·夏沃（Phillip Shaver）在1987年提出，将鲍尔比的依恋理论应用于成人浪漫关系中。研究发现，成人在恋爱关系中的行为模式与儿童对照顾者的依恋模式高度相似。成人的浪漫关系本质上是一种依恋关系，伴侣之间寻求情感联结、安全基地和避风港。INI量表的"依赖性"和"安全感需求"维度直接测量个体在成人亲密关系中的情感依赖程度和对关系稳定性的需求。\n\n参考文献：Hazan, C., & Shaver, P. (1987). Romantic love conceptualized as an attachment process. Journal of Personality and Social Psychology, 52(3), 511-524. | Brennan, K. A., et al. (1998). Self-report measurement of adult attachment. Guilford Press.',
    },
    {
      title: '孤独感理论（Loneliness Theory）',
      content: '孤独感是个体对社会联结缺失的主观感受，由丹尼尔·罗素（Daniel Russell）、莱蒂西亚·佩普劳（Letitia Peplau）等学者系统研究。孤独感理论区分了社交孤独（缺乏社交网络）和情感孤独（缺乏亲密情感联结）。情感孤独源于缺乏深层次的亲密关系，对个体的心理健康影响更为深远。孤独感强的个体对亲密关系有更高的渴望，缺乏亲密关系会导致情感空虚、抑郁和焦虑等负面情绪。INI量表的"孤独感"维度专门评估个体在缺乏亲密关系时的情感空虚和孤独体验。\n\n参考文献：Russell, D., Peplau, L. A., & Cutrona, C. E. (1980). The revised UCLA Loneliness Scale. Journal of Personality and Social Psychology, 39(3), 472-480. | Weiss, R. S. (1973). Loneliness: The Experience of Emotional and Social Isolation. MIT Press. | Cacioppo, J. T., & Patrick, W. (2008). Loneliness: Human Nature and the Need for Social Connection. W. W. Norton.',
    },
    {
      title: '亲密关系过程理论（Intimacy Process Theory）',
      content: '由哈里·雷斯（Harry Reis）和菲利普·夏沃（Phillip Shaver）提出的亲密关系过程理论，强调亲密感是通过人际互动过程产生的，包括自我揭露、伴侣回应和感知到的理解。亲密感不是静态的特质，而是通过持续的互动过程动态产生的。个体对亲密互动的需求包括情感分享、身体接触、深层对话等，这些互动是维持亲密关系的重要纽带。INI量表的"亲密互动需求"维度测量个体对情感分享、身体接触等亲密互动行为的渴望程度。\n\n参考文献：Reis, H. T., & Shaver, P. (1988). Intimacy as an interpersonal process. Handbook of Personal Relationships, 367-389. | Reis, H. T., et al. (2004). Perceived partner responsiveness. Handbook of Closeness and Intimacy, 201-225.',
    },
    {
      title: '自我决定理论（Self-Determination Theory）',
      content: '由爱德华·德西（Edward Deci）和理查德·瑞安（Richard Ryan）提出的自我决定理论认为，人类有三种基本心理需求：自主性、胜任感和关系需求（relatedness）。人类有与他人建立亲密、有意义的情感联结的内在需求。满足关系需求能够促进心理健康和幸福感。不同个体对关系需求的强度存在差异，长期的关系需求挫败会导致心理困扰。INI量表整体评估个体的关系需求强度，特别是"情感需求"和"安全感需求"维度。\n\n参考文献：Deci, E. L., & Ryan, R. M. (2000). The "what" and "why" of goal pursuits. Psychological Inquiry, 11(4), 227-268. | Ryan, R. M., & Deci, E. L. (2017). Self-Determination Theory. Guilford Press.',
    },
    {
      title: '依恋需求与情感调节理论',
      content: '依恋系统不仅影响个体的关系模式，还与情感调节能力密切相关。安全依恋的个体通常具有更好的情感调节能力，而不安全依恋（焦虑型和回避型）的个体在情感调节上存在困难。亲密关系可以作为个体的情感调节资源。焦虑型依恋个体倾向于通过寻求他人的安慰来调节负面情绪（超度激活策略），而回避型个体则压抑情绪、回避寻求支持（去激活策略）。INI量表的"依赖性"和"安全感需求"维度反映了个体在情感调节中对他人支持的依赖程度。\n\n参考文献：Mikulincer, M., & Shaver, P. R. (2007). Attachment in Adulthood: Structure, Dynamics, and Change. Guilford Press. | Cassidy, J. (1994). Emotion regulation. Monographs of the Society for Research in Child Development, 59(2-3), 228-249.',
    },
    {
      title: '社会支持理论（Social Support Theory）',
      content: '社会支持理论强调，个体从社会关系中获得的情感、信息和工具支持对心理健康至关重要。亲密关系是社会支持的核心来源。情感支持（如关怀、理解、认可）是亲密关系中最重要的支持类型，能够缓冲压力、提升幸福感。个体对社会支持的需求存在差异，高亲密关系需求的个体更倾向于主动寻求社会支持。INI量表的"情感需求"和"依赖性"维度测量个体对亲密关系中情感支持的需求和依赖程度。\n\n参考文献：Cohen, S., & Wills, T. A. (1985). Stress, social support, and the buffering hypothesis. Psychological Bulletin, 98(2), 310-357. | Sarason, I. G., et al. (1990). Social support: The search for theory. Journal of Social and Clinical Psychology, 9(1), 133-147.',
    },
  ],
};
