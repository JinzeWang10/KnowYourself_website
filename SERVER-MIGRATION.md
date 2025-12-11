# 🔄 服务器重装迁移指南

**目的**：彻底清除挖矿病毒，重新部署安全的生产环境

**预计时间**：2-4 小时

**风险等级**：⚠️ 高（需要停机，确保做好备份）

---

## 📋 重装前准备清单

### 第一步：数据备份（🔴 最重要！）

#### 1.1 数据库备份

```bash
# PostgreSQL 备份
pg_dump -U scales_user -d scales_db -F c -f backup_$(date +%Y%m%d_%H%M%S).dump

# 或导出为 SQL 文件
pg_dump -U scales_user -d scales_db > backup_$(date +%Y%m%d_%H%M%S).sql

# 验证备份文件
ls -lh backup_*.dump
```

**重要提示**：
- ✅ 备份后立即下载到本地
- ✅ 验证备份文件完整性
- ✅ 记录数据库用户名和密码

#### 1.2 应用代码备份

```bash
# 确保所有代码已推送到 Git
cd /path/to/knowyourself_website
git status
git add .
git commit -m "backup: 重装前最后一次提交"
git push origin main

# 验证远程仓库
git log -1
```

#### 1.3 环境变量和配置文件备份

```bash
# 备份所有环境变量和配置
mkdir -p ~/backup_$(date +%Y%m%d)
cd ~/backup_$(date +%Y%m%d)

# 备份 .env 文件
cp /path/to/knowyourself_website/.env .
cp /path/to/knowyourself_website/.env.local .
cp /path/to/knowyourself_website/.env.production . 2>/dev/null || true

# 备份 Nginx 配置（如果有）
sudo cp -r /etc/nginx/sites-available/ nginx_backup/
sudo cp -r /etc/nginx/sites-enabled/ nginx_enabled_backup/
sudo cp /etc/nginx/nginx.conf nginx.conf.bak

# 备份 SSL 证书（如果有）
sudo cp -r /etc/letsencrypt/ letsencrypt_backup/

# 备份 PM2 配置
pm2 save
cp ~/.pm2/dump.pm2 .

# 打包所有备份
tar -czf backup_$(date +%Y%m%d_%H%M%S).tar.gz ./*

# 下载到本地！！！
# scp root@your-server:~/backup_*/backup_*.tar.gz ./
```

#### 1.4 其他重要数据

```bash
# 备份 SSH 密钥（如果需要）
cp ~/.ssh/authorized_keys ~/backup_$(date +%Y%m%d)/

# 备份 crontab
crontab -l > ~/backup_$(date +%Y%m%d)/crontab_backup.txt

# 记录已安装的软件包
dpkg --get-selections > ~/backup_$(date +%Y%m%d)/installed_packages.txt

# 记录系统信息
uname -a > ~/backup_$(date +%Y%m%d)/system_info.txt
```

---

## 📝 信息记录清单

**在重装前，请记录以下信息到本地文件：**

### 服务器信息
```
- [ ] 服务器 IP 地址：_______________
- [ ] SSH 端口：_______________
- [ ] 域名：_______________
- [ ] DNS 提供商：_______________
- [ ] 云服务商：_______________
```

### 数据库信息
```
- [ ] 数据库类型：PostgreSQL / SQLite
- [ ] 数据库名称：_______________
- [ ] 数据库用户：_______________
- [ ] 数据库密码：_______________
- [ ] 数据库备份文件位置：_______________
```

### 应用信息
```
- [ ] Git 仓库地址：_______________
- [ ] Git 分支：_______________
- [ ] Node.js 版本：_______________
- [ ] npm/pnpm/yarn：_______________
```

### SSL 证书信息
```
- [ ] 证书类型：Let's Encrypt / 其他
- [ ] 证书邮箱：_______________
- [ ] 证书域名：_______________
```

### 第三方服务
```
- [ ] CDN（如 Cloudflare）：_______________
- [ ] 监控服务：_______________
- [ ] 备份服务：_______________
```

---

## 🔍 重装前检查

### 确认备份完整性

```bash
# 检查数据库备份
pg_restore -l backup_*.dump | head -20

# 检查 tar 包完整性
tar -tzf backup_*.tar.gz | head -20

# 计算校验和
sha256sum backup_*.tar.gz > checksums.txt
```

### 下载所有备份到本地

```bash
# 从本地电脑执行
# 替换为你的实际路径
scp -r root@your-server-ip:~/backup_* ./server_backup/

# 验证下载完整
ls -lh ./server_backup/
```

---

## 🚀 系统重装步骤

### 1. 停止所有服务

```bash
# 停止应用
pm2 stop all
pm2 save

# 停止 Nginx
sudo systemctl stop nginx

# 停止数据库（如果需要）
sudo systemctl stop postgresql

# 最后检查一次备份
ls -lh ~/backup_*
```

### 2. 云服务商重装系统

**推荐配置**：
- **操作系统**：Ubuntu 22.04 LTS（最新稳定版）
- **内存**：至少 2GB
- **存储**：至少 20GB SSD

**步骤**（以阿里云为例）：
1. 登录云服务商控制台
2. 找到 ECS 实例管理
3. 选择"更换系统盘"或"重置系统"
4. 选择 Ubuntu 22.04 LTS
5. **重要**：设置新的 root 密码或上传 SSH 公钥
6. 确认重装

**注意**：
- ⚠️ 重装会清空所有数据
- ⚠️ IP 地址通常不变
- ⚠️ 确保已下载所有备份到本地

---

## 🛠️ 重装后快速部署

### 阶段 1：基础系统配置（30 分钟）

#### 1.1 首次登录

```bash
# 从本地登录新服务器
ssh root@your-server-ip

# 更新系统
apt update && apt upgrade -y

# 设置时区
timedatectl set-timezone Asia/Shanghai

# 设置主机名
hostnamectl set-hostname knowyourself-prod
```

#### 1.2 创建非 root 用户（推荐）

```bash
# 创建新用户
adduser deploy
usermod -aG sudo deploy

# 配置 SSH 密钥
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# 切换到新用户
su - deploy
```

#### 1.3 配置防火墙（第一优先级）

```bash
# 安装 UFW
sudo apt install ufw -y

# 配置规则（先允许 SSH，防止锁死）
sudo ufw allow 22/tcp
sudo ufw allow 443/tcp

# 启用防火墙
sudo ufw enable

# 检查状态
sudo ufw status verbose
```

#### 1.4 安装基础软件

```bash
# 安装必要工具
sudo apt install -y git curl wget vim build-essential

# 安装 Fail2Ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

### 阶段 2：安装运行环境（30 分钟）

#### 2.1 安装 Node.js

```bash
# 使用 NodeSource 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v  # 应显示 v20.x.x
npm -v

# 安装 pnpm（可选）
sudo npm install -g pnpm
```

#### 2.2 安装 PM2

```bash
# 安装 PM2
sudo npm install -g pm2

# 配置 PM2 开机自启
pm2 startup
# 复制输出的命令并执行

# 验证
pm2 -v
```

#### 2.3 安装 PostgreSQL

```bash
# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# 启动并设置开机自启
sudo systemctl enable postgresql
sudo systemctl start postgresql

# 验证
sudo systemctl status postgresql
```

#### 2.4 安装 Nginx

```bash
# 安装 Nginx
sudo apt install nginx -y

# 启动并设置开机自启
sudo systemctl enable nginx
sudo systemctl start nginx

# 验证
sudo systemctl status nginx
nginx -v
```

---

### 阶段 3：恢复数据和部署应用（40 分钟）

#### 3.1 上传备份文件

```bash
# 从本地上传备份（在本地电脑执行）
scp -r ./server_backup/* deploy@your-server-ip:~/

# 在服务器上解压
cd ~
tar -xzf backup_*.tar.gz -C ~/restore/
```

#### 3.2 恢复数据库

```bash
# 切换到 postgres 用户
sudo -u postgres psql

# 创建数据库和用户
CREATE USER scales_user WITH PASSWORD 'your_strong_password';
CREATE DATABASE scales_db OWNER scales_user;
GRANT ALL PRIVILEGES ON DATABASE scales_db TO scales_user;
\q

# 恢复数据
pg_restore -U scales_user -d scales_db -v ~/restore/backup_*.dump

# 或使用 SQL 文件
psql -U scales_user -d scales_db < ~/restore/backup_*.sql

# 验证数据
sudo -u postgres psql -d scales_db -c "SELECT COUNT(*) FROM anonymous_users;"
```

#### 3.3 部署应用代码

```bash
# 克隆代码
cd ~
git clone https://github.com/your-username/KnowYourself_website.git
cd KnowYourself_website

# 恢复环境变量
cp ~/restore/.env.production .env.production

# 修改数据库连接（如果密码改变）
nano .env.production

# 安装依赖
npm install
# 或 pnpm install

# 构建应用
npm run build

# 使用 PM2 启动
PORT=42156 pm2 start npm --name knowyourself -- start
pm2 save

# 验证运行
pm2 status
pm2 logs knowyourself
```

---

### 阶段 4：配置 SSL 和反向代理（30 分钟）

#### 4.1 恢复 Nginx 配置

```bash
# 复制我们准备好的安全配置
sudo cp nginx-security.conf /etc/nginx/sites-available/knowyourself

# 修改域名
sudo nano /etc/nginx/sites-available/knowyourself
# 替换 your-domain.com 为你的实际域名

# 先创建一个临时配置（不需要 SSL）
sudo nano /etc/nginx/sites-available/knowyourself-temp
```

临时配置内容：
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:42156;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# 启用临时配置
sudo ln -s /etc/nginx/sites-available/knowyourself-temp /etc/nginx/sites-enabled/

# 删除默认配置
sudo rm /etc/nginx/sites-enabled/default

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 4.2 安装 SSL 证书

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书（自动配置 Nginx）
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 测试自动续期
sudo certbot renew --dry-run
```

#### 4.3 切换到安全配置

```bash
# 停用临时配置
sudo rm /etc/nginx/sites-enabled/knowyourself-temp

# 启用安全配置（Certbot 已添加 SSL 配置）
# 或使用我们准备的完整配置
sudo ln -s /etc/nginx/sites-available/knowyourself /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

---

### 阶段 5：安全加固（30 分钟）

#### 5.1 更改 SSH 端口（重要！）

```bash
# 备份 SSH 配置
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

# 修改配置
sudo nano /etc/ssh/sshd_config

# 修改以下内容：
# Port 49152  # 改为其他端口
# PasswordAuthentication no  # 禁用密码登录
# PermitRootLogin no  # 禁止 root 登录

# 重启 SSH（注意：先开放新端口防火墙！）
sudo ufw allow 49152/tcp
sudo systemctl restart sshd

# 测试新端口连接（另开一个终端测试）
# ssh -p 49152 deploy@your-server-ip

# 确认可以连接后，删除旧端口
sudo ufw delete allow 22/tcp
```

#### 5.2 配置自动更新

```bash
# 安装自动更新
sudo apt install unattended-upgrades -y

# 配置
sudo dpkg-reconfigure unattended-upgrades
# 选择 Yes
```

#### 5.3 配置日志监控

```bash
# 安装 Logwatch
sudo apt install logwatch -y

# 配置每日报告
echo "/usr/sbin/logwatch --output mail --mailto your-email@example.com --detail high" | sudo tee /etc/cron.daily/00logwatch
sudo chmod +x /etc/cron.daily/00logwatch
```

---

## ✅ 部署验证清单

### 功能测试

```bash
# 1. 检查应用运行状态
pm2 status
pm2 logs knowyourself --lines 50

# 2. 测试 HTTP 访问
curl http://localhost:42156

# 3. 测试 HTTPS 访问
curl https://your-domain.com

# 4. 测试数据库连接
sudo -u postgres psql -d scales_db -c "SELECT COUNT(*) FROM assessment_records;"

# 5. 测试 API
curl https://your-domain.com/api/percentile?scaleId=psqi&score=10
```

### 安全测试

```bash
# 1. 端口扫描（应该只看到 443 和新 SSH 端口）
nmap your-server-ip

# 2. 检查 SSL 评分
# 访问 https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com

# 3. 检查安全响应头
curl -I https://your-domain.com

# 4. 测试速率限制
# 参考 test-security.md

# 5. 检查防火墙
sudo ufw status verbose
```

---

## 📊 性能优化（可选）

### 数据库优化

```bash
# 编辑 PostgreSQL 配置
sudo nano /etc/postgresql/*/main/postgresql.conf

# 根据服务器内存调整（例如 2GB 内存）：
shared_buffers = 512MB
effective_cache_size = 1536MB
maintenance_work_mem = 128MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 2621kB
min_wal_size = 1GB
max_wal_size = 4GB

# 重启数据库
sudo systemctl restart postgresql
```

### Nginx 缓存

```bash
# 在 nginx.conf 添加缓存配置
sudo nano /etc/nginx/nginx.conf

# 在 http 块中添加：
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;

# 重启 Nginx
sudo systemctl restart nginx
```

---

## 🔄 数据迁移脚本

我已经为你准备了自动化脚本：

- [backup-before-reinstall.sh](backup-before-reinstall.sh) - 重装前备份脚本
- [fresh-deploy.sh](fresh-deploy.sh) - 重装后快速部署脚本

---

## 📝 重要提醒

### ⚠️ 必须完成的事项

1. **备份确认**
   - [ ] 数据库备份已下载到本地
   - [ ] 环境变量已记录
   - [ ] SSL 证书已备份（如果有）
   - [ ] 验证备份文件完整性

2. **信息记录**
   - [ ] 所有密码已记录在安全位置
   - [ ] DNS 配置已记录
   - [ ] 域名提供商信息已记录

3. **准备工作**
   - [ ] 通知用户服务将暂时中断
   - [ ] 选择低流量时段重装
   - [ ] 准备好至少 4 小时时间

### 💡 最佳实践

- 在低峰时段（如凌晨 2-6 点）进行
- 保留旧服务器快照（如果云服务商支持）
- 测试新服务器后再切换 DNS
- 保留备份文件至少 30 天

---

## 🆘 应急回滚

如果遇到问题需要回滚：

1. **云服务商控制台恢复快照**（如果有）
2. **从备份恢复数据**
3. **联系云服务商技术支持**

---

## 📞 支持联系

- 阿里云：95187
- 腾讯云：95716
- AWS：国际 +1-206-266-4064

---

**准备好后，请按照此文档逐步执行。祝迁移顺利！🚀**
