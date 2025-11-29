import re
import sys
import io

# 设置UTF-8编码
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# 读取文件
with open('scales_desc/zootopia.md', 'r', encoding='utf-8') as f:
    content = f.read()

# 提取所有选项的得分
pattern = r'`\{([^}]+)\}`'
matches = re.findall(pattern, content)

# 统计每个维度在每道题中的得分范围
dimensions = ['trust', 'lawfulness', 'pace', 'extraversion', 'idealism']

# 前20题的得分统计
q1_20_scores = {dim: [] for dim in dimensions}

for i, match in enumerate(matches[:100]):  # 前20题×5选项=100个
    try:
        scores = eval('{' + match + '}')
        for dim, score in scores.items():
            q1_20_scores[dim].append(score)
    except:
        continue

print('==== Q1-Q20 Score Statistics ====')
print('=' * 60)
for dim in dimensions:
    scores = [s for s in q1_20_scores[dim] if s != 0]
    if scores:
        print(f'{dim:15s} | Min: {min(scores):6.2f} | Max: {max(scores):6.2f} | Count: {len(scores)}')
    else:
        print(f'{dim:15s} | No scores')

print('\n==== Scoring Logic ====')
print('=' * 60)
print('Part 1 (Q1-Q20): Sum of selected option scores')
print('Part 2 (Q21-Q25): Each 1-5 score -> (score-3)/2 * 0.2')
print('Final: Normalized to [0, 1] range')

print('\n==== Theoretical Score Ranges (Before Normalization) ====')
print('=' * 60)
for dim in dimensions:
    scores = [s for s in q1_20_scores[dim]]
    # 找出所有负分和正分
    neg_scores = sorted([s for s in scores if s < 0])
    pos_scores = sorted([s for s in scores if s > 0], reverse=True)

    # Q1-Q20: 每题选1个选项，取前20个最极端值
    min_q1_20 = sum(neg_scores[:20]) if len(neg_scores) >= 20 else sum(neg_scores)
    max_q1_20 = sum(pos_scores[:20]) if len(pos_scores) >= 20 else sum(pos_scores)

    # 第二部分：-1.0 到 1.0
    min_q21_25 = -1.0
    max_q21_25 = 1.0

    total_min = min_q1_20 + min_q21_25
    total_max = max_q1_20 + max_q21_25

    print(f'{dim:15s} | Raw: [{total_min:6.2f}, {total_max:6.2f}]')

print('\nNote: Actual range will be smaller since each question')
print('can only select 1 option. Final scores normalized to [0,1].')
