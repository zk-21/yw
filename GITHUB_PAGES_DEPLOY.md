# GitHub Pages 静态版部署说明

## 这个版本是什么

这是纯静态版本，可以直接部署到 GitHub Pages。

包含：

- `agent.html`：手机端 AI 学习 Agent
- `agent.js`：前端调用 DeepSeek、语音输入、图片预览、最近记录
- `manifest.json`：PWA 配置
- `service-worker.js`：静态资源缓存
- `agent-icon.svg`：桌面图标

## 重要边界

GitHub Pages 不能运行后端程序，所以：

- 没有 `/api/agent` 后端代理
- 没有服务器环境变量
- DeepSeek API Key 需要用户在页面里输入
- 勾选保存时，Key 只保存在当前手机浏览器本机
- 最近辅导记录也只保存在当前手机浏览器本机

如果浏览器调用 DeepSeek 时提示网络失败或跨域失败，需要后续再加 Vercel 或 Cloudflare 代理接口。

## 部署步骤

1. 把整个项目上传到 GitHub 仓库。
2. 打开仓库 `Settings`。
3. 进入 `Pages`。
4. `Build and deployment` 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。
6. 保存后等待 GitHub Pages 构建完成。
7. 打开 GitHub Pages 给出的地址。
8. 手机访问 `agent.html`，或从首页点击 `AI Agent`。

## 手机使用

手机浏览器打开：

```text
https://你的用户名.github.io/你的仓库名/agent.html
```

进入页面后：

1. 输入 DeepSeek API Key。
2. 选择学科和学习阶段，也可以保持自动判断。
3. 输入题目或问题。
4. 可用语音输入，也可拍照上传预览。
5. 点击“生成辅导”。

## 添加到手机桌面

GitHub Pages 默认是 HTTPS，支持 PWA 基础能力。

在手机浏览器中：

- iPhone Safari：分享按钮 -> 添加到主屏幕
- Android Chrome：菜单 -> 添加到主屏幕

