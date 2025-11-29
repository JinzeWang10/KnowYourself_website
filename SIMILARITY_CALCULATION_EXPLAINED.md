# Zootopia 角色相似度计算方法详解

## 概述

Zootopia量表使用**混合相似度算法**来计算用户与8个角色之间的相似程度，该算法结合了：
- **余弦相似度** (Cosine Similarity) - 70%权重
- **欧氏距离** (Euclidean Distance) - 30%权重

## 为什么使用混合算法？

### 1. 余弦相似度的优势与局限
**优势**：
- 衡量向量方向的相似性
- 不受向量长度（magnitude）影响
- 适合比较整体趋势和模式

**局限**：
- 忽略了绝对差值的大小
- 例如：[0.8, 0.8, 0.8, 0.8, 0.8] 和 [0.4, 0.4, 0.4, 0.4, 0.4] 的余弦相似度是1.0，但实际上差异很大

### 2. 欧氏距离的优势与局限
**优势**：
- 衡量实际的点对点距离
- 敏感于绝对差值
- 能够准确反映数值差异

**局限**：
- 容易受到极端值影响
- 不关注整体趋势

### 3. 混合方法的优势
通过 **70% 余弦 + 30% 欧氏**，我们：
- 主要关注人格特征的整体模式（余弦）
- 同时考虑具体数值的差异（欧氏）
- 达到更平衡、更准确的匹配结果

---

## 详细计算步骤

### 输入数据
每个角色由5个维度的分数组成（0-1范围）：
```
角色A = {
  trust: 0.80,         // 社会信任度
  lawfulness: 0.85,    // 律法遵从度
  pace: 0.90,          // 行动节奏
  extraversion: 0.85,  // 社交呈现方式
  idealism: 0.90       // 理想主义指数
}
```

### 步骤1: 计算余弦相似度 (Cosine Similarity)

**公式**：
```
cos(θ) = (A · B) / (||A|| × ||B||)
```

**具体计算**：

1. **点积 (Dot Product)**：
   ```
   A · B = (A₁×B₁) + (A₂×B₂) + (A₃×B₃) + (A₄×B₄) + (A₅×B₅)
   ```

2. **向量长度 (Magnitude)**：
   ```
   ||A|| = √(A₁² + A₂² + A₃² + A₄² + A₅²)
   ||B|| = √(B₁² + B₂² + B₃² + B₄² + B₅²)
   ```

3. **余弦相似度**：
   ```
   cosine_similarity = (A · B) / (||A|| × ||B||)
   ```
   - 取值范围：-1 到 1
   - 在我们的场景中（所有值为正），范围是 0 到 1
   - 1 表示完全相同，0 表示完全不相关

**代码实现**：
```typescript
let dotProduct = 0;
let magnitudeA = 0;
let magnitudeB = 0;

dimensions.forEach((dim) => {
  const scoreA = characterA.scores[dim];
  const scoreB = characterB.scores[dim];
  dotProduct += scoreA * scoreB;
  magnitudeA += scoreA * scoreA;
  magnitudeB += scoreB * scoreB;
});

const cosineSimilarity = dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
```

### 步骤2: 计算欧氏距离 (Euclidean Distance)

**公式**：
```
distance = √[(A₁-B₁)² + (A₂-B₂)² + (A₃-B₃)² + (A₄-B₄)² + (A₅-B₅)²] / √n
```

**具体计算**：

1. **计算每个维度的差值平方**：
   ```
   squared_diff = (A₁-B₁)² + (A₂-B₂)² + ... + (A₅-B₅)²
   ```

2. **归一化欧氏距离**：
   ```
   euclidean_distance = √(squared_diff) / √5
   ```
   - 除以 √n 是为了归一化，使结果在 0-1 范围内
   - 取值范围：0 到 1
   - 0 表示完全相同，1 表示最大距离

3. **转换为相似度**：
   ```
   euclidean_similarity = 1 - euclidean_distance
   ```
   - 现在 1 表示完全相同，0 表示完全不同

**代码实现**：
```typescript
let squaredDifference = 0;

dimensions.forEach((dim) => {
  const diff = characterA.scores[dim] - characterB.scores[dim];
  squaredDifference += diff * diff;
});

const euclideanDistance = Math.sqrt(squaredDifference) / Math.sqrt(dimensions.length);
const euclideanSimilarity = 1 - euclideanDistance;
```

### 步骤3: 混合相似度 (Hybrid Similarity)

**公式**：
```
hybrid_similarity = 0.7 × cosine_similarity + 0.3 × euclidean_similarity
```

**代码实现**：
```typescript
const hybridSimilarity = 0.7 * cosineSimilarity + 0.3 * (1 - euclideanDistance);
```

**最终相似度百分比**：
```typescript
const similarityPercentage = Math.round(hybridSimilarity * 100);
```

---

## 实例演算

让我们用**朱迪 (Judy Hopps)** 和 **蛇盖瑞 (Gary)** 来演示完整计算：

### 输入数据
```
朱迪 = {
  trust: 0.80,
  lawfulness: 0.85,
  pace: 0.90,
  extraversion: 0.85,
  idealism: 0.90
}

蛇盖瑞 = {
  trust: 0.70,
  lawfulness: 0.55,
  pace: 0.65,
  extraversion: 0.75,
  idealism: 0.70
}
```

### 步骤1: 余弦相似度

**点积**：
```
dot_product = (0.80×0.70) + (0.85×0.55) + (0.90×0.65) + (0.85×0.75) + (0.90×0.70)
            = 0.56 + 0.4675 + 0.585 + 0.6375 + 0.63
            = 2.88
```

**向量长度**：
```
||朱迪|| = √(0.80² + 0.85² + 0.90² + 0.85² + 0.90²)
        = √(0.64 + 0.7225 + 0.81 + 0.7225 + 0.81)
        = √3.705
        = 1.925

||蛇盖瑞|| = √(0.70² + 0.55² + 0.65² + 0.75² + 0.70²)
          = √(0.49 + 0.3025 + 0.4225 + 0.5625 + 0.49)
          = √2.2675
          = 1.506
```

**余弦相似度**：
```
cosine_similarity = 2.88 / (1.925 × 1.506)
                  = 2.88 / 2.899
                  = 0.993
```

### 步骤2: 欧氏距离

**差值平方和**：
```
squared_diff = (0.80-0.70)² + (0.85-0.55)² + (0.90-0.65)² + (0.85-0.75)² + (0.90-0.70)²
             = 0.01 + 0.09 + 0.0625 + 0.01 + 0.04
             = 0.2125
```

**归一化欧氏距离**：
```
euclidean_distance = √0.2125 / √5
                   = 0.461 / 2.236
                   = 0.206
```

**欧氏相似度**：
```
euclidean_similarity = 1 - 0.206 = 0.794
```

### 步骤3: 混合相似度

```
hybrid_similarity = 0.7 × 0.993 + 0.3 × 0.794
                  = 0.695 + 0.238
                  = 0.933
```

**最终结果**：
```
similarity_percentage = 93.3% ≈ 93.4%
```

✅ 这与我们的分析报告一致：**朱迪 ↔ 蛇盖瑞: 93.4%**

---

## 为什么选择 70:30 的权重？

这个权重比例是经过调优的：

1. **70% 余弦相似度**：
   - 人格测评更关注**整体特征模式**而非具体数值
   - 例如："高外向+高理想"的模式比具体是0.85还是0.75更重要

2. **30% 欧氏距离**：
   - 仍然保留对**具体差异**的敏感度
   - 避免将差异较大的角色判定为高度相似
   - 例如：防止0.9和0.5被认为完全相同

3. **效果验证**：
   - 最相似对 (96.1%) 和最不相似对 (55.8%) 有明显区分
   - 符合人格心理学的直觉判断
   - 用户测试反馈良好

---

## 与用户匹配的完整流程

用户做Zootopia测评时的完整计算流程：

### 阶段1: 维度得分累加
- 20道强迫选择题，每个选项对5个维度有不同贡献
- 累加所有选择的维度分数

### 阶段2: 锚点量表校准
- 5道李克特量表题（1-5分）
- 每道题对应一个维度
- 转换为0-1范围

### 阶段3: 混合校准
```typescript
calibrated_score = 0.65 × (选择题得分/最大可能得分) + 0.35 × 锚点得分
```

### 阶段4: 相似度匹配
- 使用上述混合相似度算法
- 与8个角色逐一计算相似度
- 排序并返回前3名

---

## 总结

Zootopia量表的相似度计算是一个**四阶段向量建模算法**：
1. ✅ Raw Score Accumulation (原始分数累加)
2. ✅ Anchor Calibration (锚点校准)
3. ✅ Hybrid Calibration (混合校准)
4. ✅ Hybrid Similarity Matching (混合相似度匹配)

最终相似度公式：
```
Similarity = 70% × cos(user_vector, character_vector)
           + 30% × (1 - euclidean_distance(user_vector, character_vector))
```

这种方法兼顾了**模式识别**和**数值精度**，为用户提供准确且有意义的角色匹配结果。
