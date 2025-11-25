import type { QuizTemplate } from '@/types/quiz';

/**
 * Workhorse Index v3.0 (工作牛马指数测评)
 *
 * 目的：从多维度评估用户的工作是否"牛马化"
 *
 * 结构：5个维度，共20道题
 * - 客观工作负荷 (35%)：4题，最高65分
 * - 福利待遇 (20%)：5题，最高48分
 * - 工作氛围与制度 (15%)：4题，最高36分
 * - 职业发展空间 (10%)：3题，最高30分
 * - 个人心理疲惫感 (20%)：4题，最高42分
 *
 * 计分公式：
 * 维度得分 = (用户得分 / 该维度满分) × 维度权重 × 100
 * 牛马指数 = Σ 所有维度得分
 */

export const workhorse: QuizTemplate = {
  id: 'workhorse',
  title: '工作牛马指数',
  titleEn: 'Workhorse Index',
  description: '从工作负荷、福利待遇、氛围、发展和心理状态五个维度评估你的工作是否"牛马化"',
  category: '职场评估',
  purpose: '从客观工作负荷、福利待遇、工作氛围与制度、职业发展空间和个人心理疲惫感五个维度，全面评估你的工作是否"牛马化"。通过科学的加权计算和多维度分析，帮助你识别工作中的不合理状况，为职业决策提供参考。',
  duration: '6-10分钟',
  questionCount: 20,

  dimensions: [
    {
      id: 'workload',
      name: '客观工作负荷',
      description: '衡量工作时长、通勤时间、假期使用和健康影响等客观负担',
      questionIds: ['wh_1', 'wh_2', 'wh_3', 'wh_4'],
      weight: 0.35,
      maxScore: 65,
      scoreRanges: [
        {
          min: 0,
          max: 16,
          level: '轻松',
          description: '工作时长合理、通勤便利、假期充足，整体负荷较轻，身心状态良好',
          characteristics: ['工作时间适中', '通勤时间短', '假期充足', '健康状况良好'],
          suggestions: ['保持当前良好的工作生活节奏', '适当利用空余时间提升自己'],
        },
        {
          min: 16,
          max: 33,
          level: '适中',
          description: '工作负荷处于中等水平，虽有一定压力但整体可控，需要注意平衡',
          characteristics: ['工作时长中等', '通勤成本适中', '假期基本满足'],
          suggestions: ['注意工作生活平衡', '适当调整作息避免过度疲劳', '关注身体健康信号'],
        },
        {
          min: 33,
          max: 49,
          level: '较重',
          description: '客观工作负荷偏重，长时间工作或通勤时间长，需要警惕过劳风险',
          characteristics: ['工作时长偏长', '通勤成本高', '休息时间不足', '健康开始受影响'],
          suggestions: ['认真评估当前工作的可持续性', '寻找减轻负担的方法(换工作/搬家等)', '优先关注身心健康'],
        },
        {
          min: 49,
          max: 65,
          level: '极重',
          description: '工作负荷已达到危险水平，长期处于高强度工作状态，健康风险极高',
          characteristics: ['超长工作时长', '通勤极不便利', '严重缺乏休息', '健康明显恶化'],
          suggestions: ['立即关注身心健康状况', '强烈建议调整工作或生活安排', '必要时寻求专业医疗帮助'],
        },
      ],
    },
    {
      id: 'benefits',
      name: '福利待遇',
      description: '衡量收入满意度、住房和生活成本、五险一金保障及工作稳定性',
      questionIds: ['wh_5', 'wh_6', 'wh_7', 'wh_8', 'wh_9'],
      weight: 0.20,
      maxScore: 48,
      scoreRanges: [
        {
          min: 0,
          max: 12,
          level: '优秀',
          description: '收入满意度高，住房和生活成本可控，五险一金完善，工作稳定',
          characteristics: ['收入高于预期', '福利待遇完善', '生活成本合理', '工作稳定'],
          suggestions: ['珍惜当前的福利待遇', '可考虑在此基础上追求更高发展'],
        },
        {
          min: 12,
          max: 24,
          level: '良好',
          description: '整体福利待遇尚可，虽有些许压力但基本能够满足生活需求',
          characteristics: ['收入基本满意', '福利基本齐全', '生活成本可控'],
          suggestions: ['保持稳定的同时可寻求加薪或晋升机会', '合理规划财务支出'],
        },
        {
          min: 24,
          max: 36,
          level: '一般',
          description: '收入不够理想，生活成本压力较大，保障不够完善',
          characteristics: ['收入不太满意', '福利不够完善', '生活压力较大', '保障有限'],
          suggestions: ['评估是否有加薪或跳槽机会', '控制非必要开支', '考虑提升技能以增加议价能力'],
        },
        {
          min: 36,
          max: 48,
          level: '较差',
          description: '福利待遇明显偏低，经济压力大，缺乏保障，工作不稳定',
          characteristics: ['收入明显低于预期', '福利缺失', '经济压力大', '工作不稳定'],
          suggestions: ['认真考虑换工作或转行', '主动争取加薪或寻找副业', '必要时寻求职业规划师帮助'],
        },
      ],
    },
    {
      id: 'environment',
      name: '工作氛围与制度',
      description: '包括团队氛围、领导风格、制度透明度和公平性',
      questionIds: ['wh_10', 'wh_11', 'wh_12', 'wh_13'],
      weight: 0.15,
      maxScore: 36,
      scoreRanges: [
        {
          min: 0,
          max: 9,
          level: '健康',
          description: '团队氛围轻松、制度透明、领导开明，工作环境非常健康',
          characteristics: ['团队氛围融洽', '领导风格支持性', '制度透明公平', '协作顺畅'],
          suggestions: ['珍惜良好的工作环境', '积极参与团队建设', '保持开放沟通'],
        },
        {
          min: 9,
          max: 18,
          level: '普通',
          description: '工作环境中规中矩，虽有些许不足但整体可接受',
          characteristics: ['氛围一般', '制度基本透明', '偶有不公平情况但不严重'],
          suggestions: ['关注团队动态变化', '主动营造良好关系', '适当表达合理诉求'],
        },
        {
          min: 18,
          max: 27,
          level: '压抑',
          description: '工作环境存在明显问题，可能面临内卷、不公平待遇，心理压力较大',
          characteristics: ['团队氛围紧张', '领导风格问题', '制度不透明', '经常遭遇不公平对待'],
          suggestions: ['评估环境对个人发展的影响', '必要时考虑换部门或换工作', '学会情绪管理和压力释放'],
        },
        {
          min: 27,
          max: 36,
          level: '恶劣',
          description: '工作环境非常糟糕，充满敌意、不公和压迫，严重影响身心健康',
          characteristics: ['严重内卷或敌意', '领导PUA倾向', '制度混乱', '长期不公平对待'],
          suggestions: ['优先考虑身心健康，尽快离开', '收集证据保护自己权益', '寻求心理咨询支持'],
        },
      ],
    },
    {
      id: 'growth',
      name: '职业发展空间',
      description: '晋升路径、个人成长、岗位匹配度',
      questionIds: ['wh_14', 'wh_15', 'wh_16'],
      weight: 0.10,
      maxScore: 30,
      scoreRanges: [
        {
          min: 0,
          max: 8,
          level: '广阔',
          description: '职业发展前景良好，晋升通道清晰、能持续学习成长、岗位与能力匹配',
          characteristics: ['晋升路径明确', '持续学习机会多', '岗位充分发挥能力'],
          suggestions: ['把握发展机会积极进取', '制定清晰的职业规划', '持续提升专业能力'],
        },
        {
          min: 8,
          max: 15,
          level: '有限',
          description: '发展空间有一定局限，虽有成长机会但不够充分',
          characteristics: ['晋升通道存在但不明确', '成长机会有限', '岗位部分匹配能力'],
          suggestions: ['主动寻找学习提升机会', '与上级沟通职业发展路径', '考虑是否需要换岗或跳槽'],
        },
        {
          min: 15,
          max: 23,
          level: '狭窄',
          description: '职业发展空间较为狭窄，晋升困难、学习机会少',
          characteristics: ['晋升机会少', '工作内容重复', '能力未得到充分发挥'],
          suggestions: ['认真评估当前岗位价值', '积极寻找新机会', '通过跳槽或转岗寻求突破'],
        },
        {
          min: 23,
          max: 30,
          level: '停滞',
          description: '职业发展几乎陷入停滞，无晋升可能、无法学到新技能',
          characteristics: ['完全没有晋升可能', '工作停滞无成长', '严重大材小用'],
          suggestions: ['立即开始寻找新工作', '重新规划职业方向', '避免在无价值岗位上浪费时间'],
        },
      ],
    },
    {
      id: 'mental',
      name: '个人心理疲惫感',
      description: '主观层面的情绪疲劳、意义感缺失、倦怠和离职意向',
      questionIds: ['wh_17', 'wh_18', 'wh_19', 'wh_20'],
      weight: 0.20,
      maxScore: 42,
      scoreRanges: [
        {
          min: 0,
          max: 10,
          level: '良好',
          description: '心理状态健康，对工作保持积极态度，能感受到工作的意义和价值',
          characteristics: ['情绪状态积极', '工作意义感强', '无明显疲惫感'],
          suggestions: ['保持积极心态', '继续发展职业兴趣', '分享正能量给团队'],
        },
        {
          min: 10,
          max: 21,
          level: '轻度疲惫',
          description: '开始出现轻度的心理疲惫，偶尔感到压榨或意义感缺失',
          characteristics: ['偶尔抗拒上班', '意义感有所减弱', '轻度疲惫可自我调节'],
          suggestions: ['及时调整心态和工作节奏', '寻找工作中的积极意义', '培养工作之外的兴趣爱好'],
        },
        {
          min: 21,
          max: 32,
          level: '中度倦怠',
          description: '心理疲惫已达到中度水平，经常感到被压榨、工作意义感弱',
          characteristics: ['经常抗拒上班', '强烈的被压榨感', '意义感严重缺失'],
          suggestions: ['认真评估工作对心理的影响', '考虑休假调整状态', '必要时寻求心理咨询', '考虑换工作'],
        },
        {
          min: 32,
          max: 42,
          level: '严重倦怠',
          description: '已陷入严重的职业倦怠，每天都想逃离、完全感受不到意义',
          characteristics: ['每天都想逃离', '持续强烈的被压榨感', '完全无意义感'],
          suggestions: ['立即关注心理健康', '强烈建议休假或离职', '寻求专业心理咨询', '重新思考职业方向和人生目标'],
        },
      ],
    },
  ],

  questions: [
    // 维度1：客观工作负荷 (35%)
    {
      id: 'wh_1',
      type: 'single',
      question: '你的平均每周工作时长（包含加班）是？',
      options: [
        { value: 0, label: '少于 40 小时' },
        { value: 5, label: '40–50 小时' },
        { value: 12, label: '50–60 小时' },
        { value: 20, label: '超过 60 小时' },
      ],
      required: true,
    },
    {
      id: 'wh_2',
      type: 'single',
      question: '你平均单程通勤时间？',
      options: [
        { value: 0, label: '少于 10 分钟' },
        { value: 3, label: '10–30 分钟' },
        { value: 8, label: '30–60 分钟' },
        { value: 15, label: '超过 60 分钟' },
      ],
      required: true,
    },
    {
      id: 'wh_3',
      type: 'single',
      question: '假期的使用情况？',
      options: [
        { value: 0, label: '可自由安排，审批顺畅' },
        { value: 5, label: '需要提前申请，通常能批准' },
        { value: 10, label: '审批困难，经常被拖延或拒绝' },
        { value: 15, label: '有假期但几乎无法使用/公司无假期制度' },
      ],
      required: true,
    },
    {
      id: 'wh_4',
      type: 'single',
      question: '工作对你身体健康的影响？',
      options: [
        { value: 0, label: '无明显影响，身体状况良好' },
        { value: 5, label: '偶尔感到疲劳，休息后可恢复' },
        { value: 10, label: '经常身体不适(失眠/颈椎/肠胃问题等)' },
        { value: 15, label: '健康状况明显恶化(体检指标异常/需就医)' },
      ],
      required: true,
    },

    // 维度2：福利待遇 (20%)
    {
      id: 'wh_5',
      type: 'single',
      question: '你对你工作收入（包含奖金和各类补贴）的满意程度？',
      options: [
        { value: 0, label: '非常满意，远超预期' },
        { value: 3, label: '比较满意，符合预期' },
        { value: 6, label: '一般，勉强接受' },
        { value: 9, label: '不太满意，低于预期' },
        { value: 12, label: '非常不满意，远低于预期' },
      ],
      required: true,
    },
    {
      id: 'wh_6',
      type: 'single',
      question: '你每月住房成本(房租/房贷)占收入比例？',
      options: [
        { value: 0, label: '无住房成本(自有住房已还清/与家人同住)' },
        { value: 3, label: '＜ 30%' },
        { value: 6, label: '30–50%' },
        { value: 9, label: '50–70%' },
        { value: 12, label: '≥70%' },
      ],
      required: true,
    },
    {
      id: 'wh_7',
      type: 'single',
      question: '扣除住房成本后，你每月其他生活开销(饮食、交通、日常消费等)占收入比例？',
      options: [
        { value: 0, label: '＜ 20%' },
        { value: 3, label: '20–40%' },
        { value: 6, label: '40–60%' },
        { value: 9, label: '≥60%(经常入不敷出)' },
      ],
      required: true,
    },
    {
      id: 'wh_8',
      type: 'single',
      question: '公司五险一金等保障是否完善？',
      options: [
        { value: 0, label: '足额缴纳，保障完善' },
        { value: 4, label: '缴纳但不全额' },
        { value: 8, label: '有些险种缺失' },
        { value: 12, label: '基本没给或完全没给' },
      ],
      required: true,
    },
    {
      id: 'wh_9',
      type: 'single',
      question: '工作是否稳定？',
      options: [
        { value: 0, label: '非常稳定(事业编/国企/大厂核心岗位)' },
        { value: 3, label: '较稳定(正规公司/稳定合同)' },
        { value: 6, label: '不太稳定(短期合同/项目制)' },
        { value: 9, label: '很不稳定(随时可能被裁/临时工)' },
      ],
      required: true,
    },

    // 维度3：工作氛围与制度 (15%)
    {
      id: 'wh_10',
      type: 'single',
      question: '团队工作氛围如何？',
      options: [
        { value: 0, label: '轻松友好，同事关系融洽' },
        { value: 4, label: '中性，正常工作关系' },
        { value: 8, label: '较紧张，竞争压力明显' },
        { value: 12, label: '高度紧张/内卷严重/充满敌意' },
      ],
      required: true,
    },
    {
      id: 'wh_11',
      type: 'single',
      question: '直属上级的管理风格？',
      options: [
        { value: 0, label: '尊重下属，善于沟通' },
        { value: 4, label: '中规中矩，任务导向' },
        { value: 8, label: '控制欲强/微观管理/难以沟通' },
        { value: 12, label: '情绪化/言语打压/有 PUA 倾向' },
      ],
      required: true,
    },
    {
      id: 'wh_12',
      type: 'single',
      question: '公司规章制度的透明度？',
      options: [
        { value: 0, label: '透明公开，有明确的制度文件' },
        { value: 3, label: '大体透明，偶有模糊地带' },
        { value: 6, label: '不够透明，经常朝令夕改' },
        { value: 9, label: '混乱不透明，全凭领导口头决定' },
      ],
      required: true,
    },
    {
      id: 'wh_13',
      type: 'single',
      question: '工作中是否遭遇过不公平对待(如分配不均、区别对待等)？',
      options: [
        { value: 0, label: '没有，整体公平' },
        { value: 3, label: '偶尔有，但不严重' },
        { value: 6, label: '经常遭遇不公平对待' },
        { value: 9, label: '严重且长期的不公平对待' },
      ],
      required: true,
    },

    // 维度4：职业发展空间 (10%)
    {
      id: 'wh_14',
      type: 'single',
      question: '岗位晋升通道如何？',
      options: [
        { value: 0, label: '清晰透明，有明确的晋升标准和路径，且晋升难度不大' },
        { value: 3, label: '有晋升通道但标准不够明确或者晋升难度较大' },
        { value: 7, label: '晋升难度很大或者靠领导喜好或关系' },
        { value: 10, label: '几乎没有晋升机会(岗位天花板/公司无晋升制度)' },
      ],
      required: true,
    },
    {
      id: 'wh_15',
      type: 'single',
      question: '当前工作对你的技能提升和个人成长帮助如何？',
      options: [
        { value: 0, label: '很大，能持续学到新知识新技能' },
        { value: 3, label: '有一定帮助，但成长空间有限' },
        { value: 7, label: '较小，工作内容重复机械' },
        { value: 10, label: '几乎没有，完全停滞甚至退步' },
      ],
      required: true,
    },
    {
      id: 'wh_16',
      type: 'single',
      question: '岗位与你的学历/能力匹配程度？',
      options: [
        { value: 0, label: '高度匹配，能充分发挥能力' },
        { value: 3, label: '基本匹配，略有大材小用' },
        { value: 7, label: '明显低配，能力远超岗位要求' },
        { value: 10, label: '严重低配，完全浪费学历和能力' },
      ],
      required: true,
    },

    // 维度5：个人心理疲惫感 (20%)
    {
      id: 'wh_17',
      type: 'single',
      question: '你最近对上班的情绪状态？',
      options: [
        { value: 0, label: '积极或平和，能正常面对工作' },
        { value: 4, label: '偶尔抗拒，但可以调节' },
        { value: 8, label: '经常抗拒，周日晚上就开始焦虑' },
        { value: 12, label: '严重抗拒，每天都想逃离' },
      ],
      required: true,
    },
    {
      id: 'wh_18',
      type: 'single',
      question: '工作中"被压榨"的感受程度？',
      options: [
        { value: 0, label: '没有，付出与回报基本匹配' },
        { value: 3, label: '偶尔有，但可以接受' },
        { value: 6, label: '经常有，付出远大于回报' },
        { value: 9, label: '持续强烈，感觉被当作工具使用' },
      ],
      required: true,
    },
    {
      id: 'wh_19',
      type: 'single',
      question: '你对当前工作的意义感认知？',
      options: [
        { value: 0, label: '很有意义，工作与价值观契合' },
        { value: 3, label: '有一定意义，但不强烈' },
        { value: 6, label: '意义感很弱，只是为了生存' },
        { value: 9, label: '完全感受不到意义，纯粹浪费时间' },
      ],
      required: true,
    },
    {
      id: 'wh_20',
      type: 'single',
      question: '是否有跳槽打算？',
      options: [
        { value: 0, label: '没有，对当前工作很满意' },
        { value: 3, label: '暂时没有，但会关注机会' },
        { value: 6, label: '有打算，正在准备或投简历' },
        { value: 9, label: '非常迫切，随时准备离职' },
      ],
      required: true,
    },
  ],

  scoring: {
    method: 'custom',
    scaleRange: {
      min: 0,
      max: 100,
      description: '牛马指数范围为0-100分，得分越高表示工作越"牛马化"',
    },
    ranges: [
      {
        min: 0,
        max: 20,
        level: '人间清醒打工人',
        emoji: '🐴',
        color: '#10b981',
        title: '完全不牛马',
        description: '你的工作属于"能当成生活背景音"的那种，羡煞一众加班战损体。综合五个维度来看，你的工作总体压力轻、制度友好、待遇尚可、氛围不压人，你的心理疲惫度也不高。换句话说：你不是被工作推着跑，而是你挑着工作走。这样的得分说明"牛马化"在你这里完全不成立，你甚至可能是朋友圈里最有生活质量的那个上班族。',
        suggestions: [
          '保持当前良好的工作生活节奏',
          '适当利用空余时间提升自己',
          '珍惜当前的工作环境',
        ],
      },
      {
        min: 20,
        max: 40,
        level: '轻微劳损但还能笑',
        emoji: '🐾',
        color: '#84cc16',
        title: '略带牛马影子',
        description: '偶尔觉得累，但还不至于想立刻辞职跑路。你的得分显示：有时候工作会让你感到疲惫，但整体仍在可控范围。制度和氛围可能有点小毛病，工资福利也许不算亮眼，但还不至于让你彻底绝望。你像是"轻度风湿"：阴天下雨（工作忙）会喊两声，但平时还能开心生活。距离牛马还有明显距离，但隐隐有点苗头。',
        suggestions: [
          '开始关注工作生活平衡',
          '定期评估工作压力和回报',
          '适当调整工作节奏，避免过度透支',
        ],
      },
      {
        min: 40,
        max: 60,
        level: '标准打工体质',
        emoji: '🐎',
        color: '#f59e0b',
        title: '轻度牛马化',
        description: '不至于崩溃，但明显能感受到：这活不是人干的。你处于典型的"累，但还能撑；苦，但还能忍"的阶段。工作负荷不轻、制度可能有点死板、职业发展不够清晰，待遇也不一定匹配付出。心理疲惫感开始稳定出现，但还没到"我要离职"的边缘。属于大多数打工人每天一醒来都在心里默默问自己一句："今天到底值不值得？"',
        suggestions: [
          '认真评估当前工作的价值和意义',
          '考虑是否需要调整工作状态或寻找新机会',
          '关注身心健康，必要时寻求专业帮助',
          '开始制定职业发展的B计划',
        ],
      },
      {
        min: 60,
        max: 80,
        level: '高压韧性打工者',
        emoji: '🔥',
        color: '#f97316',
        title: '中度牛马化',
        description: '你不是牛马，但你工作的方式……很牛马。你的各维度得分指向明显压力：高负荷、多任务、制度紧绷，对职业发展的想象空间也有限。心理疲惫感明显，福利待遇可能不能完全抵消这份消耗。你像是不小心进了"高压锅模式"却一直没找到暂停键。你仍然坚韧、有能力，也努力，但这份投入换来的幸福值有点不划算。',
        suggestions: [
          '强烈建议评估当前工作的可持续性',
          '考虑主动寻找新的工作机会',
          '优先关注身心健康，避免过劳',
          '如有必要，咨询职业规划师或心理咨询师',
          '开始着手准备职业转型',
        ],
      },
      {
        min: 80,
        max: 100,
        level: '职场顶级劳模体',
        emoji: '🔥🐴',
        color: '#ef4444',
        title: '高度牛马化',
        description: '你的工作环境属于：只差马鞍和草料。你的得分已经呈现典型"牛马化"特征：负荷大、制度紧、福利不匹配、发展受限、氛围压人、疲惫指数爆表。你可能常常觉得"做多少都不够"，你的身心能量一直在被快速消耗。看到这个分数，一般人可能会沉默两秒，然后开始劝你："要不……先考虑下自己？" 如果你正在寻找改变，这个结果是一次非常明确的提醒。',
        suggestions: [
          '立即关注身心健康状况',
          '强烈建议开始寻找新工作',
          '考虑休假或暂时离职调整状态',
          '寻求专业心理咨询支持',
          '重新评估职业规划和人生目标',
          '不要犹豫，改变是必要的',
        ],
      },
    ],
  },

  instructions: '请根据你当前的实际工作情况，选择最符合的选项。每个问题只能选择一个答案。',

  // 自定义计算函数
  calculateResults: (answers: Record<string, number>) => {
    // 维度配置
    const dimensions = [
      { id: 'workload', questionIds: ['wh_1', 'wh_2', 'wh_3', 'wh_4'], maxScore: 65, weight: 0.35, name: '客观工作负荷' },
      { id: 'benefits', questionIds: ['wh_5', 'wh_6', 'wh_7', 'wh_8', 'wh_9'], maxScore: 48, weight: 0.20, name: '福利待遇' },
      { id: 'environment', questionIds: ['wh_10', 'wh_11', 'wh_12', 'wh_13'], maxScore: 36, weight: 0.15, name: '工作氛围与制度' },
      { id: 'growth', questionIds: ['wh_14', 'wh_15', 'wh_16'], maxScore: 30, weight: 0.10, name: '职业发展空间' },
      { id: 'mental', questionIds: ['wh_17', 'wh_18', 'wh_19', 'wh_20'], maxScore: 42, weight: 0.20, name: '个人心理疲惫感' },
    ];

    // 计算各维度得分和原始分数
    const dimensionScores: Record<string, number> = {};
    const dimensionRawScores: Record<string, number> = {};
    let totalScore = 0;

    dimensions.forEach(dimension => {
      let rawScore = 0;
      dimension.questionIds.forEach(qId => {
        rawScore += answers[qId] || 0;
      });

      // 保存原始分数
      dimensionRawScores[dimension.id] = rawScore;

      // 维度得分 = (用户得分 / 该维度满分) × 维度权重 × 100
      const dimensionScore = (rawScore / dimension.maxScore) * dimension.weight * 100;
      dimensionScores[dimension.id] = Math.round(dimensionScore * 10) / 10; // 保留一位小数
      totalScore += dimensionScore;
    });

    // 总分取整
    totalScore = Math.round(totalScore);

    // 为每个维度匹配等级评价
    const dimensionEvaluations = dimensions.map(dimension => {
      const rawScore = dimensionRawScores[dimension.id];
      // 从workhorse.dimensions中获取scoreRanges
      const dimensionConfig = workhorse.dimensions!.find(d => d.id === dimension.id)!;
      const scoreRange = dimensionConfig.scoreRanges!.find(
        range => rawScore >= range.min && rawScore < range.max
      );
      // 如果没找到，使用最后一个区间
      const finalRange = scoreRange || dimensionConfig.scoreRanges![dimensionConfig.scoreRanges!.length - 1];

      return {
        id: dimension.id,
        name: dimension.name,
        rawScore,
        level: finalRange.level,
        description: finalRange.description,
        characteristics: finalRange.characteristics,
        suggestions: finalRange.suggestions,
        // 计算归一化分数(0-100)用于排序
        normalizedScore: (rawScore / dimension.maxScore) * 100,
      };
    });

    // 生成智能综合简评
    // 1. 找出表现最好的维度(分数最低)和最差的维度(分数最高)
    const sortedByScore = [...dimensionEvaluations].sort((a, b) => a.normalizedScore - b.normalizedScore);
    const bestDimensions = sortedByScore.slice(0, 2); // 最好的2个维度
    const worstDimensions = sortedByScore.slice(-2).reverse(); // 最差的2个维度

    // 2. 生成个性化简评
    let interpretation = '';
    const dimensionNameMap: Record<string, string> = {
      workload: '工作负荷',
      benefits: '福利待遇',
      environment: '工作氛围',
      growth: '职业发展',
      mental: '心理状态',
    };

    if (totalScore <= 20) {
      interpretation = `你的工作整体状态良好。在**${dimensionNameMap[bestDimensions[0].id]}**方面${bestDimensions[0].level}，**${dimensionNameMap[bestDimensions[1].id]}**也${bestDimensions[1].level}，展现出健康的职场生态。继续保持这种平衡，你像是职场里的"自由灵魂"。`;
    } else if (totalScore <= 40) {
      interpretation = `你的工作状态有些许压力但整体可控。虽然**${dimensionNameMap[worstDimensions[0].id]}**方面${worstDimensions[0].level}，但**${dimensionNameMap[bestDimensions[0].id]}**${bestDimensions[0].level}。注意节奏调整，避免长期处于"半牛马"状态。`;
    } else if (totalScore <= 60) {
      interpretation = `你的工作存在明显的不平衡。**${dimensionNameMap[worstDimensions[0].id]}**和**${dimensionNameMap[worstDimensions[1].id]}**方面${worstDimensions[0].level}，给你带来较大压力。虽然**${dimensionNameMap[bestDimensions[0].id]}**${bestDimensions[0].level}，但整体付出与回报不太匹配，需要认真评估是否值得长期坚持。`;
    } else if (totalScore <= 80) {
      interpretation = `你的工作状态令人担忧。**${dimensionNameMap[worstDimensions[0].id]}**${worstDimensions[0].level}，**${dimensionNameMap[worstDimensions[1].id]}**也${worstDimensions[1].level}，已经处于典型的被动付出状态。这种状态往往难以持续，建议尽快寻找改善途径。`;
    } else {
      interpretation = `你的工作状态已达到危险水平。**${dimensionNameMap[worstDimensions[0].id]}**和**${dimensionNameMap[worstDimensions[1].id]}**均${worstDimensions[0].level}，你几乎在为公司燃烧生命。请立即关注身心健康，必要时考虑改变方向。`;
    }

    // 判断总体等级
    const scoreRange = workhorse.scoring!.ranges!.find(r => totalScore >= r.min && totalScore < r.max);
    const finalScoreRange = scoreRange || workhorse.scoring!.ranges![workhorse.scoring!.ranges!.length - 1];

    return {
      totalScore,
      interpretation,
      recommendations: finalScoreRange.suggestions || [],
      // dimensionScores按照类型定义应该是数组格式
      dimensionScores: dimensions.map(d => ({
        dimension: d.name,
        score: dimensionScores[d.id],
      })),
      metadata: {
        level: finalScoreRange.level,
        emoji: finalScoreRange.emoji,
        title: finalScoreRange.title,
        // 维度得分字典(供内部使用)
        dimensionScoresMap: dimensionScores,
        // 维度详细评价信息
        dimensionEvaluations: dimensionEvaluations.map(de => ({
          id: de.id,
          name: de.name,
          score: dimensionScores[de.id],
          rawScore: de.rawScore,
          level: de.level,
          description: de.description,
          characteristics: de.characteristics,
          suggestions: de.suggestions,
        })),
        // 保留原有的简化版本供兼容
        dimensions: dimensions.map(d => ({
          id: d.id,
          name: d.name,
          score: dimensionScores[d.id],
          weight: (d.weight * 100).toFixed(0) + '%',
        })),
      },
    };
  },
};
