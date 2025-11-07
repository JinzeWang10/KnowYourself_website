# 🚀 快速部署指南（阿里云服务器）

本文档提供最简化的部署步骤，帮助你快速在阿里云 Ubuntu 服务器上部署数据库。

---

## ⚡ 一键部署脚本

SSH 登录服务器后，执行以下命令（全部复制粘贴）：

```bash
# 1. 安装 PostgreSQL
sudo apt update && sudo apt install -y postgresql postgresql-contrib

# 2. 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 3. 创建数据库和用户
sudo -u postgres psql <<EOF
CREATE DATABASE scales_db;
CREATE USER scales_user WITH PASSWORD 'ChangeMe2025!';
GRANT ALL PRIVILEGES ON DATABASE scales_db TO scales_user;
\c scales_db
GRANT ALL ON SCHEMA public TO scales_user;
\q
EOF

echo "✅ PostgreSQL 安装和配置完成！"
```

**⚠️ 记得修改密码！** 将 `ChangeMe2025!` 改为你的强密码。

---

## 📝 配置项目

### 1. 进入项目目录

```bash
cd /path/to/your/knowyourself_website
```

### 2. 创建 .env 文件

```bash
cat > .env <<EOF
DATABASE_URL="postgresql://scales_user:ChangeMe2025!@localhost:5432/scales_db"
NEXT_PUBLIC_SITE_URL=https://your-domain.com
EOF
```

**⚠️ 记得修改：**
- 将 `ChangeMe2025!` 改为你设置的数据库密码
- 将 `your-domain.com` 改为你的实际域名

### 3. 初始化数据库

```bash
npm install
npx prisma generate
npx prisma db push
```

看到 "Your database is now in sync" 表示成功！

### 4. 重启应用

```bash
# 如果使用 PM2
pm2 restart all

# 或者重新构建运行
npm run build
npm start
```

---

## ✅ 验证是否成功

执行以下命令检查数据库表是否创建：

```bash
psql -h localhost -U scales_user -d scales_db -c "\dt"
```

输入密码后，应该看到 `assessment_records` 表。

---

## 🔍 快速测试

访问网站完成一次测评，然后检查记录数：

```bash
psql -h localhost -U scales_user -d scales_db -c "SELECT COUNT(*) FROM assessment_records;"
```

如果显示数字 > 0，说明一切正常！

---

## 📚 详细文档

完整部署说明请参考：[DATABASE_DEPLOYMENT.md](./DATABASE_DEPLOYMENT.md)

---

## 🆘 遇到问题？

### 常见错误快速修复

**1. "role 'scales_user' does not exist"**

```bash
sudo -u postgres psql -c "CREATE USER scales_user WITH PASSWORD 'your_password';"
```

**2. "database 'scales_db' does not exist"**

```bash
sudo -u postgres psql -c "CREATE DATABASE scales_db;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE scales_db TO scales_user;"
```

**3. "connection refused"**

```bash
sudo systemctl start postgresql
sudo systemctl status postgresql
```

---

## 🎉 完成！

数据库部署完成，现在所有测评数据都会永久保存在 PostgreSQL 中。
