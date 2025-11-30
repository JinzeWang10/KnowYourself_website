const fs = require('fs');

// 读取原文件
const original = fs.readFileSync('d:/QUITTER/knowyourself_website/lib/scales/zootopia.ts', 'utf8');

// 读取新题目
const newQuestions = fs.readFileSync('d:/QUITTER/knowyourself_website/lib/scales/zootopia_questions_new.ts', 'utf8');

// 提取新题目数组内容
const newQuestionsMatch = newQuestions.match(/const questions_new = \[([\s\S]*)\];/);
if (!newQuestionsMatch) {
  console.log('ERROR: 无法提取新题目');
  process.exit(1);
}

// 找到原文件中questions数组的范围
const startIdx = original.indexOf('const questions: QuizTemplate');
const arrayStart = original.indexOf('[', startIdx);
const arrayEnd = original.indexOf('];', arrayStart);

if (startIdx === -1 || arrayEnd === -1) {
  console.log('ERROR: 无法找到questions数组');
  process.exit(1);
}

// 构建新文件
const before = original.substring(0, arrayStart + 1);
const after = original.substring(arrayEnd);
const newFile = before + newQuestionsMatch[1] + after;

// 写回文件
fs.writeFileSync('d:/QUITTER/knowyourself_website/lib/scales/zootopia.ts', newFile, 'utf8');
console.log('✅ 成功替换questions数组！');
console.log('新文件长度:', newFile.length, '原文件长度:', original.length);
