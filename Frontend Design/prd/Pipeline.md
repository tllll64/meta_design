# Meta Design 系统 — 前后端协作 Pipeline

> 版本：v1.0 · 2026-06-13
> 定位：本文档描述元设计协作工作台的完整交互与数据流。每个阶段对应一个 AI prompt 文件（`api/prompts/`）和一组前端状态变化。

---

## 总览

```
Phase 0 — 初始化
Phase 1 — 意图收集        [gathering.md]
Phase 2 — HTML 生成        [generate.md]
Phase 3 — 结构提取与审核   [extract.md]
Phase 4 — 迭代编辑         [editing.md]
Phase 5 — 原则沉淀         [被动触发，任何阶段均可]
```

---

## Phase 0 — 初始化

**触发时机**：App 首次加载

```
App 加载
  → ChatbotPanel 挂载
  → 本地插入开场白消息（不调 API，纯 appendMessage）
  → chatPhase = 'gathering'
  → metaSpace 全空
  → 画布显示空白纸张（视觉层，自由模式）
```

**前端状态**
- `chatPhase`: `'gathering'`
- `generatedHtml`: `null`
- `metaSpace`: 全空默认值
- `messages`: `[{ role: 'assistant', content: '开场白...' }]`

---

## Phase 1 — 意图收集

**目标**：在生成之前，通过对话帮助设计师厘清任务上下文。AI 只做引导，不生成任何设计内容。

**触发时机**：用户在 Chatbot 输入框发送消息（`chatPhase === 'gathering'`）

```
用户输入消息
  → POST /api/chat
      body: { messages, metaSpace, phase: 'gathering' }
  → 后端加载 gathering.md 作为 system prompt
  → SSE 流式返回 → AI 做对话引导

并行路径（不调 API）：
  用户直接在左侧面板手动填写
  → 更新 metaSpace.task / metaSpace.style
  → 纯本地状态更新
```

**prompt 文件**：`api/prompts/gathering.md`
- 角色：引导式提问者
- 行为：了解任务目标、受众、渠道、风格偏好
- 限制：不生成设计内容，回复 2-3 句

**「开始生成」按钮激活条件**：
- `metaSpace.task.goal` 非空，**或**
- 用户消息数量 ≥ 3 条

---

## Phase 2 — HTML 生成

**目标**：把意图收集阶段的上下文 + 左侧面板配置合并，生成高保真 HTML 页面。

**触发时机**：
- 用户点击「开始生成」按钮
- 用户在对话中说出触发词（"开始生成" / "生成画布" / "可以生成了"）

```
handleGenerate() 执行
  → 拼接 prompt = 对话历史摘要 + metaSpace 全部字段
  → POST /api/generate
      body: { prompt, metaSpace }

后端处理：
  ① 加载 generate.md → 填入占位符 → 调用 Claude → 返回 HTML 字符串
  ② 加载 extract.md → 分析 HTML → 返回结构提取结果（仅 modules[]）

前端处理：
  setGeneratedHtml(html)             → 预览区切换到视觉层，渲染 iframe
  setExtractionSuggestions(modules)  → 存入草稿，不直接写入 metaSpace
  chatPhase → 'editing'
```

**prompt 文件**：`api/prompts/generate.md`
- 角色：信息设计执行者
- 输出：完整单页 HTML（内联 CSS，无外部依赖）
- 占位符：`{{TASK_DESCRIPTION}}` / `{{GOAL}}` / `{{AUDIENCE}}` / `{{CHANNEL}}` / `{{CONSTRAINTS}}` / `{{STYLE_KEYWORDS}}` / `{{COLOR_DIRECTION}}` / `{{PRINCIPLES_LIST}}` / `{{MODULES_LIST}}`

---

## Phase 3 — 结构提取与审核

**目标**：从生成的 HTML 里提取**结构信息**（模块划分 + 内容对象层级），填充中间画布的结构层和内容层。

> **重要边界**：
> - ✅ 提取：模块列表、每个模块内的内容对象、对象语义与重要程度
> - ❌ 不提取：视觉风格关键词、设计原则、任务目标、受众——这些是用户的元设计决策，不应从生成结果反向推导

**触发时机**：Phase 2 的 `/api/generate` 返回后，后端同步执行提取

```
后端：
  加载 extract.md → 分析 HTML 结构
  返回 extractedMeta = { modules: [...] }
  （不含 task / style / principles）

前端：
  setExtractionSuggestions(extractedMeta.modules)
  → 存入草稿区（不写入 metaSpace）
  → 左侧面板底部出现「建议横幅」
```

**建议横幅交互**：
- 列出 AI 识别出的模块结构和内容对象
- 每条提供「采纳」/「忽略」
- 「全部采纳」：仅在 `metaSpace.modules` 为空时写入（有手动结构不覆盖）
- 「忽略全部」：清除草稿，横幅消失

**prompt 文件**：`api/prompts/extract.md`
- 角色：结构分析者
- 输出：严格 JSON，仅包含 `modules[]` 字段
- 措辞定位：提取候选建议，而非确定结论

---

## Phase 4 — 迭代编辑

**目标**：HTML 已生成，设计师通过对话或结构层操作持续修改，AI 作为协作者响应修改意图。

**触发时机**：`chatPhase === 'editing'` 后，用户任何消息

```
两条并行输入路径：

① Chatbot 文字输入
  → POST /api/chat
      body: { messages, metaSpace, phase: 'editing' }
  → 后端加载 editing.md（注入当前 principles + task）
  → SSE 流式返回

② 结构层 / 内容层操作（画布直接操作）
  拖拽模块位置 / 调整大小
  点击内容对象修改参数（语义、重要程度、改动权限）
  切换模块锁定状态
  → 自动 appendMessage({ isSystemAction: true, content: '🔧 结构调整\n· ...' })
  → 下次 /api/chat 时 AI 能看到结构操作历史

触发重新生成：
  → 顶栏「重新生成」按钮
  → 或对话中检测到"重新生成"/"再来一版"等触发词
  → POST /api/generate（携带更新后的完整 metaSpace）
  → 回到 Phase 2 → Phase 3 循环
```

**prompt 文件**：`api/prompts/editing.md`
- 角色：设计协作者
- 行为：理解修改意图，给出具体可操作建议
- 上下文注入：`{{CURRENT_PRINCIPLES}}` / `{{CURRENT_TASK}}`

---

## Phase 5 — 原则沉淀

**目标**：设计师在对话中自然表达稳定性意图时，系统识别并提议沉淀为设计原则，经用户确认后写入 `metaSpace.principles`，在后续生成中作为约束条件传入。

**触发时机**：任何阶段，用户消息中含稳定性意图词

**触发词列表**：始终、一定要、不能、不可以、每次都、必须、绝对不、永远

```
用户消息包含触发词
  → 前端本地检测（不调 API）
  → 用户消息气泡下方插入「原则提取卡」
  → 用户点「保存」→ addPrinciple(content, 'extracted')
                   → 写入 metaSpace.principles
                   → 左侧原则面板高亮动画（pulse-once）
  → 用户点「忽略」→ 提取卡消失，不写入

后续影响：
  metaSpace.principles 非空时
  → generate.md 的 {{PRINCIPLES_LIST}} 占位符注入
  → editing.md 的 {{CURRENT_PRINCIPLES}} 占位符注入
  → AI 在生成和编辑时严格遵守这些原则
```

---

## 数据流总览

```
                    ┌─────────────────────────────────┐
                    │           metaSpace              │
                    │  task / style / principles       │
                    │  modules（审核确认后写入）         │
                    └──────────────┬──────────────────┘
                                   │ 注入
               ┌───────────────────▼──────────────────┐
               │           /api/generate              │
               │  generate.md → HTML                  │
               │  extract.md  → modules 建议草稿       │
               └───────────────┬──────────────────────┘
                               │
              ┌────────────────▼───────────────────┐
              │         前端画布渲染                 │
              │  视觉层 — iframe HTML               │
              │  结构层 — 模块骨架（审核后）          │
              │  内容层 — 对象层级（审核后）          │
              └────────────────┬───────────────────┘
                               │ 操作转译为系统消息
              ┌────────────────▼───────────────────┐
              │          /api/chat                  │
              │  gathering.md — 意图收集             │
              │  editing.md   — 迭代编辑             │
              └────────────────────────────────────┘
```

---

## 已实现 vs 待实现

| Phase | 状态 | 备注 |
|-------|------|------|
| Phase 0 初始化 | ✅ 已实现 | 开场白本地插入 |
| Phase 1 意图收集 | ✅ 已实现 | gathering.md 硬编码在路由 |
| Phase 2 HTML 生成 | ✅ 已实现 | generate.md 硬编码在路由 |
| Phase 3 结构提取 | ⚠️ 部分实现 | 提取逻辑存在，但直接覆写 metaSpace；建议审核机制未实现；提取范围过宽（含 task/style） |
| Phase 4 迭代编辑 | ✅ 已实现 | editing.md 硬编码在路由 |
| Phase 5 原则沉淀 | ✅ 已实现 | 前端检测 + 提取卡 + 写入 |
| Prompt 外置 | ❌ 未实现 | 所有 prompt 仍硬编码在路由文件 |
| 建议横幅 UI | ❌ 未实现 | extractionSuggestions store 字段待添加 |