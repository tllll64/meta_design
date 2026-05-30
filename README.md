# meta_design

毕设原型代码仓库：React 前端 + Node.js（Express）后端。

## 目录结构

- `src/`：前端（React + Vite）
- `api/`：后端（Express）
- `.trae/documents/`：草稿阶段文档（PRD / 技术架构）
- `proposal.md`：中期 proposal（研究背景与研究问题）
- `test.html`：草稿实验页（保留用于快速验证想法）

## 本地开发

安装依赖：

```bash
npm install
```

启动前端 + 后端（并行）：

```bash
npm run dev
```

默认端口：

- 前端：http://localhost:5173
- 后端：http://localhost:3001

前端通过 Vite 代理请求后端：

- 访问 `http://localhost:5173/`，页面会自动请求 `GET /api/health` 并展示结果

### 常见问题

- 浏览器显示“服务不可用”（打不开 `http://localhost:5173/`）：说明前端开发服务器没有在运行。
  - 在项目目录执行 `npm run dev` 并保持终端进程不要退出
  - 以终端输出的 `Local: http://localhost:xxxx/` 为准（如果 5173 被占用，Vite 会自动换端口）

## 常用命令

```bash
npm run check
npm run lint
```
