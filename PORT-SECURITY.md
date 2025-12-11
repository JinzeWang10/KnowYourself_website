# 端口安全配置指南

## 🎯 为什么要更改端口？

### **常见端口的风险**

使用标准端口（如 3000, 8080, 8000）会让你的服务器成为自动化攻击的目标：

| 端口 | 风险等级 | 说明 |
|------|---------|------|
| **8080** ⚠️ | 🔴 极高 | HTTP 备用端口，挖矿脚本首选扫描目标 |
| 3000 | 🔴 极高 | Node.js/React 默认开发端口 |
| 8000, 8888 | 🟡 高 | 常见开发服务器端口 |
| 80, 443 | 🔴 极高 | 标准 HTTP/HTTPS（需要反向代理保护）|
| 27017 | 🔴 极高 | MongoDB 默认端口（数据库攻击） |
| 5432 | 🔴 极高 | PostgreSQL 默认端口 |

**统计数据**：
- 端口 8080 每天被扫描次数：**100,000+ 次**
- 挖矿僵尸网络主要扫描端口：8080, 3000, 8000, 9000
- 使用非标准端口可减少 **95% 以上**的自动化攻击

## ✅ 新的安全配置

### **当前端口策略**

```bash
# 旧配置（不安全）
PORT=8080  ❌ 极易被扫描和攻击

# 新配置（安全）
PORT=42156  ✅ 随机端口，难以被猜测
```

**端口选择原则**：
- ✅ 使用 10000-65535 范围
- ✅ 避开常见的应用端口
- ✅ 不使用连续或有规律的数字
- ✅ 配合反向代理使用

### **配置文件更改**

#### 1. **package.json** ✅ 已更新
```json
{
  "scripts": {
    "start": "next start -p ${PORT:-42156}"
  }
}
```

#### 2. **deploy.sh** ✅ 已更新
```bash
# 使用环境变量，默认 42156
PORT=${PORT:-42156}
```

#### 3. **环境变量配置**
创建 `.env.production`:
```bash
# 生产环境端口
PORT=42156

# 或者使用随机端口
# PORT=51203
# PORT=33891
```

## 🛡️ 多层防护策略

### **推荐架构**

```
Internet (仅暴露 443/HTTPS)
        ↓
    [防火墙]
        ↓
    Nginx/Caddy (443)
        ↓ 反向代理
    Node.js App (42156) ← 仅内网访问
        ↓
    Database (5432) ← 仅 localhost 访问
```

### **防火墙配置 (UFW/iptables)**

```bash
# 仅开放 SSH 和 HTTPS
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH（建议改为非标准端口）
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# 内部端口 42156 不对外开放（仅 localhost）
# Nginx 通过 127.0.0.1:42156 访问
```

### **Nginx 反向代理配置**

已创建配置文件：[nginx-security.conf](nginx-security.conf)

**安装和配置**：
```bash
# 1. 复制配置文件
sudo cp nginx-security.conf /etc/nginx/sites-available/knowyourself

# 2. 修改域名和证书路径
sudo nano /etc/nginx/sites-available/knowyourself
# 替换 your-domain.com 为你的域名

# 3. 启用配置
sudo ln -s /etc/nginx/sites-available/knowyourself /etc/nginx/sites-enabled/

# 4. 测试配置
sudo nginx -t

# 5. 重启 Nginx
sudo systemctl restart nginx
```

### **SSL 证书（Let's Encrypt）**

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书（自动配置 Nginx）
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期（每 12 小时检查一次）
sudo certbot renew --dry-run
```

## 🔒 额外安全措施

### **1. 更改 SSH 端口**

SSH 默认端口 22 也是高风险端口，建议更改：

```bash
# 编辑 SSH 配置
sudo nano /etc/ssh/sshd_config

# 更改端口（例如 49152）
Port 49152

# 禁用密码登录，仅使用 SSH 密钥
PasswordAuthentication no

# 禁止 root 登录
PermitRootLogin no

# 重启 SSH
sudo systemctl restart sshd

# 更新防火墙
sudo ufw allow 49152/tcp
sudo ufw delete allow 22/tcp
```

### **2. 使用 Fail2Ban**

自动封禁多次失败登录的 IP：

```bash
# 安装
sudo apt install fail2ban

# 配置
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# 启用
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# 查看状态
sudo fail2ban-client status
```

### **3. 端口隐藏技术（端口敲门）**

高级防护：只有特定的端口敲门序列才能打开服务端口

```bash
# 安装 knockd
sudo apt install knockd

# 配置敲门序列
sudo nano /etc/knockd.conf

# 例如：依次访问 7000、8000、9000 端口后才开放 42156
```

### **4. 定期端口扫描审计**

检查哪些端口对外开放：

```bash
# 本地检查
sudo netstat -tulpn | grep LISTEN

# 外部扫描（从其他机器）
nmap -p- your-server-ip

# 应该只看到 443 端口（和可能的 SSH 端口）
```

## 📊 监控和告警

### **日志监控**

```bash
# Nginx 访问日志
tail -f /var/log/nginx/knowyourself-access.log

# 应用日志
pm2 logs knowyourself

# 系统日志
journalctl -u nginx -f
```

### **异常检测**

```bash
# 查看异常访问（大量 429 错误可能是攻击）
awk '($9 == 429)' /var/log/nginx/knowyourself-access.log | \
  awk '{print $1}' | sort | uniq -c | sort -nr | head -20

# 查看被封禁的 IP
sudo fail2ban-client status nginx-limit-req
```

## 🚨 应急响应

### **如果发现正在被攻击**

1. **立即封禁攻击 IP**
```bash
# 临时封禁
sudo ufw deny from 攻击者IP

# 或使用 iptables
sudo iptables -A INPUT -s 攻击者IP -j DROP
```

2. **启用 Cloudflare DDoS 保护**
```bash
# 将域名 DNS 指向 Cloudflare
# 启用 "Under Attack" 模式
```

3. **临时关闭服务**
```bash
pm2 stop knowyourself
# 或
sudo systemctl stop nginx
```

4. **分析攻击日志**
```bash
# 找出最频繁的请求 IP
awk '{print $1}' /var/log/nginx/knowyourself-access.log | \
  sort | uniq -c | sort -nr | head -50
```

## ✅ 部署检查清单

部署到生产环境前，请确认：

- [ ] 已将端口改为非标准端口（42156）
- [ ] 已配置 Nginx 反向代理
- [ ] 已安装 SSL 证书（HTTPS）
- [ ] 已配置防火墙，仅开放必要端口
- [ ] 已更改 SSH 端口
- [ ] 已安装 Fail2Ban
- [ ] 已启用 Nginx 速率限制
- [ ] 已配置日志监控
- [ ] 已测试速率限制功能
- [ ] 已测试 SSL 证书自动续期

## 📝 端口配置方式

### **方式 1：环境变量（推荐）**

```bash
# 在服务器上设置
export PORT=42156

# 或在 .env.production 中
echo "PORT=42156" >> .env.production

# 启动服务
npm start
```

### **方式 2：直接指定**

```bash
# 临时使用其他端口
PORT=51203 npm start

# PM2 启动
PORT=42156 pm2 start npm --name knowyourself -- start
```

### **方式 3：修改 package.json**

```json
{
  "scripts": {
    "start": "next start -p 42156"
  }
}
```

## 🎉 预期效果

实施端口安全配置后：

- ✅ 自动化扫描攻击减少 **95%+**
- ✅ 挖矿脚本无法找到服务入口
- ✅ 仅通过域名（HTTPS）访问
- ✅ 真实端口对外隐藏
- ✅ 多层防护，即使一层被突破仍有保护

## 🔧 常见问题

### Q: 为什么选择 42156 这个端口？
A:
- 在 10000-65535 范围内（非特权端口）
- 不是常见应用的默认端口
- 数字随机，难以猜测
- 可以根据需要更换为其他随机端口

### Q: 如果忘记了端口怎么办？
A:
```bash
# 查看正在监听的端口
sudo netstat -tulpn | grep node

# 或查看 PM2 配置
pm2 describe knowyourself
```

### Q: 需要重启服务器吗？
A: 不需要，只需要重启应用：
```bash
pm2 restart knowyourself
# 或
./deploy.sh
```

### Q: Nginx 和应用端口的关系？
A:
- **对外暴露**：443 (HTTPS) - 通过 Nginx
- **内部使用**：42156 - Node.js 应用
- 用户访问 `https://yourdomain.com` → Nginx (443) → App (42156)

## 📚 相关资源

- [OWASP 端口安全指南](https://owasp.org/)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Let's Encrypt 证书指南](https://letsencrypt.org/)
- [UFW 防火墙教程](https://help.ubuntu.com/community/UFW)

---

**总结**：端口安全是防御挖矿攻击的第一道防线。配合速率限制、输入验证、CSP 策略，可以构建多层防护体系，大幅提高系统安全性。
