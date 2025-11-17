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

    // 3. 获取今日所有记录（包含用户信息）
    const records = await prisma.assessmentRecord.findMany({
      where: {
        completedAt: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        user: true
      }
    })

    // 4. 按性别统计
    const genderMap = {
      'male': '男性',
      'female': '女性',
      'other': '其他',
      'prefer_not_to_say': '不愿透露'
    }

    const genderStats = records.reduce((acc, r) => {
      const gender = r.user.gender
      acc[gender] = (acc[gender] || 0) + 1
      return acc
    }, {})

    console.log('\n👥 性别分布:')
    console.log('-'.repeat(60))
    Object.entries(genderStats).forEach(([gender, count]) => {
      const percentage = ((count / totalCount) * 100).toFixed(1)
      console.log(`  ${genderMap[gender] || gender}: ${count} 人 (${percentage}%)`)
    })

    // 5. 年龄分布统计
    const ages = records.map(r => r.user.age)
    const avgAge = ages.reduce((sum, age) => sum + age, 0) / ages.length

    console.log('\n🎂 年龄分布:')
    console.log('-'.repeat(60))

    // 按年龄分组
    const ageGroups = {
      '<18': 0,
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-60': 0,
      '>60': 0
    }

    ages.forEach(age => {
      if (age < 18) ageGroups['<18']++
      else if (age <= 25) ageGroups['18-25']++
      else if (age <= 35) ageGroups['26-35']++
      else if (age <= 45) ageGroups['36-45']++
      else if (age <= 60) ageGroups['46-60']++
      else ageGroups['>60']++
    })

    Object.entries(ageGroups).forEach(([group, count]) => {
      if (count > 0) {
        console.log(`  ${group}岁: ${count} 人`)
      }
    })
    console.log(`  平均年龄: ${avgAge.toFixed(1)} 岁`)

    // 6. 完成时间分布（按小时）
    console.log('\n⏰ 时段分布:')
    console.log('-'.repeat(60))

    const hourlyDistribution = {}
    records.forEach(record => {
      const hour = new Date(record.completedAt).getHours()
      hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1
    })

    Object.keys(hourlyDistribution)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .forEach(hour => {
        const count = hourlyDistribution[hour]
        const bar = '█'.repeat(Math.ceil(count / 2))
        console.log(`  ${hour.padStart(2, '0')}:00 - ${bar} ${count} 人`)
      })

    // 7. 独立用户数统计
    const uniqueUsers = new Set(records.map(r => r.userId)).size
    console.log('\n📈 用户统计:')
    console.log('-'.repeat(60))
    console.log(`  独立用户数: ${uniqueUsers}`)
    console.log(`  总测评次数: ${totalCount}`)
    console.log(`  人均测评次数: ${(totalCount / uniqueUsers).toFixed(2)}`)

    console.log('\n' + '='.repeat(60))

  } catch (error) {
    console.error('❌ 查询出错:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

getDailyStats()
