# 后台数据统计功能说明

## 概述

为了改进测评服务和提供百分位排名功能，平台现在会收集**匿名化的测评统计数据**到后台。

## 数据收集内容

### ✅ 收集的数据
- **用户基本信息**：性别、年龄（来自用户填写）
- **测评结果**：总分、归一化得分、等级
- **维度得分**：各维度的分数（如适用）
- **时间信息**：完成时间

### ❌ 不收集的数据
- **具体答题内容**：不记录用户的每道题答案
- **个人身份信息**：姓名、邮箱、电话等
- **IP 地址**：不关联 IP 或设备标识

## 技术实现

### 1. 数据模型
```typescript
// types/analytics.ts
interface AssessmentRecord {
  id: string;
  scaleId: string;
  scaleTitle: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  age: number;
  totalScore: number;
  normalizedScore: number;
  level: string;
  dimensionScores?: Record<string, number>;
  completedAt: string;
}
```

### 2. API 端点

#### POST /api/assessments
提交测评记录到后台

**请求体示例：**
```json
{
  "id": "result-1234567890",
  "scaleId": "ani",
  "scaleTitle": "ANI - 戒断必要性指数",
  "gender": "male",
  "age": 25,
  "totalScore": 120,
  "normalizedScore": 72.5,
  "level": "中度",
  "dimensionScores": {
    "hbi_consequences": 60,
    "ppus_functional": 45
  },
  "completedAt": "2025-01-04T10:30:00.000Z"
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "测评记录已保存",
  "recordId": "result-1234567890"
}
```

#### GET /api/assessments?scaleId=xxx
获取统计数据（管理员功能）

**响应示例：**
```json
{
  "success": true,
  "data": {
    "scaleId": "ani",
    "totalCount": 1523,
    "avgScore": 65.3,
    "genderDistribution": [
      { "gender": "male", "count": 823, "avgScore": 67.2 },
      { "gender": "female", "count": 700, "avgScore": 63.1 }
    ],
    "ageDistribution": [
      { "ageGroup": "18-25", "count": 456, "avgScore": 68.5 },
      { "ageGroup": "26-35", "count": 621, "avgScore": 64.2 }
    ]
  }
}
```

#### GET /api/percentile?scaleId=xxx&score=yyy
计算百分位排名

**响应示例：**
```json
{
  "success": true,
  "data": {
    "percentile": 75,
    "totalCount": 1523,
    "higherCount": 380,
    "lowerCount": 1143
  }
}
```

### 3. 客户端调用

```typescript
// lib/api-client.ts
import { submitAssessmentRecord } from '@/lib/api-client';

// 提交测评记录
const result = await submitAssessmentRecord({
  id: 'result-xxx',
  scaleId: 'ani',
  gender: 'male',
  age: 25,
  totalScore: 120,
  normalizedScore: 72.5,
  level: '中度',
  completedAt: new Date().toISOString(),
});
```

### 4. 数据流程

```
用户完成测评
    ↓
quiz/page.tsx 计算得分
    ↓
读取 localStorage 中的用户信息（性别、年龄）
    ↓
构建 AssessmentRecord 对象
    ↓
异步调用 submitAssessmentRecord() 提交到 /api/assessments
    ↓
后台保存记录（当前为内存，生产应使用数据库）
    ↓
用户继续查看结果页（不阻塞）
```

## 隐私保护措施

1. **完全匿名化**：无法通过记录追溯到具体用户
2. **不记录答案**：只记录得分，不记录具体选择
3. **用户可控**：
   - 不填写用户信息 → 不提交后台
   - 本地数据仍保留 → 用户可查看历史
4. **透明披露**：隐私政策已更新说明数据收集

## 生产环境部署

⚠️ **当前实现使用内存存储，仅供开发测试！**

### 生产环境需要：

1. **数据库选择**
   - **推荐**：PostgreSQL / MySQL（关系型，适合统计分析）
   - **备选**：MongoDB（文档型，灵活）

2. **示例：PostgreSQL 表结构**
```sql
CREATE TABLE assessment_records (
  id VARCHAR(255) PRIMARY KEY,
  scale_id VARCHAR(100) NOT NULL,
  scale_title VARCHAR(255),
  gender VARCHAR(50),
  age INTEGER,
  total_score DECIMAL(10,2),
  normalized_score DECIMAL(10,2),
  level VARCHAR(100),
  dimension_scores JSONB,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_scale_id (scale_id),
  INDEX idx_gender (gender),
  INDEX idx_age (age),
  INDEX idx_completed_at (completed_at)
);
```

3. **集成 ORM（推荐 Prisma）**
```bash
npm install prisma @prisma/client
npx prisma init
```

4. **环境变量配置**
```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/scales_db"
```

5. **更新 API 路由**
```typescript
// app/api/assessments/route.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const data = await request.json();

  // 替换内存存储为数据库
  const record = await prisma.assessmentRecord.create({
    data: {
      ...data,
      completedAt: new Date(data.completedAt),
    },
  });

  return NextResponse.json({ success: true, recordId: record.id });
}
```

## 统计分析功能

### 可实现的分析
1. **得分分布**：按性别、年龄组、时间段统计
2. **百分位排名**：用户得分在总体中的位置
3. **趋势分析**：不同时期的平均分变化
4. **维度对比**：各维度得分的相关性分析

### 管理后台（待开发）
可创建管理员页面查看：
- 各量表的测评人数、平均分
- 性别、年龄分布图表
- 实时数据监控

## 合规性说明

✅ **符合以下要求：**
- 隐私政策已更新（[/privacy](app/privacy/page.tsx#L38-L55)）
- 用户协议中说明数据使用（[/terms](app/terms/page.tsx)）
- 仅收集必要数据，不涉及敏感信息
- 用户可选择不填写信息 → 完全匿名

## 后续优化建议

1. **数据加密**：敏感字段加密存储
2. **数据脱敏**：年龄模糊化（如 20-25 岁组）
3. **定期清理**：设置数据保留期限（如 1 年）
4. **访问控制**：管理员接口增加鉴权
5. **审计日志**：记录数据访问和修改操作

## 文件清单

```
types/analytics.ts              # 数据类型定义
lib/api-client.ts               # API 客户端工具
app/api/assessments/route.ts    # 测评记录 API
app/api/percentile/route.ts     # 百分位计算 API
app/scales/[scaleId]/quiz/page.tsx  # 调用提交逻辑
app/privacy/page.tsx            # 隐私政策更新
```

## 联系信息

如有技术问题，请联系开发团队。
