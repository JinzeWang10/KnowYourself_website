# 阿里云服务器数据库部署指南

本文档说明如何在阿里云 Ubuntu 服务器上部署 PostgreSQL 数据库，用于存储测评统计数据。

---

## 📋 前置要求

- **服务器系统**: Ubuntu 20.04 / 22.04 LTS
- **最低配置**: 1核 CPU, 1GB 内存, 20GB 磁盘
- **权限**: sudo 权限
- **端口**: 确保 5432 端口未被占用（PostgreSQL 默认端口）

---

## 🚀 部署步骤

### 1. 安装 PostgreSQL

SSH 登录到你的阿里云服务器，执行以下命令：

```bash
# 更新软件包列表
sudo apt update

# 安装 PostgreSQL 及其扩展
sudo apt install postgresql postgresql-contrib -y

# 检查安装是否成功
psql --version
# 应该显示类似：psql (PostgreSQL) 14.x
```

### 2. 启动并启用 PostgreSQL 服务

```bash
# 启动 PostgreSQL 服务
sudo systemctl start postgresql

# 设置开机自启
sudo systemctl enable postgresql

# 检查服务状态
sudo systemctl status postgresql
# 应该显示 "active (running)"
```

### 3. 创建数据库和用户

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 进入 PostgreSQL 命令行后，执行以下 SQL 命令：
```

在 PostgreSQL 命令行中执行：

```sql
-- 创建数据库
CREATE DATABASE scales_db;

-- 创建专用用户（请修改密码）
CREATE USER scales_user WITH PASSWORD 'your_strong_password_here';

-- 授予数据库权限
GRANT ALL PRIVILEGES ON DATABASE scales_db TO scales_user;

-- PostgreSQL 15+ 还需要授予 schema 权限
\c scales_db
GRANT ALL ON SCHEMA public TO scales_user;

-- 退出 PostgreSQL
\q
```

**⚠️ 重要：** 请将 `your_strong_password_here` 替换为强密码，并记录下来！

---

### 4. 配置 PostgreSQL 允许本地连接

编辑配置文件以允许应用连接：

```bash
# 编辑 pg_hba.conf 文件
sudo nano /etc/postgresql/14/main/pg_hba.conf
# 注意：版本号可能不同，根据实际情况修改（如 12, 13, 14, 15 等）
```

在文件中找到如下行：

```
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
```

确保该行存在且未被注释（如果被 `#` 注释，请删除 `#`）。

保存并退出（Ctrl + O 保存，Ctrl + X 退出）。

重启 PostgreSQL：

```bash
sudo systemctl restart postgresql
```

---

### 5. 测试数据库连接

```bash
# 使用创建的用户测试连接
psql -h localhost -U scales_user -d scales_db

# 输入密码后，如果进入 PostgreSQL 命令行，说明配置成功
# 输入 \q 退出
```

---

## 📦 配置 Next.js 项目

### 1. 在服务器上配置环境变量

在你的 Next.js 项目根目录创建 `.env` 文件：

```bash
cd /path/to/your/knowyourself_website
nano .env
```

添加以下内容（请替换密码）：

```env
# 数据库连接字符串
DATABASE_URL="postgresql://scales_user:your_strong_password_here@localhost:5432/scales_db"

# 网站 URL（根据实际情况修改）
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

保存并退出。

**⚠️ 安全提示：** 确保 `.env` 文件已添加到 `.gitignore`，不要提交到 Git！

---

### 2. 安装依赖并初始化数据库

```bash
# 确保已安装 Node.js 和 npm（本文档假设已安装）

# 安装项目依赖（如果还没安装）
npm install

# 生成 Prisma Client
npx prisma generate

# 创建数据库表结构
npx prisma db push
```

如果看到类似以下输出，说明成功：

```
✔ Generated Prisma Client (5.x.x) to ./node_modules/@prisma/client in 123ms

Your database is now in sync with your Prisma schema. Done in 456ms

✔ Generated Prisma Client to ./node_modules/@prisma/client in 78ms
```

---

### 3. 验证数据库表是否创建

```bash
# 进入数据库查看表
psql -h localhost -U scales_user -d scales_db

# 在 PostgreSQL 命令行中查看表
\dt

# 应该看到 "assessment_records" 表
# 输入 \q 退出
```

---

### 4. 重启 Next.js 应用

```bash
# 如果使用 PM2 管理应用（推荐）
pm2 restart scales

# 或者手动重启
npm run build
npm start
```

---

## 🧪 测试数据提交

### 测试方法 1：使用网站

1. 访问你的网站
2. 完成一次测评
3. 检查数据库是否有记录：

```bash
psql -h localhost -U scales_user -d scales_db -c "SELECT COUNT(*) FROM assessment_records;"
```

如果显示数字大于 0，说明数据已成功保存！

---

### 测试方法 2：使用 curl 测试 API

```bash
curl -X POST https://your-domain.com/api/assessments \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-001",
    "scaleId": "ani",
    "scaleTitle": "测试量表",
    "gender": "male",
    "age": 25,
    "totalScore": 80,
    "normalizedScore": 75.5,
    "level": "中等",
    "completedAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'"
  }'
```

预期返回：

```json
{
  "success": true,
  "message": "测评记录已保存",
  "recordId": "test-001"
}
```

---

## 🔒 安全建议

### 1. 防火墙配置

如果启用了防火墙，确保 **不要** 对外开放 5432 端口（仅允许本地连接）：

```bash
# 检查防火墙状态
sudo ufw status

# 如果 5432 端口被开放，请关闭
# sudo ufw delete allow 5432
```

PostgreSQL 应该只允许 localhost 连接，外部无法直接访问数据库。

---

### 2. 定期备份数据库

创建备份脚本：

```bash
# 创建备份目录
mkdir -p ~/database_backups

# 创建备份脚本
nano ~/backup_db.sh
```

添加以下内容：

```bash
#!/bin/bash
BACKUP_DIR=~/database_backups
DATE=$(date +"%Y%m%d_%H%M%S")
pg_dump -h localhost -U scales_user scales_db | gzip > $BACKUP_DIR/scales_db_$DATE.sql.gz
echo "备份完成: $BACKUP_DIR/scales_db_$DATE.sql.gz"

# 删除 30 天前的备份
find $BACKUP_DIR -name "scales_db_*.sql.gz" -mtime +30 -delete
```

设置执行权限：

```bash
chmod +x ~/backup_db.sh
```

设置定时任务（每天凌晨 2 点备份）：

```bash
crontab -e

# 添加以下行
0 2 * * * /home/your_username/backup_db.sh
```

---

### 3. 更新 PostgreSQL 配置（可选优化）

如果服务器内存较小（1GB），可以优化 PostgreSQL 配置：

```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

修改以下参数（根据实际内存调整）：

```conf
# 共享内存缓冲区（推荐为总内存的 25%）
shared_buffers = 256MB

# 单个查询使用的内存
work_mem = 4MB

# 维护操作的内存
maintenance_work_mem = 64MB
```

重启 PostgreSQL：

```bash
sudo systemctl restart postgresql
```

---

## 📊 数据库管理

### 查看数据库统计

```bash
# 查看记录总数
psql -h localhost -U scales_user -d scales_db -c "SELECT COUNT(*) FROM assessment_records;"

# 查看各量表的记录数
psql -h localhost -U scales_user -d scales_db -c "
  SELECT scale_id, scale_title, COUNT(*) as count
  FROM assessment_records
  GROUP BY scale_id, scale_title
  ORDER BY count DESC;
"

# 查看最近 10 条记录
psql -h localhost -U scales_user -d scales_db -c "
  SELECT id, scale_id, gender, age, total_score, completed_at
  FROM assessment_records
  ORDER BY created_at DESC
  LIMIT 10;
"
```

---

### 清理测试数据（谨慎操作）

```bash
# 删除所有测试记录（ID 以 "test-" 开头）
psql -h localhost -U scales_user -d scales_db -c "
  DELETE FROM assessment_records WHERE id LIKE 'test-%';
"
```

---

## ❓ 常见问题

### Q1: 提示 "role 'scales_user' does not exist"

**解决方法：**

```bash
sudo -u postgres psql -c "CREATE USER scales_user WITH PASSWORD 'your_password';"
```

---

### Q2: 提示 "database 'scales_db' does not exist"

**解决方法：**

```bash
sudo -u postgres psql -c "CREATE DATABASE scales_db;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE scales_db TO scales_user;"
```

---

### Q3: 连接超时或拒绝连接

**检查步骤：**

1. PostgreSQL 是否运行：`sudo systemctl status postgresql`
2. 端口是否监听：`sudo netstat -tuln | grep 5432`
3. 配置文件是否正确：检查 `pg_hba.conf`

---

### Q4: Prisma 报错 "PrismaClientInitializationError"

**解决方法：**

1. 检查 `.env` 文件中的 `DATABASE_URL` 是否正确
2. 重新生成 Prisma Client：`npx prisma generate`
3. 推送数据库结构：`npx prisma db push`

---

## 🎉 完成！

如果一切顺利，你的测评网站现在已经连接到 PostgreSQL 数据库，所有测评数据都会持久化保存。

---

## 📞 技术支持

如果遇到问题，请检查：

1. PostgreSQL 日志：`sudo tail -f /var/log/postgresql/postgresql-14-main.log`
2. Next.js 日志：`pm2 logs scales`（如果使用 PM2）
3. 系统日志：`sudo journalctl -u postgresql -f`

---

**最后更新**: 2025-01-07
