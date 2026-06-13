# meta_design

毕业设计研究与原型仓库。  
当前项目基于 `React + Vite + TypeScript` 前端，以及 `Node.js + Express` 后端。

这个仓库现在同时承载三条线：

- `研究材料`
  访谈、任务、招募、结论整理。
- `前端设计`
  参考图、交互概念、前端 `PRD`。
- `原型实现`
  中期前端 demo 与后续正式产品入口。

<br />

## 当前结构

### 研究材料

- [Formative Study](/Users/xiaoshizi/Documents/trae_projects/meta_design/Formative%20Study)
  形成性研究主目录。
- [Formative Study/Recruitment](/Users/xiaoshizi/Documents/trae_projects/meta_design/Formative%20Study/Recruitment)
  招募问卷、脚本与参与者信息。
- [Formative Study/Task](/Users/xiaoshizi/Documents/trae_projects/meta_design/Formative%20Study/Task)
  任务说明、主持人 guide、任务素材。
- [Formative Study/Participants](/Users/xiaoshizi/Documents/trae_projects/meta_design/Formative%20Study/Participants)
  参与者逐字稿与整理版记录。
- [Formative Study/Synthesis](/Users/xiaoshizi/Documents/trae_projects/meta_design/Formative%20Study/Synthesis)
  `RQ1/RQ2/RQ3` 结论整理与综合结果。
- [Related Work](/Users/xiaoshizi/Documents/trae_projects/meta_design/Related%20Work)
  文献研究、相关工作整理与阅读笔记。

### 前端设计

- [Frontend Design](/Users/xiaoshizi/Documents/trae_projects/meta_design/Frontend%20Design)
  前端设计工作区。
- [Frontend Design/references](/Users/xiaoshizi/Documents/trae_projects/meta_design/Frontend%20Design/references)
  视觉参考、界面方向记录。
- [Frontend Design/concepts](/Users/xiaoshizi/Documents/trae_projects/meta_design/Frontend%20Design/concepts)
  前端概念讨论稿、结构草案。
- [Frontend Design/prd](/Users/xiaoshizi/Documents/trae_projects/meta_design/Frontend%20Design/prd)
  当前正在推进的正式前端 `PRD`。

### 中期 demo

- [Demos/midterm-frontend-demo](/Users/xiaoshizi/Documents/trae_projects/meta_design/Demos/midterm-frontend-demo)
  毕设中期使用的阶段性前端 demo 文档。

### 提案材料

- [Proposal](/Users/xiaoshizi/Documents/trae_projects/meta_design/Proposal)
  开题与提案相关文档。
- [Proposal/drafts](/Users/xiaoshizi/Documents/trae_projects/meta_design/Proposal/drafts)
  草稿。
- [Proposal/notes](/Users/xiaoshizi/Documents/trae_projects/meta_design/Proposal/notes)
  支撑性笔记与规则草稿。
- [Proposal/exports](/Users/xiaoshizi/Documents/trae_projects/meta_design/Proposal/exports)
  导出稿、打印版与 PDF。

### 代码实现

- [src](/Users/xiaoshizi/Documents/trae_projects/meta_design/src)
  前端应用代码。
- [src/apps/demo](/Users/xiaoshizi/Documents/trae_projects/meta_design/src/apps/demo)
  当前中期展示用前端应用线。
- [src/apps/product](/Users/xiaoshizi/Documents/trae_projects/meta_design/src/apps/product)
  后续正式产品原型入口（`WIP`）。
- [api](/Users/xiaoshizi/Documents/trae_projects/meta_design/api)
  本地 `Express` API 服务。
- [public](/Users/xiaoshizi/Documents/trae_projects/meta_design/public)
  静态资源。

<br />

## 本地开发

安装依赖：

```bash
npm install
```

启动前端 + 后端：

```bash
npm run dev
```

默认端口：

- 前端：http://localhost:5173
- 后端：http://localhost:3001

<br />

## 应用入口模式

前端总入口位于 [src/App.tsx](/Users/xiaoshizi/Documents/trae_projects/meta_design/src/App.tsx)，通过 `VITE_APP_MODE` 决定当前跑哪一条应用线：

- `demo`
  加载中期展示用应用。
- `product`
  加载正式产品原型入口。

示例：

```bash
VITE_APP_MODE=demo npm run dev
VITE_APP_MODE=product npm run dev
```

如果未显式设置，当前默认会进入 `demo` 线。

<br />

## 前后端通信

当前开发环境下：

- Vite 负责前端开发服务器
- `Express` 负责本地 API 服务
- `/api/*` 请求通过 Vite 代理转发到本地 `3001` 端口

当前已提供基础健康检查接口：

- `GET /api/health`

前端请求封装位于：

- [src/lib/apiClient.ts](/Users/xiaoshizi/Documents/trae_projects/meta_design/src/lib/apiClient.ts)

<br />

## 当前项目状态

当前仓库的技术与文档状态可以概括为：

- 已有可运行的 `React + Vite` 前端工程
- 已有轻量 `Express` API 服务骨架
- 已明确分开 `中期 demo` 与 `product` 入口
- 已建立研究文档、前端设计文档与代码实现的基本目录分工
- 正在从“中期展示型 demo”逐步推进到“元设计工作台”正式原型

<br />

## 常用命令

```bash
npm run dev
npm run build
npm run check
npm run lint
npm run format
npm run format:check
```
