#!/bin/bash

# 部署脚本 - KnowYourself 网站
# 用途：在云服务器上自动完成 git pull + 安装依赖 + 构建 + 启动服务

set -e  # 遇到错误立即退出

echo "========================================="
echo "  KnowYourself 网站部署脚本"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 项目配置
APP_NAME="knowyourself"
# 使用非标准端口提高安全性（避开常见的 8080 等端口，减少自动扫描攻击）
PORT=${PORT:-42156}

# 1. 拉取最新代码
echo -e "${YELLOW}[1/5] 拉取最新代码...${NC}"
git pull origin main
echo -e "${GREEN}✓ 代码更新完成${NC}"
echo ""

# 2. 安装依赖
echo -e "${YELLOW}[2/8] 安装依赖...${NC}"
if command -v pnpm &> /dev/null; then
    echo "使用 pnpm 安装依赖..."
    pnpm install
elif command -v yarn &> /dev/null; then
    echo "使用 yarn 安装依赖..."
    yarn install
else
    echo "使用 npm 安装依赖..."
    npm install
fi
echo -e "${GREEN}✓ 依赖安装完成${NC}"
echo ""

# 3. 检查环境变量
echo -e "${YELLOW}[3/8] 检查环境变量...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}✗ 错误: .env 文件不存在${NC}"
    echo "请创建 .env 文件并配置 DATABASE_URL"
    exit 1
fi

if ! grep -q "DATABASE_URL" .env; then
    echo -e "${RED}✗ 错误: .env 中未找到 DATABASE_URL${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 环境变量检查通过${NC}"
echo ""

# 4. 生成 Prisma Client
echo -e "${YELLOW}[4/8] 生成 Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✓ Prisma Client 生成完成${NC}"
echo ""

# 5. 同步数据库结构
echo -e "${YELLOW}[5/8] 同步数据库结构...${NC}"
echo "正在将 schema 推送到数据库..."
npx prisma db push --skip-generate
echo -e "${GREEN}✓ 数据库结构同步完成${NC}"
echo ""

# 6. 构建项目
echo -e "${YELLOW}[6/8] 构建项目...${NC}"
if command -v pnpm &> /dev/null; then
    pnpm run build
elif command -v yarn &> /dev/null; then
    yarn build
else
    npm run build
fi
echo -e "${GREEN}✓ 项目构建完成${NC}"
echo ""

# 7. 停止旧服务（如果存在）
echo -e "${YELLOW}[7/8] 停止旧服务...${NC}"
if command -v pm2 &> /dev/null; then
    # 使用 PM2
    if pm2 list | grep -q "$APP_NAME"; then
        echo "停止现有 PM2 进程..."
        pm2 stop $APP_NAME
        pm2 delete $APP_NAME
        echo -e "${GREEN}✓ 旧服务已停止${NC}"
    else
        echo "未发现运行中的服务"
    fi
else
    # 使用端口查找进程
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "停止端口 $PORT 上的进程..."
        kill -9 $(lsof -t -i:$PORT) 2>/dev/null || true
        echo -e "${GREEN}✓ 旧服务已停止${NC}"
    else
        echo "端口 $PORT 未被占用"
    fi
fi
echo ""

# 8. 启动新服务
echo -e "${YELLOW}[8/8] 启动新服务...${NC}"
if command -v pm2 &> /dev/null; then
    # 使用 PM2 启动（设置环境变量）
    echo "使用 PM2 启动服务..."
    PORT=$PORT pm2 start npm --name "$APP_NAME" -- start
    pm2 save
    echo -e "${GREEN}✓ 服务已通过 PM2 启动${NC}"
    echo ""
    echo "查看日志: pm2 logs $APP_NAME"
    echo "查看状态: pm2 status"
    echo "停止服务: pm2 stop $APP_NAME"
else
    # 使用 nohup 后台启动
    echo "使用 nohup 后台启动服务..."
    if command -v pnpm &> /dev/null; then
        PORT=$PORT nohup pnpm start > ./logs/app.log 2>&1 &
    elif command -v yarn &> /dev/null; then
        PORT=$PORT nohup yarn start > ./logs/app.log 2>&1 &
    else
        PORT=$PORT nohup npm start > ./logs/app.log 2>&1 &
    fi
    echo $! > ./logs/app.pid
    echo -e "${GREEN}✓ 服务已后台启动${NC}"
    echo ""
    echo "查看日志: tail -f ./logs/app.log"
    echo "停止服务: kill \$(cat ./logs/app.pid)"
fi

echo ""
echo "========================================="
echo -e "${GREEN}  部署完成！${NC}"
echo "========================================="
echo ""
echo "服务地址: http://localhost:$PORT"
echo "开始时间: $(date)"
echo ""
