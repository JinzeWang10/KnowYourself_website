import { QuizTemplate } from '@/types/quiz';

// SCL-90 症状自评量表
// 包含90个项目，涵盖9个症状因子
export const scl90: QuizTemplate = {
  id: 'scl90',
  title: 'SCL-90 症状自评量表',
  titleEn: 'Symptom Checklist 90',
  description: '全面评估心理症状的标准化量表，广泛应用于心理健康筛查和临床诊断',
  category: '心理健康评估',
  purpose: '评估躯体化、强迫症状、人际关系敏感、抑郁、焦虑、敌对、恐怖、偏执、精神病性等9个维度',
  duration: '23-30分钟',
  questionCount: 90,

  dimensions: [
    {
      id: 'somatization',
      name: '躯体化',
      description: '反映身体不适感，包括心血管、胃肠道、呼吸系统等方面的不适',
      questionIds: ['q1', 'q4', 'q12', 'q27', 'q40', 'q42', 'q48', 'q49', 'q52', 'q53', 'q56', 'q58']
    },
    {
      id: 'obsessive',
      name: '强迫症状',
      description: '反映强迫思维和强迫行为，难以控制的想法和行为',
      questionIds: ['q3', 'q9', 'q10', 'q28', 'q38', 'q45', 'q46', 'q51', 'q55', 'q65']
    },
    {
      id: 'interpersonal',
      name: '人际关系敏感',
      description: '反映在人际交往中的不自在感和自卑感',
      questionIds: ['q6', 'q21', 'q34', 'q36', 'q37', 'q41', 'q61', 'q69', 'q73']
    },
    {
      id: 'depression',
      name: '抑郁',
      description: '反映抑郁情绪和相关症状，如生活兴趣减退、动力缺乏等',
      questionIds: ['q5', 'q14', 'q15', 'q20', 'q22', 'q26', 'q29', 'q30', 'q31', 'q32', 'q54', 'q71', 'q79']
    },
    {
      id: 'anxiety',
      name: '焦虑',
      description: '反映焦虑情绪及其相关的身体症状',
      questionIds: ['q2', 'q17', 'q23', 'q33', 'q39', 'q57', 'q72', 'q78', 'q80', 'q86']
    },
    {
      id: 'hostility',
      name: '敌对',
      description: '反映敌对思维、情感和行为，包括愤怒、冲动等',
      questionIds: ['q11', 'q24', 'q63', 'q67', 'q74', 'q81']
    },
    {
      id: 'phobic',
      name: '恐怖',
      description: '反映对特定场所、物体或情境的恐惧',
      questionIds: ['q13', 'q25', 'q47', 'q50', 'q70', 'q75', 'q82']
    },
    {
      id: 'paranoid',
      name: '偏执',
      description: '反映偏执性思维，如投射性思维、敌对、猜疑等',
      questionIds: ['q8', 'q18', 'q43', 'q68', 'q76', 'q83']
    },
    {
      id: 'psychotic',
      name: '精神病性',
      description: '反映精神病性症状，如幻觉、思维异常等',
      questionIds: ['q7', 'q16', 'q35', 'q62', 'q77', 'q84', 'q85', 'q87', 'q88', 'q90']
    }
  ],

  questions: [
    // 躯体化因子
    { id: 'q1', type: 'scale', question: '头痛', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q4', type: 'scale', question: '头昏或昏倒', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q12', type: 'scale', question: '心脏跳动得很厉害', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q27', type: 'scale', question: '腰痛', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q40', type: 'scale', question: '恶心或胃部不舒服', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q42', type: 'scale', question: '肌肉酸痛', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q48', type: 'scale', question: '呼吸有困难', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q49', type: 'scale', question: '一阵阵发冷或发热', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q52', type: 'scale', question: '身体的某部分感到麻木或刺痛', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q53', type: 'scale', question: '喉咙有梗塞感', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q56', type: 'scale', question: '手脚发麻或刺痛', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q58', type: 'scale', question: '胃口不好', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    // 焦虑因子
    { id: 'q2', type: 'scale', question: '神经过敏，心中不踏实', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q17', type: 'scale', question: '感到容易苦恼和激动', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q23', type: 'scale', question: '受到惊吓', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q33', type: 'scale', question: '感到紧张或容易紧张', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q39', type: 'scale', question: '感到害怕', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q57', type: 'scale', question: '感到心跳得很厉害', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q72', type: 'scale', question: '一阵阵恐惧或惊恐', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q78', type: 'scale', question: '感到不安，不能静坐', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q80', type: 'scale', question: '因为感到害怕而避开某些东西、场合或活动', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q86', type: 'scale', question: '感到紧张不安', dimension: 'anxiety', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    // 强迫症状因子
    { id: 'q3', type: 'scale', question: '心里反复出现不必要的想法或字句', dimension: 'obsessive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q9', type: 'scale', question: '记忆力不好', dimension: 'obsessive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q10', type: 'scale', question: '担心自己的粗心大意或不整洁', dimension: 'obsessive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q28', type: 'scale', question: '感到难以完成任务', dimension: 'obsessive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q38', type: 'scale', question: '做事必须做得很慢以保证做得正确', dimension: 'obsessive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q45', type: 'scale', question: '必须反复检查所做的事', dimension: 'obsessive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q46', type: 'scale', question: '难以作出决定', dimension: 'obsessive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q51', type: 'scale', question: '脑子变空白', dimension: 'obsessive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q55', type: 'scale', question: '很难集中注意力', dimension: 'obsessive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q65', type: 'scale', question: '反复去想一些无关紧要的事', dimension: 'obsessive', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    // 抑郁因子
    { id: 'q5', type: 'scale', question: '对事物不感兴趣', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q14', type: 'scale', question: '精力不足，活动减慢', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q15', type: 'scale', question: '想结束自己的生命', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q20', type: 'scale', question: '哭泣', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q22', type: 'scale', question: '感到被人陷害', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q26', type: 'scale', question: '责备自己', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q29', type: 'scale', question: '感到孤独', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q30', type: 'scale', question: '感到苦闷', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q31', type: 'scale', question: '过分担忧', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q32', type: 'scale', question: '对事物不感兴趣', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q54', type: 'scale', question: '感到自己没有什么价值', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q71', type: 'scale', question: '容易哭泣', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q79', type: 'scale', question: '感到一切都很困难，难以应付', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    // 人际关系敏感因子
    { id: 'q6', type: 'scale', question: '责怪别人', dimension: 'interpersonal', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q21', type: 'scale', question: '在人前感到害羞不自在', dimension: 'interpersonal', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q34', type: 'scale', question: '感到别人不理解你、不同情你', dimension: 'interpersonal', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q36', type: 'scale', question: '感到别人对你不友好，不喜欢你', dimension: 'interpersonal', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q37', type: 'scale', question: '感到比不上别人', dimension: 'interpersonal', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q41', type: 'scale', question: '感到自己做得不对或有罪', dimension: 'interpersonal', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q61', type: 'scale', question: '对异性不感兴趣', dimension: 'interpersonal', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q69', type: 'scale', question: '感到害怕', dimension: 'interpersonal', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q73', type: 'scale', question: '在公共场合吃东西感到不自在', dimension: 'interpersonal', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    // 精神病性因子
    { id: 'q7', type: 'scale', question: '感到别人能控制你的思想', dimension: 'psychotic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q16', type: 'scale', question: '听到旁人听不到的声音', dimension: 'psychotic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q35', type: 'scale', question: '别人知道你的想法', dimension: 'psychotic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q62', type: 'scale', question: '有一些别人没有的想法', dimension: 'psychotic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q77', type: 'scale', question: '感到孤独，即使同别人在一起时也是如此', dimension: 'psychotic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q84', type: 'scale', question: '别人对你的成就没有作出恰当的评价', dimension: 'psychotic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q85', type: 'scale', question: '有孤独感', dimension: 'psychotic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q87', type: 'scale', question: '有想打人或伤害别人的冲动', dimension: 'psychotic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q88', type: 'scale', question: '摔东西或发脾气', dimension: 'psychotic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q90', type: 'scale', question: '想到有人会控制你的思想的想法', dimension: 'psychotic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    // 偏执因子
    { id: 'q8', type: 'scale', question: '别人对你的错误负有责任', dimension: 'paranoid', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q18', type: 'scale', question: '感到大多数人不可信任', dimension: 'paranoid', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q43', type: 'scale', question: '感到别人不理解你', dimension: 'paranoid', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q68', type: 'scale', question: '旁人对你做事的期望太高', dimension: 'paranoid', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q76', type: 'scale', question: '你认为大多数人会利用你的信任不诚实地占你的便宜', dimension: 'paranoid', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q83', type: 'scale', question: '觉得别人想占你的便宜', dimension: 'paranoid', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    // 敌对因子
    { id: 'q11', type: 'scale', question: '容易烦恼和激动', dimension: 'hostility', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q24', type: 'scale', question: '有想摔坏或打碎东西的冲动', dimension: 'hostility', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q63', type: 'scale', question: '和别人争论', dimension: 'hostility', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q67', type: 'scale', question: '大声叫喊或扔东西', dimension: 'hostility', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q74', type: 'scale', question: '常与人争论', dimension: 'hostility', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q81', type: 'scale', question: '脾气不好，好发火', dimension: 'hostility', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    // 恐怖因子
    { id: 'q13', type: 'scale', question: '感到害怕', dimension: 'phobic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q25', type: 'scale', question: '在空旷的场地或街道上感到害怕', dimension: 'phobic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q47', type: 'scale', question: '必须避开某些物体、场所或活动', dimension: 'phobic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q50', type: 'scale', question: '在公共场合感到害怕', dimension: 'phobic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q70', type: 'scale', question: '在乘电车、公共汽车或地铁时感到不自在', dimension: 'phobic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q75', type: 'scale', question: '必须有人陪着才能出门', dimension: 'phobic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q82', type: 'scale', question: '不管有没有别人在旁边你都感到孤独', dimension: 'phobic', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },

    // 其他项目（不属于主要因子）
    { id: 'q19', type: 'scale', question: '睡眠不好', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q44', type: 'scale', question: '早醒', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q59', type: 'scale', question: '有想死的念头', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q60', type: 'scale', question: '吃得太多', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q64', type: 'scale', question: '早上起来感到不舒服', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q66', type: 'scale', question: '醒得太早', dimension: 'somatization', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
    { id: 'q89', type: 'scale', question: '有罪恶感', dimension: 'depression', options: [{value: 1, label: '没有'}, {value: 2, label: '很轻'}, {value: 3, label: '中等'}, {value: 4, label: '偏重'}, {value: 5, label: '严重'}], required: true },
  ],

  scoring: {
    method: 'dimension',
    scaleRange: {
      min: 90,
      max: 450,
      description: '总分范围从90到450分，分值越高表示症状越明显'
    },
    ranges: [
      {
        min: 90,
        max: 160,
        level: '正常范围',
        description: '您的心理状态处于正常范围内，各项指标均在健康水平。',
        color: 'green',
        suggestions: [
          '保持良好的生活习惯和作息时间',
          '继续维持积极的心态',
          '适当进行体育锻炼和休闲活动'
        ]
      },
      {
        min: 161,
        max: 200,
        level: '轻度症状',
        description: '您有一些轻度的心理不适症状，可能与近期生活压力有关。',
        color: 'yellow',
        suggestions: [
          '注意调节生活压力，适当放松',
          '寻求朋友或家人的支持',
          '可以尝试一些放松技巧，如深呼吸、冥想',
          '如症状持续，建议咨询专业心理咨询师'
        ]
      },
      {
        min: 201,
        max: 300,
        level: '中度症状',
        description: '您存在中度的心理健康问题，建议重视并寻求专业帮助。',
        color: 'orange',
        suggestions: [
          '建议咨询专业心理咨询师或心理医生',
          '可能需要进行系统的心理治疗',
          '注意规律作息，避免过度劳累',
          '向亲近的人倾诉，寻求情感支持',
          '必要时可以考虑药物治疗'
        ]
      },
      {
        min: 301,
        max: 450,
        level: '重度症状',
        description: '您的症状较为严重，强烈建议立即寻求专业医疗帮助。',
        color: 'red',
        suggestions: [
          '立即联系专业心理医生或精神科医生',
          '不要独自面对，告诉家人或信任的人',
          '可能需要住院治疗或密集的心理干预',
          '严格遵医嘱服药（如有处方）',
          '如有自伤或自杀想法，请立即拨打心理危机热线：400-161-9995'
        ]
      }
    ]
  },

  references: [
    {
      title: 'Symptom Checklist-90-Revised',
      authors: 'Derogatis, L. R.',
      journal: 'Clinical Psychometric Research',
      year: 1977
    },
    {
      title: 'SCL-90症状自评量表中国常模的建立',
      authors: '金华, 吴文源, 张明园',
      journal: '中国神经精神疾病杂志',
      year: 1986
    }
  ]
};
