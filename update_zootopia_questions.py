# 用于更新zootopia.ts中的题目
# 从scales_desc/zootopia.md读取最新题目

import re
import json

# 读取MD文件
with open('scales_desc/zootopia.md', 'r', encoding='utf-8') as f:
    md_content = f.read()

# 提取Q1-Q20的题目和选项
questions_data = []

# 匹配题目和选项
question_pattern = r'#### (Q\d+)：(.+?)\n((?:.|\n)+?)(?=\n#### Q\d+|### 第二部分)'
matches = re.findall(question_pattern, md_content)

for match in matches[:20]:  # 只处理Q1-Q20
    q_id, q_text, options_text = match

    # 提取选项
    option_pattern = r'- ([A-E])\. (.+?)\n  `(\{.+?\})`'
    options = re.findall(option_pattern, options_text)

    question_data = {
        'id': q_id,
        'question': q_text.strip(),
        'options': []
    }

    for opt_label, opt_text, opt_scores in options:
        # 解析scores
        scores = eval(opt_scores)
        question_data['options'].append({
            'label': opt_label,
            'text': opt_text.strip(),
            'scores': scores
        })

    questions_data.append(question_data)

# 输出为JSON格式查看
print(json.dumps(questions_data, ensure_ascii=False, indent=2))
