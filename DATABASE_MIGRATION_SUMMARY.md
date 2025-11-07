# 📊 数据库迁移完成总结

## 🎯 迁移内容

已成功将测评统计数据存储从**内存（临时）**迁移到 **PostgreSQL 数据库（持久化）**。

---

## ✅ 已完成的工作

### 1. 安装和配置 Prisma ORM

- ✅ 安装 `prisma` 和 `@prisma/client`
- ✅ 创建 `prisma/schema.prisma` 数据库模型定义
- ✅ 创建 `lib/prisma.ts` Prisma Client 单例
- ✅ 添加 npm 脚本：`db:push`, `db:studio`

### 2. 定义数据库模型

创建了 `AssessmentRecord` 模型，包含以下字段：

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键，唯一标识 |
| scaleId | String | 量表ID（如 "ani", "ess"） |
| scaleTitle | String | 量表标题 |
| gender | String | 性别（male/female/other） |
| age | Int | 年龄 |
| totalScore | Float | 总分 |
| normalizedScore | Float | 归一化分数（0-100） |
| level | String | 等级（轻度/中度/重度等） |
| dimensionScores | Json | 维度分数（可选） |
| completedAt | DateTime | 完成时间 |
| createdAt | DateTime | 记录创建时间 |
| duration | Int | 测评用时（秒，可选） |
| region | String | 地区（可选） |

**索引优化：**
- `scaleId`
- `gender`
- `age`
- `completedAt`
- `scaleId + totalScore`（联合索引，用于百分位计算）

### 3. 修改 API 路由

#### `app/api/assessments/route.ts`

**POST** - 保存测评记录
- ❌ 旧：`assessmentRecords.push(data)` （内存数组）
- ✅ 新：`prisma.assessmentRecord.create()` （数据库）

**GET** - 获取统计数据
- ❌ 旧：`assessmentRecords.filter()` （内存查询）
- ✅ 新：`prisma.assessmentRecord.findMany()` （数据库查询）

#### `app/api/percentile/route.ts`

**GET** - 计算百分位
- ❌ 旧：`scoreRecords.filter()` （内存数组）
- ✅ 新：`prisma.assessmentRecord.count()` （数据库计数）

优化查询：
```typescript
// 查询总记录数
const totalCount = await prisma.assessmentRecord.count({ where: { scaleId } });

// 查询低于指定分数的记录数
const lowerCount = await prisma.assessmentRecord.count({
  where: { scaleId, totalScore: { lt: score } }
});
```

### 4. 配置环境变量

创建了 `.env.example` 和 `.env.local`：

```env
DATABASE_URL="postgresql://scales_user:password@localhost:5432/scales_db"
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 5. 更新 .gitignore

添加了以下忽略项：
- `.env` （防止泄露数据库密码）
- `prisma/migrations/`
- `*.db` 和 `*.db-journal`（SQLite 文件）
- `database_backups/`

### 6. 创建部署文档

| 文档 | 用途 |
|------|------|
| [DATABASE_DEPLOYMENT.md](./DATABASE_DEPLOYMENT.md) | 详细的数据库部署指南 |
| [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) | 5 分钟快速部署脚本 |
| [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) | 部署前检查清单 |
| [BACKEND_ANALYTICS.md](./BACKEND_ANALYTICS.md) | 后台统计功能说明 |

### 7. 更新项目文档

- ✅ 更新 `README.md`，添加数据库相关说明
- ✅ 更新技术栈列表
- ✅ 添加隐私说明

---

## 🚀 如何部署到服务器

### 快速部署（5 分钟）

1. **安装 PostgreSQL**
   ```bash
   sudo apt update && sudo apt install -y postgresql postgresql-contrib
   sudo systemctl start postgresql && sudo systemctl enable postgresql
   ```

2. **创建数据库和用户**
   ```bash
   sudo -u postgres psql <<EOF
   CREATE DATABASE scales_db;
   CREATE USER scales_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE scales_db TO scales_user;
   \c scales_db
   GRANT ALL ON SCHEMA public TO scales_user;
   EOF
   ```

3. **配置项目**
   ```bash
   cd /path/to/project
   echo 'DATABASE_URL="postgresql://scales_user:your_password@localhost:5432/scales_db"' > .env
   npm install
   npx prisma db push
   npm run build
   pm2 restart all
   ```

4. **验证**
   ```bash
   psql -h localhost -U scales_user -d scales_db -c "\dt"
   # 应该看到 assessment_records 表
   ```

详细步骤请参考 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

---

## 📊 数据流程

### 用户完成测评后

```
1. 用户答题完成
   ↓
2. quiz/page.tsx 计算得分
   ↓
3. 读取 localStorage 中的用户信息（性别、年龄）
   ↓
4. 构建 AssessmentRecord 对象
   ↓
5. 调用 submitAssessmentRecord() API
   ↓
6. POST /api/assessments
   ↓
7. prisma.assessmentRecord.create() 保存到数据库
   ↓
8. 返回成功响应（不阻塞用户查看结果）
```

### 查询百分位排名

```
1. 用户查看结果页
   ↓
2. 调用 getPercentileRank(scaleId, score)
   ↓
3. GET /api/percentile?scaleId=xxx&score=yyy
   ↓
4. prisma.assessmentRecord.count() 查询总记录数
   ↓
5. prisma.assessmentRecord.count({ where: { totalScore: { lt: score }}}) 查询低于该分数的记录数
   ↓
6. 计算百分位 = (lowerCount / totalCount) × 100
   ↓
7. 返回百分位数据
```

---

## 🔐 隐私和安全

### 收集的数据（匿名化）
- ✅ 量表ID、性别、年龄
- ✅ 总分、归一化分数、等级
- ✅ 维度分数、完成时间

### 不收集的数据
- ❌ 具体答题内容
- ❌ 个人身份信息（姓名、邮箱、电话）
- ❌ IP 地址或设备标识

### 安全措施
- 🔒 数据库密码存储在 `.env` 文件（不提交到 Git）
- 🔒 PostgreSQL 仅监听 localhost，不对外开放
- 🔒 数据完全匿名化，无法追溯到具体用户
- 🔒 定期备份数据库

---

## 📈 统计功能

### 可用的统计分析

1. **总体统计**
   - 各量表的测评人数
   - 平均分、最高分、最低分

2. **性别分布**
   - 男性/女性测评人数
   - 各性别的平均分

3. **年龄分布**
   - 各年龄段测评人数
   - 各年龄段的平均分

4. **百分位排名**
   - 用户得分在总体中的位置
   - 超过百分之多少的用户

5. **时间趋势**
   - 不同时期的测评人数
   - 平均分变化趋势

### API 端点

| 端点 | 方法 | 说明 |
|------|------|------|
| `/api/assessments` | POST | 提交测评记录 |
| `/api/assessments?scaleId=xxx` | GET | 获取统计数据 |
| `/api/percentile?scaleId=xxx&score=yyy` | GET | 计算百分位 |

---

## 🧪 测试

### 本地开发测试

使用 SQLite（无需安装 PostgreSQL）：

1. 修改 `prisma/schema.prisma`：
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. 修改 `.env.local`：
   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. 初始化数据库：
   ```bash
   npx prisma db push
   npm run dev
   ```

### 生产环境测试

1. 完成一次测评

2. 检查数据库：
   ```bash
   psql -h localhost -U scales_user -d scales_db -c "SELECT COUNT(*) FROM assessment_records;"
   ```

3. 测试 API：
   ```bash
   curl http://localhost:8080/api/assessments?scaleId=ani
   ```

---

## 🎓 技术栈

- **数据库**: PostgreSQL 14+
- **ORM**: Prisma 5.x
- **后端**: Next.js 15 API Routes
- **语言**: TypeScript

---

## 📞 后续优化建议

### 性能优化
- [ ] 添加 Redis 缓存常用查询
- [ ] 使用连接池（Prisma 自带）
- [ ] 分页查询大数据量

### 功能增强
- [ ] 添加管理后台（查看统计数据）
- [ ] 导出统计报表（CSV/Excel）
- [ ] 实时数据仪表板

### 安全增强
- [ ] 添加 API 鉴权（管理员功能）
- [ ] 实施 Rate Limiting（防止滥用）
- [ ] 数据库字段加密（敏感数据）

---

## ✅ 部署清单

部署前请完成以下检查：

- [ ] PostgreSQL 已安装并运行
- [ ] 数据库和用户已创建
- [ ] `.env` 文件已配置
- [ ] `DATABASE_URL` 正确
- [ ] Prisma Client 已生成（`npx prisma generate`）
- [ ] 数据库表已创建（`npx prisma db push`）
- [ ] 项目已构建（`npm run build`）
- [ ] 应用已重启
- [ ] 完成测评后数据库有记录

完整清单请参考 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 🎉 迁移完成！

从内存存储迁移到 PostgreSQL 数据库已完成。现在所有测评统计数据都会持久化保存，支持百分位排名和统计分析功能。

---

**迁移日期**: 2025-01-07
**迁移人员**: Claude Code
**项目版本**: 0.1.0
