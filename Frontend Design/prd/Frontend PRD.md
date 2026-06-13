# Frontend PRD — Meta Design 原型（中期）

> 版本：v1.0 · 2026-06-13
> 定位：中期 demo，面向毕设答辩展示，核心目标是把"元设计协作机制"讲清楚。

---

## 1. 产品目标

展示一个由生成式 AI 驱动的信息设计协作工作台，核心机制是：

1. 设计师用自然语言描述任务，AI 生成高保真 HTML 页面
2. 系统从生成结果中自动抽取元设计空间（6 个维度）并填入配置面板
3. 设计师在骨架层直接操作结构，操作自动转译为对话上下文
4. 修改元设计配置后触发重新生成，形成"生成 → 提取 → 修正 → 重生成"的闭环
5. Chatbot 区检测设计师的稳定性意图词，弹出原则提取卡，保存到左侧原则面板

---

## 2. 目标用户

信息设计师（UI/UX、数据可视化、视觉营销），有每日使用 AI 习惯，熟悉 Figma 等设计工具，对"先定规则再生成"的协作思路持开放态度。

---

## 3. 整体布局

三栏固定布局，不可折叠主区：

```
┌──────────────────┬──────────────────────────┬─────────────────┐
│                  │                          │                 │
│  左侧             │  中间：预览区              │  右侧：Chatbot   │
│  高层配置面板      │                          │                 │
│  ~280px          │  flex-1（最小 480px）      │  ~360px         │
│                  │                          │                 │
│  ① 任务目标       │  [滑块：视觉态 ↔ 骨架态]   │  消息历史        │
│  ④ 视觉风格       │                          │                 │
│  ⑤ 设计原则       │  骨架态：                  │  原则提取卡      │
│                  │  - 模块拖拽/调整大小        │                 │
│                  │  - 内容对象点击参数面板      │  输入框          │
│                  │  - 操作自动转译为消息        │                 │
└──────────────────┴──────────────────────────┴─────────────────┘
```

**左侧面板承载的维度（RQ2 高层规则）**
- ① 任务目标与场景：受众、场景、渠道、交付约束
- ④ 视觉风格与参考锚点：风格关键词、参考图、主视觉方向
- ⑤ 设计原则：跨任务复用的判断标准，可新增/删除

**中间预览区承载的维度（RQ2 中层规则，空间可视化）**
- ② 信息内容与层级（骨架层内容对象标注）
- ③ 结构与模块关系（骨架层模块边界与排列）
- ⑥ 人机分工与控制边界（骨架层锁定/解锁控制）

---

## 4. 核心交互流程

### 4.1 主路径：生成 → 提取 → 修正 → 重生成

1. 右侧 Chatbot 输入框输入自然语言任务描述
2. 后端调用 AI 生成高保真 HTML 页面，渲染在中间预览区（视觉态）
3. 系统同时调用 AI 从生成结果中提取元设计空间，自动填入左侧面板
4. 设计师审查左侧面板内容，可直接修改各字段
5. 设计师可拖动滑块切换到骨架态，对模块/内容对象做结构操作
6. 骨架层每次操作在 Chatbot 区自动追加一条系统消息（透明上下文）
7. 设计师在 Chatbot 发送补充指令，或点击"重新生成"按钮
8. 带新的元设计约束重新生成，循环

### 4.2 备用路径：从空白开始

- 左侧面板支持空状态手填，所有字段均可不经过生成直接配置
- 填写任意内容后可触发首次生成

---

## 5. 骨架层规格

### 5.1 滑块切换

- 视觉态：中间区渲染 AI 生成的高保真 HTML（iframe 沙箱）
- 骨架态：页面被解析为带标注的线框，覆盖在半透明原图上
- 滑块连续拖动：两态之间透明度渐变过渡

### 5.2 骨架层可操作对象

| 对象 | 操作 | 触发效果 |
|------|------|---------|
| 模块（区块） | 拖拽移动 | 调整模块顺序，生成系统消息 |
| 模块边缘 | 拖拽调整大小 | 改变区块高度/比例，生成系统消息 |
| 内容对象 | 点击 | 弹出参数面板（类型/语义/重要程度/改动权限） |
| 内容对象 | 拖拽 | 在模块内调整位置，生成系统消息 |
| 模块/对象 | 点击锁定图标 | 切换锁定状态（人机分工⑥），生成系统消息 |

### 5.3 骨架层操作转译消息格式

```
┌─────────────────────────────────────────┐
│ 🔧 结构调整                               │
│   · 「核心数据」模块移至第二区块              │
│   · 「CTA」模块高度缩小至 60%              │
│   · 「主标题」对象重要程度调为最高            │
└─────────────────────────────────────────┘
```

### 5.4 内容对象参数面板字段

- 对象类型：文字 / 图片 / 图表 / 数据-数字 / 按钮-CTA / 容器-卡片 / 图标 / Logo
- 对象语义：主标题 / 副标题 / 核心结论 / 支撑信息 / 来源标注 / 品牌标识 / 辅助装饰
- 重要程度：最高 / 高 / 中 / 低
- 改动权限：自由修改 / 需确认 / 锁定

---

## 6. 原则提取机制

### 6.1 触发规则

检测用户消息中是否包含以下稳定性意图词：

```
始终、一定要、不能、不可以、每次都、必须、绝对不、永远
```

### 6.2 提取卡 UI

触发后，在对应用户消息气泡下方紧接插入提取卡：

```
┌─────────────────────────────────────────┐
│ ✦ 检测到一条设计原则                      │
│                                         │
│  「标题始终置顶，层级权重最高，不可遮挡」    │
│                                         │
│  [保存到原则面板]          [忽略]         │
└─────────────────────────────────────────┘
```

### 6.3 保存后效果

- 左侧"设计原则"区块短暂高亮（300ms 橙色边框脉冲）
- 新原则卡片从顶部滑入列表
- 提取卡收起，替换为"已保存"状态标记

---

## 7. 数据对象定义

### 7.1 TaskContext（任务上下文）

```ts
interface TaskContext {
  goal: string           // 任务目标
  audience: string       // 受众
  channel: string        // 渠道/平台
  constraints: string    // 交付约束（尺寸、格式等）
}
```

### 7.2 VisualStyle

```ts
interface VisualStyle {
  keywords: string[]     // 风格关键词
  referenceImages: string[] // 参考图 URL
  colorDirection: string // 主视觉方向描述
}
```

### 7.3 DesignPrinciple

```ts
interface DesignPrinciple {
  id: string
  content: string        // 原则内容
  source: 'manual' | 'extracted'
  createdAt: number
}
```

### 7.4 ContentObject（骨架层内容对象）

```ts
interface ContentObject {
  id: string
  type: 'text' | 'image' | 'chart' | 'data' | 'cta' | 'card' | 'icon' | 'logo'
  semantics: 'headline' | 'subheadline' | 'conclusion' | 'support' | 'source' | 'brand' | 'decoration'
  importance: 'highest' | 'high' | 'medium' | 'low'
  editPermission: 'free' | 'confirm' | 'locked'
  rect: { x: number; y: number; width: number; height: number }
  moduleId: string
}
```

### 7.5 Module（骨架层模块）

```ts
interface Module {
  id: string
  label: string
  order: number
  rect: { x: number; y: number; width: number; height: number }
  locked: boolean
  objects: ContentObject[]
}
```

### 7.6 MetaDesignSpace（完整元设计空间）

```ts
interface MetaDesignSpace {
  task: TaskContext
  style: VisualStyle
  principles: DesignPrinciple[]
  modules: Module[]      // 从生成结果中提取
}
```

---

## 8. API 边界

### 8.1 POST /api/generate

请求：`{ prompt: string; metaSpace: MetaDesignSpace }`
返回：`{ html: string; extractedMetaSpace: MetaDesignSpace }`

- AI 根据 prompt + metaSpace 约束生成 HTML
- 同时返回从 HTML 中提取的元设计空间初始值（首次调用时填充左侧面板）

### 8.2 POST /api/chat

请求：`{ messages: ChatMessage[]; metaSpace: MetaDesignSpace }`
返回：SSE 流式文本

- messages 包含用户消息和骨架层操作系统消息
- 返回 AI 回复，前端负责判断是否触发重新生成

---

## 9. 前端状态管理

使用 Zustand，单一 store：

```ts
interface WorkspaceStore {
  metaSpace: MetaDesignSpace
  generatedHtml: string | null
  skeletonModules: Module[]
  skeletonOpacity: number        // 0 = 视觉态, 1 = 骨架态
  selectedObjectId: string | null
  messages: ChatMessage[]
  isGenerating: boolean
  
  // actions
  updateTaskContext: (ctx: Partial<TaskContext>) => void
  updateVisualStyle: (style: Partial<VisualStyle>) => void
  addPrinciple: (content: string, source: 'manual' | 'extracted') => void
  removePrinciple: (id: string) => void
  updateModule: (id: string, patch: Partial<Module>) => void
  moveModule: (id: string, newOrder: number) => void
  updateObject: (id: string, patch: Partial<ContentObject>) => void
  appendSystemMessage: (content: string) => void
  setGeneratedHtml: (html: string) => void
  setSkeletonFromExtraction: (modules: Module[]) => void
}
```

---

## 10. 中期实现优先级

### P0（必做，答辩最低可展示）

- 三栏布局搭建
- 左侧面板：任务目标、视觉风格、设计原则三个区块
- 中间预览区：视觉态 iframe 渲染
- 右侧 Chatbot：消息历史 + 输入框 + 流式输出
- /api/generate 接口（真实 AI 调用）
- 首次生成后自动提取填充左侧面板

### P1（核心机制展示）

- 骨架层滑块切换（视觉态 ↔ 骨架态）
- 骨架层模块边界渲染与模块拖拽
- 骨架层操作转译为系统消息
- 原则提取卡（规则词触发 + 保存动画）

### P2（完整度提升）

- 内容对象点击参数面板
- 内容对象拖拽
- 锁定/解锁控制（人机分工）
- 重新生成携带完整 metaSpace 约束
- /api/chat 流式接口

### P3（后期补充）

- 流程资产与经验沉淀模块
- 多任务管理
- 规则持久化到后端

---

## 11. 不在中期范围内

- 多用户权限系统
- 完整资产库管理
- 设计原则的复杂版本历史
- 移动端适配