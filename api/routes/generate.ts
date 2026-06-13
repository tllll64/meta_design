import { Router, type Request, type Response } from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { getClient, model } from '../lib/ai.js'
import { AppError, success } from '../lib/http.js'
import type { MetaDesignSpace } from '../lib/types.js'

const router = Router()

function buildGeneratePrompt(prompt: string, meta: MetaDesignSpace): string {
  const parts: string[] = []
  parts.push(`你是一个专业的信息设计师。请根据以下任务需求，生成一个完整的、可直接在浏览器运行的单页 HTML 文件。`)
  parts.push(`\n## 任务描述\n${prompt}`)

  if (meta.task.goal) parts.push(`\n## 任务目标\n- 受众：${meta.task.audience || '未指定'}\n- 场景：${meta.task.goal}\n- 渠道：${meta.task.channel || '未指定'}\n- 约束：${meta.task.constraints || '无'}`)
  if (meta.style.keywords.length > 0) parts.push(`\n## 视觉风格\n- 关键词：${meta.style.keywords.join('、')}\n- 主视觉方向：${meta.style.colorDirection || '未指定'}`)
  if (meta.principles.length > 0) {
    parts.push(`\n## 设计原则（必须严格遵守）`)
    meta.principles.forEach((p, i) => parts.push(`${i + 1}. ${p.content}`))
  }
  if (meta.modules.length > 0) {
    parts.push(`\n## 结构要求`)
    meta.modules.sort((a, b) => a.order - b.order).forEach(m => {
      parts.push(`- 模块「${m.label}」${m.locked ? '（锁定，不可修改）' : ''}`)
    })
  }

  parts.push(`\n## 输出要求
- 输出完整的 HTML 文件，包含内联 CSS（使用 <style> 标签）
- 不使用外部 CSS 框架，不引用外部字体（使用系统字体栈）
- 图片使用合理的占位颜色块替代，不使用外部图片 URL
- 页面宽度适配 800px 左右的预览区域
- 代码只输出 HTML，不要任何解释或 markdown 包裹`)
  return parts.join('\n')
}

function buildExtractionPrompt(html: string): string {
  return `请分析以下 HTML 页面内容，提取元设计空间信息，以 JSON 格式返回。

HTML 内容：
\`\`\`html
${html.slice(0, 8000)}
\`\`\`

请返回如下 JSON 结构（严格 JSON，不要任何解释）：
{
  "task": {
    "goal": "从内容推断的任务目标",
    "audience": "目标受众",
    "channel": "渠道/平台",
    "constraints": "交付约束"
  },
  "style": {
    "keywords": ["风格关键词1", "风格关键词2"],
    "referenceImages": [],
    "colorDirection": "主视觉色彩方向描述"
  },
  "modules": [
    {
      "id": "module-1",
      "label": "模块名称",
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
}`
}

router.post('/generate', async (req: Request, res: Response): Promise<void> => {
  const { prompt, metaSpace } = req.body as { prompt: string; metaSpace: MetaDesignSpace }

  if (!prompt) throw new AppError('prompt is required', { statusCode: 400, code: 'MISSING_PROMPT' })

  const meta: MetaDesignSpace = metaSpace || {
    task: { goal: '', audience: '', channel: '', constraints: '' },
    style: { keywords: [], referenceImages: [], colorDirection: '' },
    principles: [],
    modules: [],
  }

  const client = getClient()

  const generateResponse = await client.messages.create({
    model,
    max_tokens: 4096,
    messages: [{ role: 'user', content: buildGeneratePrompt(prompt, meta) }],
  })

  const html = generateResponse.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map(b => b.text)
    .join('')
  const cleanHtml = html.replace(/^```html\n?/i, '').replace(/\n?```$/i, '').trim()

  let extractedMeta: Partial<MetaDesignSpace> = {}
  try {
    const extractResponse = await client.messages.create({
      model,
      max_tokens: 2048,
      messages: [{ role: 'user', content: buildExtractionPrompt(cleanHtml) }],
    })
    const extractText = extractResponse.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text)
      .join('')
    const jsonMatch = extractText.match(/\{[\s\S]*\}/)
    if (jsonMatch) extractedMeta = JSON.parse(jsonMatch[0])
  } catch { /* extraction failure is non-fatal */ }

  res.json(success({ html: cleanHtml, extractedMeta }))
})

export default router
