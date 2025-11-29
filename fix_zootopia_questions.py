"""
脚本用于修复Zootopia量表的题目编号和优化选项
- 删除Q5、Q11、Q14、Q17
- 将剩余16道情景题重新编号为Q1-Q16
- 将锚点题编号为Q17-Q20
- 优化部分题目选项，移除同质化的"不管/无视"选项
"""

import re

# 读取文件
with open('lib/scales/zootopia.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 定义题目ID映射（旧ID -> 新ID）
id_mapping = {
    'zootopia_q1': 'zootopia_q1',   # 朱迪劝说乱扔垃圾
    'zootopia_q2': 'zootopia_q2',   # 尼克搭档执勤
    'zootopia_q3': 'zootopia_q3',   # 马市长交给活动
    'zootopia_q4': 'zootopia_q4',   # 闪电被嘲笑
    # Q5已删除（图书馆）
    'zootopia_q6': 'zootopia_q5',   # 豹子警官找宠物（已优化）
    'zootopia_q7': 'zootopia_q6',   # 尼克违规（已优化）
    'zootopia_q8': 'zootopia_q7',   # 闪电睡着
    'zootopia_q9': 'zootopia_q8',   # 朱迪尼克争论
    'zootopia_q10': 'zootopia_q9',  # 室友深夜弹琴
    # Q11已删除（违规停车）
    'zootopia_q12': 'zootopia_q10', # AI作弊（已优化）
    'zootopia_q13': 'zootopia_q11', # 豹子警官危险错误
    # 第二个Q13已删除并替换
    # Q14已删除（小动物迷路）
    'zootopia_q15': 'zootopia_q12', # 报告错误（已优化但重复ID，需改为新题）
    'zootopia_q16': 'zootopia_q13', # 闪电借钱
    # Q17已删除（志愿活动）
    'zootopia_q18': 'zootopia_q14', # 尼克聚会
    'zootopia_q19': 'zootopia_q15', # 公交插队
    'zootopia_q20': 'zootopia_q16', # 大先生情绪不佳

    # 锚点题
    'zootopia_q21': 'zootopia_q17',
    'zootopia_q22': 'zootopia_q18',
    'zootopia_q23': 'zootopia_q19',
    'zootopia_q24': 'zootopia_q20',
}

# 替换ID
for old_id, new_id in id_mapping.items():
    content = content.replace(f"id: '{old_id}'", f"id: '{new_id}'")

# 更新注释
content = content.replace('// Q1-Q20: 强迫选择题', '// Q1-Q16: 强迫选择题（情景题）')
content = content.replace('  // Q21-Q24: 锚点量表题（李克特量表）', '  // Q17-Q20: 锚点量表题（李克特量表）')

# 更新计分算法中的切片范围
content = content.replace('questions.slice(0, 20)', 'questions.slice(0, 16)')
content = content.replace('questions.slice(20, 24)', 'questions.slice(16, 20)')

# 更新questionCount
content = re.sub(r'questionCount: 24', 'questionCount: 20', content)

# 更新purpose描述
content = content.replace(
    '通过24道题目（20道情景选择题 + 4道人格锚点题）',
    '通过20道题目（16道情景选择题 + 4道人格锚点题）'
)

# 保存文件
with open('lib/scales/zootopia.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Zootopia量表题目已优化完成！")
print("📊 题目数量: 24 -> 20")
print("📝 情景题: Q1-Q16")
print("📏 锚点题: Q17-Q20")
