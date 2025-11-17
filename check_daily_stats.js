// 查看今日测评统计数据
// Usage: node check_daily_stats.js

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getDailyStats() {
  try {
    // 获取今天的开始和结束时间
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    console.log('='.repeat(60))
    console.log(`📊 今日测评统计 (${today.toLocaleDateString('zh-CN')})`)
    console.log('='.repeat(60))

    // 1. 总测评人数
    const totalCount = await prisma.assessmentRecord.count({
      where: {
        completedAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    console.log(`\n✅ 今日总测评人数: ${totalCount}\n`)

    if (totalCount === 0) {
      console.log('今天还没有人完成测评\n')
      return
    }

    // 2. 按量表分组统计
    const scaleStats = await prisma.assessmentRecord.groupBy({
      by: ['scaleId', 'scaleTitle'],
      where: {
        completedAt: {
          gte: today,
          lt: tomorrow
        }
      },
      _count: true
    })

    console.log('📋 各量表测评人数:')
    console.log('-'.repeat(60))
    scaleStats.forEach(stat => {
      console.log(`  ${stat.scaleTitle} (${stat.scaleId}): ${stat._count} 人`)
    })

    // 3. 按性别统计
    const genderStats = await prisma.assessmentRecord.groupBy({
      by: ['gender'],
      where: {
        completedAt: {
          gte: today,
          lt: tomorrow
        }
      },
      _count: true
    })

    console.log('\n👥 性别分布:')
    console.log('-'.repeat(60))
    const genderMap = {
      'male': '男性',
      'female': '女性',
      'other': '其他',
      'prefer_not_to_say': '不愿透露'
    }
    genderStats.forEach(stat => {
      const percentage = ((stat._count / totalCount) * 100).toFixed(1)
      console.log(`  ${genderMap[stat.gender] || stat.gender}: ${stat._count} 人 (${percentage}%)`)
    })

    // 4. 年龄分布统计
    const ageStats = await prisma.assessmentRecord.groupBy({
      by: ['age'],
      where: {
        completedAt: {
          gte: today,
          lt: tomorrow
        }
      },
      _count: true,
      _avg: {
        totalScore: true
      }
    })

    console.log('\n🎂 年龄分布:')
    console.log('-'.repeat(60))
    const sortedAgeStats = ageStats.sort((a, b) => a.age - b.age)
    sortedAgeStats.forEach(stat => {
      console.log(`  ${stat.age}岁: ${stat._count} 人`)
    })

    const avgAge = await prisma.assessmentRecord.aggregate({
      where: {
        completedAt: {
          gte: today,
          lt: tomorrow
        }
      },
      _avg: {
        age: true
      }
    })
    console.log(`  平均年龄: ${avgAge._avg.age?.toFixed(1)} 岁`)

    // 5. 完成时间分布（按小时）
    const records = await prisma.assessmentRecord.findMany({
      where: {
        completedAt: {
          gte: today,
          lt: tomorrow
        }
      },
      select: {
        completedAt: true
      }
    })

    const hourlyDistribution = {}
    records.forEach(record => {
      const hour = new Date(record.completedAt).getHours()
      hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1
    })

    console.log('\n⏰ 时段分布:')
    console.log('-'.repeat(60))
    Object.keys(hourlyDistribution)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .forEach(hour => {
        const count = hourlyDistribution[hour]
        const bar = '█'.repeat(Math.ceil(count / 2))
        console.log(`  ${hour.padStart(2, '0')}:00 - ${bar} ${count} 人`)
      })

    console.log('\n' + '='.repeat(60))

  } catch (error) {
    console.error('❌ 查询出错:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

getDailyStats()
