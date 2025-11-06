#!/bin/bash

# 首次部署脚本 - KnowYourself 网站
# 用途：在全新的云服务器上首次部署项目

set -e  # 遇到错误立即退出

echo "========================================="
echo "  KnowYourself 首次部署脚本"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. 检查 Node.js
echo -e "${YELLOW}[1/7] 检查 Node.js 环境...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ 未找到 Node.js，请先安装 Node.js 18+${NC}"
    echo "安装命令（Ubuntu/Debian）:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js 版本: $NODE_VERSION${NC}"
echo ""

# 2. 检查 Git
echo -e "${YELLOW}[2/7] 检查 Git...${NC}"
if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ 未找到 Git${NC}"
    echo "安装命令: sudo apt-get install -y git"
    exit 1
fi
GIT_VERSION=$(git --version)
echo -e "${GREEN}✓ $GIT_VERSION${NC}"
echo ""

# 3. 克隆或更新代码
echo -e "${YELLOW}[3/7] 获取项目代码...${NC}"
if [ -d ".git" ]; then
    echo "检测到 Git 仓库，拉取最新代码..."
    git pull origin main
else
    echo -e "${RED}请先克隆项目到服务器${NC}"
    echo "git clone https://github.com/JinzeWang10/KnowYourself_website.git"
    echo "cd KnowYourself_website"
    echo "然后再运行本脚本"
    exit 1
fi
echo -e "${GREEN}✓ 代码已是最新${NC}"
echo ""

# 4. 创建日志目录
echo -e "${YELLOW}[4/7] 创建必要的目录...${NC}"
mkdir -p logs
echo -e "${GREEN}✓ 目录创建完成${NC}"
echo ""

# 5. 安装依赖
echo -e "${YELLOW}[5/7] 安装项目依赖...${NC}"
if command -v pnpm &> /dev/null; then
    echo "使用 pnpm 安装..."
    pnpm install
elif command -v yarn &> /dev/null; then
    echo "使用 yarn 安装..."
    yarn install
else
    echo "使用 npm 安装..."
    npm install
fi
echo -e "${GREEN}✓ 依赖安装完成${NC}"
echo ""

# 6. 构建项目
echo -e "${YELLOW}[6/7] 构建生产版本...${NC}"
if command -v pnpm &> /dev/null; then
    pnpm run build
elif command -v yarn &> /dev/null; then
    yarn build
else
    npm run build
fi
echo -e "${GREEN}✓ 构建完成${NC}"
echo ""

# 7. 安装并配置 PM2（可选但推荐）
echo -e "${YELLOW}[7/7] 配置进程管理器...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo "未找到 PM2，是否安装？(y/n)"
    read -r install_pm2
    if [ "$install_pm2" = "y" ] || [ "$install_pm2" = "Y" ]; then
        npm install -g pm2
        echo -e "${GREEN}✓ PM2 安装完成${NC}"
    else
        echo "跳过 PM2 安装"
    fi
else
    echo -e "${GREEN}✓ PM2 已安装${NC}"
fi
echo ""

# 8. 启动服务
echo -e "${YELLOW}启动服务...${NC}"
if command -v pm2 &> /dev/null; then
    pm2 start npm --name "knowyourself" -- start
    pm2 save
    pm2 startup
    echo -e "${GREEN}✓ 服务已通过 PM2 启动${NC}"
else
    nohup npm start > ./logs/app.log 2>&1 &
    echo $! > ./logs/app.pid
    echo -e "${GREEN}✓ 服务已后台启动${NC}"
fi

echo ""
echo "========================================="
echo -e "${GREEN}  首次部署完成！${NC}"
echo "========================================="
echo ""
echo "🎉 服务已启动在端口 8080"
echo ""
echo "常用命令："
if command -v pm2 &> /dev/null; then
    echo "  查看状态: pm2 status"
    echo "  查看日志: pm2 logs knowyourself"
    echo "  重启服务: pm2 restart knowyourself"
    echo "  停止服务: pm2 stop knowyourself"
    echo "  后续更新: ./deploy.sh"
else
    echo "  查看日志: tail -f ./logs/app.log"
    echo "  停止服务: kill \$(cat ./logs/app.pid)"
    echo "  后续更新: ./deploy.sh"
fi
echo ""
echo "📝 配置 Nginx 反向代理（可选）："
echo "  upstream knowyourself {"
echo "    server localhost:8080;"
echo "  }"
echo ""
