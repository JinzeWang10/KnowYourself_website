// 测试提交测评记录
// Usage: node test_submit.js

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testSubmit() {
  console.log('='.repeat(60))
  console.log('🧪 测试提交测评记录')
  console.log('='.repeat(60))

  try {
    // 1. 查看提交前的记录数
    const beforeCount = await prisma.assessmentRecord.count()
    console.log(`\n📊 当前总记录数: ${beforeCount}`)

    // 2. 创建测试数据（模拟前端提交）
    const timestamp = Date.now()
    const testData = [
      {
        userId: `test-user-${timestamp}-1`,
        gender: 'female',
        age: 28,
        region: 'CN',
        record: {
          id: `test-record-${timestamp}-1`,
          scaleId: 'phq9',
          scaleTitle: 'PHQ-9 抑郁症筛查量表',
          totalScore: 12,
          normalizedScore: 12,
          level: '中度抑郁',
          answers: [
            { questionId: 'q1', answer: 2 },
            { questionId: 'q2', answer: 1 },
            { questionId: 'q3', answer: 2 },
            { questionId: 'q4', answer: 1 },
            { questionId: 'q5', answer: 2 },
            { questionId: 'q6', answer: 1 },
            { questionId: 'q7', answer: 1 },
            { questionId: 'q8', answer: 1 },
            { questionId: 'q9', answer: 1 },
          ],
          completedAt: new Date(),
          duration: 180,
        }
      },
      {
        userId: `test-user-${timestamp}-2`,
        gender: 'male',
        age: 35,
        region: undefined,
        record: {
          id: `test-record-${timestamp}-2`,
          scaleId: 'gad7',
          scaleTitle: 'GAD-7 焦虑症筛查量表',
          totalScore: 8,
          normalizedScore: 8,
          level: '轻度焦虑',
          answers: [
            { questionId: 'q1', answer: 1 },
            { questionId: 'q2', answer: 1 },
            { questionId: 'q3', answer: 1 },
            { questionId: 'q4', answer: 1 },
            { questionId: 'q5', answer: 1 },
            { questionId: 'q6', answer: 2 },
            { questionId: 'q7', answer: 1 },
          ],
          completedAt: new Date(),
          duration: 120,
        }
      },
      {
        userId: `test-user-${timestamp}-3`,
        gender: 'female',
        age: 22,
        region: undefined,
        record: {
          id: `test-record-${timestamp}-3`,
          scaleId: 'ani',
          scaleTitle: 'ANI 手机成瘾指数量表',
          totalScore: 45,
          normalizedScore: 45,
          level: '中度成瘾',
          dimensionScores: {
            hbi_consequences: 15,
            ppus_functional: 12,
            ppcs_relapse_withdrawal: 10,
            rmsgs_guilt: 8,
          },
          answers: [
            { questionId: 'q1', answer: 3 },
            { questionId: 'q2', answer: 2 },
            { questionId: 'q3', answer: 3 },
            { questionId: 'q4', answer: 2 },
            { questionId: 'q5', answer: 3 },
          ],
          completedAt: new Date(),
          duration: 200,
        }
      },
    ]

    console.log(`\n✍️  准备插入 ${testData.length} 条测试记录...\n`)

    // 3. 逐条插入并显示结果
    for (let i = 0; i < testData.length; i++) {
      const data = testData[i]

      try {
        // 使用事务插入用户和记录
        const result = await prisma.$transaction(async (tx) => {
          // 创建用户
          const user = await tx.anonymousUser.create({
            data: {
              id: data.userId,
              gender: data.gender,
              age: data.age,
              region: data.region || null,
            }
          })

          // 创建测评记录
          const record = await tx.assessmentRecord.create({
            data: {
              id: data.record.id,
              userId: user.id,
              scaleId: data.record.scaleId,
              scaleTitle: data.record.scaleTitle,
              totalScore: data.record.totalScore,
              normalizedScore: data.record.normalizedScore,
              level: data.record.level,
              dimensionScores: data.record.dimensionScores || undefined,
              answers: data.record.answers,
              completedAt: data.record.completedAt,
              duration: data.record.duration || null,
            }
          })

          return { user, record }
        })

        console.log(`✅ [${i + 1}/${testData.length}] 插入成功:`)
        console.log(`   用户ID: ${result.user.id}`)
        console.log(`   记录ID: ${result.record.id}`)
        console.log(`   量表: ${result.record.scaleTitle}`)
        console.log(`   性别: ${result.user.gender}, 年龄: ${result.user.age}`)
        console.log(`   得分: ${result.record.totalScore}, 等级: ${result.record.level}`)
        console.log(`   完成时间: ${result.record.completedAt.toLocaleString('zh-CN')}`)
        console.log()
      } catch (error) {
        console.error(`❌ [${i + 1}/${testData.length}] 插入失败:`, error.message)
      }
    }

    // 4. 查看插入后的记录数
    const afterCount = await prisma.assessmentRecord.count()
    console.log('='.repeat(60))
    console.log(`📊 插入后总记录数: ${afterCount}`)
    console.log(`📈 新增记录数: ${afterCount - beforeCount}`)

    // 5. 显示最新的记录
    console.log('\n📋 最新 5 条记录:')
    console.log('-'.repeat(60))
    const latest = await prisma.assessmentRecord.findMany({
      take: 5,
      orderBy: { completedAt: 'desc' },
      include: {
        user: true
      }
    })

    latest.forEach((r, i) => {
      const time = new Date(r.completedAt).toLocaleString('zh-CN')
      console.log(`${i + 1}. ${r.scaleTitle}`)
      console.log(`   ${r.user.gender}, ${r.user.age}岁 | 得分: ${r.totalScore} | ${r.level}`)
      console.log(`   完成时间: ${time}`)
      console.log(`   用户ID: ${r.userId.substring(0, 20)}...`)
      console.log(`   记录ID: ${r.id.substring(0, 20)}...`)
      console.log()
    })

    // 6. 统计各量表数据
    console.log('📊 各量表统计:')
    console.log('-'.repeat(60))
    const scaleStats = await prisma.assessmentRecord.groupBy({
      by: ['scaleId', 'scaleTitle'],
      _count: true,
      orderBy: {
        _count: {
          scaleId: 'desc'
        }
      }
    })

    scaleStats.forEach(stat => {
      console.log(`${stat.scaleTitle}: ${stat._count} 人`)
    })

    console.log('\n' + '='.repeat(60))
    console.log('✅ 测试完成！数据库记录功能正常')
    console.log('='.repeat(60))

  } catch (error) {
    console.error('\n❌ 测试失败:', error.message)
    console.error('\n完整错误:')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

testSubmit()
