# Likert 量表类型和选项顺序修复总结

> **修复日期**: 2025-12-16
> **修复原因**: 发现多个量表错误使用 `type: 'scale'` 代替 `type: 'likert'`，以及 ANI 量表选项顺序与视觉语义相反

---

## 🔍 发现的问题

### 问题 1：错误的题目类型 `type: 'scale'`

**影响的量表**：
1. ✅ **SCL-90** (症状自评量表) - 90题，5点 Likert
2. ✅ **ESS** (情绪稳定性量表) - 20题，5点 Likert
3. ✅ **PAT** (心理年龄测试) - 40题，5点 Likert
4. ✅ **INI** (亲密关系需求指数) - 20题，5点 Likert
5. ✅ **ANI** (戒断必要性指数) - 33题，多种 Likert

**问题本质**：
- `type: 'scale'` 是通用类型，前端可能渲染成**垂直选项列表**
- `type: 'likert'` 是专门类型，前端渲染成**横向选项栏**（更符合 Likert 量表标准）

**参考正确示例**：
- ✅ **EQ** (共情商数量表) - 从一开始就正确使用了 `type: 'likert'`

---

### 问题 2：ANI 量表选项顺序反向 ⚠️ 严重！

**问题描述**：
ANI 量表的所有选项数组都是**倒序排列**（高分在左，低分在右），与 Likert 横向选项栏的**视觉语义相反**。

**Likert 横向选项栏的视觉规则**：
- **左侧（绿色）** → 低分/消极/不同意/从未
- **右侧（红色）** → 高分/积极/同意/总是

**ANI 的错误示例**（修复前）：
```typescript
// ❌ 错误：视觉与语义相反
options: [
  { value: 5, label: '非常频繁' },  // 左边（绿色）但是高分！
  { value: 4, label: '经常' },
  { value: 3, label: '有时' },
  { value: 2, label: '很少' },
  { value: 1, label: '从未如此' },   // 右边（红色）但是低分！
]
```

**正确示例**（修复后）：
```typescript
// ✅ 正确：视觉与语义一致
options: [
  { value: 1, label: '从未如此' },   // 左边（绿色）且是低分 ✅
  { value: 2, label: '很少' },
  { value: 3, label: '有时' },
  { value: 4, label: '经常' },
  { value: 5, label: '非常频繁' },  // 右边（红色）且是高分 ✅
]
```

**ANI 涉及的 4 种选项格式**（全部已修复）：
1. 5点制（从未如此→非常频繁）
2. 6点制（从不→几乎总是）
3. 7点制（从不→总是如此）
4. 7点制（完全不同意→完全同意）

---

## ✅ 修复内容

### 1. 代码修复

| 文件 | 修复内容 | 修改行数 |
|------|---------|---------|
| [lib/scales/scl90.ts](lib/scales/scl90.ts) | `type: 'scale'` → `type: 'likert'` | 90 处 |
| [lib/scales/ess.ts](lib/scales/ess.ts) | `type: 'scale'` → `type: 'likert'` | 20 处 |
| [lib/scales/pat.ts](lib/scales/pat.ts) | `type: 'scale'` → `type: 'likert'` | 40 处 |
| [lib/scales/ini.ts](lib/scales/ini.ts) | `type: 'scale'` → `type: 'likert'` | 20 处 |
| [lib/scales/ani.ts](lib/scales/ani.ts) | `type: 'scale'` → `type: 'likert'` | 33 处 |
| [lib/scales/ani.ts](lib/scales/ani.ts) | **反转所有 4 种选项数组顺序** | 33 处 |

**总计**：修复了 **236 处** 题目类型，**33 处** 选项顺序问题。

---

### 2. 文档更新

#### 2.1 更新 SCL-90 Template

文件：[.claude/assessments/scl90-filled-template.md](d:\code repos\knowyourself_website\.claude\assessments\scl90-filled-template.md#L45-L116)

新增内容：
- ✅ **2.2.1 题目字段规范** 小节
- ✅ 明确说明必须使用 `type: 'likert'`
- ✅ 添加**选项顺序规范**（极其重要！）
- ✅ 提供正确/错误示例对比
- ✅ 添加验证方法

关键规范：
```
🎨 选项顺序规范（极其重要！）

Likert 横向选项栏有视觉语义：
- 左侧（绿色） = 低分/消极/不同意/较轻
- 右侧（红色） = 高分/积极/同意/较重

选项数组必须按照 value 从小到大排列：
✅ 第一项: value 最小，label 是消极语义（没有/不同意/从未）
✅ 最后一项: value 最大，label 是积极语义（严重/同意/总是）
```

#### 2.2 更新开发流程文档

文件：[.claude/assessment-development-workflow.md](d:\code repos\knowyourself_website\.claude\assessment-development-workflow.md#L70-L76)

新增内容：
- ✅ 在"步骤 1: 创建量表数据文件"中强化题目类型说明
- ✅ 新增**选项顺序规范**子条目
- ✅ 提供验证方法和参考示例

---

## 📊 影响分析

### 前端展示变化

**修复前**：
- SCL-90/ESS/PAT/INI/ANI 可能显示为**垂直选项列表**
- ANI 即使显示为横向选项栏，**左右语义也是反的**（绿色=高分，红色=低分）

**修复后**：
- 所有量表统一显示为**横向 Likert 选项栏**
- 选项顺序正确：**左侧（绿色）=低分，右侧（红色）=高分**
- 用户体验一致性提升

### 数据兼容性

✅ **不影响已有数据**：
- 修复只改变前端展示，不改变计分逻辑
- `value` 值保持不变（1-5 或 1-7）
- 已保存的答案数据完全兼容

### 计分逻辑

✅ **不影响计分**：
- ANI 的选项顺序反转后，前端收集的 `value` 值与之前完全一致
- 例如：用户选择"非常频繁"，修复前后都是 `value: 5`
- 所有计算公式和阈值保持不变

---

## 🎯 验证方法

### 1. 视觉验证
启动开发服务器，访问各量表：
```bash
npm run dev
```

检查项：
- [ ] 选项以**横向按钮**形式展示（而非垂直列表）
- [ ] 左侧按钮为绿色，右侧按钮为红色（或渐变）
- [ ] 左侧语义为消极（没有/不同意/从未），右侧为积极（严重/同意/总是）

### 2. 功能验证
- [ ] 答题流程正常
- [ ] 选项点击响应正常
- [ ] 提交后计分正确
- [ ] 结果页展示正常

### 3. 数据验证
- [ ] 检查 Network 面板，POST 数据的 `answers` 字段值正确
- [ ] 答案 `value` 与选择的选项匹配（1-5 或 1-7）

---

## 📚 参考资料

### 正确的量表示例
- **EQ** (共情商数量表)：[lib/scales/eq.ts](lib/scales/eq.ts)
  - ✅ 使用 `type: 'likert'`
  - ✅ 选项顺序正确（1→4, 强烈不同意→强烈同意）

### 类型定义
- **QuizQuestion 接口**：[types/quiz.ts:4](types/quiz.ts#L4)
  ```typescript
  type: 'single' | 'multiple' | 'scale' | 'text' | 'likert'
  ```

### 开发文档
- **测评开发流程**：[.claude/assessment-development-workflow.md](d:\code repos\knowyourself_website\.claude\assessment-development-workflow.md)
- **SCL-90 Template**：[.claude/assessments/scl90-filled-template.md](d:\code repos\knowyourself_website\.claude\assessments\scl90-filled-template.md)

---

## ⚠️ 未来开发注意事项

### 强制规范

1. **Likert 量表必须使用 `type: 'likert'`**
   - ❌ 不要用 `type: 'scale'`

2. **选项数组必须按 value 从小到大排列**
   - ✅ `[{value: 1, ...}, {value: 2, ...}, ... , {value: 5, ...}]`
   - ❌ `[{value: 5, ...}, {value: 4, ...}, ... , {value: 1, ...}]`

3. **验证方法**
   - 检查第一项：`value` 最小 + label 消极语义
   - 检查最后一项：`value` 最大 + label 积极语义

### 参考检查清单

开发新量表时，使用此检查清单：
- [ ] Likert 量表使用 `type: 'likert'`
- [ ] 选项数组第一项 value 最小（如 1）
- [ ] 选项数组最后一项 value 最大（如 5 或 7）
- [ ] 第一项 label 是消极语义（没有/不同意/从未）
- [ ] 最后一项 label 是积极语义（严重/同意/总是）
- [ ] 参考 EQ/SCL-90 的正确实现

---

## 📝 总结

本次修复解决了**两个关键问题**：

1. **题目类型标准化**：将 5 个量表的 236 道题目从 `type: 'scale'` 统一改为 `type: 'likert'`，确保横向选项栏的正确渲染。

2. **视觉语义一致性**：修复了 ANI 量表 33 道题的选项顺序，确保"左低右高"的视觉规则与语义一致。

通过更新 Template 和 Workflow 文档，**建立了明确的规范**，防止未来开发中再次出现类似问题。

---

**修复者**: Claude (AI Assistant)
**审核者**: [待填写]
**测试状态**: [待测试]
