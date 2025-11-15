/**
 * 测试ZHZ 12个角色之间的两两相似度
 * 验证6维度模型下角色的区分度
 */

// 12个角色的6维度数据（已手动调整以增强区分度）
const CHARACTERS = {
  'zhenhuan_early': {
    name: '甄嬛（前期）',
    scores: {
      sensitivity: 0.80,
      rationality: 0.45,
      sociability: 0.50,
      idealism: 0.90,
      ambition: 0.45,
      authenticity: 0.70,
    }
  },
  'zhenhuan_late': {
    name: '甄嬛（后期）',
    scores: {
      sensitivity: 0.35,
      rationality: 0.95,
      sociability: 0.40,
      idealism: 0.40,
      ambition: 0.88,
      authenticity: 0.35,
    }
  },
  'anlingrong': {
    name: '安陵容',
    scores: {
      sensitivity: 0.92,
      rationality: 0.60,
      sociability: 0.25,
      idealism: 0.65,
      ambition: 0.55,
      authenticity: 0.55,
    }
  },
  'queen': {
    name: '皇后',
    scores: {
      sensitivity: 0.20,
      rationality: 1.00,
      sociability: 0.15,
      idealism: 0.40,
      ambition: 0.95,
      authenticity: 0.10,
    }
  },
  'huafei': {
    name: '华妃',
    scores: {
      sensitivity: 0.45,
      rationality: 0.40,
      sociability: 0.95,
      idealism: 0.30,
      ambition: 0.78,
      authenticity: 0.95,
    }
  },
  'shenmeizhuang': {
    name: '沈眉庄',
    scores: {
      sensitivity: 0.35,
      rationality: 0.65,
      sociability: 0.30,
      idealism: 0.85,
      ambition: 0.40,
      authenticity: 0.60,
    }
  },
  'huanbi': {
    name: '浣碧',
    scores: {
      sensitivity: 0.50,
      rationality: 0.70,
      sociability: 0.40,
      idealism: 0.50,
      ambition: 0.90,
      authenticity: 0.45,
    }
  },
  'supeisheng': {
    name: '苏培盛',
    scores: {
      sensitivity: 0.65,
      rationality: 0.55,
      sociability: 0.85,
      idealism: 0.60,
      ambition: 0.30,
      authenticity: 0.35,
    }
  },
  'guojunwang': {
    name: '果郡王',
    scores: {
      sensitivity: 0.70,
      rationality: 0.30,
      sociability: 0.85,
      idealism: 0.95,
      ambition: 0.45,
      authenticity: 0.85,
    }
  },
  'wentaiyi': {
    name: '温太医',
    scores: {
      sensitivity: 0.75,
      rationality: 0.30,
      sociability: 0.35,
      idealism: 0.95,
      ambition: 0.10,
      authenticity: 0.85,
    }
  },
  'emperor': {
    name: '皇上',
    scores: {
      sensitivity: 0.30,
      rationality: 0.95,
      sociability: 0.60,
      idealism: 0.30,
      ambition: 1.00,
      authenticity: 0.20,
    }
  },
  'ningguiren': {
    name: '宁贵人',
    scores: {
      sensitivity: 0.55,
      rationality: 0.85,
      sociability: 0.35,
      idealism: 0.40,
      ambition: 0.75,
      authenticity: 0.15,
    }
  },
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

// 归一化欧氏距离函数
function normalizedEuclideanDistance(vec1, vec2) {
  const keys = Object.keys(vec1);
  const n = keys.length;

  let sumSquaredDiff = 0;
  keys.forEach(key => {
    const diff = vec1[key] - vec2[key];
    sumSquaredDiff += diff * diff;
  });

  // 归一化到 [0, 1]：除以 sqrt(n)（最大可能距离）
  return Math.sqrt(sumSquaredDiff) / Math.sqrt(n);
}

// 混合相似度函数（余弦相似度 + 欧氏距离）
function hybridSimilarity(vec1, vec2) {
  const cosineSim = cosineSimilarity(vec1, vec2);
  const euclideanDist = normalizedEuclideanDistance(vec1, vec2);

  // 混合：余弦相似度（方向）+ 欧氏距离转相似度（绝对差异）
  return 0.5 * cosineSim + 0.5 * (1 - euclideanDist);
}

console.log('🎭 ZHZ 12个角色两两相似度矩阵（6维度模型）\n');
console.log('=' .repeat(80));

const charKeys = Object.keys(CHARACTERS);
const similarities = [];

// 计算所有角色对的相似度（使用混合算法）
for (let i = 0; i < charKeys.length; i++) {
  for (let j = i + 1; j < charKeys.length; j++) {
    const char1 = CHARACTERS[charKeys[i]];
    const char2 = CHARACTERS[charKeys[j]];
    const sim = hybridSimilarity(char1.scores, char2.scores);

    similarities.push({
      char1: char1.name,
      char2: char2.name,
      similarity: sim
    });
  }
}

// 按相似度排序（从高到低）
similarities.sort((a, b) => b.similarity - a.similarity);

console.log('\n📊 最相似的角色组合（TOP 10）：\n');
similarities.slice(0, 10).forEach((item, index) => {
  console.log(`${index + 1}. ${item.char1.padEnd(15)} ↔ ${item.char2.padEnd(15)} 相似度: ${(item.similarity * 100).toFixed(2)}%`);
});

console.log('\n📊 最不相似的角色组合（TOP 10）：\n');
similarities.slice(-10).reverse().forEach((item, index) => {
  console.log(`${index + 1}. ${item.char1.padEnd(15)} ↔ ${item.char2.padEnd(15)} 相似度: ${(item.similarity * 100).toFixed(2)}%`);
});

// 计算平均相似度和标准差
const avgSim = similarities.reduce((sum, item) => sum + item.similarity, 0) / similarities.length;
const variance = similarities.reduce((sum, item) => sum + Math.pow(item.similarity - avgSim, 2), 0) / similarities.length;
const stdDev = Math.sqrt(variance);

console.log('\n' + '='.repeat(80));
console.log('\n📈 统计数据：');
console.log(`   总角色对数: ${similarities.length}`);
console.log(`   平均相似度: ${(avgSim * 100).toFixed(2)}%`);
console.log(`   标准差: ${(stdDev * 100).toFixed(2)}%`);
console.log(`   最高相似度: ${(similarities[0].similarity * 100).toFixed(2)}%`);
console.log(`   最低相似度: ${(similarities[similarities.length - 1].similarity * 100).toFixed(2)}%`);
console.log(`   相似度范围: ${((similarities[0].similarity - similarities[similarities.length - 1].similarity) * 100).toFixed(2)}%`);

console.log('\n💡 解读：');
if (avgSim < 0.70) {
  console.log('   ✅ 角色区分度良好，平均相似度较低');
} else if (avgSim < 0.80) {
  console.log('   ⚠️  角色区分度中等，部分角色较为相似');
} else {
  console.log('   ❌ 角色区分度较低，建议进一步优化维度');
}

if (stdDev > 0.15) {
  console.log('   ✅ 角色多样性高，覆盖了广泛的人格空间');
} else {
  console.log('   ⚠️  角色多样性中等');
}

console.log('\n');
