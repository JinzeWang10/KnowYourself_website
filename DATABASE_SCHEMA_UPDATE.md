# 数据库结构优化说明

## 变更概述

将原来的单表结构优化为**用户表 + 测评记录表**的关联结构。

### 旧结构
```
assessment_records
├── id (PK)
├── scaleId
├── scaleTitle
├── gender        ← 每条记录都存储
├── age           ← 每条记录都存储
├── totalScore
├── ...
└── completedAt
```

### 新结构
```
anonymous_users                assessment_records
├── id (PK)                   ├── id (PK)
├── gender                    ├── userId (FK) → anonymous_users.id
├── age                       ├── scaleId
├── region                    ├── scaleTitle
├── createdAt                 ├── totalScore
└── updatedAt                 ├── ...
                              └── completedAt
```

## 优势

### 1️⃣ **数据规范化**
- 用户信息只存储一次
- 避免冗余数据
- 便于更新用户信息（如年龄变化）

### 2️⃣ **支持用户历史**
- 可以查询某个用户的所有测评记录
- 可以分析用户行为模式
- 支持"我的测评历史"功能

### 3️⃣ **更好的查询性能**
- 外键索引加速关联查询
- 用户维度的统计更高效

## 用户 ID 生成策略

由于是**匿名测评系统**，采用以下方案：

### 前端生成匿名 ID
```typescript
// lib/user-id.ts
export function getOrCreateUserId(): string {
  // 首次访问时生成 UUID，存储在 localStorage
  // 后续访问使用同一个 ID
  return localStorage.getItem('anonymous_user_id') || generateNewId()
}
```

### 特点
- ✅ 完全匿名（不关联真实身份）
- ✅ 跨会话持久化（localStorage）
- ✅ 用户可清除（提供清除功能）
- ✅ 不依赖登录系统

## 前端使用方法

### 1. 获取用户 ID
```typescript
import { getOrCreateUserId } from '@/lib/user-id'

const userId = getOrCreateUserId()
```

### 2. 提交测评记录
```typescript
import { submitAssessmentRecord } from '@/lib/api-client'
import { getOrCreateUserId } from '@/lib/user-id'
import type { AssessmentSubmission } from '@/types/analytics'

// 获取用户信息
const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
const userId = getOrCreateUserId()

// 构建提交数据
const submission: AssessmentSubmission = {
  userId,
  gender: userInfo.gender,
  age: userInfo.age,
  region: 'CN', // 可选
  record: {
    id: `record-${Date.now()}-${crypto.randomUUID()}`,
    userId,
    scaleId: 'phq9',
    scaleTitle: 'PHQ-9 抑郁症筛查量表',
    totalScore: 12,
    normalizedScore: 12,
    level: '中度抑郁',
    completedAt: new Date().toISOString(),
    answers: [
      { questionId: 'q1', answer: 2 },
      { questionId: 'q2', answer: 1 },
      // ...
    ],
  },
}

// 提交
const result = await submitAssessmentRecord(submission)
```

## 部署步骤

### ⚠️ 重要：这是破坏性变更

旧数据无法自动迁移，请谨慎操作！

### 步骤 1: 备份数据库
```bash
# PostgreSQL
pg_dump your_database > backup_$(date +%Y%m%d).sql

# 或使用 Prisma Studio 导出 CSV
npx prisma studio
```

### 步骤 2: 生成 Prisma Client
```bash
npx prisma generate
```

### 步骤 3: 应用新 Schema
```bash
# 这会删除旧表并创建新表
npx prisma db push

# 或使用 Migrate（推荐生产环境）
npx prisma migrate dev --name add_user_table
```

### 步骤 4: 重新构建应用
```bash
npm run build
```

### 步骤 5: 重启服务
```bash
pm2 restart all
```

## 数据迁移（如有旧数据）

由于表结构变化较大，无法自动迁移。如果需要保留旧数据：

### 选项 1: 手动 SQL 迁移
```sql
-- 1. 从旧表提取唯一用户
INSERT INTO anonymous_users (id, gender, age, region, "createdAt", "updatedAt")
SELECT
  'user-' || gen_random_uuid() as id,
  gender,
  age,
  NULL as region,
  MIN("completedAt") as "createdAt",
  MAX("completedAt") as "updatedAt"
FROM old_assessment_records
GROUP BY gender, age;

-- 2. 更新测评记录（需要手动映射 userId）
-- 这一步比较复杂，建议找数据库管理员协助
```

### 选项 2: 舍弃旧数据
如果旧数据不重要，直接使用新表结构开始记录。

## 常见问题

### Q: 用户清除浏览器数据后会怎样？
A: 会生成新的匿名 ID，相当于新用户。之前的测评记录仍在数据库中，但无法关联。

### Q: 如何防止用户重复提交？
A: 每条测评记录有唯一 ID，API 会检查重复。

### Q: 能否关联微信/QQ 登录？
A: 可以，将来可以添加 `externalId` 字段关联第三方账号。

### Q: 数据隐私如何保证？
A:
- 匿名 ID 不关联真实身份
- 不存储 IP、设备信息
- 地理位置仅到国家/地区级别

## 测试验证

```bash
# 测试数据库写入
node test_submit.js

# 验证记录
node verify_recording.js

# 查看统计
node check_daily_stats.js
```

## 回滚方案

如果出现问题，可以回滚到旧版本：

```bash
# 1. 回滚代码
git revert HEAD

# 2. 恢复数据库
psql your_database < backup_YYYYMMDD.sql

# 3. 重新生成 Prisma Client
npx prisma generate

# 4. 重启服务
pm2 restart all
```
