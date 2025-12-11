# 🛡️ 安全部署检查清单

## 📋 概述

本清单包含了部署 KnowYourself 网站到生产环境时必须完成的所有安全配置。

**重要性等级**：
- 🔴 **必须** - 不可跳过的关键安全措施
- 🟡 **推荐** - 强烈建议实施的安全措施
- 🟢 **可选** - 增强安全性的额外措施

---

## 🎯 第一阶段：应用层安全（已完成）

### ✅ 速率限制
- [x] 🔴 创建 IP 级别速率限制器 ([lib/rate-limiter.ts](lib/rate-limiter.ts))
- [x] 🔴 POST 接口：10 次/分钟
- [x] 🔴 GET 接口：60 次/分钟
- [x] 🔴 管理接口：30 次/分钟
- [x] 🔴 自动 IP 黑名单（超限 3 倍封禁 1 小时）

### ✅ 输入验证
- [x] 🔴 创建输入验证工具 ([lib/input-validator.ts](lib/input-validator.ts))
- [x] 🔴 JSON payload 限制 100KB
- [x] 🔴 JSON 嵌套深度限制 5 层
- [x] 🔴 危险模式检测（XSS、SQL 注入、命令注入）
- [x] 🔴 字段类型和范围验证
- [x] 🔴 HTML 实体编码

### ✅ 安全响应头
- [x] 🔴 Content-Security-Policy (CSP)
- [x] 🔴 Strict-Transport-Security (HSTS)
- [x] 🔴 X-Frame-Options: DENY
- [x] 🔴 X-Content-Type-Options: nosniff
- [x] 🔴 Referrer-Policy
- [x] 🔴 Permissions-Policy

### ✅ 端口安全
- [x] 🔴 更改为非标准端口 (42156)
- [x] 🔴 更新 package.json
- [x] 🔴 更新 deploy.sh

**测试文档**：[test-security.md](test-security.md)

---

## 🔥 第二阶段：服务器层安全（待部署）

### 🔴 必须完成

#### 1. 防火墙配置
```bash
# 安装 UFW
sudo apt install ufw

# 默认规则
sudo ufw default deny incoming
sudo ufw default allow outgoing

# 仅开放必要端口
sudo ufw allow 22/tcp    # SSH（后续改为其他端口）
sudo ufw allow 443/tcp   # HTTPS

# 启用防火墙
sudo ufw enable

# 检查状态
sudo ufw status verbose
```
- [ ] 🔴 安装并配置 UFW
- [ ] 🔴 仅开放 SSH 和 HTTPS 端口
- [ ] 🔴 内部端口 42156 不对外暴露

#### 2. SSL/TLS 证书
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 测试自动续期
sudo certbot renew --dry-run
```
- [ ] 🔴 安装 Let's Encrypt 证书
- [ ] 🔴 配置自动续期
- [ ] 🔴 强制 HTTPS（HTTP 重定向到 HTTPS）
- [ ] 🔴 测试证书有效性

#### 3. Nginx 反向代理
```bash
# 复制配置文件
sudo cp nginx-security.conf /etc/nginx/sites-available/knowyourself

# 修改配置（替换域名）
sudo nano /etc/nginx/sites-available/knowyourself

# 启用站点
sudo ln -s /etc/nginx/sites-available/knowyourself /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```
- [ ] 🔴 安装 Nginx
- [ ] 🔴 配置反向代理 (443 → 42156)
- [ ] 🔴 启用 Nginx 速率限制
- [ ] 🔴 配置静态资源缓存
- [ ] 🔴 禁用服务器版本信息

**配置文件**：[nginx-security.conf](nginx-security.conf)

#### 4. 环境变量安全
```bash
# 创建生产环境配置
nano .env.production

# 添加配置
PORT=42156
NODE_ENV=production
DATABASE_URL=postgresql://...
```
- [ ] 🔴 创建 .env.production
- [ ] 🔴 设置正确的数据库连接
- [ ] 🔴 确保 .env.production 不提交到 Git
- [ ] 🔴 设置文件权限 (chmod 600 .env.production)

#### 5. 数据库安全
```bash
# PostgreSQL 配置
sudo nano /etc/postgresql/*/main/postgresql.conf

# 仅监听本地
listen_addresses = 'localhost'

# 重启数据库
sudo systemctl restart postgresql
```
- [ ] 🔴 数据库仅监听 localhost
- [ ] 🔴 使用强密码
- [ ] 🔴 定期备份数据库
- [ ] 🔴 限制数据库用户权限

---

## 🟡 第三阶段：增强安全（强烈推荐）

### 1. 更改 SSH 端口
```bash
# 编辑 SSH 配置
sudo nano /etc/ssh/sshd_config

# 修改配置
Port 49152  # 改为其他端口
PasswordAuthentication no  # 禁用密码登录
PermitRootLogin no  # 禁止 root 登录

# 重启 SSH
sudo systemctl restart sshd

# 更新防火墙
sudo ufw allow 49152/tcp
sudo ufw delete allow 22/tcp
```
- [ ] 🟡 更改 SSH 默认端口
- [ ] 🟡 禁用密码登录（仅 SSH 密钥）
- [ ] 🟡 禁止 root 登录

### 2. Fail2Ban
```bash
# 安装
sudo apt install fail2ban

# 配置
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# 启用
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```
- [ ] 🟡 安装 Fail2Ban
- [ ] 🟡 配置 SSH 保护
- [ ] 🟡 配置 Nginx 速率限制保护
- [ ] 🟡 设置封禁时间和重试次数

### 3. 自动更新
```bash
# 安装自动更新
sudo apt install unattended-upgrades

# 配置
sudo dpkg-reconfigure unattended-upgrades
```
- [ ] 🟡 启用自动安全更新
- [ ] 🟡 配置更新通知

### 4. 日志监控
```bash
# 安装 Logwatch
sudo apt install logwatch

# 配置每日报告
sudo nano /etc/cron.daily/00logwatch
```
- [ ] 🟡 配置日志监控
- [ ] 🟡 设置告警通知
- [ ] 🟡 定期检查异常访问

### 5. 备份策略
```bash
# 创建备份脚本
nano backup.sh

# 添加到 crontab
crontab -e
# 每天凌晨 2 点备份
0 2 * * * /path/to/backup.sh
```
- [ ] 🟡 配置数据库自动备份
- [ ] 🟡 备份应用代码和配置
- [ ] 🟡 定期测试恢复流程

---

## 🟢 第四阶段：高级安全（可选）

### 1. WAF (Web Application Firewall)
- [ ] 🟢 使用 Cloudflare WAF
- [ ] 🟢 或安装 ModSecurity

### 2. 入侵检测系统 (IDS)
```bash
# 安装 OSSEC
wget -q -O - https://updates.atomicorp.com/installers/atomic | sudo bash
sudo apt install ossec-hids
```
- [ ] 🟢 安装 OSSEC 或 Snort
- [ ] 🟢 配置文件完整性监控
- [ ] 🟢 配置实时告警

### 3. 容器化部署
```dockerfile
# Dockerfile
FROM node:20-alpine
# ... 安全配置
```
- [ ] 🟢 使用 Docker 容器化
- [ ] 🟢 配置容器安全策略
- [ ] 🟢 使用非 root 用户运行

### 4. CDN 加速和 DDoS 防护
- [ ] 🟢 接入 Cloudflare
- [ ] 🟢 启用 DDoS 保护
- [ ] 🟢 配置缓存策略

---

## 🧪 测试和验证

### 安全测试
```bash
# 1. 端口扫描
nmap -p- your-server-ip

# 2. SSL 测试
curl -I https://your-domain.com

# 3. 速率限制测试
# 参考 test-security.md

# 4. 安全响应头测试
curl -I https://your-domain.com | grep -E "(CSP|HSTS|X-Frame)"
```

- [ ] 🔴 端口扫描（仅 443 和 SSH 端口开放）
- [ ] 🔴 SSL 证书有效性测试
- [ ] 🔴 速率限制功能测试
- [ ] 🔴 输入验证功能测试
- [ ] 🔴 安全响应头验证

### 性能测试
```bash
# 使用 Apache Bench
ab -n 1000 -c 10 https://your-domain.com/

# 使用 wrk
wrk -t12 -c400 -d30s https://your-domain.com/
```
- [ ] 🟡 负载测试
- [ ] 🟡 并发测试
- [ ] 🟡 性能基准测试

### 渗透测试
- [ ] 🟢 XSS 攻击测试
- [ ] 🟢 SQL 注入测试
- [ ] 🟢 CSRF 攻击测试
- [ ] 🟢 使用 OWASP ZAP 扫描

---

## 📊 监控和维护

### 日常监控
```bash
# 系统资源
htop

# 应用日志
pm2 logs knowyourself

# Nginx 日志
tail -f /var/log/nginx/knowyourself-access.log

# 安全日志
sudo tail -f /var/log/auth.log
```

- [ ] 🔴 配置监控告警
- [ ] 🟡 设置资源使用告警
- [ ] 🟡 配置错误日志通知

### 定期维护
- [ ] 🔴 每周检查安全日志
- [ ] 🔴 每月更新系统和依赖
- [ ] 🟡 每季度进行安全审计
- [ ] 🟡 每半年更换敏感密钥

---

## 🚨 应急响应计划

### 如果发现正在被攻击

1. **立即响应**
```bash
# 封禁攻击 IP
sudo ufw deny from 攻击者IP

# 查看攻击日志
tail -100 /var/log/nginx/knowyourself-access.log

# 临时关闭服务（如果需要）
pm2 stop knowyourself
```

2. **分析和修复**
- 分析攻击类型和来源
- 修复发现的漏洞
- 更新安全策略

3. **恢复服务**
```bash
# 重启服务
pm2 restart knowyourself

# 验证功能
curl https://your-domain.com
```

### 联系方式
- 技术支持：[你的邮箱]
- 应急电话：[你的电话]
- 云服务商支持：[服务商支持渠道]

---

## 📚 参考文档

- [test-security.md](test-security.md) - 安全测试指南
- [PORT-SECURITY.md](PORT-SECURITY.md) - 端口安全配置
- [nginx-security.conf](nginx-security.conf) - Nginx 配置示例
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Web 安全指南

---

## ✅ 部署前最终检查

在正式上线前，请确认以下所有 🔴 必须项已完成：

**应用层**
- [x] 速率限制器已实施
- [x] 输入验证已实施
- [x] CSP 和安全响应头已配置
- [x] 端口已改为非标准端口

**服务器层**
- [ ] 防火墙已配置
- [ ] SSL 证书已安装
- [ ] Nginx 反向代理已配置
- [ ] 环境变量已正确设置
- [ ] 数据库安全已配置

**测试验证**
- [ ] 所有安全测试已通过
- [ ] 功能测试正常
- [ ] 性能测试满足要求

**监控告警**
- [ ] 日志监控已配置
- [ ] 告警通知已设置
- [ ] 备份策略已实施

---

**签署确认**

部署日期：__________

部署人员：__________

复核人员：__________

---

🎉 完成所有检查项后，你的应用将具备生产环境级别的安全防护！
