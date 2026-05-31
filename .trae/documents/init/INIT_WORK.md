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
- 重要讨论、新增、重构、目录调整、阶段性决策，尽量都补一笔记录，方便后续回溯与答辩整理

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
- `.trae/documents/slides/`：演示稿文档
- `.trae/documents/midterm-demo/`：中期 demo 相关草稿
- `.trae/documents/learning/`：学习记录、技术笔记与对话历史摘要
- `Midterm/`：中期相关材料
- `Proposal/`：开题相关材料

边界说明：

- `.trae/documents/` 只放过程文档、草稿和学习记录，不放正式业务代码
- `Midterm/` 只放中期答辩相关材料
- `Proposal/` 只放开题相关材料
- 项目真实可运行代码只放在 `src/` 与 `api/`

## 3. 可执行的初始化清单（推荐顺序）

### 3.1 工程质量底座

- [x] 固定格式化与代码规范（已确认 `ESLint + TypeScript` 可作为当前底座）
- [x] 增加 `prettier`
- [ ] 增加 `lint-staged` + `husky`（可选：commit 前自动检查）

当前说明：

- 当前项目已经具备 `eslint.config.js` 与 `tsconfig.json`
- 当前项目已补充 `Prettier`，并提供：
  - `npm run format`
  - `npm run format:check`
- 当前仓库还没有做一次全量 `Prettier` 格式化，后续可在合适时机统一整理，避免现在引入大面积无关 diff
- `husky` / `lint-staged` 目前继续保持可选，等后续提交频率更高或进入多人协作再考虑

### 3.2 环境变量与配置约定（先不填 Key）

- [x] 新增 `.env.example`（只写变量名，不写真实值）
- [x] 约定前端变量前缀：`VITE_*`
- [x] 约定后端读取方式：`dotenv`（仅后端用）

这一步可以理解为：先把“项目以后会变动的配置”集中放到一个地方，不要把端口、接口地址、AI key、运行模式写死在代码里。

为什么要先做这一步：

- 改配置时只改一个地方，不用全项目到处找
- 避免把密钥直接写进代码
- 方便中期 demo 和最终版本共用同一套项目，但各自切换配置
- 方便后续接第三方 AI（当前计划是 `PackyCode`）

建议的变量（先占位）：

- `PORT=3001`
- `CORS_ORIGIN=http://localhost:5173`
- `VITE_APP_MODE=demo`：当前运行 `demo` 还是 `product`
- `VITE_API_BASE=/api`：前端请求后端时的基础路径
- `AI_PROVIDER=packycode`：当前接入层是哪家（对你现在来说是 `PackyCode`）
- `AI_BASE_URL=`：第三方 AI 服务地址
- `AI_API_KEY=`：第三方 AI 服务 key
- `AI_MODEL=`：当前测试的模型名
- `AI_MODEL_FAMILY=`：模型大类（例如 openai / claude）

### 3.3 API 形态与错误规范（不依赖业务）

- [x] 统一 API 返回格式（示例）
  - 成功：`{ "success": true, "data": ... }`
  - 失败：`{ "success": false, "error": { "code": "...", "message": "..." } }`
- [x] 统一错误处理中间件（Express）
- [x] 统一请求日志（开发态）
- [x] 统一跨域策略（开发态）

### 3.4 数据落地策略（先定方向）

- [x] 选择数据层：当前推荐并暂定为 `SQLite`
- [x] 明确迁移策略：使用 migration
- [x] 明确数据库工具：当前推荐并暂定为 `Drizzle`
- [ ] 最小数据表设计：当前仅保留占位草案，后续根据 PRD 再确定

当前决定说明：

- 中期 demo 虽然主要是前端呈现，但会用到少量后端能力
- 纯 mock 不足以支撑“记录生成过程 / 保留实验结果 / 版本对比”这类演示需求
- JSON 文件适合做模板和 seed 数据，但不适合作为主要存储层
- `SQLite` 最适合当前阶段：本地轻量、可演示、后续可迁移到最终版本
- 迁移工具采用 `migration`，目的是让每次数据库结构变更都有记录，后续更稳
- 数据库工具优先采用 `Drizzle`：相对轻量，适合 `React + Node.js + SQLite` 这条技术路线，也更适合继续沿用到最终项目

当前建议的推进节奏：

- 页面与交互继续可以先用 mock 数据推进
- 一旦 3 个核心数据名词明确，就优先把最小数据结构落到 `SQLite`
- 第一阶段只需要最少量的数据表，不急着一开始做完整数据库设计

当前暂定方案（一句话版）：

- 主存储层：`SQLite`
- 数据库工具：`Drizzle`
- 结构变更记录方式：`migration`

#### 3.4.1 最小数据表草案（仅作占位参考，后续再定）

说明：你目前对数据库表还没有明确概念，所以这一部分先不视为正式决定。下面的内容只用于帮助后续讨论，不作为立即实施的约束。

1. `projects`

- 作用：代表一个设计任务 / 一个工作空间
- 最少建议保存：
  - `id`：项目唯一标识
  - `title`：项目名称
  - `description`：项目说明（可先简单）
  - `created_at`：创建时间
  - `updated_at`：最后更新时间

2. `rulesets`

- 作用：代表一组元设计规则 / 一次规则定义
- 它应该属于某个 `project`
- 最少建议保存：
  - `id`：规则集唯一标识
  - `project_id`：它属于哪个项目
  - `name`：规则集名称
  - `intent_summary`：设计意图摘要
  - `rules_json`：规则主体内容（前期可以先用 JSON 结构存）
  - `version`：规则版本号
  - `created_at`：创建时间

3. `generations`

- 作用：代表一次生成尝试 / 一条实验记录
- 它通常和某个 `project`、某个 `ruleset` 有关系
- 最少建议保存：
  - `id`：生成记录唯一标识
  - `project_id`：属于哪个项目
  - `ruleset_id`：基于哪套规则生成
  - `prompt_snapshot`：本次生成时实际使用的输入快照
  - `result_summary`：生成结果摘要
  - `provider`：调用的是哪一层服务（例如 `packycode`）
  - `model`：当时使用的模型名
  - `status`：成功 / 失败 / 待处理
  - `created_at`：生成时间

为什么先把范围缩到这 3 类：

- `projects` 让你能区分不同设计任务
- `rulesets` 对应你的“元设计内容”
- `generations` 对应你的“生成行为与实验记录”
- 这 3 类只是当前最容易理解的占位参考，不代表最终一定这样拆表
- 后面如果 PRD 改了，也可以换成别的拆分方式

### 3.5 演示与发布（可选）

- [x] 确定子域名分工：中期 demo 与最终原型使用同一主域名下的不同子域名
- [ ] 选定具体部署平台（当前暂缓，等 PRD 与中期 demo 结构更明确后再定）
- [ ] 确定“答辩演示路径”：打开首页 → 进入工作台 → 编辑规则 → 触发生成/模拟生成 → 导出

当前阶段说明：

- 现在先不做正式部署绑定
- 等 PRD、核心页面和演示范围更清楚后，再决定部署平台
- 正式绑定 `midterm` / `final` 子域名前，还需要补充真实主域名、DNS 托管信息和平台访问权限
- 如果后面需要提前线上预览，可以先使用部署平台提供的默认地址，确认稳定后再绑定自己的域名

当前推荐的子域名方案：

- `midterm.yourdomain.com`
  - 用于中期 demo
  - 强调“研究中期验证版 / 交互与机制演示”
- `final.yourdomain.com`
  - 用于最终原型
  - 强调“最终系统版本 / 更完整的工作流呈现”

英文描述建议（可用于页面标题、副标题、部署说明）：

- `midterm.yourdomain.com`
  - Title: `Midterm Prototype`
  - Description: `A midterm prototype for my graduation project, exploring meta-design-driven human-AI collaboration in information design.`

- `final.yourdomain.com`
  - Title: `Final Prototype`
  - Description: `A final prototype for my graduation project, presenting a meta-design-driven system for human-AI collaboration in information design.`

如果后面需要更偏学术表达，也可以使用这一版总描述：

- `This project explores a meta-design-driven approach to human-AI collaboration for information design artifacts.`

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

## 6. 讨论与变更记录

### 2026-05-31

- 确认采用“尽量记录”的协作方式：后续每次重要讨论、新增、重构、阶段性初始化决定，都在文档里补一笔摘要
- 当前初始化方向保持为 `React + Vite` 前端、`Node.js + Express` 后端
- 当前仓库采用 `demo / product` 双入口隔离策略，中期 demo 与最终版本并行推进
- 启动 3.2 环境变量与配置约定：补全 `.env.example`，将配置项改为贴合 `PackyCode` 的结构，并让后端实际读取 `CORS_ORIGIN`
- 完成 3.3 API 规范底座：后端统一返回 `{ success, data, error }` 结构，增加开发态请求日志、404/500 规范错误体，并同步前端请求解析逻辑
- 初步确认 3.4 数据落地方向：中期 demo 虽然只使用少量后端，但主存储层仍优先采用 `SQLite`；`JSON` 更适合作为模板/seed 数据，不作为主要落地方案
- 正式确认数据库线的暂定方案为 `SQLite + Drizzle + migration`，并补充最小 3 张表草案：`projects`、`rulesets`、`generations`
- 补充说明：最小 3 张表目前只作为帮助理解的占位草案，不视为正式拍板；等 PRD 和核心数据对象更清楚后再最终确定
- 确认发布域名策略：中期与最终原型共用主域名，但拆分为 `midterm` / `final` 两个子域名；同时补充了可直接使用的英文毕设描述
- 新增对话历史摘要文档：将本轮对齐的重要事件收拢到 `.trae/documents/learning/对话对齐历史记录.md`，作为后续继续讨论的记忆入口
