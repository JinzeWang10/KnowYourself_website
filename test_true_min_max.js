const fs = require('fs');

// 读取题目文件
const content = fs.readFileSync('d:/QUITTER/knowyourself_website/lib/scales/zootopia_questions_new.ts', 'utf8');

// 提取所有题目
const questionMatches = content.matchAll(/{\s+id: 'zootopia_q(\d+)',[\s\S]*?required: true\s+}/g);

console.log('=== 每道题的得分范围分析 ===\n');

const trueMinAnswers = {}; // 获得真正最低分的答案
const trueMaxAnswers = {}; // 获得真正最高分的答案

for (const match of questionMatches) {
  const qNum = parseInt(match[1]);
  if (qNum > 16) continue;

  const questionBlock = match[0];
  const qId = `zootopia_q${qNum}`;

  // 提取所有选项
  const allOptions = [];
  const optionMatches = questionBlock.matchAll(/\{ value: (\d+), label: '(.*?)', scores: \{ (\w+): ([\d.]+) \} \}/g);

  for (const optMatch of optionMatches) {
    allOptions.push({
      value: parseInt(optMatch[1]),
      label: optMatch[2],
      dim: optMatch[3],
      score: parseFloat(optMatch[4])
    });
  }

  const minOption = allOptions.reduce((min, opt) => opt.score < min.score ? opt : min);
  const maxOption = allOptions.reduce((max, opt) => opt.score > max.score ? opt : max);

  console.log(`Q${qNum} (${minOption.dim}):`);
  console.log(`  最低分: value=${minOption.value}, score=${minOption.score}`);
  console.log(`  最高分: value=${maxOption.value}, score=${maxOption.score}`);
  console.log();

  trueMinAnswers[qId] = minOption.value;
  trueMaxAnswers[qId] = maxOption.value;
}

// 计算真正的最低分组合
console.log('\n=== 计算真正的最低分（每题选最低分选项）===\n');

const minRawScores = {
  pace: 0,
  orderliness: 0,
  sincerity: 0,
  extraversion: 0
};

for (const match of questionMatches) {
  const qNum = parseInt(match[1]);
  if (qNum > 16) continue;

  const questionBlock = match[0];
  const qId = `zootopia_q${qNum}`;
  const selectedValue = trueMinAnswers[qId];

  // 提取选中选项的得分
  const optionMatches = questionBlock.matchAll(/\{ value: (\d+), label: '.*?', scores: \{ (\w+): ([\d.]+) \} \}/g);

  for (const optMatch of optionMatches) {
    const value = parseInt(optMatch[1]);
    if (value === selectedValue) {
      const dim = optMatch[2];
      const score = parseFloat(optMatch[3]);
      minRawScores[dim] += score;
    }
  }
}

console.log('最低原始得分:', minRawScores);
console.log('各维度归一化后 (除以3.6):', {
  pace: minRawScores.pace / 3.6,
  orderliness: minRawScores.orderliness / 3.6,
  sincerity: minRawScores.sincerity / 3.6,
  extraversion: minRawScores.extraversion / 3.6
});

// 混合校准 (锚点题全选1，即0)
const alpha = 0.65;
console.log('\n混合校准后 (alpha=0.65, beta=0.35, 锚点全为0):');
for (const dim of ['pace', 'orderliness', 'sincerity', 'extraversion']) {
  const calibrated = alpha * (minRawScores[dim] / 3.6);
  console.log(`${dim}: ${Math.round(calibrated * 100)}%`);
}
