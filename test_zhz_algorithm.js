/**
 * 测试甄嬛传6维度30题评测算法
 * 验证余弦相似度计算和角色匹配逻辑
 */

// 模拟用户答案（选择所有选项A，即value=1）
const mockAnswers = {};
for (let i = 1; i <= 24; i++) {
  mockAnswers[`zhz_q${i}`] = 1;
}
// 添加6个锚点题（模拟中等水平，value=3）
mockAnswers['zhz_anchor_sensitivity'] = 3;
mockAnswers['zhz_anchor_rationality'] = 4;
mockAnswers['zhz_anchor_sociability'] = 3;
mockAnswers['zhz_anchor_idealism'] = 3;
mockAnswers['zhz_anchor_ambition'] = 4;
mockAnswers['zhz_anchor_authenticity'] = 3;

console.log('🧪 测试甄嬛传人格测评算法（6维度模型）\n');
console.log('📝 模拟答案：24道选择题全选A + 6道锚点题（中等水平）');
console.log('📊 预期结果：应匹配高理性、低敏感的角色（如皇后、甄嬛后期）\n');

// 简化的角色数据（仅包含3个代表性角色）- 使用新6维度
const TEST_CHARACTERS = {
  'queen': {
    name: '皇后',
    scores: {
      sensitivity: 0.23,    // 低敏感
      rationality: 1.00,    // 极高理性
      sociability: 0.15,    // 低社交
      idealism: 0.20,       // 低理想
      ambition: 0.95,       // 高野心
      authenticity: 0.10,   // 低真实
    }
  },
  'zhenhuan_late': {
    name: '甄嬛（后期）',
    scores: {
      sensitivity: 0.34,    // 偏低敏感
      rationality: 0.95,    // 高理性
      sociability: 0.25,    // 低社交
      idealism: 0.25,       // 低理想
      ambition: 0.90,       // 高野心
      authenticity: 0.20,   // 低真实
    }
  },
  'wentaiyi': {
    name: '温太医',
    scores: {
      sensitivity: 0.74,    // 高敏感
      rationality: 0.15,    // 低理性
      sociability: 0.35,    // 低社交
      idealism: 0.90,       // 高理想
      ambition: 0.10,       // 低野心
      authenticity: 0.85,   // 高真实
    }
  }
};

// 余弦相似度函数
function cosineSimilarity(vec1, vec2) {
  const keys = Object.keys(vec1);

  // 计算点积
  let dotProduct = 0;
  keys.forEach(key => {
    dotProduct += vec1[key] * vec2[key];
  });

  // 计算模长
  let norm1 = 0;
  let norm2 = 0;
  keys.forEach(key => {
    norm1 += vec1[key] ** 2;
    norm2 += vec2[key] ** 2;
  });
  norm1 = Math.sqrt(norm1);
  norm2 = Math.sqrt(norm2);

  if (norm1 === 0 || norm2 === 0) {
    return 0;
  }

  return dotProduct / (norm1 * norm2);
}

// 模拟用户分数（假设所有A选项的校准后分数）
const mockUserScores = {
  sensitivity: 0.35,    // 偏低敏感
  rationality: 0.65,    // 中高理性
  sociability: 0.45,    // 中等社交
  idealism: 0.55,       // 中等理想
  ambition: 0.60,       // 中等野心
  authenticity: 0.50,   // 中等真实
};

console.log('👤 模拟用户6维度分数：');
Object.entries(mockUserScores).forEach(([dim, score]) => {
  console.log(`  ${dim}: ${score.toFixed(2)}`);
});
console.log('');

// 计算与每个角色的余弦相似度
console.log('📐 余弦相似度计算：\n');
const results = [];

Object.entries(TEST_CHARACTERS).forEach(([charId, charData]) => {
  const similarity = cosineSimilarity(mockUserScores, charData.scores);

  console.log(`${charData.name}:`);
  console.log(`  余弦相似度: ${similarity.toFixed(4)}`);
  console.log(`  相似度百分比: ${(similarity * 100).toFixed(2)}%`);

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

  results.push({ character: charId, name: charData.name, similarity });
});

// 排序并显示最终结果（相似度从高到低）
results.sort((a, b) => b.similarity - a.similarity);

console.log('🏆 匹配结果（按相似度排序）：\n');
results.forEach((r, index) => {
  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
  console.log(`${medal} ${index + 1}. ${r.name} - 余弦相似度 ${(r.similarity * 100).toFixed(2)}%`);
});

console.log('\n✅ 算法测试完成！');
console.log('💡 提示：实际应用中需要基于用户的30题答案（24道选择题 + 6道锚点题）计算真实的6维度分数');
