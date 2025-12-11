#!/bin/bash

# 从 Git 仓库恢复数据库脚本
# 用途：重装系统后，从 GitHub 拉取并恢复数据库

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "========================================="
echo -e "${YELLOW}  从 Git 仓库恢复数据库${NC}"
echo "========================================="
echo ""

# 检查备份目录是否存在
BACKUP_DIR="database-backup"

if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}错误: 未找到备份目录 $BACKUP_DIR${NC}"
    echo "请先执行: git pull origin main"
    exit 1
fi

# 显示备份信息
if [ -f "$BACKUP_DIR/BACKUP_INFO.txt" ]; then
    echo -e "${BLUE}备份信息:${NC}"
    cat $BACKUP_DIR/BACKUP_INFO.txt
    echo ""
fi

# 检测数据库类型
if [ -f "$BACKUP_DIR/database.dump" ]; then
    DB_TYPE="postgresql"
elif [ -f "$BACKUP_DIR/database.db" ]; then
    DB_TYPE="sqlite"
else
    echo -e "${RED}错误: 未找到有效的备份文件${NC}"
    exit 1
fi

echo -e "${BLUE}检测到数据库类型: $DB_TYPE${NC}"
echo ""

# 读取数据库配置
if [ -f .env.production ]; then
    source .env.production
    echo "使用 .env.production 配置"
elif [ -f .env ]; then
    source .env
    echo "使用 .env 配置"
fi

# 确认恢复
echo -e "${YELLOW}⚠️ 警告: 此操作将覆盖现有数据库！${NC}"
read -p "确定要恢复数据库吗？(yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "操作已取消"
    exit 0
fi

echo ""
echo -e "${YELLOW}开始恢复数据库...${NC}"
echo ""

# 执行恢复
if [ "$DB_TYPE" = "postgresql" ]; then
    # PostgreSQL 恢复
    if [ -n "$DATABASE_URL" ]; then
        DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
        DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    else
        echo "请输入数据库信息："
        read -p "数据库用户名 [scales_user]: " DB_USER
        DB_USER=${DB_USER:-scales_user}
        read -p "数据库名称 [scales_db]: " DB_NAME
        DB_NAME=${DB_NAME:-scales_db}
    fi

    echo "恢复到数据库: $DB_NAME (用户: $DB_USER)"
    echo ""

    # 优先使用 dump 格式
    if [ -f "$BACKUP_DIR/database.dump" ]; then
        echo "使用 dump 格式恢复..."
        pg_restore -U $DB_USER -d $DB_NAME -c -v $BACKUP_DIR/database.dump
    elif [ -f "$BACKUP_DIR/database.sql" ]; then
        echo "使用 SQL 格式恢复..."
        psql -U $DB_USER -d $DB_NAME < $BACKUP_DIR/database.sql
    fi

    # 验证恢复
    echo ""
    echo "验证数据恢复..."
    USER_COUNT=$(sudo -u postgres psql -d $DB_NAME -t -c "SELECT COUNT(*) FROM anonymous_users;")
    RECORD_COUNT=$(sudo -u postgres psql -d $DB_NAME -t -c "SELECT COUNT(*) FROM assessment_records;")

    echo -e "${GREEN}✓ 用户数量: $USER_COUNT${NC}"
    echo -e "${GREEN}✓ 测评记录: $RECORD_COUNT${NC}"

elif [ "$DB_TYPE" = "sqlite" ]; then
    # SQLite 恢复
    SQLITE_FILE="prisma/dev.db"

    # 备份现有数据库（如果存在）
    if [ -f "$SQLITE_FILE" ]; then
        echo "备份现有数据库..."
        cp $SQLITE_FILE ${SQLITE_FILE}.bak
    fi

    # 恢复数据库
    if [ -f "$BACKUP_DIR/database.db" ]; then
        echo "直接复制数据库文件..."
        cp $BACKUP_DIR/database.db $SQLITE_FILE
    elif [ -f "$BACKUP_DIR/database.sql" ]; then
        echo "从 SQL 恢复..."
        rm -f $SQLITE_FILE
        sqlite3 $SQLITE_FILE < $BACKUP_DIR/database.sql
    fi

    echo -e "${GREEN}✓ SQLite 数据库恢复完成${NC}"
fi

echo ""
echo "========================================="
echo -e "${GREEN}  数据库恢复完成！${NC}"
echo "========================================="
echo ""
echo -e "${BLUE}下一步操作:${NC}"
echo ""
echo "1. 重启应用:"
echo "   ${GREEN}pm2 restart knowyourself${NC}"
echo ""
echo "2. 验证数据:"
echo "   访问网站检查历史记录和数据"
echo ""
echo "3. 删除备份（重要！）:"
echo "   ${GREEN}git rm -r database-backup/${NC}"
echo "   ${GREEN}git commit -m \"chore: 删除临时数据库备份\"${NC}"
echo "   ${GREEN}git push origin main${NC}"
echo ""
echo "4. 可选：从 Git 历史中彻底删除（如果担心泄露）:"
echo "   ${YELLOW}git filter-branch --force --index-filter \\${NC}"
echo "   ${YELLOW}  'git rm --cached --ignore-unmatch -r database-backup' \\${NC}"
echo "   ${YELLOW}  --prune-empty --tag-name-filter cat -- --all${NC}"
echo "   ${YELLOW}git push origin --force --all${NC}"
echo ""
echo "========================================="
