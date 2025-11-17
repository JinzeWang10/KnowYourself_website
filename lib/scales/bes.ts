import type { QuizTemplate } from '@/types/quiz';

/**
 * Binge Eating Scale (BES) 暴食指数量表
 *
 * 目的：评估个体暴饮暴食行为的严重程度，包含行为与情绪两大维度
 *
 * 结构：16道题，每题2-4个选项（分值0-3分）
 * 计分公式：(sum_score/46)*100，向上取整
 *
 * 参考文献：
 * Gormally, J., Black, S., Daston, S., & Rardin, D. (1982).
 * The assessment of binge eating severity among obese persons.
 * Addictive Behaviors, 7(1), 47–55.
 */

export const bes: QuizTemplate = {
  id: 'bes',
  title: '暴食指数量表',
  titleEn: 'Binge Eating Scale (BES)',
  description: '评估暴饮暴食行为的严重程度，了解进食冲动、情绪与饮食的关系',
  category: '饮食行为评估',
  purpose: '评估个体暴饮暴食行为的严重程度，包含行为与情绪两大维度。帮助识别暴食相关症状、进食节奏、食欲感知、饥饱判断能力，以及情绪性进食模式。',
  duration: '8-10分钟',
  questionCount: 16,

  questions: [
    // 问题 1
    {
      id: 'bes_1',
      type: 'single',
      question: '关于体重和体型的感受',
      options: [
        { value: 0, label: '我在他人面前不会因为自己的体重或体型感到不自在。' },
        { value: 0, label: '我会在意自己在别人眼中的样子，但通常不会因此对自己失望。' },
        { value: 1, label: '我确实会因为外表和体重感到不自在，这让我对自己感到失望。' },
        { value: 3, label: '我对自己的体重非常不自信，经常感到强烈的羞耻和厌恶。我会因为这种不自在而尽量避免社交。' },
      ],
      required: true,
    },
    // 问题 2
    {
      id: 'bes_2',
      type: 'single',
      question: '关于进食速度',
      options: [
        { value: 0, label: '我吃东西时不会有吃太快的问题，能以适当的方式进食。' },
        { value: 1, label: '虽然我似乎会"狼吞虎咽"，但并不会因此吃撑。' },
        { value: 2, label: '有时我会吃得很快，然后感到不舒服的饱胀。' },
        { value: 3, label: '我习惯不怎么咀嚼就把食物吞下去，这通常会导致我吃得太多而感到非常撑。' },
      ],
      required: true,
    },
    // 问题 3
    {
      id: 'bes_3',
      type: 'single',
      question: '关于饮食控制',
      options: [
        { value: 0, label: '我觉得自己想控制饮食时就能控制。' },
        { value: 1, label: '我觉得自己比一般人更难控制饮食。' },
        { value: 3, label: '在控制进食冲动方面，我感到完全无能为力。' },
        { value: 3, label: '因为对饮食失控如此绝望，我变得非常渴望重新获得控制。' },
      ],
      required: true,
    },
    // 问题 4
    {
      id: 'bes_4',
      type: 'single',
      question: '关于无聊时的进食',
      options: [
        { value: 0, label: '我没有无聊时吃东西的习惯。' },
        { value: 0, label: '我有时会在无聊时吃东西，但通常能够通过找点事情做来转移注意力。' },
        { value: 0, label: '我确实有无聊时吃东西的习惯，但有时我能用其他活动分散注意。' },
        { value: 2, label: '我强烈依赖在无聊时吃东西，似乎没有什么能让我摆脱这个习惯。' },
      ],
      required: true,
    },
    // 问题 5
    {
      id: 'bes_5',
      type: 'single',
      question: '关于饥饿感和进食',
      options: [
        { value: 0, label: '我通常是在真正感到饥饿时才吃东西。' },
        { value: 1, label: '偶尔，我会在并不真的饿的时候冲动地吃东西。' },
        { value: 2, label: '我经常为了满足一种"饥饿感"而进食，即使身体并不需要那些食物，也并不特别享受它们。' },
        { value: 3, label: '即使身体并不饥饿，我的嘴里也会出现一种饥饿感，只有像三明治这类"填满嘴"的食物才能满足。有时我吃了之后还会把食物吐掉，以免增重。' },
      ],
      required: true,
    },
    // 问题 6
    {
      id: 'bes_6',
      type: 'single',
      question: '关于暴食后的感受',
      options: [
        { value: 0, label: '我在暴食后不会感到负罪或自我厌恶。' },
        { value: 1, label: '偶尔在暴食后我会感到罪恶或讨厌自己。' },
        { value: 3, label: '几乎每次暴食后我都会感到强烈的罪恶感或自我厌恶。' },
      ],
      required: true,
    },
    // 问题 7
    {
      id: 'bes_7',
      type: 'single',
      question: '关于节食期间的失控',
      options: [
        { value: 0, label: '即使在节食期间暴食了，我也不会完全失控。' },
        { value: 2, label: '有时，在节食时吃了"禁止食物"，我会觉得"完了"然后吃得更多。' },
        { value: 3, label: '我经常在节食时一旦失控就会想："都这样了，不如彻底放开吃。"于是我吃得更多。' },
        { value: 3, label: '我常常开始严格节食，但最终会以暴食告终。我的生活似乎总在"盛宴"或"饥荒"之间循环。' },
      ],
      required: true,
    },
    // 问题 8
    {
      id: 'bes_8',
      type: 'single',
      question: '关于吃撑的频率',
      options: [
        { value: 0, label: '我很少吃到撑。' },
        { value: 1, label: '大约每月一次，我会吃得过多而感到非常撑。' },
        { value: 2, label: '我每个月都会有一段时间在正餐或零食时吃大量食物。' },
        { value: 3, label: '我经常吃到非常不舒服，甚至有些恶心。' },
      ],
      required: true,
    },
    // 问题 9
    {
      id: 'bes_9',
      type: 'single',
      question: '关于热量摄入的波动',
      options: [
        { value: 0, label: '我的热量摄入通常不会出现很大的波动。' },
        { value: 1, label: '有时在暴食后，我会试图大幅减少热量摄入，几乎不吃东西来补偿。' },
        { value: 2, label: '我经常在晚上暴食，而早上不太饥饿。' },
        { value: 3, label: '成年后我经历过持续一周几乎不吃东西的时期，这通常发生在暴食之后。我几乎一直在"暴食或饥饿"的循环里。' },
      ],
      required: true,
    },
    // 问题 10
    {
      id: 'bes_10',
      type: 'single',
      question: '关于停止进食的能力',
      options: [
        { value: 0, label: '我通常在想停下时就能停止进食。我知道什么时候"够了"。' },
        { value: 1, label: '有时我会突然产生无法控制的进食冲动。' },
        { value: 2, label: '我经常会出现强烈的进食冲动，难以控制，但有时也能控制住。' },
        { value: 3, label: '我觉得自己无法控制进食冲动，甚至害怕无法自行停止进食。' },
      ],
      required: true,
    },
    // 问题 11
    {
      id: 'bes_11',
      type: 'single',
      question: '关于饱腹时停止进食',
      options: [
        { value: 0, label: '在我觉得饱的时候，停止进食对我来说很容易。' },
        { value: 1, label: '我通常能在饱的时候停止进食，但偶尔会吃过头导致不舒服。' },
        { value: 2, label: '我一旦开始吃就很难停下来，通常会感到不舒服的饱胀。' },
        { value: 3, label: '因为无法及时停止进食，我有时不得不催吐来缓解胀感。' },
      ],
      required: true,
    },
    // 问题 12
    {
      id: 'bes_12',
      type: 'single',
      question: '关于在他人面前进食',
      options: [
        { value: 0, label: '我在与他人一起吃饭时和与独自吃饭时吃得一样多。' },
        { value: 1, label: '有时，在别人面前我会因为不自在而吃得比我想吃的少。' },
        { value: 2, label: '我经常在别人面前只吃一点，因为我对自己的吃相非常尴尬。' },
        { value: 3, label: '我对暴食感到羞耻，常常挑在无人看到的时候暴食。我觉得自己像"偷偷吃东西的人"。' },
      ],
      required: true,
    },
    // 问题 13
    {
      id: 'bes_13',
      type: 'single',
      question: '关于用餐结构',
      options: [
        { value: 0, label: '我每天吃三顿饭，只是偶尔加点零食。' },
        { value: 0, label: '我每天吃三顿饭，但通常会在餐间吃点零食。' },
        { value: 2, label: '在零食吃得很频繁的时候，我会习惯性地跳过正餐。' },
        { value: 3, label: '有些时期我几乎一直在吃，没有固定的用餐结构。' },
      ],
      required: true,
    },
    // 问题 14
    {
      id: 'bes_14',
      type: 'single',
      question: '关于对饮食的思考',
      options: [
        { value: 0, label: '我不常想着控制自己的饮食冲动。' },
        { value: 1, label: '有些时候，我会花心力去想如何控制自己的食欲。' },
        { value: 2, label: '我经常花很多时间想着自己吃了多少或努力不让自己继续吃。' },
        { value: 3, label: '我似乎大部分清醒时间都在想着吃或不吃，感觉一直在与食物作斗争。' },
      ],
      required: true,
    },
    // 问题 15
    {
      id: 'bes_15',
      type: 'single',
      question: '关于对食物的渴望',
      options: [
        { value: 0, label: '我不会过度地想着食物。' },
        { value: 1, label: '我会强烈渴望食物，但通常持续时间不长。' },
        { value: 2, label: '有些日子我几乎无法思考除食物外的任何事情。' },
        { value: 3, label: '我的很多日子都被关于食物的想法占据，我觉得自己像是"为了吃而活"。' },
      ],
      required: true,
    },
    // 问题 16
    {
      id: 'bes_16',
      type: 'single',
      question: '关于饥饿感知和食量判断',
      options: [
        { value: 0, label: '我通常知道自己是否真的饿了，并会吃适量的食物满足需求。' },
        { value: 1, label: '偶尔我会不确定自己是否真的饿了，因此也难以判断吃多少才够。' },
        { value: 2, label: '即使我知道自己应摄取多少卡路里，我仍不知道对我来说什么量才算"正常"。' },
      ],
      required: true,
    },
  ],

  scoring: {
    method: 'custom',
    scaleRange: {
      min: 0,
      max: 100,
      description: '总分范围为0-100分，得分越高表示暴食行为越严重',
    },
    ranges: [
      {
        min: 0,
        max: 37,
        level: '低程度暴食',
        color: '#10b981',
        description: '此分数范围表示几乎没有暴食相关症状。你的进食节奏、食欲感知、饥饱判断都较为稳定，偶尔的情绪性进食属于正常范围，不会对生活造成明显影响。整体来说，你具备良好的饮食自我调节能力。',
        suggestions: [
          '继续保持对身体信号的敏感度，维持规律饮食习惯',
          '如果偶尔出现压力性进食，也不必过度担心',
          '可以通过运动、放松练习或兴趣活动来帮助自己维持良好状态',
        ],
      },
      {
        min: 38,
        max: 57,
        level: '轻度至中度暴食',
        color: '#f59e0b',
        description: '该范围代表你可能存在一定程度的暴食倾向，例如较强的进食冲动、情绪驱动进食或偶发性的失控感。这些情况可能在压力大、情绪低落或特定场景下更明显，但整体尚未达到严重程度。',
        suggestions: [
          '可以开始留意暴食发生的情境与触发因素，并尝试建立更稳定的饮食节奏',
          '记录情绪与食物摄入可能有助于理解自己的模式',
          '如果困扰影响到情绪或生活，考虑咨询专业心理师以获得进一步支持',
        ],
      },
      {
        min: 58,
        max: 100,
        level: '重度暴食',
        color: '#ef4444',
        description: '此分数显示你可能正经历频繁且强烈的暴食行为，如难以控制的进食冲动、反复的内疚感或"暴食—节食"的循环。这类模式可能导致生理不适、情绪负担，甚至影响生活质量。',
        suggestions: [
          '建议尽早寻求专业的心理支持，例如饮食失调方向的心理咨询或营养治疗',
          '暴食行为往往与压力、情绪调节困难或自我评价相关，专业协助可以帮助你重建稳定的饮食关系与情绪调节能力',
          '请善待自己，暴食并不是意志力问题',
        ],
      },
    ],
  },

  references: [
    {
      title: 'The assessment of binge eating severity among obese persons',
      authors: 'Gormally, J., Black, S., Daston, S., & Rardin, D.',
      year: 1982,
      journal: 'Addictive Behaviors',
      volume: '7',
      pages: '47–55',
    },
    {
      title: 'Expanding binge eating assessment: Validity and screening value of the Binge‑Eating Scale in women from the general population',
      authors: 'Duarte, C., Pinto‑Gouveia, J., & Ferreira, C.',
      year: 2015,
      journal: 'Eating Behaviors',
      volume: '18',
      pages: '41–47',
    },
    {
      title: 'Psychometric properties of the Turkish version of the Binge Eating Scale in detecting binge eating disorder among people seeking treatment for obesity',
      authors: 'Gormez, A., Elbay, R. Y., Karatepe, H. T., Mutlu, H. H., & Karadere, M. E.',
      year: 2023,
      journal: 'Dusunen Adam: Journal of Psychiatry and Neurological Sciences',
      volume: '36',
      pages: '230–237',
    },
  ],

  instructions: '请根据过去几周的实际情况，选择最符合你感受的选项。每个问题只能选择一个答案。',

  // 自定义计算函数
  calculateResults: (answers: Record<string, number>) => {
    // 计算总分
    let sumScore = 0;
    Object.values(answers).forEach(value => {
      sumScore += value;
    });

    // 应用BES特殊公式：(sum_score/46)*100，向上取整
    const totalScore = Math.ceil((sumScore / 46) * 100);

    // 判断等级
    let interpretation = '';
    let level = '';
    let suggestions: string[] = [];

    if (totalScore <= 37) {
      level = '低程度暴食';
      interpretation = '此分数范围表示几乎没有暴食相关症状。你的进食节奏、食欲感知、饥饱判断都较为稳定，偶尔的情绪性进食属于正常范围，不会对生活造成明显影响。整体来说，你具备良好的饮食自我调节能力。';
      suggestions = [
        '继续保持对身体信号的敏感度，维持规律饮食习惯',
        '如果偶尔出现压力性进食，也不必过度担心',
        '可以通过运动、放松练习或兴趣活动来帮助自己维持良好状态',
      ];
    } else if (totalScore >= 38 && totalScore <= 57) {
      level = '轻度至中度暴食';
      interpretation = '该范围代表你可能存在一定程度的暴食倾向，例如较强的进食冲动、情绪驱动进食或偶发性的失控感。这些情况可能在压力大、情绪低落或特定场景下更明显，但整体尚未达到严重程度。';
      suggestions = [
        '可以开始留意暴食发生的情境与触发因素，并尝试建立更稳定的饮食节奏',
        '记录情绪与食物摄入可能有助于理解自己的模式',
        '如果困扰影响到情绪或生活，考虑咨询专业心理师以获得进一步支持',
      ];
    } else {
      level = '重度暴食';
      interpretation = '此分数显示你可能正经历频繁且强烈的暴食行为，如难以控制的进食冲动、反复的内疚感或"暴食—节食"的循环。这类模式可能导致生理不适、情绪负担，甚至影响生活质量。';
      suggestions = [
        '建议尽早寻求专业的心理支持，例如饮食失调方向的心理咨询或营养治疗',
        '暴食行为往往与压力、情绪调节困难或自我评价相关，专业协助可以帮助你重建稳定的饮食关系与情绪调节能力',
        '请善待自己，暴食并不是意志力问题',
      ];
    }

    return {
      totalScore,
      interpretation,
      recommendations: suggestions,
      metadata: {
        sumScore,
        formula: '(sum_score/46)*100',
        level,
      },
    };
  },
};
