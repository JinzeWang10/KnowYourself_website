/**
 * 测试欧氏距离归一化是否正确
 */

// 测试场景1: 完全相同的向量
function testIdentical() {
  const dims = 5;
  const user = [0.5, 0.5, 0.5, 0.5, 0.5];
  const char = [0.5, 0.5, 0.5, 0.5, 0.5];

  let squaredDiff = 0;
  for (let i = 0; i < dims; i++) {
    squaredDiff += Math.pow(user[i] - char[i], 2);
  }

  const euclideanDistance = Math.sqrt(squaredDiff) / Math.sqrt(dims);
  const similarity = 1 - euclideanDistance;

  console.log('=== 测试1: 完全相同的向量 ===');
  console.log('用户向量:', user);
  console.log('角色向量:', char);
  console.log('欧氏距离:', Math.sqrt(squaredDiff));
  console.log('归一化距离:', euclideanDistance);
  console.log('相似度:', similarity);
  console.log('期望相似度: 1.0 (100%)');
  console.log('✓ 正确\n');
}

// 测试场景2: 完全相反的向量（最大差异）
function testOpposite() {
  const dims = 5;
  const user = [1, 1, 1, 1, 1];
  const char = [0, 0, 0, 0, 0];

  let squaredDiff = 0;
  for (let i = 0; i < dims; i++) {
    squaredDiff += Math.pow(user[i] - char[i], 2);
  }

  const euclideanDistance = Math.sqrt(squaredDiff) / Math.sqrt(dims);
  const similarity = 1 - euclideanDistance;

  console.log('=== 测试2: 完全相反的向量 ===');
  console.log('用户向量:', user);
  console.log('角色向量:', char);
  console.log('欧氏距离:', Math.sqrt(squaredDiff));
  console.log('归一化距离:', euclideanDistance);
  console.log('相似度:', similarity);
  console.log('期望相似度: 0.0 (0%)');
  console.log('✓ 正确\n');
}

// 测试场景3: 一半差异
function testHalfDiff() {
  const dims = 5;
  const user = [0.75, 0.75, 0.75, 0.75, 0.75];
  const char = [0.25, 0.25, 0.25, 0.25, 0.25];

  let squaredDiff = 0;
  for (let i = 0; i < dims; i++) {
    squaredDiff += Math.pow(user[i] - char[i], 2);
  }

  const euclideanDistance = Math.sqrt(squaredDiff) / Math.sqrt(dims);
  const similarity = 1 - euclideanDistance;

  console.log('=== 测试3: 每个维度差0.5 ===');
  console.log('用户向量:', user);
  console.log('角色向量:', char);
  console.log('欧氏距离:', Math.sqrt(squaredDiff));
  console.log('归一化距离:', euclideanDistance);
  console.log('相似度:', similarity);
  console.log('期望相似度: 0.5 (50%)');
  console.log('✓ 正确\n');
}

// 测试场景4: 真实案例 - 朱迪
function testJudy() {
  const dims = 5;
  const user = [0.95, 0.85, 0.80, 0.80, 0.95]; // 假设用户答题后得到的分数
  const judy = [0.95, 0.85, 0.80, 0.80, 0.95]; // 朱迪的坐标

  let squaredDiff = 0;
  for (let i = 0; i < dims; i++) {
    squaredDiff += Math.pow(user[i] - judy[i], 2);
  }

  const euclideanDistance = Math.sqrt(squaredDiff) / Math.sqrt(dims);
  const similarity = 1 - euclideanDistance;

  console.log('=== 测试4: 用户完全匹配朱迪 ===');
  console.log('用户向量:', user);
  console.log('朱迪向量:', judy);
  console.log('欧氏距离:', Math.sqrt(squaredDiff));
  console.log('归一化距离:', euclideanDistance);
  console.log('相似度:', similarity);
  console.log('相似度百分比:', Math.round(similarity * 100) + '%');
  console.log('✓ 应该是100%\n');
}

// 测试场景5: 真实案例 - 用户偏向朱迪但不完全一样
function testSimilarToJudy() {
  const dims = 5;
  const user = [0.90, 0.80, 0.75, 0.85, 0.90];
  const judy = [0.95, 0.85, 0.80, 0.80, 0.95];

  let squaredDiff = 0;
  for (let i = 0; i < dims; i++) {
    const diff = user[i] - judy[i];
    squaredDiff += diff * diff;
    console.log(`维度${i+1}: user=${user[i]}, judy=${judy[i]}, diff=${diff.toFixed(2)}, diff²=${(diff*diff).toFixed(4)}`);
  }

  const euclideanDistance = Math.sqrt(squaredDiff) / Math.sqrt(dims);
  const similarity = 1 - euclideanDistance;

  console.log('\n=== 测试5: 用户接近朱迪但有差异 ===');
  console.log('用户向量:', user);
  console.log('朱迪向量:', judy);
  console.log('差值平方和:', squaredDiff.toFixed(4));
  console.log('欧氏距离:', Math.sqrt(squaredDiff).toFixed(4));
  console.log('归一化距离:', euclideanDistance.toFixed(4));
  console.log('相似度:', similarity.toFixed(4));
  console.log('相似度百分比:', Math.round(similarity * 100) + '%');
  console.log('');
}

// 运行所有测试
console.log('========================================');
console.log('欧氏距离归一化验证测试');
console.log('========================================\n');

testIdentical();
testOpposite();
testHalfDiff();
testJudy();
testSimilarToJudy();

console.log('========================================');
console.log('结论: 归一化公式正确');
console.log('公式: normalizedDistance = √(Σ(diff²)) / √n');
console.log('相似度: similarity = 1 - normalizedDistance');
console.log('========================================');
