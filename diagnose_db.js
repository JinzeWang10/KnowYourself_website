// 数据库连接诊断脚本
// Usage: node diagnose_db.js

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function diagnose() {
  console.log('='.repeat(60))
  console.log('🔍 数据库连接诊断')
  console.log('='.repeat(60))

  try {
    // 1. 检查环境变量
    console.log('\n1️⃣ 检查环境变量:')
    console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '✓ 已设置' : '✗ 未设置'}`)
    if (process.env.DATABASE_URL) {
      const url = new URL(process.env.DATABASE_URL)
      console.log(`   协议: ${url.protocol}`)
      console.log(`   主机: ${url.hostname}:${url.port || '默认端口'}`)
      console.log(`   数据库: ${url.pathname.substring(1)}`)
    }

    // 2. 测试数据库连接
    console.log('\n2️⃣ 测试数据库连接:')
    await prisma.$connect()
    console.log('✓ 数据库连接成功')

    // 3. 检查表是否存在
    console.log('\n3️⃣ 检查 assessment_records 表:')
    try {
      const count = await prisma.assessmentRecord.count()
      console.log(`✓ 表存在，当前记录数: ${count}`)

      // 4. 查看最近的记录
      if (count > 0) {
        console.log('\n4️⃣ 最近 5 条记录:')
        const recent = await prisma.assessmentRecord.findMany({
          take: 5,
          orderBy: { completedAt: 'desc' },
          select: {
            id: true,
            scaleTitle: true,
            gender: true,
            age: true,
            totalScore: true,
            completedAt: true,
          }
        })
        recent.forEach((r, i) => {
          console.log(`   ${i + 1}. ${r.scaleTitle} - ${r.gender}, ${r.age}岁, 得分:${r.totalScore} (${new Date(r.completedAt).toLocaleString('zh-CN')})`)
        })
      }
    } catch (error) {
      console.error('✗ 表不存在或访问失败')
      console.error('   错误:', error.message)
      console.log('\n💡 解决方案:')
      console.log('   运行: npx prisma db push')
      console.log('   这将根据 schema.prisma 创建数据库表')
    }

    // 5. 测试写入
    console.log('\n5️⃣ 测试写入功能:')
    const testRecord = {
      id: `test-${Date.now()}`,
      scaleId: 'test',
      scaleTitle: '测试量表',
      gender: 'male',
      age: 25,
      totalScore: 100,
      normalizedScore: 100,
      level: '测试',
      answers: [{ questionId: 'q1', answer: 1 }],
      completedAt: new Date(),
    }

    const created = await prisma.assessmentRecord.create({
      data: testRecord
    })
    console.log('✓ 写入测试成功, ID:', created.id)

    // 删除测试记录
    await prisma.assessmentRecord.delete({
      where: { id: created.id }
    })
    console.log('✓ 测试记录已清理')

    console.log('\n' + '='.repeat(60))
    console.log('✅ 所有检查通过！数据库配置正常')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ 诊断失败:', error.message)
    console.error('\n完整错误信息:')
    console.error(error)

    console.log('\n💡 可能的解决方案:')
    console.log('1. 检查 DATABASE_URL 环境变量是否正确')
    console.log('2. 确保数据库服务正在运行')
    console.log('3. 运行 npx prisma generate')
    console.log('4. 运行 npx prisma db push')
    console.log('5. 检查数据库用户权限')
  } finally {
    await prisma.$disconnect()
  }
}

diagnose()
