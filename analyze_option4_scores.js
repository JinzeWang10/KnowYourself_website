const fs = require('fs');

// 读取题目文件
const content = fs.readFileSync('d:/QUITTER/knowyourself_website/lib/scales/zootopia_questions_new.ts', 'utf8');

// 提取所有题目
const questionMatches = content.matchAll(/{\s+id: 'zootopia_q(\d+)',[\s\S]*?required: true\s+}/g);

console.log('=== 分析每道题最后一个选项（value=4）的得分 ===\n');

const option4Scores = {
  pace: [],
  orderliness: [],
  sincerity: [],
  extraversion: []
};

for (const match of questionMatches) {
  const qNum = parseInt(match[1]);
  if (qNum > 16) continue; // 只看Q1-Q16

  const questionBlock = match[0];

  // 提取题目文字
  const questionText = questionBlock.match(/question: '(.*?)'/)[1];

  // 提取value=4的选项
  const option4Match = questionBlock.match(/\{ value: 4, label: '(.*?)', scores: \{ (\w+): ([\d.]+) \} \}/);

  if (option4Match) {
    const label = option4Match[1];
    const dim = option4Match[2];
    const score = parseFloat(option4Match[3]);

    console.log(`Q${qNum}: ${questionText}`);
    console.log(`  选项4: ${label}`);
    console.log(`  得分: ${dim} = ${score}`);
    console.log();

    option4Scores[dim].push({ q: qNum, score });
  }
}

console.log('=== 各维度选项4得分统计 ===\n');
for (const [dim, scores] of Object.entries(option4Scores)) {
  if (scores.length > 0) {
    const total = scores.reduce((sum, item) => sum + item.score, 0);
    const min = Math.min(...scores.map(item => item.score));
    const max = Math.max(...scores.map(item => item.score));
    console.log(`${dim}:`);
    console.log(`  题数: ${scores.length}`);
    console.log(`  总分: ${total}`);
    console.log(`  分数范围: ${min} - ${max}`);
    console.log(`  题目: ${scores.map(s => `Q${s.q}(${s.score})`).join(', ')}`);
    console.log();
  }
}

// 分析所有选项的最小得分
console.log('=== 分析如何获得最低分 ===\n');

for (const match of questionMatches) {
  const qNum = parseInt(match[1]);
  if (qNum > 16) continue;

  const questionBlock = match[0];

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

  // 找出最低分选项
  const minOption = allOptions.reduce((min, opt) => opt.score < min.score ? opt : min);

  console.log(`Q${qNum}: 最低分选项是 value=${minOption.value}, ${minOption.dim}=${minOption.score}`);
}
