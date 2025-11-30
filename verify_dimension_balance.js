const fs = require('fs');

// 读取新题目文件
const content = fs.readFileSync('d:/QUITTER/knowyourself_website/lib/scales/zootopia_questions_new.ts', 'utf8');

// 提取Q1-Q16题目（强迫选择题）
const questionMatches = content.matchAll(/{\s+id: 'zootopia_q(\d+)',[\s\S]*?required: true\s+}/g);

const dimensionCounts = {
  pace: [],
  orderliness: [],
  sincerity: [],
  extraversion: []
};

const dimensionMaxScores = {
  pace: 0,
  orderliness: 0,
  sincerity: 0,
  extraversion: 0
};

for (const match of questionMatches) {
  const qNum = parseInt(match[1]);
  if (qNum > 16) continue; // 只看Q1-Q16

  const questionBlock = match[0];

  // 提取所有scores对象
  const scoreMatches = questionBlock.matchAll(/scores: \{ (\w+): ([\d.]+) \}/g);

  let questionMaxScores = {
    pace: 0,
    orderliness: 0,
    sincerity: 0,
    extraversion: 0
  };

  for (const scoreMatch of scoreMatches) {
    const dim = scoreMatch[1];
    const score = parseFloat(scoreMatch[2]);
    questionMaxScores[dim] = Math.max(questionMaxScores[dim], score);
  }

  // 确定这道题测的是哪个维度（哪个维度有非零得分）
  for (const [dim, maxScore] of Object.entries(questionMaxScores)) {
    if (maxScore > 0) {
      dimensionCounts[dim].push(qNum);
      dimensionMaxScores[dim] += maxScore;
    }
  }
}

console.log('=== Q1-Q16 强迫选择题维度分布 ===\n');
for (const [dim, questions] of Object.entries(dimensionCounts)) {
  console.log(`${dim}:`);
  console.log(`  题目: Q${questions.join(', Q')}`);
  console.log(`  题数: ${questions.length}`);
  console.log(`  最大可能得分: ${dimensionMaxScores[dim]}`);
  console.log();
}

console.log('=== 维度平衡性检验 ===\n');
const scores = Object.values(dimensionMaxScores);
const allEqual = scores.every(s => Math.abs(s - scores[0]) < 0.01);

if (allEqual) {
  console.log('✅ 所有维度最大可能得分相等:', scores[0]);
} else {
  console.log('⚠️  维度最大可能得分不平衡:');
  console.log(dimensionMaxScores);
}
