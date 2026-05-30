# 项目初始化工作记录（草稿阶段）

本文件用于在 PRD 尚未完全落地前，记录“不会浪费、后面一定用得上”的初始化工作与约定。后续我们可以在这里逐条补充决策与完成情况。

## 0. 当前状态（已具备）

- 项目形态：前端 `React + Vite`，后端 `Node.js + Express`
- 开发启动：`npm run dev`
- 端口：前端 `http://localhost:5173`，后端 `http://localhost:3001`
- 前端通过 Vite 代理请求后端：`/api/*` → `http://localhost:3001`
- 文档：`.trae/documents/` 已按 `slides/` 与 `midterm-demo/` 归档草稿文档

## 1. 初始化原则（PRD 未完备时也要做的事）

- 只做“基础设施/约定/骨架”，不做具体业务功能
- 任何会牵扯业务细节（数据字段、页面流程、权限）的内容，先写成草案与 TODO，等 PRD 明确后再落地
- 默认不引入复杂依赖：先能跑、能演示、能迭代，再逐步加深

## 1.1 中期 Demo 与最终版本隔离策略（推荐）

目标：中期只做 demo（偏前端呈现 + 少量核心点后端验证），但保证后期能把 demo 快速迁移/升级到最终版本。

做法：同一仓库内采用“双入口 + 共享层”的结构，避免 demo 代码污染最终版本。

- 双入口：
  - `src/apps/demo/*`：中期 Demo（可快速试错）
  - `src/apps/product/*`：最终版本（严格收敛、可答辩落地）
- 共享层：
  - `src/lib/*`、`src/components/*`：可迁移的通用能力（UI 小组件、请求封装、工具函数）

切换方式：通过 `VITE_APP_MODE` 选择运行 `demo` 或 `product`。
  - `VITE_APP_MODE=demo`：默认运行中期 Demo
  - `VITE_APP_MODE=product`：运行最终版本入口（先占位，后续逐步填充）

迁移原则：
- Demo 里“能复用”的抽成共享层（components/lib），最终版本直接引用
- Demo 里“验证性质/一次性”的留在 demo 入口，不进入共享层

## 2. 目录与边界（约定）

- `src/`：前端应用（React 组件、页面、路由、状态）
- `api/`：后端服务（Express 路由、业务逻辑、未来可扩展数据访问层）
- `.trae/documents/`：草稿文档（`slides/` 演示稿文档、`midterm-demo/` 中期 demo 文档）
- `Midterm/midterm proposal.md`：研究稿（背景、研究问题等）

## 3. 可执行的初始化清单（推荐顺序）

### 3.1 工程质量底座

- [ ] 固定格式化与代码规范（ESLint/TS 配置确认）
- [ ] 增加 `prettier`（可选，但通常对团队/长期很有帮助）
- [ ] 增加 `lint-staged` + `husky`（可选：commit 前自动检查）

### 3.2 环境变量与配置约定（先不填 Key）

- [ ] 新增 `.env.example`（只写变量名，不写真实值）
- [ ] 约定前端变量前缀：`VITE_*`
- [ ] 约定后端读取方式：`dotenv`（仅后端用）

建议的变量（先占位）：

- `PORT=3001`
- `CORS_ORIGIN=http://localhost:5173`
- `AI_PROVIDER=`（例如 openai / openrouter / gateway / none）
- `OPENAI_API_KEY=`（如果未来使用）
- `OPEN_ROUTER_API_KEY=`（如果未来使用）
- `AI_GATEWAY_API_KEY=`（如果未来使用）

### 3.3 API 形态与错误规范（不依赖业务）

- [ ] 统一 API 返回格式（示例）
  - 成功：`{ "success": true, "data": ... }`
  - 失败：`{ "success": false, "error": { "code": "...", "message": "..." } }`
- [ ] 统一错误处理中间件（Express）
- [ ] 统一请求日志（开发态）
- [ ] 统一跨域策略（开发态）

### 3.4 数据落地策略（先定方向）

- [ ] 选择数据层：`SQLite` / `JSON 文件` / `Postgres`
- [ ] 明确迁移策略：
  - SQLite：是否使用迁移工具（例如 drizzle/prisma/knex）
  - JSON：是否按目录拆分与版本管理

### 3.5 演示与发布（可选）

- [ ] 选定演示部署方式（Vercel/Render/Fly.io/自建）
- [ ] 确定“答辩演示路径”：打开首页 → 进入工作台 → 编辑规则 → 触发生成/模拟生成 → 导出

## 4. 等 PRD 更明确后再做的内容（先记下来）

- [ ] 页面路由与信息架构（3–5 个核心页面）
- [ ] 核心数据模型（规则集、结构、版本、生成记录、导出产物等）
- [ ] 后端 API 设计与实现
- [ ] “生成”链路：先 mock，再接真实模型/服务

## 5. 下一次讨论建议输入（你可以随时补充）

只要把下面三样写出来，我们就能开始把骨架向“毕设化”推进：

- 页面清单：你想要哪 3 个最核心页面
- 每页关键交互：每页 3–5 个
- 关键数据名词：例如 规则集/结构/版本/生成记录/导出
