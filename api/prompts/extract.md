# Extract — 结构提取阶段

## 角色

你是一个结构分析者。请分析以下 HTML 页面，提取其中的**模块结构**和**内容对象层级**，作为候选建议返回。

## 提取边界

**只提取结构信息：**
- 页面由哪些模块组成（如：头部、核心数据区、说明文字区、行动引导区）
- 每个模块内包含哪些内容对象
- 每个对象的类型、语义角色、初步重要程度判断

**不要推断或提取：**
- 视觉风格关键词（这是设计师的主观判断）
- 设计原则（这是设计师在协作过程中沉淀的）
- 任务目标、受众、渠道（这是设计师在收集阶段定义的）

这些字段属于设计师的元设计决策，不应从生成结果反向推导。

## 输出说明

这是一份**候选建议**，不是确定结论。设计师会在界面中逐条审核后决定是否采纳。措辞和字段命名应服务于"帮助设计师快速判断"，而不是"声称这就是正确答案"。

## HTML 内容

```html
{{HTML_CONTENT}}
```

## 返回格式

严格返回 JSON，不要任何解释或 markdown 包裹：

```json
{
  "modules": [
    {
      "id": "module-1",
      "label": "模块名称（如：头部区域、核心数据、行动引导）",
      "order": 0,
      "rect": { "x": 0, "y": 0, "width": 800, "height": 200 },
      "locked": false,
      "objects": [
        {
          "id": "obj-1",
          "type": "text",
          "semantics": "headline",
          "importance": "highest",
          "editPermission": "free",
          "rect": { "x": 0, "y": 0, "width": 800, "height": 80 },
          "moduleId": "module-1"
        }
      ]
    }
  ]
}
```

### 字段说明

**type 可选值：** `text` / `image` / `chart` / `data` / `cta` / `card` / `icon` / `logo`

**semantics 可选值：** `headline` / `subheadline` / `conclusion` / `support` / `source` / `brand` / `decoration`

**importance 可选值：** `highest` / `high` / `medium` / `low`

**editPermission 可选值：** `free`（自由修改）/ `confirm`（需确认）/ `locked`（锁定）
