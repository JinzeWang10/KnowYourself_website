// 验证测评记录是否正常工作
// Usage: node verify_recording.js

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verify() {
  console.log('='.repeat(70))
  console.log('🔍 验证测评记录功能')
  console.log('='.repeat(70))

  try {
    // 1. 检查数据库连接
    console.log('\n1️⃣ 检查数据库连接...')
    await prisma.$connect()
    console.log('✅ 数据库连接成功')

    // 2. 查看总记录数
    const totalCount = await prisma.assessmentRecord.count()
    console.log(`\n2️⃣ 当前总记录数: ${totalCount}`)

    if (totalCount === 0) {
      console.log('⚠️  数据库中没有任何记录！')
      console.log('\n可能原因：')
      console.log('  1. 用户没有填写个人信息（性别/年龄）')
      console.log('  2. 前端没有正确调用 API')
      console.log('  3. API 调用失败但被静默处理')
      console.log('\n💡 建议运行测试脚本验证数据库写入功能：')
      console.log('   node test_submit.js')
      return
    }

    // 3. 查看最近 10 条记录
    console.log('\n3️⃣ 最近 10 条测评记录:')
    console.log('-'.repeat(70))

    const recent = await prisma.assessmentRecord.findMany({
      take: 10,
      orderBy: { completedAt: 'desc' },
      include: {
        user: true,
      }
    })

    recent.forEach((r, i) => {
      const time = new Date(r.completedAt)
      const now = new Date()
      const diffHours = Math.floor((now - time) / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)

      let timeAgo = ''
      if (diffDays > 0) {
        timeAgo = `${diffDays}天前`
      } else if (diffHours > 0) {
        timeAgo = `${diffHours}小时前`
      } else {
        const diffMins = Math.floor((now - time) / (1000 * 60))
        timeAgo = diffMins > 0 ? `${diffMins}分钟前` : '刚刚'
      }

      console.log(`\n${i + 1}. ${r.scaleTitle} (${r.scaleId})`)
      console.log(`   👤 ${r.user.gender}, ${r.user.age}岁 (用户: ${r.userId.substring(0, 15)}...)`)
      console.log(`   📊 得分: ${r.totalScore} (归一化: ${r.normalizedScore}) | 等级: ${r.level}`)
      console.log(`   ⏰ 完成时间: ${time.toLocaleString('zh-CN')} (${timeAgo})`)
      if (r.duration) {
        console.log(`   ⏱️  用时: ${Math.floor(r.duration / 60)}分${r.duration % 60}秒`)
      }
      if (r.user.region) {
        console.log(`   🌍 地区: ${r.user.region}`)
      }
    })

    // 4. 统计今天的记录
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayCount = await prisma.assessmentRecord.count({
      where: {
        completedAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    console.log('\n' + '='.repeat(70))
    console.log(`4️⃣ 今日测评数: ${todayCount}`)

    if (todayCount === 0) {
      console.log('⚠️  今天还没有新的测评记录')
      console.log('\n💡 测试方法：')
      console.log('   1. 在浏览器中打开网站')
      console.log('   2. 打开开发者工具 (F12) -> Console 标签')
      console.log('   3. 确保设置了用户信息：')
      console.log('      localStorage.setItem("userInfo", JSON.stringify({gender: "male", age: 25}))')
      console.log('   4. 完成一次测评')
      console.log('   5. 在 Network 标签查看是否有 POST /api/assessments 请求')
      console.log('   6. 再次运行本脚本查看记录是否增加')
    } else {
      console.log('✅ 今天有新的测评记录，功能正常！')

      // 显示今天的记录详情
      const todayRecords = await prisma.assessmentRecord.findMany({
        where: {
          completedAt: {
            gte: today,
            lt: tomorrow
          }
        },
        include: {
          user: true
        },
        orderBy: { completedAt: 'desc' }
      })

      console.log('\n📋 今日测评详情:')
      console.log('-'.repeat(70))
      todayRecords.forEach((r, i) => {
        const time = new Date(r.completedAt).toLocaleTimeString('zh-CN')
        console.log(`${i + 1}. [${time}] ${r.scaleTitle} - ${r.user.gender}, ${r.user.age}岁, 得分: ${r.totalScore}`)
      })
    }

    // 5. 统计各量表的记录数
    console.log('\n5️⃣ 各量表统计:')
    console.log('-'.repeat(70))

    const scaleStats = await prisma.assessmentRecord.groupBy({
      by: ['scaleId', 'scaleTitle'],
      _count: true,
      _avg: {
        totalScore: true,
      },
      orderBy: {
        _count: {
          scaleId: 'desc'
        }
      }
    })

    // 为每个量表计算平均年龄（需要关联查询）
    for (const stat of scaleStats) {
      const records = await prisma.assessmentRecord.findMany({
        where: { scaleId: stat.scaleId },
        include: { user: true }
      })

      const avgAge = records.length > 0
        ? records.reduce((sum, r) => sum + r.user.age, 0) / records.length
        : 0

      const avgScore = stat._avg.totalScore?.toFixed(1) || 'N/A'

      console.log(`${stat.scaleTitle}:`)
      console.log(`  📊 记录数: ${stat._count}`)
      console.log(`  📈 平均分: ${avgScore}`)
      console.log(`  👥 平均年龄: ${avgAge.toFixed(1)}岁`)
      console.log()
    }

    // 6. 检查是否有异常数据
    console.log('6️⃣ 数据质量检查:')
    console.log('-'.repeat(70))

    // 检查异常年龄（需要在用户表中查询）
    const invalidAgeUsers = await prisma.anonymousUser.count({
      where: {
        OR: [
          { age: { lt: 10 } },
          { age: { gt: 100 } }
        ]
      }
    })

    const invalidScore = await prisma.assessmentRecord.count({
      where: {
        totalScore: { lt: 0 }
      }
    })

    if (invalidAgeUsers > 0) {
      console.log(`⚠️  发现 ${invalidAgeUsers} 个年龄异常的用户（<10 或 >100）`)
    } else {
      console.log('✅ 年龄数据正常')
    }

    if (invalidScore > 0) {
      console.log(`⚠️  发现 ${invalidScore} 条负分记录`)
    } else {
      console.log('✅ 分数数据正常')
    }

    console.log('\n' + '='.repeat(70))
    console.log('✅ 验证完成')
    console.log('='.repeat(70))

  } catch (error) {
    console.error('\n❌ 验证失败:', error.message)
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

verify()
