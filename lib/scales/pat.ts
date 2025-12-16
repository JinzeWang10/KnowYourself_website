import type { QuizTemplate } from '@/types/quiz';

/**
 * 心理年龄测试（Psychological Age Test, PAT）
 *
 * 目的：评估个体在情绪、自我认知、人际关系、责任意识、自我成长等方面的心理成熟度
 *
 * 结构：6个维度，共40道题，5点Likert量表
 * - 维度A：情绪成熟度（Emotional Maturity）- 7题
 * - 维度B：自我认知与自我接纳（Self-Awareness & Acceptance）- 6题
 * - 维度C：社会责任与人际成熟（Social Responsibility & Interpersonal Maturity）- 7题
 * - 维度D：自我控制与意志力（Self-Control & Discipline）- 6题
 * - 维度E：自我成长与目标感（Personal Growth & Purpose）- 7题
 * - 维度F：共情与亲密能力（Empathy & Intimacy）- 7题
 *
 * 理论基础：
 * - Erikson 的心理社会发展阶段理论
 * - Greenberger & Sorensen (1974) 的心理成熟度模型
 * - Bar-On (1997) 的情绪智力理论（EQ）
 * - Robitschek (1998) 的自我成长模型
 * - Kernberg (2004) 的人格整合与成熟理论
 */

export const pat: QuizTemplate = {
  id: 'pat',
  title: '心理年龄测试',
  titleEn: 'Psychological Age Test (PAT)',
  description: '评估你的心理成熟度，了解你的"心理年龄"是否与实际年龄相匹配',
  category: '心理成熟度评估',
  purpose: '评估个体在情绪、自我认知、人际关系、责任意识、自我成长等方面的心理成熟度，帮助你了解自己的"心理年龄"是否与实际年龄相匹配，是提前成熟、恰到好处，还是仍在成长中。',
  duration: '10-15分钟',
  questionCount: 40,

  questions: [
    // ========== 维度A：情绪成熟度（Emotional Maturity）7题 ==========
    {
      id: 'pat_1',
      type: 'likert',
      question: '我能够控制自己的情绪，而不是被情绪支配。',
      dimension: 'emotional_maturity',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_2',
      type: 'likert',
      question: '当我生气时，我很难冷静下来，容易冲动行事。',
      dimension: 'emotional_maturity',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_3',
      type: 'likert',
      question: '我能接受事情并不总是按我的意愿发展。',
      dimension: 'emotional_maturity',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_4',
      type: 'likert',
      question: '在冲突中，我更倾向于发泄情绪，而不是沟通解决。',
      dimension: 'emotional_maturity',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_5',
      type: 'likert',
      question: '遇到失败时，我需要很长时间才能从负面情绪中走出来。',
      dimension: 'emotional_maturity',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_6',
      type: 'likert',
      question: '我很少让情绪影响到我的判断。',
      dimension: 'emotional_maturity',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_7',
      type: 'likert',
      question: '面对批评时，我会立刻防御或反击。',
      dimension: 'emotional_maturity',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },

    // ========== 维度B：自我认知与自我接纳（Self-Awareness & Acceptance）6题 ==========
    {
      id: 'pat_8',
      type: 'likert',
      question: '我能清楚地了解自己的优点与缺点。',
      dimension: 'self_awareness',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_9',
      type: 'likert',
      question: '我知道自己想要成为什么样的人。',
      dimension: 'self_awareness',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_10',
      type: 'likert',
      question: '我很难接受自己的不完美，经常自我否定。',
      dimension: 'self_awareness',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_11',
      type: 'likert',
      question: '我会反思自己的行为并尝试改进。',
      dimension: 'self_awareness',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_12',
      type: 'likert',
      question: '我不太愿意承认自己的错误。',
      dimension: 'self_awareness',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_13',
      type: 'likert',
      question: '我很少花时间思考自己真正的内心需求。',
      dimension: 'self_awareness',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },

    // ========== 维度C：社会责任与人际成熟（Social Responsibility & Interpersonal Maturity）7题 ==========
    {
      id: 'pat_14',
      type: 'likert',
      question: '我在团队中能承担自己的责任。',
      dimension: 'social_maturity',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_15',
      type: 'likert',
      question: '我会考虑他人的感受和立场。',
      dimension: 'social_maturity',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_16',
      type: 'likert',
      question: '我很难尊重那些与我意见不同的人。',
      dimension: 'social_maturity',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_17',
      type: 'likert',
      question: '我在与人相处时能保持平等与尊重。',
      dimension: 'social_maturity',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_18',
      type: 'likert',
      question: '我理解人际关系需要相互的付出与包容。',
      dimension: 'social_maturity',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_19',
      type: 'likert',
      question: '我觉得原谅他人的错误很难，容易长期记恨。',
      dimension: 'social_maturity',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_20',
      type: 'likert',
      question: '如果帮助别人会给我带来不便，我通常不会去做。',
      dimension: 'social_maturity',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },

    // ========== 维度D：自我控制与意志力（Self-Control & Discipline）6题 ==========
    {
      id: 'pat_21',
      type: 'likert',
      question: '我能够坚持完成计划好的事情。',
      dimension: 'self_control',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_22',
      type: 'likert',
      question: '面对诱惑时，我很难保持理性。',
      dimension: 'self_control',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_23',
      type: 'likert',
      question: '当事情变得困难时，我很容易放弃。',
      dimension: 'self_control',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_24',
      type: 'likert',
      question: '我在面对压力时能保持冷静并找到解决办法。',
      dimension: 'self_control',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_25',
      type: 'likert',
      question: '我经常被冲动情绪支配做出决定。',
      dimension: 'self_control',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_26',
      type: 'likert',
      question: '我能延迟满足，为了长远目标放弃短期享乐。',
      dimension: 'self_control',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },

    // ========== 维度E：自我成长与目标感（Personal Growth & Purpose）7题 ==========
    {
      id: 'pat_27',
      type: 'likert',
      question: '我对自己的生活目标或方向感到迷茫。',
      dimension: 'personal_growth',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_28',
      type: 'likert',
      question: '我相信自己的人生有意义。',
      dimension: 'personal_growth',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_29',
      type: 'likert',
      question: '我乐于学习新的知识与技能。',
      dimension: 'personal_growth',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_30',
      type: 'likert',
      question: '我很少主动去改善自己的不足。',
      dimension: 'personal_growth',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_31',
      type: 'likert',
      question: '我能够从生活经历中看到成长的机会。',
      dimension: 'personal_growth',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_32',
      type: 'likert',
      question: '我很少为自己设定新的目标。',
      dimension: 'personal_growth',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_33',
      type: 'likert',
      question: '我相信自己能掌控并改变未来。',
      dimension: 'personal_growth',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },

    // ========== 维度F：共情与亲密能力（Empathy & Intimacy）7题 ==========
    {
      id: 'pat_34',
      type: 'likert',
      question: '我能理解他人的情绪，即使他们没有明说。',
      dimension: 'empathy',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_35',
      type: 'likert',
      question: '当别人遇到困难时，我会真诚地关心他们。',
      dimension: 'empathy',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_36',
      type: 'likert',
      question: '我能够与人建立稳定而真诚的关系。',
      dimension: 'empathy',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_37',
      type: 'likert',
      question: '我在关系中能表达感受，也能倾听他人。',
      dimension: 'empathy',
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_38',
      type: 'likert',
      question: '我会害怕与他人产生情感上的亲密。',
      dimension: 'empathy',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_39',
      type: 'likert',
      question: '我很难平衡自己的独立性与他人的需求。',
      dimension: 'empathy',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
    {
      id: 'pat_40',
      type: 'likert',
      question: '我觉得与他人建立真诚连接很困难。',
      dimension: 'empathy',
      reversed: true,
      options: [
        { value: 0, label: '完全不符合' },
        { value: 0.5, label: '较不符合' },
        { value: 1.0, label: '一般' },
        { value: 1.5, label: '较符合' },
        { value: 2.5, label: '非常符合' },
      ],
      required: true,
    },
  ],

  dimensions: [
    {
      id: 'emotional_maturity',
      name: '情绪成熟度',
      description: '情绪控制与稳定性',
      questionIds: ['pat_1', 'pat_2', 'pat_3', 'pat_4', 'pat_5', 'pat_6', 'pat_7'],
      fullDescription: '评估个体管理和调节自身情绪的能力，包括情绪识别、情绪表达、情绪调节和情绪恢复力。情绪成熟的人能够在压力下保持冷静，理性应对挫折，不轻易被情绪左右决策。',
      keyIndicators: ['情绪控制能力', '挫折承受力', '情绪恢复速度', '冲突处理方式', '批评接受能力'],
      scoreRanges: [
        {
          min: 0,
          max: 35,
          level: '情绪控制困难',
          description: '你可能经常被强烈的情绪所困扰，难以有效调节自己的情绪反应。在面对压力、挫折或批评时，容易出现冲动行为或长时间的情绪低落。',
          characteristics: ['情绪波动大，容易被情绪支配', '遇到挫折难以快速恢复', '冲突中倾向于情绪发泄而非理性沟通', '对批评反应敏感，易防御或反击'],
          suggestions: ['练习正念冥想，提升情绪觉察能力', '学习深呼吸等情绪调节技巧', '尝试用"情绪日记"记录和分析自己的情绪模式', '在情绪激动时给自己设置"冷静时间"'],
        },
        {
          min: 36,
          max: 60,
          level: '情绪管理发展中',
          description: '你已经具备一定的情绪管理能力，但在某些情况下仍会被情绪影响。你正在学习如何更好地控制和表达自己的情绪。',
          characteristics: ['大部分时候能控制情绪，但压力大时仍会失控', '正在学习接受不如意的事情', '开始尝试理性沟通，但有时仍会情绪化', '从挫折中恢复需要一些时间'],
          suggestions: ['继续强化情绪调节技巧的练习', '识别触发情绪失控的具体情境', '培养更多应对压力的健康方式', '向情绪管理良好的人学习经验'],
        },
        {
          min: 61,
          max: 80,
          level: '情绪管理良好',
          description: '你拥有较好的情绪管理能力，能够在大多数情况下保持情绪稳定。你懂得如何调节情绪，并能较快从负面情绪中恢复。',
          characteristics: ['能有效控制情绪，很少让情绪影响判断', '接受事情不总如意，调整心态能力强', '冲突中能保持理性沟通', '面对批评能冷静思考而非立即反击'],
          suggestions: ['保持现有的情绪管理习惯', '在极端压力下继续提升情绪稳定性', '可以尝试帮助他人提升情绪管理能力', '探索更深层次的情绪智慧'],
        },
        {
          min: 81,
          max: 100,
          level: '情绪高度成熟',
          description: '你拥有出色的情绪管理能力，即使面对重大压力或挫折也能保持冷静和理性。你的情绪稳定性是你的重要优势。',
          characteristics: ['情绪极其稳定，几乎不被情绪支配', '挫折恢复力强，能迅速调整状态', '善于在冲突中保持理性和建设性', '能够平和接受批评并从中学习'],
          suggestions: ['保持这种优秀的情绪管理能力', '注意不要过度压抑真实情绪', '在帮助他人时分享你的情绪管理智慧', '允许自己偶尔表达脆弱，保持情感的真实性'],
        },
      ],
    },
    {
      id: 'self_awareness',
      name: '自我认知与接纳',
      description: '自我理解与反思能力',
      questionIds: ['pat_8', 'pat_9', 'pat_10', 'pat_11', 'pat_12', 'pat_13'],
      fullDescription: '衡量个体对自身优缺点、价值观、情感需求和人生目标的认知程度，以及接纳自我不完美的能力。高自我认知的人能够客观评价自己，勇于承认错误，持续进行自我反思和成长。',
      keyIndicators: ['自我认识清晰度', '自我接纳程度', '自我反思能力', '认错能力', '内心需求觉察'],
      scoreRanges: [
        {
          min: 0,
          max: 35,
          level: '自我认知模糊',
          description: '你可能对自己缺乏深入了解，难以清晰认识自己的优缺点和内心真实需求。可能存在自我否定倾向或回避自我反思。',
          characteristics: ['对自己的优缺点认识不清', '不确定自己想成为什么样的人', '难以接受自己的不完美，经常自我否定', '不太愿意承认错误', '很少思考内心真正的需求'],
          suggestions: ['尝试写"自我探索日记"，记录对自己的观察', '向信任的朋友询问对你的客观评价', '使用SWOT分析法梳理自己的优劣势', '参加自我认知相关的心理工作坊', '学习接纳自己的不完美，从小事开始'],
        },
        {
          min: 36,
          max: 60,
          level: '自我认知发展中',
          description: '你对自己有一定了解，正在逐步建立更清晰的自我认知。你开始学习接纳自己的不完美，并尝试进行自我反思。',
          characteristics: ['对自己有一定认识，但不够全面', '开始思考人生方向，但仍有些迷茫', '正在学习接纳自己的缺点', '有时能承认错误，有时仍会防御', '偶尔会反思内心需求'],
          suggestions: ['定期进行自我反思，如每周总结', '多尝试新事物，从中发现自己的兴趣和能力', '培养成长型思维，将缺点视为成长空间', '练习坦诚面对自己的错误', '增加独处时间，倾听内心的声音'],
        },
        {
          min: 61,
          max: 80,
          level: '自我认知良好',
          description: '你对自己有较为清晰和全面的认识，能够客观看待自己的优缺点。你具备良好的自我接纳能力和反思习惯。',
          characteristics: ['清楚了解自己的优点与缺点', '知道自己想成为什么样的人', '能够接纳自己的不完美', '会主动反思并尝试改进', '愿意承认错误并从中学习'],
          suggestions: ['继续保持自我反思的习惯', '深化对自己深层需求和价值观的理解', '尝试帮助他人提升自我认知', '探索更深层次的人生意义和目标'],
        },
        {
          min: 81,
          max: 100,
          level: '自我认知卓越',
          description: '你拥有深刻而全面的自我认知，对自己的优缺点、价值观和人生目标都有清晰的认识。你能够真诚接纳自我，持续进行深度反思。',
          characteristics: ['对自我有深刻而全面的认识', '人生目标和方向非常清晰', '完全接纳自己的不完美，自我认同感强', '经常进行深度自我反思', '坦然承认错误，将其视为成长机会'],
          suggestions: ['保持这种深刻的自我认知', '将自我认知的智慧应用于人生各个领域', '可以考虑帮助他人进行自我探索', '持续探索自我的深层潜能'],
        },
      ],
    },
    {
      id: 'social_maturity',
      name: '社会责任与人际成熟',
      description: '社交成熟度与共情能力',
      questionIds: ['pat_14', 'pat_15', 'pat_16', 'pat_17', 'pat_18', 'pat_19', 'pat_20'],
      fullDescription: '评估个体在团队协作、社会责任感、人际交往和冲突解决方面的成熟度。包括承担责任的能力、对他人的尊重和理解、以及建立健康人际关系的能力。',
      keyIndicators: ['责任承担能力', '他人视角理解', '尊重包容度', '人际付出意愿', '宽恕能力'],
      scoreRanges: [
        {
          min: 0,
          max: 35,
          level: '人际成熟度较低',
          description: '你在承担责任、理解他人和建立健康人际关系方面可能存在较大困难。可能更多关注自己的需求，较少考虑他人感受。',
          characteristics: ['团队责任感不强', '较少考虑他人感受和立场', '难以尊重不同意见的人', '人际关系中付出意愿低', '容易记恨，难以原谅他人', '帮助他人时更多考虑自己的便利'],
          suggestions: ['从小事开始培养责任感，如按时完成承诺', '练习"换位思考"，尝试理解他人视角', '学习倾听技巧，真正听懂他人的表达', '参加团队活动，体验合作的价值', '尝试原谅一些小的过错，放下怨恨'],
        },
        {
          min: 36,
          max: 60,
          level: '人际成熟度发展中',
          description: '你在社会责任和人际交往方面正在成长，开始学习如何更好地与他人相处，承担更多责任。',
          characteristics: ['基本能承担自己的责任', '开始考虑他人感受，但不够稳定', '正在学习尊重不同观点', '开始理解人际关系需要付出', '原谅他人有一定难度，但在努力', '有时愿意帮助他人'],
          suggestions: ['主动在团队中承担更多责任', '培养同理心，多从他人角度看问题', '练习接纳不同观点，尊重多样性', '在人际关系中增加主动付出', '学习冲突管理和沟通技巧'],
        },
        {
          min: 61,
          max: 80,
          level: '人际成熟度良好',
          description: '你具备良好的社会责任感和人际交往能力，能够在团队中发挥积极作用，与他人建立健康和谐的关系。',
          characteristics: ['主动承担团队责任', '经常考虑他人感受和立场', '能够尊重不同意见', '在人际关系中保持平等与尊重', '理解关系需要相互付出', '能够原谅他人的错误', '愿意在合理范围内帮助他人'],
          suggestions: ['保持这种良好的人际交往方式', '可以在团队中承担更多领导责任', '帮助他人提升人际交往能力', '深化对复杂人际关系的理解'],
        },
        {
          min: 81,
          max: 100,
          level: '人际成熟度卓越',
          description: '你拥有出色的社会责任感和人际交往能力，能够在各种复杂的社交场合中游刃有余，是团队中值得信赖的成员。',
          characteristics: ['强烈的责任感，主动承担', '深刻理解和尊重他人', '包容不同观点，促进多元对话', '在关系中慷慨付出', '宽容大度，能够真诚原谅', '热心帮助他人，不计个人得失'],
          suggestions: ['保持这种卓越的人际成熟度', '注意平衡付出与自我照顾', '可以在社区或组织中发挥更大影响力', '将人际智慧传递给他人'],
        },
      ],
    },
    {
      id: 'self_control',
      name: '自我控制与意志力',
      description: '自律性与抗挫力',
      questionIds: ['pat_21', 'pat_22', 'pat_23', 'pat_24', 'pat_25', 'pat_26'],
      fullDescription: '衡量个体抵御诱惑、坚持目标、延迟满足和应对压力的能力。自我控制是实现长期目标的关键品质，包括计划执行力、抗干扰能力和韧性。',
      keyIndicators: ['计划执行力', '抗诱惑能力', '抗挫折韧性', '压力应对能力', '延迟满足能力'],
      scoreRanges: [
        {
          min: 0,
          max: 35,
          level: '自控力较弱',
          description: '你可能经常难以坚持计划，容易被诱惑或困难打败。冲动决策和即时满足的倾向较强，这可能影响你实现长期目标。',
          characteristics: ['难以坚持完成计划', '面对诱惑时容易放弃理性', '遇到困难容易放弃', '压力下容易失去冷静', '经常被冲动情绪支配决策', '难以为长远目标延迟满足'],
          suggestions: ['从小目标开始，逐步培养自律习惯', '使用"番茄工作法"等工具提升专注力', '设置环境障碍，减少诱惑', '学习压力管理技巧，如运动、冥想', '练习"延迟5分钟"策略，逐步提升延迟满足能力'],
        },
        {
          min: 36,
          max: 60,
          level: '自控力发展中',
          description: '你的自我控制能力正在发展，在某些方面能够坚持，但在面对强烈诱惑或较大困难时仍可能动摇。',
          characteristics: ['有时能坚持计划，有时会放弃', '对诱惑有一定抵抗力，但不够稳定', '困难时偶尔会放弃，但也有坚持的时候', '压力下能保持一定冷静', '正在学习控制冲动', '开始理解延迟满足的价值'],
          suggestions: ['强化成功坚持的经验，总结规律', '建立问责机制，如找伙伴互相监督', '学习应对诱惑的具体策略', '培养成长型思维，将困难视为挑战', '设定更清晰的长期目标，增强动力'],
        },
        {
          min: 61,
          max: 80,
          level: '自控力良好',
          description: '你拥有较强的自我控制能力，能够坚持完成大多数计划，抵御诱惑，应对压力。你懂得为长远目标做出短期牺牲。',
          characteristics: ['能够坚持完成计划', '面对诱惑时能保持理性', '困难时不轻易放弃', '压力下能保持冷静并寻找解决方案', '较少被冲动情绪支配', '能够为长远目标延迟满足'],
          suggestions: ['保持良好的自律习惯', '在更具挑战性的目标上应用自控力', '帮助他人提升自律能力', '注意平衡自律与放松，避免过度控制'],
        },
        {
          min: 81,
          max: 100,
          level: '自控力卓越',
          description: '你拥有出色的自我控制和意志力，即使面对强烈诱惑或重大困难也能坚持目标。你的自律是实现人生目标的强大保障。',
          characteristics: ['始终能坚持完成计划', '对诱惑有强大的抵抗力', '困难面前展现出强大韧性', '压力下依然冷静理性', '极少冲动决策', '为长远目标能够做出重大牺牲'],
          suggestions: ['保持这种卓越的自控力', '注意不要过度自我要求，给自己适当放松空间', '可以承担更具挑战性的目标', '分享你的自律经验帮助他人'],
        },
      ],
    },
    {
      id: 'personal_growth',
      name: '自我成长与目标感',
      description: '生活方向与自我实现',
      questionIds: ['pat_27', 'pat_28', 'pat_29', 'pat_30', 'pat_31', 'pat_32', 'pat_33'],
      fullDescription: '评估个体对人生目标和意义的认知，以及主动成长和自我提升的动力。包括目标清晰度、学习意愿、成长心态和对未来的掌控感。',
      keyIndicators: ['人生目标清晰度', '人生意义感', '学习成长意愿', '主动改进动力', '成长机会识别', '未来掌控感'],
      scoreRanges: [
        {
          min: 0,
          max: 35,
          level: '成长动力不足',
          description: '你可能对人生目标和方向感到迷茫，缺乏主动成长的动力。可能很少思考人生意义，也较少设定和追求新目标。',
          characteristics: ['对人生目标和方向感到迷茫', '不确定人生是否有意义', '对学习新知识技能兴趣不大', '很少主动改善自己的不足', '难以从经历中看到成长机会', '很少为自己设定新目标', '对未来缺乏掌控感'],
          suggestions: ['尝试探索不同领域，寻找兴趣点', '从小目标开始，体验成长的乐趣', '阅读人生规划相关书籍', '寻找榜样，了解他们的成长历程', '考虑寻求职业规划或人生咨询', '参加不同活动，扩展视野'],
        },
        {
          min: 36,
          max: 60,
          level: '成长意识发展中',
          description: '你对人生目标有一定思考，开始认识到成长的重要性，但动力和方向还不够清晰稳定。',
          characteristics: ['对人生目标有一些想法，但不够清晰', '开始思考人生意义', '对某些领域的学习有兴趣', '偶尔会尝试改善不足', '开始注意到一些成长机会', '有时会设定新目标', '对未来有一定信心，但不够坚定'],
          suggestions: ['花时间深入思考人生目标和价值观', '制定具体可行的成长计划', '培养持续学习的习惯', '记录成长日志，看见自己的进步', '主动寻找和创造成长机会'],
        },
        {
          min: 61,
          max: 80,
          level: '成长动力良好',
          description: '你对人生有较为清晰的目标和方向，相信人生的意义，主动追求成长和自我提升。你具备成长型思维。',
          characteristics: ['人生目标和方向较为清晰', '相信人生有意义', '乐于学习新知识和技能', '主动寻找改善自己的机会', '能从经历中看到成长机会', '经常为自己设定新目标', '相信能够掌控和改变未来'],
          suggestions: ['保持这种积极的成长心态', '将目标分解为更具体的行动计划', '挑战自己，尝试更大的目标', '帮助他人发现成长的意义'],
        },
        {
          min: 81,
          max: 100,
          level: '成长动力卓越',
          description: '你拥有清晰的人生目标和强烈的意义感，持续追求自我成长和实现。你对未来充满信心，是终身学习者的典范。',
          characteristics: ['人生目标非常明确清晰', '对人生意义有深刻理解', '对学习和成长充满热情', '持续主动改善和提升自己', '善于从各种经历中提取成长价值', '不断设定并追求新目标', '对未来充满掌控感和信心'],
          suggestions: ['保持这种卓越的成长心态', '注意平衡成长与享受当下', '可以指导和激励他人成长', '将成长经验系统化，产生更大影响力'],
        },
      ],
    },
    {
      id: 'empathy',
      name: '共情与亲密能力',
      description: '情感理解与关系能力',
      questionIds: ['pat_34', 'pat_35', 'pat_36', 'pat_37', 'pat_38', 'pat_39', 'pat_40'],
      fullDescription: '衡量个体理解他人情绪、建立深度情感连接和维持亲密关系的能力。包括情绪识别、真诚关怀、关系建立、情感表达和亲密容忍度。',
      keyIndicators: ['他人情绪识别', '真诚关怀能力', '稳定关系建立', '情感表达与倾听', '亲密关系接纳', '独立与连接平衡'],
      scoreRanges: [
        {
          min: 0,
          max: 35,
          level: '共情能力较弱',
          description: '你可能在理解他人情绪、建立深度情感连接方面存在困难。可能害怕亲密关系，或难以在关系中表达真实感受。',
          characteristics: ['难以理解他人未明说的情绪', '对他人困难的关心不够真诚', '难以建立稳定真诚的关系', '在关系中表达和倾听都有困难', '害怕情感亲密', '难以平衡独立性与他人需求', '觉得建立真诚连接很困难'],
          suggestions: ['学习情绪识别技巧，观察他人的非言语信号', '练习主动倾听，真正听懂他人的感受', '从安全的关系开始，尝试表达真实感受', '探索亲密恐惧的根源，必要时寻求心理咨询', '阅读关于情商和人际关系的书籍'],
        },
        {
          min: 36,
          max: 60,
          level: '共情能力发展中',
          description: '你具备一定的共情能力，正在学习如何更好地理解他人和建立深度关系。在某些情况下能够共情，但还不够稳定。',
          characteristics: ['有时能理解他人情绪', '开始学习真诚关心他人', '正在尝试建立更稳定的关系', '在关系中的表达和倾听能力在提升', '对亲密关系仍有一些恐惧', '正在学习平衡独立与连接', '建立真诚连接有一定困难'],
          suggestions: ['继续培养共情能力，多换位思考', '在关系中增加真诚的情感表达', '学习健康的依恋模式', '练习脆弱性，允许自己被真正看见', '参加人际关系工作坊或团体咨询'],
        },
        {
          min: 61,
          max: 80,
          level: '共情能力良好',
          description: '你拥有良好的共情能力，能够理解他人情绪，建立稳定真诚的关系。你在情感表达和倾听方面表现良好。',
          characteristics: ['能理解他人未明说的情绪', '真诚关心他人的困难', '能够建立稳定而真诚的关系', '在关系中能很好地表达和倾听', '对亲密关系比较接纳', '能够平衡独立性与他人需求', '能够与他人建立真诚连接'],
          suggestions: ['保持这种良好的共情能力', '在更多关系中应用这种能力', '深化现有的亲密关系', '可以帮助他人提升共情能力'],
        },
        {
          min: 81,
          max: 100,
          level: '共情能力卓越',
          description: '你拥有出色的共情能力，能够深刻理解他人情绪，建立深度的情感连接。你在亲密关系中表现成熟，是值得信赖的倾听者和陪伴者。',
          characteristics: ['深刻理解他人的情绪和需求', '对他人展现真诚而深刻的关怀', '建立的关系稳定、真诚且有深度', '在关系中表达和倾听能力卓越', '拥抱亲密关系，不害怕脆弱', '独立性与连接达到良好平衡', '轻松建立真诚而深刻的连接'],
          suggestions: ['保持这种卓越的共情能力', '注意避免过度共情导致的情绪耗竭', '在关系中继续保持真实和界限', '可以在咨询或助人领域发挥优势'],
        },
      ],
    },
  ],

  scoring: {
    method: 'sum',
    scaleRange: {
      min: 0,
      max: 100,
      description: '总分范围为0-100分，得分越高表示心理成熟度越高',
    },
  },

  references: [
    {
      title: 'Toward a concept of psychological maturity in adolescence',
      authors: 'Greenberger, E., & Sorensen, A.',
      journal: 'Journal of Youth and Adolescence',
      year: 1974,
      volume: '3(4)',
      pages: '329–358',
    },
    {
      title: 'Identity and the Life Cycle',
      authors: 'Erikson, E. H.',
      year: 1959,
      content: 'International Universities Press',
    },
    {
      title: 'The Emotional Quotient Inventory (EQ-i): Technical Manual',
      authors: 'Bar-On, R.',
      year: 1997,
      content: 'Multi-Health Systems',
    },
    {
      title: 'Personal growth initiative: The construct and its measure',
      authors: 'Robitschek, C.',
      journal: 'Measurement and Evaluation in Counseling and Development',
      year: 1998,
      volume: '30(4)',
      pages: '183–198',
    },
    {
      title: 'Object-Relations Theory and Clinical Psychoanalysis',
      authors: 'Kernberg, O. F.',
      year: 2004,
      content: 'Yale University Press',
    },
    {
      title: 'Emotional Intelligence: Why It Can Matter More Than IQ',
      authors: 'Goleman, D.',
      year: 1995,
      content: 'Bantam Books',
    },
  ],

  // 自定义计算函数，支持反向计分和维度加权
  calculateResults: (answers: Record<string, number>) => {
    // 维度权重配置
    const dimensionWeights: Record<string, number> = {
      emotional_maturity: 1.4,  // 情绪成熟度（最重要）
      self_control: 1.2,        // 自我控制
      self_awareness: 1.2,      // 自我认知
      personal_growth: 0.8,     // 自我成长
      social_maturity: 0.7,     // 社会责任
      empathy: 0.7,             // 共情能力
    };

    // 计算各维度得分并归一化
    const dimensionScores: Array<{ dimension: string; score: number; normalized: number }> = [];
    let weightedSum = 0;
    let totalWeights = 0;

    pat.dimensions?.forEach((dimension) => {
      let dimensionScore = 0;
      const weight = dimensionWeights[dimension.id] || 1.0;
      const questionCount = dimension.questionIds.length;
      const maxPossibleScore = questionCount * 2.5; // 每题最高2.5分

      dimension.questionIds.forEach((qid) => {
        const question = pat.questions.find((q) => q.id === qid);
        const answer = answers[qid];

        if (question && answer !== undefined) {
          let score = answer;

          // 反向计分：如果题目标记为 reversed，则反转分数
          if (question.reversed) {
            score = 2.5 - score; // 最大值2.5减去原分数
          }

          dimensionScore += score;
        }
      });

      // 归一化到0-100
      const normalizedScore = (dimensionScore / maxPossibleScore) * 100;

      dimensionScores.push({
        dimension: dimension.id,
        score: dimensionScore,
        normalized: normalizedScore,
      });

      // 加权求和
      weightedSum += normalizedScore * weight;
      totalWeights += weight;
    });

    // 计算加权平均分（0-100）
    const totalScore = Math.round(weightedSum / totalWeights);

    return {
      totalScore,
      dimensionScores,
      interpretation: '请查看心理年龄解读',
      recommendations: undefined,
      metadata: {
        dimensionWeights,
      },
    };
  },
};

/**
 * 计算心理年龄（直接映射）
 * @param score PAT测评总分（0-100分）
 * @returns 心理年龄（10-70岁）
 */
export function calculatePsychologicalAge(score: number): number {
  // 将 0-100 分直接线性映射到 10-70 岁
  // 公式: psychologicalAge = 10 + (score / 100) * 60
  const psychologicalAge = 8 + 60*((score / 100)**2);

  // 四舍五入并确保在 10-70 范围内
  return Math.max(10, Math.min(70, Math.round(psychologicalAge)));
}

/**
 * 根据心理年龄获取年龄段类型
 * @param psychologicalAge 心理年龄
 * @returns 年龄段类型信息
 */
export function getAgeCategory(psychologicalAge: number) {
  if (psychologicalAge >= 10 && psychologicalAge < 17) {
    return {
      range: '10-17岁',
      type: '少年/童真型',
      typeEn: 'Young-at-heart',
    };
  } else if (psychologicalAge >= 17 && psychologicalAge < 22) {
    return {
      range: '17-22岁',
      type: '青春探索型',
      typeEn: 'Free Spirit',
    };
  } else if (psychologicalAge >= 23 && psychologicalAge < 27) {
    return {
      range: '23-27岁',
      type: '初成稳健型',
      typeEn: 'Young Adult',
    };
  } else if (psychologicalAge >= 28 && psychologicalAge < 32) {
    return {
      range: '28-32岁',
      type: '成熟稳定型',
      typeEn: 'Steady & Reliable',
    };
  } else if (psychologicalAge >= 33 && psychologicalAge < 37) {
    return {
      range: '33-37岁',
      type: '成熟掌控型',
      typeEn: 'Seasoned',
    };
  } else if (psychologicalAge >= 38 && psychologicalAge < 53) {
    return {
      range: '38-53岁',
      type: '老灵魂 / 稳重智者',
      typeEn: 'Wise',
    };
  } else {
    return {
      range: '54-70岁',
      type: '资深老成 / 沉稳大师',
      typeEn: 'Sage',
    };
  }
}

/**
 * 根据心理年龄与实际年龄的差值获取解读
 * @param psychologicalAge 心理年龄
 * @param actualAge 实际年龄
 * @returns 解读内容
 */
export function getAgeInterpretation(psychologicalAge: number, actualAge: number) {
  const diff = psychologicalAge - actualAge;
  const ageCategory = getAgeCategory(psychologicalAge);

  if (diff <= -18) {
    // 档位 A：心理年龄显著比实际年轻
    return {
      level: 'A',
      psychologicalAge,
      actualAge,
      diff,
      ageCategory,
      title: '你保有强烈的年轻心态',
      description: '你的心理表现远比实际年龄更像年轻人，好奇心强、敢于冒险、充满探索欲。你对新鲜事物充满热情，情绪反应也更加直接和率真。建议把这种活力视为优势，在尝试新体验的同时，重要决策上多一些规划和思考。',
      color: 'green',
    };
  } else if (diff > -18 && diff <= -6) {
    // 档位 B：明显偏年轻
    return {
      level: 'B',
      psychologicalAge,
      actualAge,
      diff,
      ageCategory,
      title: '你偏向年轻化的心理特征',
      description: '你比同龄人更大胆、好奇，情绪起伏和冒险倾向较强，对社交和新鲜事物特别敏感。这种年轻心态让你充满活力，但有时可能显得不够稳重。建议利用这份好奇心学习新技能，同时学会为长期目标做分解计划，平衡活力与稳健。',
      color: 'blue',
    };
  } else if (diff > -6 && diff <= 8) {
    // 档位 C：与实际年龄大体一致
    return {
      level: 'C',
      psychologicalAge,
      actualAge,
      diff,
      ageCategory,
      title: '心理年龄与生理年龄相近',
      description: '你在情绪管理、自我认知和责任感等方面与同龄人步调一致，既有活力也有稳重，心理发展与年龄匹配度高。这是个良好的平衡点，说明你的心理发展健康且符合自然规律。此时适合冲刺长期目标或承担新的责任和挑战。',
      color: 'yellow',
    };
  } else if (diff > 8 && diff <= 20) {
    // 档位 D：偏成熟
    return {
      level: 'D',
      psychologicalAge,
      actualAge,
      diff,
      ageCategory,
      title: '你偏向成熟稳重',
      description: '你在处理情绪、承担责任和长期规划上比同龄人更成熟，别人可能很信赖你的判断和决策。这种成熟度是优势，但也要注意不要过早失去探索的勇气。建议继续发挥稳重的优势，同时避免观念过早固化，保持开放的学习心态。',
      color: 'orange',
    };
  } else {
    // 档位 E：显著偏成熟 (diff > 20)
    return {
      level: 'E',
      psychologicalAge,
      actualAge,
      diff,
      ageCategory,
      title: '你展现出显著的成熟与稳重',
      description: '你的决策能力、情绪管理和责任感远超多数同龄人，这是很大的优点。但过度成熟也可能让你错过当下的一些轻松和快乐，承担了超出年龄的心理负担。建议善用成熟带来的信任与资源，同时偶尔允许自己放松，做一些让内心年轻的小事。',
      color: 'red',
    };
  }
}
