"""
分析Zootopia量表中8个角色之间的相似度
使用余弦相似度和欧氏距离的混合方法
"""
import math
from typing import Dict, List, Tuple

# 8个角色的五维度坐标（0-1范围）
CHARACTER_PROFILES = {
    'judy_hopps': {
        'name': '朱迪 Judy Hopps',
        'scores': {
            'trust': 0.80,
            'lawfulness': 0.85,
            'pace': 0.90,
            'extraversion': 0.85,
            'idealism': 0.90,
        }
    },
    'nick_wilde': {
        'name': '尼克 Nick Wilde',
        'scores': {
            'trust': 0.40,
            'lawfulness': 0.50,
            'pace': 0.75,
            'extraversion': 0.60,
            'idealism': 0.50,
        }
    },
    'mayor_lionheart': {
        'name': '马市长 Mayor Lionheart',
        'scores': {
            'trust': 0.55,
            'lawfulness': 0.90,
            'pace': 0.50,
            'extraversion': 0.55,
            'idealism': 0.45,
        }
    },
    'clawhauser': {
        'name': '豹子警官 Clawhauser',
        'scores': {
            'trust': 0.45,
            'lawfulness': 0.80,
            'pace': 0.60,
            'extraversion': 0.40,
            'idealism': 0.40,
        }
    },
    'flash': {
        'name': '闪电 Flash',
        'scores': {
            'trust': 0.90,
            'lawfulness': 0.30,
            'pace': 0.20,
            'extraversion': 0.95,
            'idealism': 0.85,
        }
    },
    'mr_big': {
        'name': '大先生 Mr. Big',
        'scores': {
            'trust': 0.15,
            'lawfulness': 0.25,
            'pace': 0.50,
            'extraversion': 0.25,
            'idealism': 0.10,
        }
    },
    'gary': {
        'name': '蛇盖瑞 Gary',
        'scores': {
            'trust': 0.70,
            'lawfulness': 0.55,
            'pace': 0.65,
            'extraversion': 0.75,
            'idealism': 0.70,
        }
    },
    'sheep': {
        'name': '夏奇羊 Sheep',
        'scores': {
            'trust': 0.35,
            'lawfulness': 0.40,
            'pace': 0.65,
            'extraversion': 0.35,
            'idealism': 0.55,
        }
    },
}

DIMENSIONS = ['trust', 'lawfulness', 'pace', 'extraversion', 'idealism']

def calculate_similarity(char1_scores: Dict[str, float], char2_scores: Dict[str, float]) -> Dict[str, float]:
    """
    计算两个角色之间的相似度
    使用余弦相似度和欧氏距离的混合方法（与量表算法一致）
    """
    # 计算余弦相似度
    dot_product = 0
    char1_magnitude = 0
    char2_magnitude = 0

    for dim in DIMENSIONS:
        score1 = char1_scores[dim]
        score2 = char2_scores[dim]
        dot_product += score1 * score2
        char1_magnitude += score1 * score1
        char2_magnitude += score2 * score2

    cosine_similarity = dot_product / (math.sqrt(char1_magnitude) * math.sqrt(char2_magnitude))

    # 计算欧氏距离
    squared_difference = 0
    for dim in DIMENSIONS:
        diff = char1_scores[dim] - char2_scores[dim]
        squared_difference += diff * diff

    euclidean_distance = math.sqrt(squared_difference) / math.sqrt(len(DIMENSIONS))

    # 混合相似度（余弦0.7 + 欧氏0.3）
    hybrid_similarity = 0.7 * cosine_similarity + 0.3 * (1 - euclidean_distance)

    return {
        'hybrid': hybrid_similarity,
        'cosine': cosine_similarity,
        'euclidean': 1 - euclidean_distance,
    }

def analyze_all_similarities():
    """分析所有角色之间的相似度"""
    characters = list(CHARACTER_PROFILES.keys())

    print("=" * 80)
    print("Zootopia 角色相似度矩阵分析")
    print("=" * 80)
    print("\n使用混合相似度算法（余弦相似度70% + 欧氏距离30%）\n")

    # 创建相似度矩阵
    similarity_matrix = []

    for i, char1_id in enumerate(characters):
        char1 = CHARACTER_PROFILES[char1_id]
        row = []

        for j, char2_id in enumerate(characters):
            char2 = CHARACTER_PROFILES[char2_id]

            if i == j:
                # 自己与自己的相似度为100%
                row.append(100.0)
            else:
                similarity = calculate_similarity(char1['scores'], char2['scores'])
                row.append(similarity['hybrid'] * 100)

        similarity_matrix.append(row)

    # 打印相似度矩阵
    print("相似度矩阵（单位：%）")
    print("-" * 80)

    # 打印表头
    print(f"{'角色':<20}", end="")
    for char_id in characters:
        char_name = CHARACTER_PROFILES[char_id]['name'].split()[0]
        print(f"{char_name:>10}", end="")
    print()
    print("-" * 80)

    # 打印每一行
    for i, char1_id in enumerate(characters):
        char1_name = CHARACTER_PROFILES[char1_id]['name'].split()[0]
        print(f"{char1_name:<20}", end="")

        for j in range(len(characters)):
            similarity = similarity_matrix[i][j]
            print(f"{similarity:>10.1f}", end="")
        print()

    print("\n" + "=" * 80)
    print("各角色最相似和最不相似的对比")
    print("=" * 80)

    for i, char1_id in enumerate(characters):
        char1 = CHARACTER_PROFILES[char1_id]

        # 找出最相似和最不相似的角色（排除自己）
        similarities = []
        for j, char2_id in enumerate(characters):
            if i != j:
                char2 = CHARACTER_PROFILES[char2_id]
                similarities.append({
                    'id': char2_id,
                    'name': char2['name'],
                    'similarity': similarity_matrix[i][j]
                })

        similarities.sort(key=lambda x: x['similarity'], reverse=True)
        most_similar = similarities[0]
        least_similar = similarities[-1]

        print(f"\n【{char1['name']}】")
        print(f"  最相似: {most_similar['name']} ({most_similar['similarity']:.1f}%)")
        print(f"  最不相似: {least_similar['name']} ({least_similar['similarity']:.1f}%)")

    # 找出整体最相似和最不相似的角色对
    print("\n" + "=" * 80)
    print("角色对相似度排名")
    print("=" * 80)

    pairs = []
    for i, char1_id in enumerate(characters):
        for j, char2_id in enumerate(characters):
            if i < j:  # 只统计一次（避免重复）
                char1 = CHARACTER_PROFILES[char1_id]
                char2 = CHARACTER_PROFILES[char2_id]
                pairs.append({
                    'char1': char1['name'],
                    'char2': char2['name'],
                    'similarity': similarity_matrix[i][j]
                })

    pairs.sort(key=lambda x: x['similarity'], reverse=True)

    print("\n最相似的5对角色：")
    for i, pair in enumerate(pairs[:5], 1):
        print(f"{i}. {pair['char1']} <-> {pair['char2']}: {pair['similarity']:.1f}%")

    print("\n最不相似的5对角色：")
    for i, pair in enumerate(pairs[-5:][::-1], 1):
        print(f"{i}. {pair['char1']} <-> {pair['char2']}: {pair['similarity']:.1f}%")

if __name__ == '__main__':
    analyze_all_similarities()
