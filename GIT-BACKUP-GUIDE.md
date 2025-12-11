# 📦 使用 Git 备份数据库的完整指南

## 🎯 适用场景

- ✅ 数据库较小（< 50MB）
- ✅ GitHub 仓库是**私有的**
- ✅ 仅用于**临时迁移**（重装系统）
- ✅ 迁移后会**立即删除**备份

## ⚠️ 重要提醒

1. **仅用于临时迁移** - 不要长期保存用户数据在 Git 中
2. **私有仓库** - 确保仓库是私有的
3. **及时删除** - 迁移完成后立即删除备份
4. **清理历史** - 必要时从 Git 历史中彻底删除

---

## 📝 完整流程

### 🔴 **阶段 1: 重装系统前（在旧服务器）**

#### 步骤 1: 导出数据库到 Git

```bash
# 1. 登录旧服务器
ssh root@your-server-ip

# 2. 进入项目目录
cd ~/KnowYourself_website  # 或你的实际路径

# 3. 确保代码是最新的
git pull origin main

# 4. 运行备份脚本
chmod +x backup-db-to-git.sh
./backup-db-to-git.sh

# 你会看到：
# ========================================
#   数据库备份到 Git 仓库
# ========================================
#
# 数据库类型: postgresql
#
# [1/3] 导出数据库...
# ✓ PostgreSQL 数据库已导出
#
# [2/3] 生成备份信息...
# ✓ 备份信息已生成
#
# [3/3] 备份文件信息:
# -rw-r--r-- 1 root root  xxK database.sql
# -rw-r--r-- 1 root root  xxK database.dump
# -rw-r--r-- 1 root root  xxK BACKUP_INFO.txt
#
# 总大小: xxxK
```

#### 步骤 2: 提交并推送到 GitHub

```bash
# 添加备份文件
git add database-backup/

# 查看要提交的内容
git status

# 提交
git commit -m "backup: 系统重装前数据库备份 (临时)"

# 推送到 GitHub
git push origin main

# ✅ 完成！数据库已备份到 GitHub
```

#### 步骤 3: 验证备份（可选但推荐）

```bash
# 在本地电脑验证
git pull origin main
ls -lh database-backup/

# 应该看到：
# database.sql      - SQL 格式备份
# database.dump     - 压缩格式备份（PostgreSQL）
# BACKUP_INFO.txt   - 备份信息
```

---

### 🔧 **阶段 2: 重装系统**

按照之前的步骤，在云服务商控制台重装系统为 **Ubuntu 22.04 LTS**

---

### 🚀 **阶段 3: 重装系统后（在新服务器）**

#### 步骤 1: 运行自动部署脚本

```bash
# 1. 登录新服务器
ssh root@your-new-server-ip

# 2. 下载并运行部署脚本
wget https://raw.githubusercontent.com/JinzeWang10/KnowYourself_website/main/fresh-deploy.sh
chmod +x fresh-deploy.sh
./fresh-deploy.sh

# 按提示输入：
# - Git仓库: https://github.com/JinzeWang10/KnowYourself_website.git
# - 域名、邮箱等

# ✅ 脚本会自动完成所有部署
```

#### 步骤 2: 从 Git 恢复数据库

```bash
# 1. 进入项目目录
cd /home/deploy/KnowYourself_website
# 或 cd ~/KnowYourself_website (如果是 root 用户)

# 2. 确保代码是最新的（包含备份）
git pull origin main

# 3. 验证备份文件存在
ls -lh database-backup/

# 4. 运行恢复脚本
chmod +x restore-db-from-git.sh
./restore-db-from-git.sh

# 会提示：
# ⚠️ 警告: 此操作将覆盖现有数据库！
# 确定要恢复数据库吗？(yes/no):

# 输入 yes 确认

# PostgreSQL 会提示输入密码
# 查看密码: cat /root/db_credentials.txt
```

#### 步骤 3: 验证恢复

```bash
# 1. 检查数据
sudo -u postgres psql -d scales_db -c "SELECT COUNT(*) FROM anonymous_users;"
sudo -u postgres psql -d scales_db -c "SELECT COUNT(*) FROM assessment_records;"

# 应该看到之前的数据数量

# 2. 重启应用
pm2 restart knowyourself

# 3. 浏览器访问测试
# https://your-domain.com
# - 检查历史记录
# - 验证数据完整性
```

---

### 🗑️ **阶段 4: 清理备份（重要！）**

#### 步骤 1: 删除备份文件

```bash
# 在服务器上
cd /home/deploy/KnowYourself_website

# 删除备份目录
git rm -r database-backup/

# 提交删除
git commit -m "chore: 删除临时数据库备份"

# 推送
git push origin main

# ✅ 备份文件已从最新代码中删除
```

#### 步骤 2: 从 Git 历史中彻底删除（强烈推荐）

```bash
# ⚠️ 警告: 这会重写 Git 历史，需要 force push

# 方法 1: 使用 git filter-branch（适用于小仓库）
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch -r database-backup' \
  --prune-empty --tag-name-filter cat -- --all

# 强制推送（删除远程历史）
git push origin --force --all

# 方法 2: 使用 BFG Repo-Cleaner（更快，推荐）
# 下载 BFG: https://retype.github.io/bfg-repo-cleaner/
java -jar bfg.jar --delete-folders database-backup
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin --force --all

# ✅ 备份已从 Git 历史中彻底删除
```

#### 步骤 3: 验证删除

```bash
# 检查最新代码
git pull origin main
ls database-backup/
# 应该显示: No such file or directory

# 在 GitHub 网页上检查
# - 浏览代码，确认 database-backup 目录不存在
# - 查看 commits 历史，确认备份不可见
```

---

## 📋 完整命令速查表

### 重装前（旧服务器）

```bash
cd ~/KnowYourself_website
git pull origin main
./backup-db-to-git.sh
git add database-backup/
git commit -m "backup: 系统重装前数据库备份 (临时)"
git push origin main
```

### 重装后（新服务器）

```bash
# 部署
./fresh-deploy.sh

# 恢复数据
cd /home/deploy/KnowYourself_website
git pull origin main
./restore-db-from-git.sh

# 重启应用
pm2 restart knowyourself

# 删除备份
git rm -r database-backup/
git commit -m "chore: 删除临时数据库备份"
git push origin main

# 清理历史（可选但推荐）
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch -r database-backup' \
  --prune-empty --tag-name-filter cat -- --all
git push origin --force --all
```

---

## 🔍 故障排查

### 问题 1: 备份脚本找不到数据库

```bash
# 检查环境变量
cat .env.production

# 手动指定数据库
# 编辑 backup-db-to-git.sh，设置：
DB_USER="scales_user"
DB_NAME="scales_db"
```

### 问题 2: 恢复时提示权限错误

```bash
# PostgreSQL 密码在这里
cat /root/db_credentials.txt

# 或切换到 postgres 用户
sudo -u postgres psql -d scales_db < database-backup/database.sql
```

### 问题 3: Git 推送失败（文件太大）

```bash
# 检查文件大小
du -sh database-backup/

# 如果 > 50MB，改用其他方案：
# 1. 删除备份
git rm -r database-backup/
git commit --amend

# 2. 使用原来的备份方案
./backup-before-reinstall.sh
scp backup_*.tar.gz local-computer:~/
```

### 问题 4: 数据恢复后不完整

```bash
# 检查备份文件
cat database-backup/BACKUP_INFO.txt

# 重新导入
pg_restore -U scales_user -d scales_db -c -v database-backup/database.dump

# 查看详细错误
pm2 logs knowyourself
```

---

## 🔒 安全注意事项

### ✅ 推荐做法

1. **仅私有仓库** - 确保 GitHub 仓库是私有的
2. **临时使用** - 仅用于系统迁移，不超过 24 小时
3. **及时删除** - 恢复后立即删除备份
4. **清理历史** - 从 Git 历史中彻底删除
5. **验证删除** - 确认 GitHub 上无法访问备份

### ❌ 避免做法

1. ❌ 将备份长期保存在 Git 中
2. ❌ 在公开仓库中保存用户数据
3. ❌ 不清理 Git 历史
4. ❌ 备份文件大于 100MB
5. ❌ 包含明文密码或敏感信息

---

## 📊 方案对比

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **Git 备份** | 简单快速，一键恢复 | 需要私有仓库，有安全风险 | ⭐⭐⭐ 临时使用 |
| **手动备份** | 最安全，可控性强 | 操作步骤多 | ⭐⭐⭐⭐⭐ 长期使用 |
| **云存储** | 安全，容量大 | 需要额外配置 | ⭐⭐⭐⭐ 推荐 |

---

## ✅ 总结

**这个方案适合你的需求：**
- ✅ 数据库小
- ✅ 私有仓库
- ✅ 仅重装系统用一次
- ✅ 会立即删除

**操作流程：**
1. 旧服务器：`./backup-db-to-git.sh` → `git push`
2. 重装系统
3. 新服务器：`./fresh-deploy.sh` → `./restore-db-from-git.sh`
4. 删除备份：`git rm -r database-backup/` → `git push`

**总耗时：** 约 1-2 小时（比手动备份节省 1 小时）

---

**准备好了就开始吧！有问题随时问我。** 🚀
