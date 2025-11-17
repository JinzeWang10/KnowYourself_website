# 检查前端是否正确调用 API

## 问题诊断

如果 `assessment_records` 表的记录很少，可能的原因：

### 1️⃣ 前端没有正确调用 API

**检查方法：**

在浏览器中打开开发者工具（F12），切换到 **Network（网络）** 标签：

1. 完成一次测评
2. 查看是否有以下请求：
   - `POST /api/assessments` - 提交测评记录
   - `GET /api/percentile?scaleId=xxx&score=yyy` - 获取百分位

**预期结果：**
- 应该看到 `POST /api/assessments` 请求
- 状态码应该是 `200`
- Response 应该包含 `{"success": true, "recordId": "..."}`

**如果没有看到请求：**
- 前端可能没有调用 API
- 可能有 JavaScript 错误阻止了调用

### 2️⃣ 用户没有填写用户信息

**根据代码分析：**

在 `app/scales/[scaleId]/quiz/page.tsx` 中，只有当 `userInfo` 存在时才会提交：

\`\`\`typescript
// 第 165、235、313、385 行
if (userInfo) {
  const record: AssessmentRecord = { ... }
  submitAssessmentRecord(record).catch(err => {
    console.error('提交测评记录失败:', err);
  });
}
\`\`\`

**检查方法：**
1. 打开浏览器控制台（F12 -> Console）
2. 运行：`localStorage.getItem('userInfo')`
3. 应该看到类似：`{"gender":"male","age":25}` 的数据

**如果返回 `null`：**
- 用户跳过了用户信息填写步骤
- 数据不会被提交到数据库

### 3️⃣ API 调用失败但被静默处理

由于代码使用了 `.catch()` 捕获错误但只是打印到控制台，用户不会看到错误提示。

**检查方法：**
1. 打开浏览器控制台（F12 -> Console）
2. 完成一次测评
3. 查看是否有错误信息：`提交测评记录失败`

### 4️⃣ 服务器环境问题

**可能原因：**
- 数据库连接失败
- API 路由未正确部署
- 权限问题

## 测试方案

### 方案 A: 使用测试脚本（推荐）

在服务器上运行：

\`\`\`bash
# 测试数据库写入
node test_submit.js

# 查看当日统计
node check_daily_stats.js
\`\`\`

### 方案 B: 手动测试完整流程

1. **确保有用户信息**

打开浏览器控制台：
\`\`\`javascript
localStorage.setItem('userInfo', JSON.stringify({gender: 'male', age: 25}))
\`\`\`

2. **完成一次测评**

访问任意量表，完成测评

3. **检查 Network 请求**

应该看到：
\`\`\`
POST /api/assessments
Status: 200
Response: {"success":true,"recordId":"..."}
\`\`\`

4. **检查数据库**

\`\`\`bash
node check_daily_stats.js
# 或
npx prisma studio
\`\`\`

### 方案 C: 添加日志验证

在服务器日志中查找：
\`\`\`
[Analytics] 新测评记录已保存到数据库
\`\`\`

这条日志在 `app/api/assessments/route.ts:66` 中输出。

如果看不到这条日志，说明 API 没有被调用或者在保存前就失败了。

## 修复建议

### 如果用户没填写信息导致数据未保存

需要修改代码，让用户信息成为必填：

1. 在量表页面添加强制跳转到用户信息页
2. 或者在未填写时使用默认值：
   \`\`\`typescript
   const userInfo = savedUserInfo || { gender: 'prefer_not_to_say', age: 0 }
   \`\`\`

### 如果 API 调用失败

检查：
1. 服务器日志中的错误信息
2. 数据库连接是否正常
3. Prisma Client 是否正确生成

---

## 快速验证命令

\`\`\`bash
# 1. 测试数据库连接和写入
node diagnose_db.js

# 2. 插入测试数据
node test_submit.js

# 3. 查看统计
node check_daily_stats.js
\`\`\`
