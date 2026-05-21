# 语文成长地图

面向小学1-6年级的语文学习平台，涵盖拼音、识字、阅读理解、写作训练、语法知识等核心模块。

## 功能概览

### 核心学习模块
- **年级专项** - 一年级至六年级同步课程与练习
- **拼音学习** - 声母、韵母、声调、拼读规则
- **语法知识** - 词性、句型、病句修改、关联词等
- **词语学习** - 词汇积累与运用训练
- **写作指导** - 各类作文技巧与范文赏析
- **知识地图** - 小学语文知识体系全景

### 练习系统
- **每日特训** - 9大训练模块，27套变式练习
- **AI助手** - DeepSeek大模型智能答疑
- **进度追踪** - 记录学习轨迹，智能推荐薄弱环节
- **个性化辅导** - 针对尖子生/中等生/后进生的差异化策略

### 特色功能
- 📱 渐进式Web应用（PWA），支持离线使用
- 🎨 响应式设计，适配手机、平板、电脑
- 🤖 AI作文批改与润色建议
- 🎯 分层教学，精准对标各层次学生需求
- 👨‍👩‍👧 家校协同，提供家长指导手册

## 快速开始

### 本地运行
```bash
# 直接用浏览器打开 index.html
open index.html

# 或使用本地服务器
npx serve .
```

### 部署到GitHub Pages
1. 将项目推送到GitHub仓库
2. 进入 Settings → Pages
3. Source 选择 `main` 分支和根目录
4. 访问 `https://yourusername.github.io/repo-name`

### 部署到Vercel
```bash
npx vercel --prod
```

## 项目结构

```
├── index.html          # 首页/总览
├── grade1-6.html       # 各年级专项页面
├── pinyin.html         # 拼音学习
├── grammar.html        # 语法知识
├── vocabulary.html     # 词语学习
├── composition.html    # 写作指导
├── knowledge-map.html  # 知识地图
├── practice.html       # 练习计划
├── agent.html          # AI助手
├── mobile-agent-preview.html  # 移动端AI助手预览
├── styles.css          # 全站样式
├── practice.js         # 练习系统核心逻辑
├── nav.js              # 导航组件
├── manifest.json       # PWA配置
└── service-worker.js   # 离线缓存策略
```

## 技术栈

- **前端**: 原生HTML5 + CSS3 + JavaScript ES6+
- **AI能力**: DeepSeek API
- **PWA**: Service Worker + Web App Manifest
- **存储**: LocalStorage（学习进度）
- **字体**: 系统字体栈 + 思源黑体备选

## 内容说明

### 年级页面特色

| 年级 | 重点内容 | 特色训练 |
|------|----------|----------|
| 一年级 | 拼音入门、识字基础 | 笔顺动画、朗读示范、看图说话 |
| 二年级 | 词汇积累、标点学习 | 写话提优、同音字辨析 |
| 三年级 | 阅读理解起步、写作启蒙 | 句式变换、修辞入门 |
| 四年级 | 阅读技巧、段落写作 | 缩句扩句、病句修改 |
| 五年级 | 阅读深化、篇章写作 | 关联词综合、标点专项 |
| 六年级 | 小升初总复习 | 综合运用、真题演练 |

### 尖子生特训
- 高阶思维训练（一题多解、逆向思维）
- 跨学科阅读整合
- 学术写作入门
- 竞赛备赛指导

### 中等生提升
- 基础知识巩固强化
- 学习方法指导
- 成就可视化激励
- 渐进式任务分解

### 后进生补救
- 知识漏洞精准诊断
- 针对性补缺训练
- 基础题过关保障
- 学习习惯养成

## 浏览器兼容性

| 浏览器 | 支持版本 |
|--------|----------|
| Chrome | 90+ ✅ |
| Firefox | 88+ ✅ |
| Safari | 14+ ✅ |
| Edge | 90+ ✅ |
| 微信小程序 | WebView ✅ |

## 参与贡献

欢迎提交Issue或Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 许可证

本项目仅供学习交流使用，内容版权归属原作者。

## 联系方式

如有问题或建议，请通过GitHub Issues反馈。
