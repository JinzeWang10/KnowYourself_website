/**
 * 详细分析高度相似角色对的维度差异
 */

const SIMILAR_PAIRS = [
  {
    name1: '甄嬛（后期）',
    scores1: { sensitivity: 0.34, rationality: 0.95, sociability: 0.25, idealism: 0.25, ambition: 0.90, authenticity: 0.20 },
    name2: '皇后',
    scores2: { sensitivity: 0.23, rationality: 1.00, sociability: 0.15, idealism: 0.20, ambition: 0.95, authenticity: 0.10 }
  },
  {
    name1: '甄嬛（后期）',
    scores1: { sensitivity: 0.34, rationality: 0.95, sociability: 0.25, idealism: 0.25, ambition: 0.90, authenticity: 0.20 },
    name2: '宁贵人',
    scores2: { sensitivity: 0.41, rationality: 0.90, sociability: 0.35, idealism: 0.35, ambition: 0.80, authenticity: 0.15 }
  },
  {
    name1: '甄嬛（前期）',
    scores1: { sensitivity: 0.76, rationality: 0.30, sociability: 0.35, idealism: 0.95, ambition: 0.35, authenticity: 0.80 },
    name2: '温太医',
    scores2: { sensitivity: 0.74, rationality: 0.15, sociability: 0.35, idealism: 0.90, ambition: 0.10, authenticity: 0.85 }
  }
];

console.log('🔍 高度相似角色对的维度详细对比\n');
console.log('='.repeat(80));

SIMILAR_PAIRS.forEach((pair, index) => {
  console.log(`\n${index + 1}. ${pair.name1} vs ${pair.name2}`);
  console.log('-'.repeat(80));

  const dimensions = ['sensitivity', 'rationality', 'sociability', 'idealism', 'ambition', 'authenticity'];
  const dimNames = {
    sensitivity: '情绪敏感性',
    rationality: '思维模式',
    sociability: '社交能量',
    idealism: '价值取向',
    ambition: '野心指数',
    authenticity: '自我表达'
  };

  console.log(`${'维度'.padEnd(15)} | ${pair.name1.padEnd(8)} | ${pair.name2.padEnd(8)} | 差异  | 评价`);
  console.log('-'.repeat(80));

  let maxDiff = 0;
  let maxDiffDim = '';

  dimensions.forEach(dim => {
    const val1 = pair.scores1[dim];
    const val2 = pair.scores2[dim];
    const diff = Math.abs(val1 - val2);

    if (diff > maxDiff) {
      maxDiff = diff;
      maxDiffDim = dim;
    }

    const status = diff < 0.10 ? '❌极小' : diff < 0.20 ? '⚠️小' : diff < 0.30 ? '✅中' : '✅大';

    console.log(`${dimNames[dim].padEnd(12)} | ${val1.toFixed(2).padStart(8)} | ${val2.toFixed(2).padStart(8)} | ${diff.toFixed(2)} | ${status}`);
  });

  console.log('-'.repeat(80));
  console.log(`最大差异维度: ${dimNames[maxDiffDim]} (${maxDiff.toFixed(2)})`);

  if (maxDiff < 0.20) {
    console.log('💡 建议: 需要增强这两个角色在某些维度上的对比度');
  }
});

console.log('\n' + '='.repeat(80));
console.log('\n🎯 优化建议：\n');
console.log('1. 增加角色特征的极端化程度（拉大维度差异至少0.3）');
console.log('2. 为每个角色确定1-2个"标志性维度"（极高或极低）');
console.log('3. 考虑引入新的区分维度或调整现有维度定义');
console.log('');
