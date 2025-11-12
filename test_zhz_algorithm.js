/**
 * 测试甄嬛传8维度28题评测算法
 * 验证加权欧式距离计算和角色匹配逻辑
 */

// 模拟用户答案（选择所有选项A，即value=1）
const mockAnswers = {};
for (let i = 1; i <= 28; i++) {
  mockAnswers[`zhz_q${i}`] = 1;
}

console.log('🧪 测试甄嬛传人格测评算法\n');
console.log('📝 模拟答案：所有题目选择选项A（value=1）');
console.log('📊 预期结果：应匹配高策略、高进取心、低情感的角色（如皇后、甄嬛后期）\n');

// 维度权重
const DIMENSION_WEIGHTS = {
  emotional: 1.0,
  strategy: 1.3,
  energy: 1.0,
  idealism: 0.8,
  stability: 0.8,
  ambition: 1.2,
  authenticity: 1.2,
  novelty: 1.0,
};

// 简化的角色数据（仅包含3个代表性角色）
const TEST_CHARACTERS = {
  'huanghou': {
    name: '皇后',
    scores: {
      emotional: 0.3,
      strategy: 1.0,
      energy: 0.15,
      idealism: 0.2,
      stability: 0.95,
      ambition: 0.95,
      authenticity: 0.1,
      novelty: 0.1,
    }
  },
  'zhenhuan_late': {
    name: '甄嬛（后期）',
    scores: {
      emotional: 0.35,
      strategy: 0.95,
      energy: 0.8,
      idealism: 0.25,
      stability: 0.9,
      ambition: 0.95,
      authenticity: 0.3,
      novelty: 0.7,
    }
  },
  'wentaiyi': {
    name: '温太医',
    scores: {
      emotional: 0.95,
      strategy: 0.15,
      energy: 0.35,
      idealism: 0.9,
      stability: 0.75,
      ambition: 0.1,
      authenticity: 0.85,
      novelty: 0.2,
    }
  }
};

// 加权欧式距离函数
function weightedEuclideanDistance(vec1, vec2) {
  const keys = Object.keys(vec1);
  let sumSquaredDiff = 0;

  keys.forEach(key => {
    const weight = DIMENSION_WEIGHTS[key] || 1.0;
    const diff = vec1[key] - vec2[key];
    sumSquaredDiff += weight * (diff ** 2);
  });

  return Math.sqrt(sumSquaredDiff);
}

// 模拟用户分数（假设所有A选项的平均分）
const mockUserScores = {
  emotional: 0.35,  // 偏低
  strategy: 0.85,   // 高
  energy: 0.55,     // 中等
  idealism: 0.3,    // 低
  stability: 0.75,  // 中高
  ambition: 0.85,   // 高
  authenticity: 0.35, // 低
  novelty: 0.65,    // 中等
};

console.log('👤 模拟用户8维度分数：');
Object.entries(mockUserScores).forEach(([dim, score]) => {
  console.log(`  ${dim}: ${score.toFixed(2)}`);
});
console.log('');

// 计算与每个角色的距离和相似度
console.log('📐 与各角色的距离计算：\n');
const results = [];

Object.entries(TEST_CHARACTERS).forEach(([charId, charData]) => {
  const distance = weightedEuclideanDistance(mockUserScores, charData.scores);
  const similarity = 1 / (1 + distance);

  console.log(`${charData.name}:`);
  console.log(`  加权欧式距离: ${distance.toFixed(4)}`);
  console.log(`  相似度: ${(similarity * 100).toFixed(2)}%`);

  // 显示主要维度差异
  const diffs = [];
  Object.keys(mockUserScores).forEach(dim => {
    const diff = Math.abs(mockUserScores[dim] - charData.scores[dim]);
    if (diff > 0.3) {
      diffs.push(`${dim}(Δ${diff.toFixed(2)})`);
    }
  });
  if (diffs.length > 0) {
    console.log(`  主要差异: ${diffs.join(', ')}`);
  }
  console.log('');

  results.push({ character: charId, name: charData.name, distance, similarity });
});

// 排序并显示最终结果
results.sort((a, b) => a.distance - b.distance);

console.log('🏆 匹配结果（按相似度排序）：\n');
results.forEach((r, index) => {
  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
  console.log(`${medal} ${index + 1}. ${r.name} - 相似度 ${(r.similarity * 100).toFixed(2)}%`);
});

console.log('\n✅ 算法测试完成！');
console.log('💡 提示：实际应用中需要基于用户的28题答案计算真实的8维度分数');
