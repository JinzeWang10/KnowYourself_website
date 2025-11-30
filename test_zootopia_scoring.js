// 模拟计算逻辑
const dimensions = ['pace', 'orderliness', 'sincerity', 'extraversion'];

// Q1-Q16的第一个选项的scores
const q1_16_firstOptions = [
  { pace: 0.18, orderliness: 0.20, sincerity: 0.15, extraversion: 0.20 }, // Q1
  { orderliness: 0.20, pace: 0.15 }, // Q2
  { orderliness: 0.18, pace: 0.12 }, // Q3
  { sincerity: 0.12, extraversion: 0.12 }, // Q4
  { pace: 0.18, extraversion: 0.10 }, // Q5
  { orderliness: 0.18, sincerity: 0.15, pace: 0.12 }, // Q6
  { sincerity: 0.15 }, // Q7
  { orderliness: 0.15, pace: 0.15 }, // Q8
  { sincerity: 0.12, pace: 0.12 }, // Q9
  { orderliness: 0.18, pace: 0.15 }, // Q10
  { pace: 0.20, sincerity: 0.12 }, // Q11
  { orderliness: 0.18, pace: 0.15 }, // Q12
  { sincerity: 0.12 }, // Q13
  { sincerity: 0.15 }, // Q14
  { pace: 0.15 }, // Q15
  { sincerity: 0.15, extraversion: 0.08 } // Q16
];

// 计算raw scores
const rawScores = {
  pace: 0,
  orderliness: 0,
  sincerity: 0,
  extraversion: 0
};

q1_16_firstOptions.forEach(option => {
  Object.entries(option).forEach(([dim, score]) => {
    rawScores[dim] = (rawScores[dim] || 0) + score;
  });
});

console.log('Raw Scores (Q1-Q16):');
console.log(rawScores);

// 计算最大可能得分
const maxPossibleScores = {
  pace: 0,
  orderliness: 0,
  sincerity: 0,
  extraversion: 0
};

// 每题每个维度的最大正分
const questionsMaxScores = [
  { pace: 0.18, orderliness: 0.20, sincerity: 0.15, extraversion: 0.20 },
  { orderliness: 0.20, pace: 0.15, extraversion: 0.15, sincerity: 0.10 },
  { orderliness: 0.18, pace: 0.12, extraversion: 0.15 },
  { sincerity: 0.15, extraversion: 0.15, pace: 0.15 },
  { pace: 0.18, extraversion: 0.12, sincerity: 0.10 },
  { orderliness: 0.18, sincerity: 0.15, pace: 0.12, extraversion: 0.10 },
  { pace: 0.15, extraversion: 0.15 },
  { orderliness: 0.15, pace: 0.15, extraversion: 0.15 },
  { sincerity: 0.12, pace: 0.12, extraversion: 0.12, orderliness: 0.08 },
  { orderliness: 0.18, pace: 0.15, extraversion: 0.12, sincerity: 0.12 },
  { pace: 0.20, sincerity: 0.12, orderliness: 0.08 },
  { orderliness: 0.18, pace: 0.15, extraversion: 0.15, sincerity: 0.10 },
  { sincerity: 0.12, orderliness: 0.10 },
  { sincerity: 0.15, extraversion: 0.10 },
  { pace: 0.15, extraversion: 0.15, sincerity: 0.10 },
  { sincerity: 0.15, extraversion: 0.15, pace: 0.05 }
];

questionsMaxScores.forEach(q => {
  Object.entries(q).forEach(([dim, score]) => {
    maxPossibleScores[dim] = (maxPossibleScores[dim] || 0) + score;
  });
});

console.log('\nMax Possible Scores (Q1-Q16):');
console.log(maxPossibleScores);

// 计算相对得分（归一化到0-1）
const relativeScores = {};
dimensions.forEach(dim => {
  relativeScores[dim] = maxPossibleScores[dim] > 0
    ? Math.max(0, Math.min(1, rawScores[dim] / maxPossibleScores[dim]))
    : 0;
});

console.log('\nRelative Scores (normalized):');
console.log(relativeScores);

// 锚点量表校准（Q17-Q20都选5 = 完全同意）
const anchorScores = {
  pace: (5 - 1) / 4, // 1.0
  orderliness: (5 - 1) / 4, // 1.0
  sincerity: (5 - 1) / 4, // 1.0
  extraversion: (5 - 1) / 4 // 1.0
};

console.log('\nAnchor Scores (Q17-Q20, all 5):');
console.log(anchorScores);

// 混合校准（alpha=0.65, beta=0.35）
const alpha = 0.65;
const beta = 0.35;

const calibratedScores = {};
dimensions.forEach(dim => {
  calibratedScores[dim] = alpha * relativeScores[dim] + beta * anchorScores[dim];
});

console.log('\nCalibrated Scores (alpha=0.65, beta=0.35):');
console.log(calibratedScores);

console.log('\nFinal Percentages (0-100):');
dimensions.forEach(dim => {
  console.log(`${dim}: ${Math.round(calibratedScores[dim] * 100)}%`);
});
