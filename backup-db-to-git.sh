#!/bin/bash

# 数据库备份到 Git 仓库脚本
# 用途：重装系统前，将数据库导出并提交到 GitHub

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "========================================="
echo -e "${YELLOW}  数据库备份到 Git 仓库${NC}"
echo "========================================="
echo ""

# 配置（从环境变量或 .env 读取）
if [ -f .env.production ]; then
    source .env.production
elif [ -f .env ]; then
    source .env
fi

# 提取数据库信息
if [ -n "$DATABASE_URL" ]; then
    # PostgreSQL
    DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    DB_TYPE="postgresql"
elif [ -f "prisma/dev.db" ]; then
    # SQLite
    DB_TYPE="sqlite"
    SQLITE_FILE="prisma/dev.db"
else
    echo -e "${RED}错误: 未检测到数据库配置${NC}"
    exit 1
fi

echo -e "${BLUE}数据库类型: $DB_TYPE${NC}"
echo ""

# 创建备份目录
BACKUP_DIR="database-backup"
mkdir -p $BACKUP_DIR

# 执行备份
echo -e "${YELLOW}[1/3] 导出数据库...${NC}"

if [ "$DB_TYPE" = "postgresql" ]; then
    # PostgreSQL 备份
    echo "备份 PostgreSQL 数据库: $DB_NAME"

    # 使用 postgres 用户执行备份（避免认证问题）
    echo "导出 SQL 格式..."
    sudo -u postgres pg_dump -d $DB_NAME --clean --if-exists > $BACKUP_DIR/database.sql

    echo "导出压缩格式..."
    sudo -u postgres pg_dump -d $DB_NAME -F c > $BACKUP_DIR/database.dump

    echo -e "${GREEN}✓ PostgreSQL 数据库已导出${NC}"

elif [ "$DB_TYPE" = "sqlite" ]; then
    # SQLite 备份
    echo "备份 SQLite 数据库: $SQLITE_FILE"

    # 复制数据库文件
    cp $SQLITE_FILE $BACKUP_DIR/database.db

    # 导出为 SQL（便于 Git diff）
    sqlite3 $SQLITE_FILE .dump > $BACKUP_DIR/database.sql

    echo -e "${GREEN}✓ SQLite 数据库已导出${NC}"
fi

echo ""

# 创建备份信息文件
echo -e "${YELLOW}[2/3] 生成备份信息...${NC}"

cat > $BACKUP_DIR/BACKUP_INFO.txt << EOF
========================================
数据库备份信息
========================================

备份时间: $(date '+%Y-%m-%d %H:%M:%S')
数据库类型: $DB_TYPE
$(if [ "$DB_TYPE" = "postgresql" ]; then
    echo "数据库名: $DB_NAME"
    echo "用户名: $DB_USER"
else
    echo "数据库文件: $SQLITE_FILE"
fi)

文件说明:
- database.sql: SQL 格式备份（可直接查看）
$(if [ "$DB_TYPE" = "postgresql" ]; then
    echo "- database.dump: 压缩格式备份（推荐恢复使用）"
else
    echo "- database.db: SQLite 数据库文件"
fi)

恢复方法:
$(if [ "$DB_TYPE" = "postgresql" ]; then
    echo "  pg_restore -U $DB_USER -d $DB_NAME -c database-backup/database.dump"
    echo "  或"
    echo "  psql -U $DB_USER -d $DB_NAME < database-backup/database.sql"
else
    echo "  cp database-backup/database.db prisma/dev.db"
    echo "  或"
    echo "  sqlite3 prisma/dev.db < database-backup/database.sql"
fi)

⚠️ 重要提醒:
1. 此备份包含用户数据，仅用于临时系统迁移
2. 迁移完成后应立即从 Git 历史中删除
3. 不要将此备份长期保存在 Git 仓库中

========================================
EOF

echo -e "${GREEN}✓ 备份信息已生成${NC}"
echo ""

# 显示备份文件大小
echo -e "${YELLOW}[3/3] 备份文件信息:${NC}"
ls -lh $BACKUP_DIR/
echo ""

TOTAL_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
echo -e "${BLUE}总大小: $TOTAL_SIZE${NC}"
echo ""

# 检查文件大小
BACKUP_SIZE_BYTES=$(du -sb $BACKUP_DIR | cut -f1)
MAX_SIZE_BYTES=$((50 * 1024 * 1024))  # 50MB

if [ $BACKUP_SIZE_BYTES -gt $MAX_SIZE_BYTES ]; then
    echo -e "${RED}⚠️ 警告: 备份文件较大 ($TOTAL_SIZE)${NC}"
    echo "GitHub 推荐单文件 < 50MB"
    echo "建议使用其他备份方案"
    echo ""
fi

# Git 操作提示
echo "========================================="
echo -e "${GREEN}  备份完成！${NC}"
echo "========================================="
echo ""
echo -e "${BLUE}下一步操作:${NC}"
echo ""
echo "1. 提交到 Git:"
echo "   ${GREEN}git add database-backup/${NC}"
echo "   ${GREEN}git commit -m \"backup: 系统重装前数据库备份 (临时)\"${NC}"
echo "   ${GREEN}git push origin main${NC}"
echo ""
echo "2. 重装系统后恢复:"
echo "   ${GREEN}git pull origin main${NC}"
if [ "$DB_TYPE" = "postgresql" ]; then
    echo "   ${GREEN}pg_restore -U $DB_USER -d $DB_NAME -c database-backup/database.dump${NC}"
else
    echo "   ${GREEN}cp database-backup/database.db prisma/dev.db${NC}"
fi
echo ""
echo "3. 恢复成功后删除备份:"
echo "   ${GREEN}git rm -r database-backup/${NC}"
echo "   ${GREEN}git commit -m \"chore: 删除临时数据库备份\"${NC}"
echo "   ${GREEN}git push origin main${NC}"
echo ""
echo -e "${YELLOW}⚠️ 重要: 迁移完成后务必删除备份！${NC}"
echo "========================================="
