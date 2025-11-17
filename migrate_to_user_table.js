// 数据迁移脚本：从旧表结构迁移到新表结构
// 旧结构：assessment_records 包含用户信息（gender, age）
// 新结构：anonymous_users + assessment_records（外键关联）
//
// Usage: node migrate_to_user_table.js

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrate() {
  console.log('='.repeat(70))
  console.log('📦 数据库结构迁移')
  console.log('从旧表结构迁移到新表结构（用户表 + 测评记录表）')
  console.log('='.repeat(70))

  try {
    // 注意：这个脚本假设旧表还在，需要手动处理
    // 由于表结构变化较大，建议使用 Prisma Migrate

    console.log('\n⚠️  重要提示：')
    console.log('由于表结构变化较大（添加外键约束），建议使用以下步骤：')
    console.log('\n步骤 1: 备份现有数据')
    console.log('  npx prisma db pull  # 确保 schema 与数据库同步')
    console.log('  pg_dump your_database > backup.sql  # PostgreSQL 备份')
    console.log('\n步骤 2: 应用新的 schema')
    console.log('  npx prisma db push')
    console.log('\n步骤 3: 如果有现有数据需要迁移，请联系数据库管理员')
    console.log('\n由于当前是匿名用户系统，旧数据中没有 userId，')
    console.log('需要为每条旧记录生成一个唯一的匿名用户 ID。')

    const answer = await new Promise((resolve) => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      })
      readline.question('\n是否继续执行数据迁移？(yes/no): ', (ans) => {
        readline.close()
        resolve(ans.toLowerCase())
      })
    })

    if (answer !== 'yes') {
      console.log('\n✅ 迁移已取消')
      return
    }

    console.log('\n🚀 开始迁移...')
    console.log('\n注意：由于表结构变化，此脚本无法自动迁移旧数据。')
    console.log('建议：')
    console.log('1. 如果是新项目，直接使用新 schema')
    console.log('2. 如果有重要的旧数据，需要手动编写迁移SQL')

    console.log('\n' + '='.repeat(70))
    console.log('✅ 迁移说明完成')
    console.log('='.repeat(70))

  } catch (error) {
    console.error('\n❌ 迁移失败:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

migrate()
