# meta_design

毕设原型代码仓库：React 前端 + Node.js（Express）后端。

## 目录结构

- `src/`：前端（React + Vite）
- `api/`：后端（Express）
- `.trae/documents/`：草稿阶段文档（`slides/` 演示稿文档、`midterm-demo/` 中期 demo 文档）
- `Midterm/`：中期相关材料
- `Proposal/`：开题相关材料

## 本地开发

安装依赖：

```bash
npm install
```

启动前端 + 后端（并行）：

```bash
npm run dev
```

运行入口（中期 demo / 最终版本）：

- 默认运行中期 demo：`VITE_APP_MODE=demo`
- 运行最终版本入口：`VITE_APP_MODE=product`

示例：

```bash
VITE_APP_MODE=demo npm run dev
VITE_APP_MODE=product npm run dev
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
