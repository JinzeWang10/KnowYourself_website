import { QuizTemplate } from '@/types/quiz';

/**
 * SCL-90 症状自评量表
 * Symptom Checklist 90
 *
 * 全面评估心理症状的标准化量表，包含90个项目，涵盖10个症状维度：
 * - 躯体化 (Somatization, 12题)
 * - 强迫症状 (Obsessive-Compulsive, 10题)
 * - 人际关系敏感 (Interpersonal Sensitivity, 9题)
 * - 抑郁 (Depression, 13题)
 * - 焦虑 (Anxiety, 10题)
 * - 敌对 (Hostility, 6题)
 * - 恐怖 (Phobic Anxiety, 7题)
 * - 偏执 (Paranoid Ideation, 6题)
 * - 精神病性 (Psychoticism, 10题)
 * - 其他 (Additional Items, 7题)
 *
 * 计分方式：5点Likert量表（1=没有, 2=很轻, 3=中等, 4=偏重, 5=严重）
 * 筛查阳性标准：总分>160 OR 任一因子分≥2 OR 阳性项目数>43
 */
export const scl90: QuizTemplate = {
  id: 'scl90',
  title: '症状自评量表 (SCL-90)',
  titleEn: 'Symptom Checklist 90 (SCL-90)',
  description: '全面评估心理症状严重程度，涵盖躯体化、强迫、抑郁、焦虑等10个症状维度',
  category: '心理健康',
  purpose: 'SCL-90是世界上最著名的心理健康测试量表之一，包含90个项目，涵盖感觉、情感、思维、行为、人际关系以及生活习惯等广泛内容。它能够从感觉、情感、思维、意识、行为直至生活习惯、人际关系、饮食睡眠等多个角度，评定一个人是否有某种心理症状及其严重程度如何。适用于16岁以上的成年人群，常用于心理咨询、临床诊断的初步筛查、疗效评估等场景。本量表可以反映受试者当前的心理症状状况，但不能作为诊断依据，需要专业人员结合其他信息进行综合判断。',
  duration: '10-15分钟',
  questionCount: 90,

  instructions: '以下列出了有些人可能有的病痛或问题，请仔细阅读每一条，然后根据**最近一星期以内（包括今天）**您的实际感觉，选择最符合的答案。',

  dimensions: [
    {
      id: 'somatization',
      name: '躯体化',
      description: '反映主观的身体不适感。高分提示可能存在心身问题，也可能是焦虑、抑郁等心理问题的躯体化表现。',
      questionIds: ['q1', 'q4', 'q12', 'q27', 'q40', 'q42', 'q48', 'q49', 'q52', 'q53', 'q56', 'q58']
    },
    {
      id: 'obsessive_compulsive',
      name: '强迫症状',
      description: '反映明显的强迫思维和强迫行为。高分提示存在难以摆脱的想法或重复性行为，影响日常效率。',
      questionIds: ['q3', 'q9', 'q10', 'q28', 'q38', 'q45', 'q46', 'q51', 'q55', 'q65']
    },
    {
      id: 'interpersonal_sensitivity',
      name: '人际关系敏感',
      description: '反映人际交往中的不适感和自卑感。高分提示在与他人互动时容易感到紧张、被误解或不被接纳。',
      questionIds: ['q6', 'q21', 'q34', 'q36', 'q37', 'q41', 'q61', 'q69', 'q73']
    },
    {
      id: 'depression',
      name: '抑郁',
      description: '反映抑郁情绪和相关症状。高分提示情绪低落、兴趣减退、缺乏活力等，需要特别关注。',
      questionIds: ['q5', 'q14', 'q15', 'q20', 'q22', 'q26', 'q29', 'q30', 'q31', 'q32', 'q54', 'q71', 'q79']
    },
    {
      id: 'anxiety',
      name: '焦虑',
      description: '反映焦虑情绪和相关躯体表现。高分提示存在紧张不安、担忧、惊恐等症状。',
      questionIds: ['q2', 'q17', 'q23', 'q33', 'q39', 'q57', 'q72', 'q78', 'q80', 'q86']
    },
    {
      id: 'hostility',
      name: '敌对',
      description: '反映攻击性思维、情感和行为。高分提示容易愤怒、与人争执或有攻击冲动。',
      questionIds: ['q11', 'q24', 'q63', 'q67', 'q74', 'q81']
    },
    {
      id: 'phobic_anxiety',
      name: '恐怖',
      description: '反映恐惧反应。高分提示对特定场所、情境或社交场合存在明显恐惧。',
      questionIds: ['q13', 'q25', 'q47', 'q50', 'q70', 'q75', 'q82']
    },
    {
      id: 'paranoid_ideation',
      name: '偏执',
      description: '反映偏执性思维。高分提示存在猜疑、不信任、认为别人对自己有敌意等想法。',
      questionIds: ['q8', 'q18', 'q43', 'q68', 'q76', 'q83']
    },
    {
      id: 'psychoticism',
      name: '精神病性',
      description: '反映精神分裂症样症状。高分提示可能存在思维、知觉或行为方面的异常，需要尽快专业评估。',
      questionIds: ['q7', 'q16', 'q35', 'q62', 'q77', 'q84', 'q85', 'q87', 'q88', 'q90']
    },
    {
      id: 'other',
      name: '其他',
      description: '主要反映睡眠和饮食问题。高分提示存在睡眠障碍或饮食问题。',
      questionIds: ['q19', 'q44', 'q59', 'q60', 'q64', 'q66', 'q89']
    }
  ],

  questions: [
    // 题目按照标准SCL-90顺序排列（题号1-90）
    { id: 'q1', type: 'likert', question: '头痛', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q2', type: 'likert', question: '神经过敏，心中不踏实', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q3', type: 'likert', question: '头脑中有不必要的想法或字句盘旋', dimension: 'obsessive_compulsive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q4', type: 'likert', question: '头昏或昏倒', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q5', type: 'likert', question: '对异性的兴趣减退', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q6', type: 'likert', question: '对旁人责备求全', dimension: 'interpersonal_sensitivity', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q7', type: 'likert', question: '感到别人能控制您的思想', dimension: 'psychoticism', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q8', type: 'likert', question: '责怪别人制造麻烦', dimension: 'paranoid_ideation', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q9', type: 'likert', question: '忘记性大', dimension: 'obsessive_compulsive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q10', type: 'likert', question: '担心自己的衣饰整齐及仪态的端正', dimension: 'obsessive_compulsive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    { id: 'q11', type: 'likert', question: '容易烦恼和激动', dimension: 'hostility', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q12', type: 'likert', question: '胸痛', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q13', type: 'likert', question: '害怕空旷的场所或街道', dimension: 'phobic_anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q14', type: 'likert', question: '感到自己的精力下降，活动减慢', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q15', type: 'likert', question: '想结束自己的生命', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q16', type: 'likert', question: '听到旁人听不到的声音', dimension: 'psychoticism', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q17', type: 'likert', question: '发抖', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q18', type: 'likert', question: '感到大多数人都不可信任', dimension: 'paranoid_ideation', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q19', type: 'likert', question: '胃口不好', dimension: 'other', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q20', type: 'likert', question: '容易哭泣', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    { id: 'q21', type: 'likert', question: '同异性相处时感到害羞不自在', dimension: 'interpersonal_sensitivity', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q22', type: 'likert', question: '感到受骗、中了圈套或有人想抓住您', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q23', type: 'likert', question: '无缘无故地突然感到害怕', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q24', type: 'likert', question: '自己不能控制地大发脾气', dimension: 'hostility', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q25', type: 'likert', question: '怕单独出门', dimension: 'phobic_anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q26', type: 'likert', question: '经常责怪自己', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q27', type: 'likert', question: '腰痛', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q28', type: 'likert', question: '感到难以完成任务', dimension: 'obsessive_compulsive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q29', type: 'likert', question: '感到孤独', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q30', type: 'likert', question: '感到苦闷', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    { id: 'q31', type: 'likert', question: '过分担忧', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q32', type: 'likert', question: '对事物不感兴趣', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q33', type: 'likert', question: '感到害怕', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q34', type: 'likert', question: '您的感情容易受到伤害', dimension: 'interpersonal_sensitivity', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q35', type: 'likert', question: '旁人能知道您的私下想法', dimension: 'psychoticism', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q36', type: 'likert', question: '感到别人不理解您、不同情您', dimension: 'interpersonal_sensitivity', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q37', type: 'likert', question: '感到人们对您不友好，不喜欢您', dimension: 'interpersonal_sensitivity', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q38', type: 'likert', question: '做事必须做得很慢以保证做得正确', dimension: 'obsessive_compulsive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q39', type: 'likert', question: '心跳得很厉害', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q40', type: 'likert', question: '恶心或胃部不舒服', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    { id: 'q41', type: 'likert', question: '感到比不上他人', dimension: 'interpersonal_sensitivity', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q42', type: 'likert', question: '肌肉酸痛', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q43', type: 'likert', question: '感到有人在监视您、谈论您', dimension: 'paranoid_ideation', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q44', type: 'likert', question: '难以入睡', dimension: 'other', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q45', type: 'likert', question: '做事必须反复检查', dimension: 'obsessive_compulsive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q46', type: 'likert', question: '难以作出决定', dimension: 'obsessive_compulsive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q47', type: 'likert', question: '怕乘电车、公共汽车、地铁或火车', dimension: 'phobic_anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q48', type: 'likert', question: '呼吸有困难', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q49', type: 'likert', question: '一阵阵发冷或发热', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q50', type: 'likert', question: '因为感到害怕而避开某些东西、场合或活动', dimension: 'phobic_anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    { id: 'q51', type: 'likert', question: '脑子变空了', dimension: 'obsessive_compulsive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q52', type: 'likert', question: '身体发麻或刺痛', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q53', type: 'likert', question: '喉咙有梗塞感', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q54', type: 'likert', question: '感到前途没有希望', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q55', type: 'likert', question: '不能集中注意', dimension: 'obsessive_compulsive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q56', type: 'likert', question: '感到身体的某一部分软弱无力', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q57', type: 'likert', question: '感到紧张或容易紧张', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q58', type: 'likert', question: '感到手或脚发重', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q59', type: 'likert', question: '想到死亡的事', dimension: 'other', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q60', type: 'likert', question: '吃得太多', dimension: 'other', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    { id: 'q61', type: 'likert', question: '当别人看着您或谈论您时感到不自在', dimension: 'interpersonal_sensitivity', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q62', type: 'likert', question: '有一些不属于您自己的想法', dimension: 'psychoticism', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q63', type: 'likert', question: '有想打人或伤害他人的冲动', dimension: 'hostility', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q64', type: 'likert', question: '醒得太早', dimension: 'other', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q65', type: 'likert', question: '必须反复洗手、点数目或触摸某些东西', dimension: 'obsessive_compulsive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q66', type: 'likert', question: '睡得不稳不深', dimension: 'other', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q67', type: 'likert', question: '有想摔坏或破坏东西的冲动', dimension: 'hostility', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q68', type: 'likert', question: '有一些别人没有的想法或念头', dimension: 'paranoid_ideation', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q69', type: 'likert', question: '感到对别人神经过敏', dimension: 'interpersonal_sensitivity', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q70', type: 'likert', question: '在商店或电影院等人多的地方感到不自在', dimension: 'phobic_anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    { id: 'q71', type: 'likert', question: '感到任何事情都很困难', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q72', type: 'likert', question: '一阵阵恐惧或惊恐', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q73', type: 'likert', question: '感到在公共场合吃东西很不舒服', dimension: 'interpersonal_sensitivity', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q74', type: 'likert', question: '经常与人争论', dimension: 'hostility', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q75', type: 'likert', question: '单独一个人时神经很紧张', dimension: 'phobic_anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q76', type: 'likert', question: '别人对您的成绩没有作出恰当的评价', dimension: 'paranoid_ideation', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q77', type: 'likert', question: '即使和别人在一起也感到孤单', dimension: 'psychoticism', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q78', type: 'likert', question: '感到坐立不安心神不定', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q79', type: 'likert', question: '感到自己没有什么价值', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q80', type: 'likert', question: '感到熟悉的东西变成陌生或不象是真的', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    { id: 'q81', type: 'likert', question: '大叫或摔东西', dimension: 'hostility', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q82', type: 'likert', question: '害怕会在公共场合昏倒', dimension: 'phobic_anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q83', type: 'likert', question: '感到别人想占您的便宜', dimension: 'paranoid_ideation', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q84', type: 'likert', question: '为一些有关性的想法而很苦恼', dimension: 'psychoticism', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q85', type: 'likert', question: '您认为应该因为自己的过错而受到惩罚', dimension: 'psychoticism', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q86', type: 'likert', question: '感到要很快把事情做完', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q87', type: 'likert', question: '感到自己的身体有严重问题', dimension: 'psychoticism', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q88', type: 'likert', question: '从未感到和其他人很亲近', dimension: 'psychoticism', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q89', type: 'likert', question: '感到自己有罪', dimension: 'other', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q90', type: 'likert', question: '感到自己的脑子有毛病', dimension: 'psychoticism', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
  ],

  scoring: {
    method: 'custom',
    scaleRange: {
      min: 90,
      max: 450,
      description: '总分范围从90到450分，分值越高表示症状越明显'
    },
    ranges: [
      {
        min: 90,
        max: 160,
        level: '心理健康',
        description: '您的SCL-90测评结果显示，您当前的心理症状水平处于正常范围内。这表明您在最近一周内，各方面的心理症状都较轻微，不会对日常生活、工作和人际关系造成明显影响。虽然偶尔可能会体验到一些不适感或情绪波动，但这些都是生活中的正常现象。保持良好的生活习惯，适当关注自己的情绪变化，继续保持积极的心态。如果未来感到压力增大或出现持续的不适感，可以考虑寻求心理咨询的支持。',
        color: '#10b981',
        suggestions: [
          '保持规律的作息和健康的生活方式',
          '培养积极的兴趣爱好，丰富精神生活',
          '维护良好的人际关系，建立支持系统',
          '学习压力管理技巧，提升心理韧性',
          '定期进行自我反思和心理健康评估'
        ]
      },
      {
        min: 161,
        max: 450,
        level: '筛查阳性',
        description: '您的测评结果达到了筛查阳性标准，这意味着您在最近一周内可能经历了较多的心理症状或某些症状较为严重。这些症状可能已经对您的日常生活、工作效率或人际关系产生了一定影响。需要特别说明的是，SCL-90是一个筛查工具，用于识别可能存在心理健康问题的个体，但不能作为诊断依据。筛查阳性不等于确诊某种心理障碍，它只是提示您需要进一步的专业评估。建议您尽快咨询心理健康专业人士（如心理咨询师、临床心理师或精神科医生），他们会通过面谈、进一步的评估工具等方式，对您的情况进行全面了解，并根据需要制定相应的干预方案。早期识别和干预对于改善心理健康状况非常重要。大多数心理问题通过专业的心理咨询或治疗都能得到有效改善。',
        color: '#ef4444',
        suggestions: [
          '尽快预约心理咨询师或精神科医生进行专业评估',
          '向家人或信任的朋友说明情况，寻求支持',
          '关注评分较高的因子维度，这些可能是当前最需要关注的问题',
          '减少不必要的压力源，适当调整工作和生活节奏',
          '保持规律作息，避免酒精和咖啡因等刺激物',
          '如有强烈的自伤或伤人想法，请立即拨打心理危机热线或前往医院急诊'
        ]
      }
    ]
  },

  references: [
    {
      title: 'SCL-90: Administration, scoring, and procedures manual-I for the R(revised) version',
      authors: 'Derogatis, L. R.',
      year: 1977,
      journal: 'Baltimore: Johns Hopkins University School of Medicine, Clinical Psychometrics Research Unit'
    },
    {
      title: '症状自评量表（SCL-90）',
      authors: '王征宇',
      year: 1984,
      journal: '上海精神医学，第2卷增刊，第68-70页'
    },
    {
      title: 'SCL-90评定量表的因子结构研究',
      authors: '金华、吴文源、张明园',
      year: 1986,
      journal: '中国神经精神疾病杂志，第12卷第5期，第260-263页'
    },
    {
      title: '症状自评量表（SCL-90）应用与研究',
      authors: '陈树林、李凌江',
      year: 2003,
      journal: '中国心理卫生杂志，第17卷第5期'
    }
  ]
};
