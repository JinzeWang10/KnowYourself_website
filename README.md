# 心理量表测评平台

专业的心理量表测评平台，提供多种心理健康评估工具，帮助用户更好地了解自己。

## 功能特点

- 🧠 **专业量表**: 基于国际标准化心理量表，具有良好的信效度
- 🔒 **隐私保护**: 所有数据仅保存在本地，不上传服务器
- 📊 **详细报告**: 提供多维度评估结果和专业建议
- 📱 **响应式设计**: 支持桌面和移动设备访问
- 💾 **进度保存**: 测评进度自动保存，可随时继续
- 📈 **历史记录**: 查看所有测评历史和对比分析

## 已包含量表

### SCL-90 症状自评量表
- **题目数量**: 90题
- **评估时间**: 约15分钟
- **评估维度**: 9个维度
  - 躯体化
  - 强迫症状
  - 人际关系敏感
  - 抑郁
  - 焦虑
  - 敌对
  - 恐怖
  - 偏执
  - 精神病性

## 技术栈

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图表**: Recharts
- **数据库**: PostgreSQL + Prisma ORM
- **本地存储**: LocalStorage（用户历史记录）

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3001 查看网站

### 构建生产版本

```bash
npm run build
npm start
```

### 数据库部署（生产环境）

如果需要在服务器上部署数据库存储测评统计数据：

- **快速部署**: 查看 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)（5分钟快速配置）
- **详细说明**: 查看 [DATABASE_DEPLOYMENT.md](./DATABASE_DEPLOYMENT.md)（完整部署文档）

```bash
# 初始化数据库
npm run db:push

# 查看数据库数据（可选）
npm run db:studio
```

## 项目结构

```
scales/
├── app/                      # Next.js 页面路由
│   ├── page.tsx             # 首页
│   ├── history/             # 历史记录页面
│   ├── layout.tsx           # 根布局
│   ├── globals.css          # 全局样式
│   └── scales/              # 量表页面
│       └── [scaleId]/       # 动态量表路由
│           ├── page.tsx     # 量表介绍页
│           ├── consent/     # 知情同意书
│           ├── userinfo/    # 用户信息填写
│           ├── quiz/        # 测评页面
│           └── result/      # 结果页面
├── components/              # React 组件
│   ├── Header.tsx          # 头部导航
│   ├── InformedConsent.tsx # 知情同意组件
│   ├── UserInfoForm.tsx    # 用户信息表单
│   └── DimensionRadarChart.tsx # 维度雷达图
├── lib/                     # 工具函数和数据
│   └── scales/             # 量表定义
│       ├── index.ts        # 量表工具函数
│       └── scl90.ts        # SCL-90量表定义
├── types/                   # TypeScript 类型定义
│   └── quiz.ts             # 量表相关类型
└── public/                  # 静态资源

```

## 如何添加新量表

1. 在 `lib/scales/` 目录下创建新量表文件，例如 `new-scale.ts`

2. 定义量表结构：

```typescript
import { QuizTemplate } from '@/types/quiz';

export const newScale: QuizTemplate = {
  id: 'new-scale',
  title: '量表标题',
  titleEn: 'Scale Title',
  description: '量表描述',
  category: '分类',
  purpose: '评估目的',
  duration: 10,
  questionCount: 20,
  questions: [
    // 定义问题
  ],
  dimensions: [
    // 定义维度（可选）
  ],
  scoring: {
    // 定义评分规则
  },
  references: [
    // 参考文献（可选）
  ]
};
```

3. 在 `lib/scales/index.ts` 中导入并添加到量表列表：

```typescript
import { newScale } from './new-scale';

const scales: QuizTemplate[] = [
  scl90,
  newScale, // 添加新量表
];
```

## 数据存储

### 用户本地数据（LocalStorage）

以下数据仅保存在用户浏览器本地：

- `userInfo`: 用户基本信息（性别、年龄）
- `quiz-progress-{scaleId}`: 测评进度
- `quiz-history`: 所有测评结果历史

用户可以随时清除浏览器缓存来删除这些数据。

### 后台统计数据（可选，PostgreSQL）

为了提供百分位排名和统计分析功能，系统会收集**匿名化的测评统计数据**到服务器数据库：

**收集的数据：**
- ✅ 量表ID、性别、年龄
- ✅ 总分、归一化分数、等级
- ✅ 维度分数、完成时间

**不收集的数据：**
- ❌ 具体答题内容
- ❌ 个人身份信息（姓名、邮箱、电话等）
- ❌ IP 地址或设备标识

详见 [BACKEND_ANALYTICS.md](./BACKEND_ANALYTICS.md)

## 隐私说明

- ✅ 用户历史记录仅保存在本地设备
- ✅ 后台仅收集匿名统计数据（无法追溯个人）
- ✅ 不记录具体答题内容
- ✅ 完全透明的数据使用政策

## 免责声明

本平台提供的心理量表测评结果仅供自我了解和反思使用，不能替代专业的心理健康诊断或治疗。如果您在心理健康方面有困扰或疑问，请咨询合格的心理健康专业人士。

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎提交 Issue。
