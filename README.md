# meta_design

毕业设计原型代码仓库：`React + Vite` 前端，`Node.js + Express` 后端。

当前仓库主要用于两条线并行推进：

- `midterm`：中期 demo 与研究验证
- `final`：最终原型与后续落地

## 目录结构

- `src/`：前端应用代码（包含 `demo` / `product` 双入口）
- `api/`：后端服务与基础 API
- `.trae/documents/slides/`：演示稿相关文档
- `.trae/documents/midterm-demo/`：中期 demo 相关草稿
- `.trae/documents/learning/`：学习记录、技术笔记与对话历史摘要
- `Midterm/`：中期相关材料
- `Proposal/`：开题相关材料
- `INIT_WORK.md`：初始化工作记录与阶段性决策

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

环境变量模板：

- 复制 `.env.example` 后再按需本地填写
- 当前项目已约定：
  - 前端变量使用 `VITE_*`
  - 后端变量通过 `dotenv` 读取

## 当前初始化状态

- 已完成：`3.2 环境变量与配置约定`
- 已完成：`3.3 API 形态与错误规范`
- 已基本确认：`3.4 SQLite + Drizzle + migration`
- 已确定方向：`midterm` / `final` 子域名分工
- 暂未开始：正式数据库骨架初始化、PRD 细化后的业务实现

### 常见问题

- 浏览器显示“服务不可用”（打不开 `http://localhost:5173/`）：说明前端开发服务器没有在运行。
  - 在项目目录执行 `npm run dev` 并保持终端进程不要退出
  - 以终端输出的 `Local: http://localhost:xxxx/` 为准（如果 5173 被占用，Vite 会自动换端口）

## 常用命令

```bash
npm run check
npm run lint
npm run format
npm run format:check
```
