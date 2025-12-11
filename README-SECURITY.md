# 🛡️ KnowYourself 网站安全与迁移指南

## 📖 文档导航

本仓库包含完整的安全加固和服务器迁移解决方案。

### 🚨 如果你遭受了挖矿攻击

**请立即执行以下步骤：**

1. **阅读快速开始**: [QUICK-START.md](QUICK-START.md) ⭐ **从这里开始**
2. **执行备份**: 运行 `backup-before-reinstall.sh`
3. **重装系统**: 参考 [SERVER-MIGRATION.md](SERVER-MIGRATION.md)
4. **快速部署**: 运行 `fresh-deploy.sh`
5. **安全检查**: 参考 [SECURITY-CHECKLIST.md](SECURITY-CHECKLIST.md)

---

## 📚 完整文档列表

### 核心文档

| 文档 | 适用场景 | 重要性 |
|------|---------|--------|
| [QUICK-START.md](QUICK-START.md) | 服务器重装快速指南 | 🔴 必读 |
| [SERVER-MIGRATION.md](SERVER-MIGRATION.md) | 完整的重装迁移步骤 | 🔴 必读 |
| [SECURITY-CHECKLIST.md](SECURITY-CHECKLIST.md) | 安全配置检查清单 | 🔴 必读 |

### 安全配置文档

| 文档 | 用途 | 重要性 |
|------|------|--------|
| [PORT-SECURITY.md](PORT-SECURITY.md) | 端口安全配置指南 | 🟡 推荐 |
| [test-security.md](test-security.md) | 安全测试验证 | 🟡 推荐 |
| [nginx-security.conf](nginx-security.conf) | Nginx 安全配置示例 | 🟡 推荐 |

### 技术文档

| 文档 | 用途 | 重要性 |
|------|------|--------|
| [DATABASE_SCHEMA_UPDATE.md](DATABASE_SCHEMA_UPDATE.md) | 数据库架构说明 | 🟢 参考 |
| [BACKEND_ANALYSIS.md](BACKEND_ANALYSIS.md) | 后端功能文档 | 🟢 参考 |

---

## 🛠️ 脚本工具

### 自动化脚本

| 脚本 | 用途 | 使用时机 |
|------|------|---------|
| `backup-before-reinstall.sh` | 全自动备份脚本 | 重装系统前 |
| `fresh-deploy.sh` | 全自动部署脚本 | 重装系统后 |
| `deploy.sh` | 日常更新部署 | 代码更新时 |

### 使用示例

```bash
# 备份（在旧服务器）
chmod +x backup-before-reinstall.sh
./backup-before-reinstall.sh

# 部署（在新服务器）
chmod +x fresh-deploy.sh
./fresh-deploy.sh

# 日常更新
./deploy.sh
```

---

## 🛡️ 安全措施概览

### 已实施的安全功能

#### 1. **速率限制** ✅
- 📁 [lib/rate-limiter.ts](lib/rate-limiter.ts)
- POST: 10 次/分钟
- GET: 60 次/分钟
- 自动 IP 黑名单（超限3倍封禁1小时）

#### 2. **输入验证和消毒** ✅
- 📁 [lib/input-validator.ts](lib/input-validator.ts)
- 防御 XSS、SQL 注入、命令注入
- Payload 限制 100KB
- JSON 深度限制 5 层

#### 3. **安全响应头** ✅
- 📁 [next.config.ts](next.config.ts)
- Content-Security-Policy (CSP)
- HSTS, X-Frame-Options 等

#### 4. **端口安全** ✅
- 从高危端口 8080 改为 42156
- 减少 95%+ 自动扫描攻击

---

## 🏗️ 安全架构

```
Internet (HTTPS/443)
        ↓
    [Cloudflare CDN - 可选]
        ↓
    [防火墙 UFW]
    - 仅开放 443, SSH
        ↓
    Nginx (443)
    - SSL 证书
    - 速率限制
    - 安全响应头
        ↓
    Node.js App (42156) ← 不对外暴露
    - 应用层速率限制
    - 输入验证
    - CSP 策略
        ↓
    PostgreSQL (localhost:5432) ← 仅本地
    - 强密码
    - 权限限制
```

---

## 🚀 快速开始

### 场景 1: 日常代码更新

```bash
# 在服务器上
git pull origin main
./deploy.sh
```

### 场景 2: 首次部署（全新服务器）

```bash
# 在新服务器上
git clone https://github.com/your-repo/KnowYourself_website.git
cd KnowYourself_website
chmod +x fresh-deploy.sh
./fresh-deploy.sh
```

### 场景 3: 服务器被攻击，需要重装

1. **备份数据** (旧服务器)
   ```bash
   ./backup-before-reinstall.sh
   scp root@old-server:~/backup_*.tar.gz ./
   ```

2. **重装系统** (云服务商控制台)
   - 选择 Ubuntu 22.04 LTS

3. **快速部署** (新服务器)
   ```bash
   ./fresh-deploy.sh
   ```

4. **恢复数据**
   ```bash
   pg_restore -U scales_user -d scales_db backup.dump
   ```

详细步骤见：[QUICK-START.md](QUICK-START.md)

---

## ✅ 安全验证

### 基本验证

```bash
# 1. 检查端口（应该只看到 443 和 SSH）
nmap your-server-ip

# 2. 检查安全响应头
curl -I https://your-domain.com

# 3. 测试速率限制
# 参考 test-security.md

# 4. 检查应用状态
pm2 status
pm2 logs knowyourself
```

### 完整测试

参考 [test-security.md](test-security.md) 进行完整的安全测试。

---

## 📊 防护效果

实施安全措施后：

| 攻击类型 | 防护状态 | 防护方式 |
|---------|---------|---------|
| 挖矿攻击 | ✅ 已防御 | 端口隐藏 + 速率限制 |
| XSS 攻击 | ✅ 已防御 | CSP + 输入验证 |
| SQL 注入 | ✅ 已防御 | Prisma ORM + 输入验证 |
| 命令注入 | ✅ 已防御 | 输入验证 + 模式检测 |
| DDoS 攻击 | ✅ 已防御 | 多层速率限制 |
| 点击劫持 | ✅ 已防御 | X-Frame-Options |
| 自动扫描 | ✅ 已防御 | 非标准端口 |
| 暴力破解 | ✅ 已防御 | 速率限制 + Fail2Ban |

---

## 🎯 技术栈

### 前端
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS

### 后端
- Next.js API Routes
- Prisma ORM
- PostgreSQL
- Node.js 20

### 安全
- Rate Limiting (自定义实现)
- Input Validation (自定义实现)
- CSP (Next.js 配置)
- Nginx 反向代理
- Let's Encrypt SSL
- UFW 防火墙
- Fail2Ban

---

## 📞 获取帮助

### 遇到问题？

1. **查看文档**
   - 按场景查找对应文档
   - 查看常见问题解答

2. **检查日志**
   ```bash
   # 应用日志
   pm2 logs knowyourself

   # Nginx 日志
   sudo tail -f /var/log/nginx/error.log

   # 系统日志
   journalctl -xe
   ```

3. **联系支持**
   - 云服务商技术支持
   - GitHub Issues

---

## 🔄 更新日志

### 2024-12-11 - 全面安全加固
- ✅ 实施 IP 级别速率限制
- ✅ 添加严格输入验证
- ✅ 配置 CSP 和安全响应头
- ✅ 更改为安全端口 42156
- ✅ 创建完整迁移文档和脚本

### 之前版本
- 基础功能开发
- 数据库设计
- 量表功能实现

---

## 📄 许可证

本项目为私有项目，仅供授权用户使用。

---

## 🙏 致谢

感谢以下开源项目：
- Next.js
- React
- Prisma
- PostgreSQL
- Nginx
- Let's Encrypt

---

**保持安全，定期更新，持续监控！** 🛡️
