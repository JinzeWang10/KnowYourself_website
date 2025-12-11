#!/bin/bash

# 服务器重装前备份脚本
# 用途：自动备份所有重要数据到本地，确保重装后可以恢复

set -e  # 遇到错误立即退出

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 备份配置
BACKUP_DIR=~/backup_$(date +%Y%m%d_%H%M%S)
APP_DIR=$(pwd)

echo "========================================="
echo -e "${BLUE}  服务器重装前备份脚本${NC}"
echo "========================================="
echo ""
echo -e "${YELLOW}备份目录: $BACKUP_DIR${NC}"
echo ""

# 创建备份目录
mkdir -p "$BACKUP_DIR"
cd "$BACKUP_DIR"

# ====================
# 1. 数据库备份
# ====================
echo -e "${YELLOW}[1/6] 备份数据库...${NC}"

if command -v pg_dump &> /dev/null; then
    echo "检测到 PostgreSQL，开始备份..."

    # 从 .env 文件读取数据库配置
    if [ -f "$APP_DIR/.env.production" ]; then
        source "$APP_DIR/.env.production"
    elif [ -f "$APP_DIR/.env" ]; then
        source "$APP_DIR/.env"
    fi

    # 提取数据库信息
    if [ -n "$DATABASE_URL" ]; then
        # 格式: postgresql://user:password@host:port/database
        DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
        DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

        echo "数据库用户: $DB_USER"
        echo "数据库名称: $DB_NAME"

        # 备份为 dump 格式（推荐）
        pg_dump -U "$DB_USER" -d "$DB_NAME" -F c -f "database_backup_$(date +%Y%m%d_%H%M%S).dump"

        # 同时备份为 SQL 格式（便于查看）
        pg_dump -U "$DB_USER" -d "$DB_NAME" > "database_backup_$(date +%Y%m%d_%H%M%S).sql"

        echo -e "${GREEN}✓ 数据库备份完成${NC}"
    else
        echo -e "${RED}⚠ 未找到 DATABASE_URL，请手动备份数据库${NC}"
        echo "执行命令: pg_dump -U scales_user -d scales_db -F c -f $BACKUP_DIR/database_backup.dump"
    fi
elif [ -f "$APP_DIR/prisma/dev.db" ]; then
    echo "检测到 SQLite 数据库，复制文件..."
    cp "$APP_DIR/prisma/dev.db" "sqlite_backup_$(date +%Y%m%d_%H%M%S).db"
    echo -e "${GREEN}✓ SQLite 数据库备份完成${NC}"
else
    echo -e "${YELLOW}⚠ 未检测到数据库，跳过${NC}"
fi

echo ""

# ====================
# 2. 环境变量和配置文件
# ====================
echo -e "${YELLOW}[2/6] 备份环境变量和配置文件...${NC}"

mkdir -p config_backup

# 备份 .env 文件
for env_file in .env .env.local .env.production .env.development; do
    if [ -f "$APP_DIR/$env_file" ]; then
        cp "$APP_DIR/$env_file" "config_backup/"
        echo "已备份: $env_file"
    fi
done

# 备份 package.json 和 lock 文件
if [ -f "$APP_DIR/package.json" ]; then
    cp "$APP_DIR/package.json" "config_backup/"
    [ -f "$APP_DIR/package-lock.json" ] && cp "$APP_DIR/package-lock.json" "config_backup/"
    [ -f "$APP_DIR/pnpm-lock.yaml" ] && cp "$APP_DIR/pnpm-lock.yaml" "config_backup/"
    [ -f "$APP_DIR/yarn.lock" ] && cp "$APP_DIR/yarn.lock" "config_backup/"
fi

echo -e "${GREEN}✓ 配置文件备份完成${NC}"
echo ""

# ====================
# 3. Nginx 配置
# ====================
echo -e "${YELLOW}[3/6] 备份 Nginx 配置...${NC}"

if [ -d /etc/nginx ]; then
    mkdir -p nginx_backup

    # 备份站点配置
    if [ -d /etc/nginx/sites-available ]; then
        sudo cp -r /etc/nginx/sites-available nginx_backup/
        echo "已备份: sites-available"
    fi

    if [ -d /etc/nginx/sites-enabled ]; then
        sudo cp -r /etc/nginx/sites-enabled nginx_backup/
        echo "已备份: sites-enabled"
    fi

    # 备份主配置
    if [ -f /etc/nginx/nginx.conf ]; then
        sudo cp /etc/nginx/nginx.conf nginx_backup/
        echo "已备份: nginx.conf"
    fi

    echo -e "${GREEN}✓ Nginx 配置备份完成${NC}"
else
    echo -e "${YELLOW}⚠ 未检测到 Nginx，跳过${NC}"
fi

echo ""

# ====================
# 4. SSL 证书
# ====================
echo -e "${YELLOW}[4/6] 备份 SSL 证书...${NC}"

if [ -d /etc/letsencrypt ]; then
    mkdir -p ssl_backup
    sudo cp -r /etc/letsencrypt ssl_backup/
    echo -e "${GREEN}✓ Let's Encrypt 证书备份完成${NC}"
else
    echo -e "${YELLOW}⚠ 未检测到 Let's Encrypt 证书，跳过${NC}"
fi

echo ""

# ====================
# 5. PM2 配置和其他服务
# ====================
echo -e "${YELLOW}[5/6] 备份 PM2 和其他配置...${NC}"

mkdir -p services_backup

# PM2 配置
if command -v pm2 &> /dev/null; then
    pm2 save
    [ -f ~/.pm2/dump.pm2 ] && cp ~/.pm2/dump.pm2 services_backup/
    echo "已备份: PM2 配置"
fi

# SSH 密钥
if [ -f ~/.ssh/authorized_keys ]; then
    cp ~/.ssh/authorized_keys services_backup/
    echo "已备份: SSH 密钥"
fi

# Crontab
crontab -l > services_backup/crontab_backup.txt 2>/dev/null || echo "无 crontab 任务"

# 系统信息
uname -a > services_backup/system_info.txt
dpkg --get-selections > services_backup/installed_packages.txt
sudo ufw status verbose > services_backup/firewall_rules.txt 2>/dev/null || echo "UFW 未安装"

echo -e "${GREEN}✓ 服务配置备份完成${NC}"
echo ""

# ====================
# 6. 创建恢复信息文件
# ====================
echo -e "${YELLOW}[6/6] 生成恢复信息文件...${NC}"

cat > RESTORE_INFO.txt << EOF
========================================
恢复信息 - $(date)
========================================

服务器信息
----------
IP 地址: $(curl -s ifconfig.me 2>/dev/null || echo "请手动填写")
主机名: $(hostname)
操作系统: $(cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2)

应用信息
----------
应用目录: $APP_DIR
Node.js 版本: $(node -v 2>/dev/null || echo "未安装")
npm 版本: $(npm -v 2>/dev/null || echo "未安装")
PM2 版本: $(pm2 -v 2>/dev/null || echo "未安装")

Git 信息
----------
仓库地址: $(cd "$APP_DIR" && git remote get-url origin 2>/dev/null || echo "未配置")
当前分支: $(cd "$APP_DIR" && git branch --show-current 2>/dev/null || echo "未配置")
最后提交: $(cd "$APP_DIR" && git log -1 --oneline 2>/dev/null || echo "未配置")

数据库信息
----------
$(if command -v psql &> /dev/null; then
    echo "PostgreSQL 版本: $(psql --version)"
    echo "数据库备份文件: database_backup_*.dump"
elif [ -f "$APP_DIR/prisma/dev.db" ]; then
    echo "SQLite 数据库"
    echo "数据库备份文件: sqlite_backup_*.db"
else
    echo "未检测到数据库"
fi)

SSL 证书
----------
$(if [ -d /etc/letsencrypt ]; then
    echo "Let's Encrypt 证书已备份"
    echo "域名: $(sudo certbot certificates 2>/dev/null | grep Domains | head -1 || echo "请手动查看")"
else
    echo "未使用 Let's Encrypt"
fi)

重要提醒
----------
1. 请将此备份目录完整下载到本地
2. 验证数据库备份文件完整性
3. 记录所有密码（数据库、服务器等）
4. 确认 DNS 配置已记录
5. 参考 SERVER-MIGRATION.md 进行恢复

备份文件列表
----------
$(ls -lh)

========================================
EOF

echo -e "${GREEN}✓ 恢复信息文件生成完成${NC}"
echo ""

# ====================
# 打包所有备份
# ====================
echo -e "${YELLOW}打包备份文件...${NC}"

cd ~
BACKUP_ARCHIVE="backup_$(date +%Y%m%d_%H%M%S).tar.gz"
tar -czf "$BACKUP_ARCHIVE" $(basename "$BACKUP_DIR")

echo ""
echo "========================================="
echo -e "${GREEN}  备份完成！${NC}"
echo "========================================="
echo ""
echo -e "${BLUE}备份位置:${NC}"
echo "  目录: $BACKUP_DIR"
echo "  压缩包: ~/$BACKUP_ARCHIVE"
echo ""
echo -e "${BLUE}备份大小:${NC}"
du -sh "$BACKUP_DIR"
du -sh ~/"$BACKUP_ARCHIVE"
echo ""
echo -e "${RED}⚠️ 重要提醒:${NC}"
echo "1. 请立即下载备份到本地："
echo "   ${BLUE}scp root@your-server:~/$BACKUP_ARCHIVE ./local_backup/${NC}"
echo ""
echo "2. 验证备份完整性："
echo "   ${BLUE}tar -tzf $BACKUP_ARCHIVE | head -20${NC}"
echo ""
echo "3. 查看恢复信息："
echo "   ${BLUE}cat $BACKUP_DIR/RESTORE_INFO.txt${NC}"
echo ""
echo "4. 确认备份下载完成后，再进行系统重装！"
echo ""
echo "========================================="
