# Prisma Schema 配置说明

## 概述

本项目使用不同的数据库配置：
- **本地开发**：SQLite
- **生产环境**：PostgreSQL

## 初次设置

### 本地开发环境

```bash
# 1. 复制模板文件
cp prisma/schema.prisma.template prisma/schema.prisma

# 2. 修改 provider 为 sqlite
# 在 schema.prisma 中：provider = "sqlite"

# 3. 生成 Prisma Client
npx prisma generate

# 4. 创建数据库
npx prisma migrate dev
```

### 生产环境（服务器）

```bash
# 1. 复制模板文件
cp prisma/schema.prisma.template prisma/schema.prisma

# 2. 确认 provider 为 postgresql（模板默认）
# 在 schema.prisma 中：provider = "postgresql"

# 3. 生成 Prisma Client
npx prisma generate

# 4. 运行迁移
npx prisma migrate deploy
```

## 重要提示

- `schema.prisma` 文件已添加到 `.gitignore`，不会被提交到 Git
- 每次 pull 代码后不会覆盖本地的 `schema.prisma`
- 如果模板文件有更新，需要手动同步到你的 `schema.prisma`
