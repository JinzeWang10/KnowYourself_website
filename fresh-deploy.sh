#!/bin/bash

# 全新服务器快速部署脚本
# 用途：在重装后的干净系统上自动部署 KnowYourself 应用
# 适用系统：Ubuntu 22.04 LTS

set -e  # 遇到错误立即退出

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "========================================="
echo -e "${BLUE}  KnowYourself 全新服务器部署脚本${NC}"
echo "========================================="
echo ""

# 检查是否为 root 用户
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}请使用 root 用户运行此脚本${NC}"
    echo "使用命令: sudo bash fresh-deploy.sh"
    exit 1
fi

# 配置变量（请根据实际情况修改）
DOMAIN="your-domain.com"
EMAIL="your-email@example.com"
DB_USER="scales_user"
DB_NAME="scales_db"
DB_PASSWORD=""  # 留空则自动生成
APP_USER="deploy"
APP_DIR="/home/$APP_USER/KnowYourself_website"
GIT_REPO="https://github.com/your-username/KnowYourself_website.git"
APP_PORT=42156

# ====================
# 阶段 1: 系统基础配置
# ====================
echo -e "${YELLOW}[阶段 1/6] 系统基础配置${NC}"
echo ""

# 更新系统
echo "更新系统软件包..."
apt update && apt upgrade -y

# 设置时区
echo "设置时区为 Asia/Shanghai..."
timedatectl set-timezone Asia/Shanghai

# 设置主机名
echo "设置主机名..."
read -p "请输入主机名 [knowyourself-prod]: " HOSTNAME
HOSTNAME=${HOSTNAME:-knowyourself-prod}
hostnamectl set-hostname "$HOSTNAME"

# 安装基础工具
echo "安装基础工具..."
apt install -y git curl wget vim build-essential software-properties-common

echo -e "${GREEN}✓ 系统基础配置完成${NC}"
echo ""

# ====================
# 阶段 2: 安全配置
# ====================
echo -e "${YELLOW}[阶段 2/6] 安全配置${NC}"
echo ""

# 配置防火墙
echo "配置 UFW 防火墙..."
apt install -y ufw

# 先允许 SSH，防止锁死
ufw allow 22/tcp
ufw allow 443/tcp
echo "y" | ufw enable

# 安装 Fail2Ban
echo "安装 Fail2Ban..."
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban

# 创建非 root 用户
echo "创建应用用户: $APP_USER"
if ! id "$APP_USER" &>/dev/null; then
    adduser --disabled-password --gecos "" "$APP_USER"
    usermod -aG sudo "$APP_USER"

    # 设置密码
    echo "请为用户 $APP_USER 设置密码："
    passwd "$APP_USER"

    # 配置 SSH 密钥
    mkdir -p /home/$APP_USER/.ssh
    if [ -f ~/.ssh/authorized_keys ]; then
        cp ~/.ssh/authorized_keys /home/$APP_USER/.ssh/
        chown -R $APP_USER:$APP_USER /home/$APP_USER/.ssh
        chmod 700 /home/$APP_USER/.ssh
        chmod 600 /home/$APP_USER/.ssh/authorized_keys
        echo -e "${GREEN}✓ SSH 密钥已复制${NC}"
    else
        echo -e "${YELLOW}⚠ 未找到 root 的 SSH 密钥，请手动配置${NC}"
    fi
else
    echo "用户 $APP_USER 已存在，跳过创建"
fi

echo -e "${GREEN}✓ 安全配置完成${NC}"
echo ""

# ====================
# 阶段 3: 安装运行环境
# ====================
echo -e "${YELLOW}[阶段 3/6] 安装运行环境${NC}"
echo ""

# 安装 Node.js 20
echo "安装 Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

echo "Node.js 版本: $(node -v)"
echo "npm 版本: $(npm -v)"

# 安装 pnpm（可选）
echo "安装 pnpm..."
npm install -g pnpm

# 安装 PM2
echo "安装 PM2..."
npm install -g pm2

# 安装 PostgreSQL
echo "安装 PostgreSQL..."
apt install -y postgresql postgresql-contrib

# 启动 PostgreSQL
systemctl enable postgresql
systemctl start postgresql

# 安装 Nginx
echo "安装 Nginx..."
apt install -y nginx

systemctl enable nginx
systemctl start nginx

echo -e "${GREEN}✓ 运行环境安装完成${NC}"
echo ""

# ====================
# 阶段 4: 配置数据库
# ====================
echo -e "${YELLOW}[阶段 4/6] 配置数据库${NC}"
echo ""

# 生成数据库密码（如果未设置）
if [ -z "$DB_PASSWORD" ]; then
    DB_PASSWORD=$(openssl rand -base64 24)
    echo -e "${BLUE}数据库密码（请记录）: $DB_PASSWORD${NC}"
fi

# 创建数据库和用户
echo "创建 PostgreSQL 数据库和用户..."
sudo -u postgres psql << EOF
-- 删除已存在的用户和数据库（如果有）
DROP DATABASE IF EXISTS $DB_NAME;
DROP USER IF EXISTS $DB_USER;

-- 创建新用户和数据库
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
CREATE DATABASE $DB_NAME OWNER $DB_USER;
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

echo -e "${GREEN}✓ 数据库配置完成${NC}"
echo ""

# 保存数据库信息
cat > /root/db_credentials.txt << EOF
数据库配置信息
================
主机: localhost
端口: 5432
数据库: $DB_NAME
用户名: $DB_USER
密码: $DB_PASSWORD

连接字符串:
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"
EOF

chmod 600 /root/db_credentials.txt
echo -e "${BLUE}数据库凭证已保存到: /root/db_credentials.txt${NC}"
echo ""

# ====================
# 阶段 5: 部署应用
# ====================
echo -e "${YELLOW}[阶段 5/6] 部署应用${NC}"
echo ""

# 切换到应用用户
sudo -u $APP_USER bash << 'EOSU'

# 设置环境变量（从外部脚本传入）
export APP_USER="'"$APP_USER"'"
export APP_DIR="'"$APP_DIR"'"
export GIT_REPO="'"$GIT_REPO"'"
export DB_USER="'"$DB_USER"'"
export DB_NAME="'"$DB_NAME"'"
export DB_PASSWORD="'"$DB_PASSWORD"'"
export APP_PORT="'"$APP_PORT"'"

cd ~

# 检查是否需要输入 Git 仓库地址
if [[ "$GIT_REPO" == *"your-username"* ]]; then
    echo "请输入 Git 仓库地址："
    read -p "Git repo URL: " GIT_REPO
fi

# 克隆代码
echo "克隆代码仓库..."
if [ -d "$APP_DIR" ]; then
    echo "目录已存在，更新代码..."
    cd "$APP_DIR"
    git pull origin main
else
    git clone "$GIT_REPO" "$APP_DIR"
    cd "$APP_DIR"
fi

# 创建 .env.production
echo "创建环境变量文件..."
cat > .env.production << EOF
# 生产环境配置
NODE_ENV=production
PORT=$APP_PORT

# 数据库连接
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"

# 网站 URL（请修改为实际域名）
NEXT_PUBLIC_SITE_URL=https://your-domain.com
EOF

echo "✓ 环境变量文件创建完成"

# 提示恢复备份数据库
echo ""
echo -e "\033[1;33m⚠️ 数据库恢复提示\033[0m"
echo "如果你有数据库备份，现在可以恢复："
echo "  pg_restore -U $DB_USER -d $DB_NAME -v ~/backup/database_backup.dump"
echo ""
read -p "是否现在恢复数据库？(y/N): " RESTORE_DB

if [[ "$RESTORE_DB" =~ ^[Yy]$ ]]; then
    read -p "请输入备份文件路径: " BACKUP_FILE
    if [ -f "$BACKUP_FILE" ]; then
        pg_restore -U "$DB_USER" -d "$DB_NAME" -v "$BACKUP_FILE"
        echo "✓ 数据库恢复完成"
    else
        echo "⚠ 备份文件不存在，跳过恢复"
    fi
else
    echo "跳过数据库恢复，将创建新数据库结构..."
    npm install
    npx prisma db push
fi

# 安装依赖
echo "安装项目依赖..."
npm install
# 或使用 pnpm install

# 构建应用
echo "构建生产版本..."
npm run build

# 使用 PM2 启动应用
echo "使用 PM2 启动应用..."
PORT=$APP_PORT pm2 start npm --name knowyourself -- start

# 保存 PM2 配置
pm2 save

# 设置 PM2 开机自启
pm2 startup | grep "sudo" | bash

echo "✓ 应用部署完成"
echo ""
echo "应用状态:"
pm2 status

EOSU

echo -e "${GREEN}✓ 应用部署完成${NC}"
echo ""

# ====================
# 阶段 6: 配置 SSL 和反向代理
# ====================
echo -e "${YELLOW}[阶段 6/6] 配置 SSL 和反向代理${NC}"
echo ""

# 获取域名
if [[ "$DOMAIN" == "your-domain.com" ]]; then
    echo "请输入你的域名："
    read -p "Domain: " DOMAIN
fi

if [[ "$EMAIL" == "your-email@example.com" ]]; then
    echo "请输入你的邮箱（用于 SSL 证书）："
    read -p "Email: " EMAIL
fi

# 创建 Nginx 配置（临时，不含 SSL）
cat > /etc/nginx/sites-available/knowyourself << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# 启用站点
ln -sf /etc/nginx/sites-available/knowyourself /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx

echo -e "${GREEN}✓ Nginx 配置完成${NC}"
echo ""

# 安装 SSL 证书
echo "安装 Let's Encrypt SSL 证书..."
apt install -y certbot python3-certbot-nginx

echo ""
echo "获取 SSL 证书..."
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --email "$EMAIL" --agree-tos --no-eff-email --redirect

# 测试自动续期
certbot renew --dry-run

echo -e "${GREEN}✓ SSL 证书安装完成${NC}"
echo ""

# ====================
# 最终配置
# ====================
echo -e "${YELLOW}应用安全配置...${NC}"
echo ""

# 复制完整的安全配置（如果存在）
if [ -f "$APP_DIR/nginx-security.conf" ]; then
    echo "发现安全配置文件，是否应用？(y/N)"
    read -p "> " APPLY_SECURITY

    if [[ "$APPLY_SECURITY" =~ ^[Yy]$ ]]; then
        # 备份当前配置
        cp /etc/nginx/sites-available/knowyourself /etc/nginx/sites-available/knowyourself.bak

        # 应用安全配置（需要手动替换域名）
        sed "s/your-domain.com/$DOMAIN/g" "$APP_DIR/nginx-security.conf" > /etc/nginx/sites-available/knowyourself

        # 测试配置
        nginx -t && systemctl reload nginx
        echo -e "${GREEN}✓ 安全配置已应用${NC}"
    fi
fi

# ====================
# 部署完成
# ====================
echo ""
echo "========================================="
echo -e "${GREEN}  部署完成！${NC}"
echo "========================================="
echo ""
echo -e "${BLUE}服务信息${NC}"
echo "应用地址: https://$DOMAIN"
echo "应用端口: $APP_PORT (内部)"
echo "应用目录: $APP_DIR"
echo "应用用户: $APP_USER"
echo ""
echo -e "${BLUE}管理命令${NC}"
echo "查看日志: pm2 logs knowyourself"
echo "重启应用: pm2 restart knowyourself"
echo "查看状态: pm2 status"
echo ""
echo -e "${BLUE}数据库信息${NC}"
echo "凭证文件: /root/db_credentials.txt"
echo "查看凭证: cat /root/db_credentials.txt"
echo ""
echo -e "${YELLOW}后续步骤${NC}"
echo "1. 更改 SSH 端口（推荐）"
echo "   编辑: /etc/ssh/sshd_config"
echo "   修改 Port 为非标准端口（如 49152）"
echo ""
echo "2. 测试网站功能"
echo "   访问: https://$DOMAIN"
echo ""
echo "3. 运行安全测试"
echo "   参考: $APP_DIR/test-security.md"
echo ""
echo "4. 配置监控和备份"
echo "   参考: $APP_DIR/SECURITY-CHECKLIST.md"
echo ""
echo "========================================="
