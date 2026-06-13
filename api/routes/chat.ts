import { Router, type Request, type Response } from 'express'
import { getClient, model } from '../lib/ai.js'
import { AppError } from '../lib/http.js'
import type { ChatMessage, MetaDesignSpace } from '../lib/types.js'

const router = Router()

function buildSystemPrompt(meta: MetaDesignSpace): string {
  const parts: string[] = [
    `你是一个信息设计协作助手，帮助设计师完成信息设计任务。你的职责是：
1. 理解设计师的意图并给出具体、可操作的建议
2. 根据元设计空间约束生成或修改 HTML 页面
3. 当设计师表达稳定性意图时（如"始终"、"一定要"、"不能"），你只需自然回应，系统会自动处理原则提取
4. 保持回复简洁，聚焦在设计决策上`,
  ]

  if (meta.principles.length > 0) {
    parts.push(`\n当前设计原则：`)
    meta.principles.forEach(p => parts.push(`- ${p.content}`))
  }

  if (meta.task.goal) {
    parts.push(`\n当前任务：${meta.task.goal}，受众：${meta.task.audience || '未指定'}`)
  }

  return parts.join('\n')
}

router.post('/chat', async (req: Request, res: Response): Promise<void> => {
  const { messages, metaSpace } = req.body as {
    messages: ChatMessage[]
    metaSpace: MetaDesignSpace
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new AppError('messages is required', { statusCode: 400, code: 'MISSING_MESSAGES' })
  }

  const meta: MetaDesignSpace = metaSpace || {
    task: { goal: '', audience: '', channel: '', constraints: '' },
    style: { keywords: [], referenceImages: [], colorDirection: '' },
    principles: [],
    modules: [],
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no')

  const systemPrompt = buildSystemPrompt(meta)

  const openaiMessages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role as 'user' | 'assistant' | 'system',
      content: m.content,
    })),
  ]

  try {
    const stream = await getClient().chat.completions.create({
      model,
      messages: openaiMessages,
      max_tokens: 1024,
      stream: true,
    })

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content
      if (delta) {
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`)
      }
    }

    res.write(`data: [DONE]\n\n`)
    res.end()
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: 'Stream failed' })}\n\n`)
    res.end()
  }
})

export default router