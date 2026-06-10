# Design Skills 使用指南

> 面向 Cursor / Composer 的设计模式学习手册。  
> 建议配合 `.trae/documents/learning/learning_log.md` 记录每次练习的收获。

---

## 这份指南是什么

这里的「设计模式」**不是**软件工程里的 Design Pattern（单例、工厂等），而是 Cursor 里一组 **Design Skills（设计技能）** 的使用方法。

它们的目标很具体：

- 让 AI 帮你做 **有审美、有上下文、可落地** 的界面
- 避免千篇一律的「AI 味」界面（紫渐变、Inter 字体、卡片网格堆叠……）
- 把「先想清楚再写代码」变成可重复的工作流

你在 Cursor 里可以用两种方式触发：

1. **斜杠命令**：如 `/impeccable teach`、`/shape 登录页`
2. **自然语言**：如「用 impeccable 风格帮我做一个招募 landing page」

两种方式效果相同；斜杠命令更精确，自然语言更灵活。

---

## 核心心智模型

开始用之前，先建立 3 个概念：

### 1. 设计上下文（Design Context）

AI **不能**从代码里推断「这个产品是给谁用的、应该是什么气质」。  
这些信息必须来自你，并沉淀为项目根目录的 `.impeccable.md`。

没有上下文 → 输出容易泛化、每页风格不一致。  
有上下文 → 后续所有设计 skill 都会对齐同一份「设计宪法」。

### 2. 设计简报（Design Brief）

复杂功能不要直接写代码。先用 `/shape` 做需求访谈，产出设计简报：

- 用户要做什么
- 页面/组件有哪些状态（空、加载、错误……）
- 布局策略与交互模型
- 明确「不要做成什么样」

简报确认后再实现，返工会少很多。

### 3. 迭代而非一次到位

好的界面通常是：**实现 → 评审 → 专项优化 → 打磨**，而不是「一次生成完事」。

---

## 技能地图（总览）

```
                    ┌─────────────────┐
                    │  impeccable     │  ← 核心枢纽
                    │  teach / craft  │
                    │  / extract      │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         ┌─────────┐   ┌──────────┐   ┌─────────────┐
         │  shape  │   │ frontend │   │ figma-      │
         │  规划   │   │ -design  │   │ implement   │
         └─────────┘   └──────────┘   └─────────────┘
                             │
         ┌───────────────────┴───────────────────┐
         ▼                   ▼                   ▼
    ┌─────────┐         ┌─────────┐         ┌─────────┐
    │ critique│         │  audit  │         │ polish  │
    │ 评审    │         │ 质检    │         │ 打磨    │
    └─────────┘         └─────────┘         └─────────┘
                             │
    ┌──────── layout ──── typeset ──── colorize ──── animate ────┐
    │  layout   typeset   colorize   animate   adapt   clarify    │
    │  布局     字体      配色       动效      响应式   文案       │
    └──────────────────────────────────────────────────────────────┘
                             │
    ┌──────── distill ─── bolder ─── quieter ─── delight ────────┐
    │  简化    加冲击   降刺激     加惊喜                          │
    └──────────────────────────────────────────────────────────────┘
                             │
    ┌──────── harden ─── optimize ─── redesign ─── overdrive ────┐
    │  生产就绪  性能     改版升级    高规格动效                   │
    └──────────────────────────────────────────────────────────────┘
```

---

## 第一阶段：项目初始化（必做一次）

### 命令

```
/impeccable teach
```

或：

> 帮我为 meta_design 项目建立设计上下文，写入 .impeccable.md

### 你会被问到什么

| 维度 | 示例问题 |
|------|----------|
| 用户与场景 | 谁在用？在什么情境下用？要完成什么任务？ |
| 品牌气质 | 用 3 个词描述产品性格；参考站/反参考站 |
| 审美方向 | 极简 / 编辑风 / 技术感 / 温暖人文……；浅色还是深色 |
| 约束 | 技术栈、无障碍要求、必须/禁止使用的颜色 |
| 情绪目标 | 用户应该感到 calm / confident / playful 等 |

### 产出

项目根目录生成或更新 `.impeccable.md`，结构大致如下：

```markdown
## Design Context

### Users
（目标用户、使用情境、要完成的任务）

### Brand Personality
（品牌语气、3 词性格、情绪目标）

### Aesthetic Direction
（视觉方向、参考、反参考、主题）

### Design Principles
（3–5 条指导后续所有设计决策的原则）
```

### 学习检查点

- [ ] 我能用自己的话复述：这个产品是给谁用的、应该是什么感觉
- [ ] `.impeccable.md` 已存在且内容是我确认过的
- [ ] 我知道以后改风格要先改这份文档，而不是每次口头重复

---

## 第二阶段：规划（复杂功能推荐）

### 命令

```
/shape [功能描述]
```

示例：

```
/shape  formative study 参与者招募 landing page
/shape  中期汇报 slides 的目录抽屉交互
/shape  问卷结果数据可视化面板
```

或自然语言：

> 先帮我规划 XX 功能的 UX/UI，产出设计简报，**先不要写代码**

### 产出：设计简报结构

1. **Feature Summary** — 功能是什么、给谁用
2. **Primary User Action** — 用户在这里最重要的一件事
3. **Design Direction** — 应该是什么感觉
4. **Layout Strategy** — 信息层级与空间节奏（不是具体 CSS）
5. **Key States** — default / empty / loading / error / success / 边界情况
6. **Interaction Model** — 点击、悬停、滚动、流程
7. **Content Requirements** — 文案、标签、错误提示、空状态
8. **Recommended References** — 实现时该读哪些参考文档
9. **Open Questions** — 实现阶段还需确认的问题

### 何时必须用 shape

| 场景 | 建议 |
|------|------|
| 单个小组件（按钮、卡片） | 可跳过，直接实现 |
| 完整页面 / 多步骤流程 | 强烈建议 shape |
| 研究工具、dashboard、表单-heavy | 必须 shape |
| 已有 Figma 稿 | 可跳过 shape，走 figma-implement |

### 学习检查点

- [ ] 我能独立写出「Primary User Action」
- [ ] 我会主动列出 empty / error / loading 状态
- [ ] 简报确认后我才说「开始实现」

---

## 第三阶段：实现

### 方式 A：一条龙（推荐复杂功能）

```
/impeccable craft [功能描述]
```

内部流程：`shape`（若尚无简报）→ 读参考文档 → 分步实现 → 浏览器视觉迭代。

### 方式 B：直接实现（简单任务）

```
/impeccable 做一个参与者信息卡片组件，React + Tailwind
```

或：

```
用 frontend-design 风格帮我美化 src/apps/demo/slides/TocDrawer.tsx
```

### 方式 C：从 Figma 还原

```
/impeccable 按这个 Figma 设计实现组件：[Figma URL]
```

需要 Figma Desktop MCP 或设计稿截图/规格。

### 实现时的标准顺序（craft 内部逻辑）

1. **结构** — 语义 HTML / 组件结构，先不加样式
2. **布局与间距** — 建立视觉节奏
3. **字体与颜色** — 应用 type scale 与 palette
4. **交互状态** — hover / focus / active / disabled
5. **边界状态** — empty / loading / error / 溢出
6. **动效** — 有目的的 transition / animation
7. **响应式** — 不是缩小，是按场景重新编排

### 学习检查点

- [ ] 实现时我会指定技术栈（本仓库默认：React + Vite + TS + Tailwind）
- [ ] 我会要求用真实/ realistic 数据，而不是 Lorem Ipsum
- [ ] 实现后我会打开浏览器看效果，而不是只看代码

---

## 第四阶段：评审与质检

### critique — UX 设计评审

```
/critique 首页 hero 区域
/critique src/apps/demo/slides/SlideView.tsx
```

**何时用**：第一版做完，想从用户视角找问题。

**产出**：评分、信息架构问题、认知负荷、改进建议。

---

### audit — 技术质量审计

```
/audit 整个 demo slides 应用
/audit 表单页的无障碍与响应式
```

**何时用**：准备上线、中期汇报前、大改之后。

**产出**：P0–P3 分级问题清单 + 修复计划（无障碍、性能、反模式等）。

---

### web-design-guidelines — 规范合规检查

```
按 Web Interface Guidelines 审查这个页面
```

**何时用**：需要对照业界 UI 规范做 checklist 式检查。

---

## 第五阶段：专项优化（按需组合）

每个 skill 只改一个维度，适合 **小步迭代**。

| Skill | 触发示例 | 解决什么问题 |
|-------|----------|--------------|
| **layout** | `/layout 侧边栏与主内容区` | 间距乱、层次弱、网格单调 |
| **typeset** | `/typeset 正文与标题层级` | 字体没性格、字号对比不够 |
| **colorize** | `/colorize 整体太灰` | 缺色彩、配色寡淡 |
| **animate** | `/animate 页面切换` | 交互死板、缺过渡反馈 |
| **adapt** | `/adapt 移动端 slides 浏览` | 响应式、触控目标 |
| **clarify** | `/clarify 错误提示和空状态文案` | 文案难懂、指令不清 |
| **distill** | `/distill 设置页` | 元素太多、信息噪音 |
| **bolder** | `/bolder hero 区` | 太平、缺个性 |
| **quieter** | `/quieter 数据面板` | 太花、视觉过载 |
| **delight** | `/delight 提交成功状态` | 功能有了但不可爱 |
| **polish** | `/polish 提交前最后一遍` | 对齐、细节、一致性 |
| **harden** | `/harden 表单流程` | 缺 error/empty/onboarding |
| **optimize** | `/optimize slides 首屏加载` | 慢、卡、bundle 大 |
| **overdrive** | `/overdrive 汇报封面页` | 要高规格动效/视觉 |

### 风格预设 skill（实现时可指定）

| Skill | 气质 | 适合场景 |
|-------|------|----------|
| **minimalist-ui** | 暖色单色、编辑风、扁平 bento | 文档型、研究工具、Notion 感 |
| **high-end-visual-design** | 高端 agency、大留白、精致动效 | 汇报、作品集、品牌页 |
| **ui-ux-pro-max** | 内置大量风格/配色/字体组合库 | 需要快速选风格方向时 |
| **redesign-existing-projects** | 在现有代码上升级，不重写 | 本仓库已有页面要美化 |

---

## 第六阶段：沉淀设计系统

### extract — 从页面提取可复用资产

```
/impeccable extract src/apps/demo/slides/
```

**产出**：把颜色、间距、组件模式整理进设计 token / 共享组件，避免每个页面各做各的。

**何时用**：某个模块已经满意，想推广到全项目。

---

## 推荐工作流（按任务类型）

### 流程 1：从零做新页面（标准）

```
1. /impeccable teach          （项目首次）
2. /shape [页面名]
3. 确认设计简报
4. /impeccable craft [页面名]
5. /critique [页面名]
6. /layout + /typeset + /polish （按需）
7. /audit （上线前）
```

### 流程 2：快速小组件

```
1. 确保 .impeccable.md 存在
2. 「用 Tailwind 做一个 XXX 组件，符合项目设计上下文」
3. /polish [组件路径] （可选）
```

### 流程 3：美化现有页面

```
1. /redesign-existing-projects 升级 src/apps/demo/pages/Slides.tsx
2. /audit
3. /polish
```

### 流程 4：有 Figma 稿

```
1. 确认 .impeccable.md
2. 「按 Figma 实现，技术栈 React + Tailwind：[URL]」
3. /critique 对比稿与实现
4. /polish
```

### 流程 5：研究/学术向界面（贴合本仓库）

```
1. teach 时强调：学术工具、研究者用户、清晰信息架构、低干扰
2. shape 时列清：任务流程、数据密度、打印/演示场景
3. craft 时用 minimalist-ui 或 impeccable 编辑风
4. harden 补齐 empty/error；adapt 兼顾投影演示与笔记本屏幕
```

---

## 提示词模板（复制即用）

### 建立上下文

```
/impeccable teach

补充信息：
- 产品：meta_design 毕设研究工具
- 用户：HCI 研究者 / 设计学研究生
- 气质：清晰、学术、低干扰、可信赖
- 技术栈：React + Vite + TypeScript + Tailwind
- 参考：[填写 URL 或描述]
- 不要：紫渐变、过度动效、营销腔文案
```

### 规划功能

```
/shape [功能名]

约束：
- 必须支持：desktop 演示 + 笔记本日常编辑
- 数据范围：[例如 0–50 条参与者记录]
- 与现有 slides 组件风格一致
```

### 实现

```
/impeccable craft [功能名]

要求：
- 代码落在 src/apps/demo/...
- 使用现有 Tailwind 配置，不引入新 UI 库
- 所有状态都要有 UI：loading / empty / error
- 完成后在浏览器打开让我看
```

### 专项优化

```
/layout src/apps/demo/slides/TocDrawer.tsx
重点：抽屉内信息层级、触控区域、与 SlideView 的视觉关系
```

### 评审

```
/critique src/apps/demo/slides/SlideView.tsx

从「中期汇报演示者」视角评审：5 分钟内能否讲清楚结构？视觉是否抢内容？
```

---

## 学习路径（4 周建议）

### 第 1 周：建立上下文 + 做一个小组件

**目标**：理解 teach → 实现 → polish 最短路径。

**练习**：

1. 对本仓库运行 `/impeccable teach`
2. 做一个 `ParticipantBadge` 或 `StatusTag` 小组件
3. 用 `/polish` 打磨一遍
4. 在 `learning_log.md` 记录：设计原则 3 条 + 踩坑 2 条

**验收**：组件风格与 `.impeccable.md` 一致；你能说清为什么选这种字体/颜色。

---

### 第 2 周：shape + craft 一个完整页面

**目标**：掌握设计简报思维与多状态 UI。

**练习**（任选其一）：

- Formative Study 招募说明页（静态 landing）
- Slides 打印预览页优化
- 参与者列表只读视图

**流程**：shape → 确认简报 → craft → critique

**验收**：页面包含 empty state；错误/加载有 UI；简报里的 Primary User Action 在界面上「一眼可见」。

---

### 第 3 周：专项 skill 组合 + 响应式

**目标**：学会「一次只改一个维度」。

**练习**：

1. 选第 2 周产物
2. 依次（可分多次对话）：`/layout` → `/typeset` → `/adapt`
3. 用 `/audit` 出报告，修 P0/P1

**验收**：375px 与 1440px 都可用；audit 无 P0。

---

### 第 4 周：改版现有模块 + 沉淀

**目标**：redesign + extract，形成可复用规范。

**练习**：

1. `/redesign-existing-projects` 选一个现有 demo 页面
2. `/impeccable extract` 提取 token / 组件
3. 更新 `.impeccable.md` 的 Design Principles（如有新共识）

**验收**：至少 2 个可复用组件或 token 组；改版未破坏原有功能路由。

---

## 「AI 味」自检清单

实现完成后，用下面清单快速自测。若中 3 条以上，考虑 `/bolder` 或 `/distill` 或重新对齐 `.impeccable.md`：

- [ ] 用了 Inter / Roboto / 系统默认字体堆满全站
- [ ] 深色背景 + 紫色/青色发光 accent
- [ ] 标题上方堆一排圆角大图标
- [ ] 千篇一律的「图标 + 标题 + 描述」卡片网格
- [ ] 左侧彩色粗 border 的 alert / callout
- [ ] 渐变文字（background-clip: text）
- [ ] 所有按钮都是 primary 蓝色
- [ ] 文案出现 Elevate / Seamless / Unleash / Next-Gen
- [ ] 空状态只写 "No data" 没有任何引导
- [ ] 移动端只是把 desktop 等比缩小

**impeccable 的核心标准**：若你说「这是 AI 做的」，对方会立刻相信 —— 那就是失败；对方会问「你怎么做的」—— 才是成功。

---

## Cursor 使用技巧

### Agent vs Plan 模式

| 模式 | 适合 |
|------|------|
| **Plan** | 大改版前先讨论方案、对比多种布局/风格，不写代码 |
| **Agent** | teach / shape / craft / 改文件 / 跑 dev server |

建议：复杂功能 **Plan 定方向 → Agent 实现 → critique 评审**。

### 对话技巧

1. **一次一事**：layout 和 colorize 分开做，改动更可控
2. **给约束**：技术栈、文件路径、禁止事项写清楚
3. **给参考**：URL、截图、或「像 XX 产品的 YY 部分」
4. **要求看浏览器**：「改完打开 localhost 截图给我」比只看 diff 可靠
5. **引用项目文件**：用 `@src/apps/demo/...` 指向具体文件

### 与本仓库联调

```bash
npm run dev
```

前端默认 Vite；改 UI 后让 Agent 在浏览器里验证 Slides / Demo 路由。

---

## 常见问题

### Q：必须先 teach 吗？

**强烈建议**。没有 `.impeccable.md` 时，impeccable 系列 skill 会先跑 teach，或输出偏 generic。

### Q：shape 和 craft 区别？

- **shape**：只规划，不写代码，产出设计简报  
- **craft**：shape + 实现 + 视觉迭代，一条龙

### Q：impeccable 和 frontend-design 区别？

两者都追求高质量前端。**impeccable** 更完整：有 teach/craft/extract、设计上下文协议、反模式清单。**frontend-design** 更轻，适合简单美化。复杂项目优先 impeccable。

### Q：可以同时说「minimalist-ui + impeccable」吗？

可以。写法示例：

> 用 impeccable craft，审美方向参考 minimalist-ui，做 XXX

主 skill 负责流程，风格 skill 负责审美约束。

### Q：改完不满意怎么办？

不要笼统说「再好看一点」。改用专项 skill：

- 太乱 → `/distill`
- 太淡 → `/bolder` 或 `/colorize`
- 细节糙 → `/polish`
- 不像产品 → `/harden`

### Q：设计 skill 会改后端吗？

默认只动 UI。若需要 API 配合，请明确说：「只改前端」或「同时加 /api/xxx 接口」。

---

## 与本仓库相关的练习建议

结合 `meta_design` 毕设方向，这些页面最适合练手：

| 练习对象 | 推荐 skill 组合 | 学习重点 |
|----------|-----------------|----------|
| `Formative Study/Recruitment/` 招募材料 | teach → shape → craft | 学术语气、信任感、表单引导 |
| `src/apps/demo/slides/` 汇报 slides | layout → typeset → adapt | 演示场景、信息密度、键盘导航 |
| `public/problem-hierarchy.html` | redesign → polish | 静态页升级、信息可视化 |
| 参与者数据展示（未来） | shape → craft → harden | 表格/卡片、empty/error、数据可读性 |

---

## 学习记录模板

每次练习后在 `learning_log.md` 追加：

```markdown
## [日期] Design Skill 练习 — [任务名]

**使用的 skill**：teach / shape / craft / …

**做了什么**：（1–3 句）

**设计决策**：（为什么选这个布局/字体/颜色）

**踩坑**：（1–3 条）

**下次规则**：（可复用的一条原则）
```

---

## 快速参考卡

| 我想… | 用这个 |
|--------|--------|
| 第一次做这个项目 | `/impeccable teach` |
| 规划再动手 | `/shape …` |
| 规划+实现一条龙 | `/impeccable craft …` |
| 直接做界面 | `/impeccable …` 或描述需求 |
| 从 Figma 还原 | 提供 URL + implement design |
| 评审 UX | `/critique …` |
| 查无障碍/性能 | `/audit …` |
| 改布局 | `/layout …` |
| 改字体 | `/typeset …` |
| 改配色 | `/colorize …` |
| 改文案 | `/clarify …` |
| 上线前最后一遍 | `/polish …` |
| 升级旧页面 | `/redesign-existing-projects …` |
| 提取设计系统 | `/impeccable extract …` |

---

## 下一步

1. 在本仓库运行 **`/impeccable teach`**，生成 `.impeccable.md`
2. 选一个 **最小页面** 走一遍 shape → craft → critique
3. 把收获记进 **`learning_log.md`**

需要我带你做第 1 步时，直接说：「开始 teach meta_design」即可。

---

*文档版本：2026-06-07 · 适用于 Cursor Composer + Impeccable Design Skills 体系*
