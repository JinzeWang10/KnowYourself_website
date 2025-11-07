# ✅ 阿里云服务器部署检查清单

部署前请按照此清单逐项检查，确保一切配置正确。

---

## 📋 部署前准备

### 服务器环境

- [ ] 服务器系统：Ubuntu 20.04 / 22.04 LTS
- [ ] CPU: 至少 1 核
- [ ] 内存: 至少 1GB
- [ ] 磁盘: 至少 20GB 可用空间
- [ ] 已安装 Node.js (v18+) 和 npm
- [ ] 已安装 Git
- [ ] 拥有 sudo 权限

### 本地准备

- [ ] 代码已推送到 Git 仓库
- [ ] 已准备好域名（可选）
- [ ] 已记录数据库密码（强密码）

---

## 🗄️ 数据库部署

### 1. 安装 PostgreSQL

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

- [ ] PostgreSQL 安装成功
- [ ] 服务已启动
- [ ] 设置为开机自启

### 2. 创建数据库和用户

```bash
sudo -u postgres psql
```

在 psql 中执行：

```sql
CREATE DATABASE scales_db;
CREATE USER scales_user WITH PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE scales_db TO scales_user;
\c scales_db
GRANT ALL ON SCHEMA public TO scales_user;
\q
```

- [ ] 数据库 `scales_db` 已创建
- [ ] 用户 `scales_user` 已创建
- [ ] 密码已设置并记录
- [ ] 权限已授予

### 3. 测试数据库连接

```bash
psql -h localhost -U scales_user -d scales_db
```

- [ ] 可以成功连接（输入密码后进入 psql）
- [ ] 输入 `\q` 可以退出

---

## 📦 项目部署

### 1. 克隆或更新代码

```bash
cd /var/www  # 或你的项目目录
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

- [ ] 代码已克隆到服务器
- [ ] 已进入项目目录

### 2. 安装依赖

```bash
npm install
```

- [ ] 所有依赖安装成功
- [ ] 没有报错

### 3. 配置环境变量

```bash
nano .env
```

添加以下内容（修改密码和域名）：

```env
DATABASE_URL="postgresql://scales_user:your_strong_password@localhost:5432/scales_db"
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

- [ ] `.env` 文件已创建
- [ ] `DATABASE_URL` 配置正确（密码、用户名、数据库名）
- [ ] `NEXT_PUBLIC_SITE_URL` 配置正确
- [ ] 文件权限合适（建议 600）

### 4. 初始化数据库

```bash
npx prisma generate
npx prisma db push
```

预期输出：
```
✔ Generated Prisma Client
Your database is now in sync with your Prisma schema.
```

- [ ] Prisma Client 生成成功
- [ ] 数据库表结构创建成功
- [ ] 没有报错

### 5. 验证数据库表

```bash
psql -h localhost -U scales_user -d scales_db -c "\dt"
```

- [ ] 看到 `assessment_records` 表
- [ ] 表结构正确

### 6. 构建项目

```bash
npm run build
```

- [ ] 构建成功
- [ ] 没有 TypeScript 错误
- [ ] 生成了 `.next` 目录

---

## 🚀 启动应用

### 选项 A: 使用 PM2（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "scales" -- start

# 设置开机自启
pm2 startup
pm2 save
```

- [ ] PM2 已安装
- [ ] 应用已启动
- [ ] 设置为开机自启
- [ ] `pm2 list` 显示应用运行中

### 选项 B: 直接运行（不推荐生产环境）

```bash
npm start
```

- [ ] 应用已启动
- [ ] 监听在 8080 端口

---

## 🌐 配置 Nginx（可选但推荐）

如果使用 Nginx 作为反向代理：

### 1. 安装 Nginx

```bash
sudo apt install -y nginx
```

- [ ] Nginx 已安装

### 2. 配置站点

```bash
sudo nano /etc/nginx/sites-available/scales
```

添加配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- [ ] 配置文件已创建
- [ ] 域名已正确设置

### 3. 启用站点

```bash
sudo ln -s /etc/nginx/sites-available/scales /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

- [ ] 配置测试通过
- [ ] Nginx 已重启
- [ ] 没有错误

### 4. 配置 SSL（推荐）

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

- [ ] SSL 证书已安装
- [ ] HTTPS 可以访问

---

## 🧪 功能测试

### 1. 访问网站

- [ ] 网站可以正常访问
- [ ] 首页加载正常
- [ ] 样式显示正确

### 2. 测试测评流程

- [ ] 可以选择量表
- [ ] 可以填写用户信息
- [ ] 可以完成测评
- [ ] 可以查看结果

### 3. 测试数据存储

```bash
psql -h localhost -U scales_user -d scales_db -c "SELECT COUNT(*) FROM assessment_records;"
```

- [ ] 完成测评后，数据库中有记录
- [ ] 记录数 > 0

### 4. 测试 API

```bash
curl http://localhost:8080/api/assessments?scaleId=ani
```

- [ ] API 返回 JSON 数据
- [ ] `success: true`
- [ ] 数据格式正确

---

## 🔒 安全检查

### 防火墙

- [ ] 5432 端口（PostgreSQL）**未**对外开放
- [ ] 只允许 localhost 连接数据库
- [ ] 80/443 端口已开放（HTTP/HTTPS）

### 权限

- [ ] `.env` 文件权限为 600 或更严格
- [ ] 数据库密码足够强（至少 12 位，包含大小写字母、数字、符号）
- [ ] 不在 Git 中提交 `.env` 文件

### 备份

- [ ] 已设置数据库定期备份（参考 DATABASE_DEPLOYMENT.md）
- [ ] 备份脚本可以正常运行

---

## 📊 监控和日志

### 应用日志

```bash
# PM2 日志
pm2 logs scales

# Next.js 日志（如果直接运行）
# 查看控制台输出
```

- [ ] 可以查看应用日志
- [ ] 没有持续的错误

### 数据库日志

```bash
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

- [ ] 可以查看数据库日志
- [ ] 没有异常错误

### 系统资源

```bash
# 查看内存使用
free -h

# 查看磁盘使用
df -h

# 查看 CPU 使用
top
```

- [ ] 内存使用正常（< 80%）
- [ ] 磁盘空间充足（> 20% 可用）
- [ ] CPU 负载正常

---

## 🎉 部署完成！

如果以上所有项目都已勾选 ✅，恭喜你，部署成功！

### 后续维护

- 定期更新系统：`sudo apt update && sudo apt upgrade`
- 定期备份数据库（已设置 cron job）
- 监控磁盘空间和内存使用
- 定期查看应用日志

### 常用命令

```bash
# 查看应用状态
pm2 status

# 重启应用
pm2 restart scales

# 查看日志
pm2 logs scales

# 查看数据库记录数
psql -h localhost -U scales_user -d scales_db -c "SELECT scale_id, COUNT(*) FROM assessment_records GROUP BY scale_id;"

# 备份数据库
pg_dump -h localhost -U scales_user scales_db | gzip > backup_$(date +%Y%m%d).sql.gz
```

---

## 📞 需要帮助？

如果遇到问题：

1. 查看详细文档：[DATABASE_DEPLOYMENT.md](./DATABASE_DEPLOYMENT.md)
2. 查看快速指南：[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)
3. 检查日志文件
4. 提交 GitHub Issue

---

**最后更新**: 2025-01-07
