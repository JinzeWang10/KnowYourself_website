# 测评开发标准化流程

> 本文档描述了从需求到上线的完整测评开发流程，确保每个测评都遵循统一的标准。

---

## 📋 开发前准备

### 1. 获取并验证需求
- [ ] 收到完整填写的 `assessment-template.md`
- [ ] 验证量表ID唯一性 (检查 `lib/scales/index.ts`)
- [ ] 确认分类正确 (心理健康/人格测评/职场生活/人际情感)
- [ ] 审核计分规则的可行性
- [ ] 确认特殊需求的技术可行性

### 2. 理解量表逻辑
- [ ] 阅读量表目的和理论依据
- [ ] 理解维度划分的心理学意义
- [ ] 确认计分方式 (简单求和/维度加权/自定义算法)
- [ ] 明确反向题处理规则
- [ ] 理解结果解读的分数段划分逻辑

### 3. 确定实现方案
根据量表特点选择实现方式:

| 量表类型 | 实现方式 | 参考示例 |
|---------|---------|---------|
| 简单求和，标准维度 | 标准实现 | ESS, INI |
| 需要角色匹配 | 自定义 calculateResults | ZHZ, Zootopia |
| 需要年龄对比 | 自定义 calculateResults + metadata | PAT |
| 复杂维度计分 | 自定义 calculateResults | ANI, EQ, Workhorse |

---

## 🏗️ 开发步骤

### 步骤 1: 创建量表数据文件

**文件路径**: `lib/scales/{scaleId}.ts`

**任务**:
1. 导入类型定义
   ```typescript
   import type { QuizTemplate } from '@/types/quiz';
   ```

2. 创建量表对象，填写基础信息
   ```typescript
   export const {scaleId}: QuizTemplate = {
     id: '{scaleId}',
     title: '{量表标题}',
     titleEn: '{English Title}',
     description: '{简短描述}',
     category: '{分类}',
     purpose: '{详细目的}',
     duration: '{时长}',
     questionCount: {题目数},
   ```

3. 添加所有题目
   - 确保每个题目有唯一ID
   - 正确设置 `dimension` 字段
   - 反向题标记 `reversed: true`
   - 选项值必须是数字 (1-5 或 1-7)

4. 定义维度
   - 维度ID使用英文下划线命名
   - 确保 `questionIds` 数组完整且正确
   - 维度描述清晰明了

5. 配置计分规则
   - 设置 `scaleRange` (min/max)
   - 定义所有分数段 (`ranges`)
   - 每个分数段包含: min, max, level, description, color, suggestions

6. 添加参考文献
   - 至少包含标题
   - 尽量补充作者、年份、期刊、DOI

**检查清单**:
- [ ] 文件已创建在正确路径
- [ ] 题目数量与 `questionCount` 一致
- [ ] 所有题目ID唯一
- [ ] 反向题正确标记
- [ ] 维度的 `questionIds` 完整且正确
- [ ] 分数段覆盖所有可能分数，无遗漏或重叠
- [ ] 导出量表对象: `export const {scaleId}: QuizTemplate = ...`

---

### 步骤 2: 实现自定义计算逻辑 (如需要)

**何时需要**:
- 需要角色匹配 (如 ZHZ, Zootopia)
- 需要特殊计分算法 (如 ANI 的多维度复杂计分)
- 需要额外元数据 (如 PAT 的心理年龄)

**任务**:

#### 2.1 简单自定义计算 (在量表文件中)
```typescript
calculateResults: (answers: Record<string, number>) => {
  // 1. 计算总分和维度分
  let totalScore = 0;
  const dimensionScores = [];

  // 2. 应用自定义逻辑
  // ...

  // 3. 返回结果
  return {
    totalScore,
    dimensionScores,
    interpretation: '...',
    recommendations: [...],
    metadata: { ... }, // 可选
  };
}
```

#### 2.2 复杂自定义计算 (独立文件)
如果逻辑复杂，创建独立文件: `lib/calculate{ScaleId}.ts`

**示例**: `lib/calculateANI.ts`, `lib/scales/zhz.ts` 中的 `calculateZHZResults`

**检查清单**:
- [ ] 计算逻辑正确实现
- [ ] 返回值格式符合类型定义
- [ ] 处理了边界情况 (如答案缺失)
- [ ] 添加了必要的注释
- [ ] 如有独立文件，已正确导出函数

---

### 步骤 3: 注册量表

**文件路径**: `lib/scales/index.ts`

**任务**:
1. 导入新量表
   ```typescript
   import { {scaleId} } from './{scaleId}';
   ```

2. 添加到量表数组
   ```typescript
   const scales: QuizTemplate[] = [
     // ... 现有量表
     {scaleId},
   ];
   ```

3. 更新分类配置 (如需要)
   ```typescript
   export const SCALE_CATEGORIES: ScaleCategory[] = [
     {
       id: 'clinical', // 或其他分类
       name: '心理健康',
       emoji: '📊',
       description: '...',
       scaleIds: ['ess', 'bes', 'ani', '{scaleId}'], // 添加新量表ID
     },
     // ...
   ];
   ```

**检查清单**:
- [ ] 量表已导入
- [ ] 量表已添加到 `scales` 数组
- [ ] 量表ID已添加到正确的分类中
- [ ] 重启开发服务器后，首页能看到新量表

---

### 步骤 4: 实现答题逻辑集成 (如需要)

**文件路径**: `app/scales/[scaleId]/quiz/page.tsx`

**何时需要**: 当使用自定义 `calculateResults` 时

**任务**:
在 `handleSubmitWithAnswers` 函数中，添加针对新量表的处理逻辑:

```typescript
// {量表名称} 量表使用自定义计算
if (scaleId === '{scaleId}') {
  // 1. 调用自定义计算函数
  const customResult = calculateCustom(convertedAnswers);
  // 或: scale.calculateResults(convertedAnswers);

  // 2. 创建结果对象
  const result: QuizResult = {
    id: `result-${Date.now()}`,
    quizId: scale.id,
    quizTitle: scale.title,
    score: customResult.totalScore,
    level: customResult.level || '...',
    completedAt: new Date(),
    answers: Object.entries(convertedAnswers).map(...),
    dimensionScores: { ... },
    report: {
      summary: customResult.interpretation,
      details: [],
      recommendations: customResult.recommendations || [],
    },
    metadata: customResult.metadata, // 可选
  };

  // 3. 提交到后台 (如果有用户信息)
  if (userInfo) {
    const userId = getOrCreateUserId();
    const submission: AssessmentSubmission = { ... };
    submitAssessmentRecord(submission).catch(err => {
      console.error('提交测评记录失败:', err);
    });
  }

  // 4. 保存到历史记录
  const history = JSON.parse(localStorage.getItem('quiz-history') || '[]');
  const existingIndex = history.findIndex((r: QuizResult) => r.id === result.id);
  if (existingIndex === -1) {
    history.push(result);
    localStorage.setItem('quiz-history', JSON.stringify(history));
  }

  // 5. 清除进度并跳转
  localStorage.removeItem(`quiz-progress-${scaleId}`);
  router.push(`/scales/${scaleId}/result/${result.id}`);
  return;
}
```

**位置**: 在其他自定义量表处理之后，"其他量表使用常规计算"之前

**检查清单**:
- [ ] 自定义计算函数正确调用
- [ ] 结果对象格式正确
- [ ] 后台提交逻辑完整
- [ ] 历史记录保存正确
- [ ] 路由跳转正确

**注意**: 如果使用标准计分 (简单求和)，此步骤可跳过

---

### 步骤 5: 实现结果展示页 (如需要特殊展示)

**文件路径**: `app/scales/[scaleId]/result/[resultId]/page.tsx`

**何时需要**:
- 需要特殊的结果展示 (如角色匹配、年龄对比)
- 标准结果页无法满足需求

**默认行为**:
系统会自动使用通用结果页展示:
- 总分和等级
- 分数段描述
- 维度雷达图 (如有)
- 建议列表
- 百分位数 (如有足够样本)

**任务** (仅当需要自定义时):
1. 创建独立的结果页组件
2. 从 localStorage 或 URL 读取结果数据
3. 实现自定义可视化 (如角色卡片、年龄对比图)
4. 保持与其他结果页的一致性 (Header, Footer, 样式)

**参考示例**:
- ZHZ/Zootopia: 角色匹配展示
- PAT: 心理年龄对比

**检查清单**:
- [ ] 结果数据正确读取
- [ ] UI/UX 与其他测评一致
- [ ] 响应式设计 (移动端适配)
- [ ] 分享功能正常
- [ ] 返回首页链接正常

---

### 步骤 6: 测试量表功能

**功能测试**:
- [ ] 首页能看到新量表卡片
- [ ] 点击卡片进入量表介绍页
- [ ] 介绍页信息完整 (标题、描述、题目数、时长)
- [ ] 点击"开始测评"进入答题页
- [ ] 所有题目显示正确
- [ ] 选项点击响应正常
- [ ] 进度条正确更新
- [ ] 上一题/下一题功能正常
- [ ] 答题进度自动保存到 localStorage
- [ ] 刷新页面后进度恢复
- [ ] 提交后跳转到结果页

**计分测试**:
- [ ] 手动构造测试答案，验证总分计算
- [ ] 验证反向题计分正确 (5点量表: 6-x)
- [ ] 验证维度分数计算正确
- [ ] 验证分数段匹配正确
- [ ] 边界情况: 最低分、最高分、临界分

**数据提交测试**:
- [ ] 检查浏览器 Network 面板，POST /api/assessments 成功 (200)
- [ ] 检查数据库，记录已保存
- [ ] 用户信息 (性别、年龄) 正确关联
- [ ] dimensionScores 正确存储 (JSON 格式)

**结果展示测试**:
- [ ] 总分和等级显示正确
- [ ] 分数段描述显示正确
- [ ] 维度雷达图正确 (如适用)
- [ ] 建议列表完整
- [ ] 百分位数显示正确 (如有样本)
- [ ] 分享功能正常

**跨浏览器测试**:
- [ ] Chrome
- [ ] Safari (如适用)
- [ ] Firefox (如适用)
- [ ] 移动端浏览器

---

### 步骤 7: 代码审查和优化

**代码质量**:
- [ ] 代码格式规范 (使用 Prettier)
- [ ] 类型定义完整，无 TypeScript 错误
- [ ] 变量命名语义化
- [ ] 函数职责单一
- [ ] 避免重复代码

**性能优化**:
- [ ] 题目数据静态化，无不必要的运行时计算
- [ ] 避免在渲染中进行复杂计算
- [ ] localStorage 操作节流 (已有防抖)

**安全性**:
- [ ] 用户输入已验证 (API 层面已有验证)
- [ ] XSS 防护 (React 自动转义)
- [ ] 数据敏感性检查 (不存储真实姓名、手机号等)

**可维护性**:
- [ ] 添加必要的注释 (维度说明、计分逻辑)
- [ ] 复杂逻辑有文档说明
- [ ] 参考文献真实可查

---

### 步骤 8: 准备上线

**文档准备**:
- [ ] 更新 `assessment-template.md` (标记为已完成)
- [ ] 如有特殊说明，添加到项目 README 或文档

**数据库准备**:
- [ ] 确认 Prisma schema 支持新量表 (通常无需修改)
- [ ] 生产环境数据库已迁移 (如有 schema 变更)

**部署检查**:
- [ ] 本地构建成功: `npm run build`
- [ ] 无 TypeScript 编译错误
- [ ] 无 ESLint 警告 (严重级别)
- [ ] 生产环境预览正常: `npm start`

**监控准备**:
- [ ] 添加到分析面板的量表列表 (如适用)
- [ ] 配置日志监控 (如适用)

---

## 🔄 标准化实现模式

### 模式 1: 简单求和量表 (最常见)

**适用场景**: 所有题目等权重，简单求和，标准维度

**示例**: ESS, INI, BES

**实现**:
1. 在量表文件中定义完整的 `QuizTemplate`
2. 不需要 `calculateResults`
3. 系统自动使用 `lib/scales/index.ts` 中的:
   - `calculateScore()` - 处理总分和反向题
   - `calculateDimensionScores()` - 计算维度分
   - `getScoreLevel()` - 匹配分数段

**优点**: 实现简单，代码少，易维护

---

### 模式 2: 自定义计算量表

**适用场景**: 需要特殊计分算法、角色匹配、复杂维度处理

**示例**: ZHZ, ANI, PAT, Workhorse, Zootopia

**实现**:
1. 在量表文件中定义 `QuizTemplate`
2. 实现 `calculateResults` 函数 (可在量表文件内或独立文件)
3. 在 `app/scales/[scaleId]/quiz/page.tsx` 中添加特殊处理
4. 可选: 创建自定义结果页

**优点**: 灵活性高，可实现复杂逻辑

**缺点**: 代码量大，需要更多测试

---

### 模式 3: 混合模式

**适用场景**: 标准计分 + 额外元数据

**示例**: EQ (标准计分 + 正反向题特殊处理)

**实现**:
1. 使用标准 `QuizTemplate`
2. 实现轻量级 `calculateResults` 仅处理特殊逻辑
3. 其余使用系统默认函数

**优点**: 平衡简洁性和灵活性

---

## 📊 测评类型快速参考

| 量表 | 类型 | 计分方式 | 特殊功能 | 参考实现 |
|------|------|---------|---------|---------|
| ESS | 简单 | 求和 | 反向题 | 模式1 |
| INI | 简单 | 求和 | 多分数段 | 模式1 |
| BES | 简单 | 求和 | - | 模式1 |
| ANI | 复杂 | 自定义 | 多维度复杂计分 | 模式2 + 独立文件 |
| PAT | 复杂 | 自定义 | 心理年龄计算 | 模式2 + metadata |
| ZHZ | 复杂 | 自定义 | 角色匹配 | 模式2 + 自定义结果页 |
| Zootopia | 复杂 | 自定义 | 角色匹配 | 模式2 + 自定义结果页 |
| Workhorse | 复杂 | 自定义 | 维度解读 | 模式2 |
| EQ | 混合 | 自定义 | 正反向题 | 模式3 |

---

## ⚠️ 常见陷阱和注意事项

### 1. 题目ID管理
❌ **错误**: 使用重复或不一致的ID
```typescript
{ id: 'q1', ... },
{ id: 'q1', ... }, // 重复!
```

✅ **正确**: 使用唯一、有规律的ID
```typescript
{ id: 'ess_1', ... },
{ id: 'ess_2', ... },
```

### 2. 反向题计分
❌ **错误**: 忘记标记反向题
```typescript
{
  id: 'ess_1',
  question: '当我感到焦虑时，我很难集中注意力。', // 负向描述
  // 缺少 reversed: true
}
```

✅ **正确**: 明确标记
```typescript
{
  id: 'ess_1',
  question: '当我感到焦虑时，我很难集中注意力。',
  reversed: true, // 反向计分
}
```

### 3. 分数段覆盖
❌ **错误**: 分数段有遗漏或重叠
```typescript
ranges: [
  { min: 80, max: 100, ... },
  { min: 60, max: 79, ... },
  { min: 40, max: 60, ... }, // 60分重叠!
  // 缺少 20-39
]
```

✅ **正确**: 完整覆盖，无重叠
```typescript
ranges: [
  { min: 80, max: 100, ... },
  { min: 60, max: 79, ... },
  { min: 40, max: 59, ... },
  { min: 20, max: 39, ... },
]
```

### 4. 维度题目关联
❌ **错误**: questionIds 与实际题目不匹配
```typescript
dimensions: [
  {
    id: 'dim1',
    questionIds: ['q1', 'q2', 'q3'], // q3 不存在
  }
]
```

✅ **正确**: 确保所有ID真实存在
```typescript
dimensions: [
  {
    id: 'dim1',
    questionIds: ['q1', 'q2'], // 与题目列表一致
  }
]
```

### 5. 自定义计算返回值
❌ **错误**: 返回值格式不符合类型定义
```typescript
calculateResults: (answers) => {
  return {
    score: 80, // 应该是 totalScore
    dims: [...], // 应该是 dimensionScores
  };
}
```

✅ **正确**: 遵循类型定义
```typescript
calculateResults: (answers) => {
  return {
    totalScore: 80,
    dimensionScores: [...],
    interpretation: '...',
    recommendations: [...],
  };
}
```

### 6. 数据库提交
❌ **错误**: dimensionScores 使用中文 key
```typescript
dimensionScores: {
  '情绪反应性': 23, // 可能导致数据库查询问题
}
```

✅ **正确**: 使用英文 key
```typescript
dimensionScores: {
  emotional_reactivity: 23,
}
```

### 7. 答题页集成
❌ **错误**: 忘记在 `quiz/page.tsx` 中添加自定义处理
```typescript
// 直接使用标准计分，但量表需要自定义计算
const totalScore = calculateScore(scale, convertedAnswers); // 结果错误!
```

✅ **正确**: 添加特殊处理
```typescript
if (scaleId === 'custom-scale') {
  const customResult = scale.calculateResults(convertedAnswers);
  // ... 处理自定义结果
  return;
}
// 其他量表使用标准计分
const totalScore = calculateScore(scale, convertedAnswers);
```

---

## 🎯 质量标准

每个新测评必须达到以下标准才能上线:

### 功能完整性
- [ ] 所有题目正确显示
- [ ] 答题流程顺畅无阻塞
- [ ] 计分逻辑准确无误
- [ ] 结果展示完整清晰
- [ ] 数据正确保存到数据库

### 用户体验
- [ ] 移动端适配良好
- [ ] 响应速度快 (首屏 < 2s)
- [ ] 无明显卡顿
- [ ] 错误提示友好
- [ ] 进度保存可靠

### 数据质量
- [ ] 计分逻辑有理论依据
- [ ] 分数段解读专业准确
- [ ] 建议具有可操作性
- [ ] 参考文献真实可查

### 代码质量
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 严重警告
- [ ] 代码结构清晰
- [ ] 命名语义化
- [ ] 关键逻辑有注释

---

## 📚 参考资源

### 代码示例
- **简单量表**: `lib/scales/ess.ts`, `lib/scales/ini.ts`
- **复杂量表**: `lib/scales/ani.ts`, `lib/scales/zhz.ts`
- **混合量表**: `lib/scales/eq.ts`

### 工具函数
- `lib/scales/index.ts` - 量表注册和工具函数
- `lib/api-client.ts` - API 调用封装
- `lib/user-id.ts` - 用户ID管理

### 类型定义
- `types/quiz.ts` - 量表相关类型
- `types/analytics.ts` - 分析数据类型

### API 端点
- `app/api/assessments/route.ts` - 测评记录提交
- `app/api/percentile/route.ts` - 百分位计算

---

## 🔧 故障排查

### 问题: 量表不显示在首页
**可能原因**:
1. 未添加到 `lib/scales/index.ts` 的 `scales` 数组
2. 未添加到 `SCALE_CATEGORIES` 的对应分类

**解决**: 检查上述两处配置

---

### 问题: 计分结果不正确
**可能原因**:
1. 反向题未标记 `reversed: true`
2. 自定义计算函数逻辑错误
3. 维度 `questionIds` 不完整

**解决**:
- 手动验证计分公式
- 添加 console.log 调试中间结果
- 检查反向题列表

---

### 问题: 提交后无法跳转
**可能原因**:
1. `handleSubmitWithAnswers` 中缺少自定义处理
2. 结果对象格式不正确
3. resultId 生成重复

**解决**:
- 检查浏览器 Console 错误信息
- 验证路由路径正确: `/scales/{scaleId}/result/{resultId}`
- 确保 result.id 唯一

---

### 问题: 数据未保存到数据库
**可能原因**:
1. 用户未填写性别/年龄 (userInfo 为 null)
2. API 调用失败 (网络错误)
3. 数据格式验证失败

**解决**:
- 检查 Network 面板，查看 POST 请求状态
- 查看服务器日志 (如部署在 Vercel)
- 检查 `dimensionScores` 格式是否为 JSON 对象

---

## ✅ 上线前最终检查清单

- [ ] 本地测试通过 (功能、计分、数据提交)
- [ ] 代码已提交到 Git
- [ ] 构建成功 (`npm run build`)
- [ ] 生产环境预览正常
- [ ] 移动端测试通过
- [ ] 文档已更新
- [ ] 团队成员已 Review (如适用)

---

## 📝 开发时间估算

| 量表类型 | 预计时间 | 说明 |
|---------|---------|------|
| 简单量表 (模式1) | 2-4小时 | 数据录入 + 测试 |
| 自定义计算 (模式2) | 4-8小时 | 数据录入 + 逻辑实现 + 测试 |
| 复杂自定义 + 结果页 | 8-16小时 | 完整自定义实现 |

**注意**: 实际时间取决于题目数量、计分复杂度、特殊需求等因素

---

## 🎓 学习路径

### 新手开发者
1. 先阅读 2-3 个现有量表的代码 (推荐: ESS, INI)
2. 尝试开发一个简单量表 (10-20题，简单求和)
3. 学习一个自定义量表的实现 (推荐: ANI)
4. 独立开发完整的复杂量表

### 经验开发者
1. 直接参考本文档快速开发
2. 遇到特殊需求时查阅对应示例代码
3. 优化和改进现有流程

---

**最后更新**: 2025-12-15
**维护者**: Claude (AI Assistant)
**问题反馈**: 请在项目 Issues 中提出
