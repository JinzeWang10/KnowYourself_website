# 部署文档

## 快速部署

### 首次部署（全新服务器）

```bash
# 1. 克隆项目
git clone https://github.com/JinzeWang10/KnowYourself_website.git
cd KnowYourself_website

# 2. 赋予脚本执行权限
chmod +x first-deploy.sh deploy.sh

# 3. 运行首次部署脚本
./first-deploy.sh
```

### 后续更新部署

```bash
# 进入项目目录
cd KnowYourself_website

# 运行部署脚本
./deploy.sh
```

## 脚本说明

### `first-deploy.sh` - 首次部署脚本

适用于全新的云服务器，自动完成：
- ✅ 检查 Node.js 和 Git 环境
- ✅ 拉取最新代码
- ✅ 创建必要目录
- ✅ 安装项目依赖
- ✅ 构建生产版本
- ✅ 安装 PM2（可选）
- ✅ 启动服务

### `deploy.sh` - 日常部署脚本

适用于已部署过的服务器，快速更新：
- ✅ Git pull 最新代码
- ✅ 安装/更新依赖
- ✅ 重新构建
- ✅ 停止旧服务
- ✅ 启动新服务

## 环境要求

- **Node.js**: 18.x 或更高版本
- **Git**: 任意版本
- **PM2** (推荐): 进程管理器，用于保持服务运行

## 安装 Node.js (Ubuntu/Debian)

```bash
# 添加 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# 安装 Node.js
sudo apt-get install -y nodejs

# 验证安装
node -v
npm -v
```

## 安装 PM2

```bash
# 全局安装 PM2
npm install -g pm2

# 设置开机自启
pm2 startup
pm2 save
```

## PM2 常用命令

```bash
# 查看所有进程
pm2 list

# 查看日志
pm2 logs knowyourself

# 查看实时日志
pm2 logs knowyourself --lines 100

# 重启服务
pm2 restart knowyourself

# 停止服务
pm2 stop knowyourself

# 删除进程
pm2 delete knowyourself

# 监控
pm2 monit
```

## Nginx 配置（可选）

如果需要使用域名访问，可以配置 Nginx 反向代理：

```nginx
server {
    listen 80;
    server_name knowyourself.com.cn www.knowyourself.com.cn;

    location / {
        proxy_pass http://localhost:8080;
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

保存配置后：

```bash
# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

## SSL 证书（HTTPS）

使用 Let's Encrypt 免费证书：

```bash
# 安装 certbot
sudo apt-get install certbot python3-certbot-nginx

# 自动配置 SSL
sudo certbot --nginx -d knowyourself.com.cn -d www.knowyourself.com.cn

# 自动续期测试
sudo certbot renew --dry-run
```

## 防火墙配置

```bash
# 开放必要端口
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

## 故障排查

### 服务无法启动

```bash
# 检查端口占用
sudo lsof -i :8080

# 查看服务日志
pm2 logs knowyourself --err

# 或查看文件日志
tail -f ./logs/app.log
```

### 构建失败

```bash
# 清理缓存重新构建
rm -rf .next node_modules
npm install
npm run build
```

### PM2 进程丢失

```bash
# 重新启动
pm2 start npm --name "knowyourself" -- start
pm2 save
```

## 性能优化建议

1. **启用 Gzip 压缩**（在 Nginx 中配置）
2. **配置缓存策略**（静态资源）
3. **使用 CDN**（加速静态资源）
4. **数据库连接池**（如使用数据库）
5. **PM2 集群模式**（多核 CPU）

```bash
# PM2 集群模式（根据 CPU 核心数自动创建实例）
pm2 start npm --name "knowyourself" -i max -- start
```

## 监控和日志

### 查看系统资源使用

```bash
# 查看 PM2 监控
pm2 monit

# 系统资源
htop
```

### 日志管理

```bash
# PM2 日志轮转
pm2 install pm2-logrotate

# 配置日志大小
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## 备份策略

建议定期备份：
- 数据库（如有）
- 用户上传的文件（如有）
- 配置文件

```bash
# 示例：备份脚本
#!/bin/bash
DATE=$(date +%Y%m%d)
tar -czf backup-$DATE.tar.gz \
  .env \
  public/uploads \
  # 其他需要备份的文件
```

## 更新流程

1. 在本地测试通过
2. 提交代码到 Git 仓库
3. 在服务器上运行 `./deploy.sh`
4. 验证服务正常运行

## 联系方式

遇到问题请联系：
- GitHub Issues: https://github.com/JinzeWang10/KnowYourself_website/issues
